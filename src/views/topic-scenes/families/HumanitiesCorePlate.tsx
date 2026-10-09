import { illustrationMaterialStyle } from './IllustrationMaterials';
import React, { useId } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import { Person, PlateDefs } from './HumanitiesPrototypes';
import './HumanitiesCorePlate.css';

type CoreKind = 'industry' | 'navigation' | 'colonization' | 'revolts' | 'projection';
function House({x,y,church=false}:{x:number;y:number;church?:boolean}) {
  return <g transform={`translate(${x} ${y})`}><path d="M-34 0V-64H34V0Z" className="ha-stone"/><path d="M-43-64 0-96 43-64Z" className="hc-roof"/><path d="M-10 0v-34h20V0" className="ha-door"/><path d="M-23-51h12v16h-12Zm34 0h12v16H11Z" className="hc-window"/>{church&&<><path d="M28-66v-53h20v65" className="ha-stone"/><path d="M25-119 38-141 51-119Z" className="hc-roof"/><path d="M38-141v-18m-7 7h14" className="ha-ink"/></>}</g>;
}
function Ship({x,y,scale=1}:{x:number;y:number;scale?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-93 0Q-73 43 38 35L82-2 48 5H-48Z" className="hc-hull"/><path d="M-79 13Q-32 30 56 16M-63 24Q-13 40 36 28" className="ha-wood-line"/><path d="M-15 4v-153M40 4v-112M-61 5v-91" className="ha-wood-line"/><path d="M-22-134Q-70-111-28-66H-18ZM-8-133Q55-109-3-64Z M35-95Q-5-72 33-29H39ZM-64-75Q-99-58-69-20H-61Z" className="hc-sail"/><path d="M-7-111v30m-11-20h22" className="hc-cross"/><path d="M-15-149 31-139-15-128Z" className="ha-flag-line"/><path d="M-76-90 66 3M-12-145-73 4M39-110 68 2" className="hc-rigging"/></g>;
}
function Industry({active,id}:{active:number;id:string}) {
 const t=useSceneMotion();
 return <g>
   <path d="M23 313Q200 280 390 310T756 306V354H23Z" className="ha-land"/>
   {[0,1,2,3].map(i=><g key={i}><path d={`M${31+i*31} 205v95m-8-71h30m-30 35h30`} className="ha-wood-line"/><path d={`M${35+i*30} 320q13-22 21-5`} className="ha-tree-trunk"/></g>)}
   <path d="M228 313V164L284 137V165L340 137V165L396 137V313Z" className="hc-brick"/>
   <path d="M245 157V71H270V157" className="hc-brick"/><path d="M242 74h31M250 86h16m-16 17h16m-16 17h16" className="ha-stone-seams"/>
   {[182,207,232].map(y=><g key={y}>{[244,289,334].map(x=><rect key={x} x={x} y={y} width="29" height="15" className="hc-window"/>)}</g>)}
   <path d="M267 58Q230 32 280 21T352 26" className="hc-smoke"/>
   <path d="M416 311H665V200H416Z" className="ha-document"/><rect x="431" y="230" width="64" height="42" rx="10" className="hc-boiler"/>
   <path d="M442 237h36m-36 8h36m-36 8h36M490 244h42v-39h69" className="ha-wood-line"/>
   <motion.g initial={false} animate={{rotate:active===1?180:0}} transition={t} style={{transformOrigin:'580px 267px'}}><circle cx="580" cy="267" r="36" className="hc-wheel"/>{[0,60,120].map(a=><path key={a} d="M544 267h72" transform={`rotate(${a} 580 267)`} className="ha-ink"/>)}</motion.g>
   <path d="M580 267h46v-31h18M432 288h205" className="ha-wood-line"/>
   <Person x={192} y={239}/>
   <path d="M137 246Q161 229 182 232" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
   <text x="31" y="119" className="ha-hand">terra cercada</text><text x="31" y="146" className="ha-small">expulsão e trabalho assalariado</text>
   <text x="420" y="127" className="ha-hand">vapor move a máquina</text><path d="M479 139Q465 166 463 219" className="ha-note-pointer"/>
   <text x="427" y="167" className="ha-small">carvão → calor → movimento</text>
   <text x="35" y="381" className="ha-small">O ganho de produção convive com jornadas extensas e conflitos sociais.</text>
 </g>;
}
function Navigation({id}:{id:string}) {
 return <g><path d="M25 303Q120 287 222 303T427 303T755 303V351H25Z" className="ha-sea"/>
   {[313,332].map(y=><path key={y} d={`M34 ${y}q24-13 48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0t48 0`} className="ha-water-line"/>)}
   <Ship x={292} y={280} scale={1.05}/>
   <circle cx="586" cy="238" r="64" className="hc-astrolabe"/><circle cx="586" cy="238" r="48" className="ha-ink"/><path d="M586 170v136m-68-68h136M548 269l72-61M586 165v-22a10 10 0 0 1 20 0" className="ha-gold-line"/>
   {[0,30,60,90,120,150,180,210,240,270,300,330].map(a=><path key={a} d="M586 178v7" transform={`rotate(${a} 586 238)`} className="ha-ink"/>)}
   <text x="36" y="108" className="ha-hand">velas, ventos, orientação</text><path d="M212 118Q241 136 266 158" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
   <text x="450" y="110" className="ha-hand">altura dos astros</text><text x="450" y="138" className="ha-small">ajuda a estimar a latitude</text><path d="M590 149v17" className="ha-note-pointer"/>
   <text x="37" y="380" className="ha-small">Navegar exige técnica; conquistar envolve comércio, violência e ocupação.</text>
 </g>;
}
function Colonization({id}:{id:string}) {
 return <g><path d="M25 311Q161 270 299 300T755 302V354H25Z" className="ha-land"/>
   {[55,78,101,124,147].map((x,i)=><g key={x}><path d={`M${x} 313v-${70+i%2*20}m0 30q-16-7-19-25m19 16q15-7 17-23`} className="ha-tree-trunk"/><path d={`M${x-7} 248q10-31 18-39m-15 45q-20-13-19-26`} className="ha-tree-leaf"/></g>)}
   <House x={365} y={308}/><path d="M392 306h117v-85H392Z" className="ha-document"/>
   {[415,444,473].map(x=><g key={x}><ellipse cx={x} cy="256" rx="10" ry="29" className="hc-wheel"/><path d={`M${x} 232v45`} className="ha-ink"/></g>)}
   <path d="M410 219h78l12-17H396Z" className="hc-roof"/><path d="M405 251h-28m111 0h23" className="ha-wood-line"/>
   <Person x={274} y={232}/><Person x={560} y={232}/>
   <Ship x={658} y={298} scale={.5}/>
   <text x="36" y="104" className="ha-hand">produção voltada ao exterior</text><path d="M266 115Q319 138 358 204" className="ha-note-pointer"/>
   <text x="439" y="127" className="ha-hand">açúcar e coerção</text><text x="439" y="156" className="ha-small">engenho: terra, trabalho e capital</text>
   <path d="M507 287Q593 336 647 325" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
   <text x="35" y="381" className="ha-small">Trabalho escravizado e resistência; o tráfico integra interesses coloniais.</text>
 </g>;
}
function Revolts({id}:{id:string}) {
 return <g><path d="M25 320 68 239 103 277 154 201 208 320Z" className="ha-land"/><House x={205} y={307} church/><House x={584} y={307}/><House x={673} y={307}/>
   <Person x={112} y={245} kind="merchant"/><Person x={308} y={245} kind="noble"/><Person x={489} y={245}/>
   <path d="M386 131H441V294H386Z" className="ha-document"/><path d="M395 161h37m-37 20h29m-29 20h37m-37 20h23" className="ha-document-line"/>
   <text x="36" y="108" className="ha-hand">Minas: impostos e elites</text><text x="464" y="108" className="ha-hand">Bahia: pautas populares</text>
   <path d="M300 169Q346 148 383 162M444 165Q466 147 500 160" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
   <text x="37" y="372" className="ha-small">A contestação aproxima movimentos; composição social e projetos divergem.</text>
 </g>;
}
function Projection({active,id}:{active:number;id:string}) {
 const t=useSceneMotion();
 return <g><circle cx="243" cy="222" r="109" className="ha-sea"/>
   {[-60,-30,0,30,60].map(d=><ellipse key={d} cx="243" cy="222" rx={109*Math.cos(d*Math.PI/180)} ry="109" className="hc-grid"/>)}
   {[-65,-32,0,32,65].map(d=><path key={d} d={`M${243-Math.sqrt(109*109-d*d)} ${222+d}h${2*Math.sqrt(109*109-d*d)}`} className="hc-grid"/>)}
   <path d="M157 171q25-37 64-21l28 20-20 35-42-4Zm60 69 38-14 24 25-19 35-16 35-20-23Z" className="ha-land"/>
   <motion.g initial={false} animate={{x:active*5}} transition={t}><path d="M451 142H695L730 314H482Z" className="ha-document"/><path d="M461 178H703m-233 43h242m-233 43h242M512 142l30 172m30-172 30 172m30-172 30 172" className="hc-grid"/><path d="M494 172q22-13 44 4l-7 23-24 11Zm73 67q34-16 52 6l-8 40-26-10Z" className="ha-land"/></motion.g>
   <path d="M356 221H439" markerEnd={`url(#${id}-arrow)`} className="ha-link"/>
   <text x="35" y="99" className="ha-hand">superfície curva</text><text x="453" y="99" className="ha-hand">representação plana</text>
   <text x="35" y="373" className="ha-small">Toda projeção transforma propriedades: escolher exige conhecer a finalidade.</text>
 </g>;
}
export function HumanitiesCorePlate({kind,active,children}:{kind:CoreKind;active:number;children:React.ReactElement<React.SVGProps<SVGSVGElement>>}) {
 const id=useId().replace(/:/g,'');
 const Drawing={industry:Industry,navigation:Navigation,colonization:Colonization,revolts:Revolts,projection:Projection}[kind];
 return <svg style={illustrationMaterialStyle(id)} className="ha-illustrated hc-plate" viewBox="0 0 780 860" role="img" aria-label={children.props['aria-label']}>
   <PlateDefs id={id}/><rect x="5" y="5" width="770" height="850" rx="9" className="ha-paper"/><rect x="5" y="5" width="770" height="850" fill={`url(#${id}-paper)`}/>
   <text x="32" y="53" className="ha-title">{{industry:'Terra, vapor e trabalho',navigation:'O oceano vira caminho',colonization:'O engenho e o mundo atlântico',revolts:'O pacto colonial em disputa',projection:'Do globo à folha'}[kind]}</text>
   <path d="M31 72Q305 81 745 69" className="ha-title-stroke"/>
   <Drawing active={active} id={id}/>
   {React.cloneElement(children,{x:20,y:410,width:740,height:430,role:undefined,'aria-label':undefined})}
 </svg>;
}
