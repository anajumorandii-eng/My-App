import { describe, expect, it } from 'vitest';
import { createCourseRoutine } from './courseRoutine';
import { resolveEffectiveStudyAvailability } from './availabilityEngine';
import { entriesAreSafe } from './scheduleSafety';

describe('rotina integrada do cursinho', () => {
  it('preserva aulas, Obras e descanso e oferece revisão de 30 minutos', () => {
    const schedule = createCourseRoutine('2026-10-13T12:00:00Z');
    expect(Object.entries(schedule.days).every(([day, entries]) => entriesAreSafe(day as keyof typeof schedule.days, entries))).toBe(true);
    expect(schedule.days.thursday.find((e) => e.label === 'Aula de Obras')).toMatchObject({ start: '15:50', end: '16:40', kind: 'class' });
    const day = resolveEffectiveStudyAvailability(schedule, undefined, { status: 'disconnected' }, '2026-10-13');
    expect(day.intervals.find((i) => i.purpose === 'review')).toMatchObject({ durationMinutes: 30 });
    expect(day.intervals.at(-1)?.end.slice(11, 16)).toBe('21:00');
    expect(day.intervals.every((i) => i.start.slice(11, 16) >= '14:30')).toBe(true);
  });
  it('subtrai compromissos de uma revisão sem inventar tempo disponível', () => {
    const day = resolveEffectiveStudyAvailability(createCourseRoutine('2026-10-13T12:00:00Z'), undefined, {
      status: 'connected', events: [{ id: 'busy', summary: 'Compromisso', start: { dateTime: '2026-10-13T20:30:00-03:00' }, end: { dateTime: '2026-10-13T20:45:00-03:00' } }],
    }, '2026-10-13');
    expect(day.intervals.filter((i) => i.purpose === 'review')).toEqual([expect.objectContaining({ durationMinutes: 15, start: '2026-10-13T20:45:00-03:00' })]);
  });
  it('não libera prática após 20h30 nem revisão após 21h', () => {
    const schedule = createCourseRoutine('2026-10-13T12:00:00Z');
    schedule.days.tuesday.find((e) => e.purpose === 'review')!.end = '21:15';
    expect(entriesAreSafe('tuesday', schedule.days.tuesday)).toBe(false);
  });
});

it('aproveita janelas de quinta com blocos menores sem atravessar Obras nem reduzir pausas', () => {
  const result = resolveEffectiveStudyAvailability(createCourseRoutine('2026-10-13T12:00:00Z'), undefined, { status: 'connected', events: [] }, '2026-10-15');
  expect(result.intervals.filter((i) => i.start.slice(11,16) < '15:50').map((i) => i.durationMinutes)).toEqual([50, 35]);
  expect(result.intervals.find((i) => i.start.slice(11,16) === '18:05')).toMatchObject({ durationMinutes: 25 });
});

it('mantém pelo menos 15 minutos antes da revisão das 20h30', () => {
  const result = resolveEffectiveStudyAvailability(createCourseRoutine('2026-10-13T12:00:00Z'), undefined, { status: 'connected', events: [] }, '2026-10-13');
  const evening = result.intervals.find((i) => i.start.slice(11,16) === '19:30')!;
  const review = result.intervals.find((i) => i.purpose === 'review')!;
  expect((Date.parse(review.start)-Date.parse(evening.end))/60000).toBeGreaterThanOrEqual(15);
});
