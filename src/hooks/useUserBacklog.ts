import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserBacklog, saveUserBacklog } from '../lib/userData';
import { mockBacklog } from '../data/mockData';
import { BacklogItem } from '../types';

export function useUserBacklog() {
  const { user } = useAuth();
  const [backlog, setBacklog] = useState<BacklogItem[]>(mockBacklog);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBacklog(mockBacklog);
      setSyncError(null);
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
    (updater: (prev: BacklogItem[]) => BacklogItem[]) => {
      setBacklog((prev) => {
        const next = updater(prev);
        if (user) {
          saveUserBacklog(user.uid, next)
            .then(() => setSyncError(null))
            .catch((error) => {
              console.error('Failed to save user backlog:', error);
              setSyncError('Não foi possível salvar essa alteração. Ela pode não persistir.');
            });
        }
        return next;
      });
    },
    [user]
  );

  return { backlog, updateBacklog, loading, syncError, isPersisted: !!user };
}
