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

  useEffect(() => {
    if (!user) {
      setProfile(mockProfile);
      setSyncError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    getUserProfile(user.uid)
      .then((data) => { if (!cancelled) setProfile(data); })
      .catch((error) => {
        console.error('Failed to load user profile:', error);
        if (!cancelled) setSyncError('Não foi possível carregar seu perfil salvo. Mostrando dados de demonstração.');
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  const updateProfile = useCallback(
    (updater: (prev: UserProfile) => UserProfile) => {
      setProfile((prev) => {
        const next = updater(prev);
        if (user) {
          saveUserProfile(user.uid, next).catch((error) => {
            console.error('Failed to save user profile:', error);
            setSyncError('Não foi possível salvar essa alteração. Ela pode não persistir.');
          });
        }
        return next;
      });
    },
    [user]
  );

  return { profile, updateProfile, loading, syncError, isPersisted: !!user };
}
