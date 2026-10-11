import React, { useId, useRef, useState } from 'react';
import { useSpatialRotation } from '../../hooks/useSpatialRotation';
import './ScienceObjectView.css';

export type SpatialCamera = ReturnType<typeof useSpatialRotation>;
/** A câmera é independente dos parâmetros físicos e da evidência pedagógica. */
export function SpatialLabFrame({ title, reading, note, children, controls }: {
  title: string; reading: string; note: string;
  children: (camera: SpatialCamera) => React.ReactNode; controls?: React.ReactNode;
}) {
  const camera = useSpatialRotation(25, 20), id = useId();
  const compareButton = useRef<HTMLButtonElement>(null);
  const [reference, setReference] = useState<{ reading: string; figure: React.ReactNode } | null>(null);
  return <section className="vs-science-card vs-field-spatial vs-spatial-lab" data-spatial-batch="2026-10-10" aria-label={title}>
    <header><small>CRIVO · EXPLORAÇÃO ESPACIAL</small><h3>{title}</h3></header>
    {children(camera)}
    <div className="vs-spatial-workbench">
      <section className="vs-spatial-observation" aria-label="Manipular e observar">
        <h4>Manipule e observe</h4>
        {controls}
        <p className="vs-science-reading" role="status" aria-label="Leitura do modelo espacial">{reading}</p>
        <div className="vs-science-choices">
          <button ref={compareButton} type="button" onClick={() => setReference({ reading, figure: children(camera) })}>{reference ? 'Atualizar referência' : 'Guardar para comparar'}</button>
          {reference && <button type="button" onClick={() => { setReference(null); compareButton.current?.focus(); }}>Limpar comparação</button>}
        </div>
        <span className="sr-only" role="status" aria-label="Estado da comparação">{reference ? 'Referência guardada. Altere uma condição e compare os estados.' : 'Nenhuma referência guardada.'}</span>
      </section>
      <details className="vs-spatial-camera" open>
        <summary>Ajustar ponto de vista</summary>
        <label className="vs-science-rotation" htmlFor={id + '-yaw'}>Girar a vista <output>{Math.round(camera.yaw)}°</output></label>
        <input id={id + '-yaw'} type="range" min="0" max="360" value={camera.yaw} onChange={e => camera.setYaw(Number(e.target.value))} />
        <label className="vs-science-rotation" htmlFor={id + '-pitch'}>Inclinar a vista <output>{Math.round(camera.pitch)}°</output></label>
        <input id={id + '-pitch'} type="range" min="-50" max="65" value={camera.pitch} onChange={e => camera.setPitch(Number(e.target.value))} />
        <div className="vs-science-choices"><button type="button" aria-pressed={camera.spinning} onClick={camera.toggleSpin}>{camera.spinning ? 'Pausar giro' : 'Girar o modelo'}</button><button type="button" onClick={camera.reset}>Restaurar vista</button></div>
        <p className="vs-science-caption">Arraste o modelo ou use as setas e Home. Girar a câmera conserva os valores do conteúdo.</p>
      </details>
    </div>
    {reference && <section className="vs-spatial-comparison" aria-label="Comparação de estados">
      <header><h4>Compare com a referência</h4><p>Altere uma condição no modelo acima. O que mudou? O que permaneceu?</p></header>
      <div className="vs-spatial-reference-figure" inert aria-hidden="true">{reference.figure}</div>
      <div className="vs-spatial-comparison-readings">
        <div><strong>Estado guardado</strong><p>{reference.reading}</p></div>
        <div><strong>Estado atual</strong><p>{reading}</p></div>
        {reference.reading === reading && <p className="vs-science-caption">A leitura permanece igual. Experimente mudar uma condição do conteúdo; a câmera altera apenas a vista.</p>}
      </div>
    </section>}
    <p className="vs-science-caption vs-spatial-note">{note}</p>
  </section>;
}
