import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { mockTopics } from '../data/mockData';
import { questionTopics, questionOnlyTopics, isQuestionOnlyTopic } from '../data/questionTopics';
import { buildTopicHierarchy, filterByHierarchy, ALL } from './topicHierarchy';
import { matchesReviewedContent } from '../../scripts/lib/enemContentCorrections';
import { enemReviewBatchPaths, loadEnemEditorialClassifications, loadEnemEditorialDeferrals, ENEM_TAXONOMY_RESOLUTION_PATH } from '../../scripts/lib/enemEditorialClassifications';
import type { Question } from '../types';
const read=(p:string)=>JSON.parse(readFileSync(p,'utf8'));
const bank:Question[]=read('public/questions.json');
const imported:Question[]=read('scripts/data/enem-completo-2018-2025/questions.json');
const manifest=read('scripts/data/enem-completo-2018-2025/manifest.json');
const review=read(ENEM_TAXONOMY_RESOLUTION_PATH);

test('catálogo do banco amplia a classificação sem criar módulos na grade de estudo',()=>{
 assert.equal(mockTopics.length,105);assert.equal(mockTopics.reduce((n,t)=>n+t.chapters!.length,0),612);
 assert.equal(questionOnlyTopics.length,5);assert.equal(questionTopics.length,110);
 assert.equal(new Set(questionTopics.map(t=>t.id)).size,questionTopics.length);
 for(const t of questionOnlyTopics){assert.ok(!mockTopics.some(other=>other.id===t.id));assert.ok(isQuestionOnlyTopic(t.id));assert.ok(t.chapters!.length);}
});

test('as dez pendências têm nova decisão com fontes, chaves e conteúdo rastreáveis',async()=>{
 const historical=new Map<string,{source:string;reason:string}>();
 for(const path of await enemReviewBatchPaths())for(const row of read(path).deferred)historical.set(row.questionId,{source:path,reason:row.reason});
 assert.equal(historical.size,10);assert.equal(review.items.length,10);
 assert.deepEqual(review.items.map((r:any)=>r.questionId).sort(),[...historical.keys()].sort());
 const latest=await loadEnemEditorialClassifications(mockTopics);
 for(const r of review.items){
  const q=bank.find(q=>q.id===r.questionId)!;const p=manifest.positions.find((p:any)=>p.questionId===q.id);const topic=questionTopics.find(t=>t.id===r.bankTopicId)!;
  assert.ok(isQuestionOnlyTopic(r.bankTopicId));assert.equal(topic.subject,r.bankSubject);assert.ok(topic.chapters!.includes(r.bankChapter));
  assert.deepEqual([q.subject,q.topicId,q.chapter],[r.bankSubject,r.bankTopicId,r.bankChapter]);assert.deepEqual(imported.find(other=>other.id===q.id),q);
  assert.deepEqual([r.year,r.day,r.number],[p.year,p.day,p.number]);assert.ok(p.pages.includes(r.page));assert.equal(q.correctOptionId,p.answer);assert.equal(r.answer,p.answer.toUpperCase());
  assert.ok(matchesReviewedContent(q,r.contentSha256));assert.deepEqual(r.previousDeferral,historical.get(q.id));assert.equal(r.reviewBasis,'pdf-page-visual');assert.equal(r.confidence,'high');assert.ok(r.evidence.length>70);
  for(const [role,url,sha] of [['exam','sourceUrl','sourceSha256'],['key','answerKeyUrl','answerKeySha256']]){const d=manifest.documents.find((d:any)=>d.year===p.year&&d.day===p.day&&d.role===role);assert.equal(r[url],d.url);assert.equal(r[sha],d.sha256);}
  assert.equal(latest.get(q.id)!.source,ENEM_TAXONOMY_RESOLUTION_PATH);
 }
 assert.equal((await loadEnemEditorialDeferrals()).size,0);
});

test('Educação Física tem hierarquia própria e a seleção não recai em escola literária',()=>{
 const own=bank.filter(q=>q.subject==='Educação Física'&&q.examSource?.board==='ENEM');assert.equal(own.length,6);
 const tree=buildTopicHierarchy(own,questionTopics);assert.equal(tree.length,2);assert.ok(tree.every(t=>t.subject==='Educação Física'&&t.id.startsWith('q_ef_')));
 const selected=filterByHierarchy(own,{topicId:'q_ef_cultura_corporal',subtopicId:'Valores Olímpicos e Paralímpicos'},questionTopics);
 assert.deepEqual(selected.map(q=>q.id).sort(),['enem_completo_2018_d1_q011','enem_completo_2023_d1_q043']);
 assert.equal(filterByHierarchy(own,{topicId:'q_ef_cultura_corporal',subtopicId:ALL},questionTopics).length,5);
});
