import type { InteractiveSummary } from '../types/summary';
import { topicExperiments } from './topic-experiments/catalog';
import { sceneFor } from './topic-scenes/sceneFor';
import { sceneArtifactId } from './topic-scenes/artifactId';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';
import { HG_AUTHORED_IDS } from './topic-scenes/data/hgLotes';

/**
 * A chapter gets one primary visual artifact at a time.  This prevents a
 * generic scene, a board and an experiment from competing for the student's
 * attention just because they all happen to be registered for the chapter.
 */
export type VisualRepresentation = 'board' | 'experiment' | 'instrument' | 'scene' | 'fallback';

export type VisualArtifactKind = Exclude<VisualRepresentation, 'fallback'>;
export interface VisualCandidate { kind: VisualArtifactKind; id: string }

/**
 * Every artifact registered for the chapter, winner first. The order is the
 * priority: experiments are mapped by exact chapter id and are therefore the
 * most specific interactive artifact; boards and instruments are checked next
 * because their registries match subject/topic text; a scene is the last
 * resort. This is the only place that order lives, so the screen and the
 * coverage matrix cannot disagree about which artifact wins.
 */
export function visualCandidates(summary: InteractiveSummary): VisualCandidate[] {
  const candidates: VisualCandidate[] = [];
  // Exceção à ordem acima: os capítulos de História e Geografia redesenhados
  // depois da auditoria de 26/09 abriam com instrumentos genéricos (três
  // círculos, três caixas num eixo). A cena desenhada para o capítulo vence;
  // o instrumento continua na lista, atrás dela.
  const authored = HG_AUTHORED_IDS.has(summary.id) ? sceneFor(summary.id) : null;
  if (authored) candidates.push({ kind: 'scene', id: sceneArtifactId(authored.chapterId, authored.family) });
  const experiment = topicExperiments[summary.id];
  if (experiment) candidates.push({ kind: 'experiment', id: experiment });
  const board = findBoard(summary);
  if (board) candidates.push({ kind: 'board', id: board.id });
  const instrument = findInstrument(summary);
  if (instrument) candidates.push({ kind: 'instrument', id: instrument.id });
  const scene = authored ? null : sceneFor(summary.id);
  if (scene) candidates.push({ kind: 'scene', id: sceneArtifactId(scene.chapterId, scene.family) });
  return candidates;
}

export function resolveVisualRepresentation(summary: InteractiveSummary): VisualRepresentation {
  return visualCandidates(summary)[0]?.kind ?? 'fallback';
}
