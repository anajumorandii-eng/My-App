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

  assert.equal(cards.length, 8223);
  assert.equal(ids.size, 8223);

  for (const card of cards) {
    const derived = deriveFlashcardClassification(card);
    assert.deepEqual({
      priority: card.priority,
      trainingType: card.trainingType,
      classificationOrigin: card.classificationOrigin,
    }, derived, card.id);
    assert.notEqual(derived.classificationOrigin, 'fallback', card.id);
  }

  // Dois cartões gerados por capítulo (núcleo e pegadinha), não dezoito com o
  // mesmo verso: scripts/enxugar-flashcards.py.
  const gerados = cards.filter((card) => card.source === 'sistema_priorizado');
  const porCapitulo = new Map<string, number>();
  for (const card of gerados) porCapitulo.set(`${card.subject}:${card.chapter}`, (porCapitulo.get(`${card.subject}:${card.chapter}`) ?? 0) + 1);
  assert.ok([...porCapitulo.values()].every((n) => n === 2));
  assert.equal(new Set(gerados.map((card) => card.back)).size, gerados.length, 'verso repetido entre cartões gerados');

  const { report } = classifyCards(cards, true);
  assert.deepEqual(report.byPriority, {
    essencial: 766,
    alta: 282,
    regular: 7175,
  });
  assert.deepEqual(report.byTrainingType, {
    objetivos: 7674,
    discursivos: 0,
    interpretacao: 0,
    pegadinhas: 549,
    padroes_bancas: 0,
  });
  assert.deepEqual(report.byOrigin, {
    tagged: 1098,
    inherited: 7125,
    fallback: 0,
  });
});
