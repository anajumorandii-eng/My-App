import React from 'react';
import { lunetaGeometry } from '../../lib/lunetaGeometry';

export function LunetaScene({ focal }: { focal: number }) {
  const model = lunetaGeometry(focal);
  const text = { fill: 'var(--vs-ink)', stroke: 'none', fontSize: 11, fontWeight: 600 } as const;
  const line = { fill: 'none', stroke: 'var(--vs-ink-muted)', strokeWidth: 1 } as const;
  const lens = (x: number, y: number, half: number) => <path d={`M${x} ${y-half}Q${x-6} ${y} ${x} ${y+half}Q${x+6} ${y} ${x} ${y-half}`} fill="color-mix(in srgb,var(--vs-blue) 20%,transparent)" stroke="var(--vs-blue)" strokeWidth="1.5" />;
  const path = (points: { x: number; y: number }[]) => points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ');
  return <g data-physics-system="optical-instruments" data-luneta-length={model.length} data-luneta-magnification={model.magnification}>
    <rect x="8" y="8" width="304" height="126" rx="9" {...line} />
    <text x="18" y="26" style={text}>Luneta de Kepler · foco no infinito</text>
    <text x="18" y="43" style={{...text, fontSize: 10}}>Vista inteira: {(model.overviewScale).toFixed(3).replace('.', ',')} px/mm · x e y</text>
    <path d="M18 78H294" {...line} strokeDasharray="4 4" />
    {model.rays.map((ray, index) => <path key={index} data-luneta-ray="overview" d={path(ray.overview)} stroke="var(--vs-burgundy)" strokeWidth="1.4" fill="none" />)}
    {lens(model.objectiveX, 78, 19)}{lens(model.eyeX, 78, 13)}
    <path d={`M${model.imageX} 61V96`} {...line} strokeDasharray="2 3" />
    <text x="54" y="111" textAnchor="middle" style={text}>objetiva</text>
    <text x="274" y="111" textAnchor="middle" style={text}>ocular</text>
    <text x="160" y="127" textAnchor="middle" style={{...text, fontSize: 10}}>L = {model.length} mm · detalhe abaixo ↓</text>

    <rect x="8" y="143" width="304" height="121" rx="9" {...line} />
    <text x="18" y="160" style={text}>Foco comum → ocular → feixe paralelo</text>
    <text x="18" y="177" style={{...text, fontSize: 10}}>Detalhe ampliado: 12 px/mm · x e y</text>
    <path d="M18 206H295" {...line} strokeDasharray="4 4" />
    <path d="M36 187V223" {...line} strokeDasharray="2 3" />
    {model.rays.map((ray, index) => <path key={index} data-luneta-ray="detail" data-exit-slope={ray.exitSlope} d={path(ray.detail)} stroke="var(--vs-burgundy)" strokeWidth="1.4" fill="none" />)}
    {lens(132, 206, 19)}
    <circle cx="36" cy={206-model.imageHeight*12} r="2.5" fill="var(--vs-burgundy)" />
    <text x="18" y="240" style={{...text, fontSize: 10}}>imagem real</text>
    <text x="132" y="240" textAnchor="middle" style={text}>ocular</text>
    <text x="219" y="240" textAnchor="middle" style={{...text, fontSize: 10}}>saída invertida</text>
    <text x="84" y="257" textAnchor="middle" style={{...text, fontSize: 10}}>fₑ = 8 mm</text>
    <text x="218" y="257" textAnchor="middle" style={{...text, fontSize: 10}}>M = {model.magnification}</text>
    <text x="160" y="281" textAnchor="middle" style={text}>Lentes finas · aproximação paraxial</text>
    <text x="160" y="296" textAnchor="middle" style={{...text, fontSize: 10}}>Lentes simbólicas; cada painel tem sua escala.</text>
  </g>;
}
