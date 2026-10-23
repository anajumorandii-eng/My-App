import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPrintCoverSpec, selectCoverTheme } from './printCoverSpec';

test('contrato preserva os metadados e a triade e vinhetas de sangue e imunologia', () => {
  const context = { subject: 'Biologia', topic: 'Sangue e imunologia', subtopic: 'Imunidade adaptativa', board: 'FUVEST 2027', purpose: 'Explicar o raciocínio de prova' };
  const spec = buildPrintCoverSpec(context, 'Material');
  assert.equal(spec.subject_title, context.subject);
  assert.equal(spec.topic_subtitle, context.topic);
  assert.equal(spec.exam_board, context.board);
  assert.equal(spec.footer_tagline, context.purpose);
  assert.deepEqual(spec.triad_keywords, ['Circulação', 'Defesa', 'Memória']);
  assert.deepEqual(Object.values(spec.visual_spec.vignettes).map(v => v.label), ['Hemácias', 'Defesa', 'Anticorpos', 'Circulação']);
  assert.equal(selectCoverTheme(context), 'blood');
});
test('o contrato não inventa banca, preserva o nome de uma obra e não compartilha arrays mutáveis', () => {
  const spec = buildPrintCoverSpec({ work: 'Obra <exemplo>' }, 'Estudo');
  assert.equal(spec.exam_board, '');
  assert.equal(spec.topic_subtitle, 'Obra <exemplo>');
  assert.equal(spec.subject_title, 'Literatura');
  spec.triad_keywords[0] = 'Alterado';
  assert.equal(buildPrintCoverSpec({ work: 'Outra obra' }, 'Estudo').triad_keywords[0], 'Forma');
});
test('sem metadados usa o título recebido e uma capa neutra de leitura', () => {
  const spec = buildPrintCoverSpec({}, 'Meu caderno');
  assert.equal(spec.topic_subtitle, 'Meu caderno');
  assert.equal(spec.subject_title, 'Material de estudo');
  assert.equal(spec.exam_board, '');
  assert.equal(selectCoverTheme({}), 'literature');
});
test('revisão tem vocabulário visual e palavras-chave próprios do tipo de material',()=>{
 const context={subject:'Biologia',topic:'Genética'};
 const study=buildPrintCoverSpec({...context,purpose:'Aprofundamento'},'Genética');
 const review=buildPrintCoverSpec({...context,purpose:'Revisão estratégica'},'Genética');
 assert.notEqual(review.visual_spec.central_hero,study.visual_spec.central_hero);
 assert.deepEqual(review.triad_keywords,['Recordar','Conectar','Aplicar']);
});
