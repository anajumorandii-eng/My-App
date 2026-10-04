import React, { useId } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import './SocioEconomicIllustration.css';

type Kind = 'population' | 'labor' | 'hierarchy' | 'segregation' | 'migration' | 'transport' | 'agriculture' | 'production' | 'sao-paulo' | 'tourism' | 'blocs' | 'trade' | 'world-order' | 'smartphone' | 'networks' | 'diplomacy' | 'europe' | 'industry' | 'geoeconomics' | 'agrarian' | 'deconcentration';

function Building({ x, y, w=48, h=70, kind='office' }: { x:number; y:number; w?:number; h?:number; kind?:'office'|'school'|'hospital'|'bank' }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d={`M0 0h${w}v${-h}H0Z`} className="se-stone"/>
    <path d={`M${w} 0l12-7v${-h}l-12 7ZM0 ${-h}l12-7h${w}l-12 7Z`} className="se-stone-side"/>
    {Array.from({length:Math.max(1,Math.floor((h-18)/16))},(_,r)=>Array.from({length:Math.floor(w/13)},(_,c)=><rect key={`${r}-${c}`} x={5+c*13} y={-h+8+r*16} width="7" height="9" className="se-window"/>))}
    <path d={`M${w/2-5} 0v-15h10V0`} className="se-door"/>
    {kind==='hospital' && <path d={`M${w/2} ${-h-18}v15m-7-7h14`} className="se-red-line"/>}
    {kind==='school' && <><path d={`M${w-5} ${-h-6}v-26h18l-5 9h-13`} className="se-flag"/><text x={w/2} y="16" textAnchor="middle" className="se-small">escola</text></>}
    {kind==='bank' && <><path d={`M-5 ${-h}l${w/2+5}-20 ${w/2+5} 20Z`} className="se-roof"/><text x={w/2} y={-h+15} textAnchor="middle" className="se-small">BANCO</text></>}
  </g>;
}
function Dwelling({ x,y,s=1 }: {x:number;y:number;s?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-23 0v-32h46V0Z" className="se-house"/><path d="M-29-32 0-52 29-32Z" className="se-roof"/><path d="M-4 0v-21H8V0" className="se-door"/><rect x="-18" y="-24" width="9" height="10" className="se-window"/><path d="M13-40v-19h8v25M-22-10h11M-17-14v8" className="se-detail"/></g>;
}
function Worker({x,y,s=1,hat=false,bag=false}: {x:number;y:number;s?:number;hat?:boolean;bag?:boolean}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse cy="40" rx="12" ry="3" className="se-shadow"/><path d="M-6 19-8 39M6 19l5 20M-9 1l-7 20M9 1l9 15" className="se-limb"/><path d="M-10 0q10-7 20 0l3 22h-26Z" className="se-coat"/><circle cy="-12" r="9" className="se-skin"/><path d="M-9-14q0-14 18 0M-3-8h5" className="se-hair"/>{hat&&<path d="M-14-18h28m-24-1 3-7h14l3 7" className="se-hat"/>}{bag&&<><rect x="14" y="16" width="15" height="17" rx="2" className="se-earth"/><path d="M17 16v-5h8v5" className="se-detail"/></>}</g>;
}
function Factory({x,y,s=1}: {x:number;y:number;s?:number}) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-60 0v-50l25 12v-12l25 12v-12l25 12h35V0Z" className="se-factory"/><path d="M29-38v-70h12v70M27-108h16" className="se-brick"/><path d="M32-119q-20-11-5-22t-8-21" className="se-smoke"/>{[-47,-23,1,25].map(v=><rect key={v} x={v} y="-29" width="14" height="16" className="se-window"/>)}<path d="M-54-7h101M-6 0v-20H9V0" className="se-detail"/><path d="M-55-44-36-35M-31-43-12-34M-8-43 11-34" className="se-detail"/></g>;
}
function Field({x,y,w=110,h=65}: {x:number;y:number;w?:number;h?:number}) {
  return <g transform={`translate(${x} ${y})`}><path d={`M0 0h${w}l-25 ${h}H-25Z`} className="se-field"/>{[0,1,2,3,4].map(r=><g key={r}><path d={`M${-5-r*4} ${12+r*10}h${w}`} className="se-furrow"/>{[0,1,2,3].map(c=><path key={c} d={`M${10+c*23-r*4} ${10+r*10}v-10m0 5q-8-2-7-7m7 5q8-2 7-7`} className="se-crop"/>)}</g>)}</g>;
}
function Tractor({x,y,s=1}: {x:number;y:number;s?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-23-7v-18H1V-9h24v16h-48Z" className="se-machine"/><path d="M-19-21h15v12h-15ZM16-10v-16" className="se-window"/><circle cx="-15" cy="8" r="12" className="se-wheel"/><circle cx="18" cy="8" r="7" className="se-wheel"/><circle cx="-15" cy="8" r="5" className="se-machine"/><path d="M-28 0h-22m-3-7v18m-7-18v18" className="se-detail"/></g>;
}
function Truck({x,y,s=1}: {x:number;y:number;s?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-43" y="-28" width="56" height="31" className="se-container"/><path d="M13-20h19l12 13V3H13Z" className="se-machine"/><path d="M20-17h10l9 10H20Z" className="se-window"/>{[-29,-9,30].map(n=><circle key={n} cx={n} cy="5" r="7" className="se-wheel"/>)}{[-34,-25,-16,-7,2].map(n=><path key={n} d={`M${n}-25V-1`} className="se-detail"/>)}</g>;
}
function Ship({x,y,s=1}: {x:number;y:number;s?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-68-2H71L51 22H-47Z" className="se-hull"/>{[-44,-18,8].map((v,i)=><g key={v}><rect x={v} y={-20-i%2*18} width="24" height={18+i%2*18} className="se-container"/><path d={`M${v+5} ${-18-i%2*18}V-4m6 0v${-14-i%2*18}m6 0V-4`} className="se-detail"/></g>)}<path d="M38-2v-46h22v46M40-42h18m-18 9h18M49-48v-13m-8 0h16" className="se-stone"/><path d="M-75 30q12-7 24 0t24 0t24 0t24 0t24 0t24 0" className="se-water-line"/></g>;
}
function Chip({x,y,s=1}: {x:number;y:number;s?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${s})`}><rect x="-27" y="-27" width="54" height="54" rx="3" className="se-chip"/><rect x="-17" y="-17" width="34" height="34" className="se-circuit"/>{[-20,-10,0,10,20].map(v=><path key={v} d={`M${v}-37v10m0 54v10M-37 ${v}h10m54 0h10`} className="se-metal-line"/>)}<path d="M-12-8h24m-24 8h16m-16 8h24" className="se-detail"/></g>;
}
function Tree({x,y,s=1}: {x:number;y:number;s?:number}) {
 return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 0v-35m0 20-12-12m12 4 12-14" className="se-wood-line"/><path d="M-18-26q-15-15 1-25q-3-16 15-18q18-2 18 16q19 8 6 25Z" className="se-tree"/></g>;
}
function Crate({x,y}: {x:number;y:number}) {return <g transform={`translate(${x} ${y})`}><path d="M-15-15h30v25h-30Z" className="se-earth"/><path d="M-15-9h30m-30 8h30m-30 8h30m-26-20v19m22-19v19" className="se-detail"/></g>;}
function Note({x,y,lines,to,side='start'}: {x:number;y:number;lines:string[];to?:[number,number];side?:'start'|'end'|'middle'}) {
 return <g><text x={x} y={y} textAnchor={side} className="se-hand">{lines.map((v,i)=><tspan key={v} x={x} dy={i?16:0}>{v}</tspan>)}</text>{to&&<path d={`M${x+(side==='end'?-10:side==='middle'?0:10)} ${y+lines.length*16+1}Q${x} ${to[1]-16} ${to[0]} ${to[1]}`} className="se-pointer"/>}</g>;
}
function Link({d,id,label,x,y}: {d:string;id:string;label?:string;x?:number;y?:number}) {return <g><path d={d} className="se-flow" markerEnd={`url(#${id})`}/>{label&&<text x={x} y={y} textAnchor="middle" className="se-small">{label}</text>}</g>;}
function Road({d}: {d:string}) {return <><path d={d} className="se-road"/><path d={d} className="se-road-mark"/></>;}

const TITLES:Record<Kind,string>={
 population:'Viver mais muda a população', labor:'Quem trabalha sustenta quem depende', hierarchy:'A cidade liga sua região ao mundo', segregation:'Uma cidade, acessos muito diferentes', migration:'Partir é atravessar forças e barreiras', transport:'Da produção ao destino: combinar redes', agriculture:'A técnica muda o campo e o trabalho', production:'O modo de fabricar organiza o trabalho', 'sao-paulo':'O café ajudou a construir a indústria', tourism:'O lugar vira destino — e também negócio', blocs:'Integrar mercados exige abrir fronteiras', trade:'Exportar muito pode render pouco', 'world-order':'Dois polos, depois novos centros de poder', smartphone:'Um aparelho, muitos territórios', networks:'Fluxos globais dependem de nós materiais', diplomacy:'Decidir sozinho ou negociar em conjunto', europe:'O que atravessa as fronteiras europeias?', industry:'A fábrica se divide — o produto circula', geoeconomics:'Tecnologia, crédito e recursos são poder', agrarian:'Terra, técnica e disputa na fronteira', deconcentration:'A indústria procura outras localizações',
};

/** A cena grande apresenta objetos e relações; os recortes abaixo conservam o aprofundamento. */
export function SocioEconomicIllustration({kind,active}: {kind:Kind;active:number}) {
 const id=`se-${useId().replace(/:/g,'')}`;
 const transition=useSceneMotion();
 let drawing:React.ReactNode;
 switch(kind) {
 case 'population': drawing=<>
   <path d="M45 265Q160 254 303 267T577 262" className="se-ground"/>
   <Dwelling x={106} y={245}/><Worker x={62} y={222} s={.65} hat/><Worker x={143} y={225} s={.55}/>
   <Building x={256} y={244} w={62} h={108} kind="hospital"/><Building x={357} y={244} w={45} h={75} kind="school"/>
   <path d="M231 258h190m-130 0v28h97v-28" className="se-pipe"/><path d="M281 277h94" className="se-water-line"/>
   <Worker x={462} y={222} s={.9}/><Worker x={500} y={222} s={.9}/><path d="M509 235l8 27" className="se-wood-line"/>
   <path d="M48 110C141 106 157 170 250 172S384 221 535 221" className="se-red-line"/><path d="M48 115C132 134 163 219 246 226S384 237 535 237" className="se-blue-line"/>
   <text x="45" y="97" className="se-small">natalidade</text><text x="190" y="251" className="se-small">mortalidade</text>
   <Note x={30} y={307} lines={['menos mortes primeiro','saneamento + vacinação']} to={[284,280]}/><Note x={352} y={308} lines={['menos nascimentos depois','base estreita → envelhecimento']} to={[462,245]}/>
 </>; break;
 case 'labor': drawing=<>
   <Field x={47} y={223} w={115} h={51}/><Tractor x={92} y={217} s={.65}/><Worker x={156} y={238} s={.7} hat/>
   <Factory x={285} y={253} s={.83}/><Worker x={239} y={248} s={.65}/><Worker x={332} y={248} s={.65}/>
   <Building x={442} y={253} h={116}/><Building x={507} y={253} h={66} kind="hospital"/>
   <Link d="M172 215Q193 192 221 207" id={id}/><Link d="M349 205Q392 179 431 201" id={id}/>
   <text x="105" y="295" textAnchor="middle" className="se-label">primário</text><text x="287" y="295" textAnchor="middle" className="se-label">secundário</text><text x="493" y="295" textAnchor="middle" className="se-label">terciário</text>
   {[209,249,289,329,369].map(x=><Worker key={x} x={x} y={127} s={.6}/>)}
   <Note x={31} y={90} lines={['idade ativa em expansão','uma janela, não uma garantia']} to={[249,124]}/><Note x={570} y={91} side="end" lines={['emprego + qualificação','transformam o bônus em renda']} to={[453,155]}/>
   <text x="310" y="337" textAnchor="middle" className="se-hand">a estrutura setorial não mede, sozinha, desenvolvimento</text>
 </>; break;
 case 'hierarchy': drawing=<>
   <Road d="M67 267Q217 299 306 236T510 228"/><Road d="M90 165Q194 224 307 238"/>
   <Dwelling x={74} y={257} s={.65}/><Dwelling x={115} y={266} s={.5}/><Building x={158} y={211} w={33} h={55} kind="hospital"/>
   <Building x={281} y={245} w={44} h={99}/><Building x={337} y={240} w={35} h={71}/>
   <Building x={459} y={239} w={39} h={141}/><Building x={511} y={239} w={42} h={106}/>
   <path d="M446 273h125m-116-6v12m23-12v12m23-12v12m23-12v12m23-12v12" className="se-rail"/>
   <Link d="M113 246Q181 291 272 245" id={id}/><Link d="M363 221Q405 192 450 202" id={id}/><Link d="M539 115Q572 86 587 72" id={id}/>
   <Note x={30} y={94} lines={['centros locais','compras e serviços cotidianos']} to={[88,214]}/><Note x={247} y={94} lines={['metrópole regional','serviços mais especializados']} to={[322,150]}/>
   <text x="490" y="308" textAnchor="middle" className="se-hand">metrópole nacional</text><text x="490" y="327" textAnchor="middle" className="se-small">comando e conexões globais</text>
   <text x="105" y="319" textAnchor="middle" className="se-small">pessoas · mercadorias · informação</text>
 </>; break;
 case 'segregation': drawing=<>
   <path d="M29 210 77 165 143 177 214 267 29 290Z" className="se-hills"/>
   {[[60,208],[109,229],[157,258]].map(([x,y])=><Dwelling key={x} x={x} y={y} s={.6}/>)}
   <Road d="M200 277Q318 284 551 267"/><Truck x={303} y={272} s={.5}/>
   <Building x={398} y={255} h={112}/><Building x={464} y={255} h={142}/><Building x={535} y={255} w={33} h={66} kind="hospital"/>
   <path d="M387 285h173m-30 0v25m-137-25v25" className="se-pipe"/>
   <path d="M207 285h-35m-12 0h-36m-11 0H74" className="se-pipe-missing"/>
   <Worker x={226} y={257} s={.65} bag/>
   <Note x={30} y={91} lines={['encosta + serviços insuficientes','vulnerabilidade não é destino']} to={[112,212]}/><Note x={372} y={88} lines={['infraestrutura valoriza o solo','o preço seleciona quem pode morar']} to={[437,257]}/>
   <Note x={38} y={321} lines={['o deslocamento consome tempo e renda']} to={[282,279]}/><text x="457" y="337" className="se-small">saneamento e serviços</text>
 </>; break;
 case 'migration': drawing=<>
   <path d="M31 260h178l-21 21H31Z" className="se-dry"/><Dwelling x={106} y={248}/><Tree x={48} y={243} s={.6}/><path d="M40 269l18-6 15 12 20-9 14 10" className="se-detail"/>
   <Building x={452} y={253} h={105}/><Factory x={538} y={251} s={.55}/>
   <Road d="M169 286Q306 249 413 283"/><Worker x={241} y={240} bag/><Worker x={278} y={248} s={.65}/>
   <path d="M343 265v-88m-19 88v-88M317 178h33" className="se-barrier"/>
   <Link d="M169 202Q247 161 316 210" id={id}/><Link d="M354 210Q397 163 443 191" id={id}/>
   <Note x={30} y={89} lines={['expulsão: desemprego, conflitos','ou pressão ambiental']} to={[105,212]}/><Note x={365} y={90} lines={['atração: trabalho e serviços','expectativa não garante integração']} to={[454,178]}/>
   <Note x={310} y={321} lines={['fronteiras, custo e redes de apoio','também condicionam a mobilidade']} to={[337,216]}/>
 </>; break;
 case 'transport': drawing=<>
   <Field x={40} y={127} w={110} h={54}/><Tractor x={101} y={133} s={.6}/><Crate x={179} y={171}/>
   <Road d="M153 180Q240 208 312 160T528 150"/><Truck x={270} y={184} s={.7}/>
   <path d="M55 233h353m-340-6v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12m22-12v12" className="se-rail"/>
   {[170,215,260].map(x=><g key={x}><rect x={x} y="208" width="38" height="20" className="se-container"/><circle cx={x+8} cy="231" r="4" className="se-wheel"/><circle cx={x+29} cy="231" r="4" className="se-wheel"/></g>)}
   <path d="M411 205h159v82H382Z" className="se-water"/><Ship x={480} y={243} s={.74}/>
   <path d="M530 196v-72h-87m68 0-30 56m28-52h31v42h-17" className="se-crane"/>
   <Note x={30} y={86} lines={['rodovia: flexível','chega perto da origem']} to={[270,171]}/><Note x={345} y={86} lines={['terminais ligam modais','transbordo também custa']} to={[525,211]}/>
   <text x="147" y="301" className="se-hand">ferrovia: grandes volumes</text><text x="409" y="311" className="se-hand">hidrovia: baixo custo</text><text x="310" y="343" textAnchor="middle" className="se-small">aéreo → rapidez para cargas de maior valor e menor volume</text>
 </>; break;
 case 'agriculture': drawing=<>
   <Field x={50} y={192} w={163} h={87}/><Worker x={85} y={170} hat/><Dwelling x={191} y={171} s={.65}/><Crate x={170} y={258}/>
   <Field x={346} y={176} w={202} h={105}/><Tractor x={447} y={214} s={1.1}/><path d="M523 172v-72q15-18 30 0v72Z" className="se-silo"/><path d="M529 111h18m-18 13h18m-18 13h18m-18 13h18" className="se-detail"/>
   <Note x={30} y={90} lines={['trabalho familiar e policultura','podem abastecer o mercado']} to={[111,200]}/><Note x={347} y={90} lines={['mecanização + insumos','elevam a produtividade']} to={[442,200]}/>
   <path d="M282 137v129" className="se-divider"/><text x="144" y="311" textAnchor="middle" className="se-hand">terra + trabalho</text><text x="447" y="311" textAnchor="middle" className="se-hand">terra + capital + tecnologia</text>
   <text x="310" y="340" textAnchor="middle" className="se-small">a forma de produção também altera emprego, solo e destino da colheita</text>
 </>; break;
 case 'production': drawing=<>
   <Factory x={310} y={179} s={1.15}/>
   <path d="M68 245h485v27H68Z" className="se-conveyor"/>{Array.from({length:20},(_,i)=><circle key={i} cx={77+i*24} cy="264" r="4" className="se-wheel"/>)}
   {[136,239,342,445].map((x,i)=><g key={x}><path d={`M${x-22} 240h44l-8-17h-28Z`} className="se-machine"/>{i>0&&<circle cx={x-12} cy="240" r="5" className="se-wheel"/>}{i>2&&<circle cx={x+12} cy="240" r="5" className="se-wheel"/>}<Worker x={x} y={295} s={.7}/></g>)}
   <path d="M483 230v-41l-18-15 16-27m0 0h-19m19 0 12-10" className="se-robot"/>
   <Note x={30} y={87} lines={['Taylor: separar e cronometrar','Ford: padronizar na esteira']} to={[184,254]}/><Note x={357} y={87} lines={['Toyotismo: demanda orienta','produção flexível e estoque menor']} to={[482,190]}/>
   <Link d="M564 283Q594 160 493 155" id={id}/><text x="310" y="345" textAnchor="middle" className="se-small">a organização da produção muda tarefas, ritmo e relações de trabalho</text>
 </>; break;
 case 'sao-paulo': drawing=<>
   <Field x={38} y={191} w={144} h={76}/>{[58,98,138].map(x=><Tree key={x} x={x} y={184} s={.48}/>)}<Crate x={145} y={260}/>
   <path d="M170 275Q250 218 385 270" className="se-rail"/><path d="M170 282Q250 225 385 277" className="se-rail"/>
   <Building x={234} y={228} w={49} h={60} kind="bank"/><Factory x={386} y={241} s={.9}/><Worker x={324} y={267} s={.8} bag/>
   <path d="M450 248h127v54H428Z" className="se-water"/><Ship x={508} y={266} s={.65}/>
   <Link d="M157 157Q202 125 249 151" id={id}/><Link d="M287 181Q314 155 337 180" id={id}/>
   <Note x={30} y={90} lines={['exportação de café','acumula capitais e amplia ferrovias']} to={[118,196]}/><Note x={374} y={90} lines={['mercado, trabalho e transporte','favorecem o polo paulista']} to={[385,197]}/>
   <text x="247" y="311" textAnchor="middle" className="se-hand">café → capital → fábrica</text><text x="502" y="329" textAnchor="middle" className="se-small">porto de Santos</text>
 </>; break;
 case 'tourism': drawing=<>
   <path d="M31 250 91 150 170 232 219 172 314 269Z" className="se-hills"/><Tree x={65} y={253} s={.65}/><Tree x={204} y={258} s={.7}/>
   <path d="M323 225Q414 194 578 214v89H296Z" className="se-water"/><path d="M305 236Q439 212 565 228" className="se-sand"/>
   <Building x={420} y={224} h={117}/><Building x={489} y={224} h={78}/><Worker x={354} y={251} s={.8} bag/>
   <path d="M346 146v57m-29-39q30-28 58 0Z" className="se-parasol"/><Dwelling x={263} y={258} s={.6}/>
   <Road d="M31 290Q187 275 305 283"/><Truck x={132} y={284} s={.45}/>
   <Note x={30} y={87} lines={['paisagem e patrimônio','atraem deslocamentos']} to={[91,161]}/><Note x={357} y={88} lines={['hotéis e acessibilidade','transformam o território']} to={[445,214]}/>
   <text x="39" y="333" className="se-hand">renda e emprego ↔ pressão sobre preços e ambiente</text>
 </>; break;
 case 'blocs': drawing=<>
   <Road d="M44 254h529"/>
   {[96,280,468].map(x=><Dwelling key={x} x={x} y={230} s={.9}/>)}<Truck x={178} y={247} s={.7}/><Worker x={384} y={222} bag/>
   <path d="M214 245v-90m-13 0h26m-13 2 30-32M417 245v-90m-13 0h26m-13 2 30-32" className="se-barrier"/>
   <Link d="M133 178Q195 119 256 178" id={id}/><Link d="M319 178Q381 119 444 178" id={id}/>
   <text x="205" y="111" className="se-small">mercadorias</text><text x="376" y="111" className="se-small">pessoas e capital</text>
   <Note x={30} y={304} lines={['livre comércio: tarifas internas menores','união aduaneira: tarifa externa comum']} to={[213,208]}/><Note x={340} y={303} lines={['mercado comum: fatores circulam','união monetária: moeda compartilhada']} to={[417,207]}/>
   <text x="30" y="89" className="se-hand">a integração avança em dimensões diferentes</text>
 </>; break;
 case 'trade': drawing=<>
   <Field x={38} y={178} w={134} h={85}/><Worker x={75} y={163} s={.8} hat/>{[149,178,204].map(x=><Crate key={x} x={x} y={252}/>)}
   <Ship x={304} y={232} s={.7}/><Factory x={475} y={243} s={.9}/><Chip x={537} y={159} s={.65}/>
   <Link d="M188 197Q294 135 407 186" id={id}/><Link d="M427 290Q304 327 180 284" id={id}/>
   <text x="299" y="160" textAnchor="middle" className="se-small">exportar produtos primários</text><text x="309" y="317" textAnchor="middle" className="se-small">importar manufaturados</text>
   <Note x={30} y={89} lines={['preço relativo importa','não só toneladas exportadas']} to={[163,252]}/><Note x={359} y={89} lines={['tecnologia e valor agregado','alteram o poder de troca']} to={[526,147]}/>
   <text x="310" y="334" textAnchor="middle" className="se-hand">termos de troca = preço das exportações / preço das importações</text>
 </>; break;
 case 'world-order': drawing=<>
   <path d="M35 142h235v129H35Z" className="se-world-west"/><path d="M350 142h235v129H350Z" className="se-world-east"/>
   <Building x={83} y={244} h={79}/><Factory x={197} y={244} s={.59}/><Building x={386} y={244} h={81}/><Factory x={503} y={244} s={.6}/>
   <path d="M291 127v148m20-148v148m-20-93h20m-20 24h20m-20 24h20" className="se-barrier"/>
   <text x="148" y="125" textAnchor="middle" className="se-label">EUA · capitalismo</text><text x="463" y="125" textAnchor="middle" className="se-label">URSS · socialismo</text>
   <Link d="M160 296Q307 344 460 296" id={id}/><text x="310" y="332" textAnchor="middle" className="se-hand">1991: fim da URSS → reordenação do poder</text>
   <Note x={30} y={84} lines={['alianças, armas e influência','organizam a bipolaridade']} to={[291,185]}/><Note x={368} y={84} lines={['depois: ascensão de novos polos','não significa poder igual']} to={[454,255]}/>
 </>; break;
 case 'smartphone': drawing=<>
   <path d="M252 101h111q12 0 12 12v165q0 12-12 12H252q-12 0-12-12V113q0-12 12-12Z" className="se-phone"/><path d="M252 126h111v139H252Z" className="se-window"/><circle cx="307" cy="278" r="5" className="se-detail"/><path d="M290 114h34" className="se-detail"/><Chip x={307} y={193} s={.8}/>
   <Building x={53} y={185} h={63}/><Chip x={129} y={262} s={.7}/><Factory x={502} y={176} s={.65}/><Ship x={505} y={274} s={.62}/>
   <Link d="M110 158Q163 129 226 168" id={id}/><Link d="M171 261Q210 268 228 227" id={id}/><Link d="M388 150Q435 118 457 141" id={id}/><Link d="M526 195Q557 215 522 234" id={id}/>
   <Note x={30} y={87} lines={['design: EUA','projeto e propriedade intelectual']} to={[77,152]}/><Note x={355} y={86} lines={['montagem: China ou Vietnã','componentes chegam de muitos países']} to={[498,158]}/>
   <text x="30" y="314" className="se-hand">chips: Taiwan e Coreia do Sul</text><text x="385" y="314" className="se-hand">distribuição mundial</text><text x="310" y="343" textAnchor="middle" className="se-small">um gargalo local pode interromper a cadeia inteira</text>
 </>; break;
 case 'networks': drawing=<>
   <path d="M60 251Q178 315 277 222T555 229" className="se-cable"/><path d="M275 222Q298 113 453 142" className="se-cable"/>
   <Building x={63} y={236} w={53} h={84}/><Ship x={199} y={268} s={.52}/><Building x={277} y={212} w={67} h={69}/><Building x={458} y={198} h={101}/>
   <path d="M305 143v-31m-12 5q12-15 24 0m-20-8q8-9 16 0" className="se-blue-line"/>
   <path d="M466 286h93v-46h-93Z" className="se-server"/>{[249,263,276].map(y=><g key={y}><path d={`M473 ${y}h79`} className="se-detail"/><circle cx="479" cy={y+3} r="2" className="se-light"/></g>)}
   <Note x={30} y={87} lines={['portos conectam cargas','cabos submarinos conectam dados']} to={[186,282]}/><Note x={341} y={87} lines={['nós concentram infraestrutura','e acesso desigual às redes']} to={[302,166]}/>
   <text x="67" y="335" className="se-hand">o digital também tem endereço, energia e fios</text>
 </>; break;
 case 'diplomacy': drawing=<>
   <path d="M130 197Q310 125 490 197L476 260Q310 292 144 260Z" className="se-table"/><ellipse cx="310" cy="216" rx="151" ry="38" className="se-table-top"/>
   {[170,240,310,380,450].map((x,i)=><g key={x}><Worker x={x} y={i%2?139:159} s={.8}/><path d={`M${x-12} 195h24v17h-24Z`} className="se-paper-sheet"/></g>)}
   <Worker x={101} y={242} s={.9}/><path d="M87 238H51v-57" className="se-red-line"/>
   <path d="M286 231h51v30h-51Z" className="se-paper-sheet"/><path d="M293 241h35m-35 8h28" className="se-detail"/>
   <Note x={30} y={87} lines={['unilateralismo','ação por decisão própria']} to={[89,246]}/><Note x={327} y={87} lines={['multilateralismo: regras negociadas','instituições mediam o acordo']} to={[361,202]}/>
   <text x="310" y="320" textAnchor="middle" className="se-hand">cooperar envolve conflito, negociação e limites</text>
 </>; break;
 case 'europe': drawing=<>
   <Road d="M41 262h540"/>
   <Building x={65} y={244} h={83}/><Building x={269} y={244} h={112}/><Building x={493} y={244} h={69}/>
   <path d="M210 246v-109m-13 0h26m-13 3 30-32M435 246v-109m-13 0h26m-13 3 30-32" className="se-barrier"/>
   <Truck x={176} y={257} s={.65}/><Worker x={383} y={243} s={.75} bag/>
   <circle cx="319" cy="171" r="26" className="se-coin"/><text x="319" y="182" textAnchor="middle" className="se-euro">€</text>
   <Note x={30} y={84} lines={['mercado único','bens, serviços, pessoas e capitais']} to={[166,253]}/><Note x={365} y={84} lines={['UE, euro e Schengen','não reúnem exatamente','os mesmos países']} to={[316,168]}/>
   <text x="310" y="320" textAnchor="middle" className="se-hand">a integração não apaga divergências entre os membros</text>
 </>; break;
 case 'industry': drawing=<>
   <Building x={60} y={214} h={79}/><Factory x={291} y={255} s={1}/><Ship x={502} y={250} s={.76}/>
   <Link d="M122 173Q181 122 237 181" id={id}/><Link d="M354 218Q400 190 442 223" id={id}/><Link d="M476 301Q316 355 202 292" id={id}/>
   <Chip x={217} y={286} s={.47}/><Crate x={376} y={268}/><Worker x={284} y={274} s={.8}/>
   <Note x={30} y={87} lines={['projeto e conhecimento','podem ficar em outro território']} to={[83,153]}/><Note x={360} y={86} lines={['etapas da manufatura se deslocam','custos, redes e políticas importam']} to={[305,192]}/>
   <text x="311" y="335" textAnchor="middle" className="se-hand">economia circular: preservar valor, reparar e reintroduzir materiais</text>
 </>; break;
 case 'geoeconomics': drawing=<>
   <Chip x={107} y={192} s={1.3}/><Building x={276} y={242} w={62} h={90} kind="bank"/>
   <path d="M438 261 476 168 537 188 576 261Z" className="se-hills"/><path d="M461 250 486 216 508 256ZM514 241 540 205 558 259Z" className="se-mineral"/><Truck x={507} y={273} s={.62}/>
   <Link d="M161 171Q200 131 263 173" id={id}/><Link d="M345 215Q401 174 455 204" id={id}/><Link d="M451 289Q302 329 157 281" id={id}/>
   <Note x={30} y={86} lines={['chips e litografia EUV','controle de tecnologia estratégica']} to={[105,170]}/><Note x={359} y={86} lines={['terras-raras e recursos','outra fonte de dependência']} to={[486,211]}/>
   <text x="309" y="286" textAnchor="middle" className="se-hand">crédito, sanções e moeda</text><text x="310" y="345" textAnchor="middle" className="se-small">o dólar mantém papel dominante nas reservas e transações internacionais</text>
 </>; break;
 case 'agrarian': drawing=<>
   <Field x={48} y={184} w={253} h={97}/><Tractor x={194} y={214} s={1}/><path d="M274 182v-57q11-17 23 0v57Z" className="se-silo"/>
   <Field x={394} y={226} w={114} h={57}/><Dwelling x={458} y={206} s={.7}/><Worker x={423} y={204} s={.8} hat/>
   <Tree x={545} y={199} s={.9}/><Tree x={575} y={210} s={.65}/>
   <path d="M332 151v142m-12-122h25m-25 33h25m-25 33h25m-25 33h25" className="se-fence"/>
   <path d="M78 280h224v16H78Z" className="se-soil"/><path d="M80 293h219" className="se-lime"/>
   <Note x={30} y={87} lines={['grandes áreas + mecanização','grãos ligados ao mercado externo']} to={[195,214]}/><Note x={367} y={87} lines={['agricultura familiar','também produz para vender']} to={[444,243]}/>
   <Note x={30} y={324} lines={['Cerrado: correção da acidez + pesquisa']} to={[180,290]}/><text x="370" y="333" className="se-hand">fronteira → disputa pela terra</text>
 </>; break;
 case 'deconcentration': drawing=<>
   <Factory x={143} y={263} s={.95}/><Building x={66} y={245} w={33} h={80}/><Truck x={151} y={285} s={.5}/>
   <Factory x={403} y={167} s={.65}/><Factory x={505} y={269} s={.73}/>
   <Road d="M225 274Q323 263 397 182"/><Road d="M225 280Q368 320 450 279"/>
   <Link d="M195 218Q268 148 353 145" id={id}/><Link d="M229 241Q355 215 445 241" id={id}/>
   <Note x={30} y={86} lines={['RMSP: saturação e custos','congestionamento, terreno e poluição']} to={[145,200]}/><Note x={362} y={86} lines={['novas localizações','infraestrutura e incentivos fiscais']} to={[402,163]}/>
   <text x="409" y="204" className="se-small">interior e outros estados</text><text x="309" y="340" textAnchor="middle" className="se-hand">desconcentrar a localização ≠ aumentar o peso industrial no PIB</text>
 </>; break;
 }
 return <g className={`se-illustration se-${kind}`} data-authorial-scene={kind}>
   <defs><marker id={id} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 9 5 0 10" className="se-arrow-tip"/></marker><pattern id={`${id}-grain`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M3 8h5m12 13h4" className="se-grain"/></pattern></defs>
   <rect x="8" y="8" width="604" height="354" rx="9" className="se-paper"/><rect x="8" y="8" width="604" height="354" rx="9" fill={`url(#${id}-grain)`}/>
   <text x="30" y="46" className="se-title">{TITLES[kind]}</text><path d="M30 56Q196 65 398 55" className="se-title-mark"/>
   <motion.g initial={false} animate={{opacity:1}} transition={transition} key={active}>{drawing}</motion.g>
   <text x="590" y="359" textAnchor="end" className="se-caption">esquema de relações · sem escala</text>
 </g>;
}
