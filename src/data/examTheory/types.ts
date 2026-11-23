export interface ChapterTheory {
  /** Como o capítulo caiu nas provas reais da banca. */
  howItFalls: string;
  concepts: string[];
  formulas?: string[];
  /** Exemplo autoral, com números próprios: não reproduz questão da prova. */
  example: { prompt: string; steps: string[] };
  traps: { trap: string; fix: string }[];
}
