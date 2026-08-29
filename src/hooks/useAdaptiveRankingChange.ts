import { useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'crivo_last_primary_topic';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 86_400_000;

interface StoredPrimary {
  topicId: string;
  subject?: string;
  date: string; // YYYY-MM-DD
}

export interface AdaptiveRankingResult {
  changed: boolean;
  previousSubject?: string;
}

export interface AdaptiveRankingSnapshot {
  topicId: string;
  subject?: string;
  date: string;
}

function utcDayTimestamp(value: string): number | null {
  if (!DATE_PATTERN.test(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);

  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    return null;
  }

  return date.getTime();
}

function isPreviousCalendarDay(previousDate: string, today: string): boolean {
  const previousTimestamp = utcDayTimestamp(previousDate);
  const todayTimestamp = utcDayTimestamp(today);
  return previousTimestamp !== null && todayTimestamp !== null && todayTimestamp - previousTimestamp === MILLISECONDS_PER_DAY;
}

/** Decides whether today's recommendation is a genuine day-over-day change. */
export function decideAdaptiveRankingChange(
  previous: AdaptiveRankingSnapshot | null,
  current: Pick<AdaptiveRankingSnapshot, 'topicId' | 'subject'>,
  today: string,
): AdaptiveRankingResult {
  const changed = Boolean(previous && isPreviousCalendarDay(previous.date, today) && previous.topicId !== current.topicId);
  if (!changed) return { changed: false };

  return previous?.subject ? { changed: true, previousSubject: previous.subject } : { changed: true };
}

export function parseAdaptiveRankingSnapshot(raw: string | null): AdaptiveRankingSnapshot | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;

    const candidate = parsed as Partial<StoredPrimary>;
    if (
      typeof candidate.topicId !== 'string' ||
      !candidate.topicId ||
      typeof candidate.date !== 'string' ||
      !DATE_PATTERN.test(candidate.date)
    ) {
      return null;
    }

    return {
      topicId: candidate.topicId,
      date: candidate.date,
      ...(typeof candidate.subject === 'string' ? { subject: candidate.subject } : {}),
    };
  } catch {
    return null;
  }
}

// Only reports a change when there is a *real* previous recommendation to
// compare against, from an earlier day, that named a different topic —
// never a static "your plan adapted" banner. Silent (no comparison) if
// localStorage is unavailable.
export function useAdaptiveRankingChange(primaryTopicId: string | undefined, primarySubject?: string): AdaptiveRankingResult {
  const [result, setResult] = useState<AdaptiveRankingResult>({ changed: false });
  const processedKey = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!primaryTopicId || typeof window === 'undefined') {
      setResult({ changed: false });
      return;
    }

    try {
      const today = new Date().toISOString().slice(0, 10);
      const key = `${today}:${primaryTopicId}:${primarySubject ?? ''}`;
      if (processedKey.current === key) return;
      processedKey.current = key;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const stored = parseAdaptiveRankingSnapshot(raw);
      setResult(decideAdaptiveRankingChange(stored, { topicId: primaryTopicId, subject: primarySubject }, today));
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ topicId: primaryTopicId, subject: primarySubject, date: today } satisfies StoredPrimary),
      );
    } catch {
      // Privacy mode / storage disabled — no comparison possible.
      setResult({ changed: false });
    }
  }, [primarySubject, primaryTopicId]);

  return result;
}
