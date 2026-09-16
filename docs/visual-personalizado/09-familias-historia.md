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
**36 capítulos** têm família definida e **13** ficam em lacuna declarada (1
já conhecida de Fase 1 + 12 identificados nesta leitura). Isso ainda é mais
lacunas que em Filosofia (1/35), mas bem menor que a contagem incorreta da
primeira versão (26/49) — a diferença mostra o tamanho do erro de aplicar o
padrão errado. (Uma segunda rodada de revisão devolveu dois capítulos à
lacuna — ver "Correções da segunda revisão" ao final — por não sustentarem,
sob leitura mais rigorosa, a família que a primeira correção lhes atribuiu.)

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

### `cadeia-de-derivacao` (14 capítulos)

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

### `tipologia` (Fase 2 — 8 capítulos)

Tipos paralelos que não competem pela mesma resposta — cada um é uma forma
coexistente do mesmo fenômeno mais amplo, sempre com uma frase-guarda-chuva
explícita nomeando a categoria antes de enumerar as instâncias.

- **`historia-imperialismo-e-belle-epoque`** — formas de dominação colonial:
  direta (França) e indireta (Reino Unido).
- **`historia-brasil-imperio-o-periodo-regencial-1831-1840`** — tipos de
  revolta regencial: Cabanagem, Farroupilha, Sabinada, Balaiada.
- **`historia-descolonizacao-afro-asiatica`** — tipos de trajetória de
  descolonização: negociada (Índia) versus guerra de libertação (Argélia).
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
  "distintas da relação entre senhor e servo camponês descrita anteriormente"
  (concordando com "A suserania e a vassalagem", no plural — citação corrigida
  nesta revisão) — dois tipos de vínculo de dependência pessoal que coexistem
  no mesmo sistema feudal, servindo a propósitos diferentes (um entre nobres,
  outro entre senhor e camponês).
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

## Lacunas declaradas (13 capítulos)

A lacuna já conhecida de Fase 1:

- `historia-introducao-a-historia-e-primeiras-civilizacoes` — já tem
  experiência interativa própria (`sources`) no catálogo de
  `src/views/topic-experiments/catalog.ts`.

As 12 lacunas identificadas nesta leitura, cada uma com o motivo específico
completo em `src/views/topic-scenes/data/historia.ts` (nenhuma usa mais
"não cobre o capítulo inteiro" como razão):

- `historia-a-interiorizacao-da-colonizacao` — bandeiras, mineração e
  pecuária/drogas do sertão são atividades paralelas sem dependência real,
  rivalidade, camada ou tipos nomeados entre si.
- `historia-a-mineracao-no-brasil-colonial` — a fiscalidade tensiona o
  ambiente que leva às revoltas, mas o texto não chega a afirmar a fiscalidade
  como base condicionando-as como camada; fica como lacuna, mas é a candidata
  mais próxima de reclassificação futura desta lista.
- `historia-a-republica-da-espada` — o texto é periodização, não causação: a
  eleição de Prudente de Morais "marca" o fim do governo militar, mas nunca
  afirma que conter a Revolta da Armada e a Revolução Federalista produziu a
  transição; o "pratique" entrega essa pergunta causal em aberto ao aluno e a
  pegadinha frisa que os dois movimentos tiveram "dinâmica e atores regionais
  distintos" (paralelos, não encadeados). Reclassificada de
  `cadeia-de-derivacao` para lacuna na segunda revisão.
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
- `historia-disputas-europeias-no-brasil-colonial` — não há frase-guarda-chuva
  nomeando França Antártica e invasões holandesas como tipos de uma mesma
  categoria (é prosa cronológica pura), e a própria pegadinha nega a
  coexistência exigida por tipologia ao frisar que ocorreram em séculos
  diferentes. Reclassificada de `tipologia` para lacuna na segunda revisão,
  pelo mesmo raciocínio já usado (corretamente) em
  `historia-dinamica-interna-da-colonizacao`.
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
- `historia-grandes-revolucoes-do-seculo-xx` — as três revoluções (Russa,
  Mexicana, Chinesa) são narradas em seções independentes, sem
  frase-guarda-chuva nomeando "modelos revolucionários" como categoria
  comum às três. A única frase categorial do capítulo é um contraste
  bilateral, dentro da própria seção "Revolução Chinesa", entre o modelo
  soviético e o chinês, que nunca menciona o México; a seção "Revolução
  Russa" não contém nenhuma citação sobre "modelo soviético", rótulo que só
  aparecia citado de segunda mão dentro da seção chinesa. Reclassificada de
  `tipologia` para lacuna na terceira revisão (Task 4b), mesmo raciocínio já
  usado em `historia-disputas-europeias-no-brasil-colonial`.

## Contagem final

Nota (Task 4b): as linhas abaixo refletem apenas a reclassificação de
`historia-grandes-revolucoes-do-seculo-xx`, de `tipologia` para lacuna. As
duas reclassificações de `cadeia-de-derivacao` para lacuna
(`historia-regime-militar-1964-1985-i` e `-ii`, registradas no comentário de
`historia.ts` de outro dispatch da Task 4a) ainda não foram propagadas a
este documento — `historia.ts` é a fonte de verdade corrente para as
famílias e lacunas efetivamente escritas.

Contagem corrente, reconciliada com `historia.ts` na verificacao final
(Task 6 - ver "Verificacao" ao final). `historia.ts` e a fonte de verdade:

- `contraste-de-posicoes`: 3
- `camadas-de-determinacao`: 4
- `cadeia-de-derivacao`: 11
- `criterios-conjuntivos` (Fase 2): 5
- `escala-de-graus`: 1
- `movimento-dialetico`: 1
- `tipologia` (Fase 2): 8
- `grade-de-eixos` (Fase 2): 0
- Lacunas: 16
- **Total: 49** (33 entradas escritas + 16 lacunas em `historia.ts`)

As contagens anteriores deste bloco (14 `cadeia-de-derivacao`, 4
`criterios-conjuntivos`, 34 entradas, 15 lacunas) estavam defasadas: nao
tinham propagado as reclassificacoes das Tasks 4a/4b nem as da Task 6.

## Estado do teste (esperado vermelho)

`npx vitest run src/views/topic-scenes/familias-historia.test.ts` falha no
teste "cobre os 49 capítulos, cada um exatamente uma vez", listando como
ausentes os 36 capítulos que já têm família definida acima mas ainda não têm
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

## Correções da segunda revisão

Uma segunda rodada de revisão aprovou integralmente a primeira correção (cópia
byte-a-byte, os 3 Critical, os 5 Important, os 3 Minor) e encontrou mais dois
problemas na extensão que eu mesmo fiz ao aplicar o padrão corrigido de forma
ampla, mais um erro de citação:

1. **`historia-a-republica-da-espada`**: devolvida para lacuna. Minha cadeia
   original (governos militares → crises contidas → transição) tinha um elo
   do meio sem fonte — o texto descreve periodização ("a eleição [...] marca
   [...] o fim"), nunca causação, e o próprio "pratique" deixa essa pergunta
   causal em aberto para o aluno, enquanto a pegadinha frisa que os dois
   movimentos militares tiveram "dinâmica e atores regionais distintos". Existe
   um elo real, mas menor (dissolução do Congresso por Deodoro em 1891 →
   crise institucional → sua renúncia), curto demais para sustentar uma cena
   sozinho.
2. **`historia-disputas-europeias-no-brasil-colonial`**: devolvida para
   lacuna. Era a única das dez entradas de `tipologia` sem frase-guarda-chuva
   citada — porque a fonte não tem uma. Pior: a pegadinha nega ativamente a
   coexistência exigida pela família, ao frisar que França Antártica e
   invasões holandesas ocorreram em séculos diferentes. Mesmo raciocínio que
   eu já havia aplicado corretamente a `historia-dinamica-interna-da-colonizacao`;
   faltou aplicá-lo aqui também na primeira correção.
3. **`historia-alta-idade-media-e-feudalismo`**: citação corrigida de
   "distinta" para "distintas" (concordando com o sujeito plural "A suserania
   e a vassalagem" no texto-fonte).

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
- `cadeia-de-derivacao` (14) e `tipologia` (9) ainda ficaram com contagens
  relativamente altas depois das duas correções. Isso é resultado de ancorar
  em uma seção (não no capítulo inteiro) de forma consistente, mas duas
  entradas já se mostraram fracas demais numa segunda leitura — vale um
  terceiro par de olhos nas entradas mais próximas do limite
  (`historia-antiguidade-classica-o-mundo-romano`,
  `historia-a-era-vargas-o-estado-novo`) quando as Tasks 3-4 escreverem as
  `SceneEntry` de fato.

## Verificação (Task 6)

Segunda passagem, independente e transversal, sobre as 33 entradas juntas —
não uma reconferência das revisões por task, que já haviam encontrado defeitos
reais em todas as rodadas anteriores.

### Parte A — citações e estrutura

**Citações.** As 114 citações das 33 entradas foram re-derivadas
programaticamente contra `deepSummaryContent.json`: toda `section` é título
exato de uma seção do capítulo citado e toda `quote` é substring literal
daquela seção (normalizando maiúsculas e espaços, nunca acentos). **114/114
passaram, 0 fabricadas, 0 misatribuídas.** Os 49 capítulos reconciliam: 33
entradas + 16 lacunas, cada capítulo exatamente uma vez.

**Defeitos encontrados e corrigidos** (6 em dados, 1 em componente):

1. **`historia-a-montagem-da-colonizacao` — encaixe forçado em
   `cadeia-de-derivacao`.** Tinha 2 itens que eram dois pares causais
   independentes (capitanias → Governo-Geral; obstáculos → tráfico), o que a
   própria `question` admitia ("cada um, sua própria consequência"). Remover o
   primeiro item não quebrava a conclusão do segundo — não era uma cadeia.
   **Reclassificado para `criterios-conjuntivos`**, família que o capítulo
   sustenta de verdade: resistência indígena + mortalidade por epidemias +
   oposição jesuíta, com a frase de necessidade conjunta literal na seção
   "Pratique e confira" ("nenhum desses fatores isoladamente seria suficiente
   ... exigindo uma explicação que combine causas biológicas, políticas e
   religiosas atuando simultaneamente").

2. **`historia-baixa-idade-media` — cronologia vestida de derivação.** A fonte
   nega a derivação com as próprias palavras em duas costuras: a crise do
   século XIV é "ruptura abrupta ... na trajetória de crescimento" anterior
   (não deriva dela), e a Guerra dos Cem Anos entra com "Paralelamente" (não
   deriva da Peste). **Reduzido ao arco que de fato deriva** — Peste Negra →
   escassez de mão de obra → poder de barganha → abalo das estruturas
   senhoriais —, todo ele numa única frase da fonte, com linguagem causal
   explícita em cada costura. Mesmo precedente de escopo estreito já usado em
   `A Primeira Globalização`.

3. **`historia-a-era-vargas` — costura fraca em `cadeia-de-derivacao`.** O elo
   "governo provisório sem mandato → Constituição de 1934" apoiava-se só em
   "após pressão de diferentes setores", que é temporal. A dependência real
   existe e está na fonte, em "Pegadinhas frequentes": o movimento de 1932
   reivindicava "o fim do governo provisório sem mandato eletivo" — isto é,
   exatamente o estado descrito pelo elo anterior. **Inserido esse elo
   intermediário**, tornando a derivação visível em vez de pressuposta.

4. **`historia-vida-urbana-e-renascimento-cultural` — determinação afirmada,
   não lastreada.** Em `camadas-de-determinacao` a relação base→camada *é* o
   conteúdo da cena, e as camadas 3 e 4 traziam o conector ("esse contexto
   sustentou") apenas no `claim`: as citações de Leonardo e da perspectiva
   linear não diziam nada sobre serem determinadas pelo mecenato.
   **Reancoradas as quatro camadas em trechos que carregam a determinação**:
   a base passa a citar a frase que a nomeia como "condição econômica
   estrutural necessária (ainda que não suficiente isoladamente)" — que ainda
   desclama a suficiência —, e a camada da arte passa a citar "A arte
   renascentista desenvolveu técnicas e temáticas que refletiam diretamente os
   valores humanistas".

5. **`historia-o-nazismo-na-alemanha` — item duplicando outro.** O `claim` do
   item "Hiperinflação de 1923" afirmava também a Grande Depressão, que é o
   item seguinte, e os dois compartilhavam a mesma citação — numa família em
   que cada item deve ser *um* fator distinto, isso embaralha a conjunção.
   `claim` reescopado à hiperinflação; e "só a combinação dos três" virou "só a
   combinação deles", porque o item 3 nomeia também o ressentimento
   nacionalista, de modo que "três" não fechava.

6. **`historia-a-primeira-republica-o-declinio-oligarquico-1889-1930` — a
   `question` prometia o que nenhum item entrega** ("até a crise de 1930
   rompê-lo"; nenhum item cobre a ruptura). Pergunta reescrita para o que a
   cena de fato mostra.

7. **`CriteriosConjuntivos.tsx` — texto fixo afirmando algo específico de
   matéria.** O veredito era `Conceito válido: reúne ...` / `Conceito
   incompleto: falta ...`. Serve a Filosofia, onde critérios *definem um
   conceito*; é erro de categoria nas 5 entradas de História, que são
   explicações causais — a ascensão do nazismo não é um "conceito" que fica
   "válido". Trocado por `Reúne todos os critérios: ...` / `Ainda falta: ...`,
   verdadeiro nas duas leituras. É exatamente a classe do defeito de legenda de
   eixo da Fase 1.

**Verificações estruturais que passaram.** `escala-de-graus`: a ordem de
`América Espanhola` continua BAIXO→ALTO e casa com o render de baixo para cima
de `EscalaDeGraus.tsx` (`alturaDe(0)` = 156, `alturaDe(n-1)` = 40); o `eixo`
continua desclamando juízo moral. `movimento-dialetico`: `Reforma Religiosa`
segue mostrando só o polo católico se transformando. `tipologia` (8): todas as
8 têm frase-guarda-chuva literal nomeando a categoria antes de enumerar as
variantes. `A Primeira Globalização`: escopo estreito
(mercantilismo→trabalho compulsório) intacto, os 4 itens ainda saem todos da
mesma seção. A ressalva do elo fraco de `Entreguerras` (Liga das Nações)
continua respeitada: a entrada usa só os dois elos que seguram. Os outros 6
componentes não têm texto fixo específico de capítulo.

### Chamadas de julgamento sinalizadas, não alteradas

Deixadas como estão por serem defensáveis; registradas para quem revisar
depois:

- **`historia-a-independencia-do-brasil` (`contraste-de-posicoes`) — o
  contraste mais fraco dos três.** O polo "ruptura completa" só aparece na
  fonte sendo negado ("contrariando qualquer leitura da independência como
  ruptura completa"), e 2 dos 3 itens defendem o outro polo. É rivalidade
  genuína no sentido lógico (adotar a continuidade rejeita a ruptura) e o
  `claim` é honesto ao dizer "uma leitura possível", mas não há defensor do
  primeiro polo no capítulo. Substitui `Europa no Século XIX` como o contraste
  marginal — este, revisto agora, se sustenta bem: a fonte nomeia "uma divisão
  estratégica entre reformismo gradual e revolução imediata".
- **`Revolução Industrial` e `Entreguerras`** têm `question` com dois arcos
  ("e como ..."), admitindo que não são uma cadeia única. Os elos internos de
  cada arco seguram.
- **`Iluminismo` (`tipologia`)** — o item de Voltaire (liberdade de expressão,
  crítica ao fanatismo) não é bem uma "proposta de reorganização do poder
  político" como a pergunta promete, ainda que a frase-guarda-chuva o cubra.
- **`Antiguidade Clássica: o Mundo Romano` e `A Era Vargas: o Estado Novo`**,
  que este documento pedia para um terceiro par de olhos: ambas se sustentam.
  Em Roma cada elo retroreferencia o anterior na própria fonte ("Essa
  estrutura republicana entrou em crise", "culminando na transição"); no
  Estado Novo os itens 1 e 2 são próximos de redundantes, mas o item 2
  retroreferencia explicitamente ("Essa contradição ideológica") e gera a
  pressão que o item 3 consuma.

### Parte B — verificação no navegador: NÃO EXECUTADA

**Não foi feita.** O servidor de desenvolvimento subiu normalmente
(`localhost:3000`) e foi encerrado em seguida pelo PID da porta, mas nenhuma
automação de navegador estava disponível nesta sessão: a extensão do Chrome
não estava conectada e o MCP `chrome-devtools` falhou por timeout de conexão.
Nada da Parte B foi simulado e nenhum screenshot foi gerado —
`docs/visual-personalizado/screenshots/cenas-historia/` continua vazio.

O espaço em disco (3,0 GB livres, acima do piso de 1,5 GB) não foi o
impedimento.

Portanto, **não** foram medidos no navegador: overflow horizontal a ~1440px e
~390px, foco visível, ausência de animação infinita, console limpo, e a
persistência da cena entre trocas de seção observada no DOM real.

Duas dessas propriedades, porém, são verificáveis estaticamente e foram
conferidas no código:

- **Montagem / persistência / desmontagem.** Em `VisualJourney.tsx` a
  `TopicScene` fica *fora* do `AnimatePresence` que troca as seções e tem
  chave derivada só do id do resumo, que não depende do índice da seção —
  trocar de seção não remonta a cena nem zera seu estado. Em `Visual.tsx` a
  jornada inteira só é renderizada com `mode === 'explorar'`, então a cena
  desaparece em "Testar".
- **Teclado e `aria-pressed`.** As 7 famílias têm suíte de componente própria;
  `Tipologia` e `CriteriosConjuntivos` (as duas novas) têm testes nomeados
  para ativação por teclado com `aria-pressed`. Isso é evidência de unidade em
  jsdom, não de foco visível renderizado.

### Limites honestos

- A checagem de citação é exaustiva e mecânica (114/114). As de **claim vs.
  quote** e de **honestidade estrutural** são julgamento, lidas entrada por
  entrada — evidência por amostra de raciocínio, não prova.
- Nenhuma validação em navegador real; `prefers-reduced-motion` não foi
  exercitado.
- As correções 1-3 mudam o que a cena ensina, não só o texto dela. Merecem um
  segundo olhar de quem conhece o material.
