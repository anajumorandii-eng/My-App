import test from 'node:test';
import assert from 'node:assert/strict';
import { combineStudyReflections, readAdditionalSelections, strategySelectionKey } from './strategySelection';
import { mockTopics } from '../data/mockData';
test('mantém as chaves antigas e torna a chave combinada independente da ordem', () => {
  const ecology = { topicId: 'bio_ecologia', topicName: 'Ecologia', chapter: '' }, evolution = { topicId: 'bio_evolucao', topicName: 'Evolução', chapter: '' };
  assert.equal(strategySelectionKey('Biologia', [ecology], 'Unicamp'), JSON.stringify(['Biologia', ecology.topicId, '', 'Unicamp']));
  assert.equal(strategySelectionKey('Biologia', [ecology, evolution], 'Unicamp'), strategySelectionKey('Biologia', [evolution, ecology], 'COMVEST'));
});
test('restaura apenas tópicos distintos da mesma matéria e capítulos válidos', () => {
  const raw = JSON.stringify([{ topicId: 'bio_evolucao', chapter: 'inexistente' }, { topicId: 'bio_evolucao' }, { topicId: 'mat_funcoes' }, { topicId: 'bio_ecologia' }]);
  assert.deepEqual(readAdditionalSelections(raw, mockTopics, 'bio_ecologia'), [{ topicId: 'bio_evolucao', chapter: '' }]);
  assert.deepEqual(readAdditionalSelections('invalid', mockTopics, 'bio_ecologia'), []);
});

test('reflexões longas reservam espaço para todos os tópicos dentro do limite da API', () => {
  const text = combineStudyReflections(['Ecologia', 'Evolução', 'Genética', 'Botânica'].map(topicName => ({ topicName, text: `${topicName}: ` + 'Explicação '.repeat(700) })));
  assert.ok(text.length <= 6000);
  for (const name of ['Ecologia', 'Evolução', 'Genética', 'Botânica']) assert.ok(text.includes(name));
  assert.ok(text.includes('registro completo preservado'));
});
