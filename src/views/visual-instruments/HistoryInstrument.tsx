import React, { useState } from 'react';
import { HISTORY_INSTRUMENTS, historyInstrumentState, type HistoryInstrumentId } from '../../lib/historyInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

import { GoldTaxMechanism } from './ResourceMechanisms';

const ink = { fontWeight: 800, fill: 'var(--vs-ink)' } as const;

function HistoryScene({ id, selected }: { id: HistoryInstrumentId; selected: number }) {
  if (id === 'america-xix') return <>
    <path d="M62 58L103 42l35 28-10 41 20 40-31 66-48-20-17-55 18-32Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M193 58l48-5 31 35-20 42 8 60-45 33-31-68 19-44Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    {selected === 0 && <path d="M80 92l34 28m92-34 37 30" stroke="var(--vs-burgundy)" strokeWidth="6" strokeDasharray="8 5" />}
    {selected === 1 && <path d="M70 103C100 70 124 82 139 117" fill="none" stroke="var(--vs-burgundy)" strokeWidth="7" />}
    {selected === 2 && <path d="M278 82C238 69 221 95 209 126" fill="none" stroke="var(--vs-burgundy)" strokeWidth="7" />}
    <text x="160" y="266" textAnchor="middle" style={ink}>{historyInstrumentState(id, selected).relation}</text>
  </>;

  if (id === 'wwii-fronts') {
    const paths = [
      'M42 185C77 130 102 111 139 99',
      'M273 171C239 126 210 112 174 99',
      'M62 69C106 50 139 65 159 91M260 65C224 47 194 64 168 91',
    ];
    return <>
      <path d="M66 53l70 18 30 52-28 71-66 16-27-55Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
      <path d="M184 51l66 22 30 51-23 69-65 18-29-65Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
      <path d={paths[selected]} fill="none" stroke="var(--vs-burgundy)" strokeWidth="7" />
      <circle cx="162" cy="100" r="10" fill="var(--vs-burgundy)" />
      <text x="160" y="257" textAnchor="middle" style={ink}>{historyInstrumentState(id, selected).evidence}</text>
    </>;
  }

  if (id === 'cold-war') return <>
    <circle cx="72" cy="137" r="42" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="4" />
    <circle cx="248" cy="137" r="42" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="4" />
    {selected === 0 && <><path d="M118 115H202M118 159H202" stroke="var(--vs-burgundy)" strokeWidth="5" /><text x="160" y="143" textAnchor="middle" style={ink}>⇄</text></>}
    {selected === 1 && <><circle cx="160" cy="137" r="28" fill="color-mix(in srgb,var(--vs-burgundy) 28%,transparent)" /><path d="M114 137H132M188 137H206" stroke="var(--vs-burgundy)" strokeWidth="5" /></>}
    {selected === 2 && <><path d="M111 104C151 52 178 52 209 104M111 170C151 221 178 221 209 170" fill="none" stroke="var(--vs-burgundy)" strokeWidth="5" /></>}
    <text x="72" y="143" textAnchor="middle" style={ink}>EUA</text><text x="248" y="143" textAnchor="middle" style={ink}>URSS</text>
    <text x="160" y="244" textAnchor="middle" style={ink}>{historyInstrumentState(id, selected).focus}</text>
  </>;

  if (id === 'interiorization') {
    const routes = [
      'M62 188C104 149 132 105 185 78',
      'M62 188C121 173 159 170 229 129',
      'M62 188C114 217 181 223 257 185',
    ];
    return <>
      <path d="M45 45H92V244H45Z" fill="color-mix(in srgb,var(--vs-burgundy) 24%,transparent)" />
      <path d="M92 45C164 58 214 38 280 72V237C211 214 148 247 92 244Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
      <path d={routes[selected]} fill="none" stroke="var(--vs-burgundy)" strokeWidth="7" strokeDasharray="12 6" />
      <circle cx="62" cy="188" r="9" fill="var(--vs-burgundy)" />
      <text x="160" y="276" textAnchor="middle" style={ink}>{historyInstrumentState(id, selected).evidence}</text>
    </>;
  }

  const activeX = [58, 160, 262][selected];
  return <g data-history-system="mining-colony">
    <path d="M25 224Q80 178 130 206T230 178T296 215V255H25Z" fill="color-mix(in srgb,var(--vs-burgundy) 14%,transparent)" />
    <path d="M40 205l25-91 29 91Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/><path d="M52 204l14-48 18 48" fill="var(--vs-burgundy)" opacity=".55"/>
    <path d="M93 171H128" stroke="var(--vs-ink-muted)" strokeWidth="4" markerEnd="url(#history-arrow)"/><path d="M192 171H225" stroke="var(--vs-ink-muted)" strokeWidth="4" markerEnd="url(#history-arrow)"/>
    <circle cx="58" cy="170" r="35" fill="var(--vs-paper)" stroke={selected===0?'var(--vs-burgundy)':'var(--vs-ink)'} strokeWidth="4"/><text x="58" y="166" textAnchor="middle" style={ink}>ouro</text><text x="58" y="183" textAnchor="middle" style={{...ink,fontSize:11}}>extraído</text>
    <rect x="125" y="132" width="70" height="78" rx="7" fill="var(--vs-paper)" stroke={selected===1?'var(--vs-burgundy)':'var(--vs-ink)'} strokeWidth="4"/><path d="M137 151h46M137 166h46M137 181h46" stroke="var(--vs-ink-muted)" strokeWidth="2"/><text x="160" y="199" textAnchor="middle" style={{...ink,fontSize:11}}>fundição</text>
    <path d="M225 139h58v69h-58Z" fill="var(--vs-paper)" stroke={selected===2?'var(--vs-burgundy)':'var(--vs-ink)'} strokeWidth="4"/><path d="M237 151h34v28h-34z" fill="color-mix(in srgb,var(--vs-burgundy) 30%,transparent)"/><text x="254" y="194" textAnchor="middle" style={{...ink,fontSize:11}}>Coroa</text>
    <defs><marker id="history-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5 0 7Z" fill="var(--vs-burgundy)"/></marker></defs>
    <circle cx={activeX} cy="170" r="44" fill="none" stroke="var(--vs-burgundy)" strokeWidth="4" strokeDasharray="7 5"/>
    <text x="160" y="282" textAnchor="middle" style={{...ink,fontSize:13}}>{historyInstrumentState(id, selected).relation}</text>
  </g>;
}

export function historyInstrument(id: HistoryInstrumentId) {
  const config = HISTORY_INSTRUMENTS[id];
  return function HistoryBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = historyInstrumentState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Ateliê de relações históricas"
      title={config.name}
      subtitle={config.question}
      condition={{ label: config.controlLabel, value: state.label }}
      ariaLabel={`Instrumento histórico: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        {id === 'mining-colony' && selected === 0 ? <GoldTaxMechanism /> : <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${state.label}: ${state.focus}`}>
          <HistoryScene id={id} selected={selected} />
        </svg>}
        <p className="vs-instrument-dica">mude o recorte para comparar relações sem inventar uma cadeia única</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`history-${id}`}><strong>{config.controlLabel}</strong><span>{config.controlDescription}</span><b>{state.label}</b></label>
          <input id={`history-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} onChange={event => setSelected(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">
          <div data-pivot="true"><dt>Relação</dt><dd>{state.relation}</dd></div>
          <div><dt>Lastro</dt><dd>{state.evidence}</dd></div>
        </dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.formula }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: state.focus }}
      leftState={pair.leftState}
      rightState={pair.rightState}
      leftSelected={pair.leftSelected}
      rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft}
      onSelectRight={pair.selectRight}
      equation={{ label: 'Relação histórica', general: config.formula, condition: state.label, reduced: state.relation }}
      closing={config.insight}
    />;
  };
}
