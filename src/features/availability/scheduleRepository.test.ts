import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SAO_PAULO_TIME_ZONE, type ScheduleException, type WeeklySchedule } from './types';

const firestore = vi.hoisted(() => ({
  deleteDoc: vi.fn(),
  doc: vi.fn((_db: unknown, ...path: string[]) => ({ path: path.join('/') })),
  getDoc: vi.fn(),
  runTransaction: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('firebase/firestore', () => firestore);
vi.mock('../../lib/firestore', () => ({ db: { name: 'test-db' } }));

import {
  deleteScheduleException,
  getOrCreateWeeklySchedule,
  getScheduleException,
  saveScheduleException,
  saveWeeklySchedule,
} from './scheduleRepository';

function schedule(): WeeklySchedule {
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
      monday: [{ id: 'mon-study', label: 'Estudo', kind: 'study_window', start: '14:40', end: '20:30' }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
    },
    updatedAt: '2026-08-24T12:00:00-03:00',
  };
}

function exception(): ScheduleException {
  return {
    localDate: '2026-08-24',
    timeZone: SAO_PAULO_TIME_ZONE,
    reason: 'appointment',
    operation: 'busy_interval',
    intervals: [{ start: '16:00', end: '17:00' }],
    updatedAt: '2026-08-24T12:00:00-03:00',
  };
}

describe('scheduleRepository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestore.runTransaction.mockImplementation(async (_db, update) => update({
      get: firestore.getDoc,
      set: firestore.setDoc,
    }));
  });

  it('seeds a missing weekly schedule once at the user document path', async () => {
    firestore.getDoc.mockResolvedValue({ exists: () => false, data: () => undefined });

    const result = await getOrCreateWeeklySchedule('user-1');

    expect(firestore.doc).toHaveBeenCalledWith({ name: 'test-db' }, 'users', 'user-1', 'data', 'weeklySchedule');
    expect(firestore.setDoc).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).toHaveBeenCalledWith(
      { path: 'users/user-1/data/weeklySchedule' },
      expect.objectContaining({ version: 1, timeZone: SAO_PAULO_TIME_ZONE }),
    );
    expect(result.days.monday.find((entry) => entry.kind === 'study_window')).toMatchObject({ start: '14:40', end: '20:30' });
  });

  it('returns an existing valid schedule without overwriting it', async () => {
    const existing = schedule();
    firestore.getDoc.mockResolvedValue({ exists: () => true, data: () => existing });

    await expect(getOrCreateWeeklySchedule('user-1')).resolves.toEqual(existing);

    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('keeps a concurrent edited schedule when Firestore retries the create transaction', async () => {
    const concurrentEdit: WeeklySchedule = {
      ...schedule(),
      days: { ...schedule().days, monday: [{ id: 'user-edit', label: 'Estudo editado', kind: 'study_window', start: '15:00', end: '20:30' }] },
    };
    firestore.getDoc.mockResolvedValue({ exists: () => false, data: () => undefined });
    firestore.runTransaction.mockImplementation(async (_db, update) => {
      const transaction = {
        get: vi.fn()
          .mockResolvedValueOnce({ exists: () => false, data: () => undefined })
          .mockResolvedValueOnce({ exists: () => true, data: () => concurrentEdit }),
        set: vi.fn(),
      };

      await update(transaction);
      return update(transaction);
    });

    await expect(getOrCreateWeeklySchedule('user-1')).resolves.toEqual(concurrentEdit);
    expect(firestore.runTransaction).toHaveBeenCalledTimes(1);
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });

  it('rejects an empty user id before accessing Firestore', async () => {
    await expect(getOrCreateWeeklySchedule('')).rejects.toThrow('A user id is required');

    expect(firestore.doc).not.toHaveBeenCalled();
  });

  it('rejects a malformed loaded schedule timezone with a controlled error', async () => {
    firestore.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ ...schedule(), timeZone: 'Europe/London' }),
    });

    await expect(getOrCreateWeeklySchedule('user-1')).rejects.toThrow('Invalid weekly schedule document');
  });

  it('saves a valid recurring schedule at its user document path', async () => {
    const value = schedule();

    await saveWeeklySchedule('user-1', value);

    expect(firestore.doc).toHaveBeenCalledWith({ name: 'test-db' }, 'users', 'user-1', 'data', 'weeklySchedule');
    expect(firestore.setDoc).toHaveBeenCalledWith({ path: 'users/user-1/data/weeklySchedule' }, value);
  });

  it('reads, saves, and deletes an exception at its date-specific user path', async () => {
    const value = exception();
    firestore.getDoc.mockResolvedValue({ exists: () => true, data: () => value });

    await expect(getScheduleException('user-1', '2026-08-24')).resolves.toEqual(value);
    await saveScheduleException('user-1', value);
    await deleteScheduleException('user-1', '2026-08-24');

    expect(firestore.doc).toHaveBeenCalledWith({ name: 'test-db' }, 'users', 'user-1', 'scheduleExceptions', '2026-08-24');
    expect(firestore.setDoc).toHaveBeenCalledWith({ path: 'users/user-1/scheduleExceptions/2026-08-24' }, value);
    expect(firestore.deleteDoc).toHaveBeenCalledWith({ path: 'users/user-1/scheduleExceptions/2026-08-24' });
  });

  it('rejects an exception whose busy interval is missing', async () => {
    const invalid = { ...exception(), intervals: undefined };

    await expect(saveScheduleException('user-1', invalid)).rejects.toThrow('Invalid schedule exception');
    expect(firestore.setDoc).not.toHaveBeenCalled();
  });
});
