import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { classifyCards } from '../../scripts/classifyFlashcards';
import { deriveFlashcardClassification } from './flashcardTaxonomy';
import type { Flashcard } from '../types';

const SUBJECT_FILES = [
  'biologia.json',
  'filosofia.json',
  'fisica.json',
  'geografia.json',
  'historia.json',
  'ingles.json',
  'matematica.json',
  'portugues.json',
  'quimica.json',
  'sociologia.json',
] as const;

test('materialized subject data preserves the audited classification contract', async () => {
  const directory = path.resolve('public', 'flashcards');
  const jsonFiles = (await readdir(directory))
    .filter((file) => file.endsWith('.json'))
    .sort();

  assert.deepEqual(jsonFiles, [...SUBJECT_FILES, 'obras.json'].sort());

  const cards = (
    await Promise.all(SUBJECT_FILES.map(async (file) => (
      JSON.parse(await readFile(path.join(directory, file), 'utf8')) as Flashcard[]
    )))
  ).flat();
  const ids = new Set(cards.map((card) => card.id));

  assert.equal(cards.length, 16625);
  assert.equal(ids.size, 16625);

  for (const card of cards) {
    const derived = deriveFlashcardClassification(card);
    assert.deepEqual({
      priority: card.priority,
      trainingType: card.trainingType,
      classificationOrigin: card.classificationOrigin,
    }, derived, card.id);
    assert.notEqual(derived.classificationOrigin, 'fallback', card.id);
  }

  const { report } = classifyCards(cards, true);
  assert.deepEqual(report.byPriority, {
    essencial: 6894,
    alta: 2256,
    regular: 7475,
  });
  assert.deepEqual(report.byTrainingType, {
    objetivos: 12233,
    discursivos: 1647,
    interpretacao: 549,
    pegadinhas: 1098,
    padroes_bancas: 1098,
  });
  assert.deepEqual(report.byOrigin, {
    tagged: 9500,
    inherited: 7125,
    fallback: 0,
  });
});
