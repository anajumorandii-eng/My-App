import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { auditEnemContentQuality } from './enemContentQuality';
import type { Question } from '../types';
const q:Question={id:'sample',subject:'Química',topicId:'sample',prompt:'Identifique a estrutura.',options:[{id:'a',text:'Alternativa visual A (ver figura identificada pela letra).'},{id:'b',text:'B'}],correctOptionId:'a',difficulty:'medium',explanation:'Comentário.'};
test('referência visual exige uma figura e não equivale a um erro quando o recorte existe',()=>{
 assert.equal(auditEnemContentQuality([q]).errors[0].code,'visual-alternative-without-figure');
 const result=auditEnemContentQuality([{...q,figures:[{url:'/figure.webp'}]}]);assert.equal(result.errors.length,0);assert.equal(result.summary.visualPending,1);
 const reviewed=auditEnemContentQuality([{...q,figures:[{url:'/figure.webp'}]}],new Set(['sample']));assert.equal(reviewed.summary.visualReviewed,1);assert.equal(reviewed.queue.length,0);
});
test('letras gregas e operadores normais são preservados, glifos privados e rodapés exigem correção',()=>{
 const base={...q,options:[{id:'a',text:'α + β = 180°'},{id:'b',text:'7√2'}]};
 assert.deepEqual(auditEnemContentQuality([base]).errors,[]);
 assert.equal(auditEnemContentQuality([{...base,prompt:'x\uf02b2'}]).errors[0].code,'unreadable-character');
 assert.equal(auditEnemContentQuality([{...base,options:[{id:'a',text:'Texto.\nCH 1º dia | Caderno 2 - AMARELO - Página 23'}]}]).errors[0].code,'institutional-footer');
});
test('novos recortes possuem letras A–E explícitas e mantêm as figuras de contexto',()=>{
 const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
 const bank:Question[]=read('public/questions.json');const manifest=read('scripts/data/enem-completo-2018-2025/manifest.json');
 for(const [id,expectedCount] of [['enem_completo_2021_d2_q094',5],['enem_completo_2021_d2_q154',6],['enem_completo_2021_d2_q155',5],['enem_completo_2020_d2_q108',1]] as const){
  const item=bank.find(q=>q.id===id)!;assert.equal(item.figures!.length,expectedCount);
  const urls=new Set(item.figures!.map(f=>f.url));const media=manifest.media.filter((m:any)=>m.questionId===id&&urls.has(m.url));
  assert.deepEqual(media.flatMap((m:any)=>m.alternativeLabels??[]).sort(),['A','B','C','D','E']);assert.ok(media.every((m:any)=>m.alphaCanvas));
 }
});

test('fórmulas que antes coincidiam mantêm os deslocamentos distintos da fonte',()=>{
 const bank:Question[]=JSON.parse(readFileSync('public/questions.json','utf8'));
 const q=bank.find(q=>q.id==='enem_completo_2025_d2_q159')!;
 assert.equal(q.options.find(o=>o.id==='d')!.text,'D = 30 + tg[(1/2)(T − 5)]');
 assert.equal(q.options.find(o=>o.id==='e')!.text,'D = 30 + tg[(1/2)(T − 5/2)]');
 assert.equal(new Set(q.options.map(o=>o.text)).size,5);
 const chemistry=bank.find(q=>q.id==='enem_completo_2022_d2_q110')!;assert.match(chemistry.prompt,/150 g mol⁻¹/);assert.doesNotMatch(chemistry.prompt,/[\ue000-\uf8ff]/);
});
