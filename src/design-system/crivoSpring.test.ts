import assert from 'node:assert/strict';
import test from 'node:test';
import { makeSpring, stepSpring } from './crivoSpring';

test('crivo spring: integra Euler semi-implícito e limita dt antes de mover a posição', () => {
  const spring = makeSpring(0);
  stepSpring(spring, 1, 1, 70, 13);
  assert.equal(spring.v, 3.5);
  assert.ok(Math.abs(spring.x - 0.175) < Number.EPSILON);
});

test('crivo spring: trata dt não finito como quadro sem avanço', () => {
  const spring = makeSpring(4);
  stepSpring(spring, 10, Number.NaN);
  assert.equal(spring.x, 4);
  assert.equal(spring.v, 0);
});
