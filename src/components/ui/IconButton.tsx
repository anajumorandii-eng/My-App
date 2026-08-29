import React from 'react';
import { cn } from '../../lib/cn';
import { useSpotlight } from '../../hooks/useSpotlight';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon-only control — always needs a name announced to assistive tech. */
  'aria-label': string;
  variant?: 'ghost' | 'filled';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', className, children, onPointerMove, ...props },
  ref
) {
  const { onPointerMove: spotlightMove } = useSpotlight();
  return (
    <button
      ref={ref}
      onPointerMove={(e) => {
        spotlightMove(e);
        onPointerMove?.(e);
      }}
      className={cn(
        // w-11 h-11 = 44px, the minimum touch target.
        'spotlight inline-flex items-center justify-center w-11 h-11 rounded-control transition-colors shrink-0',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-base',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'ghost'
          ? 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary active:bg-surface-strong'
          : 'bg-surface-secondary text-text-primary hover:bg-surface-strong',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
