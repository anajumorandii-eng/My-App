import assert from 'node:assert/strict';
import { test } from 'node:test';
import { stereochemistryModel } from './stereochemistry';
import { rotateSpatialPoint, type SpatialPoint } from './spatialSolid';

const distance = (a: SpatialPoint, b: SpatialPoint) => Math.hypot(...a.map((v, i) => v - b[i]));
const signedVolume = (points: SpatialPoint[]) => {
  const [a, b, c] = points.slice(1).map(p => p.map((v, i) => v - points[0][i]));
  return a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
};

test('reflexão inverte a orientação do tetraedro; rotações conservam orientação e distâncias', () => {
  const original = stereochemistryModel('original').atoms.slice(1).map(atom => atom.point);
  const mirror = stereochemistryModel('mirror').atoms.slice(1).map(atom => atom.point);
  assert.equal(signedVolume(original), -signedVolume(mirror));
  assert.notEqual(signedVolume(original), 0);
  for (const yaw of [0, 45, 90, 180, 270, 360]) for (const pitch of [-50, 12, 65]) {
    const rotated = original.map(point => rotateSpatialPoint(point, yaw, pitch));
    assert.ok(Math.abs(signedVolume(rotated) - signedVolume(original)) < 1e-6);
    for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) {
      assert.ok(Math.abs(distance(rotated[i], rotated[j]) - distance(original[i], original[j])) < 1e-8);
    }
  }
});

test('cis e trans preservam dupla e plano, distinguindo a posição dos grupos metila', () => {
  for (const kind of ['cis', 'trans'] as const) {
    const model = stereochemistryModel(kind);
    assert.equal(model.bonds.filter(bond => bond.count === 2).length, 1);
    assert.ok(model.atoms.every(atom => atom.point[2] === 0));
    const methyl = model.atoms.filter(atom => atom.label === 'CH₃');
    assert.equal(methyl.length, 2);
    assert.equal(methyl[0].point[1] === methyl[1].point[1], kind === 'cis');
    assert.equal(model.bonds.length, 5);
  }
});
