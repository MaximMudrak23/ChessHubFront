import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const storage = new Map();
const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
        getItem: key => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, String(value)),
        removeItem: key => storage.delete(key),
    },
});

const server = await createServer({
    server: { middlewareMode: true, watch: null, ws: false },
    appType: 'custom',
});
const { socket } = await server.ssrLoadModule('/src/socket/socket.ts');
const { useUserStore } = await server.ssrLoadModule('/src/store/userStore.ts');
const { getAppearance } = await server.ssrLoadModule('/src/utils/getAppearance.ts');
const { saveAppearance } = await server.ssrLoadModule('/src/pages/OptionsPage/utils/saveAppearance.ts');
const { me } = await server.ssrLoadModule('/src/api/authApi.ts');
const { default: AppearanceOptions } = await server.ssrLoadModule('/src/pages/OptionsPage/components/BoardAndFiguresOption/index.tsx');
const { default: ChessPieces } = await server.ssrLoadModule('/src/pages/GamePage/components/ChessBoard/components/ChessPieces/index.tsx');
const { default: PromotionPicker } = await server.ssrLoadModule('/src/pages/GamePage/components/ChessBoard/components/PromotionPicker/index.tsx');
const { default: BoardGrid } = await server.ssrLoadModule('/src/pages/GamePage/components/ChessBoard/components/BoardGrid/index.tsx');

after(async () => {
    socket.disconnect();
    await server.close();
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
});

const savedUser = {
    id: 'appearance-user',
    name: 'Player',
    boardTheme: 'water',
    pieceSet: 'set2',
    menuBackground: 'dark-mac',
};
const selection = { boardTheme: 'water', pieceSet: 'set1', menuBackground: 'city' };

function setup(t) {
    t.mock.method(socket, 'connect', () => socket);
    t.mock.method(socket, 'disconnect', () => socket);
    useUserStore.getState().setAuth({ ...savedUser }, 'appearance-token');
    t.after(() => useUserStore.getState().logout());
}

function deferred() {
    let resolve;
    const promise = new Promise(done => { resolve = done; });
    return { promise, resolve };
}

function renderWithCurrentUser(component, props) {
    // Zustand uses its initial snapshot during server rendering.
    const initial = useUserStore.getInitialState();
    const previous = { ...initial };
    Object.assign(initial, useUserStore.getState());
    try {
        return renderToStaticMarkup(createElement(component, props));
    } finally {
        Object.assign(initial, previous);
    }
}

test('Save sends all three IDs with authorization and applies the returned user', async t => {
    setup(t);
    const updated = { ...savedUser, ...selection };
    useUserStore.getState().setBackgroundOverride('city');
    const fetch = t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Appearance updated', user: updated }));

    assert.equal(await saveAppearance(selection), true);

    assert.equal(fetch.mock.callCount(), 1);
    const [url, request] = fetch.mock.calls[0].arguments;
    assert.equal(new URL(url).pathname, '/users/appearance');
    assert.equal(request.method, 'PATCH');
    assert.equal(request.headers.Authorization, 'Bearer appearance-token');
    assert.equal(request.headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(request.body), selection);
    assert.deepEqual(useUserStore.getState().user, updated);
    assert.equal(useUserStore.getState().backgroundOverride, null);
    assert.equal(useUserStore.getState().token, 'appearance-token');
});

test('GET /auth/me restores saved appearance after loading the account again', async t => {
    setup(t);
    t.mock.method(globalThis, 'fetch', async () => Response.json({ user: savedUser }));
    const response = await me('appearance-token');
    useUserStore.getState().setAuth(response.user, 'appearance-token');

    assert.deepEqual(getAppearance(useUserStore.getState().user), {
        boardTheme: 'water', pieceSet: 'set2', menuBackground: 'dark-mac',
    });
});

for (const status of [400, 401, 404, 500]) {
    test(`Save error ${status} preserves saved settings and restores the background`, async t => {
        setup(t);
        const previous = useUserStore.getState().user;
        useUserStore.getState().setBackgroundOverride('city');
        t.mock.method(globalThis, 'fetch', async () => Response.json({ message: `Appearance error ${status}` }, { status }));

        await assert.rejects(saveAppearance(selection), new RegExp(`Appearance error ${status}`));
        assert.equal(useUserStore.getState().user, previous);
        assert.equal(useUserStore.getState().backgroundOverride, null);
        assert.equal(getAppearance(useUserStore.getState().user).menuBackground, 'dark-mac');
    });
}

test('network failures restore the saved appearance without overwriting the user', async t => {
    setup(t);
    const previous = useUserStore.getState().user;
    useUserStore.getState().setBackgroundOverride('city');
    t.mock.method(globalThis, 'fetch', async () => { throw new Error('Network unavailable'); });

    await assert.rejects(saveAppearance(selection), /Network unavailable/);
    assert.equal(useUserStore.getState().user, previous);
    assert.equal(useUserStore.getState().backgroundOverride, null);
});

test('a non-JSON server error produces a readable message', async t => {
    setup(t);
    t.mock.method(globalThis, 'fetch', async () => new Response('Not found', { status: 404 }));
    await assert.rejects(saveAppearance(selection), /Unable to save appearance/);
});

test('a response from a previous account cannot replace the current user', async t => {
    setup(t);
    const pending = deferred();
    t.mock.method(globalThis, 'fetch', () => pending.promise);
    const saving = saveAppearance(selection);

    const otherUser = { ...savedUser, id: 'another-user', menuBackground: 'wood' };
    useUserStore.getState().setAuth(otherUser, 'another-token');
    useUserStore.getState().setBackgroundOverride('city');
    pending.resolve(Response.json({ user: { ...savedUser, ...selection } }));

    assert.equal(await saving, false);
    assert.equal(useUserStore.getState().user, otherUser);
    assert.equal(useUserStore.getState().backgroundOverride, 'city');
});

test('an error from a previous session cannot reset a new background selection', async t => {
    setup(t);
    const pending = deferred();
    t.mock.method(globalThis, 'fetch', () => pending.promise);
    const saving = saveAppearance(selection);

    useUserStore.getState().logout();
    useUserStore.getState().setAuth({ ...savedUser }, 'appearance-token');
    useUserStore.getState().setBackgroundOverride('wood');
    pending.resolve(Response.json({ message: 'Server error' }, { status: 500 }));

    assert.equal(await saving, false);
    assert.equal(useUserStore.getState().backgroundOverride, 'wood');
});

test('saving without authentication does not send a request', async t => {
    setup(t);
    useUserStore.getState().logout();
    const fetch = t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected request'); });

    await assert.rejects(saveAppearance(selection), /Please sign in/);
    assert.equal(fetch.mock.callCount(), 0);
});

test('unknown IDs use standard resources without changing the saved IDs', t => {
    setup(t);
    for (const id of ['future-theme', '__proto__', 'constructor']) {
        const user = { ...savedUser, boardTheme: id, pieceSet: id, menuBackground: id };
        useUserStore.getState().setUser(user);
        assert.deepEqual(getAppearance(user), { boardTheme: 'water', pieceSet: 'default', menuBackground: 'default' });
        assert.equal(useUserStore.getState().user.pieceSet, id);
    }
    assert.deepEqual(getAppearance(null), { boardTheme: 'water', pieceSet: 'default', menuBackground: 'default' });
    assert.equal(getAppearance({ menuBackground: 'dark-mac.jpg' }).menuBackground, 'dark-mac');
});

test('settings preview opens with the saved pieces and a disabled Save button', t => {
    setup(t);
    const html = renderWithCurrentUser(AppearanceOptions);
    assert.match(html, /\/chess-pieces\/set-2\/wn\.png/);
    assert.doesNotMatch(html, /\/chess-pieces\/default\//);
    const saveButton = html.match(/<button\b[^>]*><span>Save<\/span><\/button>/)?.[0];
    assert.ok(saveButton);
    assert.match(saveButton, /disabled/);
});

test('Save enables for a changed background and disables when the saved value is selected again', t => {
    setup(t);
    for (const [background, disabled] of [['city', false], ['dark-mac', true], [null, true]]) {
        useUserStore.getState().setBackgroundOverride(background);
        const html = renderWithCurrentUser(AppearanceOptions);
        const saveButton = html.match(/<button\b[^>]*><span>Save<\/span><\/button>/)?.[0];
        assert.ok(saveButton);
        assert.equal(/disabled/.test(saveButton), disabled);
    }
});

test('game pieces and promotion choices use the saved set with fallback for unknown IDs', t => {
    setup(t);
    for (const [id, folder] of [['set1', 'set-1'], ['set2', 'set-2'], ['missing', 'default']]) {
        useUserStore.getState().setUser({ ...savedUser, pieceSet: id });
        const pieces = renderWithCurrentUser(ChessPieces, {
            pieces: [{ id: 'knight', piece: 'wn', square: 'b1' }],
            perspective: 'white', selectedPieceID: null, selectPiece() {}, onSquareClick() {},
            isCheck: false, currentTurn: 'white', movePiece: () => false,
            hoveredSquareRef: { current: null }, currentUserSide: 'white',
        });
        assert.ok(pieces.includes(`/chess-pieces/${folder}/wn.png`));

        const promotion = renderWithCurrentUser(PromotionPicker, {
            side: 'white', perspective: 'white', square: 'a8', pieces: ['q', 'r', 'b', 'n'], onSelect() {}, onClose() {},
        });
        for (const code of ['wq', 'wr', 'wb', 'wn']) assert.ok(promotion.includes(`/chess-pieces/${folder}/${code}.png`));
    }
});

test('an unknown saved board uses the standard board in the game', t => {
    setup(t);
    useUserStore.getState().setUser({ ...savedUser, boardTheme: 'future-board' });
    const html = renderWithCurrentUser(BoardGrid, {
        perspective: 'white', selectedPieceID: null, availableMoves: [], lastMove: null,
        markedSquares: [], pieces: [], onSquareClick() {}, hoveredSquare: null,
    });
    assert.match(html, /\/boards\/water\/white-cell\.png/);
    assert.match(html, /\/boards\/water\/black-cell\.png/);
    assert.equal((html.match(/data-square=/g) ?? []).length, 64);
});
