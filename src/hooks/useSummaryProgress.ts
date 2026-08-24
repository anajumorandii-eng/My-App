import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { emptySummaryProgress, normalizeSummaryProgressMap } from '../lib/summaryEngine';
import { migrateSummaryProgressMap } from '../lib/summaryStudy';
import { getUserSummaryProgress, saveUserSummaryProgress } from '../lib/userData';
import { interactiveSummaries } from '../data/interactiveSummaries';
import type { SummaryProgress, SummaryProgressMap } from '../types/summary';

const STORAGE_KEY = 'juju_summary_progress_v1';
function readLocal(): SummaryProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return migrateSummaryProgressMap(normalizeSummaryProgressMap(parsed), interactiveSummaries);
  } catch { return {}; }
}

export function useSummaryProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<SummaryProgressMap>({});
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setSyncError(null);
    const local = readLocal();
    if (!user) { setProgress(local); setLoading(false); return; }
    getUserSummaryProgress(user.uid).then((remote) => {
      if (cancelled) return;
      const merged = migrateSummaryProgressMap({ ...local, ...normalizeSummaryProgressMap(remote) }, interactiveSummaries);
      setProgress(merged); localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }).catch(() => { if (!cancelled) { setProgress(local); setSyncError('Não foi possível sincronizar. Suas ações continuam salvas neste dispositivo.'); } }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const update = useCallback((summaryId: string, updater: (current: SummaryProgress) => SummaryProgress) => {
    setProgress((current) => {
      const next = { ...current, [summaryId]: updater(current[summaryId] ?? emptySummaryProgress()) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      if (user) saveUserSummaryProgress(user.uid, next).catch(() => setSyncError('A sincronização falhou; a alteração ficou salva neste dispositivo.'));
      return next;
    });
  }, [user]);

  return { progress, update, loading, syncError, isCloudSynced: !!user };
}
