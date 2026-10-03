import { useEffect, useState } from 'react';
import { PodcastEpisode } from '../types';
import { mockPodcastEpisodes } from '../data/mockData';
import { getPodcastEpisodes } from '../lib/contentCatalog';
import { useAuth } from '../context/AuthContext';

export function usePodcastEpisodes(): { episodes: PodcastEpisode[]; syncError: string | null } {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const [state, setState] = useState<{ uid: string | null; episodes: PodcastEpisode[]; syncError: string | null }>({ uid: null, episodes: mockPodcastEpisodes, syncError: null });

  useEffect(() => {
    let cancelled = false;
    setState({ uid, episodes: mockPodcastEpisodes, syncError: null });
    // As regras exigem autenticação. Consultar antes da restauração da sessão
    // deixava um erro de permissão permanente, mesmo após o login terminar.
    if (uid) {
      getPodcastEpisodes()
        .then((data) => {
          if (!cancelled) setState({ uid, episodes: data.length ? data : mockPodcastEpisodes, syncError: null });
        })
        .catch((error) => {
          if (cancelled) return;
          console.error('Failed to load podcast episodes from Firestore:', error);
          setState({ uid, episodes: mockPodcastEpisodes, syncError: 'Não foi possível carregar os episódios atualizados. Mostrando o conjunto local.' });
        });
    }
    return () => { cancelled = true; };
  }, [uid]);

  return state.uid === uid ? { episodes: state.episodes, syncError: state.syncError } : { episodes: mockPodcastEpisodes, syncError: null };
}
