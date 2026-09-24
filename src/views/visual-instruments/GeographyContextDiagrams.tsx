import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { GeographyContext } from '../../lib/geographyContextLab';
import { MOTION_DURATION, MOTION_EASE } from '../../design-system/motion/tokens';
import { Flow } from '../topic-scenes/families/EcologyArtwork';
import './GeographyContextDiagrams.css';

export const GEOGRAPHY_CONTEXT_DIAGRAM_IDS: ReadonlySet<string> = new Set([
  'summary-geografia-energia-eletrica-no-brasil', 'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
  'summary-geografia-os-fluxos-do-comercio-externo', 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
]);

type DrawingProps={index:number;replay:number};
function useDiagramTransition(){const reduced=useReducedMotion();return {duration:reduced?0:MOTION_DURATION.mechanism,ease:MOTION_EASE};}

function City({x,y,scale=1,lit=false}:{x:number;y:number;scale?:number;lit?:boolean}) {
  const transition=useDiagramTransition();
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M0 0V-70H34V-117H66V-81H103V0Z" className="gcd-building"/>
    {[0,1,2,3,4,5,6,7,8].map(i=><motion.path key={i} d={`M${9+i%3*34} ${-17-Math.floor(i/3)*22}h13v-12H${9+i%3*34}Z`} className="gcd-window" initial={transition.duration===0?false:{opacity:.28}} animate={{opacity:lit?1:.28}} transition={transition}/>)}
    <path d="M40-103h17v-9H40Z" className="gcd-window"/>
  </g>;
}
function Person({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><circle cy="-23" r="6" className="gcd-person"/><path d="M0-17V0m0-13-9 9m9-9 9 9M0 0-7 12M0 0 7 12" className="gcd-person-line"/></g>;}

function Electricity({index,replay}:DrawingProps) {
  const transition=useDiagramTransition();
  return <g>
    <text x="28" y="36" className="gcd-eyebrow">DA USINA À TOMADA</text><text x="28" y="70" className="gcd-title">oferta ↔ demanda</text>
    <path d="M20 274 79 228 183 258 246 248 355 278 480 243V393H20Z" className="gcd-terrain"/>
    <path d="M20 273H120V318H20Z" className="gcd-reservoir"/>
    <path d="M121 250H148L176 338H101Z" className="gcd-concrete"/><path d="M121 260 131 304 117 326" className="gcd-line"/>
    <Flow d="M29 292H112Q137 297 139 333H208" active={index===0} replay={replay}/>
    <motion.g key={replay} initial={transition.duration===0?false:{rotate:0}} animate={{rotate:index===0?360:0}} transition={transition} style={{originX:.5,originY:.5}}><circle cx="171" cy="333" r="21" className="gcd-turbine"/>{[0,1,2,3].map(i=><path key={i} d="M171 315V350" transform={`rotate(${i*45} 171 333)`} className="gcd-line"/>)}</motion.g>
    <path d="M244 332 270 180 298 332M254 276h34M261 235h19M240 212h62M246 251h49M254 291l35-33m-33-14 24-30" className="gcd-pylon"/>
    <path d="M145 285Q211 305 243 212M301 212Q350 259 403 253M145 294Q213 316 247 251M297 251Q350 285 403 271" className="gcd-wire"/>
    <Flow d="M168 285Q224 272 270 223T415 255" active={index===1} replay={replay}/>
    <City key={replay} x={366} y={338} scale={.93} lit={index===2}/>
    <text x="34" y="369" className="gcd-label">geração</text><text x="236" y="369" className="gcd-label">transmissão</text><text x="376" y="369" className="gcd-label">consumo</text>
    <text x="28" y="428" className="gcd-note">{['A água movimenta a turbina.','Linhas conectam lugares e têm limites.','A demanda muda ao longo do dia.'][index]}</text>
    <text x="28" y="456" className="gcd-small">Hidrelétrica como exemplo; rede e operação ilustrativas.</text>
  </g>;
}

function Migration({index,replay}:DrawingProps) {
  const transition=useDiagramTransition();
  return <g>
    <text x="28" y="36" className="gcd-eyebrow">PESSOAS, LUGARES E VÍNCULOS</text>
    <path d="M22 249Q104 181 193 247T480 232V416Q300 382 160 427T22 417Z" className="gcd-terrain"/>
    <path d="M213 218Q288 267 242 306T284 408" className="gcd-river"/>
    <path d="M39 279V231L82 198 125 231V279Z" className="gcd-building"/><path d="M29 232 82 189 134 232M73 279v-33h22v33M50 236h13v15H50Z" className="gcd-line"/>
    <City x={361} y={298} scale={.96} lit={index===2}/>
    <path d="M107 326C160 171 292 167 384 324" className="gcd-route-guide"/>
    <Flow d="M107 326C160 171 292 167 384 324" active={index===1} replay={replay}/>
    <motion.g key={replay} initial={transition.duration===0?false:{x:0,y:0}} animate={{x:index===0?0:index===1?136:263,y:index===1?-94:0}} transition={transition}><Person x={116} y={323}/></motion.g>
    <text x="153" y="160" className="gcd-label">informação e apoio</text>
    <text x="28" y="314" className="gcd-label">origem</text><text x="398" y="335" className="gcd-label">destino</text>
    <Flow d="M385 361Q244 425 93 361" active={index===2} replay={replay}/>
    <text x="100" y="448" className="gcd-note">vínculos com a origem</text>
    <text x="28" y="474" className="gcd-small">Percurso hipotético; escolhas e condições não são iguais.</text>
  </g>;
}

function Trade({index,replay}:DrawingProps) {
  const transition=useDiagramTransition();
  return <g>
    <text x="28" y="36" className="gcd-eyebrow">PRODUÇÃO, PORTO E MERCADO</text>
    <path d="M20 345H481V425Q322 395 185 424T20 410Z" className="gcd-reservoir"/>
    <path d="M20 335H263V355H20Z" className="gcd-concrete"/>
    <path d="M34 256V196L66 177V196L97 177V196L131 177V256Z" className="gcd-building"/><path d="M45 213h75M45 235h75M47 187v-47h16v39" className="gcd-line"/>
    <path d="M166 332V155H262M159 180H244M173 155l58 26M211 177v65" className="gcd-crane"/>
    <motion.g key={replay} initial={transition.duration===0?false:{x:0,y:0}} animate={{x:index>=1?48:0,y:index>=1?60:0}} transition={transition}><path d="M188 239H235V270H188Z" className="gcd-container"/>{[198,210,222].map(x=><path key={x} d={`M${x} 242v24`} className="gcd-line"/>)}</motion.g>
    <motion.g initial={false} animate={{x:index===2?36:0}} transition={transition}>
      <path d="M257 341H421L393 378H286Z" className="gcd-ship"/><path d="M366 302h30v39h-30ZM374 291h9v12h-9Z" className="gcd-building"/>
      {[270,301,332].map(x=><path key={x} d={`M${x} 317h28v23h-28Z`} className="gcd-container"/>)}
    </motion.g>
    <Flow d="M127 276Q152 299 180 309" active={index===0} replay={replay}/><Flow d="M403 385Q443 369 465 326" active={index===2} replay={replay}/>
    <text x="29" y="296" className="gcd-label">produção</text><text x="325" y="411" className="gcd-label">mercado externo →</text>
    <text x="28" y="452" className="gcd-note">O custo do corredor altera o preço final.</text>
    <text x="28" y="478" className="gcd-small">Rede ilustrativa; não representa um porto ou parceiro real.</text>
  </g>;
}

function Fuels({index,replay}:DrawingProps) {
  const transition=useDiagramTransition();
  return <g>
    <text x="28" y="36" className="gcd-eyebrow">ESTOQUES E TEMPOS DO CARBONO</text>
    <text x="220" y="112" className="gcd-carbon">CO₂</text><text x="214" y="135" className="gcd-label">atmosfera</text>
    <path d="M20 344Q157 322 267 342T480 332V420H20Z" className="gcd-terrain"/>
    <path d="M31 381Q86 357 161 378L172 404Q96 391 39 411Z" className="gcd-fossil"/>
    <text x="45" y="441" className="gcd-label">carbono fóssil</text>
    <path d="M72 340 106 272 137 340M101 286v99" className="gcd-line"/>
    <motion.path key={replay} initial={transition.duration===0?false:{rotate:0}} animate={{rotate:index===0?18:0}} transition={transition} style={{originX:.5,originY:.5}} d="M54 272H151l14 12-15 7H61Z" className="gcd-building"/>
    <motion.g initial={false} animate={{scaleY:index===1?1:.78}} transition={transition} style={{originX:.5,originY:1}}><path d="M271 340V226M261 338V237M281 338V240" className="gcd-cane"/>{[0,1,2,3].map(i=><path key={i} d={`M271 ${272-i*14}q-24-30-48-11m48 11q23-37 49-16`} className="gcd-leaf"/>)}</motion.g>
    <text x="222" y="441" className="gcd-label">carbono recente</text>
    <path d="M392 341V290h57v51M405 290v-22h31v22M401 303h41" className="gcd-building"/><text x="400" y="372" className="gcd-label">uso</text>
    <Flow d="M135 301Q293 262 389 304" active={index===0} replay={replay}/>
    <Flow d="M268 149V228" active={index===1} replay={replay}/>
    <Flow d="M306 298H386" active={index===1} replay={replay}/>
    <Flow d="M423 260Q414 161 286 121" active={index===0||index===2} replay={replay}/>
    <text x="28" y="478" className="gcd-note">carbono recente não zera impactos</text>
    <text x="28" y="503" className="gcd-small">Solo, cultivo e transporte mudam o balanço do ciclo de vida.</text>
  </g>;
}

const drawings:Record<string,React.ComponentType<DrawingProps>>={
 'summary-geografia-energia-eletrica-no-brasil':Electricity,
 'summary-geografia-estrutura-etnica-e-fluxos-migratorios':Migration,
 'summary-geografia-os-fluxos-do-comercio-externo':Trade,
 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil':Fuels,
};
export function GeographyContextDiagram({config,index}:{config:GeographyContext;index:number}) {
  const [replay,setReplay]=useState(0);
  const Drawing=drawings[config.chapterId];
  return <div className="gcd-plate"><svg className="vs-plane gcd-diagram" viewBox="0 0 500 530" role="img" aria-label={`${config.title}: ${config.cases[index].label} em foco`} data-geography-context={config.chapterId}><Drawing index={index} replay={replay}/></svg><button type="button" className="gcd-replay" onClick={()=>setReplay(value=>value+1)}>Repetir movimento</button></div>;
}
