import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { questionTopics } from '../data/questionTopics';
import { loadEnemEditorialClassifications } from '../../scripts/lib/enemEditorialClassifications';
import type { Question } from '../types';
import { questionExamIdentity } from './questionExamIdentity';
const read=(path:string)=>JSON.parse(readFileSync(path,'utf8'));
const review=read('scripts/data/enem-conferencia-2022-2023.json');
const bank=new Map<string,Question>(read('public/questions.json').map((q:Question)=>[q.id,q]));
const canonical=new Map<string,Question>(read('scripts/data/enem-completo-2018-2025/questions.json').map((q:Question)=>[q.id,q]));
const manifest=read('scripts/data/enem-completo-2018-2025/manifest.json');
const corpus=read('src/data/incidence/enem.json');
const item=(year:number,day:number,number:number)=>review.items.find((r:any)=>r.year===year&&r.day===day&&r.sourceNumber===number);
const question=(year:number,day:number,number:number)=>bank.get(item(year,day,number).questionId)!;

test('186 fichas conferidas mantêm identidade, gabarito e texto no banco e no lote importável',async()=>{
 const latest=await loadEnemEditorialClassifications(questionTopics);
 assert.equal(review.items.length,186);assert.equal(new Set(review.items.map((r:any)=>r.questionId)).size,186);
 for(const [year,day,total] of [[2022,1,30],[2022,2,59],[2023,1,39],[2023,2,58]])assert.equal(review.items.filter((r:any)=>r.year===year&&r.day===day).length,total);
 for(const r of review.items){
  const q=bank.get(r.questionId)!;assert.ok(q,r.questionId);assert.deepEqual(q,canonical.get(q.id));
  assert.equal(q.correctOptionId,r.answer.toLowerCase());assert.equal(q.options.map(o=>o.id).join(''),'abcde');assert.ok(q.statementComplete);
  assert.doesNotMatch(q.prompt,/[\ue000-\uf8ff\ufffd]/);assert.equal(q.topicId,latest.get(q.id)?.topicId??r.bankTopicId);
  const position=manifest.positions.find((p:any)=>p.questionId===q.id);assert.equal(position.number,r.bankNumber);
  assert.equal(questionExamIdentity(q)?.questionNumber,r.bankNumber,'Identidade canônica deve sobreviver à troca de caderno da fonte');
  assert.equal(position.reviewedSource.number,r.sourceNumber);assert.equal(q.examSource?.questionNumber??null,r.publishedSourceNumber);
  assert.deepEqual(q.figures?.map(f=>f.url)??[],r.figures);
  const incidence=corpus.questions.find((p:any)=>p.paperId===r.paperId&&Number(p.number)===r.sourceNumber);
  assert.equal(incidence.confidence,r.confidence);assert.equal(incidence.rationale,r.evidence);assert.equal(incidence.topicId,r.topicId);
  if(q.chapter)assert.ok(questionTopics.find(t=>t.id===q.topicId)?.chapters.includes(q.chapter));
  else assert.equal(r.confidence,'medium','Ausência de capítulo deve continuar explícita');
 }
});

test('caderno azul de 2023 corresponde às mesmas questões do banco amarelo sem duplicação',()=>{
 assert.equal(item(2023,1,1).bankNumber,3);assert.equal(item(2023,1,43).bankNumber,26);
 assert.match(question(2023,1,1).prompt,/Food|cartaz/i);assert.match(question(2023,1,43).prompt,/Rui Barbosa/);
 assert.equal(question(2023,2,142).id,'q_real_enem_2023_mat');
 assert.equal(question(2022,2,136).id,'enem_2022_d2_cd5_q136');
 assert.equal(question(2023,2,109).correctOptionId,'d');
});

test('fórmulas, unidades e assuntos recuperados das páginas não viram fragmentos de extração',()=>{
 assert.equal(question(2023,2,137).options[2].text,'12√2');
 assert.equal(question(2023,2,158).options[0].text,'1/50 e 1/60');
 assert.match(question(2023,2,97).prompt,/0,082 L·atm\/\(mol·K\)/);
 assert.match(question(2023,2,160).prompt,/V\(x\) = x²\/4 − 10x \+ 105/);
 assert.match(question(2022,2,108).prompt,/Mantendo-se a força F paralela/);
 assert.match(question(2022,2,163).prompt,/1\/4|¼/);
 assert.match(question(2022,2,174).prompt,/y = −x²\/6 − 7x\/3 \+ 12, em que/);
 assert.equal(question(2023,2,178).chapter,'Prismas');
 assert.equal(question(2023,2,105).chapter,'Protozoários e Protozooses');
 assert.equal(question(2022,1,15).chapter,'Segunda Geração Modernista: Prosa');
});

test('185 recortes têm transparência gravada no WebP e rastreio para página e fonte',()=>{
 assert.equal(review.media.length,185);
 for(const media of review.media){
  const bytes=readFileSync(`public${media.url}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),media.sha256);
  assert.equal(bytes.toString('ascii',12,16),'VP8L','WebP sem perdas');
  assert.ok(bytes.readUInt32LE(21)&0x10000000,`${media.url}: canal alfa obrigatório`);
  assert.ok(media.alphaCanvas&&media.width>8&&media.height>8);
  assert.match(media.sourceSha256,/^[a-f0-9]{64}$/);
  assert.ok(review.items.some((r:any)=>r.questionId===media.questionId&&r.figures.includes(media.url)));
  assert.ok(manifest.media.some((m:any)=>m.url===media.url&&m.sha256===media.sha256));
 }
 const oersted=review.media.filter((m:any)=>m.questionId===item(2022,2,118).questionId);
 assert.deepEqual([...new Set(oersted.flatMap((m:any)=>m.alternativeLabels))].sort(),['a','b','c','d','e']);
});

test('ressalvas históricas preservam a evidência e a resolução posterior tem precedência',async()=>{
 assert.equal(review.items.filter((r:any)=>r.confidence==='high').length,182);
 const remaining=review.items.filter((r:any)=>r.confidence==='medium').map((r:any)=>`${r.year}/${r.day}/${r.sourceNumber}`);
 assert.deepEqual(remaining,['2022/1/61','2022/1/77','2023/1/12','2023/1/74']);
 assert.equal(question(2022,1,61).chapter,'Estoicismo e Moderação das Paixões');
 const latest=await loadEnemEditorialClassifications(questionTopics);assert.equal(latest.get(question(2022,1,61).id)?.confidence,'high');assert.equal(question(2022,1,77).chapter,undefined);
});
