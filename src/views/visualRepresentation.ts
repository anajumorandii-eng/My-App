import type { InteractiveSummary } from '../types/summary';
import { topicExperiments } from './topic-experiments/catalog';
import { sceneFor } from './topic-scenes/sceneFor';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';

/**
 * A chapter gets one primary visual artifact at a time.  This prevents a
 * generic scene, a board and an experiment from competing for the student's
 * attention just because they all happen to be registered for the chapter.
 */
export type VisualRepresentation = 'board' | 'experiment' | 'instrument' | 'scene' | 'fallback';

export function resolveVisualRepresentation(summary: InteractiveSummary): VisualRepresentation {
  // Experiments are mapped by exact chapter id and are therefore the most
  // specific interactive artifact. Boards and instruments are intentionally
  // checked next because their registries match subject/topic text.
  if (topicExperiments[summary.id]) return 'experiment';
  if (findBoard(summary)) return 'board';
  if (findInstrument(summary)) return 'instrument';
  if (sceneFor(summary.id)) return 'scene';
  return 'fallback';
}
