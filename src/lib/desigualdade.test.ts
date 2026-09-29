import test from 'node:test';
import assert from 'node:assert/strict';
import { REFERENCIAS, fatiasPorDecimo, giniPelaArea, razaoTopoBase } from './desigualdade';

test('Gini zero: todos os décimos com 10% da renda', () => {
  for (const f of fatiasPorDecimo(0)) assert.ok(Math.abs(f - 0.1) < 1e-12);
});

test('as fatias somam a renda inteira e crescem do mais pobre ao mais rico', () => {
  for (const g of [0.28, 0.41, 0.52, 0.7]) {
    const f = fatiasPorDecimo(g);
    assert.ok(Math.abs(f.reduce((s, x) => s + x, 0) - 1) < 1e-12);
    for (let i = 1; i < 10; i += 1) assert.ok(f[i] > f[i - 1]);
  }
});

test('o Gini da curva modelo é o dobro da área entre a diagonal e a curva', () => {
  for (const r of REFERENCIAS) assert.ok(Math.abs(giniPelaArea(r.gini) - r.gini) < 1e-4, r.id);
});

test('mais Gini, mais distância entre o topo e a base', () => {
  assert.ok(razaoTopoBase(0.52) > razaoTopoBase(0.41));
  assert.ok(razaoTopoBase(0.41) > razaoTopoBase(0.28));
});
