import React, { StrictMode } from 'react';
import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
const auth = vi.hoisted(() => ({ user: { uid: 'a' } as { uid: string } | null }));
const io = vi.hoisted(() => ({ readProfile: vi.fn(), readGoals: vi.fn(), saveProfile: vi.fn(), saveGoals: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => auth }));
vi.mock('../lib/userData', () => ({ getUserProfile: io.readProfile, getStudentGoals: io.readGoals, saveUserProfile: io.saveProfile, saveStudentGoals: io.saveGoals }));
import { useUserProfile } from './useUserProfile';
import { useStudentGoals } from './useStudentGoals';
import { mockProfile, mockStudentGoals } from '../data/mockData';
beforeEach(() => { vi.resetAllMocks(); auth.user = { uid: 'a' }; io.readProfile.mockResolvedValue({ ...mockProfile, targetCourse: 'Account A' }); io.readGoals.mockResolvedValue({ ...mockStudentGoals, primaryGoal: 'Account A' }); io.saveProfile.mockResolvedValue(undefined); io.saveGoals.mockResolvedValue(undefined); });
afterEach(cleanup);
it('clears the previous account and blocks writes while the next account loads', async () => {
  const { result, rerender } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }));
  await waitFor(() => expect(result.current.p.isPersisted).toBe(true));
  io.readProfile.mockImplementation(() => new Promise(() => {})); io.readGoals.mockImplementation(() => new Promise(() => {}));
  auth.user = { uid: 'b' }; rerender();
  expect(result.current.p.profile.targetCourse).toBe(mockProfile.targetCourse);
  expect(result.current.g.goals.primaryGoal).toBe(mockStudentGoals.primaryGoal);
  expect(result.current.g.isPersisted).toBe(false);
  await act(async () => { await result.current.p.updateProfile(p => ({ ...p, targetCourse: 'unsafe' })); await result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'unsafe' })); });
  expect(io.saveProfile).not.toHaveBeenCalled(); expect(io.saveGoals).not.toHaveBeenCalled();
});
it('blocks writes after failed reads', async () => {
  io.readProfile.mockRejectedValue(new Error('offline')); io.readGoals.mockRejectedValue(new Error('offline'));
  const { result } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }));
  await waitFor(() => expect(result.current.p.loading).toBe(false));
  await act(async () => { expect(await result.current.p.updateProfile(p => ({ ...p, targetCourse: 'unsafe' }))).toBe(false); expect(await result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'unsafe' }))).toBe(false); });
  expect(io.saveProfile).not.toHaveBeenCalled(); expect(io.saveGoals).not.toHaveBeenCalled();
});
it('saves each action once in StrictMode, patches fields and reports failed saves', async () => {
  const { result } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }), { wrapper: ({ children }) => <StrictMode>{children}</StrictMode> });
  await waitFor(() => expect(result.current.p.isPersisted && result.current.g.isPersisted).toBe(true));
  await act(async () => { expect(await result.current.p.updateProfile(p => ({ ...p, targetCourse: 'changed' }))).toBe(true); expect(await result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'changed' }))).toBe(true); });
  expect(io.saveProfile).toHaveBeenCalledExactlyOnceWith('a', { targetCourse: 'changed' }, true);
  expect(io.saveGoals).toHaveBeenCalledExactlyOnceWith('a', { primaryGoal: 'changed' });
  io.saveProfile.mockRejectedValue(new Error('offline')); io.saveGoals.mockRejectedValue(new Error('offline'));
  await act(async () => { expect(await result.current.p.updateProfile(p => ({ ...p, targetCourse: 'failed' }))).toBe(false); expect(await result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'failed' }))).toBe(false); });
  expect(result.current.p.syncError).toBeTruthy(); expect(result.current.g.syncError).toBeTruthy();
});
it('retries the same scalar value after a rejected save', async () => {
  const { result } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }));
  await waitFor(() => expect(result.current.p.isPersisted && result.current.g.isPersisted).toBe(true));
  io.saveProfile.mockRejectedValueOnce(new Error('offline')); io.saveGoals.mockRejectedValueOnce(new Error('offline'));
  const profileChange = (p: typeof mockProfile) => ({ ...p, targetCourse: 'retry me' });
  const goalsChange = (g: typeof mockStudentGoals) => ({ ...g, primaryGoal: 'retry me' });
  await act(async () => { expect(await result.current.p.updateProfile(profileChange)).toBe(false); expect(await result.current.g.updateGoals(goalsChange)).toBe(false); });
  await act(async () => { expect(await result.current.p.updateProfile(profileChange)).toBe(true); expect(await result.current.g.updateGoals(goalsChange)).toBe(true); });
  expect(io.saveProfile).toHaveBeenCalledTimes(2); expect(io.saveProfile).toHaveBeenLastCalledWith('a', { targetCourse: 'retry me' }, true);
  expect(io.saveGoals).toHaveBeenCalledTimes(2); expect(io.saveGoals).toHaveBeenLastCalledWith('a', { primaryGoal: 'retry me' });
});
it('rolls back failed fields while preserving newer concurrent edits', async () => {
  const { result } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }));
  await waitFor(() => expect(result.current.p.isPersisted && result.current.g.isPersisted).toBe(true));
  let rejectProfile!: (error: Error) => void; let rejectGoals!: (error: Error) => void;
  io.saveProfile.mockImplementationOnce(() => new Promise((_, reject) => { rejectProfile = reject; }));
  io.saveGoals.mockImplementationOnce(() => new Promise((_, reject) => { rejectGoals = reject; }));
  let pendingProfile!: Promise<boolean>; let pendingGoals!: Promise<boolean>;
  act(() => {
    pendingProfile = result.current.p.updateProfile(p => ({ ...p, targetCourse: 'failed', availableHoursPerWeek: 70 }));
    pendingGoals = result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'failed', secondaryGoals: ['failed'] }));
  });
  await waitFor(() => expect(io.saveProfile).toHaveBeenCalledOnce());
  let newerP!: Promise<boolean>; let newerG!: Promise<boolean>;
  act(() => {
    newerP = result.current.p.updateProfile(p => ({ ...p, targetCourse: 'newer' }));
    newerG = result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'newer' }));
  });
  await act(async () => { rejectProfile(new Error('offline')); rejectGoals(new Error('offline')); await pendingProfile; await pendingGoals; await newerP; await newerG; });
  expect(result.current.p.profile.targetCourse).toBe('newer');
  expect(result.current.p.profile.availableHoursPerWeek).toBe(mockProfile.availableHoursPerWeek);
  expect(result.current.g.goals.primaryGoal).toBe('newer');
  expect(result.current.g.goals.secondaryGoals).toEqual(mockStudentGoals.secondaryGoals);
  expect(result.current.p.syncError).toBeTruthy(); expect(result.current.g.syncError).toBeTruthy();
});
it('restores the acknowledged baseline when two consecutive optimistic saves fail', async () => {
  const { result } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }));
  await waitFor(() => expect(result.current.p.isPersisted && result.current.g.isPersisted).toBe(true));
  let rejectProfile!: (error: Error) => void; let rejectGoals!: (error: Error) => void;
  io.saveProfile.mockImplementationOnce(() => new Promise((_, reject) => { rejectProfile = reject; }));
  io.saveGoals.mockImplementationOnce(() => new Promise((_, reject) => { rejectGoals = reject; }));
  let rejectSecondP!: (error: Error) => void; let rejectSecondG!: (error: Error) => void;
  io.saveProfile.mockImplementationOnce(() => new Promise((_, reject) => { rejectSecondP = reject; }));
  io.saveGoals.mockImplementationOnce(() => new Promise((_, reject) => { rejectSecondG = reject; }));
  let firstP!: Promise<boolean>; let firstG!: Promise<boolean>; let secondP!: Promise<boolean>; let secondG!: Promise<boolean>;
  act(() => { firstP = result.current.p.updateProfile(p => ({ ...p, targetCourse: 'Y' })); firstG = result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'Y' })); });
  await waitFor(() => expect(io.saveProfile).toHaveBeenCalledOnce());
  act(() => { secondP = result.current.p.updateProfile(p => ({ ...p, targetCourse: 'Z' })); secondG = result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'Z' })); });
  await act(async () => { rejectProfile(new Error('first failure')); rejectGoals(new Error('first failure')); await Promise.all([firstP, firstG]); });
  await waitFor(() => expect(io.saveProfile).toHaveBeenCalledTimes(2));
  await act(async () => { rejectSecondP(new Error('second failure')); rejectSecondG(new Error('second failure')); await Promise.all([secondP, secondG]); });
  expect(result.current.p.profile.targetCourse).toBe('Account A'); expect(result.current.g.goals.primaryGoal).toBe('Account A');
  await act(async () => { expect(await result.current.p.updateProfile(p => ({ ...p, targetCourse: 'Z' }))).toBe(true); expect(await result.current.g.updateGoals(g => ({ ...g, primaryGoal: 'Z' }))).toBe(true); });
  expect(io.saveProfile).toHaveBeenLastCalledWith('a', { targetCourse: 'Z' }, true); expect(io.saveGoals).toHaveBeenLastCalledWith('a', { primaryGoal: 'Z' });
});
it('preserves the newest edit when its value repeats an older rejected write', async () => {
  const { result } = renderHook(() => ({ p: useUserProfile(), g: useStudentGoals() }));
  await waitFor(() => expect(result.current.p.isPersisted && result.current.g.isPersisted).toBe(true));
  io.saveProfile.mockRejectedValueOnce(new Error('first failure'));
  io.saveGoals.mockRejectedValueOnce(new Error('first failure'));
  await act(async () => {
    const writes: Promise<boolean>[] = [];
    for (const value of ['Y', 'Z', 'Y']) {
      writes.push(result.current.p.updateProfile(p => ({ ...p, targetCourse: value })));
      writes.push(result.current.g.updateGoals(g => ({ ...g, primaryGoal: value })));
    }
    await Promise.all(writes);
  });
  expect(result.current.p.profile.targetCourse).toBe('Y');
  expect(result.current.g.goals.primaryGoal).toBe('Y');
  expect(io.saveProfile).toHaveBeenLastCalledWith('a', { targetCourse: 'Y' }, true);
  expect(io.saveGoals).toHaveBeenLastCalledWith('a', { primaryGoal: 'Y' });
});
