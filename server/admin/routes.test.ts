import assert from 'node:assert/strict';
import test from 'node:test';
import type { Firestore } from 'firebase-admin/firestore';
import { FakeFirestore } from '../testing/fakeFirestore';
import { withApp, sendJson } from '../testing/httpTestServer';
import { createAdminRouter } from './routes';

interface Day {
  date: string;
  requests: number;
  failures: number;
  cached: number;
  fallbacks: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

function utcDate(daysAgo: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

async function metrics(db: Firestore) {
  let days: Day[] = [];
  await withApp((app) => {
    app.use('/api/admin', createAdminRouter(db));
  }, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'GET', '/api/admin/metrics');
    assert.equal(res.status, 200);
    days = ((await res.json()) as { days: Day[] }).days;
  });
  return days;
}

test('devolve os últimos 7 dias em UTC, do mais recente para o mais antigo', async () => {
  const days = await metrics(new FakeFirestore().asFirestore());
  assert.deepEqual(days.map((day) => day.date), [0, 1, 2, 3, 4, 5, 6].map(utcDate));
});

test('soma os segmentos de cada dia e trata campo ausente como zero', async () => {
  const db = new FakeFirestore()
    .seed(`aiMetricDays/${utcDate(0)}/segments/resumo`, { requests: 10, failures: 1, cached: 4, fallbacks: 2, totalTokens: 1500, estimatedCostUsd: 0.25 })
    .seed(`aiMetricDays/${utcDate(0)}/segments/questao`, { requests: 5, totalTokens: 500, estimatedCostUsd: 0.5 })
    .seed(`aiMetricDays/${utcDate(2)}/segments/resumo`, { requests: 3 });

  const days = await metrics(db.asFirestore());

  assert.deepEqual(days[0], { date: utcDate(0), requests: 15, failures: 1, cached: 4, fallbacks: 2, totalTokens: 2000, estimatedCostUsd: 0.75 });
  assert.equal(days[2].requests, 3);
  assert.equal(days[1].requests, 0, 'dia sem segmentos vem zerado, não some da lista');
});

test('falha ao ler o Firestore vira 500 com código próprio, sem repassar o erro', async (t) => {
  t.mock.method(console, 'error', () => undefined);
  const quebrado = { collection: () => { throw new Error('credencial interna vazada'); } } as unknown as Firestore;

  await withApp((app) => {
    app.use('/api/admin', createAdminRouter(quebrado));
  }, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'GET', '/api/admin/metrics');
    assert.equal(res.status, 500);
    const corpo = await res.text();
    assert.match(corpo, /ADMIN_METRICS_FAILED/);
    assert.doesNotMatch(corpo, /credencial interna/);
  });
});
