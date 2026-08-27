import assert from 'node:assert/strict';
import test from 'node:test';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { summaryMaterials } from '../data/summaryMaterials';
import { validateSummaryCatalog } from './summaryCatalog';

test('preserva os três resumos publicados e amplia somente com fontes internas resolvíveis', () => {
  assert.deepEqual(interactiveSummaries.slice(0, 3).map((item) => item.id), [
    'fis-termologia-calor',
    'bio-ecologia-eutrofizacao',
    'atu-cop30-belem',
  ]);
  assert.deepEqual(
    [...new Set(interactiveSummaries.slice(3).map((item) => item.subject))].sort(),
    ['Geografia', 'Matemática', 'Química'],
  );
  assert.deepEqual(validateSummaryCatalog(interactiveSummaries, summaryMaterials), []);
  assert.ok(interactiveSummaries.slice(3).every((item) => item.retrieval.every((question) => question.board && question.phase)));
});

test('detecta IDs duplicados, pergunta fora de seção e material interno desconhecido', () => {
  const duplicated = {
    ...interactiveSummaries[0],
    sections: [interactiveSummaries[0].sections[0], interactiveSummaries[0].sections[0]],
    retrieval: [{ ...interactiveSummaries[0].retrieval[0], sectionId: 'secao-removida' }],
    sources: [{ label: 'Material ausente', kind: 'material-interno' as const, materialId: 'missing' }],
  };
  const issues = validateSummaryCatalog([duplicated, duplicated], summaryMaterials);
  assert.ok(issues.some((issue) => issue.code === 'duplicate-summary-id'));
  assert.ok(issues.some((issue) => issue.code === 'duplicate-section-id'));
  assert.ok(issues.some((issue) => issue.code === 'missing-question-section'));
  assert.ok(issues.some((issue) => issue.code === 'unknown-material'));
});

test('aceita capítulo de apostila com localização resolvível', () => {
  const material = {
    id: 'bio-eco-introducao', subject: 'Biologia', topic: 'Introdução à Ecologia',
    format: 'apostila' as const, sourceFile: 'materiais brutos/Biologia (v1) 1.pdf',
    chapter: 'Introdução à Ecologia', startPage: 10, endPage: 22,
  };
  const summary = {
    ...interactiveSummaries[0],
    sources: [{ label: material.chapter, kind: 'material-interno' as const, materialId: material.id, chapter: material.chapter, startPage: 10, endPage: 22 }],
  };
  assert.deepEqual(validateSummaryCatalog([summary], [material]), []);
});

test('rejeita fonte de apostila sem localização e resumo sem os três níveis', () => {
  const material = { id: 'bio-eco-incompleto', subject: 'Biologia', topic: 'Ecologia', format: 'apostila' as const, sourceFile: 'bio.pdf' };
  const summary = {
    ...interactiveSummaries[0],
    sections: interactiveSummaries[0].sections.filter((section) => section.depth !== 'prova'),
    sources: [{ label: 'Ecologia', kind: 'material-interno' as const, materialId: material.id }],
  };
  const codes = validateSummaryCatalog([summary], [material]).map((issue) => issue.code);
  assert.ok(codes.includes('missing-source-location'));
  assert.ok(codes.includes('missing-depth'));
});
