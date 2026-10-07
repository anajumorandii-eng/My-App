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
  doc: (...args: unknown[]) => unknown;
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
  doc: (_db, ...path) => ({ path: path.join('/') }),
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


const { saveUserSummaryProgress } = await import('./userData.ts');
const { createSummaryChange } = await import('./summarySync.ts');
const { emptySummaryProgress } = await import('./summaryEngine.ts');

test('transaction merges two stale chapter edits and receipts stop replay after newer actions', async () => {
  const records = new Map<string, Record<string, unknown>>();
  firestoreMock.runTransaction = async (_db, update) => update({
    get: async ref => {
      const value = records.get((ref as { path: string }).path);
      return { exists: () => value !== undefined, data: () => value as { items: TopicMastery[] } };
    },
    set: (ref, value) => { records.set((ref as { path: string }).path, value); },
  });
  const initial = emptySummaryProgress();
  const first = createSummaryChange('one', initial, { ...initial, important: true });
  const second = createSummaryChange('two', initial, { ...initial, readSectionIds: ['read'] });
  await saveUserSummaryProgress('A', first);
  await saveUserSummaryProgress('A', second);
  await saveUserSummaryProgress('A', createSummaryChange('one', { ...initial, important: true }, initial));
  await saveUserSummaryProgress('A', first);
  const items = records.get('users/A/data/summaryProgress')!.items as unknown as Record<string, { important: boolean; readSectionIds: string[] }>;
  assert.equal(items.one.important, false);
  assert.deepEqual(items.two.readSectionIds, ['read']);
  assert.equal(records.size, 4);
});

test('live retrieval snapshot omits optional undefined values before Firestore writes', async () => {
  const { applySummaryAttempt } = await import('./summaryStudy.ts');
  const summary = {
    id: 'chapter', title: 'Chapter', subject: 'Biologia', topic: 'Cells', priority: 'alta' as const,
    boards: [], prerequisites: [], overview: '', sections: [], sources: [],
    retrieval: [{ id: 'q', prompt: 'Recall', expectedElements: [], hint: '', transferPrompt: '' }],
  };
  const after = applySummaryAttempt({}, summary, summary.retrieval[0], { answer: 'Answer', matchedElements: [], firstMissingElement: null, transferUnlocked: true }, '2026-10-07T00:00:00Z');
  assert.equal(Object.hasOwn(after.chapter.answers[0], 'board'), true);
  let writes = 0;
  const verify = (value: unknown): void => {
    assert.notEqual(value, undefined);
    if (value && typeof value === 'object') Object.values(value).forEach(verify);
  };
  firestoreMock.serverTimestamp = () => 'timestamp' as never;
  firestoreMock.runTransaction = async (_db, update) => update({
    get: async () => ({ exists: () => false, data: () => ({ items: [] }) }),
    set: (_ref, value) => { verify(value); writes += 1; },
  });
  const saved = await saveUserSummaryProgress('A', createSummaryChange('chapter', emptySummaryProgress(), after.chapter));
  assert.equal(saved.chapter.answers.length, 1);
  assert.equal(Object.hasOwn(saved.chapter.answers[0], 'board'), false);
  assert.equal(writes, 2);
});
