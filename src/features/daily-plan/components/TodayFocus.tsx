import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { AllocatedStudyAction, DisagreeReason } from '../../../types';
import { formatIsoTimeInSaoPaulo } from '../../../features/availability/time';
import { Button } from '../../../components/ui/Button';
import { KineticText } from '../../../components/ui/KineticText';
import { CrivoCore } from '../../../components/CrivoCore';
import { getSubjectProfile, TYPOGRAPHY_PRESETS } from '../../../design-system/crivoSubjects';
import { DecisionExplanation } from './DecisionExplanation';
import { DisagreeControl, FeedbackStatus } from './DisagreeControl';
import { AdaptiveUpdate } from './AdaptiveUpdate';
import { DecisionSignalStrip } from './DecisionSignalStrip';
import { DecisionFactorField } from './DecisionFactorField';
import { focusEnter } from '../../../design-system/motion/variants';
import { usePreviousFeedback } from '../../../hooks/usePreviousFeedback';
import { useDecisionChoreography } from '../motion/useDecisionChoreography';

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
  const [explanationOpen, setExplanationOpen] = useState(false);
  const previous = usePreviousFeedback(action.topicId, userId);
  const subjectProfile = getSubjectProfile(action.subject);
  const typographyPreset = TYPOGRAPHY_PRESETS[subjectProfile.tipografia];
  const { coreState, phase, confirmationKey, reducedMotion } = useDecisionChoreography({
    actionId: action.id,
    rankingChanged: showAdaptiveUpdate,
    feedbackStatus,
    explanationOpen,
  });
  const reviewUrgency = action.factors.find((factor) => factor.kind === 'review_urgency')?.rawValue ?? 0;

  return (
    <motion.section
      data-testid="today-decision-stage"
      data-phase={phase}
      data-geometry={subjectProfile.fieldType}
      data-confirmation-key={confirmationKey}
      data-motion-active={!reducedMotion && (phase === 'forming' || phase === 'recomposing') ? 'true' : undefined}
      aria-labelledby={`decision-${action.id}`}
      className="crivo-decision-hero"
      layout={!reducedMotion}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={focusEnter}
    >
      <div className="crivo-decision-copy">
        <p className="crivo-decision-eyebrow">Hoje · decisão principal</p>
        <h1 id={`decision-${action.id}`} className="crivo-decision-title">
          <KineticText
            as="span"
            runKey={action.id}
            text={action.topicName}
            className="block"
            stagger={typographyPreset.stagger}
            duration={typographyPreset.duration}
            ease={typographyPreset.ease}
          />
        </h1>

        <div className="crivo-decision-intervention">
          <p>{actionLabel} <span>em {action.subject}</span></p>
          <p>
            <strong>{action.allocatedMinutes} min</strong>
            {' · '}
            {formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}
          </p>
        </div>

        <p className="crivo-decision-reason">{mainReason}</p>

        <Button onClick={onStart} className="crivo-decision-cta">
          <PlayCircle className="w-4 h-4" aria-hidden="true" />
          Começar
        </Button>

        <DecisionSignalStrip
          mastery={action.snapshot.masteryLevel}
          uncertainty={action.snapshot.uncertainty}
          urgency={reviewUrgency}
          minutes={action.allocatedMinutes}
        />

        <AnimatePresence initial={false}>
          {showAdaptiveUpdate && <AdaptiveUpdate key={action.id} className="crivo-adaptive-update" />}
        </AnimatePresence>

        <DecisionExplanation
          mainReason=""
          factors={action.factors}
          snapshot={action.snapshot}
          open={explanationOpen}
          onOpenChange={setExplanationOpen}
          onDisagree={() => setDisagreeOpen(true)}
          className="crivo-decision-explanation"
        />

        {disagreeOpen && (
          <DisagreeControl
            status={feedbackStatus}
            previous={previous}
            onSelect={onDisagree}
            className="crivo-disagree-control rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-base"
          />
        )}
      </div>

      <div className="crivo-core-stage" aria-hidden="true">
        <CrivoCore
          size="fill"
          scale="hero"
          decorative
          state={coreState}
          subject={action.subject}
          previousSubject={previousSubject}
          topicId={action.topicId}
        />
        <DecisionFactorField factors={action.factors} phase={phase} />
      </div>
    </motion.section>
  );
}
