import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { requestAiText } from '../lib/aiClient';
import { synthesizePodcastAudio, podcastAudioErrorMessage } from '../lib/podcastAudio';
import { useUserProfile } from '../hooks/useUserProfile';
import { usePodcastEpisodes } from '../hooks/usePodcastEpisodes';
import { PodcastEpisode, UserProfile } from '../types';
import { Headphones, Play, Square, Volume2, Sparkles, Clock, Mic, Loader2 } from 'lucide-react';
import { getMotionConfigForSubject } from '../design-system/crivoMotionPresets';
import { motion } from 'motion/react';

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  Matemática: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
  Física: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  Química: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
  Geografia: 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300',
  História: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300',
  Português: 'bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300',
  Inglês: 'bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300',
  Filosofia: 'bg-stone-50 dark:bg-stone-900/20 text-stone-700 dark:text-stone-300',
  Sociologia: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300',
};

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

// Curated subset of Gemini's prebuilt voices — matches server/podcast/routes.ts.
const VOICE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Charon', label: 'Charon (informativa)' },
  { value: 'Kore', label: 'Kore (firme)' },
  { value: 'Aoede', label: 'Aoede (leve)' },
  { value: 'Puck', label: 'Puck (animada)' },
];
const DEFAULT_VOICE = 'Charon';

const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

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
      const data = await requestAiText('podcast-script', { title, subject, topic: topicName });
      setAiScripts((prev) => ({ ...prev, [episodeId]: data.text }));
    } catch (error) {
      console.error('Failed to generate podcast script:', error);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Síntese Auditiva & Voz Neural · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <Headphones className="w-7 h-7 text-action-primary" />
          Podcast Crivo
        </h1>
        <p className="text-text-secondary mt-1 max-w-2xl text-base">
          Resumos em áudio dos seus tópicos, narrados com voz neural de alta fidelidade — ótimo para revisar no trajeto.
        </p>
        {episodesSyncError && <p className="text-xs text-status-error mt-2">{episodesSyncError}</p>}
      </header>

      {notice && (
        <div className="p-4 rounded-xl bg-status-warning/10 text-status-warning border border-status-warning/20 text-sm">
          {notice}
        </div>
      )}

      <div className="bg-surface-default border border-border-subtle rounded-2xl p-6 shadow-soft-sm space-y-4">
        <div>
          <div className="flex items-center text-xs font-mono uppercase tracking-wider text-text-muted mb-2">
            <Mic className="w-4 h-4 mr-2 text-ember-500" />
            Voz do narrador
          </div>
          <div className="flex flex-wrap gap-2">
            {VOICE_OPTIONS.map(({ value, label }) => {
              const active = voiceName === value;
              return (
                <button
                  key={value}
                  onClick={() => setVoiceName(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-mono tracking-wide transition-all ${
                    active
                      ? 'bg-action-primary text-warm-50 font-bold shadow-sm ring-1 ring-white/20'
                      : 'border border-border-subtle hover:border-text-primary text-text-muted hover:text-text-primary bg-surface-default/70'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Episódios já ouvidos com a voz atual tocam na hora; trocar a voz gera um novo áudio na próxima vez que você apertar play.
          </p>
        </div>

        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            <Clock className="w-4 h-4 mr-2 text-indigo-500" />
            Duração preferida
          </div>
          <div className="flex flex-wrap gap-2">
            {DURATION_BUCKETS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDurationPreference(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  durationPreference === value
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {durationPreference
              ? `Mostrando primeiro os ${matchingCount} de ${mockPodcastEpisodes.length} episódios nessa faixa de duração — os demais continuam logo abaixo, nada fica escondido.`
              : 'Sem preferência: os episódios aparecem na ordem padrão. Escolha uma faixa para trazer episódios dessa duração para o topo da lista.'}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {orderedEpisodes.map((episode, index) => {
          const isPlaying = playingId === episode.id;
          const isLoadingAudio = loadingId === episode.id;
          const isGenerating = generatingId === episode.id;
          const aiScript = aiScripts[episode.id];
          const activeScript = aiScript ?? episode.script;
          const matchesPreference = durationPreference !== null && bucketOf(episode.durationMinutes) === durationPreference;
          const mConfig = getMotionConfigForSubject(episode.subject);
          return (
            <motion.div
              key={episode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileHover={mConfig.hoverProps.whileHover}
              className="bg-surface-default border border-border-subtle rounded-xl p-5 shadow-soft-sm hover:border-action-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center min-w-0">
                  <button
                    onClick={() => play(episode.id, activeScript)}
                    disabled={isLoadingAudio}
                    className={`w-11 h-11 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${
                      isPlaying
                        ? 'bg-action-primary text-warm-50 shadow-md'
                        : 'bg-surface-secondary text-text-primary hover:bg-surface-strong'
                    } disabled:opacity-40`}
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
                    <h4 className="font-semibold text-text-primary truncate flex items-center">
                      {episode.title}
                      {isPlaying && <Volume2 className="w-4 h-4 ml-2 text-action-primary animate-pulse shrink-0" />}
                    </h4>
                    <div className="flex items-center text-xs text-text-muted mt-1 space-x-2 font-mono">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${SUBJECT_COLORS[episode.subject] ?? ''}`}>
                        {episode.subject}
                      </span>
                      <span>•</span>
                      <span>{episode.durationMinutes} min</span>
                      {matchesPreference && (
                        <>
                          <span>•</span>
                          <span className="flex items-center text-ember-600 dark:text-ember-400">
                            <Clock className="w-3 h-3 mr-1" />
                            Duração preferida
                          </span>
                        </>
                      )}
                      {aiScript && (
                        <>
                          <span>•</span>
                          <span className="flex items-center text-action-primary">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Roteiro gerado por IA
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => generateScript(episode.id, episode.title, episode.subject, episode.topicId)}
                  disabled={isGenerating}
                  className="shrink-0 ml-4 flex items-center px-3 py-2 text-xs font-mono font-medium text-action-primary border border-border-subtle rounded-lg hover:bg-surface-secondary disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${isGenerating ? 'animate-pulse' : ''}`} />
                  {isGenerating ? 'Gerando...' : aiScript ? 'Gerar novo' : 'Gerar com IA'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
