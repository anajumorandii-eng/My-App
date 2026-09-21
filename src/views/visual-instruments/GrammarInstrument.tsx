import React, { useState } from 'react';
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
  })}<path d="M48 215H272" stroke="var(--vs-ink)" strokeWidth="3" /><text x="160" y="250" textAnchor="middle" style={textStyle}>um sintagma · um núcleo</text></>;
}

function AgreementScene({ value }: { value: number }) {
  const item = agreementCase(value);
  return <><rect x="25" y="95" width="115" height="76" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="180" y="95" width="115" height="76" rx="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" /><path d="M140 133H178" stroke="var(--vs-burgundy)" strokeWidth="5" markerEnd="url(#grammar-arrow)" /><text x="82" y="126" textAnchor="middle" style={textStyle}>SUJEITO</text><text x="82" y="151" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{item.subject}</text><text x="237" y="126" textAnchor="middle" style={textStyle}>VERBO</text><text x="237" y="151" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{item.predicate}</text><text x="160" y="224" textAnchor="middle" style={textStyle}>{item.rule}</text></>;
}

function CommaScene({ value }: { value: number }) {
  const explanatory = Boolean(value);
  const item = commaReading(explanatory);
  return <><g>{[68, 100, 132, 188, 220, 252].map((x, index) => <circle key={x} cx={x} cy="130" r="15" fill={explanatory || index < 3 ? 'var(--vs-burgundy)' : 'var(--vs-paper)'} stroke="var(--vs-ink)" strokeWidth="2" />)}</g><path d={explanatory ? 'M42 88H278V172H42Z' : 'M44 88H156V172H44Z'} fill="none" stroke="var(--vs-burgundy)" strokeWidth="3" strokeDasharray="7 5" /><text x="160" y="215" textAnchor="middle" style={textStyle}>{item.role}: {item.scope}</text><text x="160" y="251" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{explanatory ? ', que estudaram,' : 'que estudaram'}</text></>;
}

function CrasisScene({ value }: { value: number }) {
  const item = crasisCase(value);
  const fused = item.result.startsWith('à');
  return <><rect x="35" y="90" width="78" height="58" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="207" y="90" width="78" height="58" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><text x="74" y="125" textAnchor="middle" style={textStyle}>{fused ? 'a' : 'sem a'}</text><text x="246" y="125" textAnchor="middle" style={textStyle}>{fused ? 'a / aquele' : 'sem artigo'}</text><path d="M114 119L145 148M206 119L175 148" stroke="var(--vs-burgundy)" strokeWidth="4" /><circle cx="160" cy="164" r="42" fill="color-mix(in srgb,var(--vs-burgundy) 25%,var(--vs-paper))" stroke="var(--vs-burgundy)" strokeWidth="3" /><text x="160" y="174" textAnchor="middle" style={{ ...textStyle, fontSize: 28 }}>{item.result}</text><text x="160" y="242" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 13 }}>{item.reason}</text></>;
}

function VoiceScene({ value }: { value: number }) {
  const item = voiceCase(value);
  const passive = value > 0;
  return <><rect x="25" y="105" width="95" height="62" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="200" y="105" width="95" height="62" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><path d={passive ? 'M198 136H124' : 'M122 136H196'} stroke="var(--vs-burgundy)" strokeWidth="6" markerEnd="url(#grammar-arrow)" /><text x="72" y="133" textAnchor="middle" style={textStyle}>{item.agent}</text><text x="72" y="153" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>agente</text><text x="247" y="133" textAnchor="middle" style={textStyle}>{item.patient}</text><text x="247" y="153" textAnchor="middle" style={{ fill: 'var(--vs-ink-muted)', fontSize: 12 }}>paciente</text><text x="160" y="220" textAnchor="middle" style={textStyle}>foco: {item.focus}</text></>;
}

function GrammarScene({ id, value }: { id: GrammarInstrumentId; value: number }) {
  return <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${GRAMMAR_INSTRUMENTS[id].name}; ${GRAMMAR_INSTRUMENTS[id].control.display(value)}`}>
    <defs><marker id="grammar-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="var(--vs-burgundy)" /></marker></defs>
    {id === 'noun-phrase' && <NounPhraseScene value={value} />}
    {id === 'agreement' && <AgreementScene value={value} />}
    {id === 'comma-scope' && <CommaScene value={value} />}
    {id === 'crasis' && <CrasisScene value={value} />}
    {id === 'verbal-voice' && <VoiceScene value={value} />}
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
