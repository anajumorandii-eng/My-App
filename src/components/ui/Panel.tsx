import React from 'react';
import { motion, MotionProps } from 'motion/react';
import { cn } from '../../lib/cn';
import { getMotionConfigForSubject } from '../../design-system/crivoMotionPresets';

type PanelElevation = 'default' | 'secondary' | 'elevated' | 'strong';

export interface PanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof MotionProps>, MotionProps {
  elevation?: PanelElevation;
  subject?: string;
  interactive?: boolean;
}

const ELEVATION_CLASSES: Record<PanelElevation, string> = {
  default: 'bg-surface-default shadow-soft-sm',
  secondary: 'bg-surface-secondary',
  elevated: 'bg-surface-elevated shadow-soft-md',
  strong: 'bg-surface-strong',
};

export const Panel = React.forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { elevation = 'default', interactive = false, subject, className, children, ...props },
  ref
) {
  const motionConfig = getMotionConfigForSubject(subject);

  return (
    <motion.div
      ref={ref}
      className={cn(
        'rounded-card border border-border-subtle overflow-hidden',
        ELEVATION_CLASSES[elevation],
        interactive && 'cursor-pointer hover:border-border-strong transition-colors',
        className
      )}
      variants={motionConfig.itemVariants}
      whileHover={interactive ? motionConfig.hoverProps.whileHover : undefined}
      whileTap={interactive ? motionConfig.hoverProps.whileTap : undefined}
      transition={interactive ? motionConfig.hoverProps.transition : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
});
