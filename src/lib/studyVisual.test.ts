import assert from 'node:assert/strict';
import test from 'node:test';
import {parseStudyVisual} from './studyVisual';
const base={title:'Exemplo',caption:'Dados didáticos.',question:'O que se observa?'};
test('aceita estruturas e sequências com condição para cada seta',()=>{
 const molecule={label:'Etanol',smiles:'CCO'};
 assert.equal(parseStudyVisual(JSON.stringify({...base,type:'molecule',molecule}))?.type,'molecule');
 assert.equal(parseStudyVisual(JSON.stringify({...base,type:'reaction',molecules:[molecule,{label:'Etanal',smiles:'CC=O'}],conditions:['[O] controlado']}))?.type,'reaction');
 assert.equal(parseStudyVisual(JSON.stringify({...base,type:'reaction',molecules:[molecule,molecule],conditions:[]})),undefined);
 for(const smiles of ['<svg onload=1>','https://image.test/x','C'.repeat(181),''])assert.equal(parseStudyVisual(JSON.stringify({...base,type:'molecule',molecule:{label:'Estrutura',smiles}})),undefined);
});
test('curvas exigem pontos finitos e x crescente sem inventar ordenação',()=>{
 const graph={...base,type:'line',xLabel:'Tempo (s)',yLabel:'Concentração (mol/L)',series:[{label:'A',points:[{x:0,y:1},{x:1,y:.4}]}]};
 assert.equal(parseStudyVisual(JSON.stringify(graph))?.type,'line');
 for(const points of [[{x:1,y:1},{x:0,y:.4}],[{x:1,y:1},{x:1,y:.4}],[{x:0,y:1},{x:1,y:1e99}],[{x:0,y:1}]])assert.equal(parseStudyVisual(JSON.stringify({...graph,series:[{label:'A',points}]})),undefined);
 assert.equal(parseStudyVisual(JSON.stringify({...graph,series:[]})),undefined);
});
test('mantém compatibilidade de barras legadas com valores grandes finitos',()=>{
 assert.equal(parseStudyVisual(JSON.stringify({...base,type:'bars',unit:'unidades',data:[{label:'A',value:1e12},{label:'B',value:2e12}]}))?.type,'bars');
});
