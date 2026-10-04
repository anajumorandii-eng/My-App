import assert from 'node:assert/strict';
import test from 'node:test';
import chapters from '../data/deepSummaryContent.json';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { migrateSummaryProgressMap } from './summaryStudy';
import type { SummaryProgressMap } from '../types/summary';

// IDs da entrega permanecem verificáveis depois de sua saída da fila.
const deliveredIds = [
  'summary-lingua-inglesa-text-comprehension-taxonomy-and-terminology',
  'summary-lingua-inglesa-text-comprehension-songs-and-poems',
  'summary-lingua-inglesa-text-comprehension-calories-and-energy',
  'summary-lingua-inglesa-text-comprehension-earthquakes',
  'summary-lingua-inglesa-text-comprehension-hurricanes',
  'summary-lingua-inglesa-text-comprehension-ecology-greenhouse-gases',
  'summary-lingua-inglesa-text-comprehension-pollution',
  'summary-lingua-inglesa-text-comprehension-the-human-brain',
  'summary-lingua-inglesa-text-comprehension-global-warming',
  'summary-lingua-inglesa-text-comprehension-novels-short-stories',
  'summary-lingua-inglesa-text-comprehension-bacteria',
  'summary-lingua-inglesa-text-comprehension-viruses',
  'summary-lingua-inglesa-text-comprehension-discrimination-against-women',
  'summary-lingua-inglesa-text-comprehension-women-empowerment',
  'summary-lingua-inglesa-text-comprehension-digital-technology',
  'summary-lingua-inglesa-text-comprehension-health-probiotics',
  'summary-lingua-inglesa-text-comprehension-stem-cells',
  'summary-entendimento-de-texto-fatores-de-textualidade',
  'summary-entendimento-de-texto-os-dois-niveis-da-leitura',
  'summary-entendimento-de-texto-intertextualidade-e-interdiscursividade',
  'summary-entendimento-de-texto-generos-textuais',
  'summary-entendimento-de-texto-generos-narrativos-e-niveis-de-compreensao',
  'summary-entendimento-de-texto-generos-nao-verbais-fundamentos-de-leitura',
  'summary-entendimento-de-texto-funcoes-da-linguagem',
  'summary-entendimento-de-texto-funcao-poetica-e-linguagem-literaria',
  'summary-entendimento-de-texto-figuras-de-linguagem',
  'summary-entendimento-de-texto-modelos-de-leitura-e-distorcoes-interpretativas',
  'summary-entendimento-de-texto-leitura-de-textos-comicos',
  'summary-entendimento-de-texto-tecnologias-digitais-da-informacao-e-comunicacao-tdic-impactos-sociais',
];

for (const id of deliveredIds) test(`aprofundamento e recuperação de ${id}`, () => {
  const summary = interactiveSummaries.find(item => item.id === id)!;
  assert.ok(summary, 'ID publicado preservado');
  const source = chapters.find(item => item.subject === summary.subject && item.topic === summary.topic)!;
  assert.ok((source.rev ?? 1) >= 2, 'capítulo precisa da revisão editorial aprofundada');
  assert.equal(summary.sections.length, 5);
  for (const section of summary.sections) {
    assert.ok(section.content.length >= 800, `${section.title}: mínimo editorial`);
    assert.ok(section.stage && section.depth);
    assert.match(section.id, new RegExp(`${id}-editorial-v${source.rev}-[1-5]$`));
  }
  const question = summary.retrieval[0];
  assert.ok(question.prompt.length > 20);
  assert.ok(question.expectedElements.length >= 2);
  assert.equal(question.sectionId, summary.sections[4].id);
  assert.ok(question.expectedElements.every(element => element.label && element.keywords.length));
});

test('nova revisão de leitura conserva tentativas anteriores e progresso de outro capítulo', () => {
  const summary = interactiveSummaries.find(item => item.id === deliveredIds[0])!;
  const control = interactiveSummaries.find(item => item.id === 'fis-termologia-calor')!;
  const oldSection = `${summary.id}-editorial-v1-1`;
  const oldQuestion = `${summary.id}-editorial-recall-v1`;
  const saved: SummaryProgressMap = {
    [summary.id]: { readSectionIds: [oldSection], status: 'em-revisao', important: true, answers: [{
      questionId: oldQuestion, answer: 'Resposta da revisão anterior.', matchedElements: ['pista'],
      firstMissingElement: 'contexto', date: '2026-10-03T12:00:00Z',
    }] },
    [control.id]: { readSectionIds: control.sections.map(section => section.id), status: 'dominado', important: false, answers: [], reviews: {} },
  };
  const migrated = migrateSummaryProgressMap(saved, [summary, control]);
  assert.deepEqual(migrated[control.id], saved[control.id]);
  assert.deepEqual(migrated[summary.id].readSectionIds, [oldSection]);
  assert.equal(migrated[summary.id].answers[0].questionId, oldQuestion);
  assert.equal(migrated[summary.id].answers[0].answer, 'Resposta da revisão anterior.');
  assert.deepEqual(migrated[summary.id].answers[0].matchedElements, ['pista']);
  assert.ok(!summary.sections.some(section => section.id === oldSection), 'somente a revisão nova pede releitura');
  assert.notEqual(summary.retrieval[0].id, oldQuestion);
});
