import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firestore';
import { FlashcardReview } from '../types';

// Estado de revisão por flashcard, numa subcoleção (não um doc único como
// TopicMastery): o volume aqui é por cartão realmente estudado, não pelo
// catálogo inteiro (~17 mil cartões) — um único documento cresceria sem
// limite e estouraria o teto de 1MB do Firestore muito antes de cobrir uma
// fração relevante do baralho.
export async function getFlashcardReviews(uid: string): Promise<FlashcardReview[]> {
  const ref = collection(db, 'users', uid, 'flashcardReviews');
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data() as FlashcardReview);
}

export async function saveFlashcardReview(uid: string, review: FlashcardReview): Promise<void> {
  const ref = doc(db, 'users', uid, 'flashcardReviews', review.cardId);
  await setDoc(ref, review);
}

export async function getFlashcardReview(uid: string, cardId: string): Promise<FlashcardReview | null> {
  const ref = doc(db, 'users', uid, 'flashcardReviews', cardId);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as FlashcardReview) : null;
}
