import assert from 'node:assert/strict';
import test from 'node:test';
import { emptySummaryProgress } from './summaryEngine';
import { applySummaryChange, createSummaryChange } from './summarySync';
test('chapter deltas preserve concurrent sections, scalar fields and attempts and replay once', () => {
  const before = emptySummaryProgress();
  const attempt = { questionId: 'q', answer: 'a', matchedElements: [], firstMissingElement: null, date: '2026-10-07' };
  const change = createSummaryChange('chapter', before, { ...before, readSectionIds: ['one'], answers: [attempt], important: true });
  const remote = { chapter: { ...before, readSectionIds: ['two'], status: 'dominado' as const }, other: before };
  const merged = applySummaryChange(remote, change);
  assert.deepEqual(merged.chapter.readSectionIds, ['two', 'one']);
  assert.equal(merged.chapter.status, 'dominado');
  assert.equal(merged.other, before);
  assert.deepEqual(applySummaryChange(merged, change), merged);
});
test('explicit removals affect only changed sections and review questions', () => {
  const before = { ...emptySummaryProgress(), readSectionIds: ['one', 'two'] };
  const change = createSummaryChange('chapter', before, { ...before, readSectionIds: ['two'] });
  assert.deepEqual(applySummaryChange({ chapter: { ...before, readSectionIds: ['one', 'two', 'three'] } }, change).chapter.readSectionIds, ['two', 'three']);
});

test('recovery preserves concurrent chapter scalars and merges recovered evidence', () => {
  const initial = emptySummaryProgress();
  const cached = { ...initial, important: true, readSectionIds: ['offline'] };
  const seed = createSummaryChange('chapter', initial, cached);
  seed.recoverIfMissing = cached;
  seed.fields = {};
  const remote = { chapter: { ...initial, readSectionIds: ['remote'], status: 'dominado' as const } };
  const merged = applySummaryChange(remote, seed);
  assert.equal(merged.chapter.important, false);
  assert.equal(merged.chapter.status, 'dominado');
  assert.deepEqual(merged.chapter.readSectionIds, ['remote', 'offline']);
});
