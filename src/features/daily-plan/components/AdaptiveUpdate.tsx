import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/cn';
import { focusEnter } from '../../../design-system/motion/variants';

// Only ever rendered by the caller when useAdaptiveRankingChange found a
// real previous-day comparison — this component has no "is this real"
// logic of its own on purpose, so it can't drift into faking one.
export function AdaptiveUpdate({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      exit={reducedMotion ? undefined : 'hidden'}
      variants={reducedMotion ? undefined : focusEnter}
      className={cn('flex items-start gap-2.5 rounded-control bg-surface-secondary border border-border-subtle px-3.5 py-3', className)}
    >
      <TrendingUp className="w-4 h-4 text-action-primary shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs text-text-secondary">Seu desempenho recente alterou a ordem recomendada.</p>
    </motion.div>
  );
}
