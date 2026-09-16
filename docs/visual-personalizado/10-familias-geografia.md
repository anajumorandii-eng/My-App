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

**Regra de processo (correção pós-revisão):** todo capítulo candidato a lacuna deve
ser testado contra as sete famílias antes de ser declarado lacuna — nunca só contra a
família que a hipótese do plano sugeriu para ele. A primeira versão deste documento
violou essa regra em pelo menos 9 capítulos: testou cada um só contra a família
esperada pela hipótese, sem varrer as outras seis, e por isso perdeu `tipologia` em
capítulos que a sustentavam claramente (Relevo Brasileiro, Geografia do Turismo,
Climatologia do Brasil, Pedologia, Indústria I, As Redes de Transportes) e
`cadeia-de-derivacao` em um (Desigualdades Globais), além de simplesmente esquecer três
capítulos por completo. As Tasks 2-4 e fases futuras devem varrer as sete famílias
antes de declarar qualquer lacuna — este é exatamente o defeito que a Fase 3 já havia
precisado corrigir na sua própria Task 1.

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
correção de um mito contra um fato, não duas posições teóricas rivais; o debate
pró/contra energia nuclear (Energia Elétrica no Mundo) é apresentado como trade-off de
risco-benefício que "varia conforme contexto", não como rejeição de um lado pelo outro;
centro-periferia (Desigualdades Globais) coexiste estruturalmente, não se excluem.

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

### `tipologia` (13 capítulos)

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
  espacialmente sob a mesma lógica latitudinal, sem hierarquia entre si. (A entrada
  mais fraca do lote — o "guarda-chuva" é implícito na frase de abertura mais do que
  numa palavra explícita como "classificam-se" — mas mantida porque a enumeração de
  variantes coexistentes é real; as demais entradas abaixo aplicam a mesma vara.)

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

- **`summary-geografia-as-redes-de-transportes`** — *"Cada modal de transporte tem uma
  'vocação' técnica específica, determinada por suas próprias características físicas
  e econômicas: o modal rodoviário é vantajoso para distâncias curtas e médias... o
  ferroviário é mais eficiente para grandes volumes... o hidroviário... é o mais barato
  por tonelada... e o modal aéreo, o mais caro de todos."* Quatro modais que coexistem,
  cada um com vocação própria — nenhum é "o certo".

- **`summary-geografia-relevo-brasileiro`** — *"O relevo brasileiro se classifica,
  segundo a proposta clássica do geógrafo Aziz Ab-Sáber, em três grandes categorias
  estruturais: planaltos, planícies e depressões."* Mesmo autor e mesma forma sintática
  do guarda-chuva aceito em Domínios Morfoclimáticos — planaltos, planícies e
  depressões coexistem no território, cada categoria com processo de formação próprio
  (erosivo, deposicional, erosivo-rebaixado). (Corrigido: a primeira versão deste
  documento havia declarado, incorretamente, que esse guarda-chuva não existia.)

- **`summary-geografia-geografia-do-turismo`** — *"O turismo se organiza em diferentes
  tipos conforme o atrativo principal e o território que ocupa."* Sol e praia,
  cultural/histórico, ecoturismo, negócios e eventos — quatro tipos coexistentes, cada
  um com padrão territorial próprio, fechado por *"Cada tipo gera um padrão territorial
  distinto de ocupação."* (Corrigido: a primeira versão havia declarado,
  incorretamente, que faltava a frase-guarda-chuva.)

- **`summary-geografia-climatologia-do-brasil`** — *"Os principais tipos climáticos
  brasileiros refletem diretamente essa combinação específica de latitude e massas de
  ar dominantes em cada região: o clima equatorial predomina na Amazônia... o clima
  tropical típico ocupa o Centro-Oeste... o clima semiárido caracteriza o interior
  nordestino... e o clima subtropical predomina no Sul."* Estrutura idêntica à aceita
  em Dinâmica Climática (tipos de chuva): guarda-chuva explícito, variantes coexistentes
  por região. (Corrigido: a primeira versão havia testado só `criterios-conjuntivos`
  para este capítulo — corretamente rejeitado, pois os fatores climáticos "se
  retroalimentam" sem afirmação de necessidade conjunta — e parou aí, sem varrer
  `tipologia`.)

- **`summary-geografia-pedologia`** — *"O território brasileiro apresenta grande
  diversidade de tipos de solo, refletindo a combinação de diferentes climas, relevos e
  rochas-mãe ao longo do país"*, seguido pela enumeração de latossolos, terra roxa e
  solos do semiárido, cada um com propriedade distintiva declarada (fertilidade
  aparente vs. real, origem basáltica, suscetibilidade à salinização). Guarda-chuva
  mais explícito que o aceito em Biogeografia Mundial. A rejeição de
  `criterios-conjuntivos` para este capítulo permanece correta e documentada abaixo —
  a pedogênese "resulta da interação prolongada" de cinco fatores, mas o texto nunca
  declara que nenhum isolado basta, o que é uma afirmação genuinamente diferente.
  (Corrigido: a primeira versão testou só `criterios-conjuntivos`, rejeitou
  corretamente, e classificou como lacuna sem varrer `tipologia`.)

- **`summary-geografia-industria-i`** — a seção "As revoluções industriais" é
  cronologia, não derivação (o próprio texto diz que os modelos "coexistem hoje"), e
  essa rejeição de `cadeia-de-derivacao` permanece correta. Mas a seção "Modelos
  produtivos" tem guarda-chuva próprio: *"Diferentes modelos produtivos organizaram o
  chão de fábrica ao longo do tempo, cada um com lógica própria de eficiência."*
  Taylorismo, fordismo e toyotismo coexistem como abordagens (o toyotismo é
  explicitamente apresentado como alternativa ao fordismo, não sua substituição total
  — ambos os modelos ainda operam lado a lado em setores diferentes hoje). (Corrigido:
  a primeira versão testou só a leitura de cadeia sobre as revoluções industriais,
  rejeitou corretamente, e parou sem varrer `tipologia` sobre a segunda seção do mesmo
  capítulo.)

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

Descartado (com o mesmo padrão de exigência aplicado aos dois): Domínios
Morfoclimáticos (o texto diz que os fatores "se retroalimentam", mas não afirma que
nenhum isolado basta — ficou em `tipologia`); Pedologia (a pedogênese "resulta da
interação" de cinco fatores, mas sem a frase de necessidade conjunta — ficou em
`tipologia` pelo guarda-chuva da seção de tipos de solo).

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
  maduras terciarizam."* Grau inicial = setor primário. (Leitura alternativa
  considerada e descartada: tratar primário/secundário/terciário como `tipologia` —
  mas o texto explicitamente descreve uma trajetória histórica ordenada de
  desenvolvimento, não três setores coexistentes sem hierarquia, o que favorece
  `escala-de-graus`.)

**Atenção obrigatória na Task correspondente:** antes de fixar a ordem de `items`,
conferir a direção de renderização em `EscalaDeGraus.tsx` (item 0 = grau mais baixo) —
o defeito da Fase 3 foi renderizar uma hierarquia real de cabeça para baixo por não
verificar isso a tempo. Essa checagem foi feita para as 4 entradas acima, inclusive
Espaço Urbano I (a hierarquia urbana é descrita do grau mais alto — metrópole nacional
— para o mais baixo — centro local — no texto-fonte, mas `items[0]` na cena deve ser o
grau mais baixo, exigindo inverter a ordem de apresentação da fonte ao escrever a
entrada).

### `cadeia-de-derivacao` (4 capítulos)

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

- **`summary-geografia-desigualdades-globais`** — a seção "Centro e periferia" tem
  linguagem instrumental real em cada elo: deterioração dos termos de troca →
  *"a periferia precisava exportar quantidades cada vez maiores da mesma matéria-prima
  para importar a mesma quantidade de produtos industrializados"* → resposta latino-
  americana (industrialização por substituição de importações) → *"O modelo elevou o
  PIB industrial mas criou parques fabris pouco competitivos internacionalmente"* → *"a
  crise da dívida dos anos 1980 forçou a abertura comercial."* Cada elo decorre do
  anterior com verbo instrumental próprio ("precisava", "criou", "forçou"); removendo
  um elo (por exemplo, a crise da dívida), a conclusão sobre a abertura comercial não se
  sustenta. (Corrigido: a primeira versão testou só `escala-de-graus` — Gini não é
  estágio nomeado, rejeição correta — e `contraste-de-posicoes` — centro/periferia
  coexistem, rejeição correta — mas nunca varreu `cadeia-de-derivacao`, que a seção
  "Centro e periferia" sustenta claramente.)

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

### Lacunas adicionais (leitura da Task 1, revisada)

Todas com motivo específico ao conteúdo do capítulo, não genérico, e todas testadas
contra as sete famílias antes de serem declaradas lacuna. Os 36 capítulos abaixo foram
lidos por inteiro e não sustentam nenhuma das sete famílias honestamente:

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
- `summary-geografia-desafios-ambientais-do-seculo-xxi` — "tragédia dos comuns" é
  mecanismo de incentivo, não uma cadeia de derivação nem critérios conjuntivos sobre
  um fenômeno único.
- `summary-geografia-geopolitica-ambiental` — combina vários temas (Amazônia,
  acordos climáticos, Nilo) sem uma estrutura única sustentada por seção específica;
  cada exemplo é autônomo, não elos de uma mesma cadeia.
- `summary-geografia-hidrogeografia-mundial` — descreve bacias e usos concorrentes;
  não há rivalidade genuína (usos concorrentes coexistem, não se excluem
  mutuamente) nem tipologia com guarda-chuva claro.
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
  coexistentes além do par); melhor deixar como lacuna do que forçar. Nota para fase
  futura: o capítulo tem um segundo eixo de classificação (despachável vs.
  intermitente) cruzado com o primeiro — se `grade-de-eixos` for trazida numa fase
  futura, vale reconsiderar este capítulo.
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
- `summary-geografia-agua-na-superficie-terrestre` — a distribuição da água (oceanos
  97% → água doce 3% → majoritariamente congelada/em aquíferos profundos → menos de 1%
  em rios e lagos de fácil acesso) é uma cascata de proporções decrescentes, não uma
  escala de graus nomeados nem uma tipologia com variantes que coexistem sem hierarquia
  — e a classificação de aquíferos em livre/confinado é binária, mais fraca que
  qualquer tipologia aceita neste documento. (Capítulo esquecido na primeira versão
  deste documento — não aparecia nem na atribuição nem nas lacunas.)
- `summary-geografia-o-espaco-industrial-brasileiro-ii` — desconcentração industrial é
  descrita por múltiplos fatores combinados ("saturação de infraestrutura... aumento
  dos custos... melhoria da infraestrutura... políticas deliberadas"), mas sem a frase
  de necessidade conjunta que sustentaria `criterios-conjuntivos` — mesmo padrão
  aplicado a Pedologia antes de essa ser corrigida para `tipologia`, mas aqui não há um
  guarda-chuva de tipos equivalente ao que salvou Pedologia. Guerra fiscal e
  desindustrialização são sub-temas paralelos adicionais, sem cadeia instrumental
  única. (Capítulo esquecido na primeira versão deste documento.)

Total: 1 lacuna conhecida + 36 lacunas adicionais = 37 lacunas. 63 − 37 = 26
capítulos com família — confere com a soma de `contraste-de-posicoes` (1) +
`camadas-de-determinacao` (2) + `tipologia` (13) + `criterios-conjuntivos` (2) +
`escala-de-graus` (4) + `cadeia-de-derivacao` (4) + `movimento-dialetico` (0) = 26.
Taxa de lacuna: 37/63 ≈ 59%.

## Divergências da hipótese do plano

- A hipótese cogitava `criterios-conjuntivos` para Domínios Morfoclimáticos,
  Climatologia do Brasil e Pedologia; a leitura real só sustentou Clima Mundial e
  Mobilidade Populacional com a frase de necessidade conjunta exigida. Os outros três
  foram para `tipologia` (todos os três, na versão final — Domínios Morfoclimáticos,
  Climatologia do Brasil e Pedologia sustentam guarda-chuvas de tipos próprios).
- A hipótese cogitava `tipologia` para Blocos Econômicos; a leitura mostrou que o
  capítulo é `escala-de-graus` (graus progressivos e explicitamente crescentes de
  integração), não tipos paralelos.
- A hipótese cogitava `cadeia-de-derivacao` para Transição Demográfica; a leitura
  mostrou que as quatro fases são melhor representadas como `escala-de-graus`
  (estágios ordenados), reservando `cadeia-de-derivacao` para capítulos com elos
  causais explícitos entre eventos distintos (Movimentos da Terra, Do Mundo Bipolar
  ao Multipolar, Geopolítica dos Recursos Hídricos, Desigualdades Globais).
- A hipótese cogitava `escala-de-graus` para Desigualdades Globais; a leitura mostrou
  que o Gini é uma métrica contínua, não uma escala de graus discretos nomeados, e
  centro-periferia é relação estrutural, não rivalidade — mas uma varredura completa
  das sete famílias (feita só na revisão) encontrou `cadeia-de-derivacao` na seção
  "Centro e periferia" (deterioração dos termos de troca → substituição de
  importações → competitividade baixa → crise da dívida → abertura comercial).
- A hipótese não cogitava `camadas-de-determinacao` para nenhum capítulo específico;
  a leitura encontrou dois com assimetria real (Espaço Industrial Brasileiro I,
  Espaço Urbano II).
- `grade-de-eixos` (família de Sociologia) não foi trazida — nenhum capítulo de
  Geografia pede genuinamente um cruzamento de dois eixos ortogonais com célula
  correspondente; Mobilidade Populacional classifica por três critérios
  independentes (duração, território, voluntariedade), não por produto de dois eixos.
  Matriz Energética tem um segundo eixo latente (despachável/intermitente) que poderia
  justificar reconsideração se `grade-de-eixos` for trazida numa fase futura.

## Nota sobre a taxa de lacuna final

A taxa de 59% (37/63) ainda é a mais alta entre as quatro fases já concluídas, mas por
um motivo mais estreito do que a primeira versão deste documento registrou. A primeira
versão atribuiu a taxa alta (70%, com contagem incorreta) à "resistência estrutural" do
conteúdo de Geografia às sete famílias. Depois da varredura completa das sete famílias
em todo lacuna candidata — corrigindo o defeito descrito na "Regra de processo" no
início deste documento —, seis capítulos que pareciam gaps migraram para `tipologia` e
um para `cadeia-de-derivacao`, e três capítulos que haviam sido simplesmente esquecidos
foram inseridos (um em `tipologia`, dois em lacunas). A explicação correta para a taxa
ainda alta não é que Geografia "resista" às famílias — é que uma fração real e grande
dos capítulos de geopolítica contemporânea e de geografia física regional deste
currículo é composta por sub-temas paralelos ou listas de fatores sem uma única
estrutura dominante declarada na fonte (rivalidade genuína, cadeia causal instrumental,
necessidade conjunta, base assimétrica ou tipos com guarda-chuva), e não por um viés de
leitura que deixou de testar as famílias certas — esse viés existiu, mas já foi
corrigido acima.
