import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import type { StudySessionRecord } from '../types';

type FirestoreMock = {
  collection: (_db: unknown, ...path: string[]) => { path: string };
  doc: () => void;
  getDoc: () => void;
  getDocs: () => Promise<{ docs: { data: () => StudySessionRecord }[] }>;
  orderBy: (field: string, direction: string) => { field: string; direction: string };
  limit: (count: number) => { limit: number };
  query: (ref: unknown, ...constraints: unknown[]) => { ref: unknown; constraints: unknown[] };
  runTransaction: () => void;
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
  runTransaction: () => undefined,
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

const { getUserStudySessionsForDate } = await import('./userData.ts');

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
