import React, { useEffect, useState } from 'react';
import { mockPodcastEpisodes } from '../data/mockData';
import { Headphones, Play, Square, Volume2 } from 'lucide-react';

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  Matemática: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
  Física: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
};

const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

export default function Podcast() {
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (speechSupported) window.speechSynthesis.cancel();
    };
  }, []);

  const play = (episodeId: string, script: string) => {
    if (!speechSupported) return;
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
  };

  const stop = () => {
    if (speechSupported) window.speechSynthesis.cancel();
    setPlayingId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <Headphones className="w-7 h-7 mr-3 text-indigo-500" />
          Podcast JUJU
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Resumos em áudio dos seus tópicos, narrados direto no navegador — ótimo para revisar no trajeto.
        </p>
      </header>

      {!speechSupported && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
          Seu navegador não tem suporte a narração por voz (Web Speech API). Tente em outro navegador para ouvir os episódios.
        </div>
      )}

      <div className="space-y-3">
        {mockPodcastEpisodes.map((episode) => {
          const isPlaying = playingId === episode.id;
          return (
            <div
              key={episode.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center min-w-0">
                <button
                  onClick={() => (isPlaying ? stop() : play(episode.id, episode.script))}
                  disabled={!speechSupported}
                  className={`w-11 h-11 rounded-full flex items-center justify-center mr-4 shrink-0 transition-colors ${
                    isPlaying
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  } disabled:opacity-40`}
                >
                  {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="min-w-0">
                  <h4 className="font-semibold truncate flex items-center">
                    {episode.title}
                    {isPlaying && <Volume2 className="w-4 h-4 ml-2 text-indigo-500 animate-pulse shrink-0" />}
                  </h4>
                  <div className="flex items-center text-sm text-zinc-500 mt-1 space-x-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${SUBJECT_COLORS[episode.subject] ?? ''}`}>
                      {episode.subject}
                    </span>
                    <span>•</span>
                    <span>{episode.durationMinutes} min</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
