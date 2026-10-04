import React, { useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './ExceptionalHumanitiesIllustration.css';

export type ExceptionalHumanitiesKind = 'electricity' | 'migration' | 'trade' | 'fuels' | 'engenho' | 'interiorization' | 'mining' | 'independence';
const land = 'M92 72L178 60 194 94 244 101 295 112 322 132 307 167 282 199 276 230 252 267 210 307 173 281 187 259 159 224 157 188 115 162 58 145 64 119Z';

function House({ x, y, size = 1, grand = false }: { x: number; y: number; size?: number; grand?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${size})`}><path d="M-4 0L30-22 64 0Z" className="ehi-roof"/><path d="M0 0H60V38H0Z" className="ehi-building"/>{[8, 24, 44].map(a => <path key={a} d={`M${a} 8h8v12h-8Z`} className="ehi-window"/>)}<path d="M26 38V25h10v13" className="ehi-line"/>{grand && <><path d="M-4 26H64M5 26V48M21 26V48M39 26V48M55 26V48" className="ehi-line"/><path d="M-8 48H68l8 9H-16Z" className="ehi-building"/></>}</g>;
}
function Person({ x, y, bag = false }: { x: number; y: number; bag?: boolean }) {
  return <g transform={`translate(${x} ${y})`}><circle cy="-13" r="5" className="ehi-person"/><path d="M-6 0q0-10 6-10t6 10M-3 0l-3 13M3 0l5 13M-5-6l-7 7M5-6l7 7" className="ehi-line"/>{bag && <rect x="9" y="-2" width="8" height="8" rx="1" className="ehi-gold"/>}</g>;
}
function Tree({ x, y }: { x: number; y: number }) { return <g transform={`translate(${x} ${y})`}><path d="M0 0V-30" className="ehi-line"/><path d="M-18-20q-10-16 6-23q12-18 22-2q24 6 10 26Z" className="ehi-leaf"/></g>; }
function Note({ x, y, toX, toY, children }: { x: number; y: number; toX: number; toY: number; children: React.ReactNode }) {
  const lines = typeof children === 'string' ? children.split(' ').reduce<string[]>((rows, word) => {
    const last = rows.at(-1) ?? '';
    if (!last || `${last} ${word}`.length > 27) rows.push(word);
    else rows[rows.length - 1] = `${last} ${word}`;
    return rows;
  }, []) : null;
  return <g><path d={`M${x + 18} ${y + 8}Q${x + 12} ${toY - 18} ${toX} ${toY}`} className="ehi-annotation"/><circle cx={toX} cy={toY} r="3" className="ehi-dot"/><text x={x} y={y} className="ehi-note">{lines ? lines.map((line, i) => <tspan key={line} x={x} dy={i ? 28 : 0}>{line}</tspan>) : children}</text></g>;
}
function CargoShip({ x, y }: { x: number; y: number }) { return <g transform={`translate(${x} ${y})`}><path d="M-5 4h115l-18 25H10Z" className="ehi-ship"/><path d="M12 4v-23h22V4M39 4v-23h22V4M65 4v-23h22V4" className="ehi-gold"/><path d="M90 4v-44h17V4M97-44V-57" className="ehi-line"/></g>; }
function Tower({ x, y }: { x: number; y: number }) { return <path d={`M${x-12} ${y}L${x} ${y-88}l12 88M${x-18} ${y-66}h36M${x-14} ${y-43}h28M${x-9} ${y-25}h18M${x-10} ${y-61}l19 31m-16-4 13 23`} className="ehi-line"/>; }

/** Each drawing encodes a different territorial or historical mechanism. */
export function ExceptionalHumanitiesDrawing({ kind, index = 0 }: { kind: ExceptionalHumanitiesKind; index?: number }) {
  const reduced = useReducedMotion();
  const marker = useId().replace(/:/g, '');
  const focus = (i: number) => ({ initial: false as const, animate: { opacity: index === i ? 1 : .68 }, transition: { duration: reduced ? 0 : .32 } });
  const route = (d: string, i: number) => <motion.path d={d} className="ehi-route" markerEnd={`url(#${marker})`} initial={false} animate={{ pathLength: index === i ? 1 : .8, opacity: index === i ? 1 : .45 }} transition={{ duration: reduced ? 0 : .65 }}/>;
  return <g className="ehi-drawing">
    <defs><marker id={marker} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4 0 8Z" fill="var(--vs-burgundy)"/></marker></defs>
    <rect x="6" y="6" width="688" height="408" rx="16" className="ehi-paper"/>
    {kind === 'electricity' && <>
      <path d="M18 225Q140 157 250 205T682 204V328H18Z" className="ehi-terrain"/><path d="M20 241H137V310H20Z" className="ehi-water"/>
      <motion.g {...focus(0)}><path d="M130 230h30l20 80h-50Z" className="ehi-building"/>{[140, 151, 163].map(x=><path key={x} d={`M${x} 247v45`} className="ehi-line"/>)}<path d="M31 258h86m-90 19h87" className="ehi-waterline"/>
      {[225, 279].map((x,k)=><g key={x}><path d={`M${x} 288V${182-k*20}`} className="ehi-line"/><motion.g initial={false} animate={{ rotate: index === 0 ? 45 : 0 }} style={{ transformOrigin: `${x}px ${182-k*20}px` }} transition={{duration:reduced?0:.8}}><path d={`M${x} ${182-k*20}v-44m0 44 38 22m-38-22-38 22`} className="ehi-blade"/></motion.g></g>)}<text x="30" y="344">água · vento · sol</text></motion.g>
      <motion.g {...focus(1)}>{[358, 429].map(x=><Tower key={x} x={x} y={305}/>)}<path d="M162 225Q275 258 358 229Q393 246 429 229Q477 245 530 238" className="ehi-cable"/><rect x="458" y="275" width="45" height="31" className="ehi-building"/><path d="M468 275v-20m14 20v-20m14 20v-20" className="ehi-line"/></motion.g>
      <motion.g {...focus(2)}>{[529, 575, 622].map((x,k)=><g key={x}><rect x={x} y={230-k*16} width="38" height={76+k*16} className="ehi-building"/>{[0,1,2].map(j=><path key={j} d={`M${x+8} ${245-k*16+j*16}h7m9 0h7`} className="ehi-windowline"/>)}</g>)}<path d="M518 365h154m-150 0v-30m0 27q33 0 57-8t39-20q17 6 27 26" className="ehi-route"/><text x="530" y="389">pico de demanda</text></motion.g>
      <text x="28" y="38" className="ehi-heading">Sistema elétrico brasileiro</text><text x="28" y="60">oferta ↔ demanda · o SIN conecta regiões</text>
      <Note x={28} y={113} toX={147} toY={233}>reservatório: chuva e estoque</Note><Note x={355} y={101} toX={397} toY={239}>distância = perdas e limites</Note>
    </>}
    {kind === 'trade' && <>
      <path d="M20 244Q140 220 318 260V350H20Z" className="ehi-terrain"/><path d="M328 279Q475 270 682 282V367H328Z" className="ehi-water"/>{[300,319,338].map(y=><path key={y} d={`M360 ${y}q28-9 56 0t56 0t56 0t56 0t56 0`} className="ehi-waterline"/>)}
      <motion.g {...focus(0)}>{[167,184,201,218].map(y=><path key={y} d={`M30 ${y}l108 25m-108-19 108 25`} className="ehi-crop"/>)}<path d="M145 252v-73a18 18 0 0 1 36 0v73m-36-48h36m-36 21h36" className="ehi-building"/><text x="29" y="300">soja · minério · petróleo</text></motion.g>
      <motion.g {...focus(1)}><path d="M187 268H345" className="ehi-road"/><path d="M208 251h47v18h-47Zm47 4h18l10 14h-28Z" className="ehi-building"/><circle cx="220" cy="273" r="7" className="ehi-person"/><circle cx="268" cy="273" r="7" className="ehi-person"/><path d="M332 276V150h75m-63 0 39 39m20-39v52m-5 0h11" className="ehi-line"/>{[0,1,2].map(i=><rect key={i} x={293+i*21} y="249" width="20" height="19" className="ehi-gold"/>)}</motion.g>
      <motion.g {...focus(2)}><CargoShip x={397} y={278}/><path d="M558 257v-65h24v65m11 0v-94h32v94m14 0v-51h30v51" className="ehi-building"/>{route('M432 217Q512 161 586 195',2)}<text x="510" y="294">parceiros compradores</text></motion.g>
      <text x="28" y="38" className="ehi-heading">O território chega ao porto</text><text x="28" y="62">produção → logística → mercado externo</text><Note x={36} y={109} toX={242} toY={265}>o custo do corredor altera o preço</Note><Note x={392} y={111} toX={594} toY={220}>concentração aumenta vulnerabilidade</Note><text x="28" y="387">Exportar commodities conecta o país às oscilações de preço e de demanda.</text>
    </>}
    {kind === 'fuels' && <>
      <rect x="22" y="76" width="656" height="41" rx="18" className="ehi-water"/><text x="40" y="102">atmosfera · CO₂</text><path d="M20 285H680V358H20Z" className="ehi-terrain"/><path d="M28 322q69-15 144 0v23q-80 12-144 0Z" className="ehi-fossil"/>
      <motion.g {...focus(0)}><path d="M77 284l25-128 25 128m-41-34h33m-24-47h20M99 155v-24" className="ehi-line"/><path d="M152 286v-42h26v42m13 0v-67h25v67m-24-67v-37" className="ehi-building"/>{route('M162 238Q208 153 232 118',0)}<text x="33" y="381">pré-sal · petróleo · diesel</text></motion.g>
      <motion.g {...focus(1)}>{[302,322,342,362].map(x=><path key={x} d={`M${x} 286v-100m0 34q-20-5-23-26m23 43q20-6 23-27`} className="ehi-crop"/>)}<path d="M382 284v-69h52v69m-42-69v-20h14v20m12 0v-37h12v37" className="ehi-building"/>{route('M279 119Q255 177 295 226',1)}{route('M429 216Q439 151 397 119',1)}<text x="294" y="381">cana → etanol · soja → biodiesel</text></motion.g>
      <motion.g {...focus(2)}><path d="M520 280h55v-24h-55Zm55-20h20l16 20h-36Z" className="ehi-building"/><circle cx="533" cy="284" r="7" className="ehi-person"/><circle cx="588" cy="284" r="7" className="ehi-person"/>{route('M587 250Q619 182 580 117',2)}<path d="M526 320l28-22 39 13-13 20Z" className="ehi-roof"/></motion.g>
      <text x="28" y="38" className="ehi-heading">De onde vem o carbono que se queima?</text><text x="28" y="60">carbono recente não zera impactos</text><Note x={30} y={145} toX={98} toY={329}>estoque geológico → ar</Note><Note x={468} y={151} toX={563} toY={278}>cultivo + solo + transporte</Note>
    </>}
    {kind === 'migration' && <>
      <path d="M22 261Q130 214 262 250T675 242V343H22Z" className="ehi-terrain"/><House x={45} y={237}/><House x={125} y={249} size={.8}/><path d="M475 303V177h40v126m13 0V213h39v90m14 0V161h38v142m14 0v-80h39v80" className="ehi-building"/>{[488,541,594,647].map(x=><path key={x} d={`M${x} 234v-40m0 60v20`} className="ehi-windowline"/>)}
      {route('M163 240Q282 111 471 226',1)}{route('M475 319Q326 389 161 299',2)}
      {[236,322,406].map((x,k)=><g key={x}><circle cx={x} cy={179-k%2*14} r="16" className="ehi-paper"/><text x={x} y={185-k%2*14} textAnchor="middle">{k+1}</text></g>)}<motion.g initial={false} animate={{x:index===0?0:index===1?118:252}} transition={{duration:reduced?0:.9}}><Person x={197} y={250} bag/></motion.g>
      <Person x={532} y={308}/><Person x={554} y={306} bag/><Person x={577} y={311}/><text x="30" y="38" className="ehi-heading">Pessoas, redes e territórios</text><text x="30" y="61">estrutura étnica ≠ destino social; migração é processo histórico</text><Note x={35} y={95} toX={83} toY={240}>origem: trabalho, família, terra</Note><Note x={394} y={95} toX={541} toY={249}>destino: acesso desigual à cidade</Note><text x="205" y="221" className="ehi-note">informação · transporte · apoio</text><text x="194" y="393">vínculos com a origem · remessas · retorno · redes de apoio</text>
    </>}
    {kind === 'engenho' && <>
      <path d="M20 274Q200 220 350 278Q450 128 678 152V361H20Z" className="ehi-terrain"/>{[540,578,612,647].map((x,i)=><Tree key={x} x={x} y={167+i%2*24}/>)}<motion.g {...focus(0)}><House x={235} y={157} grand size={1.6}/><House x={217} y={256} size={2.2}/><text x="223" y="128">casa-grande</text><text x="218" y="337">senzala · coerção do trabalho</text></motion.g>
      <motion.g {...focus(1)}><House x={548} y={187} size={.65}/><House x={604} y={198} size={.55}/>{route('M371 276Q443 222 545 210',1)}<Person x={442} y={244}/><Person x={464} y={231}/><text x="526" y="236">quilombo · Palmares</text><text x="526" y="256">c. 1600–1695</text></motion.g>
      <motion.g {...focus(2)}><House x={43} y={244} size={.9}/>{[0,1,2,3].map(i=><path key={i} d={`M32 ${294+i*10}h134`} className="ehi-crop"/>)}<Person x={113} y={280} bag/>{route('M166 286Q191 243 223 245',2)}<text x="28" y="326"><tspan x="28">roças · ofícios</tspan><tspan x="28" dy="24">abastecimento</tspan></text></motion.g>
      <path d="M399 296v-54h59v54" className="ehi-building"/><circle cx="477" cy="279" r="23" className="ehi-line"/><path d="M477 256v46m-23-23h46m-39-16 32 32m0-32-32 32" className="ehi-line"/>{[0,1,2,3,4,5,6].map(i=><path key={i} d={`M${380+i*28} 358v-27m0 12-9-10m9 16 9-10`} className="ehi-crop"/>)}
      <text x="28" y="38" className="ehi-heading">Além do canavial: uma sociedade em tensão</text><text x="28" y="60">hierarquia, resistência e economia interna coexistem</text><Note x={378} y={100} toX={405} toY={250}>engenho: produção e poder</Note><text x="28" y="382"><tspan x="28" dy="0">Escravizados resistem; livres pobres abastecem o engenho. Freyre (1933): leitura</tspan><tspan x="28" dy="19">depois criticada.</tspan></text>
    </>}
    {kind === 'interiorization' && <>
      <path d={land} transform="translate(38 22)" className="ehi-map"/><path d="M264 76V334" className="ehi-boundary"/><text x="36" y="355">contorno simplificado; posições aproximadas</text><path d="M286 223Q291 181 322 165l23 0" className="ehi-waterline"/>
      {[[284,273,'São Paulo'],[308,276,'Rio'],[325,186,'Salvador']].map(([x,y,label])=><g key={label as string}><circle cx={x} cy={y} r="5" className="ehi-dot"/><text x={label === 'São Paulo' ? Number(x)-12 : Number(x)+12} y={Number(y)+8} textAnchor={label === 'São Paulo' ? 'end' : 'start'}>{label}</text></g>)}
      {route('M284 269Q210 234 172 184',0)}{route('M310 270Q306 242 292 233',1)}{route('M336 181Q316 202 294 235',2)}
      <text x="28" y="38" className="ehi-heading">O interior é ocupado por vetores distintos</text><text x="427" y="91" className="ehi-note">não foi um avanço vazio</text><text x="427" y="118"><tspan x="427">Territórios indígenas</tspan><tspan x="427" dy="24">são disputados.</tspan></text>
      <motion.g {...focus(0)}><Person x={468} y={188}/><Person x={492} y={193} bag/><path d="M505 198v-39l21 8-21 7" className="ehi-line"/><text x="421" y="231">bandeiras: apresamento e metais</text></motion.g>
      <motion.g {...focus(1)}><House x={432} y={282} size={.7}/><House x={496} y={272} size={.7}/><text x="418" y="327"><tspan x="418">vilas do ouro · redes</tspan><tspan x="418" dy="24">de abastecimento</tspan></text><text x="418" y="375">capital → Rio, 1763</text></motion.g>
      <motion.g {...focus(2)}><path d="M89 278h35v20H89Zm35 0h12v9h-12M93 298v13m25-13v13m14-30 8-10" className="ehi-building"/><text x="35" y="331">gado · sertão · rio São Francisco</text></motion.g>
      <Note x={34} y={102} toX={261} toY={160}>Tordesilhas (1494)</Note><text x="29" y="392"><tspan x="29" dy="0">Missões, bandeiras, pecuária e mineração articulam ocupação, violência e</tspan><tspan x="29" dy="19">circulação.</tspan></text>
    </>}
    {kind === 'mining' && <>
      <path d="M18 274Q98 164 222 249T451 228T682 248V357H18Z" className="ehi-terrain"/><path d="M20 305Q124 282 237 313T484 312T681 321" className="ehi-river"/><Person x={99} y={276}/><ellipse cx="118" cy="294" rx="25" ry="9" className="ehi-gold"/><path d="M95 294h46" className="ehi-line"/><text x="33" y="346">rio · cascalho aurífero · bateia</text>
      <House x={278} y={213} size={1.7}/><path d="M345 173v-48h20v60" className="ehi-building"/><path d="M303 267v-33h27v33" className="ehi-gold"/><text x="270" y="300">CASA DE FUNDIÇÃO</text>
      <motion.g {...focus(0)}>{[0,1,2,3,4].map(i=><path key={i} d={`M${216+i*35} 92h25l5 15h-35Z`} className={i===4?'ehi-roof':'ehi-gold'}/>)}<text x="218" y="130">quinto = 20% · 1 de cada 5</text>{route('M416 102Q505 72 564 127',0)}</motion.g>
      <motion.g {...focus(1)}>{route('M146 278Q208 236 282 254',1)}{route('M386 252Q448 237 497 266',1)}{[0,1,2].map(i=><g key={i}><path d={`M${476+i*31} 273h22l4 13h-30Z`} className="ehi-gold"/><circle cx={487+i*31} cy="279" r="3" className="ehi-dot"/></g>)}<text x="456" y="305">barras seladas circulam</text><text x="441" y="331">pó sem selo: ilegal</text></motion.g>
      <motion.g {...focus(2)}><rect x="484" y="186" width="151" height="21" className="ehi-building"/><rect x="484" y="186" width="91" height="21" className="ehi-gold"/><text x="484" y="177">cota anual → diferença</text><text x="484" y="231">derrama: cobrada de todos</text></motion.g>
      <path d="M542 134l4-27 15 14 13-23 12 23 16-14 4 27Z" className="ehi-gold"/><text x="549" y="154">Coroa</text><text x="28" y="38" className="ehi-heading">O ouro forma um circuito fiscal e urbano</text><Note x={32} y={160} toX={115} toY={292}>trabalho escravizado na extração</Note><text x="28" y="388"><tspan x="28" dy="0">Extração → fundição → tributo. Fiscalização e redes internas acompanham as vilas</tspan><tspan x="28" dy="19">do ouro.</tspan></text>
    </>}
    {kind === 'independence' && <>
      <path d="M20 285Q176 238 323 271T680 265V354H20Z" className="ehi-terrain"/><motion.g {...focus(0)}><House x={52} y={219} grand size={1.5}/><path d="M231 126h110v105H231Z" className="ehi-building"/><path d="M245 147h82m-82 18h82m-82 18h56m-56 23h69" className="ehi-line"/><text x="239" y="250">Cortes · Fico · ruptura</text>{route('M172 242Q205 275 236 233',0)}</motion.g>
      <motion.g {...focus(1)}><CargoShip x={454} y={264}/><Person x={430} y={260}/><Person x={405} y={270}/><path d="M419 254l14-33m-23 3 26 12" className="ehi-line"/><text x="420" y="317">guerras provinciais</text><text x="420" y="341">Bahia · 2 de julho de 1823</text></motion.g>
      <motion.g {...focus(2)}><path d="M59 335h250m-246-14h250" className="ehi-crop"/><Person x={164} y={302}/><Person x={194} y={306}/><path d="M276 311l4-25 13 11 9-19 9 19 13-11 5 25Z" className="ehi-gold"/></motion.g>
      <text x="28" y="38" className="ehi-heading">Uma ruptura disputada em muitos lugares</text><text x="28" y="60">1821–1823 · política, participação popular e permanências</text><Note x={25} y={116} toX={113} toY={215}>elites apoiam a separação</Note><Note x={391} y={120} toX={470} toY={271}>1822 não encerra as guerras</Note><text x="28" y="390"><tspan x="28" dy="0">Escravidão · terra concentrada · monarquia: estruturas que atravessam a</tspan><tspan x="28" dy="19">independência.</tspan></text>
    </>}
  </g>;
}

export function ExceptionalSceneWindow({ children, label, coordinate = false }: { children: React.ReactNode; label: string; coordinate?: boolean }) {
  const viewport = React.useRef<HTMLDivElement>(null);
  const move = (amount: number) => viewport.current?.scrollBy({ left: amount, behavior: 'auto' });
  return <div className={`ehi-window-wrap${coordinate ? ' ehi-window-wrap--coordinate' : ''}`}>
    <p className="ehi-pan-hint">Deslize a cena para ler os detalhes. Com o foco na figura, use as setas do teclado.</p>
    <div ref={viewport} className="ehi-scroll-window" role="region" aria-label={label} tabIndex={0} data-arrastavel="true" onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 140 : -140); }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); viewport.current?.scrollTo({ left: event.key === 'Home' ? 0 : event.currentTarget.scrollWidth, behavior: 'auto' }); }
    }}>{children}</div>
    <div className="ehi-pan-buttons"><button type="button" aria-label="Percorrer figura para a esquerda" onClick={() => move(-180)}>← Esquerda</button><button type="button" aria-label="Percorrer figura para a direita" onClick={() => move(180)}>Direita →</button></div>
  </div>;
}

export default function ExceptionalHumanitiesIllustration({ kind, index = 0, ariaLabel, chapterId }: { kind: ExceptionalHumanitiesKind; index?: number; ariaLabel: string; chapterId?: string }) {
  return <ExceptionalSceneWindow label={`Percorrer a cena: ${ariaLabel}`}><svg className="vs-plane ehi-illustration" viewBox="0 0 700 420" role="img" aria-label={ariaLabel} data-geography-context={chapterId}><ExceptionalHumanitiesDrawing kind={kind} index={index}/></svg></ExceptionalSceneWindow>;
}
