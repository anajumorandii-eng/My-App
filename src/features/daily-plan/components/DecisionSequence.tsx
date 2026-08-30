import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PlayCircle, ChevronDown } from 'lucide-react';
import type { AllocatedStudyAction, StudyAction } from '../../../types';
import { Panel } from '../../../components/ui/Panel';
import { IconButton } from '../../../components/ui/IconButton';
import { listItem, rankedSequence } from '../../../design-system/motion/variants';
import { MOTION_DURATION, MOTION_EASE } from '../../../design-system/motion/tokens';
import { formatIsoTimeInSaoPaulo } from '../../../features/availability/time';

export interface DecisionSequenceProps {
  next: AllocatedStudyAction[];
  waiting: StudyAction[];
  actionLabels: Record<StudyAction['type'], string>;
  onStart: (topicId: string) => void;
}
function ActionRow({
  action,
  actionLabels,
  onStart,
  quiet = false,
}: {
  action: AllocatedStudyAction | StudyAction;
  actionLabels: Record<StudyAction['type'], string>;
  onStart: (topicId: string) => void;
  quiet?: boolean;
}) {
  const slot = 'intervalStart' in action
    ? `${formatIsoTimeInSaoPaulo(action.intervalStart)}–${formatIsoTimeInSaoPaulo(action.intervalEnd)}`
    : null;

  return (
    <Panel elevation={quiet ? 'secondary' : 'default'} className="flex items-center justify-between gap-3 px-4 py-3">
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
  );
}

export function DecisionSequence({ next, waiting, actionLabels, onStart }: DecisionSequenceProps) {
  const reducedMotion = useReducedMotion();
  const [waitingOpen, setWaitingOpen] = useState(false);
  if (next.length === 0 && waiting.length === 0) return null;

  return (
    <section aria-labelledby="decision-sequence-title" className="decision-sequence" aria-label="Sequência de decisão">
      <h2 id="decision-sequence-title" className="sr-only">Sequência de decisão</h2>
      <motion.ol
        className="decision-sequence-list"
        initial={reducedMotion ? false : 'hidden'}
        animate="visible"
        variants={rankedSequence}
      >
        {next.length > 0 && (
          <li className="decision-sequence-region">
            <h3>Depois disso</h3>
            <ol>
              {next.map((action) => (
                <motion.li
                  key={action.id}
                  layout
                  layoutId={action.id}
                  data-action-id={action.id}
                  variants={listItem}
                  transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}
                >
                  <ActionRow action={action} actionLabels={actionLabels} onStart={onStart} />
                </motion.li>
              ))}
            </ol>
          </li>
        )}
        {waiting.length > 0 && (
          <motion.li className="decision-sequence-region decision-sequence-waiting" variants={listItem}>
            <div role="group" aria-label="Pode esperar" aria-expanded={waitingOpen}>
              <button
                type="button"
                className="decision-sequence-disclosure"
                aria-expanded={waitingOpen}
                aria-controls="decision-sequence-waiting-list"
                onClick={() => setWaitingOpen((open) => !open)}
              >
                <span>Pode esperar</span>
                <ChevronDown aria-hidden="true" className={waitingOpen ? 'rotate-180' : ''} />
              </button>
              {waitingOpen && (
                <ol id="decision-sequence-waiting-list">
                  {waiting.map((action) => (
                    <motion.li
                      key={action.id}
                      layout
                      layoutId={action.id}
                      data-action-id={action.id}
                      variants={listItem}
                      transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}
                    >
                      <ActionRow action={action} actionLabels={actionLabels} onStart={onStart} quiet />
                    </motion.li>
                  ))}
                </ol>
              )}
            </div>
          </motion.li>
        )}
      </motion.ol>
    </section>
  );
}
