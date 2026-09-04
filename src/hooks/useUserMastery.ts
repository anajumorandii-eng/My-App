import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserMastery, updateUserMastery } from '../lib/userData';
import { mockMastery } from '../data/mockData';
import { TopicMastery } from '../types';

export function useUserMastery() {
  const { user } = useAuth();
  const [mastery, setMastery] = useState<TopicMastery[]>(mockMastery);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
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
      setMastery(mockMastery);
      setSyncError(null);
      setPendingWrites(0);
      return;
    }

    let cancelled = false;
    setLoading(true);
    getUserMastery(user.uid)
      .then((data) => {
        if (!cancelled) {
          setMastery(data);
          setUsingFallback(false);
        }
      })
      .catch((error) => {
        console.error('Failed to load user mastery:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seu progresso salvo. Mostrando dados de demonstração.');
        if (!cancelled) setUsingFallback(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const updateMastery = useCallback(
    (updater: (prev: TopicMastery[]) => TopicMastery[]): Promise<boolean> => {
      setMastery((prev) => updater(prev));
      if (!user) return Promise.resolve(true);

      const revision = ++localRevision.current;
      const operationUid = user.uid;
      pendingWritesRef.current += 1;
      setPendingWrites(pendingWritesRef.current);
      setSyncError(null);
      return updateUserMastery(operationUid, updater)
        .then((committed) => {
          // Do not replace a newer optimistic state with an older transaction
          // result. The newest transaction will reconcile the UI when it ends.
          if (activeUid.current === operationUid && revision === localRevision.current) {
            setMastery(committed);
            setSyncError(null);
          }
          return true;
        })
        .catch((error) => {
          console.error('Failed to save user mastery:', error);
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
              void getUserMastery(operationUid).then((authoritative) => {
                if (activeUid.current === operationUid && localRevision.current === refreshRevision) {
                  setMastery(authoritative);
                }
              }).catch((error) => {
                console.error('Failed to reconcile user mastery after save:', error);
                if (activeUid.current === operationUid && localRevision.current === refreshRevision) {
                  setSyncError('Não foi possível confirmar o progresso salvo. Recarregue a página.');
                }
              });
            }
          }
        });
    },
    [user]
  );

  const acceptCommittedMastery = useCallback((uid: string, committed: TopicMastery[]) => {
    if (activeUid.current !== uid) return false;
    localRevision.current += 1;
    setMastery(committed);
    setSyncError(null);
    return true;
  }, []);

    // "Dados salvos" e "estou logada" não são a mesma coisa: quando a leitura do
  // Firestore falha, a tela continua mostrando os dados de demonstração, e com
  // isPersisted={!!user} o aviso de "Modo demonstração" ficava escondido
  // justamente aí — a aluna via números inventados sem nada dizendo isso.
return { mastery, updateMastery, acceptCommittedMastery, loading, syncError, syncing: pendingWrites > 0, isPersisted: !!user && !usingFallback };
}
