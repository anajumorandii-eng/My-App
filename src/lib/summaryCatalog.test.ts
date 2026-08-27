import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { summaryMaterials } from '../data/summaryMaterials';
import { validateSummaryCatalog } from './summaryCatalog';
import { summaryCurriculum } from '../data/summaryCurriculum';
import { auditSummaryCoverage } from './summaryCoverage';

test('preserva os IDs publicados e mantém todas as fontes internas resolvíveis', () => {
  assert.deepEqual(
    ['fis-termologia-calor', 'bio-ecologia-eutrofizacao', 'atu-cop30-belem', 'qui-equilibrio-acidificacao', 'mat-probabilidade-contagem', 'geo-bonus-demografico']
      .filter((id) => interactiveSummaries.some((item) => item.id === id)),
    ['fis-termologia-calor', 'bio-ecologia-eutrofizacao', 'atu-cop30-belem', 'qui-equilibrio-acidificacao', 'mat-probabilidade-contagem', 'geo-bonus-demografico'],
  );
  assert.deepEqual(validateSummaryCatalog(interactiveSummaries, summaryMaterials), []);
});

test('toda apostila publicada aponta para um arquivo existente', () => {
  const missingFiles = summaryMaterials
    .filter((material) => material.format === 'apostila')
    .filter((material) => !existsSync(material.sourceFile))
    .map((material) => material.sourceFile);
  assert.deepEqual([...new Set(missingFiles)], []);
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

test('publica os 11 tópicos de Ecologia do primeiro semestre uma única vez', () => {
  const ecologyTopics = summaryCurriculum
    .find((item) => item.subject === 'Biologia')!
    .topics.filter((item) => item.track === 'Ecologia' && item.title !== 'Biomas Brasileiros');
  const ecologyIds = [
    'bio-ecologia-introducao',
    'bio-ecologia-dinamica-populacoes',
    'bio-ecologia-invasoras-controle-biologico',
    'bio-ecologia-sucessao',
    'bio-ecologia-ciclo-carbono',
    'bio-ecologia-ciclo-nitrogenio',
    'bio-ecologia-ciclo-hidrologico-poluicao-agua',
    'bio-ecologia-eutrofizacao',
    'bio-ecologia-poluicao-ar',
    'bio-ecologia-biomagnificacao',
    'bio-ecologia-aquecimento-global-pops-biorremediacao',
  ];
  assert.deepEqual(interactiveSummaries.filter((item) => ecologyIds.includes(item.id)).map((item) => item.id), ecologyIds);
  assert.deepEqual(
    auditSummaryCoverage(summaryCurriculum, interactiveSummaries).missing.filter((item) =>
      ecologyTopics.some((topic) => topic.title === item.topic)),
    [],
  );
  assert.deepEqual(validateSummaryCatalog(interactiveSummaries, summaryMaterials), []);
});
