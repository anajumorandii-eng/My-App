import type { CoreType, CrivoPalette } from './crivoSubjects';

export interface CanvasContextLike {
  [property: string]: unknown;
}

export interface CoreDrawInput {
  ctx: CanvasContextLike;
  width: number;
  height: number;
  state: { focus?: number };
  palette: CrivoPalette;
  variantSeed: number;
  time: number;
}

export type CoreDrawFn = (input: CoreDrawInput) => void;

const invoke = (ctx: CanvasContextLike, method: string, ...args: unknown[]) => {
  const candidate = ctx[method];
  if (typeof candidate === 'function') (candidate as (...values: unknown[]) => void).call(ctx, ...args);
};
const set = (ctx: CanvasContextLike, property: string, value: unknown) => { ctx[property] = value; };
const alpha = (hex: string, opacity: number) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
};
const withFrame = (input: CoreDrawInput, draw: (radius: number, focus: number) => void) => {
  const { ctx, width, height } = input;
  const radius = Math.max(1, Math.min(width, height) * 0.34);
  invoke(ctx, 'save');
  invoke(ctx, 'translate', width / 2, height / 2);
  draw(radius, Math.min(1, Math.max(0, input.state.focus ?? 0.7)));
  invoke(ctx, 'restore');
};
const path = (ctx: CanvasContextLike, points: ReadonlyArray<readonly [number, number]>, close = false) => {
  invoke(ctx, 'beginPath');
  points.forEach(([x, y], index) => invoke(ctx, index === 0 ? 'moveTo' : 'lineTo', x, y));
  if (close) invoke(ctx, 'closePath');
};
const stroke = (ctx: CanvasContextLike, color: string, width = 1) => { set(ctx, 'strokeStyle', color); set(ctx, 'lineWidth', width); invoke(ctx, 'stroke'); };
const fill = (ctx: CanvasContextLike, color: string) => { set(ctx, 'fillStyle', color); invoke(ctx, 'fill'); };

const drawMathematics: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const step = r / 3;
  for (let index = -3; index <= 3; index += 1) {
    path(ctx, [[index * step, -r], [index * step + Math.sin(time + variantSeed) * (1 - focus) * 8, r]]);
    stroke(ctx, alpha(palette.primary, 0.24));
    path(ctx, [[-r, index * step * 0.72], [r, index * step * 0.72]]);
    stroke(ctx, alpha(palette.secondary, 0.2));
  }
  path(ctx, [[-r * .7, r * .35], [0, -r * .5], [r * .7, r * .35]], true);
  stroke(ctx, alpha(palette.emissive, .8), 1.4);
});

const drawPhysics: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time } = input;
  for (const sign of [-1, 1]) {
    invoke(ctx, 'beginPath');
    invoke(ctx, 'ellipse', sign * r * .35, 0, r * .14, r * .62, 0, 0, Math.PI * 2);
    stroke(ctx, alpha(palette.primary, .7), 1.4);
  }
  const bend = (1 - focus) * Math.sin(time * 2) * r * .2;
  path(ctx, [[-r, -r * .35], [0, bend], [r, r * .35]]);
  stroke(ctx, alpha(palette.secondary, .82), 1.6);
  invoke(ctx, 'beginPath'); invoke(ctx, 'arc', 0, bend, r * .06, 0, Math.PI * 2); fill(ctx, palette.emissive);
});

const drawChemistry: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = index / 6 * Math.PI * 2;
    const jitter = (1 - focus) * Math.sin(time * 2 + index + variantSeed) * r * .13;
    return [Math.cos(angle) * (r * .56 + jitter), Math.sin(angle) * (r * .48 + jitter)] as const;
  });
  path(ctx, points, true); stroke(ctx, alpha(palette.primary, .78), 1.5);
  points.forEach(([x, y], index) => { invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x, y, r * .065, 0, Math.PI * 2); fill(ctx, index % 2 ? palette.secondary : palette.primary); });
});

const drawBiology: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  for (let index = 0; index < 12; index += 1) {
    const y = -r + index * r * 2 / 11;
    const phase = index * .65 + time + variantSeed;
    const spread = r * (.24 + (1 - focus) * .13);
    const left = Math.sin(phase) * spread, right = -Math.sin(phase) * spread;
    path(ctx, [[left, y], [right, y + r * .12]]); stroke(ctx, alpha(palette.primary, .65), 1.2);
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', left, y, r * .028, 0, Math.PI * 2); fill(ctx, palette.secondary);
  }
});

const drawPortuguese: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time } = input;
  const base = r * .38;
  path(ctx, [[-r * .85, base], [r * .85, base]]); stroke(ctx, alpha(palette.primary, .36));
  const subjectY = base - (1 - focus) * Math.abs(Math.sin(time)) * r * .35;
  const verbY = base - (1 - focus) * Math.abs(Math.cos(time)) * r * .28;
  for (const [x, y, color] of [[-r * .38, subjectY, palette.primary], [r * .28, verbY, palette.secondary]] as const) {
    invoke(ctx, 'beginPath'); invoke(ctx, 'rect', x - r * .12, y - r * .06, r * .24, r * .12); fill(ctx, alpha(color, .32)); stroke(ctx, alpha(color, .82));
  }
  invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', -r * .38, subjectY - r * .06); invoke(ctx, 'quadraticCurveTo', 0, -r * (.28 + focus * .35), r * .28, verbY - r * .06); stroke(ctx, alpha(palette.emissive, .78), 1.3);
});

const drawGeography: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  for (let ring = 0; ring < 3; ring += 1) {
    invoke(ctx, 'beginPath');
    for (let index = 0; index <= 28; index += 1) {
      const angle = index / 28 * Math.PI * 2;
      const wobble = 1 + Math.sin(angle * 4 + variantSeed) * (.06 + (1 - focus) * .12);
      const x = Math.cos(angle) * r * (.34 + ring * .22) * wobble;
      const y = Math.sin(angle) * r * (.2 + ring * .13) * wobble;
      invoke(ctx, index === 0 ? 'moveTo' : 'lineTo', x, y);
    }
    invoke(ctx, 'closePath'); stroke(ctx, alpha(palette.primary, .36 + ring * .1));
  }
  for (let index = 0; index < 4; index += 1) {
    const x = -r * .7 + index * r * .46, y = Math.sin(time + index) * r * .15;
    path(ctx, [[x - 8, y], [x + 9, y], [x + 4, y - 4], [x + 9, y], [x + 4, y + 4]]); stroke(ctx, alpha(palette.secondary, .82), 1.2);
  }
});

const drawHistory: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  for (let index = 0; index < 4; index += 1) {
    const y = -r * .55 + index * r * .36;
    const offset = (1 - focus) * Math.sin(time + index + variantSeed) * r * .16;
    invoke(ctx, 'beginPath'); invoke(ctx, 'rect', -r * .72 + offset, y, r * 1.44, r * .2); fill(ctx, alpha(palette.primary, .12 + index * .04)); stroke(ctx, alpha(palette.primary, .5));
    for (const x of [-r * .35 + offset, r * .35 + offset]) { invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x, y + r * .1, r * .04, 0, Math.PI * 2); fill(ctx, palette.secondary); }
  }
  path(ctx, [[0, -r * .7], [Math.sin(time) * (1 - focus) * r * .12, 0], [0, r * .7]]); stroke(ctx, alpha(palette.emissive, .65), 1.1);
});

const drawNeutral: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const nodes = Array.from({ length: 5 }, (_, index) => {
    const angle = index / 5 * Math.PI * 2 + variantSeed;
    const radius = r * (.54 + Math.sin(time + index) * (1 - focus) * .12);
    return [Math.cos(angle) * radius, Math.sin(angle) * radius * .7] as const;
  });
  path(ctx, nodes, true); stroke(ctx, alpha(palette.primary, .55));
  nodes.forEach(([x, y]) => { invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x, y, r * .05, 0, Math.PI * 2); fill(ctx, palette.secondary); });
});

export const CORE_REGISTRY: Record<CoreType, CoreDrawFn> = {
  matematica_grid: drawMathematics,
  fisica_lentes: drawPhysics,
  quimica_rede: drawChemistry,
  biologia_helix: drawBiology,
  portugues_sintaxe: drawPortuguese,
  geografia_fluxos: drawGeography,
  historia_campos: drawHistory,
  default_neutro: drawNeutral,
};
