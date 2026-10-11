import React, { useId, useState } from 'react';
import { EARTH_SPATIAL_LESSONS } from '../../lib/earthSpatialBatch';
import { earthSpatialDrawing, EARTH_MOVING_KINDS } from '../../lib/earthSpatialDrawing';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import { SpatialLabFrame } from './SpatialLabFrame';

const colors={body:'var(--vs-ink)',signal:'var(--vs-burgundy)',reference:'var(--vs-dim)',sum:'var(--vs-blue)'};
export default function ChapterEarthSpatialLab({chapterId}:{chapterId:string}) {
  const config=EARTH_SPATIAL_LESSONS[chapterId],uid=useId();
  const [value,setValue]=useState(config.initial),[choice,setChoice]=useState(config.choices?.[0][0]||'');
  const clock=useMechanismTime(),model=earthSpatialDrawing(config.kind,value,clock.time,choice);
  const moving=EARTH_MOVING_KINDS.includes(config.kind) && !(config.kind==='inorganic' && choice==='oxide');
  const parameterLabel=config.kind==='wetlands'&&choice==='pampa'?'Altura visual da vegetação':config.label;
  return <SpatialLabFrame title={config.title} reading={model.reading} note={config.note} controls={<>
    <p className="vs-science-caption">{model.legend}</p>
    {!!config.choices?.length&&<div className="vs-science-choices" role="group" aria-label="Condições do modelo">{config.choices.map(([id,label])=><button key={id} type="button" aria-pressed={choice===id} onClick={()=>{clock.seek(0);setChoice(id);}}>{label}</button>)}</div>}
    <label className="vs-spatial-parameter" htmlFor={uid+'-parameter'}>{parameterLabel} <output>{value.toLocaleString('pt-BR')}</output></label>
    <input id={uid+'-parameter'} type="range" min={config.min} max={config.max} step={config.step} value={value} onChange={event=>{clock.seek(0);setValue(Number(event.target.value));}}/>
    {moving&&<TimeControl clock={clock} label="Percurso finito do modelo"/>}
  </>}>
    {camera=>{
      const projected=(p:SpatialPoint)=>rotateSpatialPoint(p,camera.yaw,camera.pitch);
      const project=(p:SpatialPoint)=>{const[x,y]=projected(p);return [160+x,145-y];};
      const path=(points:SpatialPoint[])=>points.map((point,i)=>`${i?'L':'M'}${project(point).join(',')}`).join(' ');
      return <svg {...camera.interaction} className="vs-plane vs-science-object" style={{userSelect:'none',WebkitUserSelect:'none'}} viewBox="0 0 320 300" role="img" aria-label={`${config.title}. ${model.reading}`} data-earth-spatial={config.kind} data-view-yaw={camera.yaw} data-view-pitch={camera.pitch}>
        <defs>{Object.entries(colors).map(([role,color])=><React.Fragment key={role}><marker id={uid+'-'+role} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={color}/></marker><radialGradient id={uid+'-sphere-'+role} cx="32%" cy="28%"><stop offset="0" stopColor="var(--vs-paper-strong)"/><stop offset=".35" stopColor={color}/><stop offset="1" stopColor={color} stopOpacity=".85"/></radialGradient></React.Fragment>)}</defs>
        {model.traces.map((trace,i)=><path key={i} data-spatial-role={trace.role} d={path(trace.points)+(trace.closed?' Z':'')} fill={trace.closed?colors[trace.role]:'none'} fillOpacity={trace.closed ? .08 : 1} stroke={colors[trace.role]} strokeWidth={trace.role==='reference'?1.5:2.6} strokeDasharray={trace.dashed?'4 4':undefined} strokeLinejoin="round" markerEnd={trace.arrow?`url(#${uid}-${trace.role})`:undefined}/>)}
        {[...model.dots].sort((a,b)=>projected(a.point)[2]-projected(b.point)[2]).map((dot,i)=>{const[x,y]=project(dot.point);return <circle key={i} cx={x} cy={y} r={dot.radius} fill={`url(#${uid}-sphere-${dot.role})`} stroke={colors[dot.role]} strokeWidth=".7"/>;})}
        {model.labels.map((label,i)=>{const[x,y]=project(label.point);return <text key={i} x={x} y={y+4} textAnchor="middle" fill="var(--vs-ink)" stroke="var(--vs-paper-strong)" strokeWidth="3" paintOrder="stroke">{label.text}</text>;})}
        <text x="160" y="282" textAnchor="middle" fill="var(--vs-ink)">Esquema espacial · valores na leitura abaixo</text>
      </svg>;
    }}
  </SpatialLabFrame>;
}
