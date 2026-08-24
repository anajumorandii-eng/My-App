import { SAO_PAULO_TIME_ZONE, type ScheduleEntry, type WeeklySchedule } from './types';

function classEntry(id: string): ScheduleEntry {
  return {
    id,
    label: 'Aulas no cursinho',
    kind: 'class',
    start: '07:00',
    end: '13:45',
  };
}

function estimatedAfternoon(day: string): ScheduleEntry[] {
  return [
    classEntry(`${day}-class`),
    {
      id: `${day}-transition`,
      label: 'Almoço e transição',
      kind: 'meal',
      start: '13:45',
      end: '14:40',
      isEstimate: true,
    },
    {
      id: `${day}-study`,
      label: 'Estudo autônomo no cursinho',
      kind: 'study_window',
      start: '14:40',
      end: '20:30',
      isEstimate: true,
    },
  ];
}

export function createInitialWeeklySchedule(nowIso: string): WeeklySchedule {
  return {
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
        classEntry('mon-class'),
        { id: 'mon-meal', label: 'Almoço', kind: 'meal', start: '13:45', end: '14:40' },
        { id: 'mon-study', label: 'Estudo autônomo no cursinho', kind: 'study_window', start: '14:40', end: '20:30' },
        { id: 'mon-transport', label: 'Deslocamento', kind: 'transport', start: '20:30', end: '21:10' },
      ],
      tuesday: estimatedAfternoon('tue'),
      wednesday: estimatedAfternoon('wed'),
      thursday: [
        { id: 'thu-class', label: 'Aulas no cursinho', kind: 'class', start: '07:00', end: '17:35' },
        {
          id: 'thu-study',
          label: 'Estudo autônomo no cursinho',
          kind: 'study_window',
          start: '17:35',
          end: '20:30',
          isEstimate: true,
        },
      ],
      friday: estimatedAfternoon('fri'),
      saturday: estimatedAfternoon('sat'),
      sunday: [],
    },
    updatedAt: nowIso,
  };
}
