import type { SceneEntry } from '../types';

// Recortes do Lote 12 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
//
// Questão Palestina e Mundo Árabe são temas sensíveis: os recortes usam só as
// formulações do resumo e dizem quem sustenta cada posição ("os palestinos
// chamam de Nakba", "a maioria da comunidade internacional considera ilegais").
export const ENTRIES_LOTE12: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-geopolitica-e-geoeconomia-da-asia',
    family: 'camadas-de-determinacao',
    question: 'Como a China subiu na cadeia de valor, e onde a Ásia se tensiona e se diversifica?',
    items: [
      {
        label: 'Subida na cadeia de valor',
        claim: 'Desde as reformas de 1978, a China passou de têxteis e brinquedos a semicondutores, IA e veículos elétricos, somando mão de obra barata, infraestrutura, poupança e estratégia estatal.',
        section: 'Ascensão chinesa',
        quote: 'passando de manufatura de baixo valor agregado (têxteis, brinquedos) para tecnologia avançada (semicondutores, inteligência artificial, veículos elétricos)',
      },
      {
        label: 'Cinturão e Rota',
        claim: 'Lançada em 2013, a iniciativa financia portos, ferrovias e energia na Ásia, na África e na América Latina, e cria dependência econômica e influência de longo prazo.',
        section: 'Ascensão chinesa',
        quote: 'A Iniciativa do Cinturão e Rota (a Nova Rota da Seda), lançada em 2013, projeta essa influência economicamente para além das fronteiras chinesas',
      },
      {
        label: 'Focos de tensão',
        claim: 'A linha de nove traços se sobrepõe às reivindicações de cinco vizinhos; Taiwan tem governo autônomo de fato desde 1949; Índia e Paquistão, ambos nucleares, disputam a Caxemira desde 1947.',
        section: 'Rivalidades regionais',
        quote: 'No Mar do Sul da China, a China reivindica soberania sobre a quase totalidade do mar por meio da chamada "linha de nove traços"',
      },
      {
        label: 'China plus one',
        claim: 'Empresas mantêm a China e somam Vietnã, Indonésia ou Filipinas; em volta, o Japão que envelhece, os tigres de 1960–1990 e a Índia de Bangalore.',
        section: 'Diversidade asiática',
        quote: 'um fenômeno chamado de "China plus one" pelas empresas multinacionais que diversificam sua produção para reduzir dependência exclusiva da China',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geografia-do-oriente-medio',
    family: 'camadas-de-determinacao',
    question: 'O que torna o Oriente Médio decisivo, e que povos, crenças e rios o atravessam?',
    items: [
      {
        label: 'Petróleo e passagens',
        claim: 'As maiores reservas provadas ficam em volta do Golfo Pérsico; por Ormuz passa cerca de um quinto do petróleo consumido no mundo, e Suez encurta a rota entre Europa e Ásia.',
        section: 'Posição e recursos',
        quote: 'o Estreito de Ormuz (por onde passa cerca de um quinto do petróleo consumido mundialmente)',
      },
      {
        label: 'Povos distintos',
        claim: 'Árabes, persas e turcos são maioria em países diferentes; os curdos, dezenas de milhões, não têm Estado e ficam divididos entre Turquia, Iraque, Síria e Irã.',
        section: 'Diversidade e clivagens',
        quote: 'curdos (um povo sem Estado próprio, distribuído entre Turquia, Iraque, Síria e Irã, somando dezenas de milhões de pessoas)',
      },
      {
        label: 'Sunitas e xiitas',
        claim: 'Clivagem religiosa dentro do islamismo, não étnica: xiitas são maioria no Irã, no Iraque e em partes do Líbano; Arábia Saudita e Irã disputam influência por proxies.',
        section: 'Diversidade e clivagens',
        quote: 'a disputa de influência entre a Arábia Saudita (potência sunita) e o Irã (potência xiita) por proxies em conflitos no Iêmen, na Síria e no Líbano',
      },
      {
        label: 'Água a jusante',
        claim: 'As barragens turcas do GAP, nas cabeceiras do Tigre e do Eufrates, reduziram a vazão que chega à Síria e ao Iraque; o Jordão e os aquíferos da Cisjordânia também são disputados.',
        section: 'Conflitos e água',
        quote: 'a construção de grandes barragens turcas nas cabeceiras desses rios, parte do projeto GAP (Projeto do Sudeste da Anatólia), reduziu significativamente a vazão que chega à Síria e ao Iraque',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-questao-palestina',
    family: 'cadeia-de-derivacao',
    question: 'Como a disputa pelo mesmo território se formou, de 1917 aos impasses de hoje?',
    items: [
      {
        label: '1917 · Balfour',
        claim: 'Sob domínio britânico, o apoio a um "lar nacional para o povo judeu" intensificou tensões com a população árabe, que habitava a região havia séculos.',
        section: 'Origens',
        quote: 'A Declaração Balfour de 1917, na qual o governo britânico expressou apoio ao "estabelecimento na Palestina de um lar nacional para o povo judeu", intensificou tensões com a população árabe local',
      },
      {
        label: '1947 · Partilha',
        claim: 'A ONU propôs dois Estados, um judeu e um árabe, com Jerusalém sob administração internacional; as lideranças sionistas aceitaram, os países árabes e a liderança palestina rejeitaram.',
        section: 'Da partilha às guerras',
        quote: 'O plano foi aceito pelas lideranças sionistas mas rejeitado pelos países árabes e pela liderança palestina',
      },
      {
        label: '1948 e 1967',
        claim: 'Na guerra de 1948, Israel ampliou o território sob seu controle e centenas de milhares de palestinos foram deslocados — a Nakba; em 1967, Israel ocupou Cisjordânia, Gaza e Jerusalém Oriental.',
        section: 'Da partilha às guerras',
        quote: 'Guerras subsequentes, especialmente a de 1967 (a Guerra dos Seis Dias), resultaram na ocupação israelense da Cisjordânia, da Faixa de Gaza e de Jerusalém Oriental',
      },
      {
        label: 'Impasses atuais',
        claim: 'Jerusalém sem status final, assentamentos que fragmentam a Cisjordânia, Gaza sob bloqueio e ciclos de conflito com vítimas civis dos dois lados; a solução de dois Estados enfrenta ceticismo.',
        section: 'Impasses atuais',
        quote: 'resultaram em número elevado de vítimas civis e destruição de infraestrutura em ambos os lados do conflito',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-conflitos-no-mundo-arabe',
    family: 'cadeia-de-derivacao',
    question: 'Por que a mesma onda de protestos terminou de três jeitos, e o que prolonga os conflitos?',
    items: [
      {
        label: 'Onda de 2010–2011',
        claim: 'Protestos se espalharam por Tunísia, Egito, Líbia, Síria e Iêmen, movidos por regimes autoritários longos, corrupção, desigualdade e desemprego entre jovens escolarizados.',
        section: 'Primavera Árabe',
        quote: 'regimes autoritários de longa duração, corrupção institucional generalizada, desigualdade econômica persistente',
      },
      {
        label: 'Três desfechos',
        claim: 'Tunísia: transição mais estável rumo a instituições democráticas; Egito: governo eleito derrubado por golpe militar; Líbia, Iêmen e Síria: guerras civis prolongadas.',
        section: 'Primavera Árabe',
        quote: 'no Egito, um governo eleito foi posteriormente derrubado por um golpe militar',
      },
      {
        label: 'Síria internacionalizada',
        claim: 'Rússia e Irã apoiaram o governo; EUA, Turquia e países do Golfo apoiaram facções da oposição; o Estado Islâmico ocupou o vácuo, e a Turquia se opõe à autonomia curda.',
        section: 'Guerras e atores externos',
        quote: 'Rússia e Irã apoiaram o governo sírio, enquanto Estados Unidos, Turquia e diversos países do Golfo Pérsico apoiaram',
      },
      {
        label: 'Raízes estruturais',
        claim: 'Fronteiras traçadas por Reino Unido e França após a Primeira Guerra, petróleo que atrai potências externas e a rivalidade Arábia Saudita × Irã travada por procuração.',
        section: 'Fatores estruturais',
        quote: 'fronteiras nacionais estabelecidas artificialmente pelas potências coloniais europeias (especialmente Reino Unido e França) após a Primeira Guerra Mundial',
      },
    ],
  },
];
