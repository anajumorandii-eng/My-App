import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesReviewScope, normalizeReviewOptions, splitReviewAnswers, reviewScopes } from './strategicReview';
import { reviewSummaryKey, selectReviewSummaries } from './reviewSummaries';
import { reviewErrorHistory } from './reviewPersonalization';
test('etapas são específicas e filtram fontes de fase desconhecida ou incompatível', () => {
  const selected = normalizeReviewOptions({boards:['UNICAMP'],scopes:{UNICAMP:'second'}});
  assert.equal(matchesReviewScope('UNICAMP','2ª fase',selected),true);
  assert.equal(matchesReviewScope('UNICAMP','1ª fase',selected),false);
  assert.equal(matchesReviewScope('UNICAMP',undefined,selected),false);
  assert.equal(matchesReviewScope('FUVEST','2ª fase',selected),false);
  assert.deepEqual(reviewScopes('ENEM'),['all']);
  assert.deepEqual(reviewScopes('FAMERP'),['all','objective','discursive']);
  assert.deepEqual(reviewScopes('UNIFESP'),['all','enem','complementary']);
  assert.equal(matchesReviewScope('FAMERP','Conhecimentos Gerais',normalizeReviewOptions({boards:['FAMERP'],scopes:{FAMERP:'objective'}})),true);
  assert.equal(matchesReviewScope('UNESP','2ª fase · prova objetiva e redação',normalizeReviewOptions({boards:['UNESP'],scopes:{UNESP:'second'}})),false);
});
test('chaves distinguem configurações/material e normalizam ordem, com tamanho aceito pelo Firestore', () => {
  const key = (options = normalizeReviewOptions()) => reviewSummaryKey('Biologia','bio_ecologia','','',options);
  assert.equal(key(normalizeReviewOptions({boards:['COMVEST','ENEM']})),key(normalizeReviewOptions({boards:['ENEM','UNICAMP']})));
  assert.notEqual(key(),key(normalizeReviewOptions({depth:'deep'})));
  assert.notEqual(key(),key(normalizeReviewOptions({sourceMode:'provided',sourceText:'diferente'})));
  assert.ok(encodeURIComponent(key(normalizeReviewOptions({sourceMode:'provided',sourceText:'ç'.repeat(12000),sourceUrl:'https://a.com/'+'a'.repeat(1400)}))).length < 1500);
});
test('gabarito fica separado inclusive na resposta parcial e em documentos legados', () => {
  const text='## Recuperação ativa\n1. Explique.\n## Revisão de última hora\nLembre.\n## Gabarito da recuperação ativa\n1. Resposta secreta.';
  assert.doesNotMatch(splitReviewAnswers(text).body,/secreta/); assert.match(splitReviewAnswers(text).answers,/secreta/);
  assert.equal(splitReviewAnswers(text.split('1. Resposta')[0]).answers,'');
  assert.equal(splitReviewAnswers('## 6. Critérios para conferir\nAntiga resposta').answers,'Antiga resposta');
});
test('personalização usa somente erros reais do tópico, com confiança e relato preservados',()=>{
  assert.equal(reviewErrorHistory([],'a'),'');
  const history=reviewErrorHistory([{id:'1',topicId:'a',questionId:'q',date:'2026-10-22',type:'unknown',notes:'Não entendi a escala',confidence:'baixa'},{id:'2',topicId:'b',questionId:'q2',date:'2026-10-23',type:'conceptual',notes:'Outro assunto'}],'a');
  assert.match(history,/Não entendi a escala/);assert.match(history,/baixa/);assert.doesNotMatch(history,/Outro assunto/);
});
test('filtro da biblioteca encontra banca integrante de revisão múltipla',()=>{
  const guide={kind:'review-summary' as const,key:'x',subject:'Biologia',topicId:'a',topicName:'A',chapter:'',board:'ENEM / UNICAMP',targetBoards:['ENEM','UNICAMP'],text:'texto',savedAt:'2026-10-23'};
  assert.equal(selectReviewSummaries({x:guide},'','COMVEST').length,1);
  assert.equal(selectReviewSummaries({x:guide},'','FUVEST').length,0);
});
test('componente ENEM da seleção mista usa provas ENEM sem inventar fase própria',()=>{
  const mixed=normalizeReviewOptions({boards:['UNIFESP'],scopes:{UNIFESP:'enem'}});
  assert.equal(matchesReviewScope('ENEM','Ciências da Natureza e Matemática',mixed),true);
  assert.equal(matchesReviewScope('UNIFESP','Conhecimentos Específicos',mixed),false);
});

test('trocar a origem não preserva data ou texto ocultos de outro material',()=>{
  const input=normalizeReviewOptions({sourceMode:'provided',sourceTitle:'Notícia',sourceDate:'2025-01-01',sourceText:'Fonte antiga'});
  const catalog=normalizeReviewOptions({...input,sourceMode:'catalog'});
  assert.equal(catalog.sourceDate,'');assert.equal(catalog.sourceText,'');assert.equal(catalog.sourceTitle,'');
});
test('preferência de figuras preserva compatibilidade e distingue a revisão somente texto',()=>{
 const auto=normalizeReviewOptions({visualMode:'auto'});
 const legacy=normalizeReviewOptions();
 assert.deepEqual(auto,legacy);
 const text=normalizeReviewOptions({visualMode:'text'});
 assert.equal(text.visualMode,'text');
 assert.notEqual(reviewSummaryKey('Química','organic','','',text),reviewSummaryKey('Química','organic','','',auto));
});
