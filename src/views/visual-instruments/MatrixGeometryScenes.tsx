import React from 'react';
import { matrixDeterminant } from '../../lib/matrixLab';

export function LinearSystemScene({ x }: { x: number }) {
  const px = (v: number) => 60 + 19 * v;
  const py = (v: number) => 246 - 19 * v;
  return <>
    <text x="160" y="22" textAnchor="middle">solução comum: (6, 4)</text>
    <path className="vs-matrix-axis" d="M40 246H280M60 270V36" />
    {[0, 2, 4, 6, 8, 10].map(v => <g key={v}>
      <text x={px(v)} y="263" textAnchor="middle">{v}</text>
      {v > 0 && <text x="48" y={py(v) + 4} textAnchor="end">{v}</text>}
    </g>)}
    <text x="282" y="251">x</text><text x="54" y="36">y</text>
    <path className="vs-matrix-line" d={`M${px(0)} ${py(10)} L${px(10)} ${py(0)}`} />
    <path className="vs-matrix-line vs-matrix-line-b" d={`M${px(2)} ${py(0)} L${px(10)} ${py(8)}`} />
    <circle cx={px(6)} cy={py(4)} r="10" fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
    <circle className="vs-matrix-dot" cx={px(x)} cy={py(10 - x)} r="6" />
    <text x="160" y="286" textAnchor="middle">par testado: ({x}, {10 - x})</text>
  </>;
}

function Vector({ x, y, label, second = false }: { x: number; y: number; label: string; second?: boolean }) {
  const ox = 78, oy = 246;
  const dx = x - ox, dy = y - oy, length = Math.hypot(dx, dy);
  const hx = x - 8 * dx / length, hy = y - 8 * dy / length;
  return <>
    <path className={`vs-matrix-line${second ? ' vs-matrix-line-b' : ''}`} d={`M${ox} ${oy} L${x} ${y} M${hx - 4 * dy / length} ${hy + 4 * dx / length} L${x} ${y} L${hx + 4 * dy / length} ${hy - 4 * dx / length}`} />
    <text x={second ? x + 12 : x - 10} y={second ? y - 12 : y + 20} textAnchor={second ? 'start' : 'end'}>{label}</text>
  </>;
}

export function DeterminantScene({ c }: { c: number }) {
  const ox = 78, oy = 246, scale = 20;
  const u = [ox + 2 * scale, oy - c * scale];
  const v = [ox + 3 * scale, oy - 5 * scale];
  const sum = [ox + 5 * scale, oy - (c + 5) * scale];
  const determinant = matrixDeterminant(c);
  return <>
    <text x="160" y="22" textAnchor="middle">colunas u e v · área = |det|</text>
    <path className="vs-matrix-area" d={`M${ox} ${oy} L${u[0]} ${u[1]} L${sum[0]} ${sum[1]} L${v[0]} ${v[1]} Z`} />
    <path className="vs-matrix-axis" d={`M54 ${oy} H278 M${ox} 254 V36`} />
    {[2, 4, 6, 8, 10].map(n => <text key={n} x="66" y={oy - n * scale + 4} textAnchor="end">{n}</text>)}
    {[2, 4, 6, 8].map(n => <text key={n} x={ox + n * scale} y="263" textAnchor="middle">{n}</text>)}
    <text x="282" y="251">x</text><text x="72" y="36">y</text>
    <Vector x={u[0]} y={u[1]} label="u" />
    <Vector x={v[0]} y={v[1]} label="v" second />
    <text x="160" y="286" textAnchor="middle" className="vs-matrix-accent">det = {String(Math.round(determinant * 100) / 100).replace('.', ',').replace('-', '−')}</text>
  </>;
}
