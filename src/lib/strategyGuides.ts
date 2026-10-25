import { isReviewOptions } from './strategicReview';
import { collection, doc, getDocs, runTransaction } from 'firebase/firestore';
import { db } from './firestore';

export interface StrategyGuide {
  deletedAt?: string;
  kind?: 'review-summary';
  reviewOptions?: import('./strategicReview').ReviewOptions;
  key: string;
  subject: string;
  topicId: string;
  topicName: string;
  chapter: string;
  board: string;
  text: string;
  savedAt: string;
  selections?: { topicId: string; topicName: string; chapter: string; cuts?: string[] }[];
  workSlug?: string;
  workUnitId?: string;
  targetBoards?: string[];
  studyPacket?: import('./studySources').StudyPacket;
}
export type StrategyGuides = Record<string, StrategyGuide>;
export const strategyGuidesStorageKey = (uid: string | null) => `crivo:strategy-guides:v1:${uid ?? 'guest'}`;
export const STRATEGY_GUIDES_CHANGED = 'crivo:strategy-guides-changed';
export function isStrategyGuide(value: unknown): value is StrategyGuide {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const guide = value as Record<string, unknown>;
  if (guide.deletedAt !== undefined && (typeof guide.deletedAt !== 'string' || !Number.isFinite(Date.parse(guide.deletedAt)))) return false;
  if (guide.reviewOptions !== undefined && !isReviewOptions(guide.reviewOptions)) return false;
  if (guide.targetBoards !== undefined && (!Array.isArray(guide.targetBoards) || !guide.targetBoards.every(board => typeof board === 'string'))) return false;
  if (guide.kind !== undefined && guide.kind !== 'review-summary') return false;
  if (guide.selections !== undefined && (!Array.isArray(guide.selections) || !guide.selections.every(item => item && typeof item === 'object' && ['topicId', 'topicName', 'chapter'].every(field => typeof item[field] === 'string') && (item.cuts === undefined || (Array.isArray(item.cuts) && item.cuts.length<=8 && item.cuts.every((cut:unknown)=>typeof cut==='string'&&cut.length<=180)))))) return false;
  return ['key', 'subject', 'topicId', 'topicName', 'chapter', 'board', 'text', 'savedAt'].every(field => typeof guide[field] === 'string');
}
export function mergeStrategyGuides(...collections: StrategyGuides[]): StrategyGuides {
  const result: StrategyGuides = Object.create(null);
  for (const guides of collections) for (const [key, guide] of Object.entries(guides)) {
    if (!isStrategyGuide(guide) || guide.key !== key) continue;
    const previous = result[key];
    const version = (item: StrategyGuide) => Date.parse(item.deletedAt ?? item.savedAt) || 0;
    if (!previous || version(guide) > version(previous) || (version(guide) === version(previous) && (guide.deletedAt || !previous.deletedAt))) result[key] = guide;
  }
  return result;
}
export function strategyGuideUrl(guide: Pick<StrategyGuide, 'key'>): string {
  return `/aprofundamentos?${new URLSearchParams({ guia: guide.key })}`;
}
/** A marker without study text prevents stale tabs from restoring a deleted guide. */
export function deletedStrategyGuide(guide: StrategyGuide, now = Date.now()): StrategyGuide {
  const deletedAt = new Date(Math.max(now, (Date.parse(guide.savedAt) || 0) + 1)).toISOString();
  return { key: guide.key, subject: guide.subject, topicId: guide.topicId, topicName: guide.topicName,
    chapter: guide.chapter, board: guide.board, text: '', savedAt: deletedAt, deletedAt,
    ...(guide.kind ? { kind: guide.kind } : {}) };
}
export function readStrategyGuides(uid: string | null): StrategyGuides {
  try {
    const value = JSON.parse(localStorage.getItem(strategyGuidesStorageKey(uid)) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return mergeStrategyGuides(value);
  } catch { return {}; }
}
export function cacheStrategyGuides(uid: string | null, guides: StrategyGuides) {
  localStorage.setItem(strategyGuidesStorageKey(uid), JSON.stringify(mergeStrategyGuides(readStrategyGuides(uid), guides)));
  window.dispatchEvent(new CustomEvent(STRATEGY_GUIDES_CHANGED, { detail: uid }));
}
export async function loadStrategyGuides(uid: string): Promise<StrategyGuides> {
  const snapshot = await getDocs(collection(db, 'users', uid, 'strategyGuides'));
  const guides: StrategyGuides = Object.create(null);
  for (const item of snapshot.docs) { const guide = item.data(); if (isStrategyGuide(guide)) guides[guide.key] = guide; }
  return guides;
}
export async function saveStrategyGuide(uid: string, guide: StrategyGuide) {
  const reference = doc(db, 'users', uid, 'strategyGuides', encodeURIComponent(guide.key));
  // A delayed save from another tab must not overwrite a newer deletion.
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(reference);
    const previous = snapshot.data();
    const winner = mergeStrategyGuides(isStrategyGuide(previous) ? { [guide.key]: previous } : {}, { [guide.key]: guide })[guide.key];
    if (winner === guide) transaction.set(reference, guide);
  });
}
