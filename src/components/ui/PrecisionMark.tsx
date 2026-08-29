import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Corner crop-marks — the visual-direction brief's "precision" motif,
 * scoped deliberately: only wrap data the app is making a *measured claim*
 * about (mastery/confidence, the decision snapshot, a selected item). Never
 * decorate a plain card with it, or the signature reads as noise instead of
 * "this number was measured."
 */
export function PrecisionMark({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('relative', className)}>
      <span aria-hidden="true" className="pointer-events-none absolute -top-1.5 -left-1.5 w-2.5 h-2.5 border-t border-l border-ember-500/50" />
      <span aria-hidden="true" className="pointer-events-none absolute -top-1.5 -right-1.5 w-2.5 h-2.5 border-t border-r border-ember-500/50" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 border-b border-l border-ember-500/50" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 border-b border-r border-ember-500/50" />
      {children}
    </div>
  );
}
