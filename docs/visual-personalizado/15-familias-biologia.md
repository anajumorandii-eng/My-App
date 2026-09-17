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

# Parte B — capítulos 37 a 72

Os 36 `chapterId` cobertos aqui foram obtidos cruzando `deepSummaryContent.json`
(`subject === "Biologia"`) com `src/data/summaryCurriculum.ts`: o `id` de cada
tópico do currículo, que também é o `chapterId` usado em `biologia.ts` (sem
prefixo `summary-`, ao contrário de Geografia — convenção já fixada pela Parte
A e mantida aqui). Cada um dos 36 restantes foi lido na íntegra e testado
contra as mesmas oito famílias, com o mesmo padrão de rigor: citação literal
ou lacuna com motivo específico.

## Atribuições por família

### `tipologia` (8 capítulos)

- **`biologia-fungos`** — guarda-chuva explícito organiza a seção de
  reprodução: *"Os grupos clássicos se organizam justamente pela estrutura
  que produz esses esporos sexuados. Zigomicetos, como o Rhizopus... formam
  zigósporo. Ascomicetos formam esporos dentro de ascos... Basidiomicetos
  formam esporos em basídios... Deuteromicetos era o grupo dos fungos sem
  reprodução sexuada conhecida."* Quatro grupos coexistentes sob o mesmo
  critério (estrutura reprodutiva), no mesmo padrão de algas/anelídeos da
  Parte A.

- **`biologia-heranca-sexual`** — quatro tipos de herança quanto à relação
  entre sexo e expressão gênica, com critério distintivo explícito: *"Herança
  restrita ao sexo, ou holândrica, é a de genes situados na porção exclusiva
  do Y... Herança influenciada pelo sexo envolve genes autossômicos, presentes
  em ambos os sexos, cuja dominância se inverte... Herança limitada pelo sexo,
  por fim, é a de genes autossômicos que só se expressam num dos sexos... O
  ponto que separa tudo isso: ligada ao sexo é questão de localização do gene
  no cromossomo sexual; influenciada e limitada são questões de expressão de
  genes autossômicos."* As duas primeiras seções detalham o primeiro tipo
  (ligada ao X); a terceira seção nomeia e contrasta os outros três.

- **`biologia-mecanismos-da-evolucao-biologica`** — guarda-chuva explícito:
  *"Sobre essa variação atuam os fatores que alteram as frequências alélicas"*,
  seguido de mutação, recombinação, *"A seleção natural... pode ser
  estabilizadora, quando favorece o fenótipo médio; direcional, quando favorece
  um dos extremos... ; ou disruptiva, quando favorece os dois extremos"*, *"A
  deriva genética é a variação aleatória das frequências por amostragem... o
  efeito do fundador... e o efeito gargalo"*, migração e isolamento
  reprodutivo — seis fatores coexistentes sob o mesmo critério (mecanismo que
  altera frequência alélica), que estruturam o corpo do capítulo.

- **`biologia-moluscos`** — *"As três classes principais se distinguem por
  características que a prova cobra diretamente. Gastrópodes... Bivalves...
  Cefalópodes..."* Três classes coexistentes sob critério comum, mesmo padrão
  de equinodermos/anelídeos da Parte A.

- **`biologia-mutacoes-genicas`** — guarda-chuva duplo cobrindo as duas
  primeiras seções: *"seus desfechos são três, com nomes que a banca cobra. A
  mutação silenciosa... A mutação de sentido trocado, ou missense... A mutação
  sem sentido, ou nonsense..."* e, para indels, *"Se a inserção ou deleção for
  de três bases, ou de um múltiplo de três, o quadro se mantém... É o caso da
  frameshift [quando não é múltiplo de três]"* — cinco tipos de mutação gênica
  coexistentes sob o critério "efeito sobre a proteína".

- **`biologia-protozoarios-e-protozooses`** — *"classificados tradicionalmente
  por sua estrutura locomotora, critério ainda útil para organizar o grupo em
  prova. Rizópodes... Flagelados... Ciliados... Esporozoários... são o único
  grupo sem estrutura locomotora."* Quatro tipos coexistentes; as seções de
  doenças e prevenção aplicam essa mesma classificação aos parasitas
  específicos (Plasmodium é esporozoário, Trypanosoma é flagelado), no mesmo
  padrão de suporte que Fungos.

- **`biologia-sangue-e-imunologia`** — duas seções conectadas formam uma
  tipologia de estratégias de defesa: *"A resposta imune organiza-se em duas
  linhas com características e velocidades muito diferentes"* (inata ×
  adaptativa) e *"Vacina e soro... atuam por mecanismos opostos, e essa
  distinção é o núcleo do tema... vacina... imunização ativa... soro... 
  imunização passiva"*, com a ligação explícita entre elas: *"é esse princípio
  de memória que sustenta a eficácia das vacinas."* Três tipos coexistentes
  (inata, ativa/vacina, passiva/soro) sob o critério "como a proteção é
  estabelecida".

- **`biologia-segunda-lei-de-mendel-e-interacao-genica`** — tipologia que
  cobre o capítulo inteiro, com cada seção sendo um tipo e dizendo-se
  explicitamente parente do anterior: interação gênica simples (*"dois ou mais
  genes... atuam conjuntamente para determinar uma única característica"*,
  crista de galinha), epistasia (*"é um tipo específico de interação gênica em
  que um gene mascara ou impede completamente a expressão de outro"*) e
  herança quantitativa (*"Diferentemente da interação gênica com poucos genes...
  a herança poligênica produz uma distribuição gradual"*) — três mecanismos
  coexistentes sob o critério "como múltiplos genes determinam uma única
  característica".

### `cadeia-de-derivacao` (5 capítulos)

- **`biologia-fisiologia-da-digestao`** — trajeto sequencial pelos órgãos, com
  cada etapa processando o que a anterior deixou: *"Na boca... a amilase
  salivar... inicia a quebra do amido... No estômago, o suco gástrico...
  desnatura proteínas e ativa o pepsinogênio em pepsina... No intestino
  delgado, o suco pancreático traz amilase, lipase, tripsina e quimotripsina...
  No intestino grosso não há digestão enzimática significativa; suas funções
  são a absorção de água e de sais."*

- **`biologia-fisiologia-da-excrecao`** — *"A formação da urina tem três
  etapas, e distingui-las é o núcleo do tema. A filtração glomerular ocorre
  por pressão... A reabsorção tubular devolve ao sangue o que é útil... A
  secreção tubular acrescenta ativamente ao túbulo substâncias..."* Três elos
  em sequência obrigatória, com o resultado (1,5 litro de urina) dependendo da
  ordem.

- **`biologia-origem-da-vida-e-as-primeiras-celulas`** — narrativa única em
  complexidade crescente que atravessa as três seções: biogênese estabelecida
  por Pasteur restringe o problema a um evento químico único; *"O experimento
  de Miller e Urey... obteve aminoácidos e outras moléculas orgânicas"*; *"Da
  sopa de monômeros orgânicos aos primeiros seres vivos, a hipótese propõe
  etapas de complexidade crescente. Monômeros... teriam se polimerizado em
  macromoléculas... formaram agregados coloidais chamados coacervados... O
  passo decisivo... é a aquisição de um sistema de replicação da informação
  hereditária."* Elos: biogênese/síntese abiótica → polimerização → 
  coacervados → sistema de replicação (mundo de RNA).

- **`biologia-traqueofitas-transpiracao-e-reposicao-rapida-de-agua`** — a
  teoria da tensão-coesão é encadeamento estrito: *"A transpiração... cria...
  uma pressão negativa (tensão) que se propaga por toda a coluna até a raiz.
  Essa propagação só é possível porque as moléculas de água se atraem entre si
  por pontes de hidrogênio (coesão)... O resultado é que... ela literalmente
  'puxa' a coluna inteira atrás de si... e é essa tração que suga mais água
  das raízes."* Elos: transpiração → tensão → coesão/adesão → absorção
  radicular, no mesmo padrão do transporte no floema da Parte A.

- **`biologia-virus`** — ciclo de replicação com etapas nomeadas em sequência
  obrigatória: *"segue um ciclo com etapas reconhecíveis... Na adsorção...
  Na penetração... Segue-se a replicação do material genético e a síntese de
  proteínas virais... Na montagem, novos capsídeos são organizados... Na
  liberação, as novas partículas saem da célula."* Cinco elos, no mesmo
  padrão de divisão celular/embriologia da Parte A.

### `escala-de-graus` (2 capítulos)

- **`biologia-plantas-terrestres-i-briofitas-e-pteridofitas`** — grau
  crescente de avanço evolutivo entre dois grupos, com o fio condutor
  explicitado: *"As pteridófitas... representam um avanço evolutivo importante
  sobre as briófitas: possuem tecidos condutores verdadeiros..."* e *"A
  dependência da água para a reprodução é o fio condutor que une briófitas e
  pteridófitas e as separa das gimnospermas e angiospermas."* Mesmo padrão do
  grau crescente de independência da água em cordados-tetrápodes na Parte A.

- **`biologia-sucessao-ecologica`** — degraus ordenados do pioneiro ao clímax,
  com traços que crescem monotonicamente ao longo da escala: *"Toda sucessão
  progride através de estágios reconhecíveis, do pioneiro ao clímax... A
  diversidade de espécies (riqueza) geralmente aumenta do estágio pioneiro ao
  clímax... A biomassa total acumulada também tende a aumentar... A
  estabilidade do ecossistema tende a aumentar."*

### `contraste-de-posicoes`, `camadas-de-determinacao`, `movimento-dialetico`,
`criterios-conjuntivos`, `grade-de-eixos` (0 capítulos cada nesta metade)

Nenhum capítulo desta metade sustentou genuinamente uma dessas cinco famílias
com citação literal cobrindo o capítulo inteiro. Candidatos que pareciam
próximos e foram descartados:

- `biologia-poluicao-aquecimento-global-pops-e-biorremediacao` parecia
  candidato a `criterios-conjuntivos` pelos POPs (*"compartilham três
  propriedades perigosas... são altamente resistentes... são lipossolúveis...
  e são capazes de se dispersar por longas distâncias"*), mas isso cobre só
  uma das três seções do capítulo — ver lacuna abaixo.
- `biologia-origem-da-vida-e-as-primeiras-celulas`, seção 1, parecia candidato
  a `contraste-de-posicoes` (abiogênese × biogênese, com Pasteur decidindo a
  favor da segunda), mas o capítulo inteiro se encaixa melhor como
  `cadeia-de-derivacao` contínua (ver acima), e a discussão histórica é o
  ponto de partida da cadeia, não uma disputa isolada.
- `biologia-introducao-aos-cordados-e-os-peixes`, seção 1, parecia candidato a
  `criterios-conjuntivos` (as quatro características dos cordados, presentes
  em algum momento do desenvolvimento), mas cobre só a primeira das três
  seções — ver lacuna abaixo.
- Nenhum capítulo desta metade descreve uma tese sendo superada
  dialeticamente por antítese e síntese (`movimento-dialetico`), nem duas
  variáveis independentes cujo cruzamento gera quatro células nomeadas
  (`grade-de-eixos`), nem uma base fixa condicionando camadas subsequentes de
  forma assimétrica e irreversível sem retroagir (`camadas-de-determinacao`).

## Lacunas (21 capítulos)

- **`biologia-fisiologia-da-respiracao`** — três blocos técnicos independentes
  (mecânica da ventilação, transporte de gases pela hemoglobina e pelo
  bicarbonato, controle bulbar pelo CO2), cada um com lógica própria, sem
  classificação, cadeia ou escala que atravesse o capítulo inteiro.

- **`biologia-fisiologia-da-sustentacao-e-da-locomocao`** — a tipologia dos
  três esqueletos (*"Três tipos de esqueleto sustentam os animais"*: 
  hidrostático, exo, endo) cobre só a primeira seção; as seções de
  articulações/tendões e de contração muscular (modelo dos filamentos
  deslizantes) são catálogo e mecanismo, não tipos coexistentes, cadeia nem
  escala.

- **`biologia-histologia-e-morfologia-vegetal`** — três blocos de tecido
  vegetal com lógicas próprias (meristemas classificados por posição/efeito;
  revestimento e sustentação; comparação xilema×floema); a comparação
  xilema×floema é a mais forte candidata, mas descreve dois tecidos opostos em
  função e trajeto, não uma tipologia de variantes coexistentes nem uma
  cadeia, e não estende às outras duas seções.

- **`biologia-introducao-aos-cordados-e-os-peixes`** — a definição conjuntiva
  dos cordados (*"Quatro características definem o filo... e todas aparecem em
  algum momento do desenvolvimento"*: notocorda, tubo nervoso dorsal, fendas
  faringianas, cauda pós-anal) cobre só a primeira seção; as duas seguintes,
  sobre peixes cartilaginosos/ósseos e osmorregulação por ambiente, são
  conteúdo diferente que essa definição não organiza.

- **`biologia-introducao-a-ecologia`** — dois eixos independentes e igualmente
  centrais disputam o capítulo: os níveis de organização encaixados (*"A
  ecologia se organiza em níveis encaixados... Espécie... População...
  Comunidade... Ecossistema... Bioma... Biosfera"*, uma escala) e a cadeia
  trófica com a regra dos 10% (*"cerca de 90% da energia se perde... apenas
  cerca de 10% se incorpora ao nível seguinte"*, um encadeamento). Nenhuma das
  duas cobre a outra metade do capítulo.

- **`biologia-introducao-a-genetica`** — vocabulário mendeliano básico e
  cálculo de cruzamento monoíbrido nas duas primeiras seções, sem
  classificação, cadeia ou escala; a lista de exceções ao modelo simples
  (dominância incompleta, codominância, polialelia, interação gênica, herança
  quantitativa) é tipologia real, mas só da última seção.

- **`biologia-ligacao-genica`** — o conteúdo é procedimento de cálculo
  (frequência de recombinação, centimorgan, ordem de três genes por
  distância) com ressalvas estatísticas sobre subestimação — o mesmo padrão
  de "regra e cálculo" que motivou a lacuna de Alelos Múltiplos na Parte A. A
  sequência conceitual "ligação → permutação → mapeamento" existe, mas o peso
  real do capítulo está no cálculo e nas ressalvas, não em elos que a cena
  possa mostrar sem reduzir o capítulo a uma fração dele.

- **`biologia-membranas-celulares`** — a fronteira seletiva, o modelo do
  mosaico fluido com os tipos de transporte e a leitura de tonicidade formam
  uma explicação mecanística contínua sobre a mesma estrutura, não tipos
  coexistentes sob critério comum; forçar tipologia só no par transporte
  passivo×ativo deixaria de fora a fronteira seletiva e a tonicidade, que são
  o resto do capítulo.

- **`biologia-mutacoes-cromossomicas-e-gametogenese`** — três tipologias
  distintas e desconectadas sob critérios diferentes (*"dividem-se em duas
  famílias"*, estrutural×numérica; espermatogênese×ovogênese; catálogo de
  síndromes por cariótipo), no mesmo padrão que gerou a lacuna do Citoplasma
  II na Parte A — nenhuma cobre o capítulo inteiro.

- **`biologia-morfofisiologia-vegetal-caules-e-folhas`** — o capítulo bundla
  dois órgãos com tipologias próprias e não relacionadas: tipos de caule
  (*"o rizoma é... o tubérculo é... o bulbo é..."*, entre outros) e adaptações
  foliares por ambiente (*"Xerófitas... Hidrófitas... Halófitas..."*),
  separados por uma seção puramente descritiva de histologia foliar que não é
  tipológica; nenhum critério único une caule e folha, no mesmo padrão do
  bundle de dois assuntos que gerou a lacuna de Caules e Folhas e de Sistemas
  Sensoriais.

- **`biologia-nucleo-celular`** — mistura catálogo de estruturas (carioteca,
  poros, nucléolo), estados de condensação da cromatina (eucromatina ×
  heterocromatina) e mecanismo de transcrição, sem família que cubra as três
  partes — mesmo padrão do Citoplasma I/II na Parte A.

- **`biologia-plantas-terrestres-ii-gimnospermas-e-angiospermas`** — a escala
  de independência da água entre gimnospermas e angiospermas (continuação do
  eixo de Plantas Terrestres I) cobre só as duas primeiras seções; a terceira
  classifica monocotiledôneas×eudicotiledôneas por um critério totalmente
  diferente (número de cotilédones), quebrando a unidade em torno de um único
  eixo.

- **`biologia-poluicao-do-ar`** — catálogo de poluentes com fontes e efeitos
  distintos (particulado, CO, SO2, NOx, O3), mais dois fenômenos meteorológicos
  (chuva ácida, inversão térmica) e o contraste de papel do ozônio por
  altitude; cada seção tem lógica causal própria e não conectada às demais.

- **`biologia-poluicao-aquecimento-global-pops-e-biorremediacao`** — três
  blocos independentes (efeito estufa/aquecimento, POPs, biorremediação); os
  POPs têm três critérios conjuntivos genuínos, mas isso cobre só uma seção —
  o capítulo reúne três assuntos ambientais distintos sob o título "Poluição",
  sem fio único.

- **`biologia-poriferos-e-cnidarios`** — o salto organizacional
  poríferos→cnidários é uma escala de apenas dois itens e não inclui a
  tipologia pólipo×medusa da terceira seção; nenhuma das duas famílias cobre o
  capítulo inteiro.

- **`biologia-procariotos`** — três tipologias desconectadas sob critérios
  diferentes (Gram+/−; classificação metabólica por fonte de energia e por
  necessidade de O2; três mecanismos de variabilidade genética — transformação,
  transdução, conjugação) — mesmo padrão do Citoplasma II na Parte A.

- **`biologia-proteinas-enzimas`** — o corpo do capítulo (catálise, encaixe
  induzido, curvas de temperatura e pH) é explicação mecanística contínua; só
  a última seção tem tipologia real (inibição competitiva × não competitiva),
  e ela não organiza o resto do capítulo.

- **`biologia-reproducao-humana-e-metodos-contraceptivos`** — três blocos de
  natureza diferente (comparação anatômica homem×mulher, cadeia hormonal do
  ciclo menstrual, tipologia dos métodos contraceptivos por mecanismo de
  ação); os métodos contraceptivos por si sós seriam tipologia legítima, mas
  não cobrem a anatomia nem o ciclo, que são a maior parte do capítulo.

- **`biologia-segunda-lei-de-mendel`** — o conteúdo é o enunciado da lei e
  procedimento de cálculo combinatório (proporção 9:3:3:1, potência de 2 para
  número de gametas), no mesmo padrão de regra-e-cálculo que motivou a lacuna
  de Alelos Múltiplos na Parte A; não há classificação, cadeia de elos nem
  escala de grau.

- **`biologia-sistemas-sensoriais-visao-e-audicao`** — o capítulo reúne dois
  sentidos diferentes: visão, com uma tipologia real de defeitos (miopia,
  hipermetropia, presbiopia), e audição, com uma cadeia de transdução real em
  três etapas anatômicas (*"cadeia de transdução em três etapas anatômicas.
  No ouvido externo... No ouvido médio... No ouvido interno"*); nenhuma das
  duas famílias cobre o outro sentido, e o próprio título já anuncia dois
  assuntos, não um.

- **`biologia-acidos-nucleicos`** — três blocos com lógicas diferentes:
  comparação estrutural DNA×RNA (nem classificação nem cadeia), mecanismo de
  replicação semiconservativa (cadeia interna própria: helicase, polimerase,
  fita líder/tardia) e o dogma central transcrição→tradução (outra cadeia, de
  conversão de informação, não de cópia de DNA). O texto não liga replicação a
  transcrição como elos de uma mesma sequência — juntar as duas cadeias numa
  só seria fabricar a ligação que a fonte não afirma.

## Contagem final da Parte B

| Família | Capítulos |
|---|---|
| `tipologia` | 8 |
| `cadeia-de-derivacao` | 5 |
| `escala-de-graus` | 2 |
| `contraste-de-posicoes` | 0 |
| `camadas-de-determinacao` | 0 |
| `movimento-dialetico` | 0 |
| `criterios-conjuntivos` | 0 |
| `grade-de-eixos` | 0 |
| **Lacuna** | **21** |
| **Total** | **36** |

## Contagem consolidada — Parte A + Parte B (72 capítulos)

| Família | Parte A | Parte B | Total |
|---|---|---|---|
| `tipologia` | 9 | 8 | 17 |
| `cadeia-de-derivacao` | 12 | 5 | 17 |
| `escala-de-graus` | 2 | 2 | 4 |
| `contraste-de-posicoes` | 1 | 0 | 1 |
| `camadas-de-determinacao` | 0 | 0 | 0 |
| `movimento-dialetico` | 0 | 0 | 0 |
| `criterios-conjuntivos` | 0 | 0 | 0 |
| `grade-de-eixos` | 0 | 0 | 0 |
| **Lacuna** | **12** | **21** | **33** |
| **Total** | **36** | **36** | **72** |

## Lista dos 36 `chapterId` cobertos por esta Parte B

1. `biologia-origem-da-vida-e-as-primeiras-celulas`
2. `biologia-membranas-celulares`
3. `biologia-nucleo-celular`
4. `biologia-proteinas-enzimas`
5. `biologia-acidos-nucleicos`
6. `biologia-mutacoes-cromossomicas-e-gametogenese`
7. `biologia-introducao-a-genetica`
8. `biologia-heranca-sexual`
9. `biologia-segunda-lei-de-mendel`
10. `biologia-segunda-lei-de-mendel-e-interacao-genica`
11. `biologia-ligacao-genica`
12. `biologia-mutacoes-genicas`
13. `biologia-mecanismos-da-evolucao-biologica`
14. `biologia-introducao-a-ecologia`
15. `biologia-sucessao-ecologica`
16. `biologia-poluicao-do-ar`
17. `biologia-poluicao-aquecimento-global-pops-e-biorremediacao`
18. `biologia-protozoarios-e-protozooses`
19. `biologia-poriferos-e-cnidarios`
20. `biologia-moluscos`
21. `biologia-introducao-aos-cordados-e-os-peixes`
22. `biologia-fungos`
23. `biologia-plantas-terrestres-i-briofitas-e-pteridofitas`
24. `biologia-plantas-terrestres-ii-gimnospermas-e-angiospermas`
25. `biologia-procariotos`
26. `biologia-virus`
27. `biologia-fisiologia-da-sustentacao-e-da-locomocao`
28. `biologia-fisiologia-da-digestao`
29. `biologia-sangue-e-imunologia`
30. `biologia-fisiologia-da-respiracao`
31. `biologia-fisiologia-da-excrecao`
32. `biologia-sistemas-sensoriais-visao-e-audicao`
33. `biologia-reproducao-humana-e-metodos-contraceptivos`
34. `biologia-histologia-e-morfologia-vegetal`
35. `biologia-morfofisiologia-vegetal-caules-e-folhas`
36. `biologia-traqueofitas-transpiracao-e-reposicao-rapida-de-agua`

Junto com os 36 da Parte A, estes fecham os 72 capítulos de Biologia — sem
sobreposição e sem faltantes (conferido por `familias-biologia.test.ts`).
