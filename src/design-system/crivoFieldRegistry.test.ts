import assert from 'node:assert/strict';
import test from 'node:test';
import { FIELD_REGISTRY } from './crivoFieldRegistry';
import { SUBJECT_REGISTRY } from './crivoSubjects';

test('crivo field registry: cada campo devolve gradiente CSS próprio com as atmosferas da matéria', () => {
  const math = FIELD_REGISTRY.grid(SUBJECT_REGISTRY.matematica.palette);
  const physics = FIELD_REGISTRY.lenses(SUBJECT_REGISTRY.fisica.palette);
  assert.match(math, /#1E2C36/);
  assert.match(math, /#0B0E11/);
  assert.notEqual(math, physics);
});

test('crivo field registry: todos os gradientes fecham os parênteses CSS', () => {
  for (const field of Object.values(FIELD_REGISTRY)) {
    const gradient = field(SUBJECT_REGISTRY.matematica.palette);
    assert.ok(gradient.startsWith('linear-gradient(') || gradient.startsWith('radial-gradient('));
    assert.equal([...gradient].filter((character) => character === '(').length, [...gradient].filter((character) => character === ')').length);
  }
});
