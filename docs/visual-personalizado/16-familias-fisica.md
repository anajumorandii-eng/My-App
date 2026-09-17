# Famílias de cena — Física (Fase 5, dividida em duas dispatches)

Este documento fixa a atribuição de família (ou lacuna) para os capítulos de Física,
derivada de leitura integral de `deepSummaryContent.json` (subject === "Física"),
confirmando a ordem de aparição com `src/data/summaryCurriculum.ts`. Física tem 85
capítulos no total; por risco de fabricação numa dispatch única (ver histórico do
commit `8d062f5b`, revertido por citações fabricadas), o trabalho foi dividido em
duas metades de 42 e 43 capítulos.

**Regra de processo, repetida da Fase 4 (Geografia):** todo capítulo candidato a
lacuna foi testado contra as oito famílias de `src/views/topic-scenes/types.ts`
antes de ser declarado lacuna. Toda citação abaixo é trecho literal do JSON — nunca
paráfrase, nunca invenção. Na dúvida entre uma família e lacuna, o capítulo foi
declarado lacuna.

## Parte A — capítulos 1 a 42

Cobre os primeiros 42 capítulos de Física, na ordem de `summaryCurriculum.ts`
(de `fisica-cinematica-escalar-conceitos-fundamentais` até
`fisica-forca-eletrica-lei-de-coulomb`). A Parte B (capítulos 43 a 85) é adicionada
por uma dispatch separada, sem sobreposição com esta lista.

### `grade-de-eixos` (1 capítulo)

- **`summary-fisica-aceleracao-vetorial`** — os quatro tipos de movimento (MRU, MRUV,
  MCU, MCUV) são exatamente o cruzamento de dois eixos binários independentes:
  presença de aceleração tangencial e presença de aceleração centrípeta. O texto
  percorre as quatro células explicitamente: *"Num movimento retilíneo uniforme,
  tanto a aceleração tangencial quanto a centrípeta são nulas... Num movimento
  retilíneo uniformemente variado, a aceleração tangencial é constante e não nula...
  enquanto a aceleração centrípeta é sempre nula... Num movimento circular uniforme, a
  situação se inverte exatamente: a aceleração tangencial é nula... mas a aceleração
  centrípeta é constante... Num movimento circular uniformemente variado, ambas as
  componentes estão simultaneamente presentes e são não nulas."* Eixo A: aceleração
  tangencial (nula / não nula). Eixo B: aceleração centrípeta (nula / não nula). As
  quatro células nascem exatamente desse cruzamento, não de uma lista solta de tipos.

### `tipologia` (7 capítulos)

- **`summary-fisica-forca-e-seus-tipos`** — o próprio título já anuncia a família.
  Guarda-chuva: *"Entre as forças mais cobradas em vestibular, o peso é a força
  gravitacional que a Terra exerce sobre um corpo... a força normal é a força de
  contato que uma superfície exerce perpendicularmente... a tração é a força que um
  fio ou corda esticada exerce... o atrito é a força de contato paralela à
  superfície... e a força elástica, dada pela lei de Hooke F=kx..."* Cinco tipos que
  coexistem, sem hierarquia entre si.

- **`summary-fisica-colisoes`** — guarda-chuva explícito: *"Colisões se classificam
  em três tipos conforme o que acontece com a energia cinética."* Elástica (e=1),
  perfeitamente inelástica (e=0) e parcialmente elástica (0<e<1) — com nota de
  honestidade real sobre a categoria intermediária: *"a maioria das colisões reais do
  dia a dia... se encaixa nessa categoria intermediária."*

- **`summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares`**
  — cinco fontes de geração elétrica (hidrelétrica, termelétrica, eólica, solar,
  nuclear) compartilhando o mesmo princípio final, exceto uma exceção explicitamente
  nomeada: *"Na energia solar fotovoltaica, o princípio é radicalmente diferente de
  todas as demais fontes mencionadas anteriormente: não há turbina nem gerador
  rotativo algum envolvido."* A nota de honestidade é exatamente essa exceção
  nomeada dentro da própria tipologia.

- **`summary-fisica-temperatura-calor-e-seus-mecanismos-de-transferencia`** —
  guarda-chuva: *"Calor se transfere por três mecanismos fisicamente distintos."*
  Condução, convecção e irradiação, com nota de honestidade sobre a irradiação:
  *"é o único dos três mecanismos que não exige nenhum meio material."*

- **`summary-fisica-gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas`** —
  guarda-chuva: *"As transformações particulares surgem quando uma das três variáveis
  é mantida fixa durante o processo."* Isotérmica (Boyle-Mariotte), isobárica
  (Gay-Lussac/Charles) e isocórica, todas generalizadas e englobadas pela equação de
  Clapeyron — a mesma lógica de "regra geral com casos particulares nomeados" que
  sustenta a tipologia.

- **`summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares`**
  — guarda-chuva: *"Aplicar a primeira lei da termodinâmica a transformações
  particulares exige tratar cada tipo de processo separadamente... isotérmica,
  isovolumétrica, isobárica e adiabática, cada uma com sua simplificação
  característica."* Quatro tipos que coexistem, cada um com uma redução própria de
  ΔU=Q−τ.

- **`summary-fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes`** —
  guarda-chuva: *"Existem três processos clássicos de eletrização."* Atrito, contato
  e indução — três processos que coexistem, cada um com mecanismo físico distinto,
  sem hierarquia entre si.

### `criterios-conjuntivos` (1 capítulo)

- **`summary-fisica-estatica`** — o próprio texto nomeia a conjunção: *"Um corpo em
  equilíbrio estático não está simplesmente 'parado' no sentido trivial da palavra —
  ele satisfaz duas condições simultâneas e independentes: a resultante de todas as
  forças que atuam sobre ele é nula (equilíbrio de translação)... e a resultante de
  todos os torques... também é nula (equilíbrio de rotação)."* E o texto reforça que
  derrubar um único critério já invalida o equilíbrio: *"um corpo extenso... pode ter
  forças perfeitamente equilibradas e ainda assim começar a girar, se essas forças
  estiverem aplicadas em pontos diferentes de forma a criar um torque resultante não
  nulo."*

### `cadeia-de-derivacao` (2 capítulos)

- **`summary-fisica-dilatacao-ou-contracao-termica-dos-solidos-e-liquidos`** — a
  dilatação superficial é derivada explicitamente a partir da linear, e a volumétrica
  pela mesma lógica: *"a dilatação superficial, ΔA = A₀×β×ΔT... o coeficiente
  superficial vale o dobro do linear, β = 2α — essa relação não é uma coincidência
  numérica, mas decorre diretamente de expandir (L₀+ΔL)²... Pela mesma lógica, a
  dilatação volumétrica... tem coeficiente γ = 3α, o triplo do linear."* Três elos
  encadeados: linear (base) → superficial (derivada da linear ao quadrado) →
  volumétrica (derivada da linear ao cubo), cada um dependendo explicitamente do
  anterior, não uma lista solta de fórmulas.

- **`summary-fisica-calor-sensivel-e-calor-latente`** — a seção "Gelo até água
  líquida" é uma cadeia de três etapas obrigatoriamente sequenciais e explicitamente
  rotuladas: *"Primeira etapa: aquecimento sensível do gelo desde sua temperatura
  inicial (abaixo de 0°C) até atingir exatamente 0°C... Segunda etapa: fusão completa
  do gelo a 0°C... Terceira etapa: aquecimento sensível da água líquida já formada,
  desde 0°C até a temperatura final desejada."* Cada etapa só começa onde a anterior
  termina — dependência real de elo a elo, não apenas uma lista de fórmulas
  independentes.

### Lacunas desta metade (31 capítulos)

Os demais 31 capítulos da Parte A foram testados contra as oito famílias e não
sustentam nenhuma delas com citação literal real (só definições, procedimentos de
cálculo, ou distinções binárias sem guarda-chuva de tipologia nem conjunção de
critérios). O motivo específico de cada um está em
`src/views/topic-scenes/data/fisica.ts`, no array `fisicaSemCena` — não repetido
aqui para evitar duplicação que poderia divergir da fonte única de verdade.

### Nota sobre candidatos descartados

- **`summary-fisica-o-movimento-circular`** (acoplamentos por correia vs. eixo
  comum) foi meu candidato mais forte a `tipologia` além dos sete aceitos, mas
  descartado: o texto apresenta duas configurações mecânicas mutuamente exclusivas
  (v igual vs. ω igual), não um guarda-chuva de tipos que coexistem — é uma escolha
  binária de qual grandeza se conserva, mais próxima de uma regra de leitura do que
  de uma tipologia com nota de honestidade sobre combinação de tipos.
- **`summary-fisica-dinamica-do-movimento-circular`** (quem faz o papel de força
  centrípeta em cada situação — atrito, tração, normal) também foi testado contra
  `tipologia`: a lista de exemplos (curva plana, pêndulo cônico, pista inclinada) é
  um heurístico de diagnóstico caso a caso, sem guarda-chuva explícito nomeando um
  conjunto fechado de tipos.
- **`summary-fisica-sistemas-conservativos-e-sistemas-nao-conservativos`** foi
  testado contra `tipologia` e contra `criterios-conjuntivos`: é uma dicotomia
  definicional (conservativo vs. não conservativo), não uma tipologia de vários
  tipos coexistentes, e não há lista de condições que precisem ser reunidas
  simultaneamente para um único veredito.
- **`summary-fisica-hidrostatica-densidade-e-pressao`** foi testado contra
  `criterios-conjuntivos` (a condição de flutuação): é a comparação entre duas
  densidades (um único critério), não uma conjunção de vários critérios
  independentes.

## Capítulos cobertos nesta Parte A (lista de conferência para a Parte B)

```
fisica-cinematica-escalar-conceitos-fundamentais
fisica-movimento-uniforme
fisica-movimento-uniformemente-variado
fisica-o-movimento-circular
fisica-grandezas-fisicas-e-operacoes-com-vetores
fisica-velocidade-vetorial
fisica-composicao-de-movimentos
fisica-aceleracao-vetorial
fisica-forca-e-seus-tipos
fisica-resultante-de-um-sistema-de-forcas
fisica-as-leis-de-newton
fisica-a-forca-de-contato
fisica-sistema-de-corpos-interagindo-e-os-elementos-transmissores-de-forca
fisica-plano-inclinado
fisica-leis-da-gravitacao
fisica-dinamica-do-movimento-circular
fisica-analisando-movimentos-contidos-em-um-plano-vertical
fisica-orbitas
fisica-balistica
fisica-movimento-harmonico-simples-mhs
fisica-impulso-e-quantidade-de-movimento
fisica-sistemas-isolados-e-a-conservacao-da-quantidade-de-movimento
fisica-colisoes
fisica-trabalho-e-energia-trabalho-de-uma-forca
fisica-trabalho-e-energia-teorema-da-energia-cinetica
fisica-trabalho-e-energia-o-teorema-da-energia-potencial
fisica-sistemas-conservativos-e-sistemas-nao-conservativos
fisica-potencia-maquina-e-rendimento
fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares
fisica-equivalencia-massa-energia
fisica-estatica
fisica-hidrostatica-densidade-e-pressao
fisica-temperatura-calor-e-seus-mecanismos-de-transferencia
fisica-dilatacao-ou-contracao-termica-dos-solidos-e-liquidos
fisica-calor-sensivel-e-calor-latente
fisica-gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas
fisica-trabalho-da-forca-de-pressao-do-gas
fisica-primeira-lei-da-termodinamica
fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares
fisica-maquinas-termicas-e-ciclo-de-carnot
fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes
fisica-forca-eletrica-lei-de-coulomb
```

A Parte B começa em `fisica-campo-eletrico` (capítulo 43) e segue até
`fisica-nocoes-basicas-de-fisica-quantica` (capítulo 85), sem sobreposição com a
lista acima. Nota de correção: o cabeçalho original desta dispatch mencionava
`fisica-corrente-eletrica` como início da Parte B, mas a lista real de 43
capítulos restantes (confirmada por `summaryCurriculum.ts` menos os 42 já
listados acima) começa cinco capítulos antes, em `fisica-campo-eletrico` — os
42 capítulos acima mais estes 43 fecham exatamente os 85 capítulos de Física.

## Parte B — capítulos 43 a 85

Cobre os 43 capítulos restantes de Física, de `fisica-campo-eletrico` até
`fisica-nocoes-basicas-de-fisica-quantica`, na ordem de `summaryCurriculum.ts`.
Esta metade cobre eletrostática avançada, circuitos elétricos, eletromagnetismo,
óptica geométrica, ondulatória e física moderna. A mesma regra de processo da
Parte A se aplica: todo capítulo foi testado contra as oito famílias antes de
ser declarado lacuna, toda citação é trecho literal do JSON, e na dúvida o
capítulo foi declarado lacuna.

### `tipologia` (2 capítulos)

- **`summary-fisica-optica-da-visao`** — quatro defeitos visuais coexistentes,
  cada um com mecanismo e correção próprios: *"A miopia ocorre quando o
  olho... converge a luz de objetos distantes num ponto situado antes da
  retina... A correção óptica da miopia usa lentes divergentes... A
  hipermetropia é o problema oposto: o olho... converge a luz num ponto
  situado depois da retina... a correção usa lentes convergentes... A
  presbiopia é a perda progressiva, relacionada à idade, da capacidade de
  acomodação do cristalino... O astigmatismo, diferente dos defeitos
  anteriores (que envolvem convergência excessiva ou insuficiente ao longo de
  todos os meridianos do olho de forma simétrica), decorre de uma curvatura
  irregular da córnea."* A nota de honestidade sobre combinação de tipos está
  explícita nas pegadinhas: *"embora ambas dificultem a visão de perto e sejam
  corrigidas com lentes convergentes, têm causas fisiológicas distintas"* e a
  presbiopia é descrita como *"frequentemente combinadas, em óculos
  multifocais, com correções adicionais para outros defeitos visuais
  preexistentes de cada pessoa"* — o mesmo padrão de "regra geral com exceção
  nomeada" que já sustentou tipologias na Parte A.

- **`summary-fisica-ondulatoria-som-e-suas-propriedades`** — guarda-chuva
  explícito: *"O som possui três qualidades fisiológicas, cada uma associada a
  uma grandeza física distinta e mensurável objetivamente, apesar de a
  percepção subjetiva envolver também a interpretação do cérebro humano."*
  Altura (frequência), timbre (composição harmônica) e intensidade (amplitude
  em decibéis), com nota de honestidade sobre independência: *"cada uma dessas
  três qualidades pode variar de forma completamente independente das outras
  duas."* Mesmo padrão estrutural da tipologia de mecanismos de transferência
  de calor da Parte A (três atributos sempre coexistentes de um mesmo
  fenômeno, cada um isolável e nomeado).

### `escala-de-graus` (1 capítulo)

- **`summary-fisica-ondulatoria-ondas-eletromagneticas`** — o espectro
  eletromagnético é uma escala ordenada explícita por frequência: *"O espectro
  eletromagnético organiza todas as ondas eletromagnéticas possíveis por sua
  frequência (ou, equivalentemente, por seu comprimento de onda, já que ambos
  se relacionam por c=λf com c fixo): em ordem crescente de frequência (e
  decrescente de comprimento de onda), tem-se ondas de rádio, micro-ondas,
  infravermelho, luz visível... ultravioleta, raios X e raios gama."* Cada
  grau da escala tem comportamento distinto e crescente com a energia,
  reforçado pela seção seguinte: *"micro-ondas aquecem alimentos... raios X
  atravessam tecidos moles do corpo humano... a luz ultravioleta, de energia
  suficiente para quebrar certas ligações químicas na pele."* Eixo da escala:
  frequência (e energia por fóton) crescente, do rádio ao raio gama.

### Lacunas desta metade (40 capítulos)

Os demais 40 capítulos da Parte B foram testados contra as oito famílias e não
sustentam nenhuma delas com citação literal real. O motivo específico de cada
um está em `src/views/topic-scenes/data/fisica.ts`, no array `fisicaSemCena`
— não repetido aqui para evitar duplicação que poderia divergir da fonte única
de verdade.

### Nota sobre candidatos descartados

- **`summary-fisica-mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais`**
  foi testado contra `tipologia`: os três padrões visuais (carga isolada
  radial, placas paralelas uniforme, par de cargas opostas em arco) são um
  guia de leitura de figuras de prova, uma heurística de reconhecimento
  visual, não uma classificação estrutural do próprio fenômeno físico com nota
  de honestidade sobre combinação de tipos.
- **`summary-fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme`**
  foi testado contra `grade-de-eixos` e `tipologia`: a trajetória circular
  (velocidade perpendicular ao campo) e a helicoidal (velocidade oblíqua) são
  dois regimes ao longo de uma única variável contínua (o ângulo de entrada),
  não dois eixos binários independentes cruzando em quatro células, nem uma
  tipologia com guarda-chuva explícito de tipos coexistentes.
- **`summary-fisica-reflexao-em-superficies-esfericas`** e
  **`summary-fisica-lentes-esfericas-estudo-grafico`** foram testados contra
  `tipologia`: a "regra das posições" do objeto (além do centro de curvatura,
  no centro, entre foco e centro, entre foco e o espelho/lente) é uma tabela
  de consulta que mapeia uma única variável contínua (distância do objeto) em
  faixas de resultado, o mesmo padrão heurístico já descartado na Parte A para
  "quem faz o papel de força centrípeta" — não é uma tipologia com tipos
  nomeados e coexistentes.
- **`summary-fisica-conceitos-basicos`** (ondas) foi testado contra
  `grade-de-eixos`: as três classificações de onda (natureza, direção de
  vibração, dimensão) são independentes entre si, mas o próprio texto não
  apresenta o par eletromagnética+longitudinal (que fisicamente não ocorre
  para ondas eletromagnéticas livres no vácuo), então os eixos não cruzam em
  quatro células genuínas como a família exige.
- **`summary-fisica-intensidade-sonora`** foi testado contra `escala-de-graus`:
  ao contrário do espectro eletromagnético (que nomeia sete faixas em ordem
  explícita), aqui há apenas dois ou três valores de referência soltos nos
  exemplos (limiar de audibilidade, limiar da dor, ~60 dB de conversação), não
  uma lista estruturada de itens graduados que sustente a família.
- **`summary-fisica-ondas-estacionarias-em-tubos`** foi testado contra
  `tipologia`: tubo aberto (todos os harmônicos) vs. tubo fechado numa ponta
  (só harmônicos ímpares) é uma dicotomia de condição de contorno, sem o
  guarda-chuva explícito de três ou mais tipos coexistentes com nota de
  honestidade que caracteriza as tipologias aceitas — mesma classe de
  dicotomia binária já descartada na Parte A para sistemas
  conservativos/não conservativos.
- **`summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas`**
  foi testado contra `tipologia`: reflexão com ou sem inversão de fase em
  extremidade fixa vs. livre é a mesma classe de dicotomia binária definicional
  já descartada em outros capítulos, não uma tipologia com guarda-chuva de
  tipos coexistentes.

## Capítulos cobertos nesta Parte B (lista de conferência)

```
fisica-campo-eletrico
fisica-energia-potencial-e-potencial-eletrico
fisica-mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais
fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial
fisica-dinamica-das-cargas-eletricas
fisica-corrente-eletrica
fisica-potencia-eletrica
fisica-resistores
fisica-medidores-eletricos
fisica-geradores
fisica-receptores
fisica-circuitos-de-malha-unica
fisica-eletrodinamica-as-leis-de-kirchhoff
fisica-capacitores
fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre
fisica-campo-magnetico-devido-a-corrente-em-fio-reto-e-espira-descricao-vetorial-e-aplicacoes
fisica-forca-magnetica-e-analise-de-lancamentos-de-cargas-em-um-campo-magnetico-uniforme
fisica-analise-de-forca-magnetica-em-fios-percorridos-por-correntes-continuas
fisica-inducao-eletromagnetica-lei-de-lenz
fisica-inducao-eletromagnetica-analise-da-corrente-induzida-em-geradores
fisica-fundamentos-da-optica-geometrica
fisica-reflexao-em-superficies-planas
fisica-reflexao-em-superficies-esfericas
fisica-refracao-fundamentos-leis-e-aplicacoes
fisica-lentes-esfericas-estudo-grafico
fisica-estudo-analitico-das-lentes-esfericas
fisica-equacao-do-fabricante-de-lentes-e-associacao-de-lentes
fisica-optica-da-visao
fisica-microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas
fisica-conceitos-basicos
fisica-equacao-fundamental-da-ondulatoria
fisica-ondulatoria-ondas-eletromagneticas
fisica-ondulatoria-som-e-suas-propriedades
fisica-intensidade-sonora
fisica-reflexao-eco-reverberacao-e-refracao-de-ondas
fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas
fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia
fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento
fisica-um-caso-particular-de-interferencia-onda-estacionaria
fisica-ondas-estacionarias-em-cordas
fisica-ondas-estacionarias-em-tubos
fisica-efeito-doppler-descricao-e-estudo-quantitativo
fisica-nocoes-basicas-de-fisica-quantica
```

Somando Parte A (42) e Parte B (43): 85 capítulos de Física, sem sobreposição
e sem lacuna de cobertura na atribuição de família/lacuna. `fisica.ts` continua
com `fisica: SceneEntry[] = []` — a escrita efetiva das cenas (SceneEntry) para
os 3 capítulos com família atribuída nesta Parte B (mais os 11 da Parte A) fica
para uma dispatch de escrita de dados subsequente.
