import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '../../../lib/cn';
import { useRafLoop } from '../../../hooks/useRafLoop';
import { getSubjectProfile, PALETTE_TOKENS, type CrivoPalette, type FieldType } from '../../../design-system/crivoSubjects';
import { FIELD_REGISTRY } from '../../../design-system/crivoFieldRegistry';
import { tweenPalette } from '../../../design-system/crivoPaletteTween';
import { MOTION_DURATION } from '../../../design-system/motion/tokens';

export interface SubjectAtmosphereProps {
  /** Today's primary recommendation's matéria. Omitted (loading/empty states) renders the neutral default. */
  subject?: string;
  className?: string;
  children: React.ReactNode;
}

// Faint enough that the page's normal theme text (already contrast-checked
// against --background-base) stays legible over it without a bespoke
// per-subject contrast calculation — same order of magnitude as the
// existing .spotlight glow (16%).
const FIELD_OPACITY = 0.16;

function applyPalette(node: HTMLDivElement, palette: CrivoPalette, fieldType: FieldType) {
  for (const token of PALETTE_TOKENS) node.style.setProperty(`--subject-${token}`, palette[token]);
  node.style.setProperty('--subject-field', FIELD_REGISTRY[fieldType](palette));
}

/**
 * Wraps the Hoje screen's own rendered content (header, context chips, empty
 * states, TodayFocus, secondary lists) with a decorative, per-matéria
 * backdrop — the "campo da matéria" — exposing the palette as CSS custom
 * properties local to this wrapper only (never :root/<html>, so it can't
 * bleed into the nav rail or any other route). Unlike CrivoCore, this
 * component is never remounted by a `key` when the recommendation changes,
 * so it tracks its own previous matéria via a ref and tweens across it.
 */
export function SubjectAtmosphere({ subject, className, children }: SubjectAtmosphereProps) {
  const reducedMotion = useReducedMotion();
  const [wrapperNode, setWrapperNode] = useState<HTMLDivElement | null>(null);
  const profile = useMemo(() => getSubjectProfile(subject), [subject]);

  const previousProfileRef = useRef(profile);
  const elapsedRef = useRef(0);
  const [isTweening, setIsTweening] = useState(false);

  // First paint: apply directly, no tween — there's no "previous" atmosphere yet.
  useLayoutEffect(() => {
    if (!wrapperNode) return;
    applyPalette(wrapperNode, profile.palette, profile.fieldType);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only; later subject changes go through the effect below
  }, [wrapperNode]);

  useEffect(() => {
    if (previousProfileRef.current.key === profile.key) return;
    if (reducedMotion || !wrapperNode) {
      previousProfileRef.current = profile;
      if (wrapperNode) applyPalette(wrapperNode, profile.palette, profile.fieldType);
      setIsTweening(false);
      return;
    }
    elapsedRef.current = 0;
    setIsTweening(true);
  }, [profile, reducedMotion, wrapperNode]);

  useRafLoop(
    (dt) => {
      if (!wrapperNode) return;
      elapsedRef.current += dt;
      const progress = Math.min(1, elapsedRef.current / MOTION_DURATION.subjectTween);
      const mixed = tweenPalette(previousProfileRef.current.palette, profile.palette, progress);
      applyPalette(wrapperNode, mixed, profile.fieldType);
      if (progress >= 1) {
        previousProfileRef.current = profile;
        setIsTweening(false);
      }
    },
    { paused: reducedMotion || !isTweening, target: wrapperNode }
  );

  return (
    <div ref={setWrapperNode} className={cn('relative', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'var(--subject-field)', opacity: FIELD_OPACITY }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
