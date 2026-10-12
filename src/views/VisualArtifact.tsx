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
import type { StageMode } from './visual-stage/contract';

/** Camada do palco: a cena principal ou o modelo espacial do capítulo. */
export type StageLayerId = 'principal' | 'espacial';

interface VisualArtifactProps {
  summary: InteractiveSummary;
  representation: VisualRepresentation;
  map: VisualMap;
  states: Record<string, NodeState>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  hiddenEdgeIds: string[];
  mode: StageMode;
  activeIndex: number;
  onSelectStep: (index: number) => void;
  /** Sem camada, monta as duas em sequência (comportamento anterior ao palco). */
  layer?: StageLayerId;
  focusTarget?: string | null;
}

/**
 * O único lugar que escolhe entre prancha, instrumento, experimento, cena ou
 * aviso honesto. Repassa às pranchas o contrato do palco (`StageSceneProps`):
 * as que ainda não o leem ignoram os campos extras, sem quebrar.
 */
export function VisualArtifact({
  summary, representation, map, states, selectedId, onSelect, hiddenEdgeIds,
  mode, activeIndex, onSelectStep, layer, focusTarget = null,
}: VisualArtifactProps) {
  const Board = representation === 'board'
    ? findBoard(summary)?.Component ?? null
    : representation === 'instrument'
      ? findInstrument(summary)?.Component ?? null
      : null;
  const showMain = layer !== 'espacial';
  const showSpatial = mode === 'explorar' && layer !== 'principal';

  return (
    <div data-visual-representation={representation} data-study-artifact-mode={mode} data-stage-layer={layer}
      data-humanities-workspace={summary.subject === 'Geografia' ? 'geography' : summary.subject === 'História' ? 'history' : undefined}>
      <ChapterSceneFrame chapterId={summary.id} subject={summary.subject} title={summary.title} topic={summary.topic}>
      {closeFocus => <>
      {showMain && Board && <Board map={map} states={states} selectedId={selectedId} onSelect={id => { closeFocus(); onSelect(id); }}
        hiddenEdgeIds={hiddenEdgeIds} mode={mode}
        activeStep={activeIndex} onStepChange={onSelectStep} challengeActive={mode !== 'explorar'} focusTarget={focusTarget} />}
      {showMain && representation === 'experiment' && <TopicExperiment key={summary.id} summaryId={summary.id} />}
      {showMain && representation === 'scene' && <TopicScene key={`cena-${summary.id}`} summaryId={summary.id}
        stage={{ map, sections: summary.sections, activeStep: activeIndex, onStepChange: onSelectStep, selectedId, onSelect, mode, hiddenEdgeIds }} />}
      {showMain && representation === 'fallback' && <TopicFallbackVisual summary={summary} activeIndex={activeIndex} onSelectStep={onSelectStep} />}
      {showSpatial && <SpatialChapterSupplement key={`espacial-${summary.id}`} chapterId={summary.id} />}
      {mode === 'explorar' &&
        <HumanitiesConcepts map={map} states={states} selectedId={selectedId} onSelect={id => { closeFocus(); onSelect(id); }} />}
      </>}
      </ChapterSceneFrame>
    </div>
  );
}
