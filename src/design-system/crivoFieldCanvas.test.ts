import assert from 'node:assert/strict';
import test from 'node:test';
import { FIELD_CANVAS_REGISTRY } from './crivoFieldCanvas';
import { SUBJECT_REGISTRY, DEFAULT_SUBJECT_PROFILE } from './crivoSubjects';

const DRAW_PALETTE = { bg:'#12161A', surface:'#1A2126', primary:'#6E93B3', secondary:'#C9A468', emissive:'#F1EFE9', textHighlight:'#D9E4EB', dataPositive:'#7FBF8F', dataWarning:'#D98B4A', atmoA:'#1E2C36', atmoB:'#0B0E11' };

function fakeContext() {
  const context: Record<string, unknown> = {};
  let drawOperations = 0;
  const noop = () => undefined;
  const draw = () => { drawOperations++; };
  const gradient = () => ({ addColorStop: noop });
  Object.assign(context, {
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, ellipse: noop,
    fill: draw, stroke: draw, fillRect: draw, save: noop, restore: noop, translate: noop, rotate: noop,
    createLinearGradient: gradient, createRadialGradient: gradient,
  });
  return { context, drawOperations: () => drawOperations };
}

const FIELD_TYPES = ['grid', 'lenses', 'chamber', 'organic', 'syntax', 'topography', 'paired', 'semantic', 'dialectic', 'social', 'neutral'] as const;

test('crivo field canvas: todo tipo de campo é chamável e produz operações de desenho', () => {
  const { context: ctx, drawOperations } = fakeContext();
  for (const fieldType of FIELD_TYPES) {
    const draw = FIELD_CANVAS_REGISTRY[fieldType];
    assert.equal(typeof draw, 'function', `renderer ausente para ${fieldType}`);
    const before = drawOperations();
    assert.doesNotThrow(() => draw({ ctx, width: 800, height: 400, time: 3.1, palette: DRAW_PALETTE, focus: 0.7 }));
    assert.ok(drawOperations() > before, `${fieldType} não produziu nenhuma operação de desenho`);
  }
});

test('crivo field canvas: todos os campos desenham sem lançar para cada matéria', () => {
  const { context: ctx } = fakeContext();
  for (const profile of [...Object.values(SUBJECT_REGISTRY), DEFAULT_SUBJECT_PROFILE]) {
    const draw = FIELD_CANVAS_REGISTRY[profile.fieldType];
    assert.doesNotThrow(() => draw({ ctx, width: 800, height: 400, time: 3.1, palette: profile.palettes.dark, focus: 0.7 }));
  }
});
