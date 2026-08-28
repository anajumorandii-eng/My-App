import { useEffect, useRef } from 'react';
import { shouldRunLoop } from '../design-system/crivoRafGate';

export interface RafLoopOptions {
  /** Skip the loop entirely — reduced motion, or the caller has nothing to animate right now. */
  paused: boolean;
  /** The element whose size gates the loop — a canvas hidden via CSS (zero size) shouldn't keep animating. */
  target: HTMLElement | null;
}

/**
 * Shared requestAnimationFrame loop for the Núcleo/atmosphere canvas-driven
 * visuals. When `paused` is true, no frame is ever scheduled (this is what
 * makes reduced motion a real "no continuous loop", not just a loop that
 * draws nothing). While running, the loop stops scheduling itself the moment
 * the tab goes hidden or the target has no visible size, and only resumes —
 * via the visibilitychange/ResizeObserver listeners — once both are true
 * again, so a backgrounded tab or an element hidden behind a breakpoint
 * doesn't keep a loop ticking for nothing. `callback` receives the delta
 * time in seconds since the last executed frame.
 */
export function useRafLoop(callback: (dtSeconds: number) => void, { paused, target }: RafLoopOptions): void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (paused || !target || typeof window === 'undefined') return;

    let handle = 0;
    let lastTime = 0;
    let running = false;

    const hasSize = () => {
      const rect = target.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    };

    const tick = (time: number) => {
      if (!shouldRunLoop(false, document.visibilityState, hasSize())) {
        running = false;
        return;
      }
      const dtSeconds = lastTime === 0 ? 0 : Math.min((time - lastTime) / 1000, 1 / 15);
      lastTime = time;
      callbackRef.current(dtSeconds);
      handle = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || !shouldRunLoop(false, document.visibilityState, hasSize())) return;
      running = true;
      lastTime = 0;
      handle = window.requestAnimationFrame(tick);
    };

    document.addEventListener('visibilitychange', start);
    const resizeObserver = new ResizeObserver(start);
    resizeObserver.observe(target);

    start();

    return () => {
      running = false;
      window.cancelAnimationFrame(handle);
      document.removeEventListener('visibilitychange', start);
      resizeObserver.disconnect();
    };
  }, [paused, target]);
}
