import { useEffect, useState } from 'react';
import { PodcastEpisode } from '../types';
import { mockPodcastEpisodes } from '../data/mockData';
import { getPodcastEpisodes } from '../lib/contentCatalog';

// Ver useQuestions.ts para o raciocínio do padrão de fallback.
export function usePodcastEpisodes(): { episodes: PodcastEpisode[]; syncError: string | null } {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(mockPodcastEpisodes);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getPodcastEpisodes()
      .then((data) => {
        if (cancelled) return;
        if (data.length > 0) setEpisodes(data);
      })
      .catch((error) => {
        console.error('Failed to load podcast episodes from Firestore:', error);
        if (!cancelled) setSyncError('Não foi possível carregar os episódios atualizados. Mostrando o conjunto local.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { episodes, syncError };
}
