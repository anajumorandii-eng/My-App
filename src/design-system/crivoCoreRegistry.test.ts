import assert from 'node:assert/strict';
import test from 'node:test';
import { CORE_REGISTRY } from './crivoCoreRegistry';
import { SUBJECT_REGISTRY } from './crivoSubjects';

const DRAW_PALETTE = { bg:'#12161A', surface:'#1A2126', primary:'#6E93B3', secondary:'#C9A468', emissive:'#F1EFE9', textHighlight:'#D9E4EB', dataPositive:'#7FBF8F', dataWarning:'#D98B4A', atmoA:'#1E2C36', atmoB:'#0B0E11' };

function fakeContext() {
  const context: Record<string, unknown> = {};
  let drawOperations = 0;
  const receiverChecked = function (this: unknown) {
    assert.equal(this, context, 'métodos Canvas precisam preservar o receiver ctx');
  };
  const draw = () => { drawOperations++; };
  const noop = () => undefined;
  const gradient = () => ({ addColorStop: noop });
  Object.assign(context, {
    beginPath: receiverChecked, closePath: receiverChecked, moveTo: receiverChecked, lineTo: receiverChecked, quadraticCurveTo: receiverChecked,
    arc: noop, ellipse: noop, rect: noop, roundRect: noop, fill: draw, stroke: draw, fillRect: draw, strokeRect: draw,
    save: noop, restore: noop, translate: noop, rotate: noop, transform: noop, setLineDash: noop,
    createLinearGradient: gradient, createRadialGradient: gradient, createConicGradient: gradient,
  });
  return { context, drawOperations: () => drawOperations };
}

const CORE_TYPES = [
  'matematica_grid', 'fisica_lentes', 'quimica_rede', 'biologia_helix', 'portugues_sintaxe',
  'geografia_fluxos', 'historia_campos', 'ingles_contexto', 'filosofia_dialetica', 'sociologia_rede', 'default_neutro',
] as const;

test('crivo core registry: todo tipo de núcleo é chamável e produz operações de desenho', () => {
  const { context: ctx, drawOperations } = fakeContext();
  for (const coreType of CORE_TYPES) {
    const draw = CORE_REGISTRY[coreType];
    assert.equal(typeof draw, 'function', `renderer ausente para ${coreType}`);
    const before = drawOperations();
    assert.doesNotThrow(() =>
      draw({ ctx, width: 480, height: 360, state: { focus: 0.5 }, palette: DRAW_PALETTE, variantSeed: 2, time: 1, squashY: 0.8, skewX: -0.2 })
    );
    assert.ok(drawOperations() > before, `${coreType} não produziu nenhuma operação de desenho`);
  }
});

test('crivo core registry: cada matéria desenha com a própria paleta sem lançar', () => {
  const { context: ctx } = fakeContext();
  for (const profile of Object.values(SUBJECT_REGISTRY)) {
    const draw = CORE_REGISTRY[profile.coreType];
    assert.doesNotThrow(() => draw({ ctx, width: 96, height: 96, state: { focus: 0.6 }, palette: profile.palettes.dark, variantSeed: 3, time: 2.4 }));
  }
});
