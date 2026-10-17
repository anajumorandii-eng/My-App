import type { Topic } from '../types';
import { getLocalQuestionBank } from './contentCatalog';
import { buildWorkStudyPacket, buildStudyPacket } from './studySources';
let material: Promise<{ questions: Awaited<ReturnType<typeof getLocalQuestionBank>>; summaries: import('./studySources').StudySummary[] }> | undefined;
export async function loadStudyPacket(topic: Topic, chapter = '', boards: string[] = []) {
  if (topic.id.startsWith('obra:')) {
    const { loadWorkDossier } = await import('./workDossiers');
    const dossier = await loadWorkDossier(topic.id.slice(5));
    if (!dossier) throw new Error('O dossiê desta obra não está disponível.');
    return buildWorkStudyPacket(dossier);
  }
  material ??= Promise.all([getLocalQuestionBank(), import('../data/deepSummaryContent.json')]).then(([questions, summaries]) => ({ questions, summaries: summaries.default })).catch(error => { material = undefined; throw error; });
  return buildStudyPacket({ topic, chapter, boards, ...await material });
}
