import type { ChapterTheory } from './types';
import { famerpTheory } from './famerp';

export type { ChapterTheory };

const theoryByBoard: Record<string, Record<string, ChapterTheory>> = {
  famerp: famerpTheory,
};

export const theoryKey = (topicId: string, chapter: string) => `${topicId}::${chapter}`;

export function theoryFor(boardSlug: string): Record<string, ChapterTheory> | undefined {
  return theoryByBoard[boardSlug];
}
