import type { RetrievalAttempt, SummaryProgress, SummaryProgressMap, SummaryReviewSchedule } from '../types/summary';
import { emptySummaryProgress } from './summaryEngine';

export interface SummaryChange {
  id: string;
  createdAt: number;
  chapterId: string;
  addSections: string[];
  removeSections: string[];
  addAnswers: RetrievalAttempt[];
  removeAnswers: string[];
  fields: Partial<Pick<SummaryProgress, 'status' | 'important' | 'lastOpenedAt'>>;
  reviews: Record<string, SummaryReviewSchedule | null>;
  recoverIfMissing?: SummaryProgress;
}
// Existing attempts predate identifiers. Their complete immutable contents identify
// the same evidence across retries without conflating different answers or dates.
let lastChangeTime = 0;
const nextChangeTime = () => (lastChangeTime = Math.max(Date.now(), lastChangeTime + 1));
const answerKey = (answer: RetrievalAttempt) => JSON.stringify(answer, Object.keys(answer).sort());
export function createSummaryChange(chapterId: string, before: SummaryProgress, after: SummaryProgress): SummaryChange {
  const fields: SummaryChange['fields'] = {};
  for (const field of ['status', 'important', 'lastOpenedAt'] as const) {
    if (before[field] !== after[field] && after[field] !== undefined) Object.assign(fields, { [field]: after[field] });
  }
  const reviews: SummaryChange['reviews'] = {};
  for (const question of new Set([...Object.keys(before.reviews ?? {}), ...Object.keys(after.reviews ?? {})])) {
    if (JSON.stringify(before.reviews?.[question]) !== JSON.stringify(after.reviews?.[question])) reviews[question] = after.reviews?.[question] ?? null;
  }
  return {
    id: crypto.randomUUID(), createdAt: nextChangeTime(), chapterId,
    addSections: after.readSectionIds.filter(id => !before.readSectionIds.includes(id)),
    removeSections: before.readSectionIds.filter(id => !after.readSectionIds.includes(id)),
    addAnswers: after.answers.filter(answer => !before.answers.some(old => answerKey(old) === answerKey(answer))),
    removeAnswers: before.answers.filter(answer => !after.answers.some(next => answerKey(next) === answerKey(answer))).map(answerKey),
    fields, reviews,
  };
}
export function applySummaryChange(map: SummaryProgressMap, change: SummaryChange): SummaryProgressMap {
  const current = map[change.chapterId] ?? change.recoverIfMissing ?? emptySummaryProgress();
  const sections = new Set(current.readSectionIds.filter(id => !change.removeSections.includes(id)));
  change.addSections.forEach(id => sections.add(id));
  const answers = current.answers.filter(answer => !change.removeAnswers.includes(answerKey(answer)));
  for (const answer of change.addAnswers) if (!answers.some(old => answerKey(old) === answerKey(answer))) answers.push(answer);
  const reviews = { ...current.reviews };
  for (const [question, review] of Object.entries(change.reviews)) {
    if (review === null) delete reviews[question]; else reviews[question] = review;
  }
  const chapter = { ...current, ...change.fields, readSectionIds: [...sections], answers };
  if (current.reviews !== undefined || Object.keys(change.reviews).length) chapter.reviews = reviews;
  return { ...map, [change.chapterId]: chapter };
}

export function isSummaryChange(value: unknown): value is SummaryChange {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const change = value as Partial<SummaryChange>;
  const strings = (input: unknown): input is string[] => Array.isArray(input) && input.every(item => typeof item === 'string');
  const record = (input: unknown): input is Record<string, unknown> => !!input && typeof input === 'object' && !Array.isArray(input);
  if (typeof change.id !== 'string' || !change.id || change.id.includes('/') || typeof change.chapterId !== 'string' || !change.chapterId ||
      typeof change.createdAt !== 'number' || !Number.isFinite(change.createdAt) || !strings(change.addSections) || !strings(change.removeSections) ||
      !strings(change.removeAnswers) || !Array.isArray(change.addAnswers) || !record(change.fields) || !record(change.reviews)) return false;
  if (!change.addAnswers.every(answer => record(answer) && typeof answer.questionId === 'string' && typeof answer.answer === 'string' && typeof answer.date === 'string' && strings(answer.matchedElements) && (answer.firstMissingElement === null || typeof answer.firstMissingElement === 'string'))) return false;
  for (const [field, data] of Object.entries(change.fields)) {
    if (field === 'status' ? !['nao-iniciado', 'em-revisao', 'dificuldade', 'dominado'].includes(data as string) :
      field === 'important' ? typeof data !== 'boolean' : field === 'lastOpenedAt' ? typeof data !== 'string' : true) return false;
  }
  if (!Object.values(change.reviews).every(review => review === null || (record(review) && typeof review.questionId === 'string' && typeof review.nextReviewAt === 'string' && typeof review.intervalDays === 'number' && ['nao-respondida', 'incorreta', 'parcial', 'correta'].includes(review.lastOutcome as string)))) return false;
  if (change.recoverIfMissing !== undefined) {
    const chapter = change.recoverIfMissing;
    if (!record(chapter) || !strings(chapter.readSectionIds) || typeof chapter.important !== 'boolean' || !Array.isArray(chapter.answers) || !['nao-iniciado', 'em-revisao', 'dificuldade', 'dominado'].includes(chapter.status)) return false;
  }
  return true;
}
