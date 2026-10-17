import type { Topic } from '../types';
import { getLocalQuestionBank } from './contentCatalog';
import { loadExamEvidenceCases, selectExamEvidence, examEvidenceCohorts } from './examEvidence';
import { buildCombinedStudyPacket, renderStudyReference, STUDY_SOURCE_CHAR_LIMIT, type StudySelection, buildWorkStudyPacket, buildStudyPacket } from './studySources';
let material: Promise<{ questions: Awaited<ReturnType<typeof getLocalQuestionBank>>; summaries: import('./studySources').StudySummary[] }> | undefined;
export async function loadStudyPacket(topic: Topic, chapter = '', boards: string[] = [], extras: StudySelection[] = []) {
  if (topic.id.startsWith('obra:')) {
    const { loadWorkDossier } = await import('./workDossiers');
    const dossier = await loadWorkDossier(topic.id.slice(5));
    if (!dossier) throw new Error('O dossiê desta obra não está disponível.');
    return buildWorkStudyPacket(dossier);
  }
  material ??= Promise.all([getLocalQuestionBank(), import('../data/deepSummaryContent.json')]).then(([questions, summaries]) => ({ questions, summaries: summaries.default })).catch(error => { material = undefined; throw error; });
  const selections = [{ topic, chapter }, ...extras];
  const packet = extras.length ? buildCombinedStudyPacket(selections, boards, await material) : buildStudyPacket({ topic, chapter, boards, ...await material });
  const evidence = selectExamEvidence(await loadExamEvidenceCases(), selections.map(item => item.topic.id), boards, 4);
  for (const item of evidence) {
    const cohort = examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)!;
    const source = { id: `F${packet.sources.length + 1}`, kind: 'resumo' as const, title: `Análise de questão · ${cohort.board} ${cohort.year} · ${cohort.phase} · questão ${item.number}`,
      content: `Ficha analítica CRIVO, sem enunciado integral. Não resolver como se fosse a questão completa.\nRelação: ${item.concept}\nAtenção: ${item.trap}\nComandos: ${item.commandWords.join(', ')}.\n${item.steps.join('\n')}\nGabarito/respostas oficiais: ${cohort.answerKeyUrl}`,
      excerpt: true, topicId: item.topicId, url: cohort.examUrl };
    const candidate = { ...packet, sources: [...packet.sources, source] };
    const reference = renderStudyReference(candidate);
    if (reference.length <= STUDY_SOURCE_CHAR_LIMIT) { packet.sources.push(source); packet.referenceText = reference; }
  }
  return packet;
}
