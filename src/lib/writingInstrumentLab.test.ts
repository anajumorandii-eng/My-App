import assert from 'node:assert/strict';
import test from 'node:test';
import { WRITING_INSTRUMENTS, writingInstrumentState } from './writingInstrumentLab';

test('cada instrumento de redação oferece decisões completas', () => {
  for (const config of Object.values(WRITING_INSTRUMENTS)) {
    assert.ok(config.states.length >= 3);
    assert.ok(config.states.every((state) => state.example && state.diagnosis && state.action));
  }
});

test('a dissertação confronta fórmulas prontas com exigências específicas', () => {
  assert.equal(writingInstrumentState('essay-myths', 0).diagnosis, 'mito: não existe número mágico válido para toda proposta');
  assert.equal(writingInstrumentState('essay-myths', 2).action, 'comparar intervenção no ENEM, coletânea na Fuvest e gênero/interlocutor na Unicamp');
});

test('o repertório só se torna produtivo quando ligado ao argumento', () => {
  assert.equal(writingInstrumentState('repertoire', 2).action, 'explicar como a referência sustenta a tese');
});
