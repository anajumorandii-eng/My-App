import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { MAGNETISM, lenzReadouts, lenzModel, type LenzMode, type MagnetismId } from '../../lib/magnetismLab';
import type { BoardProps } from '../visual-boards/types';

import LenzScene from './LenzScene';

const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const accent = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };
function Label({ x, y, children }: { x: number; y: number; children: React.ReactNode }) { return <text x={x} y={y} textAnchor="middle" style={{ fontWeight: 800, fill: 'var(--vs-ink)' }}>{children}</text>; }
function Scene({ id, value }: { id: MagnetismId; value: number }) {
  if (id === 'fio-espira') return <><circle cx="160" cy="150" r="16" fill="var(--vs-burgundy)"/><path d="M160 72v156" {...accent}/>{[45, 78, 112].map((r) => <circle key={r} cx="160" cy="150" r={r} {...ink} opacity={Math.max(.25, value / 10)} />)}<Label x={160} y={278}>linhas circulares de B</Label></>;
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
  if (id === 'fios-paralelos') return <><path d="M105 45V235M215 45V235" {...ink}/><path d="M105 95V185M215 95V185" {...accent}/><path d="M125 145H195M195 145l-14-10m14 10-14 10" {...accent}/><Label x={105} y={72}>I ↑</Label><Label x={215} y={72}>I ↑</Label><Label x={160} y={278}>{value === 0 ? 'sem corrente, sem força' : 'mesmo sentido: atração'}</Label></>;

  const angle = value * 9; return <><rect x="54" y="52" width="58" height="194" rx="8" fill="var(--vs-burgundy)" opacity=".35"/><rect x="208" y="52" width="58" height="194" rx="8" fill="var(--vs-ink)" opacity=".22"/><Label x={83} y={78}>N</Label><Label x={237} y={78}>S</Label><g transform={`rotate(${angle} 160 150)`}><rect x="126" y="105" width="68" height="90" {...ink}/><path d="M160 105V195" {...accent}/></g><path d="M113 255a55 28 0 0 0 94 0" {...accent}/><Label x={160} y={282}>rotação → fluxo variável</Label></>;
}
function firstSentence(text?: string) { const sentence = text?.split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; }
export function magnetismInstrument(id: MagnetismId) { const config = MAGNETISM[id]; return function MagnetismBoard(props: BoardProps) { const [value, setValue] = useState(config.control.initial); const [lenzMode, setLenzMode] = useState<LenzMode>('retreat'); const readouts = id === 'lenz' ? lenzReadouts(lenzMode, value) : config.readouts(value); const pivot = readouts.find((item) => item.pivot) ?? readouts[0]; const pair = boardPair(props); const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1); return <BoardShell kicker="Laboratório de magnetismo" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de magnetismo: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}${id === 'lenz' ? `; ${lenzModel(lenzMode, value).current}, visto do ímã; B externo para a direita` : ''}`}>{id === 'lenz' ? <LenzScene mode={lenzMode} time={value} /> : <Scene id={id} value={value} />}</svg><div className="vs-plane-controls">{id === 'lenz' && <div className="vs-plane-control"><label htmlFor="lenz-motion">Movimento do ímã</label><select id="lenz-motion" value={lenzMode} onChange={(event) => setLenzMode(event.target.value as LenzMode)}><option value="approach">Aproximar</option><option value="retreat">Afastar</option><option value="stationary">Parado</option></select></div>}<div className="vs-plane-control"><label htmlFor={`magnetism-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`magnetism-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))} /></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: firstSentence(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: firstSentence(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação magnética', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight} />; }; }
