import { sourceChaptersForCuts } from './topicCuts';
import { matchesReviewScope, reviewEvidenceBoards, type ReviewOptions } from './strategicReview';
import type { Topic } from '../types';
import { getLocalQuestionBank } from './contentCatalog';
import { loadExamEvidenceCases, selectExamEvidence, examEvidenceCohorts } from './examEvidence';
import { buildCombinedStudyPacket, renderStudyReference, STUDY_SOURCE_CHAR_LIMIT, type StudySelection, buildWorkStudyPacket, buildStudyPacket } from './studySources';
let material: Promise<{ questions: Awaited<ReturnType<typeof getLocalQuestionBank>>; summaries: import('./studySources').StudySummary[] }> | undefined;
export async function loadStudyPacket(topic: Topic, chapter = '', boards: string[] = [], extras: StudySelection[] = [], reviewOptions?: ReviewOptions, topicCuts = reviewOptions?.topicCuts) {
  if (topic.id.startsWith('obra:')) {
    const { loadWorkDossier } = await import('./workDossiers');
    const dossier = await loadWorkDossier(topic.id.slice(5));
    if (!dossier) throw new Error('O dossiê desta obra não está disponível.');
    return buildWorkStudyPacket(dossier);
  }
  material ??= Promise.all([getLocalQuestionBank(), import('../data/deepSummaryContent.json')]).then(([questions, summaries]) => ({ questions, summaries: summaries.default })).catch(error => { material = undefined; throw error; });
  if (reviewOptions) boards = reviewEvidenceBoards(reviewOptions);
  const selections = [{ topic, chapter }, ...extras].map(item=>{const cuts=topicCuts?.[item.topic.id];return cuts?.length ? {...item,chapter:'',chapters:sourceChaptersForCuts(item.topic,cuts).filter(Boolean)} : item;});
  const sourceMaterial = await material;
  const scopedMaterial = reviewOptions ? { ...sourceMaterial, questions: sourceMaterial.questions.filter(q => !q.examSource || matchesReviewScope(q.examSource.board, q.examSource.phase, reviewOptions)) } : sourceMaterial;
  const packet = selections.length>1 ? buildCombinedStudyPacket(selections, boards, scopedMaterial) : buildStudyPacket({ topic, ...selections[0], boards, ...scopedMaterial });
  if(selections.some(item=>topicCuts?.[item.topic.id]?.length)){
    packet.selections=selections.map(item=>({topicId:item.topic.id,topicName:item.topic.name,chapter:item.chapter,...(topicCuts?.[item.topic.id]?.length?{cuts:topicCuts[item.topic.id]}:{})}));
    packet.referenceText=renderStudyReference(packet);
    // Reserve the requested scope in the same bounded packet; drop complete
    // question sources rather than cutting an exercise in the middle.
    while(packet.referenceText.length>STUDY_SOURCE_CHAR_LIMIT){
      const index=packet.sources.map(source=>source.kind).lastIndexOf('questao');
      if(index<0)throw new Error('As fontes excedem o limite. Reduza a seleção.');
      packet.sources.splice(index,1);packet.referenceText=renderStudyReference(packet);
    }
    packet.coverage=packet.coverage.map(row=>({...row,included:packet.sources.filter(source=>source.kind==='questao'&&source.board===row.board).length}));
  }
  const evidence = selectExamEvidence((await loadExamEvidenceCases()).filter(item => { const c = examEvidenceCohorts.find(c => c.id === item.cohortId); return Boolean(c && matchesReviewScope(c.board, c.phase, reviewOptions)); }), selections.map(item => item.topic.id), boards, Math.max(4, boards.length));
  for (const item of evidence) {
    const cohort = examEvidenceCohorts.find(cohort => cohort.id === item.cohortId)!;
    const source = { id: `F${packet.sources.length + 1}`, kind: 'resumo' as const, title: `Análise de questão · ${cohort.board} ${cohort.year} · ${cohort.phase} · questão ${item.number}`,
      content: `Ficha analítica CRIVO, sem enunciado integral. Não resolver como se fosse a questão completa.\nRelação: ${item.concept}\nAtenção: ${item.trap}\nComandos: ${item.commandWords.join(', ')}.\n${item.steps.join('\n')}\nGabarito/respostas oficiais: ${cohort.answerKeyUrl}`,
      excerpt: true, board: cohort.board, topicId: item.topicId, url: cohort.examUrl };
    const candidate = { ...packet, sources: [...packet.sources, source] };
    const reference = renderStudyReference(candidate);
    if (reference.length <= STUDY_SOURCE_CHAR_LIMIT) { packet.sources.push(source); packet.referenceText = reference; }
  }
  return packet;
}
