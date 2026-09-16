import type { SceneEntry } from '../types';

/** Cenas de Física. Vazio nesta dispatch (Parte A, capítulos 1-42): a tarefa desta
 *  dispatch foi só o inventário de família/lacuna, documentado em
 *  docs/visual-personalizado/16-familias-fisica.md. Uma dispatch de escrita de
 *  dados preenche este array depois, a partir da atribuição já fixada ali. */
export const fisica: SceneEntry[] = [];

/** Capítulos de Física sem cena-âncora, com o motivo. Preenchido, nesta dispatch,
 *  apenas com os 31 capítulos da Parte A (capítulos 1-42 de summaryCurriculum.ts)
 *  que não sustentam nenhuma das oito famílias com citação literal real — ver
 *  docs/visual-personalizado/16-familias-fisica.md para o raciocínio completo.
 *  Uma segunda dispatch (Parte B, capítulos 43-85) edita este mesmo array,
 *  adicionando os gaps dessa segunda metade, sem remover os desta. */
export const fisicaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-fisica-cinematica-escalar-conceitos-fundamentais',
    motivo:
      'Conteúdo procedimental (referencial, deslocamento vs. distância, velocidade e aceleração médias, pegadinhas de sinal); não há tipos coexistentes, camadas causais, critérios conjuntivos, escala ordenada, derivação encadeada nem eixos cruzados — apenas definições e um exemplo resolvido.',
  },
  {
    chapterId: 'summary-fisica-movimento-uniforme',
    motivo:
      'Equação horária linear e leitura de gráfico S×t, aplicada a problemas de encontro e travessia de túnel; é procedimento de cálculo, sem nenhuma das oito estruturas de família.',
  },
  {
    chapterId: 'summary-fisica-movimento-uniformemente-variado',
    motivo:
      'Conjunto de equações do MUV e critério de escolha entre elas (Torricelli vs. equação horária) conforme o que o problema pede; é habilidade de escolha de fórmula, não uma estrutura classificável nas oito famílias.',
  },
  {
    chapterId: 'summary-fisica-o-movimento-circular',
    motivo:
      'A seção de acoplamentos descreve duas configurações mecânicas mutuamente exclusivas (correia: velocidade linear igual; eixo comum: velocidade angular igual), mas não há guarda-chuva de tipos que coexistem nem rivalidade teórica — é uma escolha binária de qual grandeza se conserva em cada acoplamento físico, mais próxima de uma regra de leitura do que de uma tipologia com nota de honestidade sobre combinação de tipos.',
  },
  {
    chapterId: 'summary-fisica-grandezas-fisicas-e-operacoes-com-vetores',
    motivo:
      'Operações matemáticas de soma (lei dos cossenos) e decomposição de vetores em componentes ortogonais; é técnica de cálculo vetorial, não uma das oito estruturas do types.ts.',
  },
  {
    chapterId: 'summary-fisica-velocidade-vetorial',
    motivo:
      'Distinções conceituais entre velocidade escalar média e vetorial média, e composição de velocidades relativas; conteúdo definicional e de fórmula, sem tipologia com guarda-chuva, critérios conjuntivos ou cadeia de derivação.',
  },
  {
    chapterId: 'summary-fisica-composicao-de-movimentos',
    motivo:
      'Princípio da independência dos movimentos de Galileu aplicado à travessia de rio; é estratégia de montagem de problema (menor tempo vs. menor distância), não uma estrutura de família — as duas estratégias são objetivos de otimização, não tipos coexistentes nem posições rivais.',
  },
  {
    chapterId: 'summary-fisica-resultante-de-um-sistema-de-forcas',
    motivo:
      'Método de soma vetorial por componentes e definição de equilíbrio como resultante nula; é técnica de cálculo, não tipologia nem critérios conjuntivos — a condição de equilíbrio de translação é um único critério (resultante=0), não uma conjunção de vários critérios independentes (essa conjunção, com torque incluído, só aparece no capítulo de Estática).',
  },
  {
    chapterId: 'summary-fisica-as-leis-de-newton',
    motivo:
      'As três leis são apresentadas lado a lado como fundamentos independentes, não como elos de uma derivação sequencial nem como tipos coexistentes de um mesmo fenômeno; o capítulo é definicional (diagrama de corpo livre, elevador, blocos conectados por fio e roldana).',
  },
  {
    chapterId: 'summary-fisica-a-forca-de-contato',
    motivo:
      'Decomposição da força de contato em componente normal e tangencial (atrito), e distinção entre atrito estático e cinético; são componentes complementares de uma mesma força de contato, que se somam e não competem, sem guarda-chuva de tipologia, critérios conjuntivos, escala ou derivação em cadeia.',
  },
  {
    chapterId:
      'summary-fisica-sistema-de-corpos-interagindo-e-os-elementos-transmissores-de-forca',
    motivo:
      'Estratégia dos dois passos (sistema completo, depois corpo isolado) para resolver a máquina de Atwood e configurações análogas; é técnica de resolução, não uma das oito famílias — não há tipos coexistentes nem cadeia causal explicitada no texto.',
  },
  {
    chapterId: 'summary-fisica-plano-inclinado',
    motivo:
      'Decomposição do peso em componentes e derivação do ângulo crítico de escorregamento (tan θ = μ); é uma única passagem algébrica curta, não uma cadeia de vários elos rotulados e dependentes como a família cadeia-de-derivacao exige (contraste com o capítulo de Dilatação, que tem essa cadeia de fato).',
  },
  {
    chapterId: 'summary-fisica-leis-da-gravitacao',
    motivo:
      'A lei da gravitação e as três leis de Kepler são apresentadas como fatos complementares sobre o mesmo fenômeno orbital, não como tipos que coexistem sob um guarda-chuva, nem como camadas causais, nem como critérios conjuntivos de um mesmo veredito.',
  },
  {
    chapterId: 'summary-fisica-dinamica-do-movimento-circular',
    motivo:
      "A seção 'Quem segura o corpo na curva' lista situações (atrito numa curva plana, tração num pêndulo cônico, normal numa pista inclinada) que exemplificam qual força faz o papel de força centrípeta, mas é um heurístico de diagnóstico caso a caso, não uma tipologia com guarda-chuva explícito nomeando um conjunto fechado de tipos.",
  },
  {
    chapterId: 'summary-fisica-analisando-movimentos-contidos-em-um-plano-vertical',
    motivo:
      'O contraste entre topo e fundo de uma trajetória circular vertical é a comparação de dois pontos específicos da mesma trajetória (mesma equação com sinais diferentes de peso e normal), não uma rivalidade teórica, nem tipos coexistentes, nem eixos ortogonais independentes.',
  },
  {
    chapterId: 'summary-fisica-orbitas',
    motivo:
      'Definição de velocidade orbital e da órbita geoestacionária a partir da terceira lei de Kepler; conteúdo definicional e de fórmula única, sem estrutura classificável nas oito famílias.',
  },
  {
    chapterId: 'summary-fisica-balistica',
    motivo:
      'Reafirma a independência dos dois movimentos (horizontal uniforme, vertical uniformemente variado) já vista em Composição de Movimentos; mesma natureza procedimental, sem tipologia, critérios conjuntivos ou cadeia de derivação.',
  },
  {
    chapterId: 'summary-fisica-movimento-harmonico-simples-mhs',
    motivo:
      'Definição da força restauradora, período (com isocronismo) e conservação de energia na oscilação; conteúdo definicional e de fórmula, sem tipos coexistentes nem outra estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-impulso-e-quantidade-de-movimento',
    motivo:
      'Teorema do impulso e leitura de área sob o gráfico força×tempo; procedimento e definição, sem estrutura das oito famílias.',
  },
  {
    chapterId:
      'summary-fisica-sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento',
    motivo:
      'Definição de sistema isolado e conservação de momento em explosões e recuo; conteúdo definicional, sem tipologia nem outra estrutura aplicável.',
  },
  {
    chapterId: 'summary-fisica-trabalho-e-energia-trabalho-de-uma-forca',
    motivo:
      'Definição de trabalho e de seu sinal conforme o ângulo, e regras de cálculo do trabalho de forças específicas (peso, normal, atrito); é uma lista de regras por força, não uma tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-trabalho-e-energia-teorema-da-energia-cinetica',
    motivo:
      'Teorema trabalho-energia e critério de quando usá-lo em vez das equações do MUV; conteúdo de escolha de ferramenta de cálculo, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-trabalho-e-energia-o-teorema-da-energia-potencial',
    motivo:
      'Definição de energia potencial gravitacional e elástica, e da relação τ=−ΔEp entre trabalho de força conservativa e energia potencial; conteúdo definicional, sem tipos coexistentes com guarda-chuva nem outra estrutura.',
  },
  {
    chapterId: 'summary-fisica-sistemas-conservativos-e-sistemas-nao-conservativos',
    motivo:
      'Distinção binária entre sistema conservativo e não conservativo é uma dicotomia definicional, sem nota de honestidade sobre combinação de tipos como a família tipologia exige, e sem lista de condições que precisem ser reunidas simultaneamente para um único veredito (o que descartaria também critérios-conjuntivos).',
  },
  {
    chapterId: 'summary-fisica-potencia-maquina-e-rendimento',
    motivo:
      'Definição de potência e rendimento, e conversão entre unidades (W, CV, HP); conteúdo definicional e procedimental, sem estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-equivalencia-massa-energia',
    motivo:
      'Relação E=mc² e defeito de massa em reações nucleares; conteúdo definicional e explicativo sobre um único princípio físico, sem tipos coexistentes, critérios conjuntivos ou cadeia de derivação rotulada em elos.',
  },
  {
    chapterId: 'summary-fisica-hidrostatica-densidade-e-pressao',
    motivo:
      'Paradoxo hidrostático, princípios de Pascal e de Arquimedes, e condição de flutuação; são três princípios complementares sobre fluidos em repouso, não tipos coexistentes sob um guarda-chuva comum, e a condição de flutuação é a comparação de duas densidades (um único critério), não uma conjunção de vários critérios independentes.',
  },
  {
    chapterId: 'summary-fisica-trabalho-da-forca-de-pressao-do-gas',
    motivo:
      'Cálculo do trabalho do gás (τ=P×ΔV) e leitura de área sob a curva no diagrama p-V; conteúdo procedimental e gráfico, sem tipologia ou outra estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-primeira-lei-da-termodinamica',
    motivo:
      'Equação geral ΔU=Q−τ e sua convenção de sinais; lei única com convenção de sinais, sem tipos coexistentes (esses aparecem no capítulo seguinte, sobre as transformações particulares) nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-maquinas-termicas-e-ciclo-de-carnot',
    motivo:
      'Segunda lei da termodinâmica, rendimento de máquinas térmicas e ciclo de Carnot como limite teórico; conteúdo definicional e de fórmula sobre um único conceito (rendimento máximo), sem tipos coexistentes nem outra estrutura aplicável.',
  },
  {
    chapterId: 'summary-fisica-forca-eletrica-lei-de-coulomb',
    motivo:
      'Lei de Coulomb e comparação de ordem de grandeza com a força gravitacional, mais a regra de superposição vetorial; é analogia estrutural entre duas leis e regra de cálculo, não rivalidade nem tipos coexistentes — conteúdo definicional e comparativo, sem estrutura das oito famílias.',
  },
];
