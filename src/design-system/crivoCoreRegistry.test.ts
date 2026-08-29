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
  const gradient = () => ({ addColorStop: noop });
  Object.assign(context, {
    beginPath: receiverChecked, closePath: receiverChecked, moveTo: receiverChecked, lineTo: receiverChecked, quadraticCurveTo: receiverChecked,
    arc: noop, ellipse: noop, rect: noop, roundRect: noop, fill: noop, stroke: noop, fillRect: noop, strokeRect: noop,
    save: noop, restore: noop, translate: noop, rotate: noop, transform: noop, setLineDash: noop,
    createLinearGradient: gradient, createRadialGradient: gradient, createConicGradient: gradient,
  });
  return context;
}

test('crivo core registry: os oito núcleos Canvas 2D são seguros com um contexto duck-typed', () => {
  const ctx = fakeContext();
  for (const draw of Object.values(CORE_REGISTRY)) {
    for (const focus of [0, 0.5, 1]) {
      assert.doesNotThrow(() =>
        draw({ ctx, width: 480, height: 360, state: { focus }, palette: SUBJECT_REGISTRY.matematica.palette, variantSeed: 2, time: 1, squashY: 0.8, skewX: -0.2 })
      );
    }
  }
});

test('crivo core registry: cada matéria desenha com a própria paleta sem lançar', () => {
  const ctx = fakeContext();
  for (const profile of Object.values(SUBJECT_REGISTRY)) {
    const draw = CORE_REGISTRY[profile.coreType];
    assert.doesNotThrow(() => draw({ ctx, width: 96, height: 96, state: { focus: 0.6 }, palette: profile.palette, variantSeed: 3, time: 2.4 }));
  }
});
