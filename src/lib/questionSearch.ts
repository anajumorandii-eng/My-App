import type { Question } from '../types';
import { canonicalExamBoard } from './questionExamFilters';

function normalize(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
}

/** Search only what can be read before answering; answers must not leak into results. */
export function matchesQuestionSearch(question: Question, query: string): boolean {
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const source = question.examSource;
  const text = normalize([
    question.id, question.subject, question.chapter, question.prompt,
    ...question.options.map(option => option.text), source?.board,
    source && canonicalExamBoard(source.board), source?.year, source?.phase,
    source?.questionNumber,
  ].filter(value => value !== undefined).join(' '));
  return terms.every(term => text.includes(term));
}
