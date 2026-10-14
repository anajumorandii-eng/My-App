import assert from 'node:assert/strict';
import test from 'node:test';
import { literaryStudyBlock } from '../data/literaryStudyWorkshop';
import { publishedLiteraryPassages } from './literaryStudyWorkshop';
import { DOSSIER_SLUGS, loadWorkDossier } from './workDossiers';
test('blocos de obras cabem no tempo selecionado', () => {
  for (const minutes of [20, 40, 60] as const) assert.equal(literaryStudyBlock(minutes).reduce((sum, step) => sum + step.minutes, 0), minutes);
});
test('passagens do laboratório têm unidade e publicação confirmadas em todos os dossiês', async () => {
  for (const slug of DOSSIER_SLUGS) {
    const dossier = (await loadWorkDossier(slug))!;
    for (const card of publishedLiteraryPassages(dossier)) { assert.equal(card.editorialStatus, 'published'); assert.equal(dossier.units.find(unit => unit.id === card.unitId)?.guide.editorialStatus, 'published'); }
    const draft = structuredClone(dossier);
    draft.units.forEach(unit => { unit.guide.editorialStatus = 'needs_review'; });
    assert.equal(publishedLiteraryPassages(draft).length, 0);
  }
});
