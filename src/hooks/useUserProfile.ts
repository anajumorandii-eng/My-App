import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, saveUserProfile } from '../lib/userData';
import { mockProfile } from '../data/mockData';
import { UserProfile } from '../types';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(mockProfile);
  const [loading, setLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    if (!user) {
      setProfile(mockProfile);
      setSyncError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getUserProfile(user.uid)
      .then((data) => { if (!cancelled) { setProfile(data); setUsingFallback(false); } })
      .catch((error) => {
        console.error('Failed to load user profile:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seu perfil salvo. Mostrando dados de demonstração.');
        if (!cancelled) setUsingFallback(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const updateProfile = useCallback(
    (updater: (prev: UserProfile) => UserProfile) => {
      setProfile((prev) => {
        const next = updater(prev);
        if (user) {
          saveUserProfile(user.uid, next)
            .then(() => setSyncError(null))
            .catch((error) => {
              console.error('Failed to save user profile:', error);
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
return { profile, updateProfile, loading, syncError, isPersisted: !!user && !usingFallback };
}
