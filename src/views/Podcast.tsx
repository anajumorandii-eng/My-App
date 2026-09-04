import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { requestAiTextStream } from '../lib/aiClient';
import { synthesizePodcastAudio, podcastAudioErrorMessage } from '../lib/podcastAudio';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePodcastEpisodes } from '../hooks/usePodcastEpisodes';
import { PodcastEpisode, UserProfile } from '../types';
import { Headphones, Play, Square, Volume2, Sparkles, Clock, Mic, Loader2 } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

type DurationBucket = 'curto' | 'medio' | 'longo';

const DURATION_BUCKETS: { value: DurationBucket; label: string; test: (minutes: number) => boolean }[] = [
  { value: 'curto', label: 'Curtos (até 5 min)', test: (m) => m <= 5 },
  { value: 'medio', label: 'Médios (6 min)', test: (m) => m === 6 },
  { value: 'longo', label: 'Longos (7+ min)', test: (m) => m >= 7 },
];

function bucketOf(minutes: number): DurationBucket {
  return DURATION_BUCKETS.find((b) => b.test(minutes))?.value ?? 'medio';
}

function orderByDurationPreference(
  episodes: PodcastEpisode[],
  preference: UserProfile['podcastDurationPreference']
): PodcastEpisode[] {
  if (!preference) return episodes;
  const matching = episodes.filter((e) => bucketOf(e.durationMinutes) === preference);
  const rest = episodes.filter((e) => bucketOf(e.durationMinutes) !== preference);
  return [...matching, ...rest];
}

const VOICE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Charon', label: 'Charon (informativa)' },
  { value: 'Kore', label: 'Kore (firme)' },
  { value: 'Aoede', label: 'Aoede (leve)' },
  { value: 'Puck', label: 'Puck (animada)' },
];
const DEFAULT_VOICE = 'Charon';

const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
const PODCAST_PALETTE = PALETTES.História;

export default function Podcast() {
  const { profile, updateProfile } = useUserProfile();
  const { episodes: mockPodcastEpisodes, syncError: episodesSyncError } = usePodcastEpisodes();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [aiScripts, setAiScripts] = useState<Record<string, string>>({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());

  const durationPreference = profile.podcastDurationPreference ?? null;
  const voiceName = profile.podcastVoiceName || DEFAULT_VOICE;

  const orderedEpisodes = useMemo(
    () => orderByDurationPreference(mockPodcastEpisodes, durationPreference),
    [mockPodcastEpisodes, durationPreference]
  );

  const matchingCount = useMemo(
    () => (durationPreference ? mockPodcastEpisodes.filter((e) => bucketOf(e.durationMinutes) === durationPreference).length : 0),
    [mockPodcastEpisodes, durationPreference]
  );

  const setDurationPreference = (value: DurationBucket | null) => {
    updateProfile((prev) => ({
      ...prev,
      podcastDurationPreference: prev.podcastDurationPreference === value ? null : value,
    }));
  };

  const setVoiceName = (value: string) => {
    updateProfile((prev) => ({ ...prev, podcastVoiceName: value }));
    setNotice(null);
  };

  useEffect(() => {
    audioRef.current = new Audio();
    const cache = audioCacheRef.current;
    return () => {
      audioRef.current?.pause();
      cache.forEach((url) => URL.revokeObjectURL(url));
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, []);

  const stopAll = () => {
    if (speechSupported) window.speechSynthesis.cancel();
    audioRef.current?.pause();
    setPlayingId(null);
  };

  const playWithBrowserVoice = (episodeId: string, script: string): boolean => {
    if (!speechSupported) return false;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;
    const ptVoice = window.speechSynthesis.getVoices().find((v) => v.lang?.toLowerCase().startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    setPlayingId(episodeId);
    window.speechSynthesis.speak(utterance);
    return true;
  };

  const playObjectUrl = (episodeId: string, url: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = url;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().then(() => setPlayingId(episodeId)).catch(() => setPlayingId(null));
  };

  const play = async (episodeId: string, script: string) => {
    if (playingId === episodeId) {
      stopAll();
      return;
    }
    stopAll();

    const cacheKey = `${episodeId}::${voiceName}::${script}`;
    const cachedUrl = audioCacheRef.current.get(cacheKey);
    if (cachedUrl) {
      playObjectUrl(episodeId, cachedUrl);
      return;
    }

    setLoadingId(episodeId);
    try {
      const blob = await synthesizePodcastAudio(script, voiceName);
      const url = URL.createObjectURL(blob);
      audioCacheRef.current.set(cacheKey, url);
      setNotice(null);
      playObjectUrl(episodeId, url);
    } catch (error) {
      console.error('Failed to synthesize podcast audio:', error);
      const message = podcastAudioErrorMessage(error);
      const fellBack = playWithBrowserVoice(episodeId, script);
      setNotice(fellBack ? `${message} Tocando com a voz do navegador enquanto isso.` : message);
    } finally {
      setLoadingId(null);
    }
  };

  const generateScript = async (episodeId: string, title: string, subject: string, topicId: string) => {
    const topicName = mockTopics.find((t) => t.id === topicId)?.name ?? subject;
    setGeneratingId(episodeId);
    try {
      let acumulado = '';
      const data = await requestAiTextStream('podcast-script', { title, subject, topic: topicName }, (delta) => {
        acumulado += delta;
        setAiScripts((prev) => ({ ...prev, [episodeId]: acumulado }));
      });
      setAiScripts((prev) => ({ ...prev, [episodeId]: data.text }));
    } catch (error) {
      console.error('Failed to generate podcast script:', error);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div
      className="ni-main"
      style={{
        '--primary': PODCAST_PALETTE.primary, '--primary-ink': PODCAST_PALETTE.readable,
        '--secondary': PODCAST_PALETTE.secondary,
        '--wash': PODCAST_PALETTE.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>LIBRARY</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <Headphones className="w-3 h-3" />
          </span>
          ÁUDIO NEURAL
        </span>
        <i />
        <b>PODCAST CRIVO</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Atualidades em áudio, no seu ritmo.</h1>
          <p>Resumos narrados com voz neural de alta fidelidade — perfeito para assimilar e revisar no trajeto.</p>
        </div>
        <div className="ni-state">
          <i /> {orderedEpisodes.length} episódios · Crivo Audio
        </div>
      </div>

      {episodesSyncError && <p className="text-xs text-rose-500 mb-2">{episodesSyncError}</p>}

      {notice && (
        <div className="p-3 mb-4 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs">
          {notice}
        </div>
      )}

      {/* Settings Panel */}
      <Panel subject="História" className="ni-panel p-5 mb-4 space-y-4">
        <div>
          <div className="flex items-center text-xs font-mono uppercase tracking-wider text-[var(--dim)] mb-2">
            <Mic className="w-3.5 h-3.5 mr-1.5 subject-text" />
            Voz do narrador
          </div>
          <div className="ni-subjects" style={{ margin: 0 }}>
            {VOICE_OPTIONS.map(({ value, label }) => {
              const active = voiceName === value;
              return (
                <button
                  key={value}
                  onClick={() => setVoiceName(value)}
                  style={
                    active
                      ? { backgroundColor: PODCAST_PALETTE.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                      : undefined
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border-t border-[var(--line)] pt-3">
          <div className="flex items-center text-xs font-medium text-[var(--dim)] mb-2">
            <Clock className="w-3.5 h-3.5 mr-1.5 subject-text" />
            Duração preferida
          </div>
          <div className="ni-subjects" style={{ margin: 0 }}>
            {DURATION_BUCKETS.map(({ value, label }) => {
              const active = durationPreference === value;
              return (
                <button
                  key={value}
                  onClick={() => setDurationPreference(value)}
                  style={
                    active
                      ? { backgroundColor: PODCAST_PALETTE.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                      : undefined
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-[var(--dim)] mt-2">
            {durationPreference
              ? `Priorizando ${matchingCount} de ${mockPodcastEpisodes.length} episódios na faixa selecionada.`
              : 'Mostrando episódios na ordem cronológica.'}
          </p>
        </div>
      </Panel>

      {/* Episode list */}
      <div className="space-y-3">
        {orderedEpisodes.map((episode) => {
          const isPlaying = playingId === episode.id;
          const isLoadingAudio = loadingId === episode.id;
          const isGenerating = generatingId === episode.id;
          const aiScript = aiScripts[episode.id];
          const activeScript = aiScript ?? episode.script;
          const matchesPreference = durationPreference !== null && bucketOf(episode.durationMinutes) === durationPreference;
          const subPal = PALETTES[episode.subject] ?? PALETTES.Matemática;
          const SubIcon = SUBJECT_ICONS[episode.subject] ?? Headphones;

          return (
            <Panel
              key={episode.id}
              subject={episode.subject}
              interactive
              className="ni-panel p-4 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <button
                    onClick={() => play(episode.id, activeScript)}
                    disabled={isLoadingAudio}
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3.5 shrink-0 transition-colors"
                    style={{
                      backgroundColor: isPlaying ? subPal.primary : 'var(--surface2)',
                      color: isPlaying ? PALETTE_INK : 'var(--text)',
                    }}
                  >
                    {isLoadingAudio ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isPlaying ? (
                      <Square className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5" />
                    )}
                  </button>
                  <div className="min-w-0">
                    <h4 className="font-display font-medium text-sm text-[var(--text)] truncate flex items-center">
                      {episode.title}
                      {isPlaying && <Volume2 className="w-3.5 h-3.5 ml-2 subject-text animate-pulse shrink-0" />}
                    </h4>
                    <div className="flex items-center text-[11px] text-[var(--dim)] mt-0.5 space-x-2 font-mono">
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold"
                        style={{ backgroundColor: subPal.primary, color: PALETTE_INK }}
                      >
                        <SubIcon className="w-2.5 h-2.5" />
                        {episode.subject}
                      </span>
                      <span>•</span>
                      <span>{episode.durationMinutes} min</span>
                      {matchesPreference && (
                        <>
                          <span>•</span>
                          <span className="flex items-center subject-text">
                            <Clock className="w-3 h-3 mr-1" />
                            Faixa preferida
                          </span>
                        </>
                      )}
                      {aiScript && (
                        <>
                          <span>•</span>
                          <span className="flex items-center subject-text">
                            <Sparkles className="w-3 h-3 mr-1" />
                            IA
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => generateScript(episode.id, episode.title, episode.subject, episode.topicId)}
                  disabled={isGenerating}
                  className="shrink-0 ml-3 flex items-center px-2.5 py-1 text-xs font-mono subject-text border border-[var(--line)] rounded-lg hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3 h-3 mr-1 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'Gerando...' : aiScript ? 'Regerar' : 'Gerar IA'}
                </button>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
