import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { useDiscursiveAttempts } from './useDiscursiveAttempts';
import type { DiscursiveAttempt } from '../types';

const mocks = vi.hoisted(() => ({ user: { uid: 'a' }, read: vi.fn(), write: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: mocks.user }) }));
// Keep the auth object stable, like Firebase, while the hook rerenders.
vi.mock('../lib/userData', () => ({ getUserDiscursiveAttempts: mocks.read, addUserDiscursiveAttempt: mocks.write }));
const item = (id: string): DiscursiveAttempt => ({ id, questionId: 'q', topicId: 't', selfRating: 'mediano', date: '2026-10-17T12:00:00Z' });
beforeEach(() => { vi.clearAllMocks(); mocks.user = { uid: 'a' }; mocks.write.mockResolvedValue(undefined); });

it('histórico que chega depois de uma avaliação preserva tanto o passado quanto a gravação nova', async () => {
  let finish!: (items: DiscursiveAttempt[]) => void;
  mocks.read.mockReturnValue(new Promise(resolve => { finish = resolve; }));
  const { result } = renderHook(useDiscursiveAttempts);
  await act(async () => { expect(await result.current.addAttempt(item('nova'))).toBe(true); });
  await act(async () => { finish([item('anterior')]); });
  expect(result.current.attempts.map(attempt => attempt.id)).toEqual(['nova', 'anterior']);
});
it('falha de gravação não cria uma tentativa salva e permite repetir', async () => {
  mocks.read.mockResolvedValue([]); mocks.write.mockRejectedValueOnce(Error('offline'));
  const { result } = renderHook(useDiscursiveAttempts);
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => { expect(await result.current.addAttempt(item('nova'))).toBe(false); });
  expect(result.current.attempts).toEqual([]);
  await act(async () => { expect(await result.current.addAttempt(item('nova'))).toBe(true); });
  expect(result.current.attempts).toHaveLength(1);
});
