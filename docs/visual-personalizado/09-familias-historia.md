# Inventário de famílias de cena — História

Task 1 de Fase 3, **corrigida após revisão** (ver "Correções desta revisão" ao
final). Lê os 49 capítulos de História (`src/data/deepSummaryContent.json`,
`subject === "História"`) e atribui a família de cena que o conteúdo real
sustenta, sem escrever nenhuma entrada em `historia[]` (isso é trabalho das
tasks seguintes). `src/views/topic-scenes/data/historia.ts` fica com
`historia: SceneEntry[] = []` e `historiaSemCena` com as lacunas declaradas
abaixo. O teste de completude (`familias-historia.test.ts`) fica vermelho de
propósito: lista os capítulos que já têm família definida aqui mas ainda não
têm `SceneEntry` escrita — esse é o estado correto ao fim desta task.

**`tipologia` e `criterios-conjuntivos` agora existem neste worktree.** Os
componentes (`src/views/topic-scenes/families/Tipologia.tsx` e
`CriteriosConjuntivos.tsx`) e seus testes foram copiados **verbatim** de
`feature/cenas-sociologia` (PR #173, ainda não mesclado) via `git show`, para
garantir compatibilidade byte-a-byte quando as branches forem mescladas.
`SceneFamily` e `SceneEntry.nota?` em `types.ts` foram estendidos aditivamente
com o mesmo formato de Fase 2. `grade-de-eixos` não foi trazida: nenhum
capítulo de História precisa dela.

## Padrão geral encontrado

Ao contrário de Filosofia (capítulos escritos para sustentar debates
conceituais com estrutura clara de tese/antítese, escala ou derivação), os
capítulos de História seguem um formato de levantamento: 3-4 seções temáticas
por período, seguidas de "Pegadinhas frequentes" e "Pratique e confira". As
pegadinhas frequentemente alertam contra reduzir causas múltiplas a uma cadeia
única ou rivalidade binária — mas isso não significa que o capítulo inteiro
precise virar lacuna: **uma cena ancora um aspecto do capítulo, não o
capítulo inteiro** (o mesmo padrão de Filosofia e Sociologia, onde uma cena
usa 3-4 seções específicas, nunca todas as seções do capítulo). A primeira
versão deste documento errou justamente nisso, usando "não cobre o capítulo
inteiro" como motivo de lacuna — corrigido nesta revisão.

Com o padrão correto (uma seção ou par de seções que sustente genuinamente
rivalidade, derivação, assimetria de camada ou tipos nomeados já basta),
**38 capítulos** têm família definida e **11** ficam em lacuna declarada (1
já conhecida de Fase 1 + 10 identificados nesta leitura). Isso ainda é mais
lacunas que em Filosofia (1/35), mas bem menor que a contagem incorreta da
primeira versão (26/49) — a diferença mostra o tamanho do erro de aplicar o
padrão errado.

## Atribuições definitivas

### `contraste-de-posicoes` (3 capítulos)

- **`historia-a-historia-e-o-brasil`** — pergunta: "A colonização deve ser
  narrada como 'descobrimento e civilização' ou pela agência histórica dos
  povos colonizados?" Frase-fonte: *"Historiografias mais antigas [...]
  tendiam a descrever a colonização como processo relativamente linear de
  'descobrimento' e 'civilização', minimizando ou justificando a violência da
  conquista [...]. Historiografias mais recentes [...] enfatizam a agência
  histórica dos povos colonizados [...] em vez de tratá-los como meros
  objetos passivos."* — a leitura recente rejeita a antiga, não apenas a
  complementa.
- **`historia-a-independencia-do-brasil`** — pergunta: "A independência foi
  ruptura completa com o período colonial ou continuidade estrutural?"
  Frase-fonte: *"[...] contrariando qualquer leitura da independência como
  ruptura completa e imediata com o passado colonial [...] evidenciam que a
  independência brasileira representou primordialmente uma ruptura política e
  administrativa com Portugal, mantendo praticamente intactas as estruturas
  econômicas e sociais centrais."*
- **`historia-europa-no-seculo-xix`** — pergunta: "Como transformar a
  sociedade capitalista industrial: por revolução imediata ou por reforma
  gradual?" Frase-fonte: *"[...] uma divisão estratégica entre reformismo
  gradual e revolução imediata que marcaria profundamente os debates internos
  do movimento socialista europeu."*

### `camadas-de-determinacao` (4 capítulos)

- **`historia-ascensao-e-dominio-das-oligarquias`** — base: coronelismo local.
  Frase-fonte: *"[...] sustentando toda a pirâmide política que ia do coronel
  local até o presidente da República."*
- **`historia-a-primeira-globalizacao`** — base: doutrina mercantilista.
  Frase-fonte: *"Essa lógica exigia trabalho compulsório em larga escala para
  viabilizar economicamente a exploração colonial."*
- **`historia-vida-urbana-e-renascimento-cultural`** — base: riqueza comercial
  das cidades italianas. Frase-fonte (do corpo do capítulo, não do exercício):
  *"O renascimento comercial e urbano das cidades italianas [...] gerou classe
  de mecenas ricos [...] dispostos a financiar generosamente artistas,
  arquitetos e intelectuais."* A riqueza comercial é a base que condiciona o
  mecenato e, por meio dele, tanto a produção artística quanto a científica
  descritas nas seções seguintes.
- **`historia-a-primeira-republica-o-declinio-oligarquico-1889-1930`** — base:
  a elite cafeeira. Frase-fonte: *"[...] a elite cafeeira que sustentava
  politicamente o sistema oligárquico vigente."* Tenentismo, movimento
  operário e modernismo são convocados no "pratique" como camadas/sintomas
  dessa mesma base entrando em crise, não aspectos soltos.

### `cadeia-de-derivacao` (15 capítulos)

- **`historia-revolucao-francesa`** — crise do Antigo Regime → Estados Gerais
  → autoproclamação da Assembleia Nacional → Bastilha → Declaração →
  Constituição de 1791 → radicalização → Terror.
- **`historia-revolucao-industrial`** — cercamentos → mão de obra assalariada
  disponível → fábrica → condições extremas → resistência → leis fabris.
- **`historia-grandes-navegacoes-e-conquista-colonial`** — investimento em
  tecnologia náutica → exploração da costa africana → Tordesilhas → chegada a
  1500 → modelo econômico inicial de baixo investimento.
- **`historia-a-era-vargas`** — Revolução de 1930 (fim do café-com-leite) →
  Governo Provisório (decretos, sem mandato eletivo) → pressão do movimento
  constitucionalista paulista de 1932 → Constituição de 1934. Frase-fonte:
  *"esse período de governo provisório se encerrou formalmente com a
  promulgação de uma nova Constituição em 1934, que Vargas assinou após
  pressão de diferentes setores políticos, incluindo o movimento
  constitucionalista paulista de 1932."*
- **`historia-a-era-vargas-o-governo-constitucional-1934-1937`** —
  radicalização (AIB/ANL) → Intentona Comunista de 1935 (pretexto real) →
  estado de sítio prolongado → "Plano Cohen" fabricado → Golpe do Estado Novo.
- **`historia-a-era-vargas-o-estado-novo`** — participação brasileira na
  guerra contra o fascismo, ao lado dos Aliados → contradição com o próprio
  regime autoritário torna-se insustentável → pressão por redemocratização →
  Forças Armadas retiram apoio → queda de Vargas em 1945. Frase-fonte:
  *"Essa contradição ideológica tornou-se politicamente insustentável [...] as
  próprias Forças Armadas [...] retiraram seu apoio ao ditador em outubro de
  1945."*
- **`historia-a-republica-da-espada`** — governos militares autoritários
  (dissolução do Congresso por Deodoro) → crises armadas (Revolta da Armada,
  Revolução Federalista) contidas → transição para civis com Prudente de
  Morais (1894). Frase-fonte: *"A transição para governos civis [...] encerrou
  formalmente o período de governo militar direto."*
- **`historia-antiguidade-classica-o-mundo-romano`** — estrutura republicana
  distribuindo poder entre Senado/assembleias/magistrados → crise progressiva
  por guerras civis entre generais (César, Pompeu) → Augusto consolida poder
  pessoal absoluto mantendo fachada republicana. Frase-fonte: *"Essa estrutura
  republicana entrou em crise progressiva [...] marcada por guerras civis
  recorrentes [...] culminando na transição para o Império, quando Otávio
  Augusto [...] consolidou poder pessoal absoluto."*
- **`historia-baixa-idade-media`** — excedente agrícola → crescimento urbano e
  feiras comerciais; Cruzadas intensificam ainda mais esse comércio; a crise
  do século XIV rompe essa trajetória e encadeia internamente: escassez de mão
  de obra pela Peste → poder de barganha do trabalhador → abalo das estruturas
  servis → enfraquecimento do feudalismo → terreno para centralização
  monárquica.
- **`historia-a-montagem-da-colonizacao`** — capitanias hereditárias fracassam
  na maior parte do território → Coroa institui o Governo-Geral em 1548;
  obstáculos à escravidão indígena (fuga, epidemias, oposição jesuíta) levam
  ao tráfico transatlântico. Frase-fonte: *"O sistema fracassou [...] levando
  a Coroa a instituir, em 1548, o Governo-Geral"* e *"Esses fatores combinados
  levaram ao tráfico transatlântico de africanos escravizados."*
- **`historia-o-fim-da-guerra-fria`** — crise estrutural soviética → reformas
  de Gorbachev → decisão de não intervenção militar → colapso em cascata de
  1989 → dissolução da URSS → nova ordem unipolar.
- **`historia-o-periodo-entreguerras-1918-1939`** — instabilidade da Primeira
  Guerra + Crise de 1929 → ascensão dos totalitarismos → apaziguamento falha →
  Segunda Guerra Mundial. **Ressalva editorial para as próximas tasks**: o elo
  "ascensão dos totalitarismos → fragilidade da Liga das Nações" **não é uma
  dependência real** — a fragilidade da Liga é anterior e independente
  (desenho institucional de 1920 e não ratificação americana), não uma
  consequência do totalitarismo. A `SceneEntry` deve usar só os dois elos que
  seguram: (1) instabilidade do pós-guerra + 1929 → totalitarismo; (2)
  apaziguamento falho → Segunda Guerra Mundial.
- **`historia-regime-militar-1964-1985-i`** — golpe de 1964 → Atos
  Institucionais ampliam poder do Executivo → AI-5 (1968) intensifica
  repressão → "milagre econômico" financiado por dívida externa torna-se
  insustentável, preparando a crise que o capítulo II retoma. Frase-fonte de
  entrega ao capítulo seguinte: *"contribuindo diretamente para a crise
  econômica que marcaria a fase final e mais tardia do próprio regime
  militar brasileiro."*
- **`historia-regime-militar-1964-1985-ii`** — abertura controlada → revogação
  do AI-5 e Lei da Anistia (1979) → crise econômica agrava o desgaste → Diretas
  Já → rejeição da emenda → eleição indireta de Tancredo → transição.
- **`historia-brasil-imperio-formacao-do-estado-nacional-brasileiro`** —
  Constituição de 1824 (Poder Moderador) → Confederação do Equador (1824,
  contida, mas sem resolver o problema estrutural) → tensão ressurge mais
  decisiva (Cisplatina, suspeita de prioridade portuguesa) → Abdicação de
  1831. Frase-fonte: *"a repressão bem-sucedida à Confederação do Equador em
  1824 não resolveu esse problema estrutural de fundo [...] as mesmas tensões
  [...] ressurgiriam, de forma ainda mais decisiva [...] culminando na
  abdicação."*

### `criterios-conjuntivos` (Fase 2 — 4 capítulos)

- **`historia-o-nazismo-na-alemanha`** — frase-fonte: *"[...] combinou-se com
  a hiperinflação de 1923, a Grande Depressão de 1929 e a fragilidade
  institucional da democracia alemã [...], sem um único fator isolado sendo
  suficiente."*
- **`historia-brasil-imperio-o-declinio-do-segundo-reinado`** — frase-fonte:
  *"a perda simultânea de apoio de múltiplos setores tradicionalmente aliados
  é mais desestabilizadora do que o desgaste isolado de apenas um desses
  grupos de apoio."*
- **`historia-primeira-guerra-mundial-1914-1918`** — frase-fonte: *"[...]
  dependeu de tensões estruturais acumuladas há décadas (sistema de alianças,
  nacionalismo, corrida armamentista) para se transformar em conflito
  continental generalizado."*
- **`historia-o-brasil-atual`** — frase-fonte verbatim, a mesma construção de
  aceitação já usada em O Nazismo na Alemanha: *"achar que a redução da
  desigualdade nos anos 2000 resultou exclusivamente de programas sociais de
  transferência de renda — combinou-se também com valorização real do salário
  mínimo e período favorável de crescimento econômico [...], sem um único
  fator isolado sendo suficiente para explicar sozinho essa redução."*
  Condições conjuntas: Bolsa Família + valorização do salário mínimo +
  crescimento puxado por commodities.

### `escala-de-graus` (1 capítulo)

- **`historia-america-espanhola`** — hierarquia de castas coloniais. Eixo: de
  peninsulares (grau mais alto) a população escravizada (grau mais baixo).
  Frase-fonte: *"[...] essa estrutura de castas, que determinava direitos
  legais, ocupações permitidas e status social de cada indivíduo dentro dessa
  hierarquia colonial rigidamente codificada."*

### `movimento-dialetico` (1 capítulo)

- **`historia-reforma-religiosa`** — tese implícita: catolicismo pré-Reforma.
  Antítese genuína: a crítica protestante nega a autoridade papal e a venda de
  indulgências. Síntese: a Contrarreforma. Frase-fonte: *"[o Concílio de
  Trento] reafirmou dogmas católicos centrais contestados pelos protestantes
  [...] ao mesmo tempo em que promoveu reformas internas destinadas a corrigir
  abusos genuínos que haviam alimentado as críticas protestantes originais."*
  **Correção desta revisão**: a fonte sustenta a transformação do polo
  **católico** (reafirma o dogma central mas incorpora a correção que a
  crítica exigia) — não afirma que o polo protestante também seja
  transformado pela síntese. A família ainda se sustenta (a transformação
  genuína de um dos polos pela negação do outro já configura o movimento),
  mas a `SceneEntry` não deve alegar que "nenhum dos dois lados permanece
  intacto" — apenas que a posição católica final não é a pré-Reforma nem a
  simples rejeição da crítica protestante.

### `tipologia` (Fase 2 — 10 capítulos)

Tipos paralelos que não competem pela mesma resposta — cada um é uma forma
coexistente do mesmo fenômeno mais amplo, sempre com uma frase-guarda-chuva
explícita nomeando a categoria antes de enumerar as instâncias.

- **`historia-imperialismo-e-belle-epoque`** — formas de dominação colonial:
  direta (França) e indireta (Reino Unido).
- **`historia-brasil-imperio-o-periodo-regencial-1831-1840`** — tipos de
  revolta regencial: Cabanagem, Farroupilha, Sabinada, Balaiada.
- **`historia-descolonizacao-afro-asiatica`** — tipos de trajetória de
  descolonização: negociada (Índia) versus guerra de libertação (Argélia).
- **`historia-grandes-revolucoes-do-seculo-xx`** — modelos de revolução:
  soviético (proletariado urbano), mexicano (coalizão heterogênea), chinês
  (campesinato rural). Frase-fonte: *"Diferente do modelo revolucionário
  soviético [...] a estratégia comunista chinesa mobilizou principalmente o
  campesinato rural [...] uma adaptação teórica e estratégica significativa."*
- **`historia-antiguidade-classica-o-mundo-grego`** — frase-guarda-chuva:
  *"um mosaico de cidades-Estado (poleis) independentes entre si [...] unidas
  por elementos culturais compartilhados."* Atenas e Esparta são duas pólis
  que a própria frase-fonte já classifica como membros dessa categoria comum,
  cada uma organizando-se de forma diferente — não uma rivalidade sobre a
  mesma pergunta.
- **`historia-absolutismo`** — frase-guarda-chuva: *"As justificativas
  teóricas para o poder absoluto do monarca variaram ao longo do período [...]
  ainda que ambas concluam pela necessidade de poder centralizado absoluto."*
  Direito divino (Bossuet) e contratualismo (Hobbes) são dois tipos paralelos
  de justificação para a mesma prática, não rivais.
- **`historia-iluminismo`** — frase-guarda-chuva: *"Diferentes pensadores
  iluministas desenvolveram propostas específicas para reorganizar o poder
  político, ainda que compartilhando a base racionalista comum."*
  Montesquieu (separação de poderes), Rousseau (soberania popular) e Voltaire
  (liberdade de expressão) são tipos paralelos de aplicação da razão à
  política, não posições rivais sobre a mesma pergunta.
- **`historia-alta-idade-media-e-feudalismo`** — frase-guarda-chuva: a
  suserania/vassalagem é explicitamente descrita como um tipo de vínculo
  "distinta da relação entre senhor e servo camponês descrita anteriormente"
  — dois tipos de vínculo de dependência pessoal que coexistem no mesmo
  sistema feudal, servindo a propósitos diferentes (um entre nobres, outro
  entre senhor e camponês).
- **`historia-disputas-europeias-no-brasil-colonial`** — dois tipos de
  contestação europeia ao domínio português no Brasil colonial: a França
  Antártica (refúgio religioso + comércio do pau-brasil, aliança com
  tupinambás) e as invasões holandesas (interesse comercial açucareiro direto,
  administração de Nassau). São tipos distintos de empreendimento colonial
  rival, em séculos diferentes, não uma cadeia entre si nem uma rivalidade
  sobre a mesma pergunta.
- **`historia-a-crise-do-antigo-sistema-colonial`** — frase-guarda-chuva:
  *"As revoltas coloniais que eclodiram no Brasil [...] refletiram, com
  intensidade e motivação variadas, esse descontentamento crescente com o
  pacto colonial."* A Inconfidência Mineira (elite local, motivação fiscal) e
  a Conjuração Baiana (participação popular, pautas sociais radicais,
  abolição) são dois tipos de revolta colonial contra o mesmo pacto, com
  composição e pauta diferentes.

### `grade-de-eixos` (Fase 2)

Zero capítulos de História sustentam honestamente um cruzamento de dois eixos
independentes. Resultado honesto, não forçado — o componente e seus campos de
`SceneEntry`/`types.ts` não foram trazidos para este worktree.

### Nova família

Nenhuma família nova foi necessária. A proposta anterior desta task
("comparação de casos paralelos independentes", para Atenas/Esparta e para os
modelos de revolução do século XX) está **retirada**: nesta revisão, esses
casos foram corretamente reclassificados como `tipologia` — o padrão "tipos
paralelos que não disputam a mesma resposta" já cobre exatamente essa forma,
bastando reconhecer a frase-guarda-chuva que os introduz. Não há necessidade
de outra família para o mesmo fenômeno.

## Lacunas declaradas (11 capítulos)

A lacuna já conhecida de Fase 1:

- `historia-introducao-a-historia-e-primeiras-civilizacoes` — já tem
  experiência interativa própria (`sources`) no catálogo de
  `src/views/topic-experiments/catalog.ts`.

As 10 lacunas identificadas nesta leitura, cada uma com o motivo específico
completo em `src/views/topic-scenes/data/historia.ts` (nenhuma usa mais
"não cobre o capítulo inteiro" como razão):

- `historia-a-interiorizacao-da-colonizacao` — bandeiras, mineração e
  pecuária/drogas do sertão são atividades paralelas sem dependência real,
  rivalidade, camada ou tipos nomeados entre si.
- `historia-a-mineracao-no-brasil-colonial` — a fiscalidade tensiona o
  ambiente que leva às revoltas, mas o texto não chega a afirmar a fiscalidade
  como base condicionando-as como camada; fica como lacuna, mas é a candidata
  mais próxima de reclassificação futura desta lista.
- `historia-america-latina-no-seculo-xx` — populismo, ditaduras e
  redemocratização trazem exemplos de um fenômeno já definido, não tipos
  paralelos com frase-guarda-chuva explícita.
- `historia-america-no-seculo-xix` — independências, expansão dos EUA e
  neocolonialismo são processos regionais distintos sem estrutura comum.
- `historia-brasil-imperio-segundo-reinado-1840-1889` — três processos sem
  dependência causal direta entre si (fim do tráfico não decorre da economia
  cafeeira; Guerra do Paraguai é disputa geopolítica à parte).
- `historia-dinamica-interna-da-colonizacao` — a resistência escrava enumera
  formas diversas mas sem frase-guarda-chuva de tipologia nomeada.
- `historia-guerra-fria` — Coreia e Vietnã são duas instâncias do mesmo tipo
  ("guerra por procuração"), não tipos paralelos distintos.
- `historia-republica-liberal-1945-1964-democracia-em-tempos-de-guerra-fria` —
  contradição interna de um único sistema (pluralismo formal + exclusão do
  PCB), não rivalidade entre duas posições.
- `historia-republica-liberal-1945-1964-desenvolvimentismo-e-populismo` —
  convivência tensa entre duas posturas do mesmo governo, não uma rivalidade
  decisória.
- `historia-segunda-guerra-mundial-1939-1945` — frentes europeia e do
  Pacífico avançam em paralelo, sem dependência estrita entre si.

## Contagem final

- `contraste-de-posicoes`: 3
- `camadas-de-determinacao`: 4
- `cadeia-de-derivacao`: 15
- `criterios-conjuntivos` (Fase 2): 4
- `escala-de-graus`: 1
- `movimento-dialetico`: 1
- `tipologia` (Fase 2): 10
- `grade-de-eixos` (Fase 2): 0
- Lacunas: 11 (1 já conhecida + 10 novas) — 22,4% dos 49 capítulos
- **Total: 49**

## Estado do teste (esperado vermelho)

`npx vitest run src/views/topic-scenes/familias-historia.test.ts` falha no
teste "cobre os 49 capítulos, cada um exatamente uma vez", listando como
ausentes os 38 capítulos que já têm família definida acima mas ainda não têm
`SceneEntry` escrita em `historia.ts` (trabalho das próximas tasks). As outras
duas asserções (capítulos citados existem no catálogo; toda lacuna tem
motivo) passam. Isso é o estado correto ao fim desta task.

## Correções desta revisão

Uma revisão encontrou 3 Critical + 5 Important + 3 Minor na primeira versão.
Todas foram corrigidas nesta rodada:

1. **Peça arquitetural**: `Tipologia.tsx` e `CriteriosConjuntivos.tsx` (e seus
   testes) foram copiados verbatim de `feature/cenas-sociologia` via
   `git show`, não reimplementados — confirmado por diff, byte-a-byte
   idênticos. `types.ts` e `TopicScene.tsx` foram estendidos aditivamente
   (sem tocar `grade-de-eixos`). `TopicScene.css` recebeu só as regras
   `.tc-tipo*`, `.tc-nota` e `.tc-criterio*`/`.tc-veredito-barra`.
2. **Critical 1**: `historia-antiguidade-classica-o-mundo-grego`,
   `historia-absolutismo`, `historia-iluminismo` → `tipologia`;
   `historia-o-brasil-atual` → `criterios-conjuntivos`.
3. **Critical 2**: `historia-baixa-idade-media` → `cadeia-de-derivacao`,
   motivo reescrito.
4. **Critical 3**: "não cobre o capítulo inteiro" foi removido como
   justificativa de lacuna em todo o documento e em `historia.ts`; a
   re-revisão completa gerou mais reclassificações que as listadas como
   Important (ver `cadeia-de-derivacao` e `tipologia` acima, que cresceram
   de 8→15 e 4→10 respectivamente).
5. **Important**: `historia-a-montagem-da-colonizacao`,
   `historia-regime-militar-1964-1985-i` → `cadeia-de-derivacao`;
   `historia-a-primeira-republica-o-declinio-oligarquico-1889-1930` →
   `camadas-de-determinacao`; `historia-alta-idade-media-e-feudalismo` →
   `tipologia`.
6. **Important (documentação, não reclassificação)**: ressalva sobre o elo
   fraco em `historia-o-periodo-entreguerras-1918-1939` registrada acima;
   afirmação sobre `historia-reforma-religiosa` corrigida para não alegar
   transformação do polo protestante.
7. **Important**: proposta de família nova retirada (ver seção "Nova
   família").
8. **Minor**: citação de `historia-vida-urbana-e-renascimento-cultural`
   re-sourceada do corpo do capítulo, não do "Pratique e confira";
   `historia-disputas-europeias-no-brasil-colonial` reclassificada para
   `tipologia`, motivo antigo removido; palavra em inglês corrigida.

## Concerns / notas para as próximas tasks

- `tipologia` e `criterios-conjuntivos` foram copiadas verbatim, mas o
  `SceneEntry.nota?` e o restante do formato devem ser revalidados quando o
  PR #173 for mesclado, caso a Sociologia tenha evoluído o formato entretanto.
- `historia-a-mineracao-no-brasil-colonial` é a lacuna mais próxima de virar
  `camadas-de-determinacao` numa leitura futura mais generosa — registrado
  explicitamente no motivo para não se perder.
- O elo fraco identificado em `historia-o-periodo-entreguerras-1918-1939`
  (ver acima) precisa ser respeitado por quem escrever a `SceneEntry`: usar só
  os dois elos que seguram, não o terceiro.
- `cadeia-de-derivacao` (15) e `tipologia` (10) ficaram com contagens altas
  depois desta correção. Isso é resultado de aplicar o padrão correto
  (ancorar em uma seção, não no capítulo inteiro) de forma consistente a
  todos os capítulos, não de forçar novamente — mas vale um segundo par de
  olhos nas entradas mais marginais (`historia-antiguidade-classica-o-mundo-romano`,
  `historia-a-era-vargas-o-estado-novo`, `historia-a-republica-da-espada`)
  quando as Tasks 3-4 escreverem as `SceneEntry` de fato, já que a leitura
  desta task não tem o mesmo par de olhos independente que a revisão trouxe.
