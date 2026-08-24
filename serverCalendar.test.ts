import { describe, expect, it } from 'vitest';
import { buildCalendarEventsQuery, localDateTimeToInstant, nextLocalDate } from './serverCalendar';

describe('server Calendar date helpers', () => {
  it('builds an exact São Paulo local-day query independently of the server timezone', () => {
    expect(buildCalendarEventsQuery('2026-08-24')).toEqual({
      calendarId: 'primary',
      timeMin: '2026-08-24T03:00:00.000Z',
      timeMax: '2026-08-25T03:00:00.000Z',
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 100,
    });
  });

  it('advances calendar dates across month and year boundaries', () => {
    expect(nextLocalDate('2026-12-31')).toBe('2027-01-01');
    expect(nextLocalDate('2028-02-28')).toBe('2028-02-29');
  });

  it('rejects malformed or impossible local dates', () => {
    expect(() => buildCalendarEventsQuery('2026-02-30')).toThrow('Invalid local date');
    expect(() => buildCalendarEventsQuery('24-08-2026')).toThrow('Invalid local date');
  });

  it('converts an explicit wall time with the requested IANA timezone', () => {
    expect(localDateTimeToInstant('2026-08-24', '14:40', 'America/Sao_Paulo')).toBe('2026-08-24T17:40:00.000Z');
  });
});
