import React from 'react';
import { ConfidenceLevel, CONFIDENCE_LABEL } from '../../../lib/confidence';
import { cn } from '../../../lib/cn';

// The dot is decoration, not the message — the label text always ships
// alongside it, so confidence is never communicated by color alone.
const DOT_CLASS: Record<ConfidenceLevel, string> = {
  high: 'bg-status-success',
  moderate: 'bg-status-warning',
  low: 'bg-priority-high',
  insufficient_data: 'bg-text-muted',
};

export function ConfidenceIndicator({ level, className }: { level: ConfidenceLevel; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium text-text-secondary', className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', DOT_CLASS[level])} aria-hidden="true" />
      {CONFIDENCE_LABEL[level]}
    </span>
  );
}
