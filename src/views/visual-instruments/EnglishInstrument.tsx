import React, { useState } from 'react';
import { EnglishMechanismScene } from './EnglishMechanismScenes';
import './EnglishInstrument.css';
import { ENGLISH_INSTRUMENTS, englishInstrumentState, type EnglishInstrumentId } from '../../lib/englishInstrumentLab';
import { STAGE_LABEL } from '../../lib/visualStudy';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import type { BoardProps } from '../visual-boards/types';

export function englishInstrument(id: EnglishInstrumentId) {
  const config = ENGLISH_INSTRUMENTS[id];
  return function EnglishBoard(props: BoardProps) {
    const [selected, setSelected] = useState(0);
    const state = englishInstrumentState(id, selected);
    const pair = boardPair(props);
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório de leitura em inglês"
      title={config.name}
      subtitle={config.question}
      condition={{ label: config.controlLabel, value: state.label }}
      ariaLabel={`Instrumento de leitura em inglês: ${props.map.title}`}
      emphasis={pair.emphasis}
      sceneFirst
      scene={<div className="vs-instrument english-instrument">
        <EnglishMechanismScene id={id} selected={selected} />
        <p className="vs-instrument-dica">Compare a pista destacada com a leitura autorizada.</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`english-${id}`}><strong>{config.controlLabel}</strong><span>{config.controlDescription}</span><b>{state.label}</b></label>
          <input id={`english-${id}`} type="range" min="0" max={config.states.length - 1} step="1" value={selected} aria-valuetext={state.label} onChange={event => setSelected(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">
          <div data-pivot="true"><dt>Leitura autorizada</dt><dd>{state.reading}</dd></div>
          <div><dt>Diagnóstico do trecho</dt><dd>{state.diagnosis}</dd></div>
          <div><dt>Inferência inadequada</dt><dd>{state.trap}</dd></div>
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
