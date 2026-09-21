import { CURRENT_AFFAIRS_CONTEXTS, type CurrentAffairsContextId } from '../../lib/currentAffairsContextLab';
import { buildContextInstrument } from './GeographyContextInstrument';

/**
 * Reaproveita a cena e o `BoardShell` de `GeographyContextInstrument` — a
 * comparação em três recortes vale tanto para Geografia quanto para um
 * dossiê de Atualidades, que também é uma leitura territorial e política,
 * só que datada. Fica em componente próprio porque a matéria (`Atualidades`)
 * é outra, e `findInstrument` casa por `subject` exato.
 */
export function currentAffairsContextInstrument(id: CurrentAffairsContextId) {
  return buildContextInstrument(CURRENT_AFFAIRS_CONTEXTS[id]);
}
