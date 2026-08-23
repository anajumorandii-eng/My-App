import { randomUUID } from 'node:crypto';
import { readFile, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { resolveFlashcardClassification } from '../src/lib/flashcardTaxonomy';
import type {
  Flashcard,
  FlashcardClassificationOrigin,
  FlashcardPriority,
  FlashcardTrainingType,
} from '../src/types';

const SUBJECT_FILES = [
  'biologia',
  'filosofia',
  'fisica',
  'geografia',
  'historia',
  'ingles',
  'matematica',
  'portugues',
  'quimica',
  'sociologia',
] as const;

export interface ClassificationReport {
  total: number;
  byPriority: Record<FlashcardPriority, number>;
  byTrainingType: Record<FlashcardTrainingType, number>;
  byOrigin: Record<FlashcardClassificationOrigin, number>;
  byTopic: Record<string, number>;
}

export interface ClassificationResult {
  cards: Flashcard[];
  report: ClassificationReport;
}

export function classifyCards(cards: Flashcard[], strict = false): ClassificationResult {
  const report: ClassificationReport = {
    total: cards.length,
    byPriority: { essencial: 0, alta: 0, regular: 0 },
    byTrainingType: {
      objetivos: 0,
      discursivos: 0,
      interpretacao: 0,
      pegadinhas: 0,
      padroes_bancas: 0,
    },
    byOrigin: { tagged: 0, inherited: 0, fallback: 0 },
    byTopic: {},
  };

  const classifiedCards = cards.map((card) => {
    const { classification, materializedConsistent } = resolveFlashcardClassification(card);

    if (strict && !materializedConsistent) {
      throw new Error(`ClassificaÃ§Ã£o materializada divergente para flashcard ${card.id}`);
    }

    if (
      strict
      && card.source === 'sistema_priorizado'
      && classification.classificationOrigin === 'fallback'
    ) {
      throw new Error(`Classificação inválida para flashcard ${card.id}`);
    }

    report.byPriority[classification.priority] += 1;
    report.byTrainingType[classification.trainingType] += 1;
    report.byOrigin[classification.classificationOrigin] += 1;
    report.byTopic[card.topicId ?? 'sem_topico'] = (report.byTopic[card.topicId ?? 'sem_topico'] ?? 0) + 1;

    return { ...card, ...classification };
  });

  return { cards: classifiedCards, report };
}

export async function classifySubjectFile(
  inputPath: string,
  outputPath: string,
): Promise<ClassificationReport> {
  const source = await readFile(inputPath, 'utf8');
  const cards = JSON.parse(source) as Flashcard[];
  const { cards: classifiedCards, report } = classifyCards(cards, true);
  const serialized = `${JSON.stringify(classifiedCards, null, 2)}\n`;
  const temporaryPath = path.join(
    path.dirname(outputPath),
    `.${path.basename(outputPath)}.${process.pid}.${randomUUID()}.tmp`,
  );

  try {
    await writeFile(temporaryPath, serialized);
    await rename(temporaryPath, outputPath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
  return report;
}

async function main(): Promise<void> {
  for (const subject of SUBJECT_FILES) {
    const filePath = path.resolve('public', 'flashcards', `${subject}.json`);
    const report = await classifySubjectFile(filePath, filePath);
    console.log(`${subject}: ${JSON.stringify(report)}`);
  }
}

const invokedPath = process.argv[1];
if (invokedPath && import.meta.url === pathToFileURL(path.resolve(invokedPath)).href) {
  void main();
}
