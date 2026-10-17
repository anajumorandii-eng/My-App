import { useCallback, useEffect, useMemo, useRef, useState, type SetStateAction } from 'react';
import { useAuth } from '../context/AuthContext';

export const isText = (value: unknown): value is string => typeof value === 'string';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

/** Save immediately on edit, including navigation before effects flush. */
export function useStudyDraft<T>(scope: string, initial: T, valid: (value: unknown) => value is T) {
  const { user } = useAuth();
  const key = `crivo_study_draft_v1:${encodeURIComponent(user?.uid ?? 'guest')}:${encodeURIComponent(scope)}`;
  const loaded = useMemo(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const value: unknown = JSON.parse(raw);
        if (valid(value)) return { key, value, status: 'restored' as const };
        return { key, value: initial, status: 'invalid' as const };
      }
      return { key, value: initial, status: 'empty' as const };
    } catch { return { key, value: initial, status: 'unavailable' as const }; }
  }, [key]);
  type Entry = { key: string; value: T; status: string };
  const [entry, setEntry] = useState<Entry>(loaded);
  const current = entry.key === key ? entry : loaded;
  const live = useRef(current);
  const active = useRef(true);
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  live.current = current;
  const setValue = useCallback((update: SetStateAction<T>) => {
    // A response from an abandoned topic/account must not alter the new one.
    if (!active.current || live.current.key !== key) return;
    const value = typeof update === 'function' ? (update as (previous: T) => T)(live.current.value) : update;
    let status = 'saved';
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch { status = 'unavailable'; }
    const next = { key, value, status };
    live.current = next;
    setEntry(next);
  }, [key]);
  return [current.value, setValue, current.status] as const;
}
