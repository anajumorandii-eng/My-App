import type { ChapterTheory, DiscursiveTheme } from './types';
import { famerpDiscursiveThemes, famerpTheory } from './famerp';

export type { ChapterTheory, DiscursiveTheme };

export interface BoardTheory {
  /** Teoria dos capítulos que mais caem na objetiva, por `${topicId}::${chapter}`. */
  chapters: Record<string, ChapterTheory>;
  /** Temas que se repetem nas discursivas. */
  discursive: DiscursiveTheme[];
}

const theoryByBoard: Record<string, BoardTheory> = {
  famerp: { chapters: famerpTheory, discursive: famerpDiscursiveThemes },
};

export const theoryKey = (topicId: string, chapter: string) => `${topicId}::${chapter}`;

export function theoryFor(boardSlug: string): BoardTheory | undefined {
  return theoryByBoard[boardSlug];
}
