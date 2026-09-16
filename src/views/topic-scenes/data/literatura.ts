import type { SceneEntry } from '../types';

/** Capítulos de Literatura sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Estado ao fim da Task 1: `literatura` fica vazio de propósito — escrever as
 *  `SceneEntry` reais é trabalho da Task seguinte. A atribuição definitiva dos
 *  37 capítulos (famílias e lacunas) está em
 *  docs/visual-personalizado/11-familias-literatura.md; esta lista de lacunas
 *  já reflete essa leitura por completo, para que a próxima Task só precise
 *  escrever as 8 entradas com família, sem redecidir nada. */
export const literatura: SceneEntry[] = [];

export const literaturaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-literatura-texto-literario-x-texto-nao-literario',
    motivo: 'Já tem experiência interativa própria (literary) no catálogo de topic-experiments.',
  },
  {
    chapterId: 'summary-literatura-a-arte-e-suas-linguagens',
    motivo: 'Capítulo introdutório e definicional (o que é arte, linguagens artísticas, função social); a enumeração de linguagens não tem guarda-chuva de tipologia ("divide-se em"/"convivem") nem fecha com afirmação unificadora sobre as variantes.',
  },
  {
    chapterId: 'summary-literatura-a-estetica-barroca',
    motivo: 'Cultismo e conceptismo são distinguidos claramente, mas sem frase-guarda-chuva que os apresente como categoria comum antes da enumeração, e sem rejeição mútua (coexistem em gêneros diferentes: poesia e sermão).',
  },
  {
    chapterId: 'summary-literatura-a-estetica-neoclassica',
    motivo: 'Os cinco lemas árcades (inutilia truncat, fugere urbem, locus amoenus, carpe diem, aurea mediocritas) são uma lista de preceitos estéticos, não tipos que se excluem ou se ordenam, nem cadeia causal.',
  },
  {
    chapterId: 'summary-literatura-a-estetica-realista',
    motivo: 'Realismo e Naturalismo são descritos como correntes contemporâneas e distintas ("distinguem-se"), sem rejeição mútua nem guarda-chuva de tipologia que os una como variantes.',
  },
  {
    chapterId: 'summary-literatura-a-estetica-romantica-poesia',
    motivo: 'As três gerações são momentos históricos com temas distintos (indianismo, pessimismo, engajamento social), não graus ordenados de uma mesma variável nem tipos coexistentes sem hierarquia temporal.',
  },
  {
    chapterId: 'summary-literatura-artes-plasticas-brasileiras',
    motivo: 'Narrativa cronológica de movimentos artísticos (acadêmico, modernista, neoconcreto, contemporâneo); os períodos se sucedem, não coexistem como tipos nem se derivam causalmente um do outro no texto.',
  },
  {
    chapterId: 'summary-literatura-brasil-primeiros-registros',
    motivo: 'Narrativa histórica sobre os primeiros registros escritos e a literatura jesuítica; descrição documental sem rivalidade, tipologia, camada ou cadeia causal.',
  },
  {
    chapterId: 'summary-literatura-cancioneiro-popular-brasileiro',
    motivo: 'A lista de momentos musicais (samba, bossa nova, tropicália, protesto, rap/funk) é sucessão cronológica de gêneros, não tipologia com guarda-chuva de coexistência simultânea.',
  },
  {
    chapterId: 'summary-literatura-carlos-drummond-de-andrade',
    motivo: 'As fases da obra (gauchismo irônico, fase social, fase metafísica) são períodos cronológicos da trajetória do poeta, sem grandeza ordinal nem derivação causal entre elas.',
  },
  {
    chapterId: 'summary-literatura-clarice-lispector',
    motivo: 'Descreve procedimento narrativo (epifania, fluxo de consciência) e obras; não há rivalidade, tipologia com guarda-chuva, camada ou cadeia causal sustentada por frase específica.',
  },
  {
    chapterId: 'summary-literatura-elementos-da-narrativa',
    motivo: 'É um glossário de conceitos narratológicos em pares definicionais (personagem plana/redonda, caracterização direta/indireta, tempo cronológico/psicológico); pares de definição, não tipologia com variantes coexistentes nem rivalidade.',
  },
  {
    chapterId: 'summary-literatura-graciliano-ramos',
    motivo: 'Descreve obras (Vidas Secas, São Bernardo, Angústia, Memórias do Cárcere) lado a lado, cada uma com foco próprio; não há guarda-chuva de tipologia nem derivação causal entre elas.',
  },
  {
    chapterId: 'summary-literatura-guimaraes-rosa',
    motivo: 'Descreve invenção de linguagem, Grande Sertão: Veredas e os contos como temas paralelos, sem estrutura de família única sustentada por uma frase específica.',
  },
  {
    chapterId: 'summary-literatura-joao-cabral-de-melo-neto',
    motivo: 'Descreve obras (Morte e Vida Severina, O Cão sem Plumas, O Rio, Educação pela Pedra) lado a lado, sem tipologia com guarda-chuva nem cadeia causal.',
  },
  {
    chapterId: 'summary-literatura-literatura-lusofona-contemporanea',
    motivo: 'Organiza por região geográfica (África lusófona, Portugal), não por tipos com guarda-chuva de classificação; a pegadinha avisa que a lusofonia não é bloco homogêneo, o oposto de tipologia coesa.',
  },
  {
    chapterId: 'summary-literatura-machado-de-assis',
    motivo: 'A impossibilidade de afirmar a traição de Capitu é cautela interpretativa contra um fato não comprovado, não rivalidade entre duas posições teóricas que se excluem mutuamente; as "duas fases" são sucessão cronológica sem grandeza ordinal.',
  },
  {
    chapterId: 'summary-literatura-modernismo-no-brasil-primeira-geracao',
    motivo: 'Pau-Brasil e Antropofagia se opõem a Verde-Amarelo e Anta como correntes conviventes do mesmo momento, mas o texto não tem frase de rejeição explícita de uma pela outra, só o aviso de que nem todo modernismo de 22 era progressista.',
  },
  {
    chapterId: 'summary-literatura-naturalismo',
    motivo: 'O tripé determinista (meio, raça, momento) condiciona a conduta em conjunto, mas o texto nunca afirma que nenhum fator isolado basta (não sustenta criterios-conjuntivos), e os três fatores são paralelos, não uma base assimétrica que condiciona camadas superiores (não sustenta camadas-de-determinacao).',
  },
  {
    chapterId: 'summary-literatura-parnasianismo',
    motivo: 'Descreve o programa estético (arte pela arte, rigor formal) e a tríade de nomes; não há tipologia com guarda-chuva, rivalidade com rejeição, camada ou cadeia causal.',
  },
  {
    chapterId: 'summary-literatura-poesia-concreta',
    motivo: 'Descreve um único movimento (projeto, procedimentos, contexto), sem enumeração de variantes coexistentes nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-literatura-prosa-brasileira-1960-1980',
    motivo: 'Descreve estratégias de resposta à censura (alegoria, fantástico, fragmentação) lado a lado, sem tipologia com guarda-chuva explícito nem cadeia causal instrumental entre elas.',
  },
  {
    chapterId: 'summary-literatura-pre-modernismo',
    motivo: 'A tensão entre "linguagem ainda marcada pelo academicismo" e "busca de coloquialidade e ironia" é par de dois polos em tensão, não enumeração de três ou mais tipos coexistentes sem hierarquia, e não há frase de rejeição mútua que sustente contraste-de-posicoes.',
  },
  {
    chapterId: 'summary-literatura-realismo-portugues-eca-de-queiros',
    motivo: 'Descreve três romances (O Crime do Padre Amaro, O Primo Basílio, Os Maias), cada um com crítica social própria, lado a lado; não há tipologia com guarda-chuva nem cadeia causal.',
  },
  {
    chapterId: 'summary-literatura-renascimento-e-camoes',
    motivo: 'A estrutura de Os Lusíadas (proposição, invocação, dedicatória, narração, epílogo) é uma sequência de partes compositivas fixas de um gênero, não uma cadeia causal instrumental nem escala de graus.',
  },
  {
    chapterId: 'summary-literatura-segunda-geracao-modernista-poesia',
    motivo: 'Descreve o "amadurecimento" da poesia de 30/40 como mudança de tom em relação a 22, sem grandeza ordinal explícita nem tipologia com guarda-chuva de variantes coexistentes.',
  },
  {
    chapterId: 'summary-literatura-semana-de-arte-moderna',
    motivo: 'Narrativa de evento histórico; "Dela decorrem manifestos e revistas" é um único elo causal, insuficiente para uma cadeia de derivação (que exige vários elos, cada um decorrendo do anterior).',
  },
  {
    chapterId: 'summary-literatura-simbolismo',
    motivo: 'O texto avisa explicitamente que Simbolismo e Parnasianismo são contemporâneos, não sucessivos, o oposto de uma rivalidade com rejeição mútua; não há outra família sustentada por frase específica.',
  },
  {
    chapterId: 'summary-literatura-teatro-brasileiro',
    motivo: 'Narrativa cronológica de movimentos teatrais (catequético, comédia de costumes, Nelson Rodrigues, Teatro de Arena e Oficina); sucessão histórica, sem tipologia com guarda-chuva nem cadeia causal.',
  },
];
