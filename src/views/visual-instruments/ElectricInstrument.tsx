import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { ELECTRIC, type ElectricId } from '../../lib/electricLab';
import type { BoardProps } from '../visual-boards/types';

const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const red = { stroke: 'var(--vs-burgundy)', strokeWidth: 5, fill: 'none' };
function Label({ x = 160, y, children }: { x?: number; y: number; children: React.ReactNode }) {
  return <text x={x} y={y} textAnchor="middle" fill="var(--vs-ink)" fontSize="13" fontWeight="700">{children}</text>;
}
function Arrow({ x1, y1, x2, y2, flow, width = 3 }: { x1: number; y1: number; x2: number; y2: number; flow: string; width?: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = [angle + .5, angle - .5].map(a => `${x2 - 9 * Math.cos(a)},${y2 - 9 * Math.sin(a)}`);
  return <g data-flow={flow} stroke="var(--vs-burgundy)" strokeWidth={width} fill="none"><path d={`M${x1} ${y1}L${x2} ${y2}`}/><path d={`M${head[0]}L${x2} ${y2}L${head[1]}`}/></g>;
}
function Scene({ id, value }: { id: ElectricId; value: number }) {
  const reduced = useReducedMotion();
  if (id === 'current') return <>
    <Label y={25}>Condutor metálico · Δt = 2 s</Label>
    <rect x="30" y="115" width="260" height="60" rx="20" {...ink}/>
    <path d="M160 98V193" stroke="var(--vs-burgundy)" strokeWidth="3" strokeDasharray="5 4"/>
    <Label y={211}>Seção S</Label><Label y={232}>Deslocamento esquemático</Label>
    {[60, 105, 168, 250].map(x => <motion.g key={x} animate={{ x: value ? -Math.min(value, 16) : 0 }} transition={{ duration: reduced ? 0 : .4 }}>
      <circle cx={x} cy="145" r="9" fill="var(--vs-paper)" stroke="var(--vs-ink)"/><Label x={x} y={149}>−</Label>
    </motion.g>)}
    {value > 0 && <><Arrow x1={90} y1={60} x2={230} y2={60} flow="conventional"/><Arrow x1={230} y1={250} x2={90} y2={250} flow="electrons"/></>}
    <Label y={85}>{value ? 'i convencional →' : 'i = 0 · sem fluxo líquido'}</Label>
    <Label y={280}>{value ? 'elétrons ←' : 'elétrons sem deriva'} · |ΔQ| = {value} C</Label>
  </>;
  if (id === 'power') return <>
    <Label y={25}>Fonte: 12 V · i = {value} A</Label>
    <path d="M40 135V65H100M220 65H280V215H40V155" {...ink}/>
    <path d="M25 135H55M31 155H49" {...ink}/><Label x={40} y={119}>+</Label><Label x={40} y={180}>−</Label>
    <rect x="100" y="40" width="120" height="50" rx="8" fill="var(--vs-paper)" stroke="var(--vs-ink)" strokeWidth="3"/>
    <Label y={60}>Aquecedor ideal</Label><Label y={81}>{12 * value} W</Label>
    {value > 0 && <><Arrow x1={210} y1={215} x2={110} y2={215} flow="current"/><Arrow x1={160} y1={105} x2={160} y2={175} flow="heat" width={2 + value / 2}/></>}
    <Label y={262}>energia térmica</Label><Label y={285}>Em 1 s: {12 * value} J convertidos</Label>
  </>;
  if (id === 'resistor') return <>
    <Label y={25}>Fonte ideal: 12 V</Label>
    <path d="M40 108V65H100M190 65H280V195H40V132M25 108H55M31 132H49" {...ink}/>
    <Label x={40} y={94}>+</Label><Label x={40} y={159}>−</Label>
    <path d="M100 65l10-15 16 30 16-30 16 30 16-30 16 15" {...red}/>
    <Label y={108}>R = {value} Ω · i = {Math.round(120 / value) / 10} A</Label>
    <Arrow x1={210} y1={195} x2={110} y2={195} flow="current"/>
    <Label y={224}>Corrente i · escala de 0 a 12 A</Label>
    <path d="M40 247H280" {...ink}/>
    <motion.path data-current-bar="true" d={`M40 247H${40 + 240 / value}`} {...red} animate={{ d: `M40 247H${40 + 240 / value}` }} transition={{ duration: reduced ? 0 : .3 }}/>
    <Label x={40} y={277}>0</Label><Label x={160} y={277}>6</Label><Label x={280} y={277}>12 A</Label>
  </>;
  if (id === 'kirchhoff') return <>
    <Label y={22}>Lei dos nós · sem acúmulo de carga</Label>
    <path d="M25 85H140L285 48M140 85L285 125" {...ink}/><circle cx="140" cy="85" r="6" fill="var(--vs-ink)"/>
    <Arrow x1={40} y1={85} x2={110} y2={85} flow="input"/>
    <Arrow x1={177} y1={75} x2={245} y2={58} flow="branch-a"/>
    {value > 2 && <Arrow x1={177} y1={95} x2={245} y2={114} flow="branch-b"/>}
    <Label x={65} y={63}>{value} A entra</Label><Label x={240} y={39}>2 A sai</Label><Label x={235} y={147}>{value - 2} A sai</Label>
    <Label y={176}>Lei das malhas · exemplo independente</Label>
    <path d="M40 223V199H280V261H40V243M27 223H53M32 243H48" {...ink}/>
    <rect x="113" y="190" width="36" height="18" fill="var(--vs-paper)" stroke="var(--vs-ink)"/>
    <rect x="207" y="190" width="36" height="18" fill="var(--vs-paper)" stroke="var(--vs-ink)"/>
    <Label x={75} y={238}>+12 V</Label><Label x={131} y={232}>−4 V</Label><Label x={225} y={232}>−8 V</Label>
    <Arrow x1={180} y1={261} x2={110} y2={261} flow="loop-traversal"/>
    <Label y={289}>Malha: +12 − 4 − 8 = 0 V</Label>
  </>;
  return <>
    <Label y={25}>C = 2 μF · U = {value} V</Label>
    <rect x="126" y="70" width="68" height="136" fill="var(--vs-ink)" opacity=".06"/>
    <path d="M30 138H116M204 138H290" {...ink}/><path d="M116 62V214M204 62V214" {...red}/>
    {[90, 138, 186].map(y => <React.Fragment key={y}><Label x={101} y={y}>{value ? '+' : '0'}</Label><Label x={219} y={y}>{value ? '−' : '0'}</Label>{value > 0 && <Arrow x1={131} y1={y - 4} x2={189} y2={y - 4} flow="field" width={1 + value / 6}/>}</React.Fragment>)}
    <Label y={239}>dielétrico isolante · placas ideais</Label>
    <Label y={263}>{value ? 'Campo: + → −' : 'Campo nulo'}</Label>
    <Label y={285}>{value ? `+${2 * value} μC / −${2 * value} μC` : 'Q = 0 · campo nulo'} · E = {value * value} μJ</Label>
  </>;
}
function firstSentence(text?: string) { const sentence = text?.split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; }
export function electricInstrument(id: ElectricId) { const config = ELECTRIC[id]; return function ElectricBoard(props: BoardProps) { const [value, setValue] = useState(config.control.initial); const readouts = config.readouts(value); const pivot = readouts.find((item) => item.pivot) ?? readouts[0]; const pair = boardPair(props); const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1); return <BoardShell kicker="Laboratório de eletrodinâmica" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento elétrico: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`electric-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`electric-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: firstSentence(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: firstSentence(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação elétrica', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>; }; }
