import { TopicMastery } from '../types';

export function urgencyOf(mastery: TopicMastery): number {
  const daysSinceReview = (Date.now() - new Date(mastery.lastReviewed).getTime()) / 86400000;
  return Math.min(daysSinceReview * 5 + mastery.uncertainty * 50 + mastery.errorSignals * 8, 100);
}

export function pendingReviewCount(masteryState: TopicMastery[]): number {
  return masteryState.filter((mastery) => urgencyOf(mastery) > 50).length;
}
