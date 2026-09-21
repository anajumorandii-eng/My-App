import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GRAMMAR_INSTRUMENTS, agreementCase, commaReading, crasisCase, nounPhrase, voiceCase, type GrammarInstrumentId } from '../../lib/grammarInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const short = (text?: string) => {
  const sentence = text?.trim().split(/(?<=[.!?])\s/)[0] ?? '';
  return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence;
};

const textStyle = { fill: 'var(--vs-ink)', fontWeight: 800 } as const;

function NounPhraseScene({ value }: { value: number }) {
  const words = nounPhrase(value);
  const roles: Record<string, string> = { as: 'artigo', duas: 'numeral', propostas: 'núcleo', urgentes: 'adjetivo' };
  const width = 260 / words.length;
  return <>{words.map((word, index) => {
    const x = 30 + index * width;
    return <g key={word}><rect x={x} y="105" width={width - 8} height="64" rx="10" fill={word === 'propostas' ? 'color-mix(in srgb,var(--vs-burgundy) 28%,var(--vs-paper))' : 'var(--vs-paper)'} stroke={word === 'propostas' ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth="2" /><text x={x + (width - 8) / 2} y="132" textAnchor="middle" style={textStyle}>{word}</text><text x={x + (width - 8) / 2} y="153" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>{roles[word]}</text><path d={`M${x + (width - 8) / 2} 169V215`} stroke="var(--vs-ink-muted)" /></g>;
  })}<path d="M48 215H272" stroke="var(--vs-ink)" strokeWidth="3" /><text x="160" y="239" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>“As duas propostas urgentes”</text><text x="160" y="267" textAnchor="middle" style={textStyle}>um sintagma · um núcleo</text></>;
}

function AgreementScene({ value }: { value: number }) {
  const item = agreementCase(value);
  return <><text x="160" y="57" textAnchor="middle" style={{...textStyle,fontSize:13}}>a concordância atravessa a oração</text><rect x="25" y="95" width="115" height="76" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="180" y="95" width="115" height="76" rx="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" /><path d="M140 133H178" stroke="var(--vs-burgundy)" strokeWidth="5" markerEnd="url(#grammar-arrow)" /><text x="82" y="126" textAnchor="middle" style={textStyle}>SUJEITO</text><text x="82" y="151" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{item.subject}</text><text x="237" y="126" textAnchor="middle" style={textStyle}>VERBO</text><text x="237" y="151" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{item.predicate}</text><path d="M48 205H272" stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="160" y="230" textAnchor="middle" style={textStyle}>{item.rule}</text><text x="160" y="255" textAnchor="middle" style={{fill:'var(--vs-ink-muted)',fontSize:12}}>{item.subject} {item.predicate}</text></>;
}

function CommaScene({ value }: { value: number }) {
  const explanatory = Boolean(value);
  const item = commaReading(explanatory);
  return <><text x="160" y="55" textAnchor="middle" style={{...textStyle,fontSize:13}}>Os estudantes {explanatory ? ', que estudaram,' : 'que estudaram'} passaram.</text><g>{[68, 100, 132, 188, 220, 252].map((x, index) => <circle key={x} cx={x} cy="130" r="15" fill={explanatory || index < 3 ? 'var(--vs-burgundy)' : 'var(--vs-paper)'} stroke="var(--vs-ink)" strokeWidth="2" />)}</g><path d={explanatory ? 'M42 88H278V172H42Z' : 'M44 88H156V172H44Z'} fill="none" stroke="var(--vs-burgundy)" strokeWidth="3" strokeDasharray="7 5" /><text x="160" y="215" textAnchor="middle" style={textStyle}>{item.role}: {item.scope}</text><text x="160" y="251" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{explanatory ? 'informação acessória' : 'restrição do grupo'}</text></>;
}

function CrasisScene({ value }: { value: number }) {
  const item = crasisCase(value);
  const fused = item.result.startsWith('à');
  return <><text x="160" y="52" textAnchor="middle" style={{...textStyle,fontSize:13}}>vou {item.result} escola</text><rect x="35" y="90" width="78" height="58" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="207" y="90" width="78" height="58" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><text x="74" y="125" textAnchor="middle" style={textStyle}>{fused ? 'a' : 'sem a'}</text><text x="246" y="125" textAnchor="middle" style={textStyle}>{fused ? 'a / aquele' : 'sem artigo'}</text><path d="M114 119L145 148M206 119L175 148" stroke="var(--vs-burgundy)" strokeWidth="4" /><circle cx="160" cy="164" r="42" fill="color-mix(in srgb,var(--vs-burgundy) 25%,var(--vs-paper))" stroke="var(--vs-burgundy)" strokeWidth="3" /><text x="160" y="174" textAnchor="middle" style={{ ...textStyle, fontSize: 28 }}>{item.result}</text><text x="160" y="242" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{item.reason}</text></>;
}

function VoiceScene({ value }: { value: number }) {
  const item = voiceCase(value);
  const passive = value > 0;
  return <><rect x="25" y="105" width="95" height="62" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="200" y="105" width="95" height="62" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><path d={passive ? 'M198 136H124' : 'M122 136H196'} stroke="var(--vs-burgundy)" strokeWidth="6" markerEnd="url(#grammar-arrow)" /><text x="72" y="133" textAnchor="middle" style={textStyle}>{item.agent}</text><text x="72" y="153" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>agente</text><text x="247" y="133" textAnchor="middle" style={textStyle}>{item.patient}</text><text x="247" y="153" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>paciente</text><text x="160" y="220" textAnchor="middle" style={textStyle}>foco: {item.focus}</text></>;
}

type WideRelationId = 'language-system' | 'noun-class' | 'text-type' | 'adverb-circumstance' | 'verb-syntax' | 'implicit-meaning' | 'discourse-type' | 'clause-punctuation'
  | 'lexical-context' | 'government' | 'word-formation' | 'nominal-function' | 'subject-type' | 'noun-clause' | 'adjective-clause' | 'adverbial-clause';

const WIDE_RELATION_IDS: readonly WideRelationId[] = ['language-system', 'noun-class', 'text-type', 'adverb-circumstance', 'verb-syntax', 'implicit-meaning', 'discourse-type', 'clause-punctuation',
  'lexical-context', 'government', 'word-formation', 'nominal-function', 'subject-type', 'noun-clause', 'adjective-clause', 'adverbial-clause'];
function isWideRelationId(id: GrammarInstrumentId): id is WideRelationId {
  return (WIDE_RELATION_IDS as readonly string[]).includes(id);
}

/**
 * Cada id desta leva compartilha o mesmo esqueleto visual (frase em cima, dois
 * rótulos comparados embaixo) porque o "objeto manipulável" destes 16
 * capítulos é a leitura da frase, não uma figura geométrica — decisão de
 * 21/09/2026 da Ana Júlia para maximizar cobertura de Gramática (ver
 * CLAUDE.md). Nenhum layout é copiado de outro: cada `id` fixa suas três
 * frases e seus dois rótulos próprios, então nenhum capítulo herda a leitura
 * de outro.
 */
function WideRelationScene({ id, value }: { id: WideRelationId; value: number }) {
  const selected = Math.round(value);
  const data: Record<WideRelationId, { sentences: string[]; top: string[]; bottom: string[]; caption: string }> = {
    'language-system': { sentences: ['“pato” → “bato”', '“gato” → “gatinho”', '“O cão mordeu o gato.” → “O gato mordeu o cão.”'], top: ['fonema', 'morfema', 'ordem sintática'], bottom: ['referente muda', 'grau/afeto muda', 'agente e paciente se invertem'], caption: 'cada nível se apoia no de baixo' },
    'noun-class': { sentences: ['cadeira', 'coragem', 'cardume'], top: ['concreto', 'abstrato', 'coletivo'], bottom: ['objeto do mundo', 'só existe na ideia', 'muitos seres, um nome'], caption: 'a visão do enunciador escolhe a classe' },
    'text-type': { sentences: ['Ela abriu a porta e entrou correndo.', 'A sala era pequena, com paredes brancas.', 'A liberdade pressupõe responsabilidade.'], top: ['narrativo', 'descritivo', 'dissertativo'], bottom: ['sucessão de ações', 'propriedades do espaço', 'relação entre ideias'], caption: 'cada tipo organiza por um eixo diferente' },
    'adverb-circumstance': { sentences: ['Ela chegou ontem.', 'Ela mora aqui.', 'Ela respondeu calmamente.'], top: ['tempo', 'lugar', 'modo'], bottom: ['quando?', 'onde?', 'como?'], caption: 'o advérbio responde a uma pergunta fixa' },
    'verb-syntax': { sentences: ['O bebê chorou.', 'Ela encontrou o livro.', 'Ela parece cansada.'], top: ['intransitivo', 'transitivo direto', 'de ligação'], bottom: ['sentido já fechado', 'pede objeto direto', 'liga sujeito e predicativo'], caption: 'a sintaxe nasce da exigência do verbo' },
    'implicit-meaning': { sentences: ['Pedro parou de fumar.', 'Até o João passou na prova.', '— Você pode passar o sal?'], top: ['pressuposto lexical', 'pressuposto marcado', 'subentendido'], bottom: ['Pedro fumava antes', 'outros também passaram', 'é um pedido, não dúvida'], caption: 'pressuposto resiste à negação; subentendido não' },
    'discourse-type': { sentences: ['Ela disse: “Vou viajar amanhã.”', 'Ela disse que viajaria no dia seguinte.', 'Olhou pela janela. Viajaria amanhã, enfim.'], top: ['discurso direto', 'discurso indireto', 'indireto livre'], bottom: ['aspas/travessão marcam a voz', '“que” funde à voz do narrador', 'nenhuma marca gráfica'], caption: 'a marca gráfica mede a fusão das vozes' },
    'clause-punctuation': { sentences: ['Chegou, sentou, começou a escrever.', 'As metas foram cumpridas; os prazos, respeitados.', 'Faltava uma coisa: coragem.'], top: ['vírgula', 'ponto e vírgula', 'dois-pontos'], bottom: ['separa orações simples', 'separa orações já pontuadas', 'introduz explicação'], caption: 'o sinal certo evita ambiguidade' },
    'lexical-context': { sentences: ['Sacou dinheiro no banco.', 'Sentou no banco da praça.', 'Consultou o banco de dados.'], top: ['instituição', 'assento', 'conjunto de dados'], bottom: ['“sacou dinheiro”', '“da praça”', '“de dados”'], caption: 'o contexto escolhe o sentido' },
    government: { sentences: ['Assisti ao filme.', 'Obedeço às regras.', 'Preciso de ajuda.'], top: ['assistir', 'obedecer', 'precisar'], bottom: ['exige “a”', 'exige “a”', 'exige “de”'], caption: 'cada verbo regente tem sua preposição' },
    'word-formation': { sentences: ['felicidade', 'infeliz', 'girassol'], top: ['sufixação', 'prefixação', 'composição'], bottom: ['feliz + -idade', 'in- + feliz', 'gira + sol'], caption: 'derivação usa afixo; composição junta bases' },
    'nominal-function': { sentences: ['O aluno estudou.', 'Vi o aluno.', 'Aluno, preste atenção!'], top: ['sujeito', 'objeto direto', 'vocativo'], bottom: ['pratica a ação', 'recebe a ação', 'chamamento isolado'], caption: 'vocativo fica fora da estrutura da oração' },
    'subject-type': { sentences: ['Os alunos chegaram.', 'Falaram mal do filme.', 'Choveu à noite.'], top: ['simples', 'indeterminado', 'inexistente'], bottom: ['sujeito nomeado', 'quem, não se sabe', 'verbo sem sujeito possível'], caption: 'indeterminado existe; inexistente não tem quem' },
    'noun-clause': { sentences: ['É importante que ela estude.', 'Ela espera que ele chegue.', 'Ela tem certeza de que vencerá.'], top: ['subjetiva', 'objetiva direta', 'completiva nominal'], bottom: ['sujeito de “é importante”', 'objeto de “espera”', 'completa “certeza”'], caption: 'troque por “isso” e a função aparece' },
    'adjective-clause': { sentences: ['Os alunos que estudaram passaram.', 'Os alunos, que estudaram, passaram.', 'A cidade onde nasci mudou muito.'], top: ['restritiva', 'explicativa', 'locativa'], bottom: ['restringe o grupo', 'acrescenta informação', 'retoma um lugar'], caption: 'o relativo retoma o antecedente de formas diferentes' },
    'adverbial-clause': { sentences: ['Como estava chovendo, adiamos o passeio.', 'Se estudar, ela passará.', 'Embora estivesse cansada, terminou o trabalho.'], top: ['causal', 'condicional', 'concessiva'], bottom: ['explica a causa', 'impõe condição', 'contraria a expectativa'], caption: 'a conjunção fixa a relação lógica' },
  };
  const item = data[id];
  const sentence = item.sentences[selected];
  const long = sentence.length > 34;
  return <>
    <text x="160" y={long ? 46 : 53} textAnchor="middle" style={{ ...textStyle, fontSize: long ? 12 : 13 }}>{sentence}</text>
    <rect x="28" y="86" width="112" height="70" rx="12" fill="var(--vs-paper)" stroke={selected === 0 ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3" />
    <rect x="180" y="86" width="112" height="70" rx="12" fill="var(--vs-paper)" stroke={selected === 2 ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3" />
    <text x="84" y="115" textAnchor="middle" style={{ ...textStyle, fontSize: 13 }}>{item.top[selected]}</text>
    <text x="84" y="140" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 11 }}>{item.top[0] === item.top[selected] ? 'caso atual' : 'categoria'}</text>
    <text x="236" y="115" textAnchor="middle" style={{ ...textStyle, fontSize: 12 }}>{item.bottom[selected]}</text>
    <path d="M141 121H179" stroke="var(--vs-burgundy)" strokeWidth="5" markerEnd="url(#grammar-arrow)" />
    <text x="160" y="218" textAnchor="middle" style={textStyle}>{item.caption}</text>
    <text x="160" y="248" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>{item.top[selected]} · {item.bottom[selected]}</text>
  </>;
}

function RelationScene({ id, value }: { id: Extract<GrammarInstrumentId, 'pronoun-reference' | 'verbal-aspect' | 'ambiguity' | 'clause-relations'>; value: number }) {
  const selected = Math.round(value);
  if (id === 'pronoun-reference') return <><text x="160" y="53" textAnchor="middle" style={{...textStyle,fontSize:13}}>o referente precisa caber no contexto</text><rect x="28" y="88" width="112" height="72" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><rect x="180" y="88" width="112" height="72" rx="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="84" y="124" textAnchor="middle" style={textStyle}>{selected === 1 ? 'ideia anterior' : selected === 2 ? 'Ana · Bia' : 'Marina'}</text><text x="236" y="124" textAnchor="middle" style={{...textStyle,fontSize:22}}>{selected === 1 ? 'isso' : 'ela'}</text><path d="M145 124H175" stroke="var(--vs-burgundy)" strokeWidth="5" markerEnd="url(#grammar-arrow)"/><text x="160" y="218" textAnchor="middle" style={textStyle}>{selected === 2 ? 'dois referentes possíveis' : 'retomada recuperável'}</text><text x="160" y="252" textAnchor="middle" style={{fill:'var(--vs-ink-muted)',fontSize:12}}>{selected === 2 ? 'reescreva com o nome' : 'teste: quem / o quê?'}</text></>;
  if (id === 'verbal-aspect') return <><text x="160" y="52" textAnchor="middle" style={{...textStyle,fontSize:13}}>a forma verbal escolhe o recorte da ação</text><path d="M38 155H282" stroke="var(--vs-ink)" strokeWidth="4"/><motion.path d={`M70 155H${[145,205,255][selected]}`} stroke="var(--vs-burgundy)" strokeWidth="9" strokeLinecap="round" initial={false} animate={{ pathLength: 1 }} transition={{duration:.25}}/><circle cx={[145,205,255][selected]} cy="155" r="15" fill="var(--vs-burgundy)"/><text x="84" y="116" textAnchor="middle" style={textStyle}>estudava</text><text x="160" y="116" textAnchor="middle" style={textStyle}>está estudando</text><text x="245" y="116" textAnchor="middle" style={textStyle}>estudou</text><text x="160" y="224" textAnchor="middle" style={textStyle}>{['duração / hábito', 'processo em curso', 'evento concluído'][selected]}</text></>;
  if (id === 'ambiguity') return <><text x="160" y="53" textAnchor="middle" style={{...textStyle,fontSize:13}}>“Vi a aluna com o telescópio.”</text><rect x="28" y="100" width="108" height="66" rx="12" fill="var(--vs-paper)" stroke={selected === 1 ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3"/><rect x="184" y="100" width="108" height="66" rx="12" fill="var(--vs-paper)" stroke={selected === 2 ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3"/><text x="82" y="138" textAnchor="middle" style={textStyle}>observador</text><text x="238" y="138" textAnchor="middle" style={textStyle}>aluna</text><path d={selected === 0 ? 'M112 198Q160 165 208 198M208 198Q160 230 112 198' : selected === 1 ? 'M84 168V212H160' : 'M238 168V212H160'} fill="none" stroke="var(--vs-burgundy)" strokeWidth="5"/><text x="160" y="252" textAnchor="middle" style={textStyle}>{['duas leituras em disputa', 'telescópio: observador', 'telescópio: aluna'][selected]}</text></>;
  return <><text x="160" y="55" textAnchor="middle" style={{...textStyle,fontSize:13}}>a seta muda com o conectivo</text><rect x="24" y="102" width="100" height="58" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><rect x="196" y="102" width="100" height="58" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><text x="74" y="136" textAnchor="middle" style={textStyle}>oração A</text><text x="246" y="136" textAnchor="middle" style={textStyle}>oração B</text><path d="M129 130H190" stroke="var(--vs-burgundy)" strokeWidth="5" markerEnd="url(#grammar-arrow)"/><text x="160" y="94" textAnchor="middle" style={{fill:'var(--vs-burgundy)',fontWeight:800}}>{['e', 'mas', 'portanto'][selected]}</text><text x="160" y="220" textAnchor="middle" style={textStyle}>{['soma', 'contraste', 'consequência'][selected]}</text><text x="160" y="248" textAnchor="middle" style={{fill:'var(--vs-ink-muted)',fontSize:12}}>não é só troca de palavra</text></>;
}

function GrammarScene({ id, value }: { id: GrammarInstrumentId; value: number }) {
  return <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${GRAMMAR_INSTRUMENTS[id].name}; ${GRAMMAR_INSTRUMENTS[id].control.display(value)}`}>
    <defs><marker id="grammar-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="var(--vs-burgundy)" /></marker></defs>
    {id === 'noun-phrase' && <NounPhraseScene value={value} />}
    {id === 'agreement' && <AgreementScene value={value} />}
    {id === 'comma-scope' && <CommaScene value={value} />}
    {id === 'crasis' && <CrasisScene value={value} />}
    {id === 'verbal-voice' && <VoiceScene value={value} />}
    {(id === 'pronoun-reference' || id === 'verbal-aspect' || id === 'ambiguity' || id === 'clause-relations') && <RelationScene id={id} value={value} />}
    {isWideRelationId(id) && <WideRelationScene id={id} value={value} />}
  </svg>;
}

export function grammarInstrument(id: GrammarInstrumentId) {
  const config = GRAMMAR_INSTRUMENTS[id];
  return function GrammarBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find((item) => item.pivot) ?? readouts[0];
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Oficina de estrutura" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de gramática: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><GrammarScene id={id} value={value} /><p className="vs-instrument-dica">mude a construção e compare estrutura e sentido</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`grammar-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{config.control.display(value)}</b></label><input id={`grammar-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Estrutura em foco', general: config.relation, condition: 'leitura', reduced: pivot.value }} closing={config.insight} />;
  };
}
