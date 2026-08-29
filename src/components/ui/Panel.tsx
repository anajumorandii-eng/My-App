import React from 'react';
import { cn } from '../../lib/cn';

type PanelElevation = 'default' | 'secondary' | 'elevated' | 'strong';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: PanelElevation;
}

const ELEVATION_CLASSES: Record<PanelElevation, string> = {
  default: 'bg-surface-default shadow-soft-sm',
  secondary: 'bg-surface-secondary',
  elevated: 'bg-surface-elevated shadow-soft-md',
  strong: 'bg-surface-strong',
};

export function Panel({ elevation = 'default', className, children, ...props }: PanelProps) {
  return (
    <div className={cn('rounded-card border border-border-subtle', ELEVATION_CLASSES[elevation], className)} {...props}>
      {children}
    </div>
  );
}
