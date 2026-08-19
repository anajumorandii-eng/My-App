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

test('every migration target exists in the current topic catalog', () => {
  const currentIds = new Set(mockTopics.map((t) => t.id));
  for (const targetId of Object.values(LEGACY_TOPIC_ID_MIGRATIONS)) {
    assert.ok(currentIds.has(targetId), `${targetId} should exist in mockTopics`);
  }
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
