import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { SCIENCE_SPATIAL_LESSONS, carnotEfficiency, collisionVelocities, iceState, ionizedFraction, mirrorImage, newtonAcceleration, photoelectronEnergy, rangeOf } from './scienceSpatialBatch';
import { scienceSpatialDrawing } from './scienceSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';
import { PHYSICS_SPATIAL_LESSONS } from './physicsSpatialBatch';
import { CHEMISTRY_SPATIAL_LESSONS } from './chemistrySpatialBatch';
import { BIOLOGY_SPATIAL_LESSONS } from './biologySpatialBatch';
import { EARTH_SPATIAL_LESSONS } from './earthSpatialBatch';
import { SPATIAL_CHAPTER_LESSONS } from './spatialBatchCatalog';

test('o lote cobre 56 capítulos sem repetir os lotes espaciais anteriores',()=>{
  const ids=Object.keys(SCIENCE_SPATIAL_LESSONS);assert.equal(ids.length,56);
  for(const other of [PHYSICS_SPATIAL_LESSONS,CHEMISTRY_SPATIAL_LESSONS,BIOLOGY_SPATIAL_LESSONS,EARTH_SPATIAL_LESSONS,SPATIAL_CHAPTER_LESSONS])for(const id of ids)assert.ok(!(id in other),id);
});
test('relações físicas conferidas fora do desenho',()=>{
  assert.equal(newtonAcceleration(20,false),5);assert.equal(newtonAcceleration(20,true),2.5);assert.equal(newtonAcceleration(5,true),0);
  assert.ok(Math.abs(rangeOf(20,30)-rangeOf(20,60))<1e-9);assert.ok(Math.abs(rangeOf(20,45)-40)<1e-9);
  const [a,b]=collisionVelocities(1,true);assert.ok(Math.abs(a)<1e-12&&b===4);
  const [c,d]=collisionVelocities(1,false);assert.equal(c,2);assert.equal(d,2);
  assert.equal(iceState(0).temperature,-10);assert.equal(iceState(20).temperature,0);assert.ok(iceState(20).meltedFraction>0&&iceState(20).meltedFraction<1);
  assert.equal(carnotEfficiency(300),.5);assert.ok(Math.abs(mirrorImage(30)-60)<1e-9);assert.ok(mirrorImage(10)<0);
  assert.equal(photoelectronEnergy(5),0);assert.ok(photoelectronEnergy(10)>1.8);assert.ok(Math.abs(ionizedFraction(4.75)-.5)<1e-12);
});
test('todos os parâmetros, condições e tempos geram pontos finitos dentro do quadro',()=>{
  for(const [id,c] of Object.entries(SCIENCE_SPATIAL_LESSONS))for(let value=c.min;value<=c.max+1e-9;value+=c.step)for(const choice of c.choices?.map(x=>x[0])||[''])for(const time of [0,.37,1]){
    const m=scienceSpatialDrawing(c.kind,value,time,choice);assert.ok(m.reading.length>30,id);assert.ok(m.traces.length+m.dots.length>0,id);assert.ok(!/NaN|Infinity/.test(m.reading),`${id} ${value} ${choice}: ${m.reading}`);
    for(const p of [...m.traces.flatMap(t=>t.points),...m.dots.map(d=>d.point),...m.labels.map(l=>l.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){const[x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Number.isFinite(y),id);assert.ok(Math.abs(x)<150&&Math.abs(y)<135,`${id} ${value} ${choice}: ${p}`);}
  }
});
