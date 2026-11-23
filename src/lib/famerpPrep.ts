// Regras da preparação para a Famerp: montar a prova oficial de um ano como
// simulado, corrigir e derivar a trilha de prioridades. Módulo puro, sem
// React, para rodar em node:test.
//
// A trilha é calculada a partir das próprias provas do banco, nunca de uma
// lista escrita à mão: se um ano novo for importado, a incidência se ajusta
// sozinha, e não existe número no código que possa divergir do dado.

import type { Question } from '../types';

export const FAMERP_BOARD = 'FAMERP';

export function isFamerpObjective(question: Question): boolean {
  return question.examSource?.board?.toUpperCase() === FAMERP_BOARD
    && typeof question.examSource.year === 'number'
    && typeof question.examSource.questionNumber === 'number';
}

export function famerpYears(questions: Question[]): number[] {
  return [...new Set(questions.filter(isFamerpObjective).map((q) => q.examSource!.year!))].sort((a, b) => b - a);
}

/** A prova de um ano, na ordem do caderno. */
export function buildFamerpExam(questions: Question[], year: number): Question[] {
  return questions
    .filter((q) => isFamerpObjective(q) && q.examSource!.year === year)
    .sort((a, b) => a.examSource!.questionNumber! - b.examSource!.questionNumber!);
}

export interface SubjectScore {
  subject: string;
  correct: number;
  answered: number;
  total: number;
}

export interface SimuladoResult {
  correct: number;
  answered: number;
  /** Questões válidas: anuladas não entram no denominador. */
  total: number;
  annulled: number;
  bySubject: SubjectScore[];
  wrongIds: string[];
  blankIds: string[];
}

export function scoreSimulado(exam: Question[], answers: Record<string, string>): SimuladoResult {
  const subjects = new Map<string, SubjectScore>();
  const wrongIds: string[] = [];
  const blankIds: string[] = [];
  let correct = 0;
  let answered = 0;
  let annulled = 0;
  for (const question of exam) {
    if (question.status === 'annulled') { annulled += 1; continue; }
    const score = subjects.get(question.subject) ?? { subject: question.subject, correct: 0, answered: 0, total: 0 };
    score.total += 1;
    const answer = answers[question.id];
    if (!answer) blankIds.push(question.id);
    else {
      score.answered += 1;
      answered += 1;
      if (answer === question.correctOptionId) { score.correct += 1; correct += 1; }
      else wrongIds.push(question.id);
    }
    subjects.set(question.subject, score);
  }
  const bySubject = [...subjects.values()].sort((a, b) => a.correct / a.total - b.correct / b.total);
  return { correct, answered, total: exam.length - annulled, annulled, bySubject, wrongIds, blankIds };
}

export interface PriorityChapter {
  subject: string;
  topicId: string;
  chapter: string;
  /** Quantas questões no total. */
  count: number;
  /** Em quantos anos distintos o capítulo caiu. */
  years: number[];
  /** 2 = caiu em 4+ anos; 1 = caiu em 3 anos. */
  stars: 1 | 2;
}

/**
 * Capítulos que caíram em pelo menos 3 anos distintos. O critério é a
 * repetição entre provas, não a contagem: com 10 questões por matéria em cada
 * ano, cinco questões num ano só dizem pouco sobre o ano seguinte.
 */
export function famerpPriorities(questions: Question[]): PriorityChapter[] {
  const groups = new Map<string, PriorityChapter>();
  for (const question of questions) {
    if (!isFamerpObjective(question) || !question.chapter) continue;
    const key = `${question.topicId}::${question.chapter}`;
    const group = groups.get(key) ?? { subject: question.subject, topicId: question.topicId, chapter: question.chapter, count: 0, years: [], stars: 1 };
    group.count += 1;
    if (!group.years.includes(question.examSource!.year!)) group.years.push(question.examSource!.year!);
    groups.set(key, group);
  }
  return [...groups.values()]
    .filter((g) => g.years.length >= 3)
    .map((g) => ({ ...g, years: g.years.sort(), stars: (g.years.length >= 4 ? 2 : 1) as 1 | 2 }))
    .sort((a, b) => b.years.length - a.years.length || b.count - a.count || a.subject.localeCompare(b.subject));
}

/** Estado salvo do simulado em andamento: a prova é longa e não pode se perder num recarregamento. */
export interface SimuladoState {
  year: number;
  minutes: number;
  startedAt: string;
  answers: Record<string, string>;
  finishedAt?: string;
}

export function parseSimuladoState(raw: string | null): SimuladoState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<SimuladoState>;
    if (typeof value.year !== 'number' || typeof value.minutes !== 'number' || typeof value.startedAt !== 'string') return null;
    if (Number.isNaN(Date.parse(value.startedAt)) || value.minutes <= 0) return null;
    const answers: Record<string, string> = {};
    for (const [id, option] of Object.entries(value.answers ?? {})) if (typeof option === 'string') answers[id] = option;
    return {
      year: value.year, minutes: value.minutes, startedAt: value.startedAt, answers,
      ...(typeof value.finishedAt === 'string' ? { finishedAt: value.finishedAt } : {}),
    };
  } catch {
    return null;
  }
}

/** Segundos restantes; negativo quando o tempo estourou. */
export function secondsRemaining(state: SimuladoState, now: Date): number {
  return Math.round(state.minutes * 60 - (now.getTime() - Date.parse(state.startedAt)) / 1000);
}

export function formatClock(totalSeconds: number): string {
  const sign = totalSeconds < 0 ? '−' : '';
  const s = Math.abs(totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${sign}${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
