import React, { useRef } from 'react';
import { motion, type Transition, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE, MOTION_STAGGER } from '../../design-system/motion/tokens';

export interface KineticTextProps {
  text: string;
  /** Changes only when a genuinely new context arrives (e.g. a new primary
   * topic id) — the component plays its convergence animation the first
   * time it sees a given runKey, and renders statically on any re-render
   * that reuses the same one (theme toggle, feedback save, etc). */
  runKey: string;
  as?: 'h2' | 'span';
  className?: string;
  /** Delay between each character; defaults to the design-system value. */
  stagger?: number;
  /** Character transition duration in seconds; defaults to component motion. */
  duration?: number;
  /** Character transition easing; defaults to the standard interface ease. */
  ease?: Transition['ease'];
}

function createContainerVariants(stagger: number) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } },
  };
}

function createLetterVariants(duration: number, ease: Transition['ease']) {
  return {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration, ease } },
  };
}

/**
 * One-time convergence animation for the topic name in "Foco de hoje" — a
 * quiet, fast echo of the kinetic typography in the video references,
 * scaled down for daily, recurring use instead of a landing-page moment.
 * Never blocks reading: the full text is present in the DOM immediately,
 * only its opacity/position animate in.
 */
export function KineticText({
  text,
  runKey,
  as = 'span',
  className,
  stagger = MOTION_STAGGER.letters,
  duration = MOTION_DURATION.component,
  ease = MOTION_EASE,
}: KineticTextProps) {
  const reducedMotion = useReducedMotion();
  const playedKeys = useRef(new Set<string>());
  const alreadyPlayed = playedKeys.current.has(runKey);
  if (!alreadyPlayed) playedKeys.current.add(runKey);

  const Tag = motion[as];

  if (reducedMotion || alreadyPlayed) {
    const Static = as;
    return <Static className={className}>{text}</Static>;
  }

  const words = text.split(' ');
  const container = createContainerVariants(stagger);
  const letter = createLetterVariants(duration, ease);

  return (
    <Tag className={className} initial="hidden" animate="visible" variants={container} aria-label={text}>
      {words.map((word, wi) => (
        <span key={`${runKey}-${wi}`} className="inline-block whitespace-pre" aria-hidden="true">
          {word.split('').map((char, ci) => (
            <motion.span key={ci} className="inline-block" variants={letter}>
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  );
}
