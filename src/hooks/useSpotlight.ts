import { useCallback } from 'react';

/**
 * Pairs with the `.spotlight` CSS class (src/index.css): sets two custom
 * properties tracking the pointer position *within the element*, which the
 * class turns into a small local glow. Deliberately scoped per-element —
 * there is no global cursor tracker in this app, per the visual-direction
 * brief's "spotlight local, nunca global" rule. Pointer-only: touch input
 * never fires pointermove without a drag, so it costs nothing on mobile.
 */
export function useSpotlight() {
  const onPointerMove = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--spotlight-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--spotlight-y', `${event.clientY - rect.top}px`);
  }, []);

  return { onPointerMove };
}
