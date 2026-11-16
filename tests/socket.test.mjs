import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { setImmediate } from 'node:timers/promises';
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
const { socket, getSocketSessionVersion } = await server.ssrLoadModule('/src/socket/socket.ts');
const { subscribeToSocketState, isObjectId } = await server.ssrLoadModule('/src/socket/subscribeToSocketState.ts');
const { watchMatchmaking } = await server.ssrLoadModule('/src/socket/watchMatchmaking.ts');
const { useUserStore } = await server.ssrLoadModule('/src/store/userStore.ts');
const { useMatchmakingStore } = await server.ssrLoadModule('/src/store/matchmakingStore.ts');
const { useGameStore } = await server.ssrLoadModule('/src/store/gameStore.ts');
const { getPlayerActiveGame } = await server.ssrLoadModule('/src/api/playerApi.ts');
const { getGameById, getSearchStatus, cancelSearch } = await server.ssrLoadModule('/src/api/gameApi.ts');
const { mapServerGameToClientGame } = await server.ssrLoadModule('/src/utils/mapServerGameToClientGame.ts');

after(async () => {
    socket.disconnect();
    await server.close();
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
});

const ownId = '111111111111111111111111';
const otherId = '222222222222222222222222';
const gameId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const otherGameId = 'bbbbbbbbbbbbbbbbbbbbbbbb';
const receive = (event, ...args) => socket.emitEvent([event, ...args]);
const open = () => { socket.connected = true; receive('connect'); };
const drop = () => { socket.connected = false; receive('disconnect', 'transport close'); };
const json = data => Response.json(data);
const deferred = () => {
    let resolve;
    const promise = new Promise(done => { resolve = done; });
    return { promise, resolve };
};
function setup(t) {
    const operations = [];
    t.mock.method(socket, 'connect', () => {
        operations.push(['connect', { ...socket.auth }]);
        return socket;
    });
    t.mock.method(socket, 'disconnect', () => {
        operations.push(['disconnect']);
        const connected = socket.connected;
        socket.connected = false;
        if (connected) receive('disconnect', 'io client disconnect');
        return socket;
    });
    t.mock.method(socket, 'emit', (event, ...args) => {
        operations.push([event, ...args]);
        return socket;
    });
    useUserStore.getState().logout();
    useMatchmakingStore.getState().clearMatchmaking();
    storage.clear();
    operations.length = 0;
    t.after(() => useUserStore.getState().logout());
    return operations;
}
function login(token = 'jwt-a', id = ownId) {
    localStorage.setItem('token', token);
    useUserStore.getState().setAuth({ id }, token);
}
function game(id = gameId, currentTurn = 'white') {
    return {
        _id: id,
        white: { playerType: 'human', playerId: ownId, name: 'White', elo: 1200 },
        black: { playerType: 'bot', playerId: otherId, name: 'Bot', elo: 1200 },
        currentTurn, status: 'playing', pieces: [], moves: [],
    };
}

test('login, token rotation and account changes replace the session; logout omits auth.token', t => {
    const operations = setup(t);
    login();
    assert.deepEqual(operations.slice(-2), [['disconnect'], ['connect', { token: 'jwt-a' }]]);
    const version = getSocketSessionVersion();
    open();
    socket.sendBuffer.push({ type: 2, data: ['player:watch', otherId] });
    socket.receiveBuffer.push(['match:found', gameId]);
    login('jwt-b');
    assert.deepEqual(socket.sendBuffer, []);
    assert.deepEqual(socket.receiveBuffer, []);
    assert.ok(getSocketSessionVersion() > version);
    assert.deepEqual(operations.slice(-2), [['disconnect'], ['connect', { token: 'jwt-b' }]]);
    login('jwt-c', otherId);
    assert.deepEqual(operations.slice(-2), [['disconnect'], ['connect', { token: 'jwt-c' }]]);
    useUserStore.getState().logout();
    assert.deepEqual(socket.auth, {});
    assert.equal(Object.hasOwn(socket.auth, 'token'), false);
    assert.equal(operations.at(-1)[0], 'disconnect');
    assert.equal(socket.io.opts.query, undefined, 'JWT is not added to the URL');
});

test('Unauthorized and expired server sessions require login without reconnecting the rejected JWT', t => {
    const operations = setup(t);
    login();
    useMatchmakingStore.getState().startSearch();
    useGameStore.getState().setGame(mapServerGameToClientGame(game()));
    receive('connect_error', new Error('Unauthorized'));
    assert.equal(useUserStore.getState().isAuth, false);
    assert.equal(useMatchmakingStore.getState().isSearching, false);
    assert.equal(useGameStore.getState().gameId, null);
    assert.equal(localStorage.getItem('token'), null);
    assert.equal(operations.filter(([event]) => event === 'connect').length, 1);
    login('valid-new-jwt');
    open();
    socket.connected = false;
    receive('disconnect', 'io server disconnect');
    assert.equal(useUserStore.getState().token, null);
    assert.deepEqual(socket.auth, {});
    assert.equal(operations.filter(([event]) => event === 'connect').length, 2);
    login('valid-after-expiry');
    assert.deepEqual(operations.at(-1), ['connect', { token: 'valid-after-expiry' }]);
});

test('foreign profile watches keep live Spectate state over stale HTTP and resynchronize after reconnect', async t => {
    const operations = setup(t);
    login();
    open();
    const first = deferred();
    let requests = 0;
    t.mock.method(globalThis, 'fetch', (url, options) => {
        assert.equal(new URL(url).pathname, `/players/active-game/${otherId}`);
        assert.equal(options.headers.Authorization, 'Bearer jwt-a');
        requests += 1;
        return requests === 1 ? first.promise : Promise.resolve(json({ game: null }));
    });
    const states = [];
    const stop = subscribeToSocketState({
        event: 'player:active-game:update',
        join: () => socket.emit('player:watch', otherId),
        leave: () => socket.emit('player:unwatch', otherId),
        loadSnapshot: async () => (await getPlayerActiveGame('jwt-a', otherId)).game?._id ?? null,
        onUpdate: id => states.push(id),
    });
    t.after(stop);
    assert.deepEqual(operations.at(-1), ['player:watch', otherId]);
    receive('player:active-game:update', gameId);
    first.resolve(json({ game: { _id: otherGameId } }));
    await setImmediate();
    assert.deepEqual(states, [gameId]);
    assert.equal(useMatchmakingStore.getState().isSearching, false, 'Watching a foreign player does not change own search');
    drop();
    open();
    await setImmediate();
    assert.deepEqual(states, [gameId, null]);
    assert.equal(operations.filter(([event]) => event === 'player:watch').length, 2);
    stop();
    assert.deepEqual(operations.at(-1), ['player:unwatch', otherId]);
    assert.equal(socket.listeners('player:active-game:update').length, 0);
});

test('spectator game snapshots and moves stay current, filter other games and preserve unrelated callbacks', async t => {
    setup(t);
    login();
    open();
    const first = deferred();
    let requests = 0;
    t.mock.method(globalThis, 'fetch', (url, options) => {
        assert.equal(new URL(url).pathname, `/game/by-id/${gameId}`);
        assert.equal(options, undefined, 'Game GET does not require a JWT');
        requests += 1;
        return requests === 1 ? first.promise : Promise.resolve(json({ game: game(gameId, 'black') }));
    });
    const states = [];
    const observer = t.mock.fn();
    socket.on('game:update', observer);
    t.after(() => socket.off('game:update', observer));
    const stop = subscribeToSocketState({
        event: 'game:update',
        join: () => socket.emit('game:join', gameId),
        leave: () => socket.emit('game:leave', gameId),
        loadSnapshot: async () => (await getGameById(gameId)).game,
        accepts: value => value._id === gameId,
        onUpdate: value => states.push(mapServerGameToClientGame(value)),
    });
    t.after(stop);
    receive('game:update', game(otherGameId));
    const update = { ...game(gameId, 'black'), moves: [{ whiteMove: 'e4' }], pieces: [{ id: 'wp1', piece: 'wp', square: 'e4' }] };
    receive('game:update', update);
    first.resolve(json({ game: game() }));
    await setImmediate();
    assert.equal(states.length, 1);
    assert.deepEqual(states[0].moves, [{ whiteMove: 'e4' }]);
    assert.equal(states[0].pieces[0].square, 'e4');
    drop();
    open();
    await setImmediate();
    assert.equal(states.length, 2);
    assert.equal(states[1].currentTurn, 'black');
    stop();
    receive('game:update', game());
    assert.equal(states.length, 2);
    assert.equal(observer.mock.callCount(), 3);
});

test('route cleanup and account replacement reject pending snapshots and old-session events', async t => {
    setup(t);
    login();
    open();
    const responses = [deferred(), deferred()];
    const states = [];
    let request = 0;
    const options = {
        event: 'game:update',
        loadSnapshot: () => responses[request++].promise,
        onUpdate: value => states.push(value),
    };
    const stopOldRoute = subscribeToSocketState(options);
    stopOldRoute();
    const stopOldAccount = subscribeToSocketState(options);
    t.after(stopOldAccount);
    login('jwt-b', otherId);
    responses[0].resolve(game());
    responses[1].resolve(game());
    receive('game:update', game());
    await setImmediate();
    assert.deepEqual(states, []);
});

test('search waits for connection, joins own room before HTTP, cancels and rejects late responses', async t => {
    const operations = setup(t);
    t.mock.timers.enable({ apis: ['setInterval'] });
    login();
    const response = deferred();
    const fetch = t.mock.method(globalThis, 'fetch', (url, options) => {
        const path = new URL(url).pathname;
        if (path === '/game/cancel-search') return Promise.resolve(json({}));
        assert.equal(path, '/game/find');
        assert.equal(options.method, 'POST');
        assert.equal(options.headers.Authorization, 'Bearer jwt-a');
        assert.equal(socket.listeners('match:found').length, 1);
        assert.deepEqual(operations.at(-1), ['matchmaking:join', ownId]);
        return response.promise;
    });
    const onFound = t.mock.fn();
    const stop = watchMatchmaking(ownId, 'jwt-a', onFound);
    t.after(stop);
    useMatchmakingStore.getState().startSearch();
    assert.equal(fetch.mock.callCount(), 0);
    open();
    assert.equal(fetch.mock.callCount(), 1);
    t.mock.timers.tick(9000);
    assert.equal(fetch.mock.callCount(), 1, 'Polling does not overlap an unfinished search request');
    useMatchmakingStore.getState().clearMatchmaking();
    await cancelSearch('jwt-a');
    response.resolve(json({ status: 'matched', game: { _id: gameId } }));
    await setImmediate();
    assert.equal(onFound.mock.callCount(), 0);
    assert.equal(useMatchmakingStore.getState().isSearching, false);
    assert.deepEqual(operations.at(-1), ['matchmaking:leave', ownId]);
});

test('match:found navigates once; reconnect rejoins own search without duplicating listeners', async t => {
    const operations = setup(t);
    login();
    open();
    const fetch = t.mock.method(globalThis, 'fetch', async () => json({ status: 'searching', eloRange: 100 }));
    const onFound = t.mock.fn();
    const stop = watchMatchmaking(ownId, 'jwt-a', onFound);
    t.after(stop);
    useMatchmakingStore.getState().startSearch();
    await setImmediate();
    assert.equal(useMatchmakingStore.getState().eloRange, 100);
    drop();
    open();
    await setImmediate();
    assert.equal(fetch.mock.callCount(), 1, 'Reconnect waits for synchronized search status before HTTP polling');
    useMatchmakingStore.getState().setSearchStatus({ searching: true, eloRange: 100 });
    await setImmediate();
    assert.equal(fetch.mock.callCount(), 2);
    useMatchmakingStore.getState().setSearchStatus({ searching: true, eloRange: 100 });
    await setImmediate();
    assert.equal(fetch.mock.callCount(), 2, 'Regular status events must not create an HTTP feedback loop');
    assert.equal(operations.filter(([event]) => event === 'matchmaking:join').length, 2);
    assert.equal(socket.listeners('match:found').length, 1);
    receive('match:found', gameId);
    receive('match:found', gameId);
    assert.equal(onFound.mock.callCount(), 1);
    assert.deepEqual(onFound.mock.calls[0].arguments, [gameId, true]);
    assert.equal(useMatchmakingStore.getState().isSearching, false);
    stop();
    assert.equal(socket.listeners('match:found').length, 0);
});

test('new socket status wins over pending search-status HTTP, which is fetched again on reconnect', async t => {
    const operations = setup(t);
    login();
    open();
    const first = deferred();
    let requests = 0;
    t.mock.method(globalThis, 'fetch', (url, options) => {
        assert.equal(new URL(url).pathname, '/game/search-status');
        assert.equal(options.headers.Authorization, 'Bearer jwt-a');
        requests += 1;
        return requests === 1 ? first.promise : Promise.resolve(json({ searching: false, eloRange: null }));
    });
    const stop = subscribeToSocketState({
        event: 'matchmaking:status:update',
        loadSnapshot: () => getSearchStatus('jwt-a'),
        getSnapshotVersion: () => useMatchmakingStore.getState().revision,
        onUpdate: status => useMatchmakingStore.getState().setSearchStatus(status),
    });
    t.after(stop);
    receive('matchmaking:status:update', { searching: true, eloRange: 80, searchStartedAt: '2026-11-15T10:00:00Z' });
    first.resolve(json({ searching: false, eloRange: null }));
    await setImmediate();
    assert.equal(useMatchmakingStore.getState().isSearching, true);
    assert.equal(useMatchmakingStore.getState().eloRange, 80);
    drop();
    open();
    await setImmediate();
    assert.equal(useMatchmakingStore.getState().isSearching, false);
    assert.equal(requests, 2);
    assert.equal(operations.some(([event]) => event === 'player:watch'), false);
});

test('HTTP failures reject snapshots; subscription IDs follow the ObjectId contract', async t => {
    setup(t);
    t.mock.method(globalThis, 'fetch', async () => Response.json({ message: 'Forbidden' }, { status: 403 }));
    await assert.rejects(getPlayerActiveGame('jwt-a', otherId), /Failed to get player active game/);
    await assert.rejects(getGameById(gameId), /Failed to get game/);
    await assert.rejects(getSearchStatus('jwt-a'), /Failed to get search status/);
    assert.equal(isObjectId(gameId), true);
    assert.equal(isObjectId('ABCDEF0123456789ABCDEF01'), true);
    assert.equal(isObjectId(''), false);
    assert.equal(isObjectId('invalid-player'), false);
    assert.equal(isObjectId('g'.repeat(24)), false);
});


test('a new personal status invalidates a pending HTTP match result', async t => {
    setup(t);
    login();
    open();
    const response = deferred();
    t.mock.method(globalThis, 'fetch', () => response.promise);
    const onFound = t.mock.fn();
    const stop = watchMatchmaking(ownId, 'jwt-a', onFound);
    t.after(stop);
    useMatchmakingStore.getState().startSearch();
    useMatchmakingStore.getState().setSearchStatus({ searching: true, eloRange: 250 });
    response.resolve(json({ status: 'matched', game: { _id: gameId } }));
    await setImmediate();
    assert.equal(onFound.mock.callCount(), 0);
    assert.equal(useMatchmakingStore.getState().eloRange, 250);
    assert.equal(useMatchmakingStore.getState().isSearching, true);
});

test('an immediate HTTP match is handled after subscribing, and old-account search cannot leak into login', async t => {
    const operations = setup(t);
    useMatchmakingStore.getState().startSearch();
    login();
    assert.equal(useMatchmakingStore.getState().isSearching, false, 'Unowned persisted search must be synchronized for the signed-in account');
    open();
    t.mock.method(globalThis, 'fetch', async () => {
        assert.equal(socket.listeners('match:found').length, 1);
        assert.deepEqual(operations.at(-1), ['matchmaking:join', ownId]);
        return json({ status: 'matched', game: { _id: gameId } });
    });
    const onFound = t.mock.fn();
    const stop = watchMatchmaking(ownId, 'jwt-a', onFound);
    t.after(stop);
    useMatchmakingStore.getState().startSearch();
    await setImmediate();
    assert.deepEqual(onFound.mock.calls[0].arguments, [gameId, true]);
    assert.equal(useMatchmakingStore.getState().isSearching, false);
    useMatchmakingStore.getState().startSearch();
    login('jwt-b', otherId);
    assert.equal(useMatchmakingStore.getState().isSearching, false);
});

test('disconnect invalidates in-flight snapshots even if reconnect snapshots resolve first', async t => {
    setup(t);
    login();
    open();
    const first = deferred();
    const second = deferred();
    const states = [];
    let request = 0;
    const stop = subscribeToSocketState({
        event: 'player:active-game:update',
        loadSnapshot: () => (++request === 1 ? first.promise : second.promise),
        onUpdate: value => states.push(value),
    });
    t.after(stop);
    drop();
    open();
    second.resolve(gameId);
    await setImmediate();
    first.resolve(null);
    await setImmediate();
    assert.deepEqual(states, [gameId]);
});

test('reconnect does not restart a search cancelled on the server while disconnected', async t => {
    setup(t);
    login();
    open();
    const fetch = t.mock.method(globalThis, 'fetch', async () => json({ status: 'searching', eloRange: 100 }));
    const stop = watchMatchmaking(ownId, 'jwt-a', t.mock.fn());
    t.after(stop);
    useMatchmakingStore.getState().startSearch();
    await setImmediate();
    drop();
    open();
    useMatchmakingStore.getState().setSearchStatus({ searching: false, eloRange: null });
    await setImmediate();
    assert.equal(fetch.mock.callCount(), 1);
    assert.equal(useMatchmakingStore.getState().isSearching, false);
});
