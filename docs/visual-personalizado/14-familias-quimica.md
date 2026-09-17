# Famílias de cena — Química (Task 1 — inventário)

Este documento fixa a atribuição definitiva de família (ou lacuna) para os 48
capítulos de Química, derivada de leitura integral de `deepSummaryContent.json`
(`subject === "Química"`), confirmada contra `src/data/summaryCurriculum.ts` e
contra os `id`s reais gerados em `src/data/interactiveSummaries.ts`. Nenhuma
`SceneEntry` de dados foi escrita ainda — esta task é só o inventário: família
por capítulo, com citação literal real ou motivo de lacuna específico ao
conteúdo. As Tasks seguintes preenchem `quimica: SceneEntry[]` a partir daqui.

**Nota sobre os `chapterId`s**: 47 dos 48 capítulos de Química vêm de
`remainingInteractiveSummaries.ts` (prefixo `qui`, gerando ids
`summary-quimica-<slug>`, via `subjectSummaryFactory.ts`: `id: summary-${topic.id}`,
onde `topic.id` vem de `summaryCurriculum.ts`). O capítulo "Equilíbrios Químicos
I" é excluído dessa geração (`exclude: new Set(['Equilíbrios Químicos I'])`) e
tem entrada própria em `expandedInteractiveSummaries.ts` com `id:
'qui-equilibrio-acidificacao'` — mas como `applyDeepSummary` casa por
`subject|topic`, esse capítulo recebe exatamente o mesmo conteúdo editorial de
"Equilíbrios Químicos I" no JSON. Confirmado por execução real: `48` capítulos
com `subject === 'Química'` em `interactiveSummaries`, ids listados no arquivo
de dados.

Nenhum capítulo de Química tem experiência interativa própria em
`src/views/topic-experiments/catalog.ts` (busca por "quimica"/"química" no
arquivo não retornou nada) — logo não há lacuna do tipo "já tem experiência
interativa", diferente de Geografia (coordenadas) e Sociologia (solidariedade).

**Regra de processo seguida**: todo capítulo candidato a lacuna foi testado
contra as oito famílias antes de ser declarado lacuna, não só contra a família
mais "óbvia" pelo título. Vários candidatos que pareciam `tipologia` ou
`escala-de-graus` à primeira vista foram rejeitados por não terem citação
literal de guarda-chuva real (ex.: os "fatores que alteram a velocidade" de
Cinética Química não são tipologia — são fatores causais heterogêneos, não
variantes de uma mesma categoria; a ordem de reação, na mesma Cinética
Química, é que sustenta `escala-de-graus`, com estágios nomeados 0/1/2 e
consequência numérica monotônica).

## Famílias trazidas de fases anteriores

`tipologia`, `criterios-conjuntivos`, `cadeia-de-derivacao` e `escala-de-graus`
já existiam no branch (mergeadas de fases anteriores). `grade-de-eixos`
(trazida originalmente para Sociologia, não usada em Geografia) **é
reintroduzida em Química**: dois capítulos de Equilíbrio (Termoquímica II e
Equilíbrios Iônicos II) pedem genuinamente o cruzamento de dois eixos
independentes com célula resultante — não uma tipologia de tipos paralelos,
nem uma escala ordenada — ver seção própria abaixo. `contraste-de-posicoes`,
`camadas-de-determinacao` e `movimento-dialetico` não têm nenhum capítulo em
Química: nenhum conteúdo lido sustenta rivalidade teórica genuína, base
assimétrica de camadas, ou uma síntese dialética real de três momentos — ver
"Famílias com zero capítulos" no fim.

## Atribuição definitiva

### `cadeia-de-derivacao` (3 capítulos)

- **`summary-quimica-evolucao-dos-modelos-atomicos`** — cada modelo é resposta
  causal a uma evidência que o anterior não explicava, não uma sucessão
  cronológica arbitrária. Frase-guarda: *"Cada modelo atômico proposto ao
  longo da história não foi uma invenção arbitrária, mas uma resposta direta a
  evidências experimentais que o modelo anterior era incapaz de explicar"*.
  Elos: Dalton (esfera maciça, sem estrutura) → Thomson (pudim de passas, a
  partir da descoberta do elétron) → Rutherford (núcleo denso, a partir do
  espalhamento na lâmina de ouro: *"resultado completamente incompatível com o
  modelo do pudim de passas"*) → modelo quântico (substitui as órbitas fixas de
  Bohr por regiões de probabilidade).

- **`summary-quimica-equacoes-ionicas-e-outras-teorias-para-acidos-e-bases`** —
  cada teoria ácido-base resolve uma limitação explícita da anterior, em
  linguagem instrumental real, não é uma lista de definições paralelas. Elos:
  Arrhenius (limitado: *"não explica por que substâncias sem hidroxila, como a
  amônia, se comportam como base"*) → Brønsted-Lowry (*"resolve parte dessa
  limitação redefinindo ácido como... capaz de doar um próton"*, permitindo
  explicar a base da amônia) → Lewis (*"a teoria mais ampla ainda... dispensa
  completamente a exigência de um próton envolvido na reação"*, incluindo
  reações sem H+, como BF3 com amônia).

- **`summary-quimica-quimica-ambiental`** — a seção "Química das soluções
  ambientais" descreve a eutrofização como cadeia causal instrumental real,
  não fatores paralelos. Elos: excesso de nutrientes → *"provoca proliferação
  descontrolada de algas... bloqueando a penetração de luz"* → morte de plantas
  submersas por falta de luz → decomposição por bactérias aeróbias →
  *"consumindo o oxigênio dissolvido disponível na água até níveis
  insuficientes"* → *"mortandade de peixes por asfixia, mesmo sem qualquer
  substância diretamente tóxica"*. A seção de prática reforça a leitura causal
  explicitamente: *"explique, encadeando corretamente as etapas do
  processo"*.

### `tipologia` (14 capítulos)

- **`summary-quimica-organizacao-da-tabela-periodica-dos-elementos`** —
  *"Certas famílias (grupos) recebem nomes específicos e apresentam
  comportamento químico particularmente característico e previsível"*:
  alcalinos, alcalino-terrosos, halogênios, gases nobres — quatro famílias que
  coexistem na tabela, cada uma com comportamento próprio, sem hierarquia
  entre si.

- **`summary-quimica-radioatividade-o-estudo-das-radiacoes`** — *"Três tipos
  principais de emissão radioativa precisam ser distinguidos por suas
  propriedades físicas características"*: alfa, beta, gama — cada uma com
  carga, massa e poder de penetração próprios, coexistentes.

- **`summary-quimica-ligacoes-quimicas-e-alotropia`** — *"três tipos
  principais de ligação química interatômica alcançam essa estabilidade por
  mecanismos distintos"*: iônica, covalente, metálica.

- **`summary-quimica-geometria-molecular`** — *"As geometrias moleculares mais
  comuns e mais cobradas seguem diretamente do número total de pares
  eletrônicos... ao redor do átomo central"*: linear, trigonal plana, angular,
  tetraédrica, piramidal trigonal, angular (H2O) — variantes que coexistem
  conforme a contagem de pares, sem uma "certa" e outras "erradas".

- **`summary-quimica-composicao-da-materia-estados-fisicos`** — *"A matéria se
  apresenta em estados físicos que se distinguem pelo grau de agregação e
  mobilidade das partículas"*: sólido, líquido, gasoso, cada um com forma e
  volume característicos.

- **`summary-quimica-quimica-inorganica`** — *"As quatro funções inorgânicas
  clássicas — ácidos, bases, sais e óxidos — são categorias de compostos
  definidas por características estruturais e comportamento em solução
  aquosa específicos de cada uma"*.

- **`summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados`**
  — *"As funções orgânicas oxigenadas se distinguem pelo grupo funcional
  específico que contém oxigênio, e cada uma tem sufixo próprio"*: álcool,
  aldeído, cetona, ácido carboxílico, éter; e *"As funções orgânicas
  nitrogenadas se organizam em torno da presença do átomo de nitrogênio"*:
  amina, amida, nitrila.

- **`summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades`**
  — *"Um átomo de oxigênio, por exemplo, pode estar presente em pelo menos
  cinco funções orgânicas estruturalmente distintas entre si"*: álcool,
  aldeído/cetona, ácido carboxílico, éter — mesmo átomo, funções coexistentes
  distinguidas pelo contexto estrutural, não por hierarquia.

- **`summary-quimica-isomeria`** — *"reconhecer o tipo específico de isomeria
  presente entre dois compostos dados é a habilidade central cobrada no
  tema"*: isomeria plana, geométrica e óptica — três categorias que coexistem
  como mecanismos distintos de um mesmo fenômeno (mesma fórmula molecular,
  estruturas diferentes).

- **`summary-quimica-combustiveis-fosseis`** — *"seus produtos e subprodutos
  têm impactos ambientais bem documentados que se distinguem por tipo de
  dano"*: CO2 (efeito estufa), CO (toxicidade), fuligem, SO2/NOx (chuva ácida
  e smog) — danos coexistentes e distintos, não uma escala nem uma cadeia
  entre eles.

- **`summary-quimica-interpretando-reacoes-organicas`** — *"Os grandes tipos de
  reação orgânica se distinguem pelo padrão estrutural da transformação"*:
  adição, eliminação, substituição.

- **`summary-quimica-reacoes-de-substituicao`** — a própria fonte nomeia a
  categoria e enumera as variantes coexistentes na seção de erros: *"são três
  mecanismos estruturalmente distintos entre si — substituição radicalar em
  alcanos..., substituição eletrofílica aromática..., e substituição
  nucleofílica em haletos..., compartilhando apenas a característica
  estrutural comum de trocar um átomo por outro"*.

- **`summary-quimica-dispersoes`** — *"a classificação central do tema é feita
  pelo tamanho das partículas dispersas"*: soluções verdadeiras, coloides,
  suspensões — três categorias coexistentes, cada uma com teste próprio
  (efeito Tyndall, sedimentação, filtração) para distingui-la das outras, não
  uma hierarquia de estágios nomeados.

- **`summary-quimica-efeitos-coligativos`** — *"Existem quatro efeitos
  coligativos, cada um envolvendo uma propriedade física do solvente puro que
  se altera pela presença do soluto"*: tonoscopia, ebulioscopia, crioscopia,
  osmometria.

### `criterios-conjuntivos` (1 capítulo)

- **`summary-quimica-polaridade-das-ligacoes-e-das-moleculas`** — necessidade
  conjunta declarada explicitamente: *"A polaridade de uma molécula como um
  todo... depende de dois fatores que precisam ser analisados em conjunto e
  nunca isoladamente: a presença ou ausência de ligações polares na estrutura,
  e a geometria molecular tridimensional"*. Nenhum dos dois fatores isolado
  decide a polaridade — só a combinação (CO2 tem ligações polares, mas
  geometria simétrica cancela; uma molécula sem ligação polar alguma é sempre
  apolar independente da geometria).

### `escala-de-graus` (3 capítulos)

- **`summary-quimica-interacoes-intermoleculares`** — ordem explícita e
  crescente, usada para prever ponto de ebulição: *"Existem três tipos
  principais, classificados por intensidade crescente"*, e depois: *"a ordem
  geral esperada de ponto de ebulição crescente é: forças de London (mais
  fracas, pontos mais baixos) < dipolo-dipolo (intermediárias) < ligações de
  hidrogênio (mais fortes, pontos mais altos)"*. `items[0]` = forças de
  London (grau mais baixo).

- **`summary-quimica-alcoois`** — grau de substituição ordenado com
  consequência monotônica sobre oxidabilidade: *"A classificação dos álcoois
  quanto ao grau segue o número de outros átomos de carbono ligados ao
  carbono que carrega diretamente a hidroxila"* — primário (oxida a aldeído e
  depois a ácido carboxílico) → secundário (oxida direto a cetona, sem etapa
  adicional) → terciário (*"resiste inteiramente à oxidação convencional"*).
  `items[0]` = primário (grau mais baixo de substituição).

- **`summary-quimica-cinetica-quimica`** — estágios nomeados da ordem de
  reação com consequência numérica monotônica declarada: *"ordem zero
  significa que a concentração daquele reagente não afeta a velocidade...
  ordem um significa que dobrar a concentração dobra a velocidade; ordem dois
  significa que dobrar a concentração quadruplica a velocidade"`. `items[0]`
  = ordem zero.

  **Nota de rejeição importante para este capítulo**: os "fatores que alteram
  a velocidade de reação" (concentração, temperatura, superfície, catalisador)
  descritos na mesma fonte **não** sustentam `tipologia` — não são variantes
  coexistentes de uma mesma categoria, são fatores causais heterogêneos
  distintos entre si (um é concentração, outro é energia térmica, outro é
  área superficial, outro é caminho reacional alternativo). A família correta
  para este capítulo vem exclusivamente da ordem de reação, não dos fatores.

### `grade-de-eixos` (2 capítulos)

- **`summary-quimica-termoquimica-ii`** — dois eixos independentes cruzando em
  quatro células com consequência distinta em cada uma, não uma tipologia nem
  uma escala única: *"quatro combinações possíveis de sinais surgem, cada uma
  com implicação distinta sobre a espontaneidade: se ΔH for negativo
  (exotérmica) e ΔS for positivo... ΔG será sempre negativo... se ΔH for
  positivo (endotérmica) e ΔS for negativo... ΔG será sempre positivo... nos
  dois casos intermediários restantes... a espontaneidade passa a depender
  criticamente... da temperatura"*. Eixo A = sinal de ΔH (exotérmica/
  endotérmica); eixo B = sinal de ΔS (aumenta/diminui); célula = consequência
  sobre a espontaneidade.

- **`summary-quimica-equilibrios-ionicos-ii`** — mesma estrutura de
  cruzamento, na hidrólise salina: *"O comportamento da solução resultante
  depende diretamente da força relativa do ácido e da base que teoricamente
  originaram aquele sal: sal de ácido forte com base forte produz solução
  neutra... sal de ácido fraco com base forte produz solução básica... sal de
  ácido forte com base fraca produz solução ácida"*. Eixo A = força do ácido
  de origem (forte/fraco); eixo B = força da base de origem (forte/fraca);
  célula = pH resultante da solução do sal.

### `contraste-de-posicoes`, `camadas-de-determinacao`, `movimento-dialetico` (0 capítulo cada)

Nenhum capítulo de Química lido sustenta rivalidade teórica genuína com
rejeição explícita de um lado (o mais próximo — Arrhenius/Brønsted-Lowry/
Lewis — é generalização sucessiva que preserva o anterior como caso
particular, não rejeição mútua, por isso foi para `cadeia-de-derivacao`);
nenhum sustenta uma base assimétrica que condiciona camadas subsequentes de
forma não recíproca (o candidato mais próximo, "o que estabiliza a base
conjugada" em Acidez e Basicidade, é comparação contínua de três fatores
independentes, não uma camada-base real); e nenhum apresenta uma síntese
dialética genuína de três momentos (tese, negação, terceiro termo que
supera e conserva) — química, sendo uma ciência estrutural-quantitativa, não
produz esse padrão argumentativo em nenhum capítulo do currículo lido.

## Lacunas declaradas (25 capítulos)

Todos testados contra as oito famílias antes de serem declarados lacuna, com
motivo específico ao conteúdo (nunca genérico):

- `summary-quimica-o-estado-gasoso` — postulados do gás ideal, variáveis de
  estado e limites do modelo real; é exposição conceitual/procedural (define
  o modelo e suas variáveis), sem rivalidade, camadas, tipos coexistentes com
  guarda-chuva, critérios conjuntivos declarados, escala nomeada ou cadeia
  causal entre eventos distintos.
- `summary-quimica-estudo-dos-gases-ii` — lei geral dos gases, equação de
  Clapeyron e lei de Dalton das pressões parciais são fórmulas e roteiros de
  cálculo aplicados a um único fenômeno (comportamento de um gás), não uma
  estrutura de família.
- `summary-quimica-separacao-de-misturas` — é um guia de referência de
  técnicas de laboratório organizado por tipo de mistura (heterogênea,
  homogênea, casos especiais); não há guarda-chuva de tipos coexistentes de
  *um mesmo objeto* (as técnicas resolvem problemas diferentes, não são
  variantes de uma mesma categoria), nem escala, nem cadeia.
- `summary-quimica-transformacoes-fisicas-e-quimicas-e-balanceamento-de-equacoes`
  — a distinção física/química é binária (mais fraca que as tipologias
  aceitas, que têm três ou mais variantes) e o balanceamento é procedimento
  de ajuste de coeficientes, não estrutura de família.
- `summary-quimica-massa-atomica-mol-e-massa-molar` — define massa atômica,
  mol e massa molar e as relações de conversão entre elas; é vocabulário e
  conversão de unidades, sem estrutura de rivalidade, camadas, tipos, escala
  ou cadeia.
- `summary-quimica-determinacao-de-formulas-quimicas` — roteiro de cálculo
  (percentual → mínima → molecular, incluindo o caso de combustão) sem
  rivalidade, tipos coexistentes, critérios conjuntivos ou cadeia causal.
- `summary-quimica-estequiometria-leis-ponderais` — as três leis ponderais
  (Lavoisier, Proust, Dalton) são apresentadas como conceitos complementares
  que se sucedem historicamente ("a lei de Dalton... complementa a lei de
  Proust"), não como variantes coexistentes de uma mesma categoria com
  guarda-chuva, nem como elos causais entre eventos distintos.
- `summary-quimica-calculos-estequiometricos` — roteiro de resolução (mol,
  regra de três, reagente limitante) é procedimento de cálculo, não
  estrutura de família.
- `summary-quimica-processos-de-oxirreducao` — define oxidação/redução, Nox e
  balanceamento por transferência de elétrons; é conceitual/procedural, sem
  guarda-chuva de tipos, escala nomeada, critérios conjuntivos declarados ou
  cadeia causal entre eventos distintos.
- `summary-quimica-introducao-a-quimica-organica` — introduz vocabulário
  (tetravalência, critérios de classificação de cadeia, funções orgânicas) de
  forma preliminar; os critérios de classificação de cadeia (aberta/fechada,
  normal/ramificada, saturada/insaturada, homogênea/heterogênea) são quatro
  critérios binários independentes, não uma única tipologia com guarda-chuva
  — a enumeração mais completa e central das funções orgânicas por
  guarda-chuva próprio está nos capítulos dedicados (Nomenclatura
  Oxigenados/Nitrogenados; Reconhecimento de Funções), que já cobrem essa
  família.
- `summary-quimica-nomenclatura-de-compostos-organicos` — regras de
  nomenclatura IUPAC (prefixo/infixo/sufixo, escolha de cadeia principal,
  numeração por menores localizantes); é procedimento de codificação de nome,
  sem estrutura de família.
- `summary-quimica-reacoes-de-adicao` — descreve mecanismos de adição a
  alcenos/alcinos e a carbonílicos, mais a regra de Markovnikov; é narrativa
  de mecanismo e regra preditiva, não guarda-chuva de tipos coexistentes,
  escala nomeada, critérios conjuntivos ou cadeia causal entre eventos
  distintos (o próprio texto já classifica adição/eliminação/substituição
  como tipologia no capítulo "Interpretando Reações Orgânicas" — repetir a
  mesma tipologia aqui seria redundante, e o conteúdo específico deste
  capítulo, adição, não tem guarda-chuva de subtipos coexistentes próprio).
- `summary-quimica-reacoes-de-oxidacao-em-hidrocarbonetos` — combustão
  completa/incompleta é distinção binária (mais fraca que as tipologias
  aceitas), e oxidação branda/enérgica é contraste de condições reacionais
  (suave vs. drástica) sobre o mesmo mecanismo, não rivalidade teórica nem
  tipos coexistentes com guarda-chuva.
- `summary-quimica-acidos-graxos-e-esterificacao` — saturado/insaturado é
  distinção binária; esterificação e saponificação são duas reações
  distintas descritas lado a lado (a fonte as contrasta para evitar
  confusão, mas não como posições rivais nem como tipos coexistentes de uma
  mesma categoria).
- `summary-quimica-transesterificacao-alcoolise` — descreve a reação, sua
  aplicação (biodiesel) e vantagens/limites como trade-off ("vantagens
  ambientais e práticas específicas... mas também apresenta limitações
  técnicas e econômicas reais"), padrão de trade-off já rejeitado em fases
  anteriores para `contraste-de-posicoes` (não é rejeição mútua de posições
  teóricas).
- `summary-quimica-acidez-e-basicidade-pka` — a força de ácidos/bases é
  medida por Ka/pKa, uma métrica contínua comparada caso a caso (como o Gini
  em Geografia, explicitamente rejeitado ali para `escala-de-graus` por não
  ter estágios nomeados discretos), não uma escala de estágios nomeados; os
  três fatores que estabilizam a base conjugada (eletronegatividade, efeito
  indutivo, ressonância) atuam de forma independente e cumulativa, sem a
  frase de necessidade conjunta ("nenhum isolado basta") exigida por
  `criterios-conjuntivos`.
- `summary-quimica-polimeros` — apresenta três critérios de classificação
  binários e independentes (natural/sintético; termoplástico/termorrígido;
  adição/condensação); nenhum chega à enumeração de três ou mais variantes
  coexistentes exigida pelas tipologias aceitas neste documento, mesmo
  compartilhando a palavra "classificam-se" — mesmo padrão de rejeição
  aplicado à Matriz Energética (renovável/não renovável) em Geografia.
- `summary-quimica-termoquimica-i` — exotérmica/endotérmica é distinção
  binária, e a lei de Hess é procedimento de manipulação algébrica de
  equações; nenhuma estrutura de família sustentada por guarda-chuva próprio.
- `summary-quimica-introducao-ao-estudo-das-pilhas-e-baterias` — descreve o
  princípio da pilha, organização da célula, potencial/espontaneidade e a
  distinção binária pilha comum/recarregável; conceitual e procedural, sem
  guarda-chuva de tipos coexistentes, escala, critérios conjuntivos ou cadeia
  causal entre eventos distintos.
- `summary-quimica-eletroquimica-de-processos-espontaneos` — descreve a pilha
  de Daniell, potenciais de redução e os mecanismos de proteção catódica e
  galvanização; proteção catódica e galvanização são descritas como o mesmo
  princípio aplicado de duas formas, não como posições rivais nem tipos
  coexistentes com guarda-chuva próprio.
- `summary-quimica-eletroquimica-de-processos-nao-espontaneos` — a inversão
  de polaridade entre pilha e eletrólise (cátodo positivo vs. negativo) é
  convenção de nomenclatura definicional, não rivalidade teórica; eletrólise
  ígnea/aquosa é distinção binária.
- `summary-quimica-aspectos-quantitativos-da-eletroquimica-e-metalurgia` — as
  leis de Faraday e o roteiro de cálculo são procedimento numérico; a
  distinção metal pouco reativo/muito reativo, que decide o método de
  obtenção, é binária.
- `summary-quimica-deslocamento-de-equilibrio` — o princípio de Le Chatelier
  é um único mecanismo unificador ("o sistema sempre reage contra a
  perturbação"), e concentração/pressão/temperatura/catalisador são fatores
  causais heterogêneos aplicados a esse mesmo princípio, não variantes
  coexistentes de uma categoria (mesmo padrão de rejeição de "fatores" já
  aplicado a Cinética Química).
- `summary-quimica-equilibrios-ionicos` — ionização e constante (Ka/Kb),
  grau de ionização e lei de Ostwald, efeito do íon comum e solução-tampão;
  conceitual/procedural, com grau de ionização sendo métrica contínua (mesmo
  padrão de rejeição do pKa), sem guarda-chuva de tipos coexistentes, escala
  nomeada discreta ou cadeia causal entre eventos distintos.
- `qui-equilibrio-acidificacao` (conteúdo editorial: "Equilíbrios Químicos I")
  — equilíbrio dinâmico, interpretação de Keq (métrica contínua, mesmo padrão
  de rejeição do pKa e do grau de ionização) e a convenção de omitir sólidos/
  líquidos puros da expressão de Keq; conceitual/procedural, sem estrutura de
  família sustentada por guarda-chuva próprio.

Total: 3 (`cadeia-de-derivacao`) + 14 (`tipologia`) + 1 (`criterios-conjuntivos`)
+ 3 (`escala-de-graus`) + 2 (`grade-de-eixos`) + 0 + 0 + 0 = 23 capítulos com
família; 25 lacunas. 23 + 25 = 48. Taxa de lacuna: 25/48 ≈ 52%.
