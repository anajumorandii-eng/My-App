import assert from 'node:assert/strict';
import test from 'node:test';
import { segmentChapters, segmentPoems, segmentIntoUnits, PageText } from './literarySegmenter';

test('segmentChapters: detecta capítulos numerados, um por página', () => {
  const pages: PageText[] = [
    { num: 1, text: 'CAPÍTULO I\nÓbito do autor\nAlgum tempo hesitei...\nmais texto aqui' },
    { num: 2, text: 'continuação do capítulo um, sem cabeçalho novo' },
    { num: 3, text: 'CAPÍTULO II\nO emplasto\nVamos lá; retifique...' },
  ];
  const units = segmentChapters(pages);
  assert.equal(units.length, 2);
  assert.equal(units[0].title, 'CAPÍTULO I — Óbito do autor');
  assert.equal(units[0].pdfStartPage, 1);
  assert.equal(units[0].pdfEndPage, 2);
  assert.equal(units[1].title, 'CAPÍTULO II — O emplasto');
  assert.equal(units[1].pdfStartPage, 3);
  assert.equal(units[1].pdfEndPage, 3);
  assert.equal(units[0].extractionConfidence, 'medium');
});

test('segmentChapters: dois capítulos curtos na mesma página não geram intervalo invertido', () => {
  const pages: PageText[] = [
    { num: 1, text: 'texto de abertura' },
    { num: 2, text: 'CAPÍTULO IV\nA ideia fixa\ntexto curto\nCAPÍTULO V\nEm que aparece\nmais texto curto' },
    { num: 3, text: 'CAPÍTULO VI\nChimène\ntexto final' },
  ];
  const units = segmentChapters(pages);
  assert.equal(units.length, 3);
  assert.equal(units[1].pdfStartPage, 2);
  assert.equal(units[1].pdfEndPage, 2);
  assert.ok(units[1].pdfEndPage >= units[1].pdfStartPage);
});

test('segmentChapters: sem cabeçalho de capítulo, devolve lista vazia', () => {
  const pages: PageText[] = [{ num: 1, text: 'só um texto qualquer sem estrutura de capítulo' }];
  assert.deepEqual(segmentChapters(pages), []);
});

test('segmentPoems: detecta título curto isolado no topo de cada página', () => {
  const pages: PageText[] = [
    { num: 1, text: 'Ingrina\nO grito da cigarra ergue a tarde\ne o perfume do orégão invade' },
    { num: 2, text: 'Manhã\nDe pedra e cal\nmundo nomeado' },
  ];
  const units = segmentPoems(pages);
  assert.equal(units.length, 2);
  assert.equal(units[0].title, 'Ingrina');
  assert.equal(units[0].extractionConfidence, 'low');
  assert.equal(units[1].title, 'Manhã');
  assert.equal(units[1].pdfStartPage, 2);
});

test('segmentIntoUnits: sem nenhum boundary detectado, devolve a obra inteira como 1 unidade de baixa confiança', () => {
  const pages: PageText[] = [
    { num: 1, text: 'Um romance qualquer sem marcação de capítulo nem título de poema.' },
    { num: 2, text: 'Continua o mesmo texto corrido, sem estrutura detectável.' },
  ];
  const units = segmentIntoUnits(pages, 'chapter');
  assert.equal(units.length, 1);
  assert.equal(units[0].pdfStartPage, 1);
  assert.equal(units[0].pdfEndPage, 2);
  assert.equal(units[0].extractionConfidence, 'low');
});

test('segmentIntoUnits: prioriza capítulos numerados mesmo quando o gênero declarado é poesia', () => {
  const pages: PageText[] = [{ num: 1, text: 'CAPÍTULO I\nAbertura\ntexto' }];
  const units = segmentIntoUnits(pages, 'poem');
  assert.equal(units[0].type, 'chapter');
});
