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
];
