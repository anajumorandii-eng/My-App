import assert from 'node:assert/strict';
import test from 'node:test';
import { DOSSIER_SLUGS, loadWorkDossier } from './workDossiers';
import { getWorkStudyGuide } from './workStudyGuides';
import { workStudyGuides } from '../data/workStudyGuides';

test('cada obra do catálogo tem resumo, estratégia e unidades apoiadas no dossiê publicado', async () => {
  assert.deepEqual(Object.keys(workStudyGuides).sort(), [...DOSSIER_SLUGS].sort());
  for (const slug of DOSSIER_SLUGS) {
    const dossier = (await loadWorkDossier(slug))!;
    const guide = getWorkStudyGuide(dossier)!;
    assert.ok(guide, slug);
    assert.ok(guide.profile.strategy.length >= 3, slug);
    assert.ok(guide.units.length, slug);
    for (const unit of guide.units) {
      for (const card of unit.passages) {
        assert.equal(card.unitId, unit.id);
        assert.equal(card.editorialStatus, 'published');
      }
    }
  }
});

test('uma passagem em revisão não entra no resumo mesmo com unidade publicada', async () => {
  const dossier = structuredClone((await loadWorkDossier('olhos-dagua'))!);
  dossier.evidence[0].editorialStatus = 'needs_review';
  const guide = getWorkStudyGuide(dossier)!;
  assert.ok(guide.units.every(unit => unit.passages.every(card => card.id !== dossier.evidence[0].id)));
});
