import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, watch: null, ws: false }, appType: 'custom' });
const { parsePosition, INITIAL_POSITION, getNavigationPositions, describePositionTransition, getNavigationPly, getLastNavigationPly, getPositionAtPly } = await server.ssrLoadModule('/src/pages/GamePage/utils/moveNavigation.ts');
const { applyAnalysisMove } = await server.ssrLoadModule('/src/pages/GamePage/utils/analysisVariation.ts');
const { getGameSound } = await server.ssrLoadModule('/src/pages/GamePage/hooks/useGameSounds.ts');
const { useGameStore } = await server.ssrLoadModule('/src/store/gameStore.ts');
const { useUserStore } = await server.ssrLoadModule('/src/store/userStore.ts');
const { socket } = await server.ssrLoadModule('/src/socket/socket.ts');
const { submitGameMove } = await server.ssrLoadModule('/src/pages/GamePage/utils/submitGameMove.ts');
const { mapServerGameToClientGame } = await server.ssrLoadModule('/src/utils/mapServerGameToClientGame.ts');
const { makeMove, GameMoveError } = await server.ssrLoadModule('/src/api/gameApi.ts');
after(async () => { socket.disconnect(); await server.close(); });
const id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const ownId = '111111111111111111111111';
const initial = parsePosition(INITIAL_POSITION).pieces;
const e4 = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3';
const e5 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6';
const nf3 = 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -';
function game(plies = 2, extra = {}) {
    return {
        _id: id, status: 'active',
        white: { playerType: 'human', playerId: ownId, name: 'White', elo: 1200 },
        black: { playerType: 'bot', playerId: '222222222222222222222222', name: 'Black', elo: 1200 },
        currentTurn: plies % 2 ? 'black' : 'white',
        moves: plies === 0 ? [] : plies === 1 ? [{ whiteMove: 'e4' }] : plies === 2 ? [{ whiteMove: 'e4', blackMove: 'e5' }] : [{ whiteMove: 'e4', blackMove: 'e5' }, { whiteMove: 'Nf3' }],
        positionHistory: [e4, e5, nf3].slice(0, plies),
        pieces: (plies ? parsePosition([e4, e5, nf3][plies - 1]).pieces : initial).map(p => ({ ...p, id: `server-${p.square}` })),
        ...extra,
    };
}
const load = value => useGameStore.getState().setGame(mapServerGameToClientGame(value));
function setup(t, plies = 2) {
    t.mock.method(socket, 'connect', () => socket);
    t.mock.method(socket, 'disconnect', () => socket);
    useUserStore.getState().setAuth({ id: ownId }, 'test-jwt');
    useGameStore.getState().clearGame();
    load(game(plies));
}
const deferred = () => { let resolve; const promise = new Promise(done => { resolve = done; }); return { resolve, promise }; };

test('white and black half-moves, boundaries, initial board and immutable live IDs', t => {
    setup(t);
    const live = useGameStore.getState().pieces;
    useGameStore.getState().selectPly(1);
    let state = useGameStore.getState();
    assert.equal(state.navigationPositions[1].pieces.find(p => p.square === 'e4').piece, 'wp');
    assert.equal(state.navigationPositions[1].pieces.some(p => p.square === 'e5'), false);
    assert.equal(state.pieces, live);
    state.selectPly(-50);
    state = useGameStore.getState();
    assert.equal(state.selectedPly, 0);
    assert.equal(state.navigationPositions[0].pieces.length, 32);
    assert.equal(state.navigationPositions[0].pieces.find(p => p.square === 'e2').piece, 'wp');
    state.selectPly(100);
    assert.equal(useGameStore.getState().selectedPly, null);
    assert.equal(useGameStore.getState().pieces, live);
    assert.ok(live.every(p => p.id.startsWith('server-')));
});

test('live updates follow latest or preserve a pinned half-move through completion and reset for another game', t => {
    setup(t, 1);
    load(game(2));
    assert.equal(useGameStore.getState().selectedPly, null);
    assert.equal(useGameStore.getState().latestPly, 2);
    useGameStore.getState().selectPly(1);
    load(game(3));
    assert.equal(useGameStore.getState().selectedPly, 1);
    load(game(3, { status: 'finished', finishedReason: 'resignation', winner: 'white' }));
    assert.equal(useGameStore.getState().selectedPly, 1);
    assert.equal(useGameStore.getState().isActive, false);
    useGameStore.getState().selectPly(3);
    assert.equal(useGameStore.getState().selectedPly, null);
    useGameStore.getState().selectPly(0);
    load(game(0, { _id: 'bbbbbbbbbbbbbbbbbbbbbbbb' }));
    assert.equal(useGameStore.getState().selectedPly, null);
});

test('absent, sparse, partial and malformed history fall back to live pieces; zero moves is valid', t => {
    setup(t);
    for (const history of [undefined, null, 'invalid', [], [e4], [e4, 'bad'], [e4, e4], Array(2)]) {
        load(game(2, { positionHistory: history }));
        const state = useGameStore.getState();
        assert.equal(state.navigationPositions, null);
        state.selectPly(0);
        assert.equal(useGameStore.getState().selectedPly, null);
        assert.equal(state.pieces.find(p => p.square === 'e5').piece, 'bp');
    }
    assert.equal(getNavigationPositions([], []).length, 1);
    assert.equal(getNavigationPositions([{ whiteMove: 'e4' }, { whiteMove: 'Nf3' }], [e4, nf3]), null);
    assert.equal(parsePosition('9/8/8/8/8/8/8/8 w - -'), null);
    assert.equal(parsePosition('8/8/8/8/8/8/8/8 x - -'), null);
});

test('FEN displays captures, castling, en passant and all promotions without parsing move labels', () => {
    for (const piece of ['q', 'r', 'b', 'n']) {
        const position = parsePosition(`Q3k3/8/8/3P4/8/8/8/4K3 b - -`.replace('Q', piece.toUpperCase()));
        assert.equal(position.pieces.find(p => p.square === 'a8').piece, `w${piece}`);
    }
    const castle = parsePosition('r4rk1/8/8/8/8/8/8/2KR4 w - -');
    assert.equal(castle.pieces.find(p => p.square === 'c1').piece, 'wk');
    assert.equal(castle.pieces.find(p => p.square === 'd1').piece, 'wr');
    const ep = parsePosition('4k3/8/3P4/8/8/8/8/4K3 b - -');
    assert.equal(ep.pieces.length, 3);
    assert.equal(ep.pieces.find(p => p.square === 'd6').piece, 'wp');
});

test('historical positions, spectators, wrong turn, finished games and synthetic IDs never send moves', async t => {
    setup(t);
    const request = t.mock.method(globalThis, 'fetch', async () => { throw new Error('Unexpected request'); });
    useGameStore.getState().selectPly(1);
    await submitGameMove(id, 'server-g1', 'f3');
    useGameStore.getState().selectPly(2);
    await submitGameMove(id, 'history-g1', 'f3');
    load(game(1));
    await submitGameMove(id, 'server-g1', 'f3');
    load(game(2, { status: 'finished' }));
    await submitGameMove(id, 'server-g1', 'f3');
    load(game(2, { white: { playerType: 'human', playerId: 'someone-else' } }));
    await submitGameMove(id, 'server-g1', 'f3');
    assert.equal(request.mock.callCount(), 0);
});

test('move response updates authoritative board with real IDs; pending request blocks duplicates and keeps a historical cursor', async t => {
    setup(t);
    const pending = deferred();
    const request = t.mock.method(globalThis, 'fetch', (url, options) => {
        assert.equal(new URL(url).pathname, '/game/move');
        assert.equal(options.headers.Authorization, 'Bearer test-jwt');
        assert.deepEqual(JSON.parse(options.body), { gameId: id, pieceID: 'server-g1', targetSquare: 'f3' });
        return pending.promise;
    });
    const move = submitGameMove(id, 'server-g1', 'f3');
    await submitGameMove(id, 'server-g1', 'f3');
    assert.equal(request.mock.callCount(), 1);
    useGameStore.getState().selectPly(1);
    pending.resolve(Response.json({ game: game(3), gameStatus: 'playing' }));
    await move;
    assert.equal(useGameStore.getState().selectedPly, 1);
    assert.equal(useGameStore.getState().latestPly, 3);
    assert.equal(useGameStore.getState().pieces.find(p => p.square === 'f3').id, 'server-f3');
    assert.equal(useGameStore.getState().isMovePending, false);
});

test('late HTTP response cannot roll back a newer socket update', async t => {
    setup(t);
    const pending = deferred();
    t.mock.method(globalThis, 'fetch', () => pending.promise);
    const move = submitGameMove(id, 'server-g1', 'f3');
    load(game(3, { status: 'finished', finishedReason: 'resignation' }));
    pending.resolve(Response.json({ game: game(3), gameStatus: 'playing' }));
    await move;
    assert.equal(useGameStore.getState().isActive, false);
});

test('409 reloads public by-id, preserves historical cursor and shows backend message', async t => {
    setup(t);
    const calls = [];
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        calls.push(new URL(url).pathname);
        if (options?.method === 'POST') {
            useGameStore.getState().selectPly(1);
            return Response.json({ message: 'Game state changed, reload the game' }, { status: 409 });
        }
        assert.equal(options, undefined);
        return Response.json({ game: game(3) });
    });
    await submitGameMove(id, 'server-g1', 'f3');
    assert.deepEqual(calls, ['/game/move', `/game/by-id/${id}`]);
    assert.equal(useGameStore.getState().selectedPly, 1);
    assert.equal(useGameStore.getState().latestPly, 3);
    assert.match(useGameStore.getState().moveError, /Game state changed/);
});

for (const status of [400, 401, 403, 404, 409, 500]) {
    test(`move error ${status} preserves HTTP status and backend message`, async t => {
        t.mock.method(globalThis, 'fetch', async () => Response.json({ message: `Backend error ${status}` }, { status }));
        await assert.rejects(makeMove('jwt', { gameId: id, pieceID: 'id', targetSquare: 'f3' }), error =>
            error instanceof GameMoveError && error.status === status && error.message === `Backend error ${status}`);
    });
}

test('an older request cannot unlock or overwrite a new submission after leaving and returning to a game', async t => {
    setup(t);
    const responses = [deferred(), deferred()];
    let index = 0;
    t.mock.method(globalThis, 'fetch', () => responses[index++].promise);
    const first = submitGameMove(id, 'server-g1', 'f3');
    load(game(2, { _id: 'bbbbbbbbbbbbbbbbbbbbbbbb' }));
    load(game(2));
    const second = submitGameMove(id, 'server-g1', 'f3');
    responses[0].resolve(Response.json({ game: game(3), gameStatus: 'playing' }));
    await first;
    assert.equal(useGameStore.getState().isMovePending, true);
    assert.equal(useGameStore.getState().latestPly, 2);
    responses[1].resolve(Response.json({ game: game(3), gameStatus: 'playing' }));
    await second;
    assert.equal(useGameStore.getState().isMovePending, false);
    assert.equal(useGameStore.getState().latestPly, 3);
});

test('a socket update received during 409 recovery wins over its older reload snapshot', async t => {
    setup(t);
    const snapshot = deferred();
    const started = deferred();
    t.mock.method(globalThis, 'fetch', (_url, options) => {
        if (options?.method === 'POST') return Promise.resolve(Response.json({ message: 'Conflict' }, { status: 409 }));
        started.resolve();
        return snapshot.promise;
    });
    const move = submitGameMove(id, 'server-g1', 'f3');
    await started.promise;
    load(game(3, { status: 'finished', finishedReason: 'resignation' }));
    snapshot.resolve(Response.json({ game: game(2) }));
    await move;
    assert.equal(useGameStore.getState().latestPly, 3);
    assert.equal(useGameStore.getState().isActive, false);
});

const transition = (before, after) => describePositionTransition(parsePosition(before), parsePosition(after));

test('history highlights the move belonging to each displayed ply and keeps moving-piece identity', () => {
    const positions = getNavigationPositions([{ whiteMove: 'e4', blackMove: 'e5' }, { whiteMove: 'Nf3' }], [e4, e5, nf3]);
    assert.equal(positions[0].lastMove, null);
    assert.deepEqual(positions[1].lastMove, { piece: 'wp', from: 'e2', to: 'e4' });
    assert.deepEqual(positions[2].lastMove, { piece: 'bp', from: 'e7', to: 'e5' });
    assert.deepEqual(positions[3].lastMove, { piece: 'wn', from: 'g1', to: 'f3' });
    assert.equal(positions[0].pieces.find(p => p.square === 'e2').id, positions[3].pieces.find(p => p.square === 'e4').id);
    assert.equal(positions[0].pieces.find(p => p.square === 'g1').id, positions[3].pieces.find(p => p.square === 'f3').id);
});

test('both castling directions of both colors highlight the king and animate both pieces', () => {
    const cases = [
        ['4k3/8/8/8/8/8/8/R3K2R w KQ -', '4k3/8/8/8/8/8/8/R4RK1 b - -', 'e1', 'g1', 'h1', 'f1'],
        ['4k3/8/8/8/8/8/8/R3K2R w KQ -', '4k3/8/8/8/8/8/8/2KR3R b - -', 'e1', 'c1', 'a1', 'd1'],
        ['r3k2r/8/8/8/8/8/8/4K3 b kq -', 'r4rk1/8/8/8/8/8/8/4K3 w - -', 'e8', 'g8', 'h8', 'f8'],
        ['r3k2r/8/8/8/8/8/8/4K3 b kq -', '2kr3r/8/8/8/8/8/8/4K3 w - -', 'e8', 'c8', 'a8', 'd8'],
    ];
    for (const [before, after, from, to, rookFrom, rookTo] of cases) {
        const position = transition(before, after);
        assert.equal(position.sound, 'castle');
        assert.equal(position.lastMove.from, from);
        assert.equal(position.lastMove.to, to);
        assert.equal(position.pieces.find(p => p.square === to).id, `history-${from}`);
        assert.equal(position.pieces.find(p => p.square === rookTo).id, `history-${rookFrom}`);
    }
});

test('capture, en passant and promotion produce presentation metadata without changing server IDs', () => {
    const captured = transition('4k3/8/8/3p4/2B5/8/8/4K3 w - -', '4k3/8/8/3B4/8/8/8/4K3 b - -');
    assert.equal(captured.sound, 'capture');
    assert.deepEqual(captured.lastMove, { piece: 'wb', from: 'c4', to: 'd5' });
    const ep = transition('4k3/8/8/3pP3/8/8/8/4K3 w - d6', '4k3/8/3P4/8/8/8/8/4K3 b - -');
    assert.equal(ep.sound, 'capture');
    assert.deepEqual(ep.lastMove, { piece: 'wp', from: 'e5', to: 'd6' });
    for (const piece of ['Q', 'R', 'B', 'N']) {
        const promotion = transition('8/P7/7k/8/8/8/8/4K3 w - -', `${piece}7/8/7k/8/8/8/8/4K3 b - -`);
        assert.equal(promotion.sound, 'promote');
        assert.deepEqual(promotion.lastMove, { piece: 'wp', from: 'a7', to: 'a8' });
        assert.equal(promotion.pieces.find(p => p.square === 'a8').id, 'history-a7');
    }
    const checked = transition('8/8/8/8/7k/8/8/4K1N1 w - -', '8/8/8/8/7k/5N2/8/4K3 b - -');
    assert.equal(checked.sound, 'move-check');
});

test('sounds follow displayed transitions, suppress initial loads and background updates, and play completion once', t => {
    setup(t, 1);
    const first = useGameStore.getState();
    load(game(2));
    const live = useGameStore.getState();
    assert.equal(getGameSound(live, first, id), 'move-self');
    assert.equal(getGameSound(live, live, id), null);
    assert.equal(getGameSound(live, { ...live, gameId: null }, id), null);
    useGameStore.getState().selectPly(1);
    const past = useGameStore.getState();
    assert.equal(getGameSound(past, live, id), 'move-self');
    load(game(3));
    const updated = useGameStore.getState();
    assert.equal(getGameSound(updated, past, id), null);
    load(game(3, { status: 'finished', finishedReason: 'resignation' }));
    const finishedInPast = useGameStore.getState();
    assert.equal(getGameSound(finishedInPast, updated, id), null);
    const finished = { ...live, isActive: false, gameStatus: 'resignation' };
    assert.equal(getGameSound(finished, live, id), 'game-end');
    assert.equal(getGameSound(finished, finished, id), null);
    assert.equal(getGameSound(finished, { ...live, gameId: null }, id), null);
});

test('rewinding a checkmate and jumping to its final position never replays the game-end sound', t => {
    setup(t, 0);
    const history = [
        'rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq -',
        'rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq e6',
        'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3',
        'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq -',
    ];
    const active = useGameStore.getState();
    load(game(0, {
        status: 'finished', finishedReason: 'checkmate', winner: 'black', currentTurn: 'white',
        moves: [{ whiteMove: 'f3', blackMove: 'e5' }, { whiteMove: 'g4', blackMove: 'Qh4#' }],
        positionHistory: history,
        pieces: parsePosition(history[3]).pieces,
        moveMeta: { isCheckmate: true, isCheck: true },
    }));
    const finished = useGameStore.getState();
    assert.equal(getGameSound(finished, active, id), 'game-end', 'live completion keeps its sound');
    assert.equal(finished.navigationPositions[4].sound, 'move-check');
    finished.selectPly(0);
    const start = useGameStore.getState();
    assert.equal(getGameSound(start, finished, id), 'move-check', 'ArrowDown undoes a checking move');
    start.selectPly(4);
    const last = useGameStore.getState();
    assert.equal(getGameSound(last, start, id), 'move-check', 'ArrowUp displays a checking move');
    last.selectPly(3);
    const previous = useGameStore.getState();
    assert.equal(getGameSound(previous, last, id), 'move-check');
    previous.selectPly(4);
    assert.equal(getGameSound(useGameStore.getState(), previous, id), 'move-check');
    assert.equal(getGameSound(last, last, id), null, 'pressing ArrowUp at the final position is silent');
    assert.equal(getGameSound({ ...last, navigationPositions: null }, { ...start, navigationPositions: null }, id), 'move-check', 'fallback metadata never emits game-end during navigation');
});

const viewed = () => { const state = useGameStore.getState(); return getPositionAtPly(state, getNavigationPly(state)); };
const localMove = (from, to, promotion) => {
    const piece = viewed().pieces.find(p => p.square === from);
    assert.ok(piece, `Expected a piece on ${from}`);
    return useGameStore.getState().moveInVariation(piece.id, to, promotion);
};

test('local variation alternates both sides, pins its root and never changes or submits the recorded game', async t => {
    setup(t);
    const request = t.mock.method(globalThis, 'fetch', () => { throw new Error('Unexpected analysis request'); });
    const canonical = useGameStore.getState();
    canonical.selectPly(1);
    assert.equal(localMove('c7', 'c5'), true);
    assert.equal(viewed().currentTurn, 'white');
    assert.equal(localMove('g1', 'f3'), true);
    assert.equal(viewed().currentTurn, 'black');
    const state = useGameStore.getState();
    assert.equal(state.selectedPly, 1);
    assert.equal(state.variation.rootPly, 1);
    assert.equal(getNavigationPly(state), 3);
    assert.equal(getLastNavigationPly(state), 3);
    for (const field of ['pieces', 'moves', 'lastMove', 'currentTurn', 'positionHistory', 'revision']) {
        assert.equal(state[field], canonical[field], `${field} remains authoritative`);
    }
    await submitGameMove(id, 'server-g1', 'f3');
    assert.equal(request.mock.callCount(), 0);
});

test('variation navigation follows the recorded prefix and local suffix while its sidebar root remains pinned', t => {
    setup(t);
    useGameStore.getState().selectPly(1);
    localMove('c7', 'c5');
    localMove('g1', 'f3');
    const navigate = command => useGameStore.getState().navigatePosition(command);
    navigate('previous');
    assert.equal(getNavigationPly(useGameStore.getState()), 2);
    assert.equal(viewed().pieces.some(p => p.square === 'c5'), true);
    assert.equal(viewed().pieces.some(p => p.square === 'f3'), false);
    navigate('previous');
    assert.equal(getNavigationPly(useGameStore.getState()), 1);
    navigate('previous');
    assert.equal(getNavigationPly(useGameStore.getState()), 0);
    assert.equal(viewed().pieces.some(p => p.square === 'e2'), true);
    assert.equal(useGameStore.getState().selectedPly, 1);
    navigate('previous');
    assert.equal(getNavigationPly(useGameStore.getState()), 0);
    navigate('end');
    assert.equal(getNavigationPly(useGameStore.getState()), 3);
    assert.equal(viewed().pieces.some(p => p.square === 'f3'), true);
    navigate('start');
    navigate('next');
    assert.equal(getNavigationPly(useGameStore.getState()), 1);
    assert.equal(useGameStore.getState().selectedPly, 1);
});

test('clicking the same highlighted move discards the variation and immediately restores its recorded position', t => {
    setup(t);
    useGameStore.getState().selectPly(1);
    localMove('c7', 'c5');
    const revision = useGameStore.getState().viewRevision;
    useGameStore.getState().selectPly(1);
    assert.equal(useGameStore.getState().variation, null);
    assert.equal(useGameStore.getState().selectedPly, 1);
    assert.ok(useGameStore.getState().viewRevision > revision);
    assert.equal(viewed().pieces.some(p => p.square === 'c7'), true);
    assert.equal(viewed().pieces.some(p => p.square === 'c5'), false);
});

test('a new move after rewinding replaces the local continuation; a move in the prefix creates a new root', t => {
    setup(t);
    useGameStore.getState().selectPly(1);
    localMove('c7', 'c5');
    localMove('g1', 'f3');
    useGameStore.getState().navigatePosition('previous');
    assert.equal(localMove('d2', 'd4'), true);
    assert.equal(viewed().pieces.some(p => p.square === 'f3'), false);
    assert.equal(viewed().pieces.some(p => p.square === 'd4'), true);
    assert.equal(useGameStore.getState().variation.rootPly, 1);
    useGameStore.getState().navigatePosition('start');
    assert.equal(localMove('d2', 'd4'), true);
    assert.equal(useGameStore.getState().variation.rootPly, 0);
    assert.equal(getLastNavigationPly(useGameStore.getState()), 1);
});

test('analysis on a finished latest position accepts real server IDs and stays separate through snapshots', t => {
    setup(t);
    load(game(2, { status: 'finished', finishedReason: 'resignation' }));
    assert.equal(useGameStore.getState().moveInVariation('server-g1', 'f3'), true);
    const variation = useGameStore.getState().variation;
    assert.equal(variation.rootPly, 2);
    load(game(3, { status: 'finished', finishedReason: 'resignation' }));
    assert.equal(useGameStore.getState().variation, variation);
    assert.equal(viewed().pieces.some(p => p.square === 'f3'), true);
    useGameStore.getState().selectPly(2);
    assert.equal(useGameStore.getState().variation, null);
    assert.equal(viewed().pieces.some(p => p.square === 'g1'), true);
});

test('live updates and reconnect snapshots preserve analysis while another game, logout and invalid history reset it', t => {
    setup(t);
    useGameStore.getState().selectPly(1);
    localMove('c7', 'c5');
    const variation = useGameStore.getState().variation;
    load(game(3));
    load(game(3));
    assert.equal(useGameStore.getState().variation, variation);
    assert.equal(useGameStore.getState().latestPly, 3);
    load(game(3, { status: 'finished', finishedReason: 'resignation' }));
    assert.equal(useGameStore.getState().variation, variation);
    load(game(2, { _id: 'bbbbbbbbbbbbbbbbbbbbbbbb' }));
    assert.equal(useGameStore.getState().variation, null);
    useGameStore.getState().selectPly(1);
    localMove('c7', 'c5');
    load(game(2, { _id: 'bbbbbbbbbbbbbbbbbbbbbbbb', positionHistory: [] }));
    assert.equal(useGameStore.getState().variation, null);
    assert.equal(useGameStore.getState().moveInVariation('server-g1', 'f3'), false);
    useGameStore.getState().clearGame();
    assert.equal(useGameStore.getState().variation, null);
});

test('analysis cannot start on the live active board or during a pending server move', t => {
    setup(t);
    assert.equal(useGameStore.getState().moveInVariation('server-g1', 'f3'), false);
    useGameStore.getState().selectPly(1);
    useGameStore.setState({ isMovePending: true });
    assert.equal(localMove('c7', 'c5'), false);
    assert.equal(useGameStore.getState().variation, null);
});

test('analysis respects turns and rejects illegal moves, friendly captures, king captures and exposed kings', () => {
    const position = parsePosition(INITIAL_POSITION);
    const move = (from, to) => applyAnalysisMove(position, position.pieces.find(p => p.square === from).id, to);
    assert.equal(move('e7', 'e5'), null);
    assert.equal(move('e2', 'e5'), null);
    assert.equal(move('e1', 'e2'), null);
    const pinned = parsePosition('4r1k1/8/8/8/8/8/4R3/4K3 w - -');
    assert.equal(applyAnalysisMove(pinned, 'history-e2', 'f2'), null);
    const kingTarget = parsePosition('4k3/8/8/8/8/8/4R3/4K3 w - -');
    assert.equal(applyAnalysisMove(kingTarget, 'history-e2', 'e8'), null);
});

test('analysis moves both castling pieces, preserves rights and rejects castling after the king returned', () => {
    const start = parsePosition('r3k2r/8/8/8/8/8/8/R3K2R w KQkq -');
    const white = applyAnalysisMove(start, 'history-e1', 'g1');
    assert.ok(white);
    assert.equal(white.pieces.find(p => p.square === 'g1').piece, 'wk');
    assert.equal(white.pieces.find(p => p.square === 'f1').piece, 'wr');
    assert.equal(white.castlingRights, 'kq');
    const black = applyAnalysisMove(white, 'history-e8', 'c8');
    assert.ok(black);
    assert.equal(black.pieces.find(p => p.square === 'c8').piece, 'bk');
    assert.equal(black.pieces.find(p => p.square === 'd8').piece, 'br');
    assert.equal(black.castlingRights, '-');
    const noRights = parsePosition('4k3/8/8/8/8/8/8/4K2R w - -');
    assert.equal(applyAnalysisMove(noRights, 'history-e1', 'g1'), null);
    let moved = applyAnalysisMove(start, 'history-e1', 'e2');
    moved = applyAnalysisMove(moved, 'history-e8', 'e7');
    moved = applyAnalysisMove(moved, 'history-e1', 'e1');
    assert.ok(moved);
    moved = applyAnalysisMove(moved, 'history-e8', 'e8');
    assert.equal(applyAnalysisMove(moved, 'history-e1', 'g1'), null);
});

test('analysis handles en passant, expires it and checks the king after removing the captured pawn', () => {
    const position = parsePosition('4k3/8/8/3pP3/8/8/8/4K3 w - d6');
    const capture = applyAnalysisMove(position, 'history-e5', 'd6');
    assert.ok(capture);
    assert.equal(capture.pieces.some(p => p.square === 'd5'), false);
    assert.equal(capture.sound, 'capture');
    assert.equal(capture.enPassant, null);
    const expired = { ...position, enPassant: null };
    assert.equal(applyAnalysisMove(expired, 'history-e5', 'd6'), null);
    const pinned = parsePosition('k7/8/8/r4pPK/8/8/8/8 w - f6');
    assert.equal(applyAnalysisMove(pinned, 'history-g5', 'f6'), null);
});

test('analysis supports every promotion for both colors and leaves the original position immutable', () => {
    for (const [before, from, to, color] of [
        ['8/P7/7k/8/8/8/8/4K3 w - -', 'a7', 'a8', 'w'],
        ['4k3/8/8/8/8/7K/p7/8 b - -', 'a2', 'a1', 'b'],
    ]) {
        for (const promotion of ['q', 'r', 'b', 'n']) {
            const position = parsePosition(before);
            const snapshot = structuredClone(position);
            assert.equal(applyAnalysisMove(position, `history-${from}`, to), null);
            const next = applyAnalysisMove(position, `history-${from}`, to, promotion);
            assert.ok(next);
            assert.equal(next.pieces.find(p => p.square === to).piece, `${color}${promotion}`);
            assert.deepEqual(position, snapshot);
        }
    }
});

test('local variation sounds follow its cursor and background game completion never plays game-end over analysis', t => {
    setup(t);
    useGameStore.getState().selectPly(1);
    const root = useGameStore.getState();
    localMove('c7', 'c5');
    const moved = useGameStore.getState();
    assert.equal(getGameSound(moved, root, id), 'move-self');
    moved.navigatePosition('previous');
    const back = useGameStore.getState();
    assert.equal(getGameSound(back, moved, id), 'move-self');
    load(game(3, { status: 'finished', finishedReason: 'resignation' }));
    assert.equal(getGameSound(useGameStore.getState(), back, id), null);
});
