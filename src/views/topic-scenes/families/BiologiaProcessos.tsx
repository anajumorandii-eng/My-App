import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './BiologiaProcessos.css';

export const BIOLOGY_PROCESS_IDS = new Set([
  'summary-biologia-algas',
  'summary-biologia-ciclos-de-vida',
  'summary-biologia-bioenergetica-fermentacao-e-respiracao',
]);

function AlgaeDiagram({ focus }: { focus: number }) {
  return <svg viewBox="0 0 620 360" role="img" aria-label="Luz vermelha se atenua perto da superfície; luz azul-verde chega mais fundo, onde vivem algas vermelhas">
    <defs>
      <linearGradient id="algae-water" x2="0" y2="1"><stop stopColor="#b9e6de"/><stop offset=".5" stopColor="#408fa3"/><stop offset="1" stopColor="#183d65"/></linearGradient>
      <linearGradient id="algae-red" x2="0" y2="1"><stop stopColor="#df6358" stopOpacity=".85"/><stop offset="1" stopColor="#df6358" stopOpacity="0"/></linearGradient>
      <linearGradient id="algae-blue" x2="0" y2="1"><stop stopColor="#b4f5e0" stopOpacity=".9"/><stop offset="1" stopColor="#b4f5e0" stopOpacity=".3"/></linearGradient>
    </defs>
    <rect x="8" y="44" width="604" height="306" rx="18" fill="url(#algae-water)"/>
    <path d="M8 44q28-9 55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0t55 0" fill="none" stroke="#f7e7b3" strokeWidth="5"/>
    <path d="M92 52l-36 100 96-12 17-88Z" fill="url(#algae-red)"/><path d="M200 52l-64 279 117-8 25-271Z" fill="url(#algae-blue)"/>
    <text x="24" y="29" className="bp-label">superfície · luz solar</text>
    <text x="42" y="85" className="bp-light bp-light--red">vermelha</text><text x="184" y="85" className="bp-light bp-light--blue">azul-verde</text>
    <path d="M8 146h604M8 245h604" className="bp-depth-line"/>
    {[
      { y: 112, color: '#286b50', name: 'verdes', pigment: 'clorofilas a + b', stalk: 'M440 126q-28-41-14-57m14 57q26-34 51-43m-51 43q-2-28 19-51', leaves: [[422,80,-24],[476,86,22],[457,82,12]] },
      { y: 208, color: '#765537', name: 'pardas', pigment: 'fucoxantina', stalk: 'M440 223q-30-45-20-65m20 65q23-34 43-48m-43 48q4-29 23-52', leaves: [[416,171,-20],[472,178,20],[457,174,12]] },
      { y: 303, color: '#a24b5f', name: 'vermelhas', pigment: 'ficoeritrina', stalk: 'M440 322q-20-46-8-69m8 69q25-34 47-51m-47 51q-1-28 16-55', leaves: [[427,266,-20],[476,272,20],[451,271,12]] },
    ].map((item, index) => <g key={item.name} opacity={focus === index ? 1 : .58}>
      {focus === index && <rect x="305" y={item.y-50} width="292" height="81" rx="16" fill="#fff" fillOpacity=".17" stroke="#fff" strokeWidth="2"/>}
      <path d={item.stalk} fill="none" stroke={item.color} strokeWidth="7" strokeLinecap="round"/>
      {item.leaves.map(([x,y,rotation], leaf) => <ellipse key={leaf} cx={x} cy={y} rx="11" ry="24" transform={`rotate(${rotation} ${x} ${y})`} fill={item.color} stroke="#f0e4be" strokeWidth="1.5"/>)}
      <text x="314" y={item.y-14} className="bp-water-title">{item.name}</text><text x="314" y={item.y+7} className="bp-water-caption">{item.pigment}</text>
    </g>)}
    <text x="19" y="337" className="bp-water-caption">profundidade crescente ↓</text>
  </svg>;
}

const cycleStages = [
  { title: 'Meiose zigótica', note: 'zigoto 2n → células n', stages: [['adulto n', 'gametas n', 'zigoto 2n', 'meiose', 'adulto n']] },
  { title: 'Meiose gamética', note: 'adulto 2n → gametas n', stages: [['adulto 2n', 'meiose', 'gametas n', 'zigoto 2n', 'adulto 2n']] },
  { title: 'Meiose espórica', note: 'esporófito 2n → esporos n', stages: [['esporófito 2n', 'meiose', 'esporos n', 'gametófito n', 'gametas n', 'zigoto 2n']] },
];

function LifeCycleDiagram({ focus }: { focus: number }) {
  const cycle = cycleStages[focus];
  const stages = cycle.stages[0];
  const positions = stages.map((_, index) => 44 + index * (532 / (stages.length - 1)));
  return <svg viewBox="0 0 620 320" role="img" aria-label={`${cycle.title}: ${stages.join(' → ')}`}>
    <defs><marker id="bp-cycle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#75405d"/></marker></defs>
    <rect x="8" y="8" width="604" height="304" rx="18" className="bp-cycle-paper"/>
    <text x="30" y="50" className="bp-cycle-heading">{cycle.title}</text><text x="30" y="75" className="bp-cycle-note">{cycle.note}</text>
    <path d="M44 160H576" className="bp-cycle-line" markerEnd="url(#bp-cycle-arrow)"/>
    {stages.map((stage, index) => <g key={`${stage}-${index}`}>
      <circle cx={positions[index]} cy="160" r={stage === 'meiose' ? 20 : 13} className={stage === 'meiose' ? 'bp-cycle-meiosis' : stage.includes('2n') ? 'bp-cycle-diploid' : 'bp-cycle-haploid'}/>
      {stage === 'meiose' && <path d={`M${positions[index]-8} 152l16 16m0-16l-16 16`} stroke="#fff" strokeWidth="2"/>}
      <text x={positions[index]} y={index % 2 ? 213 : 118} textAnchor="middle" className="bp-cycle-label">{stage}</text>
    </g>)}
    <circle cx="40" cy="273" r="6" className="bp-cycle-haploid"/><text x="55" y="278" className="bp-cycle-legend">n · haploide</text>
    <circle cx="215" cy="273" r="6" className="bp-cycle-diploid"/><text x="230" y="278" className="bp-cycle-legend">2n · diploide</text>
    <circle cx="380" cy="273" r="7" className="bp-cycle-meiosis"/><text x="395" y="278" className="bp-cycle-legend">meiose</text>
  </svg>;
}

const respirationStages = [
  { title: 'Glicólise', place: 'citosol', product: '2 piruvatos', x: 88, y: 176 },
  { title: 'Oxidação', place: 'matriz', product: 'acetil-CoA', x: 236, y: 176 },
  { title: 'Krebs', place: 'matriz', product: 'NADH + FADH₂', x: 382, y: 176 },
  { title: 'Cadeia', place: 'membrana interna', product: 'gradiente H⁺ → ATP', x: 530, y: 176 },
];

function RespirationDiagram({ focus }: { focus: number }) {
  return <svg viewBox="0 0 620 330" role="img" aria-label={`Respiração aeróbia: ${respirationStages.map(stage => `${stage.title} (local: ${stage.place})`).join(' → ')}. Etapa selecionada: ${respirationStages[focus].title}`}>
    <defs><marker id="bp-resp-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#426f63"/></marker></defs>
    <rect x="8" y="8" width="604" height="314" rx="18" className="bp-cycle-paper"/>
    <text x="30" y="43" className="bp-cycle-heading">Da glicose ao ATP</text>
    <rect x="169" y="76" width="422" height="194" rx="96" className="bp-mitochondrion"/>
    <path d="M193 132q28-40 54 0t54 0t54 0t54 0t54 0t54 0t54 0" className="bp-membrane"/>
    <text x="30" y="90" className="bp-cycle-note">citosol</text>
    <text x="296" y="108" className="bp-cycle-note">mitocôndria</text>
    {respirationStages.map((stage, index) => <g key={stage.title}>
      {index > 0 && <path d={`M${respirationStages[index-1].x+51} 176H${stage.x-52}`} className="bp-resp-flow" markerEnd="url(#bp-resp-arrow)"/>}
      <circle cx={stage.x} cy={stage.y} r="46" className={focus === index ? 'bp-resp-stage bp-resp-stage--active' : 'bp-resp-stage'}/>
      <text x={stage.x} y="172" textAnchor="middle" className="bp-resp-title">{stage.title}</text>
      <text x={stage.x} y="192" textAnchor="middle" className="bp-resp-place">{stage.place}</text>
      <text x={stage.x} y="286" textAnchor="middle" className="bp-resp-product">{stage.product}</text>
    </g>)}
    <text x="30" y="312" className="bp-resp-footnote">O₂ recebe elétrons ao final da cadeia; a ATP-sintase usa o gradiente de H⁺.</text>
  </svg>;
}

export function BiologiaProcessos({ entry }: { entry: SceneEntry }) {
  const [focus, setFocus] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[focus];
  const algae = entry.chapterId === 'summary-biologia-algas';
  const respiration = entry.chapterId === 'summary-biologia-bioenergetica-fermentacao-e-respiracao';
  return <section className="tc-scene bp-process" aria-label={entry.question}>
    <header><small>CRIVO · atlas biológico</small><h4>{entry.question}</h4></header>
    <div className="bp-process-figure">{algae ? <AlgaeDiagram focus={focus}/> : respiration ? <RespirationDiagram focus={focus}/> : <LifeCycleDiagram focus={focus}/>}</div>
    <div className="bp-process-tabs" aria-label={algae ? 'Profundidade e pigmento' : respiration ? 'Etapas da respiração aeróbia' : 'Posição da meiose'}>
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={focus === index} onClick={() => setFocus(index)} animate={{ y: focus === index ? -3 : 0 }} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="bp-process-detail" role="status"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
  </section>;
}
