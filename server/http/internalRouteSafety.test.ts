import assert from 'node:assert/strict';
import test from 'node:test';
import type { Request, Response, Router } from 'express';
import type { Firestore } from 'firebase-admin/firestore';
import { createReviewReminderRouter } from '../push/routes';
import { createApostilaIngestRouter } from '../admin/apostilaIngestRoutes';

function handler(router: Router, index: number) {
  return router.stack[0].route.stack[index].handle as (req: Request, res: Response, next: () => void) => Promise<unknown>;
}
function response() {
  const result = { status: 200, body: undefined as unknown };
  const res = {
    status(code: number) { result.status = code; return this; },
    json(body: unknown) { result.body = body; return this; },
  } as unknown as Response;
  return { result, res };
}
const unavailableDb = { collection: () => ({
  listDocuments: async () => { throw new Error('database unavailable'); },
  doc: () => ({ set: async () => { throw new Error('database unavailable'); } }),
}) } as unknown as Firestore;

test('cron rejects equal character counts with unequal UTF-8 byte lengths without throwing', async () => {
  const { res, result } = response();
  await handler(createReviewReminderRouter(unavailableDb, null, 'abcdefgh'), 0)(
    { headers: { 'x-cron-secret': 'é'.repeat(8) } } as unknown as Request, res, () => {});
  assert.equal(result.status, 401);
});

test('ingest rejects unequal UTF-8 byte lengths before reading its body', async () => {
  const { res, result } = response();
  let next = false;
  await handler(createApostilaIngestRouter(unavailableDb, 'abcdefgh'), 0)(
    { headers: { 'x-ingest-secret': 'é'.repeat(8) } } as unknown as Request, res, () => { next = true; });
  assert.equal(result.status, 401);
  assert.equal(next, false);
});

test('reminder database outage resolves the async handler with 503', async () => {
  const { res, result } = response();
  await handler(createReviewReminderRouter(unavailableDb, { publicKey: 'pub', privateKey: 'priv', subject: 'mailto:a@example.com' }, 'abcdefgh'), 0)(
    { headers: { 'x-cron-secret': 'abcdefgh' } } as unknown as Request, res, () => {});
  assert.equal(result.status, 503);
  assert.deepEqual(result.body, { error: 'Não foi possível carregar as inscrições de notificação.', code: 'PUSH_REMINDERS_UNAVAILABLE' });
});

test('ingest write outage resolves the async handler with 503', async () => {
  const router = createApostilaIngestRouter(unavailableDb, 'abcdefgh');
  const { res, result } = response();
  await handler(router, router.stack[0].route.stack.length - 1)({ body: {
    subject: 'Biologia', knownTopics: [{ id: 'fungos', name: 'Fungos' }],
    topics: { fungos: [{ chapter: 'Fungi', volume: '1', text: 'Hifas' }] },
  } } as Request, res, () => {});
  assert.equal(result.status, 503);
});

test('internal routes keep serving requests after invalid secrets and database outages', async () => {
  const express = (await import('express')).default;
  const app = express();
  app.use('/push', createReviewReminderRouter(unavailableDb, { publicKey: 'pub', privateKey: 'priv', subject: 'mailto:a@example.com' }, 'abcdefgh'));
  app.use('/ingest', createApostilaIngestRouter(unavailableDb, 'abcdefgh'));
  app.get('/health', (_req, res) => res.sendStatus(200));
  const server = app.listen(0);
  try {
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const base = `http://127.0.0.1:${(server.address() as import('node:net').AddressInfo).port}`;
    for (const secret of ['é'.repeat(8), 'abcdefgh']) {
      const reminder = await fetch(`${base}/push/send-review-reminders`, { method: 'POST', headers: { 'x-cron-secret': secret } });
      assert.equal(reminder.status, secret === 'abcdefgh' ? 503 : 401);
      await reminder.arrayBuffer();
      const ingest = await fetch(`${base}/ingest/apostila-references`, { method: 'POST', headers: { 'x-ingest-secret': secret, 'Content-Type': 'application/json' }, body: JSON.stringify({ subject: 'Biologia', knownTopics: [{ id: 'fungos', name: 'Fungos' }], topics: { fungos: [{ chapter: 'Fungi', volume: '1', text: 'Hifas' }] } }) });
      assert.equal(ingest.status, secret === 'abcdefgh' ? 503 : 401);
      await ingest.arrayBuffer();
      const health = await fetch(`${base}/health`);
      assert.equal(health.status, 200);
      await health.arrayBuffer();
    }
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
