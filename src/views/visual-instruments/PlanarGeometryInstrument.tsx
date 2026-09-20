import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { PLANAR_CONFIGS, type PlanarConfigId } from '../../lib/planarGeometry';
import type { BoardProps } from '../visual-boards/types';
import './PlanarGeometryInstrument.css';

const polar = (cx: number, cy: number, radius: number, degrees: number) => {
  const a = (degrees - 90) * Math.PI / 180;
  return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)] as const;
};

function polygonPoints(sides: number, cx: number, cy: number, radius: number, rotate = 0) {
  return Array.from({ length: sides }, (_, i) => polar(cx, cy, radius, rotate + i * 360 / sides)).map((p) => p.join(',')).join(' ');
}

function Scene({ id, value }: { id: PlanarConfigId; value: number }) {
  if (id === 'fundamentos') return <>
    <path className="vs-planar-main" d="M28 82 H292 M28 218 H292 M72 270 L236 28" />
    <path className="vs-planar-accent" d="M153 82 A32 32 0 0 1 171 55 M137 218 A31 31 0 0 0 154 242" />
    <text x="185" y="66">α = {value}°</text><text x="105" y="248">alterno = {value}°</text>
    <text x="224" y="145">paralelas</text>
  </>;
  if (id === 'angulos-triangulo') {
    const topX = 60 + value * 1.4;
    return <>
      <polygon className="vs-planar-fill" points={`34,242 286,242 ${topX},48`} />
      <path className="vs-planar-main" d={`M34 242 L286 242 L${topX} 48 Z M286 242 H314`} />
      <text x="43" y="232">A {value}°</text><text x="250" y="232">B 40°</text>
      <text x={topX} y="36" textAnchor="middle">C {180 - value - 40}°</text>
    </>;
  }
  if (id === 'angulos-poligono') {
    const sides = Math.round(value); const points = polygonPoints(sides, 160, 150, 105, 180 / sides);
    const verts = points.split(' ').map((p) => p.split(',').map(Number));
    return <>
      <polygon className="vs-planar-fill" points={points} />
      {verts.slice(2, -1).map((p, i) => <line className="vs-planar-guide" key={i} x1={verts[0][0]} y1={verts[0][1]} x2={p[0]} y2={p[1]} />)}
      <text x="160" y="156" textAnchor="middle">{sides - 2} triângulos</text>
    </>;
  }
  if (id === 'angulos-circunferencia') {
    const end = polar(160, 150, 104, value); const start = polar(160, 150, 104, 0);
    return <>
      <circle className="vs-planar-fill" cx="160" cy="150" r="104" />
      <path className="vs-planar-accent" d={`M160 150 L${start[0]} ${start[1]} M160 150 L${end[0]} ${end[1]} M${start[0]} ${start[1]} L${end[0]} ${end[1]}`} />
      <path className="vs-planar-guide" d={`M160 254 L${start[0]} ${start[1]} M160 254 L${end[0]} ${end[1]}`} />
      <circle className="vs-planar-point" cx="160" cy="150" r="5" />
      <text x="160" y="143" textAnchor="middle">central {value}°</text>
      <text x="160" y="283" textAnchor="middle">inscrito {value / 2}°</text>
    </>;
  }
  if (id === 'congruencia') return <>
    <polygon className="vs-planar-fill" points="38,226 126,226 74,116" />
    <g transform={`translate(218 170) rotate(${value}) translate(-218 -170)`}>
      <polygon className="vs-planar-fill vs-planar-copy" points="174,226 262,226 210,116" />
    </g>
    <path className="vs-planar-guide" d="M126 92 C160 58 206 58 240 92" />
    <text x="160" y="50" textAnchor="middle">mesmos lados · mesmos ângulos</text>
  </>;
  if (id === 'simetria-i') return <>
    <polygon className="vs-planar-fill" points={polygonPoints(6, 160, 150, 105, value)} />
    {[0, 60, 120].map((a) => { const p1 = polar(160, 150, 116, a + value); const p2 = polar(160, 150, 116, a + 180 + value); return <line key={a} className="vs-planar-guide" x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />; })}
    <circle className="vs-planar-point" cx="160" cy="150" r="5" />
    <text x="160" y="286" textAnchor="middle">passo 60° · ordem 6</text>
  </>;
  if (id === 'simetria-ii') {
    const px = 160 + value * 20; const fx = 160 - value * 20;
    return <>
      <path className="vs-planar-main" d="M20 150 H300 M160 20 V280" />
      <path className="vs-planar-guide" d={`M${px} 210 L${px} 90 L${fx} 90`} />
      <circle className="vs-planar-point" cx={px} cy="210" r="7" /><circle className="vs-planar-point" cx={px} cy="90" r="7" /><circle className="vs-planar-point" cx={fx} cy="90" r="7" />
      <text x={px} y="230" textAnchor="middle">P</text><text x={fx} y="78" textAnchor="middle">resultado</text>
    </>;
  }
  if (id === 'tales') {
    const middle = 60 + (190 * value) / (value + 1);
    return <>
    {[60, middle, 250].map((y) => <line key={y} className="vs-planar-main" x1="34" y1={y} x2="286" y2={y} />)}
    <path className="vs-planar-accent" d="M70 278 L154 26 M250 278 L178 26" />
    <text x="92" y={(60 + middle) / 2}>AB</text><text x="73" y={(middle + 250) / 2}>BC</text><text x="235" y={(60 + middle) / 2}>A′B′</text><text x="250" y={(middle + 250) / 2}>B′C′</text>
    <text x="160" y="294" textAnchor="middle">mesma razão {value.toFixed(2).replace('.', ',')}</text>
  </>;
  }
  const scale = Math.min(value, 1.6);
  const halfBase = 44 * scale;
  const apexY = 236 - 104 * scale;
  return <>
    <polygon className="vs-planar-fill" points="24,236 112,236 56,132" />
    <polygon className="vs-planar-fill vs-planar-copy" points={`${220 - halfBase},236 ${220 + halfBase},236 208,${apexY}`} />
    <text x="68" y="260" textAnchor="middle">figura 1</text><text x="226" y="260" textAnchor="middle">figura 2 · k={value.toFixed(2).replace('.', ',')}</text>
  </>;
}

const CONDITION: Record<PlanarConfigId, string> = {
  fundamentos: 'α',
  'angulos-triangulo': 'C',
  'angulos-poligono': 'Σ',
  'angulos-circunferencia': '∠c',
  congruencia: 'giro',
  'simetria-i': '≡',
  'simetria-ii': 'P″',
  tales: 'k',
  semelhanca: 'k',
};

function resumir(texto?: string) {
  if (!texto) return '';
  const primeira = texto.trim().split(/(?<=[.!?])\s/)[0];
  return primeira.length <= 190 ? primeira : `${primeira.slice(0, 186).trimEnd()}…`;
}

export function planarGeometryInstrument(id: PlanarConfigId) {
  const config = PLANAR_CONFIGS[id];
  return function PlanarGeometryBoard(props: BoardProps) {
    const pair = boardPair(props);
    const [value, setValue] = useState(config.control.initial);
    const readings = config.readouts(value);
    const pivot = readings.find((item) => item.pivot) ?? readings[0];
    const first = props.map.nodes[1] ?? props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell
      kicker="Laboratório de geometria plana"
      title={config.name}
      subtitle={config.question}
      condition={{ label: CONDITION[id], value: pivot.value }}
      ariaLabel={`Instrumento de geometria plana: ${props.map.title}`}
      emphasis={pair.emphasis}
      scene={<div className="vs-instrument vs-planar-instrument">
        <svg className="vs-plane vs-planar" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value} /></svg>
        <p className="vs-instrument-dica">mexa no controle e acompanhe a invariável geométrica</p>
        <div className="vs-plane-controls"><div className="vs-plane-control">
          <label htmlFor={`planar-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{String(value).replace('.', ',')}</b></label>
          <input id={`planar-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(e) => setValue(Number(e.target.value))} />
        </div></div>
        <dl className="vs-plane-readouts">{readings.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
      </div>}
      left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: resumir(first?.excerpt), formula: config.formula }}
      right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: resumir(second?.excerpt), formula: `${pivot.label} = ${pivot.value}` }}
      leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected}
      onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight}
      equation={{ label: 'Invariável', general: config.formula, condition: 'na cena', reduced: pivot.value }}
      closing={config.insight}
    />;
  };
}
