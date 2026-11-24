import type { ChapterTheory, DiscursiveTheme } from '../types';
import { natureza } from './natureza';
import { matematica } from './matematica';
import { linguagensHumanas } from './linguagens-humanas';
import { discursivasBiologia } from './discursivas-biologia';
import { discursivasQuimica } from './discursivas-quimica';
import { discursivasFisica } from './discursivas-fisica';
import { famerpPatterns } from './padroes';

const base: Record<string, ChapterTheory> = { ...natureza, ...matematica, ...linguagensHumanas };

// Os tipos de cobrança moram num arquivo próprio porque saem de outra fonte
// (a leitura das questões reais), mas aparecem dentro do capítulo.
export const famerpTheory: Record<string, ChapterTheory> = Object.fromEntries(
  Object.entries(base).map(([key, theory]) => [key, { ...theory, patterns: famerpPatterns[key] }]),
);
export { famerpPatterns };
export const famerpDiscursiveThemes: DiscursiveTheme[] = [...discursivasBiologia, ...discursivasQuimica, ...discursivasFisica];
