import React from 'react';
import {ContrastComposition} from './contrast-plates/ContrastComposition';
import {SketchText as T,SketchArrow as A,SketchGroup as G} from './contrast-plates/Sketch';
import type {ContrastPlate} from './contrast-plates/types';
import type {SceneEntry} from './types';

const acceleration='summary-fisica-aceleracao-vetorial';
const expansion='summary-fisica-dilatacao-ou-contracao-termica-dos-solidos-e-liquidos';
export const PHYSICS_FIDELITY_TOPIC_IDS=new Set([acceleration,expansion]);

function Acceleration({focus}:{focus:number|null}){
 return <>
  <T x={30} y={29} accent>Velocidade tangente; aceleração muda módulo e/ou direção</T>
  {['MRU','MRUV','MCU','MCUV'].map((label,i)=>{
   const ox=i%2?385:20,oy=i<2?55:255,circular=i>=2,tangential=i%2===1;
   return <G key={label} id={label} active={focus===i}>
    <T x={ox+10} y={oy+20} accent>{label}</T>
    {circular?<circle cx={ox+95} cy={oy+110} r="55"/>:<path d={`M${ox+25} ${oy+85}h270`} strokeDasharray="5 5"/>}
    <circle cx={ox+95} cy={oy+(circular?55:85)} r="7" className="cp-fill"/>
    <g data-vector="tangent-velocity"><A d={`M${ox+95} ${oy+(circular?55:85)}h95`}/></g>
    <T x={ox+220} y={oy+75}>v tangente</T>
    {circular&&<><g data-vector="radial-acceleration"><A d={`M${ox+95} ${oy+55}v55`}/></g><T x={ox+160} y={oy+131}>aᶜ → centro</T><T x={ox+160} y={oy+166}>aᶜ = v²/R</T></>}
    {tangential&&<><g data-vector="tangential-acceleration"><A d={`M${ox+95} ${oy+35}h55`}/></g><T x={ox+180} y={oy+34}>aᵗ = Δ|v|/Δt</T></>}
    {!circular&&<T x={ox+40} y={oy+150}>{tangential?'Módulo aumenta; direção fixa.':'a = 0; v constante.'}</T>}
   </G>;
  })}
  <T x={30} y={464} size={18}>MCUV ilustrado acelerando: a = aᵗ + aᶜ; os vetores têm escalas próprias.</T>
 </>;
}
function Expansion({focus}:{focus:number|null}){
 return <>
  <T x={30} y={28} accent>Aquecer: as dimensões e o recipiente também mudam</T>
  <G id="Linear" active={focus===0}><g data-expansion="length">
   <T x={30} y={64}>Linear · L₀ = 1 m · ΔT = 50 °C</T>
   <path d="M40 112H280M40 105v14M280 105v14" strokeDasharray="4 4"/>
   <path d="M40 147H310M40 140v14M310 140v14"/>
   <T x={150} y={100}>L₀</T><T x={165} y={174}>L = L₀(1 + αΔT)</T>
   <T x={35} y={205} size={18}>α = 2·10⁻⁵/°C → ΔL = 1 mm</T>
  </g></G>
  <G id="Superficial" active={focus===1}><g data-expansion="area">
   <T x={405} y={64}>Superficial · duas dimensões</T>
   <rect x="435" y="90" width="100" height="100" strokeDasharray="4 4"/>
   <rect x="435" y="90" width="120" height="120"/>
   <A d="M574 125v75"/><A d="M460 225h85"/>
   <T x={600} y={166}>ΔL</T><T x={470} y={255}>ΔA ≈ A₀·2αΔT</T>
  </g></G>
  <G id="Volumétrica" active={focus===2}><g data-expansion="volume">
   <T x={30} y={270}>Volumétrica · três dimensões</T>
   <path d="M45 330h85v85H45ZM45 330l30-30h85v85l-30 30M130 330l30-30" strokeDasharray="4 4"/>
   <path d="M45 330h100v100H45ZM45 330l40-40h100v100l-40 40M145 330l40-40"/>
   <T x={207} y={348}>ΔV ≈ V₀·3αΔT</T>
   <T x={207} y={380} size={18}>Sólido isotrópico</T>
   <T x={207} y={418} size={18}>|αΔT| ≪ 1</T>
  </g></G>
  <g data-expansion="liquid-container">
   <T x={415} y={292}>Líquido + recipiente</T>
   <path d="M455 308v109h120V308"/>
   <path d="M465 355h100v51H465Z" className="cp-wash"/>
   <path d="M465 374H565" strokeDasharray="4 4"/>
   <A d="M597 391v-42"/><T x={627} y={371} size={18}>nível final</T>
   <T x={415} y={445} size={18}>γ aparente = γlíquido − γrecipiente</T>
  </g>
  <T x={30} y={472} size={14}>Expansão exagerada no desenho; coeficientes positivos neste exemplo.</T>
 </>;
}

export function PhysicsFidelityTopics({entry}:{entry:SceneEntry}){
 const isAcceleration=entry.chapterId===acceleration;
 const plate:ContrastPlate={chapterId:entry.chapterId,
  context:isAcceleration?'A mesma velocidade instantânea pode ocorrer em uma reta ou em uma curva. As quatro situações distinguem mudar o módulo e mudar a direção. Setas completas permanecem visíveis quando uma situação recebe foco.':'Ao aquecer de 20 °C a 70 °C um sólido isotrópico com α positivo, cada dimensão cresce. No líquido, o volume observado depende também da expansão do recipiente; a dilatação aparente pode ser negativa.',
  annotation:isAcceleration?'Componente centrípeta muda a direção; tangencial muda o módulo. Aceleração constante em módulo não significa vetor constante.':'Os fatores 2α e 3α são aproximações para pequenas dilatações de sólidos isotrópicos. Líquidos têm coeficiente próprio; a água entre 0 °C e 4 °C é uma exceção ao aquecimento expansivo.',
  positions:entry.items.map(it=>({reading:it.claim,focus:[it.label]})),
  illustration:focus=>isAcceleration?<Acceleration focus={focus}/>:<Expansion focus={focus}/>
 };
 return <ContrastComposition entry={entry} plate={plate}/>;
}
