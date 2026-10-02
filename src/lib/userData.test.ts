import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import type { StudySessionRecord, TopicMastery } from '../types';

type MockTransaction = {
  get: (ref: unknown) => Promise<{ exists: () => boolean; data: () => { items: TopicMastery[] } }>;
  set: (ref: unknown, data: { items?: TopicMastery[] }, options?: unknown) => void;
};

type FirestoreMock = {
  collection: (_db: unknown, ...path: string[]) => { path: string };
  doc: () => void;
  getDoc: () => unknown;
  getDocs: () => Promise<{ docs: { data: () => StudySessionRecord }[] }>;
  orderBy: (field: string, direction: string) => { field: string; direction: string };
  limit: (count: number) => { limit: number };
  query: (ref: unknown, ...constraints: unknown[]) => { ref: unknown; constraints: unknown[] };
  runTransaction: <T>(db: unknown, update: (transaction: MockTransaction) => Promise<T>) => Promise<T>;
  serverTimestamp: () => void;
  setDoc: () => void;
};

const firestoreMock: FirestoreMock = {
  collection: (_db, ...path) => ({ path: path.join('/') }),
  doc: () => undefined,
  getDoc: () => undefined,
  getDocs: async () => ({ docs: [] }),
  orderBy: (field, direction) => ({ field, direction }),
  limit: (count) => ({ limit: count }),
  query: (ref, ...constraints) => ({ ref, constraints }),
  runTransaction: async () => { throw new Error("Transaction not configured"); },
  serverTimestamp: () => undefined,
  setDoc: () => undefined,
};

(globalThis as typeof globalThis & { userDataFirestoreMock: FirestoreMock }).userDataFirestoreMock = firestoreMock;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'firebase/firestore') return { shortCircuit: true, url: 'mock:user-data-firestore' };
    if (specifier === './firestore' && context.parentURL.endsWith('/src/lib/userData.ts')) {
      return { shortCircuit: true, url: 'mock:user-data-db' };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === 'mock:user-data-firestore') {
      return {
        shortCircuit: true,
        format: 'module',
        source: `
          const mock = globalThis.userDataFirestoreMock;
          export const collection = (...args) => mock.collection(...args);
          export const doc = (...args) => mock.doc(...args);
          export const getDoc = (...args) => mock.getDoc(...args);
          export const getDocs = (...args) => mock.getDocs(...args);
          export const orderBy = (...args) => mock.orderBy(...args);
          export const limit = (...args) => mock.limit(...args);
          export const query = (...args) => mock.query(...args);
          export const runTransaction = (...args) => mock.runTransaction(...args);
          export const serverTimestamp = (...args) => mock.serverTimestamp(...args);
          export const setDoc = (...args) => mock.setDoc(...args);
        `,
      };
    }
    if (url === 'mock:user-data-db') return { shortCircuit: true, format: 'module', source: 'export const db = { name: "test-db" };' };
    return nextLoad(url, context);
  },
});

const { getUserStudySessionsForDate, getUserMastery, updateUserMastery, getUserBacklog } = await import('./userData.ts');

function session(id: string, completedAt: string): StudySessionRecord {
  return {
    id,
    actionId: `action-${id}`,
    topicId: 'topic-id',
    actionType: 'theory',
    plannedMinutes: 30,
    completedMinutes: 30,
    completedAt,
  };
}

test('getUserStudySessionsForDate returns only sessions completed on the requested Sao Paulo local date', async () => {
  const yesterday = session('yesterday', '2026-08-23T15:00:00.000Z');
  const today = session('today', '2026-08-24T15:00:00.000Z');
  firestoreMock.getDocs = async () => ({
    docs: [
      { data: () => today },
      { data: () => yesterday },
    ],
  });

  const result = await getUserStudySessionsForDate('student-1', '2026-08-24');

  assert.deepEqual(result, [today]);
});

function mockMasteryDocument(items?: TopicMastery[]) {
  const writes: { items?: TopicMastery[] }[] = [];
  firestoreMock.runTransaction = async (_db, update) => update({
    get: async () => ({ exists: () => items !== undefined, data: () => ({ items: items ?? [] }) }),
    set: (_ref, data) => { writes.push(data); },
  });
  return writes;
}

test('conta nova começa sem domínio ou revisões inventadas, inclusive ao gravar a primeira tentativa', async () => {
  const writes = mockMasteryDocument();
  const mastery = await getUserMastery('new-student');
  assert.ok(mastery.length > 0);
  assert.ok(mastery.every(item => item.level === 0 && item.errorSignals === 0
    && item.uncertainty === 0.9 && item.lastReviewed === new Date(0).toISOString()));
  assert.deepEqual(writes[0].items, mastery);
  const firstTopic = mastery[0].topicId;
  mockMasteryDocument();
  const updated = await updateUserMastery('new-student', current => current.map(item =>
    item.topicId === firstTopic ? { ...item, level: 20, origin: 'observed' } : item));
  assert.equal(updated.find(item => item.topicId === firstTopic)?.level, 20);
  assert.ok(updated.filter(item => item.topicId !== firstTopic).every(item => item.level === 0));
});

test('reconciliação preserva domínio, repetição espaçada e tópicos legados sem apagar histórico', async () => {
  const baselineWrites = mockMasteryDocument();
  const baseline = await getUserMastery('new-student');
  assert.equal(baselineWrites.length, 1);
  const observed: TopicMastery = { ...baseline[0], level: 73, uncertainty: 0.2,
    lastReviewed: '2026-09-30T12:00:00.000Z', origin: 'observed', intervalDays: 12, reviewCount: 4, easeFactor: 2.6 };
  const legacy = { ...observed, topicId: 'retired-topic' };
  const writes = mockMasteryDocument([observed, legacy]);
  const reconciled = await getUserMastery('existing-student');
  assert.deepEqual(reconciled.find(item => item.topicId === observed.topicId), observed);
  assert.deepEqual(reconciled.find(item => item.topicId === legacy.topicId), legacy);
  assert.deepEqual(writes[0].items, reconciled);
  const unchangedWrites = mockMasteryDocument(reconciled);
  assert.deepEqual(await getUserMastery('existing-student'), reconciled);
  assert.equal(unchangedWrites.length, 0);
});

test('conta nova não recebe atrasos de demonstração', async () => {
  firestoreMock.getDoc = () => ({ exists: () => false });
  assert.deepEqual(await getUserBacklog('new-student'), []);
});
