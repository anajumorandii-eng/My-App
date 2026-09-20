import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import express, { RequestHandler } from 'express';
import { jsonBodyAfter } from './jsonBodyAfter';

async function withServer(mount: (app: express.Express) => void, run: (baseUrl: string) => Promise<void>) {
  const app = express();
  // Em 'test' o handler de erro padrão do Express responde sem imprimir o
  // stack; os erros de parser (400, 413) aqui são esperados.
  app.set('env', 'test');
  mount(app);
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function post(baseUrl: string, body: string) {
  return fetch(`${baseUrl}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
}

const deny: RequestHandler = (_req, res) => {
  res.status(401).json({ code: 'DENIED' });
};

// Guarda assíncrona de propósito: adminAuthMiddleware() confere o token no
// Firebase antes de responder, e um parser mal posicionado só perde a corrida
// contra uma guarda que demora.
const denyLater: RequestHandler = async (_req, res) => {
  await new Promise((resolve) => setImmediate(resolve));
  res.status(401).json({ code: 'DENIED' });
};

const allow: RequestHandler = (_req, _res, next) => next();

test('a guarda recusa antes de o parser ler um corpo que nem é JSON válido', async () => {
  await withServer((app) => {
    app.post('/upload', ...jsonBodyAfter('1kb', denyLater), (_req, res) => res.json({ ok: true }));
  }, async (baseUrl) => {
    // Com o parser na frente, este corpo quebraria com 400 antes de a guarda ser consultada.
    const res = await post(baseUrl, '{"quebrado":');
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { code: 'DENIED' });
  });
});

test('a guarda recusa antes de o parser medir um corpo acima do limite', async () => {
  await withServer((app) => {
    app.post('/upload', ...jsonBodyAfter('1kb', deny), (_req, res) => res.json({ ok: true }));
  }, async (baseUrl) => {
    // Com o parser na frente, este corpo de 2 KB voltaria 413 sem passar pela guarda.
    const res = await post(baseUrl, JSON.stringify({ texto: 'a'.repeat(2048) }));
    assert.equal(res.status, 401);
  });
});

test('com a guarda liberando, o parser roda e aplica o limite pedido', async () => {
  await withServer((app) => {
    app.post('/upload', ...jsonBodyAfter('1kb', allow), (req, res) => res.json({ recebido: req.body }));
  }, async (baseUrl) => {
    const pequeno = await post(baseUrl, JSON.stringify({ a: 1 }));
    assert.equal(pequeno.status, 200);
    assert.deepEqual(await pequeno.json(), { recebido: { a: 1 } });

    const grande = await post(baseUrl, JSON.stringify({ texto: 'a'.repeat(2048) }));
    assert.equal(grande.status, 413);
  });
});

test('as guardas rodam na ordem dada e a primeira que responde encerra a cadeia', async () => {
  const ordem: string[] = [];
  const primeira: RequestHandler = (_req, _res, next) => { ordem.push('primeira'); next(); };
  const segunda: RequestHandler = (_req, res) => { ordem.push('segunda'); res.status(403).json({ code: 'FORBIDDEN' }); };
  const terceira: RequestHandler = (_req, _res, next) => { ordem.push('terceira'); next(); };

  await withServer((app) => {
    app.post('/upload', ...jsonBodyAfter('1kb', primeira, segunda, terceira), (_req, res) => {
      ordem.push('handler');
      res.json({ ok: true });
    });
  }, async (baseUrl) => {
    const res = await post(baseUrl, '{}');
    assert.equal(res.status, 403);
    assert.deepEqual(ordem, ['primeira', 'segunda']);
  });
});

test('server.ts só monta o parser global de 64kb solto; os grandes passam por jsonBodyAfter', async () => {
  const source = await readFile(new URL('../../server.ts', import.meta.url), 'utf-8');

  const parsersSoltos = [...source.matchAll(/express\.json\([^)]*\)/g)].map((m) => m[0].replace(/\s+/g, ' '));
  assert.deepEqual(parsersSoltos, ["express.json({ limit: '64kb' })"]);

  assert.match(source, /jsonBodyAfter\('50mb',\s*adminAuthMiddleware\(\),\s*requireAdmin\)/);
});
