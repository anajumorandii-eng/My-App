import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firestore';

export interface StrategyGuide {
  key: string;
  subject: string;
  topicId: string;
  topicName: string;
  chapter: string;
  board: string;
  text: string;
  savedAt: string;
}
export type StrategyGuides = Record<string, StrategyGuide>;
const storageKey = (uid: string | null) => `crivo:strategy-guides:v1:${uid ?? 'guest'}`;
export function readStrategyGuides(uid: string | null): StrategyGuides {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey(uid)) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(Object.entries(value).filter(([key, item]) => {
      const guide = item as StrategyGuide;
      return guide && guide.key === key && ['subject', 'topicId', 'topicName', 'chapter', 'board', 'text', 'savedAt'].every(field => typeof guide[field as keyof StrategyGuide] === 'string');
    })) as StrategyGuides;
  } catch { return {}; }
}
export function cacheStrategyGuides(uid: string | null, guides: StrategyGuides) {
  localStorage.setItem(storageKey(uid), JSON.stringify(guides));
}
export async function loadStrategyGuides(uid: string): Promise<StrategyGuides> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'strategyGuides'));
  return Object.fromEntries(snapshot.docs.map(item => { const guide = item.data() as StrategyGuide; return [guide.key, guide]; }));
}
export async function saveStrategyGuide(uid: string, guide: StrategyGuide) {
  await setDoc(doc(db, 'users', uid, 'strategyGuides', encodeURIComponent(guide.key)), guide);
}
