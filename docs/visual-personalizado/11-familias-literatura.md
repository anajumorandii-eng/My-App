# Famílias de cena — Literatura (Fase 5, Task 1)

Este documento fecha a Task 1: a atribuição definitiva de família (ou lacuna) para
os 37 capítulos de Literatura, derivada de leitura integral de `deepSummaryContent.json`
(`subject === "Literatura"`). Mirror estrutural de
`docs/visual-personalizado/10-familias-geografia.md`. As entradas de `SceneEntry`
(com `question`, `items`, `quote` literal por item) ficam para a Task seguinte — este
documento só fixa qual família cada capítulo recebe e por quê, testado contra as
oito famílias existentes (as sete trazidas de fases anteriores mais nenhuma nova
introduzida por Literatura).

**Regra de processo aplicada:** todo capítulo foi testado contra as oito famílias,
não só contra a família mais óbvia sugerida pelo conteúdo, antes de qualquer lacuna
ser declarada. Buscas de texto (`grep`) por vocabulário de cada família — "divide-se
em"/"dividem-se em"/"convivem"/"classifica" para `tipologia`; "isolad"/"nenhum...
basta" para `criterios-conjuntivos`; "condiciona"/"decorrem"/"resultou"/"forçou"/
"gerando" para `cadeia-de-derivacao` e `camadas-de-determinacao`; "eixo"/"cruza" para
`grade-de-eixos` — foram rodadas sobre o texto completo dos 37 capítulos antes de
fechar qualquer família em zero.

## Atribuição definitiva

### `contraste-de-posicoes` (1 capítulo)

- **`summary-literatura-segunda-geracao-modernista-prosa`** — o romance de 30 rejeita
  explicitamente a leitura romântica do interior, não apenas a sucede no tempo. Frase
  de rejeição: *"Diferente do regionalismo romântico, que idealizava o interior, o
  romance de 30 expõe a exploração, a fome e a violência estrutural. A paisagem **não
  é** cenário pitoresco, **mas** condição que determina a vida das personagens."* O
  "não é... mas" nega diretamente a leitura anterior (paisagem como cenário belo) em
  favor da nova (paisagem como condição determinante) — rivalidade genuína sobre como
  representar o mesmo referente (o interior/Nordeste), não coexistência pacífica de
  duas linhas.

Descartados no mesmo teste: A Estética Realista (Realismo x Naturalismo são
apresentados como correntes contemporâneas e distintas — *"Embora contemporâneos,
distinguem-se"* — sem que uma rejeite a outra, apenas descrevem procedimentos
diferentes); Machado de Assis (a leitura de que "não se pode afirmar a traição de
Capitu" é cautela contra fato não comprovado, não rivalidade entre duas posições
teóricas que se excluem); Modernismo Primeira Geração (Pau-Brasil/Antropofagia x
Verde-Amarelo/Anta convivem como correntes opostas do mesmo momento, mas o texto não
tem frase de rejeição explícita de uma pela outra, só o aviso de que nem todo
modernismo de 22 era progressista); Simbolismo x Parnasianismo (o texto avisa que são
contemporâneos, não sucessivos — o oposto de rivalidade, é aviso contra erro de
cronologia).

### `camadas-de-determinacao` (0 capítulos)

Nenhum capítulo sustenta base assimétrica real. O candidato mais próximo é o tripé
determinista do Naturalismo (*"meio, raça e momento condicionam a conduta"*), mas os
três fatores são apresentados em paralelo, sem que um deles seja `items[0]`
condicionando os outros dois de forma não recíproca — é tripé simultâneo, não camada.

### `tipologia` (7 capítulos)

Cada entrada tem frase-guarda-chuva real na fonte (verbos "divide-se em",
"dividem-se em" ou "convivem"), nomeando a categoria comum antes de enumerar
variantes que coexistem sem hierarquia.

- **`summary-literatura-a-estetica-romantica-prosa`** — *"A prosa romântica
  brasileira divide-se em vertentes."* Urbano, indianista, regionalista, histórico —
  quatro vertentes que coexistem, fechado por *"Em todas as vertentes, o projeto é o
  mesmo: construir uma literatura nacional com temas e cenários brasileiros."*

- **`summary-literatura-fernando-pessoa`** — *"Pessoa criou heterônimos,
  personalidades poéticas com biografia, estilo e visão de mundo próprios."* Caeiro
  (bucólico sem metafísica), Reis (clássico epicurista) e Campos (do futurismo ao
  tédio) — três heterônimos coexistentes, sem hierarquia entre si, cada um com visão
  de mundo própria e completa.

- **`summary-literatura-trovadorismo-e-humanismo`** — dupla tipologia explícita: *"As
  líricas dividem-se em cantiga de amor... e cantiga de amigo..."* e *"As satíricas
  dividem-se em cantiga de escárnio... e cantiga de maldizer..."* Ambos os pares são
  variantes coexistentes com critério distintivo claro (gênero do eu lírico; grau de
  identificação do alvo da crítica).

- **`summary-literatura-vanguardas-artisticas`** — *"As vanguardas europeias do
  início do século XX romperam com a representação tradicional e se organizaram em
  torno de manifestos."* Futurismo, Cubismo, Expressionismo, Dadaísmo e Surrealismo,
  cada um com procedimento próprio ("O Futurismo exalta... O Cubismo decompõe... O
  Expressionismo deforma... O Dadaísmo nega... O Surrealismo explora..."), reforçado
  pela pegadinha que distingue Dadaísmo de Surrealismo como correntes distintas, não
  substitutas uma da outra.

- **`summary-literatura-poesia-brasileira-contemporanea`** — *"A poesia brasileira
  das últimas décadas não se organiza em torno de um movimento dominante. Convivem
  vertentes formalistas, poesia do cotidiano, poesia visual e digital, spoken word e
  slam, além da presença crescente de vozes indígenas, negras e periféricas."*
  Guarda-chuva explícito ("vertentes") seguido de variantes coexistentes, sem
  hierarquia — reforçado pela pegadinha: *"Buscar uma escola dominante para o período
  é o erro conceitual central: a pluralidade é a característica."*

- **`summary-literatura-poesia-brasileira-1960-1980`** — na seção "Outras vertentes":
  *"Convivem no período o desdobramento do concretismo, o poema-processo, a poesia
  práxis, a produção de Ferreira Gullar... e a obra de Adélia Prado."* Mesma estrutura
  de guarda-chuva + enumeração coexistente aceita nos demais capítulos deste lote.
  (A seção "Poesia marginal" do mesmo capítulo não sustenta família própria — é
  descrição de um único movimento, não tipologia.)

- **`summary-literatura-prosa-brasileira-contemporanea`** — na seção "Formas":
  *"Convivem o realismo, a autoficção, a fragmentação, a hibridação com jornalismo e
  ensaio e a incorporação de linguagens digitais."* Mesmo padrão de guarda-chuva
  ("Convivem") com variantes coexistentes.

Descartados no mesmo teste, por padrão mais fraco que os aceitos acima: A Estética
Barroca (cultismo/conceptismo têm distinção clara, mas nenhuma frase do tipo
"divide-se em" ou "convivem" os apresenta como categoria comum antes da enumeração —
o texto vai direto à distinção, sem guarda-chuva); Pré-Modernismo (*"Convivem a
linguagem ainda marcada pelo academicismo... e a busca de coloquialidade e ironia"* é
par de apenas dois polos em tensão — herança x ruptura —, não enumeração de três ou
mais variantes coexistentes sem hierarquia, mais próximo de contraste do que de
tipologia, mas sem frase de rejeição para sustentar `contraste-de-posicoes` também);
A Arte e suas Linguagens (a enumeração de linguagens artísticas — literatura, artes
visuais, música, dança, teatro, cinema — não tem guarda-chuva de classificação, é
descrição de meios distintos numa lista, sem "divide-se em" ou "convivem").

### `criterios-conjuntivos` (0 capítulos)

Nenhum capítulo afirma que múltiplos fatores precisam se combinar, com nenhum
bastando isolado. Busca por "isolad", "nenhum... basta" e variantes no texto completo
dos 37 capítulos não retornou nenhuma ocorrência além de uma menção genérica em
Pré-Modernismo ("conjunto da produção"), que não é frase de necessidade conjunta. O
tripé naturalista (meio, raça, momento) é o candidato mais próximo e foi descartado:
o texto nunca afirma que nenhum fator isolado basta, apenas que os três "condicionam
a conduta" em conjunto — diferença que já motivou correções em fases anteriores
(Pedologia em Geografia teve o mesmo padrão e ficou em `tipologia`, não aqui, porque
Literatura não oferece guarda-chuva de tipos para o tripé determinista).

### `escala-de-graus` (0 capítulos)

O candidato mais próximo é A Estética Romântica: Poesia, cujas "três gerações" são
descritas como trajetória (*"A trajetória vai da construção de símbolos nacionais...
ao mal do século... e chega à poesia de intervenção da terceira"*), mas são três
momentos históricos com temas distintos (indianismo nacionalista, pessimismo
byroniano, engajamento social), não graus ordenados de uma mesma variável crescente
ou decrescente, ao contrário da transição demográfica em Geografia (fases nomeadas de
um único processo com direção clara de natalidade/mortalidade). Segunda Geração
Modernista: Poesia tem o mesmo problema (amadurecimento de tom, não escala numerada).
Machado de Assis ("duas fases") e Semana de Arte Moderna também foram testados e
descartados pelo mesmo motivo: sucessão cronológica sem grandeza ordinal.

### `cadeia-de-derivacao` (0 capítulos)

Busca por linguagem instrumental ("condiciona", "decorrem", "resultou", "forçou",
"gerando") no texto completo retornou só dois candidatos, ambos descartados por serem
elo único, não cadeia:

- Semana de Arte Moderna: *"Dela decorrem manifestos e revistas que organizaram o
  movimento"* — um único elo (Semana → manifestos), sem uma cadeia de vários elos
  cada um decorrendo do anterior.
- Vanguardas Artísticas: *"a exposição de 1917 provocou a crítica de Monteiro Lobato
  e mobilizou o grupo que faria a Semana de 22"* — dois verbos instrumentais
  ("provocou", "mobilizou"), mas é uma sequência de dois elos sobre um evento
  específico (a recepção da mostra de Malfatti), não uma cadeia estendida como as
  aceitas em Geografia (Movimentos da Terra, Bipolar ao Multipolar, Recursos
  Hídricos, Desigualdades Globais), e o mesmo capítulo já sustenta `tipologia` de
  forma mais sólida com as cinco correntes de vanguarda — não se justifica forçar uma
  segunda leitura mais fraca sobre o mesmo capítulo.

### `grade-de-eixos` (0 capítulos)

Busca por "eixo" e "cruza" no texto completo não encontrou nenhum cruzamento
genuíno de dois eixos independentes com célula correspondente. As ocorrências de
"cruza" (Arte e suas Linguagens: obras que cruzam linguagens; Simbolismo: sinestesia
que cruza sensações) são sobre hibridismo entre elementos, não classificação por
produto de dois eixos ortogonais.

### `movimento-dialetico` (0 capítulos)

Nenhum capítulo apresenta os três momentos genuínos (tese, negação real, síntese que
supera e conserva os dois). Honesto zero, como já ocorreu em todas as fases
anteriores.

## Lacunas declaradas

### Lacuna já conhecida

- **`summary-literatura-texto-literario-x-texto-nao-literario`** — já tem a
  experiência interativa `literary` em `src/views/topic-experiments/catalog.ts`.

### Lacunas adicionais

Todas com motivo específico ao conteúdo do capítulo, testadas contra as oito
famílias antes de serem declaradas lacuna:

- `summary-literatura-a-arte-e-suas-linguagens` — capítulo introdutório e
  definicional (o que é arte, linguagens artísticas, função social); a enumeração de
  linguagens não tem guarda-chuva de tipologia ("divide-se em"/"convivem") nem
  fecha com afirmação unificadora sobre as variantes.
- `summary-literatura-a-estetica-barroca` — cultismo e conceptismo são distinguidos
  claramente, mas sem frase-guarda-chuva que os apresente como categoria comum antes
  da enumeração, e sem rejeição mútua (coexistem em gêneros diferentes: poesia e
  sermão).
- `summary-literatura-a-estetica-neoclassica` — os cinco lemas árcades (inutilia
  truncat, fugere urbem, locus amoenus, carpe diem, aurea mediocritas) são uma lista
  de preceitos estéticos, não tipos que se excluem ou se ordenam, nem cadeia causal.
- `summary-literatura-a-estetica-realista` — Realismo e Naturalismo são descritos
  como correntes contemporâneas e distintas ("distinguem-se"), sem rejeição mútua
  nem guarda-chuva de tipologia que os una como variantes.
- `summary-literatura-a-estetica-romantica-poesia` — as três gerações são momentos
  históricos com temas distintos (indianismo, pessimismo, engajamento social), não
  graus ordenados de uma mesma variável nem tipos coexistentes sem hierarquia
  temporal.
- `summary-literatura-artes-plasticas-brasileiras` — narrativa cronológica de
  movimentos artísticos (acadêmico, modernista, neoconcreto, contemporâneo); os
  períodos se sucedem, não coexistem como tipos nem se derivam causalmente um do
  outro no texto.
- `summary-literatura-brasil-primeiros-registros` — narrativa histórica sobre os
  primeiros registros escritos e a literatura jesuítica; descrição documental sem
  rivalidade, tipologia, camada ou cadeia causal.
- `summary-literatura-cancioneiro-popular-brasileiro` — a lista de momentos musicais
  (samba, bossa nova, tropicália, protesto, rap/funk) é sucessão cronológica de
  gêneros, não tipologia com guarda-chuva de coexistência simultânea.
- `summary-literatura-carlos-drummond-de-andrade` — as fases da obra (gauchismo
  irônico, fase social, fase metafísica) são períodos cronológicos da trajetória do
  poeta, sem grandeza ordinal nem derivação causal entre elas.
- `summary-literatura-clarice-lispector` — descreve procedimento narrativo
  (epifania, fluxo de consciência) e obras; não há rivalidade, tipologia com
  guarda-chuva, camada ou cadeia causal sustentada por frase específica.
- `summary-literatura-elementos-da-narrativa` — é um glossário de conceitos
  narratológicos em pares definicionais (personagem plana/redonda, caracterização
  direta/indireta, tempo cronológico/psicológico); pares de definição, não tipologia
  com variantes coexistentes nem rivalidade.
- `summary-literatura-graciliano-ramos` — descreve obras (Vidas Secas, São Bernardo,
  Angústia, Memórias do Cárcere) lado a lado, cada uma com foco próprio; não há
  guarda-chuva de tipologia nem derivação causal entre elas.
- `summary-literatura-guimaraes-rosa` — descreve invenção de linguagem, Grande
  Sertão: Veredas e os contos como temas paralelos, sem estrutura de família única
  sustentada por uma frase específica.
- `summary-literatura-joao-cabral-de-melo-neto` — descreve obras (Morte e Vida
  Severina, O Cão sem Plumas, O Rio, Educação pela Pedra) lado a lado, sem tipologia
  com guarda-chuva nem cadeia causal.
- `summary-literatura-literatura-lusofona-contemporanea` — organiza por região
  geográfica (África lusófona, Portugal), não por tipos com guarda-chuva de
  classificação; a pegadinha até avisa que a lusofonia não é bloco homogêneo, o
  oposto de tipologia coesa.
- `summary-literatura-machado-de-assis` — a impossibilidade de afirmar a traição de
  Capitu é cautela interpretativa contra um fato não comprovado, não rivalidade
  entre duas posições teóricas que se excluem mutuamente; as "duas fases" são
  sucessão cronológica sem grandeza ordinal.
- `summary-literatura-modernismo-no-brasil-primeira-geracao` — Pau-Brasil e
  Antropofagia se opõem a Verde-Amarelo e Anta como correntes conviventes do mesmo
  momento, mas o texto não tem frase de rejeição explícita de uma pela outra, só o
  aviso de que nem todo modernismo de 22 era progressista.
- `summary-literatura-naturalismo` — o tripé determinista (meio, raça, momento)
  condiciona a conduta em conjunto, mas o texto nunca afirma que nenhum fator
  isolado basta (não sustenta `criterios-conjuntivos`), e os três fatores são
  paralelos, não uma base assimétrica que condiciona camadas superiores (não
  sustenta `camadas-de-determinacao`).
- `summary-literatura-parnasianismo` — descreve o programa estético (arte pela
  arte, rigor formal) e a tríade de nomes; não há tipologia com guarda-chuva,
  rivalidade com rejeição, camada ou cadeia causal.
- `summary-literatura-poesia-concreta` — descreve um único movimento (projeto,
  procedimentos, contexto), sem enumeração de variantes coexistentes nem outra
  estrutura de família.
- `summary-literatura-prosa-brasileira-1960-1980` — descreve estratégias de resposta
  à censura (alegoria, fantástico, fragmentação) lado a lado, sem tipologia com
  guarda-chuva explícito nem cadeia causal instrumental entre elas.
- `summary-literatura-pre-modernismo` — a tensão entre "linguagem ainda marcada pelo
  academicismo" e "busca de coloquialidade e ironia" é par de dois polos em tensão,
  não enumeração de três ou mais tipos coexistentes sem hierarquia, e não há frase
  de rejeição mútua que sustente `contraste-de-posicoes`.
- `summary-literatura-realismo-portugues-eca-de-queiros` — descreve três romances
  (O Crime do Padre Amaro, O Primo Basílio, Os Maias), cada um com crítica social
  própria, lado a lado; não há tipologia com guarda-chuva nem cadeia causal.
- `summary-literatura-renascimento-e-camoes` — a estrutura de Os Lusíadas
  (proposição, invocação, dedicatória, narração, epílogo) é uma sequência de partes
  compositivas fixas de um gênero, não uma cadeia causal instrumental nem escala de
  graus.
- `summary-literatura-segunda-geracao-modernista-poesia` — descreve o
  "amadurecimento" da poesia de 30/40 como mudança de tom em relação a 22, sem
  grandeza ordinal explícita nem tipologia com guarda-chuva de variantes
  coexistentes.
- `summary-literatura-semana-de-arte-moderna` — narrativa de evento histórico; "Dela
  decorrem manifestos e revistas" é um único elo causal, insuficiente para uma
  cadeia de derivação (que exige vários elos, cada um decorrendo do anterior).
- `summary-literatura-simbolismo` — o texto avisa explicitamente que Simbolismo e
  Parnasianismo são contemporâneos, não sucessivos, o oposto de uma rivalidade com
  rejeição mútua; não há outra família sustentada por frase específica.
- `summary-literatura-teatro-brasileiro` — narrativa cronológica de movimentos
  teatrais (catequético, comédia de costumes, Nelson Rodrigues, Teatro de Arena e
  Oficina); sucessão histórica, sem tipologia com guarda-chuva nem cadeia causal.
## Contagem final

7 `tipologia` + 1 `contraste-de-posicoes` + 0 nas demais seis famílias = 8 capítulos
com família. 37 − 8 = 29 lacunas (1 já conhecida + 28 adicionais). 37 capítulos no
total, cada um em exatamente uma das duas listas (`literatura` ficará vazio nesta
Task; `literaturaSemCena` recebe os 29). Taxa de lacuna: 29/37 ≈ 78%, a mais alta
entre as fases já concluídas — explicação: o currículo de Literatura deste material é
majoritariamente organizado por autor/obra/movimento em prosa descritiva e por
"pegadinhas de prova" (definições e distinções a não confundir), não por argumentação
estrutural com rivalidade, derivação causal ou necessidade conjunta declaradas; a
tipologia sobrevive porque vários capítulos descrevem correntes ou variantes que a
fonte explicitamente marca como coexistentes ("divide-se em", "convivem").
