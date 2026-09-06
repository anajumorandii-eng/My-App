import chapters from './deepSummaryContent.json';
import { deepSummaryRetrieval } from './deepSummaryRetrieval';
import type { InteractiveSummary, SummarySection } from '../types/summary';

const editorial = new Map(chapters.map(c => [`${c.subject}|${c.topic}`, c]));
export function applyDeepSummary(summary: InteractiveSummary): InteractiveSummary {
  const chapter = editorial.get(`${summary.subject}|${summary.topic}`);
  if (!chapter) return summary;
  const recall = deepSummaryRetrieval[chapter.topic];
  const stages: SummarySection['stage'][] = ['intuicao', 'conceito', 'aplicacao', 'estrategia', 'exercicio'];
  const depths: SummarySection['depth'][] = ['rapida', 'aprofundamento', 'aprofundamento', 'prova', 'prova'];
  return {
    ...summary,
    contentStatus: 'aprofundado',
    overview: chapter.sections[0].content.split(/(?<=\.)\s/).slice(0,2).join(' '),
    sections: chapter.sections.map((section, i) => ({ ...section,
      // A new revision must be read again; do not count the old one-line section as read.
      id: `${summary.id}-editorial-v1-${i+1}`, stage: stages[i], depth: depths[i] })),
    // Existing automated keyword prompts were generated from topic titles and
    // did not assess this new content. Use the worked practice section instead.
    retrieval: recall ? [{ id: `${summary.id}-editorial-recall-v1`, sectionId: `${summary.id}-editorial-v1-5`,
      prompt: recall.prompt, expectedElements: recall.elements.map(([label, keywords]) => ({ label, keywords })),
      hint: `Retome a explicação “${chapter.sections[1].title}” e reconstrua as relações com suas palavras.`,
      transferPrompt: `Crie um exemplo diferente para demonstrar a mesma relação e justifique sua resposta.` }] : [],
    sources: [{ label: 'Síntese didática editorial com exemplos autorais. As situações de prática não são questões oficiais.', kind: 'fonte-independente' }],
  };
}
