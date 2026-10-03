import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const state = vi.hoisted(() => ({ user: { uid: 'ana' } as { uid: string } | null }));
const reads = vi.hoisted(() => vi.fn()); const writes = vi.hoisted(() => vi.fn());
vi.mock('../context/AuthContext', () => ({ useAuth: () => state }));
vi.mock('../lib/firestore', () => ({ db: {} }));
vi.mock('firebase/firestore', () => ({ getDocs: reads, setDoc: writes, collection: (...args: unknown[]) => args, doc: (...args: unknown[]) => args, query: (...args: unknown[]) => args, orderBy: vi.fn(), limit: vi.fn(), startAfter: vi.fn() }));
import { usePersonalPodcasts } from './usePersonalPodcasts';
import { DEFAULT_PODCAST_SETTINGS } from '../lib/podcastConfig';
const episode = { id: 'ep', title: 'Osmose', topicId: 'bio', subject: 'Biologia', script: 'Explicação', durationMinutes: 5, settings: DEFAULT_PODCAST_SETTINGS, createdAt: '2026-10-03', sourceLabels: [], focus: '' };
afterEach(cleanup);
beforeEach(() => { state.user = { uid: 'ana' }; reads.mockReset().mockResolvedValue({ docs: [] }); writes.mockReset().mockResolvedValue(undefined); });
it('disponibiliza o roteiro mesmo enquanto a gravação remota está pendente', async () => {
  writes.mockImplementation(() => new Promise(() => {}));
  const { result } = renderHook(() => usePersonalPodcasts());
  await act(async () => { result.current.saveEpisode(episode); });
  expect(result.current.episodes).toEqual([episode]);
  expect(result.current.pendingCount).toBe(1);
});
it('permite buscar páginas antigas sem substituir podcasts já carregados', async () => {
  reads.mockResolvedValueOnce({ docs: Array.from({ length: 30 }, (_, i) => ({ data: () => ({ ...episode, id: `ep${i}` }) })) }).mockResolvedValueOnce({ docs: [{ data: () => ({ ...episode, id: 'antigo' }) }] });
  const { result } = renderHook(() => usePersonalPodcasts());
  await waitFor(() => expect(result.current.episodes).toHaveLength(30));
  expect(result.current.hasMore).toBe(true);
  await act(async () => { await result.current.loadMore(); });
  expect(result.current.episodes).toHaveLength(31);
  expect(result.current.hasMore).toBe(false);
});
it('não exibe os episódios da conta anterior durante a troca', async () => {
  reads.mockResolvedValueOnce({ docs: [{ data: () => episode }] });
  const { result, rerender } = renderHook(() => usePersonalPodcasts());
  await waitFor(() => expect(result.current.episodes).toHaveLength(1));
  reads.mockImplementation(() => new Promise(() => {}));
  state.user = { uid: 'outra' }; rerender();
  expect(result.current.episodes).toEqual([]);
});
