import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn';
import { useRafLoop } from '../hooks/useRafLoop';
import { getSubjectProfile, type CrivoPalette } from '../design-system/crivoSubjects';
import { CORE_REGISTRY, type CanvasContextLike } from '../design-system/crivoCoreRegistry';
import { drawExternalShell, drawCenterLight, drawScanSweep } from '../design-system/crivoCoreShell';
import { makeSpring, stepSpring, type Spring } from '../design-system/crivoSpring';
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

// The external shell's pose per state — shared "Crivo identity" language,
// the same across every matéria (only the internal artifact and palette
// carry subject identity). Faithful port of the approved reference's
// STATE_PARAMS/STATE_FOCUS_TARGET tables.
interface StatePose { spread: number; glow: number; tiltX: number; tiltY: number; scan: boolean }
const STATE_POSE: Record<CrivoCoreState, StatePose> = {
  idle: { spread: 0.34, glow: 0.3, tiltX: 9, tiltY: -13, scan: false },
  listening: { spread: 0.5, glow: 0.45, tiltX: 11, tiltY: 9, scan: false },
  analyzing: { spread: 0.88, glow: 0.62, tiltX: -7, tiltY: 22, scan: true },
  converging: { spread: 0.16, glow: 0.92, tiltX: 4, tiltY: -9, scan: false },
  ready: { spread: 0.32, glow: 0.55, tiltX: 6, tiltY: -16, scan: false },
  recalibrating: { spread: 1.1, glow: 0.7, tiltX: -11, tiltY: 15, scan: false },
};
// "focus" is the one scalar every matéria's Núcleo renderer keys off of —
// low while the engine is still scattering possibilities, high once it has
// converged on a legible recommendation.
const STATE_FOCUS: Record<CrivoCoreState, number> = {
  idle: 0.65,
  listening: 0.22,
  analyzing: 0.12,
  converging: 0.9,
  ready: 1.0,
  recalibrating: 0.05,
};

interface CoreSprings { spread: Spring; glow: Spring; tiltX: Spring; tiltY: Spring; focus: Spring }
function makeCoreSprings(state: CrivoCoreState): CoreSprings {
  const pose = STATE_POSE[state];
  return {
    spread: makeSpring(pose.spread),
    glow: makeSpring(pose.glow),
    tiltX: makeSpring(pose.tiltX),
    tiltY: makeSpring(pose.tiltY),
    focus: makeSpring(STATE_FOCUS[state]),
  };
}

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
 * Núcleo do Crivo — the app's signature object. A shared external shell
 * (three orbital rings + a small metallic mount, the constant "Crivo
 * identity") frames a per-matéria internal artifact drawn by the matéria's
 * own registered renderer (see crivoCoreRegistry.ts), all in Canvas 2D —
 * ported faithfully from the approved reference prototype, not a
 * simplification of it. `useReducedMotion` skips the animation loop
 * entirely and draws a single static frame instead of a loop that merely
 * draws nothing; a failed/unavailable 2D context falls back to a plain CSS
 * radial gradient — there is no dependency on 3D of any kind, so both paths
 * are real "no 3D" fallbacks, not just no-WebGL ones.
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

  const springsRef = useRef<CoreSprings>(makeCoreSprings(state));
  const elapsedRef = useRef(0);
  const scanAngleRef = useRef(0);
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

  const drawFrame = (springs: CoreSprings, palette: CrivoPalette, time: number) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, size, size);
    const shellCtx = ctx as unknown as CanvasContextLike;
    const cx = size / 2, cy = size / 2;
    const baseR = size * 0.3;
    const squashY = 1 - Math.min(0.5, Math.abs(springs.tiltX.x) / 40);
    const skewX = springs.tiltY.x / 90;
    const shellPose = { cx, cy, baseR, spread: springs.spread.x, glow: springs.glow.x, squashY, skewX };

    drawExternalShell(shellCtx, shellPose, palette);
    const drawFn = CORE_REGISTRY[profile.coreType] ?? CORE_REGISTRY.default_neutro;
    drawFn({ ctx: shellCtx, width: size, height: size, state: { focus: springs.focus.x }, palette, variantSeed, time, squashY, skewX });
    if (STATE_POSE[state].scan) drawScanSweep(shellCtx, cx, cy, baseR, scanAngleRef.current, palette);
    drawCenterLight(shellCtx, shellPose, palette);
  };

  useRafLoop(
    (dt) => {
      elapsedRef.current += dt;
      scanAngleRef.current += dt * 3.4;
      const springs = springsRef.current;
      const pose = STATE_POSE[state];
      const rk = profile.rhythm, rd = profile.damping;
      stepSpring(springs.spread, pose.spread, dt, 55 * rk, 11 * rd);
      stepSpring(springs.glow, pose.glow, dt, 60 * rk, 12 * rd);
      stepSpring(springs.tiltX, pose.tiltX, dt, 45 * rk, 10 * rd);
      stepSpring(springs.tiltY, pose.tiltY, dt, 45 * rk, 10 * rd);
      stepSpring(springs.focus, STATE_FOCUS[state], dt, 50 * rk, 11 * rd);

      let palette = profile.palette;
      if (needsMetamorphosis && !metamorphosisDoneRef.current && previousProfile) {
        metamorphosisElapsedRef.current += dt;
        const progress = Math.min(1, metamorphosisElapsedRef.current / MOTION_DURATION.subjectTween);
        palette = tweenPalette(previousProfile.palette, profile.palette, progress);
        if (progress >= 1) metamorphosisDoneRef.current = true;
      }

      drawFrame(springs, palette, elapsedRef.current);
    },
    { paused: reducedMotion || canvasFailed, target: wrapperNode }
  );

  // Reduced motion: exactly one frame, at the state's target pose, no tween, no loop.
  useEffect(() => {
    if (!reducedMotion || canvasFailed) return;
    const pose = STATE_POSE[state];
    const springs: CoreSprings = {
      spread: makeSpring(pose.spread),
      glow: makeSpring(pose.glow),
      tiltX: makeSpring(pose.tiltX),
      tiltY: makeSpring(pose.tiltY),
      focus: makeSpring(STATE_FOCUS[state]),
    };
    drawFrame(springs, profile.palette, 0);
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
