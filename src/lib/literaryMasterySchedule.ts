import { LiteraryMastery, LiteraryMasteryDimension } from '../types/literaryWorks';
import { computeSchedule, ReviewQuality } from './spacedRepetition';

const DEFAULT_EASE_FACTOR = 2.5;
const FIRST_INTERVAL_DAYS = 1;

/**
 * Aplica o resultado de uma tentativa/revisão a uma dimensão de domínio
 * literário — mesmo núcleo SM-2 usado por tópicos e flashcards
 * (spacedRepetition.ts), só que aqui o domínio é multidimensional por obra
 * (factual, formal, interpretive, comparative, fuvest_1/2, unicamp_1/2).
 */
export function applyLiteraryReviewOutcome(
  userId: string,
  workId: string,
  dimension: LiteraryMasteryDimension,
  prev: LiteraryMastery | undefined,
  quality: ReviewQuality,
  now: Date = new Date(),
  unitId?: string
): LiteraryMastery {
  const { easeFactor, intervalDays, reviewCount } = computeSchedule(
    prev?.easeFactor ?? DEFAULT_EASE_FACTOR,
    prev?.intervalDays ?? FIRST_INTERVAL_DAYS,
    prev?.reviewCount ?? 0,
    quality
  );

  const levelDelta = quality >= 4 ? 5 : quality === 3 ? 1 : -4;
  const level = Math.min(100, Math.max(0, (prev?.level ?? 0) + levelDelta));
  const uncertainty = Math.max(0.05, Math.min(1, (5 - quality) / 5));
  const errorSignals = quality < 3 ? (prev?.errorSignals ?? 0) + 1 : Math.max(0, (prev?.errorSignals ?? 0) - 1);

  return {
    userId, workId, unitId, dimension,
    level, uncertainty, errorSignals,
    lastReviewed: now.toISOString(),
    easeFactor, intervalDays, reviewCount,
  };
}
