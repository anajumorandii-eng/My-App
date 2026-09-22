import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { READING_INSTRUMENTS, readingState, type ReadingInstrumentId } from '../../lib/readingInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const scenes: Record<ReadingInstrumentId, readonly [string, string, string]> = {
  levels: ['TEXTO', 'PISTAS', 'INFERÊNCIA'], intertext: ['TEXTO A', 'DIÁLOGO', 'TEXTO B'], genres: ['EMISSOR', 'GÊNERO', 'LEITOR'], narrative: ['NARRADOR', 'CONFLITO', 'FOCO'], nonverbal: ['IMAGEM', 'ENQUADRE', 'SENTIDO'], functions: ['MENSAGEM', 'FUNÇÃO', 'EFEITO'], poetic: ['FORMA', 'RITMO', 'EFEITO'], figures: ['LITERAL', 'FIGURA', 'EFEITO'], distortions: ['PISTA', 'HIPÓTESE', 'TESTE'], comic: ['EXPECTATIVA', 'VIRADA', 'CRÍTICA'], tdic: ['TECNOLOGIA', 'USO', 'IMPACTO'],
};

function ReadingScene({ id, selected }: { id: ReadingInstrumentId; selected: number }) {
  const state = readingState(id, selected);
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : .25, ease: 'easeOut' as const };
  const [from, relation, to] = scenes[id];
  const isVisual = id === 'nonverbal' || id === 'poetic' || id === 'figures';
  const isNarrative = id === 'narrative' || id === 'comic';
  return <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${READING_INSTRUMENTS[id].name}; ${state.label}: ${state.diagnosis}`}>
    {isVisual ? <><motion.rect x="34" y="54" width="112" height="150" rx="12" fill="var(--vs-paper)" initial={false} animate={{ stroke: selected === 0 ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: selected === 0 ? 5 : 2 }} transition={transition}/><motion.circle cx="90" cy="120" r={selected === 0 ? 34 : 24} fill="color-mix(in srgb,var(--vs-burgundy) 18%,var(--vs-paper))" initial={false} animate={{ r: selected === 0 ? 34 : 24 }} transition={transition}/><text x="90" y="180" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 11, fontWeight: 800 }}>{from}</text><motion.path d="M154 130H238" stroke="var(--vs-burgundy)" strokeWidth="4" initial={false} animate={{ pathLength: selected ? 1 : .45 }} transition={transition}/><motion.rect x="244" y="78" width="52" height="104" rx="10" fill="var(--vs-paper)" initial={false} animate={{ stroke: selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)', strokeWidth: selected ? 5 : 2 }} transition={transition}/><text x="270" y="117" textAnchor="middle" style={{ fill: 'var(--vs-burgundy)', fontSize: 9, fontWeight: 900 }}>{relation}</text><text x="270" y="146" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 10, fontWeight: 800 }}>{to}</text></> : isNarrative ? <>{[0, 1, 2].map((step) => <motion.g key={step} initial={false} animate={{ opacity: step <= selected + 1 ? 1 : .38, y: step === selected ? -10 : 0 }} transition={transition}><rect x={32 + step * 94} y={170 - step * 48} width="72" height="52" rx="10" fill="var(--vs-paper)" stroke={step === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={step === selected ? 5 : 2}/><text x={68 + step * 94} y={201 - step * 48} textAnchor="middle" style={{ fill: step === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink)', fontSize: 10, fontWeight: 900 }}>{[from, relation, to][step]}</text></motion.g>)}</> : <>{[from, relation, to].map((label, index) => <motion.g key={label} initial={false} animate={{ y: index === selected ? -12 : 0, opacity: index === selected ? 1 : .62 }} transition={transition}><rect x={28 + index * 100} y="112" width="64" height="72" rx="11" fill="var(--vs-paper)" stroke={index === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink-muted)'} strokeWidth={index === selected ? 5 : 2}/><text x={60 + index * 100} y="153" textAnchor="middle" style={{ fill: index === selected ? 'var(--vs-burgundy)' : 'var(--vs-ink)', fontSize: 10, fontWeight: 900 }}>{label}</text>{index < 2 && <motion.path d={`M${94 + index * 100} 148H${124 + index * 100}`} stroke="var(--vs-burgundy)" strokeWidth="4" initial={false} animate={{ pathLength: index < selected ? 1 : .35 }} transition={transition}/>}</motion.g>)}</>}
    <text x="160" y="278" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontSize: 14, fontWeight: 800 }}>{state.label}</text>
  </svg>;
}

export function readingInstrument(id: ReadingInstrumentId) {
  const config = READING_INSTRUMENTS[id];
  return function ReadingBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = readingState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de leitura" title={config.name} subtitle={config.question} condition={{ label: config.controlLabel, value: state.label }} ariaLabel={`Instrumento de leitura: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><ReadingScene id={id} selected={selected} /><p className="vs-instrument-dica">mude a pista em foco e justifique a leitura pelo texto</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`reading-${id}`}><strong>{config.controlLabel}</strong><span>compare duas operações de leitura</span><b>{state.label}</b></label><input id={`reading-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} aria-valuetext={state.label} onChange={(event) => setSelected(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts"><div data-pivot="true"><dt>Pista</dt><dd>{state.clue}</dd></div><div><dt>Diagnóstico</dt><dd>{state.diagnosis}</dd></div><div><dt>Próxima ação</dt><dd>{state.action}</dd></div></dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.relation }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: state.clue }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Operação de leitura', general: config.relation, condition: state.label, reduced: state.diagnosis }} closing={config.insight} />;
  };
}
