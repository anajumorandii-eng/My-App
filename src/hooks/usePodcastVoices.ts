import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchPodcastVoices } from '../lib/podcastAudio';
import type { PodcastVoiceOption } from '../lib/podcastConfig';
export function usePodcastVoices() {
  const { user } = useAuth(); const uid = user?.uid ?? null;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ uid: string | null; voices: PodcastVoiceOption[]; loading: boolean; error: string | null; provider: string }>({ uid: null, voices: [], loading: false, error: null, provider: '' });
  useEffect(() => {
    const controller = new AbortController(); let cancelled = false;
    setState({ uid, voices: [], loading: Boolean(uid), error: null, provider: '' });
    if (uid) {
      fetchPodcastVoices(controller.signal).then(result => { if (!cancelled) setState({ uid, voices: result.voices, loading: false, error: null, provider: result.provider }); })
        .catch(error => { if (!cancelled) setState({ uid, voices: [], loading: false, provider: '', error: error instanceof Error ? error.message : 'Não foi possível consultar as vozes.' }); });
    }
    return () => { cancelled = true; controller.abort(); };
  }, [uid, attempt]);
  const current = state.uid === uid;
  return { voices: current ? state.voices : [], loading: Boolean(uid) && (!current || state.loading), error: current ? state.error : null, provider: current ? state.provider : '', retry: () => setAttempt(n => n + 1) };
}
