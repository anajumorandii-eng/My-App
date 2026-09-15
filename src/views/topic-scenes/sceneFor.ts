import { interactiveSummaries } from '../../data/interactiveSummaries';
import { filosofia } from './data/filosofia';
import { validarLastro } from './lastro';
import type { SceneEntry } from './types';

const capitulos = new Map(interactiveSummaries.map((summary) => [summary.id, summary]));
const validas = filosofia.filter((entry) => validarLastro(entry, capitulos.get(entry.chapterId)).length === 0);
const porCapitulo = new Map(validas.map((entry) => [entry.chapterId, entry]));

export function entradasValidas(): SceneEntry[] { return validas; }
export function sceneFor(chapterId: string): SceneEntry | null { return porCapitulo.get(chapterId) ?? null; }
