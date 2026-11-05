import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { mockTopics } from '../data/mockData';
import { questionTopics } from '../data/questionTopics';
import type { Question } from '../types';
import { loadEnemEditorialClassifications, applyEnemEditorialClassifications, loadEnemEditorialDeferrals } from '../../scripts/lib/enemEditorialClassifications';
import { auditEnemCoverage } from './enemCoverageAudit';
const bank:Question[]=JSON.parse(readFileSync('public/questions.json','utf8'));
const manifest=JSON.parse(readFileSync('scripts/data/enem-completo-2018-2025/manifest.json','utf8'));
const imported:Question[]=JSON.parse(readFileSync('scripts/data/enem-completo-2018-2025/questions.json','utf8'));
const newReview=JSON.parse(readFileSync('scripts/data/enem-auditoria-cobertura-2026-11-04.json','utf8'));

test('conferência por página prevalece sobre listas antigas e é idempotente sem reclassificar a partir de palavras',async()=>{
 const reviewed=await loadEnemEditorialClassifications(mockTopics);
 assert.equal(reviewed.get('enem_completo_2022_d1_q023')?.topicId,'por_lit_contemporanea');
 assert.equal(reviewed.get('enem_completo_2022_d1_q035')?.chapter,'Intertextualidade e Interdiscursividade');
 assert.equal(reviewed.get('enem_completo_2023_d1_q038')?.chapter,'Gêneros Textuais');
 const ids=new Set<string>(manifest.positions.map((p:any)=>p.questionId));
 const result=applyEnemEditorialClassifications(bank,reviewed,ids);
 assert.deepEqual(result,bank);assert.deepEqual(applyEnemEditorialClassifications(result,reviewed,ids),bank);
 const source=applyEnemEditorialClassifications(imported,reviewed,ids);
 const r=auditEnemCoverage(bank,questionTopics,manifest.positions,reviewed,source);
 assert.deepEqual(r.errors,[]);assert.deepEqual(r.sourceDrift,[]);assert.equal(r.summary.positions,1440);
 assert.equal(result.find(q=>q.id==='enem_completo_2022_d1_q061')?.chapter,'Estoicismo e Moderação das Paixões');
});
test('correções e ressalva têm fonte e chave rastreáveis, sem mudar respostas ou identidades',async()=>{
 const latest=await loadEnemEditorialClassifications(mockTopics);
 assert.equal(newReview.items.length,3);
 for(const item of newReview.items){
  const q=bank.find(q=>q.id===item.questionId)!;const original=manifest.positions.find((p:any)=>p.questionId===q.id);
  const classification=latest.get(q.id)!;assert.equal(q.subject,classification.subject);assert.equal(q.topicId,classification.topicId);assert.equal(q.chapter,classification.chapter);assert.equal(q.correctOptionId,item.answer.toLowerCase());assert.equal(original.answer,q.correctOptionId);
  assert.equal(q.examSource!.questionNumber,item.number);assert.equal(q.examSource!.year,item.year);
  for(const [role,urlKey,hashKey] of [['exam','sourceUrl','sourceSha256'],['key','answerKeyUrl','answerKeySha256']]){
   const doc=manifest.documents.find((d:any)=>d.year===item.year&&d.day===item.day&&d.role===role);assert.equal(item[urlKey],doc.url);assert.equal(item[hashKey],doc.sha256);
  }
 }
});
test('os relatórios gerados correspondem ao banco atual e não tratam redação como questão objetiva ausente',async()=>{
 const report=JSON.parse(readFileSync('docs/auditoria-cobertura-enem-2026-11-04/auditoria.json','utf8'));
 const fresh=auditEnemCoverage(bank,questionTopics,manifest.positions,await loadEnemEditorialClassifications(mockTopics),imported,await loadEnemEditorialDeferrals());
 assert.deepEqual(report.summary,fresh.summary);assert.deepEqual(report.coverage,fresh.coverage);assert.deepEqual(report.queue,fresh.queue);
 assert.equal(fresh.coverage.filter(t=>!t.valid&&t.topicId.startsWith('por_red_')).length,5);
});
