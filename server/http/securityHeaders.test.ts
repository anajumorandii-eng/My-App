import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import express from 'express';
import { securityHeaders } from './securityHeaders';

async function withServer(options: { hsts: boolean }, run: (baseUrl: string) => Promise<void>) {
  // O Express liga X-Powered-By sozinho, como no server.ts; a política precisa
  // dar conta de tirá-lo, não depender de app.disable.
  const app = express();
  app.use(securityHeaders(options));
  app.get('/ok', (_req, res) => res.json({ ok: true }));
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('toda resposta leva os cabeçalhos de proteção básicos', async () => {
  await withServer({ hsts: false }, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/ok`);
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.equal(res.headers.get('content-security-policy'), "frame-ancestors 'none'");
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.equal(res.headers.get('permissions-policy'), 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  });
});

test('as respostas de erro também levam os cabeçalhos, não só as rotas que existem', async () => {
  await withServer({ hsts: false }, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/nao-existe`);
    assert.equal(res.status, 404);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
  });
});

test('o cabeçalho X-Powered-By, que o Express liga por padrão, é removido', async () => {
  await withServer({ hsts: false }, async (baseUrl) => {
    const res = await fetch(`${baseUrl}/ok`);
    assert.equal(res.headers.get('x-powered-by'), null);
  });
});

test('HSTS só é enviado quando pedido, para não fixar HTTPS em ambiente de desenvolvimento', async () => {
  await withServer({ hsts: false }, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/ok`)).headers.get('strict-transport-security'), null);
  });
  await withServer({ hsts: true }, async (baseUrl) => {
    assert.equal((await fetch(`${baseUrl}/ok`)).headers.get('strict-transport-security'), 'max-age=15552000');
  });
});

test('server.ts monta os cabeçalhos antes de qualquer outro middleware e só liga HSTS em produção', async () => {
  const source = await readFile(new URL('../../server.ts', import.meta.url), 'utf-8');

  const headers = source.indexOf('app.use(securityHeaders(');
  const compression = source.indexOf('app.use(compression())');
  assert.ok(headers > -1, 'server.ts precisa montar securityHeaders');
  assert.ok(compression > -1);
  assert.ok(headers < compression, 'securityHeaders precisa vir antes do primeiro middleware');

  assert.match(source, /securityHeaders\(\{\s*hsts:\s*process\.env\.NODE_ENV === 'production'\s*\}\)/);
});
