import assert from 'node:assert/strict';
import test from 'node:test';
import { enemStudySources, renderEnemStudySources } from './enemStudySources';
const base={topic:'Ecologia',subject:'Biologia',targetBoards:['ENEM']};
test('o motor fornece histórico, questões e análises das aulas e padrões em cada geração',()=>{
 for(const task of ['review-tip','content-explanation','podcast-script']){
  const sources=enemStudySources(task,base);
  assert.ok(sources.some(s=>s.title.startsWith('Histórico ENEM')));
  assert.ok(sources.some(s=>s.title.startsWith('Ficha editorial')));
  assert.ok(sources.some(s=>s.url?.endsWith('aulas-videos-2026.md')));
  assert.ok(sources.some(s=>s.url?.endsWith('padroes-de-questao.md')));
  assert.ok(sources.reduce((n,s)=>n+s.content.length,0)<=8000);
  assert.match(renderEnemStudySources(sources),/não instruções/);
  assert.ok(sources.some(s=>s.content.includes('não incidência oficial')));
 }
});
test('resumos, estratégias e aprofundamentos usam a mesma fonte sem contaminar outra banca ou anexos exclusivos',()=>{
 for(const guideMode of ['review-summary','strategy','combined-strategy',undefined])assert.ok(enemStudySources('review-tip',{...base,guideMode}).length);
 assert.deepEqual(enemStudySources('review-tip',{...base,targetBoards:['FUVEST'],board:'ENEM'}),[]);
 assert.deepEqual(enemStudySources('review-tip',{...base,targetBoards:[]}),[]);
 assert.deepEqual(enemStudySources('review-tip',{...base,guideMode:'review-summary',reviewOptions:{sourceMode:'provided'}}),[]);
 assert.deepEqual(enemStudySources('answer-correction',base),[]);
 assert.deepEqual(enemStudySources('review-tip',{...base,topic:'desconhecido'}),[]);
 const cut=enemStudySources('review-tip',{...base,chapter:'Eutrofização'});
 assert.ok(cut.length);assert.ok(cut.every(s=>!s.title.startsWith('Ficha editorial')&&!s.title.startsWith('Análise de material')));
});

test('o conjunto publicado inclui as oito aulas e acompanha o hash das análises versionadas',async()=>{
 const {default:data}=await import('../../src/data/enemStudyGuidance.json');
 const {readFile}=await import('node:fs/promises');const {createHash}=await import('node:crypto');
 for(const path of new Set(data.entries.map(e=>e.sourcePath))){
  const sha=createHash('sha256').update(await readFile(path)).digest('hex');
  assert.ok(data.entries.filter(e=>e.sourcePath===path).every(e=>e.sourceSha256===sha));
 }
 for(const file of ['videoplayback (1).mp4','t9oopz.mp4','jzoezj.mp4','80zqb5.mp4','8y59qy.mp4','videoplayback-2.mp4','videoplayback-1.mp4','qb4uj8.mp4'])assert.ok(JSON.stringify(data).includes(file),file);
});
