import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPETENCIAS, ELEMENTOS_DA_INTERVENCAO, MAXIMO, folhas, notaDaIntervencao, notaTotal, validaNota } from './competenciasEnem';

test('cinco competências de até 200 dão os 1.000 pontos', () => {
  assert.equal(COMPETENCIAS.length, 5);
  assert.equal(notaTotal({ c1: MAXIMO, c2: MAXIMO, c3: MAXIMO, c4: MAXIMO, c5: MAXIMO }), 1000);
});

test('só valem os seis níveis de 40 pontos', () => {
  for (const n of [0, 40, 80, 120, 160, 200]) assert.ok(validaNota(n), String(n));
  for (const n of [-40, 20, 100, 240]) assert.ok(!validaNota(n), String(n));
  assert.equal(folhas(160), 4);
});

test('competência 5: cada elemento da proposta vale um nível', () => {
  assert.equal(notaDaIntervencao(new Set()), 0);
  assert.equal(notaDaIntervencao(new Set(['agente', 'ação'] as const)), 80);
  assert.equal(notaDaIntervencao(new Set(ELEMENTOS_DA_INTERVENCAO)), 200);
});
