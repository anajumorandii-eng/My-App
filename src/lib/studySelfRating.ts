import type { TopicMastery } from '../types';
import { applyDiscursiveSelfRatingOutcome } from './spacedRepetition';

export function registerStudySelfRating(items: TopicMastery[], topicId: string, rating: 'fraco' | 'mediano' | 'forte'): TopicMastery[] {
  const previous = items.find(item => item.topicId === topicId) ?? {
    topicId, level: 0, uncertainty: 1, lastReviewed: new Date(0).toISOString(), errorSignals: 0,
  };
  const updated: TopicMastery = { ...previous, ...applyDiscursiveSelfRatingOutcome(previous, rating), origin: 'observed' };
  return items.some(item => item.topicId === topicId) ? items.map(item => item.topicId === topicId ? updated : item) : [...items, updated];
}
