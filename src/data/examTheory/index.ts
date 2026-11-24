import type { ChapterTheory, DiscursiveTheme, EssayModel } from './types';
import { famerpDiscursiveThemes, famerpTheory } from './famerp';
import { famerpEssayModels } from './famerp/redacao';

export type { ChapterTheory, DiscursiveTheme, EssayModel };

export interface BoardTheory {
  /** Teoria dos capítulos que mais caem na objetiva, por `${topicId}::${chapter}`. */
  chapters: Record<string, ChapterTheory>;
  /** Temas que se repetem nas discursivas. */
  discursive: DiscursiveTheme[];
  /** Redações-modelo autorais para os temas reais da banca. */
  essays?: EssayModel[];
}

const theoryByBoard: Record<string, BoardTheory> = {
  famerp: { chapters: famerpTheory, discursive: famerpDiscursiveThemes, essays: famerpEssayModels },
};

export const theoryKey = (topicId: string, chapter: string) => `${topicId}::${chapter}`;

export function theoryFor(boardSlug: string): BoardTheory | undefined {
  return theoryByBoard[boardSlug];
}
