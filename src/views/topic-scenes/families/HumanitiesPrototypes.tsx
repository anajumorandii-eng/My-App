import React, { useId } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import './HumanitiesPrototypes.css';

export function PlateDefs({ id }: { id: string }) {
  return <defs>
    <pattern id={`${id}-paper`} width="34" height="34" patternUnits="userSpaceOnUse"><path d="M2 8h7m13 14h8M8 29h3" className="ha-paper-grain"/></pattern>
    <pattern id={`${id}-hatch`} width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7 7 0" className="ha-hatching"/></pattern>
    <marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 9 5 0 10" className="ha-arrow-tip"/></marker>
  </defs>;
}

export function Person({ x, y, kind = 'worker' }: { x: number; y: number; kind?: 'clergy' | 'noble' | 'worker' | 'merchant' }) {
  return <g transform={`translate(${x} ${y})`}>
    <ellipse cx="0" cy="71" rx="24" ry="5" className="ha-object-shadow"/>
    <path d="M-11 48-8 69M11 48 8 69" className="ha-ink ha-legs"/>
    <path d="M-22 49-17 12Q0 1 17 12L22 49Z" className={`ha-clothes ha-clothes--${kind}`}/>
    <path d="M-15 18-28 36M15 18 27 31" className="ha-ink"/>
    <circle cy="-6" r="12" className="ha-face"/>
    <path d="M-11-7Q-13-23 0-23T11-7M-3 2h6" className="ha-hair"/>
    {kind === 'clergy' && <><path d="M-11-17 0-37 11-17Z" className="ha-vestment"/><path d="M26 16v43m-6-34h12" className="ha-gold-line"/><path d="M-3 18v14m-6-8h12" className="ha-gold-line"/></>}
    {kind === 'noble' && <><path d="M-18-16-12-26 0-22 12-26 18-16Z" className="ha-clothes--noble"/><path d="M-6 13 0 25 6 13M-2 25v21" className="ha-gold-line"/><path d="M25 32 18 64" className="ha-ink"/></>}
    {kind === 'worker' && <><path d="M-14-15Q0-29 14-15Z" className="ha-straw"/><path d="M-11 19h22v30h-22Z" className="ha-apron"/><path d="M-30 12v53m-10-49h20" className="ha-wood-line"/></>}
    {kind === 'merchant' && <><path d="M-9 10 0 23 9 10M0 23v27" className="ha-ink"/><rect x="21" y="30" width="20" height="25" rx="2" className="ha-document"/><path d="M25 37h12m-12 6h9" className="ha-document-line"/></>}
  </g>;
}

function Assembly({ id }: { id: string }) {
  return <g transform="translate(345 350) scale(.85)">
    <path d="M-132 34-100-55H100L132 34Z" className="ha-stone"/>
    <path d="M-115-56 0-106 115-56Z" className="ha-stone-roof"/>
    <path d="M-115-52H115M-120 41H120M-125 50H125" className="ha-ink"/>
    {[-91,-58,58,91].map(x => <g key={x}><rect x={x-7} y="-45" width="14" height="76" className="ha-column"/><path d={`M${x-12}-44h24m-24 75h24`} className="ha-ink"/></g>)}
    <path d="M-45 32V-18Q0-58 45-18V32Z" className="ha-assembly-interior"/>
    <path d="M-35 14Q0-6 35 14M-40 24Q0 2 40 24" className="ha-wood-line"/>
    {[-29,-16,-3,10,23].map((x,i)=><g key={x}><circle cx={x} cy={i%2 ? 3 : 13} r="4" className="ha-face"/><path d={`M${x-5} ${i%2 ? 8 : 18}h10v9h-10Z`} className="ha-coat-mini"/></g>)}
    <path d="M-70 63Q0 51 69 63" className="ha-underline"/>
    <text y="88" textAnchor="middle" className="ha-label">Assembleia Nacional</text>
    <path d="M0-75v24" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
  </g>;
}

function Bastille() {
  return <g transform="translate(650 365) scale(.78)">
    <ellipse cy="49" rx="65" ry="8" className="ha-object-shadow"/>
    <path d="M-50 37V-42h18v9h13v-9h38v9h13v-9h18v79Z" className="ha-fortress"/>
    <path d="M-50-25H50M-50-6H50M-50 13H50M-34-25v19m18-19v19m18-19v19m17-19v19m17-19v19M-41-6v19m22-19v19m22-19v19m22-19v19" className="ha-stone-seams"/>
    <path d="M-12 37V12a12 12 0 0 1 24 0v25Z" className="ha-door"/>
    <path d="M-39-54v-28m0 0h26l-5 8h-21" className="ha-flag-line"/>
    {[-55,-28,5,36,57].map((x,i)=><g key={x}><circle cx={x} cy={51+i%2*3} r="5" className="ha-face"/><path d={`M${x-6} ${57+i%2*3}h12v15h-12Z`} className="ha-coat-mini"/></g>)}
    <text y="106" textAnchor="middle" className="ha-label">Bastilha · jul. 1789</text>
  </g>;
}

export function FrenchRevolutionPlate({ active }: { active: number }) {
  const id=useId().replace(/:/g,'');
  const transition=useSceneMotion();
  return <svg className="ha-illustrated ha-france" viewBox="0 0 780 690" role="img" aria-label={`Revolução Francesa: estamentos, representação política, direitos, República e Terror; etapa ${active+1} destacada`}>
    <PlateDefs id={id}/>
    <rect x="5" y="5" width="770" height="680" rx="9" className="ha-paper"/>
    <rect x="5" y="5" width="770" height="680" rx="9" fill={`url(#${id}-paper)`}/>
    <path d="M33 72Q250 79 568 67" className="ha-title-stroke"/>
    <text x="32" y="51" className="ha-title">Quem representa a nação?</text>
    <text x="620" y="49" className="ha-kicker">FRANÇA</text>
    <text x="620" y="77" className="ha-small">1789–1794</text>

    <motion.g initial={false} animate={{ opacity:active===0?1:.82 }} transition={transition}>
      <path d="M27 93H309V224H27Z" className="ha-inset-paper"/>
      <Person x={80} y={165} kind="clergy"/><Person x={167} y={165} kind="noble"/><Person x={251} y={165}/>
      <text x="80" y="118" textAnchor="middle" className="ha-label">Clero</text>
      <text x="167" y="118" textAnchor="middle" className="ha-label">Nobreza</text>
      <path d="M51 241H191" className="ha-bracket"/>
      <text x="121" y="262" textAnchor="middle" className="ha-hand">privilégios fiscais</text>
      <path d="M230 243Q258 272 310 276" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
    </motion.g>
    <g>
      <path d="M347 101Q369 90 421 99L433 205Q391 217 349 203Z" className="ha-document"/>
      <path d="M357 116h59m-55 15h49m-46 15h39m-36 15h36" className="ha-document-line"/>
      <text x="390" y="187" textAnchor="middle" className="ha-small">déficit real</text>
      <path d="M313 155Q329 135 343 141" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
      <text x="534" y="120" className="ha-hand">quem paga?</text>
      <path d="M570 131Q552 145 533 151" className="ha-note-pointer"/>
      <Person x={522} y={158}/><Person x={578} y={158} kind="merchant"/><Person x={634} y={158}/>
      <text x="581" y="252" textAnchor="middle" className="ha-label">Terceiro Estado</text>
      <text x="581" y="278" textAnchor="middle" className="ha-small">camponeses, trabalhadores, burguesia</text>
    </g>
    <motion.g initial={false} animate={{ opacity:active>=1?1:.78 }} transition={transition}>
      <Assembly id={id}/>
      <text x="43" y="322" className="ha-hand">1 voto por ordem?</text>
      <text x="43" y="359" className="ha-hand">Ou por cabeça?</text>
      <path d="M156 361Q203 392 247 357" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
      <text x="47" y="407" className="ha-small">a disputa fiscal vira</text>
      <text x="47" y="439" className="ha-label">disputa de soberania</text>
    </motion.g>
    <motion.g initial={false} animate={{ opacity:active>=2?1:.78 }} transition={transition}><Bastille/></motion.g>
    <g transform="translate(35 469)">
      <path d="M0 0H710V157H0Z" className="ha-document"/>
      <path d="M15 13Q197 4 361 14" className="ha-title-stroke ha-title-stroke--pale"/>
      <text x="21" y="37" className="ha-section-title">Uma revolução; disputas e mudanças de regime</text>
      <path d="M30 78H680" className="ha-timeline"/>
      {[52,259,464,657].map((x,i)=><g key={x}><circle cx={x} cy="78" r="7" className={i===3 && active===3?'ha-stop-selected':'ha-stop'}/></g>)}
      <text x="22" y="65" className="ha-small">Direitos · 1789</text>
      <text x="178" y="110" className="ha-small">Constituição · 1791</text>
      <text x="393" y="65" className="ha-small">República · 1792</text>
      <text x="542" y="110" className="ha-small">Terror · 1793–94</text>
      <text x="21" y="140" className="ha-hand">igualdade jurídica ≠ fim das desigualdades sociais</text>
    </g>
    <text x="33" y="659" className="ha-small">guerra externa + desconfiança interna → contexto do Terror</text>
  </svg>;
}

function Cloud({x,y,rain=true}:{x:number;y:number;rain?:boolean}) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-51 17Q-68-6-42-18Q-37-44-11-37Q10-60 32-35Q59-39 65-12Q91 4 66 26H-45Z" className="ha-cloud"/>
    <path d="M-43 9Q-17-2 0 10Q26-2 54 8" className="ha-cloud-shadow"/>
    {rain && [-33,-12,11,34,56].map((xx,i)=><path key={xx} d={`M${xx} 38l-9 ${18+i%2*11}`} className="ha-rain"/>)}
  </g>;
}

function Landscape({mountain=false}:{mountain?:boolean}) {
  return <g>
    <path d={mountain?'M25 194H207L331 89L456 194H735V233H25Z':'M25 194Q187 177 318 193T735 194V233H25Z'} className="ha-land"/>
    <path d={mountain?'M211 194L331 104 449 194M241 194 332 132 408 194':'M25 212Q252 195 450 214T735 212'} className="ha-land-contour"/>
    <path d="M25 220Q240 206 431 221T735 220" className="ha-earth-layer"/>
    <path d="M25 194Q96 184 175 194V218H25Z" className="ha-sea"/>
    {[201,224,471,501,529,644].map((x,i)=><g key={x}><path d={`M${x} 192v-22m-10-5h20`} className="ha-tree-trunk"/><path d={`M${x-13} 174q-4-16 9-20q5-11 15-2q13 1 9 18Z`} className={mountain&&i>1?'ha-dry-tree':'ha-tree-leaf'}/></g>)}
    <path d="M34 203q15-7 29 0t29 0t29 0t29 0" className="ha-water-line"/>
  </g>;
}

export function ClimatePlate({ active }: { active: number }) {
  const id=useId().replace(/:/g,'');
  const transition=useSceneMotion();
  return <svg className="ha-illustrated ha-climate" viewBox="0 0 780 950" role="img" aria-label={`Chuva convectiva, orográfica e frontal: corte ilustrado da ascensão, resfriamento e condensação do ar; ${['convectiva','orográfica','frontal'][active]} selecionada`}>
    <PlateDefs id={id}/><rect x="5" y="5" width="770" height="940" rx="9" className="ha-paper"/><rect x="5" y="5" width="770" height="940" fill={`url(#${id}-paper)`}/>
    <text x="32" y="51" className="ha-title">O caminho do ar até a chuva</text>
    <path d="M31 72Q360 80 721 70" className="ha-title-stroke"/>
    <text x="33" y="101" className="ha-hand">a causa da subida muda; a condensação é comum</text>
    {[0,1,2].map(i=><motion.g key={i} transform={`translate(0 ${124+i*264})`} initial={false} animate={{opacity:active===i?1:.82}} transition={transition}>
      <rect x="20" width="740" height="249" rx="6" className={active===i?'ha-atmosphere ha-atmosphere--active':'ha-atmosphere'}/>
      <text x="37" y="31" className="ha-section-title">{['1 · CONVECTIVA','2 · OROGRÁFICA','3 · FRONTAL'][i]}</text>
      <Landscape mountain={i===1}/>
      <motion.circle r="5" className="ha-air-parcel" initial={false}
        animate={transition.duration!==0 && active===i ? {cx: i===0?[316,305,340]:i===1?[94,180,226]:[585,423,270],cy:i===0?[184,139,90]:i===1?[178,184,127]:[178,157,83]} : {cx:i===0?340:i===1?226:270,cy:i===0?90:i===1?127:83}}
        transition={transition.duration===0?transition:{...transition,duration:1.2}}/>
      {i===0 && <>
        <circle cx="99" cy="94" r="26" className="ha-sun"/>
        {[0,45,90,135,180,225,270,315].map(a=><path key={a} d={`M${99+35*Math.cos(a*Math.PI/180)} ${94+35*Math.sin(a*Math.PI/180)}l${10*Math.cos(a*Math.PI/180)} ${10*Math.sin(a*Math.PI/180)}`} className="ha-sun-ray"/>)}
        <path d="M126 119 190 181" markerEnd={`url(#${id}-arrow)`} className="ha-heat-arrow"/>
        <motion.path initial={false} animate={{pathLength:1}} transition={transition} d="M316 184Q291 139 340 90" markerEnd={`url(#${id}-arrow)`} className="ha-heat-arrow"/>
        <Cloud x={423} y={78}/>
        <text x="37" y="237" className="ha-small">superfície aquece o ar</text>
        <text x="180" y="73" className="ha-hand">expande e esfria</text>
        <text x="540" y="86" className="ha-label">condensação</text>
        <path d="M533 97 474 106" className="ha-note-pointer"/>
        <text x="540" y="119" className="ha-small">chuva localizada</text>
        <text x="540" y="142" className="ha-small">de curta duração</text>
      </>}
      {i===1 && <>
        <Cloud x={298} y={70}/>
        <path d="M94 178Q180 184 226 127" markerEnd={`url(#${id}-arrow)`} className="ha-air-arrow"/>
        <path d="M371 108Q419 156 471 176" markerEnd={`url(#${id}-arrow)`} className="ha-heat-arrow"/>
        <text x="37" y="70" className="ha-hand">vento úmido</text>
        <text x="41" y="96" className="ha-small">do oceano</text>
        <text x="179" y="236" className="ha-label">barlavento</text>
        <text x="416" y="236" className="ha-label">sotavento</text>
        <text x="540" y="81" className="ha-hand">sombra de chuva</text>
        <text x="540" y="112" className="ha-small">ar desce, aquece</text>
        <text x="540" y="135" className="ha-small">e fica mais seco</text>
        <text x="370" y="58" className="ha-small">barreira do relevo</text><path d="M420 68 355 110" className="ha-note-pointer"/>
      </>}
      {i===2 && <>
        <path d="M30 187H542Q401 159 330 119T166 64H30Z" className="ha-cold-air"/>
        <path d="M585 178Q423 157 270 83" markerEnd={`url(#${id}-arrow)`} className="ha-heat-arrow"/>
        <path d="M82 153H230" markerEnd={`url(#${id}-arrow)`} className="ha-air-arrow"/>
        <Cloud x={465} y={65}/>
        <text x="42" y="107" className="ha-label">massa fria</text>
        <text x="251" y="54" className="ha-label">massa quente</text>
        <text x="542" y="89" className="ha-hand">o encontro força</text>
        <text x="542" y="126" className="ha-hand">o ar quente a subir</text>
        <text x="542" y="155" className="ha-small">frente fria avança</text>
        <text x="38" y="237" className="ha-small">ar frio mais denso avança junto à superfície</text>
      </>}
    </motion.g>)}
    <text x="32" y="915" className="ha-small">Cortes esquemáticos; sem escala.</text><text x="32" y="940" className="ha-small">Relevo e massas de ar participam da dinâmica climática.</text>
  </svg>;
}
