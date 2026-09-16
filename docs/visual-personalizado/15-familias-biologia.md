# Famílias de cena — Biologia (Parte A: capítulos 1 a 36)

Este documento é a **Parte A** de um inventário em duas partes dos 72 capítulos de
Biologia (`src/data/deepSummaryContent.json`, `subject === "Biologia"`, ordem de
aparição no arquivo). Cobre os primeiros 36. Uma segunda dispatch cobrirá os 37
restantes e fechará o documento com a Parte B — este arquivo pode ficar parcial até lá.

Cada capítulo foi lido na íntegra (todas as seções de `sections`, mais `recall` como
apoio) e testado contra as oito famílias de `src/views/topic-scenes/types.ts`
(`contraste-de-posicoes`, `escala-de-graus`, `cadeia-de-derivacao`,
`camadas-de-determinacao`, `movimento-dialetico`, `tipologia`, `criterios-conjuntivos`,
`grade-de-eixos`). Toda citação abaixo é trecho literal do JSON. Onde nenhuma família
resiste ao teste sem forçar a fonte, o capítulo foi declarado lacuna com o motivo
específico — nunca um genérico "não cobre o capítulo inteiro".

Esta parte não escreve nenhum `SceneEntry`: `src/views/topic-scenes/data/biologia.ts`
fica com `biologia: SceneEntry[] = []` vazio. Só `biologiaSemCena` é preenchido, e só
com os gaps desta metade (capítulos 1–36). As entradas reais das famílias atribuídas
aqui ficam para uma task futura de escrita de cenas, fora deste escopo.

## Atribuições por família

### `tipologia` (9 capítulos)

- **`biologia-algas`** — grupos de algas coexistem sob o critério comum de pigmento
  acessório e profundidade alcançável, não competem entre si: *"As algas verdes, com
  clorofilas a e b, absorvem bem no vermelho e por isso ocupam águas rasas. As pardas,
  com fucoxantina, ocupam profundidade intermediária. As vermelhas, com ficoeritrina,
  absorvem justamente a faixa azul-verde e por isso conseguem viver mais fundo do que
  qualquer outro grupo fotossintetizante."*

- **`biologia-anelideos`** — guarda-chuva explícito: *"A classificação tradicional
  reconhece três grupos."* (oligoquetos, poliquetos, hirudíneos, cada um com nicho e
  anatomia próprios, coexistindo).

- **`biologia-biomas-brasileiros`** — *"O Brasil abriga seis biomas continentais
  reconhecidos pelo IBGE."* Seis tipos que coexistem territorialmente.

- **`biologia-ciclos-de-vida`** — *"Todo ciclo de vida sexuado alterna... e o que
  distingue os ciclos é onde a meiose ocorre"*, seguido da enumeração dos três padrões
  (haplobionte haplonte, haplobionte diplonte, diplobionte) como tipos coexistentes em
  grupos diferentes, não uma escala evolutiva obrigatória de um para o outro dentro do
  mesmo organismo.

- **`biologia-composicao-quimica-celular-carboidratos-e-lipidios`** — guarda-chuva
  duplo: *"Classificam-se pelo número de unidades"* (monossacarídeo/dissacarídeo/
  polissacarídeo) e *"Os polissacarídeos se dividem por função"* (reserva ×
  estrutural).

- **`biologia-dinamica-de-populacoes`** — *"As estratégias reprodutivas também se
  opõem: espécies r-estrategistas produzem muitos descendentes pequenos... espécies
  K-estrategistas produzem poucos descendentes..."* — dois perfis que coexistem em
  espécies diferentes, não uma disputa teórica entre si.

- **`biologia-equinodermos`** — *"A diversidade do grupo se organiza em cinco classes
  com hábitos distintos."* (asteroides, equinoides, holoturoides, ofiuroides,
  crinoides).

- **`biologia-especies-invasoras-e-controle-biologico`** — *"Os impactos operam por
  vários mecanismos, e a prova costuma pedir que se identifique qual está em jogo."*
  (predação, competição, transmissão de patógenos, hibridação, alteração do ambiente
  físico — mecanismos que coexistem, não é preciso escolher um só).

- **`biologia-ciclo-hidrologico-e-poluicao-da-agua`** — *"A poluição da água se
  classifica pelo agente e pelo efeito."* (orgânica, por nutrientes, térmica, química,
  biológica, por plásticos — tipos que coexistem na prática, ainda que a seção de
  eutrofização e a de tratamento de esgoto também tenham estrutura sequencial; a
  classificação por agente é o eixo mais amplo do capítulo).

### `cadeia-de-derivacao` (12 capítulos)

- **`biologia-bioenergetica-fermentacao-e-respiracao`** — sequência obrigatória de
  etapas: *"A glicólise ocorre no citosol... Havendo oxigênio, o piruvato entra na
  mitocôndria e passa pela descarboxilação oxidativa... O acetil-CoA entra no ciclo de
  Krebs... Na cadeia respiratória, na membrana interna da mitocôndria, os elétrons do
  NADH e do FADH2 percorrem complexos proteicos..."*

- **`biologia-bioenergetica-fotossintese-e-quimiossintese`** — *"A etapa química, o
  ciclo de Calvin, ocorre no estroma e não depende diretamente da luz, embora dependa
  dos produtos dela"* — a etapa fotoquímica produz o que a etapa química consome, uma
  derivação de mão única.

- **`biologia-biomagnificacao`** — a cadeia trófica concentra o poluente a cada elo:
  *"esse 1 kg de consumidor concentra o poluente que estava distribuído nos 10 kg que
  ele comeu, o que multiplica a concentração por dez a cada degrau"*, com a série
  numérica fitoplâncton (0,01 ppm) → zooplâncton (0,1) → peixe pequeno (1) → peixe
  grande (10) → ave/humano (100) citada no texto.

- **`biologia-ciclo-do-nitrogenio`** — *"As etapas microbianas seguem uma ordem que a
  banca pede em sequência"*: fixação → amonificação → nitrificação (dois passos,
  Nitrosomonas depois Nitrobacter) → desnitrificação.

- **`biologia-composicao-quimica-celular-proteinas-e-sua-funcao-estrutural`** —
  *"A estrutura primária é a sequência linear de aminoácidos... é o nível que define
  todos os outros, porque as interações entre os radicais decorrem de quais radicais
  estão presentes e em que ordem."* Primária → secundária → terciária → quaternária,
  cada nível construído sobre o anterior.

- **`biologia-coordenacao-endocrina-ii`** — *"O eixo hipotálamo-hipófise-glândula é o
  modelo. O hipotálamo libera um hormônio liberador; a adeno-hipófise responde com o
  hormônio trófico... a glândula-alvo produz o hormônio final... e esse hormônio final
  inibe tanto o hipotálamo quanto a hipófise, fechando o circuito."*

- **`biologia-coordenacao-nervosa-ii`** — *"O percurso tem cinco elementos, e a ordem
  precisa ser dita corretamente: receptor sensorial... neurônio sensitivo... centro
  integrador... neurônio motor... e efetor."*

- **`biologia-divisao-celular`** — *"A mitose tem quatro fases. Na prófase, a
  cromatina se condensa... Na metáfase, os cromossomos... alinham-se... Na anáfase, os
  centrômeros se dividem... Na telófase, a carioteca se refaz..."*

- **`biologia-embriologia-animal`** — *"Segue-se a segmentação, ou clivagem... Da
  segmentação resulta a mórula... e depois a blástula... Na gastrulação, a blástula
  sofre invaginação, forma o arquêntero... e o blastóporo, e passa a ter dois e depois
  três folhetos."*

- **`biologia-eutrofizacao`** — *"A cadeia de consequências deve ser dita em ordem,
  porque a banca costuma pedir exatamente o encadeamento"*: aporte de nutrientes →
  floração → bloqueio de luz → morte das produtoras submersas → decomposição →
  anoxia → mortandade.

- **`biologia-fisiologia-vegetal-transporte-no-floema`** — *"a hipótese do fluxo por
  pressão, ou hipótese de Münch, e o mecanismo precisa ser reconstruído por inteiro"*:
  carregamento na fonte → queda do potencial hídrico → entrada de água por osmose →
  gradiente de pressão → descarregamento no dreno.

- **`biologia-fisiologia-da-coordenacao-nervosa-i`** — a sinapse é descrita como
  encadeamento estrito: *"o potencial de ação chega ao terminal axônico e abre canais
  de cálcio; o influxo de Ca2+ faz as vesículas sinápticas se fundirem à membrana e
  liberarem neurotransmissor... que se liga a receptores específicos... gerando um
  novo potencial... Em seguida ele é removido..."*

### `escala-de-graus` (2 capítulos)

- **`biologia-classificacao-biologica-nomenclatura-cientifica-e-nocoes-de-sistematica-filogenetica`**
  — *"Quanto mais específica a categoria compartilhada por dois organismos, maior o
  parentesco e maior a semelhança: dois animais do mesmo gênero são mais próximos que
  dois da mesma família."* A hierarquia domínio → reino → filo → classe → ordem →
  família → gênero → espécie é literalmente um grau crescente de parentesco, o
  candidato citado no brief.

- **`biologia-cordados-tetrapodes`** — grau crescente de independência da água ao
  longo do grupo, dito explicitamente: anfíbios *"ainda não se libertaram da água"*;
  répteis e aves ganham *"três [adaptações que] libertaram esse conjunto da água"*
  (pele seca, fecundação interna, ovo amniótico); mamíferos somam mais adaptações
  (endotermia, diafragma, heterodontia). Não é um contraste de posições rivais — é uma
  escala evolutiva de grau, o mesmo padrão da "alternância de gerações" em Geografia
  não se aplica aqui, mas a lógica de grau crescente é idêntica.

### `contraste-de-posicoes` (1 capítulo)

- **`biologia-evolucao-biologica-construcao-historica`** — rejeição explícita, não
  coexistência: o texto aplica as duas explicações ao mesmo caso (girafa, resistência
  bacteriana) e declara uma delas errada e a outra sustentada por evidência: *"Pela
  lógica lamarckista, a exposição ao antibiótico induziria as bactérias a desenvolver
  resistência... Pela lógica darwinista, a população já continha, por mutação
  aleatória prévia, alguns indivíduos resistentes... A segunda é a sustentada por
  evidência."* Este é o caso mais limpo de rivalidade teórica real em toda a Parte A.

### `camadas-de-determinacao`, `movimento-dialetico`, `criterios-conjuntivos`,
`grade-de-eixos` (0 capítulos cada nesta metade)

Nenhum capítulo dos primeiros 36 sustentou genuinamente uma dessas quatro famílias com
citação literal. Candidatos que pareciam próximos e foram descartados:

- `biologia-arquitetura-corporal-dos-animais-e-o-filo-dos-platelmintos-e-dos-nematodeos`
  parecia candidato a `grade-de-eixos` (simetria × folhetos × celoma), mas são três
  critérios analíticos independentes, não dois eixos ortogonais cujo cruzamento gera
  quatro células — ver lacuna abaixo.
- Nenhum capítulo desta metade descreve uma tese sendo superada dialeticamente por sua
  antítese e uma síntese subsequente (`movimento-dialetico`), nem uma base que
  condiciona camadas subsequentes de forma assimétrica e irreversível
  (`camadas-de-determinacao` — os candidatos mais próximos, como o ciclo do carbono ou
  o ciclo do nitrogênio, são fluxos bidirecionais ou sequências, não uma base fixa que
  sustenta camadas posteriores sem retroagir).

## Lacunas (12 capítulos)

- **`biologia-alelos-multiplos-e-heranca-dos-grupos-sanguineos`** — o capítulo é regra
  de herança e cálculo de probabilidade (sistema ABO, fator Rh, eritroblastose), não
  uma classificação de tipos coexistentes nem uma cadeia causal única; a única
  hierarquia real do texto (*"hierarquia de dominância em série"*) descreve a pelagem
  de coelhos como exemplo lateral, não o sistema ABO em si, que é codominante e não
  hierárquico.

- **`biologia-arquitetura-corporal-dos-animais-e-o-filo-dos-platelmintos-e-dos-nematodeos`**
  — os três critérios de anatomia comparada (simetria, folhetos, celoma) são eixos
  analíticos, não uma grade de dois eixos com quatro células (`grade-de-eixos` exige
  exatamente dois eixos binários) nem uma tipologia de variantes coexistentes sob um
  único critério; a comparação platelminto/nematódeo é uma lista de diferenças
  estruturais, não uma rejeição explícita de posição teórica.

- **`biologia-artropodes-aracnideos`** — catálogo de características do grupo,
  importância médica por espécie e papel ecológico; nenhuma seção organiza esse
  conteúdo como tipos coexistentes sob critério comum, cadeia causal ou escala de grau.

- **`biologia-artropodes-insetos-crustaceos-e-miriapodes`** — mesmo padrão: catálogo
  de grupos (insetos, crustáceos, quilópodes, diplópodes) com traços próprios, sem
  guarda-chuva classificatório explícito que os una além do filo Arthropoda em si; a
  variação de peças bucais dos insetos é citada mas não é o eixo do capítulo.

- **`biologia-biotecnologia`** — três blocos de técnicas independentes (DNA
  recombinante, PCR/sequenciamento, transgenia/clonagem/CRISPR) sem uma classificação,
  cadeia ou escala que atravesse o capítulo inteiro; cada bloco tem sua própria lógica
  interna, mas não há um fio único que os amarre.

- **`biologia-ciclos-biogeoquimicos-ciclo-do-carbono`** — reservatórios e fluxos
  bidirecionais (fotossíntese retira, respiração devolve), não uma cadeia linear de
  derivação nem uma base fixa que condiciona camadas posteriores; o capítulo é sobre
  equilíbrio entre compartimentos, não sequência ou hierarquia.

- **`biologia-citoplasma-estrutura-e-componentes-i`** — mistura modelo de membrana,
  mecânica da osmose e catálogo de organelas (retículo, Golgi, ribossomos) sem uma
  família que cubra as três partes; forçar `tipologia` só para o transporte de
  membrana (passivo × ativo) deixaria de fora as organelas, que são o resto do
  capítulo.

- **`biologia-citoplasma-estrutura-e-componentes-ii`** — mesmo padrão: mitocôndria/
  cloroplasto (evidências endossimbióticas), lisossomos/peroxissomos e citoesqueleto
  são três blocos de organelas com lógicas próprias; o guarda-chuva de tipologia do
  citoesqueleto (*"formado por três tipos de filamento"*) cobre uma seção, não o
  capítulo.

- **`biologia-composicao-quimica-celular-compostos-inorganicos`** — água e sais
  minerais são descritos por propriedades e funções nominais (cada íon com seu papel),
  não por uma classificação com critério comum, cadeia causal ou escala; a divisão
  binária de sais em imobilizados/dissolvidos é rasa demais para sustentar `tipologia`
  sozinha, e o resto do capítulo (propriedades da água, teor de água por tecido) não
  segue essa divisão.

- **`biologia-coordenacao-endocrina-i`** — catálogo de glândulas e hormônios
  (hipófise, tireoide, paratireoides, pâncreas) com mecanismos próprios cada um; o eixo
  de retroalimentação que uniria o capítulo (`cadeia-de-derivacao`) só é explicitado no
  capítulo seguinte, Coordenação Endócrina II.

- **`biologia-coracao-e-vasos-sanguineos`** — os três adjetivos da circulação
  (fechada/dupla/completa), a distinção artéria/veia por sentido do fluxo e o ciclo
  cardíaco (sístole/diástole) são conteúdo qualitativamente diferente do que qualquer
  uma das oito famílias testa; não há tipos coexistentes sob critério comum, cadeia de
  derivação de um fato a outro, nem escala de grau.

- **`biologia-fisiologia-vegetal-hormonios-vegetais`** — cinco hormônios (auxinas,
  giberelinas, citocininas, etileno, ácido abscísico) cada um com mecanismo e efeitos
  próprios; não há frase-guarda-chuva que os apresente como tipos de uma mesma
  categoria com critério comum, e os mecanismos (tropismos, dominância apical,
  antagonismo ABA×giberelina) são explicações causais pontuais, não uma cadeia única
  que atravesse o capítulo.

## Contagem final da Parte A

| Família | Capítulos |
|---|---|
| `tipologia` | 9 |
| `cadeia-de-derivacao` | 12 |
| `escala-de-graus` | 2 |
| `contraste-de-posicoes` | 1 |
| `camadas-de-determinacao` | 0 |
| `movimento-dialetico` | 0 |
| `criterios-conjuntivos` | 0 |
| `grade-de-eixos` | 0 |
| **Lacuna** | **12** |
| **Total** | **36** |

## Lista dos 36 `chapterId` cobertos por esta Parte A

Para a dispatch da Parte B confirmar que não há sobreposição — estes são os primeiros
36 capítulos de Biologia por ordem de aparição em `deepSummaryContent.json`:

1. `biologia-alelos-multiplos-e-heranca-dos-grupos-sanguineos`
2. `biologia-algas`
3. `biologia-anelideos`
4. `biologia-arquitetura-corporal-dos-animais-e-o-filo-dos-platelmintos-e-dos-nematodeos`
5. `biologia-artropodes-aracnideos`
6. `biologia-artropodes-insetos-crustaceos-e-miriapodes`
7. `biologia-bioenergetica-fermentacao-e-respiracao`
8. `biologia-bioenergetica-fotossintese-e-quimiossintese`
9. `biologia-biomagnificacao`
10. `biologia-biomas-brasileiros`
11. `biologia-biotecnologia`
12. `biologia-ciclo-hidrologico-e-poluicao-da-agua`
13. `biologia-ciclo-do-nitrogenio`
14. `biologia-ciclos-biogeoquimicos-ciclo-do-carbono`
15. `biologia-ciclos-de-vida`
16. `biologia-citoplasma-estrutura-e-componentes-i`
17. `biologia-citoplasma-estrutura-e-componentes-ii`
18. `biologia-classificacao-biologica-nomenclatura-cientifica-e-nocoes-de-sistematica-filogenetica`
19. `biologia-composicao-quimica-celular-carboidratos-e-lipidios`
20. `biologia-composicao-quimica-celular-compostos-inorganicos`
21. `biologia-composicao-quimica-celular-proteinas-e-sua-funcao-estrutural`
22. `biologia-coordenacao-endocrina-i`
23. `biologia-coordenacao-endocrina-ii`
24. `biologia-coordenacao-nervosa-ii`
25. `biologia-coracao-e-vasos-sanguineos`
26. `biologia-cordados-tetrapodes`
27. `biologia-dinamica-de-populacoes`
28. `biologia-divisao-celular`
29. `biologia-embriologia-animal`
30. `biologia-equinodermos`
31. `biologia-especies-invasoras-e-controle-biologico`
32. `biologia-eutrofizacao`
33. `biologia-evolucao-biologica-construcao-historica`
34. `biologia-fisiologia-vegetal-hormonios-vegetais`
35. `biologia-fisiologia-vegetal-transporte-no-floema`
36. `biologia-fisiologia-da-coordenacao-nervosa-i`

A Parte B deve começar no 37º capítulo de Biologia em `deepSummaryContent.json`
(o primeiro cujo `topic` não está na lista de `topic`s acima) e seguir até o 72º.
