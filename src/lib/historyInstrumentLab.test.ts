import assert from 'node:assert/strict';
import test from 'node:test';
import { HISTORY_INSTRUMENTS, historyInstrumentState } from './historyInstrumentLab';

test('cada instrumento histórico oferece três leituras substantivas', () => {
  for (const config of Object.values(HISTORY_INSTRUMENTS)) {
    assert.equal(config.states.length, 3);
    assert.ok(config.states.every(state => state.focus && state.relation && state.evidence));
  }
});

test('seleção histórica é arredondada e limitada às opções reais', () => {
  assert.equal(historyInstrumentState('cold-war', 1).label, 'Guerras por procuração');
  assert.equal(historyInstrumentState('cold-war', -5).label, 'Dissuasão nuclear');
  assert.equal(historyInstrumentState('cold-war', 12).label, 'Competição sistêmica');
});

test('mecanismos fiscais não são tratados como uma sequência cronológica genérica', () => {
  assert.deepEqual(HISTORY_INSTRUMENTS['mining-colony'].states.map(state => state.focus), [
    'parcela tributada', 'controle da circulação', 'meta não atingida',
  ]);
});
