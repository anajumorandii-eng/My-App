import assert from 'node:assert/strict';
import test from 'node:test';
import { basePair, bloodVelocity, oxygenGradient, recombination, shootCurvature } from './biologyInstrumentLab.ts';

test('pareamento distingue DNA, RNA e número de pontes', () => {
  assert.deepEqual(basePair(0), { template: 'A', dna: 'T', rna: 'U', hydrogenBonds: 2 });
  assert.deepEqual(basePair(2), { template: 'C', dna: 'G', rna: 'G', hydrogenBonds: 3 });
});

test('frequência de recombinação vira distância sem ultrapassar 50 cM', () => {
  assert.deepEqual(recombination(10), { recombinant: 10, parental: 90, distanceCm: 10 });
  assert.equal(recombination(80).distanceCm, 50);
});

test('área vascular maior reduz a velocidade relativa', () => {
  assert.equal(bloodVelocity(1), 8);
  assert.equal(bloodVelocity(8), 1);
});

test('gradiente respiratório não inverte o sentido da difusão', () => {
  assert.equal(oxygenGradient(100), 60);
  assert.equal(oxygenGradient(35), 0);
});

test('fototropismo mede apenas o excesso no lado sombreado', () => {
  assert.equal(shootCurvature(70), 20);
  assert.equal(shootCurvature(45), 0);
});
