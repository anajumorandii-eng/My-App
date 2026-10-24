import { expect, it, vi } from 'vitest';
const remote = vi.hoisted(() => ({ value: undefined as unknown, set: vi.fn() }));
vi.mock('../lib/firestore', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({ collection: vi.fn(), getDocs: vi.fn(), doc: (...path: unknown[]) => path,
  runTransaction: async (_db: unknown, run: (transaction: unknown) => Promise<void>) => run({ get: async () => ({ data: () => remote.value }), set: remote.set }),
}));
import { deletedStrategyGuide, saveStrategyGuide, type StrategyGuide } from '../lib/strategyGuides';
const guide: StrategyGuide = { key: 'one', subject: 'Biologia', topicId: 'bio', topicName: 'Fisiologia', chapter: '', board: 'FUVEST', text: 'Conteúdo', savedAt: '2025-01-01T00:00:00Z' };
it('a transação protege a exclusão de gravação atrasada e aceita nova geração posterior', async () => {
  const deleted = deletedStrategyGuide(guide, Date.parse('2026-01-01T00:00:00Z'));
  remote.value = deleted;
  await saveStrategyGuide('A', guide);
  expect(remote.set).not.toHaveBeenCalled();
  const fresh = { ...guide, savedAt: '2026-02-01T00:00:00Z' };
  await saveStrategyGuide('A', fresh);
  expect(remote.set).toHaveBeenCalledWith([{}, 'users', 'A', 'strategyGuides', 'one'], fresh);
});
