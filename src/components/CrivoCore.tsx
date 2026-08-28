import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn';
import { useRafLoop } from '../hooks/useRafLoop';
import { getSubjectProfile, type CrivoPalette } from '../design-system/crivoSubjects';
import { CORE_REGISTRY, type CanvasContextLike } from '../design-system/crivoCoreRegistry';
import { makeSpring, stepSpring } from '../design-system/crivoSpring';
import { tweenPalette } from '../design-system/crivoPaletteTween';
import { topicVariantSeed } from '../design-system/crivoTopicVariant';
import { MOTION_DURATION } from '../design-system/motion/tokens';

export type CrivoCoreState = 'idle' | 'listening' | 'analyzing' | 'converging' | 'ready' | 'recalibrating';

const STATE_LABEL: Record<CrivoCoreState, string> = {
  idle: 'Em espera',
  listening: 'Lendo seu histórico',
  analyzing: 'Calculando prioridades',
  converging: 'Convergindo para uma recomendação',
  ready: 'Recomendação pronta',
  recalibrating: 'Recalculando com sua resposta',
};

// "focus" is the one scalar every matéria's Núcleo renderer keys off of —
// low while the engine is still scattering possibilities, high once it has
// converged on a legible recommendation. The spring below eases toward
// whichever value the current state targets, at a rate set by the matéria's
// own rhythm/damping (its "law of motion"), not a single shared curve.
const STATE_FOCUS: Record<CrivoCoreState, number> = {
  idle: 0.5,
  listening: 0.2,
  analyzing: 0.1,
  converging: 0.6,
  ready: 1,
  recalibrating: 0.35,
};

const SPRING_STIFFNESS = 70;
const SPRING_DAMPING = 13;

export interface CrivoCoreProps {
  state: CrivoCoreState;
  className?: string;
  size?: number;
  /** The recommendation's matéria — selects the palette, core geometry and law of motion. Omitted (e.g. the loading skeleton, before any recommendation resolves) renders the neutral default profile. */
  subject?: string;
  /** The matéria the *previous* recommendation had, if this is a genuine day-over-day change — drives the metamorphosis tween instead of an instant recolor. */
  previousSubject?: string;
  /** Used to derive a small, deterministic per-topic variation of the matéria's shared core — never randomized, so the same topic always renders the same way. */
  topicId?: string;
}

/**
 * Núcleo do Crivo — the app's signature object. Canvas 2D, one instance,
 * redrawn every frame by the matéria's own registered artifact (see
 * crivoCoreRegistry.ts) rather than three generic CSS rings. `useReducedMotion`
 * skips the animation loop entirely and draws a single static frame instead
 * of a loop that merely draws nothing; a failed/unavailable 2D context falls
 * back to a plain CSS radial gradient — there is no dependency on 3D of any
 * kind, so both paths are real "no 3D" fallbacks, not just no-WebGL ones.
 */
export function CrivoCore({ state, className, size = 96, subject, previousSubject, topicId }: CrivoCoreProps) {
  const reducedMotion = useReducedMotion();
  const [wrapperNode, setWrapperNode] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);

  const profile = useMemo(() => getSubjectProfile(subject), [subject]);
  const previousProfile = useMemo(() => (previousSubject ? getSubjectProfile(previousSubject) : null), [previousSubject]);
  const variantSeed = useMemo(() => (topicId ? topicVariantSeed(topicId) : 0), [topicId]);

  // A metamorphosis only makes sense once, for the matéria this instance was
  // mounted with — CrivoCore is remounted per new recommendation (the parent
  // keys it by action id), so there's no "previous subject" to discover from
  // its own prior render; it has to arrive as a prop instead.
  const needsMetamorphosis = useMemo(
    () => !reducedMotion && !!previousProfile && previousProfile.coreType !== profile.coreType,
    [reducedMotion, previousProfile, profile]
  );

  const springRef = useRef(makeSpring(STATE_FOCUS[state]));
  const elapsedRef = useRef(0);
  const metamorphosisElapsedRef = useRef(0);
  const metamorphosisDoneRef = useRef(!needsMetamorphosis);

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

  // Backing-store resolution — before paint, so there's no visible flash at the wrong size.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [size, canvasFailed]);

  const drawFrame = (focus: number, palette: CrivoPalette, time: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    const drawFn = CORE_REGISTRY[profile.coreType] ?? CORE_REGISTRY.default_neutro;
    // CanvasContextLike is a deliberately duck-typed interface (see
    // crivoCoreRegistry.ts) so the draw functions can be unit-tested with a
    // plain fake — a real 2D context satisfies it structurally but has no
    // literal string index signature, which TS won't infer on its own.
    drawFn({ ctx: ctx as unknown as CanvasContextLike, width: size, height: size, state: { focus }, palette, variantSeed, time });
  };

  useRafLoop(
    (dt) => {
      elapsedRef.current += dt;
      const focus = stepSpring(
        springRef.current,
        STATE_FOCUS[state],
        dt,
        SPRING_STIFFNESS * profile.rhythm,
        SPRING_DAMPING * profile.damping
      );

      let palette = profile.palette;
      if (needsMetamorphosis && !metamorphosisDoneRef.current && previousProfile) {
        metamorphosisElapsedRef.current += dt;
        const progress = Math.min(1, metamorphosisElapsedRef.current / MOTION_DURATION.subjectTween);
        palette = tweenPalette(previousProfile.palette, profile.palette, progress);
        if (progress >= 1) metamorphosisDoneRef.current = true;
      }

      drawFrame(focus, palette, elapsedRef.current);
    },
    { paused: reducedMotion || canvasFailed, target: wrapperNode }
  );

  // Reduced motion: exactly one frame, at the state's target pose, no tween.
  useEffect(() => {
    if (!reducedMotion || canvasFailed) return;
    drawFrame(STATE_FOCUS[state], profile.palette, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- drawFrame closes over refs/size/variantSeed already listed
  }, [reducedMotion, canvasFailed, state, profile, size, variantSeed]);

  const ariaLabel = subject && !profile.isFallback ? `${STATE_LABEL[state]} — ${profile.label}` : STATE_LABEL[state];

  return (
    <div
      ref={setWrapperNode}
      role="img"
      aria-label={ariaLabel}
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size }}
    >
      {canvasFailed ? (
        <div
          className="w-full h-full rounded-full"
          style={{ background: `radial-gradient(circle at 35% 30%, ${profile.palette.emissive}, ${profile.palette.primary} 75%)` }}
        />
      ) : (
        <canvas ref={canvasRef} style={{ width: size, height: size, display: 'block' }} />
      )}
    </div>
  );
}
