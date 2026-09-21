import React, { useState } from 'react';
import { ENGLISH_INSTRUMENTS, englishInstrumentState, type EnglishInstrumentId } from '../../lib/englishInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

const ink = { fontWeight: 800, fill: 'var(--vs-ink)' } as const;
const accent = { fontWeight: 800, fill: 'var(--vs-burgundy)' } as const;

function EnglishScene({ id, selected }: { id: EnglishInstrumentId; selected: number }) {
  const state = englishInstrumentState(id, selected);
  if (id === 'poetry-reading') return <>
    <text x="35" y="28" style={{...accent,fontSize:13}}>close reading · evidence first</text><rect x="35" y="45" width="250" height="190" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <text x="55" y="94" style={ink}>{selected === 0 ? 'Still I wait.' : selected === 1 ? 'The room is loud,' : 'Hope is a door'}</text>
    <text x="55" y="132" style={ink}>{selected === 0 ? 'Still I listen.' : selected === 1 ? 'my thoughts are quiet.' : 'left open.'}</text>
    {selected === 0 && <path d="M53 104H136M53 142H145" stroke="var(--vs-burgundy)" strokeWidth="5" />}
    {selected === 1 && <path d="M172 101C207 115 207 120 172 139" fill="none" stroke="var(--vs-burgundy)" strokeWidth="5" />}
    {selected === 2 && <path d="M178 155v54h49v-80h-49v26m0 0 28-20" fill="none" stroke="var(--vs-burgundy)" strokeWidth="5" />}
    <text x="160" y="269" textAnchor="middle" style={accent}>{state.reading}</text>
  </>;

  if (id === 'quantity-language') {
    const widths = [66, 155, 128];
    return <>
      <text x="45" y="55" style={{...accent,fontSize:13}}>quantifier changes the claim</text><path d="M45 155H275M45 140V170M160 140V170M275 140V170" stroke="var(--vs-ink)" strokeWidth="3" />
      <rect x={selected === 1 ? 110 : 45} y="112" width={widths[selected]} height="28" rx="8" fill="var(--vs-burgundy)" opacity=".65" />
      {selected === 0 && <path d="M111 96V177" stroke="var(--vs-burgundy)" strokeWidth="5" />}
      {selected === 1 && <path d="M110 96V177" stroke="var(--vs-burgundy)" strokeWidth="5" />}
      {selected === 2 && <><circle cx="90" cy="126" r="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="4" /><circle cx="218" cy="126" r="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="4" /></>}
      <text x="45" y="196" textAnchor="middle" style={ink}>0</text><text x="160" y="196" textAnchor="middle" style={ink}>referência</text><text x="275" y="196" textAnchor="middle" style={ink}>+</text>
      <text x="160" y="247" textAnchor="middle" style={accent}>{state.label}</text>
    </>;
  }

  if (id === 'modal-certainty') {
    const positions = [75, 160, 245];
    return <>
      <text x="160" y="47" textAnchor="middle" style={{...ink,fontSize:13}}>“The quake {selected === 0 ? 'may' : selected === 1 ? 'will likely' : 'will'} disrupt services.”</text><path d="M55 155H265" stroke="var(--vs-ink)" strokeWidth="8" strokeLinecap="round" />
      <circle cx={positions[selected]} cy="155" r="18" fill="var(--vs-burgundy)" />
      <text x="75" y="205" textAnchor="middle" style={ink}>possível</text><text x="160" y="205" textAnchor="middle" style={ink}>esperado</text><text x="245" y="205" textAnchor="middle" style={ink}>categórico</text>
      <text x="160" y="93" textAnchor="middle" style={accent}>{state.example}</text>
      <text x="160" y="255" textAnchor="middle" style={ink}>{state.reading}</text>
    </>;
  }

  if (id === 'cause-connectors') return <>
    <text x="160" y="50" textAnchor="middle" style={{...accent,fontSize:13}}>connector = logical direction</text>
    <rect x="35" y="90" width="98" height="75" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <rect x="187" y="90" width="98" height="75" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <path d="M137 127H181" stroke="var(--vs-burgundy)" strokeWidth="7" />
    <path d="m174 116 13 11-13 11" fill="none" stroke="var(--vs-burgundy)" strokeWidth="5" />
    <text x="84" y="122" textAnchor="middle" style={ink}>gases retain</text><text x="84" y="146" textAnchor="middle" style={ink}>heat</text>
    <text x="236" y="122" textAnchor="middle" style={ink}>temperatures</text><text x="236" y="146" textAnchor="middle" style={ink}>rise</text>
    <text x="160" y="72" textAnchor="middle" style={accent}>{state.label}</text>
    <text x="160" y="221" textAnchor="middle" style={ink}>causa → consequência</text>
  </>;

  const bridge = [215, 150, 86][selected];
  return <>
    <text x="160" y="47" textAnchor="middle" style={{...accent,fontSize:13}}>claim strength must match evidence</text>
    <rect x="34" y="82" width="105" height="90" rx="12" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3" />
    <rect x="181" y="82" width="105" height="90" rx="12" fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3" />
    <text x="86" y="119" textAnchor="middle" style={ink}>poor sleep</text><text x="86" y="145" textAnchor="middle" style={ink}>observed</text>
    <text x="233" y="119" textAnchor="middle" style={ink}>memory</text><text x="233" y="145" textAnchor="middle" style={ink}>problems</text>
    <path d="M143 127H177" stroke="var(--vs-burgundy)" strokeWidth={selected === 2 ? 9 : selected === 1 ? 6 : 3} strokeDasharray={selected === 0 ? '5 5' : undefined} />
    <path d={`M55 222H${bridge}`} stroke="var(--vs-burgundy)" strokeWidth="8" strokeLinecap="round" />
    <text x="160" y="257" textAnchor="middle" style={accent}>{state.label}</text>
  </>;
}

export function englishInstrument(id: EnglishInstrumentId) {
  const config = ENGLISH_INSTRUMENTS[id];
  return function EnglishBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = englishInstrumentState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório de leitura em inglês"
      title={config.name}
      subtitle={config.question}
      condition={{ label: config.controlLabel, value: state.label }}
      ariaLabel={`Instrumento de leitura em inglês: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument">
        <svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${state.label}: ${state.reading}`}>
          <EnglishScene id={id} selected={selected} />
        </svg>
        <p className="vs-instrument-dica">mude a estrutura e confira o limite da interpretação</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`english-${id}`}><strong>{config.controlLabel}</strong><span>{config.controlDescription}</span><b>{state.label}</b></label>
          <input id={`english-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} onChange={event => setSelected(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">
          <div data-pivot="true"><dt>Leitura autorizada</dt><dd>{state.reading}</dd></div>
          <div><dt>Pegadinha</dt><dd>{state.trap}</dd></div>
        </dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: first?.excerpt ?? '', formula: config.formula }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: second?.excerpt ?? '', formula: state.example }}
      leftState={pair.leftState}
      rightState={pair.rightState}
      leftSelected={pair.leftSelected}
      rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft}
      onSelectRight={pair.selectRight}
      equation={{ label: 'Leitura estrutural', general: config.formula, condition: state.label, reduced: state.reading }}
      closing={config.insight}
    />;
  };
}
