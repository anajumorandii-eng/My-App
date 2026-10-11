import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { HUMANITIES_SPATIAL_LESSONS } from './humanitiesSpatialBatch';
import { humanitiesSpatialDrawing } from './humanitiesSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';

test('111 capítulos de História, Filosofia e Sociologia, cada um com conteúdo próprio',()=>{
  const entries=Object.entries(HUMANITIES_SPATIAL_LESSONS);assert.equal(entries.length,111);
  const signatures=new Set(entries.map(([,l])=>JSON.stringify(l.items)));assert.equal(signatures.size,111);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-historia-')).length,49);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-filosofia-')).length,35);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-sociologia-')).length,27);
});
test('moldes com geometria fixa recebem a quantidade de itens que desenham',()=>{
  for(const [id,l] of Object.entries(HUMANITIES_SPATIAL_LESSONS)){
    if(l.template==='cave'||l.template==='divided-line')assert.equal(l.items.length,4,id);
    if(l.template==='mean'||l.template==='dialectic')assert.equal(l.items.length,3,id);
    for(const [a,b] of l.links??[]){assert.ok(a<l.items.length&&b<l.items.length,id);}
    assert.ok(l.items.length>=2,id);
  }
});
test('cada item aparece na leitura e o desenho cabe no quadro',()=>{
  for(const [id,l] of Object.entries(HUMANITIES_SPATIAL_LESSONS))for(let v=1;v<=l.items.length;v++)for(const time of [0,.5,1]){
    const d=humanitiesSpatialDrawing(l,v,time);assert.ok(d.reading.startsWith(l.items[v-1][0]),id);
    for(const p of [...d.traces.flatMap(t=>t.points),...d.dots.map(x=>x.point),...d.labels.map(x=>x.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){
      const [x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Math.abs(x)<150&&Math.abs(y)<140,`${id} v=${v}: ${p.map(n=>n.toFixed(0))}`);}
  }
});
