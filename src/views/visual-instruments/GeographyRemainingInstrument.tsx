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
  const active = (n:number) => n === index ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)';
  const label = config.cases[index].label;
  const common = <><text x="24" y="25" fill="var(--vs-ink)" fontSize="13" fontWeight="800">{label}</text><text x="160" y="278" textAnchor="middle" fill="var(--vs-ink)" fontSize="12" fontWeight="800">{config.relation}</text></>;
  let drawing: React.ReactNode;
  if (id === 'commons') drawing = <>
    <ellipse cx="160" cy="155" rx="92" ry="52" fill="color-mix(in srgb,var(--vs-blue) 18%,transparent)" stroke="var(--vs-blue)" strokeWidth="4"/>
    {[0,1,2,3,4].map(n=><g key={n}><circle cx={55+n*52} cy={70+(n%2)*15} r="14" fill={active(index===0?0:n<4?1:2)} /><path d={`M${55+n*52} ${86+(n%2)*15}v28`} stroke={active(index===0?0:n<4?1:2)} strokeWidth="3"/><path d={`M${55+n*52-7} 115l7 10 7-10`} fill={active(index===0?0:n<4?1:2)} /></g>)}
    <text x="160" y="160" textAnchor="middle" fill="var(--vs-ink)" fontSize="16" fontWeight="800">estoque comum</text><text x="160" y="183" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">capacidade de reposição</text>
    {index===2&&<><path d="M73 226H247" stroke="var(--vs-green)" strokeWidth="7"/><text x="160" y="247" textAnchor="middle" fill="var(--vs-green)" fontSize="12" fontWeight="800">regra + fiscalização + cooperação</text></>}
  </>;
  else if (id === 'supply-chain') drawing = <>
    {[[45,'projeto'],[137,'peças'],[229,'mercado']].map(([x,t],n) => <g key={String(t)}><rect x={Number(x)-31} y="111" width="62" height="50" rx="7" fill="color-mix(in srgb,var(--vs-paper) 88%,transparent)" stroke={active(n)} strokeWidth="4"/><text x={Number(x)} y="141" textAnchor="middle" fill="var(--vs-ink)" fontSize="12" fontWeight="800">{String(t)}</text>{n < 2 && <path d={`M${Number(x)+34} 136H${Number(x)+57}`} stroke={active(n+1)} strokeWidth="4" markerEnd="url(#geo-arrow)"/>}</g>)}
    <defs><marker id="geo-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7Z" fill="var(--vs-burgundy)"/></marker></defs><path d="M40 194Q160 236 280 194" fill="none" stroke="var(--vs-blue)" strokeWidth="4" strokeDasharray="8 5"/><text x="160" y="221" textAnchor="middle" fill="var(--vs-blue)" fontSize="12">logística e informação</text>
  </>;
  else if (id === 'technopole') drawing = <>
    <circle cx="160" cy="145" r="43" fill="color-mix(in srgb,var(--vs-burgundy) 22%,transparent)" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="160" y="142" textAnchor="middle" fill="var(--vs-ink)" fontSize="14" fontWeight="800">empresas</text><text x="160" y="160" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">inovadoras</text>
    {[[67,82,'pesquisa'],[252,82,'capital'],[72,218,'pessoas'],[246,218,'rede']].map(([x,y,t],n)=><g key={String(t)}><circle cx={Number(x)} cy={Number(y)} r="28" fill="var(--vs-paper)" stroke={active(n)} strokeWidth="4"/><text x={Number(x)} y={Number(y)+4} textAnchor="middle" fill="var(--vs-ink)" fontSize="11" fontWeight="800">{String(t)}</text><path d={`M${Number(x)+(Number(x)<160?23:-23)} ${Number(y)+(Number(y)<145?18:-18)}L${Number(x)<160?135:185} ${Number(y)<145?123:167}`} stroke={active(n)} strokeWidth="3"/></g>)}
  </>;
  else if (id === 'geoeconomics') drawing = <>
    <path d="M31 157H287" stroke="var(--vs-ink-muted)" strokeWidth="5"/><path d="M77 105h58v104H77zM190 105h58v104h-58z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><text x="106" y="97" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">país A</text><text x="219" y="97" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">país B</text>
    <path d="M139 145H184" stroke={active(index)} strokeWidth="7" markerEnd="url(#geo-arrow)"/>{index===0&&<><path d="M160 125v39" stroke="var(--vs-burgundy)" strokeWidth="6"/><text x="160" y="118" textAnchor="middle" fill="var(--vs-burgundy)" fontSize="12">tarifa</text></>}{index===1&&<><path d="M160 126l24 39m0-39-24 39" stroke="var(--vs-burgundy)" strokeWidth="5"/><text x="160" y="118" textAnchor="middle" fill="var(--vs-burgundy)" fontSize="12">sanção</text></>}{index===2&&<><rect x="145" y="132" width="34" height="25" rx="4" fill="var(--vs-burgundy)"/><text x="162" y="149" textAnchor="middle" fill="var(--vs-paper)" fontSize="10">chip</text></>}
  </>;
  else if (id === 'mining') drawing = <>
    <path d="M25 208Q75 178 120 204T220 195T295 207V248H25Z" fill="color-mix(in srgb,var(--vs-green) 34%,transparent)"/><path d="M78 204l32-83 39 83Z" fill="color-mix(in srgb,var(--vs-ink) 20%,transparent)" stroke={active(0)} strokeWidth="4"/><path d="M82 204l18-47 23 47" fill="var(--vs-burgundy)" opacity={index === 0 ? .8 : .25}/><path d="M125 189H221" stroke={active(1)} strokeWidth="6" markerEnd="url(#geo-arrow)"/><rect x="221" y="161" width="48" height="45" rx="4" fill="var(--vs-paper)" stroke={active(1)} strokeWidth="4"/><text x="245" y="189" textAnchor="middle" fill="var(--vs-ink)" fontSize="10">usina</text><path d="M143 222q35 20 72 0" stroke={active(2)} strokeWidth="7" fill="none"/><text x="179" y="252" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">rejeitos e monitoramento</text>
  </>;
  else drawing = <>
    <path d="M20 210Q68 152 118 191T216 160T301 199V248H20Z" fill="color-mix(in srgb,var(--vs-green) 26%,transparent)"/><path d="M52 204h40v-57H52z" fill="var(--vs-paper)" stroke={active(0)} strokeWidth="4"/><path d="M57 147l15-23 15 23" fill="var(--vs-burgundy)" opacity={index === 0 ? .8 : .3}/><path d="M142 185h57" stroke={active(1)} strokeWidth="7"/><circle cx="171" cy="159" r="20" fill="var(--vs-paper)" stroke={active(1)} strokeWidth="4"/><path d="M171 139v40M151 159h40" stroke={active(1)} strokeWidth="3"/><path d="M200 192H282" stroke={active(2)} strokeWidth="6" markerEnd="url(#geo-arrow)"/><rect x="250" y="158" width="40" height="35" fill="var(--vs-paper)" stroke={active(2)} strokeWidth="3"/><text x="270" y="180" textAnchor="middle" fill="var(--vs-ink)" fontSize="10">cidade</text>
  </>;
  return <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.title}: ${label} em foco`} data-geography-system={id}>{drawing}{common}</svg>;
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
