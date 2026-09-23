import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './EcologyCycles.css';

export const ECOLOGY_CYCLE_IDS: ReadonlySet<string> = new Set([
  'bio-ecologia-ciclo-nitrogenio', 'bio-ecologia-eutrofizacao',
]);

function NitrogenDiagram({ active, selected }: { active: number; selected: string }) {
  const points = [
    { x: 100, y: 76, label: 'N₂ · atmosfera' },
    { x: 112, y: 252, label: 'amônia · solo' },
    { x: 295, y: 252, label: 'nitrito' },
    { x: 490, y: 252, label: 'nitrato' },
  ];
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Ciclo do nitrogênio: N₂ → amônia → nitrito → nitrato → N₂; etapa selecionada: ${selected}`}>
    <rect x="12" y="12" width="596" height="336" rx="20" className="ec-paper"/>
    <path d="M30 168H590" className="ec-ground"/>
    <text x="30" y="40" className="ec-caption">atmosfera</text><text x="30" y="191" className="ec-caption">solo · conversões microbianas</text>
    <path d="M100 101V225M163 252H244M346 252H434M490 222V92H162" className="ec-flow"/>
    <path d="M195 330l-30-43M195 330l31-44M195 330v-52M165 287Q130 300 112 286" className="ec-roots"/>
    <text x="18" y="316" className={active === 1 ? 'ec-highlight' : 'ec-caption'}>amonificação ↗</text>
    <text x="18" y="336" className="ec-caption">matéria orgânica → amônia</text>
    <text x="415" y="318" className="ec-caption">nitrato → raízes</text>
    {points.map((point, index) => <g key={point.label} className={active === index || (active === 4 && (index === 3 || index === 0)) ? 'ec-node ec-node--active' : 'ec-node'}>
      <circle cx={point.x} cy={point.y} r="34"/>
      <text x={point.x} y={point.y + 4} textAnchor="middle">{point.label}</text>
    </g>)}
    <text x="338" y="74" className="ec-caption">desnitrificação ↖</text>
    <text x="39" y="150" className={active === 0 ? 'ec-highlight' : 'ec-caption'}>fixação ↓</text>
    <text x="170" y="215" className={active === 2 ? 'ec-highlight' : 'ec-caption'}>Nitrosomonas →</text>
    <text x="375" y="215" className={active === 3 ? 'ec-highlight' : 'ec-caption'}>Nitrobacter →</text>
  </svg>;
}

function LakeDiagram({ active, selected }: { active: number; selected: string }) {
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Eutrofização: nutrientes → floração → luz bloqueada → oxigênio consumido → anoxia → peixes; etapa selecionada: ${selected}`}>
    <rect x="12" y="12" width="596" height="336" rx="20" className="ec-paper"/>
    <path d="M38 102H582V322H38Z" className="ec-water"/>
    <path d="M38 101q30-10 60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0t60 0" className="ec-surface"/>
    <path d="M39 44l82 54" className="ec-flow"/><text x="36" y="39" className={active === 0 ? 'ec-highlight' : 'ec-caption'}>nutrientes ↘</text>
    <path d="M147 119q24-22 48 0t48 0t48 0t48 0t48 0t48 0" className="ec-bloom"/>
    <text x="163" y="83" className={active === 0 ? 'ec-highlight' : 'ec-caption'}>floração superficial</text>
    <path d="M234 135v61M271 135v61" className="ec-light"/>
    <text x="175" y="214" className={active === 1 ? 'ec-highlight' : 'ec-caption'}>luz bloqueada ↓</text>
    <path d="M82 277q18-41 32 0m-15-5q30-56 51 0" className="ec-roots"/>
    <text x="39" y="306" className={active === 2 ? 'ec-highlight' : 'ec-caption'}>produtoras submersas</text>
    <circle cx="355" cy="256" r="24" className={active === 3 ? 'ec-bubble ec-bubble--active' : 'ec-bubble'}/>
    <text x="355" y="260" textAnchor="middle" className="ec-caption">O₂</text>
    <text x="307" y="306" className={active === 4 ? 'ec-highlight' : 'ec-caption'}>hipóxia → anoxia</text>
    <path d="M501 241q30-20 55 0-25 21-55 0l-14-15v30Z" className={active === 5 ? 'ec-fish ec-fish--active' : 'ec-fish'}/>
    <text x="476" y="288" className={active === 5 ? 'ec-highlight' : 'ec-caption'}>peixes</text>
    <text x="332" y="186" className={active === 3 ? 'ec-highlight' : 'ec-caption'}>decomposição consome oxigênio</text>
  </svg>;
}

export function EcologyCycles({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[active];
  const nitrogen = entry.chapterId === 'bio-ecologia-ciclo-nitrogenio';
  return <section className="tc-scene ec-cycle" aria-label={entry.question}>
    <header><small>CRIVO · mecanismos ecológicos</small><h4>{entry.question}</h4></header>
    <div className="ec-figure" role="region" aria-label="Diagrama: deslize ou use as setas para ver toda a figura" tabIndex={0}>{nitrogen ? <NitrogenDiagram active={active} selected={item.label}/> : <LakeDiagram active={active} selected={item.label}/>}</div>
    <p className="ec-pan-hint">Deslize o diagrama para ver a figura inteira. Com teclado, use as setas.</p>
    <div className="ec-controls" aria-label="Etapas do mecanismo">
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} animate={{ y: active === index ? -2 : 0 }} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="ec-detail" role="status" aria-live="polite"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
  </section>;
}
