import { TZDate } from '@date-fns/tz';
import { scheduleStudyBlocks, type CandidateStudyWindow } from './blockScheduler';
import { localDateTimeToDate, localDateTimeToIso } from './time';
import {
  SAO_PAULO_TIME_ZONE,
  type AvailabilityCalendarEvent,
  type CalendarOverlayInput,
  type DailyStudyAvailability,
  type ScheduleException,
  type Weekday,
  type WeeklySchedule,
} from './types';

type TimeRange = { start: string; end: string };

const WEEKDAYS: Weekday[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

export function resolveEffectiveStudyAvailability(
  schedule: WeeklySchedule,
  exception: ScheduleException | undefined,
  calendar: CalendarOverlayInput,
  localDate: string,
): DailyStudyAvailability {
  validateInput(schedule, exception, localDate);

  const weekday = WEEKDAYS[localDateTimeToDate(localDate, '00:00').getDay()];
  let windows = schedule.days[weekday]
    .filter((entry) => entry.kind === 'study_window')
    .map(({ start, end }) => ({ start, end }));

  windows = applyException(windows, exception, localDate);

  let ranges = windows.map((window) => wallRange(localDate, window));
  if (calendar.status === 'connected') {
    ranges = applyCalendarOverlay(ranges, calendar.events, localDate);
  }

  const intervals = scheduleStudyBlocks(
    localDate,
    ranges.map(toCandidateStudyWindow).filter(isCandidateStudyWindow),
    schedule.blockPolicy,
  );
  const warnings = calendarWarnings(calendar, intervals.length === 0);

  return {
    localDate,
    timeZone: SAO_PAULO_TIME_ZONE,
    intervals,
    totalMinutes: intervals.reduce((total, interval) => total + interval.durationMinutes, 0),
    status: calendar.status === 'failed' ? 'degraded' : intervals.length === 0 ? 'no-availability' : 'ready',
    warnings,
  };
}

function validateInput(schedule: WeeklySchedule, exception: ScheduleException | undefined, localDate: string): void {
  localDateTimeToDate(localDate, '00:00');
  if (schedule.timeZone !== SAO_PAULO_TIME_ZONE) {
    throw new Error('Weekly schedule must use America/Sao_Paulo');
  }
  if (!exception) return;
  if (exception.timeZone !== SAO_PAULO_TIME_ZONE) {
    throw new Error('Schedule exception must use America/Sao_Paulo');
  }
  if (exception.localDate !== localDate) {
    throw new Error('Schedule exception does not match requested date');
  }
}

function applyException(
  windows: CandidateStudyWindow[],
  exception: ScheduleException | undefined,
  localDate: string,
): CandidateStudyWindow[] {
  if (!exception) return windows;

  switch (exception.operation) {
    case 'day_unavailable':
      return [];
    case 'replacement_windows':
      return (exception.intervals ?? []).map(({ start, end }) => ({ start, end }));
    case 'busy_interval': {
      const busyRanges = (exception.intervals ?? []).map((interval) => wallRange(localDate, interval));
      return busyRanges
        .reduce(
          (remaining, busy) => remaining.flatMap((window) => subtractInterval(window, busy)),
          windows.map((window) => wallRange(localDate, window)),
        )
        .map(toCandidateStudyWindow)
        .filter(isCandidateStudyWindow);
    }
    case 'early_departure': {
      if (!exception.departureTime) throw new Error('Early departure requires a departure time');
      const departure = new Date(localDateTimeToIso(localDate, exception.departureTime)).toISOString();
      return windows
        .map((window) => {
          const range = wallRange(localDate, window);
          return { start: range.start, end: departure < range.end ? departure : range.end };
        })
        .filter((window) => window.end > window.start)
        .map(toCandidateStudyWindow)
        .filter(isCandidateStudyWindow);
    }
  }
}

function applyCalendarOverlay(ranges: TimeRange[], events: AvailabilityCalendarEvent[], localDate: string): TimeRange[] {
  return events.reduce((remaining, event) => {
    const busy = toBusyRange(event, localDate);
    return busy ? remaining.flatMap((source) => subtractInterval(source, busy)) : remaining;
  }, ranges);
}

function toBusyRange(event: AvailabilityCalendarEvent, localDate: string): TimeRange | undefined {
  if (event.transparency === 'transparent' || event.status === 'cancelled') return undefined;

  if (event.start.date || event.end.date) {
    if (!event.start.date || !event.end.date) return undefined;
    localDateTimeToDate(event.start.date, '00:00');
    localDateTimeToDate(event.end.date, '00:00');
    return event.start.date <= localDate && localDate < event.end.date
      ? wallRange(localDate, { start: '00:00', end: '23:59' })
      : undefined;
  }

  if (!event.start.dateTime || !event.end.dateTime) return undefined;
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return undefined;
  return { start: start.toISOString(), end: end.toISOString() };
}

function wallRange(localDate: string, range: CandidateStudyWindow): TimeRange {
  const start = new Date(localDateTimeToIso(localDate, range.start)).toISOString();
  const end = new Date(localDateTimeToIso(localDate, range.end)).toISOString();
  if (end <= start) throw new Error('Invalid study window order');
  return { start, end };
}

function toCandidateStudyWindow(range: TimeRange): CandidateStudyWindow | undefined {
  const window = {
    start: toWallTime(roundToMinute(range.start, 'up')),
    end: toWallTime(roundToMinute(range.end, 'down')),
  };
  return window.end > window.start ? window : undefined;
}

function isCandidateStudyWindow(window: CandidateStudyWindow | undefined): window is CandidateStudyWindow {
  return Boolean(window && window.end > window.start);
}

function roundToMinute(iso: string, direction: 'up' | 'down'): string {
  const instant = new Date(iso).getTime();
  const remainder = instant % 60_000;
  const rounded = direction === 'up' && remainder > 0
    ? instant + 60_000 - remainder
    : direction === 'down'
      ? instant - remainder
      : instant;
  return new Date(rounded).toISOString();
}

function toWallTime(iso: string): string {
  const date = new TZDate(iso, SAO_PAULO_TIME_ZONE);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function calendarWarnings(calendar: CalendarOverlayInput, noAvailability: boolean): DailyStudyAvailability['warnings'] {
  if (calendar.status === 'failed') {
    return [{ code: 'calendar-failed', message: calendar.warning }];
  }
  if (calendar.status === 'disconnected') {
    return [{ code: 'calendar-disconnected', message: 'Google Calendar não está conectado.' }];
  }
  return noAvailability
    ? [{ code: 'schedule-unavailable', message: 'Não há blocos completos de estudo disponíveis nesta data.' }]
    : [];
}

function subtractInterval(source: TimeRange, busy: TimeRange): TimeRange[] {
  if (busy.end <= source.start || busy.start >= source.end) return [source];
  return [
    source.start < busy.start ? { start: source.start, end: busy.start } : undefined,
    busy.end < source.end ? { start: busy.end, end: source.end } : undefined,
  ].filter((range): range is TimeRange => Boolean(range && range.end > range.start));
}
