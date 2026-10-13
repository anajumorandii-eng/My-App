import { SAO_PAULO_TIME_ZONE, type ScheduleEntry, type WeeklySchedule } from './types';

/** Modelo optativo baseado na rotina fornecida; nunca migra uma agenda salva. */
export function createCourseRoutine(nowIso: string): WeeklySchedule {
  const days = Object.fromEntries(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
    const entry = (suffix: string, label: string, kind: ScheduleEntry['kind'], start: string, end: string, purpose?: ScheduleEntry['purpose']): ScheduleEntry => ({
      id: `${day}-${suffix}`, label, kind, start, end, isEstimate: true, ...(purpose ? { purpose } : {}),
    });
    const protectedNight = [entry('sleep-early', 'Sono', 'rest', '00:00', '06:00'), entry('wake', 'Preparação e deslocamento a confirmar', 'transport', '06:00', '07:00')];
    if (day === 'sunday') return [day, [...protectedNight, entry('rest-day', 'Descanso; simulado somente por exceção', 'rest', '07:00', '23:59')]];
    const afternoon = day === 'thursday' ? [
      entry('lunch', 'Almoço', 'meal', '13:45', '14:00'),
      entry('study-a', 'Estudo principal', 'study_window', '14:00', '15:40'),
      entry('break-a', 'Pausa', 'rest', '15:40', '15:50'),
      entry('works', 'Aula de Obras', 'class', '15:50', '16:40'),
      entry('transition', 'Transição', 'rest', '16:40', '17:00'),
      entry('study-b', 'Correção e prática', 'study_window', '17:00', '18:30'),
      entry('dinner', 'Descanso, jantar e deslocamento a confirmar', 'meal', '18:30', '19:30'),
    ] : [
      entry('lunch', 'Almoço', 'meal', '13:45', '14:30'),
      entry('study-a', 'Estudo principal com correção', 'study_window', '14:30', '16:30'),
      entry('break-a', 'Pausa', 'rest', '16:30', '16:45'),
      entry('study-b', 'Correção e caderno de erros', 'study_window', '16:45', '17:45'),
      entry('dinner', 'Descanso, jantar e deslocamento a confirmar', 'meal', '17:45', '19:30'),
    ];
    return [day, [...protectedNight, entry('class', day === 'saturday' ? 'Cursinho/aulão — confirmar sábado' : 'Aulas no cursinho', 'class', '07:00', '13:45'), ...afternoon,
      entry('study-c', 'Obras, redação ou prática complementar', 'study_window', '19:30', '20:15'),
      entry('break-c', 'Pausa antes da revisão', 'rest', '20:15', '20:30'),
      entry('review', 'Revisão ativa de erros e recuperação', 'study_window', '20:30', '21:00', 'review'),
      entry('wind-down', 'Desacelerar e preparar o sono', 'rest', '21:00', '22:00'),
      entry('sleep', 'Sono', 'rest', '22:00', '23:59'),
    ]];
  })) as WeeklySchedule['days'];
  return { version: 1, timeZone: SAO_PAULO_TIME_ZONE, blockPolicy: { blockMinutes: 50, allowShortStudyBlocks: true, shortBreakMinutes: 15, longBreakMinutes: 30, blocksBeforeLongBreak: 3 }, days, updatedAt: nowIso };
}
