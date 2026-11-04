import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Question } from '../../src/types';

export const ENEM_CONTENT_CORRECTIONS_PATH = 'scripts/data/enem-correcao-transcricao-2026-11-04.json';
export interface ContentCorrection {
  questionId: string;
  sourceUrl: string;
  sourceSha256: string;
  evidence: string;
  pages: number[];
  beforeSha256: string;
  afterSha256: string;
  changes: { field: string; before: unknown; after: unknown }[];
}
export function questionContentDigest(q: Question): string {
  return createHash('sha256').update(JSON.stringify({ id:q.id,prompt:q.prompt,options:q.options,correctOptionId:q.correctOptionId,status:q.status??null,figures:q.figures??[],examSource:q.examSource })).digest('hex');
}
export function loadEnemContentCorrections(): ContentCorrection[] {
  return JSON.parse(readFileSync(ENEM_CONTENT_CORRECTIONS_PATH,'utf8')).items;
}
/** Exact, source-reviewed transitions only. Unknown edits must be reviewed again. */
export function applyEnemContentCorrections(questions: Question[], corrections = loadEnemContentCorrections()): Question[] {
  const byId = new Map(corrections.map(row => [row.questionId,row]));
  if (byId.size !== corrections.length) throw new Error('Correção de conteúdo duplicada.');
  return questions.map(question => {
    const row=byId.get(question.id);
    if (!row) return question;
    const digest=questionContentDigest(question);
    if (digest===row.afterSha256) return question;
    if (digest!==row.beforeSha256) throw new Error(`Conteúdo divergente da fonte revisada: ${question.id}`);
    const copy=structuredClone(question);
    for (const change of row.changes) {
      const option=/^options\.([a-e])\.text$/.exec(change.field);
      if (option) {
        const target=copy.options.find(value=>value.id===option[1]);
        if (!target || target.text!==change.before || typeof change.after!=='string' || !change.after.trim()) throw new Error(`Alternativa inválida: ${question.id}`);
        target.text=change.after;
      } else if (change.field==='figures') {
        if (JSON.stringify(copy.figures??[])!==JSON.stringify(change.before) || !Array.isArray(change.after) || !change.after.every(value=>value&&typeof value.url==='string'&&value.url.startsWith('/question-media/'))) throw new Error(`Figuras inválidas: ${question.id}`);
        copy.figures=change.after;
      } else throw new Error(`Campo não autorizado: ${change.field}`);
    }
    if (questionContentDigest(copy)!==row.afterSha256) throw new Error(`Transição de conteúdo inválida: ${question.id}`);
    return copy;
  });
}
/** Historical editorial hashes remain immutable; accept only an explicit reviewed transition. */
export function matchesReviewedContent(question: Question, historicalSha256: string): boolean {
  const digest=questionContentDigest(question);
  return digest===historicalSha256 || loadEnemContentCorrections().some(row=>row.questionId===question.id&&row.beforeSha256===historicalSha256&&row.afterSha256===digest);
}
