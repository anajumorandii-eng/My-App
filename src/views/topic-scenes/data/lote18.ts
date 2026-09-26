import type { SceneEntry } from '../types';

// Recortes do Lote 18 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
export const ENTRIES_LOTE18: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-globalizacao-e-processos-economicos-atuais',
    family: 'cadeia-de-derivacao',
    question: 'Por que o celular que atravessa o mundo sai barato — e por que a mesma cadeia é frágil?',
    items: [
      {
        label: 'A cadeia do smartphone',
        claim: 'O processo produtivo é fragmentado: cada etapa vai para o país com vantagem comparativa — desenho nos EUA, chips em Taiwan e na Coreia do Sul, montagem na China ou no Vietnã.',
        section: 'Cadeias globais de valor',
        quote: 'Um smartphone, por exemplo, pode ter design nos Estados Unidos, semicondutores fabricados em Taiwan e Coreia do Sul, outros componentes produzidos em diversos países asiáticos, e montagem final na China ou no Vietnã, antes de ser distribuído globalmente.',
      },
      {
        label: 'Gargalo na pandemia',
        claim: 'Concentrar uma etapa em poucos lugares cria vulnerabilidade sistêmica: a escassez de semicondutores, originada principalmente em Taiwan, parou cadeias inteiras.',
        section: 'Cadeias globais de valor',
        quote: 'a pandemia de Covid-19 revelou como o fechamento de fábricas em poucos países-chave (como a escassez de semicondutores originada principalmente em Taiwan) pode paralisar cadeias produtivas inteiras em todo o mundo',
      },
      {
        label: 'Custo × resiliência',
        claim: 'Concentrar em poucos fornecedores barateia; diversificar e trazer para perto do mercado (nearshoring) custa mais, mas resiste melhor a interrupções.',
        section: 'Pratique e confira',
        quote: 'trade-off entre eficiência de custo (favorecida pela concentração em poucos fornecedores especializados) e resiliência da cadeia produtiva (favorecida pela diversificação geográfica)',
      },
      {
        label: 'Críticas e reconfiguração',
        claim: 'Esquerda e nacionalistas criticam por razões distintas; ainda assim, o comércio segue alto: a globalização se reconfigura mais do que se desfaz.',
        section: 'Críticas e reações',
        quote: 'embora o comércio internacional total continue em patamares historicamente elevados, sugerindo reconfiguração mais que reversão completa do processo',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geografia-das-redes-mundiais',
    family: 'camadas-de-determinacao',
    question: 'Por que a rede aproxima o que está longe e deixa de fora o que está perto?',
    items: [
      {
        label: 'Nós e vazios',
        claim: 'A rede não liga todos os lugares igualmente: nós muito conectados ficam “próximos” entre si, e vazios relativos ficam à margem mesmo estando perto.',
        section: 'Redes e fluxos',
        quote: 'existem nós (pontos de alta conectividade, como grandes cidades e portos) e vazios relativos (áreas com pouca infraestrutura e baixa integração aos fluxos globais)',
      },
      {
        label: 'Cidades globais',
        claim: 'Poucas metrópoles concentram o comando da economia; São Paulo, cidade global regional, conecta-se mais a elas do que ao interior do próprio país.',
        section: 'Cidades globais',
        quote: 'São Paulo, por exemplo, ocupa posição de cidade global regional na América Latina, concentrando sedes corporativas e serviços financeiros avançados que a conectam mais intensamente a outras cidades globais do que a cidades menores do interior brasileiro',
      },
      {
        label: 'Cabos submarinos',
        claim: 'Mais de 95% do tráfego internacional de internet corre em cabos no fundo do mar, não por satélite; romper um cabo pode isolar uma região inteira.',
        section: 'Infraestrutura digital',
        quote: 'mais de 95% do tráfego internacional de internet passa por cabos de fibra óptica submarinos, não por satélites como muitos imaginam',
      },
      {
        label: 'Data centers',
        claim: 'Data centers buscam energia barata, clima ameno e cabo por perto — daí Virgínia, Irlanda e países nórdicos, uma geografia diferente da industrial.',
        section: 'Infraestrutura digital',
        quote: 'concentram-se em locais com energia elétrica abundante e barata, clima ameno (para reduzir custo de refrigeração dos equipamentos) e proximidade a cabos de fibra óptica',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-unilateralismo-e-multilateralismo',
    family: 'contraste-de-posicoes',
    question: 'Quando um Estado age sozinho, quando senta à mesa — e o que nenhum resolve sozinho?',
    items: [
      {
        label: 'Agir sozinho',
        claim: 'No unilateralismo, o país decide e age por conta própria, sem buscar consenso nem cooperação formal com outros países ou organismos.',
        section: 'Dois modos de agir',
        quote: 'O unilateralismo ocorre quando um país toma decisões e age em política externa de forma independente, sem buscar consenso ou cooperação formal com outros países ou organismos internacionais',
      },
      {
        label: 'Sentar à mesa',
        claim: 'No multilateralismo, três ou mais países coordenam ações por instituições e tratados; o mesmo país pode ir e voltar entre os dois modos, conforme a questão.',
        section: 'Dois modos de agir',
        quote: 'a escolha entre unilateralismo e multilateralismo é situacional e estratégica, não uma característica fixa e permanente da política externa de um país',
      },
      {
        label: 'Instituições do pós-guerra',
        claim: 'ONU (1945), OMC, FMI e Banco Mundial nasceram após a Segunda Guerra; no Conselho de Segurança, só os cinco membros permanentes têm veto.',
        section: 'As instituições multilaterais',
        quote: 'com um Conselho de Segurança cujos cinco membros permanentes (Estados Unidos, Rússia, China, Reino Unido e França) possuem poder de veto sobre resoluções',
      },
      {
        label: 'Problema sem fronteira',
        claim: 'Clima, pandemias, inteligência artificial e cibersegurança atravessam fronteiras: nenhum país os resolve sozinho por ação unilateral.',
        section: 'Tensões contemporâneas',
        quote: 'exigem, por sua própria natureza transfronteiriça, coordenação multilateral que nenhum país pode resolver isoladamente por ação unilateral',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-uniao-europeia',
    family: 'cadeia-de-derivacao',
    question: 'Como a integração que nasceu do carvão e do aço virou moeda comum — e onde ela range?',
    items: [
      {
        label: 'CECA, 1951',
        claim: 'Integrar carvão e aço de Alemanha, França e mais quatro fundadores tornou interdependentes as indústrias que haviam alimentado as guerras.',
        section: 'Formação e ampliação',
        quote: 'começando pela Comunidade Europeia do Carvão e do Aço em 1951, que integrou setores estratégicos de Alemanha, França e outros quatro países fundadores',
      },
      {
        label: 'Maastricht, 1992',
        claim: 'O Tratado de Maastricht criou a União Europeia com competências além do comércio: política externa e cooperação em justiça.',
        section: 'Formação e ampliação',
        quote: 'culminando no Tratado de Maastricht de 1992, que formalmente criou a União Europeia como a conhecemos, com competências que vão além do comércio, incluindo política externa e cooperação em justiça',
      },
      {
        label: 'Euro e a crise de 2010',
        claim: 'O euro, adotado por 20 dos 27, elimina o câmbio entre eles — e, na crise de 2010, a Grécia não pôde desvalorizar a moeda e teve de recorrer a ajuste fiscal interno.',
        section: 'Instituições e moeda',
        quote: 'quando países como Grécia enfrentaram dificuldades fiscais severas sem poder desvalorizar sua própria moeda para recuperar competitividade, tendo que recorrer a ajustes fiscais internos dolorosos como alternativa',
      },
      {
        label: 'Refugiados e Brexit',
        claim: 'A partir de 2015, a distribuição de refugiados dividiu os membros; em 2020, o Reino Unido saiu — o primeiro país a deixar o bloco, que ficou com 27.',
        section: 'Tensões atuais',
        quote: 'gerando tensão entre países que defendem solidariedade e distribuição compartilhada e países que resistem a receber cotas obrigatórias de refugiados',
      },
    ],
  },
];
