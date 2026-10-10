import React, { useEffect, useId } from 'react';
import { ELECTRO, type ElectrostaticsId } from '../../lib/electrostaticsLab';
import { electrostaticSpatial, radialDirections } from '../../lib/electrostaticSpatial';
import { rotateSpatialPoint, type SpatialPoint } from '../../lib/spatialSolid';
import { TimeControl, useMechanismTime } from '../visual-boards/MechanismFrame';
import { SpatialLabFrame } from './SpatialLabFrame';

export function ElectrostaticSpatialView({ id, value }: { id: ElectrostaticsId; value: number }) {
  const uid = useId(), clock = useMechanismTime();
  useEffect(() => { clock.seek(0); }, [value]); // Um novo campo reinicia o lançamento, sem alterar a câmera.
  const m = electrostaticSpatial(id, value, clock.time);
  const readings = ELECTRO[id].readouts(value).map(r => `${r.label}: ${r.value}`).join('; ');
  const title = { coulomb: 'Duas cargas: força ao longo da separação', field: 'O campo de +Q ocupa o espaço', potential: 'Equipotenciais esféricas em torno de +Q', 'uniform-field': 'Equipotenciais planas entre placas', 'charge-dynamics': 'Uma carga acelera no campo uniforme' }[id];
  return <SpatialLabFrame title={title} reading={readings + (id === 'charge-dynamics' ? `; t = ${clock.time.toFixed(2)} s; x − x₀ = ${m.distance.toFixed(2)} m; v = ${(value * clock.time).toFixed(2)} m/s.` : '')}
    note={`Mude o parâmetro no instrumento principal. ${m.radial ? 'Carga fonte pontual; glifos não indicam seu tamanho físico.' : 'Campo ideal uniforme; efeitos de borda omitidos.'} ${id === 'potential' ? 'Círculos cruzados são seções das superfícies esféricas, não órbitas. Potencial é escalar; a câmera não altera V.' : 'Setas de campo indicam direção e sentido, sem escala de intensidade; consulte a leitura numérica.'} ${id === 'charge-dynamics' ? 'Carga +2 C, massa 2 kg, repouso inicial; reprodução finita de 1 s. x = x₀ + at²/2.' : 'Distâncias em escala própria; cores identificam cargas ou superfícies, não temperatura.'}`}
    controls={id === 'charge-dynamics' ? <TimeControl clock={clock} label="Tempo de aceleração (0 a 1 s)" /> : undefined}>
    {camera => {
      const project = (p: SpatialPoint) => { const [x,y,z] = rotateSpatialPoint(p,camera.yaw,camera.pitch); return { x:160+x,y:150-y,z }; };
      const path = (points: SpatialPoint[]) => points.map((p,i) => { const q=project(p);return `${i?'L':'M'}${q.x},${q.y}`; }).join(' ');
      const arrow = (a: SpatialPoint,b: SpatialPoint) => <path d={path([a,b])} fill="none" stroke="var(--vs-blue)" strokeWidth="2" markerEnd={`url(#${uid}-arrow)`} />;
      const shell = (r: number,axis: number) => Array.from({length:73},(_,i):SpatialPoint=>{const a=i*Math.PI/36;return axis===0?[0,r*Math.cos(a),r*Math.sin(a)]:axis===1?[r*Math.cos(a),0,r*Math.sin(a)]:[r*Math.cos(a),r*Math.sin(a),0];});
      const probe=project(m.probe),origin=project([0,0,0]);
      return <svg {...camera.interaction} className="vs-plane vs-science-object" viewBox="0 0 320 300" role="img" data-view-yaw={camera.yaw} data-view-pitch={camera.pitch} aria-label={`${title}. ${readings}${id==='charge-dynamics'?`; tempo ${clock.time.toFixed(2)} s; deslocamento ${m.distance.toFixed(2)} m`:''}`}>
        <defs><marker id={uid+'-arrow'} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--vs-blue)" /></marker><radialGradient id={uid+'-charge'} cx="30%" cy="25%"><stop stopColor="#efc2b4"/><stop offset="1" stopColor="var(--vs-burgundy)"/></radialGradient></defs>
        {id==='potential' ? [32,64,96].flatMap(r=>[0,1,2].map(axis=><path key={`${r}-${axis}`} d={path(shell(r,axis))} fill="none" stroke="var(--vs-blue)" opacity=".65" />)) : id==='field' ? radialDirections().map((d,i)=><g key={i}>{arrow(d.map(v=>v*18) as SpatialPoint,d.map(v=>v*95) as SpatialPoint)}</g>) : null}
        {m.radial ? <circle cx={origin.x} cy={origin.y} r="7" fill={`url(#${uid}-charge)`}/> : <>
          {[-90,90].map((x,i)=><path key={x} d={path([[x,-85,-65],[x,85,-65],[x,85,65],[x,-85,65],[x,-85,-65]])} fill="var(--vs-blue)" fillOpacity=".12" stroke="var(--vs-ink)" strokeWidth="2" data-plate={i===0?'positive':'negative'} />)}
          {[-45,0,45].flatMap(y=>[-40,40].map(z=><g key={`${y}-${z}`}>{value>0 || id==='uniform-field' ? arrow([-80,y,z],[80,y,z]) : null}</g>))}
          {id==='uniform-field' && <path d={path([[m.probe[0],-75,-60],[m.probe[0],75,-60],[m.probe[0],75,60],[m.probe[0],-75,60],[m.probe[0],-75,-60]])} fill="var(--vs-burgundy)" fillOpacity=".15" stroke="var(--vs-burgundy)" />}
        </>}
        {id==='coulomb' && <>{arrow([0,25,0],[20,25,0])}{arrow([m.probe[0],-25,0],[m.probe[0]-20,-25,0])}<path d={path([[0,0,0],m.probe])} stroke="var(--vs-dim)" strokeDasharray="3 3"/></>}
        <circle cx={probe.x} cy={probe.y} r={id==='coulomb'?5:4} fill="var(--vs-ink)"/><text x={probe.x} y={probe.y+20} fill="var(--vs-ink)" textAnchor="middle">{id==='coulomb'?'−Q':'P'}</text>
        {m.radial && <text x={origin.x} y={origin.y-15} fill="var(--vs-ink)" textAnchor="middle">+Q</text>}
        <text x="160" y="280" fill="var(--vs-ink)" textAnchor="middle">{id==='potential'?'V constante em cada esfera':id==='coulomb'?'atração: forças iguais e opostas':m.radial?'campo radial para fora':'E em +x · normal às placas'}</text>
      </svg>;
    }}
  </SpatialLabFrame>;
}
