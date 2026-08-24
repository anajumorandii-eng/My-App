import type { ScheduleEntry, Weekday } from './types';

export const COURSE_DAY_CEILING = '20:30';
const COURSE_DAYS = new Set<Weekday>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']);

export function entriesAreSafe(day: Weekday, entries: ScheduleEntry[]): boolean {
  if (COURSE_DAYS.has(day) && entries.some((entry) => entry.kind === 'study_window' && entry.end > COURSE_DAY_CEILING)) return false;
  const sorted = [...entries].sort((a, b) => a.start.localeCompare(b.start));
  return sorted.every((entry, index) => index === 0 || sorted[index - 1].end <= entry.start);
}

export function safeStudyWindows(day: Weekday, entries: ScheduleEntry[]): Array<{ start: string; end: string }> {
  if (!entriesAreSafe(day, entries)) return [];
  return entries.filter((entry) => entry.kind === 'study_window').map(({ start, end }) => ({ start, end }));
}

export function ceilingForDay(day: Weekday): string | undefined {
  return COURSE_DAYS.has(day) ? COURSE_DAY_CEILING : undefined;
}

export function rangesDoNotOverlap(ranges: Array<{ start: string; end: string }>): boolean {
  const sorted = [...ranges].sort((a, b) => a.start.localeCompare(b.start));
  return sorted.every((range, index) => index === 0 || sorted[index - 1].end <= range.start);
}
