import assert from 'node:assert/strict';
import test from 'node:test';
import type { Question } from '../types';
import { matchesQuestionSearch } from './questionSearch';

const question: Question = {
  id: 'bio_2026_9', topicId: 'bio_genetica', subject: 'Biologia', chapter: 'Herança Sexual',
  prompt: 'Como ocorre a transmissão do cromossomo X?',
  options: [{ id: 'a', text: 'Ligação ao sexo' }], correctOptionId: 'a',
  explanation: 'Segredo da resolução', difficulty: 'medium',
  examSource: { board: 'COMVEST', year: 2026, questionNumber: 9 },
};

test('busca combina termos sem acentos em enunciado, alternativas, capítulo e origem', () => {
  assert.equal(matchesQuestionSearch(question, '  HERANCA   transmissão unicamp 2026 '), true);
  assert.equal(matchesQuestionSearch(question, 'ligacao sexo'), true);
  assert.equal(matchesQuestionSearch(question, 'fuvest'), false);
  assert.equal(matchesQuestionSearch(question, 'herança fotossíntese'), false);
  assert.equal(matchesQuestionSearch(question, '  '), true);
});

test('não revela a existência de palavras do gabarito ou explicação antes de responder', () => {
  assert.equal(matchesQuestionSearch(question, 'segredo'), false);
  assert.equal(matchesQuestionSearch(question, 'resolução'), false);
});
