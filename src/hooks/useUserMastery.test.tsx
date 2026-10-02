import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({ state: { user: null as { uid: string } | null, isConnected: false } }));
const getUserMastery = vi.hoisted(() => vi.fn());
const updateUserMasteryFn = vi.hoisted(() => vi.fn());

vi.mock('../context/AuthContext', () => ({ useAuth: () => auth.state }));
vi.mock('../lib/userData', () => ({
  getUserMastery,
  updateUserMastery: updateUserMasteryFn,
}));

import { useUserMastery } from './useUserMastery';

describe('useUserMastery', () => {
  beforeEach(() => {
    auth.state = { user: { uid: 'ana' }, isConnected: true };
    getUserMastery.mockResolvedValue([
      { topicId: 'topico-real', level: 4, confidence: 0.8, lastReviewed: '2026-09-01T00:00:00.000Z' },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('reporta dados persistidos quando a leitura do Firestore funciona', async () => {
    const { result } = renderHook(() => useUserMastery());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isPersisted).toBe(true);
    expect(result.current.mastery).toHaveLength(1);
    expect(result.current.syncError).toBeNull();
  });

  it('uma falha de leitura não expõe demonstração como progresso e bloqueia a gravação', async () => {
    getUserMastery.mockRejectedValue(new Error('offline'));
    const { result } = renderHook(() => useUserMastery());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isPersisted).toBe(false);
    expect(result.current.syncError).toMatch(/carregar seu progresso/i);
    expect(result.current.mastery).toEqual([]);
    let saved = true;
    await act(async () => { saved = await result.current.updateMastery(current => current); });
    expect(saved).toBe(false);
    expect(updateUserMasteryFn).not.toHaveBeenCalled();
  });

  it('trocar de conta esconde o progresso anterior até carregar o novo e ignora respostas antigas', async () => {
    let resolveOld!: (value: unknown) => void;
    let resolveNew!: (value: unknown) => void;
    getUserMastery.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
    const { result, rerender } = renderHook(() => useUserMastery());
    expect(result.current.mastery).toEqual([]);
    expect(result.current.isPersisted).toBe(false);
    auth.state = { user: { uid: 'other' }, isConnected: true };
    getUserMastery.mockImplementationOnce(() => new Promise(resolve => { resolveNew = resolve; }));
    rerender();
    await act(async () => { resolveOld([{ topicId: 'old-account', level: 90 }]); });
    expect(result.current.mastery).toEqual([]);
    expect(result.current.isPersisted).toBe(false);
    await act(async () => { resolveNew([{ topicId: 'new-account', level: 0 }]); });
    expect(result.current.mastery[0].topicId).toBe('new-account');
    expect(result.current.isPersisted).toBe(true);
    const previousUpdate = result.current.updateMastery;
    auth.state = { user: { uid: 'third' }, isConnected: true };
    getUserMastery.mockReturnValueOnce(new Promise(() => {}));
    rerender();
    expect(result.current.mastery).toEqual([]);
    expect(result.current.isPersisted).toBe(false);
    let saved = true;
    await act(async () => { saved = await previousUpdate(current => current); });
    expect(saved).toBe(false);
    expect(updateUserMasteryFn).not.toHaveBeenCalled();
  });

  it('mantém a prática local disponível no modo demonstração', async () => {
    auth.state = { user: null, isConnected: false };
    const { result } = renderHook(() => useUserMastery());
    const topic = result.current.mastery[0].topicId;
    await act(async () => { await result.current.updateMastery(current => current.map(item =>
      item.topicId === topic ? { ...item, level: 17 } : item)); });
    expect(result.current.mastery[0].level).toBe(17);
    expect(result.current.isPersisted).toBe(false);
    expect(updateUserMasteryFn).not.toHaveBeenCalled();
  });

  it('sem ninguém logado, não há o que persistir', async () => {
    auth.state = { user: null, isConnected: false };

    const { result } = renderHook(() => useUserMastery());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isPersisted).toBe(false);
    expect(getUserMastery).not.toHaveBeenCalled();
  });
});
