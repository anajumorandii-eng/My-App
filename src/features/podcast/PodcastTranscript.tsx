import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { activePodcastCue, type PodcastCue } from '../../lib/podcastTiming';
import type { StudyPacket } from '../../lib/studySources';
import { StudySourcesPanel } from '../../components/StudySourcesPanel';

const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
export function PodcastTranscript({ script, episodeKey, audioUrl, audioRef, cues, sourceLabels = [], studyPacket, onDownload, followRequest = 0 }: {
  script: string; episodeKey: string; audioUrl: string | null; audioRef: RefObject<HTMLAudioElement | null>; cues: PodcastCue[];
  sourceLabels?: string[]; studyPacket?: StudyPacket; onDownload: () => void; followRequest?: number;
}) {
  const [open, setOpen] = useState(false), [follow, setFollow] = useState(true), [active, setActive] = useState(-1);
  const region = useRef<HTMLDivElement>(null), id = useId();
  const timed = Boolean(audioUrl && cues.length);
  useEffect(() => {
    const audio = audioRef.current;
    setActive(-1);
    if (!audio || !audioUrl) return;
    const update = () => setActive(activePodcastCue(cues, audio.currentTime));
    const events = ['timeupdate', 'seeking', 'seeked', 'loadedmetadata', 'play', 'pause', 'ended'];
    events.forEach(event => audio.addEventListener(event, update)); if (audio.readyState >= 1) update();
    return () => events.forEach(event => audio.removeEventListener(event, update));
  }, [audioUrl, episodeKey, cues, audioRef]);
  useEffect(() => { if (followRequest) { setOpen(true); setFollow(true); } }, [followRequest]);
  useEffect(() => {
    if (!open || !follow || active < 0 || !timed) return;
    const container = region.current, row = container?.querySelector<HTMLElement>(`[data-cue-index="${active}"]`);
    if (!container || !row) return;
    const viewport = container.getBoundingClientRect(), bounds = row.getBoundingClientRect();
    if (bounds.top < viewport.top || bounds.bottom > viewport.bottom) {
      const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = Math.max(0, container.scrollTop + bounds.top - viewport.top - 12);
      if (container.scrollTo) container.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' }); else container.scrollTop = top;
    }
  }, [open, follow, active, timed, audioUrl, episodeKey]);
  const stopFollowing = () => setFollow(false);
  return <div className="border-t border-[var(--line)] pt-3 space-y-3">
    <button type="button" aria-expanded={open} aria-controls={id} className="min-h-11 rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-semibold" onClick={() => setOpen(value => !value)}>{audioUrl ? 'Acompanhar roteiro' : 'Ver roteiro'}</button>
    <section id={id} hidden={!open} aria-label="Acompanhamento do roteiro" className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-semibold">Roteiro do episódio</h3>
        <button type="button" onClick={onDownload} className="min-h-11 text-sm underline">Baixar roteiro</button>
      </div>
      {timed ? <>
        <p className="text-xs text-[var(--dim)]">O destaque acompanha as falas e os trechos do áudio. Toque em um trecho para ir até ele.</p>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={follow} onChange={event => setFollow(event.target.checked)} />Acompanhar automaticamente</label>
          {!follow && <button type="button" className="min-h-11 underline" onClick={() => { setFollow(true); setActive(activePodcastCue(cues, audioRef.current?.currentTime ?? 0)); }}>Voltar ao trecho atual</button>}
        </div>
      </> : <p className="text-xs text-[var(--dim)]">{audioUrl ? 'Este áudio está sem marcação de trechos. O roteiro completo continua disponível.' : 'Prepare o áudio para acompanhar o trecho em reprodução.'}</p>}
      <div ref={region} role="region" aria-label="Roteiro para acompanhar o áudio" tabIndex={0} className="relative max-h-[55vh] overflow-y-auto overscroll-contain rounded-xl border border-[var(--line)] p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]" onWheel={stopFollowing} onTouchMove={stopFollowing} onKeyDown={event => { if (['ArrowUp','ArrowDown','PageUp','PageDown','Home','End','Tab',' '].includes(event.key) && (event.key !== ' ' || event.target === event.currentTarget)) stopFollowing(); }}>
        {timed ? <ol className="space-y-2">{cues.map((cue,index) => <li key={`${episodeKey}-${index}`}>
          <button type="button" data-cue-index={index} aria-current={index === active ? 'true' : undefined} title="Ir para este trecho" className={`block w-full min-h-11 rounded-lg border-l-4 px-3 py-3 text-left text-sm leading-7 break-words focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] ${index === active ? 'border-[var(--primary)] bg-[var(--surface2)] font-medium' : 'border-transparent'}`} onClick={() => { if (audioRef.current) { audioRef.current.currentTime = cue.start; setActive(index); } }}>
            <span className="mb-1 flex flex-wrap items-center gap-2 text-xs text-[var(--dim)]"><time>{timestamp(cue.start)}</time><span>{cue.speaker ? `Pessoa ${cue.speaker}` : `Trecho ${index + 1}`}</span>{index === active && <span className="font-semibold">Trecho atual</span>}</span>
            <span className="whitespace-pre-wrap">{cue.text}</span>
          </button>
        </li>)}</ol> : <p className="whitespace-pre-wrap px-3 py-2 text-sm leading-7 break-words">{script}</p>}
      </div>
      <details className="border-t border-[var(--line)] pt-3"><summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">Fontes e referências</summary><p className="text-xs text-[var(--dim)] my-3">{sourceLabels.length ? `Fontes: ${sourceLabels.join(' · ')}` : 'Roteiro geral do tema, sem material específico selecionado.'}</p>{studyPacket && <StudySourcesPanel packet={studyPacket} />}</details>
    </section>
  </div>;
}
