import React, { useEffect, useId } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { magneticTrajectory } from '../../lib/magneticTrajectory';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import './ScienceObjectView.css';

export function MagneticTrajectoryView({ theta }: { theta: number }) {
  const rotation = useSpatialRotation(35, 25), clock = useMechanismTime();
  const id = useId().replace(/:/g, '');
  useEffect(() => { clock.seek(0); }, [theta]);
  const model = magneticTrajectory(theta, clock.time);
  // Escala uniforme: ocupar o quadro sem deformar o ângulo entre v e B.
  const radians = theta * Math.PI / 180;
  const scale = Math.min(3.2, 100 / Math.max(30 * Math.sin(radians), 30 * Math.PI * Math.cos(radians)));
  const project = (point: SpatialPoint) => {
    const [x, y] = rotateSpatialPoint(point.map(value => value * scale) as SpatialPoint, rotation.yaw, rotation.pitch);
    return [160 + x, 150 - y];
  };
  const trajectory = Array.from({ length: 121 }, (_, i) => project(magneticTrajectory(theta, i / 120).position)).map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const [x, y] = project(model.position);
  const vector = (delta: SpatialPoint, color: string, label: string, length: number) => {
    const target = model.position.map((value, i) => value + delta[i] * length / scale) as SpatialPoint;
    const [endX, endY] = project(target);
    if (Math.hypot(...delta) < 1e-8) return null;
    return <g><path d={`M${x},${y}L${endX},${endY}`} stroke={color} strokeWidth="3" markerEnd={`url(#${id}-${label})`} /><text x={endX + 7} y={endY - 7} fill={color}>{label}</text></g>;
  };
  return <section className="vs-science-card vs-magnetic-spatial" aria-label="Trajetória magnética tridimensional">
    <header><small>FÍSICA · MODELO ESPACIAL</small><h4>Uma trajetória, duas componentes da velocidade</h4></header>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" aria-label={`Trajetória ${model.kind}; carga positiva; campo magnético em +z; ângulo ${theta} graus entre velocidade e campo.`} data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch}>
      <defs>{[['v', 'var(--vs-blue)'], ['F', 'var(--vs-burgundy)'], ['B', 'var(--vs-green)']].map(([label, color]) => <marker key={label} id={`${id}-${label}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={color} /></marker>)}<radialGradient id={id + '-particle'} cx="30%" cy="25%"><stop stopColor="var(--vs-paper-strong)" /><stop offset="1" stopColor="var(--vs-burgundy)" /></radialGradient></defs>
      <path d={trajectory} fill="none" stroke="var(--vs-ink)" strokeWidth="2" strokeDasharray="4 3" opacity=".65" />
      {(() => { const a = project([0, 0, -100 / scale]), b = project([0, 0, 100 / scale]); return <g><path d={`M${a}L${b}`} stroke="var(--vs-green)" strokeWidth="2" markerEnd={`url(#${id}-B)`} /><text x={b[0] + 7} y={b[1]} fill="var(--vs-green)">B · +z</text></g>; })()}
      {vector(model.velocity, 'var(--vs-blue)', 'v', 42)}
      {vector(model.force, 'var(--vs-burgundy)', 'F', 55)}
      <circle cx={x} cy={y} r="7" fill={`url(#${id}-particle)`} stroke="var(--vs-burgundy)" strokeWidth="1.5" />
      <text x="160" y="286" textAnchor="middle" fill="var(--vs-ink)">q &gt; 0 · θ = {theta}° · {model.kind}</text>
    </svg>
    <div className="vs-magnetic-spatial-controls">
    <TimeControl clock={clock} label="Posição ao longo da trajetória" />
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a trajetória <output>{Math.round(rotation.yaw)}°</output></label>
    <input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label>
    <input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    </div>
    <p className="vs-science-reading" role="status" aria-label="Leitura da trajetória">Força magnética: {model.magnitude.toFixed(2).replace('.', ',')} N. F é perpendicular a v e a B; não altera o módulo da velocidade. {theta === 0 ? 'Sem componente perpendicular: F = 0.' : theta === 90 ? 'Sem componente paralela: a trajetória é um círculo.' : 'A componente paralela avança; a perpendicular gira.'}</p>
    <p className="vs-science-caption">Mude θ no controle principal. Arraste o desenho ou use setas e Home para mudar somente a câmera. Trajetória normalizada, sem escala de distância ou tempo; setas identificam direções, com escalas distintas. A reprodução é finita e iniciada por você. Com movimento reduzido, use o controle de posição.</p>
  </section>;
}
