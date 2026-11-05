import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { matchesReviewedContent } from '../../scripts/lib/enemContentCorrections';
import { execFileSync } from 'node:child_process';
import { mockTopics } from '../data/mockData';
import type { Question } from '../types';
import { enemReviewBatchPaths, loadEnemEditorialClassifications, loadEnemEditorialDeferrals, applyEnemEditorialClassifications } from '../../scripts/lib/enemEditorialClassifications';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const manifest=read('scripts/data/enem-completo-2018-2025/manifest.json');
const bank:Question[]=read('public/questions.json');
const byId=new Map(bank.map(q=>[q.id,q]));


test('todos os 789 casos da fila original têm decisão ou adiamento explícito, com fontes e conteúdo preservados',async()=>{
 const base=await loadEnemEditorialClassifications(mockTopics,false);
 const expected=new Set(manifest.positions.filter((p:any)=>p.classificationMethod==='automatic-lexical-similarity'&&!base.has(p.questionId)||base.get(p.questionId)?.confidence==='medium').map((p:any)=>p.questionId));
 assert.equal(expected.size,789);
 const ids=new Set<string>();let reviewed=0,deferred=0;
 for(const path of await enemReviewBatchPaths()){
  const file=read(path);
  for(const row of [...file.items,...file.deferred]){assert.ok(expected.has(row.questionId));assert.ok(!ids.has(row.questionId));ids.add(row.questionId);}
  for(const row of file.items){
   reviewed++;const q=byId.get(row.questionId)!;assert.ok(q);assert.ok(matchesReviewedContent(q,row.contentSha256),row.questionId);
   const p=manifest.positions.find((p:any)=>p.questionId===q.id);assert.equal(q.correctOptionId,p.status==='annulled'?'':p.answer);assert.equal(row.answer,p.status==='annulled'?'*':p.answer.toUpperCase());
   assert.deepEqual([row.year,row.day,row.number],[p.year,p.day,p.number]);
   assert.equal(q.topicId,row.bankTopicId);assert.equal(q.subject,row.bankSubject);assert.equal(q.chapter??null,row.bankChapter);
   for(const [role,url,sha] of [['exam','sourceUrl','sourceSha256'],['key','answerKeyUrl','answerKeySha256']]){const doc=manifest.documents.find((d:any)=>d.year===p.year&&d.day===p.day&&d.role===role);assert.equal(row[url],doc.url);assert.equal(row[sha],doc.sha256);}
   assert.ok(row.evidence.length>=40);
  }
  deferred+=file.deferred.length;
 }
 assert.deepEqual([...ids].sort(),[...expected].sort());assert.equal(reviewed,779);assert.equal(deferred,10);
});

test('as correções verificadas seguem a competência, com segunda leitura nos casos de fronteira',()=>{
 const get=(id:string)=>byId.get(id)!;
 assert.equal(get('enem_completo_2019_d1_q082').topicId,'bio_ecologia');
 assert.equal(get('enem_completo_2021_d1_q050').topicId,'fil_moderna_racionalismo_empirismo');
 assert.equal(get('enem_completo_2021_d1_q047').chapter,undefined);
 assert.equal(get('enem_completo_2022_d1_q083').chapter,'Dinâmica Climática');
 assert.equal(get('enem_completo_2018_d1_q019').chapter,'Desigualdade de Gênero');
 assert.equal(get('enem_completo_2021_d2_q149').subject,'Física');
 assert.equal(get('enem_completo_2020_d2_q176').chapter,'Introdução às Técnicas de Contagem');
 assert.equal(get('enem_completo_2021_d2_q136').chapter,undefined);
});

test('adiamentos históricos resolvidos não reaparecem na fila ativa e reaplicar é idempotente',async()=>{
 const deferred=await loadEnemEditorialDeferrals();assert.equal(deferred.size,0);assert.ok(!deferred.has('enem_completo_2018_d1_q052'));assert.ok(!deferred.has('enem_completo_2022_d1_q061'));
 const map=await loadEnemEditorialClassifications(mockTopics);
 assert.deepEqual(applyEnemEditorialClassifications(bank,map,new Set<string>(manifest.positions.map((p:any)=>p.questionId))),bank);
});

test('validação editorial completa roda sem gravação nem chamadas pagas',()=>{
 const stdout=execFileSync(process.execPath,['--import','tsx','scripts/validate-enem-editorial.mts'],{encoding:'utf8'});
 const result=JSON.parse(stdout.trim());assert.equal(result.assigned,789);assert.equal(result.reviewed,779);assert.equal(result.deferred,10);
});
