import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SummaryProgressMap } from '../types/summary';

const auth = vi.hoisted(() => ({ user: null as { uid: string } | null }));
const repository = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../lib/userData', () => ({ getUserSummaryProgress: repository.load, saveUserSummaryProgress: repository.save }));
vi.mock('../data/interactiveSummaries', () => ({ interactiveSummaries: [] }));
import { useSummaryProgress } from './useSummaryProgress';

const key = 'juju_summary_progress_v1';
const progress = (id: string): SummaryProgressMap => ({ [id]: { readSectionIds: ['section'], status: 'em-revisao', important: true, answers: [] } });
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

beforeEach(() => {
  auth.user = null;
  localStorage.clear();
  repository.load.mockReset().mockResolvedValue({});
  repository.save.mockReset().mockResolvedValue(undefined);
});
afterEach(cleanup);

describe('isolamento do progresso de Resumos', () => {
  it('preserva a chave legada para estudo sem login, sem atribuí-la a uma conta', async () => {
    localStorage.setItem(key, JSON.stringify(progress('legacy')));
    const { result, rerender } = renderHook(() => useSummaryProgress());
    expect(result.current.progress.legacy).toBeDefined();
    auth.user = { uid: 'A' }; rerender();
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.progress).toEqual({});
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(progress('legacy'));
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('não incorpora o cache nem a evidência da conta anterior ao trocar de UID', async () => {
    repository.load.mockImplementation((uid: string) => Promise.resolve(progress(uid)));
    auth.user = { uid: 'A' };
    const { result, rerender } = renderHook(() => useSummaryProgress());
    await waitFor(() => expect(result.current.progress.A).toBeDefined());
    auth.user = { uid: 'B' }; rerender();
    expect(result.current.progress).toEqual({});
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.progress.B).toBeDefined());
    expect(result.current.progress.A).toBeUndefined();
    act(() => result.current.update('B', current => ({ ...current, important: false })));
    await waitFor(() => expect(repository.save).toHaveBeenCalled());
    expect(repository.save.mock.calls[0][0]).toBe('B');
    expect(repository.save.mock.calls[0][1].A).toBeUndefined();
  });

  it('ignora leitura e ação antigas, inclusive ao retornar para o mesmo UID', async () => {
    const firstA = deferred<SummaryProgressMap>();
    repository.load.mockImplementationOnce(() => firstA.promise).mockResolvedValue(progress('current'));
    auth.user = { uid: 'A' };
    const { result, rerender } = renderHook(() => useSummaryProgress());
    const staleUpdate = result.current.update;
    auth.user = { uid: 'B' }; rerender();
    await waitFor(() => expect(result.current.loading).toBe(false));
    auth.user = { uid: 'A' }; rerender();
    await waitFor(() => expect(result.current.progress.current).toBeDefined());
    await act(async () => firstA.resolve(progress('old')));
    act(() => staleUpdate('old-action', current => ({ ...current, important: true })));
    expect(result.current.progress.old).toBeUndefined();
    expect(result.current.progress['old-action']).toBeUndefined();
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('após falha de leitura usa somente o cache do UID e não sobrescreve dados remotos desconhecidos', async () => {
    localStorage.setItem(`${key}:A`, JSON.stringify(progress('cached')));
    localStorage.setItem(key, JSON.stringify(progress('other')));
    repository.load.mockRejectedValue(new Error('offline'));
    auth.user = { uid: 'A' };
    const { result } = renderHook(() => useSummaryProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.progress.cached).toBeDefined();
    expect(result.current.progress.other).toBeUndefined();
    expect(result.current.isCloudSynced).toBe(false);
    act(() => result.current.update('cached', current => ({ ...current, important: false })));
    expect(JSON.parse(localStorage.getItem(`${key}:A`)!).cached.important).toBe(false);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('salva alterações consecutivas em ordem e não repete escrita no modo estrito', async () => {
    const firstSave = deferred<void>();
    repository.save.mockImplementationOnce(() => firstSave.promise);
    auth.user = { uid: 'A' };
    const { result } = renderHook(() => useSummaryProgress(), { wrapper: StrictMode });
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.update('one', current => ({ ...current, important: true }));
      result.current.update('two', current => ({ ...current, important: true }));
    });
    await waitFor(() => expect(repository.save).toHaveBeenCalledTimes(1));
    expect(result.current.isCloudSynced).toBe(false);
    await act(async () => firstSave.resolve());
    await waitFor(() => expect(repository.save).toHaveBeenCalledTimes(2));
    expect(Object.keys(repository.save.mock.calls[1][1])).toEqual(['one', 'two']);
    await waitFor(() => expect(result.current.isCloudSynced).toBe(true));
  });

  it('uma falha de gravação da conta anterior não contamina a conta atual', async () => {
    const saving = deferred<void>();
    repository.save.mockImplementationOnce(() => saving.promise);
    auth.user = { uid: 'A' };
    const { result, rerender } = renderHook(() => useSummaryProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.update('A', current => ({ ...current, important: true })));
    await waitFor(() => expect(repository.save).toHaveBeenCalled());
    auth.user = { uid: 'B' }; rerender();
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => saving.reject(new Error('old account')));
    expect(result.current.syncError).toBeNull();
    expect(result.current.progress).toEqual({});
    expect(result.current.isCloudSynced).toBe(true);
  });

  it('não aceita alterações durante a leitura e retoma o cache separado da conta após falha', async () => {
    const reading = deferred<SummaryProgressMap>();
    repository.load.mockImplementationOnce(() => reading.promise);
    auth.user = { uid: 'A' };
    const { result } = renderHook(() => useSummaryProgress());
    act(() => result.current.update('premature', current => ({ ...current, important: true })));
    expect(repository.save).not.toHaveBeenCalled();
    expect(localStorage.getItem(`${key}:A`)).toBeNull();
    await act(async () => reading.resolve(progress('read')));
    await waitFor(() => expect(result.current.progress.read).toBeDefined());
    expect(result.current.progress.premature).toBeUndefined();
  });

  it('conclui gravações já solicitadas no UID original sem expô-las após logout', async () => {
    const saving = deferred<void>();
    repository.save.mockImplementationOnce(() => saving.promise);
    localStorage.setItem(key, JSON.stringify(progress('guest')));
    auth.user = { uid: 'A' };
    const { result, rerender } = renderHook(() => useSummaryProgress());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.update('one', current => ({ ...current, important: true }));
      result.current.update('two', current => ({ ...current, important: true }));
    });
    await waitFor(() => expect(repository.save).toHaveBeenCalledTimes(1));
    auth.user = null; rerender();
    expect(result.current.progress.guest).toBeDefined();
    expect(result.current.progress.one).toBeUndefined();
    await act(async () => saving.resolve());
    await waitFor(() => expect(repository.save).toHaveBeenCalledTimes(2));
    expect(repository.save.mock.calls.map(call => call[0])).toEqual(['A', 'A']);
    expect(result.current.isCloudSynced).toBe(false);
    expect(JSON.parse(localStorage.getItem(key)!)).toEqual(progress('guest'));
  });
});
