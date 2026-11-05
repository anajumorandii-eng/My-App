import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { firebaseAuthProxy } from './firebaseAuthProxy';
import { securityHeaders } from './securityHeaders';

test('auth helpers retain query, allow same-origin frames and fail closed', async () => {
  const originalFetch = globalThis.fetch;
  const app = express();
  app.use('/__/auth', firebaseAuthProxy());
  app.use(securityHeaders({ hsts: false }));
  app.get('*', (_req, res) => res.send('app'));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening', resolve));
  const address = server.address() as { port: number };
  const base = `http://127.0.0.1:${address.port}`;
  let fail = false;
  globalThis.fetch = async (input, init) => {
    assert.equal(input, 'https://gen-lang-client-0346381323.firebaseapp.com/__/auth/iframe?apiKey=example');
    assert.equal(init?.redirect, 'manual');
    if (fail) throw new Error('upstream unavailable');
    return new Response('<script>helper</script>', { headers: { 'content-type': 'text/html' } });
  };
  try {
    const helper = await originalFetch(`${base}/__/auth/iframe?apiKey=example`);
    assert.equal(helper.status, 200);
    assert.equal(helper.headers.get('x-frame-options'), null);
    assert.equal(helper.headers.get('cache-control'), 'no-store');
    assert.equal(await helper.text(), '<script>helper</script>');
    assert.equal((await originalFetch(base)).headers.get('x-frame-options'), 'DENY');
    assert.equal((await originalFetch(`${base}/__/auth/handler`, { method: 'POST' })).status, 405);
    fail = true;
    assert.equal((await originalFetch(`${base}/__/auth/iframe?apiKey=example`)).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    server.close();
    server.closeAllConnections();
  }
});
