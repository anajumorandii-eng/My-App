import test from 'node:test';
import assert from 'node:assert/strict';
import { niceScale } from './niceScale';

test('curva de aquecimento ganha eixo redondo em vez de 120, 85, 50, 15, −20', () => {
  assert.deepEqual(niceScale(-20, 120).ticks, [-20, 0, 20, 40, 60, 80, 100, 120]);
});

test('passos 1, 2, 2,5 ou 5 vezes potência de dez, também em escalas pequenas', () => {
  assert.deepEqual(niceScale(0, 1).ticks, [0, 0.2, 0.4, 0.6, 0.8, 1]);
  assert.deepEqual(niceScale(0, 20).ticks, [0, 5, 10, 15, 20]);
  assert.deepEqual(niceScale(0.3, 0.92).ticks, [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
  assert.deepEqual(niceScale(0, 20000).ticks, [0, 5000, 10000, 15000, 20000]);
  for (const [a, b] of [[0, 7], [-3, 3], [1e-4, 9e-4], [100, 2300], [0, 1e9]]) assert.ok(niceScale(a, b).ticks.length <= 8, `${a}–${b}`);
});

test('valor único e dado invertido não quebram a escala', () => {
  const single = niceScale(5, 5);
  assert.ok(single.min < 5 && single.max > 5);
  assert.deepEqual(niceScale(10, 0), niceScale(0, 10));
});
