import assert from 'node:assert/strict';
import test from 'node:test';
import chapters from '../data/deepSummaryContent.json';
import {interactiveSummaries} from '../data/interactiveSummaries';
import {migrateSummaryProgressMap} from './summaryStudy';
import type {SummaryProgressMap} from '../types/summary';
const grammar=chapters.filter(c=>c.subject==='Gramática');
for(const source of grammar)test(`Gramática aprofundada: ${source.topic} mantém cinco etapas e recuperação alinhada`,()=>{
 const summary=interactiveSummaries.find(c=>c.subject===source.subject&&c.topic===source.topic)!;
 assert.ok(summary);assert.equal(source.rev,2);assert.equal(source.sections.length,5);
 for(const section of source.sections)assert.ok(section.content.length>=900&&section.content.length<=1100,`${section.title}: ${section.content.length}`);
 const traps=source.sections[3].content;for(let i=1;i<=5;i++)assert.match(traps,new RegExp(`${i}\\)`));
 assert.match(source.sections[4].content,/Problema 1:[\s\S]*Problema 2:/);
 assert.ok(summary.sections.every(s=>s.id.startsWith(`${summary.id}-editorial-v2-`)));
 assert.equal(summary.retrieval.length,1);assert.equal(summary.retrieval[0].sectionId,summary.sections[4].id);
 assert.ok(summary.retrieval[0].expectedElements.length>=3);
});
test('revisão de Gramática conserva respostas anteriores e progresso de outro capítulo',()=>{
 const revised=interactiveSummaries.find(s=>s.subject==='Gramática')!;
 const preserved=interactiveSummaries.find(s=>s.subject==='Física')!;
 const oldSection=`${revised.id}-editorial-v1-1`;
 const saved:SummaryProgressMap={
 [revised.id]:{readSectionIds:[oldSection],status:'em-revisao',important:true,answers:[{questionId:`${revised.id}-editorial-recall-v1`,answer:'O contexto orienta a interpretação.',matchedElements:['contexto'],firstMissingElement:'estrutura',date:'2026-10-05T03:00:00Z'}]},
 [preserved.id]:{readSectionIds:preserved.sections.map(s=>s.id),status:'dominado',important:false,answers:[],reviews:{}}
 };
 const migrated=migrateSummaryProgressMap(saved,[revised,preserved]);
 assert.deepEqual(migrated[preserved.id],saved[preserved.id]);for(const [key,value] of Object.entries(saved[revised.id].answers[0]))assert.deepEqual(migrated[revised.id].answers[0][key as keyof typeof migrated[typeof revised.id]["answers"][number]],value);
 assert.deepEqual(migrated[revised.id].readSectionIds,[oldSection]);assert.ok(!revised.sections.some(s=>s.id===oldSection));
});
test('ambiguidade de predicativo usa dois referentes com concordância compatível',()=>{
 const source=grammar.find(c=>c.topic==='Ambiguidade: Duplicidade no Léxico e na Sintaxe')!;
 assert.match(source.sections[2].content,/A supervisora encontrou a técnica preocupada/);
 assert.doesNotMatch(source.sections[2].content,/O supervisor encontrou a técnica preocupada/);
});
test('exemplo de referência não confunde reflexividade com ambiguidade entre duas pessoas',()=>{
 const source=grammar.find(c=>c.topic==='Pronomes')!;
 assert.match(source.sections[0].content,/Nina disse a Clara que ela receberia o convite/);
 assert.doesNotMatch(source.sections[0].content,/Nina encontrou Clara e entregou a ela/);
});
