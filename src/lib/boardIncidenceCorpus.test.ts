import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {isCompleteBoardCorpus,boardIncidenceRows,type BoardCorpus,type ResearchBoard} from './boardIncidence';
type PublishedCorpus=BoardCorpus&{sourceDocuments:{sourceUrl:string;sha256:string;localPath?:string}[]};
const load=async(board:ResearchBoard)=>JSON.parse(await readFile(`public/analises/incidencia/${board.toLowerCase()}/corpus.json`,'utf8')) as PublishedCorpus;

test('quatro bancas têm dezesseis edições e 34 cadernos completos, com formatos pandêmicos separados',async()=>{
 let papers=0,items=0;
 for(const board of ['ENEM','UNESP','FAMERP','UNIFESP'] as const){
  const corpus=await load(board);assert.equal(isCompleteBoardCorpus(corpus,board),true);
  assert.equal(new Set(corpus.sourceDocuments.map(source=>source.sourceUrl)).size,corpus.sourceDocuments.length);
  for(const source of corpus.sourceDocuments){assert.match(source.sourceUrl,/^https:\/\//);assert.match(source.sha256,/^[a-f0-9]{64}$/);assert.equal(source.localPath,undefined);}
  assert.deepEqual(corpus.years,board==='ENEM'?[2024,2025]:board==='UNESP'?[2022,2023,2024,2025]:[2022,2023,2024,2025,2026]);
  const expected=board==='ENEM'?362:board==='UNESP'?556:board==='FAMERP'?505:230;
  assert.equal(corpus.questions.length,expected);items+=expected;papers+=corpus.papers.length;
  for(const group of new Set(corpus.papers.map(p=>p.group))){
   const own=corpus.papers.filter(p=>p.group===group);
   assert.equal(new Set(own.map(p=>p.format)).size,1);
   const rows=boardIncidenceRows(corpus,{startYear:2021,endYear:2026,group});
   assert.ok(rows.every(row=>row.observedEditions===new Set(own.map(p=>p.year)).size));
  }
 }
 assert.equal(papers,34);assert.equal(items,1653);
});

test('UNIFESP2024 conta somente a reaplicação válida e não atribui chave objetiva à redação',async()=>{
 const corpus=await load('UNIFESP');
 const specifics=corpus.papers.filter(p=>p.year===2024&&p.phaseGroup==='2a');
 assert.equal(specifics.length,1);assert.match(specifics[0].sourceUrl,/NTY5OTc3Nw/);
 assert.equal(corpus.questions.filter(q=>q.paperId===specifics[0].id).length,20);
 for(const question of corpus.questions.filter(q=>q.subject==='Redação'))assert.equal(question.answerKeyUrl,null);
});

test('ENEM2025 preserva as três anulações e analisa Inglês sem duplicar a opção Espanhol',async()=>{
 const corpus=await load('ENEM');
 assert.deepEqual(corpus.questions.filter(q=>q.year===2025&&q.excluded).map(q=>q.number).sort(),['115','121','178']);
 for(const year of corpus.years){
  const own=corpus.questions.filter(q=>q.year===year);
  assert.equal(own.filter(q=>q.subject==='Inglês').length,5);
  assert.equal(own.filter(q=>q.subject==='Redação').length,1);
  assert.equal(new Set(own.map(q=>q.id)).size,181);
 }
});

test('anos adiados e rascunhos não entram nos denominadores ou na recorrência',async()=>{
 const enem=await load('ENEM');
 assert.deepEqual(enem.plannedYears,[2021,2022,2023,2024,2025]);
 const rows=boardIncidenceRows(enem,{startYear:2021,endYear:2025,group:'natureza-matematica'});
 assert.ok(rows.length>0);
 for(const row of rows){
  assert.equal(row.observedEditions,2);
  for(const annual of row.annual.filter(value=>value.year<=2023)){
   assert.equal(annual.covered,false);assert.equal(annual.rate,null);assert.equal(annual.total,0);
  }
 }
 assert.deepEqual(enem.questions.filter(q=>q.year===2024&&q.excluded).map(q=>q.number),['102']);
 const unesp=await load('UNESP');
 assert.equal(unesp.questions.some(q=>q.year===2026),false);
 assert.ok(unesp.plannedYears?.includes(2026));
 assert.deepEqual(boardIncidenceRows(unesp,{startYear:2026,endYear:2026,group:'primeira-fase-objetiva'}),[]);
});
