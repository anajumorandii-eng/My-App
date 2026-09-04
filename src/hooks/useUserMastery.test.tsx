import { renderHook, waitFor } from '@testing-library/react';
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

  it('não se diz persistido quando a leitura falha e a tela cai nos dados de demonstração', async () => {
    // Este era o furo: isPersisted era só !!user, então uma aluna logada cujo
    // carregamento falhasse via números de demonstração sem o aviso de "Modo
    // demonstração" — que é exatamente a hora em que ele precisa aparecer.
    getUserMastery.mockRejectedValue(new Error('offline'));

    const { result } = renderHook(() => useUserMastery());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isPersisted).toBe(false);
    expect(result.current.syncError).toMatch(/demonstração/i);
    // Os dados de demonstração continuam na tela — o que muda é a tela passar
    // a admitir que são de demonstração.
    expect(result.current.mastery.length).toBeGreaterThan(0);
  });

  it('sem ninguém logado, não há o que persistir', async () => {
    auth.state = { user: null, isConnected: false };

    const { result } = renderHook(() => useUserMastery());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isPersisted).toBe(false);
    expect(getUserMastery).not.toHaveBeenCalled();
  });
});
