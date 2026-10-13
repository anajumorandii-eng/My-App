import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mockTopics } from '../data/mockData';
const store = vi.hoisted(() => ({ data: new Map<string, Record<string, unknown>>(), fail: false, writes: 0 }));
vi.mock('../lib/firestore', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({
  doc: (_db: unknown, ...path: string[]) => path.join('/'), collection: vi.fn(), getDoc: vi.fn(), getDocs: vi.fn(), setDoc: vi.fn(), query: vi.fn(), orderBy: vi.fn(), limit: vi.fn(), serverTimestamp: () => 'server-time',
  runTransaction: async (_db: unknown, callback: (transaction: unknown) => Promise<unknown>) => {
    const writes: [string, Record<string, unknown>][] = [];
    const value = await callback({ get: async (path: string) => ({ exists: () => store.data.has(path), data: () => structuredClone(store.data.get(path)) }), set: (path: string, data: Record<string, unknown>) => writes.push([path, data]) });
    if (store.fail) throw new Error('commit failed');
    writes.forEach(([path, data]) => { store.data.set(path, { ...store.data.get(path), ...data }); store.writes++; });
    return value;
  },
}));
import { completeUserManualReview } from '../lib/userData';
const topicId = mockTopics[0].id;
const reviewPath = 'users/a/manualReviews/r1';
const masteryPath = 'users/a/data/mastery';
beforeEach(() => {
  store.data.clear(); store.fail = false; store.writes = 0;
  store.data.set(reviewPath, { topicId, status: 'scheduled' });
  store.data.set(masteryPath, { items: [{ topicId, level: 40, uncertainty: 0.4, lastReviewed: '2026-01-01', errorSignals: 0 }] });
});
describe('conclusão manual atômica', () => {
  it('persiste domínio e conclusão juntos, e repetir o mesmo ID não reaplica a revisão', async () => {
    const first = await completeUserManualReview('a', 'r1', 'forte');
    const writes = store.writes;
    const second = await completeUserManualReview('a', 'r1', 'forte');
    expect(second).toEqual(first);
    expect(store.writes).toBe(writes);
    expect(store.data.get(reviewPath)?.status).toBe('completed');
    expect(first.find(item => item.topicId === topicId)?.reviewCount).toBe(1);
  });
  it('não deixa progresso parcial quando a transação falha', async () => {
    const before = structuredClone(store.data);
    store.fail = true;
    await expect(completeUserManualReview('a', 'r1', 'forte')).rejects.toThrow('commit failed');
    expect(store.data).toEqual(before);
    store.fail = false;
    const result = await completeUserManualReview('a', 'r1', 'forte');
    expect(result.find(item => item.topicId === topicId)?.reviewCount).toBe(1);
  });
  it('não conclui revisão de outra conta', async () => {
    await expect(completeUserManualReview('b', 'r1', 'forte')).rejects.toThrow('Revisão não encontrada.');
    expect(store.writes).toBe(0);
  });
});
