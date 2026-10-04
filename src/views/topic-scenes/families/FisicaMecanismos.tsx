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
  return <g opacity={1} data-active={active}><path d={`M${x1} ${y1}L${x2} ${y2}`} className="pm-arrow" markerEnd="url(#pm-arrow-head)"/><text x={(x1+x2)/2+labelDx} y={(y1+y2)/2-10+labelDy} textAnchor="middle" className="pm-label">{label}</text></g>;
}

function Forces({ focus }: { focus: number }) {
  return <><path d="M74 246H545" className="pm-ground"/><rect x="243" y="157" width="122" height="88" rx="12" className="pm-object"/><circle cx="305" cy="200" r="7" className="pm-center"/>
    <Arrow x1={305} y1={193} x2={305} y2={89} label="N" active={focus===1}/><Arrow x1={305} y1={207} x2={305} y2={312} label="P = mg" labelDx={75} labelDy={29} active={focus===0}/>
    <path d="M365 190H507" className="pm-rope"/><Arrow x1={374} y1={178} x2={506} y2={178} label="T" active={focus===2}/>
    <Arrow x1={235} y1={236} x2={112} y2={236} label="atrito" active={focus===3}/>
    <g opacity={1} data-active={focus===4}><path d="M70 186h34l12-16 16 32 16-32 16 32 16-32 16 32 13-16h31" className="pm-spring"/><Arrow x1={239} y1={147} x2={121} y2={147} label="F = kx"/></g>
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
  return <><text x="28" y="46" className="pm-heading">do recurso à corrente elétrica</text>
    {focus===0?<g data-generation="hydro"><path d="M32 110H131V163H163V220H32Z" className="pm-source"/><path d="M32 134H129M44 145q10-6 20 0t20 0t20 0" className="pm-axis"/><path d="M140 144V195H187" className="pm-rope"/><Arrow x1={155} y1={170} x2={155} y2={210} label="água" labelDx={-46}/><text x="32" y="260" className="pm-label">altura → movimento</text></g>
    :focus===2?<g data-generation="wind"><path d="M103 160V235M103 160L76 112M103 160L153 148M103 160L83 205" className="pm-blades"/><Arrow x1={30} y1={100} x2={78} y2={100} label="vento"/><text x="30" y="260" className="pm-label">rotação pelo vento</text></g>
    :solar?<g data-generation="photovoltaic"><circle cx="95" cy="127" r="26" className="pm-source"/><path d="M95 86V73M132 127h15M95 167v13M58 127H44" className="pm-axis"/><Arrow x1={111} y1={169} x2={202} y2={207} label="fótons"/><text x="34" y="260" className="pm-label">luz → cargas móveis</text></g>
    :<g data-generation={focus===4?'fission-steam':'combustion-steam'}><rect x="34" y="122" width="120" height="90" rx="12" className="pm-source"/><path d="M154 145H189V115H228" className="pm-rope"/><path d="M52 174q12-15 24 0t24 0t24 0" className="pm-axis"/>{focus===4?<><circle cx="78" cy="149" r="12" className="pm-second"/><circle cx="112" cy="148" r="9" className="pm-second"/><text x="94" y="103" textAnchor="middle" className="pm-label">fissão controlada</text></>:<><path d="M66 196q-16 28 15 30q30-13 6-39q-6 24-21 9" className="pm-second"/><text x="94" y="103" textAnchor="middle" className="pm-label">combustão</text></>}<text x="210" y="93" textAnchor="middle" className="pm-label">vapor</text><text x="29" y="260" className="pm-label">calor → vapor → giro</text></g>}
    <Arrow x1={190} y1={162} x2={245} y2={162} label="converte"/>
    {solar ? <><rect x="252" y="112" width="128" height="101" rx="7" className="pm-panel"/><path d="M252 145h128m-128 34h128m43-66v100m-85-100v100" className="pm-panel-grid"/><text x="316" y="244" textAnchor="middle" className="pm-label">células fotovoltaicas</text></> : <><circle cx="295" cy="162" r="32" className="pm-turbine"/><path d="M295 133v58m-29-29h58m-50-20l40 40m0-40l-40 40" className="pm-blades"/><path d="M327 162H358" className="pm-rope"/><rect x="356" y="145" width="29" height="35" className="pm-source"/><text x="316" y="243" textAnchor="middle" className="pm-label">turbina → gerador</text></>}
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
  if (focus===0) return <g data-charging="friction">
    <text x="29" y="45" className="pm-heading">Atrito · dois materiais</text>
    <text x="29" y="78" className="pm-small">Inicialmente neutros</text>
    <Arrow x1={135} y1={120} x2={285} y2={120} label="esfregar"/>
    <rect x="85" y="145" width="240" height="64" rx="8" className="pm-charge-body"/>
    <rect x="270" y="209" width="260" height="64" rx="8" className="pm-charge-body"/>
    <text x="105" y="185" className="pm-label">material A → +Q</text><text x="320" y="250" className="pm-label">material B → −Q</text>
    <g data-transfer="electrons"><Arrow x1={295} y1={190} x2={295} y2={234} label="e⁻" labelDx={55}/></g>
    <text x="29" y="319" className="pm-equation">A perde elétrons; B recebe elétrons.</text>
    <text x="29" y="355" className="pm-equation">Cargas finais: +Q e −Q · total zero.</text>
    <text x="29" y="406" className="pm-small"><tspan x="29">Materiais distintos em contato</tspan><tspan x="29" dy="32">e movimento.</tspan></text>
  </g>;
  if (focus===1) return <g data-charging="contact">
    <text x="29" y="45" className="pm-heading">Contato · condutores idênticos</text>
    <text x="29" y="85" className="pm-small">Antes: eletrizado e neutro</text>
    <circle cx="235" cy="175" r="65" className="pm-charge-body"/><circle cx="365" cy="175" r="65" className="pm-charge-body"/>
    <text x="235" y="156" textAnchor="middle" className="pm-label">−Q</text><text x="365" y="156" textAnchor="middle" className="pm-label">0</text>
    <g data-transfer="electrons"><Arrow x1={258} y1={204} x2={342} y2={204} label="e⁻"/></g>
    <text x="29" y="291" className="pm-equation"><tspan x="29">Depois: −Q/2 em cada esfera</tspan><tspan x="29" dy="34">· mesmo potencial.</tspan></text>
    <text x="29" y="369" className="pm-equation"><tspan x="29">Elétrons atravessam a região</tspan><tspan x="29" dy="34">de contato.</tspan></text>
    <text x="29" y="450" className="pm-small">Sistema isolado · carga total conservada.</text>
  </g>;
  return <g data-charging="induction">
    <text x="29" y="45" className="pm-heading">Indução · polarização</text>
    <text x="29" y="78" className="pm-small">Sem aterramento</text>
    <circle cx="150" cy="190" r="58" className="pm-charge-body"/><circle cx="435" cy="190" r="78" className="pm-charge-body"/>
    <text x="150" y="198" textAnchor="middle" className="pm-electron">−Q</text>
    {[0,1,2].map(n=><g key={n}><text data-induced-sign="+" x="390" y={152+n*38} className="pm-electron">+</text><text data-induced-sign="−" x="465" y={152+n*38} className="pm-electron">−</text></g>)}
    <text x="290" y="115" textAnchor="middle" className="pm-label">sem contato</text>
    <Arrow x1={410} y1={310} x2={470} y2={310} label="e⁻ no condutor"/>
    <text x="29" y="354" className="pm-equation">Indução: carga total permanece zero.</text>
    <text x="29" y="404" className="pm-small"><tspan x="29">Elétrons se afastam do indutor negativo.</tspan><tspan x="29" dy="32">Não há transferência entre corpos.</tspan></text>
  </g>;
}

export function FisicaMecanismos({ entry }: { entry: SceneEntry }) {
  const [focus,setFocus]=useState(0);
  const transition=useSceneMotion();
  const item=entry.items[focus];
  const kind=entry.chapterId;
  return <section className="tc-scene pm-scene" aria-label={entry.question}>
    <header><small>CRIVO · laboratório de mecanismos</small><h4>{entry.question}</h4></header>
    <div className={kind===IDS.forces||kind===IDS.generation?'pm-wide-window':undefined} tabIndex={kind===IDS.forces||kind===IDS.generation?0:undefined} role="region" aria-label="Desenho do mecanismo; use as setas para percorrer" onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();event.currentTarget.scrollLeft+=event.key==='ArrowRight'?120:-120;}}}>
    <svg className={kind===IDS.charging ? 'pm-charging' : undefined} viewBox={kind===IDS.charging ? '0 0 620 480' : '0 0 620 360'} role="img" aria-label={`${entry.question} Selecionado: ${item.label}`}>
      <defs><marker id="pm-arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#a5455c"/></marker></defs>
      <rect x="7" y="7" width="606" height={kind===IDS.charging ? 466 : 346} rx="16" className="pm-paper"/>
      {kind===IDS.forces?<Forces focus={focus}/>:kind===IDS.collisions?<Collisions focus={focus}/>:kind===IDS.generation?<Generation focus={focus}/>:kind===IDS.gases?<Gases focus={focus}/>:<Charging focus={focus}/>}
    </svg></div>
    {(kind===IDS.forces||kind===IDS.generation)&&<p className="cp-pan-hint">Deslize o desenho; com teclado, use as setas.</p>}
    <div className="pm-options" aria-label="Escolha o mecanismo">
      {entry.items.map((candidate,index)=><motion.button key={candidate.label} type="button" aria-pressed={focus===index} onClick={()=>setFocus(index)} animate={{y:focus===index?-3:0}} transition={transition}>{candidate.label}</motion.button>)}
    </div>
    <aside className="pm-detail" role="status"><strong>{item.label}</strong><p>{item.claim}</p><blockquote>“{item.quote}” <cite>{item.section}</cite></blockquote></aside>
    {entry.nota&&<p className="tc-nota">{entry.nota}</p>}
  </section>;
}
