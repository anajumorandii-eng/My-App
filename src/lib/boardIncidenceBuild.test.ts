import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm,access} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

// Only synthetic items here: a full build must never mistake these for exam evidence.
test('gerador só publica arquivos depois de validar todas as bancas e separa gabarito da redação',async()=>{
 const root=await mkdtemp(join(tmpdir(),'incidence-builder-'));
 const execute=()=>spawnSync(process.execPath,['--import',pathToFileURL(resolve('node_modules/tsx/dist/loader.mjs')).href,resolve('scripts/buildBoardIncidence.ts')],{cwd:root,encoding:'utf8'});
 try{
  await mkdir(join(root,'scripts/data/fuvest-incidence'),{recursive:true});
  await writeFile(join(root,'scripts/data/fuvest-incidence/subtopic-aliases.json'),JSON.stringify({aliases:[]}));
  const boards=['ENEM','UNESP','FAMERP','UNIFESP'];
  for(const board of boards){
   const slug=board.toLowerCase();await mkdir(join(root,`scripts/data/board-incidence/${slug}`),{recursive:true});
   for(const year of board==='ENEM'?[2021,2022,2023,2024,2025]:[2022,2023,2024,2025,2026]){
    const item={number:'01',page:1,subject:'Biologia',topicId:null,topic:'Categoria sintética',subtopics:['Subassunto sintético'],skills:['comparar'],relatedSubjects:[],relatedTopicIds:[],summary:'Item sintético',rationale:'Dado sintético',strategy:['Leia','Compare'],trap:'Confundir',confidence:'high',excluded:false};
    const paper={id:`${slug}-${year}-geral`,group:'geral',phase:'Conhecimentos gerais',phaseGroup:'1a',format:'multiple-choice',version:'A',sourceUrl:`https://example.org/${slug}-${year}-geral.pdf`,sha256:createHash('sha256').update(`${slug}-${year}-geral`).digest('hex'),pages:1,expectedQuestions:1,answerKeyUrl:'https://example.org/gabarito.pdf',answerKeySha256:'b'.repeat(64),questions:[item]};
    const essay={...paper,sourceUrl:`https://example.org/${slug}-${year}-redacao.pdf`,id:`${slug}-${year}-redacao`,group:'redacao',phase:'Redação',format:'open',sha256:createHash('sha256').update(`${slug}-${year}-redacao`).digest('hex'),questions:[{...item,number:'R',subject:'Redação',topic:'Escrita sintética'}]};
    await writeFile(join(root,`scripts/data/board-incidence/${slug}/${year}.json`),JSON.stringify({board,year,coverageNote:'Fixture sintética',papers:[paper,essay]}));
   }
  }
  const last=join(root,'scripts/data/board-incidence/unifesp/2026.json');
  const valid=await readFile(last,'utf8'),invalid=JSON.parse(valid);invalid.papers[0].questions=[];
  await writeFile(last,JSON.stringify(invalid));
  const failed=execute();assert.notEqual(failed.status,0);assert.match(failed.stderr,/Caderno incompleto/);
  await assert.rejects(access(join(root,'public/analises/incidencia/enem/corpus.json')));
  await writeFile(last,valid);
  const passed=execute();assert.equal(passed.status,0,passed.stderr);
  const result=JSON.parse(await readFile(join(root,'public/analises/incidencia/enem/corpus.json'),'utf8'));
  assert.equal(result.questions.length,4);
  assert.equal(result.questions.find((q:{number:string})=>q.number==='R').answerKeyUrl,null);
  assert.equal(result.questions.find((q:{number:string})=>q.number==='01').answerKeyUrl,'https://example.org/gabarito.pdf');
  const csv=await readFile(join(root,'public/analises/incidencia/enem/incidencia-assuntos.csv'),'utf8');
  assert.match(csv,/"2";"2";"100.0000"/);
  const snapshot=await readFile(join(root,'public/analises/incidencia/enem/corpus.json'),'utf8');
  const custom=JSON.parse(valid);custom.papers[0].questions[0].answerKeyUrl='https://example.org/outro-gabarito.pdf';
  await writeFile(last,JSON.stringify(custom));
  const badKey=execute();assert.notEqual(badKey.status,0);assert.match(badKey.stderr,/Gabarito.*questão/);
  assert.equal(await readFile(join(root,'public/analises/incidencia/enem/corpus.json'),'utf8'),snapshot);
 }finally{await rm(root,{recursive:true,force:true});}
});
