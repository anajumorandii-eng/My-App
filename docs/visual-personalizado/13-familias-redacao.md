# Famílias de cena — Redação (Fase 5, Task 1)

Este documento fecha a Task 1 do lote de Redação: a atribuição de família (ou
lacuna) para os 58 capítulos de Redação, derivada de leitura integral de
`deepSummaryContent.json` (`subject === "Redação"`). Não escreve nenhuma
`SceneEntry` de dados — isso fica para a tarefa seguinte, que só precisa
transcrever quotes já localizadas aqui em `src/views/topic-scenes/data/redacao.ts`.

## Por que a taxa de lacuna é tão mais alta aqui que nas fases anteriores

Redação, ao contrário de Geografia, História, Sociologia e Filosofia, não é
uma disciplina de conteúdo sobre o mundo (fenômenos, correntes teóricas,
processos históricos). É uma disciplina de **técnica de escrita**: cada
capítulo ensina um procedimento (como formular uma tese, como sequenciar um
parágrafo, como montar uma proposta de intervenção) ou lista um banco de
repertório para consulta (conceitos, marcos legais, dados por eixo temático).//
Os oito testes estruturais das famílias (rivalidade genuína, base assimétrica,
tipos coexistentes com guarda-chuva, critérios conjuntivos, escala ordenada de
graus, cadeia causal instrumental, três momentos dialéticos, cruzamento de
eixos ortogonais) foram desenhados para testar **conteúdo do mundo**, não
receitas de composição nem menus de recursos retóricos intercambiáveis. A
maioria esmagadora dos capítulos de Redação é exatamente isso: uma receita ou
um menu, não um fenômeno com estrutura interna a mapear.

Essa distinção foi o critério mais usado neste documento para descartar
candidatos tentadores: um capítulo que lista "três formas de fazer X, que o
mesmo autor pode escolher ou até combinar no mesmo parágrafo" não é uma
tipologia, mesmo que o texto diga "três tipos" — porque tipologia (na acepção
das fases anteriores) classifica variantes de um fenômeno externo observável,
não opções de estilo à disposição de quem escreve. Essa vara foi aplicada de
forma consistente: nenhum menu de recursos argumentativos, de coesão, de
contextualização ou de refutação foi aceito como tipologia, mesmo quando o
capítulo enumera 3 a 5 itens com nomes próprios.

## Atribuição definitiva

### `tipologia` (1 capítulo)

- **`summary-redacao-generos-e-sua-relacao-com-a-estrutura-do-texto`** —
  guarda-chuva real na seção "Gênero determina estrutura": *"Cada gênero tem
  estrutura, registro e interlocutor próprios."* Quatro gêneros são
  enumerados, cada um com propriedade estrutural distintiva e citável: *"Uma
  carta aberta exige destinatário explícito, vocativo e apelo; um artigo de
  opinião pressupõe leitor de jornal e assinatura; um manifesto usa primeira
  pessoa do plural e tom de convocação; a dissertação escolar mantém
  impessoalidade e estrutura argumentativa clássica."* A diferença crucial
  frente aos "menus de recursos" descartados abaixo: gênero não é uma escolha
  estilística do candidato para o mesmo texto — é uma categoria **atribuída
  pela banca** na proposta, mutuamente exclusiva por prova (não se escreve
  meio-carta meio-dissertação), o que dá a esses quatro itens o estatuto de
  tipos reais de um fenômeno externo (a variedade de gêneros que uma prova
  pode pedir), não de técnicas intercambiáveis dentro de um único texto.

Candidato descartado com o padrão mais próximo: `summary-redacao-paragrafo-de-introducao-como-contextualizar`
enumera cinco "tipos" de contextualização (histórica, conceitual, comparativa,
factual, alusiva), mas o próprio autor do texto escolhe livremente entre eles
— e pode até combiná-los — para abrir o mesmo parágrafo da mesma redação; não
há exclusividade nem categoria externa fixa sendo classificada, é recurso de
estilo. Ver a lacuna correspondente para o texto completo do raciocínio.

### `escala-de-graus` (2 capítulos)

- **`summary-redacao-diferentes-graus-de-adequacao-a-proposta`** — a seção
  "Os três níveis" nomeia três degraus ordenados por gravidade crescente de
  consequência: *"o texto pode estar plenamente adequado, quando desenvolve
  exatamente o recorte pedido; tangenciar, quando trata do eixo mais amplo sem
  enfrentar o recorte; ou fugir ao tema, quando trata de assunto distinto."* A
  gradação de consequência é explícita: *"As consequências vão da perda
  parcial de pontos à nota zero."* `items[0]` = "Plenamente adequado" (grau
  mais baixo de desvio), `items[2]` = "Fuga ao tema" (grau mais alto).

- **`summary-redacao-os-direitos-humanos-de-2-e-3-geracao-direitos-sociais-coletivos-e-difusos`**
  — a seção "Pratique e confira" nomeia três graus ordenados de exigência
  crescente ao Estado: *"a primeira exige abstenção, a segunda exige
  prestação positiva por meio de políticas públicas, e a terceira exige ação
  coletiva e cooperação, com titularidade difusa."* O próprio capítulo alerta
  contra ler isso como substituição sucessiva — *"Outro deslize é apresentar
  as gerações como substituições sucessivas, quando são acumulativas"* — o que
  descarta `cadeia-de-derivacao` (não há elo causal entre uma geração e a
  próxima) mas não descarta `escala-de-graus`: a característica que varia
  ordenadamente entre os três itens não é "o que substitui o quê", é "quanto o
  Estado precisa fazer", exatamente como Blocos Econômicos em Geografia (graus
  cumulativos de integração, não substituições). `items[0]` = "Primeira
  geração" (abstenção, grau mais baixo de exigência), `items[2]` = "Terceira
  geração" (ação coletiva com titularidade difusa, grau mais alto).

  Nota de processo: a quote de cada item vem da seção "Pratique e confira"
  (resposta ao exercício de fixação), não de uma seção expositiva dedicada —
  é o único lugar do capítulo em que as três gerações aparecem lado a lado e
  ordenadas explicitamente pelo tipo de exigência. É citação literal e válida
  mesmo vindo dessa seção.

  Candidato descartado por falta de material dentro do próprio capítulo:
  `summary-redacao-os-direitos-humanos-de-1-geracao-direitos-individuais`
  descreve isoladamente só a primeira geração — não há um segundo degrau
  citável dentro deste capítulo para compor a escala, então ele fica como
  lacuna e a escala inteira é atribuída ao capítulo seguinte, onde os três
  graus efetivamente aparecem juntos.

### As outras seis famílias (0 capítulos cada)

`contraste-de-posicoes`, `camadas-de-determinacao`, `cadeia-de-derivacao`,
`criterios-conjuntivos`, `movimento-dialetico` e `grade-de-eixos` não
apareceram em nenhum dos 58 capítulos. Isso é esperado e coerente com a
natureza da disciplina (ver seção acima): essas seis famílias testam
rivalidade teórica, assimetria de base, necessidade conjunta de fatores,
síntese dialética ou cruzamento de eixos ortogonais sobre um fenômeno do
mundo — nenhum capítulo de Redação descreve um fenômeno do mundo com essa
estrutura interna; todos descrevem procedimentos de escrita ou bancos de
repertório para consulta.

O candidato mais próximo de `contraste-de-posicoes` foi
`summary-redacao-argumentacao-auditorio-particular-e-universal` (auditório
particular vs. universal, de Perelman) — descartado porque nenhum dos dois é
rejeitado: a escolha entre eles depende do gênero da proposta, ambos são
formas legítimas de argumentar conforme o contexto, o oposto de uma rejeição
explícita.

## Lacunas declaradas (55 capítulos)

Nenhuma lacuna abaixo usa motivo genérico como "não cobre o capítulo inteiro"
— cada uma cita o mecanismo específico do conteúdo do capítulo (procedimento
de composição, banco de repertório, menu de recursos intercambiáveis,
diagnóstico de erro, ou combinação simultânea de elementos no mesmo texto) que
afasta as oito famílias. O texto completo de cada motivo está em
`src/views/topic-scenes/data/redacao.ts` (`redacaoSemCena`); um resumo por
categoria de motivo:

- **Bancos de repertório para consulta** (conceitos, marcos legais, dados por
  eixo temático, sem guarda-chuva estrutural entre os itens): os oito
  capítulos "Incrementando o Repertório: ..." (Meio Ambiente, Educação e
  Trabalho, Temas Abstratos, Corpo/Saúde/Sexualidade, Violência/Leis/Punição,
  Cidadania e Poder, Arte/Cultura/Relações Sociais, Mídia e Sociedade).

- **Procedimentos guiados de montagem de argumento e proposta sobre um tema de
  exemplo** (sequência de composição aplicada a um recorte, não estrutura do
  mundo): os sete capítulos "Analisando Tema (Abstrato) de Redação: ..." (Meio
  Ambiente, Educação e Trabalho, Corpo/Saúde/Sexualidade,
  Violência/Leis/Punição, Cidadania e Poder, Arte/Cultura/Relações Sociais,
  Mídia e Sociedade) mais "Analisando Tema Abstrato de Redação".

- **Menus de recursos retóricos ou de coesão intercambiáveis dentro do mesmo
  parágrafo** (o autor escolhe ou combina livremente, sem exclusividade nem
  categoria externa fixa): Parágrafo de Introdução: como Contextualizar;
  Argumentação Quase-Lógica e Efeito de Verdade; Recursos Argumentativos:
  Dados Numéricos e Exemplos, Vozes Prestigiadas, Interdiscursividade e
  Intertextualidade, Múltiplos Domínios do Saber; Refutando o Ponto Contrário;
  Recursos de Coesão Referencial e Recursos de Coesão Sequencial.

- **Receitas de composição de uma única parte do texto** (elementos
  simultâneos do mesmo parágrafo, não tipos, escala ou cadeia): Estrutura
  Clássica do Texto Dissertativo; Parágrafo de Introdução: Delimitando a
  Opinião; Conclusão por Síntese ou Retomada da Tese; Conclusão: Sumarização,
  Focalização e Expressividade; Ressalvando o Ponto de Vista Contrário;
  Proposta de Intervenção: Viabilização e Inovação; Recursos Linguísticos:
  Norma, Clareza e Expressividade.

- **Diagnósticos e critérios de verificação/revisão** (checklist de erro, não
  estrutura de conteúdo): Argumentação e Coerência Interna; Argumentação e
  Coerência Externa; Proposta de Intervenção: Coerência Argumentativa; Coesão
  no Texto Dissertativo: Análise de Problemas; O que se Avalia na Dissertação.

- **Checklists de agentes/exemplos/proibições** (enumeração sem guarda-chuva
  de tipo com propriedade estrutural distintiva, ou lista de erros a evitar em
  vez de tipologia positiva): Proposta de Intervenção: Atores Sociais e
  Cidadania; Proposta de Intervenção: Respeito aos Direitos Humanos; Qual Será
  o Tema deste Ano: Grandes Eixos Temáticos.

- **Rotinas de estudo em etapas sequenciais** (método do próprio candidato,
  não conteúdo do mundo): Organizando as Ideias: Brainstorm e Mind Maps;
  Recursos Argumentativos: Temas de Redação já Analisados; Recursos
  Argumentativos: Fatos da Atualidade; Redações na Mídia: como Aprimorar.

- **Casos únicos**: A Dissertação no Vestibular: Mitos e Verdades (checklist
  de mitos por banca, sem rivalidade teórica); Projeto de Texto em Favor da
  Progressão Textual (ordens de argumento como alternativas equivalentes,
  não escala fixa); Repertório: o Diferencial de Redações de Sucesso
  (dicotomia produtivo/decorativo do mesmo repertório); Tangenciamento e Fuga:
  a Fronteira do Tema (mecanismos paralelos de erro, mesma escala do capítulo
  de Diferentes Graus, sem novo degrau); Lendo a Coletânea (as quatro partes
  I/II de Apreensão de Sentidos e Compreensão/Texto Autoral: procedimentos de
  leitura da coletânea); Argumentação: Auditório Particular e Universal (dois
  modos que coexistem sem rejeição mútua); Os Direitos Humanos de 1ª Geração
  (só um degrau citável dentro deste capítulo, a escala completa está no
  capítulo seguinte); Redações Nota 1000: Trunfos a Inspirar (traços
  simultâneos do mesmo texto ideal).

Lista completa dos 55 chapterIds e motivo literal de cada um:
`src/views/topic-scenes/data/redacao.ts` (`redacaoSemCena`).

## Verificação de completude

3 capítulos com família (`tipologia`: 1, `escala-de-graus`: 2) + 55 lacunas =
58. Confere com o total de capítulos de Redação em
`src/data/summaryCurriculum.ts`. Taxa de lacuna: 55/58 ≈ 95% — a mais alta
entre as fases já concluídas (Filosofia, Sociologia, História, Geografia), o
que é o resultado esperado e correto para uma disciplina de técnica de escrita
em vez de conteúdo do mundo, não um sinal de leitura malfeita (ver seção
"Por que a taxa de lacuna é tão mais alta aqui" acima).

## Nenhuma experiência interativa preexistente

`src/views/topic-experiments/catalog.ts` tem uma única entrada de Redação:
`'summary-redacao-projeto-de-texto-em-favor-da-progressao-textual': 'argument'`.
Isso não muda a atribuição deste documento (o capítulo já está listado como
lacuna por motivo de conteúdo, independente da experiência interativa
existente) — mas fica registrado aqui porque, ao contrário de Geografia
(coordenadas geográficas), a experiência interativa de Redação não coincide
com nenhum capítulo que este documento consideraria candidato a família de
cena; não há conflito nem sobreposição a resolver nas tasks seguintes.

## Nota para fases futuras (Gramática, Entendimento de Texto)

Se Gramática e Entendimento de Texto seguirem o mesmo padrão de Redação
(disciplinas de técnica/norma, não conteúdo do mundo), espera-se taxa de
lacuna igualmente alta. A vara aplicada aqui — menu de recursos intercambiáveis
dentro do mesmo texto não é tipologia, mesmo com "tipos" no texto-fonte — deve
ser reaplicada com o mesmo rigor, em vez de relaxada para reduzir a taxa de
lacuna artificialmente.
