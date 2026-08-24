import type { InteractiveSummary, RetrievalPrompt, StudyStatus, SummaryProgress, SummaryReviewSchedule } from '../types/summary';

export interface SummaryFilters { query?: string; subject?: string; board?: string; phase?: string; priority?: string; status?: StudyStatus | ''; }
const fold = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function filterSummaries(items: InteractiveSummary[], filters: SummaryFilters, progress: Record<string, SummaryProgress> = {}): InteractiveSummary[] {
  const query = fold(filters.query?.trim() ?? '');
  return items.filter((item) => {
    const haystack = fold([item.title, item.subject, item.topic, item.overview, ...item.sections.map((s) => `${s.title} ${s.content}`)].join(' '));
    return (!query || haystack.includes(query))
      && (!filters.subject || item.subject === filters.subject)
      && (!filters.board || item.boards.some((b) => b.board === filters.board))
      && (!filters.phase || item.boards.some((b) => b.phases.includes(filters.phase as never)))
      && (!filters.priority || item.priority === filters.priority)
      && (!filters.status || (progress[item.id]?.status ?? 'nao-iniciado') === filters.status);
  }).sort((a, b) => {
    const rank = { 'muito-alta': 0, alta: 1, media: 2, baixa: 3 };
    const fuvest = (item: InteractiveSummary) => item.boards.some((board) => board.board === 'Fuvest') ? 0 : 1;
    return fuvest(a) - fuvest(b) || rank[a.priority] - rank[b.priority] || a.title.localeCompare(b.title, 'pt-BR');
  });
}

export function getReadingProgress(summary: InteractiveSummary, progress?: SummaryProgress): number {
  if (!summary.sections.length || !progress) return 0;
  const valid = new Set(summary.sections.map((section) => section.id));
  const read = new Set(progress.readSectionIds.filter((id) => valid.has(id))).size;
  return Math.round((read / summary.sections.length) * 100);
}

export function evaluateRetrievalAnswer(question: RetrievalPrompt, answer: string) {
  const normalized = fold(answer);
  const matchesKeyword = (keyword: string) => {
    const normalizedKeyword = fold(keyword);
    return normalized.includes(normalizedKeyword) || normalizedKeyword.split(/\s+/).filter((token) => token.length > 2).every((token) => normalized.includes(token));
  };
  const matchedElements = question.expectedElements.filter((element) => element.keywords.some(matchesKeyword)).map((element) => element.label);
  const firstMissingElement = question.expectedElements.find((element) => !matchedElements.includes(element.label))?.label ?? null;
  return { matchedElements, firstMissingElement, transferUnlocked: firstMissingElement === null };
}

export const emptySummaryProgress = (): SummaryProgress => ({ readSectionIds: [], status: 'nao-iniciado', important: false, answers: [] });
function normalizeReviews(value: unknown): Record<string, SummaryReviewSchedule> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const outcomes = ['nao-respondida', 'incorreta', 'parcial', 'correta'];
  const entries = Object.entries(value).filter((entry): entry is [string, SummaryReviewSchedule] => {
    const review = entry[1] as Partial<SummaryReviewSchedule>;
    return !!review && typeof review === 'object' && typeof review.questionId === 'string'
      && typeof review.nextReviewAt === 'string' && Number.isFinite(review.intervalDays)
      && outcomes.includes(review.lastOutcome ?? '');
  });
  return entries.length ? Object.fromEntries(entries) : undefined;
}
export function normalizeSummaryProgress(value: unknown, fallback: SummaryProgress = emptySummaryProgress()): SummaryProgress {
  if (!value || typeof value !== 'object') return fallback;
  const item = value as Partial<SummaryProgress>;
  const statuses: StudyStatus[] = ['nao-iniciado', 'em-revisao', 'dificuldade', 'dominado'];
  if (!Array.isArray(item.readSectionIds) || !item.readSectionIds.every((id) => typeof id === 'string') || !statuses.includes(item.status as StudyStatus) || typeof item.important !== 'boolean' || !Array.isArray(item.answers)) return fallback;
  const reviews = normalizeReviews(item.reviews);
  return { readSectionIds: [...new Set(item.readSectionIds)], status: item.status as StudyStatus, important: item.important, answers: item.answers, ...(reviews ? { reviews } : {}), ...(typeof item.lastOpenedAt === 'string' ? { lastOpenedAt: item.lastOpenedAt } : {}) };
}

export function normalizeSummaryProgressMap(value: unknown): Record<string, SummaryProgress> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([id, item]) => {
    if (!item || typeof item !== 'object') return [];
    const candidate = item as Partial<SummaryProgress>;
    const statuses: StudyStatus[] = ['nao-iniciado', 'em-revisao', 'dificuldade', 'dominado'];
    const valid = Array.isArray(candidate.readSectionIds) && candidate.readSectionIds.every((sectionId) => typeof sectionId === 'string')
      && statuses.includes(candidate.status as StudyStatus) && typeof candidate.important === 'boolean' && Array.isArray(candidate.answers);
    return valid ? [[id, normalizeSummaryProgress(item)]] : [];
  }));
}
