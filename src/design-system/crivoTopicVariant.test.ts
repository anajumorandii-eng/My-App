import assert from 'node:assert/strict';
import test from 'node:test';
import { topicVariantSeed } from './crivoTopicVariant';

test('crivo topic variant: deriva variante estável e limitada do id do tópico', () => {
  assert.equal(topicVariantSeed('equilibrio-quimico', 5), topicVariantSeed('equilibrio-quimico', 5));
  assert.ok(topicVariantSeed('equilibrio-quimico', 5) >= 0);
  assert.ok(topicVariantSeed('equilibrio-quimico', 5) < 5);
  assert.equal(topicVariantSeed('qualquer', 1), 0);
});
