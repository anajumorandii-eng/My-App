import React, { useState } from 'react';
import { GEOGRAPHY_INSTRUMENTS, aquiferBalance, type GeographyInstrumentId } from '../../lib/geographyInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

function short(text?: string) {
  const sentence = text?.trim().split(/(?<=[.!?])\s/)[0] ?? '';
  return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence;
}

function TimeZoneScene({ value }: { value: number }) {
  const x = 160 + value / 180 * 105;
  return <>
    <circle cx="160" cy="145" r="105" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <ellipse cx="160" cy="145" rx="52" ry="105" fill="none" stroke="var(--vs-ink-muted)" />
    <path d="M55 145H265M68 92H252M68 198H252" stroke="var(--vs-ink-muted)" strokeDasharray="4 5" />
    <path d={`M${x} 48V242`} stroke="var(--vs-burgundy)" strokeWidth="7" />
    <text x="160" y="278" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>Greenwich 0° · leste adianta</text>
  </>;
}

function ScaleScene({ value }: { value: number }) {
  const end = 65 + value * 15;
  return <>
    <path d="M42 58L276 42L292 222L55 245Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M65 172C112 100 176 206 265 92" fill="none" stroke="var(--vs-ink-muted)" strokeWidth="4" strokeDasharray="8 6" />
    <circle cx="65" cy="172" r="8" fill="var(--vs-burgundy)" /><circle cx={end} cy="172" r="8" fill="var(--vs-burgundy)" />
    <path d={`M65 172H${end}`} stroke="var(--vs-burgundy)" strokeWidth="5" />
    <text x={(65 + end) / 2} y="157" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>{value} cm no mapa</text>
    <path d="M95 225H220" stroke="var(--vs-ink)" strokeWidth="8" /><path d="M95 215V235M157 215V235M220 215V235" stroke="var(--vs-ink)" strokeWidth="3" />
  </>;
}

function AquiferScene({ value }: { value: number }) {
  const balance = aquiferBalance(value);
  const waterY = 175 - Math.max(-45, Math.min(45, balance)) * 0.7;
  return <>
    <path d="M25 92C80 68 120 102 174 82S252 72 295 94V260H25Z" fill="color-mix(in srgb,var(--vs-ink) 18%,transparent)" />
    <path d={`M25 ${waterY}C90 ${waterY - 12} 145 ${waterY + 10} 295 ${waterY - 5}V260H25Z`} fill="color-mix(in srgb,#4f9bd8 45%,transparent)" stroke="#4f9bd8" strokeWidth="3" />
    <path d="M224 54V220" stroke="var(--vs-ink)" strokeWidth="10" /><path d="M224 72H270" stroke="var(--vs-ink)" strokeWidth="7" />
    <path d="M270 72V34" stroke="var(--vs-burgundy)" strokeWidth="4" markerEnd="url(#geo-arrow)" />
    <path d="M70 44V98M105 44V98M140 44V98" stroke="#4f9bd8" strokeWidth="4" strokeDasharray="6 5" />
    <text x="116" y="280" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>recarga</text>
    <text x="248" y="280" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>extração</text>
  </>;
}

function EnergyScene({ value }: { value: number }) {
  return <>
    <circle cx="160" cy="142" r="82" fill="none" stroke="color-mix(in srgb,#56a36c 55%,transparent)" strokeWidth="42" />
    <circle cx="160" cy="142" r="82" fill="none" stroke="var(--vs-burgundy)" strokeWidth="42" pathLength="100" strokeDasharray={`${value} ${100 - value}`} transform="rotate(-90 160 142)" />
    <text x="160" y="137" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 900, fontSize: 28 }}>{value}%</text>
    <text x="160" y="160" textAnchor="middle" style={{ fill: 'var(--vs-ink)' }}>fóssil</text>
    <text x="160" y="278" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>energia total ≠ só eletricidade</text>
  </>;
}

function NetworkScene({ value }: { value: number }) {
  const ys = [72, 108, 145, 182, 218];
  return <>
    <circle cx="62" cy="145" r="28" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <circle cx="258" cy="145" r="28" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    {ys.slice(0, value).map((y, index) => <path key={y} d={`M84 132 Q160 ${y} 236 132`} fill="none" stroke={index === 0 ? 'var(--vs-burgundy)' : '#4f9bd8'} strokeWidth="4" strokeDasharray={index === 0 ? '7 6' : undefined} />)}
    <path d="M130 70L150 90M150 70L130 90" stroke="var(--vs-burgundy)" strokeWidth="5" />
    <text x="62" y="151" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>origem</text>
    <text x="258" y="151" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>destino</text>
    <text x="160" y="278" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>uma rota rompe; as demais preservam o fluxo</text>
  </>;
}

function GeographyScene({ id, value }: { id: GeographyInstrumentId; value: number }) {
  return <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${GEOGRAPHY_INSTRUMENTS[id].name}; valor ${GEOGRAPHY_INSTRUMENTS[id].control.display(value)}`}>
    <defs><marker id="geo-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="var(--vs-burgundy)" /></marker></defs>
    {id === 'time-zones' && <TimeZoneScene value={value} />}
    {id === 'map-scale' && <ScaleScene value={value} />}
    {id === 'aquifer' && <AquiferScene value={value} />}
    {id === 'energy-matrix' && <EnergyScene value={value} />}
    {id === 'network-redundancy' && <NetworkScene value={value} />}
  </svg>;
}

export function geographyInstrument(id: GeographyInstrumentId) {
  const config = GEOGRAPHY_INSTRUMENTS[id];
  return function GeographyBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find((item) => item.pivot) ?? readouts[0];
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório geográfico"
      title={config.name}
      subtitle={config.question}
      condition={{ label: 'Leitura', value: pivot.value }}
      ariaLabel={`Instrumento geográfico: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        <GeographyScene id={id} value={value} />
        <p className="vs-instrument-dica">mova a variável e leia a transformação espacial</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`geo-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{config.control.display(value)}</b></label>
          <input id={`geo-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.relation }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Relação espacial', general: config.relation, condition: 'resultado', reduced: pivot.value }}
      closing={config.insight}
    />;
  };
}
