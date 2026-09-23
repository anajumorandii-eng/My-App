import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './EcologyCycles.css';
import './EcologySystems.css';

export const ECOLOGY_SYSTEM_IDS: ReadonlySet<string> = new Set([
  'bio-ecologia-dinamica-populacoes',
  'bio-ecologia-invasoras-controle-biologico',
  'bio-ecologia-sucessao',
  'bio-ecologia-ciclo-hidrologico-poluicao-agua',
]);

type DiagramProps = { active: number; selected: string };

function PopulationProfiles({ active, selected }: DiagramProps) {
  return <svg viewBox="0 0 620 340" role="img" aria-label={`Estratégias: muitos descendentes e pouco cuidado; poucos descendentes e longo cuidado. Selecionado: ${selected}`}>
    <rect x="12" y="12" width="596" height="316" rx="20" className="ec-paper"/>
    <text x="31" y="48" className="ec-caption">descendência × cuidado parental</text>
    <g className={active === 0 ? 'es-selected' : 'es-muted'}><rect x="32" y="70" width="260" height="210" rx="18" className="es-card"/>
      <text x="54" y="103" className="es-title">r · muitos descendentes</text>
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={78 + (i % 4) * 55} cy={146 + Math.floor(i / 4) * 33} r="8" className="es-offspring"/>)}
      <text x="54" y="250" className="ec-caption">pouco cuidado</text>
      <text x="54" y="268" className="ec-caption">alta mortalidade juvenil</text></g>
    <g className={active === 1 ? 'es-selected' : 'es-muted'}><rect x="328" y="70" width="260" height="210" rx="18" className="es-card"/>
      <text x="350" y="103" className="es-title">K · poucos descendentes</text>
      <circle cx="455" cy="168" r="25" className="es-parent"/><circle cx="420" cy="216" r="11" className="es-offspring"/><circle cx="490" cy="216" r="11" className="es-offspring"/>
      <path d="M449 190l-26 18m39-18 25 18" className="ec-flow"/>
      <text x="350" y="250" className="ec-caption">longo cuidado</text>
      <text x="350" y="268" className="ec-caption">maturação lenta</text></g>
    <text x="31" y="307" className="ec-caption">Perfis qualitativos; os círculos ilustram a estratégia, sem valores medidos.</text>
  </svg>;
}

const impactTargets = [
  ['predação', 'nativa sem defesa'], ['competição', 'recurso e espaço'],
  ['patógenos', 'população nativa'], ['hibridação', 'patrimônio genético'],
  ['alteração física', 'ambiente e fogo'],
];
function InvasionWeb({ active, selected }: DiagramProps) {
  return <svg viewBox="0 0 620 360" role="img" aria-label={`Invasora → nativa e recurso: cinco caminhos de impacto; selecionado: ${selected}`}>
    <rect x="12" y="12" width="596" height="336" rx="20" className="ec-paper"/>
    <text x="34" y="44" className="ec-caption">A espécie invasora altera relações diferentes</text>
    <circle cx="130" cy="182" r="66" className="es-origin"/><text x="130" y="185" textAnchor="middle" className="es-title">invasora</text>
    {impactTargets.map(([label, target], i) => { const y = 83 + i * 58; return <g key={label} className={active === i ? 'es-selected' : 'es-muted'}>
      <path d={`M196 182Q270 ${y} 337 ${y}`} className="ec-flow"/>
      <rect x="340" y={y - 22} width="242" height="45" rx="14" className="es-card"/>
      <text x="353" y={y - 4} className="es-title">{label}</text><text x="353" y={y + 13} className="ec-caption">→ {target}</text>
    </g>; })}
  </svg>;
}

function SuccessionLandscape({ active, selected }: DiagramProps) {
  const stages = [
    { x: 30, name: 'pioneira', vegetation: 'solo inicial', height: 22 },
    { x: 227, name: 'gramíneas → arbustos', vegetation: 'solo estabilizado', height: 58 },
    { x: 424, name: 'árvores · clímax', vegetation: 'comunidade estável', height: 69 },
  ];
  return <svg viewBox="0 0 620 340" role="img" aria-label={`Sucessão: pioneira → gramíneas → arbustos → árvores; etapa selecionada: ${selected}`}>
    <rect x="12" y="12" width="596" height="316" rx="20" className="ec-paper"/>
    <text x="30" y="46" className="ec-caption">O solo e a comunidade mudam ao longo da sucessão</text>
    {stages.map((stage, index) => <g key={stage.name} className={active === index ? 'es-selected' : 'es-muted'}>
      <rect x={stage.x} y="84" width="176" height="210" rx="15" className="es-card"/>
      <text x={stage.x + 11} y="109" className="es-title">{stage.name}</text>
      <path d={`M${stage.x + 10} 235H${stage.x + 166}`} className="es-soil"/>
      {[0, 1, 2].map(n => <g key={n}><path d={`M${stage.x + 39 + n * 47} 234v-${stage.height}`} className="ec-roots"/>
        <circle cx={stage.x + 39 + n * 47} cy={234 - stage.height} r={index === 2 ? 24 : index === 1 ? 15 : 8} className="es-canopy"/></g>)}
      <text x={stage.x + 11} y="274" className="ec-caption">{stage.vegetation}</text>
    </g>)}
    <text x="36" y="317" className="ec-caption">A comunidade clímax permanece em equilíbrio dinâmico.</text>
  </svg>;
}

const pollution = [
  { source: 'esgoto', effect: 'O₂ consumido' },
  { source: 'fertilizantes', effect: 'eutrofização' },
  { source: 'refrigeração', effect: 'menos O₂ disponível' },
  { source: 'metais e agrotóxicos', effect: 'biomagnificação' },
  { source: 'patógenos fecais', effect: 'contaminação' },
  { source: 'microplásticos', effect: 'cadeia alimentar' },
];
function WaterPollution({ active, selected }: DiagramProps) {
  const agent = pollution[active];
  return <svg viewBox="0 0 620 340" role="img" aria-label={`Poluição: fonte → água → efeito; agente selecionado: ${selected}. ${agent.source} → ${agent.effect}`}>
    <rect x="12" y="12" width="596" height="316" rx="20" className="ec-paper"/>
    <text x="32" y="50" className="ec-caption">Agente selecionado: {selected}</text>
    <rect x="33" y="106" width="154" height="112" rx="15" className="es-card"/><text x="50" y="142" className="es-title">fonte</text><text x="50" y="177" className="ec-caption">{agent.source}</text>
    <path d="M188 162h39m172 0h35" className="ec-flow"/>
    <path d="M228 120q40-20 86 0t87 0v83q-40 20-86 0t-87 0Z" className="es-lake"/>
    <text x="282" y="163" className="es-title">água</text>
    <rect x="435" y="106" width="154" height="112" rx="15" className="es-card"/><text x="451" y="142" className="es-title">efeito</text><text x="451" y="177" className="ec-caption">{agent.effect}</text>
    <text x="34" y="283" className="ec-caption">A fonte chega ao meio aquático e altera o ecossistema.</text>
  </svg>;
}

const diagramById: Record<string, React.ComponentType<DiagramProps>> = {
  'bio-ecologia-dinamica-populacoes': PopulationProfiles,
  'bio-ecologia-invasoras-controle-biologico': InvasionWeb,
  'bio-ecologia-sucessao': SuccessionLandscape,
  'bio-ecologia-ciclo-hidrologico-poluicao-agua': WaterPollution,
};

export function EcologySystems({ entry }: { entry: SceneEntry }) {
  const [active, setActive] = useState(0);
  const transition = useSceneMotion();
  const Diagram = diagramById[entry.chapterId];
  const item = entry.items[active];
  return <section className="tc-scene ec-system" aria-label={entry.question}>
    <header><small>CRIVO · sistemas ecológicos</small><h4>{entry.question}</h4></header>
    <div className="ec-figure" role="region" aria-label="Diagrama: deslize ou use as setas para ver toda a figura" tabIndex={0}><Diagram active={active} selected={item.label}/></div>
    <p className="ec-pan-hint">Deslize o diagrama para ver a figura inteira. Com teclado, use as setas.</p>
    <div className="ec-controls" aria-label="Relações do mecanismo">
      {entry.items.map((candidate, index) => <motion.button key={candidate.label} type="button" aria-pressed={active === index} onClick={() => setActive(index)} animate={{ y: active === index ? -2 : 0 }} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="ec-detail" role="status" aria-live="polite"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
  </section>;
}
