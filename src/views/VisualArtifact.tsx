import React from 'react';
import { SpatialChapterSupplement } from './SpatialChapterSupplement';
import { HumanitiesConcepts } from './HumanitiesConcepts';
import { ChapterSceneFrame } from './ChapterSceneFrame';
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
    <div data-visual-representation={representation} data-study-artifact-mode={mode}
      data-humanities-workspace={summary.subject === 'Geografia' ? 'geography' : summary.subject === 'História' ? 'history' : undefined}>
      <ChapterSceneFrame chapterId={summary.id} subject={summary.subject} title={summary.title} topic={summary.topic}>
      {closeFocus => <>
      {Board && <Board map={map} states={states} selectedId={selectedId} onSelect={id => { closeFocus(); onSelect(id); }} hiddenEdgeIds={hiddenEdgeIds} mode={mode} />}
      {representation === 'experiment' && <TopicExperiment key={summary.id} summaryId={summary.id} />}
      {representation === 'scene' && <TopicScene key={`cena-${summary.id}`} summaryId={summary.id} />}
      {representation === 'fallback' && <TopicFallbackVisual summary={summary} activeIndex={activeIndex} onSelectStep={onSelectStep} />}
      {mode === 'explorar' && <SpatialChapterSupplement key={`espacial-${summary.id}`} chapterId={summary.id} />}
      {mode === 'explorar' &&
        <HumanitiesConcepts map={map} states={states} selectedId={selectedId} onSelect={id => { closeFocus(); onSelect(id); }} />}
      </>}
      </ChapterSceneFrame>
    </div>
  );
}
