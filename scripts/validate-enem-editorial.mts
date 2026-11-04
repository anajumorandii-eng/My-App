/** Validate every assignment and its provenance before publishing a review batch. */
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mockTopics } from '../src/data/mockData';
import { enemReviewBatchPaths, loadEnemEditorialClassifications } from './lib/enemEditorialClassifications';
const bank=JSON.parse(await readFile('public/questions.json','utf8'));
const manifest=JSON.parse(await readFile('scripts/data/enem-completo-2018-2025/manifest.json','utf8'));
const byId=new Map<string,any>(bank.map((q:any)=>[q.id,q]));
const positions=new Map<string,any>(manifest.positions.map((p:any)=>[p.questionId,p]));
const catalog=new Map(mockTopics.map(t=>[t.id,t]));
const before=await loadEnemEditorialClassifications(mockTopics,false);
// This dated batch covers the original automatic queue plus the five reservations.
const expected=new Set<string>(manifest.positions.filter((p:any)=>p.classificationMethod==='automatic-lexical-similarity'&&!before.has(p.questionId)||before.get(p.questionId)?.confidence==='medium').map((p:any)=>p.questionId));
const seen=new Set<string>();const counts={reviewed:0,deferred:0,keep:0,correct:0,'taxonomy-gap':0};
const files=[];
const digest=(q:any)=>createHash('sha256').update(JSON.stringify({id:q.id,prompt:q.prompt,options:q.options,correctOptionId:q.correctOptionId,status:q.status??null,figures:q.figures??[],examSource:q.examSource})).digest('hex');
for(const path of await enemReviewBatchPaths()){
 const data=JSON.parse(await readFile(path,'utf8'));
 assert.ok(data.scope?.trim(),path);
 for(const row of [...data.items,...data.deferred]){
  assert.ok(expected.has(row.questionId),`Fora da fila original: ${row.questionId}`);assert.ok(!seen.has(row.questionId),`Revisão duplicada: ${row.questionId}`);seen.add(row.questionId);
 }
 for(const row of data.items){
  const q=byId.get(row.questionId),p=positions.get(row.questionId),topic=catalog.get(row.bankTopicId);
  assert.ok(q&&p&&topic,row.questionId);assert.equal(topic.subject,row.bankSubject,row.questionId);assert.ok(row.bankChapter===null||topic.chapters.includes(row.bankChapter),row.questionId);
  assert.deepEqual([row.year,row.day,row.number],[p.year,p.day,p.number],row.questionId);assert.ok(p.pages.includes(row.page),row.questionId);
  assert.equal(row.answer,p.status==='annulled'?'*':p.answer.toUpperCase(),row.questionId);assert.equal(q.correctOptionId,p.status==='annulled'?'':p.answer,row.questionId);
  for(const [role,url,sha] of [['exam','sourceUrl','sourceSha256'],['key','answerKeyUrl','answerKeySha256']]){
   const doc=manifest.documents.find((d:any)=>d.year===p.year&&d.day===p.day&&d.role===role);assert.equal(row[url],doc.url,row.questionId);assert.equal(row[sha],doc.sha256,row.questionId);
  }
  assert.ok(['high','medium'].includes(row.confidence),row.questionId);assert.ok(['keep','correct','taxonomy-gap'].includes(row.decision),row.questionId);
  assert.ok(['native-text','native-text-and-figure','pdf-page-visual'].includes(row.reviewBasis),row.questionId);assert.ok(row.evidence?.trim().length>=40,row.questionId);
  assert.ok(row.previous&&row.previous.subject&&row.previous.topicId&&Object.hasOwn(row.previous,'chapter'),row.questionId);
  if(row.decision==='keep')assert.deepEqual(row.previous,{subject:row.bankSubject,topicId:row.bankTopicId,chapter:row.bankChapter},row.questionId);
  if(row.decision==='taxonomy-gap'){assert.equal(row.bankChapter,null,row.questionId);assert.equal(row.confidence,'medium',row.questionId);}
  const hash=digest(q);
  if(row.contentSha256)assert.equal(row.contentSha256,hash,`Conteúdo alterado sem nova revisão: ${row.questionId}`);
  else if(process.argv.includes('--stamp'))row.contentSha256=hash;
  else throw new Error(`Falta o hash de conteúdo de ${row.questionId}; use --stamp após conferir o lote.`);
  counts.reviewed++;counts[row.decision as 'keep'|'correct'|'taxonomy-gap']++;
 }
 for(const row of data.deferred){assert.ok(row.reason?.trim().length>=30,row.questionId);counts.deferred++;}
 files.push({path,data});
}
assert.deepEqual([...seen].sort(),[...expected].sort(),'Toda a fila original precisa de decisão ou adiamento explícito.');
if(process.argv.includes('--stamp'))for(const file of files)await writeFile(file.path,JSON.stringify(file.data,null,2)+'\n');
console.log(JSON.stringify({assigned:expected.size,...counts}));
