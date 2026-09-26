# Auditoria geral — Matemática (83 capítulos)

Data: 26/09/2026. Método: leitura de código de todos os engines de Matemática
(`visual-boards` e `visual-instruments`), varredura automática dos 83
capítulos a 390px (erro de página, rolagem lateral), e amostragem no
navegador (Chromium 1194, 1440 claro / 390 escuro) de 30 capítulos cobrindo
todos os 16 engines. Capturas em
`docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/matematica/`
(40 PNGs). Nada em `src/` foi alterado.

## 1. Resumo

### Implementação posterior à auditoria

Os sete capítulos classificados para redesenho receberam mecanismos específicos:
probabilidade com grade de pares ordenados, trigonometria com triângulo retângulo,
razão com grupos em duas escalas, porcentagem com grade centesimal, sistema decimal
com colunas posicionais, inteiros com decomposição na reta numérica e médias com
unidades de peso e deslocamento da média.

Verificação da segunda entrega: tipos e build passaram; 709 testes de interface
passaram. A conferência visual no navegador e a aprovação editorial continuam
pendentes. Os cinco ajustes indicados na auditoria abaixo ainda não foram concluídos.
Os vereditos originais foram preservados como registro da auditoria.

Varredura automática (83/83): **nenhum erro de página, nenhuma rolagem
lateral a 390px** em nenhum capítulo. `scan-mat-out.txt` (scratchpad) tem o
detalhe; os quatro "hasSvg:false" reportados no primeiro passe eram falso
positivo do meu seletor com espera curta (confirmado por captura manual com
mais espera — `determinantes` e `multiplicacao-de-matrizes` renderizam bem).

Veredito por capítulo (contagem):

| Veredito | Capítulos |
| --- | --- |
| Manter | 71 |
| Ajustar | 5 |
| Redesenhar | 7 |

Por engine (16 engines, 83 capítulos):

| Engine | Capítulos | Veredito predominante |
| --- | --- | --- |
| CartesianBoard (curveFamilies) | 13 | Manter (10) / Ajustar (3: título e mecanismo não batem com o capítulo) |
| RBoard (remainingMath) | 11 | Manter |
| PlanarGeometryBoard | 9 | Manter |
| AnalyticBoard | 9 | Manter (6) / Ajustar (3: mesma config "dois-pontos" sem pivô específico por capítulo) |
| AreaGeometryBoard | 6 | Manter |
| AlgebraBoard | 6 | Manter |
| QuantitiesBoard | 5 | **Redesenhar (5/5)** — cena genérica (barra de preenchimento) para cinco mecanismos distintos |
| MatrixBoard | 5 | Manter |
| SolidBoard | 5 | Manter |
| CountingBoard | 3 | Manter (2) / **Redesenhar (1)** — prancha errada para o capítulo |
| TrigCircleBoard | 3 | Manter (2) / **Redesenhar (1)** — prancha errada para o capítulo |
| ProgressionBoard | 2 | Manter |
| SequenceBoard | 2 | Manter |
| powers (experimento) | 1 | Manter |
| QuadraticBoard | 1 | Manter |
| ExponentialBoard | 1 | Manter |
| LogarithmBoard | 1 | Manter |

**5 achados principais** (ver seção 4 para todos):
1. `mat-probabilidade-contagem` ("Contagem sistemática e probabilidade", que é
   sobre Laplace, união/interseção, condicional/Bayes) abre a prancha
   "Arranjo ou combinação" — assunto que o capítulo nem menciona. Casamento
   de palavra-chave errado (`contagem`), não cena emprestada por preguiça,
   mas o efeito na tela é o mesmo erro.
2. `summary-matematica-trigonometria-no-triangulo-retangulo` (triângulo
   retângulo genérico, sem raio 1) abre o "Círculo trigonométrico" (raio =
   1, sen²+cos²=1) — cena certa para os outros dois capítulos de
   trigonometria, errada para este.
3. As 5 capítulos de `QuantitiesBoard` (razão, porcentagem, sistema decimal,
   números inteiros, médias) renderizam a mesma barra de preenchimento com
   um número — nenhum mostra o mecanismo (razão como comparação, posição
   decimal, divisão euclidiana, peso na média).
4. Três capítulos de `CartesianBoard` (Inversão de Funções, Estudo do Sinal
   de Funções, Transformações em Gráficos de Funções) reaproveitam a família
   `quadratica`/`logaritmica` de outro capítulo e mostram o **título errado**
   na tela (ex.: "Inversão de Funções" abre um board chamado "Função
   logarítmica"), sem desenhar a relação central do próprio capítulo
   (reflexão em y=x; regiões de sinal).
5. Comentário em `src/views/visual-instruments/registry.ts:98` afirma que
   "Determinantes" não recebe instrumento — falso hoje: `registry.ts:264`
   mapeia `determinantes` para `MatrixInstrument`, testado e funcionando
   (captura confirma). Documentação desatualizada num arquivo que a própria
   CLAUDE.md cita como fonte da verdade do inventário.

## 2. Por engine

### CartesianBoard — `src/views/visual-instruments/CartesianInstrument.tsx` + `src/lib/curveFamilies.ts`
Desenha de fato uma curva paramétrica com controles deslizantes — não é
estrutura vazia. Título e subtítulo vêm de `family.name`/`family.question`
(`CartesianInstrument.tsx:218-219`), fixos por família, não por capítulo.
Isso funciona quando 1 família = 1 capítulo (10 dos 13 casos), mas falha
quando 2-3 capítulos dividem a família:
- `registry.ts:196-198`: `funcao-quadratica`, `estudo-do-sinal` e
  `transformacoes-graficos` usam todos `'quadratica'`. Só o primeiro é
  fielmente "Função Quadrática"; os outros dois abrem um board chamado
  "Função quadrática" que não modela sinal (sem sombreamento de intervalos)
  nem transformação horizontal/reflexão (só há sliders de concavidade `a` e
  altura do vértice `c` — nenhum desloca ou espelha a parábola).
- `registry.ts:199-201`: `funcoes-logaritmicas` e `inversao-funcoes` usam
  `'logaritmica'`. Bom para o primeiro; para "Inversão de Funções" abre
  "Função logarítmica" e nunca desenha a reta y=x nem a curva espelhada —
  exatamente o que o próprio texto do capítulo explica no card "Simetria dos
  gráficos" (ver captura `matematica-inversao-de-funcoes-1440-light.png`).
**Capítulos afetados**: `summary-matematica-inversao-de-funcoes`,
`summary-matematica-estudo-do-sinal-de-funcoes`,
`summary-matematica-transformacoes-em-graficos-de-funcoes` → **ajustar**
(dar título e um segundo controle — deslocamento/sinal — específicos por
capítulo, ou aceitar o compartilhamento e trocar apenas o título/pivô como já
acontece em RBoard).

### RBoard — `src/views/visual-instruments/RemainingMathInstrument.tsx` + `src/lib/remainingMath.ts`
Apesar do nome "remaining" (resto do que faltava cobrir), cada um dos 11 ids
desenha uma cena própria (árvore de conjuntos, Venn, histograma, lei dos
senos, retas no espaço, corte de cone, caixas de composição, mapa de
bijeção) e o título/pergunta muda por id. Boa amostragem confirmou fidelidade
em `o-problema-da-fila`, `introducao-ao-estudo-analitico-das-conicas` e
`funcoes-bijetoras`. **Manter** os 11.

### PlanarGeometryBoard / AreaGeometryBoard / MatrixBoard / SolidBoard / AlgebraBoard
Todos seguem o mesmo padrão saudável: 1 config por capítulo (checado nas
funções `geometriaPlana`, `medidaPlana`, `matriz`, `solido`, `algebra` do
registry), cada `Scene` com um `if (id === ...)` desenhando um objeto
diferente (ângulos, círculo, matriz em colchetes, sólido, balança/reta
numérica/região de inequação). Amostra em 1440/390, claro/escuro, sem
vazamento nem colisão visível. **Manter** os 31 capítulos somados.

### AnalyticBoard — `src/views/visual-instruments/AnalyticInstrument.tsx` + `src/lib/analyticPlane.ts`
Instrumento com ponto arrastável — interação genuína, não estática. Mas a
config `'dois-pontos'` (`analyticPlane.ts:171-190`) é reaproveitada por três
capítulos (`registry.ts:210-212`: "Introdução à Geometria Analítica",
"Ponto Médio e Baricentro", "Estudo Analítico da Reta") com **o mesmo
título fixo** ("Dois pontos no plano") e **o mesmo pivô fixo**
(coeficiente angular). Para o capítulo de ponto médio, o pivô correto seria
o ponto médio — que aparece só como leitura secundária, nunca em destaque.
**Ajustar**: os três capítulos renderizam sem erro e com conteúdo
relacionado, mas o destaque (pivô/condição) não muda com o capítulo. `numeros-complexos`
e `a-geometria-dos-numeros-complexos` também dividem a config `'complexo'` —
aceitável (mesmo objeto: plano de Argand), não sinalizado como problema.

### QuantitiesBoard — `src/views/visual-instruments/QuantitiesInstrument.tsx:2` + `src/lib/quantitiesLab.ts:5-9`
**Redesenhar os 5.** A `Scene` inteira é uma barra horizontal que preenche
uma largura calculada por fórmulas diferentes por id, mas sem nenhuma outra
geometria — nenhum agrupamento, nenhuma régua, nenhuma casa decimal
desenhada. Capturado em `matematica-introducao-a-teoria-dos-numeros-inteiros-1440-light.png`:
o capítulo é sobre divisão euclidiana (a = 7q+r), e a cena é uma barrinha
com o texto "resto 2" — não mostra a divisão em grupos de 7 nem por que o
resto é limitado. Mesma barra, textos e fórmulas diferentes, para razão,
porcentagem, base decimal e média ponderada — é o "mesmo desenho, texto
trocado" que o brief pede para caçar.
**Capítulos**: `razao-e-proporcao`, `porcentagem`,
`o-sistema-de-numeracao-decimal`, `introducao-a-teoria-dos-numeros-inteiros`,
`medias`.

### CountingBoard — `src/views/visual-boards/CountingBoard.tsx` + `registry.ts:250-253` (keyword `'contagem'`)
Board autoral bem feito (árvore de arranjo/combinação, risca duplicatas) mas
casa por palavra-chave com 3 capítulos:
- `introducao-as-tecnicas-de-contagem` e `tecnicas-de-contagem`: par
  intro/aprofundado do MESMO fenômeno (arranjo vs. combinação) — **manter**,
  reúso legítimo.
- `mat-probabilidade-contagem` ("Contagem sistemática e probabilidade"): o
  capítulo, pelas 5 seções lidas (`Medir chance em um modelo`, `União,
  interseção e complemento`, `Condicional e independência`, `Erros
  recorrentes`, `Pratique e confira`), é sobre **probabilidade de Laplace**,
  não sobre arranjo/combinação — o board mostra "Arranjo ou combinação" e o
  card de diagnóstico mostra "Calcula o complemento de nenhuma cara" (sobre
  probabilidade!), uma desconexão visível na mesma tela. Ver
  `mat-probabilidade-contagem-1440-light.png`. **Redesenhar** (ou ao menos
  religar para um instrumento de probabilidade — `RBoard` já tem `prob` e
  `eventos`, mais próximos do conteúdo real).

### TrigCircleBoard — `src/views/visual-boards/TrigCircleBoard.tsx` + `registry.ts:132-135` (keyword `'trigonometria'`)
Board estático (sem branch por capítulo) que ilustra bem a **relação
fundamental** (sen²+cos²=1, raio 1). Casa com 3 capítulos:
- `a-relacao-fundamental-da-trigonometria`: fit perfeito, é exatamente esse
  conteúdo.
- `a-trigonometria-dos-numeros-reais`: fit bom (extensão de sen/cos via
  círculo unitário para qualquer real) — confirmado em captura.
- `trigonometria-no-triangulo-retangulo`: **não fit**. Esse capítulo é sobre
  razões num triângulo retângulo *qualquer* (cateto oposto/adjacente/
  hipotenusa, sem hipotenusa=1), problemas de altura e o teste
  oposto-vs-adjacente — nada disso aparece no board, que mostra um círculo
  de raio 1 com título "Círculo trigonométrico". Ver
  `matematica-trigonometria-no-triangulo-retangulo-1440-light.png`: o board
  e a leitura guiada logo abaixo falam de coisas diferentes.
**Redesenhar** só este capítulo (ou dar-lhe uma cena própria de triângulo
com catetos/hipotenusa rotulados).

### ProgressionBoard / SequenceBoard / powers / QuadraticBoard / ExponentialBoard / LogarithmBoard
Todos com 1-2 capítulos, conteúdo e título batendo (`ProgressionBoard` serve
"Introdução às Sequências" e "Sequências", par intro/aprofundado legítimo,
igual ao caso de contagem). **Manter** os 8.

## 3. Tabela por capítulo (os 12 fora de "manter")

| id | engine | veredito | motivo |
| --- | --- | --- | --- |
| mat-probabilidade-contagem | CountingBoard | redesenhar | prancha é sobre arranjo/combinação; capítulo é sobre probabilidade de Laplace |
| summary-matematica-trigonometria-no-triangulo-retangulo | TrigCircleBoard | redesenhar | mostra círculo unitário; capítulo é triângulo retângulo genérico |
| summary-matematica-razao-e-proporcao | QuantitiesBoard | redesenhar | barra genérica sem mecanismo de razão |
| summary-matematica-porcentagem | QuantitiesBoard | redesenhar | barra genérica sem as três formas lado a lado |
| summary-matematica-o-sistema-de-numeracao-decimal | QuantitiesBoard | redesenhar | barra genérica sem valor posicional visível |
| summary-matematica-introducao-a-teoria-dos-numeros-inteiros | QuantitiesBoard | redesenhar | barra genérica não mostra divisão euclidiana |
| summary-matematica-medias | QuantitiesBoard | redesenhar | barra genérica não mostra peso na ponderação |
| summary-matematica-inversao-de-funcoes | CartesianBoard | ajustar | título mostra "Função logarítmica"; não desenha reflexão em y=x |
| summary-matematica-estudo-do-sinal-de-funcoes | CartesianBoard | ajustar | título mostra "Função quadrática"; sem sombreamento de sinal |
| summary-matematica-transformacoes-em-graficos-de-funcoes | CartesianBoard | ajustar | título mostra "Função quadrática"; sem deslocamento horizontal nem reflexão |
| summary-matematica-introducao-a-geometria-analitica | AnalyticBoard | ajustar | pivô fixo em coeficiente angular, não no que o capítulo enfatiza |
| summary-matematica-o-ponto-medio-e-o-baricentro-de-um-triangulo | AnalyticBoard | ajustar | ponto médio é leitura secundária, nunca o pivô em destaque |
| summary-matematica-estudo-analitico-da-reta | AnalyticBoard | manter* | aqui o pivô (coeficiente angular) De fato bate com o capítulo |

\* incluído na tabela só para mostrar que dos 3 capítulos de `dois-pontos`
apenas este tem o pivô certo por coincidência de conteúdo.

Os 71 capítulos restantes: sem defeito encontrado na amostra + varredura
automática (ver lista completa em `mat-only-ids.txt` no scratchpad da sessão
para conferência).

## 4. Defeitos transversais e conteúdo sem lastro

- **Comentário desatualizado**: `src/views/visual-instruments/registry.ts:96-99`
  diz que "Determinantes" não tem instrumento e espera um "instrumento de
  matriz" — mas `registry.ts:264` já mapeia `determinantes` para
  `MatrixInstrument` (confirmado funcionando em
  `matematica-determinantes-1440-light.png`). O mesmo comentário também erra
  sobre "Prismas" (tem `SolidInstrument` desde `registry.ts:224`). Como o
  README de `.claude/skills/` e o próprio CLAUDE.md tratam esse arquivo como
  fonte de inventário, um comentário errado aqui pode levar a duplicar
  trabalho já feito ou a subestimar a cobertura real de Matemática.
- **CLAUDE.md também está desatualizado nesse ponto**: a seção "Pranchas
  manipuláveis" (linha ~93 do arquivo) lista como faltantes "plano
  analítico (9 capítulos), figura plana (~20), sólido (6), contagem e
  probabilidade (7), matriz (5) e estatística (3)" — todos esses já têm
  instrumento (`AnalyticInstrument`, `PlanarGeometryInstrument`/
  `AreaGeometryInstrument`, `SolidInstrument`, `CountingBoard`/`RBoard`,
  `MatrixInstrument`, `RBoard` para estatística descritiva). Recomendo
  atualizar essa seção numa próxima sessão de escrita (fora do escopo desta
  auditoria, que não edita `src/` nem documentação).
- **Nenhum conteúdo inventado encontrado**: por amostragem dos textos de
  `Scene`/config contra `src/data/deepSummaryContent.json`, os números e
  fórmulas batem com o resumo (ex.: divisão por 7 em "Números Inteiros",
  sen²+cos²=1 na trigonometria, det=ad-bc em Determinantes). Nenhum caso do
  padrão `ap_mat_fuvest_110` (dado fabricado para tapar buraco).
- **Nenhum erro de página nem rolagem lateral a 390px** nos 83 capítulos
  (varredura automática completa, log em
  `/tmp/.../scratchpad/scan-mat-out.txt` desta sessão).
- **Falso alarme descartado**: a barra fixa inferior de navegação
  (`BottomNav.tsx`) aparece sobre o conteúdo durante o scroll no meio da
  página — isso é comportamento normal de barra fixa (`pointer-events-none`
  na maior parte dela) e não impede leitura nem interação; ao chegar no fim
  real da página o último cartão (Diagnóstico vivo) fica visível acima da
  barra com folga. Não é o defeito de `.ni-production-main` que o CLAUDE.md
  documenta — confirmado com captura antes de reportar.

## 5. Proposta de lotes de redesenho (prioridade)

1. **`mat-probabilidade-contagem`** (1 capítulo, prioridade muito-alta no
   currículo) — dar-lhe um instrumento de probabilidade de Laplace
   (união/interseção/complemento/condicional), reaproveitando `prob` e
   `eventos` de `RBoard` como ponto de partida, ou uma cena nova. É o
   defeito mais visível de todo o grupo: prancha e texto falam de coisas
   diferentes.
2. **`trigonometria-no-triangulo-retangulo`** (1 capítulo) — cena própria de
   triângulo retângulo com cateto oposto/adjacente/hipotenusa rotulados e
   ângulo variável, ou pelo menos desacoplar do `TrigCircleBoard` estático.
3. **QuantitiesBoard, os 5 capítulos** — substituir a barra genérica por
   cinco cenas específicas: razão (comparação lado a lado), porcentagem
   (grade de 100 quadrados), sistema decimal (casas posicionais), divisão
   euclidiana (grupos de 7 com resto destacado), média ponderada (pesos
   como larguras de coluna). Lote único porque o defeito e o arquivo raiz
   (`QuantitiesInstrument.tsx`) são os mesmos para os cinco.
4. **CartesianBoard: 3 capítulos de reflexão/sinal/transformação** —
   `inversao-de-funcoes` precisa da reta y=x e da curva espelhada;
   `estudo-do-sinal-de-funcoes` precisa de sombreamento de intervalos
   positivo/negativo; `transformacoes-em-graficos-de-funcoes` precisa de um
   controle de deslocamento horizontal e um de reflexão, além de título
   próprio. Podem sair de `cartesianInstrument` com uma variante de
   apresentação (título/controles por capítulo) em vez de reescrita total.
5. **AnalyticBoard: `introducao-a-geometria-analitica` e `ponto-medio-e-
   baricentro`** — menor prioridade (não há erro visível, só ênfase
   deslocada): ajustar qual leitura vira `pivot` conforme o capítulo, sem
   mudar a cena em si.
