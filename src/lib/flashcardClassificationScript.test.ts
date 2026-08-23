import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { Flashcard } from '../types';
import { classifyCards, classifySubjectFile } from '../../scripts/classifyFlashcards';

const card = (overrides: Partial<Flashcard> = {}): Flashcard => ({
  id: 'fixed-id',
  subject: 'Biologia',
  topicId: 'bio_ecologia',
  chapter: 'Ecologia',
  front: '<b>Frente</b>',
  back: 'Verso',
  tags: ['prioridade_alta', '06_grafico_tabela_texto_ou_experimento'],
  source: 'sistema_priorizado',
  ...overrides,
});

test('materializa metadados sem alterar identidade ou conteudo', () => {
  const { cards, report } = classifyCards([card()], true);

  assert.equal(cards[0].id, 'fixed-id');
  assert.equal(cards[0].front, '<b>Frente</b>');
  assert.equal(cards[0].priority, 'alta');
  assert.equal(cards[0].trainingType, 'interpretacao');
  assert.equal(cards[0].classificationOrigin, 'tagged');
  assert.deepEqual(report, {
    total: 1,
    byPriority: { essencial: 0, alta: 1, regular: 0 },
    byTrainingType: {
      objetivos: 0,
      discursivos: 0,
      interpretacao: 1,
      pegadinhas: 0,
      padroes_bancas: 0,
    },
    byOrigin: { tagged: 1, inherited: 0, fallback: 0 },
    byTopic: { bio_ecologia: 1 },
  });
});

test('segunda classificacao produz exatamente o mesmo resultado', () => {
  const once = classifyCards([card()], true).cards;

  assert.deepEqual(classifyCards(once, true).cards, once);
});

test('strict mode rejects materialized metadata divergent from tags', () => {
  assert.throws(
    () => classifyCards([card({
      priority: 'essencial',
      trainingType: 'objetivos',
      classificationOrigin: 'tagged',
    })], true),
    /materializada.*divergente.*fixed-id/i,
  );
});

test('invalid materialized enum becomes fallback without corrupting counters', () => {
  const { cards, report } = classifyCards([card({
    priority: 'urgente' as Flashcard['priority'],
    trainingType: 'interpretacao',
    classificationOrigin: 'tagged',
  })]);

  assert.deepEqual(cards[0], {
    ...card(),
    priority: 'regular',
    trainingType: 'objetivos',
    classificationOrigin: 'fallback',
  });
  assert.deepEqual(report.byPriority, { essencial: 0, alta: 0, regular: 1 });
  assert.deepEqual(report.byTrainingType, {
    objetivos: 1,
    discursivos: 0,
    interpretacao: 0,
    pegadinhas: 0,
    padroes_bancas: 0,
  });
  assert.deepEqual(report.byOrigin, { tagged: 0, inherited: 0, fallback: 1 });
});

test('modo estrito rejeita sistema priorizado sem classificacao valida', () => {
  assert.throws(
    () => classifyCards([card({ tags: [] })], true),
    /classificação inválida.*fixed-id/i,
  );
});

test('valida toda a materia antes de substituir o arquivo de destino', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'flashcard-classification-'));
  const inputPath = path.join(directory, 'biologia.json');
  const outputPath = path.join(directory, 'output.json');
  const priorOutput = '[{"preserve":true}]\n';

  await writeFile(inputPath, JSON.stringify([card(), card({ id: 'invalid-id', tags: [] })]));
  await writeFile(outputPath, priorOutput);

  await assert.rejects(
    classifySubjectFile(inputPath, outputPath),
    /classificação inválida.*invalid-id/i,
  );

  assert.equal(await readFile(outputPath, 'utf8'), priorOutput);
  assert.deepEqual((await readdir(directory)).sort(), ['biologia.json', 'output.json']);
});

test('cleans temporary file when atomic replacement fails', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'flashcard-classification-'));
  const inputPath = path.join(directory, 'biologia.json');
  const outputPath = path.join(directory, 'output.json');

  await writeFile(inputPath, JSON.stringify([card()]));
  await mkdir(outputPath);

  await assert.rejects(classifySubjectFile(inputPath, outputPath));

  assert.deepEqual((await readdir(directory)).sort(), ['biologia.json', 'output.json']);
});

test('escreve cartoes classificados como JSON formatado com newline', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'flashcard-classification-'));
  const inputPath = path.join(directory, 'biologia.json');
  const outputPath = path.join(directory, 'output.json');

  await writeFile(inputPath, JSON.stringify([card()]));
  await writeFile(outputPath, '[{"old":true}]\n');
  const originalInode = (await stat(outputPath)).ino;

  const report = await classifySubjectFile(inputPath, outputPath);

  assert.equal(report.total, 1);
  assert.equal(
    await readFile(outputPath, 'utf8'),
    `${JSON.stringify(classifyCards([card()], true).cards, null, 2)}\n`,
  );
  assert.notEqual((await stat(outputPath)).ino, originalInode);
  assert.deepEqual((await readdir(directory)).sort(), ['biologia.json', 'output.json']);
});
