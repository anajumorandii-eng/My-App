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
export const literatura: SceneEntry[] = [
  {
    chapterId: 'summary-literatura-segunda-geracao-modernista-prosa',
    family: 'contraste-de-posicoes',
    question: 'O interior brasileiro é cenário pitoresco a ser idealizado, ou condição material que determina a vida de quem nele vive?',
    items: [
      {
        label: 'Regionalismo romântico',
        claim: 'idealizava o interior, tratando-o como cenário pitoresco em vez de condição real de vida',
        section: 'Regionalismo crítico',
        quote: 'Diferente do regionalismo romântico, que idealizava o interior, o romance de 30 expõe a exploração, a fome e a violência estrutural.',
      },
      {
        label: 'Romance de 30',
        claim: 'rejeita o cenário pitoresco: a paisagem é condição que determina a vida das personagens, marcada por exploração, fome e violência estrutural',
        section: 'Regionalismo crítico',
        quote: 'A paisagem não é cenário pitoresco, mas condição que determina a vida das personagens, e a linguagem incorpora falares regionais sem tratá-los como curiosidade.',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-a-estetica-romantica-prosa',
    family: 'tipologia',
    question: 'Em que vertentes se divide a prosa romântica brasileira, e o que todas elas têm em comum?',
    nota: 'Em todas as vertentes, o projeto é o mesmo: construir uma literatura nacional com temas e cenários brasileiros.',
    items: [
      {
        label: 'Urbano',
        claim: 'retrata a vida da corte e os costumes da elite carioca',
        section: 'Romance urbano e indianista',
        quote: 'O romance urbano retrata a vida da corte e os costumes da elite carioca, como em Senhora e Lucíola, de José de Alencar.',
      },
      {
        label: 'Indianista',
        claim: 'constrói o mito de origem nacional, com casais interétnicos como alegoria de fundação',
        section: 'Romance urbano e indianista',
        quote: 'O indianista constrói o mito de origem nacional, como em Iracema e O Guarani, com casais interétnicos como alegoria de fundação.',
      },
      {
        label: 'Regionalista',
        claim: 'descreve tipos e paisagens do interior',
        section: 'Regionalista e histórico',
        quote: 'O romance regionalista descreve tipos e paisagens do interior, como em O Sertanejo e O Gaúcho',
      },
      {
        label: 'Histórico',
        claim: 'recria episódios do passado colonial',
        section: 'Regionalista e histórico',
        quote: 'o histórico recria episódios do passado colonial, como em As Minas de Prata',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-fernando-pessoa',
    family: 'tipologia',
    question: 'Que visões de mundo distintas e completas Pessoa criou através de seus heterônimos?',
    nota: 'O heterônimo tem biografia, estilo, temas e concepção de mundo próprios, funcionando como outro poeta — não é apenas outro nome para o mesmo autor.',
    items: [
      {
        label: 'Alberto Caeiro',
        claim: 'é o mestre bucólico do olhar sem metafísica: ver as coisas como são, sem interpretar',
        section: 'Os três principais',
        quote: 'Alberto Caeiro é o mestre bucólico do olhar sem metafísica: ver as coisas como são, sem interpretar.',
      },
      {
        label: 'Ricardo Reis',
        claim: 'é o clássico epicurista e estoico, com odes sobre a aceitação do destino',
        section: 'Os três principais',
        quote: 'Ricardo Reis é o clássico epicurista e estoico, com odes de métrica contida sobre a aceitação do destino.',
      },
      {
        label: 'Álvaro de Campos',
        claim: 'passa da exaltação futurista da máquina ao tédio e à desilusão',
        section: 'Os três principais',
        quote: 'Álvaro de Campos passa da exaltação futurista da máquina ao tédio e à desilusão.',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-trovadorismo-e-humanismo',
    family: 'tipologia',
    question: 'Em que tipos se dividem as cantigas líricas e as cantigas satíricas do Trovadorismo?',
    items: [
      {
        label: 'Cantiga de amor',
        claim: 'eu lírico masculino em vassalagem amorosa à dama inacessível',
        section: 'Trovadorismo',
        quote: 'cantiga de amor, com eu lírico masculino em vassalagem amorosa à dama inacessível',
      },
      {
        label: 'Cantiga de amigo',
        claim: 'eu lírico feminino, ambiente rural e tom popular',
        section: 'Trovadorismo',
        quote: 'cantiga de amigo, com eu lírico feminino, ambiente rural e tom popular',
      },
      {
        label: 'Cantiga de escárnio',
        claim: 'crítica indireta e ironia, sem identificar o alvo',
        section: 'Cantigas satíricas',
        quote: 'cantiga de escárnio, com crítica indireta e ironia, sem identificar o alvo',
      },
      {
        label: 'Cantiga de maldizer',
        claim: 'crítica direta, com nome explícito e linguagem agressiva',
        section: 'Cantigas satíricas',
        quote: 'cantiga de maldizer, com crítica direta, nome explícito e linguagem agressiva',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-vanguardas-artisticas',
    family: 'tipologia',
    question: 'Que procedimentos distintos cada vanguarda europeia do início do século XX escolheu para romper com a representação tradicional?',
    items: [
      {
        label: 'Futurismo',
        claim: 'exalta a máquina, a velocidade e a guerra',
        section: 'As principais correntes',
        quote: 'O Futurismo exalta a máquina, a velocidade e a guerra, com Marinetti.',
      },
      {
        label: 'Cubismo',
        claim: 'decompõe o objeto em planos simultâneos',
        section: 'As principais correntes',
        quote: 'O Cubismo decompõe o objeto em planos simultâneos, com Picasso.',
      },
      {
        label: 'Expressionismo',
        claim: 'deforma para expressar angústia',
        section: 'As principais correntes',
        quote: 'O Expressionismo deforma para expressar angústia.',
      },
      {
        label: 'Dadaísmo',
        claim: 'nega a própria arte com o acaso e o absurdo',
        section: 'As principais correntes',
        quote: 'O Dadaísmo nega a própria arte com o acaso e o absurdo.',
      },
      {
        label: 'Surrealismo',
        claim: 'explora o inconsciente, o sonho e a escrita automática',
        section: 'As principais correntes',
        quote: 'O Surrealismo explora o inconsciente, o sonho e a escrita automática.',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-poesia-brasileira-contemporanea',
    family: 'tipologia',
    question: 'Já que a poesia brasileira recente não tem escola dominante, que vertentes convivem sem hierarquia entre si?',
    nota: 'Buscar uma escola dominante para o período é o erro conceitual central: a pluralidade é a característica.',
    items: [
      {
        label: 'Sem movimento dominante',
        claim: 'a poesia das últimas décadas não se organiza em torno de um movimento dominante',
        section: 'Pluralidade',
        quote: 'A poesia brasileira das últimas décadas não se organiza em torno de um movimento dominante.',
      },
      {
        label: 'Slam e oralidade',
        claim: 'recoloca a performance no centro: o poema é escrito para ser dito, com atenção ao ritmo e à interação com o público',
        section: 'Slam e oralidade',
        quote: 'o poema é escrito para ser dito, com atenção ao ritmo, à respiração e à interação com o público',
      },
      {
        label: 'Circulação digital',
        claim: 'a internet permite publicação sem intermediários, ampliando o alcance de autores fora do circuito editorial',
        section: 'Circulação',
        quote: 'A internet alterou a circulação: redes sociais, blogs e plataformas permitem publicação sem intermediários, ampliando o alcance de autores fora do circuito editorial.',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-poesia-brasileira-1960-1980',
    family: 'tipologia',
    question: 'Além da poesia marginal, que outras vertentes convivem na poesia brasileira de 1960 a 1980?',
    items: [
      {
        label: 'Concretismo, poema-processo e práxis',
        claim: 'convivem no período o desdobramento do concretismo, o poema-processo e a poesia práxis',
        section: 'Outras vertentes',
        quote: 'Convivem no período o desdobramento do concretismo, o poema-processo, a poesia práxis',
      },
      {
        label: 'Ferreira Gullar',
        claim: 'passa do concretismo ao Poema Sujo, escrito no exílio',
        section: 'Outras vertentes',
        quote: 'a produção de Ferreira Gullar, que passa do concretismo ao Poema Sujo, escrito no exílio',
      },
      {
        label: 'Adélia Prado',
        claim: 'traz lirismo do cotidiano e do corpo, ampliando as vozes reconhecidas na poesia brasileira',
        section: 'Outras vertentes',
        quote: 'a obra de Adélia Prado, com lirismo do cotidiano e do corpo, ampliando as vozes reconhecidas na poesia brasileira',
      },
    ],
  },
  {
    chapterId: 'summary-literatura-prosa-brasileira-contemporanea',
    family: 'tipologia',
    question: 'Que formas narrativas convivem na prosa brasileira contemporânea?',
    items: [
      {
        label: 'Realismo e fragmentação',
        claim: 'convivem o realismo, a autoficção e a fragmentação',
        section: 'Formas',
        quote: 'Convivem o realismo, a autoficção, a fragmentação',
      },
      {
        label: 'Hibridação com jornalismo e ensaio',
        claim: 'a prosa se hibridiza com jornalismo e ensaio',
        section: 'Formas',
        quote: 'a hibridação com jornalismo e ensaio',
      },
      {
        label: 'Linguagens digitais',
        claim: 'incorpora linguagens digitais',
        section: 'Formas',
        quote: 'a incorporação de linguagens digitais',
      },
    ],
  },
];

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
