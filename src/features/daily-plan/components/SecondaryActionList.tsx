import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { StudyAction } from '../../../types';
import { Panel } from '../../../components/ui/Panel';
import { IconButton } from '../../../components/ui/IconButton';
import { listItem } from '../../../design-system/motion/variants';
import { MOTION_DURATION, MOTION_EASE, MOTION_STAGGER } from '../../../design-system/motion/tokens';

export interface SecondaryActionListProps {
  title: string;
  actions: StudyAction[];
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
        {actions.map((action, index) => (
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
                </p>
              </div>
              <IconButton aria-label={`Começar ${action.topicName}`} onClick={() => onStart(action.topicId)}>
                <PlayCircle className="w-4 h-4" aria-hidden="true" />
              </IconButton>
            </Panel>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
