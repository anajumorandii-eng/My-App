import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFlashcardReviews, saveFlashcardReview } from '../lib/flashcardReviews';
import { applyFlashcardReview, ReviewQuality } from '../lib/flashcardScheduler';
import { FlashcardReview } from '../types';

// Sem conta conectada (modo demonstração), o progresso de flashcard só
// vive na sessão — reaproveita o mesmo aviso de "Modo demonstração" já
// usado em Revisões, sem persistência real.
export function useFlashcardReviews() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Record<string, FlashcardReview>>({});
  const [hydratedUserId, setHydratedUserId] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setReviews({});
      setHydratedUserId(null);
      setSyncError(null);
      return;
    }

    let cancelled = false;
    setReviews({});
    setSyncError(null);
    getFlashcardReviews(user.uid)
      .then((data) => {
        if (cancelled) return;
        setReviews(Object.fromEntries(data.map((r) => [r.cardId, r])));
      })
      .catch((error) => {
        console.error('Failed to load flashcard reviews:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seu progresso de flashcards salvo.');
      })
      .finally(() => {
        if (!cancelled) setHydratedUserId(user.uid);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const recordReview = useCallback(
    (cardId: string, quality: ReviewQuality) => {
      const next = applyFlashcardReview(cardId, reviews[cardId], quality);
      setReviews((prev) => ({ ...prev, [cardId]: next }));
      if (user) {
        saveFlashcardReview(user.uid, next).catch((error) => {
          console.error('Failed to save flashcard review:', error);
          setSyncError('Não foi possível salvar essa revisão. Ela pode não persistir.');
        });
      }
      return next;
    },
    [user, reviews]
  );

  return {
    reviews,
    recordReview,
    loading: !!user && hydratedUserId !== user.uid,
    syncError,
    isPersisted: !!user,
  };
}
