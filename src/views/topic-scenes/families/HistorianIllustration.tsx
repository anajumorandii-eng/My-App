import React, { useId } from 'react';
import './HistorianIllustration.css';

type Props = { kind: string; active: number };

function Figure({ x, y, dress = 'ordinary', s = 1 }: { x: number; y: number; dress?: string; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy="65" rx="20" ry="4" className="hi-shadow" />
    <path d="M-8 43-10 63M8 43 10 63M-10 63h-5M10 63h5" className="hi-ink" />
    <path d="M-17 44-13 8Q0 0 13 8L17 44Z" className={`hi-cloth hi-cloth-${dress}`} />
    <path d="M-12 13-22 31M12 13 23 30M-8 8 0 27 8 8M0 27v16" className="hi-ink" />
    <circle cy="-6" r="10" className="hi-skin" />
    <path d="M-10-8Q-10-21 0-21T10-8M-3 0h6" className="hi-hair" />
    {dress === 'ancient' && <path d="M-13 8 11 40M-7 7 5 43" className="hi-fold" />}
    {dress === 'royal' && <><path d="M-12-18-10-26-4-21 0-29 4-21 10-26 12-18Z" className="hi-gold" /><path d="M-12 8-21 45M12 8 21 45" className="hi-fold" /></>}
    {dress === 'clergy' && <><path d="M-10-18 0-34 10-18Z" className="hi-gold" /><path d="M0 12v18m-5-12h10M24-5v63" className="hi-ink" /></>}
    {dress === 'worker' && <><path d="M-12-15Q0-29 12-15ZM-16-14h32" className="hi-earth" /><path d="M-9 13H9V42H-9Z" className="hi-paper" /></>}
    {dress === 'soldier' && <><path d="M-12-12Q-10-28 9-19L12-12Z" className="hi-green" /><path d="M-14 10 13 37M23 5 18 60" className="hi-ink" /></>}
    {dress === 'merchant' && <><path d="M-11-15v-12h22v12m-26 0h30" className="hi-earth" /><rect x="20" y="24" width="20" height="24" className="hi-paper" /><path d="M24 30h12m-12 6h9" className="hi-fine" /></>}
  </g>;
}

function Building({ x, y, style = 'house', s = 1 }: { x: number; y: number; style?: string; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy="85" rx="80" ry="7" className="hi-shadow" />
    {style === 'temple' ? <>
      <path d="M-75 2 0-36 75 2ZM-77 2H77V12H-77ZM-82 78H82V85H-82Z" className="hi-stone" />
      <path d="M-54-1 0-27 54-1Z" className="hi-earth" />
      {[-60,-35,-10,15,40,65].map(a=><g key={a}><rect x={a-5} y="12" width="10" height="66" className="hi-stone" /><path d={`M${a-8} 15h16M${a-8} 75h16M${a-2} 18v54M${a+2} 18v54`} className="hi-fine" /></g>)}
    </> : style === 'castle' ? <>
      <path d="M-70 80V-5h12v10h12V-5h12v85M34 80V-5h12v10h12V-5h12v85M-34 80V23H34V80Z" className="hi-stone" />
      <path d="M-15 80V53Q0 30 15 53V80Z" className="hi-dark" /><path d="M-52 24v13M52 24v13M-52 56v13M52 56v13" className="hi-ink" />
      {[20,40,60].map(a=><path key={a} d={`M-68 ${a}h33M35 ${a}h33M-32 ${a+12}h64`} className="hi-fine" />)}
    </> : style === 'factory' ? <>
      <path d="M-75 80V20L-30-5V20L15-5V20L60-5V80Z" className="hi-earth" /><path d="M52 80V-55H67V80Z" className="hi-stone" />
      {[-60,-25,10,45].map(a=><g key={a}><rect x={a} y="36" width="19" height="25" className="hi-window" /><path d={`M${a+9} 36v25M${a} 49h19`} className="hi-fine" /></g>)}
      <path d="M60-60Q26-63 35-81Q4-72-7-94" className="hi-smoke" />
    </> : style === 'church' ? <>
      <path d="M-50 80V15L0-12 50 15V80ZM-65 80V-25H-35V80Z" className="hi-stone" /><path d="M-69-25-50-58-31-25Z" className="hi-earth" />
      <path d="M-50-63v-15m-7 5h14M-10 80V45Q0 26 10 45V80" className="hi-ink" /><circle cy="13" r="12" className="hi-window" /><path d="M-12 13h24M0 1v24" className="hi-fine" />
    </> : <>
      <path d="M-65 80V5H65V80Z" className="hi-stone" /><path d="M-74 5 0-32 74 5Z" className="hi-earth" />
      {[-45,-12,21].map(a=><g key={a}><rect x={a} y="20" width="20" height="25" className="hi-window" /><path d={`M${a+10} 20v25M${a} 32h20`} className="hi-fine" /></g>)}
      <path d="M-10 80V55H10V80M-62 60h37M25 60h37" className="hi-ink" />
    </>}
  </g>;
}

function Document({ x, y, title, lines = 4, s = 1 }: { x: number; y: number; title: string; lines?: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(-4) scale(${s})`}>
    <path d="M0 0H110L115 104Q60 99 0 108Z" className="hi-paper" /><path d="M6 7H104" className="hi-fine" />
    <text x="55" y="26" textAnchor="middle" className="hi-doc-title" style={{ fontSize: `${16 / s}px` }}>{title}</text>
    {Array.from({length:lines},(_,i)=><path key={i} d={`M14 ${40+i*12}h${i%2?73:83}`} className="hi-fine" />)}
    <circle cx="85" cy="89" r="8" className="hi-seal" /><path d="M81 96 78 111 86 107 91 111 90 95" className="hi-seal" />
  </g>;
}

function Ship({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-70 17H70L50 43H-43Z" className="hi-earth" /><path d="M-51 27H56M-32 37h71M0 17V-85M-39 17V-64M35 17V-52" className="hi-ink" />
    <path d="M-5-79Q-50-59-5-38ZM7-78Q52-64 7-40ZM-43-59Q-70-43-43-23ZM39-48Q63-37 39-18Z" className="hi-paper" />
    <path d="M0-85h24l-7 8H0M-76 51q19-9 38 0t38 0t38 0t38 0" className="hi-water" />
    {[-32,-10,12,34].map(a=><circle key={a} cx={a} cy="29" r="2.5" className="hi-dark" />)}
  </g>;
}

function Press({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}>
    <path d="M-44 75V-70H44V75M-54-70H54M-54 75H54M-44-26H44M0-70v63M-19-7H19V3H-19ZM-50 28H55" className="hi-wood" />
    <path d="M-33 18H36V28H-33Z" className="hi-paper" /><path d="M-24 21h50M-23 24h34M-15-42H20" className="hi-fine" />
    <path d="M45 29 67 45 57 58 38 43Z" className="hi-paper" />
  </g>;
}

function Globe({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${s})`}><circle r="79" className="hi-sea" /><ellipse rx="38" ry="79" className="hi-water" /><path d="M-79 0H79M-66-42H66M-66 42H66" className="hi-water" />
    <path d="M-57-42-34-57-12-45-22-21-42-17-51 5-63-10ZM-35 11-12 13-2 28-20 66-31 48ZM7-43 28-59 60-30 42-9 24-18 16 10-3-8ZM4 2 29 4 38 23 19 53 9 35ZM43 39 60 34 68 49 51 57Z" className="hi-land" />
  </g>;
}

function Wheat({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><path d="M0 18V-25M0-15-8-24M0-9 8-18M0-3-9-12M0 4 9-5" className="hi-wheat" /></g>;
}

function wrapWords(value: string, limit: number) {
  const rows: string[] = [];
  for (const word of value.split(' ')) {
    if (!rows.length || rows[rows.length - 1].length + word.length + 1 > limit) rows.push(word);
    else rows[rows.length - 1] += ` ${word}`;
  }
  return rows;
}
function Note({ x, y, lines, target, width }: { x: number; y: number; lines: string[]; target?: [number,number]; width?: number }) {
  const limit = Math.min(28, Math.floor((width ?? (590 - x)) / 9));
  const rows = lines.flatMap(line => wrapWords(line, limit));
  return <g>{rows.map((line,i)=><text key={`${line}-${i}`} x={x} y={y+i*26} className="hi-note">{line}</text>)}{target&&<path d={`M${x+24} ${y+rows.length*26-11}Q${x+35} ${target[1]-15} ${target[0]} ${target[1]}`} className="hi-pointer" />}</g>;
}
function Label({ x, y, children, width }: { x: number; y: number; children: React.ReactNode; width?: number }) {
  const rows = typeof children === 'string' ? wrapWords(children, Math.min(66, Math.floor((width ?? Math.min(x - 18, 602 - x) * 2) / 8.5))) : [children];
  return <text x={x} y={y-(rows.length-1)*19} textAnchor="middle" className="hi-label">{rows.map((line,i)=><tspan key={i} x={x} dy={i ? 19 : 0}>{line}</tspan>)}</text>;
}

const titles: Record<string,string> = {
  GreekPoleis:'A cidade entre montanhas', RomanPower:'Quem governa Roma?', FeudalBonds:'Terra, trabalho e proteção', BlackDeath:'Quando faltam braços', RenaissanceChain:'A cidade financia o olhar',
  FirstGlobalization:'O Atlântico conecta e explora', SpanishCastes:'Origem e poder na colônia', ReformationDialectic:'A fé atravessa a imprensa', AbsolutismPaths:'O poder chega à Coroa', EnlightenmentLamp:'Razão, crítica e direitos',
  WorkerRoads:'Da fábrica à organização', ColonialRule:'A riqueza sai da colônia', AllianceFuse:'Da rivalidade à guerra', InterwarChain:'Uma paz que não se estabiliza', DemocracyCracks:'A democracia sob ataque', Decolonization:'Independência não é um só caminho', ColdWarEnd:'A ordem bipolar se desfaz',
  FirstCities:'O excedente organiza a cidade', AmericasNineteenth:'Novas fronteiras, antigas disputas', CenturyRevolutions:'Quem transforma a sociedade?', WorldWarTwo:'A guerra alcança dois oceanos', ColdWar:'A disputa atravessa o planeta', LatinAmericaTwentieth:'Trabalho, ditadura e resistência', ColonialDisputes:'Portos, açúcar e disputa imperial',
};

// A gravura superior dá contexto material a cada mecanismo; a faixa inferior
// preserva o argumento, as datas e os recortes já usados na recuperação ativa.
function Artwork({ kind }: { kind: string }) {
  switch(kind) {
    case 'GreekPoleis': return <>
      <path d="M30 251 89 105 135 199 181 120 232 261M344 253 406 111 449 176 499 102 588 254" className="hi-mountains" />
      <path d="M38 260Q210 237 303 285T586 261V335H38Z" className="hi-sea" />
      <Building x={186} y={169} style="temple" s={.62} /><Building x={465} y={199} style="temple" s={.45} />
      <Figure x={211} y={264} dress="ancient" s={.7} /><Figure x={253} y={271} dress="ancient" s={.7} />
      <path d="M150 312Q211 301 272 312M283 267 359 277" className="hi-water" /><Ship x={330} y={291} s={.32} />
      <Note x={33} y={87} lines={['relevo separa','governos próprios']} target={[124,170]} />
      <Note x={345} y={86} lines={['o mar aproxima','língua e deuses comuns']} target={[331,256]} />
      <Label x={181} y={258}>Atenas · ágora e cidadania</Label><Label x={468} y={306}>Esparta · organização militar</Label>
    </>;
    case 'RomanPower': return <>
      <Building x={175} y={178} style="temple" s={.95} />
      <path d="M63 278Q160 247 267 278L284 311H48Z" className="hi-stone" />
      {[89,124,159,194,229].map((x,i)=><Figure key={x} x={x} y={272+i%2*7} dress="ancient" s={.55} />)}
      <Figure x={439} y={207} dress="ancient" s={1.45} />
      <path d="M425 192Q409 172 422 164M451 192Q468 172 455 164M422 185l-9-5M457 185l9-5" className="hi-wheat" />
      <Document x={499} y={226} title="imperium" s={.65} />
      <path d="M286 235Q352 207 397 237" className="hi-link" />
      <Note x={33} y={89} lines={['República: cargos','e poderes repartidos']} target={[162,140]} />
      <Note x={337} y={91} lines={['Augusto concentra','autoridade · 27 a.C.']} target={[440,178]} />
      <Label x={165} y={345}>Senado, assembleias, cônsules</Label><Label x={453} y={345}>Instituições mantidas; poder concentrado</Label>
    </>;
    case 'FeudalBonds': return <>
      <path d="M28 261Q131 216 295 267T593 260V339H28Z" className="hi-land" />
      <Building x={124} y={161} style="castle" s={.8} /><Building x={500} y={209} style="house" s={.46} />
      <path d="M192 280 307 252 377 315 249 331ZM287 215 374 224 400 268 316 251Z" className="hi-field" />
      {[214,239,267,296,328].map(x=><Wheat key={x} x={x} y={291} />)}
      <Figure x={354} y={267} dress="worker" s={.85} /><path d="M372 272 410 310M399 309h23" className="hi-wood" />
      <Figure x={444} y={144} dress="royal" s={.85} /><Figure x={503} y={146} dress="royal" s={.75} />
      <path d="M463 167 485 174" className="hi-link" />
      <Note x={28} y={86} lines={['senhorio: obrigações','sobre terra e trabalho']} target={[128,177]} />
      <Note x={329} y={87} lines={['entre nobres: fidelidade','serviço e proteção']} target={[474,162]} />
      <Label x={304} y={359}>Servo ≠ vassalo · vínculos sociais diferentes</Label>
    </>;
    case 'BlackDeath': return <>
      <Building x={170} y={193} s={.85} /><Building x={288} y={202} s={.65} /><Building x={74} y={218} s={.55} />
      <path d="M29 314 250 244 373 314M33 330 259 275 380 330" className="hi-fine" />
      <path d="M396 243 585 228 584 319 403 325Z" className="hi-field" />
      {[424,452,480,508,536,564].map(x=><Wheat key={x} x={x} y={279} />)}
      <Figure x={421} y={278} dress="worker" s={.8} /><path d="M457 305h42m-20-15v28" className="hi-wood" />
      <path d="M142 183V225M125 198h34M228 218l15 14m-15 0 15-14" className="hi-pointer" />
      <Note x={30} y={89} lines={['rotas ligam cidades','e disseminam a peste']} target={[170,214]} />
      <Note x={341} y={89} lines={['menos trabalhadores','pressão por remuneração']} target={[421,265]} />
      <Label x={160} y={355}>Crise demográfica · século XIV</Label><Label x={475} y={355}>Conflitos nas relações de trabalho</Label>
    </>;
    case 'RenaissanceChain': return <>
      <Building x={93} y={188} s={.7} /><Building x={210} y={175} style="church" s={.8} />
      <Figure x={284} y={228} dress="merchant" s={1} />
      <path d="M399 141H531V293H399Z" className="hi-earth" /><path d="M407 150H523V284H407Z" className="hi-paper" />
      <path d="M411 269 465 187 519 269M411 236 465 187 519 236M411 208 465 187 519 208M465 187v82M417 260H513M432 236H500M447 208H480" className="hi-fine" />
      <path d="M410 294 397 339M517 294 531 339" className="hi-wood" /><Figure x={558} y={267} s={.8} />
      <path d="M304 244Q353 212 391 233" className="hi-link" />
      <Note x={32} y={88} lines={['comércio e cidades','sustentam o mecenato']} target={[279,230]} />
      <Note x={348} y={89} lines={['observar e representar','perspectiva e humanismo']} target={[465,190]} />
      <Label x={183} y={358} width={248}>Riqueza → encomenda e patronagem</Label><Label x={465} y={358} width={244}>Construção do espaço pictórico</Label>
    </>;
    case 'FirstGlobalization': return <>
      <Globe x={300} y={221} s={1.12} /><Ship x={107} y={251} s={.68} /><Ship x={503} y={251} s={.6} />
      <path d="M149 199Q255 113 386 190M397 276Q277 354 180 266" className="hi-link" />
      <Document x={35} y={125} title="monopólio" s={.65} /><Figure x={549} y={168} dress="merchant" s={.65} />
      <Note x={35} y={88} lines={['rotas oceânicas','e expansão europeia']} target={[167,196]} />
      <Note x={348} y={88} lines={['colonização, escravização','e apropriação de riquezas']} target={[470,225]} />
      <Label x={301} y={348}>Mercadorias e pessoas: circulação sob relações desiguais</Label>
    </>;
    case 'SpanishCastes': return <>
      <Building x={295} y={161} style="church" s={.75} /><Building x={458} y={186} s={.8} />
      <path d="M49 270Q283 227 570 281L574 327H45Z" className="hi-stone" />
      <Figure x={135} y={185} dress="royal" s={1.05} /><Figure x={221} y={226} dress="merchant" s={.9} /><Figure x={331} y={271} dress="worker" s={.8} /><Figure x={405} y={274} s={.8} /><Figure x={487} y={277} dress="worker" s={.8} />
      <Note x={30} y={89} lines={['peninsulares: acesso','aos altos cargos']} target={[130,164]} />
      <Note x={348} y={88} lines={['origem social e racialização','organizam a desigualdade']} target={[405,267]} />
      <Label x={221} y={316}>Criollos</Label><Label x={406} y={355}>Mestiços, indígenas e africanos escravizados</Label>
    </>;
    case 'ReformationDialectic': return <>
      <Building x={117} y={193} style="church" s={.88} /><Document x={193} y={189} title="95 teses" s={.8} /><Press x={370} y={245} /><Figure x={510} y={246} dress="clergy" s={1} />
      <path d="M283 218Q307 194 323 220M426 220h43" className="hi-link" />
      <Note x={29} y={87} lines={['crítica às indulgências','Lutero · 1517']} target={[220,206]} />
      <Note x={340} y={87} lines={['textos circulam','autoridade religiosa em disputa']} target={[370,181]} />
      <Label x={340} y={352}>Reformas protestantes e resposta católica · Trento</Label>
    </>;
    case 'AbsolutismPaths': return <>
      <Building x={305} y={193} s={1.35} /><Figure x={305} y={213} dress="royal" s={1.3} />
      <Document x={34} y={185} title="Hobbes" s={1} /><Document x={476} y={185} title="Bossuet" s={1} />
      <path d="M145 226Q184 169 236 203M477 226Q432 167 374 203" className="hi-link" />
      <Note x={32} y={86} lines={['contrato: conter','a guerra entre indivíduos']} target={[95,186]} />
      <Note x={343} y={86} lines={['direito divino: o rei','responde perante Deus']} target={[526,184]} />
      <Label x={306} y={348}>Centralização · fiscalidade · exército · administração</Label>
    </>;
    case 'EnlightenmentLamp': return <>
      <path d="M97 269H550V285H97ZM122 285v51M523 285v51" className="hi-earth" />
      <Document x={232} y={151} title="Enciclopédia" s={1.2} /><Figure x={119} y={228} dress="merchant" s={1} /><Figure x={513} y={228} dress="merchant" s={1} />
      <path d="M405 260V190M383 191H427L417 162H393ZM394 260H416" className="hi-gold" />
      <path d="M161 255H206V263H161ZM449 255h38v8h-38Z" className="hi-paper" />
      <Note x={31} y={86} lines={['crítica aos privilégios','e ao poder sem limites']} target={[274,148]} />
      <Note x={342} y={86} lines={['razão e debate público','propostas não idênticas']} target={[514,215]} />
      <Label x={307} y={357}>Locke · Montesquieu · Voltaire · Rousseau</Label>
    </>;
    case 'WorkerRoads': return <>
      <Building x={152} y={178} style="factory" s={1.05} /><Figure x={277} y={254} dress="worker" /><Figure x={336} y={258} dress="worker" /><Figure x={395} y={254} dress="worker" />
      <Document x={470} y={199} title="associação" s={.9} /><path d="M241 249Q276 209 326 236M413 245h47" className="hi-link" />
      <path d="M291 193H413V220H291Z" className="hi-paper" /><text x="352" y="212" textAnchor="middle" className="hi-doc-title">direitos e organização</text>
      <Note x={32} y={87} lines={['trabalho fabril','disciplina e exploração']} target={[139,214]} />
      <Note x={348} y={87} lines={['greves, sindicatos','e projetos socialistas']} target={[340,238]} />
      <Label x={308} y={355}>Liberalismo, socialismo e anarquismo: estratégias em disputa</Label>
    </>;
    case 'ColonialRule': return <>
      <path d="M34 295 83 153 119 227 162 161 202 298Z" className="hi-mountains" /><path d="M75 244 117 200 135 266 95 290Z" className="hi-dark" />
      <Figure x={153} y={279} dress="worker" s={.8} /><path d="M191 278h51v34h-51ZM202 278v34M224 278v34" className="hi-earth" />
      <Ship x={321} y={270} s={.7} /><Building x={485} y={218} style="factory" s={.72} />
      <path d="M219 244Q300 176 402 227" className="hi-link" /><Document x={394} y={129} title="concessão" s={.65} />
      <Note x={31} y={87} lines={['território e trabalho','submetidos ao império']} target={[116,240]} />
      <Note x={344} y={87} lines={['matérias-primas e mercados','alimentam a indústria']} target={[476,241]} />
      <Label x={309} y={354}>Domínio colonial · interesses econômicos · discurso racial</Label>
    </>;
    case 'AllianceFuse': return <>
      <path d="M30 272 62 263 105 276 147 258 191 271 229 255 270 270 310 257 350 271 398 255 446 270 487 256 535 269 590 260V331H30Z" className="hi-earth" />
      <path d="M42 285 182 285 192 313H51ZM398 285H574L566 315H408Z" className="hi-dark" />
      <Figure x={145} y={229} dress="soldier" s={.8} /><Figure x={467} y={230} dress="soldier" s={.8} />
      <path d="M212 173H399V228H212Z" className="hi-paper" /><text x="306" y="195" textAnchor="middle" className="hi-doc-title">Sarajevo · 1914</text><text x="306" y="218" textAnchor="middle" className="hi-small">crise → mobilizações</text>
      <path d="M218 228 174 249M398 228 439 249M222 136Q305 116 395 136" className="hi-link" />
      <Note x={29} y={88} lines={['alianças e armamentos','ampliam o conflito']} target={[154,239]} />
      <Note x={352} y={88} lines={['nacionalismos e impérios','disputam poder']} target={[465,238]} />
      <Label x={306} y={358}>1914–1918 · a guerra de trincheiras e de desgaste</Label>
    </>;
    case 'InterwarChain': return <>
      <Document x={36} y={175} title="Versalhes" s={.85} /><Building x={287} y={213} style="factory" s={.8} /><Figure x={421} y={269} s={.85} /><Figure x={467} y={277} s={.85} /><Figure x={518} y={274} s={.85} />
      <path d="M165 173H256V223H165Z" className="hi-paper" /><path d="M173 183 194 192 210 185 224 211 246 218" className="hi-pointer" />
      <path d="M127 235 172 244M335 267 385 282" className="hi-link" />
      <Note x={31} y={86} lines={['paz punitiva','e tensões persistentes']} target={[89,177]} />
      <Note x={340} y={86} lines={['1929: crise econômica','desemprego e radicalização']} target={[469,261]} />
      <Label x={306} y={357}>A crise abre disputas; o autoritarismo não era inevitável</Label>
    </>;
    case 'DemocracyCracks': return <>
      <Building x={177} y={183} style="temple" s={.95} /><path d="M183 141 166 173 181 198 163 231 181 260" className="hi-pointer" />
      <Document x={365} y={174} title="decreto" s={1.1} /><Figure x={518} y={242} dress="soldier" s={1} />
      <path d="M320 207H352M332 197l20 10-20 10" className="hi-link" />
      <path d="M65 280H300V311H65Z" className="hi-paper" /><text x="182" y="301" textAnchor="middle" className="hi-doc-title">direitos e oposição suprimidos</text>
      <Note x={31} y={87} lines={['crise de Weimar','e apoio de grupos conservadores']} target={[181,182]} />
      <Note x={349} y={87} lines={['1933: concentração do poder','repressão e propaganda']} target={[419,178]} />
      <Label x={307} y={355}>Nazismo · racismo de Estado · perseguição e genocídio</Label>
    </>;
    case 'Decolonization': return <>
      <Globe x={305} y={217} s={1.05} /><Figure x={107} y={238} s={1} /><Figure x={504} y={238} s={1} />
      <Document x={39} y={153} title="soberania" s={.65} /><Document x={471} y={153} title="autonomia" s={.65} />
      <path d="M168 238 215 218M391 218 440 238" className="hi-link" /><path d="M109 227V159m0 0h45v26h-45M503 227V159m0 0h45v26h-45" className="hi-flag" />
      <Note x={31} y={87} lines={['mobilização nacional','negociação e guerra']} target={[106,231]} />
      <Note x={351} y={87} lines={['África e Ásia','trajetórias e tempos distintos']} target={[504,230]} />
      <Label x={306} y={355}>Depois de 1945 · novos Estados, fronteiras e dependências</Label>
    </>;
    case 'ColdWarEnd': return <>
      <path d="M47 263V163H115V263M115 263V150H187V263M376 263V154H448V263M448 263V165H573V263" className="hi-stone" />
      <path d="M197 257 213 180 246 212 274 174 292 263 316 255 341 274 363 269" className="hi-earth" />
      <path d="M54 186h125m-125 26h125m203-26h183m-183 26h183M65 163v99M93 163v99M405 155v108M466 166v96M533 166v96" className="hi-fine" />
      <Figure x={209} y={282} s={.7} /><Figure x={274} y={278} s={.7} /><Figure x={350} y={281} s={.7} /><Document x={461} y={272} title="1991" s={.58} />
      <Note x={30} y={87} lines={['1989: cai o Muro','1990: reunificação alemã']} target={[274,218]} />
      <Note x={342} y={87} lines={['reformas e crises','dissolução da URSS · 1991']} target={[489,279]} />
      <Label x={306} y={355}>Perestroika e glasnost · transformação da ordem internacional</Label>
    </>;
    case 'FirstCities': return <>
      <path d="M30 278Q126 252 217 279T412 277T590 268V337H30Z" className="hi-land" /><path d="M31 294Q124 273 218 302T419 301T590 291" className="hi-water hi-river" />
      <path d="M276 269V243H301V216H326V190H371V216H396V243H423V269Z" className="hi-earth" /><path d="M276 246h147M301 220h95M331 190v-23h33v23" className="hi-fine" />
      <Building x={464} y={213} s={.5} /><Building x={529} y={239} s={.38} />
      {[65,92,119,146].map(x=><Wheat key={x} x={x} y={250} />)}<Figure x={201} y={266} dress="worker" s={.7} /><Document x={471} y={287} title="registro" s={.47} />
      <Note x={30} y={87} lines={['irrigação e excedente','permitem especialização']} target={[132,243]} />
      <Note x={345} y={87} lines={['templo, administração','tributos e escrita']} target={[349,215]} />
      <Label x={306} y={358}>Mesopotâmia · urbanização, hierarquia e organização do trabalho</Label>
    </>;
    case 'AmericasNineteenth': return <>
      <path d="M130 154 156 131 195 153 187 177 239 187 256 205 228 230 258 251 245 280 224 309 207 340 193 306 178 271 167 252 151 239 135 213 100 196Z" className="hi-land" />
      <path d="M157 164 203 185M171 215 218 217M201 253 240 265" className="hi-boundary" />
      <Figure x={324} y={232} dress="soldier" /><Document x={389} y={158} title="constituição" s={1.1} /><Figure x={535} y={264} dress="worker" s={.8} />
      <path d="M249 222 292 233M355 239 390 236" className="hi-link" />
      <Note x={31} y={87} lines={['independências','formam novos Estados']} target={[176,213]} />
      <Note x={337} y={87} lines={['cidadania e território','seguem em disputa']} target={[444,173]} />
      <Label x={338} y={354}>Estados Unidos · América hispânica · projetos e conflitos</Label>
    </>;
    case 'CenturyRevolutions': return <>
      <Building x={128} y={187} style="factory" s={.72} /><Figure x={119} y={267} dress="worker" s={.8} />
      <path d="M242 270 265 247 308 255 338 242 382 265V319H242Z" className="hi-field" />
      {[263,289,315,341,367].map(x=><Wheat key={x} x={x} y={285} />)}<Figure x={310} y={240} dress="worker" s={.8} />
      <path d="M435 267 476 252 515 259 557 249 585 273V317H435Z" className="hi-field" />
      {[451,478,551,577].map(x=><Wheat key={x} x={x} y={293} />)}
      <Figure x={507} y={241} dress="worker" s={1} /><Figure x={551} y={261} dress="worker" s={.7} />
      <path d="M526 239 552 301M542 301h22" className="hi-wood" />
      <Note x={31} y={87} width={156} lines={['Rússia · 1917','operários e camponeses']} target={[129,224]} />
      <Note x={224} y={87} width={156} lines={['China · 1949','mobilização rural']} target={[310,261]} />
      <Note x={423} y={87} width={156} lines={['México · 1910','terra e luta camponesa']} target={[514,223]} />
      <Label x={310} y={355}>Bases sociais e percursos distintos · revoluções comparadas</Label>
    </>;
    case 'WorldWarTwo': return <>
      <Globe x={305} y={228} s={1.15} /><Figure x={100} y={249} dress="soldier" s={.8} /><Ship x={513} y={279} s={.65} />
      <path d="M37 213 86 196 157 223 98 219 74 234ZM448 163 498 148 570 175 509 169 484 185Z" className="hi-green" />
      <path d="M187 198Q225 145 286 154M390 248Q426 303 450 287" className="hi-link" />
      <Note x={31} y={87} lines={['Europa: expansão nazista','resistência e contraofensivas']} target={[273,178]} />
      <Note x={349} y={87} lines={['Pacífico: expansão japonesa','e guerra naval']} target={[507,276]} />
      <Label x={306} y={352}>1939–1945 · guerra total, Holocausto e destruição em massa</Label>
    </>;
    case 'ColdWar': return <>
      <Globe x={307} y={228} s={1.15} /><Building x={106} y={214} style="temple" s={.58} /><Building x={509} y={216} style="factory" s={.65} />
      <path d="M177 206Q211 141 275 171M432 206Q403 141 342 171M177 253Q307 348 433 253" className="hi-link" />
      <Document x={58} y={284} title="OTAN" s={.5} /><Document x={475} y={282} title="Varsóvia" s={.55} />
      <Note x={31} y={87} lines={['EUA: capitalismo','alianças e influência']} target={[103,223]} />
      <Note x={349} y={87} lines={['URSS: socialismo','alianças e influência']} target={[508,229]} />
      <Label x={307} y={354}>Disputa nuclear, econômica, espacial e por guerras indiretas</Label>
    </>;
    case 'LatinAmericaTwentieth': return <>
      <Building x={113} y={189} style="factory" s={.73} /><Figure x={115} y={266} dress="worker" s={.85} /><Figure x={207} y={232} dress="soldier" s={1} />
      <Document x={284} y={170} title="censura" s={.9} /><Figure x={440} y={261} s={.85} /><Figure x={484} y={265} dress="worker" s={.85} /><Figure x={535} y={263} s={.85} />
      <path d="M409 205H571V235H409Z" className="hi-paper" /><text x="490" y="226" textAnchor="middle" className="hi-doc-title">democracia e direitos</text>
      <Note x={31} y={87} lines={['industrialização e trabalho','populismos e conflitos']} target={[116,231]} />
      <Note x={349} y={87} lines={['ditaduras: repressão','resistências e redemocratização']} target={[487,242]} />
      <Label x={307} y={355}>Brasil · Argentina · Chile · Uruguai: cronologias distintas</Label>
    </>;
    case 'ColonialDisputes': return <>
      <path d="M30 262Q174 233 304 281L327 335H30Z" className="hi-land" /><path d="M305 283Q449 267 590 291V336H326Z" className="hi-sea" />
      <Building x={129} y={203} style="castle" s={.7} /><Building x={275} y={220} s={.58} /><Ship x={457} y={266} s={.85} />
      <path d="M204 261v57M217 252v66M231 258v60M194 267l10-6 9 5M208 258l9-7 10 7M222 264l9-6 11 5" className="hi-wheat" />
      <Figure x={255} y={282} dress="worker" s={.65} /><path d="M350 251Q412 158 505 151" className="hi-link" />
      <Note x={31} y={87} lines={['fortes e alianças','controlam trechos do litoral']} target={[128,219]} />
      <Note x={341} y={87} lines={['açúcar e rotas atlânticas','atraem potências rivais']} target={[455,263]} />
      <Label x={306} y={355}>Guanabara · Bahia · Pernambuco · concorrência no Caribe</Label>
    </>;
    default: return null;
  }
}

export function HistorianIllustration({ kind, active }: Props) {
  const id = useId().replace(/:/g, '');
  return <g className="hi-illustration" data-active-excerpt={active + 1}>
    <defs><pattern id={`${id}-grain`} width="27" height="27" patternUnits="userSpaceOnUse"><path d="M2 7h5m11 13h6M8 25h2" className="hi-grain" /></pattern></defs>
    <rect x="8" y="8" width="604" height="365" rx="8" className="hi-background" />
    <rect x="8" y="8" width="604" height="365" rx="8" fill={`url(#${id}-grain)`} />
    <path d="M28 57Q229 63 578 54" className="hi-title-rule" />
    <text x="29" y="43" className="hi-title">{titles[kind]}</text>
    <Artwork kind={kind} />
    <path d="M32 367H585" className="hi-selection-rule" />
  </g>;
}
