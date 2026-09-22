import React, { useState } from 'react';
import { READING_INSTRUMENTS, readingState, type ReadingInstrumentId } from '../../lib/readingInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

function ReadingScene({ id, selected }: { id: ReadingInstrumentId; selected: number }) {
  const state = readingState(id, selected);
  return <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${READING_INSTRUMENTS[id].name}; ${state.label}: ${state.diagnosis}`}>
    <rect x="32" y="34" width="172" height="216" rx="13" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    {[0, 1, 2, 3, 4].map((line) => <path key={line} d={`M56 ${76 + line * 25}H${line === 2 ? 156 : 178}`} stroke="var(--vs-ink-muted)" strokeWidth="4" strokeLinecap="round" />)}
    <circle cx="245" cy={selected === 0 ? 110 : 175} r="42" fill="color-mix(in srgb, var(--vs-burgundy) 16%, var(--vs-paper))" stroke="var(--vs-burgundy)" strokeWidth="4" />
    <path d={`M216 ${selected === 0 ? 132 : 198}L186 ${selected === 0 ? 168 : 138}`} stroke="var(--vs-burgundy)" strokeWidth="5" strokeLinecap="round" />
    <text x="245" y={selected === 0 ? 105 : 170} textAnchor="middle" style={{ fill: 'var(--vs-burgundy)', fontSize: 12, fontWeight: 900 }}>PISTA</text>
    <text x="245" y={selected === 0 ? 124 : 189} textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 10, fontWeight: 800 }}>{selected === 0 ? 'ler' : 'inferir'}</text>
    <text x="160" y="278" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 14, fontWeight: 800 }}>{state.label}</text>
  </svg>;
}

export function readingInstrument(id: ReadingInstrumentId) {
  const config = READING_INSTRUMENTS[id];
  return function ReadingBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = readingState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de leitura" title={config.name} subtitle={config.question} condition={{ label: config.controlLabel, value: state.label }} ariaLabel={`Instrumento de leitura: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><ReadingScene id={id} selected={selected} /><p className="vs-instrument-dica">mude a pista em foco e justifique a leitura pelo texto</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`reading-${id}`}><strong>{config.controlLabel}</strong><span>compare duas operações de leitura</span><b>{state.label}</b></label><input id={`reading-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} aria-valuetext={state.label} onChange={(event) => setSelected(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts"><div data-pivot="true"><dt>Pista</dt><dd>{state.clue}</dd></div><div><dt>Diagnóstico</dt><dd>{state.diagnosis}</dd></div><div><dt>Próxima ação</dt><dd>{state.action}</dd></div></dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: state.clue }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Operação de leitura', general: config.relation, condition: state.label, reduced: state.diagnosis }} closing={config.insight} />;
  };
}
