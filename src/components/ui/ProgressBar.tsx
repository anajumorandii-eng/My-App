import React from 'react';
import { cn } from '../../lib/cn';

export interface ProgressBarProps {
  /** 0-100 */
  value: number;
  /** Accessible name — must state what the number means, e.g. "Domínio: 62%". Color is never the only carrier. */
  label: string;
  tone?: 'default' | 'critical';
  className?: string;
}

export function ProgressBar({ value, label, tone = 'default', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn('h-2 rounded-full bg-surface-strong overflow-hidden', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-300', tone === 'critical' ? 'bg-priority-critical' : 'bg-action-primary')}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
