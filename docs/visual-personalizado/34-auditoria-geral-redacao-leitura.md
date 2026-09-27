# Auditoria geral — grupo "redacao-leitura" (Redação, Entendimento de Texto, Atualidades)

71 capítulos: 58 Redação, 12 Entendimento de Texto, 1 Atualidades. Nenhum tem
prancha autoral (`visual-boards`) nem instrumento manuscrito com cena própria
fora do `WritingInstrument`/`ReadingInstrument`; todos vencem por `instrument`
(69) ou `experiment` (2), conforme `kind` do inventário.

Método: leitura de `WritingInstrument.tsx`, `writingInstrumentLab.ts`,
`ReadingInstrument.tsx`, `readingInstrumentLab.ts`, `CurrentAffairsDossier.tsx`
e `TopicExperiment.tsx`; reconstrução programática do mapeamento
id → engine → variante de cena (script em Python contra `registry.ts` e
`writingInstrumentLab.ts`, conferido manualmente); captura de 15 capítulos
(30 imagens, 1440 claro + 390 escuro) cobrindo toda variante de cena existente
nos dois instrumentos, mais o dossiê de atualidades e os dois `TopicExperiment`;
conferência de fidelidade de um caso positivo (`atu-cop30-belem`) e um caso
negativo confirmado (`summary-redacao-argumentacao-e-coerencia-interna`) contra
`deepSummaryContent.json`. Nenhuma captura mostrou rolagem lateral a 390 nem
erro de console (`pageerror`) nos 15 capítulos verificados.

Capturas em
`docs/visual-personalizado/screenshots/auditoria-geral-2026-09-26/redacao-leitura/`
(30 arquivos; 8 já existiam de uma tentativa anterior e foram reaproveitados
sem recaptura, conforme a nota do brief).

## 1. Resumo

| Veredito | Capítulos |
|---|---|
| manter | 25 |
| ajustar | 35 |
| redesenhar | 11 |

Por engine:

| Engine | Capítulos | manter | ajustar | redesenhar |
|---|---|---|---|---|
| WritingBoard (`writingInstrument`) | 57 | 24 | 22 | 11 |
| ReadingBoard (`readingInstrument`) | 11 | 0 | 11 | 0 |
| CurrentAffairsBoard (`currentAffairsDossier`) | 1 | 1 | 0 | 0 |
| TopicExperiment (`argument`, `cohesion`) | 2 | 0 | 2 | 0 |

Nenhum capítulo do grupo está com "prancha necessária" pendente — todos já têm
algum artefato interativo — mas a maioria desses artefatos é um motor genérico
com texto trocado, exatamente o padrão que a auditoria de História/Geografia
(`docs/visual-personalizado/31-auditoria-47-historia-geografia.md`) já havia
sinalizado como o problema central desse tipo de arquitetura.

## 2. Por engine

### WritingBoard — `src/views/visual-instruments/WritingInstrument.tsx` (57 capítulos)

Um único componente atende as 57 fichas de Redação. `WRITING_INSTRUMENTS`
(`src/lib/writingInstrumentLab.ts`) associa cada capítulo a um `scene`
(`prompt`, `genre`, `source`, `repertoire`, `theme`) ou a nenhum, caso em que
`WritingScene` (linhas 47-70 de `WritingInstrument.tsx`) trata o `id` como
caso especial com desenho próprio. Achados por variante:

- **4 cenas próprias + 1 fallback** (`evaluation`, `idea-map`, `repertoire`,
  `theme-axes`, `essay-myths` — 5 capítulos): cada um desenha o mecanismo do
  seu capítulo (painel de competências com barra 0–200, mapa de hierarquia de
  ideias, ponte referência→tese, círculos de escala eixo/recorte/problema,
  boxes de mitos numerados). Fiéis ao resumo, sem texto cortado nas capturas.
  **manter.**

- **Cena `theme`** (`WritingInstrument.tsx:40-46`, 19 capítulos): sempre o
  mesmo desenho — dois quadrados rotulados **"EIXO amplo"** e **"TESE focada"**
  ligados por "delimitar", com a legenda fixa **"fator → consequência →
  posição"** — independente do capítulo. Isso é correto para os 8 capítulos
  que são literalmente sobre recorte de tema (`theme-environment` a
  `theme-media`): **ajustar**, porque o desenho não muda mesmo quando o fator
  em jogo muda de "consumo" para "gestão" para "desigualdade de acesso" — o
  cartão de baixo faz esse trabalho, a cena não. Mas para os outros 11
  capítulos o desenho está **errado para o conteúdo**, não apenas genérico:
  - `summary-redacao-argumentacao-e-coerencia-interna` mostra "EIXO/RECORTE/
    TESE" e "fator → consequência → posição" para um capítulo cujo resumo
    (`deepSummaryContent.json`) é sobre coerência **entre as partes do próprio
    texto** — tese, argumento e conclusão não se contradizerem. Não há eixo
    nem recorte de tema em jogo. Confirmado por captura
    (`redacao-argumentacao-e-coerencia-interna-1440-light.png`).
  - O mesmo se repete, por construção do código (mesma `if (scene ===
    'theme')`), em `quasi-logic`, `concession`, `refutation`,
    `language-clarity`, `intervention-agents`, `intervention-feasibility`,
    `intervention-coherence`, `intervention-rights`, `rights-generations`,
    `rights-social` — nenhum desses é sobre delimitar um eixo temático; são
    sobre lógica argumentativa, concessão, refutação, clareza de linguagem,
    viabilidade de intervenção ou gerações de direitos. **redesenhar.**
  - Bug adicional nessa cena: a legenda `"um recorte por vez, com
    profundidade"` (linha 42) é texto SVG sem quebra de linha num `viewBox`
    de 320 de largura; em `redacao-argumentacao-e-coerencia-interna` e em
    `redacao-os-direitos-humanos-de-1-geracao-direitos-individuai` a palavra
    aparece cortada em "profundida" (confirmado nas duas capturas 1440). O
    mesmo padrão de string fixa sem medição de largura existe na cena
    `repertoire` (linha 34, "repertório só vale quando vira prova").

- **Cena `repertoire`** (linhas 33-39, 12 capítulos: `repertoire-environment`
  a `repertoire-media`, `audience`, `prestigious-voices`, `repertoire-bank`,
  `domains`): sempre "LENTE (conceito) → mecanismo → TESE (explicada)". Aqui o
  objeto realmente é o mesmo em todos os 12 — "uma referência só vira evidência
  quando ligada à tese" — e o rótulo do conceito muda de fato
  (`externalidade negativa`, `capital cultural`, `agenda-setting`...),
  verificado em `redacao-incrementando-o-repertorio-meio-ambiente`.
  **ajustar**: a régua permite objeto compartilhado, mas o desenho nunca
  ganha nada específico do domínio (nenhum ícone de meio ambiente, trabalho,
  mídia etc. — é a mesma caixa "LENTE" para os 12).

- **Cena `source`** (linhas 28-32, 12 capítulos): "fonte A / leitura / texto →
  compreender → reformular → argumentar". Mesmo raciocínio: objeto comum real
  (ler a coletânea sem copiá-la), rótulos mudam, forma não. Verificado em
  `redacao-lendo-a-coletanea-a-apreensao-de-sentidos-i`, sem texto cortado.
  **manter** — aqui a caixa de baixo entrega o essencial do capítulo
  (diagnóstico, ação) e a cena cumpre o papel de ancorar a operação de leitura;
  diferente do caso `theme`/`theme-mismatch`, não há mecanismo específico do
  capítulo que a cena devesse mostrar e não mostra.

- **Cena `genre`** (linhas 23-27, 7 capítulos): "quem lê / voz / função /
  efeito", coerente com todos os 7 (gênero, estrutura, introdução, conclusão,
  redação nota 1000). Verificado em duas capturas sem defeito. **manter.**

- **Cena `prompt`** (linhas 17-22, 2 capítulos: `prompt-fit`,
  `prompt-boundary`): três círculos concêntricos "EIXO/RECORTE/RESPOSTA".
  Só 2 capítulos, mas ambos tratam exatamente do mesmo objeto (adequação ao
  recorte da proposta) com estados diferentes; verificado em
  `redacao-diferentes-graus-de-adequacao-a-proposta`, sem defeito visual.
  **ajustar** apenas por ser o desenho mais pobre do lote (três círculos sem
  nenhuma pista do que está sendo julgado, ao contrário de `theme`/`genre`
  que ao menos rotulam a operação).

### ReadingBoard — `src/views/visual-instruments/ReadingInstrument.tsx` (11 capítulos)

Um componente único com três "formas": `isVisual` (`nonverbal`, `poetic`,
`figures` — caixa+círculo), `isNarrative` (`narrative`, `comic` — três
degraus) e a fileira padrão de 3 caixas (`levels`, `intertext`, `genres`,
`functions`, `distortions`, `tdic`). Diferente do pior caso de `WritingBoard`,
aqui os rótulos de cada caixa (`scenes` em `ReadingInstrument.tsx:9-11`) são
específicos e coerentes com o capítulo (`TEXTO/PISTAS/INFERÊNCIA` para níveis
de leitura, `EXPECTATIVA/VIRADA/CRÍTICA` para textos cômicos, `TECNOLOGIA/
USO/IMPACTO` para TDIC) — não há o problema de rótulo hardcoded incoerente
achado em `WritingBoard:theme`. Verificado em quatro capturas
(`os-dois-niveis-da-leitura`, `figuras-de-linguagem`, `generos-narrativos...`,
`tdic...`), nenhuma com texto cortado, rolagem ou erro. **ajustar** nos 11: a
forma geométrica (fileira, degraus, ou caixa+círculo) é sempre uma das três
mesmas, sem nenhum traço do objeto de leitura em si (nenhum ícone de gráfico,
narrador, sátira etc.) — mesmo padrão "estrutura genérica, texto trocado" do
lote 1 de História/Geografia, com a diferença de que aqui o texto está
sempre certo para o capítulo.

### CurrentAffairsBoard — `CurrentAffairsDossier.tsx` (1 capítulo: `atu-cop30-belem`)

Único capítulo do engine no grupo, então a regra "nada emprestado entre
capítulos" não se aplica (não há de quem emprestar). Conteúdo específico e
verificável: Pacote Político de Belém, 13 decisões de financiamento
registradas pela UNFCCC, período 10–22/nov/2025. Cena com 3 documentos
(Registro/Contexto/Avaliação) e leitura crítica clara ("houve avanço formal em
cooperação e financiamento, sem uma rota explícita para abandonar
combustíveis fósseis"). Verificado por captura 1440 e 390 escuro, sem
defeito. **manter.**

### TopicExperiment — `src/views/topic-experiments/TopicExperiment.tsx` (2 capítulos: `argument`, `cohesion`)

`Argument` (parágrafo em 4 passos: Tese → Argumento → Análise → Retomada) e
`Cohesion` (mesmo par de frases, dois conectores possíveis) são cenas
autorais de fato, com mecanismo específico e fiel ao resumo — nenhum problema
de conteúdo. O defeito é de arquitetura: `VisualArtifact.tsx` trata
`experiment` como uma quarta representação irmã de `board`/`instrument`, e
`TopicExperiment` **não usa `BoardShell`** (confirmado por captura:
`redacao-projeto-de-texto-em-favor-da-progressao-textual-1440-light.png` não
tem título com marca d'água floral, par de cartões dos nós 1/2, `SceneViewport`
com zoom, nem o banner "Ideia central" que todo `WritingBoard`/`ReadingBoard`
tem). Resultado: dentro do mesmo grupo de matérias, dois capítulos têm uma
experiência visual visivelmente mais pobre e inconsistente com o padrão que a
régua pede no item 8. **ajustar** — não é conteúdo inventado nem mecanismo
genérico, é integração incompleta ao `BoardShell`.

## 3. Tabela por capítulo

Ver arquivo anexo de tabela completa (71 linhas) gerado a partir do código —
reproduzido abaixo.

| id | engine | veredito | motivo |
|---|---|---|---|
| `summary-redacao-a-dissertacao-no-vestibular-mitos-e-verdades` | WritingBoard:essay-myths | manter | cena própria (svg exclusivo), verificada por amostragem; fiel ao mecanismo do capítulo |
| `summary-redacao-o-que-se-avalia-na-dissertacao-competencias-e-habilidades` | WritingBoard:evaluation | manter | cena própria (svg exclusivo), verificada por amostragem; fiel ao mecanismo do capítulo |
| `summary-redacao-organizando-as-ideias-brainstorm-e-mind-maps` | WritingBoard:idea-map | manter | cena própria (svg exclusivo), verificada por amostragem; fiel ao mecanismo do capítulo |
| `summary-redacao-repertorio-o-diferencial-de-redacoes-de-sucesso` | WritingBoard:repertoire | manter | cena própria (svg exclusivo), verificada por amostragem; fiel ao mecanismo do capítulo |
| `summary-redacao-qual-sera-o-tema-deste-ano-grandes-eixos-tematicos` | WritingBoard:theme-axes | manter | cena própria (svg exclusivo), verificada por amostragem; fiel ao mecanismo do capítulo |
| `summary-redacao-diferentes-graus-de-adequacao-a-proposta` | WritingBoard:prompt-fit | ajustar | template de 3 círculos concêntricos (EIXO/RECORTE/RESPOSTA) idêntico nos 2 capítulos do grupo |
| `summary-redacao-tangenciamento-e-fuga-a-fronteira-do-tema` | WritingBoard:prompt-boundary | ajustar | template de 3 círculos concêntricos (EIXO/RECORTE/RESPOSTA) idêntico nos 2 capítulos do grupo |
| `summary-redacao-generos-e-sua-relacao-com-a-estrutura-do-texto` | WritingBoard:genre-letter | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-estrutura-classica-do-texto-dissertativo` | WritingBoard:genre-dissertation | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-i` | WritingBoard:source-sense | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-lendo-a-coletanea-a-apreensao-de-sentidos-ii` | WritingBoard:source-visual | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-i` | WritingBoard:source-authorship | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-lendo-a-coletanea-a-compreensao-e-o-texto-autoral-ii` | WritingBoard:source-dialogue | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-incrementando-o-repertorio-meio-ambiente` | WritingBoard:repertoire-environment | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-de-redacao-meio-ambiente` | WritingBoard:theme-environment | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-educacao-e-trabalho` | WritingBoard:repertoire-work | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-de-redacao-educacao-e-trabalho` | WritingBoard:theme-work | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-temas-abstratos` | WritingBoard:repertoire-abstract | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-abstrato-de-redacao` | WritingBoard:theme-abstract | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-corpo-saude-e-sexualidade` | WritingBoard:repertoire-body | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-de-redacao-corpo-saude-e-sexualidade` | WritingBoard:theme-body | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-violencia-leis-e-punicao` | WritingBoard:repertoire-violence | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-de-redacao-violencia-leis-e-punicao` | WritingBoard:theme-violence | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-cidadania-e-poder` | WritingBoard:repertoire-citizenship | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-de-redacao-cidadania-e-poder` | WritingBoard:theme-citizenship | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-arte-cultura-e-relacoes-sociais` | WritingBoard:repertoire-culture | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-o-tema-de-redacao-arte-cultura-e-relacoes-sociais` | WritingBoard:theme-culture | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-incrementando-o-repertorio-midia-e-sociedade` | WritingBoard:repertoire-media | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-analisando-tema-de-redacao-midia-e-sociedade` | WritingBoard:theme-media | ajustar | mesmo template eixo→recorte→tese de todo o grupo "theme"; rótulos ao redor mudam, o desenho nunca muda |
| `summary-redacao-paragrafo-de-introducao-delimitando-a-opiniao` | WritingBoard:intro-thesis | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-paragrafo-de-introducao-como-contextualizar` | WritingBoard:intro-context | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-argumentacao-auditorio-particular-e-universal` | WritingBoard:audience | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-argumentacao-quase-logica-e-efeito-de-verdade` | WritingBoard:quasi-logic | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-argumentacao-e-coerencia-interna` | WritingBoard:internal-coherence | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo (confirmado contra o resumo) |
| `summary-redacao-argumentacao-e-coerencia-externa` | WritingBoard:external-coherence | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-recursos-argumentativos-dados-numericos-e-exemplos` | WritingBoard:data-examples | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-recursos-argumentativos-vozes-prestigiadas` | WritingBoard:prestigious-voices | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-ressalvando-o-ponto-de-vista-contrario` | WritingBoard:concession | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-refutando-o-ponto-contrario` | WritingBoard:refutation | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-recursos-argumentativos-interdiscursividade-e-intertextualidade` | WritingBoard:intertextuality | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-recursos-argumentativos-temas-de-redacao-ja-analisados` | WritingBoard:repertoire-bank | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-recursos-argumentativos-fatos-da-atualidade` | WritingBoard:current-affairs | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-recursos-argumentativos-multiplos-dominios-do-saber` | WritingBoard:domains | ajustar | template LENTE/mecanismo/TESE idêntico nos 12 capítulos do grupo; só o rótulo do conceito muda |
| `summary-redacao-conclusao-por-sintese-ou-retomada-da-tese` | WritingBoard:conclusion-synthesis | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-conclusao-sumarizacao-focalizacao-e-expressividade` | WritingBoard:conclusion-focus | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-proposta-de-intervencao-atores-sociais-e-cidadania` | WritingBoard:intervention-agents | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-proposta-de-intervencao-viabilizacao-e-inovacao` | WritingBoard:intervention-feasibility | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-proposta-de-intervencao-coerencia-argumentativa` | WritingBoard:intervention-coherence | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-proposta-de-intervencao-respeito-aos-direitos-humanos` | WritingBoard:intervention-rights | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-recursos-de-coesao-referencial-no-texto-dissertativo` | WritingBoard:reference-cohesion | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-recursos-de-coesao-sequencial-no-texto-dissertativo` | WritingBoard:sequential-cohesion | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-coesao-no-texto-dissertativo-analise-de-problemas` | WritingBoard:cohesion-diagnosis | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-redacao-recursos-linguisticos-norma-clareza-e-expressividade` | WritingBoard:language-clarity | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-os-direitos-humanos-de-1-geracao-direitos-individuais` | WritingBoard:rights-generations | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo (confirmado contra captura; texto "profundidade" cortado) |
| `summary-redacao-os-direitos-humanos-de-2-e-3-geracao-direitos-sociais-coletivos-e-difusos` | WritingBoard:rights-social | redesenhar | template fixo "EIXO amplo/RECORTE/TESE focada, fator→consequência→posição" sem relação com o mecanismo real do capítulo |
| `summary-redacao-redacoes-nota-1000-trunfos-a-inspirar` | WritingBoard:model-essay | manter | template genérico mas com objeto comum real (gênero/estrutura do texto); verificado por amostragem |
| `summary-redacao-redacoes-na-midia-como-aprimorar` | WritingBoard:media-revision | manter | template genérico mas com objeto comum real (leitura da coletânea/coesão); verificado por amostragem |
| `summary-entendimento-de-texto-os-dois-niveis-da-leitura` | ReadingBoard:levels | ajustar | template de 3 caixas em fileira (grupo de 6 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-intertextualidade-e-interdiscursividade` | ReadingBoard:intertext | ajustar | template de 3 caixas em fileira (grupo de 6 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-generos-textuais` | ReadingBoard:genres | ajustar | template de 3 caixas em fileira (grupo de 6 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-generos-narrativos-e-niveis-de-compreensao` | ReadingBoard:narrative | ajustar | template de degraus 1-2-3 (grupo de 2 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-generos-nao-verbais-fundamentos-de-leitura` | ReadingBoard:nonverbal | ajustar | template de 2 caixas + círculo (grupo de 3 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-funcoes-da-linguagem` | ReadingBoard:functions | ajustar | template de 3 caixas em fileira (grupo de 6 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-funcao-poetica-e-linguagem-literaria` | ReadingBoard:poetic | ajustar | template de 2 caixas + círculo (grupo de 3 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-figuras-de-linguagem` | ReadingBoard:figures | ajustar | template de 2 caixas + círculo (grupo de 3 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-modelos-de-leitura-e-distorcoes-interpretativas` | ReadingBoard:distortions | ajustar | template de 3 caixas em fileira (grupo de 6 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-leitura-de-textos-comicos` | ReadingBoard:comic | ajustar | template de degraus 1-2-3 (grupo de 2 capítulos); rótulo muda, forma não |
| `summary-entendimento-de-texto-tecnologias-digitais-da-informacao-e-comunicacao-tdic-impactos-sociais` | ReadingBoard:tdic | ajustar | template de 3 caixas em fileira (grupo de 6 capítulos); rótulo muda, forma não |
| `atu-cop30-belem` | CurrentAffairsBoard | manter | único capítulo do engine; conteúdo factual específico (Pacote de Belém, UNFCCC), verificado por captura |
| `summary-redacao-projeto-de-texto-em-favor-da-progressao-textual` | TopicExperiment:argument | ajustar | mecanismo próprio e fiel (projeto de parágrafo em 4 passos), mas fora do BoardShell: sem par de cartões, zoom ou "Ideia central" — estética abaixo do padrão das demais cenas |
| `summary-entendimento-de-texto-fatores-de-textualidade` | TopicExperiment:cohesion | ajustar | mecanismo próprio e fiel (mesmo conector, duas relações), mas fora do BoardShell — mesma observação de estética |

## 4. Defeitos transversais e conteúdo sem lastro

1. **Rótulo hardcoded e semanticamente errado para 11 capítulos**
   (`WritingInstrument.tsx:40-46`). A cena da variante `theme` sempre imprime
   "EIXO amplo", "TESE focada" e a legenda fixa "fator → consequência →
   posição", herdada da lógica de `workshop()`'s scene padrão. Isso é
   coerente só para os 8 capítulos de recorte temático; para
   `internal-coherence`, `quasi-logic`, `concession`, `refutation`,
   `language-clarity`, os 4 de `intervention-*` e os 2 de `rights-*`, a cena
   mostra um mecanismo (delimitação de tema) que **não é o mecanismo do
   capítulo**. É o mesmo padrão "motor genérico, texto trocado" da auditoria
   de História/Geografia, mas agravado: lá o texto pelo menos acompanhava o
   assunto; aqui nem o texto da cena muda.

2. **Texto SVG sem quebra de linha, corta palavras.**
   `WritingInstrument.tsx:40` (`"um recorte por vez, com profundidade"`) e
   `:58` (`"repertório só vale quando vira prova"`) são strings fixas
   posicionadas em `x=24` dentro de um `viewBox` de 320 de largura sem
   nenhuma medição ou `<tspan>` de quebra. Nos dois capítulos capturados que
   usam essas strings elas aparecem cortadas em "profundida" e a segunda
   quase encosta na borda ("...vira prova" some no limite direito). Como o
   comprimento do texto ao redor (nome do capítulo, rótulos) varia por
   capítulo, o corte é uma questão de largura de fonte, não algo revisado
   por capítulo — é provável que outras strings da mesma família estourem em
   resoluções um pouco menores ou com fontes carregadas (lembrando que no
   ambiente remoto `fonts.googleapis.com` é bloqueado e a Kalam/Newsreader
   caem no fallback do sistema, o que muda a métrica do texto).

3. **`TopicExperiment` não usa `BoardShell`.** `argument` e `cohesion` (e,
   fora deste grupo, os outros 9 capítulos do catálogo em
   `src/views/topic-experiments/catalog.ts`) são renderizados por um
   componente à parte que não tem par de cartões dos nós 1/2, não tem
   `SceneViewport` com zoom/arraste, e não tem o banner "Ideia central". A
   régua do documento (`BoardShell` e `boardPair` existem para que a cena
   seja a única coisa que muda) não é violada tecnicamente — `experiment` é
   uma quarta representação declarada em `VisualArtifact.tsx`, não um board
   fora do padrão — mas o efeito para a estudante é o mesmo: dois capítulos
   do grupo (e mais 9 fora dele) têm uma experiência visivelmente mais pobre
   dentro da mesma aba.

4. **Nenhum conteúdo inventado encontrado.** Todos os textos de estado
   (`WRITING_INSTRUMENTS`, `READING_INSTRUMENTS`, `GeographyContext` do
   dossiê) description conceitos e exemplos genéricos de redação/leitura, sem
   afirmar fato específico que precisasse de fonte — exceto o dossiê de
   atualidades, que é a única cena do grupo com fatos verificáveis (datas,
   número de decisões, nome do pacote) e eles batem com o texto de
   `deepSummaryContent.json` do capítulo. Não há aqui o risco do
   `ap_mat_fuvest_110` (inventar conteúdo para tapar buraco) — o problema
   deste grupo é genericidade e, num subconjunto de 11 capítulos, desenho
   sem relação com o assunto, não invenção de fato.

5. **Nenhuma rolagem lateral, nenhum erro de console** nos 15 capítulos
   verificados em 1440/390, claro/escuro. Uma observação de método: uma
   captura `fullPage:true` a 390 duplicou visualmente a barra de navegação
   inferior fixa sobre o card "Aplicação" — é artefato conhecido do
   Chromium ao fazer screenshot de página inteira com elemento
   `position:fixed`, não um bug do app; confirmado repetindo a mesma
   página com viewport fixo e rolagem manual (barra ficou corretamente
   ancorada embaixo, sem sobrepor conteúdo). Registro aqui para quem for
   reaproveitar este roteiro de captura em outros grupos.

## 5. Proposta de lotes de redesenho

**Lote 1 — os 11 capítulos com cena errada (`theme`-mismatch).** Prioridade
alta: é o único caso confirmado de cena que contradiz o resumo, não apenas
genérica. Ordem sugerida dentro do lote, pela frequência de acesso esperada
(competências de argumentação vêm antes de proposta de intervenção no
currículo): `internal-coherence`, `quasi-logic`, `concession`, `refutation`,
`language-clarity`, depois `intervention-agents/-feasibility/-coherence/
-rights`, por fim `rights-generations`/`rights-social`. Cada um precisa de um
desenho que mostre o mecanismo real: cadeia causa→resposta com um elo que
falha (coerência interna), balança de semelhança vs. relação lógica
(quase-lógica), afirmação com ressalva anexada (concessão), contraponto
sendo desmontado por um critério (refutação), frase densa vs. frase clara
lado a lado (clareza), agente+meio+finalidade com um elo faltando
(intervenção), e uma liberdade em tensão com um limite público (gerações de
direitos).

**Lote 2 — corrigir a quebra de texto do `WritingInstrument`.** Antes de
redesenhar qualquer cena, vale consertar `WritingScene` para que toda string
de legenda passe por medição/`<tspan>` (o padrão já existe em outras cenas do
app, como o clamp do `SceneNote`). É um ajuste único no componente
compartilhado que evita o corte de palavra em qualquer variante futura, não
só nas 2 capturadas.

**Lote 3 — dar forma própria ao ReadingBoard.** Os 11 capítulos de
Entendimento de Texto têm texto fiel; o ganho aqui é visual, não de
conteúdo. Prioridade média: desenhar um ícone por família de fenômeno
(lupa+pista para os níveis de leitura, dois textos que se cruzam para
intertextualidade, uma tira de quadrinhos para textos cômicos) em vez das
três formas genéricas atuais.

**Lote 4 — instrumento próprio para `WritingBoard:theme` (8 capítulos
corretos) e `WritingBoard:repertoire` (12 capítulos).** Prioridade menor: a
cena já é fiel, ganho é de imersão. Poderia virar um "seletor de lente" com
ícone por domínio (ambiente, trabalho, corpo, violência, cidadania, cultura,
mídia) plugado na mesma mecânica de estados — mantendo `BoardShell` e
`boardPair` intactos.

**Lote 5 — levar `TopicExperiment` (`argument`, `cohesion`, e os 9 fora do
grupo) para dentro do `BoardShell`.** Menor urgência de conteúdo, mas
resolve a maior quebra de consistência visual entre capítulos do mesmo app;
depende de decidir se `experiment` deveria desaparecer como representação
separada e cada cena virar um `visual-boards`/`visual-instruments` normal, o
que é uma decisão de arquitetura maior do que cabe a este lote de conteúdo.
