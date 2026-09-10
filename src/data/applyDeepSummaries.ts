import chapters from './deepSummaryContent.json';
import { deepSummaryRetrieval } from './deepSummaryRetrieval';
import type { InteractiveSummary, SummarySection } from '../types/summary';

// O JSON e escrito a mao; declarar o formato aqui evita que o TypeScript
// deduza uma uniao de formatos quando so parte dos capitulos traz recall.
type DeepChapter = {
  subject: string; topic: string;
  sections: { title: string; content: string }[];
  recall?: { prompt: string; elements: [string, string[]][] };
  // Sobe a cada reescrita do texto do capitulo. Entra nos ids das secoes, para
  // que so o capitulo reescrito volte a pedir leitura em vez de todos.
  rev?: number;
};

const editorial = new Map((chapters as DeepChapter[]).map(c => [`${c.subject}|${c.topic}`, c]));
export function applyDeepSummary(summary: InteractiveSummary): InteractiveSummary {
  const chapter = editorial.get(`${summary.subject}|${summary.topic}`);
  if (!chapter) return summary;
  // A pergunta de recuperacao vem junto com o capitulo; deepSummaryRetrieval
  // guarda as escritas antes deste formato existir. Sem uma das duas o resumo
  // perde o ciclo de estudo, e foi assim que 111 resumos ficaram sem pergunta.
  const recall = chapter.recall ?? deepSummaryRetrieval[chapter.topic];
  const rev = chapter.rev ?? 1;
  const stages: SummarySection['stage'][] = ['intuicao', 'conceito', 'aplicacao', 'estrategia', 'exercicio'];
  const depths: SummarySection['depth'][] = ['rapida', 'aprofundamento', 'aprofundamento', 'prova', 'prova'];
  return {
    ...summary,
    contentStatus: 'aprofundado',
    overview: chapter.sections[0].content.split(/(?<=\.)\s/).slice(0,2).join(' '),
    sections: chapter.sections.map((section, i) => ({ ...section,
      // A new revision must be read again; do not count the old one-line section as read.
      id: `${summary.id}-editorial-v${rev}-${i+1}`, stage: stages[i], depth: depths[i] })),
    // Existing automated keyword prompts were generated from topic titles and
    // did not assess this new content. Use the worked practice section instead.
    retrieval: recall ? [{ id: `${summary.id}-editorial-recall-v${rev}`, sectionId: `${summary.id}-editorial-v${rev}-${chapter.sections.length}`,
      prompt: recall.prompt, expectedElements: recall.elements.map(([label, keywords]) => ({ label, keywords })),
      hint: `Retome a explicação “${chapter.sections[1].title}” e reconstrua as relações com suas palavras.`,
      transferPrompt: `Crie um exemplo diferente para demonstrar a mesma relação e justifique sua resposta.` }] : [],
    sources: [{ label: 'Síntese didática editorial com exemplos autorais. As situações de prática não são questões oficiais.', kind: 'fonte-independente' }],
  };
}
