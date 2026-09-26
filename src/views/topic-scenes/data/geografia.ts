import type { SceneEntry } from '../types';
import { HG_LOTE_ENTRIES } from './hgLotes';

/** Capítulos de Geografia sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Estado ao fim da Task 1: só a lacuna já conhecida antes da leitura. A
 *  atribuição definitiva dos 63 capítulos (famílias e lacunas adicionais)
 *  está em docs/visual-personalizado/10-familias-geografia.md — as Tasks
 *  2-4 preenchem `geografia` e completam `geografiaSemCena` a partir dali. */
const geografiaSemCenaBase: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-geografia-coordenadas-geograficas',
    motivo: 'Já tem experiência interativa própria (coordinates) no catálogo de topic-experiments.',
  },
  {
    chapterId: 'summary-geografia-sistema-de-fusos-horarios',
    motivo: 'É um procedimento de cálculo (conversão UTC, Linha Internacional de Data), não uma estrutura de rivalidade, camadas, tipos, critérios conjuntivos, escala ou derivação causal.',
  },
  {
    chapterId: 'summary-geografia-linguagem-cartografica',
    motivo: 'Mistura definição de escala com cálculo numérico resolvido; não há tipologia com guarda-chuva real nem cadeia causal, é conteúdo procedimental de leitura de mapa.',
  },
  {
    chapterId: 'summary-geografia-cartografia-digital',
    motivo: 'Descreve capacidades de sistemas de informação geográfica e sensoriamento remoto; a combinação de camadas é um método de análise, não uma estrutura de critérios conjuntivos sobre um fenômeno específico.',
  },
  {
    chapterId: 'summary-geografia-representacoes-graficas-e-cartograficas',
    motivo: 'Lista elementos do mapa (título, legenda, escala, orientação, fonte) e generalização cartográfica; é conteúdo procedimental, sem rivalidade, camada ou derivação.',
  },
  {
    chapterId: 'summary-geografia-desafios-ambientais-do-seculo-xxi',
    motivo: 'A tragédia dos comuns é um mecanismo de incentivo, não uma cadeia de derivação nem critérios conjuntivos sobre um fenômeno único.',
  },
  {
    chapterId: 'summary-geografia-geopolitica-ambiental',
    motivo: 'Combina vários temas (Amazônia, acordos climáticos, Nilo) sem uma estrutura única sustentada por uma seção específica; cada exemplo é autônomo, não elo de uma mesma cadeia.',
  },
  {
    chapterId: 'summary-geografia-hidrogeografia-mundial',
    motivo: 'Descreve bacias e usos concorrentes que coexistem, não se excluem mutuamente; não há rivalidade genuína nem tipologia com guarda-chuva claro.',
  },
  {
    chapterId: 'summary-geografia-globalizacao-e-processos-economicos-atuais',
    motivo: 'Cadeias globais de valor e críticas à globalização são descritas lado a lado, sem derivação causal instrumental entre elos nem tipologia com variantes coexistentes claras.',
  },
  {
    chapterId: 'summary-geografia-geografia-das-redes-mundiais',
    motivo: 'Hierarquia de cidades globais e infraestrutura digital; não há escala ordenada explícita nem derivação, é descrição de rede.',
  },
  {
    chapterId: 'summary-geografia-unilateralismo-e-multilateralismo',
    motivo: 'O texto afirma explicitamente que os dois modos coexistem e a escolha é situacional, então não sustenta contraste-de-posicoes (a rejeição não existe) nem outra família.',
  },
  {
    chapterId: 'summary-geografia-uniao-europeia',
    motivo: 'Narrativa histórica institucional; a integração se aprofunda por décadas, mas sem linguagem instrumental de derivação em cada elo, é acúmulo de eventos institucionais.',
  },
  {
    chapterId: 'summary-geografia-industria-ii',
    motivo: 'A nova geografia industrial e os tecnopolos são descrições paralelas, sem estrutura de família sustentada por uma frase específica.',
  },
  {
    chapterId: 'summary-geografia-gedeconomia-mundial',
    motivo: 'Instrumentos geoeconômicos (sanções, tarifas, controle de exportação) são listados lado a lado; não há necessidade conjunta declarada nem derivação causal entre eles.',
  },
  {
    chapterId: 'summary-geografia-terrorismo-internacional',
    motivo: 'As causas do terrorismo são descritas como multifatoriais e disputadas, sem consenso definitivo sobre um único fator — o oposto de uma necessidade conjunta declarada.',
  },
  {
    chapterId: 'summary-geografia-geografia-das-religioes',
    motivo: 'Distribuição espacial e laicidade são dois subtemas paralelos, sem estrutura de família única sustentada.',
  },
  {
    chapterId: 'summary-geografia-tensoes-geopoliticas-na-europa',
    motivo: 'Narrativa de eventos (guerra na Ucrânia, separatismos) sem cadeia causal instrumental nem tipologia clara.',
  },
  {
    chapterId: 'summary-geografia-geopolitica-e-geoeconomia-da-america-latina',
    motivo: 'A dependência primário-exportadora e a integração regional são descritas, mas sem frase de necessidade conjunta nem derivação instrumental por elo.',
  },
  {
    chapterId: 'summary-geografia-africa-no-mundo-atual',
    motivo: 'Herança colonial, diversidade e recursos são subtemas paralelos; a maldição dos recursos é uma correlação associada, não uma cadeia declarada com instrumental causal.',
  },
  {
    chapterId: 'summary-geografia-geopolitica-e-geoeconomia-da-asia',
    motivo: 'A ascensão chinesa e as rivalidades regionais são descritas lado a lado, sem estrutura única sustentada.',
  },
  {
    chapterId: 'summary-geografia-geografia-do-oriente-medio',
    motivo: 'Posição, diversidade e conflitos por água são subtemas paralelos, sem família sustentada por um deles isoladamente.',
  },
  {
    chapterId: 'summary-geografia-questao-palestina',
    motivo: 'Narrativa histórica factual (Declaração Balfour, partilha, guerras, impasses); os eventos se sucedem, mas o texto não usa linguagem instrumental de derivação entre eles, é sequência histórica.',
  },
  {
    chapterId: 'summary-geografia-conflitos-no-mundo-arabe',
    motivo: 'Primavera Árabe, guerra síria e fatores estruturais coexistem no texto sem uma única estrutura de família dominante.',
  },
  {
    chapterId: 'summary-geografia-biogeografia-do-brasil-i',
    motivo: 'Amazônia, Mata Atlântica, Cerrado e Caatinga são descritos por bioma, cada um com características próprias, mas sem frase-guarda-chuva que os una explicitamente como variantes antes de enumerar.',
  },
  {
    chapterId: 'summary-geografia-biogeografia-do-brasil-ii',
    motivo: 'Pantanal, Pampa, restingas e manguezais são descritos individualmente, sem guarda-chuva explícito que os una como variantes.',
  },
  {
    chapterId: 'summary-geografia-politicas-ambientais-brasileiras',
    motivo: 'Marcos legais e instrumentos são listados cronológica e funcionalmente, sem derivação instrumental nem necessidade conjunta declarada.',
  },
  {
    chapterId: 'summary-geografia-hidrogeografia-do-brasil',
    motivo: 'Bacias e usos são descritos por região, sem tipologia com guarda-chuva nem rivalidade genuína.',
  },
  {
    chapterId: 'summary-geografia-matriz-energetica',
    motivo: 'A classificação renovável/não renovável é binária e mais fraca que as tipologias aceitas, sem enumeração de variantes coexistentes além do par.',
  },
  {
    chapterId: 'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
    motivo: 'Pré-sal, gás e biocombustíveis são subtemas paralelos, sem família única sustentada.',
  },
  {
    chapterId: 'summary-geografia-energia-eletrica-no-mundo',
    motivo: 'O debate pró/contra nuclear é um trade-off de risco-benefício que varia conforme o contexto, não uma rejeição mútua.',
  },
  {
    chapterId: 'summary-geografia-energia-eletrica-no-brasil',
    motivo: 'Predomínio hidrelétrico, expansão eólica/solar e desafios do sistema são descritos lado a lado, sem estrutura única.',
  },
  {
    chapterId: 'summary-geografia-producao-mineral',
    motivo: 'Distribuição de recursos, impactos socioambientais e garimpo são subtemas paralelos, sem família única sustentada.',
  },
  {
    chapterId: 'summary-geografia-o-espaco-agrario-brasileiro',
    motivo: 'Estrutura fundiária, modernização e conflitos são descritos lado a lado, sem cadeia instrumental nem necessidade conjunta declarada.',
  },
  {
    chapterId: 'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
    motivo: 'Formação da população, imigração histórica e migrações internas são períodos históricos distintos listados em sequência, sem instrumental de derivação entre eles.',
  },
  {
    chapterId: 'summary-geografia-os-fluxos-do-comercio-externo',
    motivo: 'Pauta de exportação, parceiros comerciais e vulnerabilidades são descritos lado a lado, sem família única sustentada por uma seção específica.',
  },
  {
    chapterId: 'summary-geografia-agua-na-superficie-terrestre',
    motivo: 'A distribuição da água é uma cascata de proporções decrescentes, não uma escala de graus nomeados nem uma tipologia com variantes que coexistem sem hierarquia, e a classificação de aquíferos em livre/confinado é binária demais para sustentar tipologia.',
  },
  {
    chapterId: 'summary-geografia-o-espaco-industrial-brasileiro-ii',
    motivo: 'A desconcentração industrial é descrita por múltiplos fatores combinados, mas sem a frase de necessidade conjunta que sustentaria critérios conjuntivos; guerra fiscal e desindustrialização são subtemas paralelos adicionais, sem cadeia instrumental única.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4
 *  preenchem esta lista, família por família, seguindo a atribuição
 *  definitiva do documento de famílias. */
const geografiaBase: SceneEntry[] = [
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
  // Task 3 — família cadeia-de-derivacao (4 capítulos)
  {
    chapterId: 'summary-geografia-movimentos-da-terra',
    family: 'cadeia-de-derivacao',
    question: 'Por que a inclinação do eixo terrestre, e não a distância ao Sol, é a causa das estações do ano?',
    items: [
      {
        label: 'Eixo inclinado',
        claim: 'o eixo de rotação da Terra é inclinado em cerca de 23,5 graus em relação ao plano orbital, e é essa inclinação — não a variação de distância ao Sol — a verdadeira causa das estações',
        section: 'A inclinação e as estações',
        quote: 'O eixo de rotação da Terra é inclinado em aproximadamente 23,5 graus em relação ao plano de sua órbita ao redor do Sol, e essa inclinação, mantida praticamente constante ao longo do ano (o eixo aponta sempre para a mesma direção no espaço, na direção aproximada da estrela Polar), é a verdadeira causa das estações.',
      },
      {
        label: 'Hemisférios alternam',
        claim: 'ao longo da translação, a inclinação constante do eixo faz com que diferentes hemisférios fiquem mais ou menos voltados para o Sol em diferentes épocas do ano',
        section: 'A inclinação e as estações',
        quote: 'Ao longo da translação, diferentes hemisférios ficam mais ou menos inclinados em direção ao Sol em diferentes épocas do ano',
      },
      {
        label: 'Incidência solar direta',
        claim: 'quando um hemisfério está inclinado em direção ao Sol, seus raios incidem de forma mais direta e por mais horas do dia, gerando verão nesse hemisfério',
        section: 'A inclinação e as estações',
        quote: 'quando o Hemisfério Norte está inclinado em direção ao Sol, seus raios solares incidem de forma mais direta e por mais horas do dia, gerando verão nesse hemisfério',
      },
      {
        label: 'Estações opostas',
        claim: 'enquanto um hemisfério recebe luz mais direta e vive o verão, o outro, inclinado para longe do Sol, recebe luz mais oblíqua e vive o inverno simultaneamente — por isso as estações se invertem entre os hemisférios',
        section: 'A inclinação e as estações',
        quote: 'enquanto simultaneamente o Hemisfério Sul, inclinado para longe do Sol, recebe luz solar mais oblíqua e por menos horas, experimentando inverno — por isso as estações se invertem entre os dois hemisférios ao longo do ano',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-do-mundo-bipolar-ao-multipolar',
    family: 'cadeia-de-derivacao',
    question: 'Como o esgotamento econômico soviético levou ao fim da bipolaridade e ao momento unipolar americano?',
    items: [
      {
        label: 'Economia sufocada',
        claim: 'a economia soviética, sufocada pelo gasto militar desproporcional ao seu PIB e pela rigidez do planejamento central, não conseguiu acompanhar a modernização tecnológica ocidental',
        section: 'A transição',
        quote: 'a economia soviética, sufocada pelo gasto militar desproporcional ao seu PIB e pela rigidez do planejamento central, não conseguiu acompanhar a modernização tecnológica ocidental',
      },
      {
        label: 'Reformas aceleram colapso',
        claim: 'as reformas de Gorbachev tentaram salvar o sistema soviético afrouxando o controle estatal, mas acabaram acelerando sua desagregação ao liberar tensões represadas',
        section: 'A transição',
        quote: 'As reformas de Mikhail Gorbachev — a glasnost (abertura política) e a perestroika (reestruturação econômica) — tentaram salvar o sistema soviético afrouxando o controle estatal, mas acabaram acelerando sua desagregação ao permitir que tensões nacionalistas e econômicas represadas viessem à tona.',
      },
      {
        label: 'Dissolução da URSS',
        claim: 'a queda do Muro de Berlim simbolizou o colapso do bloco socialista europeu, e a dissolução formal da União Soviética encerrou oficialmente a bipolaridade',
        section: 'A transição',
        quote: 'A queda do Muro de Berlim em 1989 simbolizou o colapso do bloco socialista europeu, e a dissolução formal da União Soviética em dezembro de 1991 encerrou oficialmente a bipolaridade',
      },
      {
        label: 'Momento unipolar',
        claim: 'com o desaparecimento do rival soviético, os Estados Unidos permaneceram como única superpotência militar e econômica global por cerca de duas décadas',
        section: 'A transição',
        quote: 'deixando os Estados Unidos como única superpotência militar e econômica global por cerca de duas décadas — o chamado momento unipolar, marcado pela hegemonia americana na política internacional dos anos 1990 e início dos 2000',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geopolitica-dos-recursos-hidricos',
    family: 'cadeia-de-derivacao',
    question: 'Como uma barragem construída sem acordo entre países vizinhos se transforma em risco de conflito diplomático?',
    items: [
      {
        label: 'Barragem sem acordo',
        claim: 'quando um país constrói uma grande barragem nas cabeceiras de um rio internacional sem acordo prévio com os países a jusante, reduz a vazão que chega a eles',
        section: 'Como surge um conflito',
        quote: 'Quando um país constrói uma grande barragem nas cabeceiras de um rio internacional sem acordo prévio com os países a jusante — como ocorreu com a Grande Barragem do Renascimento Etíope no Nilo Azul, que reduziu temporariamente a vazão que chega ao Egito durante o período de enchimento do reservatório',
      },
      {
        label: 'Vira tensão diplomática',
        claim: 'a ausência de um tratado vinculante de repartição de águas transforma essa decisão de infraestrutura doméstica em fonte de tensão diplomática regional',
        section: 'Como surge um conflito',
        quote: 'a ausência de um tratado vinculante de repartição de águas transforma uma decisão de infraestrutura doméstica em fonte de tensão diplomática regional',
      },
      {
        label: 'Ameaça existencial',
        claim: 'a gravidade do conflito tende a ser proporcional à dependência do país a jusante: o Egito depende do Nilo para mais de 90% de sua água doce, o que torna qualquer redução de vazão uma ameaça existencial',
        section: 'Como surge um conflito',
        quote: 'A gravidade do conflito tende a ser proporcional à dependência do país a jusante: o Egito depende do Nilo para mais de 90% de sua água doce, o que torna qualquer redução de vazão uma ameaça existencial à sua segurança hídrica e alimentar',
      },
      {
        label: 'Risco de escalada',
        claim: 'essa ameaça existencial eleva o risco de escalada diplomática muito além do que ocorreria em bacias onde os países têm fontes hídricas alternativas',
        section: 'Como surge um conflito',
        quote: 'elevando o risco de escalada diplomática muito além do que ocorreria em bacias onde os países têm fontes hídricas alternativas',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-desigualdades-globais',
    family: 'cadeia-de-derivacao',
    question: 'Por que a industrialização protegida da América Latina resultou em indústrias pouco competitivas internacionalmente?',
    items: [
      {
        label: 'Termos de troca',
        claim: 'ao longo do século XX, o preço relativo das commodities exportadas pela periferia caiu frente ao dos manufaturados, forçando-a a exportar cada vez mais para importar a mesma quantidade de produtos industrializados',
        section: 'Centro e periferia',
        quote: 'ao longo do século XX, o preço relativo das commodities caiu frente ao dos manufaturados, então a periferia precisava exportar quantidades cada vez maiores da mesma matéria-prima para importar a mesma quantidade de produtos industrializados',
      },
      {
        label: 'Substituição de importações',
        claim: 'em resposta, os países latino-americanos protegeram a indústria nacional com tarifas altas, entre as décadas de 1930 e 1970',
        section: 'Centro e periferia',
        quote: 'A resposta latino-americana foi a industrialização por substituição de importações, das décadas de 1930 a 1970, protegendo a indústria nacional com tarifas altas.',
      },
      {
        label: 'Baixa competitividade',
        claim: 'esse modelo protegido elevou o PIB industrial, mas criou parques fabris pouco competitivos internacionalmente',
        section: 'Centro e periferia',
        quote: 'O modelo elevou o PIB industrial mas criou parques fabris pouco competitivos internacionalmente',
      },
    ],
  },
  // Task 4 — família tipologia (13 capítulos)
  {
    chapterId: 'summary-geografia-projecoes-cartograficas',
    family: 'tipologia',
    question: 'Já que nenhuma projeção cartográfica preserva tudo ao mesmo tempo, que distorção cada uma escolhe minimizar?',
    nota: 'Não existe projeção "correta": cada uma minimiza deliberadamente um tipo de distorção, nunca todos ao mesmo tempo.',
    items: [
      {
        label: 'Conforme',
        claim: 'preserva os ângulos e a forma local dos continentes, mas distorce significativamente as áreas relativas em latitudes altas',
        section: 'Propriedades diferentes',
        quote: 'As projeções conformes preservam os ângulos e, portanto, a forma local dos continentes, mas distorcem significativamente as áreas relativas, especialmente em latitudes mais altas, distantes do Equador.',
      },
      {
        label: 'Equivalente',
        claim: 'preserva a proporção correta das áreas territoriais entre regiões, mas distorce as formas dos continentes para conseguir essa fidelidade',
        section: 'Propriedades diferentes',
        quote: 'As projeções equivalentes preservam a proporção correta das áreas territoriais entre diferentes regiões do mapa, mas distorcem as formas dos continentes para conseguir essa fidelidade de área.',
      },
      {
        label: 'Equidistante',
        claim: 'preserva a distância correta a partir de um ponto central do mapa até qualquer outro ponto, mas só entre esse centro e o resto — não entre dois pontos quaisquer',
        section: 'Propriedades diferentes',
        quote: 'As projeções equidistantes preservam a distância correta a partir de um ponto central de referência do mapa até qualquer outro ponto',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-biogeografia-mundial',
    family: 'tipologia',
    question: 'Por que florestas tropicais, savanas, desertos, florestas temperadas, taiga e tundra se distribuem no planeta de forma sistemática, e não ao acaso?',
    nota: 'Os grandes biomas coexistem espacialmente sob a mesma lógica latitudinal, sem hierarquia entre si.',
    items: [
      {
        label: 'Floresta tropical',
        claim: 'ocorre próxima ao equador, onde a Zona de Convergência Intertropical produz chuvas abundantes e temperaturas altas o ano todo',
        section: 'Os grandes biomas',
        quote: 'florestas tropicais ocorrem próximas ao equador, onde a Zona de Convergência Intertropical produz chuvas abundantes e temperaturas altas o ano todo',
      },
      {
        label: 'Deserto subtropical',
        claim: 'ocorre por volta de 30° de latitude, onde células de alta pressão atmosférica suprimem a formação de nuvens e chuva',
        section: 'Os grandes biomas',
        quote: 'desertos subtropicais ocorrem por volta de 30° de latitude, onde células de alta pressão atmosférica (as células de Hadley descendentes) suprimem a formação de nuvens e chuva',
      },
      {
        label: 'Temperado-polar',
        claim: 'a sequência de biomas de temperados a polares reflete diretamente a queda progressiva de temperatura média conforme a latitude aumenta em direção aos polos',
        section: 'Os grandes biomas',
        quote: 'a sequência de biomas de temperados a polares reflete diretamente a queda progressiva de temperatura média conforme a latitude aumenta em direção aos polos',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geologia-e-geomorfologia',
    family: 'tipologia',
    question: 'Em que tipos as rochas se classificam conforme sua origem, e como o ciclo das rochas as conecta?',
    nota: 'Ígneas, sedimentares e metamórficas coexistem e se intercambiam pelo ciclo das rochas — nenhuma é etapa obrigatória anterior às outras.',
    items: [
      {
        label: 'Ígneas',
        claim: 'formam-se pelo resfriamento e solidificação de magma, em profundidade (plutônicas, cristais grandes) ou na superfície (vulcânicas, cristais pequenos)',
        section: 'Rochas e ciclo',
        quote: 'As rochas ígneas ou magmáticas formam-se pelo resfriamento e solidificação de magma, seja em profundidade (rochas plutônicas, como o granito, de resfriamento lento que permite cristais grandes e visíveis) seja na superfície após uma erupção vulcânica (rochas vulcânicas, como o basalto, de resfriamento rápido e cristais pequenos)',
      },
      {
        label: 'Sedimentares',
        claim: 'formam-se pelo acúmulo e compactação de sedimentos ao longo de longos períodos, e são as únicas que preservam fósseis',
        section: 'Rochas e ciclo',
        quote: 'As rochas sedimentares formam-se pelo acúmulo e compactação de sedimentos — fragmentos de outras rochas, restos orgânicos ou precipitados químicos — ao longo de longos períodos, como o arenito e o calcário, e são as únicas que preservam fósseis',
      },
      {
        label: 'Metamórficas',
        claim: 'resultam da transformação de rochas preexistentes sob calor e pressão intensos, sem chegar à fusão completa',
        section: 'Rochas e ciclo',
        quote: 'As rochas metamórficas resultam da transformação de rochas ígneas, sedimentares ou metamórficas preexistentes sob calor e pressão intensos, sem chegar à fusão completa, como o mármore (metamorfismo do calcário) e o gnaisse',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geomorfologia-mundial',
    family: 'tipologia',
    question: 'Como as grandes estruturas geológicas que sustentam o relevo mundial se classificam conforme idade e estabilidade tectônica?',
    nota: 'Crátons, bacias sedimentares e dobras modernas coexistem no relevo mundial — cada categoria tem idade e dinâmica próprias, sem hierarquia entre si.',
    items: [
      {
        label: 'Crátons',
        claim: 'núcleos continentais muito antigos, estáveis há centenas de milhões de anos e por isso profundamente erodidos, de relevo de baixa altitude',
        section: 'Estruturas geológicas',
        quote: 'Os crátons (ou escudos cristalinos) são núcleos continentais muito antigos, formados há bilhões de anos, tectonicamente estáveis há centenas de milhões de anos e por isso profundamente erodidos, resultando em relevo de baixa altitude',
      },
      {
        label: 'Bacias sedimentares',
        claim: 'depressões preenchidas ao longo de milhões de anos por camadas de sedimentos acumuladas sobre rochas mais antigas',
        section: 'Estruturas geológicas',
        quote: 'As bacias sedimentares são depressões preenchidas ao longo de milhões de anos por camadas de sedimentos que se acumularam sobre rochas mais antigas',
      },
      {
        label: 'Dobras modernas',
        claim: 'cadeias montanhosas jovens e geologicamente ativas, formadas pela colisão de placas tectônicas nos últimos dezenas de milhões de anos',
        section: 'Estruturas geológicas',
        quote: 'As dobras modernas são cadeias montanhosas jovens, geologicamente ativas, formadas pela colisão de placas tectônicas nos últimos dezenas de milhões de anos',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-producao-agricola-mundial',
    family: 'tipologia',
    question: 'Em que sistemas distintos a produção agrícola mundial se organiza, conforme mecanização, escala e mercado de destino?',
    nota: 'Os sistemas agrícolas coexistem no mundo real — não formam uma escala evolutiva obrigatória de um para o outro.',
    items: [
      {
        label: 'Subsistência',
        claim: 'produz principalmente para consumo direto da própria família produtora, com baixo uso de insumos e produtividade por hectare relativamente reduzida',
        section: 'Sistemas agrícolas',
        quote: 'A agricultura de subsistência, predominante em partes da África Subsaariana e da Ásia rural, produz principalmente para consumo direto da própria família produtora, com baixo uso de insumos tecnológicos e produtividade por hectare relativamente reduzida',
      },
      {
        label: 'Larga escala',
        claim: 'combina alta mecanização, uso intensivo de insumos químicos e sementes melhoradas, e orientação ao mercado internacional de commodities',
        section: 'Sistemas agrícolas',
        quote: 'A agricultura comercial de larga escala, praticada em regiões como o Centro-Oeste brasileiro, o Meio-Oeste americano e as planícies argentinas, combina alta mecanização, uso intensivo de insumos químicos e sementes geneticamente melhoradas, produtividade elevada por hectare e por trabalhador, e orientação voltada ao mercado internacional de commodities',
      },
      {
        label: 'Sistemas intermediários',
        claim: 'entre os dois extremos existe um espectro de sistemas intermediários, incluindo agricultura familiar comercial e agricultura orgânica e agroecológica',
        section: 'Sistemas agrícolas',
        quote: 'Entre esses extremos existe um espectro de sistemas intermediários, incluindo agricultura familiar comercial (que combina escala menor com inserção em mercados formais, comum em cooperativas agrícolas) e sistemas de agricultura orgânica e agroecológica',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-dominios-morfoclimaticos',
    family: 'tipologia',
    question: "Em que seis domínios morfoclimáticos Ab'Sáber classificou o território brasileiro?",
    nota: 'Os seis domínios coexistem territorialmente, com faixas de transição descritas como categoria à parte.',
    items: [
      {
        label: 'Amazônico',
        claim: 'floresta equatorial densa sobre relevo de baixos platôs e planícies, com solos majoritariamente pobres apesar da vegetação exuberante',
        section: "A proposta de Ab'Sáber",
        quote: 'Amazônico (floresta equatorial densa sobre relevo de baixos platôs e planícies, com solos majoritariamente pobres em nutrientes apesar da vegetação exuberante',
      },
      {
        label: 'Cerrado',
        claim: 'savana tropical sobre chapadas e planaltos antigos, com solos ácidos e pobres, adaptado ao fogo periódico e à estação seca prolongada',
        section: "A proposta de Ab'Sáber",
        quote: 'Cerrado (savana tropical sobre chapadas e planaltos antigos, com solos ácidos e pobres, adaptado ao fogo periódico e à estação seca prolongada)',
      },
      {
        label: 'Caatinga',
        claim: 'semiárido nordestino, com vegetação xerófila adaptada à escassez hídrica',
        section: "A proposta de Ab'Sáber",
        quote: 'Caatinga (semiárido nordestino, com vegetação xerófila adaptada à escassez hídrica)',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-dinamica-climatica',
    family: 'tipologia',
    question: 'Em que três tipos a geografia classifica a chuva, pelo mecanismo de ascensão do ar?',
    nota: 'Convectiva, orográfica e frontal coexistem em diferentes regiões e estações, definidas pelo mecanismo físico de ascensão do ar.',
    items: [
      {
        label: 'Convectiva',
        claim: 'ocorre quando o ar aquecido pela superfície sobe rapidamente, satura e condensa em nuvens de desenvolvimento vertical — típica de tardes quentes de verão em regiões tropicais',
        section: 'Tipos de chuva',
        quote: 'A chuva convectiva ocorre quando o ar aquecido pela superfície sobe rapidamente por ser menos denso, esfria por expansão adiabática, satura e condensa em nuvens de desenvolvimento vertical (cumulonimbos)',
      },
      {
        label: 'Orográfica',
        claim: 'acontece quando uma massa de ar úmido é forçada a subir uma barreira montanhosa, precipitando a barlavento e deixando o lado a sotavento seco',
        section: 'Tipos de chuva',
        quote: 'A chuva orográfica acontece quando uma massa de ar úmido é forçada a subir uma barreira montanhosa, esfriando e precipitando no lado a barlavento (voltado ao vento), enquanto o lado a sotavento fica seco pelo efeito foehn',
      },
      {
        label: 'Frontal',
        claim: 'resulta do encontro de massas de ar de temperaturas diferentes e domina o regime de chuvas das latitudes médias e do Sul do Brasil',
        section: 'Tipos de chuva',
        quote: 'A chuva frontal ou ciclônica resulta do encontro de massas de ar de temperaturas diferentes, como descrito nas frentes frias e quentes, e domina o regime de chuvas das latitudes médias e do Sul do Brasil ao longo do ano todo',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-as-redes-de-transportes',
    family: 'tipologia',
    question: 'Cada modal de transporte tem uma vocação técnica própria — qual é a de cada um?',
    nota: 'Os quatro modais coexistem, cada um com vocação própria — nenhum é "o certo" para toda distância ou carga.',
    items: [
      {
        label: 'Rodoviário',
        claim: 'vantajoso para distâncias curtas e médias, com flexibilidade de rotas e entrega porta a porta sem transbordo',
        section: 'Modais e vocações',
        quote: 'o modal rodoviário é vantajoso para distâncias curtas e médias, com flexibilidade de rotas e capacidade de atender diretamente pontos de origem e destino sem transbordo',
      },
      {
        label: 'Ferroviário',
        claim: 'mais eficiente para grandes volumes de cargas homogêneas em distâncias médias e longas, mas exige infraestrutura fixa cara e pouco flexível',
        section: 'Modais e vocações',
        quote: 'o ferroviário é mais eficiente para grandes volumes de cargas homogêneas (minério de ferro, grãos) em distâncias médias e longas, mas exige infraestrutura fixa cara e pouco flexível',
      },
      {
        label: 'Hidro/aéreo',
        claim: 'o hidroviário é o mais barato por tonelada em grandes distâncias, mas depende de rios navegáveis; o aéreo é o mais caro de todos, reservado a cargas de alto valor',
        section: 'Modais e vocações',
        quote: 'o hidroviário (fluvial e de cabotagem, a navegação costeira entre portos do próprio país) é o mais barato por tonelada transportada em grandes distâncias, mas depende de rios navegáveis ou proximidade litorânea e tem velocidade de entrega mais lenta; e o modal aéreo, o mais caro de todos por tonelada, é reservado para cargas de altíssimo valor agregado e baixo peso',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-relevo-brasileiro',
    family: 'tipologia',
    question: 'Em que três categorias estruturais o relevo brasileiro se classifica, segundo a proposta de Aziz Ab-Sáber?',
    nota: 'Planaltos, planícies e depressões coexistem no território, cada categoria com processo de formação próprio.',
    items: [
      {
        label: 'Planaltos',
        claim: 'ocupam cerca de 60% do território nacional, associados ao Escudo Brasileiro, estável há centenas de milhões de anos e por isso profundamente erodido',
        section: 'Estruturas e classificações',
        quote: 'Os planaltos, que ocupam a maior parte do território nacional (cerca de 60%), são áreas elevadas e geralmente antigas, associadas ao Escudo Brasileiro, um núcleo cristalino estável há centenas de milhões de anos e por isso profundamente erodido',
      },
      {
        label: 'Planícies',
        claim: 'áreas baixas e recentes, formadas por acúmulo de sedimentos, como a Planície Amazônica e a Planície do Pantanal',
        section: 'Estruturas e classificações',
        quote: 'As planícies são áreas baixas e recentes, formadas por acúmulo de sedimentos ao longo de milhões de anos, como a Planície Amazônica (formada pela deposição de sedimentos trazidos pelo rio Amazonas e seus afluentes) e a Planície do Pantanal',
      },
      {
        label: 'Depressões',
        claim: 'áreas rebaixadas por processos erosivos intensos ao longo do tempo geológico, situadas geralmente entre planaltos',
        section: 'Estruturas e classificações',
        quote: 'As depressões são áreas rebaixadas por processos erosivos intensos ao longo do tempo geológico, situadas geralmente entre planaltos',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geografia-do-turismo',
    family: 'tipologia',
    question: 'Em que tipos o turismo se organiza, conforme o atrativo principal e o território que ocupa?',
    nota: 'Cada tipo gera um padrão territorial distinto de ocupação, sem hierarquia entre eles.',
    items: [
      {
        label: 'Sol/praia',
        claim: 'predominante no litoral nordestino e em destinos caribenhos, depende de clima tropical estável e infraestrutura hoteleira concentrada na faixa costeira',
        section: 'Tipos e territórios',
        quote: 'O turismo de sol e praia, predominante no litoral nordestino brasileiro e em destinos caribenhos, depende de clima tropical estável e infraestrutura hoteleira concentrada na faixa costeira.',
      },
      {
        label: 'Cultural/eco',
        claim: 'o cultural valoriza patrimônio arquitetônico e tradições; o ecoturismo ocorre em áreas de conservação e exige infraestrutura de baixo impacto e capacidade de carga limitada',
        section: 'Tipos e territórios',
        quote: 'O turismo cultural e histórico valoriza patrimônio arquitetônico e tradições, como em cidades históricas mineiras tombadas pelo Iphan. O ecoturismo ocorre em áreas de conservação ambiental, como o Pantanal e partes da Amazônia, exigindo infraestrutura de baixo impacto e capacidade de carga limitada',
      },
      {
        label: 'Negócios/eventos',
        claim: 'concentra-se em grandes metrópoles com infraestrutura de centros de convenções, como São Paulo',
        section: 'Tipos e territórios',
        quote: 'O turismo de negócios e eventos concentra-se em grandes metrópoles com infraestrutura de centros de convenções, como São Paulo.',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-climatologia-do-brasil',
    family: 'tipologia',
    question: 'Em que tipos climáticos a combinação de latitude e massas de ar dominantes se traduz, em cada região do Brasil?',
    nota: 'Equatorial, tropical, semiárido e subtropical coexistem por região, refletindo a mesma combinação de latitude e massas de ar.',
    items: [
      {
        label: 'Equatorial',
        claim: 'predomina na Amazônia, sob influência constante da massa Equatorial',
        section: 'Os tipos climáticos',
        quote: 'o clima equatorial predomina na Amazônia (quente e úmido o ano todo, sem estação seca bem definida, sob influência constante da massa Equatorial)',
      },
      {
        label: 'Tropical/semiárido',
        claim: 'o tropical ocupa o Centro-Oeste, com estações seca e chuvosa definidas; o semiárido caracteriza o interior nordestino, de precipitação escassa e irregular',
        section: 'Os tipos climáticos',
        quote: 'o clima tropical típico ocupa o Centro-Oeste e parte do Sudeste e Nordeste (com estações seca e chuvosa bem definidas ao longo do ano); o clima semiárido caracteriza o interior nordestino',
      },
      {
        label: 'Subtropical',
        claim: 'predomina no Sul, a única região brasileira com invernos regularmente frios e ocasionais geadas',
        section: 'Os tipos climáticos',
        quote: 'o clima subtropical predomina no Sul do país (a única região brasileira com invernos regularmente frios e ocasionais geadas',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-pedologia',
    family: 'tipologia',
    question: 'Que tipos de solo o território brasileiro apresenta, refletindo a combinação de diferentes climas, relevos e rochas-mãe?',
    nota: 'Latossolos, terra roxa e solos do semiárido coexistem no território, cada um com propriedade distintiva própria.',
    items: [
      {
        label: 'Latossolos',
        claim: 'os mais extensos do território, de coloração avermelhada, mas naturalmente pobres em nutrientes apesar da aparência que sugere fertilidade',
        section: 'Tipos de solo no Brasil',
        quote: 'Os latossolos, profundamente intemperizados e de coloração avermelhada ou amarelada pela concentração de óxidos de ferro e alumínio, são os mais extensos do território nacional, predominando no Cerrado e em partes da Amazônia; apesar da aparência que sugere fertilidade, são naturalmente pobres em nutrientes disponíveis às plantas',
      },
      {
        label: 'Terra roxa',
        claim: 'derivada do intemperismo de rochas basálticas ricas em minerais, naturalmente mais fértil e associada historicamente ao café de alta produtividade',
        section: 'Tipos de solo no Brasil',
        quote: 'Os solos de terra roxa, derivados do intemperismo de rochas basálticas ricas em minerais, concentram-se no norte do Paraná e partes de São Paulo, sendo naturalmente mais férteis e historicamente associados ao cultivo de café de alta produtividade.',
      },
      {
        label: 'Semiárido',
        claim: 'pouco profundos, retêm pouca água e são mais suscetíveis à salinização quando irrigados sem manejo adequado',
        section: 'Tipos de solo no Brasil',
        quote: 'os solos do semiárido nordestino, pouco profundos e associados à rocha cristalina subjacente, retêm pouca água e são mais suscetíveis à salinização quando irrigados sem manejo adequado',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-industria-i',
    family: 'tipologia',
    question: 'Que modelos produtivos organizaram o chão de fábrica, cada um com lógica própria de eficiência?',
    nota: 'Taylorismo, fordismo e toyotismo coexistem hoje como abordagens — o toyotismo é alternativa ao fordismo, não sua substituição total.',
    items: [
      {
        label: 'Taylorismo',
        claim: 'fragmentou o processo produtivo em tarefas simples e repetitivas, cronometradas para maximizar produtividade individual',
        section: 'Modelos produtivos',
        quote: 'O taylorismo, desenvolvido por Frederick Taylor no início do século XX, fragmentou o processo produtivo em tarefas simples e repetitivas, cronometradas para maximizar produtividade individual.',
      },
      {
        label: 'Fordismo',
        claim: 'combinou essa fragmentação com a linha de montagem contínua e salários relativamente altos, tornando os próprios operários consumidores do que produziam',
        section: 'Modelos produtivos',
        quote: 'O fordismo, aplicado por Henry Ford, combinou essa fragmentação com a linha de montagem contínua e salários relativamente altos para os operários, criando um ciclo em que os próprios trabalhadores industriais se tornavam consumidores dos bens que produziam.',
      },
      {
        label: 'Toyotismo',
        claim: 'introduziu produção flexível e enxuta (just-in-time, controle de qualidade distribuído, polivalência) como alternativa à rigidez do fordismo clássico',
        section: 'Modelos produtivos',
        quote: 'O toyotismo, desenvolvido no Japão pós-Segunda Guerra Mundial, introduziu a produção flexível e enxuta: just-in-time (produção sob demanda, sem grandes estoques), controle de qualidade total distribuído entre os próprios trabalhadores, e polivalência funcional',
      },
      {
        label: 'Coexistência hoje',
        claim: 'tecnologias e modelos produtivos de diferentes revoluções coexistem hoje, com setores ainda operando em lógica fordista lado a lado com fábricas altamente automatizadas',
        section: 'Pegadinhas frequentes',
        quote: 'tecnologias e modelos produtivos de diferentes revoluções coexistem hoje, com setores ainda operando em lógica fordista lado a lado com fábricas altamente automatizadas da Quarta Revolução Industrial',
      },
    ],
  },
  // Task 4 — família criterios-conjuntivos (2 capítulos)
  {
    chapterId: 'summary-geografia-clima-mundial',
    family: 'criterios-conjuntivos',
    question: 'Que fatores precisam se combinar, todos ao mesmo tempo, para produzir o clima real observado num ponto do planeta?',
    items: [
      {
        label: 'Latitude',
        claim: 'determina o ângulo de incidência dos raios solares e, portanto, a quantidade de energia recebida ao longo do ano',
        section: 'Fatores climáticos',
        quote: 'latitude (que determina o ângulo de incidência dos raios solares e, portanto, a quantidade de energia recebida ao longo do ano)',
      },
      {
        label: 'Altitude',
        claim: 'o ar mais rarefeito em altitudes elevadas retém menos calor, reduzindo a temperatura média conforme se sobe',
        section: 'Fatores climáticos',
        quote: 'altitude (o ar mais rarefeito em altitudes elevadas retém menos calor, reduzindo a temperatura média conforme se sobe)',
      },
      {
        label: 'Continent./correntes',
        claim: 'áreas distantes do mar têm amplitude térmica maior, e correntes marítimas quentes ou frias alteram diretamente a temperatura e a umidade do ar que chega à costa',
        section: 'Fatores climáticos',
        quote: 'continentalidade (áreas distantes do mar têm amplitude térmica maior, já que a água aquece e esfria mais lentamente que a terra, moderando o clima costeiro em comparação com o interior continental), correntes marítimas (correntes quentes ou frias que passam próximo a uma costa alteram diretamente a temperatura e a umidade do ar que chega àquela região)',
      },
      {
        label: 'Nenhum isolado',
        claim: 'nenhum desses fatores atua isoladamente na prática — o clima real é sempre resultado da interação simultânea e combinada de todos eles',
        section: 'Fatores climáticos',
        quote: 'Nenhum desses fatores atua isoladamente na prática — o clima real observado em qualquer ponto específico do planeta é sempre o resultado da interação simultânea e combinada de todos esses fatores relevantes para aquela localização geográfica particular.',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-mobilidade-populacional',
    family: 'criterios-conjuntivos',
    question: 'Por que a decisão de migrar raramente resulta de um único fator de expulsão ou atração agindo sozinho?',
    items: [
      {
        label: 'Expulsão',
        claim: 'tornam o local de origem menos atrativo — desemprego, violência, conflito armado, desastres naturais, perseguição política ou religiosa',
        section: 'Fatores de expulsão e atração',
        quote: 'Fatores de expulsão incluem desemprego, violência, conflito armado, desastres naturais, perseguição política ou religiosa e falta de acesso a serviços básicos.',
      },
      {
        label: 'Atração',
        claim: 'tornam o destino mais atrativo — emprego, salários mais altos, segurança, acesso a educação e saúde, e redes sociais já estabelecidas no destino',
        section: 'Fatores de expulsão e atração',
        quote: 'Fatores de atração incluem oportunidades de emprego, salários mais altos, segurança, acesso a educação e saúde de qualidade, e presença de redes sociais já estabelecidas no destino',
      },
      {
        label: 'Combinação exigida',
        claim: 'esses fatores raramente atuam isoladamente: a decisão de migrar geralmente resulta da combinação de múltiplas pressões de expulsão com múltiplas atrações simultâneas',
        section: 'Fatores de expulsão e atração',
        quote: 'É importante notar que esses fatores raramente atuam isoladamente: a decisão de migrar geralmente resulta da combinação de múltiplas pressões de expulsão com múltiplas atrações simultâneas',
      },
    ],
  },
];

// Capítulos redesenhados depois da auditoria de 26/09: os recortes vêm dos
// arquivos de lote e o capítulo deixa de contar como lacuna.
const geografiaLotes = HG_LOTE_ENTRIES.filter(entry => entry.chapterId.startsWith('summary-geografia-'));
export const geografia: SceneEntry[] = [...geografiaBase, ...geografiaLotes];
export const geografiaSemCena = geografiaSemCenaBase.filter(gap => !geografiaLotes.some(entry => entry.chapterId === gap.chapterId));
