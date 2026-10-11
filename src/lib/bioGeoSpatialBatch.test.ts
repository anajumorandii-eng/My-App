import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { BIO_GEO_SPATIAL_LESSONS, alleleAfter, gini, logisticN, recombinantFraction } from './bioGeoSpatialBatch';
import { bioGeoSpatialDrawing } from './bioGeoSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';
import { EARTH_SPATIAL_LESSONS } from './earthSpatialBatch';
import { BIOLOGY_SPATIAL_LESSONS } from './biologySpatialBatch';
import { MATH_SPATIAL_LESSONS } from './mathSpatialBatch';

test('88 capítulos (43 de Biologia, 45 de Geografia), um tipo por capítulo, sem colidir com outros lotes',()=>{
  const ids=Object.keys(BIO_GEO_SPATIAL_LESSONS);assert.equal(ids.length,88);
  assert.equal(new Set(Object.values(BIO_GEO_SPATIAL_LESSONS).map(l=>l.kind)).size,88);
  for(const id of ids)for(const other of [EARTH_SPATIAL_LESSONS,BIOLOGY_SPATIAL_LESSONS,MATH_SPATIAL_LESSONS])assert.ok(!(id in other),id);
});
test('relações conferidas fora do desenho',()=>{
  assert.ok(Math.abs(logisticN(.6,0)-5)<1e-9);assert.ok(logisticN(1,40)>99);
  assert.equal(recombinantFraction(20),.2);assert.equal(recombinantFraction(80),.5);
  assert.ok(alleleAfter(.2,10)>.1);assert.equal(alleleAfter(0,10),.1);
  assert.ok(Math.abs(gini([1,1,1,1,1]))<1e-9);assert.ok(gini([0,0,0,0,10])>.7);
  assert.match(bioGeoSpatialDrawing('dihybrid',1,0,'').reading,/9\/16/);
  assert.match(bioGeoSpatialDrawing('epistasis',3,0,'recessive').reading,/4\/16/);
  assert.match(bioGeoSpatialDrawing('trade-balance',3,0,'').reading,/déficit/);
});
test('todo valor, condição e tempo gera pontos finitos dentro do quadro',()=>{
  for(const [id,c] of Object.entries(BIO_GEO_SPATIAL_LESSONS))for(let v=c.min;v<=c.max+1e-9;v+=c.step)for(const choice of c.choices?.map(x=>x[0])||[''])for(const time of [0,.5,1]){
    const d=bioGeoSpatialDrawing(c.kind,Number(v.toFixed(6)),time,choice);assert.ok(d.reading.length>10,id);assert.ok(!/NaN|Infinity|undefined/.test(d.reading),`${id} ${v} ${choice}: ${d.reading}`);
    assert.ok(d.traces.length+d.dots.length>0,id);
    for(const p of [...d.traces.flatMap(t=>t.points),...d.dots.map(x=>x.point),...d.labels.map(l=>l.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){
      const [x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Number.isFinite(y),id);assert.ok(Math.abs(x)<150&&Math.abs(y)<140,`${id} v=${v} ${choice}: ${p.map(n=>n.toFixed(0))}`);}
  }
});
