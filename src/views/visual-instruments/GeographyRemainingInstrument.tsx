import React, { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GEOGRAPHY_REMAINING, type GeographyRemainingId } from '../../lib/geographyRemainingLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';
import './GeographyRemainingInstrument.css';

function CartographicScene({ id, index }: { id: 'digital-map' | 'map-elements'; index: number }) {
  const reduced = useReducedMotion();
  const legend = useId();
  const isSig = id === 'digital-map';
  const grid = <path d="M30 70H290M30 125H290M30 180H290M80 30V220M145 30V220M210 30V220M275 30V220" fill="none" stroke="var(--vs-ink-muted)" strokeWidth=".8" strokeDasharray="2 5" />;
  return <svg className="vs-plane" viewBox="0 0 320 260" role="img" aria-label={isSig ? `Análise em SIG com ${index+1} camadas sobrepostas` : `Mapa temático com ${['legenda','escala','fonte'][index]} em foco`}>
    <rect x="24" y="25" width="270" height="200" rx="4" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="2" />
    {grid}
    {isSig ? <>
      <path d="M26 175Q85 165 120 183T215 153T294 147" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="13" />
      <motion.path d="M28 75Q85 88 113 109T203 130T291 179" fill="none" stroke="var(--vs-blue)" strokeWidth="10" initial={false} animate={{opacity:index>=1?1:0}} transition={{duration:reduced?0:.35}} />
      <motion.path d="M165 65L252 62L265 121L205 139L167 114Z" fill="var(--vs-burgundy)" initial={false} animate={{opacity:index>=2?.35:0}} transition={{duration:reduced?0:.35}} />
      <path d="M47 146L124 173L201 143L267 143" fill="none" stroke="var(--vs-burgundy)" strokeWidth="3" strokeDasharray="6 4" />
      <text x="35" y="245" fill="var(--vs-ink)" fontSize="12">{['declividade','declividade + curso de água','declividade + água + ocupação'][index]}</text>
    </> : <>
      <path d="M47 92L86 57L133 83L122 151L75 176L45 143Z" fill="var(--vs-blue)" opacity=".6" />
      <path d="M150 85L237 65L263 141L220 171L159 150Z" fill="var(--vs-green)" opacity=".5" />
      <motion.g initial={false} animate={{opacity:index===0?1:.3}} transition={{duration:reduced?0:.3}}><rect x="178" y="31" width="106" height="34" fill="var(--vs-paper)" stroke="var(--vs-ink)"/><circle cx="190" cy="43" r="4" fill="var(--vs-blue)"/><text x="199" y="47" fill="var(--vs-ink)" fontSize="10">água</text><circle cx="237" cy="43" r="4" fill="var(--vs-green)"/><text x="245" y="47" fill="var(--vs-ink)" fontSize="10">vegetação</text></motion.g>
      <motion.g initial={false} animate={{opacity:index===1?1:.3}} transition={{duration:reduced?0:.3}}><path d="M38 202H128M38 197V207M83 197V207M128 197V207" stroke="var(--vs-ink)" strokeWidth="3"/><text x="45" y="190" fill="var(--vs-ink)" fontSize="10">0</text><text x="106" y="190" fill="var(--vs-ink)" fontSize="10">10 km</text></motion.g>
      <motion.g initial={false} animate={{opacity:index===2?1:.3}} transition={{duration:reduced?0:.3}}><text x="36" y="244" fill="var(--vs-ink)" fontSize="12">Fonte: levantamento fictício · 2020</text></motion.g>
      <text x="31" y="19" fill="var(--vs-ink)" fontSize="12">Cobertura do solo · exemplo didático</text>
    </>}
    <title id={legend}>{isSig?'Camadas alinhadas pelo território':'Elementos para interpretar o mapa'}</title>
  </svg>;
}

function BasinScene({ id, index }: { id: 'world-basin' | 'brazilian-basins'; index: number }) {
  const reduced = useReducedMotion();
  const marker = useId().replace(/:/g,'');
  const brazilian = id === 'brazilian-basins';
  const targets = brazilian ? [[52,68],[154,132],[253,183]] : [[54,72],[155,130],[250,185]];
  const [x,y] = targets[index];
  return <svg className="vs-plane" viewBox="0 0 320 250" role="img" aria-label={`${brazilian?'Bacia brasileira':'Bacia mundial'} hipotética: ${GEOGRAPHY_REMAINING[id].cases[index].label} no percurso fluvial`}>
    <defs><marker id={marker} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7Z" fill="var(--vs-blue)"/></marker></defs>
    <path d="M12 37Q51 5 112 28T229 35T310 23V230Q230 249 162 236T12 237Z" fill="var(--vs-green)" opacity=".17" />
    <path d="M42 48Q65 87 121 99T187 145T282 217" fill="none" stroke="var(--vs-blue)" strokeWidth="13" markerEnd={`url(#${marker})`}/>
    <path d="M67 198Q96 140 121 99M204 55Q187 102 187 145" fill="none" stroke="var(--vs-blue)" strokeWidth="7" />
    {brazilian && <path d="M138 114L182 132L180 164L148 144Z" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" />}
    <motion.circle initial={false} animate={{cx:x,cy:y}} transition={{duration:reduced?0:.35}} r="13" fill="var(--vs-burgundy)" stroke="var(--vs-paper)" strokeWidth="3" />
    <text x="26" y="24" fill="var(--vs-ink)" fontSize="13">montante</text><text x="239" y="245" fill="var(--vs-ink)" fontSize="13">jusante</text>
    <text x="21" y="232" fill="var(--vs-ink)" fontSize="11">afluente</text>
  </svg>;
}

function FlowScene({ id, index }: { id: Exclude<GeographyRemainingId, 'digital-map' | 'map-elements' | 'world-basin' | 'brazilian-basins'>; index: number }) {
  const config = GEOGRAPHY_REMAINING[id];
  return <div className="vs-geography-flow" aria-label={`${config.title}: ${config.cases[index].label} em foco`}>
    <ol>{config.cases.map((item, n) => <li key={item.label} data-active={n === index}>
      <small>{String(n + 1).padStart(2, '0')} · {item.place}</small>
      <strong>{item.label}</strong>
      <span>{item.action}</span>
    </li>)}</ol>
    <p>{config.relation}</p>
  </div>;
}

export function geographyRemainingInstrument(id: GeographyRemainingId) {
  const config = GEOGRAPHY_REMAINING[id];
  return function GeographyRemainingBoard(props: BoardProps) {
    const [index, setIndex] = useState(0);
    const selected = config.cases[index];
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório geográfico" title={config.title} subtitle={config.question}
      condition={{label:'Recorte',value:selected.label}}
      ariaLabel={`Instrumento geográfico: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        {id === 'digital-map' || id === 'map-elements' ? <CartographicScene id={id} index={index}/> : id === 'world-basin' || id === 'brazilian-basins' ? <BasinScene id={id} index={index}/> : <FlowScene id={id} index={index}/>}
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <p>Explore os recortes do fenômeno:</p>
          <div className="vs-geography-options" role="group" aria-label={`Recortes de ${config.title}`}>
            {config.cases.map((item,n)=><button key={item.label} type="button" aria-pressed={index===n} onClick={()=>setIndex(n)}>{item.label}</button>)}
          </div>
        </div></div>
        <dl className="vs-plane-readouts" aria-live="polite">
          <div><dt>Onde</dt><dd>{selected.place}</dd></div>
          <div><dt>Observe</dt><dd>{selected.action}</dd></div>
          <div data-pivot="true"><dt>Conclua</dt><dd>{selected.inference}</dd></div>
        </dl>
        <p className="vs-instrument-dica">{config.caution}</p>
      </div>}
      left={{label:STAGE_LABEL[first?.stage??'conceito'],headline:first?.label??props.map.title,detail:first?.excerpt??config.question,formula:config.relation}}
      right={{label:STAGE_LABEL[second?.stage??'aplicacao'],headline:second?.label??props.map.title,detail:second?.excerpt??selected.action,formula:selected.inference}}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{label:'Relação espacial',general:config.relation,condition:selected.label,reduced:selected.inference}}
      closing={config.caution}
    />;
  };
}
