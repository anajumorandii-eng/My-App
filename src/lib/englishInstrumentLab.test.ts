import assert from 'node:assert/strict';
import test from 'node:test';
import { ENGLISH_INSTRUMENTS, englishInstrumentState } from './englishInstrumentLab';

test('cada instrumento oferece três contrastes linguísticos completos', () => {
  for (const config of Object.values(ENGLISH_INSTRUMENTS)) {
    assert.equal(config.states.length, 3);
    assert.ok(config.states.every(state => state.example && state.reading && state.trap));
  }
});

test('seleção limita o índice às estruturas existentes', () => {
  assert.equal(englishInstrumentState('modal-certainty', -2).label, 'might');
  assert.equal(englishInstrumentState('modal-certainty', 1).label, 'is expected to');
  assert.equal(englishInstrumentState('modal-certainty', 9).label, 'will');
});

test('conectores preservam a direção lógica entre causa e efeito', () => {
  assert.deepEqual(ENGLISH_INSTRUMENTS['cause-connectors'].states.map(state => state.reading), [
    'efeito because causa', 'causa; therefore, efeito', 'efeito as a result of causa',
  ]);
});
