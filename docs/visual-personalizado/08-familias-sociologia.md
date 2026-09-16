# 08 — Inventário de famílias de cena de Sociologia

Este documento registra, para os 27 capítulos de Sociologia em
`src/data/deepSummaryContent.json`, a qual família de cena-âncora cada um
foi atribuído, ou por que ficou sem cena. A leitura foi feita seção por
seção de cada capítulo — a atribuição abaixo é definitiva e corrige, em
vários pontos, a hipótese de partida do plano, que havia sido derivada só
dos títulos das seções.

Este inventário ainda **não** é executável: `src/views/topic-scenes/data/sociologia.ts`
contém apenas o esqueleto (`sociologia: []` e as duas lacunas declaradas).
As Tasks 2-4 escrevem as entradas, família por família, lendo de novo cada
capítulo para citar seção e trecho literais.

## Tabela de atribuição definitiva

| Família | Estrutura | Capítulos |
|---|---|---|
| `contraste-de-posicoes` | Respostas rivais à mesma pergunta | O Contexto Histórico do Surgimento da Sociologia; Sociologia e Senso Comum; Educação e Socialização em Durkheim; A Luta de Classes na Análise Sociológica; Classes Sociais e Mobilidade Social; Cultura e Etnocentrismo; Multiculturalismo e Relativismo Cultural; Desigualdade Racial no Brasil; Desigualdade de Gênero; Divisão Social do Trabalho; Transformações no Mundo do Trabalho; Precarização e Uberização do Trabalho; Globalização Econômica e Cultural; O Estado-Nação na Era Global (14) |
| `tipologia` **(nova)** | Tipos ideais paralelos que coexistem e se combinam num mesmo caso concreto | Tipos de Ação Social; Dominação e Poder em Weber; Democracia e Participação Política; Movimentos Sociais Clássicos e Contemporâneos (4) |
| `camadas-de-determinacao` | Uma camada condiciona a outra | Modo de Produção e Estrutura Social; Ideologia e Alienação; Identidade e Diferença (3) |
| `criterios-conjuntivos` **(nova)** | Condições que só definem o fenômeno quando valem todas ao mesmo tempo | O que é o Fato Social; A Sociedade da Informação (2) |
| `cadeia-de-derivacao` | Passos encadeados; remover um elo quebra a conclusão | Ética Protestante e o Espírito do Capitalismo (1) |
| `escala-de-graus` | Degraus ordenados entre dois extremos | Cidadania e Direitos (1) |
| `movimento-dialetico` | — | nenhum capítulo de Sociologia apresenta o ciclo de três momentos (0) |
| *sem cena* | — | Solidariedade Mecânica e Solidariedade Orgânica; Anomia e Coesão Social (2) |

Total: 14 + 4 + 3 + 2 + 1 + 1 + 0 + 2 = 27 capítulos.

## Atribuição capítulo a capítulo (com justificativa para todo desvio da hipótese)

### `contraste-de-posicoes` (14)

- **O Contexto Histórico do Surgimento da Sociologia** — os três clássicos
  respondem de forma divergente à pergunta "qual é o objeto próprio da
  sociologia?": fato social (Durkheim), relações de produção (Marx), ação
  social dotada de sentido (Weber). O próprio capítulo avisa contra o erro
  de lê-los como concordantes: *"supor que os clássicos concordavam entre
  si, quando divergem quanto ao objeto e ao método"*.
- **Sociologia e Senso Comum** — contraste de duas vias de conhecer a vida
  social: o senso comum, que "orienta a vida cotidiana e frequentemente
  funciona", e a sociologia, que exige "ruptura com as pré-noções". Dois
  polos, não uma escala.
- **Educação e Socialização em Durkheim** — capítulo não estava na hipótese
  do plano. A seção "Escola e sociedade" contrapõe a visão de Durkheim
  (escola como integradora e neutra) à crítica de Bourdieu: *"Autores
  posteriores, como Bourdieu, criticaram essa visão ao mostrar como a
  escola também reproduz desigualdades de origem social."* É rivalidade
  explícita entre duas leituras da mesma instituição — moveu-se aqui a
  partir da leitura, não do título.
- **A Luta de Classes na Análise Sociológica** — Marx, Weber e Bourdieu dão
  respostas distintas a "o que define a posição de alguém na estrutura
  social?": posição nas relações de produção; status e poder somados à
  classe; capitais econômico/cultural/social. O capítulo nomeia isso
  quadros teóricos próprios, não correções de um pelo outro.
- **Classes Sociais e Mobilidade Social** — mesma estrutura de rivalidade
  teórica, a partir da seção "Estratificação" deste capítulo: "as
  principais abordagens são a marxista... a weberiana... e a de Bourdieu".
- **Cultura e Etnocentrismo** — contraste entre julgar outras culturas pelo
  próprio padrão (etnocentrismo) e o exercício de "estranhar o familiar e
  familiarizar o estranho".
- **Multiculturalismo e Relativismo Cultural** — contraste entre
  relativismo metodológico (ferramenta de pesquisa) e relativismo moral
  radical ("nenhum juízo entre culturas é possível"), com o capítulo
  afirmando que confundi-los é o erro central.
- **Desigualdade Racial no Brasil** — contraste entre o mito da democracia
  racial e a tese do racismo estrutural sustentada por Florestan Fernandes,
  Clóvis Moura e Lélia Gonzalez.
- **Desigualdade de Gênero** — contraste entre papéis "considerados
  naturais" e a tese central do capítulo de que são "socialmente
  produzidos".
- **Divisão Social do Trabalho** — ver seção de resolução de sobreposição
  abaixo.
- **Transformações no Mundo do Trabalho** — "o debate opõe quem prevê
  desemprego tecnológico massivo e quem aponta a criação de novas
  ocupações": duas respostas rivais à mesma pergunta.
- **Precarização e Uberização do Trabalho** — contraste entre "autonomia
  formal" (o motorista escolhe o horário) e "autonomia real" (algoritmo
  define preço, rota e avaliação); o capítulo chama isso de "o erro
  central".
- **Globalização Econômica e Cultural** — a seção "Dimensão cultural"
  apresenta respostas concorrentes à mesma pergunta ("o que a globalização
  faz com a cultura local?"): homogeneização, hibridismo, reforço de
  identidades locais — "as respostas variam".
- **O Estado-Nação na Era Global** — contraste entre a tese da soberania
  relativizada e a tese da persistência do Estado; o capítulo avisa que
  "afirmar que a globalização tornou o Estado irrelevante contraria a
  evidência".

### `tipologia` (nova família, 4)

**Por que as cinco famílias de Filosofia não bastam:** nenhuma delas admite
que os itens comparados coexistam e se combinem no mesmo caso concreto.
`contraste-de-posicoes` pressupõe que as posições comparadas *divergem* —
"as duas leituras descrevem o mesmo processo com avaliações opostas", como
em Divisão Social do Trabalho. Já os capítulos abaixo dizem o oposto de si
mesmos: os tipos não competem, e um caso real tipicamente reúne mais de um.
`escala-de-graus` exige um continuum ordenado entre dois extremos, que não
existe aqui — não há "mais ação afetiva" ou "menos". E nem
`camadas-de-determinacao` nem `movimento-dialetico` descrevem uma lista
plana de tipos paralelos.

- **Tipos de Ação Social** — capítulo que origina a família. Citação
  literal que sustenta a coexistência: *"São tipos ideais: na realidade, as
  ações costumam combinar mais de um tipo."* A seção "Pegadinhas
  frequentes" reforça: "supor que uma ação concreta pertence a um único
  tipo puro" é erro.
- **Dominação e Poder em Weber** — mesma estrutura, com citação equivalente:
  *"supor que os tipos aparecem puros na realidade, quando se combinam em
  casos concretos."*
- **Democracia e Participação Política** — a democracia participativa é
  descrita textualmente como combinação dos outros tipos: *"A participativa
  combina representação com instrumentos de intervenção direta."* Verificado
  e confirmado: não é uma disputa entre formas rivais, é composição.
- **Movimentos Sociais Clássicos e Contemporâneos** — o capítulo nega
  explicitamente que os tipos sejam rivais ou sucessivos: *"os novos
  movimentos sociais substituíram os clássicos, quando coexistem e
  frequentemente se articulam"* é listado como erro a evitar.

### `camadas-de-determinacao` (3)

- **Modo de Produção e Estrutura Social** — o capítulo que melhor
  representa a família: *"A base econômica condiciona a superestrutura
  jurídica, política e ideológica, que por sua vez atua sobre a base."*
  `items[0]` é a base econômica.
- **Ideologia e Alienação** — a ideologia e o fetichismo da mercadoria são
  descritos como aparência que oculta a camada de baixo (as relações reais
  de exploração e trabalho): *"ocultando o trabalho social que a
  produziu"*. A camada de base (relações de produção) condiciona a camada
  de aparência (forma-mercadoria, ideologia).
- **Identidade e Diferença** — capítulo não estava na hipótese do plano.
  Moveu-se para cá porque a redistribuição material funciona como base que
  condiciona o reconhecimento de identidades: *"reconhecer identidades sem
  enfrentar desigualdades materiais deixa a questão pela metade."* Não é
  uma relação de rivalidade (não se diz que redistribuição e reconhecimento
  disputam a mesma resposta), é assimetria de camada, ainda que mais sutil
  que o par clássico base/superestrutura marxista.

### `criterios-conjuntivos` (nova família, 2)

**Por que as cinco famílias de Filosofia não bastam:** as três
características de Durkheim não têm ordem (não é `escala-de-graus`), não
dependem umas das outras numa corrente causal onde uma produz a seguinte
(não é `cadeia-de-derivacao` — a coercitividade não *decorre* da
exterioridade), não têm uma base que condiciona as demais (não é
`camadas-de-determinacao` — as três estão no mesmo nível), e não são
posições que disputam a mesma resposta (não é `contraste-de-posicoes`). A
estrutura real é: um fenômeno só é fato social quando **todas** as
condições valem ao mesmo tempo; falta uma, deixa de ser fato social.

- **O que é o Fato Social** — capítulo que origina a família. Citação
  literal: *"Durkheim define fato social por três traços: exterioridade,
  pois existe antes e independentemente do indivíduo; coercitividade, pois
  se impõe e a transgressão gera sanção; e generalidade, pois é comum ao
  grupo."* As três são apresentadas como a definição conjunta, não como
  itens de uma lista qualquer — é assim que o capítulo prova que a língua é
  fato social: "reunindo exterioridade, coerção e generalidade" (seção
  "Pratique e confira").
- **A Sociedade da Informação** — a seção "Desigualdade digital" apresenta
  o mesmo padrão de necessidade conjunta: *"O acesso é desigual em várias
  camadas: disponibilidade de conexão e dispositivos, qualidade do acesso e
  capacidade de uso crítico."* A resposta de "Pratique e confira" confirma
  que nenhuma sozinha resolve a exclusão: *"além de conexão e dispositivo,
  é preciso qualidade de acesso e competências... o que depende de
  escolarização e apoio."* Apesar da palavra "camadas" no texto-fonte, a
  estrutura não é base/superestrutura (nenhuma das três é uma base que
  produz as outras): é uma lista de condições necessárias em conjunto, o
  mesmo padrão do Fato Social — por isso este capítulo entra em
  `criterios-conjuntivos`, e não em `camadas-de-determinacao`.

**Sobre "Cidadania e Direitos" — a segunda família hipotética não se
sustentou para este capítulo.** O plano listava Cidadania e Direitos junto
com Fato Social. Lido o capítulo, a estrutura de Marshall é uma sequência
histórica ordenada, não uma lista de condições simultâneas: *"Marshall
distingue direitos civis... políticos... e sociais"*, e o próprio capítulo
trata a ordem como o ponto central da comparação: *"No Brasil, a sequência
foi distinta da inglesa: direitos sociais foram concedidos antes da
ampliação plena dos direitos políticos."* Isso é `escala-de-graus`
(degraus ordenados, e o que muda é justamente a ordem), não
`criterios-conjuntivos`. Corrigido abaixo.

### `cadeia-de-derivacao` (1)

- **Ética Protestante e o Espírito do Capitalismo** — a seção "O mecanismo"
  narra uma corrente de dependência estrita: doutrina da predestinação →
  angústia sobre a salvação → êxito no trabalho lido como sinal de graça →
  ascese intramundana (recusa do consumo) → acumulação e reinvestimento
  sistemáticos → espírito do capitalismo. Quebrar um elo (por exemplo, sem
  a angústia da predestinação) desfaz a conclusão sobre a acumulação. O
  capítulo tem o cuidado de negar uma causalidade única e simples ("Weber
  não afirma que a religião causou sozinha o capitalismo"), mas isso nega o
  determinismo do resultado histórico, não a estrutura em cadeia do
  mecanismo psicológico-histórico descrito — que é o que a cena precisa
  representar.

### `escala-de-graus` (1)

- **Cidadania e Direitos** — ver justificativa da correção acima. Os três
  (depois quatro, com direitos difusos e digitais) tipos de direito formam
  uma sequência histórica ordenada em que o que muda a cada degrau é o
  âmbito de proteção (liberdade individual → participação política →
  condições materiais → temas difusos/tecnológicos), e o próprio capítulo
  usa a comparação Brasil/Inglaterra para mostrar que a ordem é o dado
  relevante.

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
mesmo processo com avaliações opostas."* Isso é exatamente
`contraste-de-posicoes` (respostas rivais à mesma pergunta: "o que a divisão
do trabalho faz à sociedade?") e não `movimento-dialetico`, que exige um
terceiro momento que cancele, preserve e eleve os dois anteriores — nada
disso aparece no capítulo. **Resolvido: `contraste-de-posicoes`.**

## Lacunas declaradas (2)

**Solidariedade Mecânica e Solidariedade Orgânica**
(`summary-sociologia-solidariedade-mecanica-e-solidariedade-organica`) fica
sem cena-âncora porque já tem experiência interativa própria (`solidarity`
em `src/views/topic-experiments/catalog.ts`), exibida no mesmo slot do
fluxo de Explorar — mesmo motivo do gap único de Filosofia.

**Anomia e Coesão Social**
(`summary-sociologia-anomia-e-coesao-social`) é uma lacuna nova, declarada
nesta tarefa a partir da leitura do capítulo, não do plano original. A
seção "O estudo sobre o suicídio" classifica quatro tipos — egoísta
(integração insuficiente), altruísta (integração excessiva), anômico
(regulação insuficiente) e fatalista (regulação excessiva) — cruzando
**dois eixos independentes** (integração, regulação), cada um por falta ou
por excesso. Isso não é:
- `escala-de-graus`, porque não há um único continuum entre dois extremos
  com graus intermediários — há dois eixos ortogonais, cada um com apenas
  dois polos e nenhum grau intermediário descrito no texto-fonte;
- `tipologia`, porque o capítulo não afirma que um caso concreto combina
  mais de um tipo — ao contrário dos capítulos que fundam essa família, um
  suicídio é classificado num único tipo;
- `criterios-conjuntivos`, porque os quatro tipos são alternativos
  (excludentes entre si), não condições que precisam valer todas ao mesmo
  tempo;
- `contraste-de-posicoes`, porque os quatro tipos não são respostas rivais
  a uma pergunta — são categorias de causas para o mesmo fenômeno,
  aplicáveis a casos diferentes, sem que uma "vença" as demais;
- `camadas-de-determinacao` ou `cadeia-de-derivacao`, porque não há
  hierarquia de base/camada nem uma corrente de dependência entre os
  quatro tipos.
Forçar este capítulo em qualquer família disponível distorceria a fonte.
Fica como lacuna honesta até que uma fase futura, se necessário, proponha
uma família de grade bidimensional com evidência textual própria.

## Verificação

- Cobertura: 25 capítulos atribuídos a família (skeleton de dados vazio
  nesta tarefa — as entradas serão escritas nas Tasks 2-4) e 2 lacunas
  declaradas, somando os 27 capítulos de Sociologia.
- `npx vitest run src/views/topic-scenes/familias-sociologia.test.ts`:
  falha de propósito no primeiro caso ("cobre os 27 capítulos..."), listando
  os 25 ids ainda sem entrada em `sociologia[]`. Os outros dois casos
  (ids existentes; motivo de cada lacuna) passam. Ver saída completa no
  relatório da tarefa.

## Nota sobre famílias novas

Este documento registra duas famílias que as cinco de Filosofia
(`src/views/topic-scenes/types.ts`) não representam: `tipologia` e
`criterios-conjuntivos`. Ambas nasceram de citação literal do capítulo que
as motivou (Tipos de Ação Social; O que é o Fato Social), não do título das
seções — e uma terceira família hipotética do plano original
(`criterios-conjuntivos` aplicada a Cidadania e Direitos) foi descartada
para aquele capítulo especificamente, que migrou para `escala-de-graus`.
Enquanto o tipo `SceneFamily` não for atualizado (fora do escopo desta
tarefa), estas duas famílias existem apenas neste documento e no motivo
registrado nos comentários de código; sua entrada em `SceneFamily` e nas
entradas de `sociologia[]` é trabalho das Tasks 2-4.
