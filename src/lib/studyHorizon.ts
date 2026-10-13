import { resolveEffectiveStudyAvailability } from '../features/availability/availabilityEngine';
import { applyExamDayLimits } from './examDayLimits';
import { localDateTimeToDate } from '../features/availability/time';
import { sameBoard, vestibularCalendar2026 } from '../data/examCalendar';
import type { WeeklySchedule } from '../features/availability/types';
import type { StudentGoals } from '../types';
export interface HorizonDay { date: string; minutes: number; reviewMinutes: number; focus: string; }
export interface HorizonWeek { start: string; end: string; minutes: number; days: HorizonDay[]; }

/** Capacidade da rotina salva; não presume Calendar/exceções futuras. */
export function buildStudyHorizon(schedule: WeeklySchedule, goals: StudentGoals, from: string, until = '2026-12-18'): HorizonWeek[] {
  localDateTimeToDate(from, '12:00'); localDateTimeToDate(until, '12:00');
  if (from > until) return [];
  const cursor = new Date(`${from}T12:00:00Z`); const end = new Date(`${until}T12:00:00Z`);
  if ((end.getTime() - cursor.getTime()) / 86400000 > 370) throw new Error('Horizonte deve ter no máximo 370 dias.');
  const exams = vestibularCalendar2026.filter((exam) => goals.boardWeights.some((goal) => goal.weight > 0 && sameBoard(goal.board, exam.board) && (goal.phaseFocus === 'ambas' || exam.phase === 'unica' || goal.phaseFocus === exam.phase))).sort((a,b) => a.date.localeCompare(b.date));
  const weeks: HorizonWeek[] = [];
  while (cursor <= end) {
    const date = cursor.toISOString().slice(0,10);
    const available = resolveEffectiveStudyAvailability(schedule, undefined, { status: 'connected', events: [] }, date);
    const intervals = applyExamDayLimits(available.intervals, date, goals);
    const nearest = exams.find((exam) => exam.date >= date);
    const day = { date, minutes: intervals.reduce((sum, i) => sum + i.durationMinutes, 0), reviewMinutes: intervals.filter((i) => i.purpose === 'review').reduce((sum, i) => sum + i.durationMinutes, 0), focus: nearest ? `${nearest.board} · ${nearest.phase}${nearest.confidence !== 'alta' ? ' · a confirmar' : ''}` : 'Consolidar pendências e descansar' };
    if (!weeks.length || cursor.getUTCDay() === 1) weeks.push({ start: date, end: date, minutes: 0, days: [] });
    const week = weeks.at(-1)!; week.days.push(day); week.minutes += day.minutes; week.end = date;
    cursor.setUTCDate(cursor.getUTCDate()+1);
  }
  return weeks;
}
