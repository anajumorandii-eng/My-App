import assert from 'node:assert/strict';
import { test } from 'node:test';
import { spatialRing, wireMagneticField } from './magneticFieldGeometry';

test('campo do fio é tangente ao círculo, perpendicular ao raio e à corrente +z', () => {
  for (const angle of [0, 45, 90, 180, 270]) {
    const { point: p, direction: b } = wireMagneticField(angle, 60);
    assert.ok(Math.abs(p[0] * b[0] + p[1] * b[1]) < 1e-10);
    assert.equal(b[2], 0); assert.ok(Math.abs(Math.hypot(...b) - 1) < 1e-10);
    assert.ok(p[0] * b[1] - p[1] * b[0] > 0);
  }
});

test('linhas de campo conservam plano e raio e fecham uma volta', () => {
  const ring = spatialRing(70, 20);
  assert.ok(ring.every(([x, y, z]) => z === 20 && Math.abs(Math.hypot(x, y) - 70) < 1e-10));
  assert.ok(Math.hypot(...ring[0].map((value, i) => value - ring.at(-1)![i])) < 1e-10);
});
