import React, { useState } from 'react';
import type { PodcastEpisode } from '../../types';
import type { PersonalPodcast } from './types';
import { Download, Headphones, RotateCcw, RotateCw } from 'lucide-react';
import { PodcastSelect } from './PodcastSettingsPanel';
export function downloadPodcastText(episode: PodcastEpisode) {
  const url = URL.createObjectURL(new Blob([episode.script], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a'); link.href = url; link.download = `${episode.title.replace(/[^\p{L}\p{N} -]/gu, '').slice(0, 80) || 'podcast'}.txt`; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function PodcastPlayer({ episode, audioUrl, audioRef, audioLoading, requestDisabled, onRequestAudio, onEnded, onPlay, onPause, onError }: { episode: PodcastEpisode | null; audioUrl: string | null; audioRef: React.RefObject<HTMLAudioElement | null>; audioLoading: boolean; requestDisabled: boolean; onRequestAudio: () => void; onEnded: () => void; onPlay: () => void; onPause: () => void; onError: () => void }) {
  const [rate, setRate] = useState('1');
  const personal = episode && 'settings' in episode ? episode as PersonalPodcast : null;
  const skip = (seconds: number) => { const audio = audioRef.current; if (audio && Number.isFinite(audio.duration)) audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds)); };
  return <section className={`ni-panel p-5 space-y-4 mb-5 ${episode ? '' : 'hidden'}`} aria-label="Player do podcast">
    <div className="flex items-start gap-3"><Headphones className="shrink-0 mt-1" size={20} /><div className="min-w-0"><p className="text-[10px] uppercase tracking-widest text-[var(--dim)]">Seu momento de estudo</p><h2 className="text-lg font-semibold break-words">{episode?.title}</h2>{personal && <p className="text-xs text-[var(--dim)] mt-1">{personal.settings.speakers} {personal.settings.speakers === 1 ? 'pessoa' : 'pessoas'} · {personal.settings.durationMinutes} min planejados · {personal.settings.exam}</p>}</div></div>
    {episode && !audioUrl && <div className="space-y-2"><p className="text-sm text-[var(--dim)]">O roteiro está pronto. Gere o áudio para ouvir.</p><button type="button" disabled={audioLoading || requestDisabled} onClick={onRequestAudio} className="border border-[var(--line)] rounded-xl px-4 py-3 text-sm disabled:opacity-50">{audioLoading ? 'Gerando áudio…' : 'Gerar áudio e ouvir'}</button></div>}
    <audio ref={audioRef} src={audioUrl ?? undefined} controls={Boolean(audioUrl)} hidden={!audioUrl} onPlay={onPlay} onPause={onPause} onLoadedMetadata={() => { if (audioRef.current) audioRef.current.playbackRate = Number(rate); }} onEnded={onEnded} onError={audioUrl ? onError : undefined} className="w-full" aria-label={`Áudio de ${episode?.title ?? 'podcast'}`} />
    {audioUrl && <div className="flex flex-wrap items-end gap-3"><button type="button" onClick={() => skip(-15)} aria-label="Voltar 15 segundos" className="border border-[var(--line)] rounded-xl p-3"><RotateCcw size={16} /></button><button type="button" onClick={() => skip(15)} aria-label="Avançar 15 segundos" className="border border-[var(--line)] rounded-xl p-3"><RotateCw size={16} /></button><div className="w-40"><PodcastSelect label="Velocidade de reprodução" value={rate} choices={{ '0.75': '0,75×', '1': '1×', '1.25': '1,25×', '1.5': '1,5×', '2': '2×' }} onChange={v => { setRate(v); if (audioRef.current) audioRef.current.playbackRate = Number(v); }} /></div><a href={audioUrl} download="podcast-crivo.wav" className="inline-flex items-center gap-2 border border-[var(--line)] rounded-xl px-3 py-2.5 text-sm"><Download size={15} /> Baixar áudio</a></div>}
    {episode && <details className="border-t border-[var(--line)] pt-3"><summary className="cursor-pointer text-sm font-medium">Transcrição e fontes</summary><p className="text-xs text-[var(--dim)] my-3">{personal?.sourceLabels.length ? `Fontes: ${personal.sourceLabels.join(' · ')}` : 'Roteiro geral do tema, sem material específico selecionado.'}</p><p className="whitespace-pre-wrap text-sm leading-7">{episode.script}</p><button type="button" className="mt-4 text-sm underline underline-offset-4" onClick={() => downloadPodcastText(episode)}>Baixar roteiro</button></details>}
  </section>;
}
