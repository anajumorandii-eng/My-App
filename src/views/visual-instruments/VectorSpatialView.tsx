import React, { useEffect, useId } from 'react';
import type { VectorId } from '../../lib/vectorsLab';
import { vectorSpatial } from '../../lib/vectorSpatial';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import { SpatialLabFrame } from './SpatialLabFrame';

export function VectorSpatialView({ id, value }: { id: VectorId; value: number }) {
  const uid=useId(),clock=useMechanismTime();
  useEffect(()=>{clock.seek(0);},[value]);
  const m=vectorSpatial(id,value,clock.time),title=id==='vetores'?'Componentes recompõem a diagonal':id==='velocidade'?'Rapidez é o módulo da velocidade':'Barco e rio somam velocidades';
  return <SpatialLabFrame title={title} reading={`Componentes (${m.resultant[0]}, ${m.resultant[1]}, 0); módulo ${m.magnitude.toLocaleString('pt-BR',{maximumFractionDigits:2})}${id==='vetores'?' u.a.':' m/s'}.${id!=='vetores'?` t = ${clock.time.toFixed(2)} s; deslocamento (${m.position[0].toFixed(2)}, ${m.position[1].toFixed(2)}, 0) m.`:''}`}
    note={`Exemplo contido no plano z = 0; inclinar a câmera não cria uma terceira componente. ${id==='composicao'?'Velocidade do barco relativa à água: 4 m/s para norte; correnteza para leste. A linha pontilhada é o percurso visto da margem.':id==='velocidade'?'Vx = 4 m/s; Vy é o controle principal. Movimento retilíneo com velocidade constante.':'Vx é o controle principal e Vy = 3. O caminho ponta-cauda é uma construção vetorial, não uma trajetória.'} ${id!=='vetores'?'Demonstração finita de 1 s, em escalas próprias para posição e velocidade.':'Setas em escala comum de componentes.'}`}
    controls={id!=='vetores'?<TimeControl clock={clock} label="Tempo do percurso (0 a 1 s)"/>:undefined}>
    {camera=>{
      const p=(point:SpatialPoint)=>{const[x,y]=rotateSpatialPoint(point,camera.yaw,camera.pitch);return[160+x,150-y];};
      const path=(points:SpatialPoint[])=>points.map((point,i)=>`${i?'L':'M'}${p(point)}`).join(' ');
      const scale=(point:SpatialPoint)=>point.map(v=>v*13) as SpatialPoint;
      const arrow=(a:SpatialPoint,b:SpatialPoint,name:string)=><path d={path([scale(a),scale(b)])} fill="none" stroke={name==='result'?'var(--vs-burgundy)':'var(--vs-blue)'} strokeWidth="3" markerEnd={`url(#${uid}-${name})`}/>;
      const [px,py]=p(scale(m.position));
      return <svg {...camera.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={camera.yaw} data-view-pitch={camera.pitch} aria-label={`${title}: resultante (${m.resultant.join(', ')}); módulo ${m.magnitude.toFixed(2)}; plano z igual a zero.`}>
        <defs>{['component','result'].map(name=><marker key={name} id={`${uid}-${name}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill={name==='result'?'var(--vs-burgundy)':'var(--vs-blue)'}/></marker>)}</defs>
        <path d={path([[-80,-75,0],[115,-75,0],[115,110,0],[-80,110,0],[-80,-75,0]])} fill="var(--vs-blue)" fillOpacity=".07" stroke="var(--vs-line)"/>
        <path d={path([[-75,0,0],[115,0,0]])+' '+path([[0,-75,0],[0,110,0]])} fill="none" stroke="var(--vs-dim)" strokeWidth="1"/>
        {Math.hypot(...m.a)>0&&arrow([0,0,0],m.a,'component')}{Math.hypot(...m.b)>0&&arrow(m.a,m.resultant,'component')}{arrow([0,0,0],m.resultant,'result')}
        {id!=='vetores'&&<><path d={path([[0,0,0],scale(m.resultant)])} fill="none" stroke="var(--vs-ink)" strokeDasharray="3 3"/><circle cx={px} cy={py} r="7" fill="var(--vs-ink)"/></>}
        <text x="160" y="278" textAnchor="middle" fill="var(--vs-ink)">azul: componentes · vinho: resultante</text>
      </svg>;
    }}
  </SpatialLabFrame>;
}
