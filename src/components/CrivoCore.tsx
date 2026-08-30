import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../lib/cn';
import { useRafLoop } from '../hooks/useRafLoop';
import { getSubjectPalette, getSubjectProfile, PALETTE_TOKENS, type CrivoPalette, type PaletteToken } from '../design-system/crivoSubjects';
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

const PALETTE_CSS_TOKEN: Record<PaletteToken, string> = {
  bg: 'bg', surface: 'surface', primary: 'primary', secondary: 'secondary', emissive: 'emissive',
  textHighlight: 'text-highlight', textAccent: 'text-accent', focusAccent: 'focus-accent',
  dataPositive: 'data-positive', dataWarning: 'data-warning', atmoA: 'atmo-a', atmoB: 'atmo-b',
};

function readInheritedPalette(node: HTMLElement): CrivoPalette | null {
  const styles = getComputedStyle(node);
  const entries = PALETTE_TOKENS.map((token) => [
    token,
    styles.getPropertyValue(`--subject-${PALETTE_CSS_TOKEN[token]}`).trim().replace(/^#[\dA-F]{6}([\dA-F]{2})$/i, (value) => value.slice(0, 7)),
  ] as const);
  return entries.every(([, value]) => value !== '' && !value.includes('var('))
    ? Object.fromEntries(entries) as CrivoPalette
    : null;
}

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
  size?: number | 'fill';
  scale?: 'icon' | 'hero';
  /** The recommendation's matéria — selects the palette, core geometry and law of motion. Omitted (e.g. the loading skeleton, before any recommendation resolves) renders the neutral default profile. */
  subject?: string;
  /** The matéria the *previous* recommendation had, if this is a genuine day-over-day change — drives the metamorphosis tween instead of an instant recolor. */
  previousSubject?: string;
  /** Used to derive a small, deterministic per-topic variation of the matéria's shared core — never randomized, so the same topic always renders the same way. */
  topicId?: string;
  /** Omits the state label when the Núcleo only provides visual atmosphere. */
  decorative?: boolean;
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
export function CrivoCore({
  state,
  className,
  size = 96,
  scale = 'icon',
  subject,
  previousSubject,
  topicId,
  decorative = false,
}: CrivoCoreProps) {
  const reducedMotion = useReducedMotion();
  const [wrapperNode, setWrapperNode] = useState<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasSize, setCanvasSize] = useState(() => (typeof size === 'number' ? size : 0));
  const [renderedPrimary, setRenderedPrimary] = useState('');

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

  // Context and backing-store resolution happen together before paint, so the
  // first frame never uses a stale canvas size. A fluid Núcleo measures its
  // wrapper and stays square as the hero surface changes size.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !wrapperNode || canvasFailed) return;

    let ctx = ctxRef.current;
    try {
      if (!ctx) {
        ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('CanvasRenderingContext2D unavailable');
        ctxRef.current = ctx;
        setCanvasReady(true);
      }
    } catch {
      setCanvasFailed(true);
      return;
    }

    const resizeCanvas = (rect: DOMRect | DOMRectReadOnly) => {
      const nextSize = size === 'fill' ? Math.min(rect.width, rect.height) : size;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(nextSize * dpr);
      canvas.height = Math.round(nextSize * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setCanvasSize((currentSize) => (currentSize === nextSize ? currentSize : nextSize));
    };

    resizeCanvas(wrapperNode.getBoundingClientRect());
    if (size !== 'fill' || typeof ResizeObserver === 'undefined') return;

    try {
      const resizeObserver = new ResizeObserver(([entry]) => resizeCanvas(entry.contentRect));
      resizeObserver.observe(wrapperNode);
      return () => resizeObserver.disconnect();
    } catch {
      // The initial measurement above remains a usable static surface when
      // observation is unavailable in an older or constrained browser.
      return;
    }
  }, [size, wrapperNode, canvasFailed]);

  const drawFrame = (springs: CoreSprings, palette: CrivoPalette, time: number, morphProgress = 1) => {
    const ctx = ctxRef.current;
    if (!ctx || canvasSize <= 0) return;
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    const shellCtx = ctx as unknown as CanvasContextLike;
    const cx = canvasSize / 2, cy = canvasSize / 2;
    const baseR = canvasSize * 0.3;
    const squashY = 1 - Math.min(0.5, Math.abs(springs.tiltX.x) / 40);
    const skewX = springs.tiltY.x / 90;
    const shellPose = { cx, cy, baseR, spread: springs.spread.x, glow: springs.glow.x, squashY, skewX };

    drawExternalShell(shellCtx, shellPose, palette);
    const drawGeometry = (coreType: typeof profile.coreType, opacity: number) => {
      if (opacity <= 0) return;
      ctx.save();
      ctx.globalAlpha = opacity;
      const drawFn = CORE_REGISTRY[coreType] ?? CORE_REGISTRY.default_neutro;
      drawFn({ ctx: shellCtx, width: canvasSize, height: canvasSize, state: { focus: springs.focus.x }, palette, variantSeed, time, squashY, skewX });
      ctx.restore();
    };
    if (needsMetamorphosis && previousProfile && morphProgress < 1) {
      drawGeometry(previousProfile.coreType, 1 - morphProgress);
      drawGeometry(profile.coreType, morphProgress);
    } else {
      drawGeometry(profile.coreType, 1);
    }
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

      const resolvedPalette = wrapperNode ? readInheritedPalette(wrapperNode) : null;
      const activeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      let palette = resolvedPalette ?? getSubjectPalette(profile, activeTheme);
      let morphProgress = 1;
      if (needsMetamorphosis && !metamorphosisDoneRef.current && previousProfile) {
        metamorphosisElapsedRef.current += dt;
        const progress = Math.min(1, metamorphosisElapsedRef.current / MOTION_DURATION.subjectTween);
        palette = tweenPalette(getSubjectPalette(previousProfile, activeTheme), palette, progress);
        morphProgress = progress;
        if (progress >= 1) metamorphosisDoneRef.current = true;
      }

      setRenderedPrimary((current) => current === palette.primary ? current : palette.primary);
      drawFrame(springs, palette, elapsedRef.current, morphProgress);
    },
    { paused: reducedMotion || canvasFailed, target: wrapperNode }
  );

  // Reduced motion: exactly one frame, at the state's target pose, no tween, no loop.
  useLayoutEffect(() => {
    if (!reducedMotion || canvasFailed || !canvasReady || canvasSize <= 0) return;
    const pose = STATE_POSE[state];
    const springs: CoreSprings = {
      spread: makeSpring(pose.spread),
      glow: makeSpring(pose.glow),
      tiltX: makeSpring(pose.tiltX),
      tiltY: makeSpring(pose.tiltY),
      focus: makeSpring(STATE_FOCUS[state]),
    };
    const drawResolvedCore = () => {
      const activeTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      const palette = wrapperNode ? readInheritedPalette(wrapperNode) ?? getSubjectPalette(profile, activeTheme) : getSubjectPalette(profile, activeTheme);
      setRenderedPrimary(palette.primary);
      drawFrame(springs, palette, 0);
    };
    drawResolvedCore();
    const observer = new MutationObserver(drawResolvedCore);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- drawFrame closes over refs/size/variantSeed already listed
  }, [reducedMotion, canvasFailed, canvasReady, state, profile, canvasSize, variantSeed, wrapperNode]);

  const ariaLabel = subject && !profile.isFallback ? `${STATE_LABEL[state]} — ${profile.label}` : STATE_LABEL[state];
  return (
    <div
      ref={setWrapperNode}
      {...(!decorative && { role: 'img', 'aria-label': ariaLabel })}
      data-testid="crivo-core"
      data-scale={scale}
      data-morphing={needsMetamorphosis && !metamorphosisDoneRef.current && previousProfile ? `${previousProfile.coreType}→${profile.coreType}` : undefined}
      data-rendered-primary={renderedPrimary || undefined}
      data-motion-active={!reducedMotion && !canvasFailed && canvasReady && canvasSize > 0 && state !== 'ready' ? 'true' : undefined}
      className={cn('relative shrink-0', className)}
      style={size === 'fill'
        ? { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }
        : { width: size, height: size }}
    >
      {canvasFailed ? (
        <div
          data-testid="crivo-core-fallback"
          data-static-artifact="orbital"
          className="relative w-full h-full overflow-hidden rounded-full"
          style={{
            background: 'radial-gradient(circle at 52% 48%, var(--subject-emissive) 0 4%, color-mix(in srgb, var(--subject-primary) 34%, transparent) 5% 22%, transparent 48%), radial-gradient(ellipse at center, var(--subject-atmo-a), var(--subject-atmo-b))',
          }}
        >
          {[
            { top: '34%', transform: 'rotate(0deg)' },
            { top: '34%', transform: 'rotate(24deg)' },
            { top: '34%', transform: 'rotate(-21deg)' },
          ].map(({ top, transform }) => (
            <span
              key={transform}
              data-static-ring
              className="absolute rounded-full border"
              style={{ width: '140%', height: '32%', left: '-20%', top, borderColor: 'var(--subject-primary)', opacity: 0.67, transform }}
            />
          ))}
          <span
            data-static-center
            className="absolute left-1/2 top-1/2 h-[11%] w-[11%] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ backgroundColor: 'var(--subject-emissive)', boxShadow: '0 0 20px var(--subject-secondary)' }}
          />
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          style={size === 'fill'
            ? { width: canvasSize, height: canvasSize, display: 'block' }
            : { width: '100%', height: '100%', display: 'block' }}
        />
      )}
    </div>
  );
}
