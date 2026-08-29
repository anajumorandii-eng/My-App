import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useSpotlight } from '../../hooks/useSpotlight';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-action-primary text-text-inverse hover:bg-action-primary-hover active:bg-action-primary-pressed disabled:bg-surface-strong disabled:text-text-muted',
  secondary:
    'bg-surface-secondary text-text-primary border border-border-subtle hover:bg-surface-strong active:bg-surface-strong disabled:text-text-muted',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary active:bg-surface-strong disabled:text-text-muted',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'px-4 py-2.5 text-sm min-h-11',
  sm: 'px-3 py-2 text-xs min-h-9',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, onPointerMove, ...props },
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
        'spotlight inline-flex items-center justify-center gap-2 rounded-button font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-base',
        'disabled:cursor-not-allowed disabled:opacity-70',
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
});
