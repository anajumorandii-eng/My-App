import test from 'node:test';
import assert from 'node:assert/strict';
import { ESTATUA, PAREDE, alturaDaSombra, ampliacao } from './caverna';

test('semelhança de triângulos: sombra / objeto = D / d', () => {
  assert.equal(ampliacao(PAREDE / 2), 2);
  assert.equal(alturaDaSombra(2), ESTATUA * 3);
  // Encostado na parede, a sombra tem o tamanho da coisa.
  assert.equal(ampliacao(PAREDE), 1);
});

test('mais perto do fogo, sombra maior: a mesma estátua, sombras diferentes', () => {
  assert.ok(alturaDaSombra(1) > alturaDaSombra(3));
  assert.ok(alturaDaSombra(3) > alturaDaSombra(5));
});
