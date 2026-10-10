import React, { useId } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import './ScienceObjectView.css';

export type SpatialCamera = ReturnType<typeof useSpatialRotation>;
/** A câmera é independente dos parâmetros físicos e da evidência pedagógica. */
export function SpatialLabFrame({ title, reading, note, children, controls }: {
  title: string; reading: string; note: string;
  children: (camera: SpatialCamera) => React.ReactNode; controls?: React.ReactNode;
}) {
  const camera = useSpatialRotation(25, 20), id = useId();
  return <section className="vs-science-card vs-field-spatial vs-spatial-lab" data-spatial-batch="2026-10-10" aria-label={title}>
    <header><small>CRIVO · EXPLORAÇÃO ESPACIAL</small><h4>{title}</h4></header>
    {children(camera)}
    {controls}
    <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a vista <output>{Math.round(camera.yaw)}°</output></label>
    <input id={id + '-yaw'} type="range" min="0" max="360" value={camera.yaw} onChange={e => camera.setYaw(Number(e.target.value))} />
    <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(camera.pitch)}°</output></label>
    <input id={id + '-pitch'} type="range" min="-50" max="65" value={camera.pitch} onChange={e => camera.setPitch(Number(e.target.value))} />
    <div className="vs-science-choices"><button type="button" onClick={camera.reset}>Restaurar vista</button></div>
    <p className="vs-science-reading" role="status" aria-label="Leitura do modelo espacial">{reading}</p>
    <p className="vs-science-caption">Arraste, toque ou use setas e Home para explorar. A câmera conserva os valores do modelo. {note}</p>
  </section>;
}
