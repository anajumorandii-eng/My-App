import { readFile, readdir } from 'node:fs/promises';
import { withQuestionTopics } from '../../src/data/questionTopics';
import type { Question, Topic } from '../../src/types';

export interface EditorialClassification {
  topicId: string;
  subject: string;
  chapter?: string;
  source: string;
  evidence: string;
  confidence: string;
}
/** Source-page review takes precedence over earlier broad reclassification lists. */
export async function loadEnemEditorialClassifications(topics: Topic[], includeBatch = true) {
  const catalog = new Map(withQuestionTopics(topics).map(topic => [topic.id, topic]));
  const result = new Map<string, EditorialClassification>();
  const directory = 'scripts/data/enem-reclassificacao';
  for (const filename of (await readdir(directory)).filter(file => file.endsWith('.json')).sort()) {
    const source = `${directory}/${filename}`;
    const records = JSON.parse(await readFile(source, 'utf8'));
    for (const [id, value] of Object.entries(records)) {
      if (id.startsWith('_')) continue;
      if (!Array.isArray(value) || value.length !== 2) throw new Error(`Classificação inválida: ${source}/${id}`);
      const [topicId, chapter] = value;
      const topic = catalog.get(topicId);
      if (!topic?.chapters.includes(chapter)) throw new Error(`Capítulo inválido: ${source}/${id}`);
      result.set(id, { topicId, subject: topic.subject, chapter, source, evidence: records._motivo || 'Lista editorial versionada.', confidence: 'editorial-list' });
    }
  }
  const sources = ['scripts/data/enem-conferencia-2022-2023.json', 'scripts/data/enem-auditoria-cobertura-2026-11-04.json'];
  if (includeBatch) sources.push(...await enemReviewBatchPaths(), ENEM_TAXONOMY_RESOLUTION_PATH);
  const batchIds = new Set<string>();
  for (const source of sources) {
    const review = JSON.parse(await readFile(source, 'utf8'));
    for (const row of review.items) {
      const topic = catalog.get(row.bankTopicId);
      if (!topic || topic.subject !== row.bankSubject || (row.bankChapter !== null && !topic.chapters.includes(row.bankChapter)) || !row.evidence || !['high','medium'].includes(row.confidence)) throw new Error(`Revisão inválida: ${row.questionId}`);
      if (source.startsWith(ENEM_REVIEW_BATCH_DIRECTORY)) {
        if (batchIds.has(row.questionId)) throw new Error(`ID repetido nos lotes editoriais: ${row.questionId}`);
        batchIds.add(row.questionId);
      }
      result.set(row.questionId, { topicId: topic.id, subject: topic.subject, ...(row.bankChapter === null ? {} : { chapter: row.bankChapter }), source, evidence: row.evidence, confidence: row.confidence });
    }
    if (source.startsWith(ENEM_REVIEW_BATCH_DIRECTORY)) for (const row of review.deferred ?? []) {
      if (batchIds.has(row.questionId) || !row.reason?.trim()) throw new Error(`Reserva repetida/inválida: ${row.questionId}`);
      batchIds.add(row.questionId);
    }
  }
  return result;
}

/** Return copies; validate all overrides before a caller can write any artifact. */
export function applyEnemEditorialClassifications(questions: Question[], classifications: Map<string, EditorialClassification>, corpusIds: Set<string>): Question[] {
  return questions.map(question => {
    const reviewed = classifications.get(question.id);
    if (!reviewed) return question;
    if (!corpusIds.has(question.id)) throw new Error(`Revisão fora do corpus: ${question.id}`);
    const copy = { ...question, subject: reviewed.subject, topicId: reviewed.topicId };
    if (reviewed.chapter) copy.chapter = reviewed.chapter;
    else delete copy.chapter;
    return copy;
  });
}

export const ENEM_TAXONOMY_RESOLUTION_PATH = 'scripts/data/enem-resolucao-taxonomia-2026-11-05.json';
export const ENEM_REVIEW_BATCH_DIRECTORY = 'scripts/data/enem-revisao-editorial-2026-11-04';
export async function enemReviewBatchPaths(): Promise<string[]> {
  return (await readdir(ENEM_REVIEW_BATCH_DIRECTORY)).filter(file => file.endsWith('.json')).sort().map(file => `${ENEM_REVIEW_BATCH_DIRECTORY}/${file}`);
}
export async function loadEnemEditorialDeferrals() {
  const result = new Map<string, { source: string; reason: string }>();
  for (const source of await enemReviewBatchPaths()) {
    const review = JSON.parse(await readFile(source,'utf8'));
    for (const row of review.deferred ?? []) {
      if (result.has(row.questionId) || !row.reason?.trim()) throw new Error(`Reserva inválida: ${row.questionId}`);
      result.set(row.questionId,{source,reason:row.reason});
    }
  }
  const resolutions = JSON.parse(await readFile(ENEM_TAXONOMY_RESOLUTION_PATH,'utf8'));
  const catalog = new Map(withQuestionTopics([]).map(topic => [topic.id,topic]));
  const resolved = new Set<string>();
  for (const row of resolutions.items) {
    const topic = catalog.get(row.bankTopicId);
    if (!result.has(row.questionId) || resolved.has(row.questionId) || !topic || topic.subject !== row.bankSubject || !topic.chapters?.includes(row.bankChapter) || row.confidence !== 'high' || !row.evidence?.trim()) throw new Error(`Resolução de taxonomia inválida: ${row.questionId}`);
    resolved.add(row.questionId);
  }
  for (const id of resolved) result.delete(id);
  return result;
}
