import { sameBoard, vestibularCalendar2026 } from '../data/examCalendar';
import type { StudentGoals } from '../types';
import type { StudyInterval } from '../features/availability/types';

export function applyExamDayLimits(intervals: StudyInterval[], localDate: string, goals: StudentGoals): StudyInterval[] {
  const exams = vestibularCalendar2026.filter((exam) => exam.confidence === 'alta' && goals.boardWeights.some((goal) => goal.weight > 0 && sameBoard(goal.board, exam.board) && (goal.phaseFocus === 'ambas' || exam.phase === 'unica' || goal.phaseFocus === exam.phase)));
  if (exams.some((exam) => exam.date === localDate)) return [];
  const date = new Date(`${localDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + 1);
  if (!exams.some((exam) => exam.date === date.toISOString().slice(0, 10))) return intervals;
  let remaining = 90;
  const result: StudyInterval[] = [];
  for (const interval of intervals) {
    const minutes = Math.min(remaining, interval.durationMinutes);
    if (minutes < 15) continue;
    result.push({ ...interval, durationMinutes: minutes, end: new Date(new Date(interval.start).getTime() + minutes * 60_000).toISOString(), purpose: 'review' });
    remaining -= minutes;
  }
  return result;
}
