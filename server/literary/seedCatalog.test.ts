import assert from 'node:assert/strict';
import test from 'node:test';
import { SEED_WORKS, SEED_EDITIONS, SEED_EXAM_REQUIREMENTS, PENDING_MATERIAL_WORKS } from './seedCatalog';

test('catálogo Fase 0: 18 obras, 18 exigências oficiais (9 Fuvest + 9 Unicamp)', () => {
  assert.equal(SEED_WORKS.length, 18);
  assert.equal(SEED_EXAM_REQUIREMENTS.length, 18);
  assert.equal(SEED_EXAM_REQUIREMENTS.filter((r) => r.board === 'FUVEST').length, 9);
  assert.equal(SEED_EXAM_REQUIREMENTS.filter((r) => r.board === 'UNICAMP').length, 9);
});

test('catálogo Fase 0: sem ids ou slugs duplicados', () => {
  const ids = SEED_WORKS.map((w) => w.id);
  assert.equal(new Set(ids).size, ids.length);
  const slugs = SEED_WORKS.map((w) => w.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('catálogo Fase 0: toda ExamRequirement aponta pra uma obra existente e tem fonte oficial', () => {
  const workIds = new Set(SEED_WORKS.map((w) => w.id));
  for (const req of SEED_EXAM_REQUIREMENTS) {
    assert.ok(workIds.has(req.workId), `ExamRequirement ${req.id} referencia obra inexistente ${req.workId}`);
    assert.ok(req.officialListUrl.startsWith('https://'), `ExamRequirement ${req.id} sem officialListUrl`);
    assert.ok(req.requiredScope.length > 0, `ExamRequirement ${req.id} sem requiredScope`);
  }
});

test('catálogo Fase 0: 16 obras com edição auditada + 2 com material ainda ausente', () => {
  assert.equal(SEED_EDITIONS.length, 16);
  assert.equal(PENDING_MATERIAL_WORKS.length, 2);
  const editionWorkIds = new Set(SEED_EDITIONS.map((e) => e.workId));
  for (const work of PENDING_MATERIAL_WORKS) {
    assert.ok(!editionWorkIds.has(work.id), `${work.id} tem edição mas deveria estar pendente de material`);
  }
});

test('catálogo Fase 0: toda WorkEdition tem hash real (64 chars hex) e aponta pra obra existente', () => {
  const workIds = new Set(SEED_WORKS.map((w) => w.id));
  for (const edition of SEED_EDITIONS) {
    assert.ok(workIds.has(edition.workId), `WorkEdition ${edition.id} referencia obra inexistente ${edition.workId}`);
    assert.match(edition.fileHash, /^[0-9a-f]{64}$/, `WorkEdition ${edition.id} sem hash sha256 válido`);
  }
});
