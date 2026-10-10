import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diamondFragment, graphiteFragment } from './carbonAllotropy';

test('diamante apresenta quatro vizinhos tetraédricos, com ângulo e distância conservados', () => {
  const model = diamondFragment(), neighbors = model.bonds.filter(bond => Math.hypot(...bond.from) === 0).map(bond => bond.to);
  assert.equal(neighbors.length, 4);
  for (const point of neighbors) assert.ok(Math.abs(Math.hypot(...point) - 45) < 1e-10);
  for (let i = 0; i < neighbors.length; i++) for (let j = i + 1; j < neighbors.length; j++) assert.ok(Math.abs(neighbors[i].reduce((sum, value, k) => sum + value * neighbors[j][k], 0) / 45 ** 2 + 1 / 3) < 1e-10);
});

test('grafite tem redes planas, sem ligações covalentes entre folhas; deslizar não rompe a rede', () => {
  const first = graphiteFragment(0), slid = graphiteFragment(30);
  assert.equal(first.atoms.length, slid.atoms.length); assert.equal(first.bonds.length, slid.bonds.length);
  assert.ok(first.bonds.every(bond => bond.from[2] === bond.to[2]));
  const index = first.atoms.findIndex(atom => Math.abs(atom.point[0] - 11) < 1e-5 && Math.abs(atom.point[1]) < 1e-5 && atom.point[2] === -25);
  assert.ok(index >= 0);
  const center = first.atoms[index].point;
  const neighbors = first.bonds.filter(bond => bond.from === center || bond.to === center);
  assert.equal(neighbors.length, 3);
  const lengths = (model: ReturnType<typeof graphiteFragment>) => model.bonds.map(bond => Math.hypot(...bond.from.map((value, i) => value - bond.to[i])));
  assert.ok(lengths(first).every((length, i) => Math.abs(length - lengths(slid)[i]) < 1e-10));
});
