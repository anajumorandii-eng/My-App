import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserDiscursiveAttempts, addUserDiscursiveAttempt } from '../lib/userData';
import { DiscursiveAttempt } from '../types';

export function useDiscursiveAttempts() {
  const { user } = useAuth();
  const currentUid = user?.uid ?? null;
  const owner = useRef(currentUid); owner.current = currentUid;
  const [attempts, setAttempts] = useState<DiscursiveAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!user) {
      setAttempts([]);
      setSyncError(null);
      return;
    }
    let cancelled = false;
    setAttempts([]); setSyncError(null);
    setLoading(true);
    getUserDiscursiveAttempts(user.uid)
      .then((data) => { if (!cancelled) {
        setAttempts(previous => [...new Map([...previous, ...data].map(attempt => [attempt.id, attempt])).values()]);
        setUsingFallback(false);
      } })
      .catch((error) => {
        console.error('Failed to load discursive attempts:', error);
        if (!cancelled) setSyncError('Não foi possível carregar o histórico anterior. Novas avaliações só serão marcadas como salvas após confirmação.');
        if (!cancelled) setUsingFallback(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const addAttempt = useCallback(async (attempt: DiscursiveAttempt): Promise<boolean> => {
    const uid = user?.uid ?? null;
    if (!uid) { setAttempts(previous => [attempt, ...previous]); return true; }
    try {
      await addUserDiscursiveAttempt(uid, attempt);
      if (owner.current !== uid) return false;
      setAttempts(previous => [attempt, ...previous]);
      setSyncError(null);
      return true;
    } catch {
      if (owner.current === uid) setSyncError('Não foi possível salvar essa avaliação. Tente novamente.');
      return false;
    }
  }, [user]);

    // "Dados salvos" e "estou logada" não são a mesma coisa: quando a leitura do
  // Firestore falha, a tela continua mostrando os dados de demonstração, e com
  // isPersisted={!!user} o aviso de "Modo demonstração" ficava escondido
  // justamente aí — a aluna via números inventados sem nada dizendo isso.
return { attempts, addAttempt, loading, syncError, isPersisted: !!user && !usingFallback };
}
