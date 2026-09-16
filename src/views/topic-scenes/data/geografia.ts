import type { SceneEntry } from '../types';

/** Capítulos de Geografia sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Estado ao fim da Task 1: só a lacuna já conhecida antes da leitura. A
 *  atribuição definitiva dos 63 capítulos (famílias e lacunas adicionais)
 *  está em docs/visual-personalizado/10-familias-geografia.md — as Tasks
 *  2-4 preenchem `geografia` e completam `geografiaSemCena` a partir dali. */
export const geografiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-geografia-coordenadas-geograficas',
    motivo: 'Já tem experiência interativa própria (coordinates) no catálogo de topic-experiments.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4
 *  preenchem esta lista, família por família, seguindo a atribuição
 *  definitiva do documento de famílias. */
export const geografia: SceneEntry[] = [
  // Task 2 — família contraste-de-posicoes (1 capítulo)
  {
    chapterId: 'summary-geografia-paisagem-espaco-geografico-e-ciencia-geografica',
    family: 'contraste-de-posicoes',
    question: 'O meio natural determina o destino das sociedades, ou apenas oferece possibilidades que elas escolhem explorar?',
    items: [
      {
        label: 'Determinismo',
        claim: 'o meio natural teria papel decisivo no destino das sociedades — uma visão hoje amplamente rejeitada por simplificar relações complexas',
        section: 'Correntes do pensamento geográfico',
        quote: 'a corrente determinista (que atribuía ao meio natural papel decisivo na determinação das características e do destino das sociedades humanas, uma visão hoje amplamente rejeitada por simplificar excessivamente relações complexas)',
      },
      {
        label: 'Possibilismo',
        claim: 'o meio natural é um conjunto de possibilidades que as sociedades escolhem explorar ou não, valorizando a agência humana',
        section: 'Correntes do pensamento geográfico',
        quote: 'a corrente possibilista francesa (que via o meio natural como um conjunto de possibilidades que as sociedades escolhem explorar ou não, valorizando mais a agência humana e cultural sobre a determinação ambiental)',
      },
      {
        label: 'Geografia crítica',
        claim: 'desloca o foco para as relações de poder, as desigualdades sociais e os processos econômicos como chaves explicativas centrais do espaço',
        section: 'Correntes do pensamento geográfico',
        quote: 'a geografia crítica, influenciada pelo materialismo histórico marxista, passou a enfatizar as relações de poder, as desigualdades sociais e os processos econômicos como chaves explicativas centrais da organização do espaço geográfico',
      },
    ],
  },
  // Task 2 — família camadas-de-determinacao (2 capítulos)
  {
    chapterId: 'summary-geografia-o-espaco-industrial-brasileiro-i',
    family: 'camadas-de-determinacao',
    question: 'O que deu a São Paulo a base para se tornar o polo industrial concentrador do Brasil?',
    items: [
      {
        label: 'Capital cafeeiro',
        claim: 'a industrialização paulista partiu do capital acumulado pelo café e da infraestrutura ferroviária e portuária já construída para escoá-lo',
        section: 'Concentração no Sudeste',
        quote: 'capital originado da economia cafeeira disponível para investimento industrial, infraestrutura ferroviária e portuária já construída para escoar o café',
      },
      {
        label: 'Efeito cumulativo',
        claim: 'essa base gerou retroalimentação: a presença de indústrias atraía fornecedores e prestadores de serviços especializados, que por sua vez atraíam mais indústrias',
        section: 'Concentração no Sudeste',
        quote: 'Essa concentração criou um efeito cumulativo de retroalimentação: a presença de indústrias atraía fornecedores e prestadores de serviços especializados, que por sua vez atraíam mais indústrias',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-o-espaco-urbano-ii',
    family: 'camadas-de-determinacao',
    question: 'A segregação socioespacial é causa ou consequência das desigualdades de acesso na cidade?',
    items: [
      {
        label: 'Segregação',
        claim: 'populações de renda mais alta se concentram em áreas com melhor infraestrutura, serviços e segurança, e as de renda mais baixa em periferias ou áreas degradadas',
        section: 'Segregação socioespacial',
        quote: 'populações de renda mais alta concentram-se em áreas com melhor infraestrutura, serviços e segurança, enquanto populações de renda mais baixa concentram-se em periferias ou áreas centrais degradadas com infraestrutura deficiente',
      },
      {
        label: 'Emprego e educação',
        claim: 'a segregação afeta o acesso a empregos pela distância e o tempo de deslocamento, e a qualidade da educação pela concentração de escolas melhores em áreas de maior arrecadação',
        section: 'Segregação socioespacial',
        quote: 'afeta o acesso a empregos (pela distância física e pelo tempo de deslocamento), a qualidade da educação (pela concentração de escolas melhor equipadas em áreas de maior arrecadação tributária local)',
      },
      {
        label: 'Violência urbana',
        claim: 'a segregação também condiciona a exposição à violência urbana, mais intensa em áreas de maior vulnerabilidade social',
        section: 'Segregação socioespacial',
        quote: 'a exposição a violência urbana, que tende a ser mais intensa em áreas de maior vulnerabilidade social e menor presença de serviços públicos',
      },
    ],
  },
  // Task 2 — família escala-de-graus (4 capítulos)
  {
    chapterId: 'summary-geografia-blocos-economicos',
    family: 'escala-de-graus',
    question: 'Como os blocos econômicos avançam, em graus, rumo a uma integração mais profunda?',
    eixo: 'do grau mais baixo (zona de livre comércio) ao mais profundo (união econômica e monetária)',
    items: [
      {
        label: 'Livre comércio',
        claim: 'elimina tarifas entre os membros, mas cada país mantém política comercial própria com países de fora do bloco',
        section: 'Graus de integração',
        quote: 'a zona de livre comércio elimina tarifas alfandegárias entre os países membros, mas cada um mantém sua própria política comercial independente em relação a países de fora do bloco',
      },
      {
        label: 'União aduaneira',
        claim: 'além de eliminar tarifas internas, estabelece uma tarifa externa comum para produtos vindos de fora do bloco',
        section: 'Graus de integração',
        quote: 'a união aduaneira, além de eliminar tarifas internas, estabelece uma tarifa externa comum, unificada entre todos os membros, para produtos vindos de fora do bloco',
      },
      {
        label: 'Mercado comum',
        claim: 'acrescenta a livre circulação de serviços, capitais e pessoas, além de bens',
        section: 'Graus de integração',
        quote: 'o mercado comum acrescenta a livre circulação não apenas de bens, mas também de serviços, capitais e pessoas (trabalhadores) entre os países membros',
      },
      {
        label: 'União monetária',
        claim: 'o grau mais profundo e exigente, com moeda única compartilhada e coordenação estreita de políticas econômicas e fiscais',
        section: 'Graus de integração',
        quote: 'a união econômica e monetária, o grau mais profundo e exigente de integração, acrescenta ainda a adoção de uma moeda única compartilhada e a coordenação estreita de políticas econômicas e fiscais entre todos os países membros do bloco',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-dinamica-demografica',
    family: 'escala-de-graus',
    question: 'Quais fases a transição demográfica percorre, das taxas altas de natalidade e mortalidade ao equilíbrio final em taxas baixas?',
    eixo: 'da fase 1 (natalidade e mortalidade altas) à fase 4 (ambas baixas)',
    items: [
      {
        label: 'Fase 1',
        claim: 'natalidade e mortalidade são altas e se equilibram',
        section: 'Transição demográfica',
        quote: 'na primeira, natalidade e mortalidade são altas e se equilibram',
      },
      {
        label: 'Fase 2',
        claim: 'a mortalidade cai primeiro, por avanços em saneamento, vacinação e medicina, enquanto a natalidade permanece alta, gerando explosão demográfica',
        section: 'Transição demográfica',
        quote: 'na segunda, a mortalidade cai primeiro, por avanços em saneamento, vacinação e medicina, enquanto a natalidade permanece alta, gerando explosão demográfica',
      },
      {
        label: 'Fase 3',
        claim: 'a natalidade também cai, por urbanização, inserção da mulher no mercado de trabalho e acesso a métodos contraceptivos',
        section: 'Transição demográfica',
        quote: 'na terceira fase, a natalidade também cai, por urbanização, inserção da mulher no mercado de trabalho, acesso a métodos contraceptivos e custo maior de criar filhos na cidade',
      },
      {
        label: 'Fase 4',
        claim: 'ambas as taxas ficam baixas e estáveis, com crescimento vegetativo próximo de zero ou negativo',
        section: 'Transição demográfica',
        quote: 'na quarta, ambas as taxas ficam baixas e estáveis, com crescimento vegetativo próximo de zero ou negativo',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-o-espaco-urbano-i',
    family: 'escala-de-graus',
    question: 'Como se organiza a hierarquia urbana brasileira, do centro local à metrópole nacional?',
    eixo: 'do centro local (grau mais baixo) à metrópole nacional (grau mais alto)',
    items: [
      {
        label: 'Centro local',
        claim: 'atende principalmente sua própria população com serviços básicos — o grau mais baixo da hierarquia',
        section: 'Hierarquia urbana',
        quote: 'por fim centros locais, que atendem principalmente sua própria população com serviços básicos',
      },
      {
        label: 'Centros sub-regionais',
        claim: 'oferecem serviços intermediários a cidades de porte menor ao seu redor',
        section: 'Hierarquia urbana',
        quote: 'capitais regionais menores e centros sub-regionais, que oferecem serviços intermediários a cidades de porte menor ao seu redor',
      },
      {
        label: 'Metrópoles regionais',
        claim: 'centralizam serviços especializados e fluxos econômicos de suas respectivas macrorregiões',
        section: 'Hierarquia urbana',
        quote: 'estão as metrópoles regionais, como Belo Horizonte, Porto Alegre, Salvador, Recife e Curitiba, que centralizam serviços especializados e fluxos econômicos de suas respectivas macrorregiões',
      },
      {
        label: 'Metrópole nacional',
        claim: 'no topo da hierarquia, exerce influência sobre todo o território nacional e mantém conexões diretas com a economia global',
        section: 'Hierarquia urbana',
        quote: 'No topo estão as metrópoles nacionais, como São Paulo e Rio de Janeiro, que exercem influência sobre todo o território nacional e mantêm conexões diretas com a economia global',
      },
    ],
  },
  {
    // A entrada padrão deste tópico (summary-geografia-estrutura-ativa-da-populacao)
    // é excluída em geographyInteractiveSummaries.ts (excludeTopics); o único
    // InteractiveSummary real para "Estrutura Ativa da População" no catálogo
    // é este id alternativo, definido em expandedInteractiveSummaries.ts.
    chapterId: 'geo-bonus-demografico',
    family: 'escala-de-graus',
    question: 'Como a força de trabalho se desloca entre setores ao longo do desenvolvimento econômico, do primário ao terciário?',
    eixo: 'do setor primário (grau inicial) ao terciário (grau final da trajetória)',
    items: [
      {
        label: 'Setor primário',
        claim: 'países pobres concentram mão de obra no setor primário — o grau inicial da trajetória',
        section: 'Setores da economia',
        quote: 'países pobres concentram mão de obra no primário',
      },
      {
        label: 'Setor secundário',
        claim: 'países industrializados concentram mão de obra no setor secundário durante sua fase de industrialização',
        section: 'Setores da economia',
        quote: 'países industrializados no secundário durante sua fase de industrialização',
      },
      {
        label: 'Setor terciário',
        claim: 'economias maduras terciarizam, com o setor de serviços absorvendo a maior fatia do emprego e do PIB',
        section: 'Setores da economia',
        quote: 'economias maduras terciarizam, com o setor de serviços absorvendo a maior fatia do emprego e do PIB',
      },
    ],
  },
];
