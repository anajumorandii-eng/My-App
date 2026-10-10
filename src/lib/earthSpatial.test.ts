import assert from 'node:assert/strict';
import { test } from 'node:test';
import { declinacao, INCLINACAO } from './estacoesDoAno';
import { earthAxis, earthSunDirection, earthSurface, solarIncidence } from './earthSpatial';

test('eixo fixo e direção solar reproduzem a declinação existente em todas as datas', () => {
  for (const day of [1, 79, 172, 265, 355, 365]) {
    const sun = earthSunDirection(day);
    assert.ok(Math.abs(Math.hypot(...sun) - 1) < 1e-10);
    const delta = Math.asin(earthAxis.reduce((sum, value, i) => sum + value * sun[i], 0)) * 180 / Math.PI;
    assert.ok(Math.abs(delta - declinacao(day)) < 1e-10);
    assert.ok(Math.abs(Math.acos(earthAxis[1]) * 180 / Math.PI - INCLINACAO) < 1e-10);
  }
});

test('rotação conserva latitude e raio; hemisférios alternam iluminação dos polos', () => {
  for (const angle of [0, 90, 180, 360]) {
    const p = earthSurface(-23.55, 0, angle);
    assert.ok(Math.abs(Math.hypot(...p) - 100) < 1e-10);
    assert.ok(Math.abs(earthAxis.reduce((sum, value, i) => sum + value * p[i], 0) - 100 * Math.sin(-23.55 * Math.PI / 180)) < 1e-10);
  }
  assert.ok(solarIncidence(earthSurface(90, 0, 0), 172) > 0);
  assert.ok(solarIncidence(earthSurface(-90, 0, 0), 172) < 0);
  assert.ok(solarIncidence(earthSurface(90, 0, 0), 355) < 0);
});
