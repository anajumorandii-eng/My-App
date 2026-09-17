import { interactiveSummaries } from '../src/data/interactiveSummaries';
import fs from 'node:fs/promises';
import path from 'node:path';
import { atlasCoverage } from '../src/lib/topicAtlas';
import { topicExperiments } from '../src/views/topic-experiments/catalog';
import { sceneFor } from '../src/views/topic-scenes/sceneFor';
import { findBoard } from '../src/views/visual-boards/registry';
import { findInstrument } from '../src/views/visual-instruments/registry';
import { visualCoverageFor, type VisualCoverageKind } from '../src/views/visualCoverage';

const chapters = interactiveSummaries.map(summary => {
  const visualCoverage = visualCoverageFor(summary);
  return {
    id: summary.id,
    subject: summary.subject,
    topic: summary.topic,
    title: summary.title,
    stages: summary.sections.map(section => ({
      id: section.id,
      title: section.title,
      stage: section.stage,
      characters: section.content.length,
    })),
    sources: summary.sources.length,
    questions: summary.retrieval.length,
    contentAtlas: atlasCoverage(summary),
    interactiveExperiment: topicExperiments[summary.id] ?? null,
    anchorScene: sceneFor(summary.id)?.family ?? findBoard(summary)?.id ?? findInstrument(summary)?.id ?? null,
    visualCoverage,
  };
});

const invalid = chapters.filter(chapter => !chapter.stages.length || chapter.stages.some(stage => !stage.characters));
if (invalid.length) throw new Error(`Capítulos sem conteúdo: ${invalid.map(item => item.id).join(', ')}`);

const kinds: VisualCoverageKind[] = [
  'illustrated-board',
  'interactive-experiment',
  'anchor-scene',
  'instrument',
  'fallback',
];

const subjects = [...new Set(chapters.map(chapter => chapter.subject))].map(subject => {
  const subset = chapters.filter(chapter => chapter.subject === subject);
  const visualKinds = Object.fromEntries(
    kinds.map(kind => [kind, subset.filter(chapter => chapter.visualCoverage.kind === kind).length]),
  );
  return {
    subject,
    chapters: subset.length,
    contentAtlases: subset.filter(chapter => chapter.contentAtlas.sourceMap).length,
    interactiveExperiments: subset.filter(chapter => chapter.interactiveExperiment).length,
    anchorScenes: subset.filter(chapter => chapter.anchorScene).length,
    dedicatedVisuals: subset.filter(chapter => chapter.visualCoverage.dedicated).length,
    fallbacks: subset.filter(chapter => chapter.visualCoverage.kind === 'fallback').length,
    visualKinds,
  };
});

const totals = {
  dedicatedVisuals: chapters.filter(chapter => chapter.visualCoverage.dedicated).length,
  fallbacks: chapters.filter(chapter => chapter.visualCoverage.kind === 'fallback').length,
  visualKinds: Object.fromEntries(
    kinds.map(kind => [kind, chapters.filter(chapter => chapter.visualCoverage.kind === kind).length]),
  ),
};

const report = { total: chapters.length, totals, subjects, chapters };
await fs.writeFile(
  path.resolve('docs/visual-personalizado/04-cobertura-percurso.json'),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify({ total: report.total, totals, subjects, invalid: invalid.length }, null, 2));
