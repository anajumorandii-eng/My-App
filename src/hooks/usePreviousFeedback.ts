import { useEffect, useState } from 'react';
import { getPlanFeedback } from '../lib/userData';
import { PlanFeedback } from '../types';

interface PreviousFeedbackState {
  loading: boolean;
  error: string | null;
  feedback: PlanFeedback | null;
}

const IDLE: PreviousFeedbackState = { loading: false, error: null, feedback: null };

// "Já discordei dessa recomendação antes?" — reads by topicId (not
// actionId, which is only stable for one day) so this survives the plan
// regenerating daily. Works with no signed-in user: there's nothing to
// read, so it resolves straight to "no previous feedback" instead of erroring.
export function usePreviousFeedback(topicId: string | undefined, userId: string | undefined): PreviousFeedbackState {
  const [state, setState] = useState<PreviousFeedbackState>(IDLE);

  useEffect(() => {
    if (!userId || !topicId) {
      setState(IDLE);
      return;
    }
    let cancelled = false;
    setState({ loading: true, error: null, feedback: null });
    getPlanFeedback(userId)
      .then((items) => {
        if (cancelled) return;
        const match = items.find((f) => f.topicId === topicId) ?? null;
        setState({ loading: false, error: null, feedback: match });
      })
      .catch((error) => {
        console.error('Failed to load previous plan feedback:', error);
        if (!cancelled) setState({ loading: false, error: 'Não foi possível verificar feedback anterior.', feedback: null });
      });
    return () => {
      cancelled = true;
    };
  }, [topicId, userId]);

  return state;
}
