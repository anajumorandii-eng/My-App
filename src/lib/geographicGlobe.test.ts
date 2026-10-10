import assert from 'node:assert/strict';
import { test } from 'node:test';
import { geographicPoint, projectGeographicPoint, visibleGeographicPath } from './geographicGlobe';

test('coordenadas conservam raio, polos e antípodas ao girar a câmera', () => {
  for (const lat of [-90, -60, 0, 20, 80, 90]) for (const lon of [-180, -90, 0, 30, 90, 180]) {
    assert.ok(Math.abs(Math.hypot(...geographicPoint(lat, lon)) - 104) < 1e-8);
    for (const yaw of [0, 90, 180, 270]) {
      const p = projectGeographicPoint(lat, lon, yaw, 12);
      assert.ok(Math.abs(Math.hypot(p.x - 160, 150 - p.y, p.depth) - 104) < 1e-8);
    }
  }
  assert.ok(projectGeographicPoint(0, 0, 0, 0).visible);
  assert.ok(!projectGeographicPoint(0, 180, 0, 0).visible);
  assert.ok(projectGeographicPoint(0, 180, 180, 0).visible);
  assert.ok(Math.abs(geographicPoint(90, 0)[0] - geographicPoint(90, 120)[0]) < 1e-8);
});

test('linha totalmente oculta não é desenhada e a passagem pela borda cria segmento visível', () => {
  assert.equal(visibleGeographicPath([[0, 170], [0, 180]], 0, 0), '');
  const crossing = visibleGeographicPath([[0, 100], [0, 80], [0, 60]], 0, 0);
  assert.ok(crossing.startsWith('M'));
  assert.ok(crossing.includes('L'));
  assert.ok(!crossing.includes('NaN'));
});
