import { useEffect, useRef, useState } from 'react';
import { collection, doc, getDocs, limit, orderBy, query, setDoc, startAfter, type QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firestore';
import type { PersonalPodcast } from '../features/podcast/types';
const PAGE_SIZE = 30;
const mergeEpisodes = (a: PersonalPodcast[], b: PersonalPodcast[]) => [...new Map([...b, ...a].map(ep => [ep.id, ep])).values()].sort((x, y) => y.createdAt.localeCompare(x.createdAt));

export function usePersonalPodcasts() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const account = useRef(uid); account.current = uid;
  const version = useRef(0);
  const cursor = useRef<QueryDocumentSnapshot | null>(null);
  const reading = useRef(false);
  const unsaved = useRef(new Map<string, PersonalPodcast>());
  const pending = useRef(new Set<string>());
  const [state, setState] = useState<{ uid: string | null; episodes: PersonalPodcast[] }>({ uid, episodes: [] });
  const [syncError, setSyncError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = ++version.current;
    const current = () => token === version.current && account.current === uid;
    cursor.current = null; reading.current = false; unsaved.current.clear(); pending.current.clear();
    setState({ uid, episodes: [] }); setSyncError(null); setHasMore(false); setPendingCount(0);
    setLoading(Boolean(uid));
    if (uid) {
      reading.current = true;
      getDocs(query(collection(db, 'users', uid, 'podcasts'), orderBy('createdAt', 'desc'), limit(PAGE_SIZE)))
        .then(snap => { if (!current()) return; cursor.current = snap.docs.at(-1) ?? null; setHasMore(snap.docs.length === PAGE_SIZE); setState(prev => ({ uid, episodes: mergeEpisodes(prev.uid === uid ? prev.episodes : [], snap.docs.map(d => d.data() as PersonalPodcast)) })); })
        .catch(() => { if (current()) setSyncError('Não foi possível carregar seus podcasts salvos.'); })
        .finally(() => { if (current()) { reading.current = false; setLoading(false); } });
    }
    return () => { version.current++; };
  }, [uid]);

  const loadMore = async () => {
    if (!uid || !cursor.current || reading.current || !hasMore) return;
    const token = version.current; reading.current = true; setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, 'users', uid, 'podcasts'), orderBy('createdAt', 'desc'), startAfter(cursor.current), limit(PAGE_SIZE)));
      if (version.current !== token || account.current !== uid) return;
      cursor.current = snap.docs.at(-1) ?? cursor.current; setHasMore(snap.docs.length === PAGE_SIZE);
      setState(prev => ({ uid, episodes: mergeEpisodes(prev.episodes, snap.docs.map(d => d.data() as PersonalPodcast)) }));
    } catch { if (version.current === token) setSyncError('Não foi possível carregar mais episódios. Tente novamente.'); }
    finally { if (version.current === token) { reading.current = false; setLoading(false); } }
  };
  const saveEpisode = (episode: PersonalPodcast) => {
    const owner = uid; const token = version.current;
    if (account.current !== owner) return;
    setState(prev => ({ uid: owner, episodes: mergeEpisodes(prev.uid === owner ? prev.episodes : [], [episode]) }));
    if (!owner || pending.current.has(episode.id)) return;
    unsaved.current.set(episode.id, episode); pending.current.add(episode.id); setPendingCount(pending.current.size);
    // A confirmação do Firestore pode ficar pendente offline. O roteiro já
    // está disponível; a sincronização tem seu próprio estado na biblioteca.
    void setDoc(doc(db, 'users', owner, 'podcasts', episode.id), episode)
      .then(() => { if (version.current === token) { unsaved.current.delete(episode.id); if (!unsaved.current.size) setSyncError(null); } })
      .catch(() => { if (version.current === token) setSyncError('Não foi possível salvar alguns episódios na conta. Você pode tentar salvar novamente ou baixar o roteiro.'); })
      .finally(() => { if (version.current === token) { pending.current.delete(episode.id); setPendingCount(pending.current.size); } });
  };
  const retrySaves = () => { for (const episode of unsaved.current.values()) saveEpisode(episode); };
  return { episodes: state.uid === uid ? state.episodes : [], saveEpisode, syncError, pendingCount, hasMore, loading, loadMore, retrySaves };
}
