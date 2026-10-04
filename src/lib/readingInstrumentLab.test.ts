import assert from 'node:assert/strict';
import test from 'node:test';
import { READING_INSTRUMENTS, readingState, type ReadingInstrumentId } from './readingInstrumentLab';

const DECISIONS: Array<[ReadingInstrumentId, string, string, string]> = [
  ['textuality', 'proíbe', 'incoerente', 'coerente'],
  ['levels', 'guarda-chuva', 'declarada', 'chuva'],
  ['intertext', 'abre um livro', 'citação', 'paródia'],
  ['genres', 'Biblioteca', 'fato', 'posição'],
  ['narrative', 'chave', 'certeza', 'pensamento'],
  ['nonverbal', 'cartaz', 'prioridade', 'corte'],
  ['functions', 'biblioteca', 'informa', 'convoca'],
  ['poetic', 'sussurra', 'som', 'personificação'],
  ['figures', 'caracol', 'lentidão', 'crítica'],
  ['distortions', 'Nesta turma', 'generalização', 'limite'],
  ['comic', 'papel', 'economia', 'contradição'],
  ['tdic', 'Compartilhe', 'recurso', 'fonte'],
];

for (const [id, object, before, after] of DECISIONS) {
  test(`${id}: a decisão transforma a leitura de evidência do próprio capítulo`, () => {
    const config = READING_INSTRUMENTS[id];
    assert.ok(config, `configuração ausente: ${id}`);
    assert.ok(config.documents, `${id}: falta objeto textual concreto`);
    assert.ok(config.documents.map(doc => doc.lines.join(' ')).join(' ').includes(object));
    assert.ok(config.states[0].reading.includes(before));
    assert.ok(config.states[1].reading.includes(after));
    for (const state of config.states) {
      const corpus = config.documents.map(doc => doc.lines.join(' ')).join(' ');
      assert.ok(state.evidence.length > 0);
      for (const evidence of state.evidence) assert.ok(corpus.includes(evidence), `${id}: pista fora do texto: ${evidence}`);
      assert.ok(state.annotation.length > 25);
      assert.ok(state.action.length > 20);
    }
    assert.notEqual(config.states[0].reading, config.states[1].reading);
  });
}

test('seleção inválida nunca remove a leitura disponível', () => {
  assert.equal(readingState('levels', -20), READING_INSTRUMENTS.levels.states[0]);
  assert.equal(readingState('levels', 99), READING_INSTRUMENTS.levels.states[1]);
  assert.equal(readingState('levels', Number.NaN), READING_INSTRUMENTS.levels.states[0]);
  assert.equal(readingState('levels', Number.POSITIVE_INFINITY), READING_INSTRUMENTS.levels.states[0]);
});
