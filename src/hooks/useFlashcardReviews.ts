import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFlashcardReviews, saveFlashcardReview } from '../lib/flashcardReviews';
import { applyFlashcardReview, ReviewQuality } from '../lib/flashcardScheduler';
import {
  beginFlashcardReviewHydration,
  canRecordFlashcardReview,
  completeFlashcardReviewHydration,
  failFlashcardReviewHydration,
  flashcardReviewDemoState,
  FlashcardReviewHydrationState,
  isFlashcardReviewStudyReady,
} from '../lib/flashcardReviewHydration';
import { FlashcardReview } from '../types';

// Sem conta conectada (modo demonstração), o progresso de flashcard só
// vive na sessão — reaproveita o mesmo aviso de "Modo demonstração" já
// usado em Revisões, sem persistência real.
export function useFlashcardReviews() {
  const { user } = useAuth();
  const currentOwnerUid = user?.uid ?? null;
  const [reviews, setReviews] = useState<Record<string, FlashcardReview>>({});
  const [hydration, setHydration] = useState<FlashcardReviewHydrationState>(() => (
    currentOwnerUid
      ? beginFlashcardReviewHydration(flashcardReviewDemoState, currentOwnerUid)
      : flashcardReviewDemoState
  ));
  const [retryVersion, setRetryVersion] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const hydrationRef = useRef(hydration);
  const ownerUidRef = useRef(currentOwnerUid);
  hydrationRef.current = hydration;
  ownerUidRef.current = currentOwnerUid;

  useEffect(() => {
    if (currentOwnerUid === null) {
      setReviews({});
      setHydration(flashcardReviewDemoState);
      setSyncError(null);
      return;
    }

    let cancelled = false;
    const ownerUid = currentOwnerUid;
    setReviews({});
    setHydration((state) => beginFlashcardReviewHydration(state, ownerUid));
    setSyncError(null);
    getFlashcardReviews(ownerUid)
      .then((data) => {
        if (cancelled) return;
        setReviews(Object.fromEntries(data.map((r) => [r.cardId, r])));
        setHydration((state) => completeFlashcardReviewHydration(state, ownerUid));
      })
      .catch((error) => {
        console.error('Failed to load flashcard reviews:', error);
        if (!cancelled) {
          setHydration((state) => failFlashcardReviewHydration(state, ownerUid));
          setSyncError('Não foi possível carregar seu progresso de flashcards salvo.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentOwnerUid, retryVersion]);

  const retryHydration = useCallback(() => {
    if (currentOwnerUid === null) return;
    setReviews({});
    setHydration((state) => beginFlashcardReviewHydration(state, currentOwnerUid));
    setSyncError(null);
    setRetryVersion((version) => version + 1);
  }, [currentOwnerUid]);

  const recordReview = useCallback(
    async (cardId: string, quality: ReviewQuality): Promise<boolean> => {
      if (!canRecordFlashcardReview(hydrationRef.current, ownerUidRef.current)) return false;
      const ownerUid = ownerUidRef.current;
      const next = applyFlashcardReview(cardId, reviews[cardId], quality);
      if (ownerUid) {
        try {
          await saveFlashcardReview(ownerUid, next);
        } catch (error) {
          console.error('Failed to save flashcard review:', error);
          setSyncError('Não foi possível salvar essa revisão. Ela pode não persistir.');
          return false;
        }
        if (
          ownerUidRef.current !== ownerUid
          || !canRecordFlashcardReview(hydrationRef.current, ownerUid)
        ) return false;
      }
      setReviews((prev) => ({ ...prev, [cardId]: next }));
      return true;
    },
    [reviews]
  );

  const isReadyForStudy = isFlashcardReviewStudyReady(hydration, currentOwnerUid);
  const hydrationStatus = currentOwnerUid === null
    ? 'demo'
    : hydration.ownerUid === currentOwnerUid
      ? hydration.status
      : 'loading';

  return {
    reviews,
    recordReview,
    hydrationStatus,
    hydratedOwnerUid: hydration.status === 'ready' ? hydration.ownerUid : null,
    currentOwnerUid,
    isReadyForStudy,
    loading: !!user && hydrationStatus === 'loading',
    retryHydration,
    syncError,
    isPersisted: !!user,
  };
}
