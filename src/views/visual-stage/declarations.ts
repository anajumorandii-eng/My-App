import type { InteractiveSummary } from '../../types/summary';
import { findBoard } from '../visual-boards/registry';
import { findInstrument } from '../visual-instruments/registry';
import type { VisualRepresentation } from '../visualRepresentation';
import type { StageSceneDeclaration } from './contract';
import { sceneStageDeclaration } from './sceneDeclarations';
import { instrumentStageDeclaration } from './caseDeclaration';

/**
 * Uma cena migrada declara o que oferece ao palco pendurando `stage` no próprio
 * componente (`MinhaPrancha.stage = { hotspots: [...] }`). Quem não declara cai
 * no padrão de `resolveStageDeclaration`: um ponto por nó do mapa.
 */
export type StageAwareComponent = { stage?: StageSceneDeclaration | ((summary: InteractiveSummary) => StageSceneDeclaration) };

export function stageDeclarationFor(summary: InteractiveSummary, representation: VisualRepresentation): StageSceneDeclaration | null {
  // Cenas de topic-scenes não são componentes do registro: declaram pelo id.
  if (representation === 'scene') return sceneStageDeclaration(summary);
  // Laboratórios de recortes chegam embrulhados em lazyBoard: declaram pelo id.
  if (representation === 'instrument') { const declared = instrumentStageDeclaration(summary); if (declared) return declared; }
  const component = (representation === 'board' ? findBoard(summary)?.Component
    : representation === 'instrument' ? findInstrument(summary)?.Component
      : undefined) as (StageAwareComponent | undefined);
  const declared = component?.stage;
  if (!declared) return null;
  return typeof declared === 'function' ? declared(summary) : declared;
}
