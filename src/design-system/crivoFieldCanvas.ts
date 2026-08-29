import type { CrivoPalette, FieldType } from './crivoSubjects';
import type { CanvasContextLike } from './crivoCoreRegistry';

export interface FieldDrawInput {
  ctx: CanvasContextLike;
  width: number;
  height: number;
  time: number;
  palette: CrivoPalette;
  focus: number;
}
export type FieldDrawFn = (input: FieldDrawInput) => void;

interface GradientLike {
  addColorStop(offset: number, color: string): void;
}
function call<T>(ctx: CanvasContextLike, method: string, ...args: unknown[]): T | undefined {
  const fn = ctx[method];
  return typeof fn === 'function' ? (fn as (...values: unknown[]) => T).call(ctx, ...args) : undefined;
}
const invoke = (ctx: CanvasContextLike, method: string, ...args: unknown[]) => { call(ctx, method, ...args); };
const set = (ctx: CanvasContextLike, property: string, value: unknown) => { ctx[property] = value; };
const alpha = (hex: string, opacity: number) => {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
};
function withStops(gradient: GradientLike | undefined, stops: ReadonlyArray<readonly [number, string]>) {
  stops.forEach(([offset, color]) => gradient?.addColorStop(offset, color));
  return gradient;
}

/**
 * The ambient "campo da matéria" — a full-bleed, low-opacity background
 * layer, one per matéria, reacting to the same `focus` scalar as the
 * Núcleo. Faithful port of the approved reference's drawField* functions,
 * behind a canvas instead of CSS so the motion (drifting molecules, waving
 * vector field, breathing topographic contours...) survives, not just the
 * color. `crivoFieldRegistry.ts`'s CSS gradients remain the fallback for
 * when canvas 2D itself is unavailable.
 */

const drawGrid: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette, focus }) => {
  const vpX = fw * 0.76, vpY = fh * 0.06;
  set(ctx, 'strokeStyle', alpha(palette.primary, 0.05 + 0.025 * focus)); set(ctx, 'lineWidth', 1);
  const cols = 16;
  for (let i = 0; i <= cols; i++) {
    const x = (i / cols) * fw * 1.1 - fw * 0.05;
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x, fh * 1.05); invoke(ctx, 'lineTo', vpX + (x - vpX) * 0.1, vpY); invoke(ctx, 'stroke');
  }
  const rows = 9;
  for (let j = 0; j <= rows; j++) {
    const p = j / rows, y = fh - p * p * fh * 0.98;
    invoke(ctx, 'beginPath');
    for (let i = 0; i <= cols; i++) {
      const x = (i / cols) * fw * 1.1 - fw * 0.05;
      const yy = y + (vpY - y) * Math.min(1, p * 0.4);
      invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', x, yy);
    }
    invoke(ctx, 'stroke');
  }
  const travel = Math.sin(t * 0.18) * 0.5 + 0.5;
  const mx = vpX + (fw * 0.2 - vpX) * travel, my = vpY + (fh * 0.9 - vpY) * travel;
  set(ctx, 'fillStyle', alpha(palette.primary, 0.14));
  invoke(ctx, 'beginPath'); invoke(ctx, 'arc', mx, my, 2.2, 0, 7); invoke(ctx, 'fill');
};

const drawVectors: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette, focus }) => {
  const cols = 9, rows = 6;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = ((i + 0.5) / cols) * fw, y = ((j + 0.5) / rows) * fh;
      const ang = Math.sin(x * 0.006 + t * 0.25) + Math.cos(y * 0.007 + t * 0.2);
      const len = 13 + 4 * Math.sin(i * 1.3 + j * 0.7 + t * 0.4);
      invoke(ctx, 'save'); invoke(ctx, 'translate', x, y); invoke(ctx, 'rotate', ang);
      set(ctx, 'strokeStyle', alpha(palette.primary, 0.045 + 0.03 * focus)); set(ctx, 'lineWidth', 1);
      invoke(ctx, 'beginPath');
      invoke(ctx, 'moveTo', -len, 0); invoke(ctx, 'lineTo', len, 0); invoke(ctx, 'lineTo', len - 5, -4);
      invoke(ctx, 'moveTo', len, 0); invoke(ctx, 'lineTo', len - 5, 4);
      invoke(ctx, 'stroke'); invoke(ctx, 'restore');
    }
  }
  for (let k = 0; k < 3; k++) {
    const py = fh * (0.2 + k * 0.3) + Math.sin(t * 0.3 + k) * fh * 0.05;
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.06)); set(ctx, 'lineWidth', 1.2);
    invoke(ctx, 'beginPath');
    for (let i = 0; i <= 20; i++) {
      const x = (i / 20) * fw, y = py + Math.sin(i * 0.6 + t * 0.5 + k * 2) * 22;
      invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', x, y);
    }
    invoke(ctx, 'stroke');
  }
};

const drawChamber: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette, focus }) => {
  const n = 14;
  for (let i = 0; i < n; i++) {
    const seed = i * 13.7;
    const x = ((Math.sin(seed) * 0.5 + 0.5) * 1.2 - 0.1) * fw + Math.sin(t * 0.4 + seed) * 10;
    const y = ((Math.cos(seed * 1.3) * 0.5 + 0.5) * 1.2 - 0.1) * fh + Math.cos(t * 0.35 + seed) * 10;
    const r = 5 + ((i * 7) % 5);
    const jitter = (1 - focus) * 3 * Math.sin(t * 1.2 + seed);
    set(ctx, 'fillStyle', alpha(palette.primary, 0.055));
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x + jitter, y, r, 0, 7); invoke(ctx, 'fill');
    invoke(ctx, 'beginPath'); invoke(ctx, 'arc', x + r * 1.6 + jitter, y + r * 0.3, r * 0.7, 0, 7); invoke(ctx, 'fill');
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.09)); set(ctx, 'lineWidth', 1);
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x + jitter, y); invoke(ctx, 'lineTo', x + r * 1.6 + jitter, y + r * 0.3); invoke(ctx, 'stroke');
  }
  const vignette = call<GradientLike>(ctx, 'createRadialGradient', fw * 0.5, fh * 0.5, 0, fw * 0.5, fh * 0.5, Math.max(fw, fh) * 0.7);
  withStops(vignette, [[0, 'rgba(0,0,0,0)'], [1, alpha(palette.primary, 0.05)]]);
  set(ctx, 'fillStyle', vignette); invoke(ctx, 'fillRect', 0, 0, fw, fh);
};

function branchRec(ctx: CanvasContextLike, x: number, y: number, ang: number, len: number, depth: number, t: number, color: string, seed: number) {
  if (depth <= 0 || len < 3) return;
  const x2 = x + Math.cos(ang) * len, y2 = y + Math.sin(ang) * len;
  set(ctx, 'strokeStyle', alpha(color, 0.05 + 0.02 * depth)); set(ctx, 'lineWidth', depth * 0.6);
  invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x, y); invoke(ctx, 'lineTo', x2, y2); invoke(ctx, 'stroke');
  const wobble = Math.sin(t * 0.6 + seed) * 0.25;
  branchRec(ctx, x2, y2, ang - 0.45 + wobble, len * 0.72, depth - 1, t, color, seed * 1.3 + 1);
  branchRec(ctx, x2, y2, ang + 0.45 + wobble, len * 0.72, depth - 1, t, color, seed * 1.7 + 2);
}
const drawOrganic: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette, focus }) => {
  const roots: Array<[number, number, number]> = [
    [fw * 0.08, fh * 1.02, -1.25],
    [fw * 0.95, fh * 1.05, -1.95],
    [fw * 0.5, -fh * 0.05, 1.6],
  ];
  roots.forEach(([x, y, ang], i) => branchRec(ctx, x, y, ang, 90 + focus * 20, 5, t, palette.primary, i * 7.3));
};

const drawSyntax: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette, focus }) => {
  const rows = 12;
  set(ctx, 'strokeStyle', alpha(palette.primary, 0.05)); set(ctx, 'lineWidth', 1);
  for (let j = 0; j < rows; j++) {
    const y = ((j + 0.5) / rows) * fh;
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', 0, y); invoke(ctx, 'lineTo', fw, y); invoke(ctx, 'stroke');
  }
  const n = 7;
  for (let i = 0; i < n; i++) {
    const seed = i * 5.1;
    const x = ((i + 0.5) / n) * fw + Math.sin(t * 0.3 + seed) * 14;
    const y = fh * (0.15 + 0.7 * (Math.sin(seed * 2) * 0.5 + 0.5));
    const w = 22 + 10 * focus;
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.1)); set(ctx, 'lineWidth', 1.4);
    invoke(ctx, 'beginPath');
    invoke(ctx, 'moveTo', x - w, y - 8); invoke(ctx, 'lineTo', x - w, y + 8); invoke(ctx, 'moveTo', x - w, y); invoke(ctx, 'lineTo', x - w + 5, y);
    invoke(ctx, 'stroke');
    invoke(ctx, 'beginPath');
    invoke(ctx, 'moveTo', x + w, y - 8); invoke(ctx, 'lineTo', x + w, y + 8); invoke(ctx, 'moveTo', x + w, y); invoke(ctx, 'lineTo', x + w - 5, y);
    invoke(ctx, 'stroke');
  }
};

const drawTopography: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette }) => {
  for (let ring = 0; ring < 7; ring++) {
    const rr = 40 + ring * 46;
    invoke(ctx, 'beginPath');
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const wob = 1 + 0.08 * Math.sin(a * 5 + ring * 1.3 + t * 0.15);
      const x = fw * 0.5 + Math.cos(a) * rr * wob * 1.3, y = fh * 0.55 + Math.sin(a) * rr * wob * 0.62;
      invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', x, y);
    }
    invoke(ctx, 'closePath');
    set(ctx, 'strokeStyle', alpha(palette.primary, 0.045 + 0.008 * ring)); set(ctx, 'lineWidth', 1); invoke(ctx, 'stroke');
  }
  set(ctx, 'strokeStyle', alpha(palette.primary, 0.08)); set(ctx, 'lineWidth', 1);
  for (let i = 0; i < 12; i++) {
    const x = (i / 12) * fw;
    invoke(ctx, 'beginPath'); invoke(ctx, 'moveTo', x, 0); invoke(ctx, 'lineTo', x, 10);
    invoke(ctx, 'moveTo', x, fh - 10); invoke(ctx, 'lineTo', x, fh); invoke(ctx, 'stroke');
  }
};

const COUNTER_TONE = '#7B96A8'; // fixed cool counter-tone: história's "other side" — not palette-driven, same as the reference
const drawPaired: FieldDrawFn = ({ ctx, width: fw, height: fh, time: t, palette, focus }) => {
  const tension = (1 - focus) * fh * 0.09;
  const g1 = call<GradientLike>(ctx, 'createLinearGradient', 0, 0, fw * 0.6, 0);
  withStops(g1, [[0, alpha(palette.primary, 0.09)], [1, 'rgba(0,0,0,0)']]);
  set(ctx, 'fillStyle', g1); invoke(ctx, 'fillRect', 0, 0, fw * 0.62, fh);
  const g2 = call<GradientLike>(ctx, 'createLinearGradient', fw, 0, fw * 0.4, 0);
  withStops(g2, [[0, alpha(COUNTER_TONE, 0.09)], [1, 'rgba(0,0,0,0)']]);
  set(ctx, 'fillStyle', g2); invoke(ctx, 'fillRect', fw * 0.38, 0, fw * 0.62, fh);
  set(ctx, 'strokeStyle', 'rgba(200,200,200,0.09)'); set(ctx, 'lineWidth', 1.4);
  invoke(ctx, 'beginPath');
  for (let i = 0; i <= 30; i++) {
    const py = (i / 30) * fh;
    const x = fw * 0.5 + Math.sin(py * 0.02 + t * 0.4) * tension;
    invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', x, py);
  }
  invoke(ctx, 'stroke');
};

/** Inglês/Filosofia/Sociologia — no approved field, just a faint static vignette. */
const drawNeutralField: FieldDrawFn = ({ ctx, width: fw, height: fh, palette }) => {
  const vignette = call<GradientLike>(ctx, 'createRadialGradient', fw * 0.5, fh * 0.5, 0, fw * 0.5, fh * 0.5, Math.max(fw, fh) * 0.7);
  withStops(vignette, [[0, alpha(palette.primary, 0.03)], [1, 'rgba(0,0,0,0)']]);
  set(ctx, 'fillStyle', vignette); invoke(ctx, 'fillRect', 0, 0, fw, fh);
};

export const FIELD_CANVAS_REGISTRY: Record<FieldType, FieldDrawFn> = {
  grid: drawGrid,
  lenses: drawVectors,
  chamber: drawChamber,
  organic: drawOrganic,
  syntax: drawSyntax,
  topography: drawTopography,
  paired: drawPaired,
  neutral: drawNeutralField,
};
