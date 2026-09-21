import assert from 'node:assert/strict';
import test from 'node:test';
import { aquiferBalance, energyShares, longitudeToUtc, realDistanceKm, routesAfterFailure } from './geographyInstrumentLab.ts';

test('converte longitude teórica em diferença para UTC', () => {
  assert.equal(longitudeToUtc(-45), -3);
  assert.equal(longitudeToUtc(135), 9);
});

test('converte centímetros do mapa em quilômetros reais', () => {
  assert.equal(realDistanceKm(6, 250_000), 15);
  assert.equal(realDistanceKm(8, 50_000), 4);
});

test('balanço negativo identifica superexploração do aquífero', () => {
  assert.equal(aquiferBalance(120), -20);
  assert.equal(aquiferBalance(80), 20);
});

test('participações da matriz sempre fecham cem por cento', () => {
  assert.deepEqual(energyShares(80), { fossil: 80, lowCarbon: 20 });
});

test('uma ruptura só isola rede sem rota redundante', () => {
  assert.equal(routesAfterFailure(1), 0);
  assert.equal(routesAfterFailure(3), 2);
});
