import React, { useId } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import './GeopoliticalIllustration.css';

type Kind = 'climate'|'structure'|'biome'|'nile'|'readings'|'terror'|'religion'|'europe'|'latin'|'africa'|'asia'|'middle'|'palestine'|'arab';
const TITLES: Record<Kind, [string,string,string]> = {
  climate:['Um clima, muitos fatores','Da costa à montanha: energia e umidade','Latitude orienta; relevo e oceanos modificam.'],
  structure:['O continente tem memória','Andes · bacia amazônica · escudo antigo','Altura do relevo não é idade da rocha.'],
  biome:['A vegetação acompanha o ambiente','Calor, disponibilidade de água e sazonalidade','Latitude não explica tudo: altitude e oceanos também contam.'],
  nile:['Um rio, várias soberanias','Bacia do Nilo · água que atravessa fronteiras','A decisão a montante chega a quem vive a jusante.'],
  readings:['Quem produz esta paisagem?','Natureza transformada por trabalho e poder','O que vemos também guarda relações que não vemos.'],
  terror:['Violência em rede, efeitos no território','Organização · propaganda · financiamento · resposta','Terrorismo não se confunde com religião ou população.'],
  religion:['Crenças em movimento','Origem, difusão, pluralidade e lugares sagrados','Predomínio regional não significa homogeneidade.'],
  europe:['Fronteiras e alianças em disputa','Europa · soberania · integração · segurança','Um continente integrado ainda possui conflitos territoriais.'],
  latin:['O caminho das commodities','América Latina · produção, portos e mercados','Exportar mais nem sempre significa agregar mais valor.'],
  africa:['Recursos, fronteiras e sociedades','África · colonialismo e inserção internacional','O continente é diverso: uma só explicação não basta.'],
  asia:['Da oficina ao laboratório','Ásia · cadeias produtivas e estratégia industrial','A produção se distribui; o controle da cadeia é desigual.'],
  middle:['Água, petróleo e passagens','Oriente Médio · rotas e dependências','Posição estratégica conecta interesses locais e globais.'],
  palestine:['Território, memória e direitos','Palestina e Israel · mapas não encerram a disputa','Distinguir proposta, guerra, ocupação e situação atual.'],
  arab:['Uma onda, trajetórias diferentes','Mundo árabe · protestos desde 2010–2011','Causas comuns não produzem desfechos iguais.'],
};
function Note({x,y,lines}:{x:number;y:number;lines:string[]}) {return <text x={x} y={y} className="gi-hand">{lines.map((l,i)=>
<tspan key={l} x={x} dy={i?24:0}>{l}</tspan>)}</text>;}
function Label({x,y,text}:{x:number;y:number;text:string}) {return <text x={x} y={y} className="gi-label">{text}</text>;}
function Trees({x,y,n=4,dry=false}:{x:number;y:number;n?:number;dry?:boolean}) {return <g transform={`translate(${x} ${y})`}>{Array.from({length:n},(_,i)=>
<g key={i} transform={`translate(${i*23} ${i%2*5})`}>
<path d="M0 0v-38" className="gi-wood"/>
<path d={dry?'M-18-28Q0-43 18-28Z':'M-15-26Q-25-41-8-45Q0-65 12-45Q32-35 15-23Z'} className="gi-leaf"/>
<path d="M-8-31 0-23 10-34" className="gi-fine"/>
</g>)}</g>;}
function Town({x,y,n=4}:{x:number;y:number;n?:number}) {return <g transform={`translate(${x} ${y})`}>{Array.from({length:n},(_,i)=>
<g key={i} transform={`translate(${i*25} ${i%2*-8})`}>
<path d="M-9 0v-25h18V0Z" className="gi-stone"/>
<path d="M-12-25 0-34 12-25Z" className="gi-roof"/>
<path d="M-5-18h3m4 0h3m-10 7h3m4 0h3M-3 0v-7h6v7" className="gi-fine"/>
</g>)}</g>;}
function Factory({x,y}:{x:number;y:number}) {return <g transform={`translate(${x} ${y})`}>
<path d="M-45 0v-37l25 12v-12l25 12v-12l27 12v25Z" className="gi-stone"/>
<path d="M20-25v-56h10v56M-36-15h60m-60 7h60" className="gi-fine"/>
<path d="M24-89q-18-14 0-21t24-16" className="gi-smoke"/>
</g>;}
function Ship({x,y}:{x:number;y:number}) {return <g transform={`translate(${x} ${y})`}>
<path d="M-38 0h76L25 18h-50Z" className="gi-roof"/>
<path d="M-22-17h16v17h-16m20-17h16v17H-2m20-17h13v17H18M-21-17v-12h17v12" className="gi-stone"/>
<path d="M-46 27q12-6 24 0t24 0t24 0" className="gi-water-line"/>
</g>;}
function Mountain({x,y,w=170}:{x:number;y:number;w?:number}) {return <g transform={`translate(${x} ${y}) scale(${w/170})`}>
<path d="M-85 0-25-100 0-63 28-123 85 0Z" className="gi-mountain"/>
<path d="M-25-100-41-73-25-79-13-70M28-123 9-87 27-95 47-86" className="gi-snow"/>
<path d="M-58-20-25-76-10-55M7-35 28-92 58-28" className="gi-fine"/>
</g>;}
function People({x,y,n=5}:{x:number;y:number;n?:number}) {return <g transform={`translate(${x} ${y})`}>{Array.from({length:n},(_,i)=>
<g key={i} transform={`translate(${i*20} ${i%2*4})`}>
<circle cy="-22" r="5" className="gi-person"/>
<path d="M-6-14h12l3 17h-18ZM-3 3v12m6-12v12M-6-9-13-4M6-9l10-7" className="gi-person"/>
</g>)}</g>;}
function Route({d,id,hot=false}:{d:string;id:string;hot?:boolean}) {const t=useSceneMotion();return <motion.path d={d} className={hot?'gi-route gi-route-hot':'gi-route'} markerEnd={`url(#${id}-arrow)`} initial={false} animate={{pathLength:1}} transition={t}/>;}
const AFRICA='M220 130L281 96L345 102L374 132L419 152L448 185L413 229L398 290L360 337L325 363L296 322L279 270L235 245L203 199Z';
const SOUTH='M263 110L304 127L354 162L392 180L375 221L342 263L325 319L303 367L284 337L275 282L251 231L237 172Z';
const EUROPE='M168 224L187 206L204 177L230 168L244 146L260 148L258 122L278 102L290 132L312 89L329 109L320 146L345 160L375 153L411 170L430 194L469 198L501 228L460 247L419 233L391 244L362 234L340 261L321 239L301 246L270 232L249 215L230 233L201 243Z';
const ASIA='M108 120L169 91L267 111L333 84L393 112L465 106L531 128L558 173L518 195L507 228L482 238L455 213L422 240L447 268L479 280L493 310L464 318L423 280L400 260L373 285L349 326L324 295L302 227L267 204L216 185L174 166L129 164Z';
function Graticule(){return <g className="gi-grid">{[140,190,240,290,340].map(y=>
<path key={y} d={`M135 ${y}H580`}/>)}{[180,240,300,360,420,480,540].map(x=>
<path key={x} d={`M${x} 100V367`}/>)}</g>;}
function ClimateArt({id}:{id:string}) {return <>
<path d="M37 312H212L318 224L366 139L414 235L473 299H741V364H37Z" className="gi-land"/>
<path d="M37 312H192V364H37Z" className="gi-sea"/>
<Mountain x={365} y={299}/>
<Trees x={207} y={306}/>
<Town x={552} y={301}/>
<circle cx="109" cy="168" r="31" className="gi-sun"/>
<path d="M218 191q-28-21-9-39q14-17 34-5q12-19 31-7q29-1 34 24q26 20-2 29Z" className="gi-cloud"/>{[235,258,281].map(x=>
<path key={x} d={`M${x} 205l-12 24`} className="gi-water-line"/>)}<Route d="M92 299Q166 266 228 250Q277 227 318 167" id={id}/>
<Route d="M407 196Q451 251 522 264" id={id} hot/>
<Note x={43} y={102} lines={['o mar fornece umidade']}/>
<Note x={478} y={126} lines={['o ar desce, aquece','e fica mais seco']}/>
<Label x={212} y={348} text="barlavento"/>
<Label x={486} y={348} text="sotavento"/>
<path d="M88 113 102 131M546 162 509 236" className="gi-pointer"/>
</>;}
function StructureArt({id}:{id:string}) {return <>
<path d="M38 281H166L225 171L276 282L414 294L575 268L742 276V387H38Z" className="gi-earth"/>
<path d="M42 285H174L381 388H319L157 316H42Z" className="gi-slab"/>
<Mountain x={224} y={282} w={125}/>
<path d="M286 287Q369 366 484 292" className="gi-basin"/>{[0,1,2,3].map(i=>
<path key={i} d={`M${310+i*8} ${302+i*12}Q390 ${337+i*8} ${461-i*8} ${304+i*12}`} className="gi-stratum"/>)}<path d="M513 302l18 9 19-12 22 17 17-11 21 8 21-10m-128 34 17 12 23-9 17 8 25-6 22 11" className="gi-fine"/>
<Trees x={345} y={285}/>
<Route d="M88 337 180 365" id={id} hot/>
<Route d="M214 347V228" id={id} hot/>
<Note x={39} y={110} lines={['Nazca subducta','sob o continente']}/>
<Note x={460} y={109} lines={['escudos antigos:','longa erosão, não juventude']}/>
<Label x={319} y={238} text="sedimentos se acumulam"/>
<Label x={49} y={412} text="Pacífico → Andes → bacia → cráton"/>
</>;}
function BiomeArt({id}:{id:string}) {return <>
<path d="M37 310Q195 299 370 316T743 310V368H37Z" className="gi-land"/>
<Trees x={67} y={310} n={5}/>
<Trees x={202} y={311} n={2} dry/>
<path d="M273 316q23-36 52-7t41 8" className="gi-earth"/>
<Trees x={397} y={312} n={3}/>{[493,519,545].map(x=>
<path key={x} d={`M${x-16} 310l16-66 16 66ZM${x} 310v12`} className="gi-leaf"/>)}<path d="M603 311q11-8 21 0t21 0t21 0" className="gi-leaf"/>
<path d="M656 343h60" className="gi-snow"/>
<Route d="M101 235V151H314V256" id={id}/>
<Route d="M296 275H149" id={id}/>
<Note x={51} y={103} lines={['equador: ar sobe e chove']}/>
<Note x={396} y={135} lines={['em direção aos polos,','a temperatura diminui']}/>{['tropical','savana','deserto','temperada','taiga','tundra'].map((s,i)=>
<text key={s} x={58+i*112} y="394" className="gi-small">{s}</text>)}<Label x={267} y={223} text="30°: ar seco desce"/>
</>;}
function NileArt({id}:{id:string}) {return <>
<path d="M281 103L472 108L509 357L386 394L251 322Z" className="gi-earth"/>
<path d="M368 344Q361 278 387 238T383 123M452 310Q442 259 387 238" className="gi-river"/>
<path d="M383 123 363 102M383 123l21-19" className="gi-river"/>
<path d="M276 180H486M261 264H499" className="gi-border"/>
<path d="M408 278l43-12 8 18-45 14Z" className="gi-stone"/>
<path d="M425 273v18m11-21v18m11-21v18" className="gi-fine"/>
<Town x={352} y={155} n={2}/>
<path d="M342 157l-19 10 16 10 17-11Z" className="gi-leaf"/>
<Mountain x={470} y={335} w={72}/>
<Route d="M371 314Q376 259 394 219T384 152" id={id}/>
<Note x={43} y={126} lines={['Egito: agricultura','e cidades no vale']}/>
<Note x={517} y={267} lines={['Etiópia: barragem','no Nilo Azul']}/>
<Label x={420} y={157} text="Egito"/>
<Label x={425} y={225} text="Sudão"/>
<Label x={401} y={363} text="Etiópia"/>
<Note x={43} y={329} lines={['montante → jusante','água compartilhada']}/>
<path d="M231 152 344 152M507 280 461 279" className="gi-pointer"/>
</>;}
function ReadingsArt({id}:{id:string}) {return <>
<path d="M32 304Q156 246 295 300T745 296V393H32Z" className="gi-land"/>
<Mountain x={164} y={299}/>
<Trees x={91} y={309}/>
<Factory x={550} y={302}/>
<Town x={320} y={305}/>
<path d="M39 367Q249 313 420 353T740 349" className="gi-river"/>
<path d="M299 331 352 321 421 336 370 351ZM309 351l53-13 60 12-51 14Z" className="gi-field"/>
<People x={412} y={297}/>
<Route d="M413 264Q441 215 489 235" id={id}/>
<Note x={40} y={104} lines={['natureza: condição,','não destino social']}/>
<Note x={440} y={107} lines={['trabalho transforma','o espaço geográfico']}/>
<Label x={72} y={411} text="paisagem: formas visíveis"/>
<Label x={390} y={411} text="território: apropriação e poder"/>
<path d="M174 137 165 191M554 147v35" className="gi-pointer"/>
</>;}
function TerrorArt({id}:{id:string}) {return <>
<Town x={93} y={312} n={8}/>
<Town x={483} y={309} n={6}/>
<People x={185} y={346}/>
<path d="M281 217h126v77H281Zm-12 87h149" className="gi-stone"/>
<path d="M295 232h98v42h-98Z" className="gi-screen"/>
<path d="M308 254h14m8 0h14m8 0h14m8 0h8" className="gi-fine"/>
<Route d="M199 260Q193 174 307 201" id={id}/>
<Route d="M402 201Q498 162 543 254" id={id}/>
<Route d="M318 319Q256 371 230 349" id={id} hot/>
<path d="M449 310v-40h18v40m-18-37 9-13 9 13" className="gi-stone"/>
<Note x={43} y={109} lines={['células dispersas:','a rede atravessa países']}/>
<Note x={448} y={109} lines={['propaganda recruta;','não representa os povos']}/>
<Label x={72} y={405} text="vítimas civis · deslocamentos · medo"/>
<Label x={433} y={405} text="segurança × liberdades"/>
</>;}
function ReligionArt({id}:{id:string}) {return <>
<path d="M43 309h692v66H43Z" className="gi-land"/>
<path d="M214 307v-84q36-43 72 0v84Z" className="gi-stone"/>
<path d="M230 307v-51q20-23 40 0v51" className="gi-fine"/>
<path d="M245 193v-26m-11 12h22" className="gi-ink"/>
<path d="M340 307v-61h101v61M340 246q50-84 101 0" className="gi-gold"/>
<path d="M466 307V182h12v125M461 182l11-17 11 17" className="gi-stone"/>
<path d="M536 308v-77h77v77M532 231l43-28 43 28M542 241h65m-65 19h65" className="gi-stone"/>
<People x={290} y={346}/>
<Route d="M391 156Q264 93 137 171" id={id}/>
<Route d="M430 165Q553 99 683 175" id={id}/>
<Note x={46} y={113} lines={['origem no Oriente Médio','difusão histórica']}/>
<Note x={487} y={113} lines={['migrações, missões,','comércio e conquistas']}/>
<Label x={192} y={405} text="Jerusalém: lugar sagrado para três tradições"/>
<Label x={266} y={187} text="cristianismo · judaísmo · islamismo"/>
</>;}
function EuropeArt({id}:{id:string}) {return <>
<Graticule/>
<path d={EUROPE} className="gi-land"/>
<path d="M303 148 319 175 347 186 375 214M391 171 385 222M253 185l23 28" className="gi-border"/>
<path d="M399 201 419 185 449 194 462 221 419 233Z" className="gi-conflict"/>
<path d="M308 141 313 99 330 89 352 132" className="gi-blue-region"/>
<Town x={281} y={200} n={2}/>
<Route d="M200 204Q213 305 334 285" id={id}/>
<Route d="M486 180Q458 136 420 193" id={id} hot/>
<Note x={40} y={109} lines={['Finlândia · 2023','Suécia · 2024: Otan']}/>
<Note x={497} y={122} lines={['guerra desde 2014','invasão russa em larga','escala desde 2022']}/>
<Label x={158} y={272} text="Atlântico"/>
<Label x={386} y={266} text="Ucrânia"/>
<Label x={262} y={335} text="integração ≠ ausência de tensões"/>
<path d="M221 142 309 119M507 172 448 208" className="gi-pointer"/>
</>;}
function LatinArt({id}:{id:string}) {return <>
<Graticule/>
<path d={SOUTH} className="gi-land"/>
<path d="M253 169 265 214 281 266 295 320" className="gi-mountain-line"/>
<path d="M301 170 336 207 329 241M281 266l59 3M304 299l30 2" className="gi-border"/>
<Trees x={293} y={211} n={3}/>
<path d="M310 264l32-16 21 11-31 18Zm4 10 30-14 20 11-31 18Z" className="gi-field"/>
<Ship x={431} y={254}/>
<Route d="M351 233Q416 197 461 223Q566 230 608 153" id={id}/>
<Route d="M263 261Q161 303 92 199" id={id}/>
<Note x={44} y={109} lines={['Andes: minérios','cobre · prata']}/>
<Note x={486} y={322} lines={['China: demanda por','minério, petróleo e soja']}/>
<Label x={460} y={172} text="mercados externos"/>
<Label x={183} y={404} text="produção → corredor logístico → porto"/>
<path d="M184 146 259 211M504 284 447 275" className="gi-pointer"/>
</>;}
function AfricaArt({id}:{id:string}) {return <>
<Graticule/>
<path d={AFRICA} className="gi-land"/>
<path d="M235 146h150M258 146v72h106v-72M279 270l76-25 43 45M325 220v101M235 218l72 25" className="gi-border"/>
<Trees x={299} y={254} n={3}/>
<path d="M254 157q31-26 63-7t68 4" className="gi-earth"/>
<path d="M341 284l-17 16 12 9 18-16Z" className="gi-ore"/>
<Town x={278} y={325} n={3}/>
<Ship x={470} y={306}/>
<Route d="M351 293Q406 265 450 280Q519 239 567 166" id={id}/>
<Note x={42} y={104} lines={['Saara: descontinuidade','de povoamento']}/>
<Note x={483} y={115} lines={['fronteiras coloniais','cortam redes sociais']}/>
<Label x={455} y={356} text="exportação de recursos"/>
<Label x={251} y={409} text="RDC: cobalto · cadeias globais"/>
<path d="M211 147 258 172M497 160 379 217" className="gi-pointer"/>
</>;}
function AsiaArt({id}:{id:string}) {return <>
<Graticule/>
<path d={ASIA} className="gi-land"/>
<path d="M322 164 377 159 417 173 458 169M324 200 358 216 377 254M465 170l-19 42" className="gi-border"/>
<Mountain x={333} y={208} w={90}/>
<Factory x={455} y={208}/>
<path d="M557 143l9 13-7 16-9 8 3-18ZM546 184l7-5 5 7-9 8Z" className="gi-land"/>
<Town x={547} y={164} n={1}/>
<Label x={574} y={203} text="Japão"/>
<Ship x={534} y={282}/>
<Route d="M447 240Q492 263 516 267" id={id}/>
<Route d="M450 240Q437 285 459 310" id={id} hot/>
<Note x={42} y={92} lines={['China: reforma e','abertura desde 1978']}/>
<Note x={455} y={91} lines={['Japão · Coreia do Sul','tecnologia e indústria']}/>
<Label x={282} y={340} text="Índia"/>
<Label x={264} y={401} text="China plus one: diversificar a produção"/>
<path d="M226 131 392 183M552 139l-27 17" className="gi-pointer"/>
</>;}
function MiddleArt({id}:{id:string}) {return <>
<path d="M139 115H590V354H139Z" className="gi-earth"/>
<path d="M139 115h106l-40 53-42 54-24 1ZM235 227l27 9 49 91-28 25-17-75ZM450 246l51 28 44-26 28 31-23 42-50-26Z" className="gi-sea"/>
<path d="M286 128 310 192 347 240M320 128l20 62 34 48" className="gi-river"/>
<path d="M263 176 341 168 384 194 408 249M311 271 366 300 441 288" className="gi-border"/>{[411,445,478].map(x=>
<path key={x} d={`M${x-10} 265l10-40 10 40M${x-6} 248h12M${x-8} 256h16M${x} 225v-13`} className="gi-ink"/>)}<Ship x={577} y={316}/>
<Route d="M488 285Q526 289 548 305Q608 343 645 278" id={id}/>
<Note x={36} y={90} lines={['Suez liga Mediterrâneo','e Mar Vermelho']}/>
<Note x={456} y={92} lines={['cabeceiras turcas:','Tigre e Eufrates']}/>
<Label x={457} y={375} text="Ormuz: estreito estratégico"/>
<Label x={292} y={326} text="Arábia"/>
<Label x={419} y={197} text="Irã"/>
<path d="M198 139 245 239M541 145 319 133" className="gi-pointer"/>
</>;}
function PalestineArt({id}:{id:string}) {return <>
<path d="M231 95H489V387H231Z" className="gi-land"/>
<path d="M231 95h63l-11 78-19 86-15 128h-18Z" className="gi-sea"/>
<path d="M354 135q16 43 7 90t5 87" className="gi-river"/>
<path d="M302 163l47-9 14 32-17 81-38-10Z" className="gi-occupied"/>
<path d="M273 300l15 7-9 34-14-8Z" className="gi-conflict"/>
<Town x={337} y={249} n={2}/>
<path d="M329 248v-32h20v32m-23-32q13-29 26 0" className="gi-gold"/>
<Route d="M294 327Q305 291 316 270" id={id} hot/>
<Note x={40} y={106} lines={['Mediterrâneo','Gaza: faixa costeira']}/>
<Note x={479} y={118} lines={['Cisjordânia','ocupada desde 1967']}/>
<Label x={385} y={221} text="Jordânia"/>
<Label x={354} y={284} text="Jerusalém"/>
<Label x={293} y={367} text="Israel"/>
<Label x={196} y={352} text="Gaza"/>
<Label x={34} y={394} text="1917 · Balfour → 1922 · mandato britânico"/>
<Label x={34} y={419} text="1947 · proposta de partilha → 1948 e 1967 · guerras"/>
<path d="M176 154 269 315M482 161 351 185" className="gi-pointer"/>
</>;}
function ArabArt({id}:{id:string}) {return <>
<path d="M59 211 221 142 324 163 395 146 502 174 560 219 649 314 509 341 402 293 319 272 198 278 90 270Z" className="gi-earth"/>
<path d="M60 180 215 122 325 142 392 128 393 159 322 183 219 165 71 227Z" className="gi-sea"/>
<path d="M374 236l24 8 44 72-25 13Z" className="gi-sea"/>
<path d="M185 173v101M307 187v85M462 214l54 70M500 174l-39 53" className="gi-border"/>
<People x={169} y={232} n={4}/>
<People x={316} y={244} n={4}/>
<Town x={457} y={196} n={2}/>
<Route d="M204 196Q259 123 331 211" id={id}/>
<Route d="M354 220Q420 148 458 164" id={id}/>
<Route d="M469 216Q543 234 570 289" id={id} hot/>
<Note x={42} y={96} lines={['Tunísia: início','dos protestos em 2010']}/>
<Note x={454} y={97} lines={['Síria: guerra civil','e intervenção externa']}/>
<Label x={323} y={284} text="Egito"/>
<Label x={544} y={354} text="Iêmen"/>
<Label x={129} y={403} text="autoritarismo + desigualdade + desemprego"/>
<path d="M183 140 184 188M541 143 475 181" className="gi-pointer"/>
</>;}
const ARTS:Record<Kind,React.ComponentType<{id:string}>>={climate:ClimateArt,structure:StructureArt,biome:BiomeArt,nile:NileArt,readings:ReadingsArt,terror:TerrorArt,religion:ReligionArt,europe:EuropeArt,latin:LatinArt,africa:AfricaArt,asia:AsiaArt,middle:MiddleArt,palestine:PalestineArt,arab:ArabArt};

// O detalhe analítico permanece como segunda escala de leitura: a paisagem
// central situa os mecanismos; abaixo, cada recorte preserva sua evidência.
export function GeopoliticalPlate({kind,active,detail}:{kind:Kind;active:number;detail:React.ReactElement<React.SVGProps<SVGSVGElement>>}) {
  const id=useId().replace(/:/g,''); const t=useSceneMotion(); const Art=ARTS[kind]; const [title,sub,note]=TITLES[kind];
  const detailViewBox=detail.props.viewBox ?? '0 0 620 360';
  const dimensions=detailViewBox.trim().split(/[ ,]+/).map(Number);
  const detailHeight=746 * dimensions[3] / dimensions[2];
  const plateHeight=558 + detailHeight + 39;
  return <svg viewBox={`0 0 780 ${plateHeight}`} className={`gi-plate gi-${kind}`} role="img" aria-label={detail.props['aria-label']}>
    <defs>
<pattern id={`${id}-grain`} width="31" height="31" patternUnits="userSpaceOnUse">
<path d="M3 9h8m9 15h6M6 27h2" className="gi-grain"/>
</pattern>
<marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
<path d="M0 0 9 5 0 10Z" className="gi-tip"/>
</marker>
</defs>
    <rect x="5" y="5" width="770" height={plateHeight-10} rx="8" className="gi-paper"/>
<rect x="5" y="5" width="770" height={plateHeight-10} fill={`url(#${id}-grain)`}/>
    <text x="31" y="49" className="gi-title">{title}</text>
<path d="M31 66Q362 75 742 63" className="gi-underline"/>
<text x="33" y="95" className="gi-small">{sub}</text>
    <motion.g transform="translate(0 42)" initial={false} animate={{opacity:1}} transition={t}>
<Art id={id}/>
</motion.g>
    <text x="32" y="491" className="gi-hand gi-thesis">{note}</text>
<path d="M31 512H746" className="gi-divider"/>
    <text x="32" y="541" className="gi-section">Relações em detalhe</text>
<text x="585" y="541" className="gi-small">recorte {active+1} em foco</text>
    <svg className="gi-analytical" x="17" y="558" width="746" height={detailHeight} style={{width:746,height:detailHeight}} viewBox={detailViewBox} aria-hidden="true">{detail.props.children}</svg>
    <text x="32" y={558+detailHeight+18} className="gi-foot">Cena autoral · contornos e posições simplificados · sem escala cartográfica</text>
  </svg>;
}
