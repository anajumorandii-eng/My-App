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
  {
    chapterId: 'summary-historia-regime-militar-1964-1985-i',
    motivo: 'O elo golpe de 1964 → AI-5 (1968) é periodização ("marcados pela edição do AI-5"), não causação, e o AI-5 não é apresentado como causa do "milagre econômico" — são fases paralelas do mesmo regime, sem dependência textual entre si. A única frase genuinamente causal do capítulo (o endividamento do "milagre" tornando-se insustentável) aponta para fora dele, para a crise que Regime Militar (1964-1985) II retoma; não há elo interno completo o bastante para sustentar uma cadeia própria dentro deste capítulo. Mesmo padrão de historia-a-republica-da-espada.',
  },
  {
    chapterId: 'summary-historia-regime-militar-1964-1985-ii',
    motivo: 'A abertura controlada (1974-1979) e a crise econômica do início dos anos 1980 estão em sequência temporal, mas o texto atribui a crise ao esgotamento do "milagre econômico" do capítulo anterior, não à abertura política deste capítulo. A suposta ligação entre a crise econômica e o movimento Diretas Já também não está no texto: a única frase sobre o efeito da crise fala em desgaste do apoio popular ao regime em geral, não em impulso às Diretas Já especificamente. Sem essas duas ligações, o capítulo é melhor descrito como periodização. Mesmo padrão de historia-a-republica-da-espada.',
  },
  {
    chapterId: 'summary-historia-grandes-revolucoes-do-seculo-xx',
    motivo: 'As três revoluções (Russa, Mexicana, Chinesa) são narradas em seções independentes, sem frase-guarda-chuva nomeando "modelos revolucionários" como categoria comum às três. A única frase categorial do capítulo é um contraste bilateral, dentro da própria seção "Revolução Chinesa", entre o modelo soviético e o chinês ("Diferente do modelo revolucionário soviético, centrado primordialmente no proletariado urbano industrial [...] a estratégia comunista chinesa mobilizou principalmente o campesinato rural") — e essa frase nunca menciona o México. A seção "Revolução Russa" não contém nenhuma citação sobre "modelo soviético"; esse rótulo só existe citado de segunda mão dentro da seção chinesa. Forçar um terceiro tipo (mexicano) exigiria inventar uma frase-guarda-chuva que o capítulo não tem, e a única categoria genuína presente (soviético vs. chinês, por base social) não é o que o capítulo apresenta como fenômeno central. Mesmo raciocínio já usado (corretamente) em historia-disputas-europeias-no-brasil-colonial.',
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
        claim: 'a riqueza do comércio mediterrâneo e do sistema bancário das cidades italianas foi condição econômica estrutural necessária — ainda que não suficiente isoladamente — para o florescimento artístico e cultural do Renascimento',
        section: 'Pratique e confira',
        quote: 'a riqueza gerada pelo comércio mediterrâneo e pelo sistema bancário das cidades italianas, especialmente Florença sob os Médici, foi condição econômica estrutural necessária (ainda que não suficiente isoladamente) para o florescimento artístico e cultural do Renascimento',
      },
      {
        label: 'Mecenato',
        claim: 'essa riqueza gerou uma classe de mecenas dispostos a financiar generosamente artistas, arquitetos e intelectuais',
        section: 'Contexto do Renascimento',
        quote: 'enriquecidas pelo comércio mediterrâneo e pelas primeiras formas de capitalismo bancário europeu, gerou classe de mecenas ricos (como a poderosa família Médici em Florença) dispostos a financiar generosamente artistas, arquitetos e intelectuais',
      },
      {
        label: 'Humanismo',
        claim: 'o humanismo, corrente de pensamento central ao movimento, deslocou o foco intelectual do teocentrismo medieval para uma perspectiva mais antropocêntrica',
        section: 'Humanismo e ciência',
        quote: 'O humanismo renascentista, corrente de pensamento central ao movimento, deslocou progressivamente o foco intelectual do teocentrismo medieval (Deus como centro absoluto de todas as explicações sobre o mundo e a existência humana) para uma perspectiva mais antropocêntrica',
      },
      {
        label: 'Arte',
        claim: 'a arte renascentista desenvolveu técnicas e temáticas que refletiam diretamente esses valores humanistas e antropocêntricos',
        section: 'Arte e sociedade',
        quote: 'A arte renascentista desenvolveu técnicas e temáticas que refletiam diretamente os valores humanistas e antropocêntricos do movimento cultural mais amplo',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-primeira-republica-o-declinio-oligarquico-1889-1930',
    family: 'camadas-de-determinacao',
    question: 'Como o domínio da elite cafeeira condicionava o que o tenentismo, o movimento operário e o modernismo contestavam?',
    items: [
      {
        label: 'Elite cafeeira',
        claim: 'a elite cafeeira sustentava politicamente o sistema oligárquico vigente da Primeira República',
        section: 'Crise de 1930',
        quote: 'a elite cafeeira que sustentava politicamente o sistema oligárquico vigente',
      },
      {
        label: 'Tenentismo',
        claim: 'jovens oficiais criticavam a concentração de poder oligárquico e a subordinação aos interesses das elites cafeeiras, organizando rebeliões armadas',
        section: 'Movimentos de contestação',
        quote: 'O tenentismo, movimento de jovens oficiais de baixa e média patente do Exército, criticava a corrupção eleitoral, a concentração de poder oligárquico e a subordinação política e militar aos interesses das elites cafeeiras, organizando rebeliões armadas como a Revolta do Forte de Copacabana (1922)',
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
    question: 'Como a hierarquia de castas coloniais distribuía direitos e status entre os grupos, da base ao topo?',
    eixo: 'hierarquia jurídica e social colonial, do grupo com menos privilégios legais e políticos ao com mais — não uma escala de valor moral',
    items: [
      {
        label: 'Grupos subordinados',
        claim: 'mestiços, indígenas e população escravizada ocupavam posições intermediárias ou inferiores; a estrutura de castas determinava direitos legais, ocupações permitidas e status social de cada indivíduo',
        section: 'Sociedade colonial',
        quote: 'mestiços, indígenas e população escravizada de origem africana, com posições intermediárias específicas conforme combinações étnicas variadas reconhecidas formalmente por essa estrutura de castas, que determinava direitos legais, ocupações permitidas e status social de cada indivíduo',
      },
      {
        label: 'Criollos',
        claim: 'tinham poder econômico significativo mas eram frequentemente excluídos dos cargos políticos mais altos, reservados aos peninsulares',
        section: 'Sociedade colonial',
        quote: 'os criollos (descendentes de espanhóis nascidos já na América, com poder econômico significativo mas frequentemente excluídos dos cargos políticos mais altos, reservados aos peninsulares, uma discriminação que geraria ressentimento crescente e alimentaria posteriormente os movimentos de independência liderados justamente por essa elite crioula)',
      },
      {
        label: 'Peninsulares',
        claim: 'ocupavam os cargos administrativos e eclesiásticos mais elevados, no topo da hierarquia',
        section: 'Sociedade colonial',
        quote: 'No topo estavam os peninsulares (espanhóis nascidos na própria Espanha, que ocupavam os cargos administrativos e eclesiásticos mais elevados)',
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
  // Task 4 — família cadeia-de-derivacao. O documento de famílias lista 14
  // capítulos para esta família, incluindo historia-baixa-idade-media (não
  // historia-alta-idade-media-e-feudalismo, que nunca esteve nesta família —
  // essa é tipologia e fica para o outro dispatch). Desses 14, 12 foram
  // escritos aqui; historia-regime-militar-1964-1985-i e -ii voltaram para
  // historiaSemCena após revisão: cada um só tem uma frase causal real, e
  // ela aponta para o capítulo vizinho (dívida do "milagre econômico" que
  // seguirá insustentável), não para dentro do próprio capítulo — o resto é
  // periodização (mesmo padrão de historia-a-republica-da-espada).
  {
    chapterId: 'summary-historia-revolucao-francesa',
    family: 'cadeia-de-derivacao',
    question: 'Como a crise fiscal do Antigo Regime desencadeou, elo a elo, a radicalização que culminou no Terror?',
    items: [
      {
        label: 'Crise fiscal',
        claim: 'a crise financeira do Estado francês forçou o rei Luís XVI a convocar os Estados Gerais em 1789, buscando aprovação para novas medidas fiscais que os privilegiados historicamente resistiam a aceitar',
        section: 'Crise do Antigo Regime',
        quote: 'forçou o rei Luís XVI a convocar os Estados Gerais em 1789, assembleia que reunia representantes dos três estamentos e que não se reunia havia mais de um século e meio, buscando aprovação para novas medidas fiscais que os privilegiados historicamente resistiam a aceitar',
      },
      {
        label: 'Assembleia Nacional',
        claim: 'insatisfeitos com o sistema de votação por estamento nos Estados Gerais, os representantes do Terceiro Estado se autoproclamaram Assembleia Nacional Constituinte em junho de 1789',
        section: 'De 1789 à monarquia constitucional',
        quote: 'representantes do Terceiro Estado, insatisfeitos com o sistema de votação por estamento (que garantia maioria estrutural aos dois estamentos privilegiados mesmo representando parcela muito menor da população), proclamaram-se Assembleia Nacional Constituinte em junho de 1789',
      },
      {
        label: 'Tomada da Bastilha',
        claim: 'a Tomada da Bastilha, em julho de 1789, precipitou adesão crescente de diferentes setores sociais ao movimento revolucionário em curso',
        section: 'De 1789 à monarquia constitucional',
        quote: 'A Tomada da Bastilha, em 14 de julho de 1789, evento simbólico que se tornaria data nacional francesa, representou explosão popular urbana contra símbolo do poder arbitrário do Antigo Regime, precipitando adesão crescente de diferentes setores sociais ao movimento revolucionário em curso',
      },
      {
        label: 'O Terror',
        claim: 'a radicalização revolucionária resultou de fatores internos e externos retroalimentados (coalizões externas contra a revolução e desconfiança sobre a lealdade do rei), levando ao Terror, justificado pela necessidade percebida de defender a revolução contra essas mesmas ameaças',
        section: 'República, radicalização e conflitos',
        quote: 'A proclamação da República em 1792, e a radicalização subsequente do processo revolucionário, resultaram de fatores internos e externos que se retroalimentaram mutuamente ao longo dos anos seguintes. Externamente, a França revolucionária enfrentou coalizões militares de monarquias europeias vizinhas, temerosas do contágio revolucionário sobre seus próprios territórios e populações; internamente, a desconfiança crescente sobre a lealdade real de Luís XVI (agravada por sua tentativa fracassada de fuga do país em 1791) levou à abolição da monarquia e à execução do próprio rei em 1793. O período do Terror (1793-1794), sob liderança de Maximilien Robespierre e do Comitê de Salvação Pública, empregou repressão violenta sistemática contra opositores reais e supostos da revolução, justificada pela necessidade percebida de defender a própria revolução contra ameaças externas e internas simultâneas num contexto de guerra generalizada',
      },
    ],
  },
  {
    chapterId: 'summary-historia-revolucao-industrial',
    family: 'cadeia-de-derivacao',
    question: 'Como os cercamentos viabilizaram o investimento fabril, e como a evidência documentada sobre suas condições de trabalho resultou nas leis fabris?',
    items: [
      {
        label: 'Cercamentos',
        claim: 'os cercamentos das terras comunais inglesas criaram simultaneamente a mão de obra disponível e parte do capital financeiro necessário para viabilizar o investimento industrial crescente da Revolução Industrial',
        section: 'Cercamentos e trabalho assalariado',
        quote: 'criou simultaneamente a mão de obra disponível (trabalhadores sem meios próprios de subsistência, obrigados a vender sua força de trabalho) e parte do capital financeiro necessário para viabilizar o próprio investimento industrial crescente que caracterizaria a Revolução Industrial em curso',
      },
      {
        label: 'Condições documentadas',
        claim: 'um relato de fábrica de 1833 documentava jornada de treze horas para crianças a partir de nove anos, e um relatório parlamentar do mesmo período registrava deformidades físicas permanentes desenvolvidas ainda na infância pelo trabalho fabril',
        section: 'Fonte comparada',
        quote: 'um relato de fábrica têxtil inglesa de 1833 descreve jornada de trabalho de treze horas para crianças a partir de nove anos de idade, com intervalos curtos para refeição e punições físicas para lentidão ou erros no trabalho fabril. Um relatório parlamentar britânico do mesmo período, produzido justamente para investigar essas condições, documenta testemunhos de trabalhadores adultos relatando deformidades físicas permanentes desenvolvidas ainda na infância pelo próprio trabalho fabril extenuante',
      },
      {
        label: 'Leis fabris',
        claim: 'a pressão de reformistas sociais e essa evidência documental contribuíram, ao longo de décadas, para a aprovação de leis fabris que restringiram o trabalho infantil e limitaram a jornada de trabalho',
        section: 'Fonte comparada',
        quote: 'a pressão de reformistas sociais e a evidência documental sistematicamente coletada e organizada por investigações oficiais como essa contribuíram, ao longo de décadas, para a aprovação de leis fabris (como as Factory Acts britânicas) que progressivamente restringiram o trabalho infantil e estabeleceram limites legais à jornada de trabalho',
      },
    ],
  },
  {
    chapterId: 'summary-historia-grandes-navegacoes-e-conquista-colonial',
    family: 'cadeia-de-derivacao',
    question: 'Como o pioneirismo tecnológico português condicionou, elo a elo, o modelo econômico inicial de baixo investimento no Brasil?',
    items: [
      {
        label: 'Escola de Sagres',
        claim: 'o investimento sistemático em tecnologia náutica permitiu a Portugal explorar progressivamente a costa africana e alcançar a Índia por via marítima em 1498',
        section: 'Pioneirismo português',
        quote: 'Esse investimento sistemático permitiu a Portugal explorar progressivamente a costa africana ao longo do século XV, contornando o Cabo da Boa Esperança em 1488 (expedição de Bartolomeu Dias) e finalmente alcançando a Índia por via marítima direta em 1498, com Vasco da Gama',
      },
      {
        label: 'Prioridade asiática',
        claim: 'nas primeiras décadas após 1500, a Coroa portuguesa manteve-se concentrada nos lucros do comércio direto de especiarias asiáticas via rota do Cabo, o que limitou seu interesse econômico imediato pelo Brasil',
        section: 'Primeiras décadas no Brasil',
        quote: 'caracterizaram-se por interesse econômico relativamente limitado da Coroa portuguesa, então majoritariamente concentrada nos lucros muito mais expressivos e imediatos do comércio direto de especiarias asiáticas via rota do Cabo da Boa Esperança',
      },
      {
        label: 'Baixo investimento',
        claim: 'essa prioridade asiática se traduziu em modelo econômico inicial de baixo investimento no Brasil, baseado na extração de pau-brasil por escambo com populações indígenas',
        section: 'Primeiras décadas no Brasil',
        quote: 'Nesse período inicial, a exploração portuguesa do território recém-alcançado limitou-se principalmente à extração do pau-brasil, madeira nativa valorizada na Europa pela produção de corante vermelho para tecidos, obtida por meio de escambo (troca direta de mercadorias, sem uso de moeda) com populações indígenas locais',
      },
      {
        label: 'Ameaça de invasão',
        claim: 'esse modelo de baixo investimento só se transformou significativamente após ameaças de invasão por outras potências europeias, levando a Coroa a intensificar a colonização a partir da década de 1530',
        section: 'Primeiras décadas no Brasil',
        quote: 'Esse modelo econômico inicial de baixo investimento e presença colonial relativamente esparsa só se transformaria significativamente após ameaças de invasão por outras potências europeias interessadas no território, levando a Coroa portuguesa a intensificar seus esforços de efetiva colonização e ocupação territorial a partir da década de 1530',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-era-vargas-o-governo-constitucional-1934-1937',
    family: 'cadeia-de-derivacao',
    question: 'Como a radicalização política entre AIB e ANL desencadeou a cadeia de eventos que levou ao golpe do Estado Novo?',
    items: [
      {
        label: 'Radicalização (AIB/ANL)',
        claim: 'a disputa entre AIB e ANL, ambas mobilizando apoio popular significativo, criou clima de instabilidade política que Vargas utilizaria posteriormente como justificativa para medidas de exceção',
        section: 'Radicalização política',
        quote: 'Ambos os movimentos mobilizaram apoio popular significativo e protagonizaram confrontos de rua frequentes, criando clima de instabilidade política que Vargas utilizaria posteriormente como justificativa para medidas de exceção',
      },
      {
        label: 'Intentona de 1935',
        claim: 'o governo Vargas utilizou a Intentona Comunista de 1935 para justificar a decretação de um estado de sítio que se estenderia por praticamente todo o restante de seu mandato constitucional',
        section: 'Intentona e repressão',
        quote: 'O governo Vargas utilizou o episódio para justificar decretação de estado de sítio (suspensão de garantias constitucionais) que se estenderia por praticamente todo o restante de seu mandato constitucional',
      },
      {
        label: 'Plano Cohen fabricado',
        claim: 'a justificativa oficial para o golpe apoiou-se na divulgação do "Plano Cohen", posteriormente revelado como falsificação de militares integralistas, numa manobra deliberada para criar pretexto de emergência nacional',
        section: 'Golpe do Estado Novo',
        quote: 'A justificativa oficial para o golpe apoiou-se na divulgação de um documento conhecido como "Plano Cohen", supostamente um plano comunista de insurreição armada em larga escala, que posteriormente se revelaria falsificado por militares integralistas ligados ao próprio governo, numa manobra deliberada para criar pretexto de emergência nacional que justificasse a suspensão da ordem constitucional vigente',
      },
      {
        label: 'Golpe de 1937',
        claim: 'o golpe de 10 de novembro de 1937 encerrou formalmente o período constitucional ao antecipar-se à eleição presidencial prevista para 1938, com Vargas outorgando nova Constituição e fechando o Congresso Nacional',
        section: 'Golpe do Estado Novo',
        quote: 'O golpe do Estado Novo, em 10 de novembro de 1937, encerrou formalmente o período constitucional ao antecipar-se à eleição presidencial prevista para 1938, com Vargas outorgando nova Constituição (elaborada com inspiração explícita em modelos autoritários europeus, especialmente o fascismo polonês) sem qualquer processo constituinte democrático, e fechando o Congresso Nacional',
      },
    ],
  },
  {
    chapterId: 'summary-historia-o-fim-da-guerra-fria',
    family: 'cadeia-de-derivacao',
    question: 'Como as reformas de Gorbachev, destinadas a salvar o sistema soviético, desencadearam a cadeia que levou à dissolução da URSS?',
    items: [
      {
        label: 'Reformas de Gorbachev',
        claim: 'as reformas de Gorbachev, destinadas a salvar o sistema soviético, acabaram acelerando sua desagregação ao permitir que tensões represadas por décadas viessem à tona',
        section: 'Crise soviética',
        quote: 'reformas que, ao invés de salvar o sistema soviético como pretendido originalmente, acabaram acelerando sua desagregação ao permitir que tensões nacionalistas, econômicas e políticas represadas por décadas viessem à tona de forma mais aberta e organizada dentro das próprias repúblicas soviéticas',
      },
      {
        label: 'Não intervenção soviética',
        claim: 'a queda do Muro de Berlim resultou da combinação entre pressão popular na Alemanha Oriental e a decisão soviética, sob Gorbachev, de não intervir militarmente para sustentar os regimes comunistas',
        section: '1989 e a dissolução',
        quote: 'A queda do Muro de Berlim, em novembro de 1989, símbolo mais visível da própria divisão bipolar da Guerra Fria, resultou de combinação entre pressão popular crescente na Alemanha Oriental e decisão soviética, sob Gorbachev, de não intervir militarmente para sustentar os regimes comunistas da Europa Oriental',
      },
      {
        label: 'Colapso em cascata',
        claim: 'o colapso em sucessão rápida de praticamente todos os regimes comunistas da Europa Oriental em 1989 foi um efeito cascata facilitado justamente pela sinalização soviética de não intervenção militar',
        section: '1989 e a dissolução',
        quote: 'praticamente todos os regimes comunistas da Europa Oriental (Polônia, Hungria, Tchecoslováquia, Romênia, entre outros) colapsaram em sucessão rápida, um efeito cascata regional facilitado justamente pela sinalização soviética de não intervenção militar',
      },
      {
        label: 'Dissolução da URSS',
        claim: 'a própria União Soviética se dissolveria formalmente em dezembro de 1991, fragmentando-se em quinze repúblicas independentes',
        section: '1989 e a dissolução',
        quote: 'A própria União Soviética se dissolveria formalmente em dezembro de 1991, fragmentando-se em quinze repúblicas independentes',
      },
    ],
  },
  {
    chapterId: 'summary-historia-o-periodo-entreguerras-1918-1939',
    family: 'cadeia-de-derivacao',
    question: 'Como a instabilidade do pós-guerra e a Crise de 1929 desencadearam a ascensão dos totalitarismos, e como o fracasso do apaziguamento levou à Segunda Guerra Mundial?',
    items: [
      {
        label: 'Crise de 1929',
        claim: 'a Crise de 1929 expôs fragilidades estruturais profundas da economia capitalista mundial, acumuladas ao longo da década anterior',
        section: 'Crise de 1929',
        quote: 'A Crise de 1929, desencadeada pela quebra da bolsa de valores de Nova York em outubro daquele ano, expôs fragilidades estruturais profundas da economia capitalista mundial que haviam se acumulado ao longo da década anterior',
      },
      {
        label: 'Ascensão dos totalitarismos',
        claim: 'a ascensão de regimes totalitários resultou, em parte significativa, das próprias condições de instabilidade econômica e política geradas pela Primeira Guerra Mundial e agravadas pela Crise de 1929',
        section: 'Ascensão dos totalitarismos',
        quote: 'A ascensão de regimes totalitários em diferentes países europeus durante o período entreguerras resultou, em parte significativa, das próprias condições de instabilidade econômica e política geradas pela Primeira Guerra Mundial e agravadas pela Crise de 1929 subsequente',
      },
      {
        label: 'Fracasso do apaziguamento',
        claim: 'a política de apaziguamento das potências ocidentais diante das agressões territoriais alemãs se revelou completamente fracassada com a eclosão da Segunda Guerra Mundial em 1939',
        section: 'Ordem internacional fragilizada',
        quote: 'A política de apaziguamento adotada por potências ocidentais como Reino Unido e França diante das crescentes agressões territoriais da Alemanha nazista ao longo da década de 1930 (incluindo a remilitarização da Renânia em 1936 e a anexação da Áustria e de parte da Tchecoslováquia em 1938) refletiu tanto exaustão e trauma coletivo pela experiência recente da Primeira Guerra Mundial quanto avaliação estratégica equivocada de que concessões territoriais limitadas satisfariam as ambições expansionistas de Hitler, uma estratégia diplomática que se revelaria completamente fracassada com a eclosão da Segunda Guerra Mundial em 1939',
      },
    ],
  },
  {
    chapterId: 'summary-historia-brasil-imperio-formacao-do-estado-nacional-brasileiro',
    family: 'cadeia-de-derivacao',
    question: 'Como a repressão à Confederação do Equador em 1824 não resolveu o problema estrutural que ressurgiria e culminaria na abdicação de 1831?',
    items: [
      {
        label: 'Constituição de 1824',
        claim: 'a Constituição de 1824, outorgada por dom Pedro I, criou o Poder Moderador, concentrando na prática poder político desproporcional nas mãos do imperador',
        section: 'A Constituição de 1824',
        quote: 'criou o Poder Moderador, exercido pessoalmente pelo imperador, com atribuições que incluíam dissolver a Câmara dos Deputados, nomear e demitir ministros e senadores vitalícios, concedendo ao monarca capacidade de intervenção direta e decisiva sobre os demais poderes sempre que julgasse necessário',
      },
      {
        label: 'Confederação do Equador',
        claim: 'a Confederação do Equador rebelou-se contra o autoritarismo crescente de dom Pedro I, evidenciado pela dissolução forçada da Assembleia Constituinte e pela outorga unilateral da Constituição',
        section: 'Confederação do Equador',
        quote: 'rebelou-se contra o autoritarismo crescente de dom Pedro I, evidenciado justamente pela dissolução forçada da Assembleia Constituinte e pela outorga unilateral da Constituição sem processo verdadeiramente representativo e deliberativo',
      },
      {
        label: 'Abdicação de 1831',
        claim: 'a insatisfação das elites com o autoritarismo do Poder Moderador, somada à percepção de que dom Pedro I priorizava interesses portugueses, foi um dos fatores que, combinados, culminaram em pressão política crescente e na abdicação do imperador em 1831',
        section: 'Crise do Primeiro Reinado',
        quote: 'A insatisfação crescente de elites políticas brasileiras com o autoritarismo e a centralização de poder no Poder Moderador, somada à percepção de que dom Pedro I priorizava interesses portugueses (dada sua condição simultânea de possível herdeiro do trono português, questão sucessória que se tornaria efetivamente relevante após a morte de seu pai, dom João VI, em 1826) em detrimento dos interesses especificamente brasileiros, culminou em pressão política crescente que levaria à abdicação do imperador em favor de seu filho ainda criança, dom Pedro II, em abril de 1831, encerrando o período do Primeiro Reinado e dando início à fase regencial subsequente',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-montagem-da-colonizacao',
    family: 'criterios-conjuntivos',
    question: 'Que fatores, combinados e nenhum sozinho suficiente, substituíram a escravidão indígena pelo tráfico transatlântico de africanos?',
    items: [
      {
        label: 'Resistência indígena',
        claim: 'populações indígenas escravizadas resistiam por fuga para o interior, onde o conhecimento do território dificultava a captura, e por revoltas armadas',
        section: 'Escravidão indígena e africana',
        quote: 'Populações indígenas escravizadas resistiam de diversas formas (fuga para o interior, onde o conhecimento do território dificultava a captura, e revoltas armadas)',
      },
      {
        label: 'Mortalidade por epidemias',
        claim: 'a mortalidade elevadíssima por doenças europeias, para as quais não havia imunidade prévia, dizimou populações inteiras em poucas décadas de contato',
        section: 'Escravidão indígena e africana',
        quote: 'sofriam mortalidade elevadíssima por epidemias de doenças europeias (varíola, sarampo, gripe) para as quais não possuíam imunidade biológica prévia, dizimando populações inteiras em poucas décadas de contato',
      },
      {
        label: 'Oposição jesuíta',
        claim: 'ordens religiosas como os jesuítas se opunham à escravização indígena por razões próprias, defendendo a catequização como alternativa — embora aceitassem a escravidão africana sem a mesma oposição',
        section: 'Escravidão indígena e africana',
        quote: 'A Igreja Católica, por meio de ordens religiosas como os jesuítas, também se opunha, por razões religiosas e políticas próprias, à escravização indígena, defendendo a catequização como alternativa ao trabalho forçado, embora aceitasse a escravidão africana sem a mesma oposição institucional sistemática',
      },
      {
        label: 'Nenhum fator isolado',
        claim: 'nenhum desses fatores isoladamente seria suficiente para explicar a transição: ela exige causas biológicas, políticas e religiosas atuando simultaneamente ao longo de décadas',
        section: 'Pratique e confira',
        quote: 'explique por que nenhum desses fatores isoladamente seria suficiente para explicar essa transição, exigindo uma explicação que combine causas biológicas, políticas e religiosas atuando simultaneamente ao longo de décadas de colonização',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-era-vargas',
    family: 'cadeia-de-derivacao',
    question: 'Como a Revolução de 1930 desencadeou, elo a elo, o caminho até a Constituição de 1934?',
    items: [
      {
        label: 'Revolução de 1930',
        claim: 'o Governo Provisório de Vargas resultou da Revolução de 1930, movimento armado que depôs Washington Luís e encerrou a política do café com leite',
        section: 'Governo Provisório',
        quote: 'O Governo Provisório de Getúlio Vargas (1930-1934) resultou da Revolução de 1930, movimento armado que depôs o presidente eleito Washington Luís e impediu a posse de Júlio Prestes, vencedor de eleição contestada por fraude, encerrando a chamada "política do café com leite"',
      },
      {
        label: 'Governo sem mandato',
        claim: 'Vargas assumiu o poder de forma provisória, sem mandato eletivo, governando por decretos enquanto negociava com as forças políticas regionais que o haviam apoiado',
        section: 'Governo Provisório',
        quote: 'Vargas assumiu o poder de forma provisória, sem mandato eletivo direto, governando por decretos e concentrando poder executivo enquanto negociava com as forças políticas regionais que o haviam apoiado na revolução',
      },
      {
        label: 'Constitucionalismo de 1932',
        claim: 'o movimento constitucionalista paulista de 1932 pegou em armas reivindicando precisamente o fim daquele governo provisório sem mandato eletivo e a convocação de eleições para uma Assembleia Constituinte',
        section: 'Pegadinhas frequentes',
        quote: 'reivindicava principalmente a convocação de eleições para uma Assembleia Constituinte e o fim do governo provisório sem mandato eletivo',
      },
      {
        label: 'Constituição de 1934',
        claim: 'sob essa pressão, o período de governo provisório se encerrou formalmente com a promulgação de uma nova Constituição em 1934',
        section: 'Governo Provisório',
        quote: 'esse período de governo provisório se encerrou formalmente com a promulgação de uma nova Constituição em 1934, que Vargas assinou após pressão de diferentes setores políticos, incluindo o movimento constitucionalista paulista de 1932, que pegou em armas exigindo eleições para uma Assembleia Constituinte',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-era-vargas-o-estado-novo',
    family: 'cadeia-de-derivacao',
    question: 'Como a participação brasileira na guerra contra o fascismo tornou insustentável o próprio regime autoritário do Estado Novo, levando à queda de Vargas?',
    items: [
      {
        label: 'Contradição da guerra',
        claim: 'a guerra revelou contradição crescente entre o Estado Novo, regime de inspiração parcialmente fascista, e a participação brasileira na Segunda Guerra Mundial ao lado dos Aliados contra o Eixo',
        section: 'Guerra e crise do regime',
        quote: 'A guerra e a crise do regime revelaram contradição crescente entre o Estado Novo, um regime autoritário de inspiração parcialmente fascista, e a participação brasileira na Segunda Guerra Mundial ao lado dos Aliados contra as potências do Eixo (Alemanha, Itália e Japão)',
      },
      {
        label: 'Contradição insustentável',
        claim: 'essa contradição ideológica tornou-se politicamente insustentável à medida que o Brasil enviava soldados para combater o fascismo europeu enquanto mantinha regime autoritário semelhante internamente, gerando pressão por redemocratização',
        section: 'Guerra e crise do regime',
        quote: 'Essa contradição ideológica tornou-se politicamente insustentável à medida que o Brasil enviava soldados para combater o fascismo europeu enquanto mantinha regime autoritário semelhante internamente, gerando pressão crescente de setores políticos e da opinião pública por redemocratização',
      },
      {
        label: 'Queda de Vargas',
        claim: 'as próprias Forças Armadas, que haviam sustentado o golpe de 1937, retiraram seu apoio ao ditador em outubro de 1945, depondo-o e encerrando o Estado Novo',
        section: 'Guerra e crise do regime',
        quote: 'as próprias Forças Armadas, que haviam sustentado o golpe de 1937, retiraram seu apoio ao ditador em outubro de 1945, depondo-o num movimento militar relativamente pacífico que encerrou o Estado Novo e abriu caminho para o período democrático subsequente',
      },
    ],
  },
  {
    chapterId: 'summary-historia-antiguidade-classica-o-mundo-romano',
    family: 'cadeia-de-derivacao',
    question: 'Como a distribuição de poder da República Romana entrou em crise e culminou na concentração de poder pessoal de Augusto?',
    items: [
      {
        label: 'Estrutura republicana',
        claim: 'a República Romana organizava-se por meio de instituições que distribuíam poder entre Senado, assembleias populares e magistrados eleitos em pares, evitando concentração excessiva de autoridade num único indivíduo',
        section: 'Da República ao Império',
        quote: 'A República Romana (509-27 a.C.) organizava-se por meio de instituições que distribuíam poder entre diferentes órgãos — o Senado (composto por membros da aristocracia patrícia, com forte influência sobre política externa e finanças), as assembleias populares (com participação mais ampla, incluindo plebeus, especialmente após conquistas políticas como a criação do cargo de tribuno da plebe) e magistrados eleitos anualmente, como os cônsules, que exerciam poder executivo em pares para evitar concentração excessiva de autoridade num único indivíduo',
      },
      {
        label: 'Guerras civis',
        claim: 'essa estrutura republicana entrou em crise progressiva, marcada por guerras civis recorrentes entre generais poderosos disputando o poder, como César e Pompeu',
        section: 'Da República ao Império',
        quote: 'Essa estrutura republicana entrou em crise progressiva ao longo do século I a.C., marcada por guerras civis recorrentes entre generais poderosos disputando controle político (como Júlio César e Pompeu)',
      },
      {
        label: 'Augusto',
        claim: 'essa crise culminou na transição para o Império, quando Otávio Augusto consolidou poder pessoal absoluto, mantendo formalmente as instituições republicanas como fachada',
        section: 'Da República ao Império',
        quote: 'culminando na transição para o Império, quando Otávio Augusto, sobrinho-neto e herdeiro político de César, consolidou poder pessoal absoluto em 27 a.C., mantendo formalmente instituições republicanas como fachada institucional enquanto concentrava, na prática, autoridade militar, política e religiosa efetiva em sua própria pessoa',
      },
    ],
  },
  {
    chapterId: 'summary-historia-baixa-idade-media',
    family: 'cadeia-de-derivacao',
    question: 'Como a mortalidade da Peste Negra abalou, elo a elo, as estruturas senhoriais do feudalismo?',
    items: [
      {
        label: 'Peste Negra',
        claim: 'a pandemia de 1347-1351 dizimou entre um terço e metade da população europeia em poucos anos',
        section: 'Crise do século XIV',
        quote: 'A Peste Negra (1347-1351), pandemia de peste bubônica trazida provavelmente por rotas comerciais desde a Ásia Central, dizimou entre um terço e metade da população europeia em poucos anos',
      },
      {
        label: 'Escassez de mão de obra',
        claim: 'a escassez súbita de mão de obra sobrevivente elevou o poder de barganha dos camponeses e trabalhadores remanescentes',
        section: 'Crise do século XIV',
        quote: 'a escassez súbita de mão de obra sobrevivente elevou o poder de barganha dos camponeses e trabalhadores remanescentes',
      },
      {
        label: 'Abalo do trabalho servil',
        claim: 'com esse poder de barganha, camponeses passaram a exigir (e por vezes obter) melhores condições, abalando as estruturas senhoriais de exploração do trabalho servil característico do feudalismo',
        section: 'Crise do século XIV',
        quote: 'que passaram a exigir (e por vezes obter) melhores condições de trabalho e remuneração, abalando estruturas senhoriais tradicionais de exploração do trabalho servil característico do feudalismo anterior',
      },
    ],
  },
  // Task 4 (segundo dispatch) — família tipologia (9 capítulos). Cada entrada
  // inclui um item "umbrella" citando a frase-guarda-chuva que nomeia a
  // categoria comum antes de enumerar os tipos, confirmando que são variantes
  // coexistentes de um mesmo fenômeno, não posições rivais.
  {
    chapterId: 'summary-historia-imperialismo-e-belle-epoque',
    family: 'tipologia',
    question: 'Que formas paralelas de dominação colonial o imperialismo europeu adotou, direta e indireta?',
    items: [
      {
        label: 'Dominação direta',
        claim: 'a França administrava diretamente partes de sua África colonial por meio de funcionários europeus, impondo instituições e cultura metropolitana sobre a população colonizada',
        section: 'Formas de dominação',
        quote: 'A dominação direta, praticada especialmente pela França em partes de sua África colonial, envolvia administração colonial direta por funcionários europeus, impondo instituições e cultura metropolitana diretamente sobre a população colonizada local.',
      },
      {
        label: 'Dominação indireta',
        claim: 'o Reino Unido mantinha estruturas de poder local preexistentes subordinadas ao seu controle geral, reduzindo o custo administrativo direto da metrópole',
        section: 'Formas de dominação',
        quote: 'A dominação indireta, mais característica do estilo britânico de administração colonial, mantinha estruturas de poder local preexistentes (chefias tradicionais, sultanatos) subordinadas ao controle britânico geral, mas preservando aparência de autonomia administrativa local que, na prática, reduzia custos administrativos diretos para a metrópole ao delegar administração cotidiana a intermediários locais.',
      },
      {
        label: 'Mesmo fenômeno',
        claim: 'as formas de dominação colonial variaram conforme os interesses e a capacidade administrativa de cada potência europeia — dois tipos do mesmo imperialismo, não posições rivais',
        section: 'Formas de dominação',
        quote: 'As formas de dominação colonial imperialista variaram conforme os interesses e a capacidade administrativa específica de cada potência europeia envolvida.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-brasil-imperio-o-periodo-regencial-1831-1840',
    family: 'tipologia',
    question: 'Que tipos de revolta regencial eclodiram, cada um com composição e motivação regional próprias?',
    items: [
      {
        label: 'Cabanagem',
        claim: 'no Grão-Pará, envolveu participação popular ampla incluindo população pobre, mestiça e indígena, sendo uma das revoltas mais sangrentas do período',
        section: 'Revoltas regenciais',
        quote: 'A Cabanagem (1835-1840), no Grão-Pará, envolveu participação popular ampla incluindo população pobre, mestiça e indígena, com pauta que combinava contestação política regional a demandas sociais mais profundas, sendo uma das revoltas mais sangrentas do período, com elevada mortalidade proporcional à população total da província.',
      },
      {
        label: 'Farroupilha',
        claim: 'no Rio Grande do Sul, teve maior participação de elites pecuaristas descontentes com a política tarifária imperial, chegando a proclamar república separatista temporária',
        section: 'Revoltas regenciais',
        quote: 'A Farroupilha (1835-1845), no Rio Grande do Sul, teve maior participação de elites locais pecuaristas descontentes com política tarifária imperial considerada prejudicial aos interesses econômicos gaúchos, e chegou a proclamar república separatista de curta duração antes de ser negociada uma pacificação que manteve a província dentro do Império.',
      },
      {
        label: 'Sabinada e Balaiada',
        claim: 'na Bahia e no Maranhão, completam o conjunto de revoltas regionais que evidenciam a extensão territorial da instabilidade política enfrentada pelo governo central regencial',
        section: 'Revoltas regenciais',
        quote: 'A Sabinada (1837-1838), na Bahia, e a Balaiada (1838-1841), no Maranhão, complementam o conjunto de revoltas regionais que evidenciam a extensão territorial da instabilidade política enfrentada pelo governo central durante praticamente toda a década de existência do Período Regencial brasileiro.',
      },
      {
        label: 'Revoltas regenciais',
        claim: 'as revoltas regenciais eclodiram em diferentes províncias do Império, refletindo tensões regionais específicas que a fragilidade do poder central regencial não conseguia conter',
        section: 'Revoltas regenciais',
        quote: 'As revoltas regenciais eclodiram em diferentes províncias do Império, refletindo tensões sociais, econômicas e políticas regionais específicas que a fragilidade do poder central regencial não conseguia conter efetivamente.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-descolonizacao-afro-asiatica',
    family: 'tipologia',
    question: 'Que tipos de trajetória levaram à descolonização afro-asiática, negociada ou por guerra de libertação?',
    items: [
      {
        label: 'Trajetória negociada (Índia)',
        claim: 'a Índia britânica conquistou independência em 1947 após décadas de resistência não violenta liderada por Gandhi, ainda que marcada por violência intercomunitária na partição',
        section: 'Trajetórias diversas',
        quote: 'A Índia britânica conquistou independência em 1947 após décadas de movimento de resistência não violenta liderado por Mahatma Gandhi, embora o processo tenha sido marcado por violência intercomunitária massiva na partição entre Índia (majoritariamente hindu) e Paquistão (majoritariamente muçulmano), com deslocamento forçado de milhões de pessoas e mortalidade elevada nos conflitos comunais que se seguiram à própria independência.',
      },
      {
        label: 'Guerra de libertação (Argélia)',
        claim: 'a Argélia francesa só obteve independência em 1962, após guerra de libertação extremamente violenta e prolongada, já que a França considerava o território parte integrante de seu próprio território nacional',
        section: 'Trajetórias diversas',
        quote: 'A Argélia francesa, diferente da Índia, obteve independência apenas em 1962 após guerra de libertação extremamente violenta e prolongada (1954-1962) contra a França, que considerava o território argelino parte integrante e inseparável de seu próprio território nacional (diferente de outras colônias francesas administradas com status jurídico distinto), tornando a resistência francesa à independência argelina particularmente intensa e sangrenta em comparação com processos de descolonização mais negociados em outras regiões africanas do mesmo período histórico.',
      },
      {
        label: 'Trajetórias diversas',
        claim: 'as trajetórias de descolonização variaram significativamente entre diferentes territórios e potências coloniais, refletindo tanto a postura da metrópole quanto as condições internas de cada colônia',
        section: 'Trajetórias diversas',
        quote: 'As trajetórias de descolonização variaram significativamente entre diferentes territórios e potências coloniais, refletindo tanto a postura específica de cada metrópole quanto as condições internas de cada colônia.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-antiguidade-classica-o-mundo-grego',
    family: 'tipologia',
    question: 'Que tipos de pólis coexistiam sob a mesma identidade helênica, cada uma organizada de forma diferente?',
    items: [
      {
        label: 'Atenas',
        claim: 'desenvolveu democracia direta restrita a homens livres nascidos de pai (e depois também de mãe) atenienses, excluindo mulheres, escravizados e metecos',
        section: 'Atenas e a cidadania restrita',
        quote: 'apenas homens adultos, livres, nascidos em Atenas de pai ateniense (e, a partir de reforma de Péricles em 451 a.C., também de mãe ateniense) qualificavam-se como cidadãos com direito de participação política plena, excluindo completamente mulheres, escravizados (que compunham parcela expressiva, possivelmente majoritária, da população total ateniense) e metecos (estrangeiros residentes, mesmo que estabelecidos há gerações na cidade e economicamente ativos)',
      },
      {
        label: 'Esparta',
        claim: 'organizou-se quase inteiramente para a excelência e a prontidão militar, dividindo a sociedade entre espartanos, periecos e hilotas',
        section: 'Esparta e a organização social',
        quote: 'A sociedade espartana dividia-se rigidamente entre espartanos propriamente ditos (cidadãos plenos, dedicados exclusivamente ao treinamento militar desde a infância, num sistema educacional chamado agogé), periecos (habitantes livres mas sem direitos políticos, dedicados a atividades comerciais e artesanais que os espartanos, dedicados exclusivamente à guerra, não podiam exercer) e hilotas (população escravizada de origem local conquistada, submetida a exploração extrema e sujeita a violência sistemática institucionalizada, incluindo a críptia, prática de perseguição e eliminação periódica de hilotas considerados potencialmente rebeldes, usada deliberadamente para manter essa população subjugada em constante estado de intimidação).',
      },
      {
        label: 'Mosaico helênico',
        claim: 'a Grécia Antiga nunca foi um Estado único, mas um mosaico de cidades-Estado independentes entre si, unidas por elementos culturais compartilhados',
        section: 'Uma região de cidades, não um Estado único',
        quote: 'a Grécia Antiga nunca constituiu um Estado unificado no sentido moderno do termo, mas sim um mosaico de cidades-Estado (poleis) independentes entre si, cada uma com governo, leis, moeda e exército próprios, unidas por elementos culturais compartilhados — língua grega comum (ainda que com dialetos regionais distintos), religião politeísta com panteão de deuses comuns, e eventos pan-helênicos como os Jogos Olímpicos, que reuniam periodicamente representantes de diferentes cidades gregas em competição esportiva e celebração religiosa conjunta.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-absolutismo',
    family: 'tipologia',
    question: 'Que justificativas teóricas paralelas legitimaram o mesmo poder absoluto do monarca?',
    items: [
      {
        label: 'Direito divino (Bossuet)',
        claim: 'a teoria do direito divino sustentava que o poder do monarca derivava diretamente de Deus, tornando qualquer contestação uma afronta à ordem divina',
        section: 'Justificativas teóricas',
        quote: 'A teoria do direito divino dos reis, defendida por pensadores como Jacques Bossuet na França, sustentava que o poder do monarca derivava diretamente de Deus, tornando qualquer contestação ao rei equivalente a uma afronta à própria ordem divina estabelecida.',
      },
      {
        label: 'Contratualismo (Hobbes)',
        claim: 'Hobbes oferecia justificativa racional e contratualista: sem soberano absoluto os homens viveriam em guerra constante, e o contrato social que cedia direitos a um soberano seria racionalmente justificado',
        section: 'Justificativas teóricas',
        quote: 'Thomas Hobbes, em sua obra "Leviatã" (1651), oferecia justificativa de natureza mais racional e contratualista: sem um poder soberano absoluto capaz de impor ordem, os seres humanos viveriam em "estado de natureza" de guerra constante de todos contra todos, e o contrato social pelo qual os indivíduos cediam seus direitos naturais a um soberano absoluto seria racionalmente justificado como forma de garantir segurança e paz coletiva, mesmo ao custo da submissão política irrestrita a esse poder centralizado.',
      },
      {
        label: 'Convergência',
        claim: 'são fundamentações teóricas distintas — uma de base religiosa, outra racional e contratual — ainda que ambas concluam pela necessidade do mesmo poder centralizado absoluto',
        section: 'Pegadinhas frequentes',
        quote: 'são fundamentações teóricas distintas: uma de base religiosa direta, outra de base racional e contratual, ainda que ambas concluam pela necessidade de poder centralizado absoluto',
      },
    ],
  },
  {
    chapterId: 'summary-historia-iluminismo',
    family: 'tipologia',
    question: 'Que propostas paralelas de reorganização do poder político os pensadores iluministas desenvolveram a partir da mesma base racionalista?',
    items: [
      {
        label: 'Montesquieu',
        claim: 'defendeu a separação dos poderes entre Executivo, Legislativo e Judiciário como mecanismo para evitar a concentração tirânica de poder',
        section: 'Pensadores e propostas',
        quote: 'Montesquieu, em "O Espírito das Leis" (1748), defendeu a separação dos poderes políticos entre Executivo, Legislativo e Judiciário como mecanismo institucional capaz de evitar a concentração excessiva e potencialmente tirânica de poder nas mãos de um único indivíduo ou grupo, um princípio que influenciaria diretamente constituições posteriores, incluindo a dos Estados Unidos e, de forma adaptada, a própria Constituição brasileira de 1824.',
      },
      {
        label: 'Rousseau',
        claim: 'propôs a soberania popular, segundo a qual a legitimidade política deveria residir na vontade geral do povo, não em direito divino ou hereditário',
        section: 'Pensadores e propostas',
        quote: 'Rousseau, em "O Contrato Social" (1762), propôs conceito de soberania popular, segundo o qual a legitimidade política deveria residir na "vontade geral" do próprio povo, e não em direito divino ou hereditário do monarca, uma ideia radical para sua época que forneceria fundamento ideológico direto para movimentos revolucionários posteriores.',
      },
      {
        label: 'Voltaire',
        claim: 'destacou-se pela defesa combativa da liberdade de expressão e pela crítica ao fanatismo religioso e à intolerância institucional da Igreja',
        section: 'Pensadores e propostas',
        quote: 'Voltaire destacou-se especialmente pela defesa combativa da liberdade de expressão e pela crítica sistemática ao fanatismo religioso e à intolerância institucional da Igreja Católica',
      },
      {
        label: 'Base racionalista comum',
        claim: 'diferentes pensadores iluministas desenvolveram propostas específicas de reorganização do poder político, ainda que compartilhando a mesma base racionalista',
        section: 'Pensadores e propostas',
        quote: 'Diferentes pensadores iluministas desenvolveram propostas específicas para reorganizar o poder político, ainda que compartilhando a base racionalista comum descrita anteriormente.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-alta-idade-media-e-feudalismo',
    family: 'tipologia',
    question: 'Que tipos de vínculo de dependência pessoal coexistiam no mesmo sistema feudal, servindo a propósitos diferentes?',
    items: [
      {
        label: 'Servidão (senhor-servo)',
        claim: 'o servo devia ao senhor prestações em trabalho, produtos e taxas, permanecendo preso à terra ainda que juridicamente livre',
        section: 'Senhorio, trabalho e poder',
        quote: 'Os camponeses, majoritariamente servos (juridicamente livres mas presos à terra, não podendo abandoná-la sem autorização do senhor, diferente de escravizados que eram propriedade direta de um dono), deviam ao senhor prestações em trabalho (a corveia, dias de trabalho gratuito nas terras do domínio senhorial), em produtos (parcela da própria colheita) e em taxas diversas pelo uso de instalações do senhor',
      },
      {
        label: 'Suserania e vassalagem',
        claim: 'um vassalo prestava juramento de fidelidade a um suserano em troca da concessão de um feudo, administrado com autonomia prática',
        section: 'Suserania e vassalagem',
        quote: 'Um vassalo prestava juramento de fidelidade (homenagem) a um suserano mais poderoso, comprometendo-se a fornecer serviço militar (geralmente um número específico de dias de combate por ano) e conselho político em troca da concessão de um feudo (geralmente terra, mas podendo incluir outros privilégios), que o vassalo administrava com significativa autonomia prática, mesmo mantendo obrigações formais ao suserano.',
      },
      {
        label: 'Vínculos distintos',
        claim: 'a suserania e a vassalagem organizavam as relações de poder entre a própria nobreza, distintas da relação entre senhor e servo camponês',
        section: 'Suserania e vassalagem',
        quote: 'A suserania e a vassalagem organizavam as relações de poder entre a própria nobreza feudal, distintas da relação entre senhor e servo camponês descrita anteriormente.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-a-crise-do-antigo-sistema-colonial',
    family: 'tipologia',
    question: 'Que tipos de revolta colonial refletiram, com composição e motivação diferentes, o mesmo descontentamento com o pacto colonial?',
    items: [
      {
        label: 'Inconfidência Mineira',
        claim: 'articulada por elites locais de Minas Gerais insatisfeitas com a cobrança fiscal sobre o ouro, buscava inspiração na independência norte-americana',
        section: 'Revoltas coloniais',
        quote: 'A Inconfidência Mineira (1789), articulada por elites locais de Minas Gerais insatisfeitas com a cobrança rigorosa de impostos sobre a extração de ouro (especialmente a ameaça da "derrama", cobrança compulsória de dívidas fiscais atrasadas da Coroa), buscava inspiração explícita no exemplo da independência norte-americana recente, embora tenha sido descoberta e reprimida antes de qualquer ação efetiva, resultando na execução de Tiradentes como exemplo punitivo.',
      },
      {
        label: 'Conjuração Baiana',
        claim: 'envolveu participação mais popular, incluindo artesãos, soldados e pessoas escravizadas e libertas, com pautas mais radicais, incluindo a abolição da escravidão',
        section: 'Revoltas coloniais',
        quote: 'A Conjuração Baiana (1798), diferente da mineira por envolver participação mais popular incluindo artesãos, soldados e pessoas escravizadas e libertas, teve pautas mais radicais, incluindo defesa da abolição da escravidão e da igualdade racial, refletindo tensões sociais mais amplas da sociedade colonial baiana além da simples disputa fiscal entre elite local e Coroa portuguesa.',
      },
      {
        label: 'Mesmo descontentamento',
        claim: 'as revoltas coloniais eclodiram com intensidade e motivação variadas, refletindo o mesmo descontentamento crescente com o pacto colonial português',
        section: 'Revoltas coloniais',
        quote: 'As revoltas coloniais que eclodiram no Brasil ao longo do século XVIII e início do XIX refletiram, com intensidade e motivação variadas, esse descontentamento crescente com o pacto colonial português.',
      },
    ],
  },
  // Task 4 (segundo dispatch) — família criterios-conjuntivos (4 capítulos).
  // Cada entrada isola as condições que o capítulo apresenta como
  // conjuntamente necessárias, com pelo menos um item citando a linguagem
  // explícita de que nenhum fator isolado bastaria.
  {
    chapterId: 'summary-historia-o-nazismo-na-alemanha',
    family: 'criterios-conjuntivos',
    question: 'Que condições, combinadas, e nenhuma sozinha suficiente, explicam a ascensão do nazismo na Alemanha?',
    items: [
      {
        label: 'Hiperinflação de 1923',
        claim: 'a hiperinflação catastrófica de 1923 abriu o ciclo de desespero econômico que criaria terreno fértil para discursos políticos radicais',
        section: 'Bases da ascensão',
        quote: 'A hiperinflação catastrófica de 1923 e, posteriormente, a Grande Depressão de 1929 (que atingiu a Alemanha com particular severidade, dado seu já fragilizado sistema financeiro fortemente dependente de empréstimos e investimentos americanos que se retraíram abruptamente com a crise) geraram desemprego massivo e desespero econômico generalizado entre a população alemã, criando terreno fértil para discursos políticos radicais que prometiam soluções simples, embora falsas e perigosas, e culpados específicos (identificados especialmente na comunidade judaica alemã) para problemas econômicos e sociais estruturalmente complexos.',
      },
      {
        label: 'Grande Depressão de 1929',
        claim: 'a Grande Depressão de 1929 atingiu a Alemanha com particular severidade, agravando ainda mais o desespero econômico da população',
        section: 'Bases da ascensão',
        quote: 'A hiperinflação catastrófica de 1923 e, posteriormente, a Grande Depressão de 1929 (que atingiu a Alemanha com particular severidade, dado seu já fragilizado sistema financeiro fortemente dependente de empréstimos e investimentos americanos que se retraíram abruptamente com a crise) geraram desemprego massivo e desespero econômico generalizado entre a população alemã, criando terreno fértil para discursos políticos radicais que prometiam soluções simples, embora falsas e perigosas, e culpados específicos (identificados especialmente na comunidade judaica alemã) para problemas econômicos e sociais estruturalmente complexos.',
      },
      {
        label: 'Fragilidade institucional',
        claim: 'a fraqueza institucional da própria democracia alemã do período entreguerras compôs, junto à crise econômica e ao ressentimento nacionalista acumulado, a base combinada da ascensão nazista',
        section: 'Bases da ascensão',
        quote: 'As bases da ascensão do nazismo na Alemanha combinaram crise econômica profunda, ressentimento nacionalista acumulado e fraqueza institucional da própria democracia alemã do período entreguerras.',
      },
      {
        label: 'Nenhum fator isolado',
        claim: 'nenhum desses fatores isolados seria suficiente para explicar sozinho a ascensão do nazismo — só a combinação deles explica o fenômeno',
        section: 'Pegadinhas frequentes',
        quote: 'combinou-se com a hiperinflação de 1923, a Grande Depressão de 1929 e a fragilidade institucional da democracia alemã do período, sem um único fator isolado sendo suficiente para explicar sozinho o fenômeno.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-brasil-imperio-o-declinio-do-segundo-reinado',
    family: 'criterios-conjuntivos',
    question: 'Por que a perda simultânea de apoio de múltiplos setores, e não o desgaste de um só, derrubou a monarquia em 1889?',
    items: [
      {
        label: 'Questão Religiosa',
        claim: 'o conflito com bispos sobre o padroado afastou parte do clero católico do apoio incondicional à monarquia',
        section: 'Questões que corroem o Império',
        quote: 'A Questão Religiosa (1872-1875) opôs o governo imperial, que exercia o chamado padroado (direito histórico do Estado de interferir em nomeações e decisões eclesiásticas dentro do território nacional), a bispos que se recusavam a aceitar essa subordinação em conformidade com orientações papais mais recentes contrárias ao padroado, gerando conflito que afastou parte do clero católico do apoio incondicional à monarquia.',
      },
      {
        label: 'Questão Militar',
        claim: 'as disputas entre oficiais do Exército e o governo sobre liberdade de expressão política afastaram setores das Forças Armadas do apoio tradicional à monarquia',
        section: 'Questões que corroem o Império',
        quote: 'A Questão Militar (1883-1887) envolveu disputas entre oficiais do Exército e o governo imperial sobre limites à liberdade de expressão política de militares na imprensa, com oficiais insatisfeitos com punições impostas por criticarem publicamente autoridades civis, contribuindo para afastar setores das Forças Armadas, já fortalecidas política e institucionalmente desde a Guerra do Paraguai, do apoio tradicional à monarquia que caracterizara décadas anteriores do próprio Segundo Reinado.',
      },
      {
        label: 'Cafeicultores e a Lei Áurea',
        claim: 'grandes proprietários rurais, especialmente cafeicultores, sentiram-se traídos pela abolição completa da escravidão sem qualquer indenização em 1888',
        section: 'Proclamação da República',
        quote: 'a insatisfação de grandes proprietários rurais (especialmente cafeicultores) que se sentiram traídos pela abolição completa da escravidão sem qualquer indenização em 1888 (a chamada Lei Áurea)',
      },
      {
        label: 'Perda simultânea',
        claim: 'a perda simultânea de apoio de múltiplos setores tradicionalmente aliados é mais desestabilizadora do que o desgaste isolado de apenas um deles',
        section: 'Pratique e confira',
        quote: 'a perda simultânea de apoio de múltiplos setores tradicionalmente aliados é mais desestabilizadora do que o desgaste isolado de apenas um desses grupos de apoio.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-primeira-guerra-mundial-1914-1918',
    family: 'criterios-conjuntivos',
    question: 'Por que o assassinato em Sarajevo não bastou sozinho para causar a Primeira Guerra Mundial?',
    items: [
      {
        label: 'Sistema de alianças',
        claim: 'o sistema de alianças militares rígidas transformava qualquer conflito bilateral localizado em potencial detonador de guerra generalizada',
        section: 'Causas',
        quote: 'o sistema de alianças militares rígidas (a Tríplice Aliança entre Alemanha, Áustria-Hungria e Itália, contraposta à Tríplice Entente entre França, Reino Unido e Rússia) transformava qualquer conflito bilateral localizado em potencial detonador de guerra generalizada envolvendo todas as grandes potências europeias simultaneamente.',
      },
      {
        label: 'Nacionalismo e corrida armamentista',
        claim: 'o nacionalismo exacerbado e a corrida armamentista naval e terrestre elevaram as tensões geopolíticas a nível crítico antes de qualquer evento desencadeador',
        section: 'Causas',
        quote: 'O nacionalismo exacerbado, a rivalidade colonial e comercial entre potências industriais e a corrida armamentista naval e terrestre (especialmente entre Alemanha e Reino Unido) elevaram tensões geopolíticas a nível crítico já antes de qualquer evento desencadeador específico.',
      },
      {
        label: 'Sarajevo como estopim',
        claim: 'o assassinato em Sarajevo funcionou apenas como estopim imediato; sozinho não bastava — dependeu das tensões estruturais acumuladas para se transformar em guerra continental',
        section: 'Pegadinhas frequentes',
        quote: 'funcionou como estopim imediato, mas dependeu de tensões estruturais acumuladas há décadas (sistema de alianças, nacionalismo, corrida armamentista) para se transformar em conflito continental generalizado.',
      },
    ],
  },
  {
    chapterId: 'summary-historia-o-brasil-atual',
    family: 'criterios-conjuntivos',
    question: 'Que condições combinadas, e nenhuma sozinha suficiente, explicam a redução da desigualdade brasileira nos anos 2000?',
    items: [
      {
        label: 'Bolsa Família',
        claim: 'os programas de transferência direta de renda condicionada, unificados no Bolsa Família em 2003, contribuíram para a redução da pobreza extrema e da desigualdade',
        section: 'Estabilização e políticas sociais',
        quote: 'programas de transferência direta de renda condicionada, como o Bolsa Família (unificado em 2003 a partir de programas sociais anteriores mais fragmentados), combinados com política de valorização real do salário mínimo acima da inflação e período de crescimento econômico favorecido por preços internacionais elevados de commodities exportadas pelo Brasil, contribuíram para redução expressiva da pobreza extrema e da desigualdade de renda medida pelo índice de Gini ao longo daquela década específica',
      },
      {
        label: 'Valorização do salário mínimo',
        claim: 'a política de valorização real do salário mínimo acima da inflação também contribuiu para essa redução da desigualdade',
        section: 'Estabilização e políticas sociais',
        quote: 'programas de transferência direta de renda condicionada, como o Bolsa Família (unificado em 2003 a partir de programas sociais anteriores mais fragmentados), combinados com política de valorização real do salário mínimo acima da inflação e período de crescimento econômico favorecido por preços internacionais elevados de commodities exportadas pelo Brasil, contribuíram para redução expressiva da pobreza extrema e da desigualdade de renda medida pelo índice de Gini ao longo daquela década específica',
      },
      {
        label: 'Crescimento por commodities',
        claim: 'o período de crescimento econômico favorecido por preços internacionais elevados de commodities exportadas também contribuiu para essa redução',
        section: 'Estabilização e políticas sociais',
        quote: 'programas de transferência direta de renda condicionada, como o Bolsa Família (unificado em 2003 a partir de programas sociais anteriores mais fragmentados), combinados com política de valorização real do salário mínimo acima da inflação e período de crescimento econômico favorecido por preços internacionais elevados de commodities exportadas pelo Brasil, contribuíram para redução expressiva da pobreza extrema e da desigualdade de renda medida pelo índice de Gini ao longo daquela década específica',
      },
      {
        label: 'Nenhum fator isolado',
        claim: 'nenhum fator isolado bastaria para explicar sozinho a redução da desigualdade nos anos 2000 — os três precisaram se combinar',
        section: 'Pegadinhas frequentes',
        quote: 'combinou-se também com valorização real do salário mínimo e período favorável de crescimento econômico puxado por preços elevados de commodities exportadas, sem um único fator isolado sendo suficiente para explicar sozinho essa redução.',
      },
    ],
  },
];
