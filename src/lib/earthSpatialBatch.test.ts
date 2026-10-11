import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { EARTH_SPATIAL_LESSONS, inducedFieldSign, projectionY, theoreticalUtc } from './earthSpatialBatch';
import { earthSpatialDrawing } from './earthSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';

test('fusos teóricos distinguem leste, oeste e dois lados da linha de data',()=>{
  assert.equal(theoreticalUtc(-45),-3);assert.equal(theoreticalUtc(90),6);
  assert.equal(theoreticalUtc(-180),-12);assert.equal(theoreticalUtc(180),12);
});
test('Mercator expande paralelos; Lambert cilíndrica equivalente usa seno da latitude',()=>{
  assert.ok(Math.abs(projectionY(0,false))<1e-12);assert.equal(projectionY(0,true),0);
  assert.ok(projectionY(60,false)>projectionY(30,false)*2);
  assert.ok(Math.abs(projectionY(30,true)-.5)<1e-12);
  assert.ok(Math.abs(projectionY(-60,false)+projectionY(60,false))<1e-12);
});
test('Lenz opõe-se à variação, não necessariamente ao próprio campo externo',()=>{
  assert.equal(inducedFieldSign(true),-1);assert.equal(inducedFieldSign(false),1);
  assert.match(earthSpatialDrawing('lenz',2,1,'increase').reading,/−z, corrente horária/);
  assert.match(earthSpatialDrawing('lenz',2,1,'decrease').reading,/\+z, corrente anti-horária/);
});
test('potencial de carga pontual em um metro conserva módulo e inverte sinal',()=>{
  assert.match(earthSpatialDrawing('electric',4,0,'positive').reading,/36 V/);
  assert.match(earthSpatialDrawing('electric',4,0,'negative').reading,/-36 V/);
});
test('circulação fica acima da superfície e distingue subida tropical da célula indireta',()=>{
  const cells=earthSpatialDrawing('circulation',30,0,'').traces.filter(t=>t.role==='sum');
  assert.equal(cells.length,6);
  for(const cell of cells)for(const point of cell.points)assert.ok(Math.hypot(...point)>=67.99);
  const northHadley=cells[3].points,northFerrel=cells[4].points;
  assert.ok(Math.hypot(...northHadley[1])>Math.hypot(...northHadley[0]));
  assert.ok(Math.hypot(...northFerrel[1])<Math.hypot(...northFerrel[0]));
});
test('capítulos I e II distinguem suas fisionomias e formações',()=>{
  const first=EARTH_SPATIAL_LESSONS['summary-geografia-biogeografia-do-brasil-i'];
  const second=EARTH_SPATIAL_LESSONS['summary-geografia-biogeografia-do-brasil-ii'];
  assert.notEqual(first.kind,second.kind);assert.ok(first.choices?.some(([id])=>id==='caatinga'));
  assert.ok(second.choices?.some(([id])=>id==='pantanal'));assert.ok(second.choices?.some(([id])=>id==='mangrove'));
  assert.notDeepEqual(earthSpatialDrawing(first.kind,5,0,'caatinga').traces,earthSpatialDrawing(second.kind,10,0,'pantanal').traces);
});
test('espécies não alvo e óxidos não recebem uma interpretação de eficácia ou de dissociação iônica',()=>{
  assert.match(earthSpatialDrawing('invasive',5,1,'nontarget').reading,/efeito indesejado/);
  assert.match(earthSpatialDrawing('inorganic',3,1,'oxide').reading,/nenhum íon/);
  assert.match(earthSpatialDrawing('inorganic',3,1,'acid').reading,/H₃O⁺ e Cl⁻/);
});
test('todos os parâmetros e condições produzem pontos finitos sem corte nas câmeras extremas',()=>{
  assert.equal(Object.keys(EARTH_SPATIAL_LESSONS).length,21);
  for(const c of Object.values(EARTH_SPATIAL_LESSONS))for(const value of [c.min,c.max])for(const choice of c.choices?.map(x=>x[0])||[''])for(const time of [0,.37,1]){
    const m=earthSpatialDrawing(c.kind,value,time,choice);assert.ok(m.reading.length>30);assert.ok(m.traces.length);
    for(const p of [...m.traces.flatMap(t=>t.points),...m.dots.map(d=>d.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){const[x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(Math.abs(x)<150&&Math.abs(y)<135,`${c.kind}: ${p}`);}
  }
});
