import { interactiveSummaries } from '../src/data/interactiveSummaries';
import { findBoard } from '../src/views/visual-boards/registry';
import { findInstrument } from '../src/views/visual-instruments/registry';
import fs from 'node:fs/promises';
import path from 'node:path';

const chapters = interactiveSummaries.map(summary => ({
  id: summary.id, subject: summary.subject, topic: summary.topic, title: summary.title,
  stages: summary.sections.map(section => ({ id: section.id, title: section.title, stage: section.stage, characters: section.content.length })),
  sources: summary.sources.length, questions: summary.retrieval.length,
  topicVisual: true,
  anchorScene: findBoard(summary)?.id ?? findInstrument(summary)?.id ?? null,
}));
const invalid = chapters.filter(chapter => !chapter.stages.length || chapter.stages.some(stage => !stage.characters));
if (invalid.length) throw new Error(`Capítulos sem conteúdo: ${invalid.map(item => item.id).join(', ')}`);
const subjects = [...new Set(chapters.map(chapter => chapter.subject))].map(subject => ({
  subject, chapters: chapters.filter(chapter => chapter.subject === subject).length,
  topicVisuals: chapters.filter(chapter => chapter.subject === subject && chapter.topicVisual).length,
  anchorScenes: chapters.filter(chapter => chapter.subject === subject && chapter.anchorScene).length,
}));
const report = { total: chapters.length, subjects, chapters };
await fs.writeFile(path.resolve('docs/visual-personalizado/04-cobertura-percurso.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ total: report.total, subjects, invalid: invalid.length }, null, 2));
