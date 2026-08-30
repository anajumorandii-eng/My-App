import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { CrivoCoreState } from '../../../components/CrivoCore';
import type { FeedbackStatus } from '../components/DisagreeControl';

export type DecisionVisualPhase = 'forming' | 'ready' | 'decomposed' | 'recomposing';

export interface DecisionChoreographyInput {
  actionId: string;
  rankingChanged: boolean;
  feedbackStatus: FeedbackStatus;
  explanationOpen: boolean;
}

export function useDecisionChoreography(input: DecisionChoreographyInput) {
  const reducedMotion = useReducedMotion();
  const [coreState, setCoreState] = useState<CrivoCoreState>(
    reducedMotion ? 'ready' : input.rankingChanged ? 'recalibrating' : 'analyzing',
  );
  const [confirmationKey, setConfirmationKey] = useState(0);
  const previousFeedback = useRef(input.feedbackStatus);

  useEffect(() => {
    if (reducedMotion) {
      setCoreState('ready');
      return;
    }
    setCoreState(input.rankingChanged ? 'recalibrating' : 'analyzing');
    const converge = window.setTimeout(() => setCoreState('converging'), 350);
    const ready = window.setTimeout(() => setCoreState('ready'), 900);
    return () => {
      window.clearTimeout(converge);
      window.clearTimeout(ready);
    };
  }, [input.actionId, input.rankingChanged, reducedMotion]);

  useEffect(() => {
    if (previousFeedback.current !== 'saved' && input.feedbackStatus === 'saved') {
      setConfirmationKey((value) => value + 1);
    }
    previousFeedback.current = input.feedbackStatus;
  }, [input.feedbackStatus]);

  const phase: DecisionVisualPhase = input.explanationOpen
    ? 'decomposed'
    : coreState === 'ready' ? 'ready'
    : coreState === 'recalibrating' ? 'recomposing'
    : 'forming';

  return {
    coreState,
    phase,
    isDecomposed: phase === 'decomposed',
    confirmationKey,
    reducedMotion: !!reducedMotion,
  };
}
