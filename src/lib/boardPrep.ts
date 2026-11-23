// Regras da área Provas: montar a prova oficial de um ano de qualquer banca
// como simulado, corrigir e derivar a trilha de prioridades. Módulo puro, sem
// React, para rodar em node:test.
//
// A trilha é calculada a partir das próprias provas do banco, nunca de uma
// lista escrita à mão: se um ano novo for importado, a incidência se ajusta
// sozinha, e não existe número no código que possa divergir do dado.

import type { Question } from '../types';
import { canonicalExamBoard } from './questionExamFilters';

/** Questão de prova identificada: banca, ano e número no caderno. Apostila sem ano não entra. */
export function isOfficialExamQuestion(question: Question, board: string): boolean {
  return Boolean(question.examSource && canonicalExamBoard(question.examSource.board) === canonicalExamBoard(board))
    && typeof question.examSource!.year === 'number'
    && typeof question.examSource!.questionNumber === 'number';
}

export interface ExamEdition {
  year: number;
  /** Caderno ou versão; o ENEM tem vários no mesmo ano e eles não podem se misturar. */
  version: string;
  count: number;
}

/**
 * Edições com prova suficiente para simulado. O mínimo existe porque o banco
 * guarda também recortes (25 questões da Unifesp, transcrições parciais do
 * ENEM): oferecer isso como "prova completa" mentiria sobre o simulado.
 */
export function examEditions(questions: Question[], board: string, minQuestions = 40): ExamEdition[] {
  const groups = new Map<string, ExamEdition>();
  for (const q of questions) {
    if (!isOfficialExamQuestion(q, board)) continue;
    const version = q.examSource!.version ?? '';
    const key = `${q.examSource!.year}::${version}`;
    const group = groups.get(key) ?? { year: q.examSource!.year!, version, count: 0 };
    group.count += 1;
    groups.set(key, group);
  }
  return [...groups.values()].filter((g) => g.count >= minQuestions).sort((a, b) => b.year - a.year || a.version.localeCompare(b.version));
}

/** A prova de uma edição, na ordem do caderno. */
export function buildExam(questions: Question[], board: string, year: number, version = ''): Question[] {
  return questions
    .filter((q) => isOfficialExamQuestion(q, board) && q.examSource!.year === year && (q.examSource!.version ?? '') === version)
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
  /** 2 = caiu em 80% ou mais das provas; 1 = em 60% ou mais. */
  stars: 1 | 2;
}

export interface BoardPriorities {
  /** Anos de prova identificada no banco, do mais recente ao mais antigo. */
  years: number[];
  /** Mínimo de anos para ★ e ★★ nessa banca. */
  oneStar: number;
  twoStars: number;
  chapters: PriorityChapter[];
}

/**
 * Capítulos que se repetem entre os anos. O critério é a repetição entre
 * provas, não a contagem: com 10 questões por matéria em cada ano, cinco
 * questões num ano só dizem pouco sobre o ano seguinte. Os cortes são
 * proporcionais para valer em banca com 4 ou 5 anos importados (3 e 4 de 5;
 * 3 e 4 de 4); com menos de 3 anos não há repetição que signifique algo, e a
 * lista volta vazia em vez de chamar de prioridade o que caiu duas vezes.
 */
export function boardPriorities(questions: Question[], board: string): BoardPriorities {
  const groups = new Map<string, PriorityChapter>();
  const allYears = new Set<number>();
  for (const question of questions) {
    if (!isOfficialExamQuestion(question, board)) continue;
    allYears.add(question.examSource!.year!);
    if (!question.chapter) continue;
    const key = `${question.topicId}::${question.chapter}`;
    const group = groups.get(key) ?? { subject: question.subject, topicId: question.topicId, chapter: question.chapter, count: 0, years: [], stars: 1 };
    group.count += 1;
    if (!group.years.includes(question.examSource!.year!)) group.years.push(question.examSource!.year!);
    groups.set(key, group);
  }
  const years = [...allYears].sort((a, b) => b - a);
  const oneStar = Math.ceil(years.length * 0.6);
  const twoStars = Math.ceil(years.length * 0.8);
  if (years.length < 3) return { years, oneStar, twoStars, chapters: [] };
  const chapters = [...groups.values()]
    .filter((g) => g.years.length >= oneStar)
    .map((g) => ({ ...g, years: g.years.sort(), stars: (g.years.length >= twoStars ? 2 : 1) as 1 | 2 }))
    .sort((a, b) => b.years.length - a.years.length || b.count - a.count || a.subject.localeCompare(b.subject));
  return { years, oneStar, twoStars, chapters };
}

/** Estado salvo do simulado em andamento: a prova é longa e não pode se perder num recarregamento. */
export interface SimuladoState {
  board: string;
  year: number;
  version: string;
  minutes: number;
  startedAt: string;
  answers: Record<string, string>;
  finishedAt?: string;
}

export function parseSimuladoState(raw: string | null): SimuladoState | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<SimuladoState>;
    if (typeof value.board !== 'string' || typeof value.year !== 'number' || typeof value.minutes !== 'number' || typeof value.startedAt !== 'string') return null;
    if (Number.isNaN(Date.parse(value.startedAt)) || value.minutes <= 0) return null;
    const answers: Record<string, string> = {};
    for (const [id, option] of Object.entries(value.answers ?? {})) if (typeof option === 'string') answers[id] = option;
    return {
      board: value.board, year: value.year, version: typeof value.version === 'string' ? value.version : '', minutes: value.minutes, startedAt: value.startedAt, answers,
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

export interface CountdownPhase {
  title: string;
  /** Dias até a prova no início e no fim da fase (inclusive). */
  fromDay: number;
  toDay: number;
  focus: string;
}

/**
 * Divide os dias que faltam em conteúdo, simulados e revisão. Os simulados
 * ficam com as duas últimas semanas; com menos tempo que isso, a fase de
 * conteúdo some em vez de espremer as três, porque é o simulado que treina o
 * tempo de prova e ele não se recupera na véspera.
 */
export function countdownPlan(daysLeft: number): CountdownPhase[] {
  if (daysLeft < 0) return [];
  const review: CountdownPhase = { title: 'Revisão final', fromDay: Math.min(daysLeft, 2), toDay: 0, focus: 'Nada de conteúdo novo: Caderno de Erros, fórmulas e armadilhas, sono no horário da prova.' };
  if (daysLeft <= 2) return [review];
  const simStart = Math.min(daysLeft, 14);
  const phases: CountdownPhase[] = [];
  if (daysLeft > 14) {
    phases.push({ title: 'Conteúdo pelas prioridades', fromDay: daysLeft, toDay: 15, focus: 'Assuntos ★★ e ★ com as provas mais antigas, discursivas todo dia, uma redação por semana.' });
  }
  phases.push({ title: 'Simulados', fromDay: simStart, toDay: 3, focus: 'Provas completas no tempo real, uma a cada 4 ou 5 dias; nos dias entre elas, só os assuntos que o simulado errou.' });
  phases.push(review);
  return phases;
}
