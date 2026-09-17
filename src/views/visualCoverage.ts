import type { InteractiveSummary } from '../types/summary';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';
import { topicExperiments } from './topic-experiments/catalog';
import { sceneFor } from './topic-scenes/sceneFor';

export type VisualCoverageKind =
  | 'illustrated-board'
  | 'interactive-experiment'
  | 'anchor-scene'
  | 'instrument'
  | 'fallback';

export interface VisualCoverage {
  kind: VisualCoverageKind;
  id: string | null;
  dedicated: boolean;
}

/**
 * A cobertura visual precisa dizer qual recurso existe, e não apenas devolver
 * um booleano genérico. Isso impede que uma leitura, instrumento ou fallback
 * seja contabilizado como se fosse uma prancha autoral específica.
 */
export function visualCoverageFor(summary: InteractiveSummary): VisualCoverage {
  const board = findBoard(summary);
  if (board) return { kind: 'illustrated-board', id: board.id, dedicated: true };

  const experiment = topicExperiments[summary.id];
  if (experiment) return { kind: 'interactive-experiment', id: experiment, dedicated: true };

  const scene = sceneFor(summary.id);
  if (scene) return { kind: 'anchor-scene', id: scene.family, dedicated: true };

  const instrument = findInstrument(summary);
  if (instrument) return { kind: 'instrument', id: instrument.id, dedicated: true };

  return { kind: 'fallback', id: null, dedicated: false };
}

export function hasDedicatedVisual(summary: InteractiveSummary): boolean {
  return visualCoverageFor(summary).dedicated;
}
