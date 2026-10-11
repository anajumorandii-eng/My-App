import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { aboState, BIOLOGY_SPATIAL_LESSONS, gameteCounts, HEART_ROUTE, mitosisCounts } from './biologySpatialBatch';
import { biologySpatialDrawing, routePoint } from './biologySpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';

test('mitose conserva o complemento de cromossomos por filha, mas divide o DNA duplicado',()=>{
  for(const pairs of [1,2,3]){const c=mitosisCounts(pairs);assert.equal(c.parentChromosomes,c.daughterChromosomes);assert.equal(c.parentChromatids,2*c.daughterChromatids);assert.equal(c.daughterChromosomes,c.daughterChromatids);}
});
test('não disjunção I e II produzem distribuições diferentes e conservam contagem total',()=>{
  assert.deepEqual(gameteCounts(3,'I'),[4,4,2,2]);assert.deepEqual(gameteCounts(3,'II'),[4,2,3,3]);
  for(const n of [2,3,4])for(const division of ['I','II'])assert.equal(gameteCounts(n,division).reduce((a,b)=>a+b),4*n);
});
test('ABO distingue antígenos de hemácias dos anticorpos plasmáticos',()=>{
  assert.deepEqual(aboState('O'),{antigens:[],antibodies:['anti-A','anti-B']});
  assert.deepEqual(aboState('AB'),{antigens:['A','B'],antibodies:[]});
  assert.deepEqual(aboState('A'),{antigens:['A'],antibodies:['anti-B']});
  assert.deepEqual(aboState('B'),{antigens:['B'],antibodies:['anti-A']});
});
test('circulação dupla passa pelos pulmões entre VD e AE, pelo corpo entre VE e AD',()=>{
  assert.deepEqual(HEART_ROUTE,['Corpo','AD','VD','Pulmões','AE','VE','Corpo']);
});
test('percurso tem início e término finitos, sem reiniciar no último ponto',()=>{
  const route:[number,number,number][]=[[0,0,0],[10,20,30],[-10,-20,-30]];
  assert.deepEqual(routePoint(route,0),route[0]);assert.deepEqual(routePoint(route,1),route[2]);assert.deepEqual(routePoint(route,2),route[2]);assert.deepEqual(routePoint(route,-1),route[0]);
});
test('todos os recortes mantêm geometria finita dentro da janela em câmeras extremas',()=>{
  for(const c of Object.values(BIOLOGY_SPATIAL_LESSONS))for(const value of [c.min,c.max])for(const choice of c.choices?.map(x=>x[0])||[''])for(const time of [0,.37,1]){
    const m=biologySpatialDrawing(c.kind,value,time,choice);assert.ok(m.reading.length>30);assert.ok(m.traces.length);
    for(const p of [...m.traces.flatMap(t=>t.points),...m.dots.map(d=>d.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){const[x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(Math.abs(x)<150&&Math.abs(y)<135,`${c.kind}: ${p}`);}
  }
});
test('PCR ideal distingue número de cópias de edição do DNA e preserva etapas ordenadas',()=>{
  assert.match(biologySpatialDrawing('pcr',6,0,'').reading,/64 cópias.*desnaturação/);
  assert.match(biologySpatialDrawing('pcr',6,.5,'').reading,/anelamento/);
  assert.match(biologySpatialDrawing('pcr',6,1,'').reading,/extensão/);
});
