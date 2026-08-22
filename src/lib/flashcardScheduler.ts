import { FlashcardReview } from '../types';
import { computeSchedule, ReviewQuality, qualityFromSelfRating } from './spacedRepetition';

export { qualityFromSelfRating };
export type { ReviewQuality };

const DEFAULT_EASE_FACTOR = 2.5;

/** Agenda um cartão nunca revisado como devido imediatamente (novo). */
export function isDue(review: FlashcardReview | undefined, now: Date = new Date()): boolean {
  if (!review) return true;
  return new Date(review.dueDate).getTime() <= now.getTime();
}

/**
 * Aplica uma autoavaliação a um flashcard, retornando o próximo estado de
 * revisão — mesmo núcleo SM-2 usado por tópicos (spacedRepetition.ts),
 * adaptado ao formato mais simples do flashcard (sem nível/incerteza, que
 * são sinais de domínio por tópico, não fazem sentido por cartão avulso).
 */
export function applyFlashcardReview(cardId: string, prev: FlashcardReview | undefined, quality: ReviewQuality, now: Date = new Date()): FlashcardReview {
  const { easeFactor, intervalDays, reviewCount } = computeSchedule(
    prev?.easeFactor ?? DEFAULT_EASE_FACTOR,
    prev?.intervalDays ?? 1,
    prev?.reviewCount ?? 0,
    quality
  );
  const dueDate = new Date(now.getTime() + intervalDays * 86400000);
  return {
    cardId,
    easeFactor,
    intervalDays,
    reviewCount,
    dueDate: dueDate.toISOString(),
    lastReviewed: now.toISOString(),
  };
}
