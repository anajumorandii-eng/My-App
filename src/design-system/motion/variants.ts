import type { Variants } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from './tokens';

// A new focus/recommendation entering — component-scale entrance.
export const focusEnter: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION_DURATION.component, ease: MOTION_EASE } },
};

// Progressive disclosure (the "Por que isso?" panel opening/closing). The
// clip-path wipe is the mask-reveal effect from the visual-direction brief,
// scaled down for daily use: it always runs in lockstep with height/opacity
// (never a separate, longer beat that would delay reading), and the
// reduced-motion path in DecisionExplanation bypasses these variants
// entirely in favor of an instant inline height/opacity snap, so clip-path
// never animates for a reduced-motion viewer.
export const disclosurePanel: Variants = {
  collapsed: { height: 0, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
  expanded: {
    height: 'auto',
    opacity: 1,
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: MOTION_DURATION.panel, ease: MOTION_EASE },
  },
};

// A reordered/new item in the secondary-actions list.
export const listItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE } },
};

// A feedback confirmation ("Discordo" registered, etc).
export const confirmation: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: MOTION_DURATION.micro, ease: MOTION_EASE } },
};
