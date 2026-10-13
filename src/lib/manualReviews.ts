import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firestore';

export interface ManualReview {
  id: string;
  topicId: string;
  chapter: string;
  board: string;
  date: string;
  status: 'scheduled' | 'completed';
}
const DEMO_KEY = 'crivo_manual_reviews_demo_v1';
export function validReviewDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function isManualReview(value: unknown): value is ManualReview {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === 'string' && Boolean(record.id) && typeof record.topicId === 'string' && typeof record.chapter === 'string' && typeof record.board === 'string' && typeof record.date === 'string' && validReviewDate(record.date) && (record.status === 'scheduled' || record.status === 'completed');
}
export async function getManualReviews(uid: string | null): Promise<ManualReview[]> {
  if (uid) {
    const snapshot = await getDocs(collection(db, 'users', uid, 'manualReviews'));
    return snapshot.docs.map(item => ({ ...item.data(), id: item.id })).filter(isManualReview);
  }
  const parsed: unknown = JSON.parse(localStorage.getItem(DEMO_KEY) ?? '[]');
  if (!Array.isArray(parsed)) throw new Error('Histórico inválido.');
  return parsed.filter(isManualReview);
}
export async function saveManualReview(uid: string | null, review: ManualReview): Promise<void> {
  if (!isManualReview(review)) throw new Error('Revisão inválida.');
  if (uid) {
    await setDoc(doc(db, 'users', uid, 'manualReviews', review.id), review);
  } else {
    const reviews = await getManualReviews(null);
    localStorage.setItem(DEMO_KEY, JSON.stringify([...reviews.filter(item => item.id !== review.id), review]));
  }
}
