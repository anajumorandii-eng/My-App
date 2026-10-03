import React from 'react';
import { lenzModel, type LenzMode } from '../../lib/magnetismLab';

export default function LenzScene({ mode, time }: { mode: LenzMode; time: number }) {
  const model = lenzModel(mode, time);
  const length = 24 + 42 * Math.abs(model.emf) / 20;
  const end = 221 + (mode === 'approach' ? -length : length);
  const color = 'var(--vs-burgundy)';
  const stroke = { stroke: 'var(--vs-ink)', strokeWidth: 2.5, fill: 'none' };
  return <g data-lenz-mode={mode} style={{ fill: 'var(--vs-ink)', fontSize: 12 }}>
    <text x="160" y="18" textAnchor="middle" fontWeight="700">Vista lateral · normal positiva →</text>
    <text x="160" y="38" textAnchor="middle">N do ímã voltado à bobina</text>
    <rect x="24" y="84" width="40" height="54" rx="4" fill="var(--vs-ink)" opacity=".15"/>
    <rect x="64" y="84" width="40" height="54" rx="4" fill={color} opacity=".3"/>
    <text x="44" y="116" textAnchor="middle" fontWeight="800">S</text><text x="84" y="116" textAnchor="middle" fontWeight="800">N</text>
    <ellipse cx="221" cy="111" rx="24" ry="45" {...stroke}/>
    <text x="221" y="63" textAnchor="middle">10 espiras</text>
    {model.frontPole && <text x="187" y="112" textAnchor="middle" fontWeight="800">{model.frontPole}</text>}
    <line data-vector="external-field" x1="112" y1="78" x2="169" y2="78" {...stroke}/>
    <path d="M162 73l7 5-7 5" {...stroke}/><text x="140" y="65" textAnchor="middle">B externo</text>
    {mode !== 'stationary' && <>
      <line data-vector="induced-field" x1="221" y1="122" x2={end} y2="122" stroke={color} strokeWidth="3"/>
      <path d={`M${end + (mode === 'approach' ? 6 : -6)} 117L${end} 122l${mode === 'approach' ? 6 : -6} 5`} stroke={color} strokeWidth="3" fill="none"/>
    </>}
    <text x="221" y="177" textAnchor="middle">{mode === 'stationary' ? 'B induzido = 0' : 'B induzido'}</text>
    <text x="64" y="160" textAnchor="middle">{mode === 'approach' ? 'aproxima →' : mode === 'retreat' ? '← afasta' : 'parado'}</text>
    <path d="M16 191H304" {...stroke} strokeWidth="1" opacity=".3"/>
    <text x="16" y="214" fontWeight="700">Vista frontal: observador no ímã</text>
    <circle cx="55" cy="251" r="24" {...stroke}/>
    {mode !== 'stationary' && <g data-current-arrow={model.current} stroke={color} strokeWidth="3" fill="none">
      <path d={mode === 'approach' ? 'M76 263A24 24 0 0 0 55 227' : 'M55 227A24 24 0 0 1 76 263'}/>
      <path d={mode === 'approach' ? 'M62 222l-7 5 6 6' : 'M79 255l-3 8-8-2'}/>
    </g>}
    <text x="94" y="242">{model.current}</text>
    <text x="94" y="263">{mode === 'stationary' ? 'ΔΦ = 0 · |ε| = 0' : `|ε| = ${Math.round(Math.abs(model.emf) * 100) / 100} V`}</text>
    <text x="160" y="292" textAnchor="middle">R fixa · setas esquemáticas</text>
  </g>;
}
