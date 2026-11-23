import type { ChapterTheory, DiscursiveTheme } from '../types';
import { natureza } from './natureza';
import { matematica } from './matematica';
import { linguagensHumanas } from './linguagens-humanas';
import { discursivasBiologia } from './discursivas-biologia';
import { discursivasQuimica } from './discursivas-quimica';
import { discursivasFisica } from './discursivas-fisica';

export const famerpTheory: Record<string, ChapterTheory> = { ...natureza, ...matematica, ...linguagensHumanas };
export const famerpDiscursiveThemes: DiscursiveTheme[] = [...discursivasBiologia, ...discursivasQuimica, ...discursivasFisica];
