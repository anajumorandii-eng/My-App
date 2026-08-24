import type {
  InteractiveSummary, RetrievalAttempt, RetrievalPrompt, SummaryAnswerOutcome,
  SummaryProgress, SummaryProgressMap, SummaryReviewSchedule,
} from '../types/summary';

export interface SummaryEvaluation { answer: string; matchedElements: string[]; firstMissingElement: string | null; transferUnlocked: boolean; }
export interface DerivedSummaryError {
  id: string; summaryId: string; questionId: string; sectionId?: string; title: string; questionPrompt: string;
  subject: string; topic: string; boards: string[]; materialIds: string[]; outcome: SummaryAnswerOutcome;
  resolved: boolean; referenceMissing: boolean; href: string | null; attempts: RetrievalAttempt[]; firstMissingElement: string | null;
}
export interface ScheduledSummaryReview {
  id: string; summaryId: string; questionId: string; summaryTitle: string; questionPrompt: string;
  subject: string; topic: string; nextReviewAt: string; intervalDays: number; isDue: boolean; href: string | null; referenceMissing: boolean;
}

const DAY_MS = 86_400_000;
const addDays = (iso: string, days: number) => new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();

export function classifySummaryAnswer(answer: string, matchedElements: string[], firstMissingElement: string | null): SummaryAnswerOutcome {
  if (!answer.trim()) return 'nao-respondida';
  if (firstMissingElement === null) return 'correta';
  return matchedElements.length ? 'parcial' : 'incorreta';
}

function intervalFor(outcome: SummaryAnswerOutcome, previous?: SummaryReviewSchedule): number {
  if (outcome === 'incorreta') return 1;
  if (outcome === 'parcial') return 3;
  if (outcome === 'correta') return Math.max(7, (previous?.intervalDays ?? 0) * 2);
  return 0;
}

function snapshotAttempt(summary: InteractiveSummary, question: RetrievalPrompt, evaluation: SummaryEvaluation, date: string): RetrievalAttempt {
  return {
    questionId: question.id, answer: evaluation.answer, matchedElements: evaluation.matchedElements,
    firstMissingElement: evaluation.firstMissingElement, outcome: classifySummaryAnswer(evaluation.answer, evaluation.matchedElements, evaluation.firstMissingElement), date,
    summaryTitle: summary.title, questionPrompt: question.prompt, sectionId: question.sectionId,
    subject: summary.subject, topic: summary.topic, boards: summary.boards.map((item) => item.board),
    materialIds: summary.sources.flatMap((source) => source.materialId ? [source.materialId] : []),
    board: question.board, phase: question.phase,
  };
}

export function applySummaryAttempt(progressMap: SummaryProgressMap, summary: InteractiveSummary, question: RetrievalPrompt, evaluation: SummaryEvaluation, date = new Date().toISOString()): SummaryProgressMap {
  const current: SummaryProgress = progressMap[summary.id] ?? { readSectionIds: [], status: 'nao-iniciado', important: false, answers: [], reviews: {} };
  const attempt = snapshotAttempt(summary, question, evaluation, date);
  if (attempt.outcome === 'nao-respondida') return progressMap;
  const reviews = current.reviews ?? {};
  const intervalDays = intervalFor(attempt.outcome, reviews[question.id]);
  return {
    ...progressMap,
    [summary.id]: {
      ...current,
      status: attempt.outcome === 'correta' ? 'dominado' : 'dificuldade',
      answers: [...current.answers, attempt],
      reviews: { ...reviews, [question.id]: { questionId: question.id, intervalDays, lastOutcome: attempt.outcome, nextReviewAt: addDays(date, intervalDays) } },
    },
  };
}

function migrateAttempt(attempt: RetrievalAttempt, summary?: InteractiveSummary): RetrievalAttempt {
  const question = summary?.retrieval.find((item) => item.id === attempt.questionId);
  return {
    ...attempt,
    outcome: attempt.outcome ?? classifySummaryAnswer(attempt.answer ?? '', attempt.matchedElements ?? [], attempt.firstMissingElement ?? null),
    summaryTitle: attempt.summaryTitle ?? summary?.title ?? 'Resumo removido',
    questionPrompt: attempt.questionPrompt ?? question?.prompt ?? 'Pergunta não disponível',
    sectionId: attempt.sectionId ?? question?.sectionId,
    subject: attempt.subject ?? summary?.subject ?? 'Disciplina não disponível',
    topic: attempt.topic ?? summary?.topic ?? 'Assunto não disponível',
    boards: attempt.boards ?? summary?.boards.map((item) => item.board) ?? [],
    materialIds: attempt.materialIds ?? summary?.sources.flatMap((source) => source.materialId ? [source.materialId] : []) ?? [],
  };
}

export function migrateSummaryProgressMap(progressMap: SummaryProgressMap, summaries: InteractiveSummary[]): SummaryProgressMap {
  return Object.fromEntries(Object.entries(progressMap).map(([summaryId, progress]) => {
    const summary = summaries.find((item) => item.id === summaryId);
    const answers = (progress.answers ?? []).map((attempt) => migrateAttempt(attempt, summary));
    const reviews = { ...(progress.reviews ?? {}) };
    for (const attempt of answers) {
      if (!reviews[attempt.questionId] && attempt.outcome !== 'nao-respondida') {
        const intervalDays = intervalFor(attempt.outcome ?? 'incorreta');
        reviews[attempt.questionId] = { questionId: attempt.questionId, intervalDays, lastOutcome: attempt.outcome ?? 'incorreta', nextReviewAt: addDays(attempt.date, intervalDays) };
      }
    }
    return [summaryId, { ...progress, answers, reviews }];
  }));
}

export function deriveSummaryErrorEntries(progressMap: SummaryProgressMap, summaries: InteractiveSummary[]): DerivedSummaryError[] {
  const migrated = migrateSummaryProgressMap(progressMap, summaries);
  return Object.entries(migrated).flatMap(([summaryId, progress]) => {
    const currentSummary = summaries.find((item) => item.id === summaryId);
    const byQuestion = new Map<string, RetrievalAttempt[]>();
    for (const attempt of progress.answers) byQuestion.set(attempt.questionId, [...(byQuestion.get(attempt.questionId) ?? []), attempt]);
    return [...byQuestion.entries()].flatMap(([questionId, attempts]) => {
      const hadError = attempts.some((attempt) => attempt.outcome === 'incorreta' || attempt.outcome === 'parcial');
      if (!hadError) return [];
      const latest = attempts[attempts.length - 1];
      const currentQuestion = currentSummary?.retrieval.find((item) => item.id === questionId);
      const referenceMissing = !currentSummary || !currentQuestion;
      return [{
        id: `summary:${summaryId}:${questionId}`, summaryId, questionId, sectionId: latest.sectionId,
        title: latest.summaryTitle ?? 'Resumo removido', questionPrompt: latest.questionPrompt ?? 'Pergunta não disponível',
        subject: latest.subject ?? 'Disciplina não disponível', topic: latest.topic ?? 'Assunto não disponível',
        boards: latest.boards ?? [], materialIds: latest.materialIds ?? [], outcome: latest.outcome ?? 'incorreta',
        resolved: latest.outcome === 'correta', referenceMissing,
        href: referenceMissing ? null : `/resumos?summary=${encodeURIComponent(summaryId)}&question=${encodeURIComponent(questionId)}`,
        attempts, firstMissingElement: latest.firstMissingElement,
      }];
    });
  }).sort((a, b) => new Date(b.attempts.at(-1)?.date ?? 0).getTime() - new Date(a.attempts.at(-1)?.date ?? 0).getTime());
}

export function getScheduledSummaryReviews(progressMap: SummaryProgressMap, summaries: InteractiveSummary[], now = new Date()): ScheduledSummaryReview[] {
  const migrated = migrateSummaryProgressMap(progressMap, summaries);
  return Object.entries(migrated).flatMap(([summaryId, progress]) => Object.values(progress.reviews ?? {}).map((review) => {
    const summary = summaries.find((item) => item.id === summaryId);
    const question = summary?.retrieval.find((item) => item.id === review.questionId);
    const latest = [...progress.answers].reverse().find((item) => item.questionId === review.questionId);
    const referenceMissing = !summary || !question;
    return {
      id: `review:${summaryId}:${review.questionId}`, summaryId, questionId: review.questionId,
      summaryTitle: summary?.title ?? latest?.summaryTitle ?? 'Resumo removido',
      questionPrompt: question?.prompt ?? latest?.questionPrompt ?? 'Pergunta não disponível',
      subject: summary?.subject ?? latest?.subject ?? 'Disciplina não disponível', topic: summary?.topic ?? latest?.topic ?? 'Assunto não disponível',
      nextReviewAt: review.nextReviewAt, intervalDays: review.intervalDays, isDue: new Date(review.nextReviewAt) <= now,
      href: referenceMissing ? null : `/resumos?summary=${encodeURIComponent(summaryId)}&question=${encodeURIComponent(review.questionId)}`,
      referenceMissing,
    };
  })).sort((a, b) => new Date(a.nextReviewAt).getTime() - new Date(b.nextReviewAt).getTime());
}
