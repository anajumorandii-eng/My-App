import React from 'react';
import type { NodeState, VisualMap } from '../lib/visualStudy';
import type { InteractiveSummary } from '../types/summary';
import { TopicFallbackVisual } from './TopicFallbackVisual';
import { TopicExperiment } from './topic-experiments/TopicExperiment';
import { TopicScene } from './topic-scenes/TopicScene';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';
import type { VisualRepresentation } from './visualRepresentation';

type StudyMode = 'explorar' | 'testar' | 'reconstruir';

interface VisualArtifactProps {
  summary: InteractiveSummary;
  representation: VisualRepresentation;
  map: VisualMap;
  states: Record<string, NodeState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hiddenEdgeIds: string[];
  mode: StudyMode;
  activeIndex: number;
  onSelectStep: (index: number) => void;
}

/**
 * The chapter's single visual artifact, separated from the guided reading.
 *
 * This adapter is deliberately the only place that chooses among a board,
 * instrument, experiment, scene, or honest fallback. It lets Explore and
 * Rebuild work on the same object without making a recall answer visible in
 * Test mode.
 */
export function VisualArtifact({
  summary, representation, map, states, selectedId, onSelect, hiddenEdgeIds,
  mode, activeIndex, onSelectStep,
}: VisualArtifactProps) {
  const Board = representation === 'board'
    ? findBoard(summary)?.Component ?? null
    : representation === 'instrument'
      ? findInstrument(summary)?.Component ?? null
      : null;

  return (
    <div data-visual-representation={representation} data-study-artifact-mode={mode}>
      {Board && <Board map={map} states={states} selectedId={selectedId} onSelect={onSelect} hiddenEdgeIds={hiddenEdgeIds} mode={mode} />}
      {representation === 'experiment' && <TopicExperiment key={summary.id} summaryId={summary.id} />}
      {representation === 'scene' && <TopicScene key={`cena-${summary.id}`} summaryId={summary.id} />}
      {representation === 'fallback' && <TopicFallbackVisual summary={summary} activeIndex={activeIndex} onSelectStep={onSelectStep} />}
    </div>
  );
}
