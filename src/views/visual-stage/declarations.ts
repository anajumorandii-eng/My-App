import type { InteractiveSummary } from '../../types/summary';
import { findBoard } from '../visual-boards/registry';
import { findInstrument } from '../visual-instruments/registry';
import type { VisualRepresentation } from '../visualRepresentation';
import type { StageSceneDeclaration } from './contract';
import { casesStageDeclaration, sceneStageDeclaration } from './sceneDeclarations';
import { boardStageCases } from '../visual-boards/stageCaseItems';

/**
 * Uma cena migrada declara o que oferece ao palco pendurando `stage` no próprio
 * componente (`MinhaPrancha.stage = { hotspots: [...] }`). Quem não declara cai
 * no padrão de `resolveStageDeclaration`: um ponto por nó do mapa.
 */
export type StageAwareComponent = { stage?: StageSceneDeclaration | ((summary: InteractiveSummary) => StageSceneDeclaration) };

export function stageDeclarationFor(summary: InteractiveSummary, representation: VisualRepresentation): StageSceneDeclaration | null {
  // Cenas de topic-scenes não são componentes do registro: declaram pelo id.
  if (representation === 'scene') return sceneStageDeclaration(summary);
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
