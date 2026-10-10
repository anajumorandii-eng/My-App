import { GeneratorSpatialView } from './GeneratorSpatialView';
import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { MAGNETISM, lenzReadouts, lenzModel, type LenzMode, type MagnetismId } from '../../lib/magnetismLab';
import type { BoardProps } from '../visual-boards/types';

import LenzScene from './LenzScene';
import { MagneticTrajectoryView } from './MagneticTrajectoryView';
import { MagneticFieldView } from './MagneticFieldView';

const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const accent = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };
function Label({ x, y, children }: { x: number; y: number; children: React.ReactNode }) { return <text x={x} y={y} textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>{children}</text>; }
function Scene({ id, value, phase }: { id: MagnetismId; value: number; phase: number }) {
  if (id === 'fio-espira') return <g style={{ fontSize: 12 }}>
    <Label x={90} y={22}>Fio: vista de frente</Label><Label x={160} y={42}>{value > 0 ? 'corrente saindo do plano ⊙' : 'I = 0 · sem corrente'}</Label>
    <circle cx="90" cy="108" r="12" {...accent}/>{value > 0 && <circle cx="90" cy="108" r="4" fill="var(--vs-burgundy)"/>}
    {value > 0 && <g data-field-direction="counterclockwise">{[32, 52].map(r => <circle key={r} cx="90" cy="108" r={r} {...ink} opacity={.3 + value / 15}/>)}<path d="M106 56H85m8-6-8 6 8 6" {...accent}/></g>}
    <Label x={237} y={62}>Espira: vista de frente</Label><circle cx="237" cy="108" r="38" {...ink}/>
    {value > 0 && <g><path d="M254 70H230m8-6-8 6 8 6" {...accent}/><circle data-coil-field="outward" cx="237" cy="108" r="10" {...accent}/><circle cx="237" cy="108" r="3" fill="var(--vs-burgundy)"/></g>}
    <Label x={160} y={182}>Mão direita no fio:</Label><Label x={160} y={198}>polegar em I; dedos em B</Label>
    <Label x={160} y={218}>Espira: dedos em I; polegar em B</Label>
    <Label x={160} y={238}>{value === 0 ? 'I = 0 → B = 0' : 'I anti-horário na espira → B saindo ⊙'}</Label>
    <Label x={160} y={278}>⊙ sai do plano · ⊗ entra no plano</Label>
  </g>;
  if (id === 'carga-em-b') {
    const radians = value * Math.PI / 180;
    const perpendicular = value === 0 ? 0 : Math.sin(radians);
    const parallel = value === 90 ? 0 : Math.cos(radians);
    const radius = 42 * perpendicular;
    const particleY = 104 + radius;
    const forceHead = Math.min(7, 32 * perpendicular * .4);
    const perpendicularHead = Math.min(7, 50 * perpendicular * .4);
    const parallelHead = Math.min(7, 110 * parallel * .4);
    const motion = value === 0 ? 'straight' : value === 90 ? 'circle' : 'helix';
    return <g data-charge-motion={motion} style={{ fontSize: 14, fill: 'var(--vs-ink)' }}>
      <Label x={160} y={20}>{motion === 'helix' ? 'projeções da hélice · q > 0' : motion === 'circle' ? 'movimento circular · q > 0' : 'movimento retilíneo · q > 0'}</Label>
      <text x="16" y="43">Plano perpendicular a B</text>
      <text x="16" y="66">× B entrando</text>
      {perpendicular > 0 && <>
        <circle data-orbit="perpendicular" cx="160" cy="104" r={radius} {...accent}/>
        <line data-vector="velocity-perpendicular" x1="160" y1={particleY} x2={160 + 50 * perpendicular} y2={particleY} {...ink}/>
        <path data-arrowhead="velocity-perpendicular" data-size={perpendicularHead} d={`M${160 + 50 * perpendicular - perpendicularHead} ${particleY - perpendicularHead * .7}l${perpendicularHead} ${perpendicularHead * .7}-${perpendicularHead} ${perpendicularHead * .7}`} {...ink}/>
        <text x="240" y="166" textAnchor="middle">v⊥</text>
        <line data-vector="force" x1="160" y1={particleY} x2="160" y2={particleY - 32 * perpendicular} {...accent}/>
        <path data-arrowhead="force" data-size={forceHead} d={`M${160 - forceHead * .7} ${particleY - 32 * perpendicular + forceHead}l${forceHead * .7}-${forceHead} ${forceHead * .7} ${forceHead}`} {...accent}/>
        <text x="174" y={particleY - 23 * perpendicular}>F</text>
      </>}
      <circle cx="160" cy={particleY} r="5" fill="var(--vs-burgundy)"/>
      {perpendicular === 0 && <text x="82" y="142">v⊥ = 0 · F = 0</text>}
      <text x="16" y="178">r ∝ v⊥ = v sen θ</text>
      <path d="M16 190H304" {...ink} strokeWidth="1" opacity=".3"/>
      <text x="16" y="213">Ao longo de B →</text>
      {parallel > 0 && <>
        <line data-parallel-track="true" x1="82" y1="234" x2={82 + 110 * parallel} y2="234" {...accent}/>
        <line data-vector="velocity-parallel" x1="82" y1="234" x2={82 + 110 * parallel} y2="234" {...ink}/>
        <path data-arrowhead="velocity-parallel" data-size={parallelHead} d={`M${82 + 110 * parallel - parallelHead} ${234 - parallelHead * .7}l${parallelHead} ${parallelHead * .7}-${parallelHead} ${parallelHead * .7}`} {...ink}/>
      </>}
      <circle cx="82" cy="234" r="5" fill="var(--vs-burgundy)"/>
      <text x="16" y="259">v∥ = v cos θ · F∥ = 0</text>
      <Label x={160} y={286}>{value === 0 ? 'θ = 0°: v paralela a B' : value === 90 ? 'θ = 90°: v perpendicular a B' : `θ = ${value}° entre v e B no espaço`}</Label>
    </g>;
  }
  if (id === 'fios-paralelos') return <>
    <path d="M105 45V235M215 45V235" {...ink}/>
    {value > 0 && <><path data-current-arrow="left" d="M105 120V80m-6 8 6-8 6 8" {...accent}/><path data-current-arrow="right" d="M215 120V80m-6 8 6-8 6 8" {...accent}/><path data-force="left" d="M105 150H145m-8-6 8 6-8 6" {...accent}/><path data-force="right" d="M215 150H175m8-6-8 6 8 6" {...accent}/><Label x={75} y={170}>F₁</Label><Label x={247} y={170}>F₂</Label></>}
    <Label x={105} y={62}>I₁</Label><Label x={215} y={62}>I₂</Label>
    <Label x={160} y={258}>F₁ = −F₂ · fios distintos</Label><Label x={160} y={282}>{value === 0 ? 'sem corrente, sem força' : 'mesmo sentido: atração'}</Label></>;
  const radians = phase * Math.PI / 180;
  const emf = Math.round(.4 * value * Math.sin(radians) * 100) / 100;
  const flux = Math.round(.4 * Math.cos(radians) * 100) / 100;
  return <g style={{ fontSize: 12 }}>
    <rect x="30" y="40" width="36" height="158" fill="var(--vs-burgundy)" opacity=".3"/><rect x="254" y="40" width="36" height="158" fill="var(--vs-blue)" opacity=".3"/>
    <Label x={48} y={66}>N</Label><Label x={272} y={66}>S</Label>
    <path data-vector="generator-field" d="M80 82H238m-9-6 9 6-9 6" {...accent}/><Label x={160} y={72}>B → uniforme</Label>
    <ellipse cx="160" cy="142" rx={Math.max(3, Math.abs(48 * Math.sin(radians)))} ry="48" {...ink}/>
    <path d={`M160 142l${48 * Math.cos(radians)} ${-24 * Math.sin(radians)}`} {...accent}/><Label x={160} y={200}>Projeção esquemática · n · θ = {phase}°</Label><Label x={160} y={219}>I: corrente no circuito externo</Label>
    {emf !== 0 && <path data-generator-current={emf > 0 ? 'positive' : 'negative'} d={emf > 0 ? 'M92 124V163m-6-8 6 8 6-8' : 'M92 163V124m-6 8 6-8 6 8'} {...accent}/>}
    <Label x={160} y={238}>Φ = BA cos θ = {flux} Wb</Label>
    <text data-generator-emf={emf} x="160" y="257" textAnchor="middle" fill="var(--vs-ink)">ε = NBAω sen θ = {emf} V</text>
    <Label x={160} y={276}>N = 1 · BA = 0,4 Wb · R = 1 Ω · I = ε/R</Label><Label x={160} y={295}>Corrente inverte a cada 180°</Label>
  </g>;
}
function firstSentence(text?: string) { const sentence = text?.split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; }
export function magnetismInstrument(id: MagnetismId) { const config = MAGNETISM[id]; return function MagnetismBoard(props: BoardProps) { const [value, setValue] = useState(config.control.initial); const [phase, setPhase] = useState(90); const [spatialOpen, setSpatialOpen] = useState(false); const [lenzMode, setLenzMode] = useState<LenzMode>('retreat'); const readouts = id === 'lenz' ? lenzReadouts(lenzMode, value) : config.readouts(value); const pivot = readouts.find((item) => item.pivot) ?? readouts[0]; const pair = boardPair(props); const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1); return <BoardShell kicker="Laboratório de magnetismo" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de magnetismo: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}${id === 'lenz' ? `; ${lenzModel(lenzMode, value).current}, visto do ímã; B externo para a direita` : ''}`}>{id === 'lenz' ? <LenzScene mode={lenzMode} time={value} /> : <Scene id={id} value={value} phase={phase} />}</svg><div className="vs-plane-controls">{id === 'gerador' && <div className="vs-plane-control"><label htmlFor="generator-phase">Fase θ · ângulo entre normal e B: {phase}°</label><input id="generator-phase" type="range" min="0" max="360" step="30" value={phase} onChange={event => setPhase(Number(event.target.value))}/></div>}{id === 'lenz' && <div className="vs-plane-control"><label htmlFor="lenz-motion">Movimento do ímã</label><select id="lenz-motion" value={lenzMode} onChange={(event) => setLenzMode(event.target.value as LenzMode)}><option value="approach">Aproximar</option><option value="retreat">Afastar</option><option value="stationary">Parado</option></select></div>}<div className="vs-plane-control"><label htmlFor={`magnetism-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`magnetism-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>{id === 'gerador' && <><div className="vs-science-choices"><button type="button" aria-expanded={spatialOpen} onClick={() => setSpatialOpen(open => !open)}>{spatialOpen ? 'Recolher gerador 3D' : 'Explorar gerador 3D'}</button></div>{spatialOpen && <GeneratorSpatialView phase={phase} omega={value} />}</>}{id === 'fio-espira' && <><div className="vs-science-choices"><button type="button" aria-expanded={spatialOpen} onClick={() => setSpatialOpen(open => !open)}>{spatialOpen ? 'Recolher campo 3D' : 'Explorar campo 3D'}</button></div>{spatialOpen && <MagneticFieldView current={value} />}</>}{id === 'carga-em-b' && <><div className="vs-science-choices"><button type="button" aria-expanded={spatialOpen} onClick={() => setSpatialOpen(open => !open)}>{spatialOpen ? 'Recolher trajetória 3D' : 'Explorar trajetória 3D'}</button></div>{spatialOpen && <MagneticTrajectoryView theta={value} />}</>}</div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: firstSentence(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: firstSentence(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação magnética', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight} />; }; }
