import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SAO_PAULO_TIME_ZONE,
  type ScheduleException,
  type WeeklySchedule,
} from './types';

const auth = vi.hoisted(() => ({
  state: { user: null as { uid: string } | null, isConnected: false },
}));
const accessToken = vi.hoisted(() => vi.fn());
const repository = vi.hoisted(() => ({
  deleteScheduleException: vi.fn(),
  getOrCreateWeeklySchedule: vi.fn(),
  getScheduleException: vi.fn(),
  saveScheduleException: vi.fn(),
  saveWeeklySchedule: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({ useAuth: () => auth.state }));
vi.mock('../../lib/auth', () => ({ getAccessToken: accessToken }));
vi.mock('./scheduleRepository', () => repository);

import { useDailyStudyAvailability } from './useDailyStudyAvailability';

const LOCAL_DATE = '2026-08-24';
const CALENDAR_WARNING = 'Não foi possível carregar as exceções do Google Calendar.';

function storedSchedule(): WeeklySchedule {
  return {
    version: 1,
    timeZone: SAO_PAULO_TIME_ZONE,
    blockPolicy: {
      blockMinutes: 50,
      shortBreakMinutes: 10,
      longBreakMinutes: 30,
      blocksBeforeLongBreak: 3,
    },
    days: {
      monday: [{ id: 'stored-study', label: 'Estudo salvo', kind: 'study_window', start: '15:00', end: '17:00' }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    updatedAt: '2026-08-24T09:00:00-03:00',
  };
}

function storedException(): ScheduleException {
  return {
    localDate: LOCAL_DATE,
    timeZone: SAO_PAULO_TIME_ZONE,
    reason: 'appointment',
    operation: 'busy_interval',
    intervals: [{ start: '16:00', end: '16:20' }],
    updatedAt: '2026-08-24T10:00:00-03:00',
  };
}

describe('useDailyStudyAvailability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date('2026-08-24T15:00:00.000Z'));
    auth.state = { user: null, isConnected: false };
    repository.getOrCreateWeeklySchedule.mockResolvedValue(storedSchedule());
    repository.getScheduleException.mockResolvedValue(undefined);
    repository.saveWeeklySchedule.mockResolvedValue(undefined);
    repository.saveScheduleException.mockResolvedValue(undefined);
    repository.deleteScheduleException.mockResolvedValue(undefined);
    accessToken.mockResolvedValue('calendar-token');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ events: [] }),
    }));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('uses an in-memory seed preview with a disconnected warning when signed out', async () => {
    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.schedule?.days.monday.find((entry) => entry.kind === 'study_window')).toMatchObject({
      start: '14:40',
      end: '20:30',
    });
    expect(result.current.availability).toMatchObject({
      totalMinutes: 250,
      status: 'ready',
      warnings: [{ code: 'calendar-disconnected' }],
    });
    expect(repository.getOrCreateWeeklySchedule).not.toHaveBeenCalled();
    expect(repository.saveWeeklySchedule).not.toHaveBeenCalled();
  });

  it('uses stored availability and the disconnected Calendar state for an authenticated user without Google', async () => {
    auth.state = { user: { uid: 'user-1' }, isConnected: false };
    const value = storedSchedule();
    repository.getOrCreateWeeklySchedule.mockResolvedValue(value);

    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.schedule).toEqual(value);
    expect(result.current.availability).toMatchObject({
      status: 'ready',
      warnings: [{ code: 'calendar-disconnected' }],
    });
    expect(result.current.availability?.intervals[0]).toMatchObject({ durationMinutes: 50 });
    expect(accessToken).not.toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });

  it('distinguishes a successful connected Calendar response with no events', async () => {
    auth.state = { user: { uid: 'user-1' }, isConnected: true };

    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.availability).toMatchObject({ status: 'ready', warnings: [] });
    expect(fetch).toHaveBeenCalledWith('/api/calendar/events?date=2026-08-24', {
      headers: { Authorization: 'Bearer calendar-token' },
    });
  });

  it('retains only stored availability and reports degraded when Calendar responds non-OK', async () => {
    auth.state = { user: { uid: 'user-1' }, isConnected: true };
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 503 } as Response);

    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.availability).toMatchObject({
      status: 'degraded',
      warnings: [{ code: 'calendar-failed', message: CALENDAR_WARNING }],
    });
    expect(result.current.availability?.intervals[0]).toMatchObject({ durationMinutes: 50 });
    expect(result.current.syncError).toBe(CALENDAR_WARNING);
  });

  it('returns no intervals and degraded without falling back to the seed when repository loading fails', async () => {
    auth.state = { user: { uid: 'user-1' }, isConnected: true };
    repository.getOrCreateWeeklySchedule.mockRejectedValue(new Error('Firestore unavailable'));

    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.schedule).toBeUndefined();
    expect(result.current.availability).toEqual({
      localDate: LOCAL_DATE,
      timeZone: SAO_PAULO_TIME_ZONE,
      intervals: [],
      totalMinutes: 0,
      status: 'degraded',
      warnings: [{ code: 'schedule-unavailable', message: 'Não foi possível carregar sua disponibilidade salva.' }],
    });
  });

  it('keeps signed-out edits in memory without invoking repository mutations', async () => {
    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const editedSchedule = { ...result.current.schedule!, updatedAt: '2026-08-24T15:30:00.000Z' };
    const exception = storedException();

    await act(async () => {
      await result.current.saveSchedule(editedSchedule);
      await result.current.saveException(exception);
    });
    expect(result.current.schedule).toEqual(editedSchedule);
    expect(result.current.exception).toEqual(exception);
    expect(repository.saveWeeklySchedule).not.toHaveBeenCalled();
    expect(repository.saveScheduleException).not.toHaveBeenCalled();

    await act(async () => result.current.deleteException());
    expect(result.current.exception).toBeUndefined();
    expect(repository.deleteScheduleException).not.toHaveBeenCalled();
  });

  it('persists authenticated schedule and exception mutations for the active user', async () => {
    auth.state = { user: { uid: 'user-1' }, isConnected: false };
    const { result } = renderHook(() => useDailyStudyAvailability(LOCAL_DATE));
    await waitFor(() => expect(result.current.loading).toBe(false));
    const editedSchedule = { ...storedSchedule(), updatedAt: '2026-08-24T15:30:00.000Z' };
    const exception = storedException();

    await act(async () => {
      await result.current.saveSchedule(editedSchedule);
      await result.current.saveException(exception);
      await result.current.deleteException();
    });

    expect(repository.saveWeeklySchedule).toHaveBeenCalledWith('user-1', editedSchedule);
    expect(repository.saveScheduleException).toHaveBeenCalledWith('user-1', exception);
    expect(repository.deleteScheduleException).toHaveBeenCalledWith('user-1', LOCAL_DATE);
  });
});
