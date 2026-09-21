import React, { useState } from 'react';
import { ELECTROCHEMISTRY, type ElectrochemistryId } from '../../lib/electrochemistryLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

function excerpt(text?: string) {
  const first = text?.trim().split(/(?<=[.!?])\s/)[0] ?? '';
  return first.length > 180 ? `${first.slice(0, 176)}…` : first;
}

function ElectronDots({ count, x, direction }: { count: number; x: number; direction: 1 | -1 }) {
  return <>{Array.from({ length: Math.min(count, 6) }, (_, index) => (
    <circle key={index} cx={x + direction * index * 16} cy={150 + (index % 2) * 18} r="5" fill="var(--vs-burgundy)" />
  ))}</>;
}

function ElectrochemistryScene({ id, value }: { id: ElectrochemistryId; value: number }) {
  if (id === 'redox') return <>
    <circle cx="72" cy="145" r="36" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <circle cx="248" cy="145" r="36" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" />
    <path d="M112 135 C150 95 176 95 210 135" fill="none" stroke="var(--vs-burgundy)" strokeWidth="4" />
    <ElectronDots count={value} x={126} direction={1} />
    <text x="72" y="151" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>Zn</text>
    <text x="248" y="151" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>Cu²⁺</text>
    <text x="160" y="226" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>perde e⁻ → ganha e⁻</text>
  </>;

  if (id === 'cells') return <>
    <path d="M35 120V236H130V120M190 120V236H285V120" fill="none" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M39 184H126V232H39ZM194 184H281V232H194Z" fill="color-mix(in srgb,var(--vs-burgundy) 18%,transparent)" />
    <path d="M76 185V84H244V185" fill="none" stroke="var(--vs-burgundy)" strokeWidth="5" />
    <path d="M112 203 C140 168 180 168 208 203" fill="none" stroke="var(--vs-ink)" strokeWidth="8" strokeDasharray="5 7" />
    <text x="76" y="70" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>ânodo −</text>
    <text x="244" y="70" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>cátodo +</text>
    <text x="160" y="270" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>ponte salina: íons</text>
  </>;

  if (id === 'spontaneous') {
    const voltage = value + 0.76;
    const x = Math.max(45, Math.min(275, 160 + voltage * 70));
    return <>
      <path d="M45 155H275" stroke="var(--vs-ink)" strokeWidth="4" />
      <path d="M160 130V180" stroke="var(--vs-ink)" strokeWidth="3" />
      <circle cx={x} cy="155" r="14" fill="var(--vs-burgundy)" />
      <path d={`M160 105H${x}`} stroke="var(--vs-burgundy)" strokeWidth="5" />
      <text x="80" y="205" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>ΔE° &lt; 0</text>
      <text x="240" y="205" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>ΔE° &gt; 0</text>
      <text x="160" y="255" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>{voltage > 0 ? 'reação avança' : voltage < 0 ? 'reação não avança' : 'equilíbrio'}</text>
    </>;
  }

  if (id === 'electrolysis') return <>
    <rect x="52" y="126" width="216" height="120" rx="12" fill="color-mix(in srgb,var(--vs-burgundy) 16%,transparent)" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M105 70V215M215 70V215" stroke="var(--vs-ink)" strokeWidth="10" />
    <path d="M105 70V42H215V70" fill="none" stroke="var(--vs-burgundy)" strokeWidth="4" />
    <text x="160" y="35" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>fonte {value.toFixed(1).replace('.', ',')} V</text>
    {value > 2 && <>
      <circle cx="94" cy="112" r="6" fill="none" stroke="var(--vs-burgundy)" strokeWidth="2" />
      <circle cx="220" cy="104" r="8" fill="none" stroke="var(--vs-burgundy)" strokeWidth="2" />
      <path d="M120 185H200" stroke="var(--vs-burgundy)" strokeWidth="4" strokeDasharray="8 5" />
    </>}
    <text x="160" y="272" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>energia elétrica → transformação</text>
  </>;

  const height = 20 + value * 2.3;
  return <>
    <path d="M55 232H270M85 78V232" stroke="var(--vs-ink)" strokeWidth="3" />
    <rect x="112" y={232 - height} width="72" height={height} fill="color-mix(in srgb,var(--vs-burgundy) 42%,transparent)" stroke="var(--vs-burgundy)" strokeWidth="3" />
    <path d="M222 98V216" stroke="var(--vs-ink)" strokeWidth="14" />
    <path d="M204 216H240" stroke="var(--vs-burgundy)" strokeWidth="7" />
    <text x="148" y="258" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>depósito de Cu</text>
    <text x="222" y="78" textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>eletrodo</text>
  </>;
}

export function electrochemistryInstrument(id: ElectrochemistryId) {
  const config = ELECTROCHEMISTRY[id];
  return function ElectrochemistryBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(item => item.pivot) ?? readouts[0];
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);

    return <BoardShell
      kicker="Laboratório de eletroquímica"
      title={config.name}
      subtitle={config.question}
      condition={{ label: config.control.label, value: pivot.value }}
      ariaLabel={`Instrumento de eletroquímica: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}>
          <ElectrochemistryScene id={id} value={value} />
        </svg>
        <p className="vs-instrument-dica">mexa na variável e acompanhe matéria, carga e energia</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`electrochemistry-${id}`}>
            <strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b>
          </label>
          <input id={`electrochemistry-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">{readouts.map(item => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: excerpt(first?.excerpt), formula: config.formula }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: excerpt(second?.excerpt), formula: pivot.value }}
      leftState={pair.leftState}
      rightState={pair.rightState}
      leftSelected={pair.leftSelected}
      rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft}
      onSelectRight={pair.selectRight}
      equation={{ label: 'Leitura eletroquímica', general: config.formula, condition: 'mostra', reduced: pivot.value }}
      closing={config.insight}
    />;
  };
}
