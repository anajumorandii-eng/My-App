export type FlashcardReviewHydrationState =
  | { status: 'demo'; ownerUid: null }
  | { status: 'loading' | 'ready' | 'error'; ownerUid: string };

export const flashcardReviewDemoState: FlashcardReviewHydrationState = {
  status: 'demo',
  ownerUid: null,
};

export function beginFlashcardReviewHydration(
  _state: FlashcardReviewHydrationState,
  ownerUid: string,
): FlashcardReviewHydrationState {
  return { status: 'loading', ownerUid };
}

export function failFlashcardReviewHydration(
  state: FlashcardReviewHydrationState,
  ownerUid: string,
): FlashcardReviewHydrationState {
  if (state.status !== 'loading' || state.ownerUid !== ownerUid) return state;
  return { status: 'error', ownerUid };
}

export function completeFlashcardReviewHydration(
  state: FlashcardReviewHydrationState,
  ownerUid: string,
): FlashcardReviewHydrationState {
  if (state.status !== 'loading' || state.ownerUid !== ownerUid) return state;
  return { status: 'ready', ownerUid };
}

export function isFlashcardReviewStudyReady(
  state: FlashcardReviewHydrationState,
  currentOwnerUid: string | null,
): boolean {
  if (currentOwnerUid === null) return state.status === 'demo';
  return state.status === 'ready' && state.ownerUid === currentOwnerUid;
}

export function canRecordFlashcardReview(
  state: FlashcardReviewHydrationState,
  currentOwnerUid: string | null,
): boolean {
  return isFlashcardReviewStudyReady(state, currentOwnerUid);
}

export type FlashcardReviewAccess = {
  canStudy: boolean;
  showLoading: boolean;
  showError: boolean;
  canRetry: boolean;
};

export function createFlashcardReviewAccess(
  status: FlashcardReviewHydrationState['status'],
  isReadyForStudy: boolean,
): FlashcardReviewAccess {
  return {
    canStudy: isReadyForStudy,
    showLoading: status === 'loading',
    showError: status === 'error',
    canRetry: status === 'error',
  };
}
