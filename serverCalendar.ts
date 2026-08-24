import { TZDate } from '@date-fns/tz';

const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const WALL_TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function localDateTimeToInstant(localDate: string, wallTime: string, timeZone: string): string {
  const { year, month, day } = parseLocalDate(localDate);
  const time = WALL_TIME_RE.exec(wallTime);
  if (!time) throw new Error('Invalid wall-clock time');
  const zoned = new TZDate(year, month - 1, day, Number(time[1]), Number(time[2]), timeZone);
  if (Number.isNaN(zoned.getTime())) throw new Error('Invalid timezone');
  return new Date(zoned.getTime()).toISOString();
}

export function nextLocalDate(localDate: string): string {
  const { year, month, day } = parseLocalDate(localDate);
  const next = new Date(Date.UTC(year, month - 1, day + 1));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(next.getUTCDate()).padStart(2, '0')}`;
}

export function buildCalendarEventsQuery(localDate: string) {
  parseLocalDate(localDate);
  return {
    calendarId: 'primary',
    timeMin: localDateTimeToInstant(localDate, '00:00', 'America/Sao_Paulo'),
    timeMax: localDateTimeToInstant(nextLocalDate(localDate), '00:00', 'America/Sao_Paulo'),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 100,
  };
}

function parseLocalDate(localDate: string): { year: number; month: number; day: number } {
  if (!LOCAL_DATE_RE.test(localDate)) throw new Error('Invalid local date');
  const [year, month, day] = localDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error('Invalid local date');
  }
  return { year, month, day };
}
