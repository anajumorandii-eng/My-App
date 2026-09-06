import type { InteractiveSummary } from '../types/summary';
import type { SummaryMaterial } from './summaryMaterials';
import type { CurriculumTopic } from './summaryCurriculum';

export interface SubjectTopicNote { focus: string; application?: string; }

export function slug(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildSubjectSummaries(input: {
  subject: string;
  topics: CurriculumTopic[];
  notes: Record<string, SubjectTopicNote>;
  sourceFile: string;
  idPrefix: string;
  excludeTopics?: Set<string>;
  /**
   * Matérias argumentativas (Filosofia, Sociologia) não têm grandeza, unidade
   * nem equação: sem estes dois ganchos elas herdariam um texto de prova de
   * Exatas. Omitir mantém exatamente o texto usado pelas demais matérias.
   */
  examStrategy?: (topicTitle: string) => string;
  relationKeywords?: string[];
}): { summaries: InteractiveSummary[]; materials: SummaryMaterial[] } {
  const topics = input.topics.filter((topic) => !input.excludeTopics?.has(topic.title));
  const missingNotes = topics.filter((topic) => !input.notes[topic.title]).map((topic) => topic.title);
  if (missingNotes.length) throw new Error(`Conteúdo ausente em ${input.subject}: ${missingNotes.join(', ')}`);
  const boards: InteractiveSummary['boards'] = [
    { board: 'Fuvest', phases: ['primeira', 'segunda'], guidance: 'Defina as grandezas ou conceitos, desenvolva a relação e conclua com interpretação e unidade quando houver.' },
    { board: 'Unicamp/Comvest', phases: ['primeira', 'segunda'], guidance: 'Use Comando, Fonte, Conceito e Relação.' },
    { board: 'Unesp/Vunesp', phases: ['primeira', 'segunda'], guidance: 'Dê a resposta direta, mostre cálculo ou conceito e aplique ao caso.' },
    { board: 'ENEM/Inep', phases: ['unica'] },
  ];
  const materials: SummaryMaterial[] = topics.map((topic) => ({
    id: `material-${topic.id}`,
    subject: input.subject,
    topic: topic.title,
    format: 'apostila',
    sourceFile: input.sourceFile,
    chapter: topic.title,
    uncertain: true,
  }));
  const summaries: InteractiveSummary[] = topics.map((topic) => {
    const note = input.notes[topic.title];
    const prefix = `${input.idPrefix}-${slug(topic.title)}`;
    const titleKeywords = [...new Set(slug(topic.title).split('-').filter((word) => word.length >= 4))].slice(0, 4);
    return {
      id: `summary-${topic.id}`,
      contentStatus: 'roteiro',
      title: topic.title,
      subject: input.subject,
      topic: topic.title,
      priority: 'alta',
      boards,
      prerequisites: [],
      overview: `${topic.track}: ideia central, mecanismo e aplicação de ${topic.title}.`,
      sections: [
        { id: `${prefix}-rapida`, title: 'Ideia central', stage: 'intuicao', depth: 'rapida', content: note.focus },
        { id: `${prefix}-conceito`, title: 'Relações fundamentais', stage: 'conceito', depth: 'aprofundamento', content: `${note.focus} Identifique hipóteses, condições de validade e o que permanece constante antes de aplicar qualquer relação.` },
        { id: `${prefix}-aplicacao`, title: 'Aplicação orientada', stage: 'aplicacao', depth: 'aprofundamento', content: note.application ?? `Relacione ${topic.title} aos dados observáveis, compare casos-limite e verifique se a conclusão é compatível com o mecanismo.` },
        { id: `${prefix}-exercicio`, title: 'Situação de transferência', stage: 'exercicio', depth: 'prova', content: `Uma situação altera uma das condições de ${topic.title}. Preveja o efeito, apresente a relação usada e justifique o sentido da mudança sem consultar o resumo.` },
        { id: `${prefix}-prova`, title: 'Estratégia de prova', stage: 'estrategia', depth: 'prova', content: input.examStrategy?.(topic.title) ?? `Leia comando, figura e unidades; declare o princípio de ${topic.title}; substitua dados somente depois de montar a relação; e interprete o resultado. Uma equação sem explicação não demonstra domínio.` },
      ],
      retrieval: [{
        id: `${prefix}-r1`, sectionId: `${prefix}-exercicio`,
        prompt: `Explique a relação central de ${topic.title}, suas condições de validade e uma consequência observável.`,
        expectedElements: [
          { label: 'conceito ou grandeza central', keywords: titleKeywords.length ? titleKeywords : ['conceito'] },
          { label: 'relação ou mecanismo', keywords: input.relationKeywords ?? ['relação', 'relacao', 'mecanismo', 'proporcional', 'conservação', 'conservacao'] },
          { label: 'consequência contextualizada', keywords: ['resultado', 'efeito', 'consequência', 'consequencia', 'contexto', 'unidade'] },
        ],
        hint: 'Organize em dados e condições → princípio → consequência.',
        transferPrompt: `Se uma condição relevante em ${topic.title} fosse duplicada, anulada ou invertida, o que mudaria? Justifique.`,
      }],
      sources: [{ label: `Apostila indicada — ${topic.title} (volume e páginas pendentes de conferência)`, kind: 'material-interno', materialId: `material-${topic.id}` }],
    };
  });
  return { summaries, materials };
}
