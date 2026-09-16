# Famílias de cena — Geografia (Fase 4)

Este documento fecha a Task 1: a atribuição definitiva de família (ou lacuna) para
os 63 capítulos de Geografia, derivada de leitura integral de `deepSummaryContent.json`
(subject === "Geografia"), não da hipótese amostral do plano. A hipótese do plano
(`docs/superpowers/plans/2026-09-15-cenas-geografia.md`) foi usada só como ponto de
partida e foi corrigida em vários pontos pela leitura real — ver "Divergências da
hipótese" no fim.

Nota de processo: as entradas de `SceneEntry` (com `question`, `items`, `quote`
literal por item) ficam para as Tasks 2-4. Este documento fixa **qual família cada
capítulo recebe e por quê**, para que essas tasks apenas escrevam a cena, sem
precisar redecidir a atribuição.

## Família nova trazida da Fase 2

`tipologia` e `criterios-conjuntivos` não existiam neste branch (só a Fase 1 estava
mergeada). Foram trazidas byte-a-byte de `feature/cenas-sociologia` (componentes,
testes, e os campos `nota?`/o `SceneFamily` ampliado em `types.ts`), sem reimplementação.
`grade-de-eixos` (a outra família da Fase 2) **não** foi trazida — nada na leitura de
Geografia sustenta um cruzamento genuíno de dois eixos ortogonais; os candidatos mais
próximos (ver "Mobilidade Populacional" abaixo) classificam por múltiplos critérios
independentes, não por um produto de dois eixos com células que a cena precisaria
preencher.

**Nota permanente para famílias futuras:** qualquer família nova introduzida nas Tasks
2-4 desta fase, ou em fases posteriores (Literatura, Gramática, Redação), deve ser
registrada aqui com a mesma justificativa: por que as sete famílias existentes não
bastam para aquele capítulo específico.

## Atribuição definitiva

### `contraste-de-posicoes` (1 capítulo)

- **`summary-geografia-paisagem-espaco-geografico-e-ciencia-geografica`** — a corrente
  determinista e a possibilista francesa não são duas leituras que coexistem: o texto
  afirma que o determinismo é "uma visão hoje amplamente rejeitada por simplificar
  excessivamente relações complexas", e o possibilismo (seguido pela geografia crítica)
  a substitui como referência. Frase de rejeição: *"a corrente determinista (que
  atribuía ao meio natural papel decisivo na determinação das características e do
  destino das sociedades humanas, uma visão hoje amplamente rejeitada por simplificar
  excessivamente relações complexas)"*. Adotar o possibilismo/a geografia crítica
  rejeita explicitamente o determinismo — rivalidade genuína, não confusão a evitar.

Nenhum outro candidato resistiu ao teste de rejeição explícita. Casos descartados:
Unilateralismo/Multilateralismo (o texto afirma que "nenhum país pratica exclusivamente
um ou outro modo... a escolha é situacional", ou seja, os dois lados coexistem, não se
excluem); a correção "Amazônia não é pulmão do mundo" (Geopolítica Ambiental) é
correção de um mito against um fato, não duas posições teóricas rivais; o debate
pró/contra energia nuclear (Energia Elétrica no Mundo) é apresentado como trade-off de
risco-benefício que "varia conforme contexto", não como rejeição de um lado pelo outro.

### `camadas-de-determinacao` (2 capítulos)

- **`summary-geografia-o-espaco-industrial-brasileiro-i`** — a concentração industrial
  em São Paulo tem uma base histórica real que condiciona as camadas seguintes, não é
  "tudo interligado" simetricamente. Frase-base: *"capital originado da economia
  cafeeira disponível para investimento industrial, infraestrutura ferroviária e
  portuária já construída para escoar o café, mão de obra abundante... e proximidade
  ao maior mercado consumidor do país"*, e a camada que se ergue sobre essa base:
  *"Essa concentração criou um efeito cumulativo de retroalimentação: a presença de
  indústrias atraía fornecedores e prestadores de serviços especializados, que por sua
  vez atraíam mais indústrias."* O capital cafeeiro é `items[0]`: sem ele, as camadas
  posteriores (infraestrutura, aglomeração) não se sustentam no argumento do texto.

- **`summary-geografia-o-espaco-urbano-ii`** — a segregação socioespacial (localização
  por renda) é a base que condiciona, de forma assimétrica e não recíproca, as camadas
  de acesso a emprego, educação e exposição à violência. Frase: *"A segregação tem
  consequências que vão além da distribuição de infraestrutura: afeta o acesso a
  empregos (pela distância física e pelo tempo de deslocamento), a qualidade da
  educação (pela concentração de escolas melhor equipadas em áreas de maior
  arrecadação tributária local) e até a exposição a violência urbana."* A segregação
  não é consequência da educação ou do emprego — é a condição de base.

### `tipologia` (7 capítulos)

Cada entrada abaixo tem frase-guarda-chuva real na fonte, nomeando a categoria comum
antes de enumerar variantes que coexistem (não competem entre si).

- **`summary-geografia-projecoes-cartograficas`** — *"As projeções cartográficas são
  os diferentes métodos matemáticos usados para realizar essa transferência, cada um
  escolhendo deliberadamente qual tipo de distorção minimizar"*; e mais adiante,
  explicitamente: *"Não existe... uma projeção 'correta' e outras 'erradas': existe
  uma projeção mais adequada para cada propósito específico."* Tipos: conforme,
  equivalente, equidistante.

- **`summary-geografia-biogeografia-mundial`** — *"Os grandes biomas terrestres —
  florestas tropicais, savanas, desertos, florestas temperadas, taiga... e tundra — se
  distribuem globalmente de forma sistemática e previsível."* Biomas coexistem
  espacialmente sob a mesma lógica latitudinal, sem hierarquia entre si.

- **`summary-geografia-geologia-e-geomorfologia`** — *"As rochas se classificam em
  três grandes tipos conforme sua origem, conectados pelo chamado ciclo das rochas."*
  Ígneas, sedimentares, metamórficas: tipos que coexistem e se intercambiam pelo ciclo.

- **`summary-geografia-geomorfologia-mundial`** — *"As grandes estruturas geológicas
  que sustentam o relevo mundial se classificam conforme sua idade e estabilidade
  tectônica."* Crátons, bacias sedimentares, dobras modernas: categoria comum
  ("estruturas geológicas") explicitada antes da enumeração.

- **`summary-geografia-producao-agricola-mundial`** — *"A produção agrícola mundial
  organiza-se em sistemas distintos conforme o grau de mecanização, a escala de
  produção e o mercado de destino."* Subsistência, comercial de larga escala,
  intermediários: sistemas que coexistem no mundo real, não uma escala evolutiva
  obrigatória de um para o outro.

- **`summary-geografia-dominios-morfoclimaticos`** — *"A proposta de Aziz Ab'Sáber...
  classifica o território brasileiro em seis domínios morfoclimáticos."* Os seis
  domínios (Amazônico, Cerrado, Caatinga, Mares de Morros, Araucárias, Pradarias)
  coexistem territorialmente, com faixas de transição explicitamente descritas como
  categoria à parte.

- **`summary-geografia-dinamica-climatica`** — *"Didaticamente, a geografia classifica
  a chuva em três tipos pelo mecanismo de ascensão do ar."* Convectiva, orográfica,
  frontal: tipos definidos pelo mecanismo físico, coexistindo em diferentes regiões e
  estações.

### `criterios-conjuntivos` (2 capítulos)

- **`summary-geografia-clima-mundial`** — necessidade conjunta declarada
  explicitamente: *"Nenhum desses fatores atua isoladamente na prática — o clima real
  observado em qualquer ponto específico do planeta é sempre o resultado da interação
  simultânea e combinada de todos esses fatores relevantes."* Os fatores (latitude,
  altitude, continentalidade, correntes marítimas, relevo) são os critérios.

- **`summary-geografia-mobilidade-populacional`** — *"É importante notar que esses
  fatores raramente atuam isoladamente: a decisão de migrar geralmente resulta da
  combinação de múltiplas pressões de expulsão com múltiplas atrações simultâneas."*
  Fatores de expulsão e atração precisam se combinar; nenhum basta isolado.

Descartado: Domínios Morfoclimáticos (o texto diz que os fatores "se retroalimentam",
mas não afirma que nenhum isolado basta — mais perto de tipologia, onde ficou);
Pedologia (a pedogênese "resulta da interação" de cinco fatores, mas sem a frase de
necessidade conjunta exigida pela regra — ver lacunas).

### `escala-de-graus` (4 capítulos)

- **`summary-geografia-blocos-economicos`** — graus explicitamente crescentes:
  *"existem em diferentes graus progressivos de integração econômica, cada um
  envolvendo compromissos mais profundos que o anterior"* — zona de livre comércio
  (grau 0, mais baixo) → união aduaneira → mercado comum → união econômica e
  monetária (grau mais alto).

- **`summary-geografia-dinamica-demografica`** — as quatro fases da transição
  demográfica são estágios ordenados e nomeados como tal: *"O modelo clássico tem
  quatro fases."* Fase 1 (natalidade e mortalidade altas, grau inicial) até fase 4
  (ambas baixas, grau final).

- **`summary-geografia-o-espaco-urbano-i`** — hierarquia urbana ordenada: *"A
  hierarquia urbana brasileira organiza-se em níveis conforme o alcance da influência
  econômica e de serviços de cada cidade."* Metrópole nacional (grau mais alto) até
  centro local (grau mais baixo) — a cena renderiza do grau menor ao maior, então
  `items[0]` deve ser o centro local.

- **`summary-geografia-estrutura-ativa-da-populacao`** — trajetória setorial ordenada:
  *"o desenvolvimento econômico segue uma trajetória de terciarização: países pobres
  concentram mão de obra no primário, países industrializados no secundário... economias
  maduras terciarizam."* Grau inicial = setor primário.

**Atenção obrigatória na Task correspondente:** antes de fixar a ordem de `items`,
conferir a direção de renderização em `EscalaDeGraus.tsx` (item 0 = grau mais baixo) —
o defeito da Fase 3 foi renderizar uma hierarquia real de cabeça para baixo por não
verificar isso a tempo.

### `cadeia-de-derivacao` (3 capítulos)

- **`summary-geografia-movimentos-da-terra`** — derivação física real, não cronologia:
  *"O eixo de rotação da Terra é inclinado em aproximadamente 23,5 graus... e essa
  inclinação... é a verdadeira causa das estações"* → *"quando o Hemisfério Norte está
  inclinado em direção ao Sol, seus raios solares incidem de forma mais direta...
  gerando verão nesse hemisfério."* Cada elo (inclinação → incidência solar → estação)
  decorre do anterior; removê-lo quebra a conclusão (sem inclinação, não há variação de
  incidência entre hemisférios, logo não há estações opostas).

- **`summary-geografia-do-mundo-bipolar-ao-multipolar`** — cadeia com linguagem
  instrumental real: *"a economia soviética, sufocada pelo gasto militar
  desproporcional ao seu PIB... não conseguiu acompanhar a modernização tecnológica
  ocidental"* → *"As reformas de Mikhail Gorbachev... tentaram salvar o sistema
  soviético... mas acabaram acelerando sua desagregação ao permitir que tensões
  represadas viessem à tona"* → dissolução da URSS → momento unipolar → ascensão
  multipolar. Cada elo é dito como causa do seguinte, não apenas antecessor cronológico.

- **`summary-geografia-geopolitica-dos-recursos-hidricos`** — *"a ausência de um
  tratado vinculante de repartição de águas transforma uma decisão de infraestrutura
  doméstica em fonte de tensão diplomática regional"*, com a gravidade do conflito
  proporcional à dependência do país a jusante: *"o Egito depende do Nilo para mais de
  90% de sua água doce, o que torna qualquer redução de vazão uma ameaça existencial."*
  Barragem sem acordo → redução de vazão → ameaça à segurança hídrica → risco de
  escalada diplomática: cada elo decorre do anterior via linguagem instrumental
  explícita ("transforma em", "torna").

### `movimento-dialetico` (0 capítulos)

Nenhum capítulo de Geografia apresenta três momentos genuínos (tese, negação real,
terceiro termo que supera e conserva os dois). O candidato mais próximo — bipolaridade
→ unipolaridade → multipolaridade (Do Mundo Bipolar ao Multipolar) — foi cogitado e
descartado: a multipolaridade não é uma "síntese" que conserva bipolaridade e
unipolaridade transformando-as, é simplesmente o estado seguinte de um sistema em
fragmentação contínua; por isso esse capítulo foi para `cadeia-de-derivacao`. Zero é o
resultado honesto e esperado para uma disciplina com forte peso de geografia física —
igual ao ocorrido em todas as fases anteriores.

## Lacunas declaradas

### Lacuna já conhecida

- **`summary-geografia-coordenadas-geograficas`** — já tem a experiência interativa
  `coordinates` em `src/views/topic-experiments/catalog.ts`.

### Lacunas adicionais (leitura da Task 1)

Todas com motivo específico ao conteúdo do capítulo, não genérico. Os 43 capítulos
abaixo foram lidos por inteiro e não sustentam nenhuma das sete famílias honestamente:

- `summary-geografia-sistema-de-fusos-horarios` — o capítulo é um procedimento de
  cálculo (conversão UTC, Linha Internacional de Data), não uma estrutura de rivalidade,
  camadas, tipos, critérios conjuntivos, escala ou derivação causal.
- `summary-geografia-linguagem-cartografica` — mistura definição de escala com cálculo
  numérico resolvido; não há tipologia com guarda-chuva real nem cadeia causal, é
  conteúdo procedimental de leitura de mapa.
- `summary-geografia-cartografia-digital` — descreve capacidades de SIG e
  sensoriamento remoto; a "combinação de camadas" é um método de análise, não uma
  estrutura de critérios conjuntivos sobre um fenômeno específico.
- `summary-geografia-representacoes-graficas-e-cartograficas` — lista de elementos do
  mapa (título, legenda, escala, orientação, fonte) e generalização cartográfica;
  procedimental, sem rivalidade, camada ou derivação.
- `summary-geografia-geomorfologia-mundial` — coberto por `tipologia` acima (não é
  lacuna; listado aqui só para deixar claro que não ficou de fora por engano).
- `summary-geografia-climatologia-do-brasil` — descreve massas de ar e tipos
  climáticos regionais, mas sem frase de necessidade conjunta declarada nem cadeia
  causal instrumental; é justaposição de fatores.
- `summary-geografia-desafios-ambientais-do-seculo-xxi` — "tragédia dos comuns" é
  mecanismo de incentivo, não uma cadeia de derivação nem critérios conjuntivos sobre
  um fenômeno único.
- `summary-geografia-geopolitica-ambiental` — combina vários temas (Amazônia,
  acordos climáticos, Nilo) sem uma estrutura única sustentada por seção específica;
  cada exemplo é autônomo, não elos de uma mesma cadeia.
- `summary-geografia-hidrogeografia-mundial` — descreve bacias e usos concorrentes;
  não há rivalidade genuína (usos concorrentes coexistem, não se excluem
  mutuamente) nem tipologia com guarda-chuva claro.
- `summary-geografia-do-mundo-bipolar-ao-multipolar` — coberto por
  `cadeia-de-derivacao` acima.
- `summary-geografia-globalizacao-e-processos-economicos-atuais` — cadeias globais
  de valor e críticas à globalização são descritas lado a lado, sem derivação causal
  instrumental entre elos nem tipologia com variantes coexistentes claras.
- `summary-geografia-geografia-das-redes-mundiais` — hierarquia de cidades globais e
  infraestrutura digital; não há escala ordenada explícita nem derivação, é descrição
  de rede.
- `summary-geografia-unilateralismo-e-multilateralismo` — o texto afirma
  explicitamente que os dois modos coexistem e a escolha é situacional, então não
  sustenta `contraste-de-posicoes` (rejeição não existe) nem outra família.
- `summary-geografia-uniao-europeia` — narrativa histórica institucional; a
  integração aprofunda-se por décadas, mas sem linguagem instrumental de derivação em
  cada elo, é acúmulo de eventos institucionais.
- `summary-geografia-desigualdades-globais` — Gini e centro-periferia são conceitos
  e métricas, não uma escala de graus discretos nem rivalidade genuína (centro e
  periferia coexistem estruturalmente, não se excluem).
- `summary-geografia-mobilidade-populacional` — coberto por `criterios-conjuntivos`
  acima.
- `summary-geografia-geografia-do-turismo` — tipos de turismo (sol e praia, cultural,
  ecoturismo, negócios) são listados por atrativo principal, sem frase-guarda-chuva
  que os una explicitamente como variantes de uma mesma categoria antes da enumeração.
- `summary-geografia-producao-agricola-mundial` — coberto por `tipologia` acima.
- `summary-geografia-industria-i` — as revoluções industriais são cronologia
  (1ª, 2ª, 3ª, 4ª), sem instrumental de derivação exigido ("resultou de", "levou a")
  ligando uma revolução à outra como causa; o texto até avisa que "coexistem hoje".
- `summary-geografia-industria-ii` — nova geografia industrial e tecnopolos são
  descrições paralelas, sem estrutura de família sustentada por frase específica.
- `summary-geografia-gedeconomia-mundial` — instrumentos geoeconômicos (sanções,
  tarifas, controle de exportação) são listados lado a lado; não há necessidade
  conjunta declarada nem derivação causal entre eles.
- `summary-geografia-terrorismo-internacional` — causas do terrorismo são descritas
  como "multifatoriais e disputadas... sem consenso definitivo sobre um único fator",
  o oposto de uma necessidade conjunta declarada.
- `summary-geografia-geografia-das-religioes` — distribuição espacial e laicidade são
  dois sub-temas paralelos sem estrutura de família única sustentada.
- `summary-geografia-tensoes-geopoliticas-na-europa` — narrativa de eventos (guerra
  na Ucrânia, separatismos) sem cadeia causal instrumental nem tipologia clara.
- `summary-geografia-geopolitica-e-geoeconomia-da-america-latina` — dependência
  primário-exportadora e integração regional são descritas, mas sem frase de
  necessidade conjunta nem derivação instrumental por elo.
- `summary-geografia-africa-no-mundo-atual` — herança colonial, diversidade e
  recursos são sub-temas paralelos; "maldição dos recursos" é uma correlação
  associada, não uma cadeia declarada com instrumental causal.
- `summary-geografia-geopolitica-e-geoeconomia-da-asia` — ascensão chinesa e
  rivalidades regionais são descritas lado a lado, sem estrutura única.
- `summary-geografia-geografia-do-oriente-medio` — posição, diversidade e conflitos
  por água são sub-temas paralelos, sem família sustentada por um deles isoladamente.
- `summary-geografia-questao-palestina` — narrativa histórica factual (Declaração
  Balfour, partilha, guerras, impasses); os eventos se sucedem mas o texto não usa
  linguagem instrumental de derivação entre eles, é sequência histórica.
- `summary-geografia-conflitos-no-mundo-arabe` — Primavera Árabe, guerra síria e
  fatores estruturais coexistem no texto sem uma única estrutura de família dominante.
- `summary-geografia-pedologia` — pedogênese "resulta da interação" de cinco fatores,
  mas sem a frase de necessidade conjunta exigida por `criterios-conjuntivos`; mais
  perto de uma lista de fatores do que de um critério declarado como conjuntivo.
- `summary-geografia-climatologia-do-brasil` já listado acima.
- `summary-geografia-biogeografia-do-brasil-i` — Amazônia, Mata Atlântica, Cerrado e
  Caatinga são descritos por bioma, cada um com características próprias, mas sem
  frase-guarda-chuva que os una explicitamente como variantes antes de enumerar (o
  capítulo mundial de Biogeografia já cobre essa tipologia; aqui o foco é regional
  descritivo, sem a mesma estrutura).
- `summary-geografia-biogeografia-do-brasil-ii` — mesmo padrão do anterior: Pantanal,
  Pampa, restingas e manguezais descritos individualmente, sem guarda-chuva explícito.
- `summary-geografia-politicas-ambientais-brasileiras` — marcos legais e instrumentos
  são listados cronológica e funcionalmente, sem derivação instrumental nem
  necessidade conjunta declarada.
- `summary-geografia-hidrogeografia-do-brasil` — bacias e usos são descritos por
  região, sem tipologia com guarda-chuva nem rivalidade genuína.
- `summary-geografia-matriz-energetica` — classificação renovável/não renovável é
  binária e mais fraca que as tipologias aceitas (sem enumeração de variantes
  coexistentes além do par); melhor deixar como lacuna do que forçar.
- `summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil` — pré-sal, gás
  e biocombustíveis são sub-temas paralelos sem família única sustentada.
- `summary-geografia-energia-eletrica-no-mundo` — o debate pró/contra nuclear é
  trade-off de risco-benefício "que varia conforme contexto", não rejeição mútua.
- `summary-geografia-energia-eletrica-no-brasil` — predomínio hidrelétrico, expansão
  eólica/solar e desafios do sistema são descritos lado a lado, sem estrutura única.
- `summary-geografia-producao-mineral` — distribuição de recursos, impactos
  socioambientais e garimpo são sub-temas paralelos.
- `summary-geografia-o-espaco-agrario-brasileiro` — estrutura fundiária,
  modernização e conflitos são descritos lado a lado, sem cadeia instrumental nem
  necessidade conjunta declarada.
- `summary-geografia-estrutura-etnica-e-fluxos-migratorios` — formação da população,
  imigração histórica e migrações internas são períodos históricos distintos listados
  em sequência, sem instrumental de derivação entre eles.
- `summary-geografia-os-fluxos-do-comercio-externo` — pauta de exportação, parceiros
  comerciais e vulnerabilidades são descritos lado a lado, sem família única
  sustentada por uma seção específica.
- `summary-geografia-relevo-brasileiro` — planaltos, planícies e depressões são
  categorias estruturais, mas sem frase-guarda-chuva que as apresente como variantes
  de uma mesma escolha antes de enumerar (mais próximo de descrição geomorfológica
  regional do que de tipologia com coexistência intencional).

Total: 1 lacuna conhecida + 43 lacunas adicionais = 44 lacunas. 63 − 44 = 19
capítulos com família — confere com a soma de `contraste-de-posicoes` (1) +
`camadas-de-determinacao` (2) + `tipologia` (7) + `criterios-conjuntivos` (2) +
`escala-de-graus` (4) + `cadeia-de-derivacao` (3) + `movimento-dialetico` (0) = 19.

## Divergências da hipótese do plano

- A hipótese cogitava `criterios-conjuntivos` para Domínios Morfoclimáticos,
  Climatologia do Brasil e Pedologia; a leitura real só sustentou Clima Mundial e
  Mobilidade Populacional com a frase de necessidade conjunta exigida. Os outros
  três foram para `tipologia` (Domínios Morfoclimáticos) ou lacuna (Climatologia do
  Brasil, Pedologia) por não terem a frase "nenhum isolado basta" ou equivalente.
- A hipótese cogitava `tipologia` para Blocos Econômicos; a leitura mostrou que o
  capítulo é `escala-de-graus` (graus progressivos e explicitamente crescentes de
  integração), não tipos paralelos.
- A hipótese cogitava `cadeia-de-derivacao` para Transição Demográfica; a leitura
  mostrou que as quatro fases são melhor representadas como `escala-de-graus`
  (estágios ordenados), reservando `cadeia-de-derivacao` para capítulos com elos
  causais explícitos entre eventos distintos (Movimentos da Terra, Do Mundo Bipolar
  ao Multipolar, Geopolítica dos Recursos Hídricos).
- A hipótese cogitava `escala-de-graus` para Desigualdades Globais; a leitura mostrou
  que o Gini é uma métrica contínua, não uma escala de graus discretos nomeados, e
  centro-periferia é relação estrutural, não rivalidade — o capítulo ficou como
  lacuna.
- A hipótese não cogitava `camadas-de-determinacao` para nenhum capítulo específico;
  a leitura encontrou dois com assimetria real (Espaço Industrial Brasileiro I,
  Espaço Urbano II).
- `grade-de-eixos` (família de Sociologia) não foi trazida — nenhum capítulo de
  Geografia pede genuinamente um cruzamento de dois eixos ortogonais com célula
  correspondente; Mobilidade Populacional classifica por três critérios
  independentes (duração, território, voluntariedade), não por produto de dois eixos.
