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
  /** Shear-scale "3D-ish" pose shared with the external shell — 1/0 when the caller doesn't drive one. */
  squashY?: number;
  skewX?: number;
}

export type CoreDrawFn = (input: CoreDrawInput) => void;

interface GradientLike {
  addColorStop(offset: number, color: string): void;
}

function call<T>(ctx: CanvasContextLike, method: string, ...args: unknown[]): T | undefined {
  const fn = ctx[method];
  return typeof fn === 'function' ? (fn as (...values: unknown[]) => T).call(ctx, ...args) : undefined;
}
const invoke = (ctx: CanvasContextLike, method: string, ...args: unknown[]) => {
  call(ctx, method, ...args);
};
const set = (ctx: CanvasContextLike, property: string, value: unknown) => {
  ctx[property] = value;
};
const alpha = (hex: string, opacity: number) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
};
function withStops(gradient: GradientLike | undefined, stops: ReadonlyArray<readonly [number, string]>) {
  stops.forEach(([offset, color]) => gradient?.addColorStop(offset, color));
  return gradient;
}
function linearGradient(ctx: CanvasContextLike, x0: number, y0: number, x1: number, y1: number, stops: ReadonlyArray<readonly [number, string]>) {
  return withStops(call<GradientLike>(ctx, 'createLinearGradient', x0, y0, x1, y1), stops);
}
function radialGradient(ctx: CanvasContextLike, x0: number, y0: number, r0: number, x1: number, y1: number, r1: number, stops: ReadonlyArray<readonly [number, string]>) {
  return withStops(call<GradientLike>(ctx, 'createRadialGradient', x0, y0, r0, x1, y1, r1), stops);
}
function roundedRect(ctx: CanvasContextLike, x: number, y: number, w: number, h: number, radius: number) {
  if (typeof ctx.roundRect === 'function') invoke(ctx, 'roundRect', x, y, w, h, radius);
  else invoke(ctx, 'rect', x, y, w, h);
}
const path = (ctx: CanvasContextLike, points: ReadonlyArray<readonly [number, number]>, close = false) => {
  invoke(ctx, 'beginPath');
  points.forEach(([x, y], index) => invoke(ctx, index === 0 ? 'moveTo' : 'lineTo', x, y));
  if (close) invoke(ctx, 'closePath');
};
const stroke = (ctx: CanvasContextLike, color: unknown, width = 1) => {
  set(ctx, 'strokeStyle', color); set(ctx, 'lineWidth', width); invoke(ctx, 'stroke');
};
const fill = (ctx: CanvasContextLike, color: unknown) => { set(ctx, 'fillStyle', color); invoke(ctx, 'fill'); };

const withFrame = (input: CoreDrawInput, draw: (radius: number, focus: number) => void) => {
  const { ctx, width, height, squashY = 1, skewX = 0 } = input;
  const radius = Math.max(1, Math.min(width, height) * 0.3);
  invoke(ctx, 'save');
  invoke(ctx, 'translate', width / 2, height / 2);
  invoke(ctx, 'transform', 1, 0, skewX * 0.3, squashY, 0, 0);
  draw(radius, Math.min(1, Math.max(0, input.state.focus ?? 0.7)));
  invoke(ctx, 'restore');
};

// --- Matemática: partícula se distribuindo até uma curva de probabilidade ---
function bellY(x: number, radius: number): number {
  return -Math.exp(-(x * x) / (2 * 0.16)) * radius * 0.65;
}
const drawMathematics: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  stroke(ctx, 'rgba(210,225,218,0.25)', 1);
  path(ctx, [[-r * 0.9, r * 0.3], [r * 0.9, r * 0.3]]);
  invoke(ctx, 'stroke');
  invoke(ctx, 'beginPath');
  for (let i = 0; i <= 40; i++) {
    const x = -0.9 + i * (1.8 / 40);
    const y = bellY(x, r) * focus + r * 0.3;
    invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', x * r, y);
  }
  stroke(ctx, alpha(palette.primary, 0.4 + 0.35 * focus), 1.3);
  const n = 16;
  for (let i = 0; i < n; i++) {
    const xn = -0.85 + (i / (n - 1)) * 1.7;
    const targetX = xn * r, targetY = bellY(xn, r) + r * 0.3;
    const scatterX = Math.sin(i * 12.9 + variantSeed) * r * 0.85;
    const scatterY = Math.cos(i * 7.3 + variantSeed + time * 0.3) * r * 0.5;
    const px = targetX * focus + scatterX * (1 - focus);
    const py = targetY * focus + scatterY * (1 - focus);
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', px, py, r * 0.035, 0, 7);
    fill(ctx, alpha(palette.primary, 0.85));
  }
});

// --- Física: lentes, prisma, raios refratando até um ponto focal ---
const drawPhysics: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const scatter = 1 - focus;

  invoke(ctx, 'save'); invoke(ctx, 'rotate', scatter * 0.35 * Math.sin(time * 0.7 + variantSeed));
  const lensW = r * 0.3, lensH = r * 0.58;
  const lensGrad = linearGradient(ctx, -lensW, -lensH, lensW, lensH, [
    [0, 'rgba(230,240,255,0.42)'], [0.5, alpha(palette.primary, 0.22)], [1, 'rgba(200,220,255,0.14)'],
  ]);
  set(ctx, 'fillStyle', lensGrad); set(ctx, 'strokeStyle', 'rgba(255,255,255,0.55)'); set(ctx, 'lineWidth', 1);
  invoke(ctx, 'beginPath'); invoke(ctx, 'ellipse', 0, 0, lensW, lensH, 0, 0, Math.PI * 2); invoke(ctx, 'fill'); invoke(ctx, 'stroke');
  invoke(ctx, 'restore');

  invoke(ctx, 'save'); invoke(ctx, 'translate', -r * 0.5, r * 0.05); invoke(ctx, 'rotate', -0.25 + scatter * 0.3);
  path(ctx, [[0, -r * 0.2], [r * 0.18, r * 0.12], [-r * 0.18, r * 0.12]], true);
  set(ctx, 'fillStyle', alpha(palette.primary, 0.28)); invoke(ctx, 'fill');
  set(ctx, 'strokeStyle', 'rgba(255,255,255,0.4)'); set(ctx, 'lineWidth', 0.8); invoke(ctx, 'stroke');
  invoke(ctx, 'restore');

  const focalX = r * 0.72, focalY = 0;
  const nRays = 5;
  for (let i = 0; i < nRays; i++) {
    const spreadAngle = -0.8 + i * (1.6 / (nRays - 1));
    const jitter = scatter * 0.55 * Math.sin(i * 2.1 + time * 0.8 + variantSeed);
    const ang = spreadAngle + jitter;
    const startR = r * 1.55;
    const sx = -Math.cos(ang) * startR, sy = Math.sin(ang) * startR * 0.5;
    const hitX = -lensW * 0.75, hitY = sy * 0.35;
    const fy = focalY + scatter * Math.sin(i - time * 0.5 + variantSeed) * r * 0.32;
    ([[255, 90, 90], [255, 255, 255], [110, 170, 255]] as const).forEach((c, ci) => {
      const off = (ci - 1) * scatter * 4;
      set(ctx, 'strokeStyle', `rgba(${c[0]},${c[1]},${c[2]},0.5)`); set(ctx, 'lineWidth', 1);
      path(ctx, [[sx, sy + off], [hitX, hitY + off], [focalX, fy + off]]);
      invoke(ctx, 'stroke');
    });
  }
  const fr = r * (0.07 + focus * 0.2);
  const focalGrad = radialGradient(ctx, focalX, focalY, 0, focalX, focalY, fr * 2.4, [
    [0, `rgba(255,238,205,${0.9 * focus + 0.1})`], [1, 'rgba(255,238,205,0)'],
  ]);
  set(ctx, 'fillStyle', focalGrad); invoke(ctx, 'beginPath'); invoke(ctx, 'arc', focalX, focalY, fr * 2.4, 0, 7); invoke(ctx, 'fill');
  set(ctx, 'fillStyle', `rgba(255,245,220,${0.6 + 0.4 * focus})`);
  invoke(ctx, 'beginPath'); invoke(ctx, 'arc', focalX, focalY, fr * 0.5 + 1, 0, 7); invoke(ctx, 'fill');
});

// --- Química: rede molecular que reage — ligações quebram/reformam até estabilizar num anel ---
const drawChemistry: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const n = 6;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const jitter = (1 - focus) * r * 0.16;
    const jx = Math.sin(i * 3.1 + time * 1.3 + variantSeed) * jitter;
    const jy = Math.cos(i * 2.4 + time * 1.1 + variantSeed) * jitter;
    pts.push([Math.cos(a) * r + jx, Math.sin(a) * r * 0.85 + jy]);
  }
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
    const activation = focus > 0.7 ? 1 : (Math.sin(i * 5.2 + time * 3.4 + variantSeed) * 0.5 + 0.5) * (0.3 + focus * 0.7);
    if (activation > 0.35) {
      path(ctx, [[x1, y1], [x2, y2]]);
      stroke(ctx, alpha(palette.primary, 0.25 + 0.5 * activation), 1.4);
    } else {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      set(ctx, 'strokeStyle', alpha(palette.secondary, 0.5)); set(ctx, 'lineWidth', 1);
      invoke(ctx, 'beginPath');
      invoke(ctx, 'moveTo', mx - 4, my - 4); invoke(ctx, 'lineTo', mx + 4, my + 4);
      invoke(ctx, 'moveTo', mx - 4, my + 4); invoke(ctx, 'lineTo', mx + 4, my - 4);
      invoke(ctx, 'stroke');
    }
  }
  if (focus > 0.5) {
    set(ctx, 'strokeStyle', alpha(palette.primary, (focus - 0.5) * 1.4)); set(ctx, 'lineWidth', 1);
    for (let i = 0; i < n; i += 2) {
      const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n];
      invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x1 * 0.82, y1 * 0.82); invoke(ctx, 'lineTo', x2 * 0.82, y2 * 0.82); invoke(ctx, 'stroke');
    }
  }
  pts.forEach(([x, y]) => {
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x, y, r * 0.055, 0, 7);
    fill(ctx, alpha(palette.primary, 0.85));
  });
});

// --- Biologia: hélice dupla, se desenrola quando não resolvida ---
const drawBiology: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const h = r * 1.25, turns = 2.5, n = 28, gapBoost = (1 - focus) * r * 0.3;
  const A: Array<[number, number]> = [], B: Array<[number, number]> = [];
  for (let i = 0; i <= n; i++) {
    const yy = -h / 2 + (i / n) * h;
    const phase = (i / n) * turns * Math.PI * 2 + time * 0.6 * (1 - focus * 0.7);
    const rx = r * 0.26;
    A.push([Math.sin(phase) * rx - gapBoost * Math.sign(Math.sin(phase) || 1) * 0.5, yy]);
    B.push([Math.sin(phase + Math.PI) * rx + gapBoost * Math.sign(Math.sin(phase + Math.PI) || 1) * 0.5, yy]);
  }
  set(ctx, 'strokeStyle', alpha(palette.primary, 0.3 + 0.45 * focus)); set(ctx, 'lineWidth', 1);
  for (let i = 0; i < A.length; i += 2) {
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', A[i][0], A[i][1]); invoke(ctx, 'lineTo', B[i][0], B[i][1]); invoke(ctx, 'stroke');
  }
  ([A, B] as const).forEach((strand, si) => {
    path(ctx, strand);
    stroke(ctx, si === 0 ? alpha(palette.primary, 0.85) : 'rgba(210,225,218,0.55)', 1.6);
  });
});

// --- Português: diagrama de sintaxe/dependência — concordância sujeito/verbo ---
const drawPortuguese: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const disagree = 1 - focus;
  const baseY = r * 0.34;

  stroke(ctx, alpha(palette.primary, 0.25), 1);
  path(ctx, [[-r * 0.78, baseY], [r * 0.78, baseY]]); invoke(ctx, 'stroke');

  ([-0.66, -0.1, 0.62] as const).forEach((p, i) => {
    const x = p * r, w = r * (0.11 + 0.05 * Math.sin(i * 3 + variantSeed));
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.2)); set(ctx, 'lineWidth', r * 0.045);
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x - w / 2, baseY); invoke(ctx, 'lineTo', x + w / 2, baseY); invoke(ctx, 'stroke');
  });

  const subjX = -r * 0.4, verbX = r * 0.26;
  const subjY = baseY - Math.abs(Math.sin(variantSeed * 2 + time * 0.3)) * r * 0.3 * disagree;
  const verbY = baseY - Math.abs(Math.cos(variantSeed * 1.7 + time * 0.35)) * r * 0.26 * disagree;
  const subjRot = Math.sin(variantSeed + time * 0.4) * 0.22 * disagree;
  const verbRot = -Math.cos(variantSeed * 1.3 + time * 0.32) * 0.22 * disagree;

  function token(x: number, y: number, rot: number, w: number, color: string): [number, number] {
    const h = r * 0.15;
    invoke(ctx, 'save'); invoke(ctx, 'translate', x, y); invoke(ctx, 'rotate', rot);
    invoke(ctx, 'beginPath'); invoke(ctx, 'ellipse', 2, h * 0.85, w * 0.48, h * 0.16, 0, 0, 7);
    fill(ctx, 'rgba(0,0,0,0.22)');
    const grad = linearGradient(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, alpha(color, 0.34)], [1, alpha(color, 0.12)]]);
    set(ctx, 'fillStyle', grad); set(ctx, 'strokeStyle', alpha(color, 0.85)); set(ctx, 'lineWidth', 1);
    invoke(ctx, 'beginPath'); roundedRect(ctx, -w / 2, -h / 2, w, h, h * 0.4); invoke(ctx, 'fill'); invoke(ctx, 'stroke');
    set(ctx, 'strokeStyle', alpha(color, 0.9)); set(ctx, 'lineWidth', h * 0.24);
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', -w * 0.3, 0); invoke(ctx, 'lineTo', w * 0.26, 0); invoke(ctx, 'stroke');
    invoke(ctx, 'restore');
    return [x, y - h / 2];
  }
  const subjTop = token(subjX, subjY, subjRot, r * 0.3, palette.primary);
  const verbTop = token(verbX, verbY, verbRot, r * 0.24, palette.secondary);

  const midX = (subjTop[0] + verbTop[0]) / 2;
  const archH = r * 0.46 * focus + disagree * (r * 0.18 + Math.sin(time * 3 + variantSeed) * r * 0.1);
  set(ctx, 'strokeStyle', alpha(palette.primary, 0.3 + 0.55 * focus)); set(ctx, 'lineWidth', 1.2 + 0.5 * focus);
  invoke(ctx, 'beginPath');
  invoke(ctx, 'moveTo', subjTop[0], subjTop[1]);
  invoke(ctx, 'quadraticCurveTo', midX, subjTop[1] - archH, verbTop[0], verbTop[1]);
  invoke(ctx, 'stroke');

  if (focus > 0.55) {
    const a = (focus - 0.55) / 0.45;
    set(ctx, 'globalAlpha', a);
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', midX, subjTop[1] - archH, r * 0.024, 0, 7);
    fill(ctx, 'rgba(255,250,235,0.95)');
    set(ctx, 'globalAlpha', 1);
  }
});

// --- Geografia: contornos topográficos + setas de fluxo, caótico → coerente ---
const drawGeography: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  for (let ring = 0; ring < 3; ring++) {
    const rr = r * (0.35 + ring * 0.25);
    invoke(ctx, 'beginPath');
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const wob = 1 + 0.12 * Math.sin(a * 4 + ring + variantSeed) * (1 + (1 - focus) * 1.5);
      const x = Math.cos(a) * rr * wob, y = Math.sin(a) * rr * wob * 0.55;
      invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', x, y);
    }
    invoke(ctx, 'closePath');
    stroke(ctx, alpha(palette.primary, 0.2 + 0.1 * ring), 1);
  }
  const nA = 6;
  for (let i = 0; i < nA; i++) {
    const a = (i / nA) * Math.PI * 2, rr = r * 0.72;
    const x = Math.cos(a) * rr, y = Math.sin(a) * rr * 0.55;
    const coherent = -Math.PI / 3;
    const chaos = a + Math.PI / 2 + Math.sin(i + variantSeed + time * 0.4) * 1.4;
    const ang = coherent * focus + chaos * (1 - focus);
    invoke(ctx, 'save'); invoke(ctx, 'translate', x, y); invoke(ctx, 'rotate', ang);
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.6)); set(ctx, 'lineWidth', 1.2);
    invoke(ctx, 'beginPath');
    invoke(ctx, 'moveTo', -r * 0.09, 0); invoke(ctx, 'lineTo', r * 0.09, 0); invoke(ctx, 'lineTo', r * 0.03, -r * 0.04);
    invoke(ctx, 'moveTo', r * 0.09, 0); invoke(ctx, 'lineTo', r * 0.03, r * 0.04);
    invoke(ctx, 'stroke'); invoke(ctx, 'restore');
  }
});

// --- História: placas de arquivo em camadas, cada uma com dois selos (lados opostos) ---
const drawHistory: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const n = 4, bandH = r * 0.2, depth = r * 0.09;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const yy = -r * 0.48 + i * (r * 0.3);
    const misalign = (1 - focus) * r * 0.45;
    const xOff = misalign * Math.sin(i * 1.7 + variantSeed);
    const w = r * (1.1 - i * 0.08);
    invoke(ctx, 'save'); invoke(ctx, 'translate', xOff, yy);

    invoke(ctx, 'beginPath');
    invoke(ctx, 'moveTo', w / 2, -bandH / 2); invoke(ctx, 'lineTo', w / 2 + depth * 0.4, -bandH / 2 + depth * 0.5);
    invoke(ctx, 'lineTo', w / 2 + depth * 0.4, bandH / 2 + depth * 0.5); invoke(ctx, 'lineTo', w / 2, bandH / 2); invoke(ctx, 'closePath');
    fill(ctx, alpha(palette.primary, 0.14 + 0.03 * i));

    const grad = linearGradient(ctx, 0, -bandH / 2, 0, bandH / 2, [
      [0, alpha(palette.primary, 0.04)], [0.5, alpha(palette.primary, 0.2 + 0.04 * i)], [1, alpha(palette.primary, 0.04)],
    ]);
    set(ctx, 'fillStyle', grad); invoke(ctx, 'fillRect', -w / 2, -bandH / 2, w, bandH);

    set(ctx, 'strokeStyle', alpha(palette.primary, 0.07)); set(ctx, 'lineWidth', 0.6);
    for (let f = 0; f < 3; f++) {
      const fy = -bandH / 2 + (bandH * (f + 0.5)) / 3;
      invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', -w / 2, fy); invoke(ctx, 'lineTo', w / 2, fy); invoke(ctx, 'stroke');
    }
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.4 + 0.1 * i)); set(ctx, 'lineWidth', 1);
    invoke(ctx, 'strokeRect', -w / 2, -bandH / 2, w, bandH);

    const t1 = Math.sin(i * 2.3 + variantSeed) * 0.32 * w;
    const t2 = Math.cos(i * 1.6 + variantSeed + 1.7) * 0.32 * w;
    ([[t1, palette.primary], [t2, palette.secondary]] as const).forEach(([tx, col]) => {
      set(ctx, 'strokeStyle', alpha(col, 0.9)); set(ctx, 'lineWidth', 1.3);
      invoke(ctx, 'beginPath'); invoke(ctx, 'arc', tx, 0, r * 0.034, 0, 7); invoke(ctx, 'stroke');
      invoke(ctx, 'beginPath');
      invoke(ctx, 'moveTo', tx, -r * 0.017); invoke(ctx, 'lineTo', tx + r * 0.014, r * 0.014); invoke(ctx, 'lineTo', tx - r * 0.014, r * 0.014);
      invoke(ctx, 'closePath');
      fill(ctx, alpha(col, 0.85));
    });
    pts.push([xOff + t1, yy], [xOff + t2, yy]);
    invoke(ctx, 'restore');
  }

  const jag = (1 - focus) * r * 0.16;
  set(ctx, 'strokeStyle', `rgba(18,12,8,${0.3 + 0.3 * (1 - focus)})`); set(ctx, 'lineWidth', 1.8);
  invoke(ctx, 'setLineDash', [2, 2.5]);
  invoke(ctx, 'beginPath');
  for (let i = 0; i <= n; i++) {
    const yy = -r * 0.58 + i * (r * 0.3);
    const xx = Math.sin(i * 2.7 + variantSeed + time * 0.6) * jag;
    invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', xx, yy);
  }
  invoke(ctx, 'stroke');

  set(ctx, 'strokeStyle', alpha(palette.primary, 0.1 + 0.4 * focus)); set(ctx, 'lineWidth', 1); invoke(ctx, 'setLineDash', [3, 3]);
  for (let i = 0; i < pts.length - 2; i += 2) {
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', pts[i][0], pts[i][1]); invoke(ctx, 'lineTo', pts[i + 2][0], pts[i + 2][1]); invoke(ctx, 'stroke');
    const next = pts[i + 3] ?? pts[i + 1];
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', pts[i + 1][0], pts[i + 1][1]); invoke(ctx, 'lineTo', next[0], next[1]); invoke(ctx, 'stroke');
  }
  invoke(ctx, 'setLineDash', []);
});

// --- Inglês: fragmentos semânticos convergem ao redor de uma expressão contextual ---
const drawEnglish: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const targets = [-0.78, -0.49, -0.27, 0.28, 0.51, 0.76];
  const fragments: Array<[number, number]> = [];

  targets.forEach((target, index) => {
    const spread = 1 - focus;
    const x = target * r + Math.sin(index * 2.7 + variantSeed) * r * 0.42 * spread;
    const y = Math.cos(index * 1.9 + time * 0.7 + variantSeed) * r * 0.52 * spread;
    const width = r * (0.13 + (index % 3) * 0.025);
    const height = r * 0.1;
    fragments.push([x, y]);
    invoke(ctx, 'beginPath');
    roundedRect(ctx, x - width / 2, y - height / 2, width, height, height * 0.35);
    fill(ctx, alpha(index % 2 === 0 ? palette.primary : palette.secondary, 0.2 + focus * 0.32));
  });

  const phraseW = r * (0.42 + focus * 0.12), phraseH = r * 0.2;
  const phraseGradient = linearGradient(ctx, -phraseW / 2, 0, phraseW / 2, 0, [
    [0, alpha(palette.primary, 0.3)], [0.5, alpha(palette.emissive, 0.2 + focus * 0.22)], [1, alpha(palette.secondary, 0.3)],
  ]);
  invoke(ctx, 'beginPath'); roundedRect(ctx, -phraseW / 2, -phraseH / 2, phraseW, phraseH, phraseH * 0.42);
  set(ctx, 'fillStyle', phraseGradient); invoke(ctx, 'fill');
  stroke(ctx, alpha(palette.emissive, 0.45 + focus * 0.4), 1.2);

  set(ctx, 'strokeStyle', alpha(palette.primary, 0.12 + focus * 0.3)); set(ctx, 'lineWidth', 1);
  fragments.forEach(([x, y]) => {
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x, y);
    invoke(ctx, 'quadraticCurveTo', x * 0.45, y * 0.35, Math.sign(x) * phraseW * 0.44, 0);
    invoke(ctx, 'stroke');
  });
});

// --- Filosofia: tese e antítese formam arcos opostos ligados por um eixo de síntese ---
const drawPhilosophy: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const tension = (1 - focus) * (0.18 + 0.08 * Math.sin(time * 0.6 + variantSeed));
  const arcHeight = r * (0.7 - tension);

  ([[-1, palette.primary], [1, palette.secondary]] as const).forEach(([side, color]) => {
    invoke(ctx, 'beginPath');
    invoke(ctx, 'moveTo', side * r * 0.78, r * 0.42);
    invoke(ctx, 'quadraticCurveTo', side * r * (0.88 + tension), -arcHeight, side * r * 0.08, -r * 0.22);
    stroke(ctx, alpha(color, 0.48 + focus * 0.38), 1.5 + focus * 0.7);
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', side * r * 0.78, r * 0.42, r * 0.055, 0, 7);
    fill(ctx, alpha(color, 0.78));
  });

  const synthesisLean = Math.sin(time * 0.5 + variantSeed) * (1 - focus) * r * 0.28;
  const axisTop: [number, number] = [synthesisLean, -r * 0.58];
  const axisBottom: [number, number] = [-synthesisLean * 0.35, r * 0.58];
  path(ctx, [axisTop, axisBottom]);
  stroke(ctx, alpha(palette.emissive, 0.35 + focus * 0.5), 1.2 + focus);
  invoke(ctx, 'beginPath'); invoke(ctx, 'arc', 0, -r * 0.22, r * (0.045 + focus * 0.025), 0, 7);
  fill(ctx, alpha(palette.emissive, 0.72 + focus * 0.2));
});

// --- Sociologia: rede multinível reorganiza clusters e adensa relações com o foco ---
const drawSociology: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const centers: Array<[number, number]> = [[-r * 0.48, -r * 0.24], [r * 0.48, -r * 0.18], [0, r * 0.4]];
  const clusters: Array<Array<[number, number]>> = [];

  centers.forEach(([cx, cy], clusterIndex) => {
    const nodes: Array<[number, number]> = [[cx, cy]];
    for (let level = 0; level < 2; level++) {
      const count = 3 + level;
      const distance = r * (0.16 + level * 0.11) * (1.28 - focus * 0.36);
      for (let index = 0; index < count; index++) {
        const angle = (index / count) * Math.PI * 2 + clusterIndex * 0.85 + level * 0.38;
        const drift = (1 - focus) * r * 0.05 * Math.sin(time * 0.8 + index + variantSeed);
        nodes.push([cx + Math.cos(angle) * (distance + drift), cy + Math.sin(angle) * (distance + drift) * 0.72]);
      }
    }
    clusters.push(nodes);
    nodes.slice(1).forEach(([x, y], index) => {
      if (index < 3 || focus > 0.38) {
        path(ctx, [[cx, cy], [x, y]]);
        stroke(ctx, alpha(palette.primary, 0.16 + focus * 0.3), 1);
      }
    });
  });

  for (let index = 0; index < centers.length; index++) {
    const next = centers[(index + 1) % centers.length];
    path(ctx, [centers[index], next]);
    stroke(ctx, alpha(palette.secondary, 0.12 + focus * 0.42), 1.2);
  }
  clusters.flat().forEach(([x, y], index) => {
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x, y, r * (index % 8 === 0 ? 0.055 : 0.032), 0, 7);
    fill(ctx, alpha(index % 3 === 0 ? palette.secondary : palette.primary, 0.58 + focus * 0.28));
  });
});

// --- Neutro: rede genérica reservada apenas ao fallback desconhecido ---
const drawNeutral: CoreDrawFn = (input) => withFrame(input, (r, focus) => {
  const { ctx, palette, time, variantSeed } = input;
  const n = 5;
  const nodes: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + variantSeed;
    const radius = r * (0.54 + Math.sin(time + i) * (1 - focus) * 0.12);
    nodes.push([Math.cos(a) * radius, Math.sin(a) * radius * 0.7]);
  }
  path(ctx, nodes, true);
  stroke(ctx, alpha(palette.primary, 0.55));
  nodes.forEach(([x, y]) => {
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x, y, r * 0.05, 0, 7);
    fill(ctx, alpha(palette.secondary, 0.85));
  });
});

export const CORE_REGISTRY: Record<CoreType, CoreDrawFn> = {
  matematica_grid: drawMathematics,
  fisica_lentes: drawPhysics,
  quimica_rede: drawChemistry,
  biologia_helix: drawBiology,
  portugues_sintaxe: drawPortuguese,
  geografia_fluxos: drawGeography,
  historia_campos: drawHistory,
  ingles_contexto: drawEnglish,
  filosofia_dialetica: drawPhilosophy,
  sociologia_rede: drawSociology,
  default_neutro: drawNeutral,
};
