import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

// Every empty state must say what happened, why, and what (if anything) can
// be done about it — never a one-line universal fallback.
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12 px-6 rounded-panel border border-dashed border-border-subtle bg-surface-secondary', className)}>
      {Icon && <Icon className="w-8 h-8 mx-auto mb-4 text-text-muted" aria-hidden="true" />}
      <p className="font-medium text-text-primary">{title}</p>
      <p className="text-sm text-text-secondary mt-1.5 max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
