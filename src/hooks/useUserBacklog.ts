import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBacklog, updateUserBacklog } from '../lib/userData';
import { mockBacklog } from '../data/mockData';
import { BacklogItem } from '../types';

export function useUserBacklog() {
  const { user } = useAuth();
  const [backlog, setBacklog] = useState<BacklogItem[]>(mockBacklog);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [pendingWrites, setPendingWrites] = useState(0);
  const pendingWritesRef = useRef(0);
  const localRevision = useRef(0);
  const activeUid = useRef<string | null>(null);

  const uid = user?.uid ?? null;
  if (activeUid.current !== uid) {
    activeUid.current = uid;
    localRevision.current += 1;
  }

  useEffect(() => {
    pendingWritesRef.current = 0;
    setPendingWrites(0);
    if (!user) {
      setBacklog(mockBacklog);
      setSyncError(null);
      setPendingWrites(0);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getUserBacklog(user.uid)
      .then((data) => { if (!cancelled) setBacklog(data); })
      .catch((error) => {
        console.error('Failed to load user backlog:', error);
        if (!cancelled) setSyncError('Não foi possível carregar sua fila de recuperação salva. Mostrando dados de demonstração.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const updateBacklog = useCallback(
    (updater: (prev: BacklogItem[]) => BacklogItem[]): Promise<boolean> => {
      setBacklog((prev) => updater(prev));
      if (!user) return Promise.resolve(true);

      const revision = ++localRevision.current;
      const operationUid = user.uid;
      pendingWritesRef.current += 1;
      setPendingWrites(pendingWritesRef.current);
      setSyncError(null);
      return updateUserBacklog(operationUid, updater)
        .then((committed) => {
          if (activeUid.current === operationUid && revision === localRevision.current) {
            setBacklog(committed);
            setSyncError(null);
          }
          return true;
        })
        .catch((error) => {
          console.error('Failed to save user backlog:', error);
          if (activeUid.current === operationUid && revision === localRevision.current) {
            setSyncError('Não foi possível salvar essa alteração. Ela pode não persistir.');
          }
          return false;
        })
        .finally(() => {
          if (activeUid.current === operationUid) {
            pendingWritesRef.current = Math.max(0, pendingWritesRef.current - 1);
            setPendingWrites(pendingWritesRef.current);
            if (pendingWritesRef.current === 0) {
              const refreshRevision = localRevision.current;
              void getUserBacklog(operationUid).then((authoritative) => {
                if (activeUid.current === operationUid && localRevision.current === refreshRevision) {
                  setBacklog(authoritative);
                }
              }).catch((error) => {
                console.error('Failed to reconcile user backlog after save:', error);
                if (activeUid.current === operationUid && localRevision.current === refreshRevision) {
                  setSyncError('Não foi possível confirmar a fila salva. Recarregue a página.');
                }
              });
            }
          }
        });
    },
    [user]
  );

  const acceptCommittedBacklog = useCallback((uid: string, committed: BacklogItem[]) => {
    if (activeUid.current !== uid) return false;
    localRevision.current += 1;
    setBacklog(committed);
    setSyncError(null);
    return true;
  }, []);

  return { backlog, updateBacklog, acceptCommittedBacklog, loading, syncError, syncing: pendingWrites > 0, isPersisted: !!user };
}
