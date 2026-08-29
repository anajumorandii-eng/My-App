import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { AllocatedStudyAction, DisagreeReason } from '../../../types';
import { formatIsoTimeInSaoPaulo } from '../../../features/availability/time';
import { Panel } from '../../../components/ui/Panel';
import { Button } from '../../../components/ui/Button';
import { KineticText } from '../../../components/ui/KineticText';
import { CrivoCore, CrivoCoreState } from '../../../components/CrivoCore';
import { getSubjectProfile, TYPOGRAPHY_PRESETS } from '../../../design-system/crivoSubjects';
import { MasteryMeter } from './MasteryMeter';
import { DecisionExplanation } from './DecisionExplanation';
import { DisagreeControl, FeedbackStatus } from './DisagreeControl';
import { AdaptiveUpdate } from './AdaptiveUpdate';
import { focusEnter } from '../../../design-system/motion/variants';
import { MOTION_DURATION } from '../../../design-system/motion/tokens';
import { usePreviousFeedback } from '../../../hooks/usePreviousFeedback';

export interface TodayFocusProps {
  /** Allocated, not merely ranked: the focus card states *when* today's
   * recommendation is scheduled, so it needs the slot the allocator placed
   * it in, not just the priority-engine fields. */
  action: AllocatedStudyAction;
  actionLabel: string;
  mainReason: string;
  onStart: () => void;
  showAdaptiveUpdate: boolean;
  /** The matéria of yesterday's primary recommendation, only when it genuinely differs from today's — drives the Núcleo's metamorphosis instead of an instant recolor. */
  previousSubject?: string;
  userId: string | undefined;
  feedbackStatus: FeedbackStatus;
  onDisagree: (reason: DisagreeReason) => void;
}

export function TodayFocus({ action, actionLabel, mainReason, onStart, showAdaptiveUpdate, previousSubject, userId, feedbackStatus, onDisagree }: TodayFocusProps) {
  const [disagreeOpen, setDisagreeOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const previous = usePreviousFeedback(action.topicId, userId);
  const subjectProfile = getSubjectProfile(action.subject);
  const typographyPreset = TYPOGRAPHY_PRESETS[subjectProfile.tipografia];

  // The Núcleo do Crivo is Hoje's one protagonist effect: it moves through
  // the engine's real states once, on arrival of *this specific*
  // recommendation (the parent remounts this component via `key={action.id}`
  // whenever the recommendation actually changes) — never a continuous
  // idle spin. A day-over-day ranking change reads as "recalibrando"
  // instead of "analisando", since the engine already had a prior answer.
  const [coreState, setCoreState] = useState<CrivoCoreState>(
    reducedMotion ? 'ready' : showAdaptiveUpdate ? 'recalibrating' : 'analyzing'
  );

  useEffect(() => {
    if (reducedMotion) return;
    const stepMs = MOTION_DURATION.core * 1000;
    if (showAdaptiveUpdate) {
      const t = setTimeout(() => setCoreState('ready'), stepMs);
      return () => clearTimeout(t);
    }
    const t1 = setTimeout(() => setCoreState('converging'), stepMs);
    const t2 = setTimeout(() => setCoreState('ready'), stepMs * 2);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately once per mount (per recommendation)
  }, []);

  return (
    <motion.div initial={reducedMotion ? false : 'hidden'} animate="visible" variants={focusEnter}>
      {showAdaptiveUpdate && <AdaptiveUpdate className="mb-3" />}

      <Panel elevation="elevated" className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">Foco de hoje</p>
            <KineticText
              as="h2"
              runKey={action.id}
              text={action.topicName}
              className="font-display text-3xl sm:text-4xl font-semibold text-text-primary mt-1.5 block"
              stagger={typographyPreset.stagger}
              duration={typographyPreset.duration}
              ease={typographyPreset.ease}
            />
            <p className="text-text-secondary mt-2">
              {actionLabel} em {action.subject} · <span className="font-medium text-text-primary">{action.estimatedMinutes} min</span>
              {' · '}
              {formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}
            </p>
          </div>
          <CrivoCore
            state={coreState}
            subject={action.subject}
            previousSubject={previousSubject}
            topicId={action.topicId}
            size={48}
            className="sm:hidden"
          />
          <CrivoCore
            state={coreState}
            subject={action.subject}
            previousSubject={previousSubject}
            topicId={action.topicId}
            size={72}
            className="hidden sm:block"
          />
        </div>

        <MasteryMeter
          level={action.snapshot.masteryLevel}
          uncertainty={action.snapshot.uncertainty}
          topicName={action.topicName}
          className="mt-5 max-w-xs"
        />

        <Button onClick={onStart} className="mt-6 w-full sm:w-auto">
          <PlayCircle className="w-4 h-4" aria-hidden="true" />
          Começar
        </Button>

        <DecisionExplanation
          mainReason={mainReason}
          factors={action.factors}
          snapshot={action.snapshot}
          onDisagree={() => setDisagreeOpen(true)}
          className="mt-6 pt-5 border-t border-border-subtle"
        />

        {disagreeOpen && (
          <DisagreeControl
            status={feedbackStatus}
            previous={previous}
            onSelect={onDisagree}
            className="mt-4"
          />
        )}
      </Panel>
    </motion.div>
  );
}
