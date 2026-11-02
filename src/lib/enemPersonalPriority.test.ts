import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEnemPersonalPriorities, enemDayOf } from './enemPersonalPriority';
import data from '../data/enemProbabilities2026.json';
import type { TopicMastery } from '../types';

const topics = [
  { topicId: 'a', subject: 'Matemática', pAtLeastOne: 0.95, expected: 6, presence: 8 },
  { topicId: 'b', subject: 'Biologia', pAtLeastOne: 0.9, expected: 4, presence: 8 },
  { topicId: 'c', subject: 'História', pAtLeastOne: 0.9, expected: 2, presence: 8 },
];
const seen = (topicId: string, level: number): TopicMastery => ({ topicId, level, uncertainty: 0.2, lastReviewed: '2026-10-30T00:00:00Z', errorSignals: 0 });

test('assunto dominado cede lugar a um menos frequente que ela ainda erra', () => {
  const ranked = buildEnemPersonalPriorities(topics, [seen('a', 95), seen('b', 20)], true);
  assert.deepEqual(ranked.map(r => r.topicId), ['b', 'c', 'a']);
  assert.equal(ranked[0].atStake.toFixed(1), '3.2');
});

test('sem evidência persistida o domínio fica desconhecido, nunca zero', () => {
  const ranked = buildEnemPersonalPriorities(topics, [seen('a', 95)], false);
  assert.ok(ranked.every(r => r.level === null));
  assert.equal(ranked[0].topicId, 'a');
});

test('o filtro de dia separa Natureza/Matemática de Linguagens/Humanas', () => {
  assert.equal(enemDayOf('Química'), 2);
  assert.equal(enemDayOf('Inglês'), 1);
  assert.deepEqual(buildEnemPersonalPriorities(topics, [], false, 1).map(r => r.topicId), ['c']);
});

test('os dados publicados cobrem as oito edições inteiras', () => {
  assert.equal(data.items, 1440);
  assert.equal(data.editions.length, 8);
  assert.ok(data.topics.every(t => t.pAtLeastOne > 0 && t.pAtLeastOne < 1));
});
