import test from 'node:test';
import assert from 'node:assert/strict';
import { escrever, medir } from './solidos';

const perto = (a: number, b: number) => Math.abs(a - b) < 1e-9;

test('valores de referência dos livros (base 3)', () => {
  // Cilindro r = 3, h = 4: V = 36π, At = 2π·9 + 2π·3·4 = 42π.
  assert.equal(medir('cilindro', 4).volume.pi, 36);
  assert.equal(medir('cilindro', 4).areaTotal.pi, 42);
  // Cone r = 3, h = 4: geratriz 5 (terno pitagórico), V = 12π, At = 9π + 15π = 24π.
  const cone = medir('cone', 4);
  assert.ok(perto(cone.auxiliar!.valor, 5));
  assert.equal(cone.volume.pi, 12);
  assert.equal(cone.areaTotal.pi, 24);
  // Esfera r = 3: V = 36π, A = 36π.
  assert.equal(medir('esfera', 4).volume.pi, 36);
  assert.equal(medir('esfera', 4).areaTotal.pi, 36);
  // Prisma 3 × 3 × 4: V = 36, At = 18 + 48 = 66.
  assert.equal(medir('prisma', 4).volume.racional, 36);
  assert.equal(medir('prisma', 4).areaTotal.racional, 66);
});

test('o cone é um terço do cilindro, e a pirâmide um terço do prisma, com mesma base e altura', () => {
  for (const h of [2, 3.5, 8]) {
    assert.ok(perto(medir('cone', h).volume.valor * 3, medir('cilindro', h).volume.valor));
    assert.ok(perto(medir('piramide', h).volume.valor * 3, medir('prisma', h).volume.valor));
  }
});

test('pirâmide: apótema pela altura e metade do lado', () => {
  // h = 2, meio lado 1,5: apótema 2,5 (triângulo 3-4-5 dividido por 2).
  const p = medir('piramide', 2);
  assert.ok(perto(p.auxiliar!.valor, 2.5));
  assert.ok(perto(p.areaTotal.racional, 9 + 4 * (3 * 2.5) / 2));
});

test('escrita: π separado, com a aproximação ao lado', () => {
  assert.equal(escrever(medir('cone', 4).volume), '12π ≈ 37,7');
  assert.equal(escrever(medir('prisma', 4).volume), '36');
});
