import { Flashcard, FlashcardReview, Topic } from '../types';
import {
  buildFlashcardTopicIndex,
  FlashcardSessionSelection,
  FlashcardTopicSummary,
  selectDueCards,
} from './flashcardCatalog';
import { FlashcardNavigationAction } from './flashcardNavigation';

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

export interface FlashcardOwnerReset {
  ownerUid: string | null;
  navigationAction: FlashcardNavigationAction;
  cards: null;
  sessionCards: Flashcard[];
  selectionNow: Date;
}

export function createFlashcardOwnerReset(
  ownerUid: string | null,
  now: Date,
): FlashcardOwnerReset {
  return {
    ownerUid,
    navigationAction: { type: 'reset' },
    cards: null,
    sessionCards: [],
    selectionNow: now,
  };
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

export interface FlashcardSessionStart {
  snapshot: FlashcardStudySnapshot;
  sessionCards: Flashcard[];
}

export function createFlashcardSessionStart(
  cards: Flashcard[],
  topics: Topic[],
  reviews: Record<string, FlashcardReview>,
  selection: FlashcardSessionSelection,
  now: Date,
): FlashcardSessionStart {
  const snapshot = createFlashcardStudySnapshot(cards, topics, reviews, now);
  return {
    snapshot,
    sessionCards: snapshot.selectDue(selection),
  };
}
