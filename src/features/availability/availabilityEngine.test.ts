import { describe, expect, it } from 'vitest';
import { resolveEffectiveStudyAvailability } from './availabilityEngine';
import { SAO_PAULO_TIME_ZONE, type CalendarOverlayInput, type ScheduleException, type WeeklySchedule } from './types';

const localDate = '2026-08-24';
const schedule: WeeklySchedule = {
  version: 1,
  timeZone: SAO_PAULO_TIME_ZONE,
  blockPolicy: {
    blockMinutes: 50,
    shortBreakMinutes: 10,
    longBreakMinutes: 30,
    blocksBeforeLongBreak: 3,
  },
  days: {
    monday: [
      { id: 'class', label: 'Aula', kind: 'class', start: '07:00', end: '13:45' },
      { id: 'study', label: 'Estudo', kind: 'study_window', start: '14:40', end: '20:30' },
    ],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  updatedAt: '2026-08-01T00:00:00-03:00',
};

const calendarFixtures: CalendarOverlayInput[] = [
  { status: 'connected', events: [] },
  { status: 'disconnected' },
];

function exception(overrides: Partial<ScheduleException>): ScheduleException {
  return {
    localDate,
    timeZone: SAO_PAULO_TIME_ZONE,
    reason: 'appointment',
    operation: 'busy_interval',
    updatedAt: '2026-08-01T00:00:00-03:00',
    ...overrides,
  };
}

describe('resolveEffectiveStudyAvailability', () => {
  it.each(calendarFixtures)('keeps base blocks for $status without inventing time', (calendar) => {
    const result = resolveEffectiveStudyAvailability(schedule, undefined, calendar, localDate);

    expect(result.totalMinutes).toBe(250);
    expect(result.intervals.map(({ start, end }) => [start.slice(11, 16), end.slice(11, 16)])).toEqual([
      ['14:40', '15:30'], ['15:40', '16:30'], ['16:40', '17:30'], ['18:00', '18:50'], ['19:00', '19:50'],
    ]);
  });

  it('returns degraded while retaining only stored availability after Calendar failure', () => {
    const result = resolveEffectiveStudyAvailability(
      schedule,
      undefined,
      { status: 'failed', warning: 'Calendar indisponível' },
      localDate,
    );

    expect(result.status).toBe('degraded');
    expect(result.totalMinutes).toBe(250);
    expect(result.warnings[0].code).toBe('calendar-failed');
  });

  it('subtracts only a busy Calendar intersection and recalculates full blocks', () => {
    const result = resolveEffectiveStudyAvailability(schedule, undefined, {
      status: 'connected',
      events: [{
        id: 'consulta', summary: 'Consulta',
        start: { dateTime: '2026-08-24T16:00:00-03:00' },
        end: { dateTime: '2026-08-24T16:30:00-03:00' },
      }],
    }, localDate);

    expect(result.intervals.every((block) => block.end <= '2026-08-24T16:00:00-03:00' || block.start >= '2026-08-24T16:30:00-03:00')).toBe(true);
    expect(result.totalMinutes).toBe(200);
  });

  it('rounds a fractional-second Calendar end up so no block overlaps the busy event', () => {
    const result = resolveEffectiveStudyAvailability(schedule, undefined, {
      status: 'connected',
      events: [{
        id: 'precise-consulta', summary: 'Consulta',
        start: { dateTime: '2026-08-24T16:00:00-03:00' },
        end: { dateTime: '2026-08-24T16:30:30.500-03:00' },
      }],
    }, localDate);

    expect(result.intervals.every((block) => (
      block.end <= '2026-08-24T16:00:00-03:00'
      || block.start >= '2026-08-24T16:30:30.500-03:00'
    ))).toBe(true);
    expect(result.intervals.map(({ start }) => start.slice(11, 16))).toContain('16:31');
  });

  it.each([
    { label: 'transparent', transparency: 'transparent' as const },
    { label: 'cancelled', status: 'cancelled' as const },
  ])('does not subtract a $label Calendar event', ({ label: _label, ...eventState }) => {
    const result = resolveEffectiveStudyAvailability(schedule, undefined, {
      status: 'connected',
      events: [{
        id: 'free', summary: 'Livre',
        start: { dateTime: '2026-08-24T16:00:00-03:00' },
        end: { dateTime: '2026-08-24T17:00:00-03:00' },
        ...eventState,
      }],
    }, localDate);

    expect(result.totalMinutes).toBe(250);
  });

  it('removes the day for an opaque all-day Calendar event', () => {
    const result = resolveEffectiveStudyAvailability(schedule, undefined, {
      status: 'connected',
      events: [{
        id: 'holiday', summary: 'Feriado',
        start: { date: localDate },
        end: { date: '2026-08-25' },
      }],
    }, localDate);

    expect(result).toMatchObject({ totalMinutes: 0, status: 'no-availability' });
  });

  it('does not let a Calendar event during protected class time remove study time', () => {
    const result = resolveEffectiveStudyAvailability(schedule, undefined, {
      status: 'connected',
      events: [{
        id: 'class-copy', summary: 'Aula',
        start: { dateTime: '2026-08-24T08:00:00-03:00' },
        end: { dateTime: '2026-08-24T09:00:00-03:00' },
      }],
    }, localDate);

    expect(result.totalMinutes).toBe(250);
  });

  it('removes every base window for a day_unavailable exception', () => {
    const result = resolveEffectiveStudyAvailability(schedule, exception({ operation: 'day_unavailable' }), { status: 'connected', events: [] }, localDate);

    expect(result).toMatchObject({ totalMinutes: 0, status: 'no-availability' });
    expect(result.warnings[0].code).toBe('schedule-unavailable');
  });

  it('splits windows for a busy_interval exception before scheduling blocks', () => {
    const result = resolveEffectiveStudyAvailability(schedule, exception({
      operation: 'busy_interval',
      intervals: [{ start: '16:00', end: '16:30' }],
    }), { status: 'connected', events: [] }, localDate);

    expect(result.totalMinutes).toBe(200);
    expect(result.intervals.every((block) => block.end <= '2026-08-24T16:00:00-03:00' || block.start >= '2026-08-24T16:30:00-03:00')).toBe(true);
  });

  it('uses replacement_windows only for the requested date', () => {
    const result = resolveEffectiveStudyAvailability(schedule, exception({
      operation: 'replacement_windows',
      intervals: [{ start: '18:00', end: '20:00' }],
    }), { status: 'connected', events: [] }, localDate);

    expect(result.intervals.map(({ start, end }) => [start.slice(11, 16), end.slice(11, 16)])).toEqual([
      ['18:00', '18:50'], ['19:00', '19:50'],
    ]);
    expect(result.totalMinutes).toBe(100);
  });

  it('truncates each base window at early_departure', () => {
    const result = resolveEffectiveStudyAvailability(schedule, exception({
      reason: 'early_departure',
      operation: 'early_departure',
      departureTime: '18:30',
    }), { status: 'connected', events: [] }, localDate);

    expect(result.intervals.map(({ end }) => end.slice(11, 16))).toEqual(['15:30', '16:30', '17:30']);
    expect(result.totalMinutes).toBe(150);
  });

  it('never expands a window that already ends before early_departure', () => {
    const shorterSchedule: WeeklySchedule = structuredClone(schedule);
    shorterSchedule.days.monday[1].end = '17:00';

    const result = resolveEffectiveStudyAvailability(shorterSchedule, exception({
      reason: 'early_departure',
      operation: 'early_departure',
      departureTime: '18:30',
    }), { status: 'connected', events: [] }, localDate);

    expect(result.totalMinutes).toBe(100);
    expect(result.intervals.at(-1)?.end).toBe('2026-08-24T16:30:00-03:00');
  });

  it('does not mutate the recurring schedule while applying an exception', () => {
    const before = structuredClone(schedule);

    resolveEffectiveStudyAvailability(schedule, exception({ operation: 'day_unavailable' }), { status: 'connected', events: [] }, localDate);

    expect(schedule).toEqual(before);
  });

  it('fails closed for recurring windows overlapping protected time or exceeding 20:30', () => {
    const unsafe = structuredClone(schedule);
    unsafe.days.monday = [
      { id: 'class', label: 'Aula', kind: 'class', start: '14:00', end: '15:00' },
      { id: 'study', label: 'Estudo', kind: 'study_window', start: '14:40', end: '21:00' },
    ];

    const result = resolveEffectiveStudyAvailability(unsafe, undefined, { status: 'connected', events: [] }, localDate);
    expect(result.intervals).toEqual([]);
    expect(result.totalMinutes).toBe(0);
  });

  it('caps replacement windows at the Monday-Saturday 20:30 ceiling', () => {
    const result = resolveEffectiveStudyAvailability(schedule, exception({
      operation: 'replacement_windows',
      intervals: [{ start: '19:30', end: '21:30' }],
    }), { status: 'connected', events: [] }, localDate);

    expect(result.intervals).toHaveLength(1);
    expect(result.intervals[0].end).toBe('2026-08-24T20:20:00-03:00');
  });

  it('fails closed for overlapping replacement windows', () => {
    const result = resolveEffectiveStudyAvailability(schedule, exception({ operation: 'replacement_windows', intervals: [
      { start: '14:40', end: '16:00' }, { start: '15:30', end: '17:00' },
    ] }), { status: 'connected', events: [] }, localDate);
    expect(result.intervals).toEqual([]);
  });
});
