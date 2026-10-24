import { isReviewOptions, type ReviewOptions } from './strategicReview';

export interface ReviewReloadSelection {
  subject: string;
  topicId: string;
  chapter: string;
  options: ReviewOptions;
  openedKey: string;
  configurationOpen: boolean;
}
const storageKey = (uid: string | null) => `crivo:review-reload:v1:${uid ?? 'guest'}`;
export function saveReviewReloadSelection(uid: string | null, selection: ReviewReloadSelection) {
  try { sessionStorage.setItem(storageKey(uid), JSON.stringify({ ...selection, savedAt: Date.now() })); }
  catch { /* Unavailable browser storage must not interrupt the asset recovery. */ }
}
export function readReviewReloadSelection(uid: string | null): ReviewReloadSelection | undefined {
  try {
    const data = JSON.parse(sessionStorage.getItem(storageKey(uid)) || 'null');
    if (!data || typeof data !== 'object' || !Number.isFinite(data.savedAt) || Date.now() - data.savedAt > 300_000 || data.savedAt > Date.now() ||
      !['subject', 'topicId', 'chapter', 'openedKey'].every(key => typeof data[key] === 'string' && data[key].length <= 16_000) ||
      typeof data.configurationOpen !== 'boolean' || !isReviewOptions(data.options) || data.options.sourceText.length > 12_000) return;
    return data;
  } catch { return; }
}
export function clearReviewReloadSelection(uid: string | null) {
  try { sessionStorage.removeItem(storageKey(uid)); } catch { /* Reading the review remains possible without storage. */ }
}
