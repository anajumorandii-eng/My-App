import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserMastery, saveUserMastery } from '../lib/userData';
import { mockMastery } from '../data/mockData';
import { TopicMastery } from '../types';

export function useUserMastery() {
  const { user } = useAuth();
  const [mastery, setMastery] = useState<TopicMastery[]>(mockMastery);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMastery(mockMastery);
      setSyncError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getUserMastery(user.uid)
      .then((data) => {
        if (!cancelled) setMastery(data);
      })
      .catch((error) => {
        console.error('Failed to load user mastery:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seu progresso salvo. Mostrando dados de demonstração.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const updateMastery = useCallback(
    (updater: (prev: TopicMastery[]) => TopicMastery[]) => {
      setMastery((prev) => {
        const next = updater(prev);
        if (user) {
          saveUserMastery(user.uid, next)
            .then(() => setSyncError(null))
            .catch((error) => {
              console.error('Failed to save user mastery:', error);
              setSyncError('Não foi possível salvar essa alteração. Ela pode não persistir.');
            });
        }
        return next;
      });
    },
    [user]
  );

  return { mastery, updateMastery, loading, syncError, isPersisted: !!user };
}
