import type { Question, Topic } from '../types';
import { prioritySummarySubject } from './actionablePriorities';
import { canonicalExamBoard } from './questionExamFilters';
export const STUDY_SOURCE_CHAR_LIMIT = 24000;
export interface StudySource { id: string; title: string; kind: 'resumo' | 'questao'; content: string; excerpt: boolean; url?: string; questionId?: string; board?: string }
export interface StudyPacket { sources: StudySource[]; coverage: { board: string; available: number; readable: number; included: number }[]; referenceText: string; topicId: string; chapter: string }
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

export function buildWorkStudyPacket(dossier: import('../types/literaryWorks').WorkDossier): StudyPacket {
  const modules = dossier.modules.filter(module => module.editorialStatus === 'published');
  const analysis = modules.find(module => module.moduleType === 'analise_integral');
  if (!analysis) throw new Error('A análise desta obra ainda não foi publicada.');
  const texts = [modules.find(module => module.moduleType === 'comece_aqui'), analysis].filter(Boolean) as typeof modules;
  const sources: StudySource[] = texts.map((module, index) => ({ id: `F${index + 1}`, title: `${module.moduleType === 'comece_aqui' ? 'Introdução' : 'Análise'} da obra · ${dossier.edition.label}`, kind: 'resumo', content: clip(module.markdown, 6500), excerpt: module.markdown.length > 6500 }));
  const units = new Set(dossier.units.filter(unit => unit.guide.editorialStatus === 'published').map(unit => unit.id));
  for (const card of dossier.evidence.filter(item => item.editorialStatus === 'published' && units.has(item.unitId)).slice(0, 4)) {
    sources.push({ id: `F${sources.length + 1}`, title: `Passagem da obra · ${card.location} · ${dossier.edition.label}`, kind: 'resumo', content: `Citação publicada: “${card.quote}”\nContexto: ${card.context}\nRecurso: ${card.formalDevice}\nEfeito: ${card.effect}\nRelação com a obra: ${card.wholeRelation}`, excerpt: false });
  }
  const referenceText = sources.map(source => `[${source.id}] ${source.title}${source.excerpt ? ' [recorte]' : ''}\nMaterial de obra e análise editorial, não questão oficial.\n${source.content}`).join('\n\n');
  if (referenceText.length > STUDY_SOURCE_CHAR_LIMIT) throw new Error('As fontes da obra excedem o recorte de áudio disponível.');
  return { topicId: `obra:${dossier.slug}`, chapter: '', sources, coverage: [], referenceText };
}

export function isStudyPacket(value: unknown): value is StudyPacket {
  if (!value || typeof value !== 'object') return false;
  const packet = value as StudyPacket;
  return typeof packet.topicId === 'string' && typeof packet.chapter === 'string' && typeof packet.referenceText === 'string' && Array.isArray(packet.coverage) && packet.coverage.every(item => item && typeof item.board === 'string' && ['available', 'readable', 'included'].every(field => Number.isFinite(item[field as 'available']))) && Array.isArray(packet.sources) && packet.sources.every(source => source && ['id', 'title', 'content'].every(field => typeof source[field as 'id'] === 'string') && ['resumo', 'questao'].includes(source.kind));
}
