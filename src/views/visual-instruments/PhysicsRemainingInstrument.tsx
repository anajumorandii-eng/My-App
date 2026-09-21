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
    const wall = 110 + value * 135;
    return <g data-physics-system="echo">
      <path d="M24 228H294" {...ink}/><path d={`M${wall} 57V229`} stroke="var(--vs-ink)" strokeWidth="8"/><path d={`M${wall+10} 65V221`} stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="4 5"/>
      <circle cx="58" cy="188" r="18" fill="var(--vs-burgundy)"/><path d="M48 180q10-9 20 0M48 191q10 9 20 0" {...ink}/>
      <path d={`M79 175H${wall-10}`} {...wine}/><path d={`M${wall-10} 201H79`} stroke="var(--vs-blue)" strokeWidth="4" fill="none" strokeDasharray="8 5"/>
      {[0,1,2].map(n => <path key={n} d={`M${85+n*9} ${175-n*6}q11 6 0 12`} stroke="var(--vs-burgundy)" strokeWidth="2" fill="none" opacity={.9-n*.22}/>) }
      <text x="58" y="151" textAnchor="middle" style={ink}>emissor</text><text x={wall} y="43" textAnchor="middle" style={ink}>obstáculo</text>
      <text x={(wall+75)/2} y="166" textAnchor="middle" style={{...ink,fontSize:12}}>ida</text><text x={(wall+75)/2} y="218" textAnchor="middle" style={{...ink,fontSize:12}}>volta</text>
      <path d={`M78 253H${wall-12}`} stroke="var(--vs-ink)" strokeWidth="2"/><path d={`M78 247v12M${wall-12} 247v12`} stroke="var(--vs-ink)" strokeWidth="2"/>
      <text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>d = 340 · Δt / 2</text>
    </g>;
  }
  if (id === 'diffraction') {
    const spread = 18 + 78 / value;
    return <g data-physics-system="diffraction">
      <path d="M21 150H130" stroke="var(--vs-blue)" strokeWidth="12" opacity=".6"/><path d="M21 150H130" {...wine}/>
      <path d="M146 34V126M146 174V266M174 34V126M174 174V266" stroke="var(--vs-ink)" strokeWidth="7"/>
      <path d="M160 44v72M160 184v72" stroke="var(--vs-burgundy)" strokeWidth="3"/><text x="160" y="22" textAnchor="middle" style={ink}>fenda a</text>
      {[1,.65,.35].map((f,n)=><path key={n} d={`M168 150Q230 ${150-spread*f} 298 ${150-spread*f}M168 150Q230 ${150+spread*f} 298 ${150+spread*f}`} stroke={n?'var(--vs-ink-muted)':'var(--vs-burgundy)'} strokeWidth={n?2:4} fill="none" opacity={n?.75:1}/>) }
      <path d="M282 61V239" stroke="var(--vs-ink-muted)" strokeWidth="2" strokeDasharray="5 5"/><text x="289" y="279" textAnchor="end" style={{...ink,fontSize:12}}>anteparo</text>
      <text x="80" y="133" textAnchor="middle" style={{...ink,fontSize:12}}>frente de onda</text><text x="232" y="150" textAnchor="middle" style={{...ink,fontSize:12}}>θ</text>
      <text x="160" y="294" textAnchor="middle" style={{...ink,fontSize:13}}>sen θ ≈ λ/a</text>
    </g>;
  }
  if (id === 'tube-harmonics') {
    // Cada semiperfil é calculado a partir da mesma função. Não espelhe a
    // string pronta: ela já contém coordenadas numéricas, portanto um
    // replace textual não altera o sinal de y e desenha a mesma curva duas
    // vezes (a falha que escondia o ventre da onda estacionária).
    const profile = (sign: 1 | -1) => Array.from({ length: 81 }, (_, index) => {
      const x = 43 + index * 2.9;
      const y = 150 + sign * 52 * Math.sin((index / 80) * Math.PI * value / 2);
      return `${index ? 'L' : 'M'} ${x} ${y}`;
    }).join(' ');
    const upperProfile = profile(-1);
    const lowerProfile = profile(1);
    const nodeXs = Array.from({length:(value+1)/2},(_,n)=>43+n*(235*2/value));
    return <g data-physics-system="tube-harmonics">
      <path d="M34 78V223H286V78" fill="color-mix(in srgb,var(--vs-blue) 14%,transparent)" stroke="var(--vs-ink)" strokeWidth="4"/><path d="M34 223H286" stroke="var(--vs-ink)" strokeWidth="9"/>
      <path data-harmonic-profile="upper" d={upperProfile} {...wine}/><path data-harmonic-profile="lower" d={lowerProfile} stroke="var(--vs-blue)" strokeWidth="3" fill="none" opacity=".8"/>
      {nodeXs.map((x,n)=><g key={x}><path d={`M${x} 103v94`} stroke="var(--vs-ink-muted)" strokeWidth="1" strokeDasharray="3 4"/><circle cx={x} cy="150" r="5" fill="var(--vs-ink)"/><text x={x} y="245" textAnchor="middle" style={{...ink,fontSize:10}}>nó</text></g>)}
      <path d="M286 98v104" stroke="var(--vs-burgundy)" strokeWidth="4"/><text x="34" y="56" style={ink}>fechado</text><text x="286" y="56" textAnchor="end" style={ink}>aberto</text>
      <text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>L = {value}λ/4 · apenas n ímpar</text>
    </g>;
  }
  const top = 191 - value * 9;
  return <g data-physics-system="quantum-photon">
    <rect x="44" y="38" width="104" height="198" rx="13" fill="color-mix(in srgb,var(--vs-blue) 12%,transparent)" stroke="var(--vs-ink)" strokeWidth="3"/>
    <path d="M60 207H134M60 164H134M60 108H134" {...ink}/><text x="142" y="211" style={ink}>E₀</text><text x="142" y="168" style={ink}>E₁</text><text x="142" y="112" style={ink}>E₂</text>
    <circle cx="97" cy="207" r="10" fill="var(--vs-blue)"/><path d={`M97 193V${top+15}`} {...wine}/><path d={`M88 ${top+28}l9-15 9 15`} fill="var(--vs-burgundy)"/>
    <circle cx="97" cy={top+38} r="10" fill="var(--vs-burgundy)"/><path d="M190 91q30-34 58 0t58 0" stroke="var(--vs-burgundy)" strokeWidth="5" fill="none"/>
    <path d="M190 121q30-34 58 0t58 0" stroke="var(--vs-blue)" strokeWidth="5" fill="none" opacity=".65"/><text x="248" y="63" textAnchor="middle" style={ink}>fótons incidentes</text>
    <path d="M194 195h94" stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="241" y="215" textAnchor="middle" style={{...ink,fontSize:12}}>E = hf</text><text x="160" y="283" textAnchor="middle" style={{...ink,fontSize:13}}>frequência maior → salto possível maior</text>
  </g>;
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
