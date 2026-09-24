import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { MOTION_DURATION, MOTION_STAGGER } from '../../../design-system/motion/tokens';
import type { SceneEntry } from '../types';
import { EcologyPlayer, type EcologyDiagramProps } from './EcologyPlayer';
import { Flow } from './EcologyArtwork';
import './EcologyCycles.css';
import './HistoriaGeografia.css';

export const HISTORIA_GEOGRAFIA_IDS: ReadonlySet<string> = new Set([
  'summary-historia-revolucao-francesa', 'summary-historia-revolucao-industrial',
  'summary-geografia-projecoes-cartograficas', 'summary-geografia-dinamica-climatica',
]);

function FrenchRevolution({active,replay}:EcologyDiagramProps) {
  const transition=useSceneMotion();
  const reduced=transition.duration===0;
  const dates=['1789','JUN. 1789','JUL. 1789','1793–1794'];
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Revolução Francesa: crise fiscal, Assembleia Nacional, Bastilha e Terror; etapa ${active+1} destacada`}>
    <text x="25" y="30" className="eco-kicker">FRANÇA / RUPTURAS DO ANTIGO REGIME</text>
    <text x="25" y="89" className="hg-year">{dates[active]}</text>
    <AnimatePresence mode="wait">
      <motion.g key={active} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={transition}>
        {active===0?<g>
          <path d="M75 175Q170 148 247 179 331 145 425 166V403Q332 386 247 416 159 391 75 419Z" className="hg-parchment"/>
          <path d="M247 179V416M92 194Q160 174 224 192M92 212Q165 194 224 211M272 193Q337 173 405 188" className="hg-engraving"/>
          {[0,1,2,3,4,5].map(i=><path key={i} d={`M96 ${258+i*21}h117m61 0h121`} className="hg-engraving"/>)}
          <text x="101" y="239" className="hg-document-title">RECEITAS</text><text x="278" y="239" className="hg-document-title">DESPESAS</text>
          {[0,1,2].map(i=><g key={i}><ellipse cx={360+i*21} cy={412-i*7} rx="30" ry="10" className="hg-coin"/><path d={`M${330+i*21} ${412-i*7}v8q30 17 60 0v-8`} className="hg-coin"/></g>)}
          <text x="29" y="464" className="eco-note">Uma crise no tesouro</text><text x="29" y="487" className="eco-label">Crise financeira → convocação dos Estados Gerais</text>
        </g>:active===1?<g>
          <path d="M64 427V165H435V427Z" className="hg-parchment"/>
          <text x="249" y="200" textAnchor="middle" className="hg-document-title">ESTADOS GERAIS</text>
          {['clero','nobreza','Terceiro Estado'].map((label,i)=><g key={label}>
            <path d={`M${94+i*125} 272v-34h51v34l-7 15h-37Z`} className="hg-ballot"/><path d={`M${104+i*125} 255h31`} className="hg-engraving"/>
            <text x={119+i*125} y="309" textAnchor="middle" className="eco-label">{label}</text><text x={119+i*125} y="334" textAnchor="middle" className="eco-note">1 voto</text>
          </g>)}
          <Flow d="M370 347Q371 375 313 390" active replay={replay}/><text x="82" y="390" className="hg-document-title">ASSEMBLEIA NACIONAL</text>
          <text x="28" y="470" className="eco-note">Quem representa a nação?</text><text x="28" y="494" className="eco-label">O Terceiro Estado contesta o voto por estamento.</text>
        </g>:active===2?<g>
          <path d="M89 391V221H406V391Z" className="hg-stone"/>
          {[77,177,314,413].map((x,i)=><g key={x}>
            <path d={`M${x-24} 390V205h48v185Z`} className="hg-stone"/><ellipse cx={x} cy="206" rx="24" ry="8" className="hg-stone"/>
            <path d={`M${x-24} 205v-21h9v9h10v-9h10v9h13v12`} className="hg-stone"/>
            {[0,1,2].map(n=><path key={n} d={`M${x-5} ${239+n*42}h10v20h-10Z`} className="hg-window"/>)}
            <path d={`M${x-22} 289h43m-43 38h43m-43 38h43`} className="hg-engraving"/>
          </g>)}
          <path d="M228 392v-51q22-39 44 0v51Z" className="hg-window"/>
          <path d="M41 394H459M38 405H465" className="hg-engraving"/>
          {Array.from({length:16},(_,i)=><g key={i} transform={`translate(${43+i*28} ${435+i%3*10})`}><circle r="5" className="hg-crowd"/><path d="M0 5v16m0-10-8 7m8-7 8 7" className="hg-crowd-line"/></g>)}
          <text x="28" y="491" className="eco-note">A Bastilha: um símbolo do poder arbitrário.</text>
        </g>:<g>
          <path d="M134 208H368V430H134Z" className="hg-parchment"/>
          <text x="250" y="247" textAnchor="middle" className="hg-document-title">COMITÊ DE</text><text x="250" y="271" textAnchor="middle" className="hg-document-title">SALVAÇÃO PÚBLICA</text>
          <path d="M157 303H343M157 324H343M157 345H328M157 366H343" className="hg-engraving"/>
          <circle cx="250" cy="404" r="14" className="hg-seal"/>
          <text x="30" y="154" className="eco-label">coalizões externas</text><text x="293" y="154" className="eco-label">desconfiança interna</text>
          <Flow d="M110 166Q106 222 150 289" active replay={replay}/><Flow d="M396 166Q399 222 351 289" active replay={replay}/>
          <text x="28" y="475" className="eco-note">Repressão em um contexto de guerra.</text>
          <text x="28" y="498" className="eco-label">guerra externa + desconfiança interna</text>
        </g>}
      </motion.g>
    </AnimatePresence>
    <path d="M34 526H465" className="hg-engraving"/>
    {dates.map((date,i)=><g key={date}><motion.circle cx={54+i*130} cy="526" r="5" animate={{r:active===i?7:4}} transition={transition} className="hg-seal"/><text x={54+i*130} y="550" textAnchor="middle" className="hg-date">{date}</text></g>)}
    {active!==3&&<text x="25" y="566" className="hg-micro">Terror: guerra externa + desconfiança interna; não há causa única.</text>}
  </svg>;
}

function IndustrialRevolution({active,replay}:EcologyDiagramProps) {
  const transition=useSceneMotion();
  const reduced=transition.duration===0;
  const mechanism={...transition,duration:reduced?0:MOTION_DURATION.mechanism};
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Revolução Industrial: cercamentos geram trabalho assalariado e capital; condições fabris documentadas e pressão social contribuem para leis fabris; recorte ${active+1} destacado`}>
    <text x="25" y="30" className="eco-kicker">INGLATERRA / A TERRA, O TRABALHO, A LEI</text>
    <path d="M20 226 107 184 189 213 176 285 20 313Z" className="hg-fields"/>
    <path d="M23 257 149 204M22 283 178 222M62 207 46 302M99 190 91 292M133 197 124 284" className="hg-field-lines"/>
    <motion.path initial={false} animate={{pathLength:active===0?1:.4}} transition={mechanism} d="M28 310 180 275M48 286v35m38-49v35m38-49v35m38-49v35" className="hg-fence"/>
    <text x="23" y="174" className="eco-note">cercamentos</text>
    <Flow d="M155 306Q195 337 248 325" active={active===0} replay={replay}/>
    <text x="21" y="366" className="eco-label">mão de obra + capital</text>
    <path d="M246 323V203L296 176V202L351 174V201L410 173V322Z" className="hg-brick"/>
    <path d="M272 188V128H293V184M369 183V113H392V182" className="hg-brick"/>
    {[0,1,2,3,4].map(i=><path key={i} d={`M250 ${221+i*20}H406`} className="hg-engraving"/>)}
    {[265,305,347,385].map(x=><path key={x} d={`M${x} 228h15v32h-15Z`} className="hg-window"/>)}
    <motion.g key={replay} initial={false} animate={{rotate:active===1?360:0}} transition={mechanism} style={{originX:.5,originY:.5}}>
      <circle cx="330" cy="303" r="31" className="hg-wheel"/>{[0,1,2,3,4,5].map(i=><path key={i} d="M330 275V331" transform={`rotate(${i*30} 330 303)`} className="hg-engraving"/>) }
    </motion.g>
    <motion.g animate={{opacity:active>=1?1:.24}} transition={transition}>
      <path d="M72 393H236V493H72Z" className="hg-parchment"/><text x="87" y="418" className="hg-document-title">RELATOS · 1833</text><path d="M87 435H218M87 448H212M87 461H216" className="hg-engraving"/>
      <text x="250" y="424" className="eco-note">documentação</text><text x="250" y="447" className="eco-note">+ pressão social</text>
    </motion.g>
    <Flow d="M242 476H395" active={active===2} replay={replay}/>
    <text x="318" y="508" className="hg-document-title">LEIS FABRIS</text>
    <text x="26" y="541" className="eco-label">documentação + pressão social → reformas</text>
    <text x="26" y="561" className="hg-micro">Processo de décadas; a fábrica não produz a lei automaticamente.</text>
  </svg>;
}

function ProjectionComparison({active}:EcologyDiagramProps) {
  const transition=useSceneMotion();
  const [stretch,setStretch]=useState(1.5);
  const names=['conforme','equivalente','equidistante'];
  const rx=active===2?44:44*stretch;
  const ry=active===0?44*stretch:active===1?44/stretch:44;
  return <><svg viewBox="0 0 500 540" role="img" aria-label={`Propriedades cartográficas comparadas: conforme preserva forma local, equivalente preserva área, equidistante preserva distâncias desde um centro; ${names[active]} selecionada`}>
    <text x="25" y="30" className="eco-kicker">PROJETAR É ESCOLHER O QUE PRESERVAR</text>
    <circle cx="250" cy="137" r="65" className="hg-globe"/><ellipse cx="250" cy="137" rx="25" ry="65" className="hg-graticule"/><path d="M185 137H315M194 107Q250 88 306 107M194 167Q250 186 306 167" className="hg-graticule"/>
    <text x="26" y="118" className="eco-note">superfície</text><text x="26" y="141" className="eco-note">curva</text>
    <path d="M250 209V254m-7-9 7 9 7-9" className="hg-engraving"/>
    <path d="M38 271H462V460H38Z" className="hg-parchment"/>
    {[0,1,2,3,4,5,6,7,8].map(i=><path key={i} d={`M${42+i*52} 275V456`} className="hg-graticule"/>)}
    {[0,1,2,3,4].map(i=><path key={i} d={`M42 ${279+i*44}H458`} className="hg-graticule"/>)}
    <circle cx="142" cy="365" r="44" className="hg-reference-circle"/>
    <text x="142" y="436" textAnchor="middle" className="eco-label">referência</text>
    <motion.ellipse cx="338" cy="365" initial={false} animate={{rx,ry}} transition={transition} className="hg-indicatrix"/>
    {active===2&&<g><path d="M338 365 383 297M338 365 414 382M383 297 414 382" className="hg-graticule"/><path d="M338 365 383 297M338 365 414 382" className="hg-radius"/><circle cx="338" cy="365" r="5" className="hg-seal"/><text x="330" y="444" className="hg-micro">centro → pontos</text></g>}
    <text x="26" y="493" className="eco-label">{['forma local','área relativa','distância do centro'][active]} preservada</text>
    <text x="26" y="515" className="eco-note">{['A forma se mantém; a área varia.','A área se mantém; a forma varia.','Outros pares de pontos podem mudar.'][active]}</text>
    <text x="26" y="537" className="hg-micro">Modelo de deformação; não é um mapa geográfico.</text>
    <desc>forma local · área relativa · distância do centro</desc>
  </svg><label className="hg-distortion-control">Compare a deformação local <input type="range" min="1" max="1.8" step=".05" value={stretch} disabled={active===2} aria-label="Intensidade da deformação esquemática" onChange={event=>setStretch(Number(event.target.value))}/><span>{active===2?'Distâncias radiais desde o centro':active===0?'Círculo permanece círculo':'Mesma área, outros eixos'}</span></label></>;
}

function RainMechanisms({active,replay}:EcologyDiagramProps) {
  const transition=useSceneMotion();
  const reduced=transition.duration===0;
  const mechanism={...transition,duration:reduced?0:MOTION_DURATION.mechanism};
  const names=['convectiva','orográfica','frontal'];
  const terrain=active===1?'M20 420L110 410L265 212L397 413L480 420V479H20Z':'M20 420L110 418L265 411L397 414L480 420V479H20Z';
  const flow=active===0?'M180 395Q168 259 223 194':active===1?'M42 365Q128 355 218 195':'M59 369Q202 360 329 193';
  return <svg viewBox="0 0 500 570" role="img" aria-label={`Chuva convectiva por ar aquecido, orográfica por relevo e frontal pelo encontro de massas de ar; ${names[active]} selecionada`}>
    <text x="26" y="30" className="eco-kicker">O QUE FAZ O AR ÚMIDO SUBIR?</text>
    <text x="27" y="82" className="hg-year">{names[active]}</text>
    <motion.path d={terrain} animate={{d:terrain}} transition={mechanism} className="hg-relief"/>
    <motion.path d="M480 417H173Q286 387 385 211L480 221Z" animate={{opacity:active===2?.65:0}} transition={transition} className="hg-cold-air"/>
    <motion.g animate={{x:active===2?115:0}} transition={mechanism}>
      <path d="M144 174C120 142 140 113 171 124 185 76 237 92 243 118 279 98 305 134 291 163 316 180 290 202 267 199H164Q133 200 144 174Z" className="hg-cloud"/>
      <path d="M151 164Q184 177 206 157M202 139Q231 121 255 145M244 180 272 173" className="hg-cloud-hatch"/>
    </motion.g>
    <Flow d={flow} active replay={replay}/>
    {[0,1,2,3,4,5,6].map(i=><motion.path key={`${active}-${replay}-${i}`} d={`M${151+i*19+(active===2?112:0)} ${218+i%2*16}l-9 26`} className="hg-rain" initial={reduced?false:{y:-25,opacity:0}} animate={{y:0,opacity:1}} exit={{opacity:0}} transition={{...mechanism,delay:reduced?0:i*MOTION_STAGGER.diagram}}/>)}
    <AnimatePresence mode="wait"><motion.g key={active} initial={reduced?false:{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={transition}>
      {active===0?<g><circle cx="410" cy="148" r="25" className="hg-sun"/><path d="M68 400q-20-22 0-42m33 42q-20-22 0-42m32 42q-20-22 0-42" className="hg-heat"/><text x="32" y="338" className="eco-label">superfície aquecida</text></g>:active===1?<g><path d="M301 255Q390 334 448 382" className="hg-dry-wind"/><text x="29" y="333" className="eco-label">barlavento</text><text x="356" y="319" className="eco-label">sotavento</text><text x="341" y="339" className="hg-micro">ar mais seco ↓</text></g>:<g><text x="28" y="325" className="eco-label">ar quente sobe</text><text x="347" y="390" className="eco-label">ar frio</text></g>}
    </motion.g></AnimatePresence>
    <text x="25" y="516" className="eco-note">{['Aquecimento → ascensão → condensação','Relevo força a ascensão do ar úmido','Ar quente ascende sobre o ar mais frio'][active]}</text>
    <text x="25" y="545" className="eco-label">{active===1?'barreira do relevo':'Ar ascendente resfria e pode atingir a saturação.'}</text>
  </svg>;
}

const plates:Record<string,{Diagram:React.ComponentType<EcologyDiagramProps>;title:string;subtitle:string}>={
 'summary-historia-revolucao-francesa':{Diagram:FrenchRevolution,title:'Uma ordem em ruptura',subtitle:'Da crise fiscal à radicalização: acontecimentos, atores e pressões distintas.'},
 'summary-historia-revolucao-industrial':{Diagram:IndustrialRevolution,title:'Da terra à fábrica',subtitle:'Cercamentos, trabalho documentado e a disputa por direitos.'},
 'summary-geografia-projecoes-cartograficas':{Diagram:ProjectionComparison,title:'Um mundo, escolhas diferentes',subtitle:'Experimente o que muda quando forma, área ou distância são preservadas.'},
 'summary-geografia-dinamica-climatica':{Diagram:RainMechanisms,title:'Três caminhos para a chuva',subtitle:'Compare o mecanismo que faz o ar subir — e veja onde a chuva se forma.'},
};
export function HistoriaGeografia({entry}:{entry:SceneEntry}) {
  return <EcologyPlayer key={entry.chapterId} entry={entry} {...plates[entry.chapterId]} kicker={entry.chapterId.includes('historia')?'História / documentos e processos':'Geografia / mecanismos e representação'} className="hg-scene"/>;
}
