import { TZDate } from '@date-fns/tz';
import { SAO_PAULO_TIME_ZONE } from './types';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function localDateTimeToDate(localDate: string, wallTime: string): TZDate {
  if (!DATE_RE.test(localDate)) throw new Error('Invalid local date');
  const match = TIME_RE.exec(wallTime);
  if (!match) throw new Error('Invalid wall-clock time');
  const [year, month, day] = localDate.split('-').map(Number);
  const value = new TZDate(year, month - 1, day, Number(match[1]), Number(match[2]), SAO_PAULO_TIME_ZONE);
  if (value.getFullYear() !== year || value.getMonth() !== month - 1 || value.getDate() !== day) {
    throw new Error('Invalid local date');
  }
  return value;
}

export function localDateTimeToIso(localDate: string, wallTime: string): string {
  return localDateTimeToDate(localDate, wallTime).toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, '');
}

export function isoToLocalDate(iso: string): string {
  const date = new TZDate(iso, SAO_PAULO_TIME_ZONE);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayInSaoPaulo(now: Date = new Date()): string {
  return isoToLocalDate(now.toISOString());
}

export function formatIsoTimeInSaoPaulo(iso: string): string {
  const date = new TZDate(iso, SAO_PAULO_TIME_ZONE);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}
