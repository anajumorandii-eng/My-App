import type { SceneEntry } from '../types';

// Recortes do Lote 13 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
export const ENTRIES_LOTE13: SceneEntry[] = [
  {
    chapterId: 'summary-historia-introducao-a-historia-e-primeiras-civilizacoes',
    family: 'cadeia-de-derivacao',
    question: 'Como o excedente agrícola fez nascer as cidades, e por que Tigre-Eufrates e Nilo se organizaram de modos diferentes?',
    items: [
      {
        label: 'Crescente Fértil',
        claim: 'a partir de cerca de 10.000 a.C., caçadores-coletores nômades passam a viver em comunidades sedentárias de agricultura e pecuária — e isso aconteceu em vários centros independentes, não num só',
        section: 'Revolução Agrícola e as primeiras cidades',
        quote: 'a partir de aproximadamente 10.000 a.C. (no chamado Crescente Fértil, no Oriente Médio, entre outros centros independentes de domesticação em diferentes continentes)',
      },
      {
        label: 'Excedente e ofícios',
        claim: 'o excedente alimenta quem não planta: artesãos, sacerdotes, administradores e guerreiros se especializam, e surgem as primeiras cidades',
        section: 'Revolução Agrícola e as primeiras cidades',
        quote: 'Essa transição gerou excedente alimentar capaz de sustentar população não diretamente envolvida na produção de alimentos',
      },
      {
        label: 'Tigre e Eufrates',
        claim: 'na Mesopotâmia, cidades-Estado independentes e rivais, como Ur, Uruk e Babilônia, e a escrita cuneiforme em tabuletas de argila, primeiro para a administração',
        section: 'Mesopotâmia e Egito',
        quote: 'Na Mesopotâmia, a organização política caracterizou-se por cidades-Estado independentes e frequentemente rivais entre si',
      },
      {
        label: 'Vale do Nilo',
        claim: 'no Egito, um Estado centralizado sob o faraó, com escrita hieroglífica e a administração das cheias anuais previsíveis do Nilo',
        section: 'Mesopotâmia e Egito',
        quote: 'Já o Egito Antigo desenvolveu Estado mais centralizado e unificado sob a figura do faraó',
      },
    ],
  },
  {
    chapterId: 'summary-historia-america-no-seculo-xix',
    family: 'tipologia',
    question: 'Por que a América hispânica se fragmentou, os Estados Unidos se expandiram e a independência política não trouxe independência econômica?',
    items: [
      {
        label: 'Fragmentação hispânica',
        claim: 'as guerras de independência contra a Espanha terminam em várias repúblicas, não na unidade continental que Bolívar buscava',
        section: 'Independências latino-americanas',
        quote: 'resultando na fragmentação territorial em múltiplas repúblicas independentes',
      },
      {
        label: 'Marcha para o oeste',
        claim: 'os Estados Unidos crescem por compra (Louisiana, 1803), por guerra (México, 1846–1848) e pelo deslocamento forçado de povos indígenas',
        section: 'Estados Unidos',
        quote: 'ocorreu por meio de compra de territórios (como a Louisiana, adquirida da França em 1803), guerra (a Guerra Mexicano-Americana de 1846-1848',
      },
      {
        label: 'Guerra Civil',
        claim: 'Norte industrializado contra Sul agrário e escravista: a vitória do Norte abole a escravidão e firma o governo federal sobre os estados',
        section: 'Estados Unidos',
        quote: 'A Guerra Civil Americana (1861-1865), conflito entre estados do Norte industrializado e do Sul agrário e escravista, resultou na abolição da escravidão nos Estados Unidos',
      },
      {
        label: 'Neocolonialismo',
        claim: 'matérias-primas saem para as potências industriais, sobretudo o Reino Unido; empréstimos, ferrovias e portos voltam — dependência sem controle político direto',
        section: 'Neocolonialismo e dependência',
        quote: 'permaneceram estruturalmente dependentes de exportação de matérias-primas (café, açúcar, minérios, carne, entre outros produtos primários)',
      },
    ],
  },
  {
    chapterId: 'summary-historia-grandes-revolucoes-do-seculo-xx',
    family: 'tipologia',
    question: 'Quem fez cada revolução, e o que cada uma deixou de instituição?',
    items: [
      {
        label: 'México, 1910',
        claim: 'contra a ditadura de Porfirio Díaz, uma coalizão que briga entre si: Madero, Zapata no sul e Villa no norte; o resultado é a Constituição de 1917',
        section: 'Revolução Mexicana',
        quote: 'envolveu coalizão heterogênea e frequentemente conflitante de diferentes lideranças regionais',
      },
      {
        label: 'Rússia, 1917',
        claim: 'dois momentos no mesmo ano: Fevereiro derruba o czar, Outubro derruba o governo provisório; a guerra civil de 1918–1922 consolida os bolcheviques e leva à URSS',
        section: 'Revolução Russa',
        quote: 'A Revolução Russa de 1917 ocorreu em dois momentos distintos ao longo do mesmo ano',
      },
      {
        label: 'China, 1949',
        claim: 'o Partido Comunista de Mao vence o Kuomintang de Chiang Kai-shek, que se refugia em Taiwan; a base é o campesinato',
        section: 'Revolução Chinesa',
        quote: 'a estratégia comunista chinesa mobilizou principalmente o campesinato rural',
      },
      {
        label: 'Cidade ou campo',
        claim: 'o modelo soviético se apoiou no proletariado urbano; o chinês adaptou a estratégia a um país majoritariamente agrário',
        section: 'Revolução Chinesa',
        quote: 'Diferente do modelo revolucionário soviético, centrado primordialmente no proletariado urbano industrial das cidades como classe revolucionária central',
      },
    ],
  },
  {
    chapterId: 'summary-historia-segunda-guerra-mundial-1939-1945',
    family: 'cadeia-de-derivacao',
    question: 'Como a guerra avançou na Europa e no Pacífico, e que mundo ela deixou?',
    items: [
      {
        label: 'Blitzkrieg, 1939–40',
        claim: 'a partir da invasão da Polônia em setembro de 1939, tanques, infantaria motorizada e aviação rompem as defesas antes que se organizem: Polônia e França caem depressa',
        section: 'Desenvolvimento do conflito',
        quote: 'combinando ataques rápidos e coordenados de tanques, infantaria motorizada e força aérea',
      },
      {
        label: 'Frente Oriental',
        claim: 'a Operação Barbarossa (1941) rompe o pacto com a URSS; Stalingrado (1942–1943) é a virada, e o recuo alemão vai até 1945',
        section: 'Desenvolvimento do conflito',
        quote: 'A invasão alemã da União Soviética em 1941 (Operação Barbarossa), rompendo pacto de não agressão previamente assinado entre os dois países',
      },
      {
        label: 'Pacífico',
        claim: 'Pearl Harbor (dezembro de 1941) põe os Estados Unidos na guerra; o avanço de ilha em ilha termina com Hiroshima e Nagasaki em agosto de 1945',
        section: 'Frente do Pacífico e bombas atômicas',
        quote: 'entraram formalmente na guerra após o ataque surpresa japonês à base naval americana de Pearl Harbor, em dezembro de 1941',
      },
      {
        label: 'Mundo do pós-guerra',
        claim: 'entre 70 e 85 milhões de mortos; bipolaridade EUA × URSS, ONU com veto no Conselho de Segurança e descolonização acelerada',
        section: 'Consequências',
        quote: 'a guerra consolidou a bipolaridade entre Estados Unidos e União Soviética',
      },
    ],
  },
  {
    chapterId: 'summary-historia-guerra-fria',
    family: 'contraste-de-posicoes',
    question: 'Como duas superpotências rivalizaram por quase meio século sem se enfrentar diretamente?',
    items: [
      {
        label: 'Dois blocos',
        claim: 'Otan (1949) de um lado, Pacto de Varsóvia (1955) em resposta do outro; o Muro de Berlim (1961) torna a divisão visível',
        section: 'Bipolaridade',
        quote: 'organizado pelo Pacto de Varsóvia (criado em 1955 como resposta direta à formação da própria Otan)',
      },
      {
        label: 'Guerras por procuração',
        claim: 'na Coreia e no Vietnã cada superpotência arma um lado; em Cuba (1962) o mundo chega à beira do confronto nuclear, e a crise se resolve pela diplomacia',
        section: 'Conflitos e corridas',
        quote: 'A Guerra da Coreia (1950-1953) e a Guerra do Vietnã (1955-1975) exemplificam guerras por procuração',
      },
      {
        label: 'Corrida espacial',
        claim: 'do Sputnik soviético (1957) à Apollo 11 americana na Lua (1969): prestígio tecnológico exibido para o mundo',
        section: 'Conflitos e corridas',
        quote: 'iniciada simbolicamente com o lançamento soviético do satélite Sputnik em 1957',
      },
      {
        label: 'Não alinhados',
        claim: 'em Bandung (1955), Nehru, Sukarno e Nasser propõem um caminho próprio; na prática, muitos acabam recebendo apoio de uma das superpotências',
        section: 'Terceiro Mundo e não alinhamento',
        quote: 'formalizado na Conferência de Bandung (1955)',
      },
    ],
  },
  {
    chapterId: 'summary-historia-america-latina-no-seculo-xx',
    family: 'cadeia-de-derivacao',
    question: 'Do populismo às ditaduras e de volta à democracia: o que ligou os países da região, e onde eles se separaram?',
    items: [
      {
        label: 'Populismos',
        claim: 'Vargas, Perón e Cárdenas: liderança carismática que fala direto ao trabalhador urbano, com industrialização por substituição de importações',
        section: 'Populismos e desenvolvimentismo',
        quote: 'Getúlio Vargas no Brasil, Juan Domingo Perón na Argentina e Lázaro Cárdenas no México exemplificam essa liderança',
      },
      {
        label: 'Ditaduras',
        claim: 'no auge da Guerra Fria, regimes militares no Brasil, na Argentina, no Chile e no Uruguai, com perseguição, tortura e censura',
        section: 'Ditaduras militares',
        quote: 'Brasil (1964-1985), Argentina (1976-1983), Chile (1973-1990) e Uruguai (1973-1985)',
      },
      {
        label: 'Operação Condor',
        claim: 'serviços de inteligência de várias ditaduras se aliam em segredo para perseguir opositores também fora das próprias fronteiras',
        section: 'Ditaduras militares',
        quote: 'aliança secreta entre serviços de inteligência de diferentes ditaduras sul-americanas para perseguir e eliminar opositores políticos mesmo além das fronteiras de seus próprios países de origem',
      },
      {
        label: 'Duas saídas',
        claim: 'o Brasil sai por transição negociada e gradual, com eleição direta só em 1989; a Argentina, por colapso depois da derrota nas Malvinas (1982)',
        section: 'Redemocratização e depois',
        quote: 'por meio de transição negociada e gradual, como no Brasil',
      },
    ],
  },
  {
    chapterId: 'summary-historia-disputas-europeias-no-brasil-colonial',
    family: 'cadeia-de-derivacao',
    question: 'Onde franceses e holandeses contestaram o domínio português, e o que a presença holandesa deixou?',
    items: [
      {
        label: 'França Antártica',
        claim: 'de 1555 a 1567, Villegagnon na Baía de Guanabara: pau-brasil, refúgio para calvinistas e aliança com os tupinambás',
        section: 'Franceses e a França Antártica',
        quote: 'A França Antártica (1555-1567), tentativa francesa de estabelecer colônia na Baía de Guanabara',
      },
      {
        label: 'Bahia, 1624–25',
        claim: 'na União Ibérica, o Brasil vira alvo da guerra holandesa contra a Espanha; a primeira investida, sobre a Bahia, é repelida depressa',
        section: 'Invasões holandesas',
        quote: 'A primeira invasão, à Bahia (1624-1625), foi rapidamente repelida por forças luso-espanholas',
      },
      {
        label: 'Pernambuco e Nassau',
        claim: 'a partir de 1630, domínio holandês duradouro; sob Nassau (1637–1644), Recife ganha obras, ciência, arte e tolerância religiosa',
        section: 'Invasões holandesas',
        quote: 'sob administração relativamente sofisticada do conde Maurício de Nassau (1637-1644)',
      },
      {
        label: 'Expulsão e Caribe',
        claim: 'resistência local e desgaste da Companhia expulsam os holandeses em 1654; a técnica do açúcar vai para o Caribe e cria concorrência',
        section: 'Expulsão e consequências',
        quote: 'técnicas de produção açucareira aprendidas ou aperfeiçoadas durante o período holandês foram posteriormente levadas por ex-colonos holandeses para o Caribe',
      },
    ],
  },
];
