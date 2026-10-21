import assert from 'node:assert/strict';
import test from 'node:test';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { currentAffairsInteractiveSummaries } from '../data/currentAffairsInteractiveSummaries';
import sources from '../data/currentAffairs/sources2026.json';
import { validateSummaryCatalog } from './summaryCatalog';
import { summaryMaterials } from '../data/summaryMaterials';
import { filterSummaries } from './summaryEngine';

const suppliedLessons = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '18', '19', '20', '21', '22', '23', '24', '26', '27', '28'];

test('as 22 aulas fornecidas são alcançáveis no catálogo de Atualidades, sem duplicar COP30', () => {
  const summaries = filterSummaries(interactiveSummaries, { subject: 'Atualidades' });
  assert.equal(summaries.length, suppliedLessons.length);
  assert.equal(currentAffairsInteractiveSummaries.length, 21);
  assert.equal(summaries.filter(item => item.id === 'atu-cop30-belem').length, 1);
  for (const lesson of suppliedLessons) {
    const references = sources.filter(source => source.lesson === lesson);
    assert.ok(references.length, `aula ${lesson} tem fonte`);
    assert.ok(summaries.some(summary => references.every(reference => summary.sources.some(source => source.url === reference.url))), `aula ${lesson} publicada com referências`);
  }
  assert.deepEqual(validateSummaryCatalog(interactiveSummaries, summaryMaterials), []);
});

test('novos capítulos participam da leitura em três profundidades e da recuperação persistida', () => {
  for (const summary of currentAffairsInteractiveSummaries) {
    assert.equal(interactiveSummaries.find(item => item.id === summary.id)?.title, summary.title);
    assert.deepEqual([...new Set(summary.sections.map(section => section.depth))].sort(), ['aprofundamento', 'prova', 'rapida']);
    assert.deepEqual(summary.sections.map(section => section.stage), ['intuicao', 'conceito', 'aplicacao', 'estrategia', 'exercicio']);
    assert.equal(summary.retrieval.length, 1);
    assert.ok(summary.sections.some(section => section.id === summary.retrieval[0].sectionId));
    assert.ok(summary.retrieval[0].expectedElements.length >= 3);
    assert.ok(summary.retrieval[0].transferPrompt);
    assert.equal(summary.currentAffairs?.verifiedAt, '2026-10-21');
  }
});

test('as referências dos 40 arquivos originais ficam acessíveis sem publicar os PDFs', () => {
  const publishedUrls = new Set(interactiveSummaries.filter(summary => summary.subject === 'Atualidades').flatMap(summary => summary.sources.map(source => source.url)));
  assert.equal(sources.length, 40);
  assert.equal(new Set(sources.map(source => source.url)).size, 40);
  for (const source of sources) {
    assert.match(source.url, /^https:\/\/drive\.google\.com\/file\/d\//);
    assert.ok(publishedUrls.has(source.url));
  }
});

test('a ampliação preserva as seções e a recuperação já publicadas de COP30', () => {
  const cop = interactiveSummaries.find(summary => summary.id === 'atu-cop30-belem')!;
  for (const id of ['cop-a', 'cop-t', 'cop-u', 'cop-a2', 'cop-l', 'cop-h']) assert.ok(cop.sections.some(section => section.id === id));
  assert.equal(cop.retrieval[0].id, 'cop-r1');
  assert.equal(cop.retrieval[0].sectionId, 'cop-h');
});
