import React, { useId, useState } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { spatialRing, wireMagneticField } from '../../lib/magneticFieldGeometry';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import './ScienceObjectView.css';

export function MagneticFieldView({ current }: { current: number }) {
  const [coil, setCoil] = useState(false), rotation = useSpatialRotation(25, 30), id = useId().replace(/:/g, '');
  const project = (point: SpatialPoint) => { const [x, y] = rotateSpatialPoint(point, rotation.yaw, rotation.pitch); return [160 + x, 150 - y]; };
  const path = (points: SpatialPoint[]) => points.map((point, i) => `${i ? 'L' : 'M'}${project(point)}`).join(' ');
  const arrow = (a: SpatialPoint, b: SpatialPoint, name: 'field' | 'current') => <path d={path([a, b])} fill="none" stroke={name === 'field' ? 'var(--vs-blue)' : 'var(--vs-burgundy)'} strokeWidth="3" markerEnd={`url(#${id}-${name})`} />;
  return <section className="vs-science-card vs-field-spatial" aria-label="Campo magnético tridimensional">
    <header><small>FÍSICA · MODELO ESPACIAL</small><h4>{coil ? 'Espira: a corrente gira; B atravessa o centro' : 'Fio: a corrente segue o eixo; B circula ao redor'}</h4></header>
    <div className="vs-science-choices" role="group" aria-label="Condutor do modelo"><button type="button" aria-pressed={!coil} onClick={() => setCoil(false)}>Fio retilíneo</button><button type="button" aria-pressed={coil} onClick={() => setCoil(true)}>Espira circular</button></div>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch} aria-label={`${coil ? 'Espira no plano xy: corrente anti-horária vista do lado +z; campo no centro em +z' : 'Fio no eixo z: corrente em +z; campo tangente a círculos no plano xy'}. Corrente ${current} ampères; ${current === 0 ? 'sem campo' : 'regra da mão direita'}.`}>
      <defs>{(['field', 'current'] as const).map(name => <marker key={name} id={`${id}-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={name === 'field' ? 'var(--vs-blue)' : 'var(--vs-burgundy)'} /></marker>)}<linearGradient id={id + '-wire'}><stop stopColor="var(--vs-ink)" /><stop offset=".4" stopColor="var(--vs-paper-strong)" /><stop offset="1" stopColor="var(--vs-burgundy)" /></linearGradient></defs>
      {coil ? <path d={path(spatialRing(75))} fill="none" stroke={`url(#${id}-wire)`} strokeWidth="8" /> : <path d={path([[0, 0, -100], [0, 0, 100]])} fill="none" stroke={`url(#${id}-wire)`} strokeWidth="8" strokeLinecap="round" />}
      {current > 0 && (coil ? <>{arrow([75, 0, 0], [75, 22, 0], 'current')}{arrow([0, 0, -90], [0, 0, 90], 'field')}</> : <>
        <g opacity={.3 + current / 15}>{[30, 60, 90].map(radius => <path key={radius} d={path(spatialRing(radius))} fill="none" stroke="var(--vs-blue)" strokeWidth="2" />)}{[-45, 45].map(z => <path key={z} d={path(spatialRing(60, z))} fill="none" stroke="var(--vs-blue)" strokeWidth="1" strokeDasharray="4 3" />)}</g>
        {[0, 90, 180, 270].map(angle => { const { point, direction } = wireMagneticField(angle, 60); return <g key={angle}>{arrow(point, point.map((value, i) => value + 18 * direction[i]) as SpatialPoint, 'field')}</g>; })}
        {arrow([0, 0, -45], [0, 0, 45], 'current')}
      </>)}
      <text x="160" y="280" textAnchor="middle" fill="var(--vs-ink)">{current === 0 ? 'I = 0 → B = 0' : 'vinho: corrente I · azul: campo B'}</text>
    </svg>
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar o campo <output>{Math.round(rotation.yaw)}°</output></label><input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label><input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-caption">Arraste ou use setas e Home. Mude I no controle principal. Linhas são amostras do campo, não fios nem trajetórias de partículas. Fio idealmente longo; espira mostra somente a direção de B no eixo central, omitindo os retornos externos. As leituras de r e B do laboratório calculam o fio retilíneo; não se aplica essa fórmula à espira. Espessuras e distâncias não estão em escala.</p>
  </section>;
}
