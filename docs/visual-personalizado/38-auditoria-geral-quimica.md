# Auditoria geral — Química (48 capítulos)

Método: leitura de código de todos os engines envolvidos, varredura automática
Playwright dos 48 capítulos (1034×light e 390×dark, erros de página, overflow
horizontal, texto fora/sobreposto na cena, contagem de SVGs) em
`/tmp/.../scratchpad/qui/sweep.jsonl`, e inspeção visual de screenshots já
existentes em `docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/quimica/`
(reaproveitadas integralmente — 40 arquivos, limite do lote atingido, nenhuma
captura nova feita). Fidelidade conferida por amostragem contra
`src/lib/chemistryInstrumentLab.ts`, `src/lib/electrochemistryLab.ts` e
`src/views/topic-scenes/data/quimica.ts` (que já cita trecho literal do resumo
por item).

## 1. Resumo

**Por veredito:** manter 22 · ajustar 19 · redesenhar 7

**Por engine** (kind → engine, nº capítulos):
| engine | capítulos | manter | ajustar | redesenhar |
|---|---|---|---|---|
| board (6 componentes próprios) | 7 | 6 | 1 | 0 |
| instrument `ElectrochemistryInstrument` | 5 | 5 | 0 | 0 |
| instrument `ChemistryInstrument` | 18 | 7 | 11 | 0 |
| scene autoral (`QuimicaTipologia`/`QuimicaOrganica`) | 7 | 4 | 3 | 0 |
| scene genérica `Tipologia` | 6 | 0 | 0 | 6 |
| scene genérica `EscalaDeGraus` | 2 | 0 | 2 | 0 |
| scene genérica `CriteriosConjuntivos` | 1 | 0 | 1 | 0 |
| scene genérica `CadeiaDeDerivacao` | 1 | 0 | 1 | 0 |
| scene genérica `GradeDeEixos` | 1 | 0 | 0 | 1 |

**5 achados principais:**
1. **Bug crítico isolado:** `summary-quimica-equilibrios-ionicos-ii` (família
   `grade-de-eixos`) renderiza com o rótulo de célula em fonte gigante,
   sobreposto e cortado nas duas bordas da tela, em claro e escuro — o único
   capítulo do app que hoje exercita esse engine com conteúdo real está
   quebrado. Causa: `.tc-label { font-size: 18px }` (`TopicScene.css:78`) foi
   calibrado para os viewBoxes de 480 de largura das outras famílias, mas
   `GradeDeEixos.tsx` usa `viewBox="0 0 220 220"` (`GradeDeEixos.tsx:24`) —
   escala ~2,2× maior que o previsto.
2. **6 capítulos sem nenhum desenho:** a família `Tipologia` (motor
   compartilhado com todas as matérias) não tem `<svg>` — é só uma grade de
   cartões de texto (`Tipologia.tsx:52-65`). Afeta tabela periódica,
   radioatividade, composição da matéria, química inorgânica, combustíveis
   fósseis e efeitos coligativos: nenhum tem qualquer mecanismo visual, iônico,
   estrutural ou de escala — só claim + citação.
3. **`ChemistryInstrument` (18 capítulos) mistura bespoke e genérico dentro do
   mesmo arquivo:** 8 configs têm `<svg>` desenhado especificamente para o
   título do capítulo (fórmula mínima, cadeia carbônica, escala de pKa,
   grau de polimerização etc.); as outras 10 caem em três diagramas
   compartilhados por `config.diagram` — `particles` (gás ideal, lei geral dos
   gases, mol — `ChemistryInstrument.tsx:28-33`, pontos parados numa grade sem
   agitação visível), `equation` (balanceamento, estequiometria, combustão —
   `:46-52`, duas caixas e bolinhas idênticas) e `equilibrium` (esterificação,
   biodiesel, deslocamento de equilíbrio, equilíbrios iônicos — `:84-90`, dois
   círculos "reagentes/produtos" idênticos). É exatamente o padrão "mesmo
   desenho, texto trocado" da auditoria de História/Geografia.
4. **Anotação cortando a borda do viewBox em `QuimicaOrganica`:** "sem H no
   C–OH" (álcool terciário, `QuimicaOrganica.tsx:97`) e o rótulo "Br" da
   substituição eletrofílica (`:86`) ficam parcialmente fora da caixa de 220–240
   de largura nas duas capturas (claro e escuro) — confirmado pela varredura
   automática, não só por medida de moldura.
5. **Erro de console transversal:** `motion.circle`/`motion.rect` com
   `animate={{ cy: ... }}`/`{{ cx: ... }}` sem valor inicial produz
   `Error: <circle> attribute cy: Expected length, "undefined"` no primeiro
   quadro, em `ChemistryInstrument.tsx` (interações intermoleculares — não, essa
   é `EscalaDeGraus` — e Escala de pKa, separação de misturas, gás ideal, massa
   molar) e em `EscalaDeGraus.tsx` (interações intermoleculares, cinética
   química). Não é visível na captura final, mas é o mesmo tipo de defeito que
   o `.webp` transparente do CLAUDE.md: passa sem que nada acuse, só aparece no
   console.

## 2. Por engine

### Boards (`src/views/visual-boards/*Board.tsx`) — 7 capítulos
Cada um é um componente próprio (`AtomModelsBoard`, `BondingBoard`,
`StoichiometryBoard`, `AcidBaseBoard`, `SolutionsBoard`, `ThermochemBoard`×2),
todos sobre `BoardShell`, com movimento explicativo real (curva de entalpia com
"Reproduzir movimento", cadeia de derivação de modelos atômicos, transferência
de próton animada). Não são genéricos: cada um desenha o objeto do próprio
capítulo. Qualidade alta, à altura da régua item 8 — ver
`termoquimica-i-1440-light.png` (curva de energia, pegadinhas, prática).

Defeito: em `equacoes-ionicas-e-outras-teorias-para-acidos-e-bases-1440-light.png`
a mini-escala de pH (miniatura decorativa acima da segunda seção) é ilegível —
texto de rótulo de eixo com poucos pixels de altura (flag `SMALLTEXT` da
varredura). O board em si segue "manter"; a miniatura pede ajuste.

`ThermochemBoard` (termoquímica II) vence a cena da família `grade-de-eixos`
que existe para o mesmo capítulo em `topic-scenes/data/quimica.ts:376-389` —
o que a estudante vê está certo, mas essa entrada de cena fica morta (nunca
renderizada, só serve de exemplo de dados para a família).

### `ElectrochemistryInstrument` — 5 capítulos
`src/views/visual-instruments/ElectrochemistryInstrument.tsx` desenha uma cena
por `id` (`redox`, `cells`, `spontaneous`, `electrolysis`, o quinto por
fallback de eletrodeposição) — pilha de Daniell com elétrons se movendo,
eletrólise com fonte de tensão, barra de depósito de cobre. Nenhum
compartilhamento de desenho entre capítulos. Todos "manter".

### `ChemistryInstrument` — 18 capítulos
`src/views/visual-instruments/ChemistryInstrument.tsx` + `src/lib/chemistryInstrumentLab.ts`.
Os dados (`CHEMISTRY` record) são individualmente corretos e específicos —
fórmulas, unidades e leituras batem com o capítulo — mas o desenho é
selecionado por `config.diagram`, uma de 6 famílias, e metade dos capítulos cai
em três delas sem qualquer diferenciação visual:

- `particles` (`:28-33`): **gás ideal, lei geral dos gases, massa molar** — a
  mesma caixa com 12 bolinhas, sem agitação visível proporcional à variável
  (notas da varredura anterior: "pontos parados em grade, barra vermelha na
  borda sem sentido, pergunta repetida no controle").
- `equation` (`:46-52`): **balanceamento, estequiometria, oxidação de
  hidrocarbonetos** — duas caixas com bolinhas que ganham opacidade, sem
  relação visual com a equação química real do capítulo.
- `equilibrium` (`:84-90`): **esterificação, transesterificação, deslocamento
  de equilíbrio, equilíbrios iônicos** — dois círculos "reagentes"/"produtos"
  idênticos com uma seta que muda de opacidade.

Os outros 8 têm ramificação por `config.title` dentro do mesmo arquivo e
desenham o objeto certo: filtração com malha e partículas de tamanho
diferente (separação), CH₂O empilhado (fórmula mínima), topologia de cadeia
com ramo (cadeia carbônica / nomenclatura), hidrogenação do eteno (adição),
escala de pKa numa reta numerada (acidez), grau de polimerização em blocos
(polímeros), CaCO₃ com H⁺ (intemperismo). Esses ficam "manter".

Defeito adicional específico: `separacao-de-misturas` tem os rótulos "areia
argila soluto" colados entre si na captura de 1440 (nota já registrada), e o
selo da leitura usa "AREIA (8 MM)" — a letra maiúscula troca µ (micrômetro) por
M (mega) na exibição, um erro de unidade por causa de `text-transform`.

### Scenes autorais (`QuimicaTipologia`, `QuimicaOrganica`) — 7 capítulos
`QuimicaTipologia` (só geometria molecular) desenha as seis geometrias com
bolinha central, ligantes e pares isolados pontilhados — fiel ao resumo,
ângulos corretos (180°, 120°, 109,5° etc.), régua cumprida. `QuimicaOrganica`
desenha ligações e átomos reais (isomeria plana com zigue-zague de cadeia,
cis/trans com CH₃ e H nas posições certas, enantiômeros com cunha e espelho,
mecanismos de substituição radicalar/eletrofílica/nucleofílica, oxidação de
álcool primário/secundário/terciário). Mérito real, nada emprestado.

Defeitos pontuais (`QuimicaOrganica.tsx`):
- `:97` "sem H no C–OH" (álcool terciário) — texto em x=199 de um viewBox de
  240, sai da borda direita nas duas capturas (`alcoois`).
- `:86` rótulo "Br" da substituição eletrofílica em y=14 de um viewBox de 100 —
  cortado na borda superior (`interpretando-reacoes-organicas`).
- `:62-64` "Aldeído ou cetona" (posição da carbonila): texto "C" e "O"
  próximos o bastante para a varredura acusar sobreposição de caixa
  (`reconhecimento-de-funcoes-organicas`), pior no tema escuro.

### Scenes genéricas — 11 capítulos
Compartilhadas com todas as matérias, em `src/views/topic-scenes/families/`:

- **`Tipologia.tsx`** (6 capítulos de Química: tabela periódica, radioatividade,
  composição da matéria, química inorgânica, combustíveis fósseis, efeitos
  coligativos): grade de cartões clicáveis com número, claim e citação — **sem
  `<svg>` nenhum**. Não há desenho de orbital, de emissão radioativa, de
  partícula em cada estado físico, de função inorgânica ou de efeito
  coligativo. É o motor mais fraco do capítulo em relação à régua item 1.
- **`EscalaDeGraus.tsx`** (interações intermoleculares, cinética química): régua
  abstrata com marcador subindo degraus — comunica a ordem certa (a ordem de
  força das interações, a ordem de reação), mas não desenha nenhuma molécula,
  ligação de hidrogênio ou gráfico de velocidade.
- **`CriteriosConjuntivos.tsx`** (polaridade das ligações): mesmo padrão, sem
  desenho de vetor de dipolo ou geometria — a molécula nunca aparece, apesar de
  o capítulo tratar exatamente de como a geometria cancela ou soma dipolos.
- **`CadeiaDeDerivacao.tsx`** (química ambiental): cadeia de caixas com seta —
  aceitável como narrativa causal (nutrientes → algas → decomposição → asfixia),
  mas nenhuma água, alga ou peixe aparece.
- **`GradeDeEixos.tsx`** (equilíbrios iônicos II): ver achado #1 — quebrado.

## 3. Tabela por capítulo

| id | engine | veredito | motivo |
|---|---|---|---|
| summary-quimica-evolucao-dos-modelos-atomicos | AtomModelsBoard | manter | cadeia de evidências desenhada, fiel |
| summary-quimica-organizacao-da-tabela-periodica-dos-elementos | Tipologia | redesenhar | zero SVG, só cartões de texto |
| summary-quimica-radioatividade-o-estudo-das-radiacoes | Tipologia | redesenhar | zero SVG |
| summary-quimica-ligacoes-quimicas-e-alotropia | BondingBoard | manter | tipos de ligação desenhados |
| summary-quimica-geometria-molecular | QuimicaTipologia (autoral) | manter | 6 geometrias com ângulos corretos |
| summary-quimica-polaridade-das-ligacoes-e-das-moleculas | CriteriosConjuntivos | ajustar | genérico, sem molécula/dipolo desenhado |
| summary-quimica-interacoes-intermoleculares | EscalaDeGraus | ajustar | genérico, sem ligação desenhada |
| summary-quimica-composicao-da-materia-estados-fisicos | Tipologia | redesenhar | zero SVG |
| summary-quimica-o-estado-gasoso | ChemistryInstrument (particles) | ajustar | partículas estáticas, barra sem legenda |
| summary-quimica-estudo-dos-gases-ii | ChemistryInstrument (particles) | ajustar | mesmo diagrama de partículas genérico |
| summary-quimica-separacao-de-misturas | ChemistryInstrument (apparatus) | ajustar | bespoke, mas rótulos colados e µ virando M |
| summary-quimica-transformacoes-fisicas-e-quimicas-e-balanceamento-de-equacoes | ChemistryInstrument (equation) | ajustar | caixas genéricas sem relação com a equação |
| summary-quimica-massa-atomica-mol-e-massa-molar | ChemistryInstrument (particles) | ajustar | mesmo diagrama de partículas genérico |
| summary-quimica-determinacao-de-formulas-quimicas | ChemistryInstrument (molecule, bespoke) | manter | blocos CH₂O específicos |
| summary-quimica-estequiometria-leis-ponderais | StoichiometryBoard | manter | reagente limitante desenhado |
| summary-quimica-calculos-estequiometricos | ChemistryInstrument (equation) | ajustar | diagrama genérico de caixas |
| summary-quimica-quimica-inorganica | Tipologia | redesenhar | zero SVG |
| summary-quimica-equacoes-ionicas-e-outras-teorias-para-acidos-e-bases | AcidBaseBoard | ajustar | ótimo, mas mini-escala de pH ilegível |
| summary-quimica-processos-de-oxirreducao | ElectrochemistryInstrument | manter | cena redox bespoke |
| summary-quimica-quimica-ambiental | CadeiaDeDerivacao | ajustar | cadeia causal certa, sem desenho de água/alga |
| summary-quimica-introducao-a-quimica-organica | ChemistryInstrument (molecule, bespoke) | manter | topologia de cadeia com ramo |
| summary-quimica-nomenclatura-de-compostos-organicos | ChemistryInstrument (molecule, bespoke) | manter | contagem de carbonos na cadeia |
| summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados | QuimicaOrganica (autoral) | manter | estrutura de cada função desenhada |
| summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades | QuimicaOrganica (autoral) | ajustar | C/O da carbonila colados |
| summary-quimica-isomeria | QuimicaOrganica (autoral) | manter | plana/geométrica/óptica desenhadas |
| summary-quimica-combustiveis-fosseis | Tipologia | redesenhar | zero SVG |
| summary-quimica-interpretando-reacoes-organicas | QuimicaOrganica (autoral) | ajustar | rótulo "Br" cortado na borda |
| summary-quimica-reacoes-de-substituicao | QuimicaOrganica (autoral) | manter | 3 mecanismos distintos desenhados |
| summary-quimica-reacoes-de-adicao | ChemistryInstrument (bespoke) | manter | hidrogenação do eteno |
| summary-quimica-reacoes-de-oxidacao-em-hidrocarbonetos | ChemistryInstrument (equation) | ajustar | diagrama genérico de caixas |
| summary-quimica-alcoois | QuimicaOrganica (autoral) | ajustar | "sem H no C–OH" cortado na borda |
| summary-quimica-acidos-graxos-e-esterificacao | ChemistryInstrument (equilibrium) | ajustar | círculos genéricos reagente/produto |
| summary-quimica-transesterificacao-alcoolise | ChemistryInstrument (equilibrium) | ajustar | mesmo diagrama genérico |
| summary-quimica-acidez-e-basicidade-pka | ChemistryInstrument (bespoke) | manter | reta de pKa numerada |
| summary-quimica-polimeros | ChemistryInstrument (bespoke) | manter | blocos de monômero contados |
| summary-quimica-dispersoes | SolutionsBoard | manter | classificação por tamanho desenhada |
| summary-quimica-efeitos-coligativos | Tipologia | redesenhar | zero SVG |
| summary-quimica-termoquimica-i | ThermochemBoard | manter | curva de entalpia com movimento |
| summary-quimica-termoquimica-ii | ThermochemBoard | manter | board vence; cena grade-de-eixos fica morta |
| summary-quimica-cinetica-quimica | EscalaDeGraus | ajustar | ordem de reação sem gráfico de velocidade |
| summary-quimica-introducao-ao-estudo-das-pilhas-e-baterias | ElectrochemistryInstrument | manter | célula galvânica desenhada |
| summary-quimica-eletroquimica-de-processos-espontaneos | ElectrochemistryInstrument | manter | ΔE° com deslocamento de esfera |
| summary-quimica-eletroquimica-de-processos-nao-espontaneos | ElectrochemistryInstrument | manter | eletrólise com fonte |
| summary-quimica-aspectos-quantitativos-da-eletroquimica-e-metalurgia | ElectrochemistryInstrument | manter | depósito de cobre desenhado |
| summary-quimica-deslocamento-de-equilibrio | ChemistryInstrument (equilibrium) | ajustar | círculos genéricos reagente/produto |
| summary-quimica-equilibrios-ionicos | ChemistryInstrument (equilibrium) | ajustar | mesmo diagrama genérico |
| summary-quimica-equilibrios-ionicos-ii | GradeDeEixos | **redesenhar (urgente)** | texto gigante sobreposto, ilegível nas duas telas |
| qui-equilibrio-acidificacao | ChemistryInstrument (bespoke) | manter | CaCO₃ + H⁺ desenhado |

## 4. Defeitos transversais e conteúdo sem lastro

- **Motor genérico sem desenho (`Tipologia.tsx`)**: 6 capítulos de Química
  ficam sem qualquer mecanismo visual — pior que "mesmo desenho, texto
  trocado", porque não há desenho algum. Mesmo problema-raiz do achado central
  da auditoria de História/Geografia, na forma mais extrema.
- **`grade-de-eixos` nunca testado com conteúdo real**: o único capítulo de
  Química que o exercita de fato (`equilibrios-ionicos-ii`) está quebrado
  visualmente; o outro (`termoquimica-ii`) é encoberto por um board, então o
  bug nunca apareceu em uso normal. Vale conferir se outras matérias têm o
  mesmo problema de escala antes de generalizar o conserto.
- **Erros de console `Expected length, "undefined"`** em `motion.circle`/`rect`
  sem valor inicial de `cy`/`cx`, em `ChemistryInstrument.tsx` (gás ideal,
  massa molar, separação de misturas, escala de pKa) e `EscalaDeGraus.tsx`
  (interações intermoleculares, cinética química) — não achado por nenhum
  teste automatizado hoje, só pela varredura desta auditoria.
- **Nenhum conteúdo inventado encontrado.** A amostragem contra
  `chemistryInstrumentLab.ts`, `electrochemistryLab.ts` e
  `topic-scenes/data/quimica.ts` bateu com o resumo em todos os casos
  verificados; `quimica.ts` já cita o trecho literal do capítulo por item, o
  que facilitou a conferência.
- **Unidade trocada por `text-transform: uppercase`**: "8 µm" vira "8 MM" no
  selo de leitura de `separacao-de-misturas` — não é erro de dado, é CSS
  aplicando maiúsculas sobre um símbolo que não deveria mudar.

## 5. Proposta de lotes de redesenho

1. **Lote 0 — bug, não redesenho (1 capítulo, urgente):** corrigir
   `equilibrios-ionicos-ii` antes de qualquer coisa — é o único capítulo do
   grupo hoje ilegível. Ajustar `.tc-label` para escalar com o viewBox (ou dar
   a `GradeDeEixos` um viewBox de 480 como as demais famílias) e reconferir
   `termoquimica-ii` (mesma família, hoje encoberta pelo board) antes de fechar.
2. **Lote 1 — os 6 capítulos sem desenho (`Tipologia`):** tabela periódica
   (famílias com raio atômico/reatividade), radioatividade (alfa/beta/gama com
   poder de penetração), composição da matéria (partículas nos três estados),
   química inorgânica (as 4 funções com fórmula geral), combustíveis fósseis
   (produtos da combustão e seus efeitos), efeitos coligativos (as 4 curvas).
   Maior prioridade depois do bug: é onde a régua item 1 falha por completo.
3. **Lote 2 — `ChemistryInstrument` genérico, grupo `equilibrium` (4
   capítulos):** esterificação, transesterificação, deslocamento de
   equilíbrio, equilíbrios iônicos — dar a cada um um desenho do objeto real
   (éster formando, biodiesel com glicerol, HA↔H⁺+A⁻ com barra de
   concentração), em vez dos dois círculos idênticos.
4. **Lote 3 — `ChemistryInstrument` genérico, grupo `particles` (3
   capítulos):** gás ideal, lei geral dos gases, massa molar — dar movimento
   real às partículas (velocidade/frequência de choque proporcional ao
   valor) e legendar a barra vermelha.
5. **Lote 4 — `ChemistryInstrument` genérico, grupo `equation` (3
   capítulos):** balanceamento, estequiometria, oxidação de hidrocarbonetos —
   desenhar a equação química real (H₂+O₂, CH₄+O₂) em vez de caixas com
   bolinhas abstratas.
6. **Lote 5 — engines abstratos legítimos, mas sem objeto químico (3
   capítulos):** interações intermoleculares e cinética química
   (`EscalaDeGraus`), polaridade das ligações (`CriteriosConjuntivos`) — dar a
   cada um uma cena de apoio com a molécula/ligação real, mantendo a escala
   como complemento, não como a cena inteira.
7. **Lote 6 — polimento (não redesenho):** anotações cortando a borda em
   `QuimicaOrganica` (álcool terciário, substituição eletrofílica, carbonila),
   mini-escala de pH ilegível em `AcidBaseBoard`, rótulos colados e µ→M em
   `separacao-de-misturas`, erros de console de atributo SVG indefinido.
