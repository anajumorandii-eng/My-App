import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { LANGUAGES_SPATIAL_LESSONS } from './languagesSpatialBatch';
import { humanitiesSpatialDrawing } from './humanitiesSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';

test('150 capítulos de Linguagens, cada um com conteúdo próprio',()=>{
  const entries=Object.entries(LANGUAGES_SPATIAL_LESSONS);assert.equal(entries.length,150);
  const signatures=new Set(entries.map(([,l])=>JSON.stringify(l.items)));assert.equal(signatures.size,150);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-lingua-inglesa-')).length,17);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-redacao-')).length,58);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-gramatica-')).length,26);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-literatura-')).length,37);
  assert.equal(entries.filter(([id])=>id.startsWith('summary-entendimento-de-texto-')).length,12);
});
test('moldes com geometria fixa recebem a quantidade de itens que desenham',()=>{
  for(const [id,l] of Object.entries(LANGUAGES_SPATIAL_LESSONS)){
    if(l.template==='cave'||l.template==='divided-line')assert.equal(l.items.length,4,id);
    if(l.template==='mean'||l.template==='dialectic')assert.equal(l.items.length,3,id);
    for(const [a,b] of l.links??[]){assert.ok(a<l.items.length&&b<l.items.length,id);}
    assert.ok(l.items.length>=2,id);
  }
});
test('cada item aparece na leitura e o desenho cabe no quadro',()=>{
  for(const [id,l] of Object.entries(LANGUAGES_SPATIAL_LESSONS))for(let v=1;v<=l.items.length;v++)for(const time of [0,.5,1]){
    const d=humanitiesSpatialDrawing(l,v,time);assert.ok(d.reading.startsWith(l.items[v-1][0]),id);
    for(const p of [...d.traces.flatMap(t=>t.points),...d.dots.map(x=>x.point),...d.labels.map(x=>x.point)])for(const yaw of [0,90,180,270])for(const pitch of [-50,65]){
      const [x,y]=rotateSpatialPoint(p,yaw,pitch);assert.ok(Number.isFinite(x)&&Math.abs(x)<150&&Math.abs(y)<140,`${id} v=${v}: ${p.map(n=>n.toFixed(0))}`);}
  }
});
test('nenhum capítulo usa a comparação genérica de colunas; o modelo segue o que o capítulo compara',()=>{
  const by=(t:string)=>Object.values(LANGUAGES_SPATIAL_LESSONS).filter(l=>l.template===t).length;
  assert.equal(by('compare'),0);
  for(const t of ['spectrum','prism','shelf','mirror','checklist'])assert.ok(by(t)>0,t);
  for(const [id,l] of Object.entries(LANGUAGES_SPATIAL_LESSONS))if(l.template==='mirror')assert.equal(l.items.length,2,id);
});
