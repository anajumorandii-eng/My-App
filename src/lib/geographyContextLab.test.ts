import assert from 'node:assert/strict';
import test from 'node:test';
import { GEOGRAPHY_CONTEXTS } from './geographyContextLab.ts';

test('os contextos geográficos mantêm 21 capítulos e três recortes cada', () => {
  const contexts = Object.values(GEOGRAPHY_CONTEXTS);
  assert.equal(contexts.length, 21);
  assert.equal(new Set(contexts.map((context) => context.chapterId)).size, contexts.length);
  for (const context of contexts) assert.equal(context.cases.length, 3);
});
