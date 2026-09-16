# Inventário de famílias de cena — História

Task 1 de Fase 3. Lê os 49 capítulos de História (`src/data/deepSummaryContent.json`,
`subject === "História"`) e atribui a família de cena que o conteúdo real sustenta,
sem escrever nenhuma entrada em `historia[]` (isso é trabalho das tasks seguintes).
`src/views/topic-scenes/data/historia.ts` fica com `historia: SceneEntry[] = []` e
`historiaSemCena` com as lacunas declaradas abaixo. O teste de completude
(`familias-historia.test.ts`) fica vermelho de propósito: lista os 23 capítulos que
já têm família definida aqui mas ainda não têm `SceneEntry` escrita — esse é o
estado correto ao fim desta task.

Este worktree só tem a infraestrutura de Fase 1 (Filosofia) mesclada. A Fase 2
(Sociologia, `tipologia`, `criterios-conjuntivos`, `grade-de-eixos`) está em PR
aberto (#173), não mesclado — `docs/visual-personalizado/08-familias-sociologia.md`
não existe neste branch. As famílias `tipologia` e `criterios-conjuntivos` usadas
abaixo seguem apenas a descrição textual dessas famílias dada no brief desta task
(não um arquivo lido), e ficam marcadas "pendente do merge da Sociologia".

## Padrão geral encontrado (achado principal desta task)

Ao contrário de Filosofia (capítulos escritos para sustentar debates conceituais
com estrutura clara de tese/antítese, escala ou derivação), os capítulos de
História no `deepSummaryContent.json` seguem um formato uniforme de
levantamento: 3-4 seções temáticas paralelas sobre o mesmo período/processo,
seguidas de "Pegadinhas frequentes" e "Pratique e confira". As próprias
pegadinhas frequentemente **alertam explicitamente contra** reduzir causas
múltiplas a uma cadeia única ou a uma rivalidade binária (ex.: "achar que X foi
causa única e suficiente — combinou-se com Y e Z"). Isso significa que a maior
parte dos capítulos de História **não sustenta honestamente nenhuma das cinco
famílias de Fase 1** nem as pendentes de Fase 2 — são levantamentos de aspectos
paralelos e coexistentes, não estruturas de rivalidade, derivação ou camada.

Resultado: **23 capítulos** com família definida (a serem escritos nas próximas
tasks) e **26 capítulos** em lacuna declarada (1 já conhecida de Fase 1 — o
capítulo com experiência interativa própria — e 25 identificados nesta leitura).
Isso é maior que o número de lacunas em Filosofia (1) e Sociologia, mas é
consistente com o achado repetido nas duas fases anteriores de que forçar
família onde o conteúdo não sustenta é o defeito mais recorrente do processo —
aqui a resposta honesta, dado o formato do material, é registrar mais lacunas,
não menos.

## Atribuições definitivas

### `contraste-de-posicoes` (3 capítulos)

Testados contra o critério de rivalidade genuína: uma leitura precisa rejeitar
a outra, não apenas coexistir com ela (ex.: causa econômica + causa política do
mesmo evento não é rivalidade).

- **`historia-a-historia-e-o-brasil`** — pergunta: "A colonização deve ser
  narrada como 'descobrimento e civilização' ou pela agência histórica dos
  povos colonizados?" A seção "Debates historiográficos" opõe duas leituras que
  disputam o mesmo espaço explicativo, uma rejeitando a outra:
  frase-fonte: *"Historiografias mais antigas [...] tendiam a descrever a
  colonização como processo relativamente linear de 'descobrimento' e
  'civilização', minimizando ou justificando a violência da conquista [...].
  Historiografias mais recentes [...] enfatizam a agência histórica dos povos
  colonizados [...] em vez de tratá-los como meros objetos passivos do processo
  colonizador europeu."* — a leitura recente explicitamente substitui/rejeita a
  antiga, não apenas a complementa.

- **`historia-a-independencia-do-brasil`** — pergunta: "A independência foi
  ruptura completa com o período colonial ou continuidade estrutural sob nova
  administração?" Frase-fonte de rivalidade (não mera distinção): *"As
  continuidades [...] contrariando qualquer leitura da independência como
  ruptura completa e imediata com o passado colonial [...] evidenciam que a
  independência brasileira representou primordialmente uma ruptura política e
  administrativa com Portugal, mantendo praticamente intactas as estruturas
  econômicas e sociais centrais da sociedade colonial."* — o texto rejeita
  ativamente a leitura de ruptura completa, não apenas soma duas leituras
  válidas.

- **`historia-europa-no-seculo-xix`** — pergunta: "Como transformar a sociedade
  capitalista industrial: por revolução imediata ou por reforma gradual dentro
  do sistema parlamentar?" Frase-fonte: *"Correntes mais moderadas de
  socialismo, como a social-democracia alemã [...] buscavam alcançar reformas
  [...] por meio de participação eleitoral [...] em vez de ruptura revolucionária
  imediata e completa, uma divisão estratégica entre reformismo gradual e
  revolução imediata."* — as duas estratégias disputam o mesmo objetivo
  (transformar o capitalismo industrial) e são mutuamente excludentes como
  caminho de ação, não coexistem como aspectos complementares.

### `camadas-de-determinacao` (3 capítulos)

Testados contra o critério de assimetria real (base condiciona a camada acima,
não "estão interligados").

- **`historia-ascensao-e-dominio-das-oligarquias`** — base: coronelismo local
  (dependência econômica do eleitor ao proprietário rural). Frase-fonte de
  assimetria: *"Esse sistema perpetuava o domínio oligárquico [...] sustentando
  toda a pirâmide política que ia do coronel local até o presidente da
  República."* — o coronelismo (base, nível local) sustenta estruturalmente as
  camadas acima (política dos governadores e café-com-leite, nível estadual e
  federal); a pirâmide é explicitamente direcional, não uma interconexão neutra.

- **`historia-a-primeira-globalizacao`** — base: a doutrina mercantilista.
  Frase-fonte de assimetria: *"Essa lógica exigia trabalho compulsório em larga
  escala para viabilizar economicamente a exploração colonial: a escravização
  de povos indígenas primeiro, e depois [...] o tráfico transatlântico."* — a
  doutrina (base ideológica/econômica) exige e condiciona o sistema de trabalho
  compulsório (camada acima), relação de dependência unidirecional explícita.

- **`historia-vida-urbana-e-renascimento-cultural`** — base: riqueza comercial
  das cidades italianas financiando o mecenato. Frase-fonte de assimetria:
  *"O renascimento comercial e urbano das cidades italianas [...] gerou classe
  de mecenas ricos [...] dispostos a financiar generosamente artistas,
  arquitetos e intelectuais."* — e a síntese do capítulo liga explicitamente arte
  e ciência à mesma base de valores: *"ambos podem ser interpretados como
  expressões de um mesmo valor cultural mais amplo do Renascimento — a
  confiança crescente na observação empírica sistemática."* A riqueza comercial
  é base condicionando tanto o mecenato quanto, por meio dele, as camadas
  artística e científica.

### `cadeia-de-derivacao` (8 capítulos)

Cada etapa verificada como decorrendo genuinamente da anterior (não apenas
cronologia); remover um elo muda a conclusão.

- **`historia-revolucao-francesa`** — crise fiscal/social do Antigo Regime →
  convocação dos Estados Gerais → recusa do voto por estamento leva à
  autoproclamação de Assembleia Nacional → Tomada da Bastilha → Declaração dos
  Direitos → Constituição de 1791 (monarquia constitucional) → desconfiança
  sobre Luís XVI + guerra externa → radicalização e proclamação da República →
  Terror. Já estruturado como etapas encadeadas no próprio currículo, conforme
  o brief antecipava.
- **`historia-revolucao-industrial`** — cercamentos (condição estrutural que
  cria mão de obra assalariada disponível) → concentração fabril e disciplina
  de trabalho → condições extremas → resistência (ludismo, cartismo) →
  documentação de abusos → leis fabris. Sem cercamentos, não há mão de obra
  urbana disponível em escala; sem a exploração fabril documentada, não há
  pressão legislativa.
- **`historia-grandes-navegacoes-e-conquista-colonial`** — investimento
  português em tecnologia náutica (Sagres) → exploração da costa africana e
  rota da Índia → Tratado de Tordesilhas (partilha territorial condicionada
  pelo conhecimento geográfico da época) → chegada a 1500 dentro da faixa
  portuguesa → modelo econômico inicial de baixo investimento (escambo do
  pau-brasil), dada a prioridade menor do Brasil frente ao comércio de
  especiarias já estabelecido.
- **`historia-a-era-vargas-o-governo-constitucional-1934-1937`** — polarização
  AIB/ANL → Intentona Comunista de 1935 (pretexto real, embora derrotado em
  dias) → estado de sítio prolongado e repressão ampliada → fabricação do
  "Plano Cohen" como pretexto final → Golpe do Estado Novo. Sem a Intentona não
  há justificativa para o estado de sítio; sem o Plano Cohen fabricado não há
  pretexto imediato para o golpe.
- **`historia-o-fim-da-guerra-fria`** — crise estrutural soviética → reformas
  de Gorbachev (perestroika/glasnost, destinadas a salvar o sistema) → decisão
  específica de não intervenção militar → colapso em cascata dos regimes do
  Leste Europeu em 1989 → dissolução da URSS em 1991 → nova ordem unipolar.
  Frase-fonte de dependência: *"a decisão soviética [...] de não intervir
  militarmente [...] permitindo o colapso em cascata."*
- **`historia-o-periodo-entreguerras-1918-1939`** — instabilidade herdada da
  Primeira Guerra + Crise de 1929 → ascensão dos regimes totalitários
  (fascismo, nazismo, stalinismo) → fragilidade da Liga das Nações e política
  de apaziguamento → falha da contenção diplomática → Segunda Guerra Mundial.
- **`historia-regime-militar-1964-1985-ii`** — abertura controlada ("lenta,
  gradual e segura") → revogação do AI-5 e Lei da Anistia (1979) → crise
  econômica agrava o desgaste do regime → mobilização das Diretas Já → rejeição
  da emenda no Congresso → eleição indireta de Tancredo Neves → transição
  democrática.
- **`historia-brasil-imperio-formacao-do-estado-nacional-brasileiro`** —
  Constituição de 1824 (Poder Moderador concentra poder desproporcional) →
  Confederação do Equador de 1824 (revolta contra o autoritarismo, reprimida
  mas sem resolver o problema estrutural) → tensão persiste e se agrava (perda
  da Cisplatina, suspeita de prioridade portuguesa) → Abdicação de 1831.
  Frase-fonte de dependência: *"a repressão bem-sucedida à Confederação do
  Equador em 1824 não resolveu esse problema estrutural de fundo [...] as
  mesmas tensões [...] ressurgiriam, de forma ainda mais decisiva, [...]
  culminando na abdicação."*

### `criterios-conjuntivos` (Fase 2, pendente do merge da Sociologia — 3 capítulos)

Condições que precisam estar todas presentes juntas; retirar uma faz a
conclusão falhar. Usada apenas onde o próprio texto afirma explicitamente que
nenhum fator isolado seria suficiente.

- **`historia-o-nazismo-na-alemanha`** — frase-fonte: *"achar que o Tratado de
  Versalhes foi o único fator explicativo suficiente para a ascensão nazista —
  combinou-se com a hiperinflação de 1923, a Grande Depressão de 1929 e a
  fragilidade institucional da democracia alemã [...], sem um único fator
  isolado sendo suficiente."* Quatro condições conjuntas (ressentimento de
  Versalhes, hiperinflação, depressão, fragilidade institucional), nenhuma
  isoladamente suficiente.
- **`historia-brasil-imperio-o-declinio-do-segundo-reinado`** — frase-fonte:
  *"a perda simultânea de apoio de múltiplos setores tradicionalmente aliados é
  mais desestabilizadora do que o desgaste isolado de apenas um desses grupos
  de apoio."* Três apoios (clero, Forças Armadas, cafeicultores) cuja perda
  conjunta, não isolada, derruba a monarquia.
- **`historia-primeira-guerra-mundial-1914-1918`** — frase-fonte: *"o
  assassinato do arquiduque [...] funcionou como estopim imediato que [...]
  dependeu de tensões estruturais acumuladas há décadas (sistema de alianças,
  nacionalismo, corrida armamentista) para se transformar em conflito
  continental generalizado."* O estopim isolado não bastaria sem as condições
  estruturais já presentes simultaneamente.

### `escala-de-graus` (1 capítulo)

- **`historia-america-espanhola`** — hierarquia de castas coloniais, ordem
  genuína (não cronológica) com consequências jurídicas reais em cada grau.
  Frase-fonte: *"posições intermediárias específicas conforme combinações
  étnicas variadas reconhecidas formalmente por essa estrutura de castas, que
  determinava direitos legais, ocupações permitidas e status social de cada
  indivíduo dentro dessa hierarquia colonial rigidamente codificada."* Eixo:
  de peninsulares (grau mais alto) a população escravizada (grau mais baixo).

### `movimento-dialetico` (1 capítulo — como esperado, raro ou zero)

- **`historia-reforma-religiosa`** — o único candidato genuíno encontrado,
  como o próprio brief antecipava. Tese implícita: catolicismo pré-Reforma.
  Antítese genuína: a crítica protestante (Lutero/Calvino) nega a autoridade
  papal e a venda de indulgências. Síntese que transforma ambos os lados: a
  Contrarreforma. Frase-fonte: *"[o Concílio de Trento] reafirmou dogmas
  católicos centrais contestados pelos protestantes [...] ao mesmo tempo em
  que promoveu reformas internas destinadas a corrigir abusos genuínos que
  haviam alimentado as críticas protestantes originais."* — nem a posição
  católica original nem a protestante permanecem intactas: a Igreja preserva o
  dogma central mas incorpora a correção que a crítica exigia, um "cancelar,
  preservar e elevar" genuíno, não apenas resposta militar/doutrinária que
  ignora a crítica.

### `tipologia` (Fase 2, pendente do merge da Sociologia — 4 capítulos)

Tipos paralelos que não competem entre si pela mesma resposta — cada um é uma
forma legítima e coexistente do mesmo fenômeno mais amplo. Usada exatamente
nas categorias que o brief already sinalizava ("tipos de colonização, tipos de
revolta, formas de dominação política").

- **`historia-imperialismo-e-belle-epoque`** — formas de dominação colonial:
  direta (França) e indireta (Reino Unido), descritas lado a lado sem que uma
  refute a outra — são estratégias administrativas alternativas, não uma
  disputa pela mesma resposta.
- **`historia-brasil-imperio-o-periodo-regencial-1831-1840`** — tipos de
  revolta regencial: Cabanagem (participação popular ampla), Farroupilha
  (elites pecuaristas, separatismo temporário), Sabinada e Balaiada — cada uma
  com composição social e pauta distintas, coexistindo no mesmo período sem
  rivalizar entre si.
- **`historia-descolonizacao-afro-asiatica`** — tipos de trajetória de
  descolonização: negociada/predominantemente pacífica (Índia, 1947) versus
  guerra de libertação prolongada (Argélia, 1962) — dois padrões paralelos,
  não uma rivalidade sobre qual é "a" forma correta de descolonização.
- **`historia-grandes-revolucoes-do-seculo-xx`** — tipos/modelos de revolução
  do século XX: soviético (proletariado urbano), mexicano (coalizão heterogênea
  de lideranças regionais) e chinês (campesinato rural, adaptação teórica
  explícita do marxismo clássico). Frase-fonte: *"Diferente do modelo
  revolucionário soviético [...] a estratégia comunista chinesa mobilizou
  principalmente o campesinato rural [...] uma adaptação teórica e estratégica
  significativa do marxismo tradicional às condições específicas."*

### `grade-de-eixos` (Fase 2, pendente do merge da Sociologia)

Nenhum capítulo de História lido sustenta honestamente um cruzamento de dois
eixos independentes com um caso caindo em exatamente uma célula. Fica em zero,
resultado honesto — não forçado.

### Nova família

Nenhuma família nova foi necessária. Dois padrões recorrentes ficaram sem
família ao longo da leitura — comparação entre casos paralelos e
**independentes** (ex.: Atenas vs. Esparta em `historia-antiguidade-classica-o-mundo-grego`,
onde as duas pólis não disputam a mesma pergunta nem se combinam num único
caso) — mas nenhum deles foi promovido a família nova nesta task, por dois
motivos: (1) não haveria fonte suficiente que justifique uma estrutura
distinta das cinco existentes e das três pendentes com o mesmo rigor exigido
pelo brief; (2) esses casos já ficam adequadamente descritos como lacuna. Caso
uma task futura queira propor essa família ("comparação de casos paralelos
independentes"), **deve registrar a proposta aqui antes de usá-la**, conforme
a regra deste processo.

## Lacunas declaradas (26 capítulos)

A lacuna já conhecida de Fase 1:

- `historia-introducao-a-historia-e-primeiras-civilizacoes` — já tem
  experiência interativa própria (`sources`) no catálogo de
  `src/views/topic-experiments/catalog.ts`, no mesmo slot do fluxo de Explorar.

As 25 lacunas identificadas nesta leitura (motivo completo em
`src/views/topic-scenes/data/historia.ts`, campo `motivo` de cada entrada de
`historiaSemCena`) — todas seguem o padrão geral descrito acima (aspectos
paralelos e coexistentes do mesmo período, sem cadeia de dependência estrita,
rivalidade genuína ou assimetria de base/camada):

`historia-a-crise-do-antigo-sistema-colonial`,
`historia-a-era-vargas`, `historia-a-era-vargas-o-estado-novo`,
`historia-a-interiorizacao-da-colonizacao`, `historia-a-mineracao-no-brasil-colonial`,
`historia-a-montagem-da-colonizacao`,
`historia-a-primeira-republica-o-declinio-oligarquico-1889-1930`,
`historia-a-republica-da-espada`, `historia-absolutismo`,
`historia-alta-idade-media-e-feudalismo`, `historia-america-latina-no-seculo-xx`,
`historia-america-no-seculo-xix`, `historia-antiguidade-classica-o-mundo-grego`,
`historia-antiguidade-classica-o-mundo-romano`, `historia-baixa-idade-media`,
`historia-brasil-imperio-segundo-reinado-1840-1889`,
`historia-dinamica-interna-da-colonizacao`,
`historia-disputas-europeias-no-brasil-colonial`, `historia-guerra-fria`,
`historia-iluminismo`, `historia-o-brasil-atual`, `historia-regime-militar-1964-1985-i`,
`historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria`,
`historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo`,
`historia-segunda-guerra-mundial-1939-1945`.

## Contagem final

- `contraste-de-posicoes`: 3
- `camadas-de-determinacao`: 3
- `cadeia-de-derivacao`: 8
- `criterios-conjuntivos` (Fase 2): 3
- `escala-de-graus`: 1
- `movimento-dialetico`: 1
- `tipologia` (Fase 2): 4
- `grade-de-eixos` (Fase 2): 0
- Lacunas: 26 (1 já conhecida + 25 novas)
- **Total: 49**

## Estado do teste (esperado vermelho)

`npx vitest run src/views/topic-scenes/familias-historia.test.ts` falha no
teste "cobre os 49 capítulos, cada um exatamente uma vez", listando como
ausentes os 23 capítulos que já têm família definida acima mas ainda não têm
`SceneEntry` escrita em `historia.ts` (trabalho das próximas tasks):
`historia-a-era-vargas-o-governo-constitucional-1934-1937`,
`historia-a-historia-e-o-brasil`, `historia-a-independencia-do-brasil`,
`historia-a-primeira-globalizacao`, `historia-america-espanhola`,
`historia-ascensao-e-dominio-das-oligarquias`,
`historia-brasil-imperio-formacao-do-estado-nacional-brasileiro`,
`historia-brasil-imperio-o-declinio-do-segundo-reinado`,
`historia-brasil-imperio-o-periodo-regencial-1831-1840`,
`historia-descolonizacao-afro-asiatica`, `historia-europa-no-seculo-xix`,
`historia-grandes-navegacoes-e-conquista-colonial`,
`historia-grandes-revolucoes-do-seculo-xx`, `historia-imperialismo-e-belle-epoque`,
`historia-o-fim-da-guerra-fria`, `historia-o-nazismo-na-alemanha`,
`historia-o-periodo-entreguerras-1918-1939`,
`historia-primeira-guerra-mundial-1914-1918`, `historia-reforma-religiosa`,
`historia-regime-militar-1964-1985-ii`, `historia-revolucao-francesa`,
`historia-revolucao-industrial`, `historia-vida-urbana-e-renascimento-cultural`.
As outras duas asserções do arquivo (capítulos citados existem no catálogo;
toda lacuna tem motivo) passam. Isso é o estado correto ao fim desta task.

## Concerns / notas para as próximas tasks

- As famílias `tipologia` e `criterios-conjuntivos` foram usadas com base
  apenas na descrição textual do brief desta task, já que
  `08-familias-sociologia.md` não existe neste worktree (PR #173 não
  mesclado). Quando o merge da Sociologia acontecer, checar se o formato de
  dados exato (campos do `SceneEntry` para essas famílias) bate com o que for
  usado aqui.
- O número de lacunas (26/49, mais da metade) é bem maior que em Filosofia
  (1/35) e provavelmente maior que em Sociologia. Isso é um reflexo honesto do
  formato do material de História neste currículo (levantamento multi-aspecto
  com pegadinhas anti-simplificação), não um sinal de leitura rasa — cada
  lacuna tem motivo específico registrado.
- Dois casos (Atenas/Esparta; tipos de revolução do século XX antes de eu
  reclassificar o segundo como `tipologia`) evidenciam um padrão de
  "comparação entre casos paralelos independentes" que nenhuma família cobre
  bem. Vale a pena essa discussão ficar registrada para quando Filosofia e
  Sociologia também passarem por revisão cruzada.
