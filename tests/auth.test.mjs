import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { setImmediate } from 'node:timers/promises';
import { createServer } from 'vite';

const server = await createServer({
    server: { middlewareMode: true, watch: null, ws: false },
    appType: 'custom',
});
after(() => server.close());

const { login, registerStart } = await server.ssrLoadModule('/src/api/authApi.ts');
const { pollRegisterStatus } = await server.ssrLoadModule(
    '/src/pages/WelcomePage/components/WelcomeForm/components/InputsFolder/components/SignUpWaitingEmail/pollRegisterStatus.ts'
);

const email = 'player+chess@example.com';
const password = 'test-password';
const key = 'test-invite';
const user = { id: 'test-user', email };
const auth = { token: 'test-token', user };

function json(data, status = 200) {
    return Response.json(data, { status });
}

async function tick(t, milliseconds = 3000) {
    t.mock.timers.tick(milliseconds);
    await setImmediate();
}

test('email registration waits for verification, stops polling, then logs in separately', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const responses = [
        json({ message: 'Verification email sent' }),
        json({ verified: false }),
        json({ verified: true }),
        json({ message: 'Login success', ...auth }),
    ];
    const fetch = t.mock.method(globalThis, 'fetch', async () => {
        assert.ok(responses.length, 'Unexpected extra request');
        return responses.shift();
    });
    const onVerified = t.mock.fn();

    assert.deepEqual(await registerStart(email, password, key), {
        message: 'Verification email sent',
    });
    const registration = fetch.mock.calls[0].arguments;
    assert.equal(new URL(registration[0]).pathname, '/auth/register/start');
    assert.equal(registration[1].method, 'POST');
    assert.deepEqual(JSON.parse(registration[1].body), { email, password, key });

    const stop = pollRegisterStatus(email, onVerified);
    t.after(stop);
    await tick(t);
    assert.equal(onVerified.mock.callCount(), 0);

    const statusRequest = fetch.mock.calls[1].arguments;
    assert.equal(new URL(statusRequest[0]).pathname, '/auth/register/status');
    assert.equal(new URL(statusRequest[0]).searchParams.get('email'), email);
    assert.equal(statusRequest[1], undefined, 'Status uses GET without credentials in the body');

    await tick(t);
    assert.equal(onVerified.mock.callCount(), 1);
    assert.deepEqual(onVerified.mock.calls[0].arguments, []);
    await tick(t, 30_000);
    assert.equal(fetch.mock.callCount(), 3, 'Verification must stop polling and must not call login');

    assert.deepEqual(await login(email, password), { message: 'Login success', ...auth });
    const signIn = fetch.mock.calls[3].arguments;
    assert.equal(new URL(signIn[0]).pathname, '/auth/login');
    assert.equal(signIn[1].method, 'POST');
    assert.equal(signIn[1].headers['Content-Type'], 'application/json');
    assert.deepEqual(JSON.parse(signIn[1].body), { email, password });
});

test('registration without email verification preserves the 201 token and user', async t => {
    t.mock.method(globalThis, 'fetch', async () => json({ message: 'User created', ...auth }, 201));

    assert.deepEqual(await registerStart(email, password, key), {
        message: 'User created',
        ...auth,
    });
});

test('stopping polling cancels the next request', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    const fetch = t.mock.method(globalThis, 'fetch', async () => json({ verified: false }));
    const onVerified = t.mock.fn();
    const stop = pollRegisterStatus(email, onVerified);
    t.after(stop);

    await tick(t);
    stop();
    await tick(t, 30_000);
    assert.equal(fetch.mock.callCount(), 1);
    assert.equal(onVerified.mock.callCount(), 0);
});

test('a pending request cannot open sign-in after polling is stopped', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    let resolveRequest;
    const fetch = t.mock.method(globalThis, 'fetch', () => new Promise(resolve => {
        resolveRequest = resolve;
    }));
    const onVerified = t.mock.fn();
    const stop = pollRegisterStatus(email, onVerified);
    t.after(stop);

    await tick(t);
    await tick(t, 30_000);
    assert.equal(fetch.mock.callCount(), 1, 'Slow status requests must not overlap');
    stop();
    resolveRequest(json({ verified: true }));
    await setImmediate();
    await tick(t, 30_000);
    assert.equal(onVerified.mock.callCount(), 0);
    assert.equal(fetch.mock.callCount(), 1);
});

test('polling retries after a status error and stops once verified', async t => {
    t.mock.timers.enable({ apis: ['setTimeout'] });
    t.mock.method(console, 'log', () => {});
    const responses = [json({ message: 'Temporary failure' }, 500), json({ verified: true })];
    const fetch = t.mock.method(globalThis, 'fetch', async () => responses.shift());
    const onVerified = t.mock.fn();
    const stop = pollRegisterStatus(email, onVerified);
    t.after(stop);

    await tick(t);
    assert.equal(onVerified.mock.callCount(), 0);
    await tick(t);
    assert.equal(onVerified.mock.callCount(), 1);
    await tick(t, 30_000);
    assert.equal(fetch.mock.callCount(), 2);
});

test('login reports backend errors instead of authenticating', async t => {
    t.mock.method(globalThis, 'fetch', async () => json({ message: 'Invalid credentials' }, 401));

    await assert.rejects(login(email, 'wrong-password'), { message: 'Invalid credentials' });
});
