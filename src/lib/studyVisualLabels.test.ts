import assert from 'node:assert/strict';
import test from 'node:test';
import { prepareStudyVisualLabels } from './studyVisualLabels';
const visual = (question:string, title='Processo') => ({type:'flow',title,caption:'Esquema didático.',question,steps:['Etapa inicial','Etapa final']});
const block = (value:unknown,fence='```') => `${fence}study-visual\n${JSON.stringify(value)}\n${fence}`;
test('numera figuras em ordem, expande perguntas antigas e respostas sem mudar o conteúdo',()=>{
 const text=[block(visual('V1. O que mudou?')),block(visual('V2. O que permaneceu?')),'## Gabarito da recuperação ativa','### Respostas das perguntas visuais','**V1.** Mudou o comércio.','V2. Permaneceu a monarquia.','### Outros exercícios','V1. Versão da prova.'].join('\n\n');
 const result=prepareStudyVisualLabels(text);
 assert.match(result,/"figureNumber":1/);assert.match(result,/"figureNumber":2/);
 assert.match(result,/"question":"O que mudou\?"/);
 assert.match(result,/Respostas das questões de verificação/);
 assert.match(result,/\*\*Resposta da questão de verificação 1\.\*\* Mudou o comércio/);
 assert.match(result,/Resposta da questão de verificação 2\. Permaneceu a monarquia/);
 assert.match(result,/### Outros exercícios\n\nV1\. Versão da prova/);
 assert.equal(prepareStudyVisualLabels(result),result);
});
test('ignora blocos inválidos e títulos já numerados não ganham prefixo duplicado',()=>{
 const result=prepareStudyVisualLabels([block({type:'flow'}),block(visual('Questão de verificação 8: Compare.','Figura 8 — Processo'))].join('\n\n'));
 assert.match(result,/"figureNumber":1/);assert.doesNotMatch(result,/figureNumber":2/);
 assert.match(result,/"title":"Processo"/);assert.match(result,/"question":"Compare\."/);
});
test('mantém provas, fórmulas, código literal e rótulos desconhecidos',()=>{
 const literal='Prova V1. Use $C_1 V1 = C_2 V2$ e `V1.`.\n\n';
 const code='````text\n'+block(visual('V9. Apenas exemplo.'))+'\n````\n\n';
 const text=literal+code+block(visual('V1. Compare.'))+'\n\n### Respostas das perguntas visuais\nV1. Resposta.\nV9. Sem figura correspondente.\n';
 const result=prepareStudyVisualLabels(text);
 assert.ok(result.startsWith(literal+code));assert.match(result,/V9\. Sem figura correspondente/);
 assert.match(result,/Resposta da questão de verificação 1\. Resposta/);
 assert.equal(prepareStudyVisualLabels(literal+code),literal+code);
});
test('respeita til e comprimento da cerca; bloco incompleto continua literal',()=>{
 assert.match(prepareStudyVisualLabels(block(visual('Compare.'),'~~~~')),/figureNumber":1/);
 const incomplete='```study-visual\n'+JSON.stringify(visual('V1. Compare.'));
 assert.equal(prepareStudyVisualLabels(incomplete),incomplete);
});
