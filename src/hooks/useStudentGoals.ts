import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentGoals, saveStudentGoals } from '../lib/userData';
import { mockStudentGoals } from '../data/mockData';
import { StudentGoals } from '../types';

export function useStudentGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StudentGoals>(mockStudentGoals);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!user) {
      setGoals(mockStudentGoals);
      setSyncError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getStudentGoals(user.uid)
      .then((data) => { if (!cancelled) { setGoals(data); setUsingFallback(false); } })
      .catch((error) => {
        console.error('Failed to load student goals:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seus objetivos salvos. Mostrando dados de demonstração.');
        if (!cancelled) setUsingFallback(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const updateGoals = useCallback(
    (updater: (prev: StudentGoals) => StudentGoals) => {
      setGoals((prev) => {
        const next = updater(prev);
        if (user) {
          saveStudentGoals(user.uid, next)
            .then(() => setSyncError(null))
            .catch((error) => {
              console.error('Failed to save student goals:', error);
              setSyncError('Não foi possível salvar essa alteração. Ela pode não persistir.');
            });
        }
        return next;
      });
    },
    [user]
  );

    // "Dados salvos" e "estou logada" não são a mesma coisa: quando a leitura do
  // Firestore falha, a tela continua mostrando os dados de demonstração, e com
  // isPersisted={!!user} o aviso de "Modo demonstração" ficava escondido
  // justamente aí — a aluna via números inventados sem nada dizendo isso.
return { goals, updateGoals, loading, syncError, isPersisted: !!user && !usingFallback };
}
