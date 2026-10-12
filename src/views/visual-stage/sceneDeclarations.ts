import type { InteractiveSummary } from '../../types/summary';
import { buildVisualMap } from '../../lib/visualStudy';
import { planStageFocus } from '../../lib/stageFocus';
import { sceneFor } from '../topic-scenes/sceneFor';
import { ECOLOGY_CYCLE_IDS } from '../topic-scenes/families/EcologyCycles';
import { ECOLOGY_SYSTEM_IDS } from '../topic-scenes/families/EcologySystems';
import { BIOLOGY_PHYSIOLOGY_SCENE_IDS } from '../topic-scenes/families/BiologiaFisiologia';
import { BIOLOGY_PROCESS_IDS } from '../topic-scenes/families/BiologiaProcessos';
import { ORGANIC_SCENE_IDS } from '../topic-scenes/families/QuimicaOrganica';
import { QUIMICA_FENOMENO_IDS } from '../topic-scenes/families/QuimicaFenomenos';
import { BIOLOGIA_FENOMENO_IDS } from '../topic-scenes/families/BiologiaFenomenos';
import type { StageSceneDeclaration } from './contract';

/** Capítulos cuja família de cena lê `useStageCases` (Química e Biologia). */
export const STAGE_CASE_SCENE_IDS: ReadonlySet<string> = new Set([
  ...ECOLOGY_CYCLE_IDS, ...ECOLOGY_SYSTEM_IDS, ...BIOLOGY_PHYSIOLOGY_SCENE_IDS, ...BIOLOGY_PROCESS_IDS,
  ...ORGANIC_SCENE_IDS, ...QUIMICA_FENOMENO_IDS, ...BIOLOGIA_FENOMENO_IDS,
  'summary-quimica-geometria-molecular',
]);

/**
 * Pontos de investigação de uma cena migrada: um por etapa, com o nome do caso
 * que aquela etapa abre na cena. O rótulo é o do próprio caso (validado pelo
 * lastro contra o texto do capítulo); etapa que não nomeia caso fica com o
 * título da seção. Tocar no ponto leva à etapa, e a etapa abre o caso — o mesmo
 * plano que `useStageCases` segue, então barra e cena não discordam.
 */
export function sceneStageDeclaration(summary: InteractiveSummary): StageSceneDeclaration | null {
  if (!STAGE_CASE_SCENE_IDS.has(summary.id)) return null;
  const entry = sceneFor(summary.id);
  if (!entry) return null;
  const map = buildVisualMap(summary);
  const plan = planStageFocus(entry.items, summary.sections);
  return {
    hotspots: map.nodes.map((node, step) => {
      const caso = plan.byStep[step]?.[0];
      return { id: `etapa-${step}`, label: caso === undefined ? node.label : entry.items[caso].label, nodeId: node.id, step };
    }),
  };
}
