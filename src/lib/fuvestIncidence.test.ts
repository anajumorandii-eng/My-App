import assert from 'node:assert/strict';
import test from 'node:test';
import { incidenceRows, medicineQuestion, scopeQuestions, interdisciplinaryPairs, type FuvestCorpus, type FuvestQuestion } from './fuvestIncidence';
const q = (year: number, number: string, changes: Partial<FuvestQuestion> = {}): FuvestQuestion => ({ id: `${year}:${number}`, paperId: `${year}-f1`, year, phase: '1a', number, page: 1, subject: 'Biologia', topicId: 'bio_ecologia', topic: 'Ecologia', subtopics: ['Cadeias alimentares'], skills: ['interpretacao_grafico'], relatedSubjects: [], relatedTopicIds: [], summary: 'Análise de cadeias alimentares', rationale: 'A operação decisiva é relacionar níveis tróficos.', strategy: ['Identifique produtores', 'Siga o fluxo de energia'], trap: 'Inverter o fluxo de energia', confidence: 'high', reviewNote: '', excluded: false, excludedReason: '', subitems: [], ...changes });
const corpus: FuvestCorpus = { reviewedOn: '2026-10-18', reviewType: 'fixture', years: [2022,2023,2024], papers: [], questions: [q(2022,'01'),q(2022,'02',{excluded:true}),q(2022,'03',{topicId:'bio_genetica',topic:'Genética',confidence:'medium'}),q(2023,'01',{relatedSubjects:['Química']}),q(2023,'02',{phase:'2a-dia2',number:'B01'}),q(2023,'03',{phase:'2a-dia2',number:'B04'})] };
const filter = {startYear:2022,endYear:2024,scope:'1a' as const};
test('denominador exclui anulada e não mistura fases; recorrência usa apenas edições observadas',()=>{
 const ecology=incidenceRows(corpus,filter).find(row=>row.topicId==='bio_ecologia')!;
 assert.equal(ecology.count,2);assert.equal(ecology.total,3);assert.equal(ecology.editions,2);assert.equal(ecology.observedEditions,2);
 assert.deepEqual(ecology.annual.map(row=>[row.count,row.total,row.rate]),[[1,2,0.5],[1,1,1],[0,0,null]]);
});
test('filtro de confiança preserva denominador e não infla percentuais',()=>{
 const rows=incidenceRows(corpus,{...filter,highConfidenceOnly:true});assert.equal(rows.length,1);assert.equal(rows[0].total,3);assert.equal(rows[0].rate,2/3);
});
test('Medicina usa as primeiras três de BFGQ, não todas as 36 questões',()=>{
 for(const number of ['B01','F02','G03','Q3'])assert.equal(medicineQuestion({phase:'2a-dia2',number}),true);
 for(const number of ['B04','H01','M03','Q06'])assert.equal(medicineQuestion({phase:'2a-dia2',number}),false);
 assert.equal(scopeQuestions(corpus,{...filter,scope:'medicina'}).length,1);
});
test('subassuntos são presença multirrótulo e conexões não duplicam questão',()=>{
 const multi={...corpus,questions:[q(2022,'01',{subtopics:['Cadeias alimentares','Cadeias alimentares','Ciclo do carbono'],relatedSubjects:['Química','Química']})]};
 assert.deepEqual(incidenceRows(multi,filter,'subtopic').map(row=>row.count),[1,1]);
 assert.equal(interdisciplinaryPairs(multi,filter)[0].count,1);
});

test('corpus real contém 685 registros rastreáveis, exclui duas anuladas e recorta Medicina em 60', async()=>{
 const {loadFuvestCorpus}=await import('./fuvestIncidence');const actual=await loadFuvestCorpus();
 assert.equal(actual.papers.length,15);assert.equal(actual.questions.length,685);assert.equal(new Set(actual.questions.map(q=>q.id)).size,685);
 assert.equal(scopeQuestions(actual,{startYear:2022,endYear:2026,scope:'1a'}).length,448);
 assert.equal(scopeQuestions(actual,{startYear:2022,endYear:2026,scope:'2a-dia1'}).length,55);
 assert.equal(scopeQuestions(actual,{startYear:2022,endYear:2026,scope:'2a-dia2'}).length,180);
 assert.equal(scopeQuestions(actual,{startYear:2022,endYear:2026,scope:'medicina'}).length,60);
 assert.deepEqual(actual.questions.filter(q=>q.excluded).map(q=>`${q.year}:${q.number}`),['2022:54','2026:03']);
 for(const paper of actual.papers){
  assert.match(paper.sha256,/^[a-f0-9]{64}$/);const qs=actual.questions.filter(q=>q.paperId===paper.id);
  assert.equal(qs.length,paper.expectedQuestions);assert.ok(qs.every(q=>Number.isInteger(q.page)&&q.page>0&&q.page<=paper.pages));
 }
 for(const q of actual.questions){assert.ok(q.strategy.length>=2);assert.ok(q.rationale.length>10);assert.ok(q.subtopics.length>0);}
 const english=actual.questions.filter(q=>q.subject==='Inglês');assert.equal(english.length,37);
 assert.ok(english.every(q=>q.subtopics.every(label=>!label.startsWith('Text Comprehension:'))));
 const chemistry2026=actual.questions.find(q=>q.year===2026&&q.phase==='2a-dia2'&&q.number==='Q01')!;
 assert.ok(chemistry2026.answerKeyUrl?.endsWith('quimica.pdf'));
});

test('o guia de estratégias referencia itens válidos e exemplos suficientes',async()=>{
 const strategies=(await import('../data/fuvestResolutionStrategies.json')).default;
 const actual=await (await import('./fuvestIncidence')).loadFuvestCorpus();
 assert.equal(strategies.sections.length,18);
 for(const section of strategies.sections){
  assert.ok(section.examples.length>=2);assert.ok(section.steps.length>=3);assert.ok(section.transfer.length>50);
  for(const example of section.examples)assert.ok(actual.questions.some(question=>question.id===example.questionId&&!question.excluded));
 }
});

test('recorrência não transforma uma única ocorrência de Educação Física em presença de 100% das edições',async()=>{
 const actual=await(await import('./fuvestIncidence')).loadFuvestCorpus();
 const row=incidenceRows(actual,{startYear:2022,endYear:2026,scope:'1a',subject:'Educação Física'})[0];
 assert.equal(row.count,1);assert.equal(row.editions,1);assert.equal(row.observedEditions,5);
 assert.equal(row.annual.filter(year=>year.total===0).length,4);
});

 test('recortes históricos respeitam campus e mudança de carreira em 2025', async()=>{
 const actual=await(await import('./fuvestIncidence')).loadFuvestCorpus();
 const rules=(await import('../data/fuvest2027Rules.json')).default;
 for(const scope of ['medicina','medicina-sp','medicina-bauru'] as const){
  const pool=scopeQuestions(actual,{startYear:2022,endYear:2026,scope});
  assert.equal(pool.length,60);
  for(const year of actual.years)assert.equal(pool.filter(q=>q.year===year).length,12);
 }
 assert.equal(medicineQuestion({phase:'2a-dia2',number:'B04',year:2024},'medicina-sp'),true);
 assert.equal(medicineQuestion({phase:'2a-dia2',number:'G01',year:2024},'medicina-sp'),false);
 assert.equal(medicineQuestion({phase:'2a-dia2',number:'F01',year:2024},'medicina-bauru'),false);
 assert.equal(medicineQuestion({phase:'2a-dia2',number:'F01',year:2025},'medicina-bauru'),true);
 assert.equal(rules.medicine.historicalByCampus.length,15);
 for(const rule of rules.medicine.historicalByCampus){
  const scope=rule.campus==='sao-paulo'?'medicina-sp':rule.campus==='bauru'?'medicina-bauru':'medicina';
  const selected=scopeQuestions(actual,{startYear:rule.year,endYear:rule.year,scope});
  assert.deepEqual(selected.map(q=>q.number).sort(),[...rule.selectedNumbers].sort());
 }
 });
