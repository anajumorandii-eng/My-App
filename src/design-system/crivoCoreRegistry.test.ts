import assert from 'node:assert/strict';
import test from 'node:test';
import { CORE_REGISTRY } from './crivoCoreRegistry';
import { SUBJECT_REGISTRY } from './crivoSubjects';

function fakeContext() {
  const context: Record<string, unknown> = {};
  const receiverChecked = function (this: unknown) {
    assert.equal(this, context, 'métodos Canvas precisam preservar o receiver ctx');
  };
  const noop = () => undefined;
  Object.assign(context, {
    beginPath: receiverChecked, closePath: receiverChecked, moveTo: receiverChecked, lineTo: receiverChecked, quadraticCurveTo: receiverChecked,
    arc: noop, ellipse: noop, rect: noop, fill: noop, stroke: noop, fillRect: noop,
    save: noop, restore: noop, translate: noop, rotate: noop, setLineDash: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
  });
  return context;
}

test('crivo core registry: os oito núcleos Canvas 2D são seguros com um contexto duck-typed', () => {
  const ctx = fakeContext();
  for (const draw of Object.values(CORE_REGISTRY)) {
    assert.doesNotThrow(() => draw({ ctx, width: 480, height: 360, state: { focus: 0.7 }, palette: SUBJECT_REGISTRY.matematica.palette, variantSeed: 2, time: 1 }));
  }
});
