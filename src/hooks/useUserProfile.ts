import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, saveUserProfile } from '../lib/userData';
import { mockProfile } from '../data/mockData';
import { UserProfile } from '../types';

export function useUserProfile() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const currentUid = useRef(uid);
  currentUid.current = uid;
  const latest = useRef<UserProfile>(mockProfile);
  const acknowledged = useRef<UserProfile>(mockProfile);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const failedFields = useRef(new Set<keyof UserProfile>());
  const revisions = useRef(new Map<keyof UserProfile, number>());
  const session = useRef(0);
  const readyUid = useRef<string | null>(null);
  const [state, setState] = useState({ uid: null as string | null, value: mockProfile });
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    session.current += 1;
    queue.current = Promise.resolve();
    failedFields.current.clear();
    revisions.current.clear();
    readyUid.current = null;
    latest.current = mockProfile;
    acknowledged.current = mockProfile;
    setState({ uid, value: mockProfile });
    setSyncError(null);
    setLoading(Boolean(uid));
    if (!uid) return;
    getUserProfile(uid).then(data => {
      if (cancelled) return;
      latest.current = data;
      acknowledged.current = data;
      readyUid.current = uid;
      setState({ uid, value: data });
    }).catch(() => {
      if (!cancelled) setSyncError('Não foi possível carregar seu perfil salvo. A edição está indisponível.');
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; readyUid.current = null; };
  }, [uid]);

  const updateProfile = useCallback(async (updater: (prev: UserProfile) => UserProfile, fields?: readonly (keyof UserProfile)[]): Promise<boolean> => {
    if (currentUid.current !== uid || (uid && readyUid.current !== uid)) return false;
    const requestSession = session.current;
    const prev = latest.current;
    const next = updater(prev);
    const keys = fields ?? (Object.keys(next) as (keyof UserProfile)[]);
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
    const operation = queue.current.then(async () => {
      if (currentUid.current !== uid || readyUid.current !== uid || session.current !== requestSession) return false;
      try {
        await saveUserProfile(uid, patch, true);
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
    queue.current = operation;
    return operation;
  }, [uid]);

  const isPersisted = Boolean(uid && state.uid === uid && readyUid.current === uid);
  return { profile: state.uid === uid ? state.value : mockProfile, updateProfile, loading: Boolean(uid && state.uid !== uid) || loading, syncError: state.uid === uid ? syncError : null, isPersisted };
}
