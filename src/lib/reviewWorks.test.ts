import test from 'node:test';
import assert from 'node:assert/strict';
import { reviewWorkOptions, groupWorksByBoard } from './reviewWorks';
import { DOSSIER_SLUGS } from './workDossiers';

test('sem catálogo do Firestore, oferece as 18 obras do ciclo, todas com dossiê', () => {
  const options = reviewWorkOptions([]);
  assert.equal(options.length, 18);
  assert.ok(options.every((work) => DOSSIER_SLUGS.includes(work.slug)));
});

test('separa as 9 da Fuvest e as 9 da Unicamp', () => {
  const groups = groupWorksByBoard(reviewWorkOptions());
  assert.deepEqual(groups.map((group) => [group.label, group.works.length]), [['Fuvest', 9], ['Unicamp', 9]]);
  assert.ok(groups[0].works.some((work) => work.slug === 'paixao-segundo-gh'));
  assert.ok(groups[1].works.some((work) => work.slug === 'bras-cubas'));
});

test('com catálogo do Firestore, usa ele e descarta obra sem dossiê', () => {
  const options = reviewWorkOptions([
    { id: 'bras-cubas', slug: 'bras-cubas', title: 'Memórias Póstumas', author: 'Machado de Assis', genre: 'romance', language: 'pt-BR' },
    { id: 'sem-dossie', slug: 'sem-dossie', title: 'Obra nova', author: 'Alguém', genre: 'romance', language: 'pt-BR' },
  ]);
  assert.deepEqual(options.map((work) => [work.slug, work.boards]), [['bras-cubas', ['UNICAMP']]]);
});
