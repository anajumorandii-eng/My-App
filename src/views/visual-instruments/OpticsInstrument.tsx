import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { angleOfRefraction, OPTICS, sphericalImageDistance, type OpticsId } from '../../lib/opticsLab';
import type { BoardProps } from '../visual-boards/types';

function short(text?: string) { const first = text?.trim().split(/(?<=[.!?])\s/)[0] ?? ''; return first.length > 180 ? `${first.slice(0, 176)}…` : first; }
const rayStyle = { fill: 'none', stroke: 'var(--vs-burgundy)', strokeWidth: 3 } as const;

function PlaneMirror({ incidence }: { incidence: number }) {
  const radians = incidence * Math.PI / 180;
  const dx = Math.sin(radians) * 95;
  const dy = Math.cos(radians) * 95;
  return <><line x1="160" y1="26" x2="160" y2="274" stroke="var(--vs-ink)" strokeWidth="6" /><line x1="36" y1="150" x2="284" y2="150" stroke="var(--vs-ink)" strokeDasharray="5 5" /><path d={`M${160 - dx} ${150 - dy} L160 150 L${160 + dx} ${150 - dy}`} style={rayStyle} /><text x="165" y="42" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>espelho</text><text x="170" y="145" style={{ fill: 'var(--vs-ink)' }}>normal</text><text x="74" y="96" style={{ fill: 'var(--vs-ink)' }}>i = {incidence}°</text><text x="210" y="96" style={{ fill: 'var(--vs-ink)' }}>r = {incidence}°</text></>;
}

function SphericalMirror({ p }: { p: number }) {
  const distance = sphericalImageDistance(p);
  const objectX = 270 - p * 2;
  const imageX = distance === null ? 18 : Math.max(24, Math.min(306, 270 - distance * 2));
  const imageH = distance !== null && distance > 0 ? 48 : -35;
  return <><path d="M270 38 Q218 150 270 262" fill="none" stroke="var(--vs-ink)" strokeWidth="7" /><line x1="25" y1="150" x2="283" y2="150" stroke="var(--vs-ink)" strokeDasharray="5 5" /><circle cx="240" cy="150" r="4" fill="var(--vs-burgundy)" /><text x="240" y="174" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>F</text><path d={`M${objectX} 150 V${104} m-7 10 l7 -10 l7 10`} stroke="var(--vs-burgundy)" strokeWidth="3" fill="none" /><text x={objectX} y="188" textAnchor="middle" style={{ fill: 'var(--vs-ink)' }}>objeto</text>{distance !== null && <><path d={`M${objectX} 104 L270 104 L${imageX} ${150 - imageH}`} style={rayStyle} /><path d={`M${imageX} 150 V${150 - imageH} m-7 ${imageH > 0 ? -10 : 10} l7 ${imageH > 0 ? 10 : -10} l7 ${imageH > 0 ? -10 : 10}`} stroke="var(--vs-burgundy)" strokeWidth="3" fill="none" /><text x={imageX} y="278" textAnchor="middle" style={{ fill: 'var(--vs-ink)' }}>{distance > 0 ? 'imagem real' : 'imagem virtual'}</text></>}</>;
}

function Refraction({ incidence }: { incidence: number }) {
  const refraction = angleOfRefraction(incidence);
  const toPoint = (angle: number, length: number, below = false) => [160 + Math.sin(angle * Math.PI / 180) * length, 150 + (below ? 1 : -1) * Math.cos(angle * Math.PI / 180) * length];
  const [ix, iy] = toPoint(incidence, 118); const [rx, ry] = toPoint(refraction, 118, true);
  return <><rect x="24" y="150" width="272" height="126" fill="color-mix(in srgb, var(--vs-burgundy) 15%, transparent)" /><line x1="160" y1="28" x2="160" y2="274" stroke="var(--vs-ink)" strokeDasharray="5 5" /><line x1="24" y1="150" x2="296" y2="150" stroke="var(--vs-ink)" strokeWidth="3" /><path d={`M${ix} ${iy} L160 150 L${rx} ${ry}`} style={rayStyle} /><text x="42" y="135" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>ar · n = 1,0</text><text x="42" y="258" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>vidro · n = 1,5</text><text x="205" y="112" style={{ fill: 'var(--vs-ink)' }}>i = {incidence}°</text><text x="205" y="206" style={{ fill: 'var(--vs-ink)' }}>r = {refraction.toFixed(1).replace('.', ',')}°</text></>;
}

function Vision({ power }: { power: number }) {
  const correction = Math.abs(power) * 9;
  const focalX = Math.min(246, 164 + correction);
  return <><path d="M42 150 Q103 46 243 81 Q294 150 243 219 Q103 254 42 150Z" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="4" /><ellipse cx="160" cy="150" rx="17" ry="69" fill="color-mix(in srgb,var(--vs-burgundy) 24%,transparent)" stroke="var(--vs-burgundy)" strokeWidth="3" /><path d="M243 83 Q274 150 243 217" fill="none" stroke="var(--vs-burgundy)" strokeWidth="7" /><path d={`M48 106 L160 122 L${focalX} 150 M48 150 H${focalX} M48 194 L160 178 L${focalX} 150`} style={rayStyle} /><circle cx={focalX} cy="150" r="6" fill="var(--vs-burgundy)" /><text x="245" y="66" textAnchor="middle" style={{ fill: 'var(--vs-ink)', fontWeight: 800 }}>retina</text><text x="160" y="238" textAnchor="middle" style={{ fill: 'var(--vs-ink)' }}>lente {power} D</text><text x={focalX} y="136" textAnchor="middle" style={{ fill: 'var(--vs-ink)' }}>foco</text></>;
}

function Scene({ id, value }: { id: OpticsId; value: number }) {
  if (id === 'plane-mirror') return <PlaneMirror incidence={value} />;
  if (id === 'spherical-mirror') return <SphericalMirror p={value} />;
  if (id === 'refraction') return <Refraction incidence={value} />;
  return <Vision power={value} />;
}

export function opticsInstrument(id: OpticsId) {
  const config = OPTICS[id];
  return function OpticsBoard(props: BoardProps) {
    const [value, setValue] = useState(config.control.initial);
    const readouts = config.readouts(value);
    const pivot = readouts.find(item => item.pivot) ?? readouts[0];
    const pair = boardPair(props);
    const first = props.map.nodes[0];
    const second = props.map.nodes[2] ?? props.map.nodes.at(-1);
    return <BoardShell kicker="Bancada de óptica" title={config.name} subtitle={config.question} condition={{ label: 'leitura', value: pivot.value }} ariaLabel={`Instrumento de óptica: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value} /></svg><p className="vs-instrument-dica">altere a condição e acompanhe o caminho do raio</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`optics-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`optics-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={event => setValue(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts">{readouts.map(item => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação óptica', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight} />;
  };
}
