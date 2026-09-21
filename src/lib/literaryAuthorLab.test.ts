import assert from 'node:assert/strict';
import test from 'node:test';
import { LITERARY_AUTHORS } from './literaryAuthorLab.ts';

test('os perfis de autor mantêm seis capítulos e o mesmo eixo trajetória/técnica/obras', () => {
  const authors = Object.values(LITERARY_AUTHORS);
  assert.equal(authors.length, 6);
  assert.equal(new Set(authors.map((author) => author.chapterId)).size, authors.length);
  for (const author of authors) {
    assert.equal(author.cases.length, 3);
    assert.ok(author.chapterId.startsWith('summary-literatura-'));
    assert.ok(author.title.length > 0);
    assert.ok(author.question.includes('?'));
    assert.ok(author.relation.includes('→'));
    assert.ok(author.caution.length > 0);
    // Eixo fixo: é o que torna seis autores muito diferentes comparáveis
    // entre si sem apagar o que cada um tem de específico.
    assert.deepEqual(author.cases.map((single) => single.label), ['Trajetória', 'Técnica', 'Obras']);
    for (const single of author.cases) {
      assert.ok(single.note.length > 0);
      assert.ok(single.observation.length > 20);
      assert.ok(single.conclusion.length > 10);
    }
  }
});
