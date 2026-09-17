import type { SceneEntry } from '../types';

/** Capítulos de Química sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Estado ao fim da Task 1: atribuição definitiva de família (ou lacuna) para
 *  os 48 capítulos, derivada de leitura integral de deepSummaryContent.json.
 *  O raciocínio completo, com citações literais, está em
 *  docs/visual-personalizado/14-familias-quimica.md — as Tasks 2-4 preenchem
 *  `quimica` a partir dali; esta lista de lacunas já está completa. */
export const quimicaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-quimica-o-estado-gasoso',
    motivo:
      'Postulados do gás ideal, variáveis de estado e limites do modelo real são exposição conceitual/procedural (define o modelo e suas variáveis), sem rivalidade, camadas, tipos coexistentes com guarda-chuva, critérios conjuntivos declarados, escala nomeada ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-estudo-dos-gases-ii',
    motivo:
      'Lei geral dos gases, equação de Clapeyron e lei de Dalton das pressões parciais são fórmulas e roteiros de cálculo aplicados a um único fenômeno (comportamento de um gás), não uma estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-separacao-de-misturas',
    motivo:
      'É um guia de referência de técnicas de laboratório organizado por tipo de mistura (heterogênea, homogênea, casos especiais); não há guarda-chuva de tipos coexistentes de um mesmo objeto — as técnicas resolvem problemas diferentes, não são variantes de uma mesma categoria — nem escala nem cadeia.',
  },
  {
    chapterId: 'summary-quimica-transformacoes-fisicas-e-quimicas-e-balanceamento-de-equacoes',
    motivo:
      'A distinção física/química é binária (mais fraca que as tipologias aceitas, com três ou mais variantes) e o balanceamento é procedimento de ajuste de coeficientes, não estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-massa-atomica-mol-e-massa-molar',
    motivo:
      'Define massa atômica, mol e massa molar e as conversões entre elas; é vocabulário e conversão de unidades, sem rivalidade, camadas, tipos, escala ou cadeia.',
  },
  {
    chapterId: 'summary-quimica-determinacao-de-formulas-quimicas',
    motivo:
      'Roteiro de cálculo (percentual → mínima → molecular, incluindo o caso de combustão) sem rivalidade, tipos coexistentes, critérios conjuntivos ou cadeia causal.',
  },
  {
    chapterId: 'summary-quimica-estequiometria-leis-ponderais',
    motivo:
      'As três leis ponderais (Lavoisier, Proust, Dalton) são apresentadas como conceitos complementares que se sucedem historicamente ("a lei de Dalton... complementa a lei de Proust"), não como variantes coexistentes com guarda-chuva nem como elos causais entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-calculos-estequiometricos',
    motivo:
      'Roteiro de resolução (conversão para mol, regra de três, reagente limitante) é procedimento de cálculo, não estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-processos-de-oxirreducao',
    motivo:
      'Define oxidação/redução, número de oxidação e balanceamento por transferência de elétrons; é conceitual/procedural, sem guarda-chuva de tipos, escala nomeada, critérios conjuntivos declarados ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-introducao-a-quimica-organica',
    motivo:
      'Introduz vocabulário de forma preliminar; os critérios de classificação de cadeia (aberta/fechada, normal/ramificada, saturada/insaturada, homogênea/heterogênea) são quatro critérios binários independentes, não uma tipologia única com guarda-chuva — a enumeração mais completa das funções orgânicas está nos capítulos dedicados (Nomenclatura Oxigenados/Nitrogenados; Reconhecimento de Funções), que já cobrem essa família.',
  },
  {
    chapterId: 'summary-quimica-nomenclatura-de-compostos-organicos',
    motivo:
      'Regras de nomenclatura IUPAC (prefixo/infixo/sufixo, escolha de cadeia principal, numeração por menores localizantes) são procedimento de codificação de nome, sem estrutura de família.',
  },
  {
    chapterId: 'summary-quimica-reacoes-de-adicao',
    motivo:
      'Descreve mecanismos de adição a alcenos/alcinos e a carbonílicos, mais a regra de Markovnikov; é narrativa de mecanismo e regra preditiva, não guarda-chuva de tipos coexistentes, escala, critérios conjuntivos ou cadeia causal — a tipologia adição/eliminação/substituição já está coberta em "Interpretando Reações Orgânicas", e este capítulo específico não tem guarda-chuva próprio de subtipos de adição.',
  },
  {
    chapterId: 'summary-quimica-reacoes-de-oxidacao-em-hidrocarbonetos',
    motivo:
      'Combustão completa/incompleta é distinção binária, e oxidação branda/enérgica é contraste de condições reacionais (suave vs. drástica) sobre o mesmo mecanismo, não rivalidade teórica nem tipos coexistentes com guarda-chuva.',
  },
  {
    chapterId: 'summary-quimica-acidos-graxos-e-esterificacao',
    motivo:
      'Saturado/insaturado é distinção binária; esterificação e saponificação são duas reações distintas contrastadas para evitar confusão, não posições rivais nem tipos coexistentes de uma mesma categoria.',
  },
  {
    chapterId: 'summary-quimica-transesterificacao-alcoolise',
    motivo:
      'Descreve a reação, sua aplicação (biodiesel) e vantagens/limites como trade-off ("vantagens... mas também limitações técnicas e econômicas reais"), padrão já rejeitado em fases anteriores para contraste-de-posicoes por não ser rejeição mútua de posições teóricas.',
  },
  {
    chapterId: 'summary-quimica-acidez-e-basicidade-pka',
    motivo:
      'A força de ácidos/bases é medida por Ka/pKa, métrica contínua comparada caso a caso (mesmo padrão de rejeição do Gini em Geografia), não escala de estágios nomeados discretos; os três fatores que estabilizam a base conjugada atuam de forma independente e cumulativa, sem a frase de necessidade conjunta exigida por criterios-conjuntivos.',
  },
  {
    chapterId: 'summary-quimica-polimeros',
    motivo:
      'Apresenta três critérios de classificação binários e independentes (natural/sintético; termoplástico/termorrígido; adição/condensação); nenhum chega à enumeração de três ou mais variantes coexistentes exigida pelas tipologias aceitas — mesmo padrão de rejeição aplicado à Matriz Energética (renovável/não renovável) em Geografia.',
  },
  {
    chapterId: 'summary-quimica-termoquimica-i',
    motivo:
      'Exotérmica/endotérmica é distinção binária, e a lei de Hess é procedimento de manipulação algébrica de equações; nenhuma estrutura de família sustentada por guarda-chuva próprio.',
  },
  {
    chapterId: 'summary-quimica-introducao-ao-estudo-das-pilhas-e-baterias',
    motivo:
      'Descreve o princípio da pilha, organização da célula, potencial/espontaneidade e a distinção binária pilha comum/recarregável; conceitual e procedural, sem guarda-chuva de tipos coexistentes, escala, critérios conjuntivos ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'summary-quimica-eletroquimica-de-processos-espontaneos',
    motivo:
      'Descreve a pilha de Daniell, potenciais de redução e os mecanismos de proteção catódica e galvanização; proteção catódica e galvanização são o mesmo princípio aplicado de duas formas, não posições rivais nem tipos coexistentes com guarda-chuva próprio.',
  },
  {
    chapterId: 'summary-quimica-eletroquimica-de-processos-nao-espontaneos',
    motivo:
      'A inversão de polaridade entre pilha e eletrólise (cátodo positivo vs. negativo) é convenção de nomenclatura definicional, não rivalidade teórica; eletrólise ígnea/aquosa é distinção binária.',
  },
  {
    chapterId: 'summary-quimica-aspectos-quantitativos-da-eletroquimica-e-metalurgia',
    motivo:
      'As leis de Faraday e o roteiro de cálculo são procedimento numérico; a distinção metal pouco reativo/muito reativo, que decide o método de obtenção, é binária.',
  },
  {
    chapterId: 'summary-quimica-deslocamento-de-equilibrio',
    motivo:
      'O princípio de Le Chatelier é um único mecanismo unificador ("o sistema sempre reage contra a perturbação"), e concentração/pressão/temperatura/catalisador são fatores causais heterogêneos aplicados a esse princípio, não variantes coexistentes de uma categoria — mesmo padrão de rejeição de "fatores" aplicado a Cinética Química.',
  },
  {
    chapterId: 'summary-quimica-equilibrios-ionicos',
    motivo:
      'Ionização e constante (Ka/Kb), grau de ionização e lei de Ostwald, efeito do íon comum e solução-tampão; conceitual/procedural, com grau de ionização como métrica contínua (mesmo padrão de rejeição do pKa), sem guarda-chuva de tipos coexistentes, escala nomeada discreta ou cadeia causal entre eventos distintos.',
  },
  {
    chapterId: 'qui-equilibrio-acidificacao',
    motivo:
      'Conteúdo editorial de "Equilíbrios Químicos I": equilíbrio dinâmico, interpretação de Keq (métrica contínua, mesmo padrão de rejeição do pKa e do grau de ionização) e a convenção de omitir sólidos/líquidos puros da expressão de Keq; conceitual/procedural, sem estrutura de família sustentada por guarda-chuva próprio.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4
 *  preenchem a partir da atribuição fixada em
 *  docs/visual-personalizado/14-familias-quimica.md. */
export const quimica: SceneEntry[] = [
  // família cadeia-de-derivacao (3 capítulos)
  {
    chapterId: 'summary-quimica-evolucao-dos-modelos-atomicos',
    family: 'cadeia-de-derivacao',
    question: 'Como cada modelo atômico respondeu a uma evidência que o anterior não explicava?',
    items: [
      { label: 'Dalton', claim: 'esfera maciça, sem estrutura interna, coerente com as leis ponderais conhecidas', section: 'Modelos respondem a evidências', quote: 'Dalton, no início do século XIX, propôs o átomo como uma esfera maciça, indivisível e indestrutível' },
      { label: 'Thomson', claim: 'pudim de passas, a partir da descoberta experimental do elétron', section: 'Modelos respondem a evidências', quote: 'propôs o modelo do "pudim de passas": uma esfera de carga positiva difusa, com elétrons negativos incrustados nela' },
      { label: 'Rutherford', claim: 'núcleo denso, a partir de um resultado incompatível com o pudim de passas', section: 'Experimentos decisivos', quote: 'resultado completamente incompatível com o modelo do pudim de passas, que previa carga positiva difusa e uniformemente distribuída' },
      { label: 'Modelo quântico', claim: 'substitui as órbitas fixas de Bohr por regiões de probabilidade', section: 'Modelo quântico', quote: 'substituem definitivamente a ideia de órbitas fixas e bem definidas de Bohr por regiões de probabilidade' },
    ],
  },
  {
    chapterId: 'summary-quimica-equacoes-ionicas-e-outras-teorias-para-acidos-e-bases',
    family: 'cadeia-de-derivacao',
    question: 'Como cada teoria ácido-base resolveu uma limitação da anterior?',
    items: [
      { label: 'Arrhenius', claim: 'não explica por que a amônia, sem hidroxila, se comporta como base', section: 'Equação iônica', quote: 'ela não explica por que substâncias sem hidroxila, como a amônia (NH3), se comportam como base' },
      { label: 'Brønsted-Lowry', claim: 'redefine ácido como doador de próton e base como receptor de próton', section: 'Equação iônica', quote: 'A teoria de Brønsted-Lowry resolve parte dessa limitação redefinindo ácido como toda espécie capaz de doar um próton (H+) e base como toda espécie capaz de receber um próton' },
      { label: 'Lewis', claim: 'dispensa completamente a exigência de um próton na reação', section: 'Brønsted-Lowry', quote: 'A teoria mais ampla ainda, a de Lewis, dispensa completamente a exigência de um próton envolvido na reação' },
    ],
  },
  {
    chapterId: 'summary-quimica-quimica-ambiental',
    family: 'cadeia-de-derivacao',
    question: 'Como o excesso de nutrientes numa água leva à mortandade de peixes?',
    items: [
      { label: 'Excesso de nutrientes', claim: 'provoca proliferação descontrolada de algas, bloqueando a luz', section: 'Química das soluções ambientais', quote: 'provoca proliferação descontrolada de algas e cianobactérias na superfície da água, bloqueando a penetração de luz' },
      { label: 'Decomposição bacteriana', claim: 'consome o oxigênio dissolvido até níveis insuficientes', section: 'Química das soluções ambientais', quote: 'consumindo o oxigênio dissolvido disponível na água até níveis insuficientes para sustentar a vida aquática' },
      { label: 'Mortandade por asfixia', claim: 'ocorre sem qualquer substância diretamente tóxica envolvida', section: 'Química das soluções ambientais', quote: 'mortandade de peixes por asfixia, mesmo sem qualquer substância diretamente tóxica envolvida no processo completo' },
    ],
  },
  // família tipologia (14 capítulos)
  {
    chapterId: 'summary-quimica-organizacao-da-tabela-periodica-dos-elementos',
    family: 'tipologia',
    question: 'Que famílias de elementos têm comportamento químico característico próprio?',
    items: [
      { label: 'Alcalinos', claim: 'um elétron de valência, altíssima reatividade, reagem até com água fria', section: 'Famílias e comportamento', quote: 'têm apenas um elétron na camada de valência, altíssima reatividade química (facilmente perdem esse único elétron de valência, formando cátions monovalentes estáveis), e reagem vigorosamente até mesmo com água à temperatura ambiente' },
      { label: 'Alcalino-terrosos', claim: 'dois elétrons de valência, reatividade elevada porém menor que a dos alcalinos', section: 'Famílias e comportamento', quote: 'têm dois elétrons de valência, reatividade elevada porém menor que a dos alcalinos do mesmo período' },
      { label: 'Halogênios', claim: 'sete elétrons de valência, tendem a ganhar um elétron adicional', section: 'Famílias e comportamento', quote: 'têm sete elétrons de valência, altíssima reatividade também, mas em direção oposta aos alcalinos: tendem fortemente a ganhar um elétron adicional, formando ânions monovalentes estáveis (haletos)' },
      { label: 'Gases nobres', claim: 'camada de valência completa, praticamente inertes', section: 'Famílias e comportamento', quote: 'têm a camada de valência completa (oito elétrons, exceto o hélio, com dois), condição de estabilidade eletrônica máxima que os torna praticamente inertes quimicamente' },
    ],
  },
  {
    chapterId: 'summary-quimica-radioatividade-o-estudo-das-radiacoes',
    family: 'tipologia',
    question: 'Que tipos de emissão radioativa existem, e como se distinguem?',
    items: [
      { label: 'Alfa', claim: 'carga +2, massa grande, baixo poder de penetração', section: 'As emissões', quote: 'tem carga elétrica +2, massa relativamente grande, baixo poder de penetração (barrada por uma simples folha de papel ou pela própria pele humana), mas alto poder de ionização localizado' },
      { label: 'Beta', claim: 'carga −1, massa muito menor, penetração intermediária', section: 'As emissões', quote: 'tem carga −1, massa muito menor que a alfa, poder de penetração intermediário (barrada por uma fina lâmina de alumínio ou material similar)' },
      { label: 'Gama', claim: 'sem massa nem carga, altíssimo poder de penetração', section: 'As emissões', quote: 'tem altíssimo poder de penetração, exigindo barreiras espessas de chumbo ou concreto para bloqueio eficaz, mas menor poder de ionização localizado por unidade de percurso' },
    ],
  },
  {
    chapterId: 'summary-quimica-ligacoes-quimicas-e-alotropia',
    family: 'tipologia',
    question: 'Que tipos de ligação química interatômica existem?',
    items: [
      { label: 'Iônica', claim: 'transferência efetiva de elétrons, formando retículo cristalino', section: 'Estabilidade por interação', quote: 'ocorre por transferência efetiva e completa de um ou mais elétrons de um átomo (geralmente um metal, com baixa energia de ionização, facilmente perdendo elétrons) para outro átomo' },
      { label: 'Covalente', claim: 'compartilhamento de pares de elétrons, formando moléculas discretas', section: 'Estabilidade por interação', quote: 'ocorre por compartilhamento de pares de elétrons entre dois átomos (geralmente ametais entre si, ou ametal com hidrogênio), formando moléculas discretas e bem definidas' },
      { label: 'Metálica', claim: 'mar de elétrons deslocalizado, explica condutividade e maleabilidade', section: 'Estabilidade por interação', quote: 'ocorre entre átomos de metais, com os elétrons de valência formando um "mar de elétrons" deslocalizado e livre para se mover por toda a estrutura cristalina metálica' },
    ],
  },
  {
    chapterId: 'summary-quimica-geometria-molecular',
    family: 'tipologia',
    question: 'Que geometrias moleculares resultam do número de pares eletrônicos ao redor do átomo central?',
    items: [
      { label: 'Linear', claim: 'dois pares ligantes, ângulo de 180° (CO2)', section: 'As geometrias mais comuns', quote: 'a geometria é linear, com ângulo de 180° entre as ligações (exemplo: CO2)' },
      { label: 'Trigonal plana', claim: 'três pares ligantes, ângulos de 120° (BF3)', section: 'As geometrias mais comuns', quote: 'a geometria é trigonal plana, com ângulos de 120° (exemplo: BF3)' },
      { label: 'Angular (SO2)', claim: 'três regiões com um par isolado, ângulo menor que 120°', section: 'As geometrias mais comuns', quote: 'torna-se angular, com ângulo ligeiramente menor que 120° devido à repulsão extra do par isolado (exemplo: SO2)' },
      { label: 'Tetraédrica', claim: 'quatro pares ligantes, ângulos de 109,5° (CH4)', section: 'As geometrias mais comuns', quote: 'a geometria é tetraédrica, com ângulos de aproximadamente 109,5° (exemplo: CH4)' },
      { label: 'Piramidal trigonal', claim: 'quatro regiões com um par isolado, ângulo de 107° (NH3)', section: 'As geometrias mais comuns', quote: 'a geometria observável é piramidal trigonal, com ângulo ligeiramente comprimido para cerca de 107° (exemplo: NH3)' },
      { label: 'Angular (H2O)', claim: 'quatro regiões com dois pares isolados, ângulo de 104,5°', section: 'As geometrias mais comuns', quote: 'a geometria observável é angular (ou em forma de V), com ângulo ainda mais comprimido, próximo de 104,5° (exemplo: H2O)' },
    ],
  },
  {
    chapterId: 'summary-quimica-composicao-da-materia-estados-fisicos',
    family: 'tipologia',
    question: 'Em que estados físicos a matéria se apresenta?',
    items: [
      { label: 'Sólido', claim: 'partículas fortemente unidas, posição fixa, forma e volume definidos', section: 'Estados e mudanças', quote: 'as partículas estão fortemente unidas por forças intermoleculares, com posição fixa numa estrutura organizada, vibrando mas sem se deslocar — forma e volume definidos' },
      { label: 'Líquido', claim: 'partículas deslizam entre si, volume definido, forma variável', section: 'Estados e mudanças', quote: 'as forças ainda unem as partículas, mas permitem deslizamento entre elas — volume definido, forma que se adapta ao recipiente' },
      { label: 'Gasoso', claim: 'forças desprezíveis, sem forma nem volume definidos', section: 'Estados e mudanças', quote: 'as forças intermoleculares são praticamente desprezíveis frente à energia cinética das partículas, que se movem livremente e ocupam todo o espaço disponível — nem forma nem volume definidos' },
    ],
  },
  {
    chapterId: 'summary-quimica-quimica-inorganica',
    family: 'tipologia',
    question: 'Quais são as quatro funções inorgânicas clássicas?',
    items: [
      { label: 'Ácidos', claim: 'liberam H+ (ou H3O+) em água', section: 'As quatro funções', quote: 'são compostos que, dissolvidos em água, liberam íons H+ (ou H3O+) como único tipo de cátion resultante da ionização' },
      { label: 'Bases', claim: 'liberam OH− em água', section: 'As quatro funções', quote: 'são compostos que, dissolvidos em água, liberam íons OH− como único tipo de ânion resultante da dissociação' },
      { label: 'Sais', claim: 'formados pela neutralização entre um ácido e uma base', section: 'As quatro funções', quote: 'são compostos iônicos formados, tipicamente, pela reação de neutralização entre um ácido e uma base, contendo um cátion diferente de H+ e um ânion diferente de OH− em sua composição' },
      { label: 'Óxidos', claim: 'compostos binários em que o oxigênio é o elemento mais eletronegativo', section: 'As quatro funções', quote: 'são compostos binários (formados por apenas dois elementos diferentes) em que o oxigênio é o elemento mais eletronegativo presente na composição' },
    ],
  },
  {
    chapterId: 'summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados',
    family: 'tipologia',
    question: 'Que sufixo identifica cada função orgânica oxigenada ou nitrogenada?',
    items: [
      { label: 'Álcool', claim: 'hidroxila em carbono saturado, sufixo -ol', section: 'Funções oxigenadas', quote: 'Os álcoois, com hidroxila (-OH) ligada a carbono saturado, recebem sufixo -ol.' },
      { label: 'Aldeído', claim: 'carbonila na extremidade da cadeia, sufixo -al', section: 'Funções oxigenadas', quote: 'Os aldeídos, com o grupo carbonila (C=O) obrigatoriamente na extremidade da cadeia (ligado a pelo menos um átomo de hidrogênio além da cadeia carbônica), recebem sufixo -al.' },
      { label: 'Cetona', claim: 'carbonila num carbono interno, sufixo -ona', section: 'Funções oxigenadas', quote: 'As cetonas, com o grupo carbonila localizado num carbono interno da cadeia (nunca na extremidade, sempre ligado a dois outros carbonos de cada lado), recebem sufixo -ona.' },
      { label: 'Ácido carboxílico', claim: 'carboxila no carbono terminal, sufixo -oico', section: 'Funções oxigenadas', quote: 'Os ácidos carboxílicos, com o grupo carboxila (-COOH, combinação de carbonila e hidroxila no mesmo carbono terminal), recebem o sufixo -oico' },
      { label: 'Éter', claim: 'oxigênio interligando duas cadeias, sem sufixo padrão', section: 'Funções oxigenadas', quote: 'Os éteres, com um átomo de oxigênio interligando duas cadeias carbônicas diferentes (sem hidrogênio ligado diretamente a esse oxigênio), não seguem exatamente o mesmo padrão de sufixo dos demais' },
      { label: 'Amina', claim: 'nitrogênio ligado a grupos orgânicos, sufixo -amina', section: 'Funções nitrogenadas', quote: 'As aminas têm um átomo de nitrogênio ligado a um, dois ou três grupos orgânicos (substituindo um, dois ou três dos três hidrogênios originais da amônia), classificando-se em primárias, secundárias ou terciárias' },
      { label: 'Amida', claim: 'carbonila ligada a nitrogênio, sufixo -amida', section: 'Funções nitrogenadas', quote: 'As amidas têm um grupo carbonila diretamente ligado a um átomo de nitrogênio (em vez de a uma hidroxila, como ocorreria num ácido carboxílico), recebendo sufixo -amida' },
      { label: 'Nitrila', claim: 'grupo C≡N na extremidade, sufixo -nitrila', section: 'Funções nitrogenadas', quote: 'Os nitrilas (ou nitrilos) têm o grupo característico C≡N (uma tripla ligação entre carbono e nitrogênio) na extremidade da cadeia, recebendo sufixo -nitrila' },
    ],
  },
  {
    chapterId: 'summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades',
    family: 'tipologia',
    question: 'Em que funções orgânicas distintas um mesmo átomo de oxigênio pode estar presente?',
    items: [
      { label: 'Álcool', claim: 'oxigênio ligado a hidroxila num carbono saturado', section: 'Identificar pelo grupo funcional', quote: 'se ligado a hidroxila num carbono saturado' },
      { label: 'Aldeído ou cetona', claim: 'oxigênio fazendo parte de uma carbonila terminal ou interna', section: 'Identificar pelo grupo funcional', quote: 'se fazendo parte de uma carbonila, dependendo de sua posição terminal ou interna na cadeia' },
      { label: 'Ácido carboxílico', claim: 'carbonila e hidroxila combinadas no mesmo carbono', section: 'Identificar pelo grupo funcional', quote: 'se combinando carbonila e hidroxila no mesmo carbono' },
      { label: 'Éter', claim: 'oxigênio interligando duas cadeias carbônicas', section: 'Identificar pelo grupo funcional', quote: 'se interligando duas cadeias carbônicas diferentes sem hidrogênio disponível ligado a ele' },
    ],
  },
  {
    chapterId: 'summary-quimica-isomeria',
    family: 'tipologia',
    question: 'Que tipos de isomeria existem entre compostos de mesma fórmula molecular?',
    items: [
      { label: 'Plana', claim: 'isômeros diferem na própria conectividade entre os átomos', section: 'Isomeria plana', quote: 'ocorre quando os isômeros diferem na própria conectividade entre os átomos — quais átomos estão ligados a quais outros' },
      { label: 'Geométrica', claim: 'mesma conectividade, disposição espacial diferente ao redor de uma dupla ligação', section: 'Isomeria geométrica', quote: 'ocorre entre compostos com a mesma conectividade entre os átomos, mas com disposição espacial diferente ao redor de uma ligação dupla carbono-carbono (ou de um anel)' },
      { label: 'Óptica', claim: 'carbono ligado a quatro grupos diferentes, imagem especular não sobreponível', section: 'Isomeria óptica', quote: 'ocorre quando um composto possui um carbono quiral (ou carbono assimétrico) — um átomo de carbono ligado a quatro grupos substituintes diferentes entre si, sem repetição alguma' },
    ],
  },
  {
    chapterId: 'summary-quimica-combustiveis-fosseis',
    family: 'tipologia',
    question: 'Que tipos de dano ambiental os produtos da combustão de fósseis causam?',
    items: [
      { label: 'CO2', claim: 'principal responsável pelo efeito estufa e aquecimento global', section: 'Combustão e impactos', quote: 'o próprio CO2 liberado em escala industrial é o principal responsável pelo aumento do efeito estufa e pelo aquecimento global observado nas últimas décadas' },
      { label: 'CO', claim: 'gás extremamente tóxico por competir com o oxigênio na hemoglobina', section: 'Combustão e impactos', quote: 'produz monóxido de carbono (CO), gás incolor e inodoro extremamente tóxico por competir com o oxigênio na ligação com a hemoglobina' },
      { label: 'Fuligem', claim: 'carbono particulado da combustão incompleta', section: 'Combustão e impactos', quote: 'e fuligem (carbono particulado)' },
      { label: 'SO2/NOx', claim: 'precursores da chuva ácida e do smog fotoquímico', section: 'Combustão e impactos', quote: 'Combustíveis com impurezas de enxofre liberam dióxido de enxofre na queima, principal precursor da chuva ácida' },
    ],
  },
  {
    chapterId: 'summary-quimica-interpretando-reacoes-organicas',
    family: 'tipologia',
    question: 'Que grandes tipos de reação orgânica existem, distinguidos pelo padrão estrutural?',
    items: [
      { label: 'Adição', claim: 'ligação múltipla se rompe parcialmente, novos átomos se ligam', section: 'Os grandes tipos', quote: 'uma ligação dupla ou tripla se rompe parcialmente, e novos átomos ou grupos se ligam aos carbonos que antes participavam dessa ligação múltipla' },
      { label: 'Eliminação', claim: 'dois átomos são removidos, formando uma nova ligação múltipla', section: 'Os grandes tipos', quote: 'dois átomos ou grupos são removidos de carbonos vizinhos, formando uma nova ligação múltipla onde antes só havia ligações simples' },
      { label: 'Substituição', claim: 'um átomo é trocado por outro, sem alterar a saturação', section: 'Os grandes tipos', quote: 'um átomo ou grupo funcional é trocado diretamente por outro, sem que a saturação da cadeia carbônica se altere no processo' },
    ],
  },
  {
    chapterId: 'summary-quimica-reacoes-de-substituicao',
    family: 'tipologia',
    question: 'Que mecanismos distintos de substituição existem, em alcanos, aromáticos e haletos?',
    nota: 'são três mecanismos estruturalmente distintos entre si, compartilhando apenas a característica estrutural comum de trocar um átomo por outro',
    items: [
      { label: 'Radicalar (alcanos)', claim: 'ativação por luz ou calor, mecanismo radicalar em etapas', section: 'Em alcanos', quote: 'ocorre tipicamente sob ativação por luz ultravioleta ou calor intenso, seguindo um mecanismo radicalar em etapas' },
      { label: 'Eletrofílica (aromáticos)', claim: 'eletrófilo ataca o anel, interrompendo a aromaticidade momentaneamente', section: 'Em aromáticos', quote: 'um eletrófilo (como Br+, gerado in situ a partir de Br2 na presença de um catalisador apropriado) ataca o anel aromático, formando temporariamente um intermediário instável em que a aromaticidade do anel é momentaneamente interrompida' },
      { label: 'Nucleofílica (haletos)', claim: 'nucleófilo ataca o carbono ligado ao halogênio, que sai como grupo abandonador', section: 'Em haletos', quote: 'um nucleófilo (espécie rica em elétrons, como o íon hidróxido, OH−) ataca diretamente o carbono ligado ao halogênio, que por sua vez é um bom grupo abandonador' },
    ],
  },
  {
    chapterId: 'summary-quimica-dispersoes',
    family: 'tipologia',
    question: 'Como o tamanho das partículas dispersas classifica uma dispersão?',
    items: [
      { label: 'Soluções verdadeiras', claim: 'íons ou moléculas isolados, diâmetro inferior a 1 nm, não sedimentam', section: 'Classificação por tamanho', quote: 'as partículas dispersas são íons ou moléculas isolados, com diâmetro inferior a 1 nanômetro' },
      { label: 'Coloides', claim: 'diâmetro entre 1 e 1000 nm, dispersos de forma estável', section: 'Classificação por tamanho', quote: 'as partículas dispersas têm diâmetro entre 1 e 1000 nanômetros aproximadamente — grande demais para se dissolver molecularmente, mas pequeno demais para sedimentar por gravidade em tempo razoável' },
      { label: 'Suspensões', claim: 'partículas maiores que 1000 nm, sedimentam e são retidas por filtração', section: 'Classificação por tamanho', quote: 'as partículas dispersas são maiores que 1000 nanômetros, visíveis a olho nu ou com microscópio simples, sedimentam com o tempo por ação da gravidade e são facilmente retidas por filtração comum' },
    ],
  },
  {
    chapterId: 'summary-quimica-efeitos-coligativos',
    family: 'tipologia',
    question: 'Quais são os quatro efeitos coligativos?',
    items: [
      { label: 'Tonoscopia', claim: 'diminuição da pressão de vapor causada por soluto não volátil', section: 'Os quatro efeitos', quote: 'descreve a diminuição da pressão de vapor do solvente causada pela presença de soluto não volátil' },
      { label: 'Ebulioscopia', claim: 'elevação do ponto de ebulição na presença de soluto', section: 'Os quatro efeitos', quote: 'descreve a elevação do ponto de ebulição do solvente na presença de soluto' },
      { label: 'Crioscopia', claim: 'diminuição do ponto de congelamento na presença de soluto', section: 'Os quatro efeitos', quote: 'descreve a diminuição do ponto de congelamento do solvente na presença de soluto' },
      { label: 'Osmometria', claim: 'pressão necessária para impedir a passagem de solvente por membrana semipermeável', section: 'Os quatro efeitos', quote: 'descreve a pressão que precisa ser aplicada para impedir a passagem espontânea de solvente puro através de uma membrana semipermeável em direção a uma solução mais concentrada' },
    ],
  },
  // família criterios-conjuntivos (1 capítulo)
  {
    chapterId: 'summary-quimica-polaridade-das-ligacoes-e-das-moleculas',
    family: 'criterios-conjuntivos',
    question: 'O que decide, em conjunto, se uma molécula é polar?',
    items: [
      { label: 'Ligações polares', claim: 'presença ou ausência de ligações polares na estrutura', section: 'Da ligação para a molécula', quote: 'a presença ou ausência de ligações polares na estrutura' },
      { label: 'Geometria molecular', claim: 'determina se os momentos dipolares se somam ou se cancelam', section: 'Da ligação para a molécula', quote: 'a geometria molecular tridimensional, que determina se os momentos dipolares individuais dessas ligações polares se somam vetorialmente (resultando em molécula polar) ou se cancelam mutuamente por simetria geométrica (resultando em molécula apolar, mesmo contendo ligações internamente polares)' },
    ],
  },
  // família escala-de-graus (3 capítulos)
  {
    chapterId: 'summary-quimica-interacoes-intermoleculares',
    family: 'escala-de-graus',
    question: 'Em que ordem crescente de intensidade ficam as interações intermoleculares?',
    eixo: 'intensidade crescente da interação, da mais fraca para a mais forte',
    items: [
      { label: 'Forças de London', claim: 'as mais fracas, pontos de ebulição mais baixos', section: 'Comparações típicas', quote: 'a ordem geral esperada de ponto de ebulição crescente é: forças de London (mais fracas, pontos mais baixos) < dipolo-dipolo (intermediárias) < ligações de hidrogênio (mais fortes, pontos mais altos)' },
      { label: 'Dipolo-dipolo', claim: 'intermediárias entre London e ligação de hidrogênio', section: 'Comparações típicas', quote: 'a ordem geral esperada de ponto de ebulição crescente é: forças de London (mais fracas, pontos mais baixos) < dipolo-dipolo (intermediárias) < ligações de hidrogênio (mais fortes, pontos mais altos)' },
      { label: 'Ligações de hidrogênio', claim: 'as mais fortes, pontos de ebulição mais altos', section: 'Comparações típicas', quote: 'a ordem geral esperada de ponto de ebulição crescente é: forças de London (mais fracas, pontos mais baixos) < dipolo-dipolo (intermediárias) < ligações de hidrogênio (mais fortes, pontos mais altos)' },
    ],
  },
  {
    chapterId: 'summary-quimica-alcoois',
    family: 'escala-de-graus',
    question: 'Como o grau de substituição do álcool decide o produto de sua oxidação?',
    eixo: 'grau de substituição do carbono da hidroxila, do primário ao terciário',
    items: [
      { label: 'Primário', claim: 'oxida a aldeído, e este pode oxidar mais até ácido carboxílico', section: 'Reações', quote: 'A oxidação de um álcool primário produz inicialmente um aldeído (já que ainda resta um hidrogênio disponível ligado diretamente ao carbono da hidroxila original, removido nessa primeira etapa de oxidação)' },
      { label: 'Secundário', claim: 'oxida diretamente a cetona, sem etapa adicional', section: 'Reações', quote: 'A oxidação de um álcool secundário produz diretamente uma cetona (removendo o único hidrogênio disponível ligado ao carbono da hidroxila original), sem possibilidade estrutural de oxidação adicional significativa naquela mesma posição específica sob condições reacionais comuns e usuais' },
      { label: 'Terciário', claim: 'resiste inteiramente à oxidação convencional', section: 'Reações', quote: 'resiste inteiramente à oxidação convencional sob as condições reacionais comuns tipicamente empregadas' },
    ],
  },
  {
    chapterId: 'summary-quimica-cinetica-quimica',
    family: 'escala-de-graus',
    question: 'Como a ordem de reação determina o efeito da concentração sobre a velocidade?',
    eixo: 'ordem de reação, de zero a dois',
    items: [
      { label: 'Ordem zero', claim: 'a concentração do reagente não afeta a velocidade', section: 'Lei de velocidade', quote: 'ordem zero significa que a concentração daquele reagente não afeta a velocidade (comum quando ele não participa da etapa lenta do mecanismo)' },
      { label: 'Ordem um', claim: 'dobrar a concentração dobra a velocidade', section: 'Lei de velocidade', quote: 'ordem um significa que dobrar a concentração dobra a velocidade' },
      { label: 'Ordem dois', claim: 'dobrar a concentração quadruplica a velocidade', section: 'Lei de velocidade', quote: 'ordem dois significa que dobrar a concentração quadruplica a velocidade' },
    ],
  },
  // família grade-de-eixos (2 capítulos)
  {
    chapterId: 'summary-quimica-termoquimica-ii',
    family: 'grade-de-eixos',
    question: 'Que espontaneidade resulta do cruzamento entre o sinal de ΔH e o sinal de ΔS?',
    eixos: {
      a: { nome: 'sinal de ΔH', polos: ['exotérmica', 'endotérmica'] },
      b: { nome: 'sinal de ΔS', polos: ['aumenta', 'diminui'] },
    },
    items: [
      { label: 'Exotérmica + ΔS aumenta', claim: 'ΔG sempre negativo, espontânea em qualquer temperatura', section: 'Energia livre de Gibbs', quote: 'se ΔH for negativo (exotérmica) e ΔS for positivo (aumento de entropia), ΔG será sempre negativo, e a reação será espontânea em qualquer temperatura possível', celula: { eixoA: 0, eixoB: 0 } },
      { label: 'Exotérmica + ΔS diminui', claim: 'espontaneidade passa a depender da temperatura', section: 'Energia livre de Gibbs', quote: 'nos dois casos intermediários restantes (ambos os fatores com o mesmo sinal entre si, positivos ou negativos), a espontaneidade passa a depender criticamente do valor específico da temperatura considerada', celula: { eixoA: 0, eixoB: 1 } },
      { label: 'Endotérmica + ΔS aumenta', claim: 'espontaneidade passa a depender da temperatura', section: 'Energia livre de Gibbs', quote: 'nos dois casos intermediários restantes (ambos os fatores com o mesmo sinal entre si, positivos ou negativos), a espontaneidade passa a depender criticamente do valor específico da temperatura considerada', celula: { eixoA: 1, eixoB: 0 } },
      { label: 'Endotérmica + ΔS diminui', claim: 'ΔG sempre positivo, nunca espontânea', section: 'Energia livre de Gibbs', quote: 'se ΔH for positivo (endotérmica) e ΔS for negativo (diminuição de entropia), ΔG será sempre positivo, e a reação nunca será espontânea, em nenhuma temperatura', celula: { eixoA: 1, eixoB: 1 } },
    ],
  },
  {
    chapterId: 'summary-quimica-equilibrios-ionicos-ii',
    family: 'grade-de-eixos',
    question: 'Que pH resulta do cruzamento entre a força do ácido e a força da base de origem do sal?',
    eixos: {
      a: { nome: 'força do ácido de origem', polos: ['forte', 'fraco'] },
      b: { nome: 'força da base de origem', polos: ['forte', 'fraca'] },
    },
    items: [
      { label: 'Ácido forte + base forte', claim: 'solução neutra, nenhum íon hidrolisa de forma significativa', section: 'Produto de solubilidade', quote: 'sal de ácido forte com base forte produz solução neutra (nenhum dos íons hidrolisa de forma significativa)', celula: { eixoA: 0, eixoB: 0 } },
      { label: 'Ácido fraco + base forte', claim: 'solução básica, o ânion hidrolisa e consome H+', section: 'Produto de solubilidade', quote: 'sal de ácido fraco com base forte produz solução básica (o ânion, derivado do ácido fraco, hidrolisa e consome H+ da água)', celula: { eixoA: 1, eixoB: 0 } },
      { label: 'Ácido forte + base fraca', claim: 'solução ácida, o cátion hidrolisa e libera H+', section: 'Produto de solubilidade', quote: 'sal de ácido forte com base fraca produz solução ácida (o cátion, derivado da base fraca, hidrolisa e libera H+ extra)', celula: { eixoA: 0, eixoB: 1 } },
      { label: 'Ácido fraco + base fraca', claim: 'depende da comparação entre Ka e Kb, pode ser ácida, básica ou neutra', section: 'Pegadinhas frequentes', quote: 'o pH final depende da comparação relativa entre os valores de Ka do ácido e Kb da base envolvidos, podendo resultar em solução ligeiramente ácida, básica ou neutra, dependendo de qual dos dois processos de hidrólise predomina', celula: { eixoA: 1, eixoB: 1 } },
    ],
  },
];
