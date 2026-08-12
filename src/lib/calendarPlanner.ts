import { CalendarEvent } from '../types';

export interface BusyInterval {
  start: Date;
  end: Date;
}

/**
 * Busy blocks from `events` that fall on the same calendar day as `day`.
 * All-day events (no dateTime, only a date) block the entire day — treated
 * as "unavailable today" (travel, holiday, etc).
 */
export function getBusyIntervalsForDay(events: CalendarEvent[], day: Date): BusyInterval[] {
  const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0);
  const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59);

  const intervals: BusyInterval[] = [];

  for (const event of events) {
    if (event.start.date && !event.start.dateTime) {
      const eventDate = new Date(`${event.start.date}T00:00:00`);
      if (eventDate.toDateString() === day.toDateString()) {
        intervals.push({ start: dayStart, end: dayEnd });
      }
      continue;
    }

    if (!event.start.dateTime || !event.end?.dateTime) continue;
    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    if (end <= dayStart || start >= dayEnd) continue;

    intervals.push({
      start: start < dayStart ? dayStart : start,
      end: end > dayEnd ? dayEnd : end,
    });
  }

  return intervals;
}

function mergeIntervals(intervals: BusyInterval[]): BusyInterval[] {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: BusyInterval[] = [{ ...sorted[0] }];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];
    if (current.start.getTime() <= last.end.getTime()) {
      last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
    } else {
      merged.push({ ...current });
    }
  }

  return merged;
}

/** Free minutes inside [windowStart, windowEnd), after subtracting busy blocks from `events`. */
export function computeFreeMinutes(events: CalendarEvent[], windowStart: Date, windowEnd: Date): number {
  if (windowEnd <= windowStart) return 0;

  const clippedBusy = mergeIntervals(
    getBusyIntervalsForDay(events, windowStart)
      .map((interval) => ({
        start: interval.start < windowStart ? windowStart : interval.start,
        end: interval.end > windowEnd ? windowEnd : interval.end,
      }))
      .filter((interval) => interval.end > interval.start)
  );

  let freeMs = windowEnd.getTime() - windowStart.getTime();
  for (const interval of clippedBusy) {
    freeMs -= interval.end.getTime() - interval.start.getTime();
  }

  return Math.max(0, Math.round(freeMs / 60000));
}

/** Default study window: from now (or 08:00, whichever is later) until 22:00 today. */
export function getDefaultStudyWindow(now: Date = new Date()): { start: Date; end: Date } {
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0);
  const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 22, 0, 0);
  return { start: now > dayStart ? now : dayStart, end: dayEnd };
}
