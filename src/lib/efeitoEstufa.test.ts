import test from 'node:test';
import assert from 'node:assert/strict';
import { DOBRO, HOJE, PRE_INDUSTRIAL, aumento, forcamento, fracaoAteODobro } from './efeitoEstufa';

test('forçamento: zero no pré-industrial, cerca de 3,7 W/m² no dobro', () => {
  assert.equal(forcamento(PRE_INDUSTRIAL), 0);
  assert.ok(Math.abs(forcamento(DOBRO) - 3.708) < 0.001);
});

test('hoje: cerca de 2,2 W/m² e 50% acima do pré-industrial', () => {
  assert.ok(Math.abs(forcamento(HOJE) - 2.17) < 0.01);
  assert.equal(aumento(HOJE), 50);
});

test('a resposta é logarítmica: cada dobro soma o mesmo forçamento', () => {
  assert.ok(Math.abs(forcamento(4 * PRE_INDUSTRIAL) - 2 * forcamento(DOBRO)) < 1e-12);
  assert.equal(fracaoAteODobro(DOBRO), 1);
});
