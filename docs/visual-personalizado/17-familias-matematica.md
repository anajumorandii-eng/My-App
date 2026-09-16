# Famílias de cena — Matemática (Parte A — capítulos 1 a 41)

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
33. `summary-matematica-introducao-as-probabilidades`
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
