import type { TargetAndTransition, Transition } from 'motion/react';

/** A readable static frame, including SVG properties MotionConfig does not stop. */
export function iconTarget(target: TargetAndTransition, reduced: boolean, rotation = 0): TargetAndTransition {
  if (!reduced) return target;
  return Object.fromEntries(Object.entries(target).map(([key, value]) => {
    if (key === 'opacity' || key === 'pathLength' || key.startsWith('scale')) return [key, 1];
    if (key === 'rotate') return [key, rotation];
    if (key === 'x' || key === 'y') return [key, 0];
    if (key === 'strokeDasharray') return [key, 'none'];
    // Keep complete hourglass strokes, rather than their collapsed first frame.
    if (key === 'y2' && Array.isArray(value)) return [key, Math.max(...value.filter(v => typeof v === 'number'))];
    return [key, Array.isArray(value) ? value.find(v => v !== null) : value];
  }));
}

export function iconTransition(transition: Transition, reduced: boolean): Transition {
  return reduced ? { duration: 0, delay: 0, repeat: 0 } : transition;
}
