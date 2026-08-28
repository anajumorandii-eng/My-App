import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/cn';
import { useRafLoop } from '../../../hooks/useRafLoop';
import { getSubjectProfile, PALETTE_TOKENS, type CrivoPalette } from '../../../design-system/crivoSubjects';
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

function applyPaletteVars(node: HTMLDivElement, palette: CrivoPalette) {
  for (const token of PALETTE_TOKENS) node.style.setProperty(`--subject-${token}`, palette[token]);
}

/**
 * Wraps the Hoje screen's own rendered content (header, context chips, empty
 * states, TodayFocus, secondary lists) with a decorative, per-matéria
 * backdrop — the "campo da matéria" — an animated Canvas 2D layer faithfully
 * ported from the approved reference (drifting molecules, a waving vector
 * field, breathing topographic contours...), falling back to a plain CSS
 * gradient if canvas 2D itself is unavailable. The palette is also exposed
 * as CSS custom properties local to this wrapper only (never :root/<html>),
 * so it can't bleed into the nav rail or any other route. Unlike CrivoCore,
 * this component is never remounted by a `key` when the recommendation
 * changes, so it tracks its own previous matéria via a ref and tweens across it.
 */
export function SubjectAtmosphere({ subject, className, children }: SubjectAtmosphereProps) {
  const reducedMotion = useReducedMotion();
  const [wrapperNode, setWrapperNode] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const profile = useMemo(() => getSubjectProfile(subject), [subject]);

  const previousProfileRef = useRef(profile);
  const elapsedRef = useRef(0);
  const [isTweening, setIsTweening] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('CanvasRenderingContext2D unavailable');
      ctxRef.current = ctx;
    } catch {
      setCanvasFailed(true);
    }
  }, []);

  // Backing-store resolution tracks the wrapper's own box (full-bleed, not a fixed size like the Núcleo icon).
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !wrapperNode || canvasFailed) return;
    const resize = () => {
      const rect = wrapperNode.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrapperNode);
    return () => observer.disconnect();
  }, [wrapperNode, canvasFailed]);

  const drawField = (palette: CrivoPalette, time: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.width / dpr, height = canvas.height / dpr;
    ctx.clearRect(0, 0, width, height);
    const drawFn = FIELD_CANVAS_REGISTRY[profile.fieldType] ?? FIELD_CANVAS_REGISTRY.neutral;
    drawFn({ ctx: ctx as unknown as CanvasContextLike, width, height, time, palette, focus: FIELD_FOCUS });
  };

  // First paint: apply directly, no tween — there's no "previous" atmosphere yet.
  useLayoutEffect(() => {
    if (!wrapperNode) return;
    applyPaletteVars(wrapperNode, profile.palette);
    wrapperNode.style.setProperty('--subject-field-css', FIELD_REGISTRY[profile.fieldType](profile.palette));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; later subject changes go through the effect below
  }, [wrapperNode]);

  useEffect(() => {
    if (previousProfileRef.current.key === profile.key) return;
    if (reducedMotion || !wrapperNode) {
      previousProfileRef.current = profile;
      if (wrapperNode) {
        applyPaletteVars(wrapperNode, profile.palette);
        wrapperNode.style.setProperty('--subject-field-css', FIELD_REGISTRY[profile.fieldType](profile.palette));
      }
      setIsTweening(false);
      return;
    }
    elapsedRef.current = 0;
    setIsTweening(true);
  }, [profile, reducedMotion, wrapperNode]);

  useRafLoop(
    (dt) => {
      elapsedRef.current += dt;
      let palette = profile.palette;
      if (isTweening) {
        const progress = Math.min(1, elapsedRef.current / MOTION_DURATION.subjectTween);
        palette = tweenPalette(previousProfileRef.current.palette, profile.palette, progress);
        if (wrapperNode) {
          applyPaletteVars(wrapperNode, palette);
          wrapperNode.style.setProperty('--subject-field-css', FIELD_REGISTRY[profile.fieldType](palette));
        }
        if (progress >= 1) {
          previousProfileRef.current = profile;
          setIsTweening(false);
        }
      }
      if (!canvasFailed) drawField(palette, elapsedRef.current);
    },
    { paused: reducedMotion || canvasFailed, target: wrapperNode }
  );

  // Reduced motion: one static field frame, no continuous drift/waving.
  useEffect(() => {
    if (!reducedMotion || canvasFailed) return;
    drawField(profile.palette, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- drawField closes over refs already listed
  }, [reducedMotion, canvasFailed, profile]);

  return (
    <div ref={setWrapperNode} className={cn('relative', className)}>
      {canvasFailed ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'var(--subject-field-css)', opacity: 0.16 }}
        />
      ) : (
        <canvas aria-hidden="true" ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 w-full h-full" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
