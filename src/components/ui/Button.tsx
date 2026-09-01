import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, MotionProps } from 'motion/react';
import { cn } from '../../lib/cn';
import { useSpotlight } from '../../hooks/useSpotlight';
import { getMotionConfigForSubject } from '../../design-system/crivoMotionPresets';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps>, MotionProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  subject?: string;
  children?: React.ReactNode;
  loading?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-action-primary text-text-inverse hover:bg-action-primary-hover active:bg-action-primary-pressed disabled:bg-surface-strong disabled:text-text-muted',
  secondary:
    'bg-surface-secondary text-text-primary border border-border-subtle hover:bg-surface-strong active:bg-surface-strong disabled:text-text-muted',
  ghost:
    'bg-transparent text-text-secondary hover:bg-surface-secondary hover:text-text-primary active:bg-surface-strong disabled:text-text-muted',
  destructive:
    'bg-red-500/10 text-red-500 hover:bg-red-500/20 active:bg-red-500/30 disabled:text-text-muted border border-red-500/20',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: 'px-4 py-2.5 text-sm min-h-11',
  sm: 'px-3 py-2 text-xs min-h-9',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, onPointerMove, subject, ...props },
  ref
) {
  const { onPointerMove: spotlightMove } = useSpotlight();
  const motionConfig = getMotionConfigForSubject(subject);

  return (
    <motion.button
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
      whileHover={!disabled && !loading ? motionConfig.hoverProps.whileHover : undefined}
      whileTap={!disabled && !loading ? motionConfig.hoverProps.whileTap : undefined}
      transition={motionConfig.hoverProps.transition}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
      {children}
    </motion.button>
  );
});
