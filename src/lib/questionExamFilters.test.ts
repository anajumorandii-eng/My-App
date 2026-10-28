import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalExamBoard, matchesExamFilters } from './questionExamFilters';
import type { Question } from '../types';

const item = (source?: Question['examSource']) => ({ examSource: source }) as Question;
test('banca reúne COMVEST/Unicamp sem atribuir Vunesp a uma instituição', () => {
  assert.equal(canonicalExamBoard(' Comvest '), 'UNICAMP');
  assert.equal(canonicalExamBoard('VUNESP'), 'VUNESP');
  assert.equal(matchesExamFilters(item({ board: 'COMVEST', year: 2026 }), 'UNICAMP', '2026'), true);
  assert.equal(matchesExamFilters(item({ board: 'VUNESP', year: 2026 }), 'UNESP', '2026'), false);
});
test('ano desconhecido exige procedência e não inventa ano para questões de apostila', () => {
  assert.equal(matchesExamFilters(item({ board: 'UNICAMP' }), 'UNICAMP', 'unknown'), true);
  assert.equal(matchesExamFilters(item(), 'all', 'unknown'), false);
  assert.equal(matchesExamFilters(item({ board: 'UNICAMP' }), 'UNICAMP', '2026'), false);
  assert.equal(matchesExamFilters(item({ board: 'UNICAMP', year: 2025 }), 'UNICAMP', '2026'), false);
  assert.equal(matchesExamFilters(item(), 'all', 'all'), true);
});
test('questão autoral entra no filtro da banca que imita, mas nunca num ano', () => {
  const autoral = { styleOf: 'FUVEST' } as Question;
  assert.equal(matchesExamFilters(autoral, 'FUVEST', 'all'), true);
  assert.equal(matchesExamFilters(autoral, 'UNICAMP', 'all'), false);
  assert.equal(matchesExamFilters(autoral, 'FUVEST', '2026'), false);
  assert.equal(matchesExamFilters(autoral, 'FUVEST', 'unknown'), false);
});
