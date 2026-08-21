import { StudentGoals } from '../types';
import { vestibularCalendar2026, VestibularExam, sameBoard, daysUntil } from '../data/examCalendar';
import { computeStudyBlocksForWeekday } from './netStudyTime';
import { currentStudyPhase, nearestActiveExamDays, StudyPhase } from './studyPhase';

export interface RoadmapWeek {
  weekStart: string; // ISO yyyy-mm-dd (segunda-feira)
  weekEnd: string; // ISO yyyy-mm-dd (domingo)
  phase: StudyPhase;
  daysToNearestExam: number | null;
  netStudyMinutes: number; // soma da semana toda (seg-dom)
  milestones: VestibularExam[]; // provas de bancas ativas que caem nessa semana
}

function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0=domingo ... 6=sábado
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function activeBoards(goals: StudentGoals): Set<string> {
  return new Set(goals.boardWeights.filter((bw) => bw.weight > 0).map((bw) => bw.board));
}

function milestonesInRange(goals: StudentGoals, start: Date, end: Date): VestibularExam[] {
  const boards = activeBoards(goals);
  return vestibularCalendar2026
    .filter((exam) => [...boards].some((board) => sameBoard(board, exam.board)))
    .filter((exam) => {
      const examDate = new Date(`${exam.date}T00:00:00`);
      return examDate >= start && examDate <= end;
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Roteiro semana a semana de `from` até `until` (inclusive), com a fase de
 * estudo (consolidação/revisão ativa/reta final) e o total de minutos de
 * estudo líquido daquela semana, calculado a partir do horário real do
 * cursinho + a janela de estudo autônomo (15h-20:30, com pausas).
 */
export function buildRoadmap(goals: StudentGoals, from: Date, until: Date): RoadmapWeek[] {
  const weeks: RoadmapWeek[] = [];
  let cursor = startOfWeekMonday(from);
  const untilMidnight = new Date(until.getFullYear(), until.getMonth(), until.getDate());

  while (cursor <= untilMidnight) {
    const weekEnd = addDays(cursor, 6);
    const weekMidpoint = addDays(cursor, 3); // quinta-feira — representativo da semana pra classificar a fase

    let netStudyMinutes = 0;
    for (let i = 0; i < 7; i++) {
      const day = addDays(cursor, i);
      netStudyMinutes += computeStudyBlocksForWeekday(day.getDay()).netMinutes;
    }

    weeks.push({
      weekStart: toIsoDate(cursor),
      weekEnd: toIsoDate(weekEnd),
      phase: currentStudyPhase(goals, weekMidpoint),
      daysToNearestExam: nearestActiveExamDays(goals, weekMidpoint),
      netStudyMinutes,
      milestones: milestonesInRange(goals, cursor, weekEnd),
    });

    cursor = addDays(cursor, 7);
  }

  return weeks;
}

/** Dias restantes até a prova mais próxima entre as bancas ativas, a partir de hoje — atalho para a UI. */
export function daysToNearestMilestone(goals: StudentGoals, now: Date = new Date()): number | null {
  return nearestActiveExamDays(goals, now);
}

/** Todas as provas futuras (bancas ativas) ordenadas por data — usado para listar os marcos do roteiro. */
export function upcomingMilestones(goals: StudentGoals, now: Date = new Date()): VestibularExam[] {
  const boards = activeBoards(goals);
  return vestibularCalendar2026
    .filter((exam) => [...boards].some((board) => sameBoard(board, exam.board)))
    .filter((exam) => daysUntil(exam.date, now) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}
