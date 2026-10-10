import React, { useId } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { electromagneticWave } from '../../lib/electromagneticWave';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import './ScienceObjectView.css';

export function ElectromagneticWaveView({ frequency, amplitude, phase }: { frequency: number; amplitude: number; phase: number }) {
  const rotation = useSpatialRotation(25, 20), id = useId().replace(/:/g, '');
  const project = (point: SpatialPoint) => { const [x, y] = rotateSpatialPoint(point, rotation.yaw, rotation.pitch); return [160 + x, 150 - y]; };
  const samples = Array.from({ length: 121 }, (_, i) => electromagneticWave(i * 3.5, frequency, phase, amplitude));
  const endpoint = (origin: SpatialPoint, vector: SpatialPoint) => origin.map((value, i) => value + vector[i]) as SpatialPoint;
  const path = (points: SpatialPoint[]) => points.map((p, i) => `${i ? 'L' : 'M'}${project(p)}`).join(' ');
  const electric = samples.map(p => endpoint(p.origin, p.electric)), magnetic = samples.map(p => endpoint(p.origin, p.magnetic));
  const fill = (points: SpatialPoint[]) => path(points) + `L${project(samples.at(-1)!.origin)}L${project(samples[0].origin)}Z`;
  return <section className="vs-science-card vs-em-spatial" aria-label="Campos eletromagnéticos tridimensionais">
    <header><small>FÍSICA · MODELO ESPACIAL</small><h4>Dois campos, três direções ortogonais</h4></header>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch} aria-label={`Onda eletromagnética: E na direção y, B na direção z; ambos transversais à propagação +x e em fase. Frequência relativa ${frequency}, comprimento de onda ${240 / frequency}.`}>
      <defs><marker id={id + '-arrow'} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--vs-ink)" /></marker></defs>
      <path d={fill(electric)} fill="var(--vs-blue)" opacity=".12" /><path d={fill(magnetic)} fill="var(--vs-green)" opacity=".12" />
      {samples.filter((_, i) => i % 8 === 0).map((p, i) => <g key={i} data-em-spatial-sample="true"><path d={path([p.origin, endpoint(p.origin, p.electric)])} fill="none" stroke="var(--vs-blue)" strokeWidth="1.3" /><path d={path([p.origin, endpoint(p.origin, p.magnetic)])} fill="none" stroke="var(--vs-green)" strokeWidth="1.3" /></g>)}
      <path d={path(electric)} fill="none" stroke="var(--vs-blue)" strokeWidth="3" /><path d={path(magnetic)} fill="none" stroke="var(--vs-green)" strokeWidth="3" />
      <path d={path([[-120, 0, 0], [120, 0, 0]])} fill="none" stroke="var(--vs-ink)" strokeWidth="2" markerEnd={`url(#${id}-arrow)`} />
      <text x="160" y="25" textAnchor="middle" fill="var(--vs-ink)">x · propagação</text><text x="160" y="278" textAnchor="middle" fill="var(--vs-ink)">E ⟂ B ⟂ x · E e B em fase</text>
    </svg>
    <div className="vs-science-choices" aria-label="Legenda dos campos"><span>Azul: E · y</span><span>Verde: B · z</span></div>
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar os campos <output>{Math.round(rotation.yaw)}°</output></label>
    <input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label>
    <input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-caption">A câmera muda a projeção, não a perpendicularidade dos campos. Os planos coloridos mostram suas direções de oscilação; não são superfícies materiais. Arraste ou use setas e Home. Frequência, amplitude e reprodução usam os controles do laboratório. Amplitudes normalizadas em escalas distintas; E e B têm unidades diferentes.</p>
  </section>;
}
