import { CURRENT_AFFAIRS_CONTEXTS, type CurrentAffairsContextId } from '../../lib/currentAffairsContextLab';
import { currentAffairsDossier } from './CurrentAffairsDossier';

/**
 * Atualidades exige dossiê próprio: o objeto é um documento datado, com
 * registro, contexto e avaliação crítica, não uma ilustração territorial.
 */
export function currentAffairsContextInstrument(id: CurrentAffairsContextId) {
  return currentAffairsDossier(CURRENT_AFFAIRS_CONTEXTS[id]);
}
