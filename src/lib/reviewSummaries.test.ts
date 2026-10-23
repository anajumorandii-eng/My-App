import assert from 'node:assert/strict';
import test from 'node:test';
import { reviewSummaryKey, selectReviewSummaries } from './reviewSummaries';
import type { StrategyGuide } from './strategyGuides';
const guide: StrategyGuide = { key: 'a', kind: 'review-summary', subject: 'Biologia', topicId: 'bio_ecologia', topicName: 'Ecologia', chapter: '', board: 'FUVEST', text: 'Síntese', savedAt: '2026-10-23T10:00:00Z' };
test('banca e capítulo distinguem os resumos e aliases não duplicam', () => {
  assert.equal(reviewSummaryKey('Biologia', 'bio_ecologia', '', 'Fuvest'), reviewSummaryKey('Biologia', 'bio_ecologia', '', 'FUVEST'));
  assert.notEqual(reviewSummaryKey('Biologia', 'bio_ecologia', '', 'FUVEST'), reviewSummaryKey('Biologia', 'bio_ecologia', '', 'UNICAMP'));
  assert.notEqual(reviewSummaryKey('Biologia', 'bio_ecologia', '', 'FUVEST'), reviewSummaryKey('Biologia', 'bio_ecologia', 'Populações', 'FUVEST'));
});
test('biblioteca separa resumos de revisão dos aprofundamentos preservados', () => {
  const deepening = { ...guide, key: 'b', kind: undefined };
  const other = { ...guide, key: 'c', board: 'UNICAMP' };
  assert.deepEqual(selectReviewSummaries({ a: guide, b: deepening, c: other }, 'Biologia', 'Fuvest'), [guide]);
  assert.equal(selectReviewSummaries({ a: guide }, 'Química').length, 0);
  assert.equal(deepening.text, 'Síntese');
});
