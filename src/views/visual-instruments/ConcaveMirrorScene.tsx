import React from 'react';
import { sphericalImageDistance } from '../../lib/opticsLab';

const axis = 150;
const focalDistance = 30;

function Arrow({ x, tip, image = false }: { x: number; tip: number; image?: boolean }) {
  const head = tip + (tip < axis ? 5 : -5);
  return <path className={image ? 'vs-optics-image' : 'vs-optics-object'}
    d={`M${x} ${axis} V${tip} M${x - 4} ${head} L${x} ${tip} L${x + 4} ${head}`}
    fill="none" stroke={image ? 'var(--vs-burgundy)' : 'var(--vs-ink)'} strokeWidth="3" />;
}

/** Esquema paraxial de Gauss: o traçado usa o plano do vértice. */
export default function ConcaveMirrorScene({ p }: { p: number }) {
  const q = sphericalImageDistance(p, focalDistance);
  const amplification = q === null ? 0 : -q / p;
  const left = Math.max(p, q ?? 0, 2 * focalDistance);
  const right = Math.max(0, -(q ?? 0));
  const scale = Math.min(220 / (left + right), 80 / (10 * Math.max(1, Math.abs(amplification))));
  const vertex = 40 + left * scale;
  const objectX = vertex - p * scale;
  const objectHeight = 10 * scale;
  const objectTip = axis - objectHeight;
  const imageX = q === null ? null : vertex - q * scale;
  const imageTip = axis - amplification * objectHeight;
  const focus = vertex - focalDistance * scale;
  const center = vertex - 2 * focalDistance * scale;
  // Fora do foco os raios terminam no encontro real. Nos outros casos,
  // seguem para a esquerda, limitados apenas pela janela do esquema.
  const reflectedEnd = (startY: number, slope: number) => {
    const x = Math.max(24, vertex - (240 - startY) / slope);
    return [x, startY + (vertex - x) * slope];
  };
  const firstEnd = q !== null && q > 0 ? [imageX!, imageTip] : reflectedEnd(objectTip, objectHeight / (focalDistance * scale));
  const secondEnd = q !== null && q > 0 ? [imageX!, imageTip] : reflectedEnd(axis, objectHeight / (p * scale));
  const lineStyle = { fill: 'none', stroke: 'var(--vs-burgundy)', strokeWidth: 2 } as const;

  return <>
    <text x="160" y="24" textAnchor="middle" fill="var(--vs-ink)" fontSize="11">modelo de Gauss · escala ajustada</text>
    <line x1="24" y1={axis} x2="296" y2={axis} stroke="var(--vs-ink)" strokeDasharray="5 5" />
    <path d={`M${vertex - 7} 70 Q${vertex + 7} 150 ${vertex - 7} 230`} fill="none" stroke="var(--vs-ink)" strokeWidth="5" />
    <path d={`M${objectX} ${objectTip} L${vertex} ${objectTip} M${objectX} ${objectTip} L${vertex} ${axis}`} style={lineStyle} />
    <path className="vs-optics-reflected" d={`M${vertex} ${objectTip} L${firstEnd[0]} ${firstEnd[1]}`} style={lineStyle} />
    <path className="vs-optics-reflected" d={`M${vertex} ${axis} L${secondEnd[0]} ${secondEnd[1]}`} style={lineStyle} />
    {q !== null && q < 0 && <path className="vs-optics-extension"
      d={`M${vertex} ${objectTip} L${imageX} ${imageTip} M${vertex} ${axis} L${imageX} ${imageTip}`}
      style={lineStyle} strokeDasharray="5 4" />}
    <circle cx={focus} cy={axis} r="3" fill="var(--vs-ink)" />
    <circle cx={center} cy={axis} r="3" fill="var(--vs-ink)" />
    {[[focus, 'F'], [center, 'C'], [vertex, 'V']].map(([x, label]) => <text key={label} x={Number(x) + 6} y="172"
      fill="var(--vs-ink)" stroke="var(--vs-paper)" strokeWidth="3" paintOrder="stroke" fontSize="12">{label}</text>)}
    <Arrow x={objectX} tip={objectTip} />
    <text x={objectX} y="54" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">objeto</text>
    {imageX !== null && <>
      <Arrow x={imageX} tip={imageTip} image />
      <text x={imageX} y={q! > 0 ? 266 : 66} textAnchor="middle" fill="var(--vs-ink)" fontSize="12">imagem {q! > 0 ? 'real' : 'virtual'}</text>
    </>}
    {q === null && <text x="160" y="266" textAnchor="middle" fill="var(--vs-ink)" fontSize="12">raios paralelos · imagem no infinito</text>}
  </>;
}
