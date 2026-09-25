import { useRef } from 'react';
import { useInView, usePageInView, useReducedMotion } from 'motion/react';

/** Run looping SVG motion only while the icon is visible in the active tab. */
export function useIconMotion() {
  const iconRef = useRef<SVGSVGElement>(null);
  const inView = useInView(iconRef);
  const pageInView = usePageInView();
  const still = !!useReducedMotion() || !inView || !pageInView;
  return { iconRef, still };
}
