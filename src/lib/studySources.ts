import type { Question, Topic } from '../types';
import { studyAreaForTopic } from '../data/studyProtocols';
import { prioritySummarySubject } from './actionablePriorities';
import { canonicalExamBoard } from './questionExamFilters';
export const STUDY_SOURCE_CHAR_LIMIT = 24000;
export interface StudySource { format?: 'markdown'; id: string; title: string; kind: 'resumo' | 'questao'; content: string; excerpt: boolean; url?: string; questionId?: string; board?: string; topicId?: string }
export interface StudyPacket { selections?: { topicId: string; topicName: string; chapter: string }[]; sources: StudySource[]; coverage: { board: string; available: number; readable: number; included: number }[]; referenceText: string; topicId: string; chapter: string }
export interface StudySummary { subject: string; topic: string; sections: { title: string; content: string }[] }
const cleanUrl = (value?: string) => { try { const url = new URL(value ?? ''); return ['http:', 'https:'].includes(url.protocol) ? url.href : undefined; } catch { return undefined; } };
const clip = (text: string, limit: number) => text.length <= limit ? text : `${text.slice(0, limit - 35).replace(/\s+\S*$/, '')}\n[Recorte: continuação não incluída.]`;

/** Seleção equilibrada de evidências; contagens descrevem o banco, nunca incidência de prova. */
export function buildStudyPacket({ topic, chapter = '', boards = [], questions, summaries }: { topic: Topic; chapter?: string; boards?: string[]; questions: Question[]; summaries: StudySummary[] }): StudyPacket {
  const requested = [...new Set(boards.map(canonicalExamBoard))];
  const pool = [...new Map(questions.filter(q => q.topicId === topic.id && (!chapter || q.chapter === chapter) && q.examSource && (!requested.length || requested.includes(canonicalExamBoard(q.examSource.board)))).map(q => [q.id, q])).values()];
  const groups = requested.length ? requested : [...new Set(pool.map(q => canonicalExamBoard(q.examSource!.board)))].sort();
  const questionText = (q: Question) => `${q.prompt}\n${q.options.map(option => `${option.id}: ${option.text}`).join('\n')}\nGabarito cadastrado (conferir origem): ${q.correctOptionId}\nComentário cadastrado: ${q.explanation}`;
  const readable = (q: Question) => !q.originalPages?.length && !q.figures?.length && questionText(q).length <= 2000;
  const selected: Question[] = [];
  const buckets = groups.map(board => pool.filter(q => canonicalExamBoard(q.examSource!.board) === board && readable(q)).sort((a, b) => (b.examSource?.year ?? 0) - (a.examSource?.year ?? 0)));
  for (let round = 0; selected.length < 6 && buckets.some(bucket => bucket[round]); round++) {
    for (const bucket of buckets) if (bucket[round] && selected.length < 6) selected.push(bucket[round]);
  }
  const sources: StudySource[] = [];
  const add = (source: Omit<StudySource, 'id'>) => sources.push({ ...source, id: `F${sources.length + 1}` });
  for (const summary of summaries.filter(s => [topic.subject, prioritySummarySubject(topic)].includes(s.subject) && (topic.chapters?.includes(s.topic) || s.topic === topic.name) && (!chapter || s.topic === chapter)).slice(0, 2)) {
    const text = summary.sections.map(section => `${section.title}\n${section.content}`).join('\n\n');
    add({ title: `Resumo editorial CRIVO: ${summary.topic} (${summary.subject})`, kind: 'resumo', content: clip(text, 3000), excerpt: text.length > 3000 });
  }
  for (const q of selected) {
    const text = `${q.prompt}\n${q.options.map(option => `${option.id}: ${option.text}`).join('\n')}\nGabarito cadastrado (conferir origem): ${q.correctOptionId}\nComentário cadastrado: ${q.explanation}`;
    add({ title: `${q.examSource!.board} · ${q.examSource!.year ?? 'ano não informado'}${q.examSource!.phase ? ` · ${q.examSource!.phase}` : ''} · ${q.id}`, kind: 'questao', questionId: q.id, board: canonicalExamBoard(q.examSource!.board), content: text, excerpt: false, ...(cleanUrl(q.examSource!.sourceUrl) ? { url: cleanUrl(q.examSource!.sourceUrl) } : {}) });
  }
  const coverage = groups.map(board => ({ board, available: pool.filter(q => canonicalExamBoard(q.examSource!.board) === board).length, readable: pool.filter(q => canonicalExamBoard(q.examSource!.board) === board && readable(q)).length, included: selected.filter(q => canonicalExamBoard(q.examSource!.board) === board).length }));
  const referenceText = sources.map(source => `[${source.id}] ${source.title}\nTipo: ${source.kind === 'resumo' ? 'síntese editorial, não prova' : 'questão cadastrada com origem identificada; não certifica fonte oficial'}${source.excerpt ? '; trecho parcial' : ''}\n${source.url ? `Origem cadastrada: ${source.url}\n` : ''}${source.content}`).join('\n\n');
  if (referenceText.length > STUDY_SOURCE_CHAR_LIMIT) throw new Error('As fontes excedem o limite deste recorte. Selecione um capítulo ou uma banca.');
  return { topicId: topic.id, chapter, sources, coverage, referenceText };
}

export function buildWorkStudyPacket(dossier: import('../types/literaryWorks').WorkDossier, unitId?: string): StudyPacket {
  const modules = dossier.modules.filter(module => module.editorialStatus === 'published');
  const analysis = modules.find(module => module.moduleType === 'analise_integral');
  if (!analysis) throw new Error('A análise desta obra ainda não foi publicada.');
  const texts = [modules.find(module => module.moduleType === 'comece_aqui'), analysis].filter(Boolean) as typeof modules;
  const sources: StudySource[] = texts.map((module, index) => ({ id: `F${index + 1}`, title: `${module.moduleType === 'comece_aqui' ? 'Introdução' : 'Análise'} da obra · ${dossier.edition.label}`, kind: 'resumo', content: clip(module.markdown, 6500), excerpt: module.markdown.length > 6500 }));
  const selectedUnit = unitId ? dossier.units.find(unit => unit.id === unitId && unit.guide.editorialStatus === 'published') : undefined;
  if (unitId && !selectedUnit) throw new Error('A unidade desta obra ainda não está disponível.');
  if (selectedUnit) {
    const text = `${selectedUnit.title}\n${selectedUnit.guide.summary}\n${selectedUnit.guide.observe.join('\n')}`;
    sources.push({ id: `F${sources.length + 1}`, title: `Unidade publicada · ${selectedUnit.title} · ${dossier.edition.label}`, kind: 'resumo', content: clip(text, 3000), excerpt: text.length > 3000 });
  }
  const units = new Set(dossier.units.filter(unit => unit.guide.editorialStatus === 'published').map(unit => unit.id));
  for (const card of dossier.evidence.filter(item => item.editorialStatus === 'published' && units.has(item.unitId) && (!unitId || item.unitId === unitId)).slice(0, 4)) {
    sources.push({ id: `F${sources.length + 1}`, title: `Passagem da obra · ${card.location} · ${dossier.edition.label}`, kind: 'resumo', content: `Citação publicada: “${card.quote}”\nContexto: ${card.context}\nRecurso: ${card.formalDevice}\nEfeito: ${card.effect}\nRelação com a obra: ${card.wholeRelation}`, excerpt: false });
  }
  const critical = dossier.sources?.filter(source => modules.some(module => module.sourceRefs.includes(source.id))).slice(0,3) ?? [];
  for (const source of critical) sources.push({ id: `F${sources.length+1}`, kind: 'resumo', title: `Crítica documentada · ${source.citation}`, content: clip(`Leitura registrada pelo dossiê, não nova leitura integral. Páginas lidas: ${source.pagesRead || 'não informadas'}.\nTese: ${source.centralThesis}\nContribuição: ${source.contribution}\nLimites: ${source.limitations}`, 1200), excerpt: true, ...(cleanUrl(source.url) ? { url: cleanUrl(source.url) } : {}) });
  sources.push({ id: `F${sources.length+1}`, kind: 'resumo', title: `Edição consultada · ${dossier.edition.label}`, content: dossier.edition.note, excerpt: true });
  const referenceText = sources.map(source => `[${source.id}] ${source.title}${source.excerpt ? ' [recorte]' : ''}\nMaterial de obra e análise editorial, não questão oficial.\n${source.url ? `Fonte: ${source.url}\n` : ''}${source.content}`).join('\n\n');
  if (referenceText.length > STUDY_SOURCE_CHAR_LIMIT) throw new Error('As fontes da obra excedem o recorte de estudo disponível.');
  return { topicId: `obra:${dossier.slug}`, chapter: selectedUnit?.title ?? '', sources, coverage: [], referenceText };
}

export function isStudyPacket(value: unknown): value is StudyPacket {
  if (!value || typeof value !== 'object') return false;
  const packet = value as StudyPacket;
  return typeof packet.topicId === 'string' && typeof packet.chapter === 'string' && typeof packet.referenceText === 'string' && Array.isArray(packet.coverage) && packet.coverage.every(item => item && typeof item.board === 'string' && ['available', 'readable', 'included'].every(field => Number.isFinite(item[field as 'available']))) && Array.isArray(packet.sources) && packet.sources.every(source => source && ['id', 'title', 'content'].every(field => typeof source[field as 'id'] === 'string') && ['resumo', 'questao'].includes(source.kind));
}

export interface StudySelection { topic: Topic; chapter: string }
export function buildCombinedStudyPacket(selections: StudySelection[], boards: string[], material: { questions: Question[]; summaries: StudySummary[] }): StudyPacket {
  if (!selections.length || selections.length > 4 || new Set(selections.map(item => item.topic.id)).size !== selections.length ||
      new Set(selections.map(item => studyAreaForTopic(item.topic))).size !== 1) throw new Error('Escolha até quatro tópicos da mesma área.');
  const packets = selections.map(item => buildStudyPacket({ ...item, boards, ...material }));
  const sources: StudySource[] = [];
  const add = (source: StudySource, topicId: string) => sources.push({ ...source, id: `F${sources.length + 1}`, topicId });
  packets.forEach((packet, index) => {
    const summary = packet.sources.find(source => source.kind === 'resumo');
    if (summary) add({ ...summary, content: clip(summary.content, 1800), excerpt: summary.excerpt || summary.content.length > 1800 }, selections[index].topic.id);
  });
  const buckets = packets.map(packet => packet.sources.filter(source => source.kind === 'questao'));
  const used = new Set<string>();
  for (let round = 0; sources.filter(source => source.kind === 'questao').length < 6 && buckets.some(bucket => bucket[round]); round++) {
    for (let index = 0; index < buckets.length; index++) {
      const source = buckets[index][round];
      if (source && !used.has(source.questionId!) && sources.filter(item => item.kind === 'questao').length < 6) { used.add(source.questionId!); add(source, selections[index].topic.id); }
    }
  }
  const coverage = [...new Set(packets.flatMap(packet => packet.coverage.map(row => row.board)))].map(board => ({
    board, available: packets.reduce((sum, packet) => sum + (packet.coverage.find(row => row.board === board)?.available ?? 0), 0),
    readable: packets.reduce((sum, packet) => sum + (packet.coverage.find(row => row.board === board)?.readable ?? 0), 0),
    included: sources.filter(source => source.kind === 'questao' && source.board === board).length,
  }));
  const scopes = selections.map(item => ({ topicId: item.topic.id, topicName: item.topic.name, chapter: item.chapter }));
  const packet: StudyPacket = { topicId: selections[0].topic.id, chapter: '', selections: scopes, sources, coverage, referenceText: '' };
  packet.referenceText = renderStudyReference(packet);
  if (packet.referenceText.length > STUDY_SOURCE_CHAR_LIMIT) throw new Error('As fontes excedem o limite. Reduza a seleção.');
  return packet;
}
export function renderStudyReference(packet: StudyPacket): string {
  return `${packet.selections ? `Recortes solicitados: ${packet.selections.map(item => `${item.topicName}${item.chapter ? ` — ${item.chapter}` : ' — visão geral'}`).join('; ')}.\n\n` : ''}${packet.sources.map(source => `[${source.id}] ${source.title}\nTipo: ${source.kind === 'resumo' ? 'síntese ou análise editorial; não é enunciado integral' : 'questão cadastrada com origem identificada'}${source.excerpt ? '; recorte parcial' : ''}\n${source.url ? `Fonte: ${source.url}\n` : ''}${source.content}`).join('\n\n')}`;
}
