import rawLessons from './currentAffairs/anglo2026.json';
import lessonSources from './currentAffairs/sources2026.json';
import type { InteractiveSummary, SummarySection, SummarySource } from '../types/summary';

interface Lesson {
  id: string;
  lesson: string;
  title: string;
  axis: NonNullable<InteractiveSummary['currentAffairs']>['axis'];
  prerequisites: string[];
  sections: string[];
  prompt: string;
  elements: [string, string[]][];
  transfer: string;
  official?: [string, string][];
}

export const CURRENT_AFFAIRS_REVIEWED_AT = '2026-10-21';

// Apenas referências aos arquivos da estudante: PDFs, extrações e dados da
// marca-d'água ficam fora do repositório público. O texto editorial é autoral.
export function currentAffairsLessonSources(lesson: string): SummarySource[] {
  return lessonSources.filter(source => source.lesson === lesson).map(source => ({
    label: `Anglo Atualidades 2026 · aula ${lesson} · ${source.format} (material de referência)`,
    kind: 'fonte-independente',
    url: source.url,
    verifiedAt: CURRENT_AFFAIRS_REVIEWED_AT,
  }));
}

const sectionTitles = [
  'A — Acontecimento e recorte',
  'T — Tempo, território e mecanismo',
  'U — Unidades políticas, atores e interesses',
  'A — Articulações e armadilhas',
  'L — Leitura de prova e prática autoral',
];
const stages: SummarySection['stage'][] = ['intuicao', 'conceito', 'aplicacao', 'estrategia', 'exercicio'];
const depths: SummarySection['depth'][] = ['rapida', 'aprofundamento', 'aprofundamento', 'prova', 'prova'];

export const currentAffairsInteractiveSummaries: InteractiveSummary[] = (rawLessons as Lesson[]).map(lesson => ({
  id: lesson.id,
  title: lesson.title,
  subject: 'Atualidades',
  topic: lesson.title,
  priority: 'alta',
  prerequisites: lesson.prerequisites,
  overview: `Aula ${lesson.lesson} · síntese A.T.U.A.L. dos materiais de 2026, com prática autoral. ${lesson.sections[0].split(/(?<=\.)\s/)[0]}`,
  currentAffairs: { axis: lesson.axis, verifiedAt: CURRENT_AFFAIRS_REVIEWED_AT },
  boards: [
    { board: 'Fuvest', phases: ['primeira', 'segunda'], guidance: 'Na objetiva, confira fonte, escala e data. Na discursiva, formule uma relação causal com conceito e evidência.' },
    { board: 'Unicamp/Comvest', phases: ['primeira', 'segunda'], guidance: 'Parta do documento, contextualize os atores e diferencie descrição, interpretação e hipótese.' },
    { board: 'Unesp/Vunesp', phases: ['primeira', 'segunda'], guidance: 'Responda ao comando e relacione o conceito ao caso, explicitando o mecanismo.' },
    { board: 'Famerp', phases: ['unica'] },
    { board: 'Unifesp', phases: ['unica', 'segunda'] },
    { board: 'ENEM/Inep', phases: ['unica'] },
  ],
  sections: lesson.sections.map((content, index) => ({
    id: `${lesson.id}-v1-${index + 1}`,
    title: sectionTitles[index],
    stage: stages[index],
    depth: depths[index],
    content,
    ...(index === 0 ? { callout: 'Recorte didático das aulas fornecidas, consultadas em 21/10/2026. A data de consulta não transforma previsões e relatos das aulas em fatos atuais. As situações de prática são autorais, não questões oficiais.' } : {}),
  })),
  retrieval: [{
    id: `${lesson.id}-recall-v1`,
    sectionId: `${lesson.id}-v1-5`,
    prompt: lesson.prompt,
    expectedElements: lesson.elements.map(([label, keywords]) => ({ label, keywords })),
    hint: 'Reconstrua a relação com suas palavras: conceito, mecanismo e consequência. Depois confira o exemplo comentado na leitura de prova.',
    transferPrompt: lesson.transfer,
  }],
  sources: [
    ...currentAffairsLessonSources(lesson.lesson),
    ...(lesson.official ?? []).map(([label, url]): SummarySource => ({
      label, url, kind: 'fonte-oficial', verifiedAt: CURRENT_AFFAIRS_REVIEWED_AT,
    })),
  ],
}));
