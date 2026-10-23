import type { ErrorLog } from '../types';
export function reviewErrorHistory(errors: ErrorLog[], topicId: string) {
  return errors.filter(error => error.topicId === topicId).sort((a,b) => b.date.localeCompare(a.date)).slice(0, 6).map(error =>
    JSON.stringify({ date: error.date, type: error.type, relato: error.notes.slice(0,350), ruptura: error.breakPoint?.slice(0,200), evidence: error.evidence?.slice(0,200), confidence: error.confidence ?? 'baixa', outcome: error.outcomeRating })
  ).join('\n').slice(0,6000);
}
