import assert from 'node:assert/strict';
import test from 'node:test';
import type { Question, Topic } from '../types';
import { auditEnemCoverage, enemOfficialArea, type EnemAuditPosition } from './enemCoverageAudit';
const subjects=['Português','História','Física','Matemática'];
const topics:Topic[]=subjects.map((subject,i)=>({id:`t${i}`,name:`Tópico ${i}`,subject,prerequisites:[],chapters:['Coberto','Sem questão']}));
function fixture(){
 const questions:Question[]=Array.from({length:180},(_,index)=>{const n=index+1,area=Math.floor(index/45);return {id:`q${n}`,subject:subjects[area],topicId:`t${area}`,chapter:'Coberto',prompt:`Questão sintética ${n}. Enunciado extenso para conferir grupos textuais sem confundir a contagem com a identidade histórica.`,options:['a','b','c','d','e'].map(id=>({id,text:`Alternativa ${id}`})),correctOptionId:n===180?'':'c',difficulty:'medium',...(n===180?{status:'annulled' as const}:{}),explanation:'Explicação.',examSource:{board:'ENEM',year:2020,questionNumber:n}}});
 const positions:EnemAuditPosition[]=questions.map((q,index)=>({questionId:q.id,year:2020,day:index<90?1:2,number:index+1,answer:index===179?'*':'c',status:index===179?'annulled':'active',classificationMethod:'automatic-lexical-similarity'}));
 return {questions,positions};
}
test('concilia posições oficiais, válidas/anuladas e capítulos sem confundir volume com cobertura',()=>{
 const{questions,positions}=fixture();const r=auditEnemCoverage(questions,topics,positions);
 assert.equal(r.errors.length,0);assert.equal(r.summary.valid,179);assert.equal(r.summary.annulled,1);assert.equal(r.summary.uncoveredChapters,4);assert.equal(r.summary.automaticPending,180);assert.equal(r.queue.length,180);
 assert.equal(r.coverage.find(t=>t.subject==='Matemática')!.valid,44);
 assert.deepEqual([45,46,90,91,135,136].map(enemOfficialArea),['Linguagens','Humanas','Humanas','Natureza','Natureza','Matemática']);
});
test('uma classificação interdisciplinar é sinalizada, sem ser tratada como duplicata ou erro',()=>{
 const{questions,positions}=fixture();questions[107]={...questions[107],subject:'Matemática',topicId:'t3'};
 const r=auditEnemCoverage(questions,topics,positions);
 assert.equal(r.errors.length,0);assert.equal(r.outsideArea.length,1);assert.equal(r.outsideArea[0].area,'Natureza');assert.equal(r.summary.positions,180);
 // Another booklet number never overrides the canonical manifest mapping.
 questions[135].examSource!.questionNumber=100;assert.equal(auditEnemCoverage(questions,topics,positions).outsideArea.length,1);
});
test('detecta falhas de identidade, gabarito, catálogo e repetição textual antes de alterar dados',()=>{
 const{questions,positions}=fixture();questions[1]={...questions[1],prompt:questions[0].prompt};questions[2].correctOptionId='e';questions[3].chapter='Inexistente';positions[4].number=4;
 const r=auditEnemCoverage(questions,topics,positions),codes=new Set(r.errors.map(e=>e.code));
 for(const code of ['answer-mismatch','invalid-chapter','duplicate-position','missing-position'])assert.ok(codes.has(code),code);
 assert.deepEqual(r.duplicateContent,[['q1','q2']]);
});
test('lacuna taxonômica e classificação automática ficam na fila sem inventar capítulo ou calibração',()=>{
 const{questions,positions}=fixture();delete questions[0].chapter;
 const reviews=new Map([['q1',{topicId:'t0',subject:'Português',source:'revisao.json',confidence:'medium'}]]);
 const r=auditEnemCoverage(questions,topics,positions,reviews);
 assert.equal(r.errors.length,0);assert.equal(r.missingChapters.length,1);assert.equal(r.summary.automaticPending,179);assert.equal(r.queue[0].id,'q1');assert.ok(r.queue[0].reasons.includes('taxonomy-gap'));
 const stale=questions.map(q=>({...q}));stale[2].chapter='Sem questão';assert.equal(auditEnemCoverage(questions,topics,positions,reviews,stale).sourceDrift.length,1);
});
