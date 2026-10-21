import test from 'node:test';
import assert from 'node:assert/strict';
import {boardIncidenceRows,boardPool,boardInterdisciplinaryPairs,loadBoardCorpus,type BoardCorpus,type BoardPaper,type BoardQuestion} from './boardIncidence';
const paper=(id:string,year:number,group='objetiva'):BoardPaper=>({id,year,board:'UNESP',group,phase:group,phaseGroup:'1a',format:'multiple-choice',version:'V',sourceUrl:'https://example.org/prova.pdf',answerKeyUrl:null,answerKeySha256:null,sha256:'a'.repeat(64),pages:2,expectedQuestions:2,classifiedQuestions:2});
const question=(paperId:string,number:string,year:number,changes:Partial<BoardQuestion>={}):BoardQuestion=>({id:`${paperId}:${number}`,paperId,number,year,phase:'objetiva',board:'UNESP',page:1,subject:'Biologia',topicId:'bio_ecologia',topic:'Ecologia',subtopics:['Fluxo de energia'],skills:['inferencia_causal'],relatedSubjects:[],relatedTopicIds:[],summary:'Compara energia entre níveis tróficos',rationale:'O fluxo energético decide a comparação',strategy:['Identifique os níveis','Compare perdas de energia'],trap:'Inverter fluxo',confidence:'high',reviewNote:'',excluded:false,excludedReason:'',subitems:[],...changes});
const fixture:BoardCorpus={board:'UNESP',reviewedOn:'2026-10-21',reviewType:'fixture',coverageNote:'fixture',years:[2022,2023,2024],papers:[paper('a',2022),paper('b',2023),paper('c',2024,'discursiva')],questions:[question('a','01',2022),question('a','02',2022,{excluded:true,excludedReason:'Anulada'}),question('b','01',2023,{topicId:'bio_genetica',topic:'Genética',confidence:'medium',reviewNote:'Fronteira de tópico'}),question('b','02',2023,{subject:'Química',topicId:'qui_equilibrio',topic:'Equilíbrio'}),question('c','01',2024)]};
const filter={startYear:2022,endYear:2024,group:'objetiva'};
test('banca não mistura formato, matéria ou anulada no denominador',()=>{
 const rows=boardIncidenceRows(fixture,filter);
 const ecology=rows.find(row=>row.topicId==='bio_ecologia')!;
 assert.equal(ecology.count,1);assert.equal(ecology.total,2);assert.equal(ecology.rate,0.5);
 assert.equal(boardPool(fixture,filter).length,3);assert.equal(boardPool(fixture,filter,true).length,4);
});
test('recorrência usa edições cobertas e diferencia formato não classificado',()=>{
 const row=boardIncidenceRows(fixture,filter)[0];
 assert.equal(row.observedEditions,2);assert.equal(row.editions,1);
 assert.equal(row.annual[2].covered,false);assert.equal(row.annual[2].rate,null);
});
test('confiança filtra hits sem reduzir denominador',()=>{
 const rows=boardIncidenceRows(fixture,{...filter,subject:'Biologia',highConfidenceOnly:true});
 assert.equal(rows.length,1);assert.equal(rows[0].total,2);assert.equal(rows[0].rate,0.5);
});
test('subassuntos e conhecimentos associados não inflam contagens principais',()=>{
 const multi={...fixture,questions:[question('a','01',2022,{subtopics:['Fluxo de energia','Fluxo de energia','Ciclo do carbono'],relatedSubjects:['Química','Química']})]};
 assert.deepEqual(boardIncidenceRows(multi,filter,'subtopic').map(row=>row.count),[1,1]);
 assert.equal(boardInterdisciplinaryPairs(multi,filter)[0].count,1);
});
test('loader rejeita resposta sem corpus válido e não inventa denominadores',async()=>{
 const previous=globalThis.fetch;
 try{
  globalThis.fetch=async()=>({ok:true,json:async()=>({...fixture,board:'ENEM'})}) as Response;
  await assert.rejects(loadBoardCorpus('UNESP'),/incompleto/);
  globalThis.fetch=async()=>({ok:false}) as Response;
  await assert.rejects(loadBoardCorpus('UNESP'),/indisponível/);
 }finally{globalThis.fetch=previous;}
});
test('loader aceita caderno completo e recusa metadados sem os itens correspondentes',async()=>{
 const previous=globalThis.fetch;
 const complete={...fixture,years:[2022],papers:[fixture.papers[0]],questions:fixture.questions.filter(q=>q.paperId==='a')};
 try{
  globalThis.fetch=async()=>({ok:true,json:async()=>complete}) as Response;
  assert.equal((await loadBoardCorpus('UNESP')).questions.length,2);
  for(const invalid of [
   {...complete,papers:[...complete.papers,{...complete.papers[0],id:'b',phase:'discursiva'}],questions:[...complete.questions,...complete.questions.map(q=>({...q,id:'b:'+q.number,paperId:'b',phase:'discursiva'}))]},
   {...complete,questions:complete.questions.slice(0,1)},
   {...complete,questions:[complete.questions[0],complete.questions[0]]},
   {...complete,questions:complete.questions.map(q=>({...q,strategy:undefined}))},
   {...complete,questions:complete.questions.map(q=>({...q,paperId:'inexistente'}))},
   {...complete,papers:complete.papers.map(p=>({...p,phaseGroup:undefined}))},
  ]){
   globalThis.fetch=async()=>({ok:true,json:async()=>invalid}) as Response;
   await assert.rejects(loadBoardCorpus('UNESP'),/incompleto/);
  }
 }finally{globalThis.fetch=previous;}
});
