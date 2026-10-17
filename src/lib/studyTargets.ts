import type { BoardWeight, StudentGoals, UserProfile } from '../types';
import { canonicalExamBoard } from './questionExamFilters';

export function resolveStudyTargets(profile: Pick<UserProfile, 'targetExams'>, profileReady: boolean, goals?: Pick<StudentGoals, 'boardWeights'>, goalsReady = false): BoardWeight[] {
  const configured = [...(profileReady ? profile.targetExams ?? [] : []), ...(goalsReady ? (goals?.boardWeights ?? []).filter(item => item.weight > 0).map(item => item.board) : [])];
  const boards = [...new Map(configured.filter(board => board.trim()).map(board => [canonicalExamBoard(board), board.trim()])).values()];
  const targets = boards.map(board => {
    const saved = goalsReady ? goals?.boardWeights.find(item => canonicalExamBoard(item.board) === canonicalExamBoard(board)) : undefined;
    return { board, phaseFocus: saved?.phaseFocus ?? 'ambas' as const, weight: saved && Number.isFinite(saved.weight) ? Math.max(0, saved.weight) : 1 };
  });
  const total = targets.reduce((sum, item) => sum + item.weight, 0);
  return targets.map(item => ({ ...item, weight: total ? item.weight / total : 1 / targets.length }));
}
