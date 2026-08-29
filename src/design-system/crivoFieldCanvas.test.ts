import assert from 'node:assert/strict';
import test from 'node:test';
import { FIELD_CANVAS_REGISTRY } from './crivoFieldCanvas';
import { SUBJECT_REGISTRY, DEFAULT_SUBJECT_PROFILE } from './crivoSubjects';

function fakeContext() {
  const context: Record<string, unknown> = {};
  const noop = () => undefined;
  const gradient = () => ({ addColorStop: noop });
  Object.assign(context, {
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, arc: noop, ellipse: noop,
    fill: noop, stroke: noop, fillRect: noop, save: noop, restore: noop, translate: noop, rotate: noop,
    createLinearGradient: gradient, createRadialGradient: gradient,
  });
  return context;
}

test('crivo field canvas: todos os campos desenham sem lançar para cada matéria', () => {
  const ctx = fakeContext();
  for (const profile of [...Object.values(SUBJECT_REGISTRY), DEFAULT_SUBJECT_PROFILE]) {
    const draw = FIELD_CANVAS_REGISTRY[profile.fieldType];
    assert.doesNotThrow(() => draw({ ctx, width: 800, height: 400, time: 3.1, palette: profile.palette, focus: 0.7 }));
  }
});
