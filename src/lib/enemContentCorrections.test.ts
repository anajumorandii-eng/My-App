import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { applyEnemContentCorrections, loadEnemContentCorrections, questionContentDigest, matchesReviewedContent } from '../../scripts/lib/enemContentCorrections';
import type { Question } from '../types';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const bank:Question[]=read('public/questions.json');
const batch:Question[]=read('scripts/data/enem-completo-2018-2025/questions.json');
const manifest=read('scripts/data/enem-completo-2018-2025/manifest.json');

test('transcrições conferidas têm fonte rastreável e estão aplicadas nas duas bases',()=>{
 const rows=loadEnemContentCorrections();assert.equal(read('scripts/data/enem-correcao-transcricao-2026-11-04.json').items.length,15);assert.equal(rows.length,39);
 for(const row of rows){
  const q=bank.find(q=>q.id===row.questionId)!;assert.ok(q,row.questionId);
  assert.equal(questionContentDigest(q),row.afterSha256,row.questionId);
  assert.deepEqual(batch.find(value=>value.id===q.id),q);
  const position=manifest.positions.find((p:any)=>p.questionId===q.id);
  const doc=manifest.documents.find((d:any)=>d.year===position.year&&d.day===position.day&&d.role==='exam');
  assert.equal(row.sourceUrl,doc.url);assert.equal(row.sourceSha256,doc.sha256);
  assert.equal(q.correctOptionId,position.status==='annulled'?'':position.answer);
  assert.ok(row.evidence.length>40);assert.ok(row.pages.length);
  const before=structuredClone(q);
  for(const change of row.changes){
   const option=/^options\.([a-e])\.text$/.exec(change.field);
   if(option)before.options.find(o=>o.id===option[1])!.text=change.before as string;
   else if(change.field==='prompt')before.prompt=change.before as string;
   else if(change.field==='figures')before.figures=change.before as Question['figures'];
   else assert.fail(change.field);
  }
  assert.equal(questionContentDigest(before),row.beforeSha256);
  assert.deepEqual(applyEnemContentCorrections([before]),[q]);
  assert.ok(matchesReviewedContent(q,row.beforeSha256));
  assert.ok(!matchesReviewedContent(q,'unreviewed'));
  const changed=structuredClone(before);changed.prompt+=' alteração inesperada';
  assert.throws(()=>applyEnemContentCorrections([changed]),/divergente/);
 }
 assert.deepEqual(applyEnemContentCorrections(bank),bank);
});

test('redação não integra alternativas e símbolos e alternativas textuais são legíveis',()=>{
 for(const q of batch)for(const option of q.options)assert.doesNotMatch(option.text,/INSTRUÇÕES PARA A REDAÇÃO|PROPOSTA DE REDAÇÃO|TEXTOS MOTIVADORES|Transcreva a sua Redação|RASCUNHO|ȍ|[\ue000-\uf8ff]/,q.id);
 assert.equal(bank.find(q=>q.id==='enem_completo_2019_d1_q059')!.options[0].text,'Falsificação de teses.');
 assert.deepEqual(bank.find(q=>q.id==='enem_completo_2018_d2_q106')!.options.map(o=>o.text),['1,3 kΩ','4,0 kΩ','6,0 kΩ','6,7 kΩ','12,0 kΩ']);
});
