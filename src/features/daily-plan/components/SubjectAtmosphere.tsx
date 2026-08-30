import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/cn';
import { useRafLoop } from '../../../hooks/useRafLoop';
import {
  getSubjectPalette,
  getSubjectProfile,
  PALETTE_TOKENS,
  type CrivoPalette,
  type PaletteToken,
  type SubjectProfile,
  type SubjectTheme,
} from '../../../design-system/crivoSubjects';
import { FIELD_REGISTRY } from '../../../design-system/crivoFieldRegistry';
import { FIELD_CANVAS_REGISTRY } from '../../../design-system/crivoFieldCanvas';
import type { CanvasContextLike } from '../../../design-system/crivoCoreRegistry';
import { tweenPalette } from '../../../design-system/crivoPaletteTween';
import { MOTION_DURATION } from '../../../design-system/motion/tokens';

export interface SubjectAtmosphereProps {
  /** Today's primary recommendation's matéria. Omitted (loading/empty states) renders the neutral default. */
  subject?: string;
  className?: string;
  children: React.ReactNode;
}

// The ambient field, at rest, reads as "a settled recommendation" most of
// the time this wraps content — it isn't wired to the Núcleo's own focus
// spring (a separate component/instance), so it uses a fixed, mostly-resolved
// value rather than nothing, matching how the page reads the rest of the day.
const FIELD_FOCUS = 0.82;

const PALETTE_CSS_TOKEN: Record<PaletteToken, string> = {
  bg: 'bg',
  surface: 'surface',
  primary: 'primary',
  secondary: 'secondary',
  emissive: 'emissive',
  textHighlight: 'text-highlight',
  dataPositive: 'data-positive',
  dataWarning: 'data-warning',
  atmoA: 'atmo-a',
  atmoB: 'atmo-b',
};

function applyProfileVars(node: HTMLDivElement, profile: SubjectProfile) {
  for (const theme of ['light', 'dark'] as const satisfies readonly SubjectTheme[]) {
    const palette = getSubjectPalette(profile, theme);
    for (const token of PALETTE_TOKENS) {
      node.style.setProperty(`--subject-${theme}-${PALETTE_CSS_TOKEN[token]}`, palette[token]);
    }
    node.style.setProperty(`--subject-${theme}-field-css`, FIELD_REGISTRY[profile.fieldType](palette));
  }
}

function resolvedCanvasColor(value: string): string {
  const color = value.trim();
  return /^#[\dA-F]{8}$/i.test(color) ? color.slice(0, 7) : color;
}

function readResolvedPalette(node: HTMLDivElement): CrivoPalette | null {
  const styles = getComputedStyle(node);
  const entries = PALETTE_TOKENS.map((token) => [
    token,
    resolvedCanvasColor(styles.getPropertyValue(`--subject-${PALETTE_CSS_TOKEN[token]}`)),
  ] as const);
  return entries.every(([, value]) => value !== '' && !value.includes('var('))
    ? Object.fromEntries(entries) as CrivoPalette
    : null;
}

function palettesMatch(left: CrivoPalette | null, right: CrivoPalette | null): boolean {
  return !!left && !!right && PALETTE_TOKENS.every((token) => left[token] === right[token]);
}

/**
 * Wraps the Hoje screen's rendered content with a local, full-bleed
 * per-matéria field. CSS always paints the static field and selects the
 * active light/dark translation. Canvas reads those resolved CSS values and
 * adds the registered geometry and motion without owning a second theme
 * source. The wrapper stays mounted across recommendation changes, so it can
 * retain the prior subject palette and tween to the next one.
 */
export function SubjectAtmosphere({ subject, className, children }: SubjectAtmosphereProps) {
  const reducedMotion = useReducedMotion();
  const [wrapperNode, setWrapperNode] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const profile = useMemo(() => getSubjectProfile(subject), [subject]);

  const previousProfileRef = useRef(profile);
  const elapsedRef = useRef(0);
  const tweenElapsedRef = useRef(0);
  const currentPaletteRef = useRef<CrivoPalette | null>(null);
  const targetPaletteRef = useRef<CrivoPalette | null>(null);
  const tweenFromPaletteRef = useRef<CrivoPalette | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('CanvasRenderingContext2D unavailable');
      ctxRef.current = ctx;
      setCanvasReady(true);
    } catch {
      setCanvasFailed(true);
    }
  }, []);

  function drawField(palette: CrivoPalette, time: number) {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    ctx.clearRect(0, 0, width, height);
    const drawFn = FIELD_CANVAS_REGISTRY[profile.fieldType] ?? FIELD_CANVAS_REGISTRY.neutral;
    drawFn({
      ctx: ctx as unknown as CanvasContextLike,
      width,
      height,
      time: time * profile.rhythm,
      palette,
      focus: FIELD_FOCUS,
    });
  }

  // Backing-store resolution tracks the wrapper's own full-bleed box and is
  // clamped to DPR 2 so the environmental field cannot grow without bound.
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !wrapperNode || canvasFailed) return;
    const resize = () => {
      const rect = wrapperNode.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reducedMotion) {
        const resolved = readResolvedPalette(wrapperNode);
        if (!resolved) return;
        currentPaletteRef.current = resolved;
        targetPaletteRef.current = resolved;
        tweenFromPaletteRef.current = null;
        drawField(resolved, 0);
      }
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapperNode);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- drawField reads the current profile and Canvas refs
  }, [wrapperNode, canvasFailed, reducedMotion, profile]);

  // Both translations live locally. CSS remains the sole theme selector;
  // Canvas reads the resolved aliases instead of checking a React theme prop.
  useLayoutEffect(() => {
    if (!wrapperNode) return;
    const subjectChanged = previousProfileRef.current.key !== profile.key;
    applyProfileVars(wrapperNode, profile);
    const resolved = readResolvedPalette(wrapperNode);
    if (!resolved) return;

    if (reducedMotion || !currentPaletteRef.current) {
      currentPaletteRef.current = resolved;
      targetPaletteRef.current = resolved;
      tweenFromPaletteRef.current = null;
    } else if (subjectChanged && !palettesMatch(targetPaletteRef.current, resolved)) {
      tweenFromPaletteRef.current = currentPaletteRef.current;
      targetPaletteRef.current = resolved;
      tweenElapsedRef.current = 0;
    }
    previousProfileRef.current = profile;
  }, [profile, reducedMotion, wrapperNode]);

  useRafLoop(
    (dt) => {
      elapsedRef.current += dt;
      if (!wrapperNode) return;
      const resolved = readResolvedPalette(wrapperNode);
      if (!resolved) return;

      if (!currentPaletteRef.current) currentPaletteRef.current = resolved;
      if (!targetPaletteRef.current) targetPaletteRef.current = resolved;
      if (!palettesMatch(targetPaletteRef.current, resolved)) {
        tweenFromPaletteRef.current = currentPaletteRef.current;
        targetPaletteRef.current = resolved;
        tweenElapsedRef.current = 0;
      }

      const from = tweenFromPaletteRef.current;
      const target = targetPaletteRef.current;
      if (from && target) {
        tweenElapsedRef.current += dt;
        const progress = Math.min(1, tweenElapsedRef.current / MOTION_DURATION.subjectTween);
        currentPaletteRef.current = tweenPalette(from, target, progress);
        if (progress >= 1) tweenFromPaletteRef.current = null;
      } else {
        currentPaletteRef.current = resolved;
      }

      if (!canvasFailed && currentPaletteRef.current) drawField(currentPaletteRef.current, elapsedRef.current);
    },
    { paused: reducedMotion || canvasFailed, target: wrapperNode }
  );

  // Reduced motion keeps no loop. It observes the existing theme class only
  // to replace the static frame when the resolved CSS palette changes.
  useEffect(() => {
    if (!reducedMotion || canvasFailed || !canvasReady || !wrapperNode) return;
    const drawResolvedField = () => {
      const resolved = readResolvedPalette(wrapperNode);
      if (!resolved) return;
      currentPaletteRef.current = resolved;
      targetPaletteRef.current = resolved;
      tweenFromPaletteRef.current = null;
      drawField(resolved, 0);
    };
    drawResolvedField();
    const observer = new MutationObserver(drawResolvedField);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- drawField resolves the current profile and Canvas refs
  }, [reducedMotion, canvasFailed, canvasReady, profile, wrapperNode]);

  return (
    <div
      ref={setWrapperNode}
      data-testid="subject-atmosphere"
      data-subject={profile.key}
      className={cn('relative isolate overflow-hidden bg-[var(--subject-bg)] text-[var(--subject-text-highlight)]', className)}
      style={{ backgroundColor: 'var(--subject-bg)' }}
    >
      <canvas aria-hidden="true" ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[var(--subject-field-css)] opacity-30 mix-blend-screen"
        style={{ background: 'var(--subject-field-css)' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
