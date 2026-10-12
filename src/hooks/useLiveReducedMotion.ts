import { useCallback, useMemo, useSyncExternalStore } from 'react';

/** Consulta a preferência vigente também na ação, antes de notificações pendentes. */
export function readReducedMotionPreference() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
}

/** Atualiza a preferência sem remontar o modelo ou depender do cache inicial de Motion. */
export function useLiveReducedMotion() {
  const query = useMemo(() => typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)') : null, []);
  const subscribe = useCallback((notify: () => void) => {
    if (!query) return () => {};
    if (query.addEventListener) {
      query.addEventListener('change', notify);
      return () => query.removeEventListener('change', notify);
    }
    query.addListener(notify);
    return () => query.removeListener(notify);
  }, [query]);
  // WebKit pode adiar a atualização de uma MediaQueryList já criada. Uma
  // consulta nova lê a preferência vigente, inclusive entre notificações.
  const snapshot = readReducedMotionPreference;
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
