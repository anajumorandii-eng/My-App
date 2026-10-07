import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => ({ user: { uid: 'ana' } as { uid: string } | null }));
const read = vi.hoisted(() => vi.fn()); const save = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../lib/userData', () => ({ getUserProfile: read, saveUserProfile: save }));
import { useUserProfile } from './useUserProfile';
import { mockProfile } from '../data/mockData';
import { DEFAULT_PODCAST_SETTINGS } from '../lib/podcastConfig';
afterEach(cleanup);
it('só considera o perfil persistido após a leitura e salva apenas os campos solicitados', async () => {
  let finish!: (data: typeof mockProfile) => void;
  read.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const { result } = renderHook(() => useUserProfile());
  expect(result.current.isPersisted).toBe(false);
  await act(async () => { finish({ ...mockProfile, targetCourse: 'Meu curso' }); });
  await waitFor(() => expect(result.current.isPersisted).toBe(true));
  await act(async () => { await result.current.updateProfile(prev => ({ ...prev, podcastSettings: DEFAULT_PODCAST_SETTINGS }), ['podcastSettings']); });
  expect(save).toHaveBeenLastCalledWith('ana', { podcastSettings: DEFAULT_PODCAST_SETTINGS }, true);
});

it('encerra o carregamento quando a estudante sai da conta durante a leitura', async () => {
  auth.user = { uid: 'ana' };
  read.mockImplementation(() => new Promise(() => {}));
  const { result, rerender } = renderHook(() => useUserProfile());
  expect(result.current.loading).toBe(true);
  auth.user = null; rerender();
  expect(result.current.loading).toBe(false);
  expect(result.current.isPersisted).toBe(false);
});
