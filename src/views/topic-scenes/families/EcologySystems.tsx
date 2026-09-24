import React from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { MOTION_DURATION, MOTION_STAGGER } from '../../../design-system/motion/tokens';
import type { SceneEntry } from '../types';
import { EcologyPlayer, type EcologyDiagramProps } from './EcologyPlayer';
import { Fish, Flow, Plant, Soil } from './EcologyArtwork';
import './EcologyCycles.css';

export const ECOLOGY_SYSTEM_IDS: ReadonlySet<string> = new Set(['bio-ecologia-dinamica-populacoes','bio-ecologia-invasoras-controle-biologico','bio-ecologia-sucessao','bio-ecologia-ciclo-hidrologico-poluicao-agua']);

function PopulationProfiles({active,selected,replay}:EcologyDiagramProps) {
  const reduced = useSceneMotion().duration === 0;
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Estratégias: muitos descendentes e pouco cuidado; poucos descendentes e longo cuidado. Selecionado: ${selected}`}>
    <text x="26" y="30" className="eco-kicker">DUAS FORMAS DE INVESTIR NA DESCENDÊNCIA</text>
    <path d="M25 76Q250 45 475 76V273Q250 300 25 273Z" className="eco-water"/>
    <Fish x={122} y={153} size={1.2}/>
    {Array.from({length:21},(_,i)=><motion.g key={`${i}-${replay}`} initial={reduced?false:{x:-45,opacity:0}} animate={{x:0,opacity:active===0?1:.35}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism,delay:reduced?0:i * MOTION_STAGGER.diagram}}><Fish x={243+i%5*42} y={103+Math.floor(i/5)*30} size={.22}/></motion.g>)}
    <text x="47" y="236" className="eco-formula">r</text><text x="80" y="231" className="eco-label">muitos descendentes</text><text x="80" y="252" className="eco-note">pouco cuidado por indivíduo</text>
    <path d="M25 453Q240 421 475 453V493H25Z" fill="var(--eco-soil)"/>
    <motion.g animate={{x:active===1?18:0}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}>
      <path d="M103 433V370Q113 324 184 330L234 339Q262 340 269 365L265 422Q262 440 246 428L245 387 230 382 221 442H200L190 393 144 394 136 442H114L113 389" fill="var(--eco-root)" stroke="var(--eco-deep)" strokeWidth="2"/>
      <path d="M227 352Q190 337 199 382 222 399 237 374M261 374 279 384 263 386" fill="var(--eco-soil)" stroke="var(--eco-deep)" strokeWidth="2"/><circle cx="250" cy="358" r="3" fill="var(--eco-deep)"/>
      <g transform="translate(242 250) scale(.43)"><path d="M103 433V370Q113 324 184 330L234 339Q262 340 269 365L265 422Q262 440 246 428L245 387 230 382 221 442H200L190 393 144 394 136 442H114L113 389" fill="var(--eco-root)" stroke="var(--eco-deep)" strokeWidth="3"/><path d="M227 352Q190 337 199 382 222 399 237 374" fill="var(--eco-soil)"/><circle cx="250" cy="358" r="4" fill="var(--eco-deep)"/></g>
    </motion.g>
    <text x="354" y="348" className="eco-formula">K</text><text x="335" y="374" className="eco-label">poucos</text><text x="335" y="394" className="eco-label">descendentes</text>
    <text x="44" y="522" className="eco-note">Mais cuidado, maturação mais lenta.</text><text x="26" y="551" className="eco-label">Perfis qualitativos; quantidades apenas ilustrativas.</text>
  </svg>;
}

function SuccessionLandscape({active,selected}:EcologyDiagramProps) {
  const reduced = useSceneMotion().duration === 0;
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Sucessão: pioneira → gramíneas → arbustos → árvores; etapa selecionada: ${selected}`}>
    <text x="27" y="30" className="eco-kicker">A COMUNIDADE TRANSFORMA O LUGAR</text>
    <circle cx="406" cy="102" r="32" fill="var(--eco-sun)" opacity=".65"/>
    <path d="M20 287Q160 197 261 271T480 261V330H20Z" fill="var(--eco-leaf)" opacity=".12"/>
    <Soil top={345}/>
    <path d="M32 345 49 321 91 312 119 345M176 345 205 320 235 345" fill="var(--eco-grain)" stroke="var(--eco-root)"/>
    {Array.from({length:11},(_,i)=><path key={i} d={`M${42+i*40} 342q-6-13-12-9m12 9 7-15`} fill="none" stroke="var(--eco-leaf)" strokeWidth="3"/>)}
    <motion.g animate={{scaleY:active>=1?1:.03,opacity:active>=1?1:.15}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}} style={{originX:.5,originY:1}}>
      {[80,164,288,420].map((x,i)=><Plant key={x} x={x} y={344} size={.55+(i%2)*.18}/>)}
    </motion.g>
    <motion.g animate={{scaleY:active>=2?1:.03,opacity:active>=2?1:0}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}} style={{originX:.5,originY:1}}><Plant x={218} y={345} size={1.42} canopy/><Plant x={354} y={345} size={1.04} canopy/></motion.g>
    <motion.path d="M33 369Q199 343 470 365V400Q280 380 33 408Z" fill="var(--eco-root)" animate={{opacity:active===0?.15:active===1?.4:.7}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}/>
    <text x="47" y="441" className="eco-label">matéria orgânica e solo</text>
    <text x="28" y="93" className="eco-formula">{['01','02','03'][active]}</text>
    <text x="28" y="119" className="eco-note">{['colonização','solo estabilizado','equilíbrio dinâmico'][active]}</text>
    <text x="30" y="534" className="eco-note">Pioneiras → gramíneas → arbustos → árvores</text>
    <text x="30" y="556" className="eco-label">Esquema de sucessão; o tempo depende do ambiente.</text>
  </svg>;
}

function InvasionWeb({active,selected,replay}:EcologyDiagramProps) {
  const reduced = useSceneMotion().duration === 0;
  const effects=['nativa sem defesa','recurso e espaço','patógeno novo','patrimônio genético','ambiente e fogo'];
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Invasora → nativa e recurso: cinco caminhos de impacto; selecionado: ${selected}`}>
    <text x="26" y="30" className="eco-kicker">UMA CHEGADA MUDA AS RELAÇÕES</text>
    <path d="M20 183Q145 119 264 172T480 160V435Q224 482 20 423Z" className={active===4?undefined:'eco-water'} fill={active===4?'var(--eco-soil)':undefined}/>
    <motion.g animate={{x:active===0?70:0}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}>{active===4?<g>{Array.from({length:11},(_,i)=><path key={i} d={`M112 305Q${67+i*9} ${244-i%3*19} ${54+i*12} ${186+i%4*15}`} fill="none" stroke="var(--eco-leaf)" strokeWidth="4"/>)}</g>:<Fish x={112} y={231} size={1.25}/>}</motion.g>
    <text x="37" y="123" className="eco-note">invasora</text><path d="M85 134 110 193" className="eco-annotation"/>
    <motion.g animate={{opacity:active===0||active===2?.35:1,x:active===1?32:0}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}>{active===4?<Plant x={373} y={311} size={.7} canopy/>:<><Fish x={355} y={236} size={.65}/><Fish x={403} y={310} size={.4}/></>}</motion.g>
    <text x="336" y="123" className="eco-note">nativa</text><path d="M365 134 355 210" className="eco-annotation"/>
    <Plant x={254} y={413} size={.74}/>
    <Flow d={active===1?'M137 267Q190 345 237 366M354 263Q312 345 272 366':'M163 227Q230 174 324 227'} active replay={replay}/>
    {active===2&&[0,1,2,3,4].map(i=><motion.circle key={i} cx={211+i*26} cy={205-i%2*8} r="4" fill="var(--eco-accent)" initial={reduced?false:{opacity:0,x:-25}} animate={{opacity:1,x:0}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism,delay:reduced?0:i * MOTION_STAGGER.diagram}}/>)}
    {active===3&&<g><path d="M165 322Q220 292 275 322T385 322M165 350Q220 380 275 350T385 350" fill="none" stroke="var(--eco-accent)" strokeWidth="3"/>{[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${176+i*32} 323v27`} stroke="var(--eco-deep)"/>)}</g>}
    {active===4&&<g><path d="M325 416Q285 394 322 354Q314 381 340 367Q370 403 341 420Z" fill="var(--eco-accent)"/><text x="42" y="464" className="eco-label">Ex.: capim-braquiária altera o regime de fogo.</text></g>}
    <text x="27" y="512" className="eco-formula eco-formula--small">{effects[active]}</text>
    <text x="27" y="540" className="eco-label">Relações esquemáticas; não representam uma espécie.</text>
    <text x="27" y="560" className="eco-note">Cada mecanismo muda uma relação diferente.</text>
  </svg>;
}

const pollution=[['esgoto','decomposição consome O₂'],['fertilizantes','floração de algas'],['refrigeração industrial','temperatura ↑ / O₂ disponível ↓'],['metais e agrotóxicos','biomagnificação'],['patógenos fecais','contaminação'],['microplásticos','ingestão por filtradores']];
function WaterPollution({active,selected,replay}:EcologyDiagramProps) {
  const reduced = useSceneMotion().duration === 0;
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Poluição: fonte → água → efeito; agente selecionado: ${selected}. ${pollution[active][0]} → ${pollution[active][1]}`}>
    <text x="25" y="30" className="eco-kicker">DA MARGEM À CADEIA ALIMENTAR</text>
    <path d="M20 229Q104 215 155 257L196 477H20Z" fill="var(--eco-soil)"/>
    <path d="M155 255Q290 246 480 260V487H196Z" className="eco-water"/>
    <path d="M37 216V130H88V96H106V151L131 140V216Z" fill="var(--eco-root)" stroke="var(--eco-deep)" strokeWidth="2"/>
    <path d="M119 214h34v48h30" fill="none" stroke="var(--eco-grain)" strokeWidth="15"/>
    <text x="28" y="69" className="eco-note">{pollution[active][0]}</text>
    <Flow d="M181 268Q243 297 277 350T401 411" active replay={replay}/>
    <motion.ellipse cx="280" cy="322" rx="81" ry="42" fill="var(--eco-accent)" initial={reduced?false:{scale:.3}} animate={{scale:1,opacity:active===2?.27:.08}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism}}/>
    <Plant x={230} y={481} size={.65}/><Fish x={384} y={414} size={.8}/><Fish x={327} y={350} size={.36}/>
    {Array.from({length:12},(_,i)=><motion.circle key={`${active}-${i}-${replay}`} cx={205+(i*23)%208} cy={287+(i*31)%141} r={active===5?2:3} fill={active===1?'var(--eco-leaf)':'var(--eco-accent)'} initial={reduced?false:{x:-30,y:-20,opacity:0}} animate={{x:0,y:0,opacity:.85}} transition={{duration: reduced ? 0 : MOTION_DURATION.mechanism,delay:reduced?0:i * MOTION_STAGGER.diagram}}/>)}
    {active===1&&<path d="M183 259Q282 245 476 262" fill="none" stroke="var(--eco-leaf)" strokeWidth="10"/>}
    {active===2&&<g><path d="M428 292v54" stroke="var(--eco-accent)" strokeWidth="5"/><circle cx="428" cy="350" r="11" fill="var(--eco-accent)"/><text x="398" y="285" className="eco-label">calor</text></g>}
    <text x="28" y="529" className="eco-note">{pollution[active][1]}</text>
    <text x="28" y="554" className="eco-label">Selecione o agente e acompanhe seu caminho na água.</text>
  </svg>;
}

const diagrams:Record<string,{Diagram:React.ComponentType<EcologyDiagramProps>;title:string;subtitle:string}>={
 'bio-ecologia-dinamica-populacoes':{Diagram:PopulationProfiles,title:'Quantidade ou cuidado?',subtitle:'Compare o investimento reprodutivo em dois perfis de história de vida.'},
 'bio-ecologia-invasoras-controle-biologico':{Diagram:InvasionWeb,title:'Uma espécie muda o sistema',subtitle:'Explore cinco caminhos pelos quais uma invasora afeta o ambiente.'},
 'bio-ecologia-sucessao':{Diagram:SuccessionLandscape,title:'A paisagem se transforma',subtitle:'Veja a comunidade modificar o solo e criar condições para outras espécies.'},
 'bio-ecologia-ciclo-hidrologico-poluicao-agua':{Diagram:WaterPollution,title:'O que chega à água?',subtitle:'A fonte, o percurso e o efeito dependem do agente poluente.'},
};
export function EcologySystems({entry}:{entry:SceneEntry}) {
 return <EcologyPlayer key={entry.chapterId} entry={entry} {...diagrams[entry.chapterId]}/>;
}
