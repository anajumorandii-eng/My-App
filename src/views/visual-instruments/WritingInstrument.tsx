import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { WRITING_INSTRUMENTS, writingInstrumentState, type WritingInstrumentId } from '../../lib/writingInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const ink = { fontWeight: 800, fill: 'var(--vs-ink)' } as const;
const accent = { fontWeight: 800, fill: 'var(--vs-burgundy)' } as const;

function WritingScene({ id, selected }: { id: WritingInstrumentId; selected: number }) {
  const state = writingInstrumentState(id, selected);
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : .28, ease: 'easeOut' as const };
  if (id === 'evaluation') return <>
    {[0, 1, 2, 3, 4].map((item) => <g key={item}><motion.rect x={18 + item * 59} y="90" width="48" height="120" rx="10" fill="var(--vs-paper)" initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2, y: item === selected ? 82 : 90 }} transition={transition} /><text x={42 + item * 59} y="150" textAnchor="middle" style={item === selected ? accent : ink}>{`C${item + 1}`}</text></g>)}
    <text x="160" y="258" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
  if (id === 'idea-map') return <>
    <circle cx="160" cy="145" r="42" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="5" />
    {[55, 120, 200, 265].map((x, index) => <g key={x}><motion.path d={`M160 145L${x} ${index % 2 ? 65 : 225}`} stroke="var(--vs-ink-muted)" strokeWidth="3" initial={false} animate={{ pathLength: selected === 0 ? .55 : 1, opacity: selected === 0 ? .55 : 1 }} transition={transition} /><motion.circle cx={x} cy={index % 2 ? 65 : 225} fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" initial={false} animate={{ r: selected === 2 ? 16 + index * 2 : 18, scale: selected === 1 ? 1.08 : 1 }} transition={transition} /></g>)}
    <text x="160" y="151" textAnchor="middle" style={accent}>{selected + 1}</text><text x="160" y="282" textAnchor="middle" style={ink}>{state.label}</text>
  </>;
  if (id === 'repertoire') return <>
    <rect x="35" y="80" width="90" height="95" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" /><rect x="195" y="80" width="90" height="95" rx="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" />
    <text x="80" y="132" textAnchor="middle" style={ink}>referência</text><text x="240" y="132" textAnchor="middle" style={ink}>tese</text>
    <motion.path d="M130 127H190" stroke="var(--vs-burgundy)" initial={false} animate={{ strokeWidth: 3 + selected * 3, pathLength: selected === 0 ? .45 : selected === 1 ? .75 : 1, opacity: selected === 0 ? .55 : 1 }} transition={transition} strokeDasharray={selected === 0 ? '5 6' : undefined} /><text x="160" y="220" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
  if (id === 'theme-axes') return <>
    {[0, 1, 2].map((item) => <motion.circle key={item} cx="160" cy="145" r={105 - item * 30} fill="none" initial={false} animate={{ stroke: item === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 7 : 2, opacity: item === selected ? 1 : .45 }} transition={transition} />)}
    <text x="160" y="151" textAnchor="middle" style={accent}>{selected === 0 ? 'EIXO' : selected === 1 ? 'RECORTE' : '?'}</text><text x="160" y="282" textAnchor="middle" style={ink}>{state.label}</text>
  </>;
  return <>
    {[0, 1, 2].map((item) => <g key={item}><motion.rect x={28 + item * 98} y="95" width="78" height="92" rx="10" fill="var(--vs-paper)" initial={false} animate={{ stroke: item <= selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: item === selected ? 5 : 2, opacity: item <= selected ? 1 : .45 }} transition={transition} /><text x={67 + item * 98} y="147" textAnchor="middle" style={item === selected ? accent : ink}>{['MITO 1', 'MITO 2', 'BANCAS'][item]}</text>{item < 2 && <motion.path d={`M${108 + item * 98} 141H${124 + item * 98}`} stroke="var(--vs-ink-muted)" strokeWidth="3" initial={false} animate={{ pathLength: selected > item ? 1 : .25 }} transition={transition} />}</g>)}
    <text x="160" y="245" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
}

export function writingInstrument(id: WritingInstrumentId) {
  const config = WRITING_INSTRUMENTS[id];
  return function WritingBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = writingInstrumentState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Ateliê de argumentação" title={config.name} subtitle={config.question} condition={{ label: config.controlLabel, value: state.label }} ariaLabel={`Instrumento de redação: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${state.label}: ${state.diagnosis}`}><WritingScene id={id} selected={selected} /></svg><p className="vs-instrument-dica">mude a decisão e observe o efeito no projeto do texto</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`writing-${id}`}><strong>{config.controlLabel}</strong><span>{config.controlDescription}</span><b>{state.label}</b></label><input id={`writing-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} aria-valuetext={state.label} onChange={(event) => setSelected(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts"><div data-pivot="true"><dt>Diagnóstico</dt><dd>{state.diagnosis}</dd></div><div><dt>Próxima ação</dt><dd>{state.action}</dd></div></dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: state.example }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Projeto em foco', general: config.relation, condition: state.label, reduced: state.diagnosis }} closing={config.insight} />;
  };
}
