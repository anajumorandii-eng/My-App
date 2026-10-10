import assert from 'node:assert/strict';
import { test } from 'node:test';
import { membraneLipids, membraneTransport } from './membraneSpatial';

test('bicamada apresenta caudas para o interior e cabeças nos dois meios aquosos', () => {
  const lipids = membraneLipids();
  assert.ok(lipids.length > 50);
  assert.deepEqual([...new Set(lipids.map(lipid => lipid.head[1]))].sort(), [-22, 22]);
  assert.ok(lipids.every(lipid => lipid.tails.length === 2 && lipid.tails.every(([start, end]) => Math.abs(end[1]) < Math.abs(start[1]) && Math.sign(end[1]) === Math.sign(lipid.head[1]))));
});

test('um percurso mantém a proporção da bomba e o sentido dos transportes', () => {
  const start = membraneTransport(true, 0), finish = membraneTransport(true, 1);
  assert.equal(start.filter(p => p.kind === 'sodium').length, 3);
  assert.equal(start.filter(p => p.kind === 'potassium').length, 2);
  assert.ok(finish.every((p, i) => p.kind === 'sodium' ? p.point[1] > start[i].point[1] : p.point[1] < start[i].point[1]));
  assert.ok(membraneTransport(false, 1)[0].point[1] < membraneTransport(false, 0)[0].point[1]);
});
