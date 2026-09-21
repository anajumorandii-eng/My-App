import assert from 'node:assert/strict';
import test from 'node:test';
import { CURRENT_AFFAIRS_CONTEXTS } from './currentAffairsContextLab.ts';

test('os contextos de atualidades mantêm três recortes por capítulo', () => {
  const contexts = Object.values(CURRENT_AFFAIRS_CONTEXTS);
  assert.ok(contexts.length > 0);
  assert.equal(new Set(contexts.map((context) => context.chapterId)).size, contexts.length);
  for (const context of contexts) assert.equal(context.cases.length, 3);
});
