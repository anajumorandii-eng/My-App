import type { SceneEntry } from '../types';

// Recortes do Lote 17 (redesenho dos capítulos que abriam com instrumento).
// Cada citação precisa ser trecho literal do resumo: validarLastro descarta
// a entrada inteira se uma delas não bater.
//
// Matriz Energética não ganha controle de participação: o instrumento antigo
// deixava arrastar a fatia fóssil de 0 a 100%, e o único número que o resumo
// dá para o mundo é "mais de 80%". Os recortes aqui só apontam; não medem.
export const ENTRIES_LOTE17: SceneEntry[] = [
  {
    chapterId: 'summary-geografia-desafios-ambientais-do-seculo-xxi',
    family: 'tipologia',
    question: 'Por que um problema global é tão difícil de resolver em conjunto?',
    items: [
      {
        label: 'Efeitos desiguais',
        claim: 'O mesmo aquecimento derrete geleiras e ameaça ilhas baixas, intensifica secas numa região e enchentes em outra.',
        section: 'Mudanças climáticas',
        quote: 'que se manifestam de forma diferenciada em diferentes regiões do planeta',
      },
      {
        label: 'Serviços que se perdem',
        claim: 'Sobrepesca além da reposição e perda de habitats tiram serviços gratuitos — polinização, água limpa, clima regional — com custo econômico real.',
        section: 'Perda de biodiversidade e recursos',
        quote: 'a sobrepesca de estoques marinhos além de sua capacidade natural de reposição populacional',
      },
      {
        label: 'Tragédia dos comuns',
        claim: 'Quem reduz emissões paga sozinho e na hora; o benefício se espalha por todos. Cada país prefere que o outro aja primeiro.',
        section: 'Governança e respostas',
        quote: 'os benefícios climáticos de qualquer redução de emissões são compartilhados globalmente, mas os custos econômicos de implementação recaem especificamente sobre o país que efetivamente realiza essa redução',
      },
      {
        label: 'Responsabilidade histórica',
        claim: 'Os países desenvolvidos acumularam a maior parte das emissões; os em desenvolvimento pedem espaço para crescer.',
        section: 'Governança e respostas',
        quote: 'disputas sobre responsabilidade histórica diferenciada entre países desenvolvidos',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-geopolitica-ambiental',
    family: 'contraste-de-posicoes',
    question: 'Como o meio ambiente virou disputa de poder entre países?',
    items: [
      {
        label: 'Amazônia: sumidouro',
        claim: 'A floresta dá ao Brasil peso internacional como sumidouro de carbono — e atrai pressão sobre o desmatamento, até ameaça de barreira comercial europeia.',
        section: 'Meio ambiente como questão de poder',
        quote: 'como guardião de um dos maiores sumidouros de carbono do planeta',
      },
      {
        label: 'Kyoto × Paris',
        claim: 'Kyoto (1997) obrigava só os desenvolvidos; Paris (2015) vale para todos, mas com metas voluntárias e sem sanção.',
        section: 'Conferências e acordos',
        quote: 'O Protocolo de Kyoto (1997) foi o primeiro tratado a estabelecer metas obrigatórias de redução de emissões, mas apenas para países desenvolvidos',
      },
      {
        label: 'Nilo e a barragem',
        claim: 'A barragem etíope fica em território próprio, mas reduz a água que chega ao Egito, rio abaixo.',
        section: 'Conflitos por recursos',
        quote: 'especialmente após a construção da Grande Barragem do Renascimento Etíope, que reduz a vazão que chega ao Egito',
      },
      {
        label: 'Ártico em degelo',
        claim: 'O gelo que recua abre rotas e reservas, e Rússia, EUA, Canadá e nórdicos disputam a soberania.',
        section: 'Conflitos por recursos',
        quote: 'o degelo do Ártico, acelerado pelo aquecimento global, abre novas rotas marítimas',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-politicas-ambientais-brasileiras',
    family: 'camadas-de-determinacao',
    question: 'Por que uma lei ambiental avançada não garante floresta em pé?',
    items: [
      {
        label: 'APP: onde proteger',
        claim: 'A APP é definida pelo lugar: margem de rio e topo de morro mantêm vegetação nativa, pela proteção da água e das encostas.',
        section: 'Marcos legais',
        quote: 'como margens de rios e topos de morro',
      },
      {
        label: 'Reserva Legal: quanto',
        claim: 'A Reserva Legal é um percentual do imóvel que varia com o bioma: 80% na Amazônia Legal, 35% no Cerrado dessa região, 20% no resto.',
        section: 'Marcos legais',
        quote: '80% na Amazônia Legal, 35% no Cerrado dentro dessa região, e 20% nos demais biomas do país',
      },
      {
        label: 'Satélite guia o Ibama',
        claim: 'O Deter dispara alertas quase em tempo real e aponta onde o Ibama deve ir; o Prodes consolida o desmatamento do ano.',
        section: 'Instrumentos',
        quote: 'o Deter (que detecta alertas de desmatamento em tempo quase real para orientar ações de fiscalização)',
      },
      {
        label: 'Lei × fiscalização',
        claim: 'Com poucos fiscais num território imenso e prioridades que mudam de governo a governo, o desmatamento oscila mesmo com a mesma lei.',
        section: 'Tensões e efetividade',
        quote: 'a robustez do arcabouço legal, por si só, não garante resultado ambiental efetivo sem vontade política consistente',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-matriz-energetica',
    family: 'tipologia',
    question: 'O que a matriz energética mede que a matriz elétrica não mede?',
    items: [
      {
        label: 'Elétrica dentro da energética',
        claim: 'A matriz elétrica é só a eletricidade; a energética soma transporte, indústria e aquecimento. O Brasil é renovável na primeira e ainda fóssil no transporte.',
        section: 'Conceito e composição',
        quote: 'abrangendo não apenas a geração de eletricidade (matriz elétrica, um subconjunto mais restrito)',
      },
      {
        label: 'Mundo: mais de 80% fóssil',
        claim: 'Petróleo, carvão e gás passam de 80% do consumo mundial, cada um preso a um uso: transporte, eletricidade e siderurgia, aquecimento e petroquímica.',
        section: 'Conceito e composição',
        quote: 'a matriz energética total ainda depende de combustíveis fósseis (petróleo, carvão e gás natural) para mais de 80% do consumo',
      },
      {
        label: 'Intermitente × despachável',
        claim: 'Sol e vento dependem do tempo; hidráulica com reservatório e biomassa são acionadas quando a demanda pede.',
        section: 'Fontes e classificação',
        quote: 'fontes renováveis intermitentes (eólica, solar) exigem gestão diferente de fontes renováveis despacháveis (hidráulica com reservatório, biomassa)',
      },
      {
        label: 'Transição muda o poder',
        claim: 'Exportadores de petróleo e gás perdem peso; quem tem lítio, cobalto, níquel e terras-raras ganha.',
        section: 'Transição energética',
        quote: 'países ricos em petróleo e gás perdem influência relativa, enquanto países com reservas de minerais críticos para tecnologias limpas (lítio, cobalto, níquel, terras-raras) ganham relevância estratégica nova',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-energia-eletrica-no-mundo',
    family: 'contraste-de-posicoes',
    question: 'De onde vem a eletricidade do mundo, e por que cada país escolhe diferente?',
    items: [
      {
        label: 'Geração mundial',
        claim: 'Fósseis somam cerca de 60% da geração (carvão, mais de um terço); hidrelétricas cerca de 15%; nuclear 9% a 10%; eólica, solar e biomassa 12% a 15%.',
        section: 'Fontes da geração mundial',
        quote: 'carvão, gás natural e petróleo respondem juntos por cerca de 60% da geração global',
      },
      {
        label: 'França nuclear',
        claim: 'A França gera mais de 60% da eletricidade em usinas nucleares: base constante e de baixíssima emissão.',
        section: 'Fontes da geração mundial',
        quote: 'França (que gera mais de 60% de sua eletricidade por usinas nucleares, a maior proporção do mundo)',
      },
      {
        label: 'Alemanha pós-Fukushima',
        claim: 'Depois de Fukushima (2011), a Alemanha decide desativar as nucleares, expande vento e sol — e passa a depender mais de gás importado como reserva.',
        section: 'Renováveis e seus desafios',
        quote: 'expandiu fortemente eólica e solar mas enfrentou aumento de dependência de gás natural importado',
      },
      {
        label: 'China: os dois ao mesmo tempo',
        claim: 'Maior investidor em renováveis e maior emissor: a China instala painéis e turbinas e ainda ergue usinas a carvão.',
        section: 'Renováveis e seus desafios',
        quote: 'ainda constrói novas usinas a carvão para acompanhar o crescimento de sua demanda elétrica',
      },
    ],
  },
  {
    chapterId: 'summary-geografia-producao-mineral',
    family: 'cadeia-de-derivacao',
    question: 'Onde estão os minérios, e quem paga o custo de tirá-los do chão?',
    items: [
      {
        label: 'Ferro do Escudo',
        claim: 'Formações antigas do Escudo Brasileiro concentraram ferro de teor excepcional no Quadrilátero Ferrífero (MG) e em Carajás (PA).',
        section: 'Recursos e regiões',
        quote: 'O Brasil concentra reservas expressivas de minério de ferro no Quadrilátero Ferrífero, em Minas Gerais, e na Serra dos Carajás, no Pará',
      },
      {
        label: 'Minerais críticos',
        claim: 'Lítio no triângulo andino e na Austrália, cobalto no Congo, terras-raras na China: poucos lugares abastecem as baterias.',
        section: 'Recursos e regiões',
        quote: 'cobalto (majoritariamente na República Democrática do Congo)',
      },
      {
        label: 'Barragem a montante',
        claim: 'Mariana (2015) e Brumadinho (2019) romperam e contaminaram rios por centenas de quilômetros; o alteamento a montante foi proibido para novas barragens.',
        section: 'Impactos socioambientais',
        quote: 'incluindo a proibição de novas barragens do tipo "alteamento a montante"',
      },
      {
        label: 'Garimpo e mercúrio',
        claim: 'O mercúrio do garimpo ilegal de ouro desce o rio, entra no peixe e chega a ribeirinhos e indígenas.',
        section: 'Garimpo e conflitos',
        quote: 'utiliza frequentemente mercúrio para separar o metal precioso de outros sedimentos',
      },
    ],
  },
];
