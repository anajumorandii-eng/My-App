import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './BiologiaFisiologia.css';

const IDS = {
  digestion: 'summary-biologia-fisiologia-da-digestao',
  excretion: 'summary-biologia-fisiologia-da-excrecao',
  synapse: 'summary-biologia-fisiologia-da-coordenacao-nervosa-i',
  reflex: 'summary-biologia-coordenacao-nervosa-ii',
  endocrine: 'summary-biologia-coordenacao-endocrina-ii',
} as const;

export const BIOLOGY_PHYSIOLOGY_SCENE_IDS = new Set<string>(Object.values(IDS));

type DiagramProps = { active: number; total: number };
const on = (active: number, index: number) => active === index ? ' bp-focus' : active > index ? ' bp-done' : '';

function DigestiveDiagram({ active }: DiagramProps) {
  return <svg viewBox="0 0 620 340" role="img" aria-label="Sistema digestório com boca, esôfago, estômago, fígado, pâncreas e intestinos" data-bio-system="digestive">
    <defs><marker id="bp-arrow-digest" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker></defs>
    <path d="M236 32c-48 19-72 65-66 113l12 100c5 42 34 67 81 67h94c47 0 76-25 81-67l12-100c6-48-18-94-66-113" className="bp-body" />
    <g className={`bp-organ${on(active, 0)}`}><circle cx="310" cy="45" r="17"/><path d="M310 62c0 31 0 49 4 75"/><text x="348" y="48">boca · amilase</text></g>
    <g className={`bp-organ${on(active, 1)}`}><path d="M314 137c-35 2-52 24-43 51 8 24 42 25 58 9 20-20 24-47 3-58-5-3-11-3-18-2Z"/><text x="85" y="174">estômago · HCl + pepsina</text></g>
    <path d="M272 132c-32-14-65 2-77 24 34 10 58 4 77-24Z" className="bp-gland"/><text x="104" y="132" className="bp-small">fígado / bile</text>
    <path d="M294 207c34-15 74-10 96 6-37 11-70 12-96-6Z" className="bp-gland"/><text x="394" y="218" className="bp-small">pâncreas</text>
    <g className={`bp-organ${on(active, 2)}`}><path d="M277 220c73-30 99 55 25 62-61 6-69-49-12-45 47 3 37 31 6 28"/><text x="386" y="270">delgado · absorção</text></g>
    <g className={`bp-organ${on(active, 3)}`}><path d="M259 211c-26 11-29 74 0 88h102c29-14 26-77 0-88M259 211h102"/><text x="92" y="306">grosso · água e sais</text></g>
    <path d="M310 63v67c0 8-1 12 4 17" className="bp-flow" markerEnd="url(#bp-arrow-digest)" />
  </svg>;
}

function ExcretionDiagram({ active }: DiagramProps) {
  return <svg viewBox="0 0 620 340" role="img" aria-label="Rim em corte e néfron ampliado mostrando filtração, reabsorção e secreção" data-bio-system="nephron">
    <defs><marker id="bp-arrow-nephron" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker></defs>
    <path d="M84 70c-52 3-66 64-48 118 16 49 53 76 91 56 30-16 23-48 45-66 22-19 34-53 9-82-26-30-58-28-97-26Z" className="bp-kidney"/>
    <path d="M139 105c-31 25-42 78-22 117M147 154h64" className="bp-vessel"/><text x="42" y="279">rim: córtex → medula → pelve</text>
    <g className={`bp-nephron${on(active, 0)}`}><circle cx="275" cy="91" r="34"/><path d="M247 91c12-25 46-24 55 0-11 25-44 26-55 0Z"/><path d="M211 76h36M211 106h36"/><text x="224" y="42">glomérulo</text></g>
    <g className={`bp-nephron${on(active, 1)}`}><path d="M309 94c61-13 73 25 35 42-43 19-43 46 1 51 51 6 50 39 12 57"/><path d="M329 128c-25-22-48 2-25 24" className="bp-transfer" markerEnd="url(#bp-arrow-nephron)"/><text x="392" y="144">reabsorção → sangue</text></g>
    <g className={`bp-nephron${on(active, 2)}`}><path d="M480 81c-51 25-65 110-46 173" className="bp-vessel"/><path d="M469 128c-30 2-50 18-65 39" className="bp-transfer" markerEnd="url(#bp-arrow-nephron)"/><text x="463" y="64">capilar</text><text x="435" y="289">secreção → túbulo</text></g>
    <path d="M357 244c-10 28 10 51 39 53 28 2 46-17 39-43" className="bp-nephron"/><path d="M435 254v57" className="bp-flow" markerEnd="url(#bp-arrow-nephron)"/><text x="452" y="319">urina</text>
  </svg>;
}

function SynapseDiagram({ active }: DiagramProps) {
  const dots = [0, 1, 2, 3, 4];
  return <svg viewBox="0 0 620 340" role="img" aria-label="Sinapse química ampliada com canais de cálcio, vesículas, neurotransmissores e receptores" data-bio-system="synapse">
    <defs><marker id="bp-arrow-synapse" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker></defs>
    <path d="M30 74h170c29 0 52 24 52 53v68c0 29-23 53-52 53H30" className={`bp-terminal${on(active, 0)}`}/>
    <path d="M370 48c-49 47-57 85-45 119 12 35 5 72-28 125h293" className={`bp-post${on(active, 2)}`}/>
    <path d="M51 104h111" className="bp-flow" markerEnd="url(#bp-arrow-synapse)"/><text x="48" y="91">potencial de ação</text>
    <g className={`bp-channel${on(active, 0)}`}><path d="M213 132v47M239 132v47"/><text x="184" y="118">canal Ca²⁺</text><circle cx="226" cy="101" r="7"/><circle cx="226" cy="82" r="5"/></g>
    <g className={`bp-vesicles${on(active, 1)}`}>{dots.slice(0,3).map((d)=><g key={d}><circle cx={102+d*39} cy={190-d*8} r="20"/><circle cx={96+d*39} cy={188-d*8} r="3"/><circle cx={108+d*39} cy={183-d*8} r="3"/></g>)}<path d="M217 213c23 1 37 11 46 28" className="bp-transfer" markerEnd="url(#bp-arrow-synapse)"/></g>
    <g className={`bp-transmitters${on(active, 1)}`}>{dots.map((d)=><circle key={d} cx={275+d*17} cy={230+(d%2)*17} r="6"/>)}</g>
    <g className={`bp-receptors${on(active, 2)}`}>{dots.map((d)=><path key={d} d={`M${355+d*43} 243v27l12 10 12-10v-27`} />)}<text x="394" y="311">receptores pós-sinápticos</text></g>
    <g className={`bp-cleanup${on(active, 3)}`}><path d="M296 214c24-40 55-37 79-14" className="bp-transfer" markerEnd="url(#bp-arrow-synapse)"/><text x="333" y="177">recaptação / degradação</text></g>
  </svg>;
}

function ReflexDiagram({ active }: DiagramProps) {
  return <svg viewBox="0 0 620 340" role="img" aria-label="Arco reflexo com receptor, neurônio sensitivo, medula, neurônio motor e músculo" data-bio-system="reflex-arc">
    <defs><marker id="bp-arrow-reflex" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker></defs>
    <g className={`bp-reflex-node${on(active, 0)}`}><path d="M48 133c38-32 79-27 113 5-33 34-75 36-113-5Z"/><circle cx="104" cy="135" r="17"/><path d="M55 78c20 12 29 26 31 42"/><text x="43" y="57">receptor na pele</text></g>
    <g className={`bp-reflex-path${on(active, 1)}`}><path d="M161 135c79-67 139-65 202-17" markerEnd="url(#bp-arrow-reflex)"/><text x="175" y="65">neurônio sensitivo</text><text x="217" y="88" className="bp-small">raiz dorsal</text></g>
    <g className={`bp-cord${on(active, 2)}`}><ellipse cx="395" cy="151" rx="64" ry="94"/><path d="M371 98c24 7 33 28 24 52 9 25 0 46-24 55 1-22-13-34-31-45 18-16 31-33 31-62ZM419 98c-24 7-33 28-24 52-9 25 0 46 24 55-1-22 13-34 31-45-18-16-31-33-31-62Z"/><text x="353" y="276">medula espinal</text></g>
    <g className={`bp-reflex-path${on(active, 3)}`}><path d="M365 218c-63 22-120 43-181 53" markerEnd="url(#bp-arrow-reflex)"/><text x="221" y="304">neurônio motor · raiz ventral</text></g>
    <g className={`bp-muscle${on(active, 4)}`}><path d="M53 247c35-29 84-29 119 0-35 37-84 37-119 0Z"/><path d="M73 247h79M87 231l10 32M119 228l10 36"/><text x="61" y="316">músculo efetor</text></g>
  </svg>;
}

function EndocrineDiagram({ active }: DiagramProps) {
  return <svg viewBox="0 0 620 340" role="img" aria-label="Eixo hipotálamo-hipófise-glândula-alvo com retroalimentação negativa" data-bio-system="endocrine-axis">
    <defs><marker id="bp-arrow-endo" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" /></marker></defs>
    <path d="M93 56c-54 3-77 50-53 89 14 23 40 31 62 26 13 17 37 17 51 0 35 6 62-20 58-51-4-29-29-48-58-44-13-15-37-24-60-20Z" className={`bp-gland-node${on(active, 0)}`}/><circle cx="130" cy="138" r="11" className="bp-gland-dot"/><text x="50" y="33">hipotálamo</text><text x="150" y="145">hipófise</text>
    <path d="M209 137H312" className={`bp-hormone${on(active, 1)}`} markerEnd="url(#bp-arrow-endo)"/><text x="228" y="115">TSH / ACTH</text>
    <g className={`bp-gland-node${on(active, 2)}`}><path d="M348 98c-32 5-42 34-28 57 10 16 27 22 43 14 16 8 34 2 43-14 14-23 4-52-28-57l-15 23Z"/><text x="323" y="202">glândula-alvo</text><text x="326" y="222" className="bp-small">tireoide / adrenal</text></g>
    <path d="M406 137H520" className={`bp-hormone${on(active, 2)}`} markerEnd="url(#bp-arrow-endo)"/><text x="432" y="113">T₃/T₄ · cortisol</text><g className="bp-tissue"><rect x="529" y="102" width="60" height="70" rx="15"/><circle cx="549" cy="124" r="6"/><circle cx="571" cy="144" r="6"/><text x="520" y="202">tecidos</text></g>
    <g className={`bp-feedback${on(active, 3)}`}><path d="M553 180C535 300 226 312 132 186" markerEnd="url(#bp-arrow-endo)"/><path d="M520 181C493 258 400 270 366 185" markerEnd="url(#bp-arrow-endo)"/><text x="244" y="302">feedback negativo: freio no eixo</text></g>
  </svg>;
}

function Diagram({ id, active, total }: { id: string } & DiagramProps) {
  if (id === IDS.digestion) return <DigestiveDiagram active={active} total={total}/>;
  if (id === IDS.excretion) return <ExcretionDiagram active={active} total={total}/>;
  if (id === IDS.synapse) return <SynapseDiagram active={active} total={total}/>;
  if (id === IDS.reflex) return <ReflexDiagram active={active} total={total}/>;
  return <EndocrineDiagram active={active} total={total}/>;
}

export function BiologiaFisiologia({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const item = entry.items[active];

  return <section className="tc-scene bp-scene" aria-label={entry.question}>
    <header><small>CRIVO · atlas fisiológico</small><h4>{entry.question}</h4></header>
    <div className="bp-board"><Diagram id={entry.chapterId} active={active} total={entry.items.length}/></div>
    <div className="bp-stepper" aria-label="Etapas do mecanismo">
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} animate={{ opacity: index === active ? 1 : .66, scale: index === active ? 1.02 : 1 }} transition={transition}><span>{String(index + 1).padStart(2, '0')}</span><strong>{candidate.label}</strong></motion.button>)}
    </div>
    <aside className="bp-detail" role="status"><div><small>ETAPA {active + 1} DE {entry.items.length}</small><strong>{item.label}</strong><p>{item.claim}</p></div><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
  </section>;
}
