import assert from 'node:assert/strict';
import { test } from 'node:test';
import { magneticTrajectory } from './magneticTrajectory';

test('força magnética é qv×B e permanece perpendicular à velocidade', () => {
  for (const theta of [0, 10, 60, 90]) for (const time of [0, .2, .5, 1]) {
    const { velocity: v, force: f, magnitude } = magneticTrajectory(theta, time);
    assert.ok(Math.abs(Math.hypot(...v) - 1) < 1e-10);
    assert.ok(Math.abs(v.reduce((sum, value, i) => sum + value * f[i], 0)) < 1e-10);
    assert.equal(f[2], 0);
    assert.ok(Math.abs(f[0] - .6 * v[1]) < 1e-10);
    assert.ok(Math.abs(f[1] + .6 * v[0]) < 1e-10);
    assert.ok(Math.abs(Math.hypot(...f) - magnitude) < 1e-10);
  }
});

test('ângulos extremos produzem reta e círculo; o caso intermediário avança em hélice', () => {
  assert.equal(magneticTrajectory(0, 0).kind, 'retilínea');
  assert.equal(magneticTrajectory(90, 0).kind, 'circular');
  const points = [0, .25, .5, .75, 1].map(t => magneticTrajectory(90, t).position);
  assert.ok(points.every(([x, y, z]) => z === 0 && Math.abs(Math.hypot(x, y) - 30) < 1e-10));
  assert.ok(magneticTrajectory(60, 1).position[2] > magneticTrajectory(60, 0).position[2]);
});
