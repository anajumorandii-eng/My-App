import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { MOTION_DURATION, MOTION_STAGGER } from '../../../design-system/motion/tokens';
import type { SceneEntry } from '../types';
import { EcologyPlayer, type EcologyDiagramProps } from './EcologyPlayer';
import { Fish, Flow, Plant, Soil } from './EcologyArtwork';
import './EcologyCycles.css';

export const ECOLOGY_CYCLE_IDS: ReadonlySet<string> = new Set(['bio-ecologia-ciclo-nitrogenio', 'bio-ecologia-eutrofizacao']);

function NitrogenDiagram({ active, selected, replay }: EcologyDiagramProps) {
  const reduced = useSceneMotion().duration === 0;
  const paths = ['M105 92C38 146 46 297 115 383', 'M57 315Q56 365 115 383', 'M159 395H221', 'M272 395H345', 'M395 373C473 275 465 108 314 80'];
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Ciclo do nitrogênio: N₂ → amônia → nitrito → nitrato → N₂; etapa selecionada: ${selected}`}>
    <text x="32" y="31" className="eco-kicker">UM ELEMENTO, DIFERENTES FORMAS</text>
    <path d="M107 77Q125 37 160 56 193 21 222 54 266 28 295 65 333 59 332 92H105Q87 88 107 77" className="eco-cloud"/>
    <text x="215" y="79" textAnchor="middle" className="eco-formula">N₂</text><text x="215" y="111" textAnchor="middle" className="eco-label">atmosfera</text>
    <Soil top={298}/><Plant x={286} y={297} size={1.36}/>
    <path d="M286 298q-12 47-41 66m36-48 32 45m-33-18-42-9m57 17-5 30m-33-41-14 30m58-9 28 10" fill="none" stroke="var(--eco-root)" strokeWidth="3"/>
    {[[260,326],[247,348],[301,347]].map(([x,y],i) => <motion.ellipse key={i} cx={x} cy={y} rx="7" ry="5" fill="var(--eco-accent)" animate={{rx:active===0?10:7}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}/>)}
    <text x="312" y="184" className="eco-note">leguminosa</text><path d="M317 190 291 219" className="eco-annotation"/>
    <text x="312" y="310" className="eco-label">raízes + nódulos</text>
    <path d="M41 284q12-21 28-8t29 6l-13 12-35-2Z" fill="var(--eco-root)"/><text x="32" y="259" className="eco-label">matéria</text><text x="32" y="277" className="eco-label">orgânica</text>
    {paths.map((d,i)=><Flow key={d} d={d} active={active===i} replay={replay}/>)}
    <Flow d="M366 369Q346 336 309 330" active={active===3} replay={replay}/>
    {[{x:134,f:'NH₃',l:'amônia'},{x:247,f:'NO₂⁻',l:'nitrito'},{x:379,f:'NO₃⁻',l:'nitrato'}].map((n,i)=><g key={n.f}>
      <motion.ellipse cx={n.x} cy="396" rx="40" ry="29" className="eco-pool" animate={{strokeWidth:active===i+1||(i===0&&active===0)||(i===2&&active>=3)?3:1}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}/>
      <text x={n.x} y="400" textAnchor="middle" className="eco-formula eco-formula--small">{n.f}</text><text x={n.x} y="442" textAnchor="middle" className="eco-label">{n.l}</text>
    </g>)}
    <text x="26" y="153" className="eco-note">fixação ↓</text><text x="338" y="140" className="eco-note">↑ retorno ao ar</text>
    <text x="35" y="477" className="eco-label">Nitrosomonas → nitrito</text><text x="268" y="477" className="eco-label">Nitrobacter → nitrato</text>
    <text x="32" y="535" className="eco-label">O solo transforma. A planta assimila.</text>
    <text x="32" y="556" className="eco-note">Desnitrificação fecha o ciclo.</text>
  </svg>;
}

function LakeDiagram({ active, selected, replay }: EcologyDiagramProps) {
  const reduced = useSceneMotion().duration === 0;
  const t = {duration: reduced ? 0 : MOTION_DURATION.mechanism};
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Eutrofização: nutrientes → floração → luz bloqueada → oxigênio consumido → anoxia → peixes; etapa selecionada: ${selected}`}>
    <text x="28" y="30" className="eco-kicker">UM LAGO VISTO POR DENTRO</text>
    <circle cx="368" cy="96" r="29" fill="var(--eco-sun)"/>
    {[0,1,2,3,4,5,6,7].map(i=><path key={i} d="M368 55V47" transform={`rotate(${i*45} 368 96)`} stroke="var(--eco-sun)" strokeWidth="3"/>)}
    <path d="M20 185Q63 143 117 181L141 224H480V498H20Z" fill="var(--eco-soil)"/>
    <Plant x={73} y={182} size={.53}/><Plant x={42} y={191} size={.35}/>
    <path d="M130 214Q196 223 259 214T480 216V480Q334 505 185 477Z" className="eco-water"/>
    <motion.path d="M135 232H480V476Q336 500 185 477Z" fill="var(--eco-deep)" animate={{opacity:active>=4?.43:active>=2?.16:.04}} transition={t}/>
    <text x="26" y="77" className="eco-note">Excesso de</text><text x="26" y="99" className="eco-note">nutrientes</text>
    <Flow d="M84 112Q125 154 171 204" active={active===0} replay={replay}/>
    <text x="167" y="168" className="eco-label">floração superficial</text>
    <motion.g initial={reduced?false:{scaleX:.25}} animate={{scaleX:1}} transition={t} style={{originX:0,originY:.5}}>
      {Array.from({length:22},(_,i)=><ellipse key={i} cx={150+i*15} cy={213+(i%3)*3} rx="13" ry="5" fill={i%2?'var(--eco-leaf)':'var(--eco-deep)'}/>)}
    </motion.g>
    {[265,307,348].map(x=><motion.path key={x} d={`M${x+23} 245 ${x-25} 417`} stroke="var(--eco-sun)" strokeWidth="7" strokeLinecap="round" animate={{opacity:active>=1?.12:.7,pathLength:active>=1?.2:1}} transition={t}/>)}
    <text x="284" y="268" className="eco-label">luz bloqueada ↓</text>
    <motion.g animate={{opacity:active>=2?.35:1,rotate:active>=2?-12:0}} transition={t} style={{originX:.5,originY:1}}><Plant x={216} y={473} size={.75}/><Plant x={183} y={474} size={.48}/></motion.g>
    <text x="29" y="525" className="eco-label">produtoras submersas</text>
    <motion.g animate={{y:active>=5?-62:0,rotate:active>=5?165:0}} transition={t} style={{originX:.5,originY:.5}}><Fish x={391} y={375} size={.8}/></motion.g>
    <Fish x={315} y={426} size={.4}/>
    {Array.from({length:8},(_,i)=><motion.circle key={i} cx={265+(i*31)%175} cy={318+(i*37)%131} r={4+i%3} fill="none" stroke="var(--eco-oxygen)" strokeWidth="2" animate={{opacity:active>=4?0:active>=3?.2:.85,y:active>=3?-18:0}} transition={{...t,delay:reduced?0:i * MOTION_STAGGER.diagram}}/>)}
    <text x="374" y="317" className="eco-formula eco-formula--small">O₂</text>
    <motion.g animate={{opacity:active>=3?1:.2}} transition={t}>{Array.from({length:9},(_,i)=><ellipse key={i} cx={269+i*20} cy={477+(i%2)*10} rx="5" ry="2.5" fill="var(--eco-accent)" transform={`rotate(${i*19} ${269+i*20} ${477+(i%2)*10})`}/>)}</motion.g>
    <text x="275" y="525" className="eco-label">decomposição → menos O₂</text>
    <text x="28" y="555" className="eco-note">Mais nutrientes. Menos vida sob a superfície.</text>
  </svg>;
}

export function EcologyCycles({entry}:{entry:SceneEntry}) {
  const nitrogen=entry.chapterId==='bio-ecologia-ciclo-nitrogenio';
  return <EcologyPlayer key={entry.chapterId} entry={entry} title={nitrogen?'O caminho do nitrogênio':'Quando o lago perde o fôlego'} subtitle={nitrogen?'Entre a atmosfera, o solo e as raízes, bactérias transformam o nitrogênio.':'Acompanhe a cadeia que liga a floração de algas à falta de oxigênio.'} Diagram={nitrogen?NitrogenDiagram:LakeDiagram}/>;
}
