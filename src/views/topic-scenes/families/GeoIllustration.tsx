import React, { useId } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import './GeoIllustration.css';

type Kind = 'EarthSeasons' | 'ReliefProfile' | 'SoilProfiles' | 'ClimateMap' | 'DomainsMap' | 'RockCycle' | 'TimeZones' | 'MapScale' | 'DigitalMapping' | 'MapElements' | 'SurfaceWater' | 'WorldWaters' | 'BrazilBasins' | 'BiomesProfile' | 'WetlandsCoast' | 'GlobalCommons' | 'EnvironmentalPower' | 'EnvironmentalLaw' | 'EnergyMatrix' | 'WorldElectricity' | 'MineralGeography';
const TITLES: Record<Kind, string> = {
 EarthSeasons:'A luz encontra uma Terra inclinada', ReliefProfile:'A paisagem guarda a história da erosão', SoilProfiles:'O solo é um corpo vivo, em camadas', ClimateMap:'Umidade, latitude e relevo se encontram', DomainsMap:'Relevo, solo e vegetação: um conjunto', RockCycle:'Uma rocha pode mudar de origem', TimeZones:'A mesma rotação; horas diferentes', MapScale:'Do terreno ao papel: o que cabe?', DigitalMapping:'O território observado em camadas', MapElements:'Um mapa é uma escolha de linguagem', SurfaceWater:'A água atravessa superfície e subsolo', WorldWaters:'Um rio conecta lugares e decisões', BrazilBasins:'A bacia integra caminhos e usos', BiomesProfile:'A vegetação revela adaptações', WetlandsCoast:'Entre a cheia, a terra e a maré', GlobalCommons:'O benefício privado deixa efeitos coletivos', EnvironmentalPower:'A natureza também entra na negociação', EnvironmentalLaw:'A proteção precisa chegar ao território', EnergyMatrix:'Energia passa por várias conversões', WorldElectricity:'Da fonte à rede: sistemas diferentes', MineralGeography:'Extrair transforma toda a paisagem',
};
function Tree({x,y,s=1,dry=false}:{x:number;y:number;s?:number;dry?:boolean}) {
 return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-3 0 0-42 4 0M0-27-15-39M2-23 19-39" className="gfi-wood"/><path d={dry?'M-18-34Q-24-47-10-51Q-4-60 5-51Q21-52 25-38Q10-30-18-34Z':'M-28-36Q-39-57-20-63Q-21-81-1-75Q17-84 25-65Q48-55 30-36Q10-26-28-36Z'} className={dry?'gfi-leaf-dry':'gfi-leaf'}/><path d="M-23-48q15-12 29-8m-16-8 8 20m5-16 15 10" className="gfi-leaf-vein"/><path d="M-4 0-13 9M4 0 15 8" className="gfi-wood"/></g>;
}
function Mountain({x=0,y=0,s=1}:{x?:number;y?:number;s?:number}) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 124 65 23 82 43 119 0 182 94 219 62 270 124Z" className="gfi-stone"/><path d="M65 23 56 68 80 46 94 64 119 0 145 46 126 38 145 75M119 0 110 69 156 124M219 62 205 105 226 94" className="gfi-contour"/><path d="M22 112 53 92m-17 27 44-23m74 10 25 14m49-15 15 9" className="gfi-hatch-line"/></g>; }
function Cloud({x,y}:{x:number;y:number}) {return <g transform={`translate(${x} ${y})`}><path d="M-43 10Q-58-8-34-16Q-32-38-9-30Q8-47 27-27Q52-30 49-6Q69 10 44 21H-36Z" className="gfi-cloud"/><path d="M-29 10Q-8 0 9 9T40 10" className="gfi-contour"/></g>;}
function House({x,y,s=1}:{x:number;y:number;s?:number}){return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M-23 0V-31H23V0Z" className="gfi-building"/><path d="M-29-31 0-53 29-31Z" className="gfi-roof"/><path d="M-4 0V-22H7V0M-17-23h8v9h-8m22-9h8v9h-8" className="gfi-detail"/><path d="M-25 4H26" className="gfi-contour"/></g>;}
function Note({x,y,to,children}:{x:number;y:number;to:[number,number];children:React.ReactNode}){return <g><text x={x} y={y} className="gfi-note">{children}</text><path d={`M${x+12} ${y+8}Q${x+32} ${(y+to[1])/2} ${to[0]} ${to[1]}`} className="gfi-pointer"/><circle cx={to[0]} cy={to[1]} r="2.5" className="gfi-anchor"/></g>;}
function River({d}:{d:string}){return <><path d={d} className="gfi-river-bank"/><path d={d} className="gfi-river"/></>;}
function Grass({x,y,n=12}:{x:number;y:number;n?:number}){return <g>{Array.from({length:n},(_,i)=><path key={i} d={`M${x+i*11} ${y+i%3*4}l-3-10m3 10 4-13m-4 13-7-5`} className="gfi-grass"/>)}</g>;}
function Dam({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><path d="M-14 0-5-77H17L31 0Z" className="gfi-stone"/><path d="M-4-67 14-67M-7-47H19M-10-25H24M5-70V-8" className="gfi-contour"/><path d="M-26-60H-6M23-8H55" className="gfi-water-line"/><path d="M19-50Q47-30 45-2" className="gfi-flow"/></g>;}
function Wire({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><path d="M-19 0 0-99 19 0M-13-29H13M-9-52H9M-7-79H7M-27-82H27M-22-62H22M-13-29 9-52M13-29-9-52M-9-52 7-79M9-52-7-79" className="gfi-pylon"/></g>;}
function Fish({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`}><path d="M-17 0Q0-14 17 0Q0 13-17 0L-26-10V10Z" className="gfi-fish"/><circle cx="10" cy="-2" r="2" className="gfi-anchor"/><path d="M-2-6 2-13 7-6M-1 6 3 11 7 6" className="gfi-detail"/></g>;}
function Soil({x=25,y=180,w=570}:{x?:number;y?:number;w?:number}){return <g><path d={`M${x} ${y}h${w}v95H${x}Z`} className="gfi-earth"/><path d={`M${x} ${y+28}Q${x+w*.3} ${y+17} ${x+w*.6} ${y+37}T${x+w} ${y+28}M${x} ${y+60}Q${x+w*.3} ${y+48} ${x+w*.6} ${y+68}T${x+w} ${y+60}`} className="gfi-strata"/>{Array.from({length:24},(_,i)=><path key={i} d={`M${x+12+i*23} ${y+41+i%3*15}l7-3 5 6-9 2Z`} className="gfi-soil-grain"/>)}</g>;}

function Drawing({kind,active,id}:{kind:Kind;active:number;id:string}) {
 const t=useSceneMotion();
 const flow=(d:string)=><motion.path d={d} className="gfi-flow" markerEnd={`url(#${id}-arrow)`} initial={false} animate={{pathLength:1,opacity:active%2?1:.75}} transition={t}/>;
 switch(kind){
 case 'EarthSeasons': return <>
  <circle cx="316" cy="152" r="91" className="gfi-globe"/><path d="M275 72 258 106 279 122 291 151 310 157 308 192 328 218 341 184 335 160 355 144 340 120 320 114 313 90Z" className="gfi-continent"/><path d="M358 77 373 97 366 116 394 134 403 117M244 184 260 191 268 217" className="gfi-continent"/>
  <path d="M307 55Q386 140 325 242M252 93Q333 62 384 110M226 154Q312 111 405 157M251 213Q327 174 394 200" className="gfi-globe-grid"/>
  <path d="M276 42 356 261" className="gfi-axis"/><text x="267" y="38" className="gfi-label">N</text><text x="359" y="275" className="gfi-label">S</text>
  {[85,115,145,175,205].map(y=><path key={y} d={`M40 ${y}H222l-9-5m9 5-9 5`} className="gfi-sunbeam"/>)}
  <Note x={31} y={42} to={[236,121]}>raios quase paralelos</Note><Note x={424} y={85} to={[370,92]}>dias mais longos</Note><Note x={419} y={226} to={[346,224]}>menor insolação</Note>
  <text x="35" y="293" className="gfi-caption">Solstício de junho · Norte voltado ao Sol · desenho fora de escala</text>
 </>;
 case 'ReliefProfile': return <>
  <path d="M25 164 72 120 116 130 145 112 182 140 209 193 282 196 318 150 348 136 391 152 431 210 595 214V277H25Z" className="gfi-earth"/>
  <path d="M25 219Q142 235 248 230T426 252H595M25 249Q139 268 261 256T430 275" className="gfi-strata"/>
  <path d="M42 163 88 138 134 147M96 159l35-7m-8 18 39-6M324 174l26-16 48 17" className="gfi-hatch-line"/>
  <River d="M173 150Q197 174 222 193T290 198Q339 204 395 210T584 211"/>
  <Tree x={107} y={132} s={.7}/><Tree x={366} y={145} s={.55}/><Grass x={449} y={211}/>
  {[219,235,252,272].map(x=><path key={x} d={`M${x} 217h15m-15 9h11`} className="gfi-sediment-line"/>)}
  <Note x={30} y={60} to={[139,150]}>desgaste nas áreas altas</Note><Note x={235} y={51} to={[259,192]}>depressão relativa</Note><Note x={414} y={95} to={[503,222]}>deposição na planície</Note>
  {flow('M158 159Q188 210 226 214')}<text x="35" y="298" className="gfi-caption">A classificação depende do processo predominante, não só da altitude.</text>
 </>;
 case 'SoilProfiles': return <>
  {[60,248,436].map((x,i)=><g key={x}><Soil x={x} y={114} w={125}/><path d={`M${x} 114h125v${i===2?17:32}H${x}Z`} className="gfi-humus"/><path d={`M${x+55} 110v52m0-28-22 27m22-12 22 28m-22-11-9 23`} className="gfi-root"/>{i===2?<path d={`M${x} 155h125v120H${x}Z`} className="gfi-bedrock"/>:<path d={`M${x} 244h125v31H${x}Z`} className="gfi-bedrock"/>}<Tree x={x+58} y={111} s={.6} dry={i===2}/></g>)}
  <text x="123" y="38" textAnchor="middle" className="gfi-label">Latossolo</text><text x="311" y="38" textAnchor="middle" className="gfi-label">Solo de basalto</text><text x="499" y="38" textAnchor="middle" className="gfi-label">Semiárido</text>
  {flow('M163 145V236')}<Note x={30} y={298} to={[155,209]}>lavagem pela chuva</Note><Note x={244} y={298} to={[290,252]}>rocha de origem</Note><Note x={433} y={298} to={[470,161]}>pouca profundidade</Note>
 </>;
 case 'ClimateMap': return <>
  <Mountain x={238} y={68} s={1.1}/><path d="M25 205H240V273H25Z" className="gfi-water"/><Soil x={240} y={205} w={355}/><Tree x={188} y={205} s={.7}/><Tree x={452} y={206} s={.6} dry/><Tree x={526} y={205} s={.55} dry/>
  <Cloud x={265} y={62}/>{[233,257,278].map(x=><path key={x} d={`M${x} 91l-9 24`} className="gfi-rain"/>)}{flow('M82 186Q170 157 230 103')}{flow('M359 98Q387 157 469 182')}
  <Note x={28} y={48} to={[135,175]}>ar úmido do oceano</Note><Note x={403} y={57} to={[450,171]}>ar desce e aquece</Note><text x="35" y="300" className="gfi-caption">O relevo modifica a chuva dentro das grandes faixas climáticas.</text>
 </>;
 case 'DomainsMap': return <>
  <Soil y={210}/><path d="M28 210Q101 197 187 211L239 173H355L397 210H595" className="gfi-ground"/>
  {[58,90,125,158].map((x,i)=><Tree key={x} x={x} y={207} s={.85+i%2*.2}/>)}
  <Tree x={270} y={174} s={.75} dry/><Tree x={331} y={174} s={.65} dry/>
  {[448,481,522,562].map((x,i)=><path key={x} d={`M${x} 211v-${35+i%2*20}m0 17h-12v-14m12 5h12v-13`} className="gfi-cactus"/>)}
  <text x="109" y="50" textAnchor="middle" className="gfi-label">Amazônico</text><text x="299" y="50" textAnchor="middle" className="gfi-label">Cerrado</text><text x="500" y="50" textAnchor="middle" className="gfi-label">Caatinga</text>
  <Note x={26} y={298} to={[111,174]}>floresta estratificada</Note><Note x={236} y={298} to={[302,180]}>chapadas e savana</Note><Note x={429} y={298} to={[493,195]}>adaptação à seca</Note>
 </>;
 case 'RockCycle': return <>
  <Mountain x={170} y={38} s={1}/><Soil y={180}/><path d="M268 225Q286 190 312 219T352 242Q328 272 282 257Z" className="gfi-magma"/><path d="M298 236 289 169 289 78M289 109 253 137" className="gfi-lava"/>
  <path d="M402 196Q457 208 572 194M409 213Q476 228 578 212M415 230Q477 246 583 230M414 248Q478 264 580 245" className="gfi-fold"/>
  <River d="M354 165Q396 178 440 181T592 180"/>{flow('M208 141Q176 173 125 207')}{flow('M365 260Q380 235 396 220')}
  <Note x={24} y={43} to={[290,226]}>magma → resfriamento</Note><Note x={392} y={43} to={[528,211]}>sedimentação em camadas</Note><Note x={25} y={299} to={[434,251]}>calor + pressão → metamorfismo</Note>
 </>;
 case 'TimeZones': return <>
  <circle cx="288" cy="153" r="108" className="gfi-globe"/>
  {[-80,-40,0,40,80].map(x=><ellipse key={x} cx="288" cy="153" rx={108-Math.abs(x)} ry="108" className="gfi-globe-grid"/>)}
  {[92,122,153,184,214].map(y=><path key={y} d={`M${288-Math.sqrt(108**2-(y-153)**2)} ${y}Q288 ${y-28} ${288+Math.sqrt(108**2-(y-153)**2)} ${y}`} className="gfi-globe-grid"/>)}
  <path d="M288 45V261" className="gfi-axis"/><path d="M204 83 219 115 248 134 245 184 266 221 281 188 270 149 257 111Z" className="gfi-continent"/>
  {flow('M188 270Q288 307 388 270')}
  <Note x={29} y={51} to={[286,87]}>meridiano de referência</Note><Note x={423} y={98} to={[346,147]}>leste: soma horas</Note><Note x={30} y={233} to={[221,185]}>oeste: subtrai horas</Note>
  <text x="405" y="237" className="gfi-label">15° = 1 hora</text><text x="34" y="310" className="gfi-caption">Fusos teóricos seguem meridianos; os oficiais acomodam fronteiras.</text>
 </>;
 case 'MapScale': return <>
  <Mountain x={35} y={65} s={.9}/><House x={216} y={213} s={.65}/><Tree x={93} y={214} s={.6}/>
  <path d="M340 62 580 88 557 265 317 237Z" className="gfi-map-paper"/>
  {[0,1,2,3,4].map(i=><path key={i} d={`M${352+i*10} ${179+i*5}Q${350+i*7} ${94+i*7} ${461-i*7} ${119+i*8}T${513-i*5} ${213-i*7}Q${400+i*8} ${253-i*12} ${352+i*10} ${179+i*5}Z`} className="gfi-contour"/>)}
  <River d="M488 89Q475 120 501 163T500 251"/><path d="M355 221h84m-84-5v10m42-10v10m42-10v10" className="gfi-scale"/>
  {flow('M251 162Q290 115 329 145')}<Note x={29} y={43} to={[162,137]}>o relevo tem volume</Note><Note x={351} y={40} to={[438,154]}>a curva une igual altitude</Note><text x="35" y="302" className="gfi-caption">Curvas próximas → maior declividade · escala grande → mais detalhe</text>
 </>;
 case 'DigitalMapping': return <>
  <Soil y={221}/><River d="M30 212Q107 159 223 192T393 206Q489 179 593 214"/>
  <Tree x={85} y={199} s={.85}/><Tree x={133} y={185} s={.7}/><House x={339} y={220} s={.8}/><House x={386} y={226} s={.6}/>
  <g transform="translate(248 70) rotate(-20)"><rect x="-19" y="-15" width="38" height="30" className="gfi-metal"/><path d="M-27-25H-81V25H-27ZM27-25H81V25H27Z" className="gfi-solar"/>{[-67,-51,-35,35,51,67].map(x=><path key={x} d={`M${x}-25V25`} className="gfi-panel-grid"/>)}<path d="M-6 16V31m-13 0q19 17 38 0" className="gfi-detail"/></g>
  <path d="M236 100 121 209M262 103 392 220" className="gfi-sensor"/>
  <path d="M454 58 566 71 543 128 431 115ZM454 78 566 91 543 148 431 135ZM454 98 566 111 543 168 431 155Z" className="gfi-map-layer"/>
  <Note x={31} y={46} to={[211,78]}>sensor coleta sinais</Note><Note x={422} y={34} to={[510,112]}>SIG cruza informações</Note><text x="35" y="302" className="gfi-caption">Imagem + posição + interpretação → conhecimento do território</text>
 </>;
 case 'MapElements': return <>
  <path d="M62 43 422 56 439 260 79 249Z" className="gfi-map-paper"/>
  <path d="M80 86Q134 78 195 112T414 99V223Q331 193 255 229T94 223Z" className="gfi-map-land"/>
  <River d="M203 65Q167 105 238 138T292 250"/>
  {[121,148,175,328,356,382].map((x,i)=><Tree key={x} x={x} y={121+i%3*19} s={.38}/>)}
  {[315,338,365].map((x,i)=><House key={x} x={x} y={206+i%2*9} s={.38}/>)}
  <path d="M108 222h85m-85-5v10m42-10v10m43-10v10M388 92V64l-5 9m5-9 5 9" className="gfi-scale"/><text x="110" y="72" className="gfi-label">Uso da terra</text><text x="382" y="58" className="gfi-label">N</text>
  <Note x={460} y={72} to={[344,186]}>símbolos</Note><Note x={459} y={154} to={[253,150]}>seleção</Note><Note x={461} y={234} to={[164,220]}>proporção</Note><text x="35" y="302" className="gfi-caption">Título, legenda, escala, orientação e fonte permitem interpretar a escolha.</text>
 </>;
 case 'SurfaceWater': return <>
  <Mountain x={25} y={58} s={.85}/><Soil y={190}/><path d="M410 190H595V275H410Z" className="gfi-water"/>
  <path d="M25 229Q179 252 346 233L410 243V261Q235 275 25 259Z" className="gfi-aquifer"/>
  <River d="M173 138Q206 175 277 187T433 192"/>
  <Cloud x={130} y={42}/>{flow('M131 76 148 133')}{flow('M238 197V235')}{flow('M252 247Q333 246 399 251')}
  <path d="M331 168v87m-9-87h30v10h-30" className="gfi-well"/>
  <Note x={258} y={44} to={[256,230]}>a infiltração recarrega</Note><Note x={437} y={79} to={[339,229]}>o poço retira água</Note><Note x={29} y={300} to={[138,253]}>poros preenchidos: aquífero</Note>
 </>;
 case 'WorldWaters': return <>
  <path d="M25 176Q110 171 177 184T333 169Q452 158 595 179V275H25Z" className="gfi-sand"/>
  <River d="M295 53Q201 79 277 115T288 177Q217 212 320 275"/>
  {[185,215,345,375].map((x,i)=><Tree key={x} x={x} y={172+i%2*17} s={.58}/>)}
  <Dam x={280} y={145}/><House x={348} y={239} s={.7}/><House x={382} y={247} s={.55}/>
  <path d="M399 150v78m-4-78h8m-8 18h8m-8 18h8m-8 18h8" className="gfi-scale"/>
  {flow('M297 181Q267 207 297 230')}<Note x={30} y={45} to={[253,119]}>controle a montante</Note><Note x={362} y={50} to={[318,219]}>demanda a jusante</Note><text x="35" y="302" className="gfi-caption">Extensão do rio ≠ vazão · água disponível ≠ acesso garantido</text>
 </>;
 case 'BrazilBasins': return <>
  <Mountain x={32} y={62} s={.95}/><Soil y={199}/><River d="M160 124Q205 173 298 199T590 214"/>
  <River d="M347 91Q344 156 384 204"/><River d="M470 138Q459 180 486 211"/>
  <Dam x={364} y={220}/><House x={520} y={208} s={.6}/><Tree x={120} y={196} s={.6}/>
  <path d="M235 77v178" className="gfi-border"/>
  <Note x={25} y={44} to={[155,122]}>divisor topográfico</Note><Note x={276} y={48} to={[375,201]}>afluentes integram a bacia</Note><Note x={375} y={300} to={[364,178]}>queda d'água → geração</Note><text x="31" y="300" className="gfi-caption">A bacia ultrapassa limites administrativos.</text>
 </>;
 case 'BiomesProfile': return <>
  <Soil y={213}/>{[52,86,120,153,185].map((x,i)=><Tree key={x} x={x} y={211} s={i%2?1.55:1.1}/>)}
  <Tree x={277} y={211} s={1.1} dry/><Tree x={350} y={214} s={.8} dry/>
  <path d="M282 214v48m0-19-20 17m20-8 23 15" className="gfi-root"/>
  {[459,506,551].map(x=><path key={x} d={`M${x} 213v-61m0 27h-17v-21m17 10h15v-17`} className="gfi-cactus"/>)}
  <Note x={30} y={39} to={[126,101]}>estratos da floresta</Note><Note x={250} y={46} to={[290,250]}>raízes profundas</Note><Note x={431} y={56} to={[501,158]}>economia de água</Note><text x="35" y="302" className="gfi-caption">Biodiversidade inclui formas, relações e adaptações ao ambiente.</text>
 </>;
 case 'WetlandsCoast': return <>
  <path d="M25 195Q127 167 267 187L396 179 595 219V275H25Z" className="gfi-earth"/>
  <path d="M25 191Q101 182 215 197T391 189L595 194V256H25Z" className="gfi-water"/>
  {[279,344,404].map((x,i)=><g key={x}><Tree x={x} y={177} s={.95-i*.1}/><path d={`M${x} 169q-26 15-34 54m34-54q25 14 31 54m-30-43-16 40m18-43 10 45`} className="gfi-mangrove-root"/></g>)}
  <Grass x={42} y={181} n={15}/><Fish x={306} y={236}/><Fish x={459} y={234}/>
  {flow('M530 178Q486 184 431 192')}<Note x={29} y={52} to={[159,196]}>a cheia amplia habitats</Note><Note x={337} y={46} to={[337,208]}>raízes: abrigo de juvenis</Note><text x="35" y="302" className="gfi-caption">O pulso de inundação e a maré renovam água, nutrientes e conexões.</text>
 </>;
 case 'GlobalCommons': return <>
  <Soil y={207}/><Tree x={83} y={205} s={1.3}/><Tree x={143} y={210} s={.9}/>
  <River d="M217 216Q298 184 384 216T596 232"/>
  <path d="M271 207V145h38v-38h22v55h47v45ZM277 157h23m11 14h22m16 15h20" className="gfi-building"/>
  <path d="M322 101Q283 79 310 60T302 24M334 98Q372 66 345 43T374 15" className="gfi-smoke"/>
  <House x={476} y={212} s={.85}/><Fish x={389} y={239}/>
  {flow('M370 207Q401 213 427 231')}<Note x={28} y={48} to={[121,130]}>serviços ecossistêmicos</Note><Note x={405} y={55} to={[354,62]}>efeitos sem fronteiras</Note><text x="35" y="302" className="gfi-caption">O custo ambiental pode chegar a quem não recebeu o benefício econômico.</text>
 </>;
 case 'EnvironmentalPower': return <>
  <Mountain x={27} y={68} s={.8}/><River d="M178 148Q245 173 304 200T592 228"/><Dam x={303} y={217}/><House x={478} y={227} s={.9}/>
  <path d="M396 42 509 51 504 134 391 125Z" className="gfi-document"/><path d="M410 63h83m-84 17h74m-76 17h56m-57 18h39" className="gfi-document-line"/>
  <Tree x={112} y={228} s={.75}/><path d="M231 43V248" className="gfi-border"/>
  <Note x={29} y={36} to={[300,174]}>soberania a montante</Note><Note x={380} y={162} to={[488,204]}>dependência a jusante</Note><text x="35" y="302" className="gfi-caption">Recursos compartilhados exigem negociação: uso local, consequência regional.</text>
 </>;
 case 'EnvironmentalLaw': return <>
  <Soil y={201}/><River d="M25 215Q163 154 290 207T595 198"/>
  {[61,101,144,382,426,466].map((x,i)=><Tree key={x} x={x} y={190+i%3*11} s={.85}/>)}
  <path d="M201 137v68m-8-68h17m-13 35 23 33" className="gfi-stump"/><House x={269} y={188} s={.7}/>
  <path d="M492 47h89v99h-89Z" className="gfi-document"/><path d="M505 62h64m-64 13h53m-53 14h61m-55 19 13 12 27-31" className="gfi-document-line"/>
  <path d="M30 171Q160 124 294 174T593 163" className="gfi-protected"/>
  <Note x={30} y={37} to={[138,173]}>APP protege a margem</Note><Note x={257} y={38} to={[207,180]}>fiscalizar a supressão</Note><text x="35" y="302" className="gfi-caption">Lei + monitoramento + fiscalização → proteção efetiva, não só no papel</text>
 </>;
 case 'EnergyMatrix': return <>
  <Soil y={223}/><path d="M29 224V131h121v93ZM40 131v-56h25v56m23 0v-70h27v70" className="gfi-building"/>
  <path d="M49 69Q28 43 50 23M99 55Q132 35 112 10" className="gfi-smoke"/>
  <Wire x={250} y={224}/><Wire x={363} y={224}/><path d="M222 142Q281 173 335 142M277 142Q332 167 389 142" className="gfi-wire"/>
  <House x={499} y={224}/><path d="M420 219h48v-27h-48Z" className="gfi-car"/><circle cx="430" cy="222" r="7" className="gfi-metal"/><circle cx="459" cy="222" r="7" className="gfi-metal"/>
  <path d="M474 180 515 188 527 171 486 163Z" className="gfi-solar"/>{flow('M157 192H210')}{flow('M385 195H446')}
  <Note x={29} y={43} to={[113,148]}>fontes primárias</Note><Note x={227} y={53} to={[292,152]}>eletricidade é uma parte</Note><text x="35" y="302" className="gfi-caption">A matriz energética inclui transporte e calor, além da geração elétrica.</text>
 </>;
 case 'WorldElectricity': return <>
  <Soil y={227}/><path d="M40 227Q63 191 55 155H101Q94 191 117 227ZM124 227Q147 191 139 155H185Q178 191 201 227Z" className="gfi-tower"/>
  <path d="M69 145Q51 119 78 92M149 145Q177 119 157 82" className="gfi-steam"/>
  <Wire x={278} y={226}/><Wire x={435} y={227}/><path d="M250 145Q328 177 408 145" className="gfi-wire"/>
  <path d="M525 223V103m0 0-5-45m5 45 44 23m-44-23-38 28" className="gfi-turbine"/>
  <House x={364} y={228} s={.75}/>{flow('M211 204H246')}{flow('M487 204H456')}
  <Note x={30} y={38} to={[77,169]}>geração térmica</Note><Note x={239} y={48} to={[330,153]}>a rede conecta fontes</Note><Note x={447} y={39} to={[525,110]}>geração eólica</Note><text x="35" y="302" className="gfi-caption">Demanda e oferta precisam se equilibrar; fontes têm ritmos diferentes.</text>
 </>;
 case 'MineralGeography': return <>
  <path d="M25 101H250v28H222v28H194v29H165v28H25ZM251 213l42-30h60l20 30H595V277H25V213Z" className="gfi-earth"/>
  <path d="M32 115h205M32 144h177M32 173h148M32 203h119" className="gfi-strata"/>
  <path d="M59 191v-44h38v44m-25-44 18-45 38 11 28 45m-28-45 39 21m-10 17h22v20h-24" className="gfi-excavator"/>
  <path d="M270 189H348V205H258Z" className="gfi-tailings"/><path d="M354 183 374 213H341Z" className="gfi-stone"/>
  <River d="M388 231Q452 189 514 226T595 232"/><Tree x={501} y={218} s={.8}/><Fish x={470} y={244}/>
  {flow('M368 209Q393 224 425 226')}<Note x={25} y={44} to={[126,159]}>lavra em bancadas</Note><Note x={263} y={44} to={[312,192]}>rejeito ≠ minério</Note><Note x={422} y={94} to={[468,227]}>risco chega ao rio</Note><text x="35" y="302" className="gfi-caption">Minério, rejeitos e água formam fluxos distintos, com impactos conectados.</text>
 </>;
 }
}

/** O desenho de campo complementa o mecanismo analítico com seu objeto material.
 * Cada capítulo mantém geometrias e relações próprias; só a tinta é compartilhada. */
export function GeoIllustration({kind,active}:{kind:Kind;active:number}) {
 const id=useId().replace(/:/g,'');
 return <g className={`gfi-plate gfi-${kind}`} transform="translate(0 0)">
  <defs><pattern id={`${id}-grain`} width="27" height="23" patternUnits="userSpaceOnUse"><path d="M3 7h4m13 9h5M7 20h2" className="gfi-paper-grain"/></pattern><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 9 5 0 10Z" className="gfi-arrowhead"/></marker></defs>
  <rect x="8" y="6" width="604" height="379" rx="8" className="gfi-paper"/><rect x="8" y="6" width="604" height="379" rx="8" fill={`url(#${id}-grain)`}/>
  <text x="29" y="37" className="gfi-title">{TITLES[kind]}</text><path d="M29 48Q246 54 578 46" className="gfi-title-stroke"/>
  <g transform="translate(0 62)"><Drawing kind={kind} active={active} id={id}/></g>
 </g>;
}
