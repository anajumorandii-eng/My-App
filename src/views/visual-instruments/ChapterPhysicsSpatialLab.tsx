import React, { useId, useState } from 'react';
import { PHYSICS_SPATIAL_LESSONS } from '../../lib/physicsSpatialBatch';
import { physicsSpatialDrawing } from '../../lib/physicsSpatialDrawing';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import { SpatialLabFrame } from './SpatialLabFrame';

const colors={body:'var(--vs-ink)',signal:'var(--vs-burgundy)',reference:'var(--vs-dim)',sum:'var(--vs-blue)'};
export default function ChapterPhysicsSpatialLab({chapterId}:{chapterId:string}) {
  const config=PHYSICS_SPATIAL_LESSONS[chapterId],uid=useId();
  const [value,setValue]=useState(config.initial),[choice,setChoice]=useState(config.kind==='gas'?'isotherm':config.kind==='tube'?'open':'fixed');
  const clock=useMechanismTime();
  const model=physicsSpatialDrawing(config.kind,value,clock.time,choice);
  const moving=!['weight','resultant','hydro','snell','lens','maker','wire'].includes(config.kind);
  const choices=config.kind==='gas'?[['isotherm','Isotérmica'],['isobar','Isobárica'],['isochor','Isocórica'],['adiabat','Adiabática']]:config.kind==='tube'?[['open','Aberto'],['closed','Fechado à esquerda']]:config.kind==='reflection'?[['fixed','Extremidade fixa'],['free','Extremidade livre']]:[];
  return <SpatialLabFrame title={config.title} reading={model.reading} note={config.note} controls={<>
    <p className="vs-science-caption">{model.legend}</p>
    {choices.length>0&&<div className="vs-science-choices" role="group" aria-label="Condições do modelo">{choices.map(([id,label])=><button key={id} type="button" aria-pressed={choice===id} onClick={()=>{clock.seek(0);setChoice(id);}}>{label}</button>)}</div>}
    <label className="vs-spatial-parameter" htmlFor={uid+'-parameter'}>{config.label} <output>{value.toLocaleString('pt-BR')}</output></label>
    <input id={uid+'-parameter'} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={event=>{clock.seek(0);setValue(Number(event.target.value));}}/>
    {moving&&<TimeControl clock={clock} label="Percurso finito do modelo"/>}
  </>}>
    {camera=>{
      const project=(point:SpatialPoint)=>{const[x,y]=rotateSpatialPoint(point,camera.yaw,camera.pitch);return [160+x,145-y];};
      const path=(points:SpatialPoint[])=>points.map((point,i)=>`${i?'L':'M'}${project(point).join(',')}`).join(' ');
      return <svg {...camera.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" aria-label={`${config.title}. ${model.reading}`} data-physics-spatial={config.kind} data-view-yaw={camera.yaw} data-view-pitch={camera.pitch}>
        <defs>{Object.entries(colors).map(([role,color])=><marker id={uid+'-'+role} key={role} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={color}/></marker>)}</defs>
        {model.traces.map((trace,i)=><path key={i} data-spatial-role={trace.role} d={path(trace.points)+(trace.closed?' Z':'')} fill={trace.closed?colors[trace.role]:'none'} fillOpacity={trace.closed ? .08 : 1} stroke={colors[trace.role]} strokeWidth={trace.role==='reference'?1.5:2.6} strokeDasharray={trace.dashed?'4 4':undefined} strokeLinejoin="round" strokeLinecap="round" markerEnd={trace.arrow?`url(#${uid}-${trace.role})`:undefined}/>)}
        {model.dots.map((point,i)=>{const[x,y]=project(point.point);return <circle key={i} cx={x} cy={y} r={point.radius} fill={colors[point.role]}/>;})}
        {model.labels.map((label,i)=>{const[x,y]=project(label.point);return <text key={i} x={x} y={y+4} textAnchor="middle" fill="var(--vs-ink)" stroke="var(--vs-paper-strong)" strokeWidth="3" paintOrder="stroke">{label.text}</text>;})}
        <text x="160" y="282" textAnchor="middle" fill="var(--vs-ink)">Modelo espacial · medidas na leitura abaixo</text>
      </svg>;
    }}
  </SpatialLabFrame>;
}
