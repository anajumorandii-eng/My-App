import { useEffect, useRef, useState } from 'react';
import type { QuestionTiming } from '../lib/questionTiming';

type Clock = { elapsed: number; segment: number | null; startedAt: string; manualPause: boolean; finished: QuestionTiming | null };
const fresh = (enabled: boolean): Clock => ({ elapsed: 0, segment: enabled && !document.hidden ? performance.now() : null, startedAt: new Date().toISOString(), manualPause: false, finished: null });
const milliseconds = (clock: Clock) => clock.elapsed + (clock.segment === null ? 0 : Math.max(0, performance.now() - clock.segment));

export function useQuestionTimer(key: string, enabled: boolean) {
  const clock = useRef<Clock>(fresh(false));
  const [snapshot, setSnapshot] = useState({ seconds: 0, running: false, manualPause: false, finished: false });
  const publish = () => {
    const next = { seconds: Math.floor(milliseconds(clock.current) / 1000), running: clock.current.segment !== null, manualPause: clock.current.manualPause, finished: Boolean(clock.current.finished) };
    setSnapshot(previous => previous.seconds === next.seconds && previous.running === next.running && previous.manualPause === next.manualPause && previous.finished === next.finished ? previous : next);
  };
  const stopSegment = () => { clock.current.elapsed = milliseconds(clock.current); clock.current.segment = null; };
  const restart = () => { clock.current = fresh(enabled); publish(); };
  useEffect(() => {
    restart();
    const visibility = () => {
      if (!enabled || clock.current.finished) return;
      if (document.hidden) stopSegment();
      else if (!clock.current.manualPause && clock.current.segment === null) clock.current.segment = performance.now();
      publish();
    };
    const interval = enabled ? window.setInterval(() => { if (!clock.current.finished) publish(); }, 250) : null;
    document.addEventListener('visibilitychange', visibility);
    return () => { if (interval !== null) clearInterval(interval); document.removeEventListener('visibilitychange', visibility); };
  }, [key, enabled]);
  const togglePause = () => {
    if (!enabled || clock.current.finished) return;
    if (clock.current.manualPause) {
      clock.current.manualPause = false;
      if (!document.hidden) clock.current.segment = performance.now();
    } else { stopSegment(); clock.current.manualPause = true; }
    publish();
  };
  // Sampling the clock at submission avoids losing the last partial interval;
  // the finished guard also prevents two fast clicks from saving two attempts.
  const finish = (): QuestionTiming | null => {
    if (!enabled || clock.current.finished) return null;
    stopSegment();
    const result = { startedAt: clock.current.startedAt, completedAt: new Date().toISOString(), durationSeconds: Math.floor(clock.current.elapsed / 1000) };
    clock.current.finished = result; publish();
    return result;
  };
  return { ...snapshot, togglePause, finish, restart };
}
