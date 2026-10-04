import React,{useId} from 'react';
import {motion,useReducedMotion} from 'motion/react';
import type {MechanicsFinalId} from '../../lib/mechanicsFinalLab';

const ink='var(--vs-ink)',blue='var(--vs-blue)',red='var(--vs-burgundy)',paper='var(--vs-paper-strong)';
const f=(n:number)=>String(Math.round(n*10)/10).replace('.',',');
function Label({x,y,children,color=ink}:{x:number;y:number;children:React.ReactNode;color?:string}){return <text x={x} y={y} textAnchor="middle" fill={color} stroke="none" fontSize="13" style={{fontFamily:'Kalam, cursive'}}>{children}</text>;}
function Arrow({x,y,dx,dy,kind}:{x:number;y:number;dx:number;dy:number;kind:string}){
 const id=useId();if(Math.hypot(dx,dy)<.01)return null;
 return <g data-force={kind.startsWith('velocity')?undefined:kind} data-vector={kind==='velocity'?'velocity':undefined}><defs><marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke={red}/></marker></defs><path d={`M${x} ${y}l${dx} ${dy}`} fill="none" stroke={red} strokeWidth="2.5" markerEnd={`url(#${id})`}/></g>;
}
function Block({x,y}:{x:number;y:number}){return <rect x={x-17} y={y-17} width="34" height="34" rx="3" fill={paper} stroke={blue} strokeWidth="2"/>;}

export function MechanicsFidelityScenes({id,value}:{id:MechanicsFinalId;value:number}){
 const reduced=useReducedMotion();
 const transition={duration:reduced?0:.25};
 if(id==='vertical-plane'){
  const topN=value*value/3-10,bottomN=value*value/3+50,bottomV=Math.sqrt(value*value+120);
  return <g data-mechanics="vertical-plane">
   <Label x={160} y={20}>Massa 1 kg · R = 3 m · g = 10 m/s²</Label>
   <circle cx="160" cy="175" r="85" fill="none" stroke={blue} strokeWidth="2"/>
   <circle cx="160" cy="175" r="3" fill={ink}/><Label x={212} y={178}>centro</Label>
   <g data-vertical-location="top"><circle cx="160" cy="90" r="8" fill={paper} stroke={ink}/>
    <Arrow x={150} y={100} dx={0} dy={26} kind="weight"/>
    {topN>=0&&<Arrow x={174} y={100} dx={0} dy={topN*2.6} kind="normal"/>}
    <Label x={106} y={119}>P = 10 N</Label><Label x={229} y={64}>topo: v = {value} m/s</Label>
    <Label x={228} y={89}>{topN<0?'N exigida < 0':`N = ${f(topN)} N`}</Label>
   </g>
   <g data-vertical-location="bottom"><circle cx="160" cy="260" r="8" fill={paper} stroke={ink}/>
    <Arrow x={146} y={268} dx={0} dy={26} kind="weight"/>
    <Arrow x={174} y={250} dx={0} dy={-bottomN*1.2} kind="normal"/>
    <Label x={100} y={290}>P = 10 N</Label><Label x={160} y={317}>fundo: N − mg = mv²/R</Label>
    <Label x={160} y={337}>v = {f(bottomV)} m/s · N = {f(bottomN)} N</Label>
   </g>
   <Label x={160} y={360}>{topN<0?'Contato no topo impossível; N física = 0.':'Topo: N + mg = mv²/R · contato mantido.'}</Label>
   <Label x={160} y={379}>Mesmo E mecânica até a perda de contato.</Label>
   <Label x={160} y={407}>Setas P/N: escalas distintas entre os recortes.</Label>
  </g>;
 }
 if(id==='mhs'){
  const x=160+value*19,force=-4*value,velocity=2*Math.sqrt(25-value*value),potential=2*value*value,kinetic=50-potential;
  return <g data-mhs-state="true" data-position={value}>
   <Label x={160} y={20}>Mola ideal · k = 4 N/m · m = 1 kg</Label>
   <Label x={160} y={42}>A = 5 m · ramo com velocidade para a direita</Label>
   <path d="M30 110V210M30 190H290M160 75V230" fill="none" stroke={blue} strokeDasharray="4 4"/>
   <motion.g initial={false} animate={{x:x-160}} transition={transition}>
    <Block x={160} y={168}/>
   </motion.g>
   <path d={`M30 168H40L${Array.from({length:12},(_,i)=>`${40+(x-57-40)*i/11} ${168+(i%2?8:-8)}`).join('L')}L${x-17} 168`} fill="none" stroke={blue} strokeWidth="2"/>
   <Arrow x={x} y={124} dx={force*3} dy={0} kind="restoring"/>
   <Arrow x={x} y={212} dx={velocity*7} dy={0} kind="velocity"/>
   <Label x={160} y={83}>F = {force} N · sempre para x = 0</Label>
   <Label x={160} y={252}>x = {value} m · v = {f(velocity)} m/s</Label>
   <Label x={65} y={282}>U elástica</Label><Label x={220} y={282}>K cinética</Label>
   <rect data-energy="potential" x="35" y="298" width={potential*2} height="18" fill={red}/>
   <rect data-energy="kinetic" x="185" y="298" width={kinetic*2} height="18" fill={blue}/>
   <Label x={85} y={337}>{potential} J</Label><Label x={235} y={337}>{kinetic} J</Label>
   <Label x={160} y={365}>U + K = 50 J · mesma escala: 2 unidades/J</Label>
   <Label x={160} y={391}>{Math.abs(value)===5?'Extremo: v = 0; força máxima.':value===0?'Equilíbrio: F = 0; velocidade máxima.':'A força restaura; a inércia atravessa x = 0.'}</Label>
  </g>;
 }
 if(id==='potential-energy'){
  const y=285-value*18;
  return <g data-mechanics="potential-energy">
   <Label x={160} y={20}>Elevação quase estática · m = 2 kg</Label>
   <Label x={160} y={42}>g = 10 m/s² · U = 0 no solo</Label>
   <path d="M30 304H290M110 75V290" stroke={blue} fill="none" strokeDasharray="4 4"/>
   <g opacity=".6"><Block x={110} y={285}/></g><Label x={56} y={280}>início</Label>
   <g data-lift-position="true" data-height={value}><Block x={110} y={y}/><Arrow x={136} y={y} dx={0} dy={35} kind="weight"/></g>
   <path data-height-bracket="true" d={`M225 285V${y}M218 285H232M218 ${y}H232`} stroke={red} fill="none"/>
   <Label x={264} y={Math.min(260,(y+285)/2)}>h = {value} m</Label>
   <Label x={160} y={328}>Peso = 20 N · deslocamento para cima</Label>
   <Label x={160} y={352}>Wpeso = −20h = {value===0?0:-20*value} J</Label>
   <Label x={160} y={376}>ΔU = +20h = {20*value} J</Label>
   <Label x={160} y={400}>Trabalho externo = +ΔU · ΔK = 0</Label>
  </g>;
 }
 if(id==='nonconservative'){
  const internal=4*value,kinetic=40-internal;
  return <g data-mechanics="nonconservative">
   <Label x={160} y={20}>Mesmo percurso de 4 m · K inicial = 40 J</Label>
   <Label x={160} y={42}>Sem variação de altura · corpo + superfície</Label>
   <Block x={65} y={100}/><path d="M30 120H290" fill="none" stroke={blue}/>
   <Arrow x={102} y={100} dx={153} dy={0} kind="displacement"/><Label x={180} y={83}>deslocamento →</Label>
   <Arrow x={65} y={158} dx={-value*4.3} dy={0} kind="friction"/><Label x={175} y={160}>fat = {value} N · ←</Label>
   <Label x={160} y={198}>Sem atrito: K final = 40 J</Label>
   <rect x="40" y="209" width="240" height="19" fill={blue}/>
   <Label x={160} y={253}>Com atrito: K + energia interna = 40 J</Label>
   <rect data-energy="kinetic" data-joules={kinetic} x="40" y="267" width={kinetic*6} height="19" fill={blue}/>
   <rect data-energy="internal" data-joules={internal} x={40+kinetic*6} y="267" width={internal*6} height="19" fill={red}/>
   <Label x={82} y={315}>K = {kinetic} J</Label><Label x={229} y={315}>interna = {internal} J</Label>
   <Label x={160} y={346}>Watrito = −fat · 4 = {internal===0?0:-internal} J</Label>
   <Label x={160} y={376}>Energia total conservada; mecânica diminui.</Label>
   <Label x={160} y={401}>Barras: mesma escala, 6 unidades por joule.</Label>
  </g>;
 }
 return null;
}
