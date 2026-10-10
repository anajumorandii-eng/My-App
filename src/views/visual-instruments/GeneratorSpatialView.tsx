import React, { useId } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { generatorSpatial } from '../../lib/generatorSpatial';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import './ScienceObjectView.css';

export function GeneratorSpatialView({ phase, omega }: { phase: number; omega: number }) {
  const rotation = useSpatialRotation(25, 20), id = useId().replace(/:/g, ''), model = generatorSpatial(phase, omega);
  const project = (point: SpatialPoint) => { const [x,y] = rotateSpatialPoint(point,rotation.yaw,rotation.pitch); return [160+x,150-y]; };
  const path = (points: SpatialPoint[]) => points.map((p,i)=>`${i ? 'L' : 'M'}${project(p)}`).join(' ');
  const normal = model.normal.map(v=>v*95) as SpatialPoint;
  const format = (v: number) => (Math.abs(v)<1e-9 ? 0 : v).toLocaleString('pt-BR',{maximumFractionDigits:2});
  return <section className="vs-science-card vs-field-spatial" aria-label="Gerador em três dimensões">
    <header><small>FÍSICA · MODELO ESPACIAL</small><h4>Gire a bobina; observe a normal e o fluxo</h4></header>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch} aria-label={`Bobina com normal formando ${phase} graus com B, em +z. Fluxo concatenado ${format(model.fluxLinkage)} Wb; FEM instantânea ${format(model.emf)} V.`}>
      <defs>{['b','n'].map(name=><marker key={name} id={`${id}-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={name==='b'?'var(--vs-blue)':'var(--vs-burgundy)'} /></marker>)}</defs>
      {[-75,0,75].map(x=><path key={x} d={path([[x,0,-110],[x,0,110]])} fill="none" stroke="var(--vs-blue)" strokeWidth="2" markerEnd={`url(#${id}-b)`} />)}
      <path d={path([...model.points,model.points[0]])+'Z'} fill="var(--vs-blue)" fillOpacity=".12" stroke="var(--vs-ink)" strokeWidth="6" strokeLinejoin="round" />
      <path d={path([[0,-100,0],[0,100,0]])} fill="none" stroke="var(--vs-dim)" strokeDasharray="4 4" />
      <path d={path([[0,0,0],normal])} fill="none" stroke="var(--vs-burgundy)" strokeWidth="3" markerEnd={`url(#${id}-n)`} />
      <text x="160" y="280" textAnchor="middle" fill="var(--vs-ink)">azul: B · vinho: normal n</text>
    </svg>
    <label className="vs-science-rotation" htmlFor={id+'-yaw'}>Girar a vista do gerador <output>{Math.round(rotation.yaw)}°</output></label><input id={id+'-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event=>rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id+'-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label><input id={id+'-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event=>rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-reading" role="status" aria-label="Leitura espacial do gerador">NΦ = {format(model.fluxLinkage)} Wb; ε = {format(model.emf)} V. NBA = 0,4 Wb; ω = {omega} rad/s. θ = {phase}°. ε = NBAω sen θ; NΦ = NBA cos θ.</p>
    <p className="vs-science-caption">Mude a fase θ e ω nos controles principais. Arrastar ou usar setas e Home altera somente a câmera. Campo uniforme em +z; eixo mecânico em y. A área colorida é uma superfície matemática, não uma placa material. Esquema de bobina ideal, fora de escala; contatos e carga elétrica omitidos. O sinal da FEM usa a orientação da normal; a energia vem do trabalho mecânico. Com ω = 0, a FEM é nula em qualquer orientação.</p>
  </section>;
}
