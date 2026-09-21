import assert from 'node:assert/strict';
import test from 'node:test';
import { LITERARY_TRAITS } from './literaryTraitLab.ts';

test('os traços literários mantêm 22 capítulos e três facetas cada, sem duplicar capítulo', () => {
  const traits = Object.values(LITERARY_TRAITS);
  assert.equal(traits.length, 22);
  assert.equal(new Set(traits.map((trait) => trait.chapterId)).size, traits.length);
  for (const trait of traits) {
    assert.equal(trait.cases.length, 3);
    assert.ok(trait.chapterId.startsWith('summary-literatura-'));
    assert.ok(trait.title.length > 0);
    assert.ok(trait.question.includes('?'));
    assert.ok(trait.relation.includes('→'));
    assert.ok(trait.caution.length > 0);
    for (const single of trait.cases) {
      assert.ok(single.label.length > 0);
      assert.ok(single.note.length > 0);
      assert.ok(single.observation.length > 20);
      assert.ok(single.conclusion.length > 10);
    }
    // Os três casos de um capítulo precisam ser distintos entre si — um
    // instrumento que repetisse a mesma faceta três vezes não compararia nada.
    assert.equal(new Set(trait.cases.map((single) => single.label)).size, 3);
  }
});
