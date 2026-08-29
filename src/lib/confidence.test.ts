import assert from 'node:assert/strict';
import test from 'node:test';
import { confidenceFromUncertainty } from './confidence';

test('confidenceFromUncertainty: baixíssima incerteza é confiança alta', () => {
  assert.equal(confidenceFromUncertainty(0.05), 'high');
  assert.equal(confidenceFromUncertainty(0.25), 'high');
});

test('confidenceFromUncertainty: incerteza intermediária é moderada', () => {
  assert.equal(confidenceFromUncertainty(0.4), 'moderate');
  assert.equal(confidenceFromUncertainty(0.5), 'moderate');
});

test('confidenceFromUncertainty: incerteza alta é baixa, mas ainda não "insuficiente"', () => {
  assert.equal(confidenceFromUncertainty(0.7), 'low');
  assert.equal(confidenceFromUncertainty(0.8), 'low');
});

test('confidenceFromUncertainty: incerteza no patamar do baseline nunca revisado (0.9) é dados insuficientes', () => {
  assert.equal(confidenceFromUncertainty(0.9), 'insufficient_data');
  assert.equal(confidenceFromUncertainty(1), 'insufficient_data');
});
