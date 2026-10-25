import test from 'node:test';import assert from 'node:assert/strict';
import { normalizeTopicCuts, subtopicsFor, describeStudySelection } from './topicCuts';
import { normalizeReviewOptions } from './strategicReview';
test('recortes independentes, personalizados e sem duplicação sobrevivem à configuração',()=>{
 const topicCuts=normalizeTopicCuts({geo:['Área do círculo',' área do círculo ','Ângulos na circunferência'],fun:['Minha dificuldade']});
 assert.deepEqual(topicCuts,{geo:['Área do círculo','Ângulos na circunferência'],fun:['Minha dificuldade']});
 assert.deepEqual(normalizeReviewOptions({topicCuts}).topicCuts,topicCuts);
 assert.equal(describeStudySelection({topicId:'geo',topicName:'Geometria',chapter:''}),'Geometria: tópico completo');
 assert.match(describeStudySelection({topicId:'geo',topicName:'Geometria',chapter:'',cuts:topicCuts.geo}),/Área do círculo/);
});
test('geometria distingue ângulos, comprimentos, círculo, setores e segmentos',()=>{
 const names=subtopicsFor({id:'mat_geometria_plana',name:'Geometria Plana',chapters:[]});
 for(const name of ['Ângulos na circunferência','Comprimento da circunferência e de arcos','Área do círculo','Área de setores e segmentos circulares'])assert.ok(names.includes(name));
});

test('a identidade do material diferencia recortes e não depende da ordem de marcação',async()=>{
 const {reviewSummaryKey}=await import('./reviewSummaries');
 const a=normalizeReviewOptions({topicCuts:{geo:['Ângulos','Área']}}),b=normalizeReviewOptions({topicCuts:{geo:['Área','Ângulos']}});
 assert.equal(reviewSummaryKey('Matemática','geo','','',a),reviewSummaryKey('Matemática','geo','','',b));
 assert.notEqual(reviewSummaryKey('Matemática','geo','','',a),reviewSummaryKey('Matemática','geo','','',normalizeReviewOptions()));
});
