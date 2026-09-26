# Auditoria geral — grupo "línguas-literatura" (Gramática, Língua Inglesa, Literatura)

Data: 26/09/2026. 80 capítulos (Gramática 26, Língua Inglesa 17, Literatura 37). Nenhum
capítulo do grupo usa `visual-boards` "prancha por capítulo" fora dos 8 de Literatura
listados abaixo — o resto é instrumento (`visual-instruments/`) ou experimento
(`topic-experiments/`). Método: leitura de código de cada engine, varredura automática
dos 80 capítulos a 390 px (erro de console, rolagem lateral, colisão de texto, texto
fora do viewBox, tamanho de fonte efetivo) e captura manual em 1440 claro / 390 escuro
por amostragem (Playwright, Chromium `/opt/pw-browsers/chromium-1194/`). Reaproveitei a
varredura (`ll-scan.json`, 80/80 capítulos) e as capturas de Gramática/Inglês de uma
tentativa anterior nesta mesma pasta de scratchpad, e completei as que faltavam de
Literatura (nenhuma existia ainda).

## 1. Resumo

| Veredito | Capítulos |
| --- | --- |
| Manter | 29 |
| Ajustar | 19 |
| Redesenhar | 32 |

Por engine:

| Engine | Capítulos | Manter | Ajustar | Redesenhar |
| --- | --- | --- | --- | --- |
| `GrammarBoard` (instrumento, Gramática) | 25 | 10 | 15 | 0 |
| Experimento `variation` (Gramática) | 1 | 1 | 0 | 0 |
| `EnglishBoard` (instrumento, Inglês) | 16 | 12 | 4 | 0 |
| Experimento `inference` (Inglês) | 1 | 1 | 0 | 0 |
| `LiteraryTraitBoard` (instrumento, Literatura) | 22 | 0 | 0 | 22 |
| `LiteraryAuthorBoard` (instrumento, Literatura) | 6 | 0 | 0 | 6 |
| Cena autoral (`topic-scenes`, Literatura) | 8 | 4 | 0 | 4 |
| Experimento `literary` (Literatura) | 1 | 1 | 0 | 0 |
| **Total** | **80** | **29** | **19** | **32** |

O grupo não tem o problema que a régua descreve para "Uso da Crase" — matéria sem
fenômeno a desenhar. Gramática, Inglês e Literatura têm mecanismo de sobra (uma frase
que muda de leitura, uma inferência que se sustenta ou não, um movimento estético com
autores e obras): o problema nos 32 "redesenhar" nunca é falta de objeto, é que o
objeto não chegou a ser desenhado — Literatura recebeu um cartão de texto genérico onde
Gramática e Inglês, para o mesmo tipo de conteúdo verbal, desenharam a frase.

## 2. Por engine

### `GrammarBoard` (`src/views/visual-instruments/GrammarInstrument.tsx`, 25 capítulos)

Não é motor genérico: 5 capítulos têm cena própria por fenômeno (sintagma nominal com
peças coloridas por papel sintático, concordância com seta sujeito→verbo, escopo da
vírgula com o grupo "abraçado" pelo traço pontilhado, crase como fusão de dois blocos
num círculo, voz verbal com a seta trocando de sentido), 4 têm `RelationScene` também
única por capítulo (referência pronominal, aspecto verbal numa régua de três posições,
ambiguidade com duas leituras sobrepostas, relação lógica que muda com o conectivo). Os
16 restantes (`WideRelationScene`, `GrammarInstrument.tsx:67-101`) compartilham um único
esqueleto — frase em cima, dois rótulos comparados embaixo — por decisão explícita da
Ana Júlia de 21/09/2026 registrada no próprio arquivo, para maximizar cobertura. Cada
`id` grava sua própria frase e seus dois rótulos (não há empréstimo de texto entre
capítulos), mas o desenho não chega a ilustrar o mecanismo — é uma comparação verbal em
caixas, não uma figura do fenômeno (não há forma de fonema/morfema, nem estrutura de
sujeito indeterminado).

Defeito concreto, achado pela varredura automática (13 dos 16 `WideRelationScene` e
mais 2 fora dele):
- **A legenda de rodapé (`caption`, `GrammarInstrument.tsx:98`) vaza os dois lados do
  viewBox a 390 px** em 13 capítulos — mesmo defeito nº 4 do relatório de
  História/Geografia (`31-auditoria-47-historia-geografia.md`), aqui na frase final da
  `WideRelationScene` (ex.: "a visão do enunciador escolhe a classe", "vocativo fica
  fora da estrutura da oração").
- **Rótulos colidem entre si a 390 px** em `artigo-numeral-e-adjetivo` ("duas" ×
  "propostas", "propostas" × "urgentes" — sintagma de 4 palavras não cabe em 260 px de
  largura), `verbo` ("estudava" × "está estudando" × "estudou", timeline de aspecto) e
  `tipos-de-discurso` (o rótulo do caso ativo colide com o texto de baixo).
- Fonte efetiva boa (12,4–14,6 px a 390 px) — não é o problema aqui, ao contrário de
  Literatura.

Capturas: `screenshots/auditoria-geral-2026-09-26/linguas-literatura/gramatica-*.png`
(reaproveitadas).

### Experimento `variation` (Gramática — Variação Linguística)

`TopicExperiment.tsx:184-193`, função `Variation`: cartão de mensagem que muda de
formato (bordas retas ↔ arredondadas) e registro conforme o interlocutor. Cena própria,
fiel ao resumo (registro formal × informal), sem defeito na varredura. Manter.

### `EnglishBoard` (`src/views/visual-instruments/EnglishInstrument.tsx`, 16 capítulos)

Nove sub-cenas (`poetry-reading`, `quantity-language`, `modal-certainty`,
`cause-connectors`, `research-claims`, `narrative-inference`, `lexical-inference`,
`comparison-signals`, `stance-language`), cada uma desenhando o próprio mecanismo de
leitura (evidência textual, quantificador, grau de certeza modal, conector causal,
força da alegação, inferência narrativa, ambiguidade lexical, sinal de comparação,
gradiente de posicionamento). O reaproveitamento de uma sub-cena por vários capítulos
de "Text Comprehension" é o caso legítimo que a régua prevê (item 5): o objeto — o
mesmo recurso de leitura em inglês — é o mesmo entre os textos-fonte que mudam
(terremotos, furacões, células-tronco…), não um "Uso da Crase" com nome trocado.

Defeito encontrado: em `earthquakes`, `hurricanes` e `stem-cells` (as três que usam
`modal-certainty`), **os rótulos "possível/esperado/categórico" da régua colidem entre
si a 390 px** (`EnglishInstrument.tsx:41`). `viruses` (`comparison-signals`) tem o
exemplo de abertura vazando o viewBox. Os outros 12 capítulos passaram sem defeito.

Capturas: `lingua-inglesa-*.png` (reaproveitadas).

### Experimento `inference` (Inglês — Text Comprehension: Taxonomy and Terminology)

`TopicExperiment.tsx:211-220`, função `Inference`: microtexto original em inglês com
três leituras (informação explícita, inferência sustentada, extrapolação não
sustentada). Fiel, cena própria, sem defeito. Manter.

### `LiteraryTraitBoard` (`src/views/visual-instruments/LiteraryTraitInstrument.tsx`, 22 capítulos)

Motor genérico confirmado por leitura de código e captura: **um único desenho** — três
cartões ao longo de um eixo horizontal com seta — atende Barroco, Neoclassicismo,
Romantismo (poesia), Realismo, Naturalismo, Realismo português, Parnasianismo,
Simbolismo, Pré-Modernismo, Semana de 22, Primeira geração modernista, segunda geração
(poesia), Poesia concreta, Prosa 1960-1980, Literatura lusófona, Artes plásticas
brasileiras, Teatro brasileiro, Cancioneiro popular, Elementos da narrativa, Brasil:
primeiros registros, Renascimento e Camões, e o capítulo introdutório "A Arte e suas
Linguagens" — 22 movimentos e temas completamente diferentes desenhados como três
retângulos iguais com nome e nota dentro. Não há nenhum traço que distinga visualmente
um cultismo barroco de um simbolismo ou de uma vanguarda; só o texto muda. É
exatamente o "trocar somente a cor, o título ou um glifo sobre uma estrutura genérica"
que `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md` proíbe no item 1, e o mesmo padrão de
causa (`ContextScene`, `TimelineScene`) do relatório de História/Geografia.

Fidelidade textual verificada por amostragem (Barroco): o conteúdo do cartão bate frase
a frase com `deepSummaryContent.json` ("Contexto e tensão", "Cultismo e conceptismo",
"No Brasil" — Gregório de Matos, Boca do Inferno, Padre Antônio Vieira). O problema
aqui não é invenção de conteúdo, é ausência de desenho.

Defeito adicional, transversal ao engine: **a fonte efetiva do texto de apoio (nota,
observação) fica em 7,0–7,6 px a 390 px de largura** (viewBox 460 renderizado em 360 px,
fonte declarada 9,5 px → 9,5 × 360/460 ≈ 7,4 px), bem abaixo dos 12,4–14,6 px de
Gramática e Inglês no mesmo viewport. `literatura-a-arte-e-suas-linguagens` (o único
capítulo introdutório do trio) sofre o mesmo defeito.

Captura (`literatura-a-estetica-barroca-390-escuro.png`) também mostrou, ao rolar a
tela, **o cartão final ("Conclua" / o card "Conceito" com a fórmula) ficando atrás da
barra de navegação inferior fixa** no mobile — ver seção 4, é transversal ao app, não
específico deste engine, mas apareceu na amostra deste grupo.

Capturas novas: `literatura-a-estetica-barroca-*.png`,
`literatura-a-estetica-romantica-poesia-*.png`, `literatura-simbolismo-390-escuro.png`,
`literatura-a-estetica-barroca-390-scrollcheck.png` (evidência do defeito da barra
fixa).

### `LiteraryAuthorBoard` (`src/views/visual-instruments/LiteraryAuthorInstrument.tsx`, 6 capítulos)

Machado de Assis, Graciliano Ramos, Drummond, João Cabral, Clarice Lispector e
Guimarães Rosa recebem a **mesma ficha**: três fileiras empilhadas rotuladas sempre
"Trajetória / Técnica / Obras", com os mesmos três ícones neutros (seta, engrenagem,
livro) para qualquer autor — o próprio comentário do arquivo (linhas 19-26) admite que
são "motivos neutros, não uma cena que pertença a um autor específico". Machado (ironia
e narrador não confiável), Clarice (epifania, fluxo de consciência) e Guimarães Rosa
(invenção de linguagem, sertão) têm marcas estilísticas fortíssimas e nenhuma aparece no
desenho — a ficha de Clarice e a de Machado são visualmente idênticas. Fonte efetiva um
pouco melhor que `LiteraryTraitBoard` (10,6 px), ainda abaixo do piso de Gramática/
Inglês. Redesenhar os 6.

Capturas novas: `literatura-machado-de-assis-*.png`, `literatura-clarice-lispector-390-escuro.png`.

### Cena autoral (`src/views/topic-scenes/families/LinguagensLiteratura.tsx`, 8 capítulos)

**Achado principal desta auditoria.** Dos 8 capítulos de Literatura marcados como
"autoral" no inventário (e contados nos "39 dos 288" do CLAUDE.md), só 4 têm arte
própria de fato: `Trovadorismo` (voz masculina/feminina e alvo direto/indireto nas
quatro cantigas), `Pessoa` (três rostos com o gesto de cada heterônimo — mãos abertas de
Caeiro, régua de Reis, engrenagens de Campos), `Vanguardas` (cinco ícones distintos por
corrente) e `RomanticProse` (quatro vinhetas — cidade, origem indígena, interior,
passado colonial). Fiéis ao resumo, sem defeito nas capturas.

Os outros 4 caem na função `Landscape` (`LinguagensLiteratura.tsx:55-61`), que só
verifica `chapterId.includes('contemporanea')` — dois valores possíveis, dois desenhos:

- `segunda-geracao-modernista-prosa` (Romance de 30 × regionalismo romântico) e
  `poesia-brasileira-1960-1980` (concretismo, poema-processo, Ferreira Gullar, Adélia
  Prado) — **pixel a pixel a mesma imagem** (montanha, porta vazia, cerca com a barra
  vermelha), a mesma legenda "paisagem · conflito · linguagem", sem nenhuma relação com
  concretismo ou poema-processo.
- `poesia-brasileira-contemporanea` (slam, oralidade, circulação digital) e
  `prosa-brasileira-contemporanea` (autoficção, hibridação com jornalismo) — também
  idênticas entre si (megafone, folha de texto, arco), com a legenda fixa "voz ·
  circulação · forma".

Isso é o empréstimo de ilustração entre capítulos que a régua proíbe no item 5 e que
`docs/visual/PADRAO-VISUAL-OBRIGATORIO.md` chama de "proibido reutilizar uma ilustração
de outro assunto para preencher espaço" — só que aqui os dois lados do empréstimo estão
registrados como "autoral" no inventário, então a contagem de 39/288 cenas autorais do
CLAUDE.md está inflada em até 4 capítulos que não têm cena própria nenhuma.

Defeito visual adicional nas duas capturas: a legenda "voz · circulação · forma" e
"paisagem · conflito · linguagem" (texto acentuado, `y="181"`) **cruza a própria linha
ondulada da paisagem**, sobrepondo texto e traço (ver capturas).

Capturas novas: `literatura-poesia-brasileira-1960-1980-1440.png`,
`literatura-segunda-geracao-modernista-prosa-1440.png` (idênticas — comparar lado a
lado), `literatura-poesia-brasileira-contemporanea-1440.png`,
`literatura-prosa-brasileira-contemporanea-1440.png` (idênticas), mais
`literatura-trovadorismo-e-humanismo-*.png`, `literatura-fernando-pessoa-*.png`,
`literatura-vanguardas-artisticas-1440.png`, `literatura-a-estetica-romantica-prosa-*.png`.

### Experimento `literary` (Literatura — Texto Literário x Texto não Literário)

`TopicExperiment.tsx:223-233`, função `Literary`: "A noite pousou suas mãos sobre a
cidade" × "Anoiteceu na cidade", comparando função poética e informativa. Cena e
exemplos originais, fiel ao tema do capítulo (que existe em `deepSummaryContent.json`
como "Texto Literário x Texto não Literário"). Manter.

## 3. Tabela por capítulo

| id | engine | veredito | motivo |
| --- | --- | --- | --- |
| gramatica-lingua-um-sistema-complexo | GrammarBoard | manter | cena própria do capítulo (frase + leitura), sem defeito encontrado |
| gramatica-variacao-linguistica | variation (experimento) | manter | experimento bespoke, cena e texto próprios, fiel ao resumo |
| gramatica-substantivo-os-nomes-e-a-visao-do-enunciador | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox a 390px |
| gramatica-tipos-de-texto-explorando-elementos-concretos-e-conceitos-abstratos | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox a 390px |
| gramatica-artigo-numeral-e-adjetivo-no-sintagma-nominal | GrammarBoard | ajustar | rótulos das palavras colidem a 390px |
| gramatica-pronomes | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-verbo | GrammarBoard | ajustar | rótulos da timeline de aspecto colidem a 390px |
| gramatica-adverbio-e-locucoes-adverbiais-circunstanciadores | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-verbo-e-sintaxe-da-oracao | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-concordancia | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-significados-implicitos | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-tipos-de-discurso | GrammarBoard | ajustar | rótulo do caso colide com legenda |
| gramatica-pontuacao-i-principios-para-o-uso-da-virgula | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-pontuacao-ii-virgula-entre-oracoes-e-outros-sinais-de-pontuacao | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-o-lexico-em-contexto-variadas-possibilidades-semanticas | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-ambiguidade-duplicidade-no-lexico-e-na-sintaxe | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-mecanismo-de-regencia | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-crase | GrammarBoard | manter | cena própria, boa fidelidade, sem defeito |
| gramatica-processos-de-formacao-de-palavras | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-funcoes-sintaticas-nominais-e-vocativo | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-tipos-de-sujeito | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-vozes-verbais | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-oracoes-substantivas | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-oracoes-adjetivas | GrammarBoard | ajustar | legenda de rodapé vaza o viewBox |
| gramatica-oracoes-adverbiais | GrammarBoard | manter | cena própria, sem defeito |
| gramatica-oracoes-coordenadas | GrammarBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-taxonomy-and-terminology | inference (experimento) | manter | experimento bespoke, fiel ao resumo |
| lingua-inglesa-text-comprehension-songs-and-poems | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-calories-and-energy | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-earthquakes | EnglishBoard | ajustar | rótulos possível/esperado/categórico colidem a 390px |
| lingua-inglesa-text-comprehension-hurricanes | EnglishBoard | ajustar | rótulos possível/esperado/categórico colidem a 390px |
| lingua-inglesa-text-comprehension-ecology-greenhouse-gases | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-pollution | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-the-human-brain | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-global-warming | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-novels-short-stories | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-bacteria | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-viruses | EnglishBoard | ajustar | exemplo de abertura vaza o viewBox |
| lingua-inglesa-text-comprehension-discrimination-against-women | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-women-empowerment | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-digital-technology | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-health-probiotics | EnglishBoard | manter | cena própria, sem defeito |
| lingua-inglesa-text-comprehension-stem-cells | EnglishBoard | ajustar | rótulos possível/esperado/categórico colidem a 390px |
| literatura-a-arte-e-suas-linguagens | LiteraryTraitBoard | redesenhar | motor genérico (3 cartões + eixo) sem motivo visual; fonte ~7,4px a 390 |
| literatura-texto-literario-x-texto-nao-literario | literary (experimento) | manter | experimento bespoke, fiel ao resumo |
| literatura-trovadorismo-e-humanismo | cena autoral (Trovadorismo) | manter | cena própria, fiel, gênero e diretividade visualmente distintos por cantiga |
| literatura-renascimento-e-camoes | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-brasil-primeiros-registros | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-a-estetica-barroca | LiteraryTraitBoard | redesenhar | motor genérico, sem motivo do cultismo/conceptismo; fonte ~7,4px; cartão final some atrás da barra fixa no mobile |
| literatura-a-estetica-neoclassica | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-a-estetica-romantica-poesia | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-elementos-da-narrativa | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-a-estetica-romantica-prosa | cena autoral (RomanticProse) | manter | quatro vinhetas próprias (cidade, origem, interior, passado) |
| literatura-a-estetica-realista | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-machado-de-assis | LiteraryAuthorBoard | redesenhar | ficha genérica (3 fileiras, ícones neutros iguais p/ todo autor); fonte ~10,6px |
| literatura-naturalismo | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-realismo-portugues-eca-de-queiros | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-parnasianismo | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-simbolismo | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-pre-modernismo | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-vanguardas-artisticas | cena autoral (Vanguardas) | manter | cinco ícones distintos por corrente, fiel ao resumo |
| literatura-fernando-pessoa | cena autoral (Pessoa) | manter (ajustar legibilidade) | gesto próprio por heterônimo; rótulo "cue" (ex. "máquina") colide com o ícone abaixo dele em 390 |
| literatura-semana-de-arte-moderna | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-modernismo-no-brasil-primeira-geracao | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-segunda-geracao-modernista-prosa | cena autoral → `Landscape` genérico | redesenhar | arte idêntica à de poesia-brasileira-1960-1980; legenda cruza a linha da cena |
| literatura-graciliano-ramos | LiteraryAuthorBoard | redesenhar | ficha genérica; fonte ~10,6px |
| literatura-segunda-geracao-modernista-poesia | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-carlos-drummond-de-andrade | LiteraryAuthorBoard | redesenhar | ficha genérica; fonte ~10,6px |
| literatura-joao-cabral-de-melo-neto | LiteraryAuthorBoard | redesenhar | ficha genérica; fonte ~10,6px |
| literatura-poesia-concreta | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-clarice-lispector | LiteraryAuthorBoard | redesenhar | ficha genérica, idêntica à de Machado; fonte ~10,6px |
| literatura-guimaraes-rosa | LiteraryAuthorBoard | redesenhar | ficha genérica; fonte ~10,6px |
| literatura-poesia-brasileira-1960-1980 | cena autoral → `Landscape` genérico | redesenhar | arte idêntica à de segunda-geração-modernista-prosa |
| literatura-prosa-brasileira-1960-1980 | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-literatura-lusofona-contemporanea | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-poesia-brasileira-contemporanea | cena autoral → `Landscape` genérico | redesenhar | arte idêntica à de prosa-brasileira-contemporanea; legenda cruza a linha da cena |
| literatura-prosa-brasileira-contemporanea | cena autoral → `Landscape` genérico | redesenhar | arte idêntica à de poesia-brasileira-contemporanea |
| literatura-artes-plasticas-brasileiras | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-teatro-brasileiro | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |
| literatura-cancioneiro-popular-brasileiro | LiteraryTraitBoard | redesenhar | motor genérico; fonte ~7,4px |

## 4. Defeitos transversais e conteúdo sem lastro

1. **`LiteraryTraitBoard` e `LiteraryAuthorBoard` são motores genéricos** (mesmo desenho
   para 22 e para 6 capítulos, respectivamente, texto trocado) — a mesma causa-raiz do
   relatório de História/Geografia (`ContextScene`, `TimelineScene`), agora em
   Literatura. Juntos são 28 dos 32 "redesenhar" deste grupo.
2. **4 dos 8 capítulos "autorais" de Literatura têm arte emprestada de outro capítulo**
   (função `Landscape`, `LinguagensLiteratura.tsx:55-61`) — o mesmo empréstimo que o
   `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md` proíbe explicitamente, só que classificado
   como cena autoral no inventário e na contagem de 39/288 do CLAUDE.md. Recomendo
   corrigir essa contagem (ou marcar os 4 como "instrumento genérico", não "autoral")
   assim que o redesenho entrar em pauta.
3. **Fonte efetiva pequena demais a 390 px em toda a Literatura instrumentada**: 7,0–7,6 px
   em `LiteraryTraitBoard` e nas cenas `Landscape`/`Pessoa`, 10,6 px em
   `LiteraryAuthorBoard` — contra 12,4–14,6 px em Gramática e Inglês no mesmo viewport.
   Some ao motor genérico e o problema de legibilidade fica em segundo plano frente ao
   problema de conteúdo, mas precisa ser corrigido de qualquer forma no redesenho.
4. **Legenda de rodapé vazando o viewBox a 390 px** em 13 dos 25 capítulos de
   `GrammarBoard` (`WideRelationScene`) — mesmo defeito nº 4 do relatório de
   História/Geografia, aqui na frase-síntese do fim de cada cena.
5. **Colisão de rótulos a 390 px** em `gramatica-artigo-numeral-e-adjetivo` (frase de 4
   palavras não cabe em 260 px), `gramatica-verbo` e nas 3 chapters de Inglês que usam
   `modal-certainty` (`earthquakes`, `hurricanes`, `stem-cells`) — a régua
   "possível/esperado/categórico" fica apertada demais para as palavras mais longas.
6. **Cartão final coberto pela barra de navegação inferior fixa no mobile**, achado em
   `literatura-a-estetica-barroca` ao rolar a tela (ver
   `literatura-a-estetica-barroca-390-scrollcheck.png`): o card "Conceito" com a fórmula
   do capítulo fica parcialmente atrás da barra "Hoje/Plano/Estudar/Análises/Agenda".
   Isso é exatamente o risco que o CLAUDE.md descreve para `.ni-production-main`
   ("senão o último cartão fica por baixo dela no retrato") se materializando dentro da
   aba Visual — vale conferir se o wrapper do `BoardShell` herda a mesma folga inferior
   calculada para o resto do app, e se o problema se repete fora deste grupo.
7. **Rótulo "cue" sobre o ícone em `Pessoa`** (`literatura-fernando-pessoa`): a legenda
   curta de cada heterônimo ("olhar", "medida", "máquina", y=153) fica colada ou
   sobreposta ao próprio desenho do heterônimo (barras da máquina de Campos cortam o
   texto "máquina") — ajuste pontual, a cena em si é boa.
8. **Nenhum erro de console, rolagem lateral nem "prancha necessária" indevida** nos 80
   capítulos varridos — os três modos (Explorar/Testar/Reconstruir) renderizam em todos.
   Não achei conteúdo inventado além do já registrado: a fidelidade textual verificada
   por amostragem (Barroco, Trovadorismo, Fernando Pessoa, Vanguardas, Crase) bate com
   `deepSummaryContent.json` frase a frase.
9. `--vs-ink-muted` (a variável indefinida que o relatório de História/Geografia
   apontou como causa de contorno sumido e texto ilegível no escuro) **já está corrigida**
   em `src/views/Visual.css:11` — não é mais um problema para nenhum engine deste grupo.

## 5. Proposta de lotes de redesenho (32 capítulos, ordem de prioridade)

1. **Os 4 "autorais" emprestados** (`segunda-geracao-modernista-prosa`,
   `poesia-brasileira-1960-1980`, `poesia-brasileira-contemporanea`,
   `prosa-brasileira-contemporanea`): prioridade máxima — é o caso mais claro de
   violação da régua, e como já constam como "concluídos" no inventário, corrigir esses
   4 primeiro evita que o próximo lote de Literatura seja planejado sobre uma contagem
   errada de cobertura.
2. **`LiteraryAuthorBoard` (6 capítulos)**: menor lote, autores com identidade forte e
   bem documentada (`literaryAuthorLab.ts`), maior ganho por capítulo — cada ficha pode
   virar uma cena com o traço do próprio autor (ironia/narrador não confiável de
   Machado, fluxo de consciência de Clarice, invenção lexical de Guimarães Rosa) em vez
   das três fileiras neutras atuais.
3. **`LiteraryTraitBoard` (22 capítulos)**: o lote maior. Como no plano de
   História/Geografia, uma cena autoral por capítulo em `topic-scenes/families/`,
   registrada antes do instrumento no roteamento (mesma ordem de prioridade: primeiro
   os movimentos com identidade visual mais forte e cobrada em prova — Barroco,
   Simbolismo, Parnasianismo, Vanguardas — antes dos capítulos mais narrativos/
   cronológicos, como Teatro Brasileiro ou Cancioneiro Popular).
4. **Correções transversais, em PR pequeno, antes ou junto do lote 3**: quebrar a
   legenda de `WideRelationScene` em linhas (Gramática, 13 capítulos), alargar ou
   encurtar os rótulos que colidem (`artigo-numeral-e-adjetivo`, `verbo`,
   `modal-certainty` × 3 em Inglês), subir a fonte efetiva de `LiteraryTraitBoard`/
   `LiteraryAuthorBoard`/`Landscape`/`Pessoa` para o piso de ~12 px que Gramática e
   Inglês já cumprem, e conferir a folga inferior do `BoardShell` contra a barra de
   navegação fixa no mobile.

Capturas desta auditoria: `docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/linguas-literatura/`.
