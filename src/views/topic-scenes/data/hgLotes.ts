import type { SceneEntry } from '../types';
import { ENTRIES_LOTE11 } from './lote11';
import { ENTRIES_LOTE12 } from './lote12';
import { ENTRIES_LOTE13 } from './lote13';
import { ENTRIES_LOTE14 } from './lote14';
import { ENTRIES_LOTE15 } from './lote15';
import { ENTRIES_LOTE16 } from './lote16';
import { ENTRIES_LOTE17 } from './lote17';
import { ENTRIES_LOTE18 } from './lote18';
import { ENTRIES_LOTE19 } from './lote19';

/**
 * Capítulos de História e Geografia que abriam com instrumento, experimento
 * ou prancha e foram redesenhados como cena autoral (auditoria de 26/09,
 * docs/visual-personalizado/31-auditoria-47-historia-geografia.md). Os
 * recortes moram um arquivo por lote para que os lotes avancem em paralelo;
 * historia.ts e geografia.ts os somam às suas listas e os tiram das lacunas.
 */
export const HG_LOTE_ENTRIES: SceneEntry[] = [
  ...ENTRIES_LOTE11,
  ...ENTRIES_LOTE12,
  ...ENTRIES_LOTE13,
  ...ENTRIES_LOTE14,
  ...ENTRIES_LOTE15,
  ...ENTRIES_LOTE16,
  ...ENTRIES_LOTE17,
  ...ENTRIES_LOTE18,
  ...ENTRIES_LOTE19,
];

/** A cena desenhada à mão para estes capítulos vence o instrumento genérico. */
export const HG_AUTHORED_IDS: ReadonlySet<string> = new Set(HG_LOTE_ENTRIES.map(entry => entry.chapterId));
