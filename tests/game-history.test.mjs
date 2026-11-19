import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({
    server: { middlewareMode: true, watch: null, ws: false },
    appType: 'custom',
});
after(() => server.close());
const { default: GameHistory } = await server.ssrLoadModule('/src/pages/MainPage/components/GameHistory/index.tsx');
const { getGameHistory } = await server.ssrLoadModule('/src/api/gameApi.ts');
const { mapGameHistoryEntry } = await server.ssrLoadModule('/src/utils/mapGameHistoryEntry.ts');

function render(games, props = {}) {
    return renderToStaticMarkup(createElement(MemoryRouter, null, createElement(GameHistory, { games, ...props })));
}

const game = {
    id: 'aaaaaaaaaaaaaaaaaaaaaaaa',
    white: { name: 'Hikaru', eloAtStart: 3212 },
    black: { name: 'Magnus Carlsen', eloAtStart: 3112 },
    result: 'win',
    movesCount: 64,
    finishedAt: '2026-11-14T12:00:00Z',
};

test('missing history data is distinguished from an actual empty history', () => {
    const unavailable = render();
    assert.match(unavailable, /Game history is not available yet\./);
    assert.doesNotMatch(unavailable, /Your game history is empty/);

    const empty = render([]);
    assert.match(empty, /Your game history is empty\./);
    assert.doesNotMatch(empty, /Game history is not available/);
    assert.doesNotMatch(empty, /href="\/game\//);
});

test('history displays game-start ratings, date and a native link to the game', () => {
    const html = render([game]);
    assert.match(html, /\(3212\)/);
    assert.match(html, /\(3112\)/);
    assert.match(html, /14\.11\.2026/);
    assert.match(html, /datetime="2026-11-14T12:00:00Z"/i);
    assert.match(html, /href="\/game\/aaaaaaaaaaaaaaaaaaaaaaaa"/);
    assert.match(html, /aria-label="Win"/);
    assert.match(html, />64<\/td>/);
    assert.doesNotMatch(html, /Your game history is empty|Game history is not available/);
});

test('all result types have accessible labels and missing ratings do not turn into zero', () => {
    const html = render([
        game,
        { ...game, id: 'bbbbbbbbbbbbbbbbbbbbbbbb', result: 'loss', white: { name: 'Unrated player', eloAtStart: null } },
        { ...game, id: 'cccccccccccccccccccccccc', result: 'draw', black: { name: 'New player', eloAtStart: 0 }, movesCount: 0 },
    ]);
    for (const label of ['Win', 'Loss', 'Draw']) assert.match(html, new RegExp(`aria-label="${label}"`));
    assert.match(html, /\(—\)/);
    assert.equal((html.match(/\(0\)/g) ?? []).length, 1);
    assert.match(html, />0<\/td>/);
    assert.equal((html.match(/href="\/game\//g) ?? []).length, 3);
});

test('an invalid game date is displayed as unavailable', () => {
    const html = render([{ ...game, finishedAt: 'not-a-date' }]);
    assert.match(html, /<time>—<\/time>/);
    assert.doesNotMatch(html, /Invalid Date|datetime="not-a-date"/);
});

const apiGame = {
    ...game,
    white: { name: 'Alice', avatarURL: '/uploads/alice.png', elo: 1200 },
    black: { name: 'Bob', avatarURL: null, elo: 1300 },
};
const apiResponse = {
    games: [apiGame],
    pagination: { page: 1, limit: 20, total: 45, totalPages: 3, hasMore: true },
};

test('history API sends the bearer token, pagination and cancellation signal without a user ID', async t => {
    const controller = new AbortController();
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json(apiResponse));
    assert.deepEqual(await getGameHistory('history-token', undefined, undefined, controller.signal), apiResponse);
    const [url, options] = fetch.mock.calls[0].arguments;
    assert.equal(new URL(url).pathname, '/game/history');
    assert.equal(new URL(url).search, '?page=1&limit=20');
    assert.equal(options.headers.Authorization, 'Bearer history-token');
    assert.equal(options.signal, controller.signal);

    await getGameHistory('history-token', 2, 100);
    assert.equal(new URL(fetch.mock.calls[1].arguments[0]).search, '?page=2&limit=100');
});

for (const status of [401, 403, 500]) {
    test(`history API error ${status} is not reported as an empty history`, async t => {
        t.mock.method(globalThis, 'fetch', async () => new Response('Server unavailable', { status }));
        await assert.rejects(getGameHistory('history-token'), /Could not load game history/);
    });
}

test('history API preserves cancellation errors', async t => {
    const error = new DOMException('Request cancelled', 'AbortError');
    t.mock.method(globalThis, 'fetch', async () => { throw error; });
    await assert.rejects(getGameHistory('history-token'), exception => exception === error);
});

test('history maps the backend rating snapshot without changing moves, results or dates', () => {
    const entry = mapGameHistoryEntry(apiGame);
    assert.equal(entry.white.eloAtStart, 1200);
    assert.equal(entry.black.eloAtStart, 1300);
    assert.equal(entry.white.avatarURL, '/uploads/alice.png');
    assert.equal(entry.black.avatarURL, undefined);
    assert.equal(entry.result, apiGame.result);
    assert.equal(entry.movesCount, apiGame.movesCount);
    assert.equal(entry.finishedAt, apiGame.finishedAt);
});

test('null historical fields have display fallbacks and a zero rating stays zero', () => {
    const entry = mapGameHistoryEntry({
        ...apiGame,
        white: { name: null, avatarURL: null, elo: null },
        black: { name: 'Bot', avatarURL: null, elo: 0 },
    });
    assert.deepEqual(entry.white, { name: 'Unknown player', avatarURL: undefined, eloAtStart: null });
    assert.equal(entry.black.eloAtStart, 0);
    const html = render([entry]);
    assert.match(html, /Unknown player/);
    assert.match(html, /\(—\)/);
    assert.match(html, /\(0\)/);
});

test('initial loading and failure have separate states with no empty-history message', () => {
    const loading = render(undefined, { isLoading: true });
    assert.match(loading, /Loading game history…/);
    assert.doesNotMatch(loading, /Your game history is empty|not available yet/);

    const failed = render(undefined, { error: 'Could not load game history.', onRetry() {} });
    assert.match(failed, /role="alert"/);
    assert.match(failed, /Try again/);
    assert.doesNotMatch(failed, /Your game history is empty|not available yet/);
});

test('pagination preserves rows while loading and while retrying a failed next page', () => {
    const loading = render([game], { isLoading: true, hasMore: true, onLoadMore() {} });
    assert.match(loading, /href="\/game\/aaaaaaaaaaaaaaaaaaaaaaaa"/);
    assert.match(loading, /Loading more games…/);
    assert.match(loading, /<button[^>]*disabled/);

    const failed = render([game], { error: 'Could not load game history.', hasMore: true, onRetry() {} });
    assert.match(failed, /href="\/game\/aaaaaaaaaaaaaaaaaaaaaaaa"/);
    assert.match(failed, /Try again/);
    assert.doesNotMatch(failed, /Your game history is empty/);

    assert.doesNotMatch(render([game], { hasMore: false, onLoadMore() {} }), /Load more/);
});
