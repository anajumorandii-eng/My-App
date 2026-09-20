import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { AREA_CONFIGS, type AreaConfigId } from '../../lib/areaGeometry';
import type { BoardProps } from '../visual-boards/types';
import './AreaGeometryInstrument.css';

const polar = (cx: number, cy: number, radius: number, degrees: number) => {
  const angle = (degrees - 90) * Math.PI / 180;
  return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)] as const;
};

function AreaScene({ id, value }: { id: AreaConfigId; value: number }) {
  if (id === 'triangulo-retangulo') {
    const foot = 48 + (value / 25) * 224;
    return <>
      <polygon className="vs-area-fill" points={`48,244 272,244 ${foot},62`} />
      <line className="vs-area-guide" x1={foot} y1="62" x2={foot} y2="244" />
      <path className="vs-area-right" d={`M${foot} 230 h14 v14`} />
      <text x={(48 + foot) / 2} y="263" textAnchor="middle">m = {value}</text>
      <text x={(foot + 272) / 2} y="263" textAnchor="middle">n = {25 - value}</text>
      <text x={foot + 10} y="145">h² = m·n</text>
    </>;
  }
  if (id === 'geometria-metrica') {
    const end = polar(160, 150, 102, value);
    const start = polar(160, 150, 102, 0);
    const large = value > 180 ? 1 : 0;
    return <>
      <circle className="vs-area-outline" cx="160" cy="150" r="102" />
      <path className="vs-area-sector" d={`M160 150 L${start[0]} ${start[1]} A102 102 0 ${large} 1 ${end[0]} ${end[1]} Z`} />
      <line className="vs-area-guide" x1="160" y1="150" x2={end[0]} y2={end[1]} />
      <text x="160" y="145" textAnchor="middle">θ = {value}°</text>
      <text x="160" y="286" textAnchor="middle">arco cresce linearmente · setor cresce com r²</text>
    </>;
  }
  if (id === 'areas-poligonos') {
    const sides = Math.round(value); const points = Array.from({ length: sides }, (_, index) => polar(160, 150, 102, index * 360 / sides));
    return <>
      <polygon className="vs-area-fill" points={points.map((point) => point.join(',')).join(' ')} />
      {points.map((point, index) => <line key={index} className="vs-area-guide" x1="160" y1="150" x2={point[0]} y2={point[1]} />)}
      <circle className="vs-area-point" cx="160" cy="150" r="4" />
      <text x="160" y="154" textAnchor="middle">{sides} triângulos</text>
      <text x="160" y="286" textAnchor="middle">A = perímetro · apótema / 2</text>
    </>;
  }
  if (id === 'area-circulo') {
    const inner = value * 10;
    return <>
      <circle className="vs-area-fill" cx="160" cy="150" r="106" />
      <circle className="vs-area-hole" cx="160" cy="150" r={inner} />
      <line className="vs-area-guide" x1="160" y1="150" x2="266" y2="150" />
      <line className="vs-area-accent" x1="160" y1="150" x2={160 + inner} y2="150" />
      <text x="214" y="140">R = 10</text><text x={160 + inner / 2} y="175" textAnchor="middle">r = {value}</text>
      <text x="160" y="286" textAnchor="middle">coroa = círculo maior − círculo menor</text>
    </>;
  }
  if (id === 'razoes-areas') {
    const scale = Math.min(value, 2.2);
    return <>
      <polygon className="vs-area-fill" points="28,238 108,238 68,158" />
      <polygon className="vs-area-copy" points={`${218 - 40 * scale},238 ${218 + 40 * scale},238 218,${238 - 80 * scale}`} />
      <text x="68" y="263" textAnchor="middle">A₁</text><text x="218" y="263" textAnchor="middle">A₂ = k²·A₁</text>
      <text x="160" y="40" textAnchor="middle">k = {String(value).replace('.', ',')}</text>
    </>;
  }
  const radius = value * 8;
  return <>
    <rect className="vs-area-fill" x="42" y="58" width="236" height="184" rx="3" />
    <circle className="vs-area-hole" cx="160" cy="150" r={radius} />
    <line className="vs-area-accent" x1="160" y1="150" x2={160 + radius} y2="150" />
    <text x="160" y="43" textAnchor="middle">região útil = retângulo − abertura</text>
    <text x={160 + radius / 2} y="141" textAnchor="middle">r = {value}</text>
  </>;
}

function firstSentence(text?: string) {
  if (!text) return '';
  const sentence = text.trim().split(/(?<=[.!?])\s/)[0];
  return sentence.length < 190 ? sentence : `${sentence.slice(0, 186).trimEnd()}…`;
}

const CONDITION: Record<AreaConfigId, string> = {
  'triangulo-retangulo': 'h',
  'geometria-metrica': 'L',
  'areas-poligonos': 'A',
  'area-circulo': 'A',
  'razoes-areas': 'A₂/A₁',
  'areas-compostas': 'Aútil',
};

export function areaGeometryInstrument(id: AreaConfigId) {
  const config = AREA_CONFIGS[id];
  return function AreaGeometryBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find((item) => item.pivot) ?? readouts[0];
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório de medida e decomposição"
      title={config.name}
      subtitle={config.question}
      condition={{ label: CONDITION[id], value: pivot.value }}
      ariaLabel={`Instrumento de áreas e medidas: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument vs-area-instrument">
        <svg className="vs-plane vs-area-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><AreaScene id={id} value={value} /></svg>
        <p className="vs-instrument-dica">mexa na medida e observe o que é preservado, somado ou retirado</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`area-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{String(value).replace('.', ',')}</b></label>
          <input id={`area-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: firstSentence(first?.excerpt), formula: config.formula }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: firstSentence(second?.excerpt), formula: `${pivot.label} = ${pivot.value}` }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Leitura da decomposição', general: config.formula, condition: 'resulta', reduced: pivot.value }}
      closing={config.insight}
    />;
  };
}
