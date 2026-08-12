import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDiscursiveAttempts, addUserDiscursiveAttempt } from '../lib/userData';
import { DiscursiveAttempt } from '../types';

export function useDiscursiveAttempts() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState<DiscursiveAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setAttempts([]);
      setSyncError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getUserDiscursiveAttempts(user.uid)
      .then((data) => { if (!cancelled) setAttempts(data); })
      .catch((error) => {
        console.error('Failed to load discursive attempts:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seu histórico de treino. Suas avaliações desta sessão não vão persistir.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const addAttempt = useCallback(
    (attempt: DiscursiveAttempt) => {
      setAttempts((prev) => [attempt, ...prev]);
      if (user) {
        addUserDiscursiveAttempt(user.uid, attempt).catch((error) => {
          console.error('Failed to save discursive attempt:', error);
          setSyncError('Não foi possível salvar essa avaliação. Ela pode não persistir.');
        });
      }
    },
    [user]
  );

  return { attempts, addAttempt, loading, syncError, isPersisted: !!user };
}
