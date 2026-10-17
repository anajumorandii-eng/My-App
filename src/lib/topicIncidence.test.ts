import assert from 'node:assert/strict';
import test from 'node:test';
import { topicIncidenceWeight } from './topicIncidence';
import { completeTopicEvidence, examEvidenceCohorts } from './examEvidence';
const ecology = { id: 'bio_ecologia', subject: 'Biologia' };
test('calcula um sinal reduzido por tamanho da amostra, separando fases sem somar percentuais', () => {
  // Unicamp: 2/14 nas duas primeiras fases; 2/7 na segunda fase de 2026.
  const weight = topicIncidenceWeight(ecology, 'Unicamp');
  assert.ok(Math.abs(weight - (2 / 34 + 2 / 27) / 2) < 1e-9);
  assert.equal(topicIncidenceWeight(ecology, 'COMVEST'), weight);
  assert.ok(Math.abs(topicIncidenceWeight(ecology, 'UNICAMP', '1a-fase') - 2 / 34) < 1e-9);
});
test('amostras selecionadas não viram incidência e banca sem dados não herda outra banca', () => {
  assert.equal(topicIncidenceWeight(ecology, 'FAMERP'), 0);
  assert.equal(topicIncidenceWeight(ecology, 'UNESP'), 0);
  assert.equal(topicIncidenceWeight(ecology, 'Banca Inexistente'), 0);
  assert.ok(topicIncidenceWeight(ecology, 'FUVEST', '2a-fase') > 0);
  assert.equal(topicIncidenceWeight(ecology, 'FUVEST', '1a-fase'), 0);
});
test('cada denominador usa apenas questões válidas da matéria e recorte', () => {
  const rows = completeTopicEvidence(ecology, 'UNICAMP', '1a-fase');
  assert.deepEqual(rows.map(row => row.total), [7, 7]);
  const math = { id: 'mat_funcoes', subject: 'Matemática' };
  const year2025 = completeTopicEvidence(math, 'UNICAMP').find(row => row.cohort.year === 2025)!;
  assert.ok(year2025.cohort.excludedNumbers.includes(53));
  assert.equal(year2025.total, 11);
  for (const cohort of examEvidenceCohorts) for (const subject of cohort.subjects) assert.equal(subject.topics.reduce((sum, topic) => sum + topic.count, 0), subject.total);
});
test('Literatura não herda todos os temas de Português nem duplica incidência por escola', () => {
  assert.equal(topicIncidenceWeight({ id: 'topico_inexistente', subject: 'Biologia' }), 0);
  const literature = completeTopicEvidence({ id: 'por_lit_classica_barroca', subject: 'Português' }, 'UNICAMP');
  assert.ok(literature.every(row => row.count === 0));
  assert.ok(literature.every(row => row.total < 12));
});
