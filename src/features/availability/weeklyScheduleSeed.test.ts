import { describe, expect, it } from 'vitest';
import { createInitialWeeklySchedule } from './weeklyScheduleSeed';

describe('createInitialWeeklySchedule', () => {
  it('seeds the compact recurring weekly schedule without academic subjects', () => {
    const seed = createInitialWeeklySchedule('2026-08-24T12:00:00-03:00');

    expect(seed.days.monday.filter((entry) => entry.kind === 'study_window')).toEqual([
      {
        id: 'mon-study',
        label: 'Estudo autônomo no cursinho',
        kind: 'study_window',
        start: '14:40',
        end: '20:30',
      },
    ]);
    expect(Object.values(seed.days).flat().some((entry) => /inglês|english/i.test(entry.label))).toBe(false);
    expect(seed.days.thursday.find((entry) => entry.id === 'thu-study')).toMatchObject({
      start: '17:35',
      end: '20:30',
      isEstimate: true,
    });
    expect(['tuesday', 'wednesday', 'friday', 'saturday'].map((day) => (
      seed.days[day as keyof typeof seed.days].find((entry) => entry.kind === 'study_window')?.end
    ))).toEqual(['20:30', '20:30', '20:30', '20:30']);
    expect(seed.days.sunday).toEqual([]);
  });

  it('keeps each weekday entry independently editable', () => {
    const seed = createInitialWeeklySchedule('2026-08-24T12:00:00-03:00');
    const tuesdayClass = seed.days.tuesday.find((entry) => entry.kind === 'class');
    const wednesdayClass = seed.days.wednesday.find((entry) => entry.kind === 'class');

    if (!tuesdayClass || !wednesdayClass) throw new Error('Expected weekday classes in the seed');
    tuesdayClass.label = 'Aula alterada';

    expect(wednesdayClass.label).toBe('Aulas no cursinho');
  });
});
