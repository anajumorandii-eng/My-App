import React, { useMemo, useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { projectSpatialModel, spatialSolid } from '../../lib/spatialSolid';
import type { SolidConfigId } from '../../lib/solidInstruments';

/** Projeção de geometria 3D em SVG, com rotação por gesto ou controle de teclado. */
export function SpatialSolidView({ id, values, shape, label }: {
  id: SolidConfigId;
  values: Record<string, number>;
  shape?: string;
  label: string;
}) {
  const [yaw, setYaw] = useState(30), [pitch, setPitch] = useState(22);
  const pointer = useRef<{ id: number; x: number; y: number; yaw: number; pitch: number } | null>(null);
  const model = useMemo(() => spatialSolid(id, values, shape), [id, values, shape]);
  const projected = useMemo(() => projectSpatialModel(model, yaw, pitch), [model, yaw, pitch]);
  const reset = () => { setYaw(30); setPitch(22); };
  return (
    <div className="vs-spatial-solid">
      <svg className="vs-plane vs-solid vs-solid-spatial" viewBox="0 0 320 300" role="img"
        aria-label={label + '. Objeto tridimensional: rotação ' + Math.round(yaw) + ' graus, ângulo vertical ' + Math.round(pitch) + ' graus.'}
        onPointerDown={event => {
          if (!event.isPrimary) return;
          event.stopPropagation();
          pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, yaw, pitch };
          event.currentTarget.setPointerCapture?.(event.pointerId);
        }}
        onPointerMove={event => {
          const start = pointer.current;
          if (!start || start.id !== event.pointerId) return;
          event.stopPropagation();
          setYaw(((start.yaw + (event.clientX - start.x) * 0.7) % 360 + 360) % 360);
          setPitch(Math.max(-50, Math.min(65, start.pitch - (event.clientY - start.y) * 0.45)));
        }}
        onPointerUp={() => { pointer.current = null; }}
        onPointerCancel={() => { pointer.current = null; }}
      >
        <ellipse className="vs-solid-ground" cx="160" cy="262" rx="90" ry="13" />
        {projected.faces.map(face => <polygon key={face.index} className="vs-solid-face" data-kind={face.kind}
          points={face.points.map(p => p.map(v => v.toFixed(2)).join(',')).join(' ')}
          style={{ '--face-light': face.light } as React.CSSProperties} />)}
        {projected.lines.map(line => <g key={line.label} className="vs-solid-dimension">
          <line x1={line.from[0]} y1={line.from[1]} x2={line.to[0]} y2={line.to[1]} strokeDasharray={line.dashed ? '4 3' : undefined} />
          <text x={(line.from[0] + line.to[0]) / 2 + 9} y={(line.from[1] + line.to[1]) / 2 - 8}>{line.label}</text>
        </g>)}
      </svg>
      <div className="vs-solid-rotation">
        <label htmlFor={id + '-yaw'}>Girar o objeto <output>{Math.round(yaw)}°</output></label>
        <input id={id + '-yaw'} type="range" min="0" max="360" step="1" value={Math.round(yaw)} onChange={event => setYaw(Number(event.target.value))} />
        <label htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(pitch)}°</output></label>
        <input id={id + '-pitch'} type="range" min="-50" max="65" step="1" value={Math.round(pitch)} onChange={event => setPitch(Number(event.target.value))} />
        <button type="button" onClick={reset}><RotateCcw aria-hidden="true" />Restaurar vista</button>
      </div>
      <p className="vs-instrument-dica">Arraste o objeto para ver outras faces. As medidas permanecem iguais.</p>
    </div>
  );
}
