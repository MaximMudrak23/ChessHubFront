import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { createServer } from 'vite';

const server = await createServer({
    server: { middlewareMode: true, watch: null, ws: false },
    appType: 'custom',
});
after(() => server.close());
const { loadYouTubeApi } = await server.ssrLoadModule('/src/pages/MainPage/components/VideoPlayer/youtubeApi.ts');

test('YouTube API shares loading, retries network failures and timeouts, and preserves existing ready callbacks', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
    const previousDocument = Object.getOwnPropertyDescriptor(globalThis, 'document');
    t.after(() => {
        if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
        else Reflect.deleteProperty(globalThis, 'window');
        if (previousDocument) Object.defineProperty(globalThis, 'document', previousDocument);
        else Reflect.deleteProperty(globalThis, 'document');
    });

    const scripts = [];
    const previousReady = t.mock.fn();
    const window = {
        setTimeout: globalThis.setTimeout,
        clearTimeout: globalThis.clearTimeout,
        onYouTubeIframeAPIReady: previousReady,
    };
    Object.defineProperty(globalThis, 'window', { configurable: true, value: window });
    Object.defineProperty(globalThis, 'document', {
        configurable: true,
        value: {
            createElement: name => {
                assert.equal(name, 'script');
                return { remove() { this.removed = true; } };
            },
            head: { append: script => scripts.push(script) },
        },
    });

    const first = loadYouTubeApi();
    assert.equal(loadYouTubeApi(), first);
    assert.equal(scripts.length, 1);
    assert.equal(scripts[0].src, 'https://www.youtube.com/iframe_api');
    assert.equal(scripts[0].async, true);
    const firstRejected = assert.rejects(first, /could not load/);
    scripts[0].onerror();
    await firstRejected;
    assert.equal(scripts[0].removed, true);
    assert.equal(window.onYouTubeIframeAPIReady, previousReady);

    const second = loadYouTubeApi();
    assert.notEqual(second, first);
    assert.equal(scripts.length, 2);
    const secondRejected = assert.rejects(second, /could not load/);
    t.mock.timers.tick(15_000);
    await secondRejected;
    assert.equal(scripts[1].removed, true);
    assert.equal(window.onYouTubeIframeAPIReady, previousReady);

    const third = loadYouTubeApi();
    const api = { Player: class {} };
    window.YT = api;
    window.onYouTubeIframeAPIReady();
    assert.equal(await third, api);
    assert.equal(await loadYouTubeApi(), api);
    assert.equal(scripts.length, 3);
    assert.equal(previousReady.mock.callCount(), 1);
    assert.equal(window.onYouTubeIframeAPIReady, previousReady);
    t.mock.timers.tick(30_000);
    assert.notEqual(scripts[2].removed, true, 'Loaded script is retained');
});
