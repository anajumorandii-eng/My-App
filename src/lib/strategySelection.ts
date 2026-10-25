import type { Topic } from '../types';
import { studyAreaForTopic } from '../data/studyProtocols';
import { canonicalExamBoard } from './questionExamFilters';
export interface SavedStudySelection { cuts?: string[]; topicId: string; topicName: string; chapter: string }
export function readAdditionalSelections(raw: string | null, topics: Topic[], primaryId: string): { topicId: string; chapter: string }[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(value)) return [];
    const primary = topics.find(topic => topic.id === primaryId);
    const seen = new Set([primaryId]);
    return value.flatMap(item => {
      if (!item || typeof item !== 'object' || typeof item.topicId !== 'string' || seen.has(item.topicId)) return [];
      const topic = topics.find(topic => topic.id === item.topicId);
      if (!topic || !primary || studyAreaForTopic(topic) !== studyAreaForTopic(primary)) return [];
      seen.add(topic.id);
      return [{ topicId: topic.id, chapter: typeof item.chapter === 'string' && topic.chapters?.includes(item.chapter) ? item.chapter : '' }];
    }).slice(0, 3);
  } catch { return []; }
}
export function strategySelectionKey(subject: string, selections: SavedStudySelection[], board: string): string {
  if(selections.some(item=>item.cuts?.length))return JSON.stringify(['scoped-v1',subject,selections.map(item=>[item.topicId,item.chapter,[...(item.cuts??[])].sort()]).sort((a,b)=>String(a[0]).localeCompare(String(b[0]))),canonicalExamBoard(board)]);
  if (selections.length === 1) return JSON.stringify([subject, selections[0].topicId, selections[0].chapter, board]);
  return JSON.stringify(['combined-v1', subject, selections.map(item => [item.topicId, item.chapter]).sort((a, b) => a[0].localeCompare(b[0])), canonicalExamBoard(board)]);
}

/** Shares the API's 6,000-character reflection budget across the selected
 * topics, instead of letting the first long note crowd out every other one. */
export function combineStudyReflections(entries: { topicName: string; text: string }[]): string {
  const populated = entries.filter(item => item.text.trim());
  if (!populated.length) return '';
  const allowance = Math.floor(5200 / populated.length);
  return populated.map(item => `${item.topicName.slice(0, 100)}\n${item.text.length > allowance ? `${item.text.slice(0, allowance)}\n[Recorte; registro completo preservado.]` : item.text}`).join('\n\n');
}
