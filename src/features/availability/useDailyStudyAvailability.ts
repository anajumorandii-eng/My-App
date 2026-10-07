import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authHeaders } from '../../lib/auth';
import { resolveEffectiveStudyAvailability } from './availabilityEngine';
import {
  deleteScheduleException as deleteStoredException,
  getOrCreateWeeklySchedule,
  getScheduleException,
  saveScheduleException as saveStoredException,
  saveWeeklySchedule,
} from './scheduleRepository';
import {
  SAO_PAULO_TIME_ZONE,
  type CalendarOverlayInput,
  type DailyStudyAvailability,
  type ScheduleException,
  type WeeklySchedule,
} from './types';
import { createInitialWeeklySchedule } from './weeklyScheduleSeed';

const CALENDAR_WARNING = 'Não foi possível carregar as exceções do Google Calendar.';
const SCHEDULE_WARNING = 'Não foi possível carregar sua disponibilidade salva.';
const SAVE_WARNING = 'Não foi possível salvar essa alteração. Ela pode não persistir.';

export interface DailyStudyAvailabilityState {
  availability: DailyStudyAvailability | undefined;
  schedule: WeeklySchedule | undefined;
  exception: ScheduleException | undefined;
  loading: boolean;
  syncError: string | null;
  saveSchedule: (schedule: WeeklySchedule) => Promise<boolean>;
  saveException: (exception: ScheduleException) => Promise<void>;
  deleteException: () => Promise<void>;
}

export function useDailyStudyAvailability(localDate: string): DailyStudyAvailabilityState {
  const { user, isConnected } = useAuth();
  const [availability, setAvailability] = useState<DailyStudyAvailability>();
  const [schedule, setSchedule] = useState<WeeklySchedule>();
  const [exception, setException] = useState<ScheduleException>();
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);
  const calendarRef = useRef<CalendarOverlayInput>({ status: 'disconnected' });
  const scheduleRef = useRef<WeeklySchedule | undefined>(undefined);
  const exceptionRef = useRef<ScheduleException | undefined>(undefined);

  const uid = user?.uid;

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setLoading(true);
    setSyncError(null);
    setSchedule(undefined);
    setException(undefined);
    setAvailability(undefined);
    scheduleRef.current = undefined;
    exceptionRef.current = undefined;

    const load = async () => {
      if (!isValidLocalDate(localDate)) {
        if (!cancelled) {
          setAvailability(degradedAvailability(localDate));
          setLoading(false);
        }
        return;
      }
      if (!uid) {
        const previewSchedule = createInitialWeeklySchedule(new Date().toISOString());
        const calendar: CalendarOverlayInput = { status: 'disconnected' };
        calendarRef.current = calendar;
        if (!cancelled) {
          scheduleRef.current = previewSchedule;
          setSchedule(previewSchedule);
          setAvailability(resolveEffectiveStudyAvailability(previewSchedule, undefined, calendar, localDate));
          setLoading(false);
        }
        return;
      }

      try {
        const [calendar, loadedSchedule, loadedException] = await Promise.all([
          loadCalendarOverlay(localDate, isConnected, controller),
          getOrCreateWeeklySchedule(uid),
          getScheduleException(uid, localDate),
        ]);
        const resolved = resolveEffectiveStudyAvailability(loadedSchedule, loadedException, calendar, localDate);
        if (!cancelled) {
          calendarRef.current = calendar;
          scheduleRef.current = loadedSchedule;
          exceptionRef.current = loadedException;
          setAvailability(resolved);
          setSchedule(loadedSchedule);
          setException(loadedException);
          setSyncError(calendar.status === 'failed' ? calendar.warning : null);
        }
      } catch {
        if (!cancelled) {
          scheduleRef.current = undefined;
          exceptionRef.current = undefined;
          setAvailability(degradedAvailability(localDate));
          setSchedule(undefined);
          setException(undefined);
          setSyncError(SCHEDULE_WARNING);
        }
      } finally {
        controller.abort();
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [isConnected, localDate, uid]);

  const updateResolvedState = useCallback((nextSchedule: WeeklySchedule, nextException: ScheduleException | undefined) => {
    scheduleRef.current = nextSchedule;
    exceptionRef.current = nextException;
    setSchedule(nextSchedule);
    setException(nextException);
    setAvailability(resolveEffectiveStudyAvailability(nextSchedule, nextException, calendarRef.current, localDate));
  }, [localDate]);

  const saveSchedule = useCallback(async (nextSchedule: WeeklySchedule) => {
    try {
      if (user) await saveWeeklySchedule(user.uid, nextSchedule);
      updateResolvedState(nextSchedule, exceptionRef.current);
      setSyncError(calendarRef.current.status === 'failed' ? calendarRef.current.warning : null);
      return true;
    } catch {
      setSyncError(SAVE_WARNING);
      return false;
    }
  }, [updateResolvedState, user]);

  const saveException = useCallback(async (nextException: ScheduleException) => {
    try {
      if (user) await saveStoredException(user.uid, nextException);
      if (scheduleRef.current) updateResolvedState(scheduleRef.current, nextException);
      setSyncError(calendarRef.current.status === 'failed' ? calendarRef.current.warning : null);
    } catch {
      setSyncError(SAVE_WARNING);
    }
  }, [updateResolvedState, user]);

  const deleteException = useCallback(async () => {
    try {
      if (user) await deleteStoredException(user.uid, localDate);
      if (scheduleRef.current) updateResolvedState(scheduleRef.current, undefined);
      setSyncError(calendarRef.current.status === 'failed' ? calendarRef.current.warning : null);
    } catch {
      setSyncError(SAVE_WARNING);
    }
  }, [localDate, updateResolvedState, user]);

  return {
    availability,
    schedule,
    exception,
    loading,
    syncError,
    saveSchedule,
    saveException,
    deleteException,
  };
}

function isValidLocalDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

async function loadCalendarOverlay(localDate: string, isConnected: boolean, controller: AbortController): Promise<CalendarOverlayInput> {
  if (!isConnected) return { status: 'disconnected' };
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  try {
    // Bound the whole operation, including token acquisition and body parsing.
    // Abort alone cannot settle an unresponsive token provider or fetch mock.
    const deadline = new Promise<never>((_, reject) => {
      onAbort = () => reject(new Error('Calendar request cancelled'));
      controller.signal.addEventListener('abort', onAbort, { once: true });
      timeout = setTimeout(() => { controller.abort(); }, 5_000);
    });
    const request = (async (): Promise<CalendarOverlayInput> => {
      const headers = await authHeaders();
      if (controller.signal.aborted) throw new Error('Calendar request cancelled');
      const response = await fetch(`/api/calendar/events?date=${encodeURIComponent(localDate)}`, {
        headers, signal: controller.signal,
      });
      if (response.status === 409) return { status: 'disconnected' };
      if (!response.ok) throw new Error(`Calendar request failed: ${response.status}`);
      const data: unknown = await response.json();
      if (!isCalendarResponse(data)) throw new Error('Invalid Calendar response');
      return { status: 'connected', events: data.events };
    })();
    return await Promise.race([request, deadline]);
  } catch {
    return { status: 'failed', warning: CALENDAR_WARNING };
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
    if (onAbort) controller.signal.removeEventListener('abort', onAbort);
  }
}

function isCalendarResponse(value: unknown): value is { events: NonNullable<Extract<CalendarOverlayInput, { status: 'connected' }>['events']> } {
  return typeof value === 'object'
    && value !== null
    && Array.isArray((value as { events?: unknown }).events);
}

function degradedAvailability(localDate: string): DailyStudyAvailability {
  return {
    localDate,
    timeZone: SAO_PAULO_TIME_ZONE,
    intervals: [],
    totalMinutes: 0,
    status: 'degraded',
    warnings: [{ code: 'schedule-unavailable', message: SCHEDULE_WARNING }],
  };
}
