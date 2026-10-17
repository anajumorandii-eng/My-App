import assert from 'node:assert/strict';
import test from 'node:test';
import { buildActionablePriorities, priorityStudyBlock, prioritySummarySubject } from './actionablePriorities';
import type { Topic, TopicMastery } from '../types';
const topics: Topic[] = [{ id: 'bio_ecologia', subject: 'Biologia', name: 'Ecologia', prerequisites: [] }, { id: 'bio_genetica', subject: 'Biologia', name: 'Genética', prerequisites: ['bio_estrutura_fisio_celular'] }];
const evidence = (topicId: string, level: number): TopicMastery => ({ topicId, level, uncertainty: 0.2, lastReviewed: '2026-10-12T12:00:00Z', errorSignals: 0, origin: 'observed', intervalDays: 6 });
const now = new Date('2026-10-13T12:00:00Z');
test('lacuna observada supera incidência histórica isolada e parcelas somam o total', () => {
  const result = buildActionablePriorities(topics, [evidence('bio_ecologia', 95), evidence('bio_genetica', 20)], true, 'Fuvest', now);
  assert.equal(result[0].topic.id, 'bio_genetica');
  assert.equal(result[0].action, 'base');
  assert.equal(Object.values(result[0].factors).reduce((sum, value) => sum + value, 0), result[0].score);
});
test('dados de demonstração e baseline não viram lacunas ou revisões atrasadas', () => {
  for (const persisted of [true, false]) {
    const records = persisted ? [{ ...evidence('bio_genetica', 0), origin: 'seed' as const, lastReviewed: new Date(0).toISOString() }] : [evidence('bio_genetica', 10)];
    const entry = buildActionablePriorities(topics, records, persisted, undefined, now).find(item => item.topic.id === 'bio_genetica')!;
    assert.equal(entry.action, 'diagnostic'); assert.equal(entry.factors.gap, 0); assert.equal(entry.factors.review, 0);
  }
});
test('pré-requisito fraco fora do filtro vira primeiro conteúdo do bloco', () => {
  const entry = buildActionablePriorities([topics[1]], [evidence('bio_genetica', 90), evidence('bio_estrutura_fisio_celular', 20)], true, undefined, now)[0];
  assert.deepEqual(entry.blockers, ['bio_estrutura_fisio_celular']); assert.equal(entry.action, 'base');
});
test('blocos cabem exatamente no tempo escolhido', () => {
  for (const minutes of [15, 30, 45] as const) assert.equal(priorityStudyBlock(minutes).reduce((sum, step) => sum + step.minutes, 0), minutes);
});


test('links usam nomes reais do catálogo de resumos nas áreas de linguagem', () => {
  for (const [id, subject, expected] of [['por_texto', 'Português', 'Entendimento de Texto'], ['por_sintaxe', 'Português', 'Gramática'], ['por_lit_modernismo', 'Português', 'Literatura'], ['por_red_argumentacao', 'Português', 'Redação'], ['ing_01', 'Inglês', 'Língua Inglesa']]) assert.equal(prioritySummarySubject({ id, subject }), expected);
});

test('combina as bancas pelos pesos sem multiplicar o diagnóstico pessoal', () => {
  const both = buildActionablePriorities(topics, [evidence('bio_genetica', 20)], true, undefined, now, [{ board: 'Fuvest', weight: 0.8, phaseFocus: 'ambas' }, { board: 'Unicamp', weight: 0.2, phaseFocus: 'ambas' }]);
  const entry = both.find(item => item.topic.id === 'bio_genetica')!;
  assert.equal(entry.boardFactors.length, 2);
  assert.equal(entry.factors.history, entry.boardFactors[0].history * 0.8 + entry.boardFactors[1].history * 0.2);
  assert.equal(entry.factors.gap, 36);
});
