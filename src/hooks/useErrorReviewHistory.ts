import { useStudyDataRevision } from './useStudyDataRevision';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserErrorLogs, saveErrorRevisitResult } from '../lib/userData';
import { isoToLocalDate } from '../features/availability/time';
import type { ErrorLog } from '../types';
import type { ErrorRevisit } from '../lib/reviewInsights';

export function useErrorReviewHistory() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const dataRevision = useStudyDataRevision(uid, 'errors');
  const activeUid = useRef(uid); activeUid.current = uid;
  const writing = useRef(false);
  const [state, setState] = useState<{ uid: string | null; errors: ErrorLog[] }>({ uid: null, errors: [] });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [warning, setWarning] = useState('');
  useEffect(() => {
    let cancelled = false;
    setState({ uid, errors: [] }); setWarning(''); setLoading(Boolean(uid)); setSaving(null);
    if (uid) {
      getUserErrorLogs(uid).then((errors) => { if (!cancelled) setState({ uid, errors }); })
        .catch(() => { if (!cancelled) setWarning('Não foi possível carregar os erros. Nenhum diagnóstico foi presumido.'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    }
    return () => { cancelled = true; };
  }, [uid, dataRevision]);
  const complete = async (revisit: ErrorRevisit, rating: 'independente' | 'com_ajuda' | 'nao_consegui') => {
    if (!uid || activeUid.current !== uid || writing.current) return false;
    writing.current = true;
    setSaving(revisit.key); setWarning('');
    const completedAt = new Date().toISOString();
    const tomorrow = new Date(`${isoToLocalDate(completedAt)}T12:00:00Z`); tomorrow.setUTCDate(tomorrow.getUTCDate()+1);
    const result = { completedAt, rating, ...(rating === 'independente' ? {} : { nextAttemptDate: tomorrow.toISOString().slice(0,10) }) };
    // Consolidar atraso evita voltar a cobrar D+1 depois de uma tentativa em D+7.
    try {
      for (const day of ['1','3','7'] as const) {
        if (Number(day) <= revisit.day) await saveErrorRevisitResult(uid, revisit.errorId, day, result);
      }
      if (activeUid.current !== uid) return false;
      setState((prev) => ({ ...prev, errors: prev.errors.map((error) => error.id !== revisit.errorId ? error : { ...error, revisitResults: { ...error.revisitResults, ...Object.fromEntries(['1','3','7'].filter((day) => Number(day) <= revisit.day).map((day) => [day, result])) } }) }));
      return true;
    } catch { if (activeUid.current === uid) setWarning('Não foi possível salvar a revisita. Tente novamente.'); return false; }
    finally { writing.current = false; if (activeUid.current === uid) setSaving(null); }
  };
  return { errors: state.uid === uid ? state.errors : [], loading, saving, warning, complete, isPersonal: Boolean(uid) };
}
