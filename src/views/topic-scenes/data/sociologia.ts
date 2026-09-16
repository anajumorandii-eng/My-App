import type { SceneEntry } from '../types';

/** Capítulos de Sociologia sem cena-âncora, com o motivo. */
export const sociologiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-sociologia-solidariedade-mecanica-e-solidariedade-organica',
    motivo: 'Já tem experiência interativa própria (solidarity) no mesmo slot do fluxo de Explorar.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4 preenchem. */
export const sociologia: SceneEntry[] = [
  // Task 3 — família tipologia (6 capítulos)
  {
    chapterId: 'summary-sociologia-tipos-de-acao-social',
    family: 'tipologia',
    question: 'Que tipo de sentido orienta uma ação social?',
    nota: 'São tipos ideais: na realidade, as ações costumam combinar mais de um tipo.',
    items: [
      { label: 'Racional c/ fins', claim: 'calcula meios adequados para objetivos escolhidos', section: 'Os quatro tipos', quote: 'A ação racional com relação a fins calcula meios adequados para objetivos escolhidos.' },
      { label: 'Racional c/ valores', claim: 'age por convicção, independentemente das consequências', section: 'Os quatro tipos', quote: 'A racional com relação a valores age por convicção, independentemente das consequências.' },
      { label: 'Afetiva', claim: 'é movida por emoções', section: 'Os quatro tipos', quote: 'A afetiva é movida por emoções.' },
      { label: 'Tradicional', claim: 'é guiada pelo costume', section: 'Os quatro tipos', quote: 'A tradicional é guiada pelo costume.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-dominacao-e-poder-em-weber',
    family: 'tipologia',
    question: 'Em que se funda a legitimidade de uma dominação?',
    nota: 'supor que os tipos aparecem puros na realidade, quando se combinam em casos concretos',
    items: [
      { label: 'Tradicional', claim: 'funda-se no costume e na santidade das tradições', section: 'Os três tipos de dominação legítima', quote: 'A tradicional funda-se no costume e na santidade das tradições, como na autoridade patriarcal.' },
      { label: 'Carismática', claim: 'funda-se em qualidades extraordinárias atribuídas ao líder', section: 'Os três tipos de dominação legítima', quote: 'A carismática funda-se em qualidades extraordinárias atribuídas ao líder, sendo instável e dependente do reconhecimento contínuo.' },
      { label: 'Racional-legal', claim: 'funda-se em regras impessoais e no cargo, não na pessoa', section: 'Os três tipos de dominação legítima', quote: 'A racional-legal funda-se em regras impessoais e no cargo, e não na pessoa que o ocupa.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-democracia-e-participacao-politica',
    family: 'tipologia',
    question: 'Como o poder de decidir é exercido?',
    items: [
      { label: 'Direta', claim: 'é exercida em assembleia, possível em comunidades pequenas', section: 'Formas de democracia', quote: 'A democracia direta, exercida em assembleia, foi possível em comunidades pequenas.' },
      { label: 'Representativa', claim: 'delega a decisão a eleitos', section: 'Formas de democracia', quote: 'A representativa delega a decisão a eleitos.' },
      { label: 'Participativa', claim: 'combina representação com instrumentos de intervenção direta', section: 'Formas de democracia', quote: 'A participativa combina representação com instrumentos de intervenção direta, como plebiscito, referendo, iniciativa popular, conselhos setoriais, conferências e orçamento participativo.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-movimentos-sociais-classicos-e-contemporaneos',
    family: 'tipologia',
    question: 'Em torno de que pauta os movimentos sociais se organizam?',
    nota: 'supor que os novos movimentos substituíram os clássicos, quando coexistem e frequentemente se articulam',
    items: [
      { label: 'Clássicos', claim: 'organizavam-se em torno de trabalho, salário e condições de produção', section: 'Movimentos clássicos e novos', quote: 'Os clássicos, sobretudo operários, organizavam-se em torno de trabalho, salário e condições de produção, com sindicatos e partidos como forma.' },
      { label: 'Novos movimentos', claim: 'articulam-se em torno de identidade, reconhecimento e qualidade de vida', section: 'Movimentos clássicos e novos', quote: 'Os chamados novos movimentos sociais, a partir dos anos 1960, articulam-se em torno de identidade, reconhecimento e qualidade de vida: feminismo, movimento negro, LGBTQIA+, ambientalismo e movimentos urbanos.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-globalizacao-economica-e-cultural',
    family: 'tipologia',
    question: 'Como a globalização afeta a cultura?',
    items: [
      { label: 'Homogeneização', claim: 'ocorre em certos consumos', section: 'Dimensão cultural', quote: 'As respostas variam: homogeneização em certos consumos, hibridismo com reelaboração local de elementos externos e reforço de identidades locais como reação, fenômeno visível em música, culinária e religiosidade.' },
      { label: 'Hibridismo', claim: 'reelabora localmente elementos externos', section: 'Dimensão cultural', quote: 'As respostas variam: homogeneização em certos consumos, hibridismo com reelaboração local de elementos externos e reforço de identidades locais como reação, fenômeno visível em música, culinária e religiosidade.' },
      { label: 'Identidades locais', claim: 'reforçam-se como reação à difusão global', section: 'Dimensão cultural', quote: 'As respostas variam: homogeneização em certos consumos, hibridismo com reelaboração local de elementos externos e reforço de identidades locais como reação, fenômeno visível em música, culinária e religiosidade.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-o-estado-nacao-na-era-global',
    family: 'tipologia',
    question: 'O que acontece com a soberania do Estado na era global?',
    nota: 'supor que nacionalismo e globalização são fenômenos sucessivos, quando coexistem e se alimentam mutuamente',
    items: [
      { label: 'Soberania relativizada', claim: 'é relativizada por fluxos financeiros, acordos e organismos multilaterais', section: 'Soberania em questão', quote: 'A soberania estatal é relativizada por fluxos financeiros que ultrapassam fronteiras, acordos internacionais que limitam decisões nacionais, empresas transnacionais com poder econômico superior ao de muitos países e organismos multilaterais com regras vinculantes em comércio, propriedade intelectual e finanças.' },
      { label: 'Estado persiste', claim: 'continua assegurando contratos, regulando mercados e respondendo a crises', section: 'Persistência do Estado', quote: 'Apesar disso, o Estado não desapareceu: é ele que assegura contratos, regula mercados, tributa, controla fronteiras, presta serviços e responde a crises, como ficou evidente em crises financeiras e na pandemia.' },
      { label: 'Nacionalismo', claim: 'reage à percepção de perda de controle, em tensão permanente com a interdependência', section: 'Nacionalismos e tensões', quote: 'A percepção de perda de controle alimentou reações nacionalistas, protecionismo e políticas migratórias restritivas em vários países.' },
    ],
  },
  // Task 3 — família criterios-conjuntivos (3 capítulos)
  {
    chapterId: 'summary-sociologia-o-que-e-o-fato-social',
    family: 'criterios-conjuntivos',
    question: 'Quando um fenômeno é um fato social, no sentido de Durkheim?',
    items: [
      { label: 'Exterioridade', claim: 'existe antes e independentemente do indivíduo', section: 'As três características', quote: 'Durkheim define fato social por três traços: exterioridade, pois existe antes e independentemente do indivíduo; coercitividade, pois se impõe e a transgressão gera sanção; e generalidade, pois é comum ao grupo.' },
      { label: 'Coercitividade', claim: 'impõe-se ao indivíduo e a transgressão gera sanção', section: 'As três características', quote: 'Durkheim define fato social por três traços: exterioridade, pois existe antes e independentemente do indivíduo; coercitividade, pois se impõe e a transgressão gera sanção; e generalidade, pois é comum ao grupo.' },
      { label: 'Generalidade', claim: 'é comum ao grupo', section: 'As três características', quote: 'Durkheim define fato social por três traços: exterioridade, pois existe antes e independentemente do indivíduo; coercitividade, pois se impõe e a transgressão gera sanção; e generalidade, pois é comum ao grupo.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-a-sociedade-da-informacao',
    family: 'criterios-conjuntivos',
    question: 'O que é preciso reunir para que o acesso digital deixe de ser excludente?',
    items: [
      { label: 'Conexão', claim: 'disponibilidade de conexão e dispositivos', section: 'Desigualdade digital', quote: 'O acesso é desigual em várias camadas: disponibilidade de conexão e dispositivos, qualidade do acesso e capacidade de uso crítico.' },
      { label: 'Qualidade', claim: 'qualidade do acesso', section: 'Desigualdade digital', quote: 'O acesso é desigual em várias camadas: disponibilidade de conexão e dispositivos, qualidade do acesso e capacidade de uso crítico.' },
      { label: 'Uso crítico', claim: 'capacidade de uso crítico', section: 'Desigualdade digital', quote: 'O acesso é desigual em várias camadas: disponibilidade de conexão e dispositivos, qualidade do acesso e capacidade de uso crítico.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-identidade-e-diferenca',
    family: 'criterios-conjuntivos',
    question: 'O que é preciso para que a questão da identidade seja de fato enfrentada?',
    items: [
      { label: 'Reconhecimento', claim: 'reconhecer identidades é necessário, mas sozinho não basta', section: 'Diferença e desigualdade', quote: 'reconhecer identidades sem enfrentar desigualdades materiais deixa a questão pela metade' },
      { label: 'Redistribuição', claim: 'enfrentar as desigualdades materiais também é necessário', section: 'Pratique e confira', quote: 'reconhecer identidades é insuficiente se as desigualdades materiais permanecem intocadas' },
    ],
  },
  // Task 3 — família grade-de-eixos (2 capítulos)
  {
    chapterId: 'summary-sociologia-anomia-e-coesao-social',
    family: 'grade-de-eixos',
    question: 'Que tipo de suicídio resulta do cruzamento entre dimensão e desequilíbrio?',
    eixos: {
      a: { nome: 'dimensão', polos: ['integração', 'regulação'] },
      b: { nome: 'desequilíbrio', polos: ['deficiência', 'excesso'] },
    },
    items: [
      { label: 'Egoísta', claim: 'resulta de integração insuficiente', section: 'O estudo sobre o suicídio', quote: 'Distingue o egoísta, por integração insuficiente; o altruísta, por integração excessiva; o anômico, por falta de regulação; e o fatalista, por regulação opressiva, provando a existência de causas sociais.', celula: { eixoA: 0, eixoB: 0 } },
      { label: 'Altruísta', claim: 'resulta de integração excessiva', section: 'O estudo sobre o suicídio', quote: 'Distingue o egoísta, por integração insuficiente; o altruísta, por integração excessiva; o anômico, por falta de regulação; e o fatalista, por regulação opressiva, provando a existência de causas sociais.', celula: { eixoA: 0, eixoB: 1 } },
      { label: 'Anômico', claim: 'resulta de falta de regulação', section: 'O estudo sobre o suicídio', quote: 'Distingue o egoísta, por integração insuficiente; o altruísta, por integração excessiva; o anômico, por falta de regulação; e o fatalista, por regulação opressiva, provando a existência de causas sociais.', celula: { eixoA: 1, eixoB: 0 } },
      { label: 'Fatalista', claim: 'resulta de regulação opressiva', section: 'O estudo sobre o suicídio', quote: 'Distingue o egoísta, por integração insuficiente; o altruísta, por integração excessiva; o anômico, por falta de regulação; e o fatalista, por regulação opressiva, provando a existência de causas sociais.', celula: { eixoA: 1, eixoB: 1 } },
    ],
  },
  {
    chapterId: 'summary-sociologia-classes-sociais-e-mobilidade-social',
    family: 'grade-de-eixos',
    question: 'Que tipo de mobilidade resulta do cruzamento entre direção e prazo?',
    eixos: {
      a: { nome: 'direção', polos: ['vertical', 'horizontal'] },
      b: { nome: 'prazo', polos: ['intrageracional', 'intergeracional'] },
    },
    items: [
      { label: 'Vertical intra', claim: 'muda de posição na hierarquia ao longo da vida de uma pessoa', section: 'Tipos de mobilidade', quote: 'A mobilidade pode ser vertical, quando há mudança de posição na hierarquia, ou horizontal, quando se muda de ocupação sem alterar o estrato. Pode ser intrageracional, ao longo da vida de uma pessoa, ou intergeracional, comparando a posição de filhos e pais, medida mais usada para avaliar abertura de uma sociedade.', celula: { eixoA: 0, eixoB: 0 } },
      { label: 'Vertical inter', claim: 'muda de posição na hierarquia entre gerações; é a medida mais usada para avaliar abertura de uma sociedade', section: 'Tipos de mobilidade', quote: 'A mobilidade pode ser vertical, quando há mudança de posição na hierarquia, ou horizontal, quando se muda de ocupação sem alterar o estrato. Pode ser intrageracional, ao longo da vida de uma pessoa, ou intergeracional, comparando a posição de filhos e pais, medida mais usada para avaliar abertura de uma sociedade.', celula: { eixoA: 0, eixoB: 1 } },
      { label: 'Horizontal intra', claim: 'muda de ocupação sem alterar o estrato ao longo da vida de uma pessoa', section: 'Tipos de mobilidade', quote: 'A mobilidade pode ser vertical, quando há mudança de posição na hierarquia, ou horizontal, quando se muda de ocupação sem alterar o estrato. Pode ser intrageracional, ao longo da vida de uma pessoa, ou intergeracional, comparando a posição de filhos e pais, medida mais usada para avaliar abertura de uma sociedade.', celula: { eixoA: 1, eixoB: 0 } },
      { label: 'Horizontal inter', claim: 'muda de ocupação sem alterar o estrato entre gerações', section: 'Tipos de mobilidade', quote: 'A mobilidade pode ser vertical, quando há mudança de posição na hierarquia, ou horizontal, quando se muda de ocupação sem alterar o estrato. Pode ser intrageracional, ao longo da vida de uma pessoa, ou intergeracional, comparando a posição de filhos e pais, medida mais usada para avaliar abertura de uma sociedade.', celula: { eixoA: 1, eixoB: 1 } },
    ],
  },
  // Task 4 — família contraste-de-posicoes (8 capítulos)
  {
    chapterId: 'summary-sociologia-o-contexto-historico-do-surgimento-da-sociologia',
    family: 'contraste-de-posicoes',
    question: 'Qual é o objeto próprio da sociologia, segundo os clássicos?',
    items: [
      { label: 'Durkheim', claim: 'o objeto próprio é o fato social e a coesão', section: 'Os clássicos', quote: 'o fato social e a coesão, em Durkheim' },
      { label: 'Marx', claim: 'o objeto próprio são as relações de produção e a luta de classes', section: 'Os clássicos', quote: 'as relações de produção e a luta de classes, em Marx' },
      { label: 'Weber', claim: 'o objeto próprio é a ação social dotada de sentido e a racionalização', section: 'Os clássicos', quote: 'a ação social dotada de sentido e os processos de racionalização, em Weber' },
    ],
  },
  {
    chapterId: 'summary-sociologia-sociologia-e-senso-comum',
    family: 'contraste-de-posicoes',
    question: 'A vida social pode ser explicada pelo senso comum, ou exige a ruptura metódica da sociologia?',
    items: [
      { label: 'Senso comum', claim: 'orienta a vida cotidiana e frequentemente funciona, sem exigir verificação', section: 'O que é senso comum', quote: 'Não é ignorância nem falsidade automática: orienta a vida cotidiana e frequentemente funciona.' },
      { label: 'Sociologia', claim: 'exige romper com as pré-noções, definir conceitos com rigor e submeter conclusões à crítica', section: 'A ruptura epistemológica', quote: 'A sociologia se constitui pela ruptura com as pré-noções: exige definir conceitos com rigor, formular hipóteses, coletar dados e submeter conclusões à crítica.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-a-luta-de-classes-na-analise-sociologica',
    family: 'contraste-de-posicoes',
    question: 'O que define a posição de alguém na estrutura social?',
    items: [
      { label: 'Marx', claim: 'a posição nas relações de produção — possuir ou não meios de produção', section: 'Classe e posição estrutural', quote: 'Classe social, na análise marxista, define-se pela posição nas relações de produção: possuir ou não meios de produção e comprar ou vender força de trabalho.' },
      { label: 'Weber', claim: 'classe econômica somada a status e poder, dimensões que podem não coincidir', section: 'Pratique e confira', quote: 'mantém a dimensão econômica de classe, mas acrescenta o status, ligado a prestígio e estilo de vida, e o partido, ligado ao poder, tratando-as como dimensões que podem não coincidir.' },
      { label: 'Bourdieu', claim: 'capitais econômico, cultural e social, múltiplos recursos que definem a posição', section: 'Leituras contemporâneas', quote: 'Bourdieu propôs capitais econômico, cultural e social, mostrando que a posição depende de múltiplos recursos' },
    ],
  },
  {
    chapterId: 'summary-sociologia-cultura-e-etnocentrismo',
    family: 'contraste-de-posicoes',
    question: 'Como julgar outras culturas: pelo próprio padrão, ou compreendendo sua lógica interna?',
    items: [
      { label: 'Etnocentrismo', claim: 'julga outras culturas a partir dos valores da própria, tomando os próprios costumes como padrão do correto', section: 'Etnocentrismo', quote: 'Etnocentrismo é julgar outras culturas a partir dos valores da própria, tomando os próprios costumes como padrão do que é natural e correto.' },
      { label: 'Estranhamento', claim: 'estranha o familiar e familiariza o estranho, reconhecendo lógica interna em cada cultura', section: 'Estranhamento e desnaturalização', quote: 'O antídoto metodológico é o exercício de estranhar o familiar e familiarizar o estranho: perceber que os próprios costumes também são arbitrários e que os alheios têm lógica interna.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-multiculturalismo-e-relativismo-cultural',
    family: 'contraste-de-posicoes',
    question: 'O relativismo cultural é ferramenta de pesquisa, ou a tese de que nenhum juízo entre culturas é possível?',
    items: [
      { label: 'Relativismo metodológico', claim: 'compreende práticas pela lógica interna de cada sociedade; é ferramenta de pesquisa contra o etnocentrismo', section: 'Relativismo cultural', quote: 'O relativismo metodológico propõe compreender práticas culturais a partir da lógica interna de cada sociedade, e não pelos padrões do observador. É ferramenta de pesquisa que combate o etnocentrismo.' },
      { label: 'Relativismo moral radical', claim: 'sustenta que nenhum juízo entre culturas é possível, o que inviabiliza a defesa de direitos', section: 'Relativismo cultural', quote: 'Distingue-se do relativismo moral radical, que sustenta que nenhum juízo entre culturas é possível, posição criticada por inviabilizar a defesa de direitos.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-desigualdade-racial-no-brasil',
    family: 'contraste-de-posicoes',
    question: 'O Brasil vive uma democracia racial pela miscigenação, ou um racismo estrutural encoberto por esse mito?',
    items: [
      { label: 'Mito da democracia racial', claim: 'o Brasil teria harmonia racial por causa da miscigenação', section: 'O mito da democracia racial', quote: 'A ideia de que o Brasil teria harmonia racial por causa da miscigenação foi difundida como identidade nacional, mas encobre desigualdades sistemáticas.' },
      { label: 'Racismo estrutural', claim: 'opera de forma difusa, sem leis segregacionistas explícitas, mas com efeitos concretos', section: 'O mito da democracia racial', quote: 'Pesquisas de Florestan Fernandes, Clóvis Moura, Lélia Gonzalez e outros mostraram que o racismo brasileiro opera de forma difusa, sem leis segregacionistas explícitas, mas com efeitos concretos.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-divisao-social-do-trabalho',
    family: 'contraste-de-posicoes',
    question: 'A divisão do trabalho gera coesão, ou alienação e exploração?',
    items: [
      { label: 'Durkheim', claim: 'é fonte de solidariedade orgânica e coesão nas sociedades modernas', section: 'Duas leituras', quote: 'Durkheim vê na divisão do trabalho a fonte da solidariedade orgânica e da coesão nas sociedades modernas, com a anomia como patologia possível.' },
      { label: 'Marx', claim: 'sob o capitalismo, é mecanismo de alienação e de aumento da exploração', section: 'Duas leituras', quote: 'Marx vê nela, sob o capitalismo, um mecanismo de alienação e de aumento da exploração.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-transformacoes-no-mundo-do-trabalho',
    family: 'contraste-de-posicoes',
    question: 'A automação leva a desemprego tecnológico massivo, ou à criação de novas ocupações?',
    items: [
      { label: 'Desemprego massivo', claim: 'a automação e a IA provocariam desemprego tecnológico massivo', section: 'Reestruturação e desemprego', quote: 'O debate opõe quem prevê desemprego tecnológico massivo e quem aponta a criação de novas ocupações e a mudança de perfil.' },
      { label: 'Novas ocupações', claim: 'a automação cria novas ocupações e muda o perfil do emprego, sem gerar desemprego generalizado', section: 'Reestruturação e desemprego', quote: 'O debate opõe quem prevê desemprego tecnológico massivo e quem aponta a criação de novas ocupações e a mudança de perfil.' },
    ],
  },
  // Task 4 — família cadeia-de-derivacao (4 capítulos)
  {
    chapterId: 'summary-sociologia-etica-protestante-e-o-espirito-do-capitalismo',
    family: 'cadeia-de-derivacao',
    question: 'Como a doutrina calvinista da predestinação leva ao espírito do capitalismo?',
    items: [
      { label: 'Angústia da salvação', claim: 'a doutrina da predestinação gerava angústia sobre a salvação', section: 'O mecanismo', quote: 'A doutrina da predestinação gerava angústia sobre a salvação.' },
      { label: 'Êxito como sinal de graça', claim: 'o êxito no trabalho, lido como vocação, passou a ser sinal possível de graça, e a ascese desestimulava o consumo', section: 'O mecanismo', quote: 'O êxito no trabalho, entendido como vocação, passou a ser lido como possível sinal de graça, e a ascese intramundana desestimulava o consumo ostentatório.' },
      { label: 'Acumulação sistemática', claim: 'o resultado foi acumulação sistemática, reinvestimento e disciplina, favoráveis ao capitalismo', section: 'O mecanismo', quote: 'O resultado prático foi acumulação sistemática, reinvestimento e disciplina, favoráveis ao desenvolvimento capitalista.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-educacao-e-socializacao-em-durkheim',
    family: 'cadeia-de-derivacao',
    question: 'Como a educação sustenta a coesão social, segundo Durkheim?',
    items: [
      { label: 'Transmissão de normas', claim: 'transmite normas, valores e conhecimentos necessários à vida coletiva', section: 'A função da educação', quote: 'Sua função é formar o ser social no indivíduo, transmitindo normas, valores e conhecimentos necessários à vida coletiva e produzindo a homogeneidade mínima sem a qual a sociedade não se sustenta.' },
      { label: 'Homogeneidade mínima', claim: 'produz a homogeneidade mínima sem a qual a sociedade não se sustenta', section: 'A função da educação', quote: 'Sua função é formar o ser social no indivíduo, transmitindo normas, valores e conhecimentos necessários à vida coletiva e produzindo a homogeneidade mínima sem a qual a sociedade não se sustenta.' },
      { label: 'Coesão garantida', claim: 'garante a coesão e permite a vida coletiva', section: 'Pratique e confira', quote: 'formar o ser social no indivíduo, transmitindo normas e valores que garantem a coesão e permitem a vida coletiva, além de preparar para funções específicas.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-precarizacao-e-uberizacao-do-trabalho',
    family: 'cadeia-de-derivacao',
    question: 'Por que a classificação do entregador de plataforma como autônomo é questionável?',
    items: [
      { label: 'Ritmo e preço definidos', claim: 'o trabalhador é classificado como parceiro autônomo, mas tem ritmo, preço e avaliação definidos pela plataforma', section: 'Uberização', quote: 'O trabalhador é classificado como parceiro autônomo, mas tem seu ritmo, preço e avaliação definidos pela plataforma, o que caracteriza controle sem os direitos correspondentes ao emprego.' },
      { label: 'Controle algorítmico', claim: 'o algoritmo define preço, distribuição de tarefas, avaliação e possibilidade de bloqueio', section: 'Pratique e confira', quote: 'o algoritmo define preço, distribuição de tarefas, avaliação e possibilidade de bloqueio, o que configura subordinação, ainda que o horário seja escolhido pelo trabalhador.' },
      { label: 'Subordinação', claim: 'isso configura subordinação, ainda que o horário seja escolhido pelo trabalhador', section: 'Pratique e confira', quote: 'o algoritmo define preço, distribuição de tarefas, avaliação e possibilidade de bloqueio, o que configura subordinação, ainda que o horário seja escolhido pelo trabalhador.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-desigualdade-de-genero',
    family: 'cadeia-de-derivacao',
    question: 'Como a distinção entre sexo e gênero mostra que os papéis são socialmente produzidos?',
    items: [
      { label: 'Distinguir sexo de gênero', claim: 'sexo remete a características biológicas e gênero a construções sociais de masculinidade e feminilidade', section: 'Sexo e gênero', quote: 'A distinção entre sexo, referido a características biológicas, e gênero, referido a construções sociais de masculinidade e feminilidade, é o ponto de partida do campo.' },
      { label: 'Os papéis variam', claim: 'papéis considerados naturais variam entre sociedades e ao longo da história', section: 'Sexo e gênero', quote: 'Ela permite mostrar que papéis considerados naturais variam entre sociedades e ao longo da história, o que os revela como socialmente produzidos.' },
      { label: 'Logo, são transformáveis', claim: 'variando entre culturas e épocas, são construções sociais e podem ser transformados', section: 'Pratique e confira', quote: 'ela permite mostrar que papéis atribuídos a homens e mulheres variam entre culturas e épocas, portanto são construções sociais e podem ser transformados' },
    ],
  },
  // Task 4 — família camadas-de-determinacao (2 capítulos)
  {
    chapterId: 'summary-sociologia-modo-de-producao-e-estrutura-social',
    family: 'camadas-de-determinacao',
    question: 'O que condiciona o quê: a base econômica ou a superestrutura?',
    items: [
      { label: 'Base econômica', claim: 'condiciona a superestrutura jurídica, política e ideológica', section: 'Base e superestrutura', quote: 'A base econômica condiciona a superestrutura jurídica, política e ideológica, que por sua vez atua sobre a base.' },
      { label: 'Superestrutura', claim: 'atua de volta sobre a base, com autonomia relativa e efeitos próprios', section: 'Base e superestrutura', quote: 'a determinação é em última instância, e as demais esferas têm autonomia relativa, com efeitos próprios sobre o processo histórico.' },
    ],
  },
  {
    chapterId: 'summary-sociologia-ideologia-e-alienacao',
    family: 'camadas-de-determinacao',
    question: 'O que produz o quê: o trabalho social, ou a aparência que o oculta?',
    items: [
      { label: 'Trabalho social', claim: 'produz o valor da mercadoria, ainda que essa origem fique oculta', section: 'Fetichismo da mercadoria', quote: 'Marx descreve como as relações entre pessoas aparecem como relações entre coisas: a mercadoria parece ter valor por si mesma, ocultando o trabalho social que a produziu.' },
      { label: 'Ideologia', claim: 'apresenta interesses particulares de uma classe como se fossem universais e naturais', section: 'Ideologia', quote: 'Na tradição marxista, ideologia designa o conjunto de representações que apresentam interesses particulares de uma classe como se fossem universais e naturais.' },
    ],
  },
  // Task 4 — família escala-de-graus (1 capítulo)
  {
    chapterId: 'summary-sociologia-cidadania-e-direitos',
    family: 'escala-de-graus',
    question: 'Em que ordem histórica Marshall situa os direitos de cidadania?',
    eixo: 'da ordem histórica de conquista dos direitos, não de um valor crescente',
    items: [
      { label: 'Civis', claim: 'ligados à liberdade individual e à propriedade', section: 'As três gerações', quote: 'Marshall distingue direitos civis, ligados à liberdade individual e à propriedade; políticos, ligados à participação e ao voto; e sociais, ligados a educação, saúde, trabalho e previdência.' },
      { label: 'Políticos', claim: 'ligados à participação e ao voto', section: 'As três gerações', quote: 'Marshall distingue direitos civis, ligados à liberdade individual e à propriedade; políticos, ligados à participação e ao voto; e sociais, ligados a educação, saúde, trabalho e previdência.' },
      { label: 'Sociais', claim: 'ligados a educação, saúde, trabalho e previdência', section: 'As três gerações', quote: 'Marshall distingue direitos civis, ligados à liberdade individual e à propriedade; políticos, ligados à participação e ao voto; e sociais, ligados a educação, saúde, trabalho e previdência.' },
      { label: 'Difusos e digitais', claim: 'acrescentam-se depois direitos como ambiente, patrimônio, tecnologia e informação', section: 'As três gerações', quote: 'Acrescentam-se depois direitos difusos, como ambiente e patrimônio, e direitos ligados a tecnologia e informação.' },
    ],
  },
];
