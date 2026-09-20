import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import express from 'express';
import type { Firestore } from 'firebase-admin/firestore';
import { createApostilaIngestRouter } from './apostilaIngestRoutes';

const SECRET = 'segredo-de-teste-1234567890';

interface Write { collection: string; id: string; data: Record<string, unknown> }

function fakeFirestore(writes: Write[]): Firestore {
  return {
    collection: (collection: string) => ({
      doc: (id: string) => ({
        set: async (data: Record<string, unknown>) => { writes.push({ collection, id, data }); },
      }),
    }),
  } as unknown as Firestore;
}

// Monta o roteador como o server.ts monta: sem nenhum parser de corpo antes
// dele. Quem lê o corpo, e quando, é problema do próprio roteador.
async function withServer(ingestSecret: string | undefined, run: (baseUrl: string, writes: Write[]) => Promise<void>) {
  const writes: Write[] = [];
  const app = express();
  // Em 'test' o handler de erro padrão do Express responde sem imprimir o
  // stack; o 400 do parser para JSON malformado é esperado.
  app.set('env', 'test');
  app.use('/api/internal', createApostilaIngestRouter(fakeFirestore(writes), ingestSecret));
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${port}`, writes);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function ingest(baseUrl: string, body: string, secret?: string) {
  return fetch(`${baseUrl}/api/internal/apostila-references`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(secret === undefined ? {} : { 'x-ingest-secret': secret }),
    },
    body,
  });
}

const payloadValido = JSON.stringify({
  subject: 'Biologia',
  topics: {
    'bio-fungos': [{ chapter: 'Reino Fungi', volume: '2', startPage: 10, endPage: 14, text: 'Hifas formam o micélio.' }],
    'bio-desconhecido': [{ chapter: 'X', volume: '1', startPage: 1, endPage: 1, text: 'sem tópico conhecido' }],
  },
  knownTopics: [{ id: 'bio-fungos', name: 'Fungos' }],
});

test('sem o header do segredo a requisição é negada e nada é gravado', async () => {
  await withServer(SECRET, async (baseUrl, writes) => {
    const res = await ingest(baseUrl, payloadValido);
    assert.equal(res.status, 401);
    assert.equal(((await res.json()) as { code: string }).code, 'INGEST_UNAUTHORIZED');
    assert.deepEqual(writes, []);
  });
});

test('segredo errado com corpo que nem é JSON válido é negado com 401, não 400', async () => {
  await withServer(SECRET, async (baseUrl, writes) => {
    const res = await ingest(baseUrl, '{"quebrado":', 'segredo-errado-12345678901');
    assert.equal(res.status, 401);
    assert.equal(((await res.json()) as { code: string }).code, 'INGEST_UNAUTHORIZED');
    assert.deepEqual(writes, []);
  });
});

test('sem segredo configurado no servidor, nada é aceito nem com header vazio', async () => {
  await withServer(undefined, async (baseUrl, writes) => {
    const res = await ingest(baseUrl, payloadValido, '');
    assert.equal(res.status, 401);
    assert.deepEqual(writes, []);
  });
});

test('com o segredo certo o roteador lê o próprio corpo e grava só o tópico conhecido', async () => {
  await withServer(SECRET, async (baseUrl, writes) => {
    const res = await ingest(baseUrl, payloadValido, SECRET);
    assert.equal(res.status, 200);
    const body = await res.json() as { written: string[]; skipped: string[] };
    assert.equal(body.written.length, 1);
    assert.deepEqual(body.skipped, ['bio-desconhecido']);

    assert.equal(writes.length, 1);
    assert.equal(writes[0].collection, 'apostilaReferencias');
    assert.equal(writes[0].id, body.written[0]);
    assert.equal(writes[0].data.topicName, 'Fungos');
    assert.equal(writes[0].data.text, 'Hifas formam o micélio.');
  });
});

test('com o segredo certo, JSON malformado volta 400 do parser e nada é gravado', async () => {
  await withServer(SECRET, async (baseUrl, writes) => {
    const res = await ingest(baseUrl, '{"quebrado":', SECRET);
    assert.equal(res.status, 400);
    assert.deepEqual(writes, []);
  });
});
