import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOLID_CONFIGS, estadoInicial } from './solidInstruments';
import { projectSpatialModel, rotateSpatialPoint, spatialSolid } from './spatialSolid';

test('a rotação preserva distâncias e a diagonal 3 × 4 × 12 continua com comprimento 13', () => {
  const model = spatialSolid('bloco', { a: 3, b: 4, c: 12 });
  const diagonal = model.lines.find(line => line.label === 'D')!;
  for (const yaw of [0, 30, 90, 180, 270, 360]) for (const pitch of [-50, 0, 22, 65]) {
    const a = rotateSpatialPoint(diagonal.from, yaw, pitch);
    const b = rotateSpatialPoint(diagonal.to, yaw, pitch);
    assert.ok(Math.abs(Math.hypot(...a.map((v, i) => v - b[i])) - 13) < 1e-9);
  }
});

test('o prisma inclinado conserva altura perpendicular e base regular', () => {
  const regular = spatialSolid('prisma', { n: 6, l: 2, h: 5, s: 0 });
  const inclined = spatialSolid('prisma', { n: 6, l: 2, h: 5, s: 3 });
  for (const model of [regular, inclined]) {
    const bases = model.faces.filter(face => face.kind === 'base');
    assert.equal(bases.length, 2);
    assert.equal(bases[1].points[0][1] - bases[0].points[0][1], 5);
    const base = bases[0].points;
    for (let i = 0; i < base.length; i++) {
      const next = base[(i + 1) % base.length];
      assert.ok(Math.abs(Math.hypot(...base[i].map((v, j) => v - next[j])) - 2) < 1e-9);
    }
  }
});

test('o corte da pirâmide representa a razão linear t e não muda o sólido inteiro', () => {
  const model = spatialSolid('piramide', { n: 4, l: 6, h: 4, t: 0.5 });
  const base = model.faces.find(face => face.kind === 'base')!;
  const cut = model.faces.find(face => face.kind === 'cut')!;
  assert.equal(cut.points[0][1], 0);
  for (let i = 0; i < base.points.length; i++) {
    assert.ok(Math.abs(cut.points[i][0] - base.points[i][0] * 0.5) < 1e-9);
    assert.ok(Math.abs(cut.points[i][2] - base.points[i][2] * 0.5) < 1e-9);
  }
});

test('as vistas permanecem finitas e enquadradas nos extremos dos controles e da rotação', () => {
  for (const config of Object.values(SOLID_CONFIGS)) {
    const initial = estadoInicial(config).valores;
    const samples = [initial, Object.fromEntries(config.controles.map(c => [c.id, c.min])),
      Object.fromEntries(config.controles.map(c => [c.id, c.max]))];
    for (const values of samples) for (const shape of config.formas?.map(f => f.id) ?? ['cilindro']) {
      const model = spatialSolid(config.id, values, shape);
      for (const yaw of [0, 45, 90, 135, 180, 225, 270, 315]) for (const pitch of [-50, 22, 65]) {
        const projected = projectSpatialModel(model, yaw, pitch);
        const points = projected.faces.flatMap(face => face.points);
        for (const [x, y] of points) {
          assert.ok(Number.isFinite(x) && Number.isFinite(y), config.id);
          assert.ok(x >= 8 && x <= 312 && y >= 8 && y <= 292, config.id + ': ponto fora do enquadramento');
        }
      }
    }
  }
});
