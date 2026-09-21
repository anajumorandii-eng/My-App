import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { MECHANICS_FINAL, type MechanicsFinalId } from '../../lib/mechanicsFinalLab';
import type { BoardProps } from '../visual-boards/types';

const text = { fontWeight: 800, fill: 'var(--vs-ink)' } as const;
function short(content?: string) { const first = content?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return first.length > 180 ? `${first.slice(0, 176)}…` : first; }

function Scene({ id, value }: { id: MechanicsFinalId; value: number }) {
  if (id === 'vertical-plane') return <><circle cx="160" cy="150" r="82" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><circle cx="160" cy="68" r="12" fill="var(--vs-burgundy)"/><path d="M160 82v48M142 104h36" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="185" y="113" style={text}>mg + N</text><text x="160" y="263" textAnchor="middle" style={text}>{value * value / 3 >= 10 ? 'contato: N ≥ 0' : 'contato se perde'}</text></>;
  if (id === 'mhs') { const x = 160 + value * 16; return <><path d={`M35 150H${x - 24}`} stroke="var(--vs-ink)" strokeWidth="3"/><path d={`M${x - 24} 150l8 -16 8 32 8 -32 8 32 8 -16`} fill="none" stroke="var(--vs-burgundy)" strokeWidth="4"/><rect x={x + 8} y="121" width="46" height="58" rx="7" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M160 70v165" stroke="var(--vs-ink)" strokeDasharray="5 5"/><text x="160" y="266" textAnchor="middle" style={text}>equilíbrio x = 0</text></>; }
  if (id === 'potential-energy') { const y = 220 - value * 13; return <><path d="M45 230L270 230L270 70" fill="none" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M60 225L250 80" stroke="var(--vs-burgundy)" strokeWidth="7"/><rect x="205" y={y} width="34" height="25" rx="4" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d={`M260 230V${y + 12}`} stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="274" y="155" style={text}>h</text></>; }
  if (id === 'nonconservative') return <><rect x="55" y="155" width="58" height="42" rx="6" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M35 200H285" stroke="var(--vs-ink)" strokeWidth="4"/><path d="M80 215l12 9 12 -9 12 9 12 -9 12 9 12 -9 12 9 12 -9 12 9 12 -9 12 9" fill="none" stroke="var(--vs-burgundy)" strokeWidth="3"/><path d="M170 140h-62" stroke="var(--vs-burgundy)" strokeWidth="6"/><text x="175" y="128" style={text}>f atrito</text><text x="160" y="266" textAnchor="middle" style={text}>{value * 4} J viram energia interna</text></>;
  return <><circle cx="115" cy="150" r="45" fill="var(--vs-burgundy)" opacity=".25"/><circle cx="115" cy="150" r="9" fill="var(--vs-burgundy)"/><circle cx="145" cy="125" r="6" fill="var(--vs-ink)"/><circle cx="152" cy="172" r="6" fill="var(--vs-ink)"/><path d="M180 150h85" stroke="var(--vs-burgundy)" strokeWidth="7"/><path d="M245 128l27 22-27 22" fill="none" stroke="var(--vs-burgundy)" strokeWidth="7"/><text x="160" y="262" textAnchor="middle" style={text}>Δm → E</text></>;
}

export function mechanicsFinalInstrument(id: MechanicsFinalId) {
  const config = MECHANICS_FINAL[id];
  return function MechanicsFinalBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(readout => readout.pivot) ?? readouts[0];
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de mecânica" title={config.name} subtitle={config.question} condition={{ label: '↔', value: pivot.value }} ariaLabel={`Instrumento de mecânica: ${props.map.title}`} emphasis={pair.emphasis}
      scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><p className="vs-instrument-dica">mexa na grandeza e acompanhe a consequência física</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`mechanics-final-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`mechanics-final-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(readout => <div key={readout.label} data-pivot={readout.pivot ? 'true' : undefined}><dt>{readout.label}</dt><dd>{readout.value}</dd></div>)}</dl></div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação mecânica', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight} />;
  };
}
