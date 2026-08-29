import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveMasteryOrigin } from './masteryOrigin';
import { TopicMastery } from '../types';

const EPOCH = new Date(0).toISOString();

function mastery(overrides: Partial<TopicMastery> = {}): TopicMastery {
  return { topicId: 't1', level: 0, uncertainty: 0.9, lastReviewed: EPOCH, errorSignals: 0, ...overrides };
}

test('deriveMasteryOrigin: sem conta autenticada é sempre demo, mesmo com dados "avançados"', () => {
  const origin = deriveMasteryOrigin([mastery({ level: 90, lastReviewed: new Date().toISOString() })], false);
  assert.equal(origin, 'demo');
});

test('deriveMasteryOrigin: conta autenticada mas todo mundo ainda no baseline é seed (primeiro acesso, sem diagnóstico)', () => {
  const origin = deriveMasteryOrigin([mastery(), mastery({ topicId: 't2' })], true);
  assert.equal(origin, 'seed');
});

test('deriveMasteryOrigin: array vazio também conta como seed', () => {
  assert.equal(deriveMasteryOrigin([], true), 'seed');
});

test('deriveMasteryOrigin: qualquer linha observed vence, mesmo com outras ainda no baseline', () => {
  const origin = deriveMasteryOrigin(
    [mastery(), mastery({ topicId: 't2', level: 40, lastReviewed: new Date().toISOString(), origin: 'observed' })],
    true
  );
  assert.equal(origin, 'observed');
});

test('deriveMasteryOrigin: diagnostic aparece quando existe evidência de diagnóstico mas nenhuma de estudo/revisão', () => {
  const origin = deriveMasteryOrigin(
    [mastery({ level: 28, uncertainty: 0.7, lastReviewed: new Date().toISOString(), origin: 'diagnostic' })],
    true
  );
  assert.equal(origin, 'diagnostic');
});

test('deriveMasteryOrigin: linha revisada mas sem tag (dado legado, anterior a este campo) conta como observed, não seed', () => {
  const origin = deriveMasteryOrigin([mastery({ level: 55, lastReviewed: new Date().toISOString() })], true);
  assert.equal(origin, 'observed');
});
