import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GRAMMAR_INSTRUMENTS, type GrammarInstrumentId } from '../../lib/grammarInstrumentLab';

const ink = 'var(--vs-ink)', red = 'var(--vs-burgundy)', blue = 'var(--vs-blue)', paper = 'var(--vs-paper)';
function T({ x = 380, y, children, color = ink, size = 18, anchor = 'middle' }: { x?: number; y: number; children: React.ReactNode; color?: string; size?: number; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={anchor} fill={color} fontSize={size} fontFamily="Kalam, cursive">{children}</text>;
}
function Line({ d, color = red, dash = false }: { d: string; color?: string; dash?: boolean }) { return <path d={d} stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash ? '6 6' : undefined} />; }
function Arrow({ d, color = red, causal = false }: { d: string; color?: string; causal?: boolean }) { return <path d={d} fill="none" stroke={color} strokeWidth={3} markerEnd={`url(#syntax-${color === blue ? 'blue' : 'red'})`} data-causal-direction={causal ? 'agent-to-patient' : undefined} />; }
function Tag({ x, y, width, children, color = red }: { x: number; y: number; width: number; children: React.ReactNode; color?: string }) { return <g><path d={`M${x} ${y}h${width}v46h-${width}Z`} fill={paper} stroke={color} strokeWidth={2} /><T x={x + width / 2} y={y + 29} color={color}>{children}</T></g>; }
function Note({ lines }: { lines: string[] }) { return <g>{lines.map((line, i) => <T key={line} y={478 + i * 34}>{line}</T>)}</g>; }
function Sentence({ text }: { text: string }) {
  const lines = text.split(' ').reduce<string[]>((a, word) => { const last = a.at(-1); if (last && (last + ' ' + word).length <= 64) a[a.length - 1] += ' ' + word; else a.push(word); return a; }, []);
  return <g>{lines.map((line, i) => <T key={i} y={90 + i * 25} size={20}>{line}</T>)}</g>;
}
function Students({ all }: { all: boolean }) { return <g>{[0, 1, 2, 3, 4, 5].map(i => <g key={i}><circle cx={140 + i * 95} cy={252} r={16} fill={i < 3 || all ? blue : paper} stroke={ink} strokeWidth={2} /><path d={`M${120 + i * 95} 310v-20q20-24 40 0v20`} fill={i < 3 || all ? blue : paper} stroke={ink} strokeWidth={2} /><T x={140 + i * 95} y={347} size={16}>{i < 3 || all ? 'estudou' : 'outro'}</T></g>)}</g>; }
function Verb({ v }: { v: number }) { return <g>
  <Tag x={290} y={180} width={180}>{['chorou', 'encontrou', 'parece'][v]}</Tag>
  <T x={135} y={210}>{['O bebê', 'Ela', 'Ela'][v]}</T><Arrow d="M195 203H280" color={blue} />
  {v === 0 ? <><Line d="M490 178v50m10-50v50" /><T x={575} y={208}>sentido completo</T><T y={302}>O verbo não abre uma posição de objeto.</T></> : <><Arrow d="M480 203H530" /><Tag x={545} y={180} width={165} color={blue}>{v === 1 ? 'o livro' : 'cansada'}</Tag><T x={625} y={274}>{v === 1 ? 'objeto direto' : 'predicativo'}</T><T x={625} y={310}>{v === 1 ? 'o que encontrou?' : 'do sujeito'}</T>{v === 2 && <Arrow d="M625 330Q380 395 135 270" color={blue} />}</>}
  <T y={427} size={17} color={blue}>VTI: precisa de ajuda · VTDI: entregou o livro a Ana.</T><Note lines={v === 2 ? ['predicativo do sujeito: a característica recai sobre “Ela”.', 'O contexto determina a classificação do verbo.'] : ['A exigência do verbo organiza as posições da oração.', 'Circunstância pode aparecer mesmo sem objeto.']} />
</g>; }
function Agreement({ v }: { v: number }) { return <g>
  <T x={170} y={176} color={blue}>{['Os estudantes', 'sem sujeito', 'Casas'][v]}</T><T x={580} y={176} color={red}>{['chegaram cedo', 'havia estudantes', 'vendem-se'][v]}</T>
  <Line d="M74 190H268M475 190H690" color={blue} />
  {v === 1 ? <><Line d="M170 220l38 38m0-38l-38 38" /><T x={180} y={320}>“estudantes” é objeto</T><T x={580} y={280}>haver = existir</T><T x={580} y={310}>singular impessoal</T></> : <><Arrow d="M210 250C350 210 430 210 550 250" color={blue} /><T y={305}>plural → plural</T><T y={355}>{v === 0 ? 'núcleo plural: estudantes' : 'sujeito paciente: casas'}</T><T y={388}>{v === 0 ? 'Número e pessoa chegam à flexão verbal.' : 'Teste: Casas são vendidas.'}</T></>}
  <Note lines={[v === 1 ? 'Não escreva “haviam estudantes” nesse sentido.' : v === 2 ? '“se” apassivador: o sujeito paciente controla o verbo.' : 'Localize o núcleo, mesmo quando outros termos o separam.', 'Concordância segue a estrutura, não a palavra mais próxima.']} />
</g>; }
function Comma({ v }: { v: number }) { return <g>
  <T y={205} size={16}>Exemplo: grupo de seis alunos.</T><Students all={Boolean(v)} /><path d={v ? 'M104 220H654V366H104Z' : 'M104 220H368V366H104Z'} fill="none" stroke={red} strokeWidth={3} strokeDasharray="8 5" />
  <T y={177} color={red}>{v ? 'vírgulas abrem um comentário' : 'sem vírgulas: filtro do conjunto'}</T><T y={414} size={22}>{v ? '6 de 6 alunos' : '3 de 6 alunos'}</T>
  <Note lines={[v ? 'A afirmação alcança todos; estudar é explicado à parte.' : 'Só o subconjunto que estudou é afirmado como aprovado.', 'A pontuação muda o alcance, não só a pausa da leitura.']} />
</g>; }
function Punctuation({ v }: { v: number }) { return <g>
  {v === 0 ? <><Tag x={50} y={212} width={170}>Chegou</Tag><T x={245} y={242} size={32} color={red}>,</T><Tag x={280} y={212} width={150}>sentou</Tag><T x={460} y={242} size={32} color={red}>,</T><Tag x={500} y={212} width={210}>começou a escrever</Tag><Line d="M135 282v65h460v-65" color={blue} /><T y={380}>três orações → coordenação assindética</T></> : v === 1 ? <><T x={207} y={190}>As metas foram cumpridas</T><T x={380} y={250} color={red} size={40}>;</T><T x={553} y={308}>os prazos, respeitados</T><Line d="M420 325H700" color={blue} /><T x={530} y={382}>verbo elíptico: foram</T><Arrow d="M530 350Q380 310 210 215" color={blue} /></> : <><T x={210} y={215}>Faltava uma coisa</T><T x={380} y={230} size={42} color={red}>:</T><Arrow d="M410 240Q470 330 570 285" /><T x={575} y={265} size={26}>coragem</T><T y={380}>explicação anunciada</T></>}
  <Note lines={['O sinal mostra a organização das orações e dos termos.', v === 1 ? 'A vírgula marca elipse; o ponto e vírgula separa os blocos.' : v === 2 ? 'Os dois-pontos tornam explícito o conteúdo de “uma coisa”.' : 'A vírgula separa ações, sem separar sujeito e verbo.']} />
</g>; }
function Government({ v }: { v: number }) { return <g>
  <T x={160} y={172}>regente</T><T x={390} y={172}>ponte exigida</T><T x={625} y={172}>complemento</T>
  <path d="M55 205H250V235H285V265H250V295H55Z" fill={paper} stroke={blue} strokeWidth={3} /><path d="M500 205H700V295H500V265H465V235H500Z" fill={paper} stroke={red} strokeWidth={3} />
  <T x={155} y={257}>{['Assisti', 'Obedeço', 'Preciso'][v]}</T><T x={390} y={257} size={28} color={red}>{v === 2 ? 'de' : 'a'}</T><T x={610} y={257}>{['o filme', 'as regras', 'ajuda'][v]}</T>
  <Line d="M285 250H347M426 250H465" /><T y={354} size={22}>{['a + o = ao', 'a + as = às', 'de + ajuda'][v]}</T><T y={394}>{v === 0 ? 'assistir = ver → exige a' : v === 1 ? 'obedecer a algo → exige a' : 'precisar de algo → exige de'}</T><T y={435} size={17} color={blue}>Regência nominal: respeito → a → regras.</T>
  <Note lines={['A preposição faz o encaixe que este sentido do verbo pede.', 'Trocar o sentido do regente pode trocar a regência.']} />
</g>; }
function Crasis({ v }: { v: number }) { const left = v !== 1, right = v !== 2; return <g>
  <T x={175} y={174}>exigência anterior</T><T x={585} y={174}>elemento seguinte</T>
  <circle cx={175} cy={240} r={52} fill={paper} stroke={left ? blue : ink} strokeWidth={3} /><circle cx={585} cy={240} r={52} fill={paper} stroke={right ? red : ink} strokeWidth={3} />
  <T x={175} y={250} size={28}>{left ? 'a' : 'Ø'}</T><T x={585} y={250} size={25}>{right ? v === 3 ? 'aquele' : 'a' : 'Ø'}</T>
  <Arrow d="M235 258L330 330" color={blue} /><Arrow d="M525 258L430 330" />
  <T y={370} size={36} color={red}>{v === 0 ? 'à' : v === 3 ? 'àquele' : 'a'}</T><T y={416}>{['duas origens: preposição + artigo', 'falta preposição: só artigo', 'falta artigo: estudar é verbo', 'a + aquele: demonstrativo'][v]}</T>
  <Note lines={['Verifique os dois lados antes de escrever o acento grave.', v === 0 ? 'Teste masculino: ao diretor → à diretora.' : v === 3 ? 'Não depende de substantivo feminino: àquele episódio.' : 'Uma origem só não produz fusão.']} />
</g>; }
function Nominal({ v }: { v: number }) { const rows = [
  ['adjunto adnominal', 'O livro de Ana chegou.', 'de Ana → posse; caracteriza o nome'],
  ['complemento nominal', 'O respeito às regras cresce.', 'às regras → alvo do respeito'],
  ['aposto', 'Ana, nossa monitora, chegou.', 'nossa monitora = Ana; identifica'],
  ['vocativo', 'Ana, revise o texto!', 'Ana → destinatária; fora da oração'],
]; return <g>{rows.map((r, i) => { const y = 152 + i * 82; return <g key={r[0]}>
  <T x={36} y={y} anchor="start" color={i === (v === 2 ? 3 : v) ? red : blue} size={18}>{r[0]}</T><T x={330} y={y} anchor="start" size={18}>{r[1]}</T><T x={330} y={y + 29} anchor="start" size={16}>{r[2]}</T>
  <Line d={`M36 ${y + 10}H285`} color={i === 3 ? red : blue} dash={i === 3} />{i === 2 && <Line d={`M330 ${y + 39}H690`} />}
</g>; })}<Note lines={['Preposição sozinha não distingue adjunto e complemento.', 'Aposto identifica; vocativo chama e não é sujeito.']} /></g>; }
function Subject({ v }: { v: number }) { return <g>
  <path d="M380 148V190M160 230L380 190L600 230" fill="none" stroke={ink} strokeWidth={2} /><T y={165}>oração</T>
  <T x={160} y={264} color={blue}>{['Os alunos', 'quem?', 'sem posição de sujeito'][v]}</T><T x={600} y={264} color={red}>{['chegaram', 'falaram', 'choveu'][v]}</T>
  {v === 0 ? <><Line d="M115 280H207" color={blue} /><T x={160} y={321}>núcleo expresso</T><T x={160} y={361}>alunos</T></> : v === 1 ? <><circle cx={160} cy={330} r={28} fill={paper} stroke={blue} strokeWidth={2} strokeDasharray="5 4" /><T x={160} y={337} size={26}>?</T><T y={410}>referente não recuperável</T></> : <><Line d="M125 303l70 50m0-50l-70 50" /><T y={410}>oração sem sujeito</T></>}
  <Note lines={[v === 1 ? 'Sem contexto que recupere “eles”: sujeito indeterminado.' : v === 2 ? 'Chover, no sentido meteorológico, é impessoal.' : 'Sujeito simples: um núcleo, mesmo com vários indivíduos.', 'Oculto: “Cheguei.” (eu) · Composto: “Ana e Bia chegaram.”']} />
</g>; }
function Voice({ v }: { v: number }) { return <g>
  <T x={160} y={175} color={blue}>agente</T><T x={610} y={175} color={red}>paciente</T>
  <circle cx={160} cy={240} r={66} fill={paper} stroke={blue} strokeWidth={3} strokeDasharray={v === 2 ? '7 5' : undefined} /><path d="M530 190H690V290H530Z" fill={paper} stroke={red} strokeWidth={3} />
  <T x={160} y={246}>{v === 2 ? 'não informado' : 'professor'}</T><T x={610} y={246}>provas</T><Arrow d="M250 240H510" causal /><T y={223} color={red}>corrigir</T>
  <g data-textual-order={v ? 'patient-first' : 'agent-first'}><T y={349}>{v === 2 ? 'provas → foram corrigidas' : v === 1 ? 'provas → foram corrigidas → pelo professor' : 'professor → corrigiu → provas'}</T></g>
  <T y={409} size={22}>{['sujeito agente', 'sujeito paciente', 'agente não expresso'][v]}</T>
  <Note lines={['A ordem da frase muda; a ação continua agente → paciente.', 'Reflexiva: Ana penteou-se (agente e paciente coincidem).' ]} />
</g>; }
function NounClause({ v }: { v: number }) { const rows = [['subjetiva', 'É importante que ela estude.'], ['objetiva direta', 'Ela espera que ele chegue.'], ['objetiva indireta', 'Ela precisa de que a apoiem.'], ['completiva nominal', 'Ela tem certeza de que vencerá.'], ['predicativa', 'O desejo é que todos voltem.'], ['apositiva', 'Só peço isto: que me escutem.']]; return <g>
  <T y={146} color={red} size={22}>{['Isso é importante.', 'Ela espera isso.', 'Ela tem certeza disso.'][v]}</T>
  <Line d="M160 165H600" color={blue} /><T y={199}>A oração inteira ocupa uma posição nominal.</T>
  {rows.map((r, i) => { const y = 240 + i * 35; const active = i === [0, 1, 3][v]; return <g key={r[0]}><T x={40} y={y} anchor="start" color={active ? red : ink} size={17}>{r[0]}</T><Arrow d={`M236 ${y - 7}H288`} color={active ? red : blue} /><T x={315} y={y} anchor="start" size={17}>{r[1]}</T></g>; })}
  <Note lines={['“Isso” é teste de posição; preserve a preposição exigida.', 'O verbo ou o nome regente decide a função, não o “que”.']} />
</g>; }
function Adjective({ v }: { v: number }) { return <g>
  <T x={160} y={184} size={22}>{v === 2 ? 'cidade' : 'alunos'}</T><T x={475} y={184} size={22} color={red}>{v === 2 ? 'onde nasci' : v === 1 ? ', que estudaram bastante,' : 'que estudaram'}</T>
  <Arrow d="M470 210Q320 300 180 210" color={blue} /><T y={294}>{v === 2 ? 'onde = em que' : 'que retoma alunos'}</T>
  {v === 2 ? <><path d="M210 375l70-55 70 55v60H210Z" fill={paper} stroke={blue} strokeWidth={3} /><T x={520} y={365}>antecedente de lugar</T><T x={520} y={400}>oração restritiva</T></> : <><circle cx={275} cy={385} r={48} fill={paper} stroke={blue} strokeWidth={2} /><circle cx={v ? 275 : 262} cy={385} r={v ? 48 : 24} fill="none" stroke={red} strokeWidth={3} /><T x={540} y={392}>{v ? 'explica todo o grupo' : 'recorta o antecedente'}</T></>}
  <Note lines={[v === 2 ? '“Locativo” descreve o relativo; não é terceira classe adjetiva.' : 'Restritiva seleciona; explicativa acrescenta informação.', 'A oração depende de um nome antecedente, não do verbo.']} />
</g>; }
function Adverbial({ v }: { v: number }) { return <g>
  <T x={200} y={177} color={blue}>{['estava chovendo', 'estudar', 'estava cansada'][v]}</T><T x={560} y={330} color={red}>{['adiamos o passeio', 'ela passará', 'terminou o trabalho'][v]}</T>
  {v === 0 ? <><Arrow d="M240 205Q300 320 430 320" /><T x={345} y={241}>Como</T></> : v === 1 ? <><path d="M300 200l65 65-65 65-65-65Z" fill={paper} stroke={blue} strokeWidth={2} /><T x={300} y={272}>se</T><Arrow d="M370 267L440 310" /><T x={530} y={245}>condição satisfeita?</T></> : <><Arrow d="M230 210Q300 260 440 270" color={blue} /><T x={550} y={245}>não terminaria</T><Line d="M443 252l200 25m0-25l-200 25" /><Arrow d="M200 210Q110 380 430 330" /><T x={260} y={371}>Embora</T></>}
  <T y={426} size={22}>{['causa do adiamento', 'condição não é certeza', 'expectativa contrariada'][v]}</T>
  <Note lines={['A subordinada acrescenta uma circunstância à principal.', v === 1 ? '“Se” não afirma que estudar ou passar já aconteceu.' : v === 2 ? 'A dificuldade é admitida, mas não impede o resultado.' : 'O fato anterior explica por que o passeio foi adiado.']} />
</g>; }
function Relations({ v }: { v: number }) { return <g>
  <T x={190} y={197}>{v === 2 ? 'Não comparou as fontes' : 'Leu os dados'}</T><T x={560} y={337}>{v === 0 ? 'comparou as fontes' : v === 1 ? 'não comparou as fontes' : 'errou a conclusão'}</T>
  {v === 0 ? <><T x={380} y={274} size={46} color={red}>+</T><Line d="M190 225V375H560V360" color={blue} /><T x={380} y={398}>e</T></> : v === 1 ? <><Arrow d="M240 230L465 298" /><Line d="M350 240l40 50m0-50l-40 50" color={blue} /><T x={460} y={254}>mas</T></> : <><Arrow d="M245 230L470 300" /><T x={440} y={254}>portanto</T><T x={160} y={357}>premissa</T></>}
  <T y={432} size={22}>{['ações somadas', 'expectativa quebrada', 'conclusão inferida'][v]}</T>
  <Note lines={['As orações coordenadas têm autonomia sintática.', v === 2 ? 'O conectivo apresenta uma inferência do enunciador.' : 'O conectivo orienta como relacionar as duas ações.']} />
</g>; }

export function GrammarSyntaxScene({ id, value }: { id: GrammarInstrumentId; value: number }) {
  const reduced = useReducedMotion();
  const config = GRAMMAR_INSTRUMENTS[id];
  const v = Math.max(config.control.min, Math.min(config.control.max, Math.round(value)));
  const scene = (() => { switch (id) {
    case 'verb-syntax': return <Verb v={v} />;
    case 'agreement': return <Agreement v={v} />;
    case 'comma-scope': return <Comma v={v} />;
    case 'clause-punctuation': return <Punctuation v={v} />;
    case 'government': return <Government v={v} />;
    case 'crasis': return <Crasis v={v} />;
    case 'nominal-function': return <Nominal v={v} />;
    case 'subject-type': return <Subject v={v} />;
    case 'verbal-voice': return <Voice v={v} />;
    case 'noun-clause': return <NounClause v={v} />;
    case 'adjective-clause': return <Adjective v={v} />;
    case 'adverbial-clause': return <Adverbial v={v} />;
    case 'clause-relations': return <Relations v={v} />;
    default: return null;
  } })();
  if (!scene) return null;
  const sentence = config.readouts(v).find(r => ['Frase', 'Período', 'Construção'].includes(r.label))?.value ?? (id === 'agreement' ? ['Os estudantes chegaram cedo.', 'Havia estudantes.', 'Casas vendem-se.'][v] : id === 'nominal-function' ? 'Um nome pode modificar, completar, identificar ou chamar.' : '');
  return <g data-syntax-scene={id} data-state={v} data-motion={reduced ? 'reduced' : 'finite'}>
    <defs>{[['red', red], ['blue', blue]].map(([name, color]) => <marker key={name} id={`syntax-${name}`} viewBox="0 0 10 10" refX={8} refY={5} markerWidth={6} markerHeight={6} orient="auto"><path d="M0 0L10 5L0 10Z" fill={color} /></marker>)}</defs>
    <T x={28} y={42} anchor="start" size={22} color={red}>{config.name}</T><Sentence text={sentence} />
    <motion.g key={`${id}-${v}`} initial={reduced ? false : { opacity: .65 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0 : .2 }}>{scene}</motion.g>
  </g>;
}
