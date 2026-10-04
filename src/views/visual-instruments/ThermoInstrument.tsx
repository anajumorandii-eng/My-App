import React,{useState}from'react';
import { FirstLawMechanism, CarnotMechanism } from './ThermalMechanisms';
import BoardShell from '../visual-boards/BoardShell';
import {boardPair} from '../visual-boards/pair';
import {STAGE_LABEL} from '../../lib/visualStudy';
import {THERMO,type ThermoId} from '../../lib/thermoLab';
import type {BoardProps} from '../visual-boards/types';
function short(text?:string){const s=text?.trim().split(/(?<=[.!?])\s/)[0]??'';return s.length>180?`${s.slice(0,176)}…`:s}
function Scene({id,v}:{id:ThermoId;v:number}){
if(id==='gas-work') {
  const initialVolume = 5;
  const finalVolume = initialVolume + v;
  const startX = 45 + 16 * initialVolume;
  const endX = 45 + 16 * finalVolume;
  const sign = v === 0 ? 'zero' : v > 0 ? 'positive' : 'negative';
  return <g data-gas-work="isobaric" data-initial-volume={initialVolume} data-final-volume={finalVolume} data-work-sign={sign} style={{fontSize:14,fill:'var(--vs-ink)'}}>
    <text x="160" y="20" textAnchor="middle" fontWeight="800">{v === 0 ? 'volume constante · W = 0' : v > 0 ? 'expansão · W > 0' : 'compressão · W < 0'}</text>
    <text x="16" y="45">P (kPa)</text>
    <path d="M45 50V230H291" stroke="var(--vs-ink)" strokeWidth="2" fill="none"/>
    {[0,1,2,3,4].map(p=><g key={p}><path d={`M40 ${230-40*p}H45`} stroke="var(--vs-ink)"/><text x="32" y={235-40*p} textAnchor="end">{p}</text></g>)}
    {[0,5,10,15].map(volume=><g key={volume}><path d={`M${45+16*volume} 230v5`} stroke="var(--vs-ink)"/><text x={45+16*volume} y="252" textAnchor="middle">{volume}</text></g>)}
    <rect data-work-area="true" x={Math.min(startX,endX)} y="110" width={16*Math.abs(v)} height="120" fill="var(--vs-burgundy)" opacity=".22"/>
    <line data-isobar="true" x1="45" y1="110" x2="285" y2="110" stroke="var(--vs-burgundy)" strokeWidth="3"/>
    <path d={`M${startX} 110V230M${endX} 110V230`} stroke="var(--vs-ink)" strokeDasharray="4 4" fill="none"/>
    {v !== 0 && <>
      <line data-volume-direction="true" x1={startX} y1="92" x2={endX} y2="92" stroke="var(--vs-ink)" strokeWidth="2"/>
      <path d={`M${endX + (v > 0 ? -7 : 7)} 87L${endX} 92l${v > 0 ? -7 : 7} 5`} stroke="var(--vs-ink)" strokeWidth="2" fill="none"/>
    </>}
    <circle cx={startX} cy="110" r="4" fill="var(--vs-ink)"/><circle cx={endX} cy="110" r="4" fill="var(--vs-burgundy)"/>
    <text x="160" y="68" textAnchor="middle">Vi = 5 L · Vf = {finalVolume} L</text>
    <text x="266" y="274" textAnchor="middle">V (L)</text>
    <text x="16" y="291">área sob p(V): |W| = 3 × |ΔV| J</text>
  </g>;
}
if(id==='first-law') return <FirstLawMechanism work={v}/>;
return <CarnotMechanism rejected={v}/>; }
export function thermoInstrument(id:ThermoId){const config=THERMO[id];return function ThermoBoard(props:BoardProps){const pair=boardPair(props);const [v,setV]=useState(config.control.initial),readouts=config.readouts(v),pivot=readouts.find(x=>x.pivot)??readouts[0],first=props.map.nodes[1] ?? props.map.nodes[0],second=props.map.nodes[2]??props.map.nodes.at(-1);return <BoardShell kicker="Laboratório de termodinâmica" title={config.name} subtitle={config.question} condition={{label:'Δ',value:pivot.value}} ariaLabel={`Instrumento de termodinâmica: ${props.map.title}`} emphasis={pair.emphasis} scene={<div className="vs-instrument"><svg className="vs-plane" viewBox={id==='carnot' ? '0 0 320 680' : '0 0 320 300'} role="img" aria-label={`${config.name}; ${pivot.label}: ${pivot.value}`}><Scene id={id} v={v}/></svg><p className="vs-instrument-dica">mexa na variável e acompanhe o balanço de energia</p><div className="vs-plane-controls"><div className="vs-plane-control"><label htmlFor={`thermo-${id}`}><strong>{config.control.label}</strong><span>{config.control.description}</span><b>{v}</b></label><input id={`thermo-${id}`} type="range" min={config.control.min} max={config.control.max} step={config.control.step} value={v} onChange={e=>setV(Number(e.target.value))}/></div></div><dl className="vs-plane-readouts">{readouts.map(x=><div key={x.label} data-pivot={x.pivot?'true':undefined}><dt>{x.label}</dt><dd>{x.value}</dd></div>)}</dl></div>} left={{label:STAGE_LABEL[first?.stage??'conceito'],headline:first?.label??props.map.title,detail:short(first?.excerpt),formula:config.formula}} right={{label:STAGE_LABEL[second?.stage??'aplicacao'],headline:second?.label??props.map.title,detail:short(second?.excerpt),formula:pivot.value}} leftState={pair.leftState} rightState={pair.rightState} leftSelected={pair.leftSelected} rightSelected={pair.rightSelected} onSelectLeft={pair.selectLeft} onSelectRight={pair.selectRight} equation={{label:'Balanço térmico',general:config.formula,condition:'mostra',reduced:pivot.value}} closing={config.insight}/>}}
