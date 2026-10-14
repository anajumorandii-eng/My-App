import { useStudyDataRevision } from './useStudyDataRevision';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentGoals, saveStudentGoals } from '../lib/userData';
import { mockStudentGoals } from '../data/mockData';
import { StudentGoals } from '../types';

export function useStudentGoals() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const dataRevision = useStudyDataRevision(uid, 'goals');
  const currentUid = useRef(uid);
  currentUid.current = uid;
  const latest = useRef<StudentGoals>(mockStudentGoals);
  const acknowledged = useRef<StudentGoals>(mockStudentGoals);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const failedFields = useRef(new Set<keyof StudentGoals>());
  const revisions = useRef(new Map<keyof StudentGoals, number>());
  const session = useRef(0);
  const pending = useRef(0);
  const refreshSequence = useRef(0);
  const readyUid = useRef<string | null>(null);
  const [state, setState] = useState({ uid: null as string | null, value: mockStudentGoals });
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    session.current += 1;
    pending.current = 0;
    queue.current = Promise.resolve();
    failedFields.current.clear();
    revisions.current.clear();
    readyUid.current = null;
    latest.current = mockStudentGoals;
    acknowledged.current = mockStudentGoals;
    setState({ uid, value: mockStudentGoals });
    setSyncError(null);
    setLoading(Boolean(uid));
    if (!uid) return;
    const initialSequence = refreshSequence.current;
    getStudentGoals(uid).then(data => {
      if (cancelled || initialSequence !== refreshSequence.current) return;
      latest.current = data;
      acknowledged.current = data;
      readyUid.current = uid;
      setState({ uid, value: data });
    }).catch(() => {
      if (!cancelled && initialSequence === refreshSequence.current) setSyncError('Não foi possível carregar seus objetivos salvos. A edição está indisponível.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; readyUid.current = null; };
  }, [uid]);

  useEffect(() => {
    if (!uid || dataRevision === 0 || pending.current > 0) return;
    let cancelled = false;
    const revision = new Map(revisions.current);
    const sequence = ++refreshSequence.current;
    void getStudentGoals(uid).then(data => {
      if (cancelled || currentUid.current !== uid || sequence !== refreshSequence.current || pending.current > 0) return;
      if ([...revisions.current].some(([key,value]) => revision.get(key) !== value)) return;
      latest.current = data; acknowledged.current = data;
      readyUid.current = uid;
      setLoading(false);
      setState({ uid, value: data });
    }).catch(() => { if (!cancelled) setSyncError('Não foi possível atualizar os objetivos.'); });
    return () => { cancelled = true; };
  }, [uid, dataRevision]);

  const updateGoals = useCallback(async (updater: (prev: StudentGoals) => StudentGoals): Promise<boolean> => {
    if (currentUid.current !== uid || (uid && readyUid.current !== uid)) return false;
    const requestSession = session.current;
    const prev = latest.current;
    const next = updater(prev);
    const keys = (Object.keys(next) as (keyof StudentGoals)[]);
    const changedKeys = keys.filter(key => !Object.is(prev[key], next[key]));
    const operationRevisions = new Map(changedKeys.map(key => {
      const revision = (revisions.current.get(key) ?? 0) + 1;
      revisions.current.set(key, revision);
      return [key, revision] as const;
    }));
    const patch = Object.fromEntries(changedKeys.map(key => [key, next[key]]));
    latest.current = next;
    setState({ uid, value: next });
    if (!uid) return false;
    if (!Object.keys(patch).length) return false;
    pending.current += 1;
    const operation = queue.current.then(async () => {
      if (currentUid.current !== uid || readyUid.current !== uid || session.current !== requestSession) return false;
      try {
        await saveStudentGoals(uid, patch);
        if (currentUid.current !== uid || readyUid.current !== uid || session.current !== requestSession) return false;
        acknowledged.current = { ...acknowledged.current, ...patch };
        changedKeys.forEach(key => failedFields.current.delete(key));
        if (!failedFields.current.size) setSyncError(null);
        return true;
      } catch {
        if (currentUid.current === uid && readyUid.current === uid && session.current === requestSession) {
          // A rejected write must be retryable without undoing a newer edit.
          const rollback = Object.fromEntries(changedKeys
            .filter(key => revisions.current.get(key) === operationRevisions.get(key))
            .map(key => [key, acknowledged.current[key]]));
          latest.current = { ...latest.current, ...rollback };
          setState({ uid, value: latest.current });
          changedKeys.forEach(key => failedFields.current.add(key));
          setSyncError('Não foi possível salvar essa alteração. Tente novamente.');
        }
        return false;
      }
    });
    queue.current = operation.finally(() => {
      if (currentUid.current === uid && session.current === requestSession) pending.current -= 1;
    });
    return operation;
  }, [uid]);

  const isPersisted = Boolean(uid && state.uid === uid && readyUid.current === uid);
  return { goals: state.uid === uid ? state.value : mockStudentGoals, updateGoals, loading: Boolean(uid && state.uid !== uid) || loading, syncError: state.uid === uid ? syncError : null, isPersisted };
}
