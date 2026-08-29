import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { AllocatedStudyAction, StudyAction } from '../../../types';
import { Panel } from '../../../components/ui/Panel';
import { IconButton } from '../../../components/ui/IconButton';
import { listItem } from '../../../design-system/motion/variants';
import { MOTION_DURATION, MOTION_EASE, MOTION_STAGGER } from '../../../design-system/motion/tokens';
import { formatIsoTimeInSaoPaulo } from '../../../features/availability/time';

/**
 * Rows come from two places: today's allocated plan ("Depois disso"), where
 * every action already owns a slot on the clock, and the deferred queue
 * ("Pode esperar"), which by definition never got one — there was no time
 * left to place it. Widening to AllocatedStudyAction lets the scheduled slot
 * be shown where it exists without inventing one where it doesn't.
 */
export type SecondaryAction = AllocatedStudyAction | StudyAction;

export interface SecondaryActionListProps {
  title: string;
  actions: SecondaryAction[];
  actionLabels: Record<StudyAction['type'], string>;
  onStart: (topicId: string) => void;
  quiet?: boolean;
}

// Deliberately quieter than TodayFocus — no MasteryMeter, no disclosure, no
// motion entrance beyond a small stagger. This is "depois disso", not a
// second hero.
export function SecondaryActionList({ title, actions, actionLabels, onStart, quiet = false }: SecondaryActionListProps) {
  const reducedMotion = useReducedMotion();
  if (actions.length === 0) return null;

  return (
    <section>
      <h3 className={quiet ? 'text-xs font-medium text-text-muted uppercase tracking-wide mb-2' : 'text-sm font-semibold text-text-primary mb-2'}>
        {title}
      </h3>
      <div className="space-y-1.5">
        {actions.map((action, index) => {
          const slot = 'intervalStart' in action
            ? `${formatIsoTimeInSaoPaulo(action.intervalStart)}–${formatIsoTimeInSaoPaulo(action.intervalEnd)}`
            : null;
          return (
          <motion.div
            key={action.id}
            initial={reducedMotion ? false : 'hidden'}
            animate="visible"
            variants={listItem}
            transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE, delay: reducedMotion ? 0 : index * MOTION_STAGGER.list }}
          >
            <Panel
              elevation={quiet ? 'secondary' : 'default'}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className={quiet ? 'text-sm text-text-secondary truncate' : 'text-sm font-medium text-text-primary truncate'}>
                  {action.topicName}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {actionLabels[action.type]} · {action.estimatedMinutes} min
                  {slot ? ` · ${slot}` : ''}
                </p>
              </div>
              <IconButton aria-label={`Começar ${action.topicName}`} onClick={() => onStart(action.topicId)}>
                <PlayCircle className="w-4 h-4" aria-hidden="true" />
              </IconButton>
            </Panel>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}
