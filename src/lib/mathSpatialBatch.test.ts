import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { MATH_SPATIAL_LESSONS, comb, conicType, diceWays, factorial, systemSolution } from './mathSpatialBatch';
import { mathSpatialDrawing } from './mathSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';
import { SCIENCE_SPATIAL_LESSONS } from './scienceSpatialBatch';
import { SPATIAL_CHAPTER_LESSONS } from './spatialBatchCatalog';

test('78 capítulos de Matemática, um tipo de objeto por capítulo e sem colidir com outros lotes',()=>{
  const ids=Object.keys(MATH_SPATIAL_LESSONS);assert.equal(ids.length,78);
  assert.equal(new Set(Object.values(MATH_SPATIAL_LESSONS).map(l=>l.kind)).size,78);
  for(const id of ids){assert.ok(!(id in SCIENCE_SPATIAL_LESSONS));assert.ok(!(id in SPATIAL_CHAPTER_LESSONS));}
});
test('relações conferidas fora do desenho',()=>{
  assert.equal(factorial(5),120);assert.equal(comb(6,2),15);assert.equal(diceWays(7),6);assert.equal(diceWays(2),1);
  assert.equal(conicType(0),'circunferência');assert.equal(conicType(30),'elipse');assert.equal(conicType(45),'parábola');assert.equal(conicType(60),'hipérbole');
  assert.equal(systemSolution(-1),null);assert.deepEqual(systemSolution(1),[1.5,2.5]);
  assert.match(mathSpatialDrawing('pythagoras',3,0,'').reading,/= 25 = 5²/);
  assert.match(mathSpatialDrawing('binomial',2,0,'cube').reading,/= 216/);
});
test('todo valor, condição e tempo gera pontos finitos dentro do quadro',()=>{
  for(const [id,c] of Object.entries(MATH_SPATIAL_LESSONS))for(let v=c.min;v<=c.max+1e-9;v+=c.step)for(const choice of c.choices?.map(x=>x[0])||[''])for(const time of [0,.5,1]){
    const d=mathSpatialDrawing(c.kind,Number(v.toFixed(6)),time,choice);assert.ok(d.reading.length>10,id);assert.ok(!/NaN|Infinity|undefined/.test(d.reading),`${id} ${v} ${choice}: ${d.reading}`);
    for(const p of [...d.traces.flatMap(t=>t.points),...d.dots.map(x=>x.point),...d.labels.map(l=>l.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){
      const [x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Number.isFinite(y),id);assert.ok(Math.abs(x)<150&&Math.abs(y)<140,`${id} v=${v} ${choice}: ${p.map(n=>n.toFixed(0))}`);}
  }
});
