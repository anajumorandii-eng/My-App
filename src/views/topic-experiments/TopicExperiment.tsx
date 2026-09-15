import React, { useState, useId } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../../design-system/motion/tokens';
import { topicExperiments } from './catalog';
import './TopicExperiment.css';

function useInkMotion() {
  const reduced = useReducedMotion();
  return { duration: reduced ? 0 : MOTION_DURATION.entrance, ease: MOTION_EASE };
}

function Studio({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return <section className="topic-studio" aria-label={title}>
    <header><small>CRIVO · laboratório do conceito</small><h4>{title}</h4><p>{note}</p></header>{children}
  </section>;
}

function Coordinates() {
  const [latitude, setLatitude] = useState(20);
  const [longitude, setLongitude] = useState(30);
  const transition = useInkMotion();
  const id = useId();
  const r = Math.PI / 180;
  const x = 240 + 148 * Math.cos(latitude * r) * Math.sin(longitude * r);
  const y = 174 - 148 * Math.sin(latitude * r);
  const radius = 148 * Math.cos(latitude * r);
  return <Studio title="Um endereço sobre a esfera" note="Mova as coordenadas. A latitude parte do Equador; a longitude, de Greenwich.">
    <svg viewBox="0 0 480 365" role="img" aria-label={`Ponto a ${latitude} graus de latitude e ${longitude} graus de longitude`}>
      <defs><radialGradient id={id} cx="32%" cy="24%"><stop stopColor="var(--vs-paper-strong)"/><stop offset="1" stopColor="var(--vs-blue)" stopOpacity=".2"/></radialGradient></defs>
      <circle cx="240" cy="174" r="148" fill={`url(#${id})`} stroke="currentColor" strokeWidth="1.5"/>
      {[40,85,125].map(rx => <ellipse key={rx} cx="240" cy="174" rx={rx} ry="148" className="ts-guide"/>)}
      {[80,125,174,223,268].map(cy => <path key={cy} d={`M${240-Math.sqrt(148**2-(cy-174)**2)} ${cy}H${240+Math.sqrt(148**2-(cy-174)**2)}`} className="ts-guide"/>)}
      <path d="M92 174H388M240 26V322" className="ts-reference"/>
      <motion.path animate={{ d: `M${240-radius} ${y}H${240+radius}` }} transition={transition} className="ts-latitude"/>
      <motion.ellipse cx="240" cy="174" animate={{ rx: Math.abs(148 * Math.sin(longitude*r)) }} ry="148" transition={transition} className="ts-longitude"/>
      <motion.circle animate={{ cx:x,cy:y }} r="8" transition={transition} className="ts-position"/>
      <text x="14" y="167">Equador · 0°</text><text x="254" y="345">Greenwich · 0°</text>
      <text x="231" y="18">N</text><text x="231" y="362">S</text>
    </svg>
    <div className="ts-sliders">
      <label>Latitude: {Math.abs(latitude)}° {latitude < 0 ? 'S' : latitude > 0 ? 'N' : ''}<input type="range" min="-80" max="80" value={latitude} onChange={e=>setLatitude(Number(e.target.value))}/></label>
      <label>Longitude: {Math.abs(longitude)}° {longitude < 0 ? 'O' : longitude > 0 ? 'L' : ''}<input type="range" min="-90" max="90" value={longitude} onChange={e=>setLongitude(Number(e.target.value))}/></label>
    </div>
    <p className="ts-observation" role="status">Nesta latitude, 1° de longitude corresponde a aproximadamente {Math.round(111.2*Math.cos(latitude*r))} km. Os meridianos convergem nos polos.</p>
    <small>Modelo esférico, hemisfério visível de −90° a +90° de longitude. A elipse mostra o meridiano e seu prolongamento; o ponto marca a posição escolhida.</small>
  </Studio>;
}

function Powers() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(2);
  const transition = useInkMotion();
  return <Studio title="Por que os expoentes se somam?" note="Cada marca representa um fator 2. Junte os grupos para enxergar a multiplicação.">
    <div className="ts-equation"><span>2<sup>{a}</sup></span><i>×</i><span>2<sup>{b}</sup></span><i>=</i><strong>2<sup>{a+b}</sup></strong></div>
    <svg viewBox="0 0 480 165" role="img" aria-label={`${a} fatores 2 mais ${b} fatores 2: ${a+b} fatores no produto`}>
      {Array.from({length:a+b},(_,i)=><motion.g key={i} initial={false} animate={{x:48+i*43,y:65}} transition={transition}>
        <circle r="18" fill="none" stroke={i<a?'var(--vs-burgundy)':'var(--vs-blue)'} strokeWidth="2"/>
        <text textAnchor="middle" y="6">2</text>{i<a+b-1&&<text x="22" y="6">·</text>}
      </motion.g>)}
      <motion.path animate={{d:`M30 97v12h${(a+b-1)*43+36}v-12`}} transition={transition} className="ts-reference"/>
      <text x="30" y="143">{a+b} fatores · resultado {2**(a+b)}</text>
    </svg>
    <div className="ts-sliders"><label>Primeiro expoente: {a}<input type="range" min="1" max="4" value={a} onChange={e=>setA(+e.target.value)}/></label><label>Segundo expoente: {b}<input type="range" min="1" max="4" value={b} onChange={e=>setB(+e.target.value)}/></label></div>
    <p className="ts-observation" role="status">2<sup>{a}</sup> × 2<sup>{b}</sup> = {2**a} × {2**b} = {2**(a+b)}. A soma dos expoentes vale aqui porque a base é a mesma.</p>
  </Studio>;
}

const ecologyLevels = [
  ['População','Indivíduos da mesma espécie, na mesma área e no mesmo momento.'],
  ['Comunidade','Populações de espécies diferentes que convivem na área.'],
  ['Ecossistema','Comunidade, ambiente físico e químico e suas interações.'],
  ['Biosfera','Conjunto das regiões da Terra habitadas por seres vivos.'],
];
function Ecology() {
  const [level,setLevel]=useState(0); const transition=useInkMotion();
  return <Studio title="Mude a escala da observação" note="Da população à biosfera: o que passa a fazer parte do estudo?">
    <svg viewBox="0 0 480 270" role="img" aria-label={`Escala selecionada: ${ecologyLevels[level][0]}`}>
      <motion.ellipse cx="240" cy="142" animate={{rx:level===3?207:178,ry:level===3?110:88,opacity:level>=2?1:.15}} transition={transition} fill="none" stroke="var(--vs-blue)" strokeWidth="2"/>
      <path d="M42 203Q112 157 175 202T438 204" className="ts-guide"/>
      {[135,185,235].map((x,i)=><g key={x} transform={`translate(${x},${115+i%2*30})`}><path d="M0 28V-10Q-28-25-29-6Q-26 8 0 8Q27-20 34-9Q39 9 0 17" fill="var(--vs-green)" opacity=".75"/></g>)}
      <motion.g animate={{opacity:level>=1?1:.12}} transition={transition}>
        {[300,350].map(x=><g key={x} transform={`translate(${x},135)`}><path d="M-16 5Q-3-14 13 0L24-8V13L13 6Q-3 20-16 5" fill="var(--vs-burgundy)"/><circle cx="5" cy="2" r="2" fill="var(--vs-paper-strong)"/></g>)}
      </motion.g>
      <motion.g animate={{opacity:level>=2?1:.12}} transition={transition}><circle cx="330" cy="61" r="17" fill="var(--vs-amber)"/><path d="M64 175q20-12 40 0t40 0M67 184q20-12 40 0t40 0" className="ts-longitude"/><text x="60" y="236">água · luz · solo</text></motion.g>
      <motion.g animate={{opacity:level===3?1:0}} transition={transition}><ellipse cx="240" cy="142" rx="207" ry="45" className="ts-guide"/><ellipse cx="240" cy="142" rx="80" ry="110" className="ts-guide"/></motion.g>
    </svg>
    <div className="ts-choices">{ecologyLevels.map(([name],i)=><button type="button" key={name} aria-pressed={level===i} onClick={()=>setLevel(i)}>{name}</button>)}</div>
    <p className="ts-observation" role="status"><strong>{ecologyLevels[level][0]}.</strong> {ecologyLevels[level][1]}</p><small>Esquema de níveis selecionados; bioma não está representado nesta sequência.</small>
  </Studio>;
}

function Myth() {
  const [mode,setMode]=useState(0); const transition=useInkMotion();
  const [inspect,setInspect]=useState(false);
  return <Studio title="O mesmo fenômeno, outro critério" note="Compare o que sustenta uma explicação mítica e uma investigação racional.">
    <div className="ts-choices"><button type="button" aria-pressed={mode===0} onClick={()=>{setMode(0);setInspect(false);}}>Mito</button><button type="button" aria-pressed={mode===1} onClick={()=>{setMode(1);setInspect(false);}}>Logos</button></div>
    <svg viewBox="0 0 480 240" role="img" aria-label={mode===0?'Explicação apoiada na tradição':'Explicação aberta à argumentação'}>
      <path d="M202 80q-30-45-60-10q-45-10-42 30h145q14-30-16-35q-15-5-27 15" fill="none" stroke="currentColor" strokeWidth="2"/>
      <path d="M184 104l-22 42h23l-17 33 52-53h-28l17-22" fill="var(--vs-amber)"/>
      <motion.path animate={{pathLength:inspect?1:0,opacity:inspect?1:0}} transition={transition} d="M245 110Q310 94 353 139" className="ts-reference"/>
      <text x="279" y="76">{mode===0?'Quem conta?':'Como justificar?'}</text>
      <text x="275" y="169">{mode===0?'tradição':'argumentação'}</text>
      <text x="275" y="201">{mode===0?'autoridade':'contestação'}</text>
    </svg>
    <p className="ts-observation">{mode===0?'“O raio expressa a ira de Zeus.” A narrativa mobiliza uma vontade divina e a autoridade da tradição.':'“Que causas naturais explicam o raio?” A pergunta busca uma explicação discutível e justificável por argumentos.'}</p>
    <button type="button" onClick={()=>setInspect(v=>!v)} aria-expanded={inspect}>Examinar o critério de aceitação</button>
    {inspect&&<p role="status">{mode===0?'A aceitação se apoia na tradição que transmite a narrativa.':'A explicação pode ser examinada, contestada e corrigida.'} Essa comparação é de critérios, não uma cronologia em que o mito desaparece.</p>}
  </Studio>;
}

function Solidarity() {
  const [organic,setOrganic]=useState(false);const transition=useInkMotion();
  return <Studio title="O que mantém o grupo unido?" note="Em Durkheim, semelhança e interdependência sustentam formas diferentes de solidariedade.">
    <div className="ts-choices"><button type="button" aria-pressed={!organic} onClick={()=>setOrganic(false)}>Mecânica</button><button type="button" aria-pressed={organic} onClick={()=>setOrganic(true)}>Orgânica</button></div>
    <svg viewBox="0 0 480 230" role="img" aria-label={organic?'Funções especializadas ligadas pela interdependência':'Membros com práticas e crenças semelhantes'}>
      <motion.path d="M95 96H240H385" animate={{pathLength:organic?1:0,opacity:organic?1:0}} transition={transition} className="ts-reference"/>
      {['Produção','Transporte','Cuidado'].map((label,i)=><g key={label} transform={`translate(${95+i*145},96)`}>
        <motion.rect x="-45" y="-43" width="90" height="86" animate={{rx:organic?i*12:43}} transition={transition} fill="var(--vs-paper-strong)" stroke="var(--vs-green)" strokeWidth="2"/>
        <text textAnchor="middle" y="7">{organic?['P','T','C'][i]:'≃'}</text><text textAnchor="middle" y="78">{organic?label:'Semelhança'}</text>
      </g>)}
    </svg>
    <p className="ts-observation" role="status">{organic?'Funções diferentes aumentam a dependência recíproca. A divisão social do trabalho pode produzir solidariedade orgânica.':'Práticas e crenças comuns reforçam a consciência coletiva. A coesão se apoia principalmente na semelhança.'}</p><small>Exemplos esquemáticos. “Mecânica” e “orgânica” não indicam máquinas nem organismos biológicos.</small>
  </Studio>;
}

function Cohesion() {
  const [relation,setRelation]=useState<'cause'|'contrast'>('cause'); const transition=useInkMotion();
  return <Studio title="Um conector muda a relação" note="Observe a diferença entre ligar palavras e construir um sentido coerente.">
    <div className="ts-choices"><button type="button" aria-pressed={relation==='cause'} onClick={()=>setRelation('cause')}>Consequência</button><button type="button" aria-pressed={relation==='contrast'} onClick={()=>setRelation('contrast')}>Contraste</button></div>
    <div className="ts-sentence"><span>Choveu muito.</span><motion.strong key={relation} initial={false} animate={{opacity:1}} transition={transition}>{relation==='cause'?'Por isso,':'Mesmo assim,'}</motion.strong><span>{relation==='cause'?'a partida foi cancelada.':'a partida continuou.'}</span></div>
    <svg viewBox="0 0 480 85" aria-hidden="true"><motion.path animate={{d:relation==='cause'?'M45 25Q240 80 430 25':'M45 25Q240-20 430 25'}} transition={transition} className="ts-reference"/><path d="M419 18l11 7-13 5" className="ts-reference"/></svg>
    <p className="ts-observation" role="status">{relation==='cause'?'“Por isso” apresenta o cancelamento como consequência da chuva.':'“Mesmo assim” indica que a partida continuou contra uma expectativa gerada pela chuva.'} O conector estabelece coesão; a interpretação da relação depende do contexto.</p>
  </Studio>;
}

function Variation() {
  const [formal,setFormal]=useState(false); const transition=useInkMotion();
  return <Studio title="A linguagem encontra a situação" note="A intenção é a mesma; interlocutor, contexto e registro orientam a escolha.">
    <div className="ts-choices"><button type="button" aria-pressed={!formal} onClick={()=>setFormal(false)}>Conversa entre amigos</button><button type="button" aria-pressed={formal} onClick={()=>setFormal(true)}>Solicitação institucional</button></div>
    <motion.div className="ts-letter" animate={{borderRadius:formal?'2px 2px 2px 2px':'24px 24px 24px 2px'}} transition={transition}>
      <small>{formal?'À secretaria':'Mensagem para uma amiga'}</small><p>{formal?'Poderia, por gentileza, encaminhar o documento?':'Me manda o documento, por favor?'}</p>
    </motion.div>
    <p className="ts-observation" role="status">{formal?'O pedido usa tratamento mais formal, adequado à situação institucional.':'O pedido usa um registro informal, adequado a uma relação de proximidade.'} Variação de registro não mede a inteligência nem o valor de quem fala.</p>
  </Studio>;
}

function Sources() {
  const [source,setSource]=useState(0);const transition=useInkMotion();
  const examples=[['Carta','Quem escreveu, para quem e com qual intenção?','O texto registra uma perspectiva situada; não dá acesso neutro a todo o acontecimento.'],['Objeto','Como foi produzido, usado e encontrado?','Material, marcas de uso e contexto arqueológico sustentam hipóteses sobre práticas sociais.'],['Depoimento','Quando a lembrança foi narrada e a quem?','A memória é uma fonte que precisa ser contextualizada e confrontada com outros vestígios.']];
  return <Studio title="Um vestígio não fala sozinho" note="Troque a fonte e observe como mudam as perguntas do historiador.">
    <div className="ts-choices">{examples.map(([name],i)=><button key={name} type="button" aria-pressed={source===i} onClick={()=>setSource(i)}>{name}</button>)}</div>
    <svg viewBox="0 0 480 220" role="img" aria-label={`Fonte histórica: ${examples[source][0]}`}>
      <motion.g key={source} initial={{opacity:0}} animate={{opacity:1}} transition={transition}>
        {source===0?<><path d="M170 25l144 9-9 158-141-9Z" className="ts-artifact"/>{[64,85,106,127,148].map(y=><path key={y} d={`M189 ${y}l92 6`} className="ts-guide"/>)}</>:source===1?<><path d="M214 35h54l-4 37q61 96-24 108q-80-13-30-108Z" className="ts-artifact"/><path d="M213 81h52M192 135q49 19 94 0" className="ts-reference"/></>:<><path d="M142 38h195v112H218l-45 37v-37h-31Z" className="ts-artifact"/><text x="195" y="126" fontSize="70">“ ”</text></>}
      </motion.g>
    </svg>
    <p className="ts-observation" role="status"><strong>{examples[source][1]}</strong> {examples[source][2]}</p><small>Ilustrações de tipos de fonte; não são reproduções de documentos ou objetos históricos específicos.</small>
  </Studio>;
}

function Inference() {
  const [selection,setSelection]=useState<number|null>(null);
  const options=['The bus was late.','Maya missed the beginning of the meeting.','Maya is always careless.'];
  const readings=['Informação explícita: o atraso do ônibus está declarado no texto.','Inferência sustentada: se ela chegou depois do início, não presenciou o começo.','Extrapolação: um episódio não permite concluir “always” nem julgar sua personalidade.'];
  return <Studio title="Até onde o texto permite ir?" note="Leia o microtexto em inglês e investigue o apoio de cada afirmação.">
    <blockquote className="ts-letter" lang="en">The bus was late. Maya arrived after the meeting had begun.</blockquote>
    <div className="ts-choices">{options.map((option,i)=><button key={option} type="button" lang="en" aria-pressed={selection===i} onClick={()=>setSelection(i)}>{option}</button>)}</div>
    {selection!==null&&<p className="ts-observation" role="status">{readings[selection]}</p>}<small>Microtexto original para este exercício. Diferencie explicit information, inference e unsupported assumption.</small>
  </Studio>;
}

function Literary() {
  const [figurative,setFigurative]=useState(false);const transition=useInkMotion();
  return <Studio title="A noite pode ter mãos?" note="Compare dois enunciados e observe a construção de sentido.">
    <div className="ts-choices"><button type="button" aria-pressed={!figurative} onClick={()=>setFigurative(false)}>Enunciado informativo</button><button type="button" aria-pressed={figurative} onClick={()=>setFigurative(true)}>Construção poética</button></div>
    <motion.div className="ts-letter" animate={{borderColor:figurative?'var(--vs-burgundy)':'var(--vs-line)'}} transition={transition}>
      <p>{figurative?'A noite pousou suas mãos sobre a cidade.':'Anoiteceu na cidade.'}</p>
    </motion.div>
    <p className="ts-observation" role="status">{figurative?'“Mãos” e “pousou” personificam a noite: a expressão convida a construir uma imagem, além de informar que anoiteceu.':'O enunciado comunica diretamente um acontecimento. Nesta comparação, predomina a função informativa.'}</p>
    <small>Exemplos originais. Linguagem figurada também ocorre fora da literatura; sua presença isolada não define um texto literário.</small>
  </Studio>;
}

const argumentSteps=[
  ['Tese','A mobilidade urbana deve priorizar o transporte coletivo.','Define uma posição discutível e orienta o restante do texto.'],
  ['Argumento','Faixas exclusivas reduzem a interferência do trânsito de automóveis na circulação dos ônibus.','Apresenta um mecanismo pertinente à posição defendida.'],
  ['Análise','Ao dar maior previsibilidade às viagens, essa prioridade pode tornar o transporte coletivo mais atraente.','Explica a relevância do argumento; não se limita a repetir a tese.'],
  ['Retomada','Por isso, priorizar o transporte coletivo exige medidas que melhorem a experiência cotidiana de quem o utiliza.','Retoma a posição incorporando o que foi desenvolvido.'],
];
function Argument() {
  const [step,setStep]=useState(0);const transition=useInkMotion();
  return <Studio title="Uma ideia prepara a próxima" note="Acompanhe um projeto de parágrafo: cada movimento acrescenta uma função à argumentação.">
    <ol className="ts-argument">{argumentSteps.map(([name,text],i)=><li key={name}>
      <button type="button" aria-pressed={step===i} onClick={()=>setStep(i)}>{String(i+1).padStart(2,'0')} · {name}</button>
      <motion.p animate={{opacity:step===i?1:.55}} transition={transition}>{text}</motion.p>
    </li>)}</ol>
    <p className="ts-observation" role="status"><strong>{argumentSteps[step][0]}:</strong> {argumentSteps[step][2]}</p>
    <small>Exemplo didático original. Uma estrutura possível, não uma fórmula obrigatória para toda redação.</small>
  </Studio>;
}

export function TopicExperiment({summaryId}:{summaryId:string}) {
  const kind=topicExperiments[summaryId];
  const Component=kind&&({coordinates:Coordinates,powers:Powers,ecology:Ecology,myth:Myth,solidarity:Solidarity,cohesion:Cohesion,variation:Variation,sources:Sources,inference:Inference,literary:Literary,argument:Argument}[kind]);
  return Component?<Component/>:null;
}
