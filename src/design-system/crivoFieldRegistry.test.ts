import assert from 'node:assert/strict';
import test from 'node:test';
import { FIELD_REGISTRY } from './crivoFieldRegistry';
import { SUBJECT_REGISTRY } from './crivoSubjects';

const DRAW_PALETTE = { bg:'#12161A', surface:'#1A2126', primary:'#6E93B3', secondary:'#C9A468', emissive:'#F1EFE9', textHighlight:'#D9E4EB', textAccent:'#6E93B3', focusAccent:'#6E93B3', dataPositive:'#7FBF8F', dataWarning:'#D98B4A', atmoA:'#1E2C36', atmoB:'#0B0E11' };


test('crivo field registry: cada campo devolve gradiente CSS próprio com as atmosferas da matéria', () => {
  const math = FIELD_REGISTRY.grid(DRAW_PALETTE);
  const physics = FIELD_REGISTRY.lenses(SUBJECT_REGISTRY.fisica.palettes.dark);
  assert.match(math, /#1E2C36/);
  assert.match(math, /#0B0E11/);
  assert.notEqual(math, physics);
});

const FIELD_TYPES = ['grid', 'lenses', 'chamber', 'organic', 'syntax', 'topography', 'paired', 'semantic', 'dialectic', 'social', 'neutral'] as const;

test('crivo field registry: todo tipo de campo tem fallback CSS chamável e bem-formado', () => {
  for (const fieldType of FIELD_TYPES) {
    const field = FIELD_REGISTRY[fieldType];
    assert.equal(typeof field, 'function', `fallback CSS ausente para ${fieldType}`);
    const gradient = field(DRAW_PALETTE);
    assert.ok(gradient.startsWith('linear-gradient(') || gradient.startsWith('radial-gradient('));
    assert.equal([...gradient].filter((character) => character === '(').length, [...gradient].filter((character) => character === ')').length);
  }
});
