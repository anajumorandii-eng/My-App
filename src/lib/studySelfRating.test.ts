import assert from 'node:assert/strict';
import test from 'node:test';
import { registerStudySelfRating } from './studySelfRating';

test('primeira recuperação cria o tópico sem fingir que ele já tinha domínio medido', () => {
  const rows = registerStudySelfRating([], 'genetica', 'forte');
  assert.equal(rows.length, 1);
  assert.equal(rows[0].topicId, 'genetica');
  assert.ok(rows[0].level < 100);
  assert.ok(rows[0].uncertainty > 0);
  const next = registerStudySelfRating(rows, 'genetica', 'fraco');
  assert.equal(next.length, 1);
});
