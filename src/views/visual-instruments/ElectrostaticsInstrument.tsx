import React, { useState } from 'react';
import BoardShell from '../visual-boards/BoardShell';
import { boardPair } from '../visual-boards/pair';
import { STAGE_LABEL } from '../../lib/visualStudy';
import { ELECTRO, type ElectrostaticsId } from '../../lib/electrostaticsLab';
import type { BoardProps } from '../visual-boards/types';
const ink = { stroke: 'var(--vs-ink)', strokeWidth: 3, fill: 'none' };
const red = { stroke: 'var(--vs-burgundy)', strokeWidth: 4, fill: 'none' };
function Vector({ x1, y1, x2, y2, kind, label }: { x1: number; y1: number; x2: number; y2: number; kind: string; label?: string }) {
  const angle = Math.atan2(y2-y1, x2-x1);
  const size = Math.min(7, Math.hypot(x2-x1, y2-y1)*.4);
  const head = [1,-1].map(sign => `${x2-size*Math.cos(angle)+sign*size*.55*Math.sin(angle)} ${y2-size*Math.sin(angle)-sign*size*.55*Math.cos(angle)}`);
  return <g data-vector={kind}><path d={`M${x1} ${y1}L${x2} ${y2}M${head[0]}L${x2} ${y2}L${head[1]}`} {...red}/>{label && <text x={(x1+x2)/2} y={y1-10} textAnchor="middle">{label}</text>}</g>;
}
function Charge({x, y=145, sign='+', radius=17}: {x:number; y?:number; sign?:string; radius?:number}) {
  return <g><circle data-charge={sign} cx={x} cy={y} r={radius} fill="var(--vs-paper)" stroke="var(--vs-burgundy)" strokeWidth="3"/><text x={x} y={y+6} textAnchor="middle">{sign}</text></g>;
}
function Scene({ id, value }: { id: ElectrostaticsId; value: number }) {
  const note = (text: string, y=280) => <text x="160" y={y} textAnchor="middle" fontSize="11">{text}</text>;
  if (id === 'coulomb') {
    // Center distance is 28r px; charge glyphs are schematic, not to scale.
    const left=45, right=left+28*value, length=42/(value*value);
    return <g fill="var(--vs-ink)"><Charge x={left} radius={10}/><Charge x={right} sign="−" radius={10}/>
      <Vector x1={left} y1={85} x2={left+length} y2={85} kind="force" label="F₁"/>
      <Vector x1={right} y1={105} x2={right-length} y2={105} kind="force" label="F₂"/>
      <path d={`M${left} 177V197M${left} 190H${right}M${right} 177V197`} {...ink}/>
      <text x={(left+right)/2} y="214" textAnchor="middle">r = {value}</text>
      {note('F₁ e F₂: iguais e opostas · atração',245)}{note('Posição e vetores usam escalas distintas.')}</g>;
  }
  if (id === 'field') {
    const center=90, probe=center+value*24;
    return <g fill="var(--vs-ink)"><Charge x={center}/>
      {[0,60,120,180,240,300].map(angle=> {const rad=angle*Math.PI/180; return <Vector key={angle} x1={center+25*Math.cos(rad)} y1={145+25*Math.sin(rad)} x2={center+87*Math.cos(rad)} y2={145+87*Math.sin(rad)} kind="field"/>;})}
      <circle data-probe cx={probe} cy="145" r="5" fill="var(--vs-ink)"/>
      <Vector x1={probe} y1={240} x2={probe+30/(value*value)} y2={240} kind="measurement" label="E"/>
      <text x={probe} y="175" textAnchor="middle">r = {value}</text>
      {note('Ponto P · E = kQ/r² · Q positiva',200)}{note('Linhas indicam sentido; E em escala própria.')}</g>;
  }
  if (id === 'potential') {
    const center=150, probe=center+value*11;
    return <g fill="var(--vs-ink)">{[44,88,110].map(radius=><g key={radius}><circle data-equipotential cx={center} cy="135" r={radius} {...ink} opacity=".35"/><text x={center} y={135-radius+14} textAnchor="middle" fontSize="11">V = {Math.round(264/radius*10)/10} V₀</text></g>)}
      <Charge x={center} y={135}/><circle data-probe cx={probe} cy="135" r="5" fill="var(--vs-ink)"/>
      <text x={probe} y="158" textAnchor="middle" fontSize="12">r = {value}</text>
      {note('q = +2 q₀ · U = qV · U₀ = q₀V₀',260)}{note('W (4 → r) = U(4) − U(r)')}</g>;
  }
  if (id === 'uniform-field') {
    const x=85+value*16;
    return <g fill="var(--vs-ink)"><path d="M55 55V235M265 55V235" {...ink} strokeWidth="6"/><text x="55" y="40">+</text><text x="260" y="40">−</text>
      {[75,110,180,215].map(y=><Vector key={y} x1={70} y1={y} x2={250} y2={y} kind="field"/>)}
      <Charge x={x}/><Vector x1={x} y1={155} x2={x+30} y2={155} kind="force"/>
      {note(`E → = 4 V/m · q = +2 C · F → = 8 N`,255)}
      {note(`d = ${value} m → · ΔV = ${value===0?'0':`−${4*value}`} V`)}</g>;
  }
  return <g fill="var(--vs-ink)"><Charge x={65}/><text x="105" y="145">q = +2 C · m = 2 kg</text>
    {value>0 && <><Vector x1={65} y1={65} x2={65+value*17} y2={65} kind="field" label="E"/>
      <Vector x1={65} y1={205} x2={65+value*17} y2={205} kind="force" label="F"/>
      <Vector x1={65} y1={250} x2={65+value*17} y2={250} kind="acceleration" label="a"/></>}
    {value===0 && note('E = 0 · F = 0 N · a = 0 m/s²',205)}
    {note(`a = ${value} m/s² · F = ${2*value} N`,285)}
    <text x="160" y="20" textAnchor="middle" fontSize="11">Instantâneo · vetores em escalas próprias</text>
  </g>;
}
function short(text?: string) { const sentence = text?.split(/(?<=[.!?])\s/)[0] ?? ''; return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence; }
export function electrostaticsInstrument(id: ElectrostaticsId) { const config = ELECTRO[id]; return function ElectrostaticsBoard(props: BoardProps) { const [value, setValue] = useState(config.control.initial); const readouts = config.readouts(value); const pivot = readouts.find((item) => item.pivot) ?? readouts[0]; const pair = boardPair(props); const first = props.map.nodes[1] ?? props.map.nodes[0]; const second = props.map.nodes[2] ?? props.map.nodes.at(-1); return <BoardShell kicker="Laboratório de eletrostática" title={config.name} subtitle={config.question} condition={{ label: 'Leitura', value: pivot.value }} ariaLabel={`Instrumento de eletrostática: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox="0 0 320 300" role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} value={value}/></svg><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`electro-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{value}</b></label><input id={`electro-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={value} onChange={(event) => setValue(Number(event.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map((item) => <div key={item.label} data-pivot={item.pivot ? 'true' : undefined}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl></div>} left={{ label: STAGE_LABEL[first?.stage ?? 'conceito'], headline: first?.label ?? props.map.title, detail: short(first?.excerpt), formula: config.formula }} right={{ label: STAGE_LABEL[second?.stage ?? 'aplicacao'], headline: second?.label ?? props.map.title, detail: short(second?.excerpt), formula: pivot.value }} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{ label: 'Relação eletrostática', general: config.formula, condition: 'mostra', reduced: pivot.value }} closing={config.insight}/>; }; }
