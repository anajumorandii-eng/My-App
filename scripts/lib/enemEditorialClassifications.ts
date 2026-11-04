import { readFile, readdir } from 'node:fs/promises';
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
export async function loadEnemEditorialClassifications(topics: Topic[]) {
  const catalog = new Map(topics.map(topic => [topic.id, topic]));
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
  for (const source of ['scripts/data/enem-conferencia-2022-2023.json', 'scripts/data/enem-auditoria-cobertura-2026-11-04.json']) {
    const review = JSON.parse(await readFile(source, 'utf8'));
    for (const row of review.items) {
      const topic = catalog.get(row.bankTopicId);
      if (!topic || topic.subject !== row.bankSubject || (row.bankChapter !== null && !topic.chapters.includes(row.bankChapter)) || !row.evidence) throw new Error(`Revisão inválida: ${row.questionId}`);
      result.set(row.questionId, { topicId: topic.id, subject: topic.subject, ...(row.bankChapter === null ? {} : { chapter: row.bankChapter }), source, evidence: row.evidence, confidence: row.confidence });
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
