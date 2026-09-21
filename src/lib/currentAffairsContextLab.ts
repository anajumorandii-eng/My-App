import type { GeographyContext } from './geographyContextLab';

/**
 * Mesmo laboratório de três recortes comparáveis de `geographyContextLab.ts`,
 * para capítulos de Atualidades — que também são leituras territoriais e
 * políticas, só que datadas. Fica em arquivo e tipo próprios porque o
 * assunto (`Atualidades`) é outro: `findInstrument` casa por matéria, e
 * misturar os dois na mesma tabela obrigaria o teste de
 * `GeographyContextInstrument.test.tsx` — que confere `subject === 'Geografia'`
 * em cada entrada — a aceitar uma matéria que não é geografia.
 */
export type CurrentAffairsContextId = 'cop30-belem';

export const CURRENT_AFFAIRS_CONTEXTS: Record<CurrentAffairsContextId, GeographyContext> = {
  'cop30-belem': {
    chapterId: 'atu-cop30-belem',
    title: 'COP30: decisão formal e avaliação crítica',
    question: 'O que a COP30 decidiu formalmente em Belém — e o que ficou de fora, segundo a leitura crítica dos resultados?',
    relation: 'decisão formal + território e atores + avaliação crítica → leitura da COP30',
    cases: [
      { label: 'Decisão', location: 'Pacote Político de Belém', observation: 'A COP30 ocorreu em Belém (PA) de 10 a 22 de novembro de 2025 e resultou no Pacote Político de Belém, com decisões de financiamento registradas pela UNFCCC.', conclusion: 'Houve avanço formal em cooperação e financiamento, sem uma rota explícita para abandonar combustíveis fósseis.' },
      { label: 'Território', location: 'Amazônia e atores', observation: 'A conferência aconteceu em território amazônico, dez anos após o Acordo de Paris, conectando a escala global a povos indígenas e à urbanização local.', conclusion: 'Países com responsabilidades e capacidades diferentes negociaram por coalizões, não como um bloco único.' },
      { label: 'Avaliação', location: 'Limites e leitura crítica', observation: 'Compare o texto formal do pacote com a avaliação de cientistas e organizações sobre sua ambição.', conclusion: '"Fracasso total" e "sucesso pleno" simplificam: o resultado combina avanço real e ambição incompleta.' },
    ],
    // As datas e o nome do pacote reproduzem só o que já está verificado em
    // `interactiveSummaries.ts` (seções cop-a a cop-h, com fontes da UNFCCC,
    // Nature e AP) — nenhum número novo entra aqui.
    caution: 'Leitura baseada nas fontes verificadas do dossiê; não substitui o texto integral do Pacote Político de Belém.',
  },
};
