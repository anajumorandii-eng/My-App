import type { InteractiveSummary, RetrievalAttempt, SummaryAnswerOutcome, SummaryProgressMap } from '../types/summary';

export interface DashboardGroup { key: string; attempted: number; correct: number; accuracy: number | null; href: string; }
export interface DashboardRecurrence { summaryId: string; questionId: string; title: string; attempts: number; href: string | null; }
export interface DashboardPriority { id: string; title: string; subject: string; progress: number; href: string; }
export interface SummaryProgressDashboardModel {
  hasStudyData: boolean; overallAccuracy: number | null;
  answers: { correct: number; partial: number; incorrect: number; pending: number };
  subjects: DashboardGroup[]; boards: DashboardGroup[]; phases: DashboardGroup[];
  difficulties: { label: string; count: number; href: string | null }[];
  recurrences: DashboardRecurrence[];
  reviews: { overdue: number; upcoming: number; completed: number };
  priorities: DashboardPriority[]; currentAffairs: DashboardPriority[];
  continueStudy: { title: string; href: string } | null; brokenReferences: number;
}

interface BuildDashboardInput { summaries: InteractiveSummary[]; progress: SummaryProgressMap; now?: Date; }
const deepLink = (summaryId: string, questionId?: string) => `/resumos?summary=${encodeURIComponent(summaryId)}${questionId ? `&question=${encodeURIComponent(questionId)}` : ''}`;
const outcomeOf = (attempt: RetrievalAttempt): SummaryAnswerOutcome | null => {
  if (attempt.outcome && attempt.outcome !== 'nao-respondida') return attempt.outcome;
  if (!attempt.answer?.trim()) return null;
  if (attempt.firstMissingElement == null) return 'correta';
  return attempt.matchedElements?.length ? 'parcial' : 'incorreta';
};

function groups(entries: { key?: string; outcome: SummaryAnswerOutcome }[], kind: 'subject' | 'board' | 'phase'): DashboardGroup[] {
  const map = new Map<string, { attempted: number; correct: number }>();
  for (const entry of entries) {
    if (!entry.key) continue;
    const current = map.get(entry.key) ?? { attempted: 0, correct: 0 };
    current.attempted += 1;
    if (entry.outcome === 'correta') current.correct += 1;
    map.set(entry.key, current);
  }
  return [...map.entries()].map(([key, value]) => ({ key, ...value, accuracy: value.attempted ? Math.round((value.correct / value.attempted) * 100) : null, href: `/resumos?${kind}=${encodeURIComponent(key)}` }));
}

export function buildSummaryProgressDashboard({ summaries, progress, now = new Date() }: BuildDashboardInput): SummaryProgressDashboardModel {
  const catalogById = new Map(summaries.map((item) => [item.id, item]));
  const currentAttempts: RetrievalAttempt[] = [];
  const latestEntries: { summaryId: string; questionId: string; attempt: RetrievalAttempt; summary?: InteractiveSummary }[] = [];
  const difficultyCounts = new Map<string, number>();
  const recurrences: DashboardRecurrence[] = [];
  let brokenReferences = 0, completed = 0, overdue = 0, upcoming = 0;

  for (const [summaryId, itemProgress] of Object.entries(progress)) {
    const summary = catalogById.get(summaryId);
    const byQuestion = new Map<string, RetrievalAttempt[]>();
    for (const attempt of itemProgress.answers ?? []) {
      byQuestion.set(attempt.questionId, [...(byQuestion.get(attempt.questionId) ?? []), attempt]);
      if (attempt.firstMissingElement && outcomeOf(attempt) !== 'correta') difficultyCounts.set(attempt.firstMissingElement, (difficultyCounts.get(attempt.firstMissingElement) ?? 0) + 1);
    }
    for (const [questionId, attempts] of byQuestion) {
      const question = summary?.retrieval.find((item) => item.id === questionId);
      if (!summary || !question) brokenReferences += 1;
      const validAttempts = attempts.filter((attempt) => outcomeOf(attempt));
      if (!validAttempts.length) continue;
      const latest = validAttempts.at(-1)!;
      if (summary && question) currentAttempts.push(...validAttempts);
      latestEntries.push({ summaryId, questionId, attempt: latest, summary });
      completed += Math.max(0, validAttempts.length - 1);
      const unsuccessful = validAttempts.filter((attempt) => outcomeOf(attempt) !== 'correta').length;
      if (unsuccessful >= 2) recurrences.push({ summaryId, questionId, title: summary?.title ?? latest.summaryTitle ?? 'Resumo removido', attempts: unsuccessful, href: summary && question ? deepLink(summaryId, questionId) : null });
    }
    for (const review of Object.values(itemProgress.reviews ?? {})) {
      if (!Number.isFinite(new Date(review.nextReviewAt).getTime())) continue;
      if (new Date(review.nextReviewAt) <= now) overdue += 1; else upcoming += 1;
    }
  }

  const answers = { correct: 0, partial: 0, incorrect: 0, pending: 0 };
  for (const attempt of currentAttempts) {
    const outcome = outcomeOf(attempt);
    if (outcome === 'correta') answers.correct += 1;
    if (outcome === 'parcial') answers.partial += 1;
    if (outcome === 'incorreta') answers.incorrect += 1;
  }
  const attemptedCurrentQuestions = new Set(latestEntries.filter((entry) => entry.summary?.retrieval.some((item) => item.id === entry.questionId)).map((entry) => `${entry.summaryId}:${entry.questionId}`));
  answers.pending = Math.max(0, summaries.reduce((sum, item) => sum + item.retrieval.length, 0) - attemptedCurrentQuestions.size);
  const latestForGroups = latestEntries.map(({ attempt, summary }) => ({ subject: summary?.subject ?? attempt.subject, board: attempt.board, phase: attempt.phase, outcome: outcomeOf(attempt)! }));
  const attempted = answers.correct + answers.partial + answers.incorrect;
  const priorities = summaries.filter((item) => item.boards.some((board) => board.board === 'Fuvest')).map((item) => ({
    id: item.id, title: item.title, subject: item.subject,
    progress: item.sections.length ? Math.round(((progress[item.id]?.readSectionIds.filter((id) => item.sections.some((section) => section.id === id)).length ?? 0) / item.sections.length) * 100) : 0,
    href: deepLink(item.id),
  }));
  const lastOpened = Object.entries(progress).filter(([id, value]) => catalogById.has(id) && value.lastOpenedAt && Number.isFinite(new Date(value.lastOpenedAt).getTime())).sort((a, b) => new Date(b[1].lastOpenedAt!).getTime() - new Date(a[1].lastOpenedAt!).getTime())[0];

  return {
    hasStudyData: Object.values(progress).some((item) => (item.answers?.length ?? 0) > 0 || item.readSectionIds.length > 0), overallAccuracy: attempted ? Math.round((answers.correct / attempted) * 100) : null, answers,
    subjects: groups(latestForGroups.map((item) => ({ key: item.subject, outcome: item.outcome })), 'subject'),
    boards: groups(latestForGroups.map((item) => ({ key: item.board, outcome: item.outcome })), 'board'),
    phases: groups(latestForGroups.map((item) => ({ key: item.phase, outcome: item.outcome })), 'phase'),
    difficulties: [...difficultyCounts.entries()].map(([label, count]) => ({ label, count, href: null })).sort((a, b) => b.count - a.count),
    recurrences: recurrences.sort((a, b) => b.attempts - a.attempts), reviews: { overdue, upcoming, completed }, priorities,
    currentAffairs: priorities.filter((item) => catalogById.get(item.id)?.currentAffairs),
    continueStudy: lastOpened ? { title: catalogById.get(lastOpened[0])!.title, href: deepLink(lastOpened[0]) } : null, brokenReferences,
  };
}
