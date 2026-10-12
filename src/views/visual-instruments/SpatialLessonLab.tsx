import React, { useId, useState } from 'react';
import type { PhysicsSpatialDrawing } from '../../lib/physicsSpatialDrawing';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import { SpatialLabFrame, type SpatialObservationField } from './SpatialLabFrame';
import { SpatialStage } from './SpatialStage';

export interface SpatialLessonConfig { kind: string; title: string; label: string; min: number; max: number; step: number; initial: number; note: string; choices?: [string, string][]; }

/** Valor do parâmetro durante a varredura, preso à grade do controle para a leitura não mostrar valores que o controle não permite. */
export function sweepValue(config: Pick<SpatialLessonConfig, 'min' | 'max' | 'step'>, time: number): number {
  const raw = config.min + (config.max - config.min) * Math.max(0, Math.min(1, time));
  const snapped = config.min + Math.round((raw - config.min) / config.step) * config.step;
  return Number(Math.min(config.max, snapped).toFixed(6));
}

/**
 * Laboratório espacial comum aos lotes por capítulo. Quando o fenômeno tem percurso
 * no tempo, o relógio move o modelo; quando não tem, o relógio percorre o parâmetro do
 * mínimo ao máximo. A auditoria de 11/10/2026 encontrou 89 modelos sem nenhum
 * movimento — a varredura dá a eles movimento com significado (ver a grandeza mudar)
 * sem inventar uma dinâmica que o capítulo não descreve.
 */
export function SpatialLessonLab({ config, draw, moving, dataAttributes, parameterLabel }: {
  config: SpatialLessonConfig;
  draw: (value: number, time: number, choice: string) => PhysicsSpatialDrawing;
  moving: (choice: string) => boolean;
  dataAttributes: Record<string, string>;
  parameterLabel?: (choice: string) => string;
}) {
  const uid = useId();
  const [value, setValue] = useState(config.initial), [choice, setChoice] = useState(config.choices?.[0][0] || '');
  const clock = useMechanismTime();
  const timed = moving(choice);
  const sweeping = !timed && clock.time > 0;
  const shown = sweeping ? sweepValue(config, clock.time) : value;
  const model = draw(shown, timed ? clock.time : 0, choice);
  const label = parameterLabel?.(choice) ?? config.label;
  const observation: SpatialObservationField[] = [
    { id: 'parameter', label, value: shown.toLocaleString('pt-BR') },
    ...(config.choices?.length ? [{ id: 'condition', label: 'Condição', value: config.choices.find(item => item[0] === choice)?.[1] ?? choice }] : []),
    { id: 'progress', label: timed ? 'Percurso do modelo' : 'Varredura do parâmetro', value: `${(clock.time * 100).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%` },
  ];
  return <SpatialLabFrame title={config.title} reading={model.reading} note={config.note} observation={observation} controls={<>
    <p className="vs-science-caption">{model.legend}</p>
    {!!config.choices?.length && <div className="vs-science-choices" role="group" aria-label="Condições do modelo">{config.choices.map(([id, text]) => <button key={id} type="button" aria-pressed={choice === id} onClick={() => { clock.seek(0); setChoice(id); }}>{text}</button>)}</div>}
    <label className="vs-spatial-parameter" htmlFor={uid + '-parameter'}>{label} <output>{shown.toLocaleString('pt-BR')}</output></label>
    <input id={uid + '-parameter'} type="range" min={config.min} max={config.max} step={config.step} value={shown} style={{ '--fill': `${((shown - config.min) / Math.max(1e-9, config.max - config.min)) * 100}%` } as React.CSSProperties} onChange={event => { clock.seek(0); setValue(Number(event.target.value)); }} />
    <TimeControl clock={clock} label={timed ? 'Percurso finito do modelo' : `Percorrer: ${label.toLocaleLowerCase('pt-BR')}`} />
  </>}>
    {camera => <SpatialStage model={model} camera={camera} label={`${config.title}. ${model.reading}`} dataAttributes={dataAttributes} />}
  </SpatialLabFrame>;
}
