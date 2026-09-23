import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import './FisicaMecanismos.css';

const IDS = {
  forces: 'summary-fisica-forca-e-seus-tipos',
  collisions: 'summary-fisica-colisoes',
  generation: 'summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares',
  gases: 'summary-fisica-gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas',
  charging: 'summary-fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes',
} as const;
export const PHYSICS_MECHANISM_IDS = new Set<string>(Object.values(IDS));

function Arrow({ x1, y1, x2, y2, label, active = true, labelDx = 0, labelDy = 0 }: { x1: number; y1: number; x2: number; y2: number; label: string; active?: boolean; labelDx?: number; labelDy?: number }) {
  return <g opacity={active ? 1 : .27}><path d={`M${x1} ${y1}L${x2} ${y2}`} className="pm-arrow" markerEnd="url(#pm-arrow-head)"/><text x={(x1+x2)/2+labelDx} y={(y1+y2)/2-10+labelDy} textAnchor="middle" className="pm-label">{label}</text></g>;
}

function Forces({ focus }: { focus: number }) {
  return <><path d="M74 246H545" className="pm-ground"/><rect x="243" y="157" width="122" height="88" rx="12" className="pm-object"/><circle cx="305" cy="200" r="7" className="pm-center"/>
    <Arrow x1={305} y1={193} x2={305} y2={89} label="N" active={focus===1}/><Arrow x1={305} y1={207} x2={305} y2={312} label="P = mg" labelDx={75} labelDy={29} active={focus===0}/>
    <path d="M365 190H507" className="pm-rope"/><Arrow x1={374} y1={178} x2={506} y2={178} label="T" active={focus===2}/>
    <Arrow x1={235} y1={236} x2={112} y2={236} label="atrito" active={focus===3}/>
    <g opacity={focus===4?1:.25}><path d="M70 186h34l12-16 16 32 16-32 16 32 16-32 16 32 13-16h31" className="pm-spring"/><Arrow x1={239} y1={147} x2={121} y2={147} label="F = kx"/></g>
    <text x="26" y="40" className="pm-heading">diagrama de corpo livre</text><text x="27" y="337" className="pm-small">As setas indicam direção e sentido; seu tamanho aqui não representa módulo.</text></>;
}

function Collisions({ focus }: { focus: number }) {
  const joined = focus === 1;
  return <><text x="32" y="47" className="pm-heading">antes</text><circle cx="104" cy="147" r="31" className="pm-object"/><circle cx="232" cy="147" r="31" className="pm-second"/><Arrow x1={140} y1={147} x2={185} y2={147} label="v₁"/>
    <path d="M300 72V287" className="pm-divider"/><text x="332" y="47" className="pm-heading">depois</text>
    <circle cx={joined?431:391} cy="147" r="31" className="pm-object"/><circle cx={joined?474:510} cy="147" r="31" className="pm-second"/>
    <Arrow x1={joined?490:427} y1={147} x2={joined?540:463} y2={147} label={joined?'v comum':'v₁′'}/>
    {!joined && <Arrow x1={520} y1={108} x2={focus===0?579:550} y2={108} label="v₂′"/>}
    <text x="36" y="259" className="pm-equation">p antes = p depois</text><text x="335" y="259" className="pm-equation">{focus===0?'Ec conservada':joined?'corpos unidos':'Ec diminui'}</text>
    <text x="32" y="313" className="pm-small">A quantidade de movimento se conserva em sistema isolado.</text></>;
}

function Generation({ focus }: { focus: number }) {
  const solar = focus===3;
  const source=[['queda','d’água'],['calor','→ vapor'],['vento'],['luz','solar'],['fissão','→ vapor']][focus] ?? ['fonte'];
  return <><text x="28" y="46" className="pm-heading">do recurso à corrente elétrica</text>
    <circle cx="112" cy="163" r="57" className="pm-source"/><text x="112" y={source.length===1?168:154} textAnchor="middle" className="pm-source-label">{source.map((part,index)=><tspan key={part} x="112" dy={index?19:0}>{part}</tspan>)}</text>
    <Arrow x1={190} y1={162} x2={245} y2={162} label="converte"/>
    {solar ? <><rect x="252" y="112" width="128" height="101" rx="7" className="pm-panel"/><path d="M252 145h128m-128 34h128m43-66v100m-85-100v100" className="pm-panel-grid"/><text x="316" y="244" textAnchor="middle" className="pm-label">células fotovoltaicas</text></> : <><circle cx="316" cy="162" r="48" className="pm-turbine"/><path d="M316 119v86m-43-43h86m-72-29l58 58m0-58l-58 58" className="pm-blades"/><text x="316" y="243" textAnchor="middle" className="pm-label">turbina + gerador</text></>}
    <Arrow x1={386} y1={162} x2={448} y2={162} label="gera"/><path d="M466 173q19-57 37-17t40-4" className="pm-electric"/><text x="504" y="228" textAnchor="middle" className="pm-label">corrente</text>
    <text x="29" y="296" className="pm-equation">{solar?'Sem eixo giratório: efeito fotovoltaico.':'A fonte move a turbina.'}</text>
    {!solar&&<text x="29" y="322" className="pm-equation">O gerador converte movimento em eletricidade.</text>}</>;
}

function Gases({ focus }: { focus: number }) {
  const curves=['M108 99C166 176 260 232 470 257','M108 181H470','M292 83V270'];
  return <><text x="32" y="45" className="pm-heading">transformação de gás ideal</text><path d="M86 70V279H524" className="pm-axis"/><text x="60" y="86" className="pm-label">P</text><text x="505" y="309" className="pm-label">V</text>
    {curves.map((curve,index)=><path key={curve} d={curve} className={focus===index?'pm-gas-line pm-gas-line--active':'pm-gas-line'} />)}
    <text x="100" y="330" className="pm-equation">{['T constante · P × V = constante','P constante · V/T = constante','V constante · P/T = constante'][focus]}</text></>;
}

function Charging({ focus }: { focus: number }) {
  const gap=focus===2;
  return <><text x="29" y="47" className="pm-heading">redistribuição de elétrons</text>
    <circle cx="190" cy="166" r="74" className="pm-charge-body"/><circle cx="430" cy="166" r="74" className="pm-charge-body"/>
    {[-1,0,1].map((n)=><g key={n}><text x={155+n*28} y={151+n%2*37} className="pm-electron">{focus===0?'+':'−'}</text><text x={394+n*29} y={151+n%2*37} className="pm-electron">{focus===2&&n<1?'+':'−'}</text></g>)}
    {focus<2?<Arrow x1={268} y1={165} x2={353} y2={165} label="elétrons"/>:<><path d="M266 90v155m87-155v155" className="pm-no-touch"/><text x="311" y="75" textAnchor="middle" className="pm-label">sem contato</text></>}
    <text x="26" y="294" className="pm-equation">{['Atrito: cargas finais opostas.','Contato: elétrons fluem até o mesmo potencial.','Indução: cargas se separam; carga total permanece zero.'][focus]}</text>
    {gap&&<text x="29" y="328" className="pm-small">A polarização desenhada não inclui aterramento.</text>}</>;
}

export function FisicaMecanismos({ entry }: { entry: SceneEntry }) {
  const [focus,setFocus]=useState(0);
  const transition=useSceneMotion();
  const item=entry.items[focus];
  const kind=entry.chapterId;
  return <section className="tc-scene pm-scene" aria-label={entry.question}>
    <header><small>CRIVO · laboratório de mecanismos</small><h4>{entry.question}</h4></header>
    <svg viewBox="0 0 620 360" role="img" aria-label={`${entry.question} Selecionado: ${item.label}`}>
      <defs><marker id="pm-arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#a5455c"/></marker></defs>
      <rect x="7" y="7" width="606" height="346" rx="16" className="pm-paper"/>
      {kind===IDS.forces?<Forces focus={focus}/>:kind===IDS.collisions?<Collisions focus={focus}/>:kind===IDS.generation?<Generation focus={focus}/>:kind===IDS.gases?<Gases focus={focus}/>:<Charging focus={focus}/>}
    </svg>
    <div className="pm-options" aria-label="Escolha o mecanismo">
      {entry.items.map((candidate,index)=><motion.button key={candidate.label} type="button" aria-pressed={focus===index} onClick={()=>setFocus(index)} animate={{y:focus===index?-3:0}} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="pm-detail" role="status"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
    {entry.nota&&<p className="tc-nota">{entry.nota}</p>}
  </section>;
}
