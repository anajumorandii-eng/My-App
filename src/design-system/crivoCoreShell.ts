import type { CrivoPalette } from './crivoSubjects';
import type { CanvasContextLike } from './crivoCoreRegistry';

export interface ShellPose {
  cx: number;
  cy: number;
  baseR: number;
  spread: number;
  glow: number;
  squashY: number;
  skewX: number;
}

interface GradientLike {
  addColorStop(offset: number, color: string): void;
}

function call<T>(ctx: CanvasContextLike, method: string, ...args: unknown[]): T | undefined {
  const fn = ctx[method];
  return typeof fn === 'function' ? (fn as (...values: unknown[]) => T).call(ctx, ...args) : undefined;
}
function invoke(ctx: CanvasContextLike, method: string, ...args: unknown[]) {
  call(ctx, method, ...args);
}
function set(ctx: CanvasContextLike, property: string, value: unknown) {
  ctx[property] = value;
}
function alpha(hex: string, opacity: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${opacity})`;
}
function withStops(gradient: GradientLike | undefined, stops: ReadonlyArray<readonly [number, string]>) {
  stops.forEach(([offset, color]) => gradient?.addColorStop(offset, color));
  return gradient;
}

/**
 * The shared "Crivo identity" shell every Núcleo sits inside, regardless of
 * matéria — three orbital rings plus a small metallic mount — drawn in
 * untransformed canvas space (each ring applies its own squash/skew so the
 * whole shell reads as one tilted object without a surrounding 3D scene).
 * Faithful port of the approved reference's drawExternalShell.
 */
export function drawExternalShell(ctx: CanvasContextLike, shell: ShellPose, palette: CrivoPalette) {
  const { cx, cy, baseR, spread, glow, squashY, skewX } = shell;
  const primary = palette.primary;

  const haloGrad = call<GradientLike>(ctx, 'createRadialGradient', cx, cy, 0, cx, cy, baseR * (1.6 + spread * 0.6));
  withStops(haloGrad, [
    [0, alpha(primary, 0.2 * glow)],
    [1, alpha(primary, 0)],
  ]);
  set(ctx, 'fillStyle', haloGrad);
  invoke(ctx, 'beginPath');
  invoke(ctx, 'arc', cx, cy, baseR * (1.7 + spread * 0.6), 0, 7);
  invoke(ctx, 'fill');

  for (let i = 0; i < 3; i++) {
    const ringR = baseR * (0.95 + i * 0.34) * (1 + spread * 0.45);
    invoke(ctx, 'save');
    invoke(ctx, 'translate', cx, cy);
    invoke(ctx, 'transform', 1, 0, skewX * 0.5, squashY, 0, 0);
    invoke(ctx, 'beginPath');
    invoke(ctx, 'ellipse', 0, 0, ringR, ringR * 0.4, 0, 0, Math.PI * 2);
    set(ctx, 'strokeStyle', i === 1 ? alpha(primary, 0.5) : 'rgba(210,225,218,0.13)');
    set(ctx, 'lineWidth', i === 1 ? 1.3 : 0.9);
    invoke(ctx, 'stroke');
    invoke(ctx, 'restore');
  }

  // metallic mount — the fixed "brand" piece every core is set into.
  invoke(ctx, 'save');
  invoke(ctx, 'translate', cx, cy);
  invoke(ctx, 'transform', 1, 0, skewX * 0.3, squashY, 0, 0);
  const mr = baseR * 0.13;
  invoke(ctx, 'beginPath');
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    invoke(ctx, i === 0 ? 'moveTo' : 'lineTo', Math.cos(a) * mr, Math.sin(a) * mr);
  }
  invoke(ctx, 'closePath');
  const mountGrad = call<GradientLike>(ctx, 'createLinearGradient', -mr, -mr, mr, mr);
  withStops(mountGrad, [
    [0, 'rgba(232,224,206,0.85)'],
    [1, alpha(primary, 0.45)],
  ]);
  set(ctx, 'fillStyle', mountGrad);
  invoke(ctx, 'fill');
  set(ctx, 'strokeStyle', 'rgba(255,255,255,0.45)');
  set(ctx, 'lineWidth', 0.8);
  invoke(ctx, 'stroke');
  invoke(ctx, 'restore');
}

/** The one thing every ring/artifact is arranged around. Faithful port of drawCenterLight. */
export function drawCenterLight(ctx: CanvasContextLike, shell: Pick<ShellPose, 'cx' | 'cy' | 'baseR' | 'glow'>, palette: CrivoPalette) {
  const { cx, cy, baseR, glow } = shell;
  const r = baseR * 0.045 * (0.7 + glow * 0.6);
  const emissive = alpha(palette.emissive, 0.95);
  const grad = call<GradientLike>(ctx, 'createRadialGradient', cx, cy, 0, cx, cy, r * 3.2);
  withStops(grad, [
    [0, emissive],
    [1, alpha(palette.primary, 0)],
  ]);
  set(ctx, 'fillStyle', grad);
  invoke(ctx, 'beginPath');
  invoke(ctx, 'arc', cx, cy, r * 3.2, 0, 7);
  invoke(ctx, 'fill');
  set(ctx, 'fillStyle', emissive);
  invoke(ctx, 'beginPath');
  invoke(ctx, 'arc', cx, cy, r, 0, 7);
  invoke(ctx, 'fill');
}

/** A conic sweep shown only during "analyzing" — the engine visibly scanning. Faithful port of drawScanSweep. */
export function drawScanSweep(ctx: CanvasContextLike, cx: number, cy: number, baseR: number, angle: number, palette: CrivoPalette) {
  invoke(ctx, 'save');
  set(ctx, 'globalCompositeOperation', 'lighter');
  const grad = call<GradientLike>(ctx, 'createConicGradient', angle, cx, cy);
  if (grad) {
    withStops(grad, [
      [0, alpha(palette.primary, 0)],
      [0.02, alpha(palette.primary, 0.35)],
      [0.06, alpha(palette.primary, 0)],
      [1, alpha(palette.primary, 0)],
    ]);
    set(ctx, 'fillStyle', grad);
    invoke(ctx, 'beginPath');
    invoke(ctx, 'arc', cx, cy, baseR * 1.6, 0, 7);
    invoke(ctx, 'fill');
  }
  invoke(ctx, 'restore');
}
