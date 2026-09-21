import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { PHYSICS_REMAINING, type PhysicsRemainingId } from '../../lib/physicsRemainingLab';
import type { BoardProps } from '../visual-boards/types';

const short = (text?: string) => { const first = text?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return first.length > 180 ? `${first.slice(0, 176)}…` : first; };
const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const wine = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };

function Scene({ id, value }: { id: PhysicsRemainingId; value: number }) {
  if (id === 'echo') {
    const distance = 48 + value * 165;
    return <><path d="M38 226H286M250 226V58" {...ink}/><circle cx="66" cy="183" r="16" fill="var(--vs-burgundy)"/><path d={`M84 183H${distance}M${distance} 183H84`} {...wine}/><path d={`M${distance} 162v42`} {...ink}/><text x="160" y="272" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>ida + volta: a distância dobra</text></>;
  }
  if (id === 'diffraction') {
    const spread = 12 + 78 / value;
    return <><path d="M32 150H132M188 150H288" {...wine}/><path d="M160 48v76M160 176v76" {...ink}/><path d={`M170 150L282 ${150 - spread}M170 150L282 ${150 + spread}`} {...wine}/><path d={`M170 150L282 ${150 - spread * .45}M170 150L282 ${150 + spread * .45}`} stroke="var(--vs-ink)" strokeWidth="2" fill="none" opacity=".65"/><text x="160" y="278" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>fenda menor → leque maior</text></>;
  }
  if (id === 'tube-harmonics') {
    const points = Array.from({ length: 81 }, (_, index) => { const x = 43 + index * 2.9; return `${index ? 'L' : 'M'} ${x} ${150 - 52 * Math.sin((index / 80) * Math.PI * value / 2)}`; }).join(' ');
    return <><path d="M38 82V218M38 218H278M278 82V218" {...ink}/><path d={points} {...wine}/><circle cx="43" cy="150" r="7" fill="var(--vs-ink)"/><path d="M278 97v106" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="43" y="65" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>fechado: nó</text><text x="278" y="65" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>aberto: ventre</text></>;
  }
  const top = 191 - value * 9;
  return <><path d="M48 226H274M72 204H244M72 166H244M72 112H244" {...ink}/><path d={`M160 204V${top + 10}`} {...wine}/><path d={`M150 ${top + 24}l10 -14 10 14`} fill="var(--vs-burgundy)"/><circle cx="160" cy={top + 34} r="13" fill="var(--vs-burgundy)"/><text x="255" y="209" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>E₀</text><text x="255" y="171" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>E₁</text><text x="255" y="117" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>E₂</text><text x="160" y="272" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>fóton: E = hf</text></>;
}

export function physicsRemainingInstrument(id: PhysicsRemainingId) {
  const config = PHYSICS_REMAINING[id];
  return function PhysicsRemainingBoard(props: BoardProps) {
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(item => item.pivot) ?? readouts[0];
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Laboratório de ondas e física moderna" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de física: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><p className="vs-instrument-dica">mexa na grandeza e acompanhe a condição física desenhada</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`physics-remaining-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`physics-remaining-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(item => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação física', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>;
  };
}
