import assert from 'node:assert/strict';
import test from 'node:test';
import chapters from '../data/deepSummaryContent.json';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { migrateSummaryProgressMap } from './summaryStudy';
import type { SummaryProgressMap } from '../types/summary';

const cases = [
  ['O Contexto Histórico do Surgimento da Sociologia', 'summary-sociologia-o-contexto-historico-do-surgimento-da-sociologia', /greve/i, /não são opiniões intercambiáveis/i],
  ['Sociologia e Senso Comum', 'summary-sociologia-sociologia-e-senso-comum', /atraso escolar/i, /métodos qualitativos também exigem rigor/i],
  ['A Luta de Classes na Análise Sociológica', 'summary-sociologia-a-luta-de-classes-na-analise-sociologica', /entrevista/i, /capital cultural é talento natural[\s\S]*adquiridos em condições sociais desiguais/i],
  ['Cultura e Etnocentrismo', 'summary-sociologia-cultura-e-etnocentrismo', /celebração/i, /compreender uma prática exige aprová-la[\s\S]*operações distintas/i],
  ['Multiculturalismo e Relativismo Cultural', 'summary-sociologia-multiculturalismo-e-relativismo-cultural', /11\.645\/2008/, /temática indígena/i],
  ['Desigualdade Racial no Brasil', 'summary-sociologia-desigualdade-racial-no-brasil', /redes profissionais/i, /não veio acompanhado de uma política nacional ampla/i],
  ['Divisão Social do Trabalho', 'summary-sociologia-divisao-social-do-trabalho', /montagem de bicicletas/i, /não apenas avaliações opostas/i],
  ['Transformações no Mundo do Trabalho', 'summary-sociologia-transformacoes-no-mundo-do-trabalho', /automatiza caixas/i, /não garante que sejam suficientes/i],
] as const;

for (const [topic, id, application, qualification] of cases) test(`Sociologia H1: ${topic} explica aplicação e limite do conceito`, () => {
  const source = chapters.find(item => item.subject === 'Sociologia' && item.topic === topic)!;
  const summary = interactiveSummaries.find(item => item.id === id)!;
  assert.ok(source && summary, 'identidade do capítulo publicada');
  const text = source.sections.map(section => section.content).join('\n');
  assert.match(text, application, 'exemplo situa a operação analítica');
  assert.match(text, qualification, 'limite impede uma generalização equivocada');
  assert.equal(source.rev, 2);
  assert.equal(source.sections.length, 5);
  assert.ok(source.sections.every(section => section.content.length >= 900 && section.content.length <= 1100));
  const traps = source.sections[3].content;
  for (let i = 1; i <= 6; i++) assert.ok(traps.includes(`${i})`), `armadilha ${i} com correção`);
  assert.equal((traps.match(/Correção:/g) ?? []).length, 6);
  assert.match(source.sections[4].content, /Problema 1:[\s\S]*Solução:[\s\S]*Problema 2:[\s\S]*Solução:/);
  assert.ok(summary.sections.every(section => section.id.startsWith(`${id}-editorial-v2-`)));
  assert.equal(summary.retrieval[0].sectionId, summary.sections[4].id);
  assert.equal(summary.retrieval[0].prompt, source.recall.prompt);
});

test('revisão H1 pede apenas a leitura nova e conserva respostas de Sociologia e progresso de Filosofia', () => {
  const revised = interactiveSummaries.find(item => item.id === cases[0][1])!;
  const preserved = interactiveSummaries.find(item => item.subject === 'Filosofia')!;
  const oldSection = `${revised.id}-editorial-v1-1`;
  const oldQuestion = `${revised.id}-editorial-recall-v1`;
  const saved: SummaryProgressMap = {
    [revised.id]: { readSectionIds: [oldSection], status: 'em-revisao', important: true, answers: [{
      questionId: oldQuestion, answer: 'Revoluções e transformação social.', matchedElements: ['ordem'],
      firstMissingElement: 'objeto', date: '2026-10-04T12:00:00Z',
    }] },
    [preserved.id]: { readSectionIds: preserved.sections.map(section => section.id), status: 'dominado', important: false, answers: [], reviews: {} },
  };
  const migrated = migrateSummaryProgressMap(saved, [revised, preserved]);
  assert.deepEqual(migrated[preserved.id], saved[preserved.id]);
  assert.equal(migrated[revised.id].answers.length, 1);
  for(const [key,value] of Object.entries(saved[revised.id].answers[0])) assert.deepEqual(migrated[revised.id].answers[0][key as keyof typeof migrated[typeof revised.id]["answers"][number]],value);
  assert.deepEqual(migrated[revised.id].readSectionIds, [oldSection]);
  assert.ok(!revised.sections.some(section => section.id === oldSection));
  assert.notEqual(revised.retrieval[0].id, oldQuestion);
});
