import React, { useId } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { membraneLipids, membraneTransport } from '../../lib/membraneSpatial';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import './ScienceObjectView.css';

export function MembraneSpatialView({ pump, time }: { pump: boolean; time: number }) {
  const rotation = useSpatialRotation(30, 25), id = useId().replace(/:/g, '');
  const project = (point: SpatialPoint) => { const [x, y, z] = rotateSpatialPoint(point, rotation.yaw, rotation.pitch); return { x: 160 + x, y: 150 - y, z }; };
  const ring = (y: number, radius = 23) => Array.from({ length: 33 }, (_, i): SpatialPoint => [radius * Math.cos(i * Math.PI / 16), y, radius * Math.sin(i * Math.PI / 16)]);
  const path = (points: SpatialPoint[]) => points.map((p, i) => { const a = project(p); return `${i ? 'L' : 'M'}${a.x},${a.y}`; }).join(' ');
  const heads = membraneLipids().map(lipid => {
    const head = project(lipid.head);
    return { depth: head.z, element: <g key={`lipid-${lipid.head}`}><g stroke="var(--vs-burgundy)" strokeWidth="2.5">{lipid.tails.map(([a, b], i) => <path key={i} d={path([a, b])} />)}</g><circle cx={head.x} cy={head.y} r="5" fill={`url(#${id}-head)`} stroke="var(--vs-ink)" strokeWidth=".5" /></g> };
  });
  const protein = { depth: 0, element: <g key="protein" fill="none" stroke="var(--vs-blue)" strokeWidth="3"><path d={path(ring(30)) + 'Z'} /><path d={path(ring(-30)) + 'Z'} />{[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map(a => <path key={a} opacity=".5" d={path([[23 * Math.cos(a), -30, 23 * Math.sin(a)], [23 * Math.cos(a), 30, 23 * Math.sin(a)]])} />)}</g> };
  const particles = membraneTransport(pump, time).map((particle, i) => { const p = project(particle.point); return { depth: p.z, element: <g key={'particle-' + i}><circle cx={p.x} cy={p.y} r="7" fill={particle.kind === 'potassium' ? 'var(--vs-blue)' : 'var(--vs-burgundy)'} stroke="var(--vs-paper-strong)" strokeWidth="1" />{i === 0 && <text x={p.x + 10} y={p.y - 10} fill="var(--vs-ink)" fontSize="12">{particle.label}</text>}{i === 3 && <text x={p.x + 10} y={p.y - 10} fill="var(--vs-ink)" fontSize="12">K⁺</text>}</g> }; });
  return <section className="vs-science-card" aria-label="Bicamada lipídica tridimensional">
    <header><small>BIOLOGIA · MODELO ESPACIAL</small><h4>Duas camadas, interior hidrofóbico</h4></header>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch} aria-label={`Bicamada de fosfolipídios; cabeças voltadas para a água, caudas voltadas umas para as outras. ${pump ? 'Bomba: três Na⁺ saem e dois K⁺ entram por ATP.' : 'Proteína de transporte: fluxo líquido de soluto neutro do exterior para o citoplasma.'}`}>
      <defs><radialGradient id={id + '-head'} cx="30%" cy="25%"><stop stopColor="var(--vs-paper-strong)" /><stop offset="1" stopColor="var(--vs-green)" /></radialGradient></defs>
      {[...heads, protein, ...particles].sort((a, b) => a.depth - b.depth).map(object => object.element)}
      <text x="160" y="22" textAnchor="middle" fill="var(--vs-ink)">meio extracelular · água</text><text x="160" y="285" textAnchor="middle" fill="var(--vs-ink)">citoplasma · água</text>
    </svg>
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a bicamada <output>{Math.round(rotation.yaw)}°</output></label>
    <input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label>
    <input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-caption">Cabeças verdes: região hidrofílica; duas caudas vinho: região hidrofóbica. Contorno azul: proteína transmembrana. Use o percurso e o modo de transporte do laboratório. Arraste ou use setas e Home. Câmera e estrutura podem girar; exterior e citoplasma são os lados originais do modelo, não posições fixas na tela. Formas e tamanhos esquemáticos; o contorno não reproduz a estrutura de uma ATPase nem suas mudanças de conformação.</p>
  </section>;
}
