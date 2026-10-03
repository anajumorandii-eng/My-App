import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const account = vi.hoisted(() => ({ user: null as { uid: string } | null }));
const load = vi.hoisted(() => vi.fn());
vi.mock('../context/AuthContext', () => ({ useAuth: () => account }));
vi.mock('../lib/contentCatalog', () => ({ getPodcastEpisodes: load }));
import { usePodcastEpisodes } from './usePodcastEpisodes';
import { mockPodcastEpisodes } from '../data/mockData';
beforeEach(() => { account.user = null; load.mockReset(); });
afterEach(cleanup);
it('não consulta a biblioteca protegida antes de autenticar nem mostra erro de sincronização', () => {
  load.mockResolvedValue([]);
  const { result } = renderHook(() => usePodcastEpisodes());
  expect(load).not.toHaveBeenCalled();
  expect(result.current.syncError).toBeNull();
  expect(result.current.episodes).toEqual(mockPodcastEpisodes);
});
it('consulta quando a sessão é restaurada e volta ao catálogo local ao sair', async () => {
  load.mockResolvedValue([{ ...mockPodcastEpisodes[0], id: 'servidor' }]);
  const { result, rerender } = renderHook(() => usePodcastEpisodes());
  account.user = { uid: 'estudante' }; rerender();
  await waitFor(() => expect(result.current.episodes[0].id).toBe('servidor'));
  expect(load).toHaveBeenCalledTimes(1);
  account.user = null; rerender();
  expect(result.current.episodes).toEqual(mockPodcastEpisodes);
  expect(result.current.syncError).toBeNull();
});
it('ignora falha de uma consulta cuja conta já saiu', async () => {
  let reject!: (error: Error) => void;
  load.mockImplementation(() => new Promise((_resolve, fail) => { reject = fail; }));
  account.user = { uid: 'estudante' };
  const { result, rerender } = renderHook(() => usePodcastEpisodes());
  account.user = null; rerender(); reject(new Error('permission-denied'));
  await waitFor(() => expect(result.current.syncError).toBeNull());
});
