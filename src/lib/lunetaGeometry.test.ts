import assert from 'node:assert/strict';
import test from 'node:test';
import * as geometry from './lunetaGeometry';

test('raios da luneta atravessam o foco comum e saem paralelos e invertidos', () => {
  assert.equal(typeof geometry.lunetaGeometry, 'function');
  for (const focal of [400, 1200, 1600]) {
    const model = geometry.lunetaGeometry(focal);
    assert.equal(model.length, focal + 8);
    assert.equal(model.magnification, -focal / 8);
    for (const ray of model.rays) {
      assert.ok(Math.abs(ray.objectiveHeight + focal * ray.middleSlope - model.imageHeight) < 1e-10);
      assert.ok(Math.abs(ray.eyeHeight - 8 * ray.middleSlope - model.imageHeight) < 1e-10);
      assert.ok(Math.abs(ray.exitSlope + focal / 8 * model.inputSlope) < 1e-10);
      for (const panel of [ray.overview, ray.detail]) for (const point of panel) {
        assert.ok(point.x >= 8 && point.x <= 312 && point.y >= 8 && point.y <= 292);
      }
    }
  }
});
