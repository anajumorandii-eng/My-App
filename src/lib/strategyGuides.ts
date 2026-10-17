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
  targetBoards?: string[];
  studyPacket?: import('./studySources').StudyPacket;
}
export type StrategyGuides = Record<string, StrategyGuide>;
export const strategyGuidesStorageKey = (uid: string | null) => `crivo:strategy-guides:v1:${uid ?? 'guest'}`;
export const STRATEGY_GUIDES_CHANGED = 'crivo:strategy-guides-changed';
export function isStrategyGuide(value: unknown): value is StrategyGuide {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const guide = value as Record<string, unknown>;
  return ['key', 'subject', 'topicId', 'topicName', 'chapter', 'board', 'text', 'savedAt'].every(field => typeof guide[field] === 'string');
}
export function mergeStrategyGuides(...collections: StrategyGuides[]): StrategyGuides {
  const result: StrategyGuides = Object.create(null);
  for (const guides of collections) for (const [key, guide] of Object.entries(guides)) {
    if (!isStrategyGuide(guide) || guide.key !== key) continue;
    if (!result[key] || guide.savedAt >= result[key].savedAt) result[key] = guide;
  }
  return result;
}
export function strategyGuideUrl(guide: Pick<StrategyGuide, 'key'>): string {
  return `/aprofundamentos?${new URLSearchParams({ guia: guide.key })}`;
}
export function readStrategyGuides(uid: string | null): StrategyGuides {
  try {
    const value = JSON.parse(localStorage.getItem(strategyGuidesStorageKey(uid)) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return mergeStrategyGuides(value);
  } catch { return {}; }
}
export function cacheStrategyGuides(uid: string | null, guides: StrategyGuides) {
  localStorage.setItem(strategyGuidesStorageKey(uid), JSON.stringify(guides));
  window.dispatchEvent(new CustomEvent(STRATEGY_GUIDES_CHANGED, { detail: uid }));
}
export async function loadStrategyGuides(uid: string): Promise<StrategyGuides> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'strategyGuides'));
  const guides: StrategyGuides = Object.create(null);
  for (const item of snapshot.docs) { const guide = item.data(); if (isStrategyGuide(guide)) guides[guide.key] = guide; }
  return guides;
}
export async function saveStrategyGuide(uid: string, guide: StrategyGuide) {
  await setDoc(doc(db, 'users', uid, 'strategyGuides', encodeURIComponent(guide.key)), guide);
}
