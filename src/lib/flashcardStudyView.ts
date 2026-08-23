import { Flashcard, FlashcardReview, Topic } from '../types';
import {
  buildFlashcardTopicIndex,
  FlashcardSessionSelection,
  FlashcardTopicSummary,
  selectDueCards,
} from './flashcardCatalog';

export function isFlashcardDueNavigationBlocked(
  isPersisted: boolean,
  reviewsLoading: boolean,
): boolean {
  return isPersisted && reviewsLoading;
}

export function canSelectFlashcardTopic(topic: Pick<FlashcardTopicSummary, 'total'>): boolean {
  return topic.total > 0;
}

export function createFlashcardLoadRequestToken(currentToken: number): number {
  return currentToken + 1;
}

export function isCurrentFlashcardLoadRequest(
  requestToken: number,
  currentToken: number,
): boolean {
  return requestToken === currentToken;
}

export function invalidateFlashcardLoadRequests(currentToken: number): number {
  return currentToken + 1;
}

export interface FlashcardStudySnapshot {
  topicIndex: FlashcardTopicSummary[];
  selectDue: (selection: FlashcardSessionSelection) => Flashcard[];
}

export function createFlashcardStudySnapshot(
  cards: Flashcard[],
  topics: Topic[],
  reviews: Record<string, FlashcardReview>,
  now: Date,
): FlashcardStudySnapshot {
  const snapshotNow = new Date(now.getTime());

  return {
    topicIndex: buildFlashcardTopicIndex(cards, topics, reviews, snapshotNow),
    selectDue: (selection) => selectDueCards(
      cards,
      topics,
      selection,
      reviews,
      snapshotNow,
    ),
  };
}
