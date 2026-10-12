import type { InteractiveSummary } from '../../types/summary';
import { findBoard } from '../visual-boards/registry';
import { findInstrument } from '../visual-instruments/registry';
import type { VisualRepresentation } from '../visualRepresentation';
import type { StageSceneDeclaration } from './contract';
import { casesStageDeclaration, sceneStageDeclaration } from './sceneDeclarations';
import { boardStageCases } from '../visual-boards/stageCaseItems';
import { instrumentStageDeclaration } from './caseDeclaration';
import { buildVisualMap } from '../../lib/visualStudy';
import { COORDINATES_CHAPTER, COORDINATES_STEPS } from '../topic-experiments/coordinatesStage';

/** Experimentos que leem a etapa declaram um ponto por etapa, com o que ela acende no experimento. */
function experimentStageDeclaration(summary: InteractiveSummary): StageSceneDeclaration | null {
  if (summary.id !== COORDINATES_CHAPTER) return null;
  return {
    hotspots: buildVisualMap(summary).nodes.map((node, step) => ({
      id: `etapa-${step}`, label: COORDINATES_STEPS[node.stage].label, nodeId: node.id, step,
    })),
  };
}

/**
 * Uma cena migrada declara o que oferece ao palco pendurando `stage` no próprio
 * componente (`MinhaPrancha.stage = { hotspots: [...] }`). Quem não declara cai
 * no padrão de `resolveStageDeclaration`: um ponto por nó do mapa.
 */
export type StageAwareComponent = { stage?: StageSceneDeclaration | ((summary: InteractiveSummary) => StageSceneDeclaration) };

export function stageDeclarationFor(summary: InteractiveSummary, representation: VisualRepresentation): StageSceneDeclaration | null {
  // Cenas de topic-scenes não são componentes do registro: declaram pelo id.
  if (representation === 'scene') return sceneStageDeclaration(summary);
  if (representation === 'experiment') return experimentStageDeclaration(summary);
  // Laboratórios de recortes chegam embrulhados em lazyBoard: declaram pelo id.
  if (representation === 'instrument') { const declared = instrumentStageDeclaration(summary); if (declared) return declared; }
  // Pranchas carregam sob demanda (lazyBoard), então `Component.stage` não
  // chega aqui; as que alternam casos pela etapa declaram pela lista comum.
  if (representation === 'board') {
    const board = findBoard(summary);
    const items = board ? boardStageCases(board.id, summary.id) : null;
    if (items) return casesStageDeclaration(summary, items);
  }
  const component = (representation === 'board' ? findBoard(summary)?.Component
    : representation === 'instrument' ? findInstrument(summary)?.Component
      : undefined) as (StageAwareComponent | undefined);
  const declared = component?.stage;
  if (!declared) return null;
  return typeof declared === 'function' ? declared(summary) : declared;
}
