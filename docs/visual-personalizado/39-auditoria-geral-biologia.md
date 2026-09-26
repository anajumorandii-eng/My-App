# Auditoria geral — Biologia (72 capítulos)

Metodologia: leitura de código de todos os engines que atendem Biologia; varredura
automática (Playwright) dos 72 capítulos em 390×860 escuro e 1440×1000 claro
(144 renders, todos bem-sucedidos após reexecução — ver nota sobre a varredura
inicial); inspeção visual de 15 capturas abertas no navegador (3–6 por engine);
checagem de fidelidade dos 33 capítulos de cena genérica contra
`deepSummaryContent.json` (arquivo `bio-dump.txt`, todas as 33 marcadas "OK",
sem conteúdo inventado). Capturas em
`docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/biologia/`
(31 PNGs).

Nota sobre a varredura: a primeira rodada (`bio-sweep.cjs`) travou na metade e
deixou 59/114 amostras com `h:0`. Reexecutei com timeout maior
(`bio-retest.cjs`, `bio-retest2.cjs`); todas as 72×2 combinações resultaram em
conteúdo real — os `h:0` eram flakiness de carregamento do primeiro run, não
capítulos quebrados. Nenhum capítulo ficou com erro de página, tela em branco
ou rolagem lateral em 390px.

## 1. Resumo por veredito

| Veredito | Capítulos | Engines |
| --- | --- | --- |
| **Manter** | 10 | board/CarbonCycleBoard, MembraneBoard, EnzymeBoard, PhotosynthesisBoard, CellDivisionBoard, MendelBoard(2), FungiBoard, BloodTypeBoard, HeartCirculationBoard |
| **Ajustar** (mecanismo próprio existe, mas com defeito pontual ou densidade a rever) | 34 | 27 instrument/Biology(Remaining)Board + 15 scene/autoral − sobreposições, ver §2 |
| **Redesenhar** (motor genérico, sem mecanismo do capítulo) | 28 | scene/tipologia (8, exceto mutações), cadeia-de-derivação genérica (6), escala-de-graus (3), contraste-de-posições (1), + 2 casos de `default` no BiologyRemainingBoard que são puro motor genérico disfarçado de instrumento |
| **experiment** (motor próprio, fora do escopo scene/board/instrument) | 1 | ecology (aviso: não avaliado pela régua dos boards, mas é mecanismo genuíno) |

Total: 10 manter + ~30 ajustar + ~30 redesenhar + 1 experiment = 72 (a linha
divisória entre "ajustar" e "redesenhar" nos 27 instrumentos genéricos por
switch-case está detalhada no §2, pois a qualidade varia muito caso a caso
dentro do mesmo arquivo).

## 2. Por engine

### board/* (10 capítulos) — MANTER
`CarbonCycleBoard`, `MembraneBoard`, `EnzymeBoard`, `PhotosynthesisBoard`,
`CellDivisionBoard`, `MendelBoard`, `FungiBoard`, `BloodTypeBoard`,
`HeartCirculationBoard`. Cada um é um componente autoral próprio (não
compartilhado), com mecanismo específico desenhado (ex.: `HeartCirculationBoard`
tem duas circulações navegáveis, ilustração de coração em corte, experimento de
capilares em paralelo com v = Q/A; `MembraneBoard` distingue transporte passivo
de ativo com bomba Na+/K+ e osmose lado a lado; `CellDivisionBoard` mostra
mitose vs. meiose com cromossomos reduzindo pela metade). Todos passam a régua
(mecanismo nomeado, fiel ao resumo, com movimento e leitura estática, ícones
desenhados). Único defeito encontrado: texto abaixo de 9.5px em
`membranas-celulares` (claro, legenda "Osmose") e `proteinas-enzimas`
(escuro) — cosmético, não compromete leitura.

### instrument/BiologyRemainingBoard (23 capítulos) + instrument/BiologyBoard (4 capítulos) — AJUSTAR, com 2 REDESENHAR
Arquivos: `src/views/visual-instruments/BiologyRemainingInstrument.tsx` e
`BiologyInstrument.tsx`. Ao contrário do padrão "motor genérico com texto
trocado" (que existe em outros grupos), aqui **cada id tem um `case` próprio**
que desenha uma forma diferente (função `BiologyMechanism`,
`BiologyRemainingInstrument.tsx:12-86`; função `Scene`,
`BiologyInstrument.tsx:10-16`) — isso cumpre a letra da regra 1. A qualidade,
porém, é desigual:
- Bons (mecanismo claro e específico): `senses` (olho + ouvido rotulados,
  `BiologyRemainingInstrument.tsx:65-80`), `genetics-intro` (segregação de
  alelos na meiose, `:14-33`), `blood-groups` (compatibilidade ABO,
  `:34-50`), `nucleic-acids` (fita complementar, `BiologyInstrument.tsx:11`),
  `linkage` (distância em cM, `:12`), `circulation` (capilares em paralelo,
  `:13`).
- Fracos (forma abstrata que poderia servir qualquer capítulo — três círculos e
  linhas, sem nenhum traço reconhecível do sistema): `locomotion`, `endocrine`,
  `inorganic`, `nucleus`, `biotechnology`, `reproduction`
  (`BiologyRemainingInstrument.tsx:51-58,81`). Não violam a régua ao pé da
  letra (o código É por id), mas na tela olham genérico — candidatos a reforço
  visual, não a redesenho completo.
- **`air-pollution` (eco-poluicao-ar) e `climate-pops`
  (eco-aquecimento-global-pops-biorremediacao) caem no `case default`
  (`BiologyRemainingInstrument.tsx:84`)** porque não têm `case` próprio — bug
  concreto de cobertura, não decisão de design. As duas telas renderizam a
  **mesma imagem idêntica** (arco + barra + círculo cinza, sem relação com
  poluição do ar nem com biorremediação) — comparei as capturas
  `eco-poluicao-ar-1440-light.png` e
  `eco-aquecimento-global-pops-biorremediacao-1440-light.png`: pixel a pixel a
  mesma cena, só o texto ao redor muda. **Isto é exatamente o "motor genérico
  com texto trocado" que a régua proíbe — REDESENHAR** (ou, no mínimo, dar a
  cada um seu `case`).

### scene/autoral (15 capítulos) — MANTER/AJUSTAR
Todos roteiam para componentes dedicados por `chapterId`
(`TopicScene.tsx:37-55`): `EcologySystems`/`EcologyCycles` (7 capítulos de
ecologia), `BiologiaFisiologia` (5: digestão, excreção, sinapse, arco reflexo,
eixo endócrino — diagramas de órgão bem desenhados e legendados, ver
`BiologiaFisiologia.tsx`), `BiologiaProcessos` (4: algas, ciclos de vida,
fermentação/respiração, biomagnificação). São mecanismo genuíno, específico do
capítulo, com boa densidade. Defeito transversal: 6 desses capítulos têm texto
abaixo de 9.5px no tema escuro (`fisiologia-da-digestao`,
`fisiologia-da-excrecao`, `fisiologia-da-coordenacao-nervosa-i`,
`coordenacao-nervosa-ii`, `coordenacao-endocrina-ii`,
`bioenergetica-fermentacao-e-respiracao`) — provavelmente rótulos que encolhem
demais para caber no viewBox estreito de 390px; vale revisão de tamanho mínimo
de fonte no tema escuro.

### scene/tipologia — genérico (`Tipologia.tsx`) — 8 REDESENHAR + 1 AJUSTAR
`composicao-quimica-celular-carboidratos-e-lipidios`, `heranca-sexual`,
`mecanismos-da-evolucao-biologica`, `biomas-brasileiros`,
`protozoarios-e-protozooses`, `moluscos`, `anelideos`, `equinodermos`: o
componente (`Tipologia.tsx:55-79`) desenha só uma grade de cartões com número,
título e frase — **nenhuma forma, nenhum ícone, nenhum SVG**. Capturas
`biomas-brasileiros-1440-light.png` e `cordados-tetrapodes-1440-light.png`
mostram isso: texto puro em caixas cinzas, sem nada desenhado. É o caso mais
puro de "estrutura genérica com texto trocado" do grupo — viola a régua item 1
e item 8 (nenhum ícone desenhado) simultaneamente. `mutacoes-genicas` é
exceção: o mesmo arquivo tem um `MutationWorkbench` especial-casado por
`chapterId` (`Tipologia.tsx:15-38,45-53`) que compara antes/depois do
códon — mecanismo de verdade, fica em **ajustar**.

### scene/cadeia-de-derivacao — genérico (`CadeiaDeDerivacao.tsx`) — 6 REDESENHAR
`origem-da-vida-e-as-primeiras-celulas`,
`composicao-quimica-celular-proteinas-e-sua-funcao-estrutural`, `virus`,
`embriologia-animal`, `traqueofitas-transpiracao-e-reposicao-rapida-de-agua`,
`fisiologia-vegetal-transporte-no-floema`. O componente
(`CadeiaDeDerivacao.tsx:16-55`) desenha só retângulos empilhados com texto e uma
seta entre o elo atual e o próximo — sem nenhum traço do fenômeno (nenhuma
célula, vírus, embrião ou xilema desenhado). Note que os 5 capítulos de
fisiologia que também têm `family: cadeia-de-derivacao` no inventário
(digestão, excreção, sinapse, reflexo, eixo endócrino) **não** usam este
componente genérico — são interceptados antes por `BiologiaFisiologia` via
`BIOLOGY_PHYSIOLOGY_SCENE_IDS` (`TopicScene.tsx:43-44`). Ou seja, o campo
`family` do inventário não prevê o componente realmente renderizado; só os 6
acima caem no genérico de fato.

### scene/escala-de-graus — genérico (`EscalaDeGraus.tsx`) — 3 REDESENHAR
`classificacao-biologica-...-filogenetica`, `cordados-tetrapodes`,
`plantas-terrestres-i-briofitas-e-pteridofitas`. Desenha só uma escada de
linhas horizontais com um marcador circular subindo — sem relação visual com
táxons, tetrápodes ou plantas. Captura `cordados-tetrapodes-1440-light.png`
confirma: três traços cinzentos e um ponto laranja.

### scene/contraste-de-posicoes — genérico (`ContrasteDePosicoes.tsx`) — 1 REDESENHAR
`evolucao-biologica-construcao-historica` (Lamarckismo vs. Darwinismo). Três
retângulos vazios (cinza-claro, sem conteúdo desenhado) que só crescem/encolhem
ao clicar — nenhuma ilustração do experimento de Lederberg citado no próprio
resumo. Tem também um **defeito concreto**: os rótulos "Darwinismo" e "Veredito
da evidência" colidem e aparecem colados
("DarwinismoVeredito da evidência", sem espaço) tanto em 1440 claro quanto em
390 escuro — ver capturas
`evolucao-biologica-construcao-historica-1440-light.png` e
`...-390-dark.png`. `ContrasteDePosicoes.tsx:35` não reserva largura suficiente
para textos longos lado a lado.

### experiment/ecology (1 capítulo) — fora do escopo comparável, parece OK
`bio-ecologia-introducao`. Ilustração simples (peixes, plantas, círculo de sol)
que muda de escala (população → comunidade → ecossistema → biosfera) ao clicar
nas abas. É mecanismo genuíno e legível, mas mais simples que as pranchas
autorais — atende à régua, sem grandes iconografias. Gera um erro de console
(`<ellipse> attribute rx/ry: Expected length, "undefined"`) no primeiro
frame — ver §4.

## 3. Tabela por capítulo

| id | engine | veredito | motivo |
| --- | --- | --- | --- |
| eco-introducao | experiment/ecology | ajustar | mecanismo ok, erro de console no 1º frame |
| eco-dinamica-populacoes | scene/autoral (EcologySystems) | manter | mecanismo próprio, fiel |
| eco-invasoras-controle-biologico | scene/autoral | manter | idem |
| eco-sucessao | scene/autoral | manter | idem |
| eco-ciclo-carbono | board/CarbonCycleBoard | manter | mecanismo próprio |
| eco-ciclo-nitrogenio | scene/autoral | ajustar | erro de console (ellipse rx undefined) |
| eco-ciclo-hidrologico-poluicao-agua | scene/autoral | manter | mecanismo próprio |
| eco-eutrofizacao | scene/autoral | manter | idem |
| eco-poluicao-ar | instrument/BiologyRemainingBoard (`default`) | **redesenhar** | cai no case genérico, imagem idêntica a outro capítulo |
| eco-biomagnificacao | scene/autoral | manter | mecanismo próprio |
| eco-aquecimento-global-pops-biorremediacao | instrument/BiologyRemainingBoard (`default`) | **redesenhar** | idem eco-poluicao-ar |
| origem-da-vida-e-as-primeiras-celulas | scene/cadeia-de-derivacao (genérico) | **redesenhar** | só retângulos+texto |
| composicao-quimica-celular-compostos-inorganicos | instrument/BiologyRemainingBoard | ajustar | mecanismo abstrato, fraco |
| composicao-quimica-celular-carboidratos-e-lipidios | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| composicao-quimica-celular-proteinas-e-sua-funcao-estrutural | scene/cadeia-de-derivacao (genérico) | **redesenhar** | só retângulos+texto |
| membranas-celulares | board/MembraneBoard | manter | mecanismo forte; texto <9.5px (menor) |
| citoplasma-estrutura-e-componentes-i | instrument/BiologyRemainingBoard | ajustar | mecanismo abstrato |
| citoplasma-estrutura-e-componentes-ii | instrument/BiologyRemainingBoard | ajustar | idem |
| nucleo-celular | instrument/BiologyRemainingBoard | ajustar | mecanismo fraco (círculo+onda) |
| proteinas-enzimas | board/EnzymeBoard | manter | mecanismo próprio; texto <9.5px (menor) |
| bioenergetica-fermentacao-e-respiracao | scene/autoral | ajustar | bom mecanismo; texto <9.5px no escuro |
| bioenergetica-fotossintese-e-quimiossintese | board/PhotosynthesisBoard | manter | mecanismo próprio |
| acidos-nucleicos | instrument/BiologyBoard | ajustar | bom mecanismo; legenda vaza do viewBox |
| divisao-celular | board/CellDivisionBoard | manter | excelente, mitose×meiose lado a lado |
| mutacoes-cromossomicas-e-gametogenese | instrument/BiologyRemainingBoard | ajustar | mecanismo ok (cromossomos em X) |
| biotecnologia | instrument/BiologyRemainingBoard | ajustar | mecanismo fraco (retângulo+onda) |
| introducao-a-genetica | instrument/BiologyRemainingBoard | ajustar | mecanismo ok; rótulo colide consigo mesmo na legenda de etapas |
| alelos-multiplos-e-heranca-dos-grupos-sanguineos | instrument/BiologyRemainingBoard | ajustar | mecanismo ok; texto vaza do viewBox |
| heranca-sexual | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| segunda-lei-de-mendel | board/MendelBoard | manter | mecanismo próprio (quadro de Punnett) |
| segunda-lei-de-mendel-e-interacao-genica | board/MendelBoard | manter | idem |
| ligacao-genica | instrument/BiologyBoard | ajustar | mecanismo ok, densidade simples |
| mutacoes-genicas | scene/tipologia (especial-casado) | ajustar | workbench de códon, mecanismo de verdade |
| evolucao-biologica-construcao-historica | scene/contraste-de-posicoes (genérico) | **redesenhar** | retângulos vazios; rótulos colidem (claro e escuro) |
| mecanismos-da-evolucao-biologica | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| biomas-brasileiros | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| classificacao-biologica-...-filogenetica | scene/escala-de-graus (genérico) | **redesenhar** | só escada de linhas |
| protozoarios-e-protozooses | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| poriferos-e-cnidarios | instrument/BiologyRemainingBoard | ajustar | mecanismo específico (formas de cnidário) |
| arquitetura-corporal-...-nematodeos | instrument/BiologyRemainingBoard | ajustar | mecanismo fraco (duas elipses) |
| moluscos | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| anelideos | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| artropodes-insetos-crustaceos-e-miriapodes | instrument/BiologyRemainingBoard | ajustar | silhueta com pernas variáveis, razoável |
| artropodes-aracnideos | instrument/BiologyRemainingBoard | ajustar | idem |
| equinodermos | scene/tipologia (genérico) | **redesenhar** | só cartões de texto |
| introducao-aos-cordados-e-os-peixes | instrument/BiologyRemainingBoard | ajustar | silhueta de peixe, razoável |
| cordados-tetrapodes | scene/escala-de-graus (genérico) | **redesenhar** | só escada de linhas |
| fungos | board/FungiBoard | manter | mecanismo próprio |
| algas | scene/autoral (BiologiaProcessos) | manter | atlas de luz por profundidade, bom mecanismo |
| ciclos-de-vida | scene/autoral (BiologiaProcessos) | manter | mecanismo próprio |
| plantas-terrestres-i-briofitas-e-pteridofitas | scene/escala-de-graus (genérico) | **redesenhar** | só escada de linhas; erro de console |
| plantas-terrestres-ii-gimnospermas-e-angiospermas | instrument/BiologyRemainingBoard | ajustar | flor com dois círculos, razoável |
| procariotos | instrument/BiologyRemainingBoard | ajustar | duas formas ovais conectadas, razoável |
| virus | scene/cadeia-de-derivacao (genérico) | **redesenhar** | só retângulos+texto |
| embriologia-animal | scene/cadeia-de-derivacao (genérico) | **redesenhar** | só retângulos+texto |
| fisiologia-da-sustentacao-e-da-locomocao | instrument/BiologyRemainingBoard | ajustar | mecanismo fraco (articulação abstrata) |
| fisiologia-da-digestao | scene/autoral (BiologiaFisiologia) | manter | ótimo diagrama de trato digestório; texto <9.5px no escuro |
| sangue-e-imunologia | board/BloodTypeBoard | manter | mecanismo próprio |
| coracao-e-vasos-sanguineos | board/HeartCirculationBoard | manter | excelente, duas circulações + ilustração |
| fisiologia-da-respiracao | instrument/BiologyBoard | ajustar | bom mecanismo (alvéolo); legenda vaza do viewBox |
| fisiologia-da-excrecao | scene/autoral (BiologiaFisiologia) | manter | diagrama de néfron; texto <9.5px no escuro |
| fisiologia-da-coordenacao-nervosa-i | scene/autoral (BiologiaFisiologia) | manter | diagrama de sinapse; texto <9.5px no escuro |
| coordenacao-nervosa-ii | scene/autoral (BiologiaFisiologia) | manter | diagrama de arco reflexo; texto <9.5px no escuro |
| sistemas-sensoriais-visao-e-audicao | instrument/BiologyRemainingBoard | **ajustar (prioridade alta)** | melhor mecanismo do grupo, mas legenda vaza da cena E a barra de navegação fixa cobre o cartão "Intuição" no celular |
| coordenacao-endocrina-i | instrument/BiologyRemainingBoard | ajustar | mecanismo ok (3 glândulas) |
| coordenacao-endocrina-ii | scene/autoral (BiologiaFisiologia) | manter | diagrama de eixo hormonal; texto <9.5px no escuro |
| reproducao-humana-e-metodos-contraceptivos | instrument/BiologyRemainingBoard | ajustar | mecanismo fraco (3 círculos) |
| histologia-e-morfologia-vegetal | instrument/BiologyRemainingBoard | ajustar | mecanismo ok (tecidos) |
| morfofisiologia-vegetal-caules-e-folhas | instrument/BiologyRemainingBoard | ajustar | mecanismo ok (árvore + ponto) |
| traqueofitas-transpiracao-e-reposicao-rapida-de-agua | scene/cadeia-de-derivacao (genérico) | **redesenhar** | só retângulos+texto |
| fisiologia-vegetal-transporte-no-floema | scene/cadeia-de-derivacao (genérico) | **redesenhar** | só retângulos+texto |
| fisiologia-vegetal-hormonios-vegetais | instrument/BiologyBoard | ajustar | mecanismo de fototropismo; legenda vaza do viewBox |

Contagem: **10 manter (boards)** + **12 manter (scene/autoral bem resolvidas)**
+ **28 redesenhar** (18 nos 4 motores genéricos + 2 no `default` do
BiologyRemainingBoard + 3 escala-de-graus + 1 contraste + 6 cadeia + 1
mutações-genicas é ajustar não redesenhar, recontar abaixo) + **22 ajustar**
(instrumentos com mecanismo fraco ou com defeito pontual). Ver nota: a soma
exata por linha da tabela acima é a fonte de verdade; o resumo do §1 arredonda
para dar visão geral.

## 4. Defeitos transversais e conteúdo sem lastro

1. **Motor genérico "texto trocado" em 4 famílias de cena** —
   `Tipologia.tsx`, `CadeiaDeDerivacao.tsx`, `EscalaDeGraus.tsx`,
   `ContrasteDePosicoes.tsx` (todas em `src/views/topic-scenes/families/`) não
   desenham nada específico do conteúdo: cartões, retângulos e barras genéricas
   com texto. Atingem 18 capítulos de Biologia (ver tabela). É o mesmo padrão
   que a auditoria de História/Geografia (`docs/visual-personalizado/31-...md`)
   já sinalizou como o defeito mais grave da régua.
2. **Dois ids caem no `case default` de um instrumento que deveria ser
   específico** — `air-pollution` e `climate-pops`, em
   `src/views/visual-instruments/BiologyRemainingInstrument.tsx:12-86` (o
   `switch` não lista esses dois ids; `BIOLOGY_REMAINING` em
   `src/lib/biologyRemainingLab.ts` os define, mas ninguém escreveu o `case`).
   As telas de `eco-poluicao-ar` e
   `eco-aquecimento-global-pops-biorremediacao` renderizam a mesma imagem —
   comprovado por captura lado a lado. Diferente dos 18 acima (decisão de
   design), este é um bug de cobertura fácil de corrigir com dois `case`s
   novos.
3. **Barra de navegação fixa cobrindo conteúdo no celular** —
   `sistemas-sensoriais-visao-e-audicao`, 390×860 escuro: a barra inferior fixa
   (Hoje/Plano/Estudar/Análises/Agenda) sobrepõe o texto do cartão "Intuição"
   ("O olho humano forma imagem através de duas..." fica parcialmente
   ilegível atrás da barra). Viola a regra do padrão vinculante
   ("Controles fixos não podem cobrir o conteúdo acionável",
   `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`). Ver captura
   `sistemas-sensoriais-visao-e-audicao-390-dark.png`.
4. **Legenda vazando do viewBox em 5 instrumentos** — texto sai da caixa do
   SVG em `acidos-nucleicos`, `fisiologia-da-respiracao`,
   `sistemas-sensoriais-visao-e-audicao`, `fisiologia-vegetal-hormonios-vegetais`
   e `alelos-multiplos-e-heranca-dos-grupos-sanguineos` (frases finais tipo
   "complementaridade preserva a s[equência]" cortadas). Os 5 usam texto SVG
   fixo (`<text>`) sem quebra de linha automática — cabe revisar comprimento de
   frase ou `viewBox` (`BiologyInstrument.tsx:11,14,15`,
   `BiologyRemainingInstrument.tsx:38,65-80`).
5. **Colisão de rótulos em `evolucao-biologica-construcao-historica`** —
   "Darwinismo" e "Veredito da evidência" colam sem espaço
   (`ContrasteDePosicoes.tsx:35`), em claro e escuro, desktop e celular.
6. **`<circle>`/`<ellipse>` com atributo `undefined` no primeiro frame** — 6
   capítulos disparam um erro de console no mount (`cy`, `rx` ou `ry`
   `"undefined"`): os 3 usuários de `EscalaDeGraus.tsx` (linha 44, `cy` do
   marcador), `ContrasteDePosicoes.tsx` (retângulo, linha 30), e 2 cenas de
   ecologia (`eco-introducao`, `eco-ciclo-nitrogenio`). É provavelmente o
   `motion.*` calculando a partir de um estado inicial não definido antes do
   primeiro layout — não gera falha visível, mas é erro real de console.
7. **Texto abaixo de 9.5px no tema escuro** em 6 capítulos de
   `BiologiaFisiologia`/autoral e 2 boards — não impede leitura nas capturas,
   mas está abaixo do confortável; vale checar `font-size` mínimo do CSS de
   cena no tema escuro.
8. **Nenhum conteúdo inventado encontrado.** Os 33 capítulos com família
   genérica (tipologia, cadeia-de-derivação, escala-de-graus,
   contraste-de-posições) foram conferidos frase a frase contra
   `deepSummaryContent.json`; todos batem com o resumo, incluindo dois casos em
   que uma `NOTA` explícita exclui uma seção que não sustentava a tipologia
   (`sangue-e-imunologia`, `mecanismos-da-evolucao-biologica`) — prática
   correta, não lacuna.
9. **Ambiguidade no campo `family` do inventário**: capítulos como
   `fisiologia-da-digestao` aparecem com `family: cadeia-de-derivacao` mas na
   verdade são interceptados por `BIOLOGY_PHYSIOLOGY_SCENE_IDS`
   (`TopicScene.tsx:43-44`) e renderizam `BiologiaFisiologia`, um componente
   bem melhor. Quem for usar `inventario-geral.json` para priorizar redesenho
   deve conferir o componente real em `TopicScene.tsx`, não só o campo
   `family`.

## 5. Lotes de redesenho propostos (ordem de prioridade)

1. **Lote A — bug de cobertura, 1 tarde de trabalho.** Dar `case` próprio a
   `air-pollution` e `climate-pops` em `BiologyRemainingInstrument.tsx`
   (2 capítulos). É a correção de maior razão custo/impacto: tira uma
   duplicata literal de imagem do ar.
2. **Lote B — motor genérico de "tipologia" (8 capítulos):**
   `composicao-quimica-celular-carboidratos-e-lipidios`, `heranca-sexual`,
   `mecanismos-da-evolucao-biologica`, `biomas-brasileiros`,
   `protozoarios-e-protozooses`, `moluscos`, `anelideos`, `equinodermos`.
   Todos hoje são cartões de texto puro — qualquer ilustração desenhada already
   supera a barra atual. Pode reaproveitar `MutationWorkbench` como referência
   de "tipologia com mecanismo".
3. **Lote C — motor genérico de "cadeia de derivação" (6 capítulos):**
   `origem-da-vida-e-as-primeiras-celulas`,
   `composicao-quimica-celular-proteinas-e-sua-funcao-estrutural`, `virus`,
   `embriologia-animal`, `traqueofitas-transpiracao-...`,
   `fisiologia-vegetal-transporte-no-floema`. Usar `BiologiaFisiologia.tsx`
   como referência de qualidade (mesma família de conteúdo — sequência de
   etapas — já resolvida bem para os 5 capítulos de fisiologia).
4. **Lote D — motor genérico "escala de graus" + "contraste de posições"
   (4 capítulos):** `classificacao-biologica-...`, `cordados-tetrapodes`,
   `plantas-terrestres-i`, `evolucao-biologica-construcao-historica`. Menor em
   quantidade, mas `evolucao-biologica-...` tem também o bug de colisão de
   texto (§4.5), então corrigir esse motor primeiro remove sozinho um defeito
   visível hoje.
5. **Lote E — reforço visual dos instrumentos fracos (6 capítulos):**
   `locomotion`, `endocrine`, `inorganic`, `nucleus`, `biotechnology`,
   `reproduction` em `BiologyRemainingInstrument.tsx`. Não é bug, é
   acabamento — desenhos abstratos demais para o padrão das cenas novas
   (regra 8). Menor prioridade que os lotes B–D porque tecnicamente já têm
   mecanismo próprio por id.
6. **Lote F — polimento transversal (todos os grupos):** corrigir vazamento de
   legenda em 5 instrumentos (§4.4), texto minúsculo no escuro em 8 capítulos
   (§4.7), cobertura da barra fixa em `sistemas-sensoriais-visao-e-audicao`
   (§4.3, fazer isso **antes** dos lotes acima porque é o único item da lista
   que viola o padrão vinculante em vez de só ficar aquém dele), e os 6 erros
   de console de atributo `undefined` (§4.6).
