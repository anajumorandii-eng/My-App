import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
const account = vi.hoisted(() => ({ user: { uid: 'ana' } as { uid: string } | null }));
const fetchVoices = vi.hoisted(() => vi.fn());
vi.mock('../context/AuthContext', () => ({ useAuth: () => account }));
vi.mock('../lib/podcastAudio', () => ({ fetchPodcastVoices: fetchVoices }));
import { usePodcastVoices } from './usePodcastVoices';
afterEach(cleanup);
it('carrega o catálogo e não expõe vozes da conta anterior após troca', async () => {
  fetchVoices.mockResolvedValueOnce({ provider: 'google-cloud', voices: [{ value: 'pt-BR-Chirp3-HD-Kore', label: 'Kore' }] });
  const { result, rerender } = renderHook(() => usePodcastVoices());
  await waitFor(() => expect(result.current.voices).toHaveLength(1));
  fetchVoices.mockImplementation(() => new Promise(() => {})); account.user = { uid: 'outra' }; rerender();
  expect(result.current.voices).toEqual([]);
});
it('não inventa vozes se o catálogo falha e permite tentar novamente', async () => {
  account.user = { uid: 'ana' }; fetchVoices.mockRejectedValueOnce(new Error('Acesso indisponível'));
  const { result } = renderHook(() => usePodcastVoices());
  await waitFor(() => expect(result.current.error).toBe('Acesso indisponível'));
  expect(result.current.voices).toEqual([]);
});
