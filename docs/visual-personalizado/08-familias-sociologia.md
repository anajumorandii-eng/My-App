# 08 — Inventário de famílias de cena de Sociologia

Este documento registra, para os 27 capítulos de Sociologia em
`src/data/deepSummaryContent.json`, a qual família de cena-âncora cada um
foi atribuído, ou por que ficou sem cena. A leitura foi feita seção por
seção de cada capítulo — a atribuição abaixo é definitiva e corrige, em
vários pontos, a hipótese de partida do plano, que havia sido derivada só
dos títulos das seções.

**Revisão pós-review (2026-09-15):** uma primeira versão deste documento
cometeu um erro sistemático — leu "o capítulo avisa contra uma confusão
entre X e Y" como se fosse "X e Y são posições rivais". Uma confusão a
evitar não é uma rivalidade: numa confusão os dois termos continuam
válidos e distintos ao mesmo tempo (é isso que torna a confusão possível);
numa rivalidade, adotar um dos termos exclui o outro. Seis capítulos foram
recolocados por esse motivo, e uma terceira família nova
(`grade-de-eixos`) foi criada para dois capítulos que uma primeira leitura
havia tratado de forma inconsistente (um forçado em `contraste-de-posicoes`,
o outro descartado como lacuna, apesar de terem a mesma estrutura). A
distribuição abaixo já reflete a correção; a defesa "a proporção espelha
Filosofia" foi removida por não se sustentar (40% aqui, 56% em Filosofia) e
por Filosofia ter, ela mesma, um caso comprovado de encaixe forçado
(Alienação e Mais-Valia em `camadas-de-determinacao` pela palavra
"interligadas").

Este inventário ainda **não** é executável: `src/views/topic-scenes/data/sociologia.ts`
contém apenas o esqueleto (`sociologia: []` e a lacuna declarada). As Tasks
2-4 escrevem as entradas, família por família, lendo de novo cada capítulo
para citar seção e trecho literais.

## Tabela de atribuição definitiva

| Família | Estrutura | Capítulos |
|---|---|---|
| `contraste-de-posicoes` | Respostas rivais à mesma pergunta — adotar uma exclui a outra | O Contexto Histórico do Surgimento da Sociologia; Sociologia e Senso Comum; A Luta de Classes na Análise Sociológica; Cultura e Etnocentrismo; Multiculturalismo e Relativismo Cultural; Desigualdade Racial no Brasil; Divisão Social do Trabalho; Transformações no Mundo do Trabalho (8) |
| `tipologia` | Tipos ideais paralelos que coexistem e se combinam num mesmo caso concreto | Tipos de Ação Social; Dominação e Poder em Weber; Democracia e Participação Política; Movimentos Sociais Clássicos e Contemporâneos; Globalização Econômica e Cultural; O Estado-Nação na Era Global (6) |
| `criterios-conjuntivos` **(nova)** | Condições que só definem o fenômeno quando valem todas ao mesmo tempo | O que é o Fato Social; A Sociedade da Informação; Identidade e Diferença (3) |
| `cadeia-de-derivacao` | Passos encadeados; remover um elo quebra a conclusão | Ética Protestante e o Espírito do Capitalismo; Educação e Socialização em Durkheim; Precarização e Uberização do Trabalho; Desigualdade de Gênero (4) |
| `grade-de-eixos` **(nova)** | Tipos gerados pelo cruzamento de dois eixos independentes; os próprios eixos são o conteúdo ensinado | Anomia e Coesão Social; Classes Sociais e Mobilidade Social (2) |
| `camadas-de-determinacao` | Uma camada condiciona a outra | Modo de Produção e Estrutura Social; Ideologia e Alienação (2) |
| `escala-de-graus` | Degraus ordenados entre dois extremos | Cidadania e Direitos (1) |
| `movimento-dialetico` | — | nenhum capítulo de Sociologia apresenta o ciclo de três momentos (0) |
| *sem cena* | — | Solidariedade Mecânica e Solidariedade Orgânica (1) |

Total: 8 + 6 + 3 + 4 + 2 + 2 + 1 + 0 + 1 = 27 capítulos.

## O erro corrigido: confusão não é rivalidade

Uma primeira leitura colocou em `contraste-de-posicoes` todo capítulo cuja
seção "Pegadinhas frequentes" avisasse contra confundir X com Y, ou que
descrevesse uma tensão entre dois fatores igualmente verdadeiros. Isso é
categoricamente diferente de uma rivalidade: quando o capítulo diz
"**também**", "**coexistem**", "**ao mesmo tempo**", "**não é
incompatível**" ou equivalente, ele está dizendo que os dois termos
permanecem válidos simultaneamente — o oposto de "só um pode estar certo".
Seis capítulos foram recolocados por esse critério; o texto de cada um está
citado abaixo, na família correta.

## Atribuição capítulo a capítulo (com justificativa para todo desvio da hipótese)

### `contraste-de-posicoes` (8)

- **O Contexto Histórico do Surgimento da Sociologia** — os três clássicos
  respondem de forma divergente à pergunta "qual é o objeto próprio da
  sociologia?": fato social (Durkheim), relações de produção (Marx), ação
  social dotada de sentido (Weber). O capítulo avisa contra o erro de
  lê-los como concordantes: *"supor que os clássicos concordavam entre si,
  quando divergem quanto ao objeto e ao método"*. **Chamada contestada —
  ver seção própria abaixo**: o capítulo também diz que "as três continuam
  sendo o eixo do ensino de sociologia no Brasil", o que poderia sugerir
  `tipologia`; mantida em `contraste-de-posicoes` pela razão exposta lá.
- **Sociologia e Senso Comum** — contraste de duas vias de conhecer a vida
  social: o senso comum, que "orienta a vida cotidiana e frequentemente
  funciona", e a sociologia, que exige "ruptura com as pré-noções". Dois
  polos, não uma escala. *(Placement fino, thin — deferido para revisão
  fina nas Tasks 3-4, ver Minor no relatório da tarefa.)*
- **A Luta de Classes na Análise Sociológica** — Marx, Weber e Bourdieu dão
  respostas distintas a "o que define a posição de alguém na estrutura
  social?": posição nas relações de produção; status e poder somados à
  classe; capitais econômico/cultural/social. O capítulo nomeia isso
  quadros teóricos próprios, não correções de um pelo outro — mantém-se
  rivalidade genuína de definição, não confusão a evitar.
- **Cultura e Etnocentrismo** — contraste entre julgar outras culturas pelo
  próprio padrão (etnocentrismo) e o exercício de "estranhar o familiar e
  familiarizar o estranho". *(Thin, deferido — Minor.)*
- **Multiculturalismo e Relativismo Cultural** — contraste entre
  relativismo metodológico (ferramenta de pesquisa) e relativismo moral
  radical ("nenhum juízo entre culturas é possível"), com o capítulo
  afirmando que confundi-los é o erro central — mas aqui a "pegadinha" é
  sobre confundir dois **conceitos**, não sobre dois fatos que coexistem: o
  capítulo nega que sejam a mesma coisa, não afirma que ambos valem ao
  mesmo tempo sobre o mesmo caso. É rivalidade de definição, mantida.
- **Desigualdade Racial no Brasil** — contraste entre o mito da democracia
  racial e a tese do racismo estrutural sustentada por Florestan Fernandes,
  Clóvis Moura e Lélia Gonzalez — o capítulo afirma que o mito "encobre"
  desigualdades reais, ou seja, uma tese é falsa e a outra correta; não é
  uma coexistência de verdades parciais.
- **Desigualdade de Gênero** — *movido para `cadeia-de-derivacao` na
  auditoria final; ver a seção "Verificação" ao fim deste documento.*
- **Divisão Social do Trabalho** — ver seção de resolução de sobreposição
  abaixo.
- **Transformações no Mundo do Trabalho** — "o debate opõe quem prevê
  desemprego tecnológico massivo e quem aponta a criação de novas
  ocupações": duas respostas apresentadas como um debate em aberto, e não
  como dois fatores que o capítulo afirma coexistirem — mantido aqui por
  ausência de qualquer "também"/"ao mesmo tempo" que uniria as duas teses.

### `tipologia` (6)

**Estrutura:** tipos ideais paralelos que coexistem e se combinam num
mesmo caso concreto. Nenhuma das cinco famílias de Filosofia admite essa
coexistência — `contraste-de-posicoes` pressupõe que adotar uma posição
exclui a outra.

- **Tipos de Ação Social** — capítulo que origina a família. Citação
  literal: *"São tipos ideais: na realidade, as ações costumam combinar
  mais de um tipo."*
- **Dominação e Poder em Weber** — *"supor que os tipos aparecem puros na
  realidade, quando se combinam em casos concretos."*
- **Democracia e Participação Política** — *"A participativa combina
  representação com instrumentos de intervenção direta."*
- **Movimentos Sociais Clássicos e Contemporâneos** — *"os novos
  movimentos sociais substituíram os clássicos, quando coexistem e
  frequentemente se articulam"* é listado como erro a evitar.
- **Globalização Econômica e Cultural** — recolocado de
  `contraste-de-posicoes`. "As respostas variam: homogeneização em certos
  consumos, hibridismo... e reforço de identidades locais" não é uma
  disputa entre escolas: o texto já localiza a homogeneização "em certos
  consumos" (não em todos), e a pegadinha confirma que tratar isso como
  homogeneização total "ignora hibridismo e resistências locais" — os três
  fenômenos co-ocorrem em domínios diferentes da mesma sociedade
  globalizada, o padrão de `tipologia`, não de rivalidade.
- **O Estado-Nação na Era Global** — recolocado de
  `contraste-de-posicoes`. O capítulo afirma os dois polos ao mesmo tempo:
  *"Apesar disso, o Estado não desapareceu"* e depois *"tensão permanente
  entre soberania e interdependência"*; a pegadinha nega explicitamente que
  sejam sucessivos: *"supor que nacionalismo e globalização são fenômenos
  sucessivos, quando coexistem e se alimentam mutuamente"*. Entre
  `tipologia` e `criterios-conjuntivos`, coube `tipologia`: soberania
  relativizada, persistência do Estado e nacionalismo não são condições que
  precisam valer todas ao mesmo tempo para definir um conceito (o que
  pediria `criterios-conjuntivos`), são forças paralelas que coexistem e se
  reforçam mutuamente num mesmo Estado real — o mesmo padrão de "coexistem
  e se combinam" que originou a família em Weber.

### `criterios-conjuntivos` (3)

**Estrutura:** condições que só definem o fenômeno quando valem todas ao
mesmo tempo; nenhuma das cinco famílias de Filosofia representa isso —
não há ordem (não é `escala-de-graus`), nenhuma decorre causalmente da
anterior (não é `cadeia-de-derivacao`), não há base que condiciona as
demais (não é `camadas-de-determinacao`), e não disputam a mesma resposta
(não é `contraste-de-posicoes`).

- **O que é o Fato Social** — capítulo que origina a família. Citação
  literal: *"Durkheim define fato social por três traços: exterioridade...
  coercitividade... e generalidade."* Prova de uso conjunto na seção
  "Pratique e confira": a língua é fato social exemplar por "reunindo
  exterioridade, coerção e generalidade".
- **A Sociedade da Informação** — *"O acesso é desigual em várias camadas:
  disponibilidade de conexão e dispositivos, qualidade do acesso e
  capacidade de uso crítico"*, confirmado por *"além de conexão e
  dispositivo, é preciso qualidade de acesso e competências"*. **Chamada
  contestada** — ver seção própria abaixo: a ordem em que as três condições
  aparecem (conexão → qualidade → uso crítico) também poderia ler-se como
  escada de pré-requisitos (`escala-de-graus`); mantida aqui pela razão
  exposta na seção de chamadas contestadas.
- **Identidade e Diferença** — recolocado de `camadas-de-determinacao`
  (correção crítica pós-review). A citação usada antes — *"reconhecer
  identidades sem enfrentar desigualdades materiais deixa a questão pela
  metade"*, glosada no Pratique como "insuficiente se as desigualdades
  materiais permanecem intocadas" — não descreve uma base que **produz**
  a camada superior (o capítulo nunca diz que a desigualdade material
  gera ou explica a identidade), descreve duas metades que precisam valer
  **as duas** para a questão ficar resolvida: reconhecimento e
  redistribuição, nenhum sozinho basta. É exatamente o padrão do Fato
  Social (condições conjuntas, sem hierarquia entre elas), não o padrão de
  Modo de Produção (base que condiciona superestrutura). Esse era o mesmo
  defeito que produziu o encaixe forçado de "Alienação e Mais-Valia" em
  `camadas-de-determinacao` na Fase 1 de Filosofia (squeeze pela palavra
  "interligadas") — corrigido aqui antes de virar código.

**Sobre "Cidadania e Direitos" — a família não se sustentou para este
capítulo.** O plano listava Cidadania e Direitos junto com Fato Social.
Lido o capítulo, a estrutura de Marshall é uma sequência histórica
ordenada, não uma lista de condições simultâneas: *"Marshall distingue
direitos civis... políticos... e sociais"*, e o próprio capítulo trata a
ordem como o ponto central da comparação: *"No Brasil, a sequência foi
distinta da inglesa: direitos sociais foram concedidos antes da ampliação
plena dos direitos políticos."* Isso é `escala-de-graus` (degraus
ordenados, e o que muda é justamente a ordem), não `criterios-conjuntivos`.

### `cadeia-de-derivacao` (3)

**Estrutura:** passos encadeados; remover um elo quebra a conclusão.

- **Ética Protestante e o Espírito do Capitalismo** — a seção "O mecanismo"
  narra uma corrente de dependência estrita: doutrina da predestinação →
  angústia sobre a salvação → êxito no trabalho lido como sinal de graça →
  ascese intramundana (recusa do consumo) → acumulação e reinvestimento
  sistemáticos → espírito do capitalismo. Quebrar um elo desfaz a
  conclusão sobre a acumulação.
- **Educação e Socialização em Durkheim** — recolocado de
  `contraste-de-posicoes` (correção crítica pós-review). A citação usada
  antes — a escola "**também** reproduz desigualdades de origem social" —
  tem "também" no meio: as duas leituras (escola integradora e escola que
  reproduz desigualdade) valem **ao mesmo tempo**, não são rivais, o que a
  pegadinha confirma ao dizer que o erro é descrever a escola como neutra
  "sem considerar as críticas posteriores" — ou seja, o aluno deve manter
  as duas ideias, não escolher uma. A estrutura real do capítulo é uma
  cadeia, na seção "A função da educação" e no Pratique: educação transmite
  normas e valores → produz homogeneidade mínima → sustenta a coesão →
  torna a vida coletiva possível. Remover o elo "formar o ser social no
  indivíduo" quebra a conclusão sobre a coesão.
- **Precarização e Uberização do Trabalho** — recolocado de
  `contraste-de-posicoes` (correção importante pós-review). "Autonomia
  formal vs. autonomia real" é rotulado pelo próprio capítulo como "o erro
  central" — uma confusão a desfazer, não uma rivalidade entre duas teses
  válidas. A estrutura real está no Pratique: o algoritmo define preço,
  distribuição de tarefas, avaliação e possibilidade de bloqueio → isso
  configura subordinação → logo a classificação do entregador como
  autônomo é questionável. Remover o elo do controle algorítmico
  (distribuição/avaliação/bloqueio) quebra a conclusão sobre subordinação.

### `grade-de-eixos` (nova família, 2)

**Por que nenhuma das outras seis famílias representa essa estrutura:**
nestes dois capítulos, os tipos não são escolhidos de uma lista pronta —
são **gerados pelo cruzamento de dois eixos independentes**, e são os
próprios eixos que constituem o conteúdo ensinado, não apenas os tipos
resultantes. Isso é diferente de:
- `tipologia`, porque ali os tipos já vêm prontos e o que se ensina é que
  eles se combinam num caso real; aqui um caso pertence a exatamente uma
  célula da grade, e o que se ensina é a lógica que gera as células
  (o cruzamento dos eixos), não a combinação de tipos;
- `escala-de-graus`, porque há dois eixos ortogonais, não um único
  continuum entre dois extremos;
- `criterios-conjuntivos`, porque as células da grade são alternativas
  (excludentes entre si — um caso cai numa célula, não em várias), não
  condições que precisam valer todas ao mesmo tempo;
- `contraste-de-posicoes`, porque as células não disputam a mesma
  resposta — são categorias que resultam de posições diferentes nos dois
  eixos, aplicáveis a casos diferentes.

- **Anomia e Coesão Social** — capítulo que origina a família. A seção "O
  estudo sobre o suicídio" cruza dois eixos — integração (insuficiente ou
  excessiva) e regulação (insuficiente ou excessiva) — gerando os quatro
  tipos: *"Distingue o egoísta, por integração insuficiente; o altruísta,
  por integração excessiva; o anômico, por falta de regulação; e o
  fatalista, por regulação opressiva."* Os eixos (integração, regulação)
  são o que o capítulo realmente ensina; os quatro nomes são apenas os
  produtos do cruzamento.
- **Classes Sociais e Mobilidade Social** — mesma estrutura, na seção
  "Tipos de mobilidade": *"A mobilidade pode ser vertical... ou
  horizontal... Pode ser intrageracional... ou intergeracional."* Dois
  eixos independentes (direção do movimento; escala temporal) cruzam-se
  para produzir os tipos de mobilidade — e o capítulo trata o cruzamento
  como o ponto central: a medida "mais usada para avaliar abertura de uma
  sociedade" é justamente uma célula específica da grade (vertical ×
  intergeracional), não um tipo isolado de uma lista plana. Na primeira
  versão deste documento este capítulo foi forçado em
  `contraste-de-posicoes` (como se marxismo/weberianismo/Bourdieu, da
  seção anterior "Estratificação", fossem a mesma coisa que verticalidade
  e geração) — a seção "Tipos de mobilidade" é uma unidade estrutural
  distinta dentro do capítulo e pede `grade-de-eixos`.

### `camadas-de-determinacao` (2)

- **Modo de Produção e Estrutura Social** — o capítulo que melhor
  representa a família: *"A base econômica condiciona a superestrutura
  jurídica, política e ideológica, que por sua vez atua sobre a base."*
  `items[0]` é a base econômica.
- **Ideologia e Alienação** — a ideologia e o fetichismo da mercadoria são
  descritos como aparência que oculta a camada de baixo (as relações reais
  de exploração e trabalho): *"ocultando o trabalho social que a
  produziu"*. A camada de base (relações de produção) condiciona a camada
  de aparência (forma-mercadoria, ideologia) — aqui há assimetria real de
  produção (a base gera a aparência), diferente de Identidade e Diferença,
  onde nenhuma das duas metades produz a outra.

### `escala-de-graus` (1)

- **Cidadania e Direitos** — os três (depois quatro, com direitos difusos e
  digitais) tipos de direito formam uma sequência histórica ordenada em
  que o que muda a cada degrau é o âmbito de proteção (liberdade
  individual → participação política → condições materiais →
  temas difusos/tecnológicos), e o próprio capítulo usa a comparação
  Brasil/Inglaterra para mostrar que a ordem é o dado relevante. *(A
  esticada de "dois extremos" para uma escala de quatro gerações é
  reconhecida como ponto fino — Minor, deferido.)*

### `movimento-dialetico` (0)

Nenhum capítulo de Sociologia apresenta o ciclo de exatamente três
momentos — um momento, sua negação genuína e uma terceira etapa que
transforma ambos — que define esta família em Filosofia (Hegel, Nietzsche,
método socrático). Divisão Social do Trabalho foi o candidato mais próximo
por ter duas leituras (Durkheim/Marx) mas não uma terceira etapa que as
supere; por isso foi para `contraste-de-posicoes` e não para cá (ver
resolução de sobreposição abaixo). Nenhuma família nova foi criada para
preencher esta linha à força: zero capítulos é um resultado honesto, não
uma lacuna a corrigir.

## Resolução da sobreposição: "Divisão Social do Trabalho"

O plano listava este capítulo em `contraste-de-posicoes` **e** em
`movimento-dialetico`. Lido o capítulo, a seção "Duas leituras" apresenta
Durkheim (divisão do trabalho como fonte de solidariedade orgânica e coesão)
e Marx (divisão do trabalho como alienação e exploração) como duas leituras
do mesmo processo com avaliações opostas — sem qualquer terceira etapa que
as sintetize ou transforme. Citação literal: *"As duas leituras descrevem o
mesmo processo com avaliações opostas."* Note-se a diferença para os casos
recolocados acima: aqui o capítulo diz "opostas", não "também" ou
"coexistem" — é rivalidade avaliativa real (as duas leituras julgam o
mesmo fato de forma contrária), não complementaridade. Isso é exatamente
`contraste-de-posicoes` (respostas rivais à mesma pergunta: "o que a
divisão do trabalho faz à sociedade?") e não `movimento-dialetico`, que
exige um terceiro momento que cancele, preserve e eleve os dois anteriores
— nada disso aparece no capítulo. **Resolvido: `contraste-de-posicoes`.**

## Chamadas contestadas (evidência real, mas não decisiva)

Dois posicionamentos foram decididos com evidência textual real, mas não
conclusiva. Registrados aqui para que as Tasks 3-4 vejam a alternativa
rejeitada e o porquê, em vez de herdar uma decisão apresentada como óbvia.

**A Sociedade da Informação — `criterios-conjuntivos` vs. `escala-de-graus`.**
As três condições (conexão → qualidade → uso crítico) também podem ser
lidas como uma escada de pré-requisitos, já que o texto as lista nessa
ordem e o "Pratique e confira" as apresenta cumulativamente ("além de
conexão e dispositivo, é preciso..."). O teste usado para decidir foi: uma
condição **produz** a seguinte, ou as três são exigidas **juntas** sem
relação causal entre si? O capítulo nunca diz que ter conexão causa ter
qualidade de acesso, nem que ter qualidade de acesso causa capacidade de
uso crítico — são três recursos distintos (infraestrutura, qualidade de
serviço, competência pessoal) que uma pessoa pode ter em qualquer
combinação, e a exclusão só desaparece quando as três estão presentes.
Isso pesa para `criterios-conjuntivos`, mas a leitura como escada de
pré-requisitos permanece defensável e as Tasks 3-4 devem revisitá-la ao
escrever os `SceneItem`s.

**O Contexto Histórico do Surgimento da Sociologia — `contraste-de-posicoes`
vs. `tipologia`.** A frase *"As três continuam sendo o eixo do ensino de
sociologia no Brasil"* sugere três matrizes coexistentes, nenhuma
derrotada, o padrão de `tipologia`. Decisão mantida em
`contraste-de-posicoes` porque essa frase fala do **status curricular**
das três matrizes hoje (todas continuam sendo ensinadas), não da relação
**teórica** entre elas — e a frase que define a relação teórica é outra,
explícita sobre desacordo: *"supor que os clássicos concordavam entre si,
quando divergem quanto ao objeto e ao método."* Isso contrasta com os seis
capítulos recolocados nesta revisão, onde a frase-chave nega explicitamente
a rivalidade no nível do próprio conteúdo (ex.: Estado-Nação — "coexistem e
se alimentam mutuamente" fala da relação entre os fenômenos, não de
currículo). Aqui não há uma frase equivalente sobre o objeto/método em si —
"continuam sendo o eixo do ensino" e "divergem quanto ao objeto e ao
método" respondem a perguntas diferentes (o que se ensina vs. o que cada
um afirma), então não se cancelam. Mantido `contraste-de-posicoes`, mas
registrado como decisão discutível.

## Lacuna declarada (1)

**Solidariedade Mecânica e Solidariedade Orgânica**
(`summary-sociologia-solidariedade-mecanica-e-solidariedade-organica`) fica
sem cena-âncora porque já tem experiência interativa própria (`solidarity`
em `src/views/topic-experiments/catalog.ts`), exibida no mesmo slot do
fluxo de Explorar — mesmo motivo do gap único de Filosofia.

Anomia e Coesão Social, gapeada numa primeira versão deste documento, não é
mais uma lacuna: pertence a `grade-de-eixos` (ver acima). Manter a lacuna
teria repetido, na direção oposta, o mesmo erro cometido com Classes
Sociais e Mobilidade Social — tratar a mesma estrutura de forma
inconsistente conforme o capítulo.

## Verificação

- Cobertura: 26 capítulos atribuídos a família (skeleton de dados vazio
  nesta tarefa — as entradas serão escritas nas Tasks 2-4) e 1 lacuna
  declarada, somando os 27 capítulos de Sociologia.
- `npx vitest run src/views/topic-scenes/familias-sociologia.test.ts`:
  falha de propósito no primeiro caso ("cobre os 27 capítulos..."), listando
  os 26 ids ainda sem entrada em `sociologia[]`. Os outros dois casos
  (ids existentes; motivo de cada lacuna) passam. Ver saída completa no
  relatório da tarefa.

## Nota sobre famílias novas

Este documento registra três famílias que as cinco de Filosofia
(`src/views/topic-scenes/types.ts`) não representam: `tipologia`,
`criterios-conjuntivos` e `grade-de-eixos`. As três nasceram de citação
literal do capítulo que as motivou (Tipos de Ação Social; O que é o Fato
Social; Anomia e Coesão Social respectivamente), não do título das seções.
Enquanto o tipo `SceneFamily` não for atualizado (fora do escopo desta
tarefa), estas três famílias existem apenas neste documento e no motivo
registrado nos comentários de código; sua entrada em `SceneFamily` e nas
entradas de `sociologia[]` é trabalho das Tasks 2-4.

## Verificação final (auditoria cruzada das 26 entradas)

Segunda passagem, independente das revisões por tarefa, sobre as 26
entradas juntas — o tipo de padrão que uma revisão de tarefa isolada não
enxerga. Na Fase 1 (Filosofia) uma auditoria equivalente pegou 3 defeitos
que haviam passado pelas revisões individuais.

### Parte A — citação e estrutura

- **Citações: 72/72 verificadas, 0 fabricadas.** Cada `section` conferida
  como título exato de seção do capítulo em `deepSummaryContent.json`, e
  cada `quote` como substring literal do conteúdo daquela seção
  (normalizando maiúsculas e espaços; acentos nunca). Zero falhas.
- **Notas: 4/4 literais.** As quatro `nota` existentes também são
  substring literal do capítulo (três de "Pegadinhas frequentes", uma de
  "Os quatro tipos"). A palavra fabricada corrigida na Task 3 não
  reapareceu.
- **Grade de eixos: 8/8 células corretas.** As quatro células de Anomia
  (integração/regulação × deficiência/excesso → egoísta, altruísta,
  anômico, fatalista) e as quatro de Classes Sociais (vertical/horizontal
  × intra/intergeracional) conferidas contra a fonte e depois exercitadas
  no navegador, uma a uma.
- **Texto fixo nos oito componentes:** nenhuma string chumbada afirma algo
  específico de capítulo. As únicas fixas são os *kickers* por família
  ("CRIVO · cruzamento de eixos" etc.), que descrevem a família, não o
  conteúdo. Os nomes e polos dos eixos vêm de `entry.eixos`; a legenda da
  escala vem de `entry.eixo` com um fallback genérico. O defeito de
  legenda chumbada da Fase 1 não tem análogo aqui.

#### Defeito encontrado e corrigido: Desigualdade de Gênero

Único defeito real da passagem, e das três espécies ao mesmo tempo
(contraste forçado, `claim` contradizendo o próprio rótulo, dois itens
citando a mesma frase):

A entrada estava em `contraste-de-posicoes` com os lados «Papéis
"naturais"» e «Construção social», **ambos citando a mesma frase** — e a
`claim` do primeiro lado dizia *"papéis considerados naturais na verdade
variam entre sociedades e épocas"*, isto é, afirmava exatamente o
contrário da posição que seu rótulo anunciava. O capítulo nunca enuncia a
posição naturalista: ela aparece só como aquilo que a distinção
sexo/gênero refuta. Não havia rivalidade a exibir, e o cartão ensinava um
debate que a fonte não tem. (O documento já marcava a atribuição como
*"Thin, deferido — Minor"*; a auditoria final a resolve.)

Distingue-se de **Desigualdade Racial no Brasil**, que permanece em
`contraste-de-posicoes`: lá a fonte *enuncia* o mito da democracia racial
como posição difundida e nomeia quem a contesta — existem duas posições
no texto.

**Correção:** reclassificada para `cadeia-de-derivacao`, que é a estrutura
que o capítulo de fato tem, com três elos e três citações literais novas:
distinguir sexo de gênero → os papéis variam entre sociedades e épocas →
logo são construções sociais e podem ser transformados. A tabela de
atribuição acima foi atualizada (contraste 9 → 8, cadeia 3 → 4).

#### As duas chamadas contestadas — mantidas

- **A Sociedade da Informação** (`criterios-conjuntivos` vs
  `escala-de-graus`): mantida em `criterios-conjuntivos`. A palavra
  "camadas" da fonte sugere ordenação, mas a lição do capítulo é
  conjuntiva, e ele a enuncia como pegadinha: *"Supor que acesso à
  internet resolve a exclusão digital ignora as camadas de qualidade e de
  uso crítico."* Tirar qualquer uma das três e a inclusão digital falha —
  que é o teste da família. Sem evidência nova para mudar.
- **O Contexto Histórico** (`contraste-de-posicoes` vs `tipologia`):
  mantida em `contraste-de-posicoes`. Decisivo é a pegadinha do próprio
  capítulo — *"supor que os clássicos concordavam entre si, quando
  divergem quanto ao objeto e ao método"*. Pela distinção operativa desta
  fase, `tipologia` exige tipos que *se combinam num mesmo caso*, e as
  três matrizes não se combinam: escolhe-se uma. Sem evidência nova para
  mudar.

#### Verificado e mantido (sem alteração)

- `contraste-de-posicoes` (8): nenhuma outra entrada é "confusão a evitar"
  com os dois lados permanecendo verdadeiros. **Sociologia e Senso Comum**
  e **Cultura e Etnocentrismo** — os dois minors parkeados — passam: no
  primeiro o capítulo nega que o senso comum seja *explicação suficiente*,
  no segundo a fonte chama o estranhamento de *"antídoto"* ao
  etnocentrismo. Em ambos, adotar um lado rejeita o outro.
- `tipologia` (6): as duas entradas sem `nota` (Democracia e Participação
  Política; Globalização Econômica e Cultural) continuam omissões
  honestas — os tipos coexistem de fato, e em Globalização a própria fonte
  diz *"As respostas variam"*, enumerando as três como simultâneas.
- `escala-de-graus` (1): o campo `eixo` de Cidadania e Direitos —
  *"da ordem histórica de conquista dos direitos, não de um valor
  crescente"* — nega explicitamente o juízo de valor, como a família exige.
- `camadas-de-determinacao` (2): Ideologia e Alienação continua o elo mais
  fraco das 26 (minor já registrado na Task 4), mas a assimetria é real —
  o trabalho social produz o valor, a aparência o oculta; a relação não se
  inverte. Não é defeito; fica registrado.

### Parte B — verificação no navegador

Servidor de desenvolvimento local, Chromium via Playwright, onboarding
contornado por `localStorage.setItem('juju_onboarding','true')` em init
script. **8 capítulos, cobrindo as 7 famílias em uso**, cada um nas duas
larguras (1440×1000 e 390×844) — 16 execuções:

| Família | Capítulo |
|---|---|
| `grade-de-eixos` | Anomia e Coesão Social · Classes Sociais e Mobilidade Social |
| `tipologia` | Tipos de Ação Social |
| `criterios-conjuntivos` | O que é o Fato Social |
| `contraste-de-posicoes` | Sociologia e Senso Comum |
| `cadeia-de-derivacao` | Desigualdade de Gênero (a entrada corrigida) |
| `camadas-de-determinacao` | Modo de Produção e Estrutura Social |
| `escala-de-graus` | Cidadania e Direitos |

Resultados, todos limpos:

- **Monta** no fluxo Explorar nos 16 casos.
- **Persiste entre seções:** marcou-se o nó DOM da cena com um atributo
  `data-*` e alterou-se o estado interativo antes de clicar "Continuar".
  Marca e estado sobreviveram nos 16 casos — é o mesmo nó, não uma
  remontagem. Confere com o código: `TopicScene` fica fora do
  `AnimatePresence` e é chaveado por capítulo, não por seção.
- **Some em "Testar":** avançando até o fim do percurso e entrando na
  prática, `.tc-scene` deixa de existir nos 16 casos.
- **Teclado:** alcançável por Tab nas 8 cenas, todas com anel de foco
  visível (`outline: solid 3px`) e ativáveis por Enter (ou setas, no
  `input[type=range]` da escala), com mudança de estado observável.
- **ARIA:** `aria-pressed` correto (só `true`/`false`) e acompanhando os
  dois eixos independentemente na grade. Os botões de `cadeia-de-derivacao`
  ("Próximo elo" / "Elo anterior") não têm `aria-pressed` por serem
  avanço de passo, não alternância — a posição é anunciada por
  `role="status"` e pelo texto "elo N de N". Correto, não é lacuna.
- **Sem overflow horizontal** em nenhuma das 16 execuções.
- **Sem animações infinitas:** `document.getAnimations()` não retornou
  nenhuma com `iterations: Infinity`.
- **Console limpo:** nenhum erro de console nem `pageerror`.
- **Grade de eixos, célula a célula:** as 8 combinações foram acionadas no
  navegador e cada uma acendeu a célula certa, com a citação e o `claim`
  correspondentes — a evidência mais forte, por ser a família mais nova e
  a de interação menos usual.

Capturas em `docs/visual-personalizado/screenshots/cenas-sociologia/`
(16 arquivos, uma por capítulo por largura).

### Limites honestos desta verificação

- A Parte A é **exaustiva** para citação literal, título de seção e
  mapeamento de células: as 72 citações e as 8 células foram conferidas
  por script contra a fonte. O julgamento **estrutural** (a família é a
  certa?) é leitura humana capítulo a capítulo, não mecanizável.
- A Parte B é **amostra, não validação exaustiva das 26 entradas**: 8
  capítulos de 26, escolhidos para cobrir as 7 famílias e priorizar as 3
  novas. As outras 18 entradas não foram abertas no navegador.
- **Movimento reduzido (`prefers-reduced-motion`) não foi exercitado**
  nesta passagem. Os componentes usam `useSceneMotion`, coberto por testes
  unitários, mas a emulação no navegador ficou de fora.
- Apenas Chromium, apenas tema claro, e só as duas larguras citadas.
- Sem auditoria formal de contraste de cor nem leitura com leitor de tela
  real; a verificação de ARIA foi por atributo, não por narração.
