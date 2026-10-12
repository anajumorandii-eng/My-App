import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { MOTION_DURATION } from '../../../design-system/motion/tokens';
import type { SceneEntry } from '../types';
import { StageCaseLens, useStageCases, VEILED_CLAIM } from '../../visual-stage/stageCases';

export type EcologyDiagramProps = { active: number; selected: string; replay: number };

/** Playback advances the actual concept selection; every frame remains available by keyboard. */
export function EcologyPlayer({ entry, title, subtitle, Diagram, kicker = 'Biologia / Ecologia', className = '' }: {
  entry: SceneEntry; title: string; subtitle: string; Diagram: React.ComponentType<EcologyDiagramProps>; kicker?: string; className?: string;
}) {
  // A etapa do palco escolhe o quadro do ciclo; a reprodução continua local.
  const cases = useStageCases(entry.items);
  const active = cases.active;
  const setActive = (next: number | ((value: number) => number)) => cases.show(typeof next === 'function' ? next(cases.active) : next);
  const coberto = cases.veiled.has(active);
  const [playing, setPlaying] = useState(false);
  const [replay, setReplay] = useState(0);
  const reduced = useSceneMotion().duration === 0;
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (active === entry.items.length - 1) setPlaying(false);
      else setActive(value => value + 1);
    }, MOTION_DURATION.studyStep * 1000);
    return () => window.clearTimeout(timer);
  }, [active, playing, entry.items.length]);
  const item = entry.items[active];
  return <section className={`tc-scene ec-cycle ec-editorial ${className}`} aria-label={entry.question}>
    <header className="ec-heading"><small>{kicker}</small><h4>{title}</h4><p>{subtitle}</p></header>
    <StageCaseLens cases={cases} items={entry.items} />
    <div className="ec-figure"><Diagram active={active} selected={item.label} replay={replay}/></div>
    <div className="ec-playback">
      <span>{String(active + 1).padStart(2, '0')} / {String(entry.items.length).padStart(2, '0')} · {playing ? 'Em reprodução' : 'Explore o mecanismo'}</span>
      <button type="button" aria-pressed={playing} onClick={() => {
        if (playing) setPlaying(false);
        else { setActive(0); setReplay(value => value + 1); setPlaying(true); }
      }}>{playing ? 'Pausar' : 'Reproduzir etapas'}</button>
    </div>
    <div className="ec-controls" aria-label="Etapas do mecanismo">
      {entry.items.map((candidate, index) => <button key={candidate.label} type="button" aria-pressed={active === index} data-stage-focus={cases.stage && cases.focus.includes(index) ? 'true' : undefined} data-stage-veiled={cases.veiled.has(index) ? 'true' : undefined} onClick={() => { setPlaying(false); cases.choose(index); setReplay(value => value + 1); }}><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{candidate.label.replace(/^\d+\.\s*/, '')}</button>)}
    </div>
    <aside className="ec-detail" role="status" aria-live={playing ? 'off' : 'polite'}>
      <motion.div key={active} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : MOTION_DURATION.component }}>
        <strong>{item.label}</strong><p className={coberto ? 'stage-veiled-claim' : undefined}>{coberto ? VEILED_CLAIM : item.claim}</p>
      </motion.div>
      {!coberto && <details><summary>Conferir no resumo</summary><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></details>}
    </aside>
    {entry.nota && <p className="ec-source-note">{entry.nota}</p>}
  </section>;
}
