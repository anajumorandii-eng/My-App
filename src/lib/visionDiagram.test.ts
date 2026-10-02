import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { visionDiagram } from './visionDiagram';

describe('traçado dos defeitos da visão', () => {
  it('localiza o foco míope antes e o hipermétrope depois da retina sem correção', () => {
    const myopia = visionDiagram('miopia', false);
    const hyperopia = visionDiagram('hipermetropia', false);
    assert.ok(myopia.focusX < myopia.retinaX);
    assert.ok(hyperopia.focusX > hyperopia.retinaX);
    assert.ok(myopia.rays.every(ray => ray.extension.length === 0));
    assert.ok(hyperopia.rays.every(ray => ray.extension.length === 2));
  });

  it('a lente externa diverge antes do olho míope e leva o foco à retina', () => {
    const diagram = visionDiagram('miopia', true);
    assert.ok(diagram.lensX < 81);
    assert.ok(diagram.eyeHeight > diagram.incomingHeight);
    assert.ok(Math.abs(diagram.focusX - diagram.retinaX) < 1e-8);
    for (const ray of diagram.rays) {
      const last = ray.points.at(-1)!;
      assert.ok(Math.abs(last[0] - diagram.retinaX) < 1e-8);
      assert.ok(Math.abs(last[1] - 150) < 1e-8);
      assert.equal(ray.extension.length, 0);
    }
  });

  it('a lente externa converge antes do olho hipermétrope e leva o foco à retina', () => {
    const diagram = visionDiagram('hipermetropia', true);
    assert.ok(diagram.lensX < 81);
    assert.ok(diagram.eyeHeight < diagram.incomingHeight);
    assert.ok(Math.abs(diagram.focusX - diagram.retinaX) < 1e-8);
    for (const ray of diagram.rays) {
      assert.ok(Math.abs(ray.points.at(-1)![1] - 150) < 1e-8);
      assert.equal(ray.extension.length, 0);
    }
  });
});
