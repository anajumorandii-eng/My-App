import type { SceneEntry } from '../types';

/** Capítulos de História sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Esta é a inventariação da Task 1 (ver docs/visual-personalizado/09-familias-historia.md),
 *  já corrigida após revisão: a primeira versão usava "não cobre o capítulo
 *  inteiro" como motivo de lacuna em vários casos — padrão nunca exigido em
 *  Fase 1/2 (uma cena ancora UM aspecto do capítulo, não o capítulo inteiro).
 *  Os motivos abaixo já não usam esse raciocínio: cada lacuna aqui é de
 *  capítulo em que nenhuma seção, nem isoladamente, sustenta rivalidade
 *  genuína, derivação com dependência real, assimetria de base/camada ou
 *  tipos paralelos nomeados com frase-guarda-chuva explícita. */
export const historiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-historia-introducao-a-historia-e-primeiras-civilizacoes',
    motivo: 'Já tem experiência interativa própria (sources) no catálogo de topic-experiments, ocupando o mesmo slot do fluxo de Explorar.',
  },
  {
    chapterId: 'summary-historia-a-interiorizacao-da-colonizacao',
    motivo: 'Bandeiras, mineração e pecuária/drogas do sertão são atividades econômicas paralelas com lógicas e cronologias próprias; nenhuma seção isolada declara uma dependência real entre elas, uma rivalidade sobre pergunta compartilhada, uma assimetria de base/camada ou uma frase-guarda-chuva de tipos nomeados.',
  },
  {
    chapterId: 'summary-historia-a-republica-da-espada',
    motivo: 'O texto é periodização, não causação: a eleição de Prudente de Morais em 1894 "marca" o fim do governo militar direto, mas nunca afirma que a contenção da Revolta da Armada e da Revolução Federalista tenha produzido a transição — o "pratique" entrega essa pergunta causal em aberto ao aluno, e a pegadinha frisa que os dois movimentos tiveram "dinâmica e atores regionais distintos" (paralelos, não encadeados). Há um elo real de dois nós (a dissolução do Congresso por Deodoro em 1891 gerou a crise que contribuiu para sua renúncia), mas é fino demais para sustentar uma cena sozinho e não é a cadeia mais ampla que se poderia supor.',
  },
  {
    chapterId: 'summary-historia-disputas-europeias-no-brasil-colonial',
    motivo: 'Não há frase-guarda-chuva nomeando França Antártica e invasões holandesas como tipos de uma mesma categoria — é prosa cronológica pura. Pior: a própria pegadinha nega a coexistência exigida por tipologia ao frisar que ocorreram em séculos diferentes ("a França Antártica ocorreu no século XVI [...], enquanto as invasões holandesas ocorreram no século XVII, décadas depois"), sequenciais, não tipos paralelos coexistentes.',
  },
  {
    chapterId: 'summary-historia-a-mineracao-no-brasil-colonial',
    motivo: 'A fiscalidade (quinto, derrama) tensiona a vida social mineradora e antecede a Revolta de Vila Rica e a Inconfidência Mineira, mas o texto não chega a afirmar que a fiscalidade é a base condicionando-as como camada assimétrica — apenas contextualiza cada revolta separadamente, em momentos econômicos distintos. Fica como lacuna nesta rodada; se uma leitura futura decidir que a assimetria é suficiente, cabe reclassificar para camadas-de-determinacao.',
  },
  {
    chapterId: 'summary-historia-america-latina-no-seculo-xx',
    motivo: 'Populismo, ditaduras militares e redemocratização têm cada um sua própria pluralidade de instâncias nacionais (Vargas/Perón/Cárdenas; Brasil/Argentina/Chile/Uruguai), mas nenhuma das três seções isoladas assume claramente a forma de tipos paralelos nomeados com frase-guarda-chuva explícita — o texto apresenta exemplos de um fenômeno já definido, não tipos de um fenômeno.',
  },
  {
    chapterId: 'summary-historia-america-no-seculo-xix',
    motivo: 'Independências latino-americanas, expansão dos EUA e neocolonialismo são três processos regionais distintos; nenhuma seção isolada contém uma frase-guarda-chuva de tipos, uma rivalidade sobre pergunta compartilhada, uma dependência real entre etapas ou uma assimetria de base/camada.',
  },
  {
    chapterId: 'summary-historia-brasil-imperio-segundo-reinado-1840-1889',
    motivo: 'Estabilidade política/café, fim do tráfico e Guerra do Paraguai são processos paralelos sem dependência causal direta entre si (o fim do tráfico decorre de pressão britânica e de realocação de capital interno, não da economia cafeeira; a Guerra do Paraguai é disputa geopolítica à parte); nenhuma seção isolada sustenta rivalidade, assimetria de camada ou tipos nomeados.',
  },
  {
    chapterId: 'summary-historia-dinamica-interna-da-colonizacao',
    motivo: 'A seção de resistência escrava enumera formas diversas (quilombo/fuga e resistência cotidiana) mas sem uma frase-guarda-chuva que as trate explicitamente como tipos paralelos de uma classificação — descreve um espectro de táticas, não uma tipologia nomeada. Sociedade do açúcar e atividades subsidiárias permanecem paralelas sem estrutura adicional.',
  },
  {
    chapterId: 'summary-historia-guerra-fria',
    motivo: 'Bipolaridade, conflitos por procuração e Terceiro Mundo são aspectos paralelos amplos; a Guerra da Coreia e a Guerra do Vietnã são duas instâncias do mesmo tipo ("guerra por procuração"), não tipos paralelos distintos — não atinge o padrão de tipologia (que exige tipos diferentes entre si, não repetições do mesmo tipo).',
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria',
    motivo: 'Redemocratização, contradição do anticomunismo institucionalizado e as crises de 1954 e 1955 são aspectos paralelos; a contradição pluralismo/exclusão do PCB é uma inconsistência interna de um único sistema, não uma rivalidade entre duas posições que disputam a mesma pergunta, e as duas crises institucionais não chegam a uma frase-guarda-chuva de tipos nomeados.',
  },
  {
    chapterId: 'summary-historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo',
    motivo: 'Plano de Metas, tensão nacionalismo/capital estrangeiro e crise de 1961-1964 são aspectos paralelos; a tensão nacionalista é descrita como convivência tensa entre duas posturas dentro do mesmo governo, não uma rivalidade decisória sobre a mesma pergunta, nem uma cadeia ou camada assimétrica suficientemente explícita.',
  },
  {
    chapterId: 'summary-historia-segunda-guerra-mundial-1939-1945',
    motivo: 'As frentes europeia e do Pacífico avançam em paralelo e não dependem estritamente uma da outra (a entrada dos EUA na guerra do Pacífico não decorre da Frente Oriental europeia); o capítulo é melhor descrito como narrativa cronológica multifacetada do que como cadeia única de derivação, rivalidade ou camada.',
  },
];

/** Task 1 não escreve cenas — apenas o inventário e o esqueleto. As Tasks
 *  seguintes (análogas às Tasks 4-8 de Fase 1) preenchem esta lista,
 *  família por família, a partir da atribuição definitiva registrada em
 *  docs/visual-personalizado/09-familias-historia.md.
 *
 *  Task 3 (este lote): contraste-de-posicoes (3), camadas-de-determinacao
 *  (4), escala-de-graus (1) e movimento-dialetico (1) — 9 capítulos.
 *  Task 4 completa os 27 restantes (cadeia-de-derivacao, tipologia,
 *  criterios-conjuntivos). */
export const historia: SceneEntry[] = [
  // Task 3 — família contraste-de-posicoes (3 capítulos)
  {
    chapterId: 'summary-historia-a-historia-e-o-brasil',
    family: 'contraste-de-posicoes',
    question: 'A colonização deve ser narrada como "descobrimento e civilização" ou pela agência histórica dos povos colonizados?',
    items: [
      {
        label: 'Historiografia antiga',
        claim: 'descrevia a colonização como processo linear de "descobrimento" e "civilização", minimizando ou justificando a violência da conquista',
        section: 'Debates historiográficos',
        quote: 'tendiam a descrever a colonização como processo relativamente linear de "descobrimento" e "civilização", minimizando ou justificando a violência da conquista e a escravização de povos indígenas e posteriormente africanos',
      },
      {
        label: 'Historiografia recente',
        claim: 'enfatiza a agência histórica dos povos colonizados, em vez de tratá-los como meros objetos passivos do processo colonizador',
        section: 'Debates historiográficos',
        quote: 'enfatizam a agência histórica dos povos colonizados — sua resistência ativa, suas estratégias de negociação e adaptação, e sua contribuição cultural e econômica formadora da sociedade brasileira — em vez de tratá-los como meros objetos passivos do processo colonizador europeu',
      },
      {
        label: 'Deslocamento historiográfico',
        claim: 'a mudança entre as duas leituras reflete debate mais amplo sobre quem tem autoridade para narrar a história e sob qual perspectiva',
        section: 'Debates historiográficos',
        quote: 'Esse deslocamento historiográfico reflete debate mais amplo sobre quem tem autoridade para narrar a história e sob qual perspectiva',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-independencia-do-brasil',
    family: 'contraste-de-posicoes',
    question: 'A independência foi ruptura completa com o período colonial ou continuidade estrutural?',
    items: [
      {
        label: 'Leitura de ruptura',
        claim: 'uma leitura possível veria a independência como ruptura completa e imediata com o passado colonial',
        section: 'Continuidades',
        quote: 'contrariando qualquer leitura da independência como ruptura completa e imediata com o passado colonial',
      },
      {
        label: 'Escravidão mantida',
        claim: 'a escravidão, base do sistema produtivo colonial, permaneceu plenamente vigente após 1822, só sendo abolida em 1888',
        section: 'Continuidades',
        quote: 'A escravidão, base do sistema produtivo colonial, permaneceu plenamente vigente após 1822, só sendo formalmente abolida em 1888, mais de seis décadas depois da independência política',
      },
      {
        label: 'Continuidade estrutural',
        claim: 'a independência foi sobretudo ruptura política e administrativa com Portugal, mantendo intactas as estruturas econômicas e sociais centrais',
        section: 'Continuidades',
        quote: 'a independência brasileira representou primordialmente uma ruptura política e administrativa com Portugal, mantendo praticamente intactas as estruturas econômicas e sociais centrais da sociedade colonial',
      },
    ],
  },
  {
    chapterId: 'summary-historia-europa-no-seculo-xix',
    family: 'contraste-de-posicoes',
    question: 'Como transformar a sociedade capitalista industrial: por revolução imediata ou por reforma gradual?',
    items: [
      {
        label: 'Marx e Engels',
        claim: 'previam que o capitalismo geraria, por suas próprias contradições internas, condições para sua superação revolucionária pelo proletariado organizado',
        section: 'Movimento operário',
        quote: 'prevendo que o capitalismo industrial geraria, por suas próprias contradições estruturais internas, condições objetivas para sua própria superação revolucionária pelo proletariado industrial organizado',
      },
      {
        label: 'Social-democracia (SPD)',
        claim: 'buscava reformas progressivas por participação eleitoral e negociação institucional, em vez de ruptura revolucionária imediata',
        section: 'Movimento operário',
        quote: 'buscavam alcançar reformas sociais e políticas progressivamente por meio de participação eleitoral e negociação institucional dentro do próprio sistema parlamentar vigente, em vez de ruptura revolucionária imediata e completa',
      },
      {
        label: 'Divisão estratégica',
        claim: 'reformismo gradual e revolução imediata marcaram profundamente os debates internos do movimento socialista europeu',
        section: 'Movimento operário',
        quote: 'uma divisão estratégica entre reformismo gradual e revolução imediata que marcaria profundamente os debates internos do movimento socialista europeu',
      },
    ],
  },
  // Task 3 — família camadas-de-determinacao (4 capítulos)
  {
    chapterId: 'summary-historia-ascensao-e-dominio-das-oligarquias',
    family: 'camadas-de-determinacao',
    question: 'Como o coronelismo local sustenta toda a pirâmide política oligárquica da Primeira República?',
    items: [
      {
        label: 'Coronelismo',
        claim: 'grandes proprietários rurais locais controlavam o voto da população dependente economicamente deles',
        section: 'Coronelismo e voto de cabresto',
        quote: 'controlavam o voto da população dependente economicamente deles, especialmente trabalhadores rurais e pequenos agricultores em relação de dependência direta com o proprietário local',
      },
      {
        label: 'Voto de cabresto',
        claim: 'esse controle local sustentava toda a pirâmide política que ia do coronel até o presidente da República',
        section: 'Coronelismo e voto de cabresto',
        quote: 'sustentando toda a pirâmide política que ia do coronel local até o presidente da República',
      },
      {
        label: 'Política dos governadores',
        claim: 'o governo federal reconhecia e apoiava o poder das oligarquias em cada estado, construído sobre essa base local',
        section: 'Política dos governadores',
        quote: 'o presidente da República reconhecia e apoiava o poder das oligarquias em cada estado',
      },
      {
        label: 'Café com leite',
        claim: 'a aliança política entre São Paulo e Minas Gerais refletia diretamente a estrutura econômica dependente da exportação de café',
        section: 'Café com leite e economia',
        quote: 'Essa aliança política refletia diretamente a estrutura econômica da Primeira República, fortemente dependente da exportação de café',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-primeira-globalizacao',
    family: 'camadas-de-determinacao',
    question: 'Como a doutrina mercantilista condicionava o recurso ao trabalho compulsório na exploração colonial?',
    items: [
      {
        label: 'Doutrina mercantilista',
        claim: 'a riqueza de uma nação era medida pelo acúmulo de metais preciosos, e o comércio internacional era visto como jogo de soma zero',
        section: 'Mercantilismo e trabalho compulsório',
        quote: 'a riqueza de uma nação seria medida pelo acúmulo de metais preciosos (ouro e prata), o comércio internacional seria um jogo de soma zero em que o ganho de um país implicava perda de outro',
      },
      {
        label: 'Pacto colonial',
        claim: 'as colônias existiam para gerar balança comercial favorável à metrópole, fornecendo matéria-prima barata com exclusividade comercial',
        section: 'Mercantilismo e trabalho compulsório',
        quote: 'as colônias existiriam primordialmente para gerar balança comercial favorável à metrópole, fornecendo matéria-prima barata e absorvendo produtos manufaturados metropolitanos com exclusividade comercial (o pacto colonial)',
      },
      {
        label: 'Trabalho compulsório',
        claim: 'essa lógica mercantilista exigia trabalho compulsório em larga escala para viabilizar economicamente a exploração colonial',
        section: 'Mercantilismo e trabalho compulsório',
        quote: 'Essa lógica exigia trabalho compulsório em larga escala para viabilizar economicamente a exploração colonial',
      },
      {
        label: 'Tráfico transatlântico',
        claim: 'a escravização indígena inicial foi seguida majoritariamente pelo tráfico transatlântico de africanos, sustentando plantations e mineração',
        section: 'Mercantilismo e trabalho compulsório',
        quote: 'a escravização de povos indígenas primeiro, e depois, majoritariamente, o tráfico transatlântico de africanos escravizados, sustentando plantations de açúcar, mineração e outras atividades extrativistas',
      },
    ],
  },
  {
    chapterId: 'summary-historia-vida-urbana-e-renascimento-cultural',
    family: 'camadas-de-determinacao',
    question: 'Como a riqueza comercial das cidades italianas condicionou o mecenato e, por meio dele, a arte e a ciência renascentistas?',
    items: [
      {
        label: 'Riqueza comercial',
        claim: 'o comércio mediterrâneo e o capitalismo bancário enriqueceram as cidades italianas, gerando uma classe de mecenas dispostos a financiar artistas e intelectuais',
        section: 'Contexto do Renascimento',
        quote: 'enriquecidas pelo comércio mediterrâneo e pelas primeiras formas de capitalismo bancário europeu, gerou classe de mecenas ricos (como a poderosa família Médici em Florença) dispostos a financiar generosamente artistas, arquitetos e intelectuais',
      },
      {
        label: 'Mecenato',
        claim: 'as obras patrocinadas expressavam simultaneamente prestígio pessoal, poder político e valorização cultural renovada',
        section: 'Contexto do Renascimento',
        quote: 'patrocinando obras que expressassem simultaneamente prestígio pessoal, poder político consolidado e valorização cultural renovada',
      },
      {
        label: 'Humanismo e ciência',
        claim: 'esse contexto sustentou figuras como Leonardo da Vinci, que combinava competências em pintura, engenharia e ciências naturais',
        section: 'Humanismo e ciência',
        quote: 'Leonardo da Vinci exemplifica o ideal renascentista do "homem universal" (uomo universale), combinando em uma única pessoa competências em pintura, engenharia, anatomia e ciências naturais diversas',
      },
      {
        label: 'Arte',
        claim: 'a perspectiva linear, desenvolvida por Brunelleschi, tornou-se padrão fundamental da pintura ocidental',
        section: 'Arte e sociedade',
        quote: 'A perspectiva linear, técnica matemática desenvolvida e sistematizada por artistas e arquitetos como Filippo Brunelleschi, permitiu representar profundidade tridimensional de forma consistente e cientificamente precisa',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-primeira-republica-o-declinio-oligarquico-1889-1930',
    family: 'camadas-de-determinacao',
    question: 'Como a crise da elite cafeeira levou tenentismo, movimento operário e modernismo a convergir contra o sistema oligárquico?',
    items: [
      {
        label: 'Elite cafeeira',
        claim: 'o crash de 1929 prejudicou severamente a elite cafeeira que sustentava politicamente o sistema oligárquico',
        section: 'Crise de 1930',
        quote: 'prejudicando severamente a elite cafeeira que sustentava politicamente o sistema oligárquico vigente',
      },
      {
        label: 'Tenentismo',
        claim: 'jovens oficiais organizaram rebeliões armadas criticando a concentração de poder oligárquico e a subordinação aos interesses das elites cafeeiras',
        section: 'Movimentos de contestação',
        quote: 'O tenentismo, movimento de jovens oficiais de baixa e média patente do Exército, criticava a corrupção eleitoral, a concentração de poder oligárquico e a subordinação política e militar aos interesses das elites cafeeiras',
      },
      {
        label: 'Movimento operário',
        claim: 'o movimento operário urbano organizou greves gerais significativas reivindicando melhores condições de trabalho',
        section: 'Movimento operário e cultura',
        quote: 'organizou greves gerais significativas, como a de 1917 em São Paulo, reivindicando melhores salários, redução de jornada de trabalho e condições dignas de trabalho',
      },
      {
        label: 'Modernismo',
        claim: 'a produção cultural modernista refletia inquietações de renovação semelhantes às que motivavam o tenentismo e o movimento operário',
        section: 'Movimento operário e cultura',
        quote: 'refletindo, no campo cultural e artístico, inquietações de renovação política e social semelhantes às que motivavam o tenentismo e o movimento operário em suas respectivas esferas de atuação social',
      },
    ],
  },
  // Task 3 — família escala-de-graus (1 capítulo)
  {
    chapterId: 'summary-historia-america-espanhola',
    family: 'escala-de-graus',
    question: 'Como a hierarquia de castas coloniais distribuía direitos e status entre os grupos, do topo à base?',
    eixo: 'hierarquia jurídica e social colonial, do grupo com mais privilégios legais e políticos ao com menos — não uma escala de valor moral',
    items: [
      {
        label: 'Peninsulares',
        claim: 'ocupavam os cargos administrativos e eclesiásticos mais elevados, no topo da hierarquia',
        section: 'Sociedade colonial',
        quote: 'No topo estavam os peninsulares (espanhóis nascidos na própria Espanha, que ocupavam os cargos administrativos e eclesiásticos mais elevados)',
      },
      {
        label: 'Criollos',
        claim: 'tinham poder econômico significativo mas eram frequentemente excluídos dos cargos políticos mais altos, reservados aos peninsulares',
        section: 'Sociedade colonial',
        quote: 'os criollos (descendentes de espanhóis nascidos já na América, com poder econômico significativo mas frequentemente excluídos dos cargos políticos mais altos, reservados aos peninsulares',
      },
      {
        label: 'Mestiços, indígenas e escravizados',
        claim: 'ocupavam posições intermediárias ou inferiores; a estrutura de castas determinava direitos legais, ocupações permitidas e status social de cada indivíduo',
        section: 'Sociedade colonial',
        quote: 'mestiços, indígenas e população escravizada de origem africana, com posições intermediárias específicas conforme combinações étnicas variadas reconhecidas formalmente por essa estrutura de castas, que determinava direitos legais, ocupações permitidas e status social de cada indivíduo',
      },
    ],
  },
  // Task 3 — família movimento-dialetico (1 capítulo)
  {
    chapterId: 'summary-historia-reforma-religiosa',
    family: 'movimento-dialetico',
    question: 'Como a crítica protestante transforma a posição católica final, no Concílio de Trento?',
    items: [
      {
        label: 'Catolicismo pré-Reforma',
        claim: 'a Igreja vendia indulgências prometendo redução do tempo de purgatório, prática que a crítica luterana viria a contestar',
        section: 'Causas e Lutero',
        quote: 'a venda de indulgências (pagamentos que a Igreja Católica vendia prometendo redução do tempo de purgatório para o comprador ou para parentes falecidos)',
      },
      {
        label: 'Crítica luterana',
        claim: 'Lutero defendia a justificação pela fé, negando que a salvação dependesse de obras ou pagamentos à Igreja',
        section: 'Causas e Lutero',
        quote: 'Lutero defendia a justificação pela fé (a salvação dependeria da fé pessoal do crente, não de obras ou pagamentos à Igreja)',
      },
      {
        label: 'Concílio de Trento',
        claim: 'reafirmou os dogmas católicos centrais contestados pelos protestantes, mas também promoveu reformas internas para corrigir os abusos que haviam alimentado essas críticas — uma posição final que não é nem a pré-Reforma nem a simples rejeição da crítica protestante',
        section: 'Contrarreforma',
        quote: 'reafirmou dogmas católicos centrais contestados pelos protestantes (como a autoridade papal, a validade dos sacramentos e a importância das obras combinadas com a fé para a salvação), ao mesmo tempo em que promoveu reformas internas destinadas a corrigir abusos genuínos que haviam alimentado as críticas protestantes originais',
      },
    ],
  },
];
