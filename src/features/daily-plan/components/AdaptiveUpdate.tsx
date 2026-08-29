import React from 'react';
import { TrendingUp } from 'lucide-react';
import { cn } from '../../../lib/cn';

// Only ever rendered by the caller when useAdaptiveRankingChange found a
// real previous-day comparison — this component has no "is this real"
// logic of its own on purpose, so it can't drift into faking one.
export function AdaptiveUpdate({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn('flex items-start gap-2.5 rounded-control bg-surface-secondary border border-border-subtle px-3.5 py-3', className)}
    >
      <TrendingUp className="w-4 h-4 text-action-primary shrink-0 mt-0.5" aria-hidden="true" />
      <p className="text-xs text-text-secondary">Seu desempenho recente alterou a ordem recomendada.</p>
    </div>
  );
}
