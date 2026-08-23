import { BacklogItem, RecoveryEvidence, TopicMastery } from '../types';
import { applyRecoveryOutcome, isDistinctRecoveryOccasion } from './backlogEngine';
import { applyReviewOutcome, ReviewQuality } from './spacedRepetition';

export interface RecoveryEvidenceResult {
  backlog: BacklogItem[];
  mastery: TopicMastery[];
  applied: boolean;
}

export function preserveLegacyMasteryRows(
  saved: TopicMastery[],
  reconciledCurrentCatalog: TopicMastery[],
): TopicMastery[] {
  const currentIds = new Set(reconciledCurrentCatalog.map((item) => item.topicId));
  return [
    ...reconciledCurrentCatalog,
    ...saved.filter((item) => !currentIds.has(item.topicId)),
  ];
}

export function applyRecoveryEvidence(
  backlog: BacklogItem[],
  mastery: TopicMastery[],
  evidence: RecoveryEvidence,
  evidenceAlreadyExists: boolean,
): RecoveryEvidenceResult {
  if (evidenceAlreadyExists) return { backlog, mastery, applied: false };

  const backlogItem = backlog.find((item) => item.id === evidence.backlogItemId);
  if (!backlogItem || backlogItem.topicId !== evidence.topicId) {
    throw new Error('A evidência não corresponde ao item de backlog e tópico informados.');
  }

  const occurredAt = new Date(evidence.occurredAt);
  if (Number.isNaN(occurredAt.getTime())) throw new Error('A evidência contém uma data inválida.');

  const changesMastery = evidence.outcome !== 'independente'
    || isDistinctRecoveryOccasion(backlogItem, occurredAt);
  const nextBacklog = backlog.map((item) => item.id === evidence.backlogItemId
    ? applyRecoveryOutcome(item, evidence.outcome, occurredAt)
    : item);

  if (!changesMastery) return { backlog: nextBacklog, mastery, applied: true };

  const quality: ReviewQuality = evidence.outcome === 'independente'
    ? 4
    : evidence.outcome === 'com_ajuda' ? 3 : 2;
  const nextMastery = mastery.map((item) => item.topicId === evidence.topicId
    ? { ...item, ...applyReviewOutcome(item, quality, occurredAt) }
    : item);

  return { backlog: nextBacklog, mastery: nextMastery, applied: true };
}
