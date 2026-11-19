// Start Vite at NAV_ORIGIN and a Chromium browser with --remote-debugging-port=9240.
// Uses an isolated GamePage with mocked HTTP/Socket.IO, without a live database or engine.
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const origin = process.env.NAV_ORIGIN ?? 'http://127.0.0.1:5199';
const debuggerOrigin = process.env.NAV_DEBUGGER ?? 'http://127.0.0.1:9240';
const target = await (await fetch(`${debuggerOrigin}/json/new?about:blank`, { method: 'PUT' })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(resolve => ws.addEventListener('open', resolve, { once: true }));
let sequence = 0;
const pending = new Map();
const errors = [];
function command(method, params = {}) {
    return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        ws.send(JSON.stringify({ id, method, params }));
    });
}
const main = await (await fetch(origin + '/src/main.tsx')).text();
const component = await (await fetch(origin + '/src/pages/GamePage/components/ChessBoard/index.tsx')).text();
const gamePageModule = await (await fetch(origin + '/src/pages/GamePage/index.tsx')).text();
// Match Vite's current HMR import URL so the harness and page share one store.
const gameStorePath = gamePageModule.match(/from "([^\"]*\/src\/store\/gameStore\.ts[^\"]*)"/)[1];
const socketModule = await (await fetch(origin + '/src/pages/GamePage/hooks/useGameSocket.ts')).text();
const socketPath = socketModule.match(/from "([^\"]*\/src\/socket\/socket\.ts[^\"]*)"/)[1];
const domPath = main.match(/from "([^\"]*react-dom_client\.js[^\"]*)"/)[1];
const reactPath = component.match(/from "([^\"]*\/react\.js[^\"]*)"/)[1];
const dependencyQuery = new URL(reactPath, origin).search;
const bootstrap = `
import React from '${reactPath}';
import ReactDOM from '${domPath}';
import { MemoryRouter, Routes, Route, useNavigate } from '/node_modules/.vite/deps/react-router-dom.js${dependencyQuery}';
import '/src/index.css';
import GamePage from '/src/pages/GamePage/index.tsx';
import { useUserStore } from '/src/store/userStore.ts';
import { useGameStore } from '${gameStorePath}';
import { socket } from '${socketPath}';
import { INITIAL_POSITION, parsePosition } from '/src/pages/GamePage/utils/moveNavigation.ts';
const e = React.createElement;
const id = 'aaaaaaaaaaaaaaaaaaaaaaaa';
const ownId = '111111111111111111111111';
window.__initial = INITIAL_POSITION;
window.__fens = [
'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3',
'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6',
'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq -'
];
window.__fixture = (count = 2, extra = {}) => ({
_id: id, status: 'active',
white: { playerType: 'human', playerId: ownId, name: 'White', elo: 1200 },
black: { playerType: 'bot', playerId: '222222222222222222222222', name: 'Black', elo: 1200 },
currentTurn: count % 2 ? 'black' : 'white',
moves: count === 0 ? [] : count === 1 ? [{ whiteMove: 'e4' }] : count === 2 ? [{ whiteMove: 'e4', blackMove: 'e5' }] : [{ whiteMove: 'e4', blackMove: 'e5' }, { whiteMove: 'Nf3' }],
positionHistory: window.__fens.slice(0, count),
pieces: parsePosition(count ? window.__fens[count-1] : INITIAL_POSITION).pieces.map(p => ({ ...p, id: 'server-' + p.square })),
lastMove: count ? { piece: 'bp', from: 'e7', to: 'e5' } : null,
...extra
});
window.__mate = () => {
const history = [
'rnbqkbnr/pppppppp/8/8/8/5P2/PPPPP1PP/RNBQKBNR b KQkq -',
'rnbqkbnr/pppp1ppp/8/4p3/8/5P2/PPPPP1PP/RNBQKBNR w KQkq e6',
'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq g3',
'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq -'
];
return window.__fixture(0, {
status:'finished', finishedReason:'checkmate', winner:'black',
moves:[{whiteMove:'f3',blackMove:'e5'},{whiteMove:'g4',blackMove:'Qh4#'}],
positionHistory:history, pieces:parsePosition(history[3]).pieces,
lastMove:{piece:'bq',from:'d8',to:'h4'}, moveMeta:{isCheck:true,isCheckmate:true}
});
};
window.__requests = []; window.__packets = []; window.__moves = [];
window.__sounds = [];
window.Audio = class {
    constructor(src) { this.src = src; }
    play() { window.__sounds.push(this.src); return Promise.resolve(); }
};
window.__server = window.__fixture();
socket.connect = () => { socket.connected = true; return socket; };
socket.disconnect = () => { socket.connected = false; return socket; };
socket.emit = (event,...args) => { window.__packets.push([event,...args]); return socket; };
const originalFetch = window.fetch.bind(window);
window.fetch = (url, options) => {
const path = new URL(String(url), location.href).pathname;
if (path.startsWith('/game/by-id/')) {
window.__requests.push(path); return Promise.resolve(Response.json({ game: window.__server }));
}
if (path === '/game/move') return new Promise(resolve => window.__moves.push({ body: JSON.parse(options.body), resolve: (body,status=200) => resolve(Response.json(body,{status})) }));
return originalFetch(url, options);
};
window.__update = game => { window.__server = game; socket.emitEvent(['game:update',game]); };
window.__reconnect = () => { socket.connected=false; socket.emitEvent(['disconnect','transport close']); socket.connected=true; socket.emitEvent(['connect']); };
window.__login = (userId = ownId) => useUserStore.getState().setAuth({id:userId,name:'White',elo:1200},'test-jwt');
window.__state = () => useGameStore.getState();
window.__login();
function RouterControl() { window.__navigate = useNavigate(); return null; }
const root = ReactDOM.createRoot(document.getElementById('root'));
let visit = 0;
window.__renderGame = (gameId = id) => root.render(e(React.StrictMode,null,e(MemoryRouter,{key:++visit,initialEntries:['/game/'+gameId]}, e(RouterControl),e(Routes,null,e(Route,{path:'/game/:id',element:e(GamePage)})))));
window.__renderGame();
window.__ready = true;
`;
let html = await (await fetch(origin)).text();
html = html.replace(/<script type="module" src="\/src\/main.tsx[^\"]*"><\/script>/, () => '<script type="module">' + bootstrap + '</script>');
assert.ok(html.includes('window.__ready'));
ws.addEventListener('message', async event => {
    const message = JSON.parse(event.data);
    if (message.id) {
        const task = pending.get(message.id);
        pending.delete(message.id);
        if (message.error) task?.reject(new Error(JSON.stringify(message.error)));
        else task?.resolve(message.result);
    } else if (message.method === 'Fetch.requestPaused') {
        await command('Fetch.fulfillRequest', { requestId: message.params.requestId, responseCode: 200,
            responseHeaders: [{ name: 'Content-Type', value: 'text/html' }], body: Buffer.from(html).toString('base64') });
    } else if (message.method === 'Runtime.exceptionThrown') {
        errors.push(message.params.exceptionDetails.exception?.description ?? message.params.exceptionDetails.text);
    }
});
async function evaluate(expression) {
    const result = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description ?? result.exceptionDetails.text);
    return result.result.value;
}
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
async function waitFor(expression) {
    for (let attempt = 0; attempt < 100; attempt += 1) {
        if (errors.length) throw new Error(errors.join('\n'));
        if (await evaluate(`Boolean(${expression})`)) return;
        await pause(50);
    }
    const state = await evaluate(`window.__state ? {gameId:__state().gameId,selectedPly:__state().selectedPly,latestPly:__state().latestPly,requests:__requests} : null`);
    throw new Error(`Timed out: ${expression}; state=${JSON.stringify(state)}`);
}
const click = label => evaluate(`document.querySelector('button[aria-label=${JSON.stringify(label)}]').click()`);
async function key(key) {
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key });
    await pause(30);
}
const ply = value => waitFor(`(__state().variation?.cursor ?? __state().selectedPly ?? __state().latestPly) === ${value}`);
const active = () => evaluate(`document.querySelector('[aria-current="step"]')?.getAttribute('aria-label') ?? null`);
const resultOpen = 'Boolean(document.querySelector(\'[role="dialog"][aria-label="Game result"][aria-hidden="false"]\'))';
const highlights = () => evaluate(`[...document.querySelectorAll('[data-square][class*="lastMove"]')].map(el=>el.dataset.square).sort()`);
const highlightedPlayer = () => evaluate(`[...document.querySelectorAll('section[class*="userCard"]')].filter(el=>el.className.includes('_active_')).map(el=>el.textContent.includes('Black')?'black':'white')`);
async function clickMove(piece, from, to) {
    await evaluate(`${shown(piece,from)}.click()`);
    await evaluate(`document.querySelector('[data-square="${to}"]').click()`);
}
const shown = (piece, square) => `document.querySelector('[data-chess-board] img[alt="${piece} on ${square}"]')`;
async function dragStart(piece = 'wn', from = 'g1', to = 'f3') {
    const points = await evaluate(`(() => {
        const source = ${shown(piece, from)}.getBoundingClientRect();
        const target = document.querySelector('[data-square="${to}"]').getBoundingClientRect();
        return {x:source.x+source.width/2,y:source.y+source.height/2,tx:target.x+target.width/2,ty:target.y+target.height/2};
    })()`);
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: points.x, y: points.y });
    await command('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', buttons: 1, clickCount: 1, x: points.x, y: points.y });
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', buttons: 1, x: points.tx, y: points.ty });
    return points;
}
async function dragEnd(points) {
    await command('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', buttons: 0, clickCount: 1, x: points.tx, y: points.ty });
    await pause(40);
}
const arrowCount = () => evaluate(`document.querySelectorAll('[data-chess-board] svg path').length`);
async function arrowStart(from = 'g1', to = 'f3', offset = 0.5) {
    const points = await evaluate(`(() => {
        const source = document.querySelector('[data-square="${from}"]').getBoundingClientRect();
        const target = document.querySelector('[data-square="${to}"]').getBoundingClientRect();
        return {x:source.x+source.width*${offset},y:source.y+source.height*${offset},tx:target.x+target.width*${offset},ty:target.y+target.height*${offset}};
    })()`);
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', x: points.x, y: points.y });
    await command('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'right', buttons: 2, clickCount: 1, x: points.x, y: points.y });
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', buttons: 2, x: points.tx, y: points.ty });
    return points;
}
async function arrowEnd(points) {
    await command('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'right', buttons: 0, clickCount: 1, x: points.tx, y: points.ty });
    await pause(40);
}
async function verifyBoardArrows(flipped = false) {
    const before = await evaluate('JSON.stringify({pieces:__state().pieces,moves:__moves})');
    const first = await arrowStart();
    await waitFor(`document.querySelectorAll('[data-chess-board] svg path').length === 1`);
    assert.equal(await evaluate(`document.querySelector('[data-chess-board] svg path').getAttribute('transform')`),
        flipped ? 'translate(150 50) rotate(63.43494882292201)' : 'translate(650 750) rotate(-116.56505117707799)');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-chess-board] svg')).fill`),'rgb(255, 204, 0)');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-chess-board] svg')).opacity`),'0.7');
    assert.equal(await evaluate(`getComputedStyle(document.querySelector('[data-chess-board] svg')).pointerEvents`),'none');
    await arrowEnd(first);
    assert.equal(await arrowCount(),1,'release saves the preview');
    await arrowEnd(await arrowStart('e2','e4'));
    assert.equal(await arrowCount(),2,'multiple arrows coexist');
    await arrowEnd(await arrowStart());
    assert.equal(await arrowCount(),1,'drawing the same arrow removes it');
    await arrowEnd(await arrowStart());
    assert.equal(await arrowCount(),2,'a removed arrow can be drawn again');
    const isMarked = square => evaluate(`document.querySelector('[data-square="${square}"]').className.includes('marked')`);
    await arrowEnd(await arrowStart('e2','e2'));
    assert.equal(await arrowCount(),2,'right clicking a single square adds no arrow');
    assert.equal(await isMarked('e2'),true,'right click marks an occupied square');
    await arrowEnd(await arrowStart('e2','e2'));
    assert.equal(await isMarked('e2'),false,'another right click unmarks it');
    await arrowEnd(await arrowStart('a3','a3',0.03));
    assert.equal(await isMarked('a3'),true,'right click also marks an empty square near its corner');
    await evaluate(`document.querySelector('[data-square="a3"]').dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true}))`);
    assert.equal(await isMarked('a3'),false,'Ctrl+click shares the same square marks');
    const returned = await arrowStart('a3','a4');
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', buttons: 2, x: returned.x, y: returned.y });
    await arrowEnd({...returned,tx:returned.x,ty:returned.y});
    assert.equal(await isMarked('a3'),false,'dragging away and back does not count as a short click');
    assert.equal(await evaluate(`document.querySelector('[data-chess-board]').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true}))`),false);
    const left = await arrowStart('a3','a4');
    await arrowEnd(left);
    await command('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', buttons: 1, clickCount: 1, x: left.x, y: left.y });
    await command('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', buttons: 0, clickCount: 1, x: left.x, y: left.y });
    assert.equal(await arrowCount(),3,'left click on an empty board square preserves arrows');
    await evaluate(`document.querySelector('[data-square="a3"]').dispatchEvent(new MouseEvent('click',{bubbles:true,ctrlKey:true}))`);
    await waitFor(`document.querySelector('[data-square="a3"]').className.includes('marked')`);
    await evaluate(`${shown('wn','g1')}.click()`);
    assert.equal(await arrowCount(),3,'selecting a piece preserves arrows');
    await evaluate(`document.querySelector('[data-square="a3"]').click()`);
    const markedCount = () => evaluate(`document.querySelectorAll('[data-square][class*="marked"]').length`);
    assert.equal(await markedCount(),1);
    // Cell corners, occupied destinations and quick consecutive gestures must all work.
    for (const [from,to,offset] of [['a1','h8',0.03],['h8','a1',0.97],['b1','g8',0.5],['d4','e5',0.1]]) {
        const count = await arrowCount();
        await arrowEnd(await arrowStart(from,to,offset));
        assert.equal(await arrowCount(),count+1,`${from} to ${to} draws from any point in the cell`);
    }
    const savedCount = await arrowCount();
    const outside = await arrowStart('b3','c4');
    const edge = await evaluate(`(() => { const r=document.querySelector('[data-chess-board]').getBoundingClientRect(); return {tx:r.right+10,ty:r.top+10}; })()`);
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', buttons: 2, x: edge.tx, y: edge.ty });
    await arrowEnd({...outside,...edge});
    assert.equal(await arrowCount(),savedCount,'release outside cancels only the draft');
    const reentered = await arrowStart('b3','c4');
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', buttons: 2, x: edge.tx, y: edge.ty });
    await command('Input.dispatchMouseEvent', { type: 'mouseMoved', buttons: 2, x: reentered.tx, y: reentered.ty });
    await arrowEnd(reentered);
    assert.equal(await arrowCount(),savedCount+1,'pointer capture supports leaving and reentering the board');
    const blurred = await arrowStart('c3','d5');
    await evaluate(`window.dispatchEvent(new Event('blur'))`);
    await arrowEnd(blurred);
    assert.equal(await arrowCount(),savedCount+1,'losing focus preserves saved arrows');
    const navigated = await arrowStart('c3','d5');
    await key('ArrowLeft');
    await arrowEnd(navigated);
    assert.equal(await arrowCount(),savedCount+1,'navigation cancels the draft and preserves saved arrows');
    assert.equal(await markedCount(),1,'navigation also preserves marked squares');
    await key('ArrowRight');
    assert.equal(await arrowCount(),savedCount+1);
    await key('Escape');
    assert.equal(await arrowCount(),0,'Escape clears all saved arrows');
    assert.equal(await markedCount(),0,'Escape clears all marked squares');
    await arrowEnd(await arrowStart('a3','a3'));
    const escaped = await arrowStart('c3','d5');
    await key('Escape');
    await arrowEnd(escaped);
    assert.equal(await arrowCount(),0,'Escape cancels a draft so releasing cannot restore it');
    assert.equal(await markedCount(),0);
    const escapedClick = await arrowStart('a3','a3');
    await key('Escape');
    await arrowEnd(escapedClick);
    assert.equal(await markedCount(),0,'Escape cancels a pending right click');
    await arrowEnd(await arrowStart('a3','a3'));
    await arrowEnd(await arrowStart());
    await evaluate(`document.body.dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
    await waitFor(`document.querySelectorAll('[data-chess-board] svg path').length === 0`);
    assert.equal(await markedCount(),0,'clicking outside clears arrows and marked squares together');
    assert.equal(await evaluate('JSON.stringify({pieces:__state().pieces,moves:__moves})'),before,'annotations never move pieces or submit moves');
    console.log(`PASS translucent yellow arrows, reliable gestures, persistence, outside clear and ${flipped ? 'black' : 'white'} perspective`);
}
try {
    await command('Page.enable');
    await command('Runtime.enable');
    await command('Page.bringToFront');
    await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await command('Fetch.enable', { patterns: [{ urlPattern: origin + '/__move-navigation*', resourceType: 'Document' }] });
    await command('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
    await command('Page.navigate', { url: origin + '/__move-navigation' });
    await waitFor('window.__ready && document.querySelector("[data-chess-board]")');
    await ply(2);
    assert.equal(await evaluate('__sounds.length'),0,'opening a game is silent');
    assert.equal(await evaluate(resultOpen),false);
    assert.equal(await active(), '1. Black: e5');
    assert.deepEqual(await highlightedPlayer(),['white']);
    await verifyBoardArrows();
    await key('ArrowLeft'); await ply(1);
    assert.equal(await active(), '1. White: e4');
    assert.deepEqual(await highlightedPlayer(),['black'],'sidebar follows the displayed historical turn');
    assert.deepEqual(await highlights(),['e2','e4']);
    assert.equal(await evaluate('__sounds.at(-1)'),'/chess-sounds/move-self.mp3');
    assert.ok(await evaluate(`Boolean(${shown('bp','e7')})`));
    assert.equal(await evaluate(`Boolean(${shown('bp','e5')})`), false);
    const historicalDrag = await dragStart('wp','e4','e5'); await dragEnd(historicalDrag);
    assert.equal(await evaluate('__moves.length'),0);
    assert.equal(await evaluate(`document.querySelectorAll('[data-chess-board] [class*="available"]').length`),0);
    await evaluate(`void (window.__movingPawn=${shown('wp','e4')})`);
    await pause(250);
    const beforeAnimation = await evaluate(`({top:getComputedStyle(__movingPawn).top,transition:getComputedStyle(__movingPawn).transition,cls:__movingPawn.className})`);
    await key('ArrowDown'); await ply(0); assert.equal(await active(),null);
    assert.deepEqual(await highlights(),[]);
    assert.equal(await evaluate(`window.__movingPawn === ${shown('wp','e2')}`),true,'navigation preserves the animated element');
    const afterAnimation = await evaluate(`({top:getComputedStyle(__movingPawn).top,transition:getComputedStyle(__movingPawn).transition,cls:__movingPawn.className,count:__movingPawn.getAnimations().length})`);
    assert.ok(afterAnimation.count > 0,`piece is moving with a CSS transition: ${JSON.stringify({beforeAnimation,afterAnimation})}`);
    assert.ok(await evaluate(`Boolean(${shown('wp','e2')})`));
    await key('ArrowLeft'); await ply(0);
    await key('ArrowRight'); await ply(1);
    await key('ArrowUp'); await ply(2);
    assert.equal(await evaluate(`window.__movingPawn === ${shown('wp','e4')}`),true,'history and live pieces share a visual identity');
    assert.deepEqual(await highlights(),['e5','e7']);
    await key('ArrowRight'); await ply(2);
    await click('Initial position'); await ply(0);
    await click('Next half-move'); await ply(1);
    await click('Previous half-move'); await ply(0);
    await click('Latest position'); await ply(2);
    await click('1. White: e4'); await ply(1);
    await click('1. Black: e5'); await ply(2);
    await pause(300);
    const selectedColor = await evaluate(`getComputedStyle(document.querySelector('[aria-current="step"]')).backgroundColor`);
    assert.equal(selectedColor,'rgba(255, 255, 255, 0.2)');
    console.log('PASS all arrows, four buttons, both move columns, highlights, bounds and historical turn');

    const requestCount = await evaluate('__requests.length');
    for (const tag of ['input','textarea','select','div']) {
        await evaluate(`(() => { const el=document.createElement('${tag}'); el.id='editor'; if('${tag}'==='div') el.contentEditable='true'; document.body.append(el); el.focus(); })()`);
        await key('ArrowDown'); await ply(2);
        await evaluate(`document.querySelector('#editor').remove()`);
    }
    await key('ArrowLeft'); await ply(1);
    const backgroundSounds = await evaluate('__sounds.length');
    await evaluate('__update(__fixture(3))'); await ply(1);
    assert.equal(await evaluate('__sounds.length'),backgroundSounds,'background moves do not sound over history');
    assert.equal(await evaluate('__state().latestPly'),3);
    assert.equal(await active(),'1. White: e4');
    await key('ArrowUp'); await ply(3);
    assert.ok(await evaluate(`Boolean(${shown('wn','f3')})`));
    await evaluate('__update(__fixture(2))'); await ply(2);
    assert.equal(await evaluate('__requests.length'),requestCount,'navigation must not call API');
    await key('ArrowLeft'); await ply(1);
    await evaluate('__update(__fixture(3,{status:"finished",finishedReason:"resignation",winner:"white"}))');
    await ply(1);
    assert.ok(await evaluate(`Boolean(${shown('bp','e7')})`));
    await key('ArrowUp'); await ply(3);
    assert.equal(await evaluate('__state().isActive'),false);
    await evaluate('__update(__fixture(2))'); await ply(2);
    console.log('PASS input guards, local-only navigation, live/history updates and completion while viewing past');

    const drag = await dragStart();
    await key('ArrowLeft'); await ply(1);
    await dragEnd(drag);
    assert.equal(await evaluate('__moves.length'),0);
    assert.equal(await evaluate(`[...document.querySelectorAll('[data-chess-board] img')].some(el=>el.style.transform)`),false);
    await key('ArrowUp'); await ply(2);
    await evaluate(`${shown('wn','g1')}.click()`);
    await evaluate(`document.querySelector('[data-square="f3"]').click()`);
    await waitFor('__moves.length===1');
    assert.deepEqual(await evaluate('__moves[0].body'),{gameId:'aaaaaaaaaaaaaaaaaaaaaaaa',pieceID:'server-g1',targetSquare:'f3'});
    await key('ArrowLeft'); await ply(1);
    await evaluate('__moves[0].resolve({game:__fixture(3),gameStatus:"playing"})');
    await waitFor('__state().latestPly===3 && !__state().isMovePending'); await ply(1);
    await key('ArrowUp'); await ply(3);
    console.log('PASS active drag cancellation and real-ID move response while viewing past');

    await evaluate('__update(__fixture(2))'); await ply(2);
    const validDrag = await dragStart(); await dragEnd(validDrag);
    await waitFor('__moves.length===2');
    assert.equal(await evaluate('__moves[1].body.pieceID'),'server-g1');
    await evaluate('__moves[1].resolve({game:__fixture(3),gameStatus:"playing"})');
    await waitFor('__state().latestPly===3 && !__state().isMovePending');
    console.log('PASS normal drag sends a move from the latest active board');

    await evaluate(`__update(__fixture(2,{pieces:[{id:'wk',piece:'wk',square:'e1'},{id:'bk',piece:'bk',square:'e8'},{id:'promoting-pawn',piece:'wp',square:'a7'}]}))`);
    await ply(2);
    await evaluate(`${shown('wp','a7')}.click()`);
    await evaluate(`document.querySelector('[data-square="a8"]').click()`);
    await waitFor(`document.querySelector('[class*="promotion"] button')`);
    await evaluate(`(() => {const el=document.querySelector('[class*="promotion"] button'); window.__oldPromotion=el[Object.keys(el).find(k=>k.startsWith('__reactProps'))].onClick;})()`);
    // Navigate away before invoking a captured callback, including after returning live.
    await key('ArrowDown'); await ply(0);
    await key('ArrowUp'); await ply(2);
    await evaluate('__oldPromotion()');
    assert.equal(await evaluate('__moves.length'),2);
    console.log('PASS promotion reset and detached callback cannot send after navigation');

    await click('1. White: e4'); await ply(1);
    const joins = await evaluate('__packets.filter(p=>p[0]==="game:join").length');
    const requests = await evaluate('__requests.length');
    await evaluate('__server=__fixture(3); __reconnect()');
    await waitFor(`__requests.length===${requests+1} && __state().latestPly===3`);
    assert.equal(await evaluate('__packets.filter(p=>p[0]==="game:join").length'),joins+1);
    await ply(1);
    await evaluate('__server=__fixture(0,{_id:"bbbbbbbbbbbbbbbbbbbbbbbb"}); __navigate("/game/bbbbbbbbbbbbbbbbbbbbbbbb")');
    await waitFor('__state().gameId==="bbbbbbbbbbbbbbbbbbbbbbbb"'); await ply(0);
    assert.equal(await evaluate('__state().selectedPly'),null);
    assert.ok(await evaluate('__packets.some(p=>p[0]==="game:leave" && p[1]==="aaaaaaaaaaaaaaaaaaaaaaaa")'));
    console.log('PASS reconnect rejoins/refetches preserving cursor, route change leaves old room and resets cursor');

    await evaluate('__update(__fixture(2,{_id:"bbbbbbbbbbbbbbbbbbbbbbbb",positionHistory:[]}))');
    await waitFor('document.querySelector("[role=status]")');
    await key('ArrowDown'); await ply(2);
    assert.ok(await evaluate(`Boolean(${shown('bp','e5')})`));
    assert.equal(await evaluate(`document.querySelector('button[aria-label="Initial position"]').disabled`),true);
    await evaluate('__update(__fixture(0,{_id:"bbbbbbbbbbbbbbbbbbbbbbbb"}))'); await ply(0);
    assert.equal(await evaluate('Boolean(document.querySelector("[role=status]"))'),false);
    await evaluate('__server=__fixture(2,{_id:"bbbbbbbbbbbbbbbbbbbbbbbb"}); __login("333333333333333333333333")');
    await waitFor('__state().gameId==="bbbbbbbbbbbbbbbbbbbbbbbb"'); await ply(2);
    const spectatorDrag = await dragStart(); await dragEnd(spectatorDrag);
    assert.equal(await evaluate('__moves.length'),2);
    console.log('PASS incomplete history fallback, valid empty game, spectator cannot drag/send');

    await evaluate('__server=__mate(); __login(); __renderGame()');
    await waitFor('__state().latestPly===4 && document.querySelector("[data-chess-board]")');
    await evaluate('__sounds=[]');
    await key('ArrowDown'); await ply(0);
    await key('ArrowUp'); await ply(4);
    await key('ArrowLeft'); await ply(3);
    await key('ArrowRight'); await ply(4);
    assert.deepEqual(await evaluate('__sounds'),Array(4).fill('/chess-sounds/move-check.mp3'));
    await key('ArrowUp'); await ply(4);
    assert.equal(await evaluate('__sounds.length'),4,'navigation at the boundary is silent');
    assert.equal(await evaluate(resultOpen),false);
    console.log('PASS checkmate rewind and all arrows never replay game-end');

    await evaluate('__server=__fixture(2); __login(); __renderGame()');
    await waitFor('__state().gameId==="aaaaaaaaaaaaaaaaaaaaaaaa" && __state().isActive && document.querySelector("[data-chess-board]")'); await ply(2);
    await evaluate('__sounds=[]; __update(__fixture(3,{status:"finished",finishedReason:"resignation",winner:"white"}))');
    await waitFor(resultOpen);
    assert.deepEqual(await evaluate('__sounds'),['/chess-sounds/game-end.mp3']);
    await click('Close game result');
    await waitFor(`!${resultOpen}`);
    await key('ArrowDown'); await key('ArrowUp'); await ply(3);
    assert.equal(await evaluate(resultOpen),false);
    await evaluate('__reconnect()');
    await pause(80);
    assert.equal(await evaluate(resultOpen),false);
    await evaluate('__sounds=[]; __renderGame()');
    await waitFor('document.querySelector("[data-chess-board]") && !__state().isActive');
    await pause(60);
    assert.equal(await evaluate(resultOpen),false,'reopening a completed game never shows the result');
    assert.deepEqual(await evaluate('__sounds'),[],'reopening a completed game is silent');
    console.log('PASS result appears once for live participant completion, never on rewind, reconnect or finished-game entry');

    await evaluate('__server=__fixture(2); __renderGame()');
    await waitFor('__state().isActive && document.querySelector("[data-chess-board]")'); await ply(2);
    await evaluate('__sounds=[]; __server=__fixture(3,{status:"finished",finishedReason:"resignation"}); __renderGame()');
    await waitFor('!__state().isActive && document.querySelector("[data-chess-board]")');
    assert.equal(await evaluate(resultOpen),false,'cached active state must not turn replay entry into live completion');
    assert.deepEqual(await evaluate('__sounds'),[]);

    await evaluate('__server=__fixture(2); __renderGame()');
    await waitFor('__state().isActive && document.querySelector("[data-chess-board]")');
    await key('ArrowLeft'); await ply(1);
    await evaluate('__update(__fixture(3,{status:"finished",finishedReason:"resignation"}))');
    await key('ArrowUp'); await ply(3);
    assert.equal(await evaluate(resultOpen),false,'completion while viewing history must not appear on return');
    await evaluate('__server=__fixture(2); __login("333333333333333333333333"); __renderGame()');
    await waitFor('__state().isActive && document.querySelector("[data-chess-board]")');
    await evaluate('__update(__fixture(3,{status:"finished",finishedReason:"resignation"}))');
    await waitFor('!__state().isActive');
    assert.equal(await evaluate(resultOpen),false,'spectators do not see the result modal');
    console.log('PASS cached active-game entry, completion in history and spectators keep result hidden');

    await evaluate('__server=__fixture(2,{status:"finished",finishedReason:"resignation"}); __renderGame()');
    await waitFor('__state().latestPly===2 && !__state().isActive && document.querySelector("[data-chess-board]")');
    await click('1. White: e4'); await ply(1);
    const analysisRequests = await evaluate('__moves.length');
    const recorded = await evaluate('JSON.stringify({pieces:__state().pieces,moves:__state().moves,history:__state().positionHistory,turn:__state().currentTurn})');
    const recordedRows = await evaluate(`document.querySelectorAll('[aria-label*=". White:"], [aria-label*=". Black:"]').length`);
    assert.deepEqual(await highlightedPlayer(),['black']);
    const localDrag = await dragStart('bp','c7','c5'); await dragEnd(localDrag);
    await waitFor('__state().variation?.rootPly===1'); await ply(2);
    assert.equal(await active(),'1. White: e4');
    assert.deepEqual(await highlightedPlayer(),['white']);
    await clickMove('wn','g1','f3'); await ply(3);
    assert.equal(await active(),'1. White: e4');
    assert.deepEqual(await highlightedPlayer(),['black']);
    assert.deepEqual(await highlights(),['f3','g1']);
    assert.equal(await evaluate('__moves.length'),analysisRequests);
    assert.equal(await evaluate(`document.querySelectorAll('[aria-label*=". White:"], [aria-label*=". Black:"]').length`),recordedRows);
    assert.equal(await evaluate('JSON.stringify({pieces:__state().pieces,moves:__state().moves,history:__state().positionHistory,turn:__state().currentTurn})'),recorded);
    await key('ArrowLeft'); await ply(2);
    assert.ok(await evaluate(`Boolean(${shown('wn','g1')})`));
    await key('ArrowRight'); await ply(3);
    await key('ArrowDown'); await ply(0);
    assert.ok(await evaluate(`Boolean(${shown('wp','e2')})`));
    assert.equal(await active(),'1. White: e4');
    await key('ArrowUp'); await ply(3);
    assert.ok(await evaluate(`Boolean(${shown('bp','c5')})`));
    await key('ArrowLeft'); await ply(2);
    await clickMove('wp','d2','d4'); await ply(3);
    assert.ok(await evaluate(`Boolean(${shown('wn','g1')})`),'new continuation replaces the discarded local future');
    await click('1. White: e4'); await ply(1);
    assert.equal(await evaluate('__state().variation'),null);
    assert.ok(await evaluate(`Boolean(${shown('bp','c7')})`));
    assert.ok(await evaluate(`Boolean(${shown('bp','e7')})`));
    assert.deepEqual(await highlightedPlayer(),['black']);
    console.log('PASS local drag/click moves for both sides, pinned root, navigation, replace continuation and same-move reset without API or new sidebar rows');

    await click('Initial position'); await ply(0);
    await clickMove('wp','e2','e4'); await ply(1);
    assert.equal(await evaluate('__state().variation.rootPly'),0);
    assert.equal(await active(),null);
    await evaluate(`[...document.querySelectorAll('button')].find(el=>el.textContent==='Return to recorded position').click()`);
    await ply(0);
    assert.equal(await evaluate('__state().variation'),null);
    assert.ok(await evaluate(`Boolean(${shown('wp','e2')})`));

    await evaluate(`__server=__fixture(2,{status:'finished',finishedReason:'resignation',
        positionHistory:['8/P7/7k/8/8/8/8/4K3 b - -','8/P7/7k/8/8/8/8/4K3 w - -'],
        pieces:[{id:'wk',piece:'wk',square:'e1'},{id:'bk',piece:'bk',square:'h6'},{id:'promotion',piece:'wp',square:'a7'}]}); __renderGame()`);
    await waitFor(`Boolean(${shown('wp','a7')})`); await ply(2);
    await clickMove('wp','a7','a8');
    await waitFor(`document.querySelector('[class*="promotion"] button')`);
    await evaluate(`(() => {const el=document.querySelector('[class*="promotion"] button'); window.__oldLocalPromotion=el[Object.keys(el).find(k=>k.startsWith('__reactProps'))].onClick;})()`);
    await click('1. White: e4'); await click('1. Black: e5'); await ply(2);
    await evaluate('__oldLocalPromotion()');
    assert.equal(await evaluate('__state().variation'),null);
    await clickMove('wp','a7','a8');
    await waitFor(`document.querySelector('[class*="promotion"] button')`);
    await evaluate(`document.querySelector('[class*="promotion"] img[alt="wn"]').closest('button').click()`);
    await ply(3);
    assert.ok(await evaluate(`Boolean(${shown('wn','a8')})`));
    assert.equal(await active(),'1. Black: e5');
    assert.equal(await evaluate('__moves.length'),analysisRequests);
    await click('1. Black: e5'); await ply(2);
    assert.ok(await evaluate(`Boolean(${shown('wp','a7')})`));
    console.log('PASS analysis from initial/final positions, local underpromotion and cancelled promotion callbacks');

    await evaluate('__server=__fixture(2); __login(); __renderGame()');
    await waitFor('__state().isActive && __state().latestPly===2 && document.querySelector("[data-chess-board]")');
    await click('1. White: e4'); await ply(1);
    await clickMove('bp','c7','c5'); await ply(2);
    await evaluate('__sounds=[]; __update(__fixture(3)); __reconnect()');
    await waitFor('__state().latestPly===3');
    assert.equal(await evaluate('__state().variation.rootPly'),1);
    assert.ok(await evaluate(`Boolean(${shown('bp','c5')})`));
    assert.ok(await evaluate(`Boolean(${shown('wn','g1')})`));
    assert.deepEqual(await highlightedPlayer(),['white'],'server turn does not override local turn');
    await evaluate('__update(__fixture(3,{status:"finished",finishedReason:"resignation"}))');
    await pause(60);
    assert.equal(await evaluate(resultOpen),false);
    assert.deepEqual(await evaluate('__sounds'),[]);
    await click('1. White: e4'); await ply(1);
    await click('Latest position'); await ply(3);
    assert.ok(await evaluate(`Boolean(${shown('wn','f3')})`));
    assert.equal(await evaluate('__moves.length'),analysisRequests);
    console.log('PASS live game updates, reconnect and completion preserve a local variation, and returning restores the newest recorded board');

    await evaluate('__server=__fixture(2,{status:"finished",finishedReason:"resignation"}); __login("222222222222222222222222"); __renderGame()');
    await waitFor('__state().latestPly===2 && !__state().isActive && document.querySelector("[data-chess-board]")');
    assert.equal(await evaluate(`document.querySelector('[data-row="0"][data-col="0"]').dataset.square`),'h1');
    assert.deepEqual(await highlightedPlayer(),['white']);
    await verifyBoardArrows(true);
    const oppositeSide = await dragStart('wn','g1','f3'); await dragEnd(oppositeSide); await ply(3);
    assert.equal(await active(),'1. Black: e5');
    assert.deepEqual(await highlightedPlayer(),['black']);
    assert.equal(await evaluate('__moves.length'),analysisRequests);
    await click('1. Black: e5'); await ply(2);
    assert.ok(await evaluate(`Boolean(${shown('wn','g1')})`));
    console.log('PASS a black participant can analyze white moves by drag on the flipped board');
    await evaluate('__server=__fixture(3,{status:"finished",finishedReason:"resignation"}); __login(); __renderGame()');
    await waitFor('__state().latestPly===3 && !__state().isActive && document.querySelector("[data-chess-board]")');

    await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await click('1. White: e4'); await ply(1);
    assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'),true);
    await writeFile('/private/tmp/chesshub-move-navigation-mobile.png',Buffer.from((await command('Page.captureScreenshot',{format:'png'})).data,'base64'));
    assert.deepEqual(errors,[]);
    await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    assert.equal(await evaluate(`getComputedStyle(${shown('wp','e4')}).transitionDuration`),'0s');
    console.log('PASS mobile 390px layout, reduced motion, no runtime exceptions');
} finally {
    await command('Page.close');
    ws.close();
}
