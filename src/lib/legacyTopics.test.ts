import assert from 'node:assert/strict';
import test from 'node:test';
import { remapLegacyTopicId, LEGACY_TOPIC_ID_MIGRATIONS, LEGACY_TOPIC_LABELS } from '../data/legacyTopics';
import { mockTopics } from '../data/mockData';

test('remapLegacyTopicId rewrites an id that was renamed without changing meaning', () => {
  assert.equal(remapLegacyTopicId('qui_03'), 'qui_organica');
  assert.equal(remapLegacyTopicId('fis_01'), 'fis_cinematica');
});

test('remapLegacyTopicId leaves an unmapped id untouched instead of guessing', () => {
  assert.equal(remapLegacyTopicId('mat_04'), 'mat_04');
  assert.equal(remapLegacyTopicId('mat_06'), 'mat_06');
});

test('remapLegacyTopicId leaves a current-catalog id untouched', () => {
  assert.equal(remapLegacyTopicId('bio_ecologia'), 'bio_ecologia');
});

test('a migration target that later got split itself is left for reconcileBacklog to resolve further', () => {
  // qui_organica (the qui_03 rename target) was itself split into
  // qui_organica_fundamentos/qui_organica_reacoes in a later curriculum
  // pass — remapLegacyTopicId doesn't chain through that, since it can't
  // know which child the student meant. reconcileBacklog (userData.ts)
  // handles this next step via the item's chapter, or leaves it orphaned.
  const currentIds = new Set(mockTopics.map((t) => t.id));
  const stillCurrent = Object.values(LEGACY_TOPIC_ID_MIGRATIONS).filter((id) => currentIds.has(id));
  const nowStale = Object.values(LEGACY_TOPIC_ID_MIGRATIONS).filter((id) => !currentIds.has(id));
  assert.ok(stillCurrent.length > 0, 'at least one migration target should still be a live topic');
  assert.deepEqual(new Set(nowStale), new Set(['qui_organica', 'qui_fisico_quimica']));
});

test('no migration target is itself a legacy id needing migration', () => {
  for (const targetId of Object.values(LEGACY_TOPIC_ID_MIGRATIONS)) {
    assert.equal(LEGACY_TOPIC_ID_MIGRATIONS[targetId], undefined);
  }
});

test('legacy labels cover every migration source id', () => {
  for (const sourceId of Object.keys(LEGACY_TOPIC_ID_MIGRATIONS)) {
    assert.ok(LEGACY_TOPIC_LABELS[sourceId], `${sourceId} should have a legacy label`);
  }
});
