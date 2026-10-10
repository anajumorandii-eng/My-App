import React, { useId } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import { projectGeographicPoint, visibleGeographicPath } from '../../lib/geographicGlobe';
import './ScienceObjectView.css';

export function GeographicGlobeView({ latitude, longitude }: { latitude: number; longitude: number }) {
  const rotation = useSpatialRotation(0, 12);
  const id = useId().replace(/:/g, '');
  const path = (points: [number, number][]) => visibleGeographicPath(points, rotation.yaw, rotation.pitch);
  const point = projectGeographicPoint(latitude, longitude, rotation.yaw, rotation.pitch);
  const meridian = (lon: number): [number, number][] => Array.from({ length: 73 }, (_, i) => [-90 + i * 2.5, lon]);
  const parallel = (lat: number): [number, number][] => Array.from({ length: 145 }, (_, i) => [lat, -180 + i * 2.5]);
  return <section className="vs-science-card" aria-label="Coordenadas sobre um globo tridimensional">
    <header><small>GEOGRAFIA · MODELO ESPACIAL</small><h4>Gire o globo, conserve o endereço</h4></header>
    <svg {...rotation.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={rotation.yaw} data-view-pitch={rotation.pitch}
      aria-label={`Globo esférico: latitude ${latitude} graus, longitude ${longitude} graus. Ponto ${point.visible ? 'visível' : 'no hemisfério oculto'}. Girar a câmera conserva as coordenadas.`}>
      <defs><radialGradient id={id + '-globe'} cx="30%" cy="25%" r="80%"><stop stopColor="var(--vs-paper-strong)" /><stop offset=".5" stopColor="var(--vs-blue)" stopOpacity=".35" /><stop offset="1" stopColor="var(--vs-blue)" stopOpacity=".8" /></radialGradient></defs>
      <ellipse cx="160" cy="276" rx="94" ry="10" className="vs-science-ground" />
      <circle cx="160" cy="150" r="104" fill={`url(#${id}-globe)`} stroke="var(--vs-blue)" strokeWidth="2" />
      {[...Array(12)].map((_, i) => <path key={'meridian-' + i} d={path(meridian(-180 + i * 30))} fill="none" stroke="var(--vs-ink)" strokeWidth="1" opacity=".35" />)}
      {[-60, -30, 30, 60].map(lat => <path key={lat} d={path(parallel(lat))} fill="none" stroke="var(--vs-ink)" strokeWidth="1" opacity=".35" />)}
      <path d={path(parallel(0))} fill="none" stroke="var(--vs-ink)" strokeWidth="2" />
      <path d={path(meridian(0))} fill="none" stroke="var(--vs-ink)" strokeWidth="2" strokeDasharray="4 3" />
      <path d={path(parallel(latitude))} fill="none" stroke="var(--vs-green)" strokeWidth="3" />
      <path d={path(meridian(longitude))} fill="none" stroke="var(--vs-burgundy)" strokeWidth="3" />
      {point.visible && <circle cx={point.x} cy={point.y} r="6" fill="var(--vs-paper-strong)" stroke="var(--vs-burgundy)" strokeWidth="3" />}
    </svg>
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar o globo <output>{Math.round(rotation.yaw)}°</output></label>
    <input id={id + '-yaw'} type="range" min="0" max="360" value={rotation.yaw} onChange={event => rotation.setYaw(Number(event.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(rotation.pitch)}°</output></label>
    <input id={id + '-pitch'} type="range" min="-50" max="65" value={rotation.pitch} onChange={event => rotation.setPitch(Number(event.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={rotation.reset}>Restaurar vista</button></div>
    <p className="vs-science-reading" role="status" aria-label="Leitura do globo">{point.visible ? 'O ponto está no hemisfério visível.' : 'O ponto está atrás do globo; gire a vista para encontrá-lo.'} Latitude {latitude}°; longitude {longitude}°. Paralelo verde e meridiano vinho se encontram no endereço escolhido.</p>
    <p className="vs-science-caption">Use os controles de latitude e longitude do laboratório para mudar o endereço. Arraste o globo ou use as setas e Home com o desenho em foco. Equador: linha contínua; Greenwich: tracejada. Modelo esférico sem continentes; a iluminação indica volume, não dia e noite. Inclinar a câmera não representa a inclinação do eixo terrestre.</p>
  </section>;
}
