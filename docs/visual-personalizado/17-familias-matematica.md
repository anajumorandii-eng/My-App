# Famílias de cena — Matemática (Parte A: capítulos 1-41; Parte B: capítulos 42-83)

Este documento cobre apenas a primeira metade dos 83 capítulos de Matemática em
`src/data/deepSummaryContent.json` (subject === "Matemática"), na ordem de aparição
nesse arquivo (que é ordem alfabética por `topic`, não a ordem do currículo). Uma
segunda dispatch cobre os capítulos 42 a 83 e adiciona a "Parte B" a este mesmo
documento, sem repetir nenhum `chapterId` já coberto aqui.

Uma tentativa anterior de inventariar os 83 capítulos de uma vez foi autobloqueada
por risco de fabricação — a divisão em duas dispatches existe para isolar o volume
de leitura por execução e permitir verificação de citação literal em cada metade
separadamente.

## Como o mapeamento de chapterId foi feito

`deepSummaryContent.json` não tem `chapterId`; tem apenas `topic` (título em
português). O `chapterId` real usado pelo app vem de `src/data/summaryCurriculum.ts`
(seção `subject: "Matemática"`), casando `topic` com `title` byte-a-byte e prefixando
`summary-` ao `id` do currículo (ex.: `topic: "Potências e Radicais"` →
`id: "matematica-potencias-e-radicais"` → `chapterId:
"summary-matematica-potencias-e-radicais"`). Os 41 casamentos desta metade foram
verificados programaticamente (script de correspondência exata de título, sem
correspondência aproximada) — todos os 41 casaram sem ambiguidade.

## Nota sobre `topicExperiments`

`summary-matematica-potencias-e-radicais` (capítulo 57, fora desta metade — Parte B)
já tem experiência interativa própria (`powers`) em
`src/views/topic-experiments/catalog.ts`, no mesmo padrão da nota já usada em
Filosofia (`myth`) e Geografia (`coordinates`). Registrado aqui para que a Parte B
não o duplique como lacuna comum sem essa observação.

## Resultado desta metade: 0 capítulos com família, 41 lacunas

Os 41 capítulos desta metade são, sem excepção, conteúdo procedimental de
Matemática do ensino médio: fórmulas, algoritmos de cálculo, definições e exercícios
resolvidos passo a passo ("Pratique e confira"). Nenhum sustentou, com citação
literal real, nenhuma das oito famílias de `src/views/topic-scenes/types.ts`
(`contraste-de-posicoes`, `escala-de-graus`, `cadeia-de-derivacao`,
`camadas-de-determinacao`, `movimento-dialetico`, `tipologia`,
`criterios-conjuntivos`, `grade-de-eixos`). Cada capítulo foi lido por inteiro (todas
as seções, incluindo "Pegadinhas frequentes" e "Pratique e confira") e testado contra
as oito famílias antes de ser declarado lacuna — nenhuma lacuna foi declarada apenas
por não sustentar a família mais "óbvia" a priori.

Contagem por família nesta metade:

- `contraste-de-posicoes`: 0
- `escala-de-graus`: 0
- `cadeia-de-derivacao`: 0
- `camadas-de-determinacao`: 0
- `movimento-dialetico`: 0
- `tipologia`: 0
- `criterios-conjuntivos`: 0
- `grade-de-eixos`: 0
- **Lacunas: 41**

Taxa de lacuna desta metade: 100% (41/41) — mais alta que qualquer fase anterior
(Geografia teve 59%). Isso não é um artefato de leitura apressada: a maioria dos
capítulos de Matemática do ensino médio é estruturalmente procedimental (uma fórmula,
um algoritmo, uma definição, aplicados em exercícios), um tipo de conteúdo que as oito
famílias — desenhadas originalmente para capturar estruturas de argumento e
classificação de Filosofia, Geografia, Sociologia e História — não foram desenhadas
para representar. Ver "Candidatos considerados e descartados" abaixo para os casos
que mais se aproximaram de sustentar uma família, e por que cada um foi rejeitado.

## Candidatos considerados e descartados

Estes são os capítulos que mais se aproximaram de sustentar uma família — registrados
aqui em detalhe para que revisões futuras (ou a Parte B, ao encontrar um padrão
estrutural equivalente) não precisem repetir a mesma análise do zero.

- **`summary-matematica-discussao-de-sistemas-lineares`** — candidato a `tipologia`
  por ter guarda-chuva explícito: *"Um sistema de equações lineares admite exatamente
  três desfechos possíveis, e nenhum outro: determinado..., indeterminado... ou
  impossível..."*. Descartado porque os três desfechos são estados **mutuamente
  exclusivos** de um único sistema dado (um sistema é exatamente um dos três, nunca
  dois), diferente do padrão aceito em Geografia (`tipologia`), onde os tipos
  **coexistem** como instâncias reais e simultâneas (biomas coexistindo no território,
  modais de transporte coexistindo na malha). Também não sustenta
  `criterios-conjuntivos` (não há uma condição que precise ser reunida para definir um
  fenômeno) nem `cadeia-de-derivacao` (o critério do determinante é aplicado de uma vez,
  não em elos causais sucessivos entre eventos distintos).

- **`summary-matematica-introducao-ao-estudo-analitico-das-conicas`** — candidato a
  `tipologia` por ter guarda-chuva de origem geométrica comum: *"As três cônicas
  principais — elipse, hipérbole e parábola — recebem esse nome coletivo por serem
  todas obtidas geometricamente como a interseção de um plano com um cone duplo
  infinito..."*. Descartado porque, a partir daí, a fonte trata as três cônicas por
  definições de distância mutuamente exclusivas por construção (soma constante de
  distâncias a dois focos vs. diferença constante vs. equidistância a um único foco e
  uma diretriz) e resolve tudo por fórmula reduzida — não há convite da fonte a
  reconhecer casos reais que misturem tipos, nem uma `nota` de honestidade equivalente
  à que sustenta `tipologia` em Geografia/Filosofia. Anotado para reconsideração futura
  caso outro capítulo do currículo (fora desta metade) trate essas três curvas de forma
  mais claramente tipológica.

- **`summary-matematica-equacoes-do-2-grau`** e
  **`summary-matematica-lugar-geometrico-e-equacao-da-circunferencia`** — ambos têm
  uma classificação em três casos por sinal de uma grandeza (Δ>0/=0/<0; k>0/=0/<0).
  Mesmo padrão do item anterior sobre Sistemas Lineares: são estados mutuamente
  exclusivos de uma classificação, não tipos coexistentes nem critérios conjuntivos.

- **`summary-matematica-funcoes-bijetoras`** — candidato a `criterios-conjuntivos`
  porque bijetora exige injetora **e** sobrejetora simultaneamente. Descartado porque
  essa é a própria definição composta do conceito matemático sendo apresentado (não
  uma condição empírica sobre um fenômeno externo cuja necessidade conjunta a fonte
  "descobre" e declara, como em Geografia com fatores climáticos ou migratórios) — o
  componente `CriteriosConjuntivos` foi desenhado para condições que definem um
  fenômeno (filosófico, causal, histórico), e usá-lo para uma definição matemática
  puramente lógica forçaria uma leitura que a fonte não pede.

- **`summary-matematica-a-geometria-metrica-plana`** e vários outros capítulos com
  seção "De onde ela vem" ou "Dedução" (ex.: `a-relacao-fundamental-da-trigonometria`,
  `lugar-geometrico-e-equacao-da-circunferencia`) — candidatos a `cadeia-de-derivacao`
  porque derivam uma fórmula a partir de um fato anterior. Descartados porque
  `cadeia-de-derivacao`, pelo padrão fixado em Geografia, exige elos causais
  **instrumentais entre eventos ou etapas distintas** ("transforma em", "torna",
  "força") que o usuário navega um a um — aqui há uma prova geométrica ou algébrica
  única e contínua de um único fato (ex.: Pitágoras no círculo trigonométrico → relação
  fundamental), sem uma sequência de vários elos narrativamente distintos que a cena de
  cadeia (com seu "elo 1 de N", tipicamente N≥3) representaria de forma honesta. Forçar
  esses casos em `cadeia-de-derivacao` fabricaria uma estrutura de "elos" onde a fonte
  tem uma dedução matemática única.

## Lacunas desta metade (41 capítulos, motivo específico por capítulo)

Ver `matematicaSemCena` em `src/views/topic-scenes/data/matematica.ts` para a lista
completa com motivo específico por capítulo (não genérico) — reproduzida aqui pelos
41 `chapterId`s, na mesma ordem de aparição no JSON:

1. `summary-matematica-a-geometria-metrica-plana`
2. `summary-matematica-a-geometria-da-proporcionalidade`
3. `summary-matematica-a-geometria-dos-numeros-complexos`
4. `summary-matematica-a-relacao-fundamental-da-trigonometria`
5. `summary-matematica-a-trigonometria-dos-numeros-reais`
6. `summary-matematica-composicao-de-funcoes`
7. `summary-matematica-cubos-e-paralelepipedos`
8. `summary-matematica-desigualdades`
9. `summary-matematica-determinantes`
10. `summary-matematica-discussao-de-sistemas-lineares`
11. `summary-matematica-distancia-entre-um-ponto-e-uma-reta`
12. `summary-matematica-equacoes-polinomiais`
13. `summary-matematica-equacoes-do-2-grau`
14. `summary-matematica-equacoes-e-funcoes-logaritmicas`
15. `summary-matematica-estatistica-descritiva`
16. `summary-matematica-estudo-analitico-da-reta`
17. `summary-matematica-estudo-do-sinal-de-funcoes`
18. `summary-matematica-eventos-disjuntos-e-eventos-independentes`
19. `summary-matematica-funcao-constante-e-funcao-afim`
20. `summary-matematica-funcao-quadratica`
21. `summary-matematica-funcoes-bijetoras`
22. `summary-matematica-funcoes-trigonometricas`
23. `summary-matematica-identificacao-de-simetrias-i`
24. `summary-matematica-identificacao-de-simetrias-ii`
25. `summary-matematica-igualdades`
26. `summary-matematica-introducao-ao-estudo-analitico-das-conicas`
27. `summary-matematica-introducao-ao-modelo-exponencial`
28. `summary-matematica-introducao-aos-logaritmos`
29. `summary-matematica-introducao-a-geometria-analitica`
30. `summary-matematica-introducao-a-geometria-plana`
31. `summary-matematica-introducao-a-teoria-dos-numeros-inteiros`
32. `summary-matematica-introducao-as-funcoes`
33. `mat-probabilidade-contagem` (id real do catálogo `interactiveSummaries` para
    "Introdução às Probabilidades" — corrigido pela Parte B; o id derivado
    mecanicamente, `summary-matematica-introducao-as-probabilidades`, não existe no
    catálogo real porque este capítulo específico é definido à mão em
    `expandedInteractiveSummaries.ts` com um id próprio, em vez de vir do pipeline
    `applyDeepSummary` com prefixo `summary-`)
34. `summary-matematica-introducao-as-sequencias`
35. `summary-matematica-introducao-as-tecnicas-de-contagem`
36. `summary-matematica-inversao-de-funcoes`
37. `summary-matematica-lugar-geometrico-e-equacao-da-circunferencia`
38. `summary-matematica-modelagem-algebrica-de-problemas-i`
39. `summary-matematica-modelagem-algebrica-de-problemas-ii`
40. `summary-matematica-modelagem-exponencial-de-problemas`
41. `summary-matematica-multiplicacao-de-matrizes`

## Nota para a Parte B (capítulos 42-83)

A leitura completa dos capítulos 1-41 sugere que a taxa de lacuna em Matemática será
estruturalmente alta em toda a disciplina, não apenas nesta metade — o conteúdo é
dominado por Geometria Plana/Espacial, Álgebra e Probabilidade/Estatística
procedimentais. Ainda assim, a Parte B deve varrer as oito famílias em cada capítulo
independentemente desta observação, sem assumir de antemão que também será 100%
lacuna — os capítulos 42-83 incluem áreas como Progressão Aritmética/Geométrica
("Progressão" sugere possível `escala-de-graus` se a fonte apresentar graus nomeados
ordenados, a verificar), Polinômios, Triângulos e Trigonometria, ainda não lidos por
esta dispatch. Os candidatos descartados na seção acima (sistemas de casos mutuamente
exclusivos, definições compostas, deduções únicas) são o padrão mais provável de
"quase-família" a reencontrar na Parte B — usar o mesmo critério de rejeição.

---

# Parte B — capítulos 42 a 83

Esta seção cobre os 42 capítulos restantes de Matemática, obtidos filtrando
`src/data/deepSummaryContent.json` (subject === "Matemática") pelos `topic` cujo
`chapterId` correspondente (via `src/data/summaryCurriculum.ts`) **não** está entre
os 41 já listados na Parte A. Nenhum dos 42 `chapterId` abaixo repete um `chapterId`
da Parte A — verificado programaticamente por interseção de conjuntos antes da
leitura.

Cada um dos 42 capítulos foi lido por inteiro (todas as seções: explicação
conceitual, "Pegadinhas frequentes" e "Pratique e confira") e testado contra as
oito famílias de `src/views/topic-scenes/types.ts`, com o mesmo rigor calibrado
pela Parte A: um candidato só sustenta uma família com citação literal direta do
JSON, nunca com paráfrase ou extrapolação.

## Resultado desta metade: 0 capítulos com família, 42 lacunas

Contagem por família nesta metade:

- `contraste-de-posicoes`: 0
- `escala-de-graus`: 0
- `cadeia-de-derivacao`: 0
- `camadas-de-determinacao`: 0
- `movimento-dialetico`: 0
- `tipologia`: 0
- `criterios-conjuntivos`: 0
- `grade-de-eixos`: 0
- **Lacunas: 42**

Taxa de lacuna desta metade: 100% (42/42) — confirma a previsão feita ao final da
Parte A. Os 42 capítulos cobrem Aritmética/Proporcionalidade, Sequências (PA/PG),
Análise Combinatória, Probabilidade, Geometria Plana (ângulos, áreas, semelhança,
trigonometria), Geometria Espacial (prismas, pirâmides, sólidos de revolução),
Geometria Analítica (posições relativas de retas e de reta-circunferência,
inequações) e Álgebra (técnicas algébricas, transformações de gráficos, módulo,
complexos, polinômios) — nenhum, apesar da maior diversidade temática em relação à
Parte A, sustentou nenhuma das oito famílias com citação literal.

## Candidatos considerados e descartados

- **`summary-matematica-angulos-em-triangulos`** — candidato a `grade-de-eixos`
  por ter dois esquemas de classificação simultâneos: *"Triângulos se classificam
  por seus lados (equilátero, com os três lados iguais; isósceles, com exatamente
  dois lados iguais; escaleno, com todos os três lados diferentes entre si) e por
  seus ângulos (acutângulo... retângulo... obtusângulo...)"*. Descartado porque
  `grade-de-eixos` exige que os dois eixos se **cruzem**, formando células com
  itens posicionados em polos específicos de ambos os eixos simultaneamente — a
  fonte apresenta os dois esquemas em paralelo, nunca cruzando um triângulo
  específico em ambas as classificações ao mesmo tempo como célula da grade (não
  há, por exemplo, "triângulo escaleno-obtusângulo" tratado como uma célula
  distinta com conteúdo próprio). São dois critérios de classificação
  independentes, não uma grade.

- **`summary-matematica-semelhanca-de-triangulos`** — candidato a
  `criterios-conjuntivos` por ter três critérios nomeados (AA, LAL, LLL) para
  provar semelhança. Descartado porque a fonte os apresenta como alternativas
  **suficientes e independentes** — *"critérios mais econômicos e suficientes
  bastam"* — qualquer um dos três, isoladamente, já basta para provar semelhança.
  `criterios-conjuntivos` exige o oposto: condições que precisam ser **reunidas
  simultaneamente** (uma necessidade declarada de "E", não "OU"). Esse é
  exatamente o padrão de "critérios alternativos, não conjuntivos" já descartado
  na Parte A para os critérios de congruência.

- **`summary-matematica-o-universo-tridimensional`** — candidato a `tipologia`
  por ter um guarda-chuva explícito de três posições relativas entre retas no
  espaço: *"duas retas no espaço podem ser paralelas..., concorrentes... ou
  reversas..."*. Descartado pelo mesmo motivo já estabelecido na Parte A para
  `summary-matematica-discussao-de-sistemas-lineares`: duas retas específicas
  dadas ocupam **exatamente uma** dessas três posições, nunca coexistem em mais
  de uma simultaneamente — é classificação mutuamente exclusiva por critério
  geométrico, não tipos que coexistem como instâncias reais e simultâneas no
  mesmo território (o padrão aceito em Geografia).

- **`summary-matematica-posicoes-relativas-entre-duas-retas`** e
  **`summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia`** —
  mesmo padrão do candidato acima: paralelas/coincidentes/concorrentes, e
  secante/tangente/externa, são cada uma um conjunto de estados mutuamente
  exclusivos verificados por um único critério algébrico (comparação de
  coeficientes angulares; comparação de distância com raio, ou sinal do
  discriminante), não tipos coexistentes.

- **`summary-matematica-solidos-de-revolucao`** — candidato a `tipologia` por
  apresentar cilindro, cone e esfera com um guarda-chuva comum: *"Um sólido de
  revolução nasce da rotação completa de uma figura plana em torno de um eixo
  fixo..."*, com os três sólidos como instâncias desse princípio. Descartado
  porque, embora os três sólidos genuinamente coexistam (não são mutuamente
  exclusivos), a fonte não os trata como uma tipologia com nuance própria por
  tipo — são três exemplos de uma mesma construção geométrica, cada um seguido
  imediatamente por sua fórmula de volume/área, sem contraste qualitativo entre
  os tipos além de "gerados de formas planas diferentes". A estrutura textual é
  de definição unificadora seguida de aplicação de fórmula, não de tipologia
  explorada por si mesma.

- **`summary-matematica-medias`** — candidato a `escala-de-graus` pelo motivo
  errado: média aritmética, média ponderada e média harmônica não formam uma
  escala ordenada de graus nomeados sobre um mesmo eixo conceitual — são fórmulas
  alternativas, cada uma apropriada a um contexto de dados diferente (pesos
  iguais, pesos diferentes, razões como velocidade), sem relação de "mais/menos"
  entre si que uma escala exigiria.

## Lista completa dos 42 capítulos desta metade (todos lacuna)

1. `summary-matematica-potencias-e-radicais`
2. `summary-matematica-razao-e-proporcao`
3. `summary-matematica-porcentagem`
4. `summary-matematica-o-sistema-de-numeracao-decimal`
5. `summary-matematica-progressao-aritmetica`
6. `summary-matematica-progressao-geometrica`
7. `summary-matematica-sequencias`
8. `summary-matematica-sistemas-de-equacoes`
9. `summary-matematica-tabelas-e-matrizes`
10. `summary-matematica-medias`
11. `summary-matematica-o-problema-da-fila`
12. `summary-matematica-o-problema-do-grupo`
13. `summary-matematica-tecnicas-de-contagem`
14. `summary-matematica-operacoes-com-probabilidades`
15. `summary-matematica-angulos-em-triangulos`
16. `summary-matematica-angulos-em-poligonos`
17. `summary-matematica-angulos-e-circunferencias`
18. `summary-matematica-simetrias-e-congruencias`
19. `summary-matematica-semelhanca-de-triangulos`
20. `summary-matematica-o-ponto-medio-e-o-baricentro-de-um-triangulo`
21. `summary-matematica-triangulo-retangulo`
22. `summary-matematica-areas-de-poligonos`
23. `summary-matematica-area-do-circulo-e-de-suas-partes`
24. `summary-matematica-razoes-entre-areas-de-figuras-planas`
25. `summary-matematica-areas-de-figuras-planas`
26. `summary-matematica-trigonometria-no-triangulo-retangulo`
27. `summary-matematica-relacoes-trigonometricas-em-poligonos`
28. `summary-matematica-outras-razoes-trigonometricas`
29. `summary-matematica-transformacoes-trigonometricas`
30. `summary-matematica-o-universo-tridimensional`
31. `summary-matematica-prismas`
32. `summary-matematica-piramides`
33. `summary-matematica-solidos-de-revolucao`
34. `summary-matematica-razoes-entre-volumes-de-solidos`
35. `summary-matematica-posicoes-relativas-entre-duas-retas`
36. `summary-matematica-posicoes-relativas-entre-uma-reta-e-uma-circunferencia`
37. `summary-matematica-representacao-geometrica-de-inequacoes`
38. `summary-matematica-tecnicas-algebricas`
39. `summary-matematica-transformacoes-em-graficos-de-funcoes`
40. `summary-matematica-modulo-de-um-numero-real`
41. `summary-matematica-numeros-complexos`
42. `summary-matematica-polinomios`

## Resultado consolidado (Parte A + Parte B): 0 capítulos com família, 83 lacunas

Somando as duas metades, os 83 capítulos de Matemática têm taxa de lacuna de 100%
(83/83). Nenhum capítulo de Matemática sustentou, com citação literal, nenhuma das
oito famílias de cena. Isso não indica falha de leitura — decorre da natureza
estruturalmente procedimental do conteúdo de Matemática do ensino médio neste
material (fórmulas, algoritmos, definições e exercícios resolvidos), um tipo de
conteúdo diferente do que as oito famílias foram desenhadas para representar
(estruturas de argumento, contraste de posições, tipologias com guarda-chuva,
cadeias de determinação). `matematica: SceneEntry[]` permanece vazio;
`matematicaSemCena` cobre os 83 capítulos com motivo específico cada.
