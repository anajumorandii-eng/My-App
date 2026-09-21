import assert from 'node:assert/strict';
import test from 'node:test';
import { HISTORY_PHASES } from './historyPhaseLab.ts';

test('as fases de história mantêm dez capítulos e três casos cada, sem duplicar capítulo', () => {
  const phases = Object.values(HISTORY_PHASES);
  assert.equal(phases.length, 10);
  assert.equal(new Set(phases.map((phase) => phase.chapterId)).size, phases.length);
  for (const phase of phases) {
    assert.equal(phase.cases.length, 3);
    assert.ok(phase.chapterId.startsWith('summary-historia-'));
    assert.ok(phase.title.length > 0);
    assert.ok(phase.question.includes('?') || phase.question.length > 0);
    assert.ok(phase.relation.includes('→'));
    assert.ok(phase.caution.length > 0);
    for (const single of phase.cases) {
      assert.ok(single.label.length > 0);
      assert.ok(single.period.length > 0);
      assert.ok(single.observation.length > 20);
      assert.ok(single.conclusion.length > 10);
    }
    // Os três casos de um capítulo precisam ser distintos entre si — um
    // instrumento que repetisse o mesmo caso três vezes não compararia nada.
    assert.equal(new Set(phase.cases.map((single) => single.label)).size, 3);
  }
});

// Nenhum rótulo pode passar de duas linhas de ~16 caracteres na cena (ver
// `wrapLabel` em HistoryPhaseInstrument.tsx): uma palavra isolada maior que
// isso vazaria do cartão sem quebrar. Este teste é o que garante que futuras
// edições ao texto não reintroduzam esse problema sem que ninguém perceba.
test('nenhuma palavra de rótulo ou período excede o que o cartão da cena comporta', () => {
  const phases = Object.values(HISTORY_PHASES);
  for (const phase of phases) {
    for (const single of phase.cases) {
      for (const word of single.label.split(' ')) assert.ok(word.length <= 16, `${phase.chapterId}: "${word}" no rótulo "${single.label}"`);
      assert.ok(single.period.length <= 20, `${phase.chapterId}: período "${single.period}" longo demais`);
    }
  }
});
