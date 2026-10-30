import assert from 'node:assert/strict';
import test from 'node:test';
import {parseStudyVisual,punnettCells} from './studyVisual';
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
test('punnett aceita só gametas coerentes e o app calcula genótipos e proporção',()=>{
 const mono={...base,type:'punnett',parents:['Aa','Aa'],gametes:[['A','a'],['A','a']]};
 assert.equal(parseStudyVisual(JSON.stringify(mono))?.type,'punnett');
 assert.deepEqual(punnettCells([['A','a'],['A','a']]),{rows:[['AA','Aa'],['Aa','aa']],ratio:[{genotype:'AA',count:1},{genotype:'Aa',count:2},{genotype:'aa',count:1}]});
 const di=punnettCells([['AB','Ab','aB','ab'],['AB','Ab','aB','ab']]);
 assert.equal(di.rows.flat().length,16);
 assert.deepEqual(di.ratio.find(r=>r.genotype==='AaBb'),{genotype:'AaBb',count:4});
 assert.equal(di.ratio.reduce((sum,r)=>sum+r.count,0),16);
 assert.deepEqual(punnettCells([['a'],['A','a']]).ratio,[{genotype:'Aa',count:1},{genotype:'aa',count:1}]);
 for(const gametes of [[['A','b'],['A','a']],[['A'],['A','a','a','a','a']],[['AB','A'],['ab']],[['A1'],['a']],[['AA'],['aa']],[['A','a']]])assert.equal(parseStudyVisual(JSON.stringify({...mono,gametes})),undefined,JSON.stringify(gametes));
});
test('ciclo exige de 3 a 8 etapas curtas e centro opcional curto',()=>{
 const cycle={...base,type:'cycle',center:'Ciclo da água',steps:['Evaporação','Condensação','Precipitação','Escoamento']};
 assert.equal(parseStudyVisual(JSON.stringify(cycle))?.type,'cycle');
 for(const bad of [{steps:['a','b']},{steps:Array(9).fill('x')},{center:'x'.repeat(41)},{steps:['a','b','x'.repeat(91)]}])assert.equal(parseStudyVisual(JSON.stringify({...cycle,...bad})),undefined);
});
