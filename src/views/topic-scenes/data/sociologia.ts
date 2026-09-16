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
    nota: 'supor que os novos movimentos sociais substituíram os clássicos, quando coexistem e frequentemente se articulam',
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
];
