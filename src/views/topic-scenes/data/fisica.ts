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
  // --- Parte B (capítulos 43-85), ver docs/visual-personalizado/16-familias-fisica.md ---
  {
    chapterId: 'summary-fisica-campo-eletrico',
    motivo:
      'Definição operacional do campo (E=F/q) e da lei do campo de carga puntiforme (E=kQ/r²), com superposição vetorial; conteúdo definicional e de cálculo, sem tipologia, critérios conjuntivos, escala ordenada, cadeia de derivação em elos ou eixos cruzados.',
  },
  {
    chapterId: 'summary-fisica-energia-potencial-e-potencial-eletrico',
    motivo:
      'Contraste entre grandeza vetorial (campo) e escalar (potencial) e regra de sinal para movimento espontâneo de cargas; é distinção conceitual e de fórmula (V=kQ/r, τ=qΔV), não uma das oito estruturas — não há guarda-chuva de tipos nem conjunção de critérios.',
  },
  {
    chapterId:
      'summary-fisica-mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais',
    motivo:
      'Os três padrões visuais (carga isolada radial, placas paralelas uniforme, par de cargas opostas em arco) são um guia de leitura de figuras de prova, não uma tipologia do fenômeno físico em si com nota de honestidade sobre combinação de tipos; é heurística de reconhecimento visual, mais próxima de uma técnica de interpretação do que de uma classificação estrutural.',
  },
  {
    chapterId: 'summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial',
    motivo:
      'Fórmulas do campo uniforme (E=U/d) e decomposição do lançamento de cargas em componente paralela acelerada e perpendicular constante; é aplicação procedural do MRUV a cargas, sem tipologia, critérios conjuntivos ou escala.',
  },
  {
    chapterId: 'summary-fisica-dinamica-das-cargas-eletricas',
    motivo:
      'As leis de Newton reaplicadas a cargas elétricas, com equilíbrio de uma esfera suspensa e conservação de energia no movimento acelerado; é extensão procedural da dinâmica newtoniana, sem estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-corrente-eletrica',
    motivo:
      'Distinção entre sentido convencional e sentido real dos elétrons, e definição de velocidade de deriva; são definições e uma correção conceitual de convenção histórica, não tipologia nem outra estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-potencia-eletrica',
    motivo:
      'Três formas equivalentes da mesma fórmula de potência (P=Ui, P=i²R, P=U²/R) e conversão para consumo em kWh; conteúdo definicional e de conversão de unidades, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-resistores',
    motivo:
      'Segunda lei de Ohm (R=ρL/A) e regras de associação em série e paralelo; são fórmulas de cálculo com dependências geométricas opostas, não uma tipologia com guarda-chuva nem outra das oito estruturas.',
  },
  {
    chapterId: 'summary-fisica-medidores-eletricos',
    motivo:
      'Regras opostas de ligação de amperímetro (série, resistência nula ideal) e voltímetro (paralelo, resistência infinita ideal); é par de convenções de instrumentação com propriedades opostas, não tipologia nem critérios conjuntivos — não há guarda-chuva de tipos coexistentes, é uma dicotomia funcional fixa.',
  },
  {
    chapterId: 'summary-fisica-geradores',
    motivo:
      'Equação característica do gerador (U=ε−ri), curva característica e rendimento; conteúdo definicional e de fórmula sobre um único dispositivo, sem tipos coexistentes nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-receptores',
    motivo:
      "Equação característica do receptor (U=ε'+r'i), estruturalmente análoga (mas de sinal oposto) à do gerador; é comparação de fórmulas entre dois dispositivos complementares, não uma tipologia nem outra das oito estruturas.",
  },
  {
    chapterId: 'summary-fisica-circuitos-de-malha-unica',
    motivo:
      'Equação da malha única (ε=i(R+r)) e queda de tensão em cada trecho; é aplicação da conservação de energia a um circuito simples, procedimento de cálculo sem estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-eletrodinamica-as-leis-de-kirchhoff',
    motivo:
      'Lei dos nós e lei das malhas são duas ferramentas complementares aplicadas em conjunto para resolver um circuito, não duas condições que precisam ser reunidas para um único veredito (o que exigiria critérios-conjuntivos) nem tipos coexistentes de um fenômeno.',
  },
  {
    chapterId: 'summary-fisica-capacitores',
    motivo:
      'Definição de capacitância, energia armazenada e regras de associação em série e paralelo (opostas às de resistores); conteúdo definicional e procedimental, sem tipologia, critérios conjuntivos ou outra estrutura de família.',
  },
  {
    chapterId:
      'summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre',
    motivo:
      'Inseparabilidade dos polos magnéticos, geometria das linhas de indução fechadas e a inversão de nomenclatura do polo magnético terrestre; são fatos definicionais sobre magnetismo, sem tipologia, critérios conjuntivos ou outra estrutura das oito famílias.',
  },
  {
    chapterId:
      'summary-fisica-campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes',
    motivo:
      'Fórmulas do campo de um fio reto, de uma espira e de um solenoide, com a regra da mão direita; é uma progressão de fórmulas por configuração geométrica, não uma tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId:
      'summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme',
    motivo:
      'A trajetória circular (velocidade perpendicular ao campo) e a helicoidal (velocidade oblíqua) são dois regimes ao longo de uma única variável contínua (o ângulo de entrada), não dois eixos binários independentes cruzando em quatro células como grade-de-eixos exige, nem uma tipologia com guarda-chuva explícito de tipos coexistentes.',
  },
  {
    chapterId: 'summary-fisica-analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas',
    motivo:
      'Fórmula da força sobre um fio (F=BiLsenθ), regra de atração/repulsão entre fios paralelos e princípio do motor elétrico; conteúdo definicional e procedimental, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-inducao-eletromagnetica-lei-de-lenz',
    motivo:
      'A lei de Faraday e sua interpretação física pela lei de Lenz (conservação de energia) descrevem um único mecanismo causal, não tipos coexistentes nem critérios conjuntivos — é a mesma lei explicada em duas camadas de detalhe, não uma estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-inducao-eletromagnetica-analise-da-corrente-induzida-em-geradores',
    motivo:
      'Funcionamento do gerador de corrente alternada e do transformador; conteúdo definicional e explicativo de dois dispositivos que compartilham a lei de Faraday, sem tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-fundamentos-da-optica-geometrica',
    motivo:
      'Sombra/penumbra, eclipses e cor percebida de corpos; são fenômenos definicionais e geométricos distintos, sem guarda-chuva de tipologia (a menção a eclipse total/anular/parcial é uma observação lateral, não uma classificação central do capítulo) nem outra estrutura das oito famílias.',
  },
  {
    chapterId: 'summary-fisica-reflexao-em-superficies-planas',
    motivo:
      'Lei da reflexão, propriedades da imagem no espelho plano (virtual, direita, mesma distância) e regra do tamanho mínimo; conteúdo definicional e geométrico, sem tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-reflexao-em-superficies-esfericas',
    motivo:
      "A regra das posições do objeto no espelho côncavo é uma tabela de consulta que mapeia uma única variável contínua (distância do objeto) em quatro faixas de resultado, não uma tipologia com tipos nomeados e coexistentes com nota de honestidade — mesmo padrão heurístico já descartado na Parte A para 'quem faz o papel de força centrípeta'.",
  },
  {
    chapterId: 'summary-fisica-refracao-fundamentos-leis-e-aplicacoes',
    motivo:
      'Lei de Snell, ângulo crítico e reflexão total interna; conteúdo definicional e de fórmula sobre um único fenômeno (a refração), sem tipologia, critérios conjuntivos ou outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-lentes-esfericas-estudo-grafico',
    motivo:
      'Mesma estrutura de "regra das posições" do objeto que o capítulo de espelhos esféricos — tabela de consulta sobre uma variável contínua, não uma tipologia com guarda-chuva de tipos coexistentes.',
  },
  {
    chapterId: 'summary-fisica-estudo-analitico-das-lentes-esfericas',
    motivo:
      'Equação de Gauss, convenção de sinais e vergência; conteúdo definicional e de convenção matemática, sem estrutura de família aplicável.',
  },
  {
    chapterId: 'summary-fisica-equacao-do-fabricante-de-lentes-e-associacao-de-lentes',
    motivo:
      'Equação de Halley e soma de vergências em associação de lentes justapostas; conteúdo de fórmula e procedimento de associação, sem tipologia nem outra estrutura das oito famílias.',
  },
  {
    chapterId:
      'summary-fisica-microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas',
    motivo:
      'Papéis complementares de objetiva e ocular no microscópio e na luneta; conteúdo definicional sobre dois instrumentos específicos, sem guarda-chuva de tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-conceitos-basicos',
    motivo:
      "As três classificações de onda (natureza, direção de vibração, dimensão) são independentes entre si e não populam de fato as quatro células de um cruzamento binário-binário — o próprio texto não apresenta o par 'eletromagnética e longitudinal', que fisicamente não ocorre para ondas eletromagnéticas livres —, então não sustentam grade-de-eixos; também não formam uma única tipologia com guarda-chuva, mas três critérios de classificação simultâneos e sobrepostos.",
  },
  {
    chapterId: 'summary-fisica-equacao-fundamental-da-ondulatoria',
    motivo:
      'Dedução de v=λf a partir das definições de período e comprimento de onda, em um único passo algébrico; não é uma cadeia de vários elos dependentes como a família cadeia-de-derivacao exige (contraste com a dilatação térmica da Parte A).',
  },
  {
    chapterId: 'summary-fisica-intensidade-sonora',
    motivo:
      'Definição de intensidade (I=P/A) e da escala logarítmica em decibéis; é conteúdo de fórmula e de conversão matemática, sem uma lista estruturada de itens graduados como a família escala-de-graus exige (ao contrário do espectro eletromagnético, que nomeia sete faixas em ordem) — aqui há só dois ou três valores de referência soltos nos exemplos, não uma escala com itens.',
  },
  {
    chapterId: 'summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas',
    motivo:
      'Distinção binária entre eco e reverberação por limiar de tempo de percepção, mais a regra geométrica de refração de ondas; é dicotomia definicional e regra de desvio, sem guarda-chuva de tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas',
    motivo:
      'Reflexão com ou sem inversão de fase em extremidade fixa vs. livre é uma dicotomia definicional (mesmo padrão já descartado na Parte A para sistemas conservativos/não conservativos), não uma tipologia com guarda-chuva de tipos coexistentes e nota de honestidade sobre combinação.',
  },
  {
    chapterId: 'summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia',
    motivo:
      'Três fenômenos ondulatórios distintos (difração, polarização, ressonância) tratados em seções separadas, sem guarda-chuva comum que os agrupe como tipos de uma mesma categoria — são tópicos independentes, não uma tipologia.',
  },
  {
    chapterId:
      'summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento',
    motivo:
      'Condições de interferência construtiva e destrutiva formam uma dicotomia baseada na diferença de percurso, e o batimento é um fenômeno temporal à parte; conteúdo de fórmula e distinção binária, sem guarda-chuva de tipologia nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-um-caso-particular-de-interferencia-onda-estacionaria',
    motivo:
      'Nós e ventres são os dois polos de um mesmo padrão espacial fixo (não tipos coexistentes independentes), e a restrição a certas frequências (harmônicos) é regra de encaixe geométrico; sem guarda-chuva de tipologia, critérios conjuntivos ou cadeia de derivação em elos dependentes.',
  },
  {
    chapterId: 'summary-fisica-ondas-estacionarias-em-cordas',
    motivo:
      'Série harmônica (λ_n=2L/n) e as três variáveis que o instrumentista controla (comprimento, tensão, densidade linear); conteúdo de fórmula e de aplicação prática, sem tipologia com guarda-chuva nem outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-ondas-estacionarias-em-tubos',
    motivo:
      'Tubo aberto (todos os harmônicos) vs. tubo fechado numa ponta (só harmônicos ímpares) é uma dicotomia de condição de contorno, sem o guarda-chuva explícito de três ou mais tipos coexistentes com nota de honestidade que caracteriza a tipologia nas demais aceitas (contraste com os cinco tipos de força, ou os três processos de eletrização, da Parte A) — é a mesma classe de dicotomia binária já descartada para sistemas conservativos/não conservativos.',
  },
  {
    chapterId: 'summary-fisica-efeito-doppler-descricao-e-estudo-quantitativo',
    motivo:
      'Fórmula geral do efeito Doppler com regra de sinais conforme aproximação ou afastamento; conteúdo de fórmula e convenção de sinal, sem tipologia, critérios conjuntivos ou outra estrutura de família.',
  },
  {
    chapterId: 'summary-fisica-nocoes-basicas-de-fisica-quantica',
    motivo:
      'Quantização de energia, efeito fotoelétrico e dualidade onda-partícula; a dualidade é uma propriedade dupla de uma mesma entidade (luz, matéria), não dois tipos mutuamente exclusivos nem um guarda-chuva de tipos coexistentes — é a mesma entidade revelando duas facetas conforme o experimento, sem estrutura de família aplicável.',
  },
];
