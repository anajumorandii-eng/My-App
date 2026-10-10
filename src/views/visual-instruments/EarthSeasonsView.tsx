import React, { useId, useState } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { CIDADES, declinacao, duracaoDoDia, escreverDia, escreverHoras, INCLINACAO } from '../../lib/estacoesDoAno';
import { earthAxis, earthSunDirection, earthSurface, solarIncidence } from '../../lib/earthSpatial';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import './ScienceObjectView.css';

export function EarthSeasonsView() {
  const [day, setDay] = useState(172), [cityId, setCityId] = useState('sao-paulo');
  const city = CIDADES.find(city => city.id === cityId)!;
  const rotation = useSpatialRotation(25, 15), clock = useMechanismTime(), id = useId().replace(/:/g, '');
  const spin = clock.time * 360;
  const project = (point: SpatialPoint) => { const [x, y, depth] = rotateSpatialPoint(point, rotation.yaw, rotation.pitch); return { x: 160 + x, y: 150 - y, depth }; };
  const surface = (lat: number, lon: number) => earthSurface(lat, lon, spin);
  const facets = Array.from({ length: 18 }, (_, row) => Array.from({ length: 36 }, (_, column) => {
    const lat = -90 + row * 10, lon = column * 10;
    const center = surface(lat + 5, lon + 5), projected = project(center);
    const brightness = Math.max(0, solarIncidence(center, day));
    const color = [.10, .10, .10].map((_, i) => Math.round([22, 37, 50][i] + ([129, 187, 208][i] - [22, 37, 50][i]) * (.1 + .9 * Math.sqrt(brightness))));
    return { key: `${row}-${column}`, depth: projected.depth, points: [[lat, lon], [lat + 10, lon], [lat + 10, lon + 10], [lat, lon + 10]].map(([a, b]) => project(surface(a, b))).map(p => `${p.x},${p.y}`).join(' '), color: `rgb(${color.join(',')})` };
  })).flat().filter(face => face.depth >= 0).sort((a, b) => a.depth - b.depth);
  const line = (points: SpatialPoint[], frontOnly = true) => {
    let drawing = '', visible = false;
    for (const point of points) { const p = project(point); if (!frontOnly || p.depth >= 0) { drawing += `${visible ? 'L' : 'M'}${p.x},${p.y} `; visible = true; } else visible = false; }
    return drawing;
  };
  const parallel = (latitude: number) => Array.from({ length: 145 }, (_, i) => surface(latitude, i * 2.5));
  const marker = project(surface(city.latitude, 0));
  const sun = earthSunDirection(day), source = project(sun.map(value => value * 132) as SpatialPoint);
  return <section className="vs-science-card vs-earth-spatial" aria-label="Estações e rotação terrestre em três dimensões">
    <header><small>GEOGRAFIA · MODELO ESPACIAL</small><h4>Gire a vista; mantenha o eixo e mude a data</h4></header>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch} aria-label={`Terra: eixo físico fixo de ${INCLINACAO} graus, data ${escreverDia(day)}, declinação solar ${declinacao(day).toFixed(1)} graus; rotação diária ${Math.round(spin)} graus. Claro e escuro representam dia e noite.`}>
      <defs><radialGradient id={id + '-sun'}><stop stopColor="#fff2aa" /><stop offset="1" stopColor="#d19121" /></radialGradient></defs>
      {facets.map(face => <polygon key={face.key} points={face.points} fill={face.color} stroke={face.color} strokeWidth=".6" />)}
      <path d={line(parallel(0))} fill="none" stroke="#f3ead6" strokeWidth="1.5" />
      {[-INCLINACAO, INCLINACAO].map(latitude => <path key={latitude} d={line(parallel(latitude))} fill="none" stroke="#e8c678" strokeWidth="1.5" strokeDasharray="4 3" />)}
      <path d={line([earthAxis.map(value => value * -118) as SpatialPoint, earthAxis.map(value => value * 118) as SpatialPoint], false)} fill="none" stroke="var(--vs-burgundy)" strokeWidth="2" />
      {(() => { const p = project(earthAxis.map(value => value * 121) as SpatialPoint); return <text x={p.x} y={p.y - 5} textAnchor="middle" fill="var(--vs-ink)">N</text>; })()}
      {marker.depth >= 0 && <circle cx={marker.x} cy={marker.y} r="5" fill="#fff2aa" stroke="var(--vs-burgundy)" strokeWidth="2" />}
      <circle cx={source.x} cy={source.y} r="10" fill={`url(#${id}-sun)`} /><text x={source.x} y={source.y - 16} textAnchor="middle" fill="var(--vs-ink)">Sol</text>
    </svg>
    <div className="vs-science-choices" role="group" aria-label="Latitude observada">{CIDADES.map(city => <button key={city.id} type="button" aria-pressed={city.id === cityId} onClick={() => setCityId(city.id)}>{city.nome}</button>)}</div>
    <label className="vs-science-rotation" htmlFor={id + '-day'}>Data no ano <output>{escreverDia(day)}</output></label><input id={id + '-day'} type="range" min="1" max="365" value={day} onChange={event => { clock.seek(0); setDay(Number(event.target.value)); }} />
    <TimeControl clock={clock} label="Fração de uma rotação diária" />
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a vista da Terra <output>{Math.round(rotation.yaw)}°</output></label><input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label><input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-reading" role="status" aria-label="Leitura das estações">Em {city.nome} ({city.latitude}°), o dia claro dura aproximadamente {escreverHoras(duracaoDoDia(city.latitude, day))}. Declinação solar: {declinacao(day).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°. A inclinação física permanece {INCLINACAO}°; mover a câmera não a modifica.</p>
    <p className="vs-science-caption">Arraste ou use setas e Home. Linha contínua: Equador; tracejadas: trópicos. O marcador indica a latitude da cidade, em um meridiano ilustrativo, não sua longitude real. A data muda a direção do Sol no plano orbital; o eixo mantém a direção no espaço. Sol, distâncias e tamanhos fora de escala; sem continentes. Duração do dia calculada sem refração atmosférica. A reprodução mostra uma volta diurna, não um ano de translação; a origem angular é arbitrária.</p>
  </section>;
}
