# Obras 2027 — cobertura e limitações (06/10/2026)

Registro por obra do que foi lido, conferido e escrito nesta branch
(`claude/focused-volta-bnzw7d`, base `fix/obras-obrigatorias`). Os 17 dossiês ainda não revisados seguem em `needs_review` e sem fontes
críticas. A primeira publicação de Brás Cubas está registrada em
`PUBLICACAO-BRAS-CUBAS.md`, com fontes e recortes efetivamente consultados. Conferência
literal (`scripts/conferir-dossie.py conferir`) prova que as citações estão
na página declarada — **não** é aprovação editorial.

## Quadro geral

| Obra | Banca | Unid. | Cartões | Módulos | Leitura do primário | Origem do dossiê |
| --- | --- | --- | --- | --- | --- | --- |
| Opúsculo humanitário | FUVEST | 7 | 12 | 8 | integral (PR #272); conferida aqui | #272 + correção LXI (59e50383) |
| Nebulosas | FUVEST | 4 | 9 | 8 | PR #272; conferida aqui | #272 |
| Memórias de Martha | FUVEST | 12 | 9 | 8 | PR #272; conferida aqui | #272 |
| Caminho de pedras | FUVEST | 27 | 14 | 8 | PR #272; conferida aqui | #272 |
| A paixão segundo G.H. | FUVEST | 33 | 18 | 8 | PR #272; conferida aqui | #272 |
| Geografia | FUVEST | 7 | 16 | 8 | PR #272; conferida aqui | #272 |
| Balada de amor ao vento | FUVEST | 20 | 18 | 8 | PR #272; conferida aqui | #272 |
| Canção para ninar menino grande | FUVEST | 16 | 16 | 8 | PR #272; conferida aqui | #272 |
| A visão das plantas | FUVEST | 12 | 17 | 8 | PR #272; conferida aqui | #272 |
| Canções escolhidas (14 letras) | Unicamp | 14 | 16 | 8 | integral (14 p.) | 007cea4b |
| Prosas seguidas de Odes mínimas | Unicamp | 33 | 24 | 8 | integral (58 p.) | 84b3cd88 |
| A vida não é útil | Unicamp | 5 | 21 | 8 | integral (p. 9-44 + paratextos) | eafb40d5 |
| Olhos d'água | Unicamp | 15 | 25 | 8 | integral (p. 11-71) | 7e1bd121 |
| Morangos mofados (6 contos) | Unicamp | 6 | 17 | 8 | só os 6 contos exigidos | 7b478fba |
| Os funerais da Mamãe Grande | Unicamp | 8 | 9 | 8 | integral (85 p.) | c96b68b5 |
| No seu pescoço | Unicamp | 12 | 13 | 8 | integral (136 p.) | e26bc47c |
| Vida e morte de M. J. Gonzaga de Sá | Unicamp | 14 | 20 | 8 | integral (92 p.) | 1b45e551 |
| Memórias póstumas de Brás Cubas | Unicamp | 161 | 23 | 8 | integral (134 p.); notas dos 160 cap. | 1118209f |

"Conferida aqui" significa: citações e aberturas dos dossiês da #272 batem
com os PDFs que chegaram na main (`origin/main` 5b891a6d); a leitura integral
daquelas obras foi feita na sessão da #272, não refeita nesta branch.

## Limitações por obra

- **Opúsculo, Nebulosas, Memórias de Martha, Caminho de pedras, G.H., Geografia,
  Balada, Canção, Visão das plantas** — limitações registradas no módulo
  Fontes de cada dossiê (prefácios e notas das edições não usados; Geografia
  vem de cópia eLivros e exclui *O Cristo Cigano*). Sem crítica acadêmica.
- **Canções escolhidas** — transcrição sem editora, data nem parceiros;
  "estrela do noite" e o verso "Não tem órgão oficial…" (p. 12) duvidosos.
  Parcerias, datas e censura não afirmadas.
- **Prosas seguidas de Odes mínimas** — títulos de "Um empregado" (p. 19) e
  "À bengala" (p. 42) fora do lugar no PDF; ligadura "fi" quebrada em duas
  odes. Identificação de Oswald em "Prosa para Miramar" é inferência.
- **A vida não é útil** — PDF de site de download (p. 2); títulos em páginas
  de imagem; paginação a conferir em exemplar.
- **Olhos d'água** — cópia de site de download (p. 3, 72); prefácio e
  introdução da edição não usados; "escrevivência" mencionada como conceito
  externo não conferido.
- **Morangos mofados** — só os seis contos; PDF com avisos de digitalização;
  editora não identificada; título "O dia que Júpiter…" diverge do catálogo
  ("O dia em que…") e precisa ser conferido na lista da Comvest.
- **Funerais, No seu pescoço, Gonzaga de Sá** — ver
  `leitura-funerais-da-mamae-grande.md`, `leitura-no-seu-pescoco.md` e
  `leitura-gonzaga-de-sa.md` e o Fontes de cada dossiê.
- **Brás Cubas** — edição Câmara 2018 (EPUB em PDF). Dedicatória (p. 7),
  rabiscos de XXVI (p. 42) e epitáfio de CXXV (p. 114) só em imagem;
  nenhum cartão depende deles. Cabeçalho de CLIV grafado "CAPITULO". Guias
  com cinco componentes por capítulo, proporcionais a capítulos curtos. Com crítica incorporada na primeira publicação; sem
  colação com edição crítica. Detalhes em `leitura-bras-cubas.md`.

## Lacunas que valem para todas as obras

1. **Pesquisa acadêmica:** nos 17 dossiês sem publicação, nenhuma tese, artigo, ensaio crítico ou prova
   oficial foi incorporado. Brás Cubas tem consulta crítica e oficial delimitada,
   registrada na matriz de publicação. Metadados do Crossref, citados na
   continuidade, não são leitura. A meta da habilidade (fonte oficial, teses,
   estudos e provas das bancas) continua aberta para os demais 17 dossiês; em Brás Cubas,
   leituras longas e aprofundamento dos guias ainda têm limites explícitos.
2. **Marca d'água:** só a camada de texto dos PDFs foi varrida (só e-mails de
   editora). Marca em imagem não foi verificada.
3. **Procedência:** vários PDFs vêm de sites de download; paginação é do
   arquivo, não universal. Conferir em exemplar antes de publicar.
4. **Padrão de módulos:** os 18 dossiês têm os oito módulos (comece aqui,
   análise, crítica e debate, FUVEST, Unicamp, questões, revisão ativa,
   fontes). Nos 14 que tinham três, os cinco novos foram montados a partir
   dos cartões já conferidos, sem leitura ou fonte nova; o módulo da banca
   que não exige a obra é treino de transferência. O teste de integridade
   exige os oito tipos.
5. **Interface:** `ObraDetalhe` agora tem as abas Bancas, Questões e Revisão
   ativa, e a crítica entra no fim da aba Análise. Dossiês sem esses módulos
   mostram o aviso de "em elaboração". Como tudo segue `needs_review`, a
   estudante continua sem ver esses blocos; só o modo revisão (`?revisao=1`)
   os mostra. Não houve conferência no navegador: o catálogo vem do
   Firestore, inacessível sem login neste ambiente.
6. **Funcionalidades do checkpoint perdido** (gabarito após tentativa,
   histórico, revisão ativa funcional, navegação, catálogo 2027) não existem
   neste repositório e não foram implementadas.

## Primeira publicação editorial

Brás Cubas: 161 guias compactos, 23 cartões e oito módulos revisados, com 11 fontes rastreáveis. As demais obras continuam em revisão. A publicação não certifica os quinze componentes avançados por capítulo; os guias têm cinco componentes e o recorte é descrito à estudante em Fontes. Ver `PUBLICACAO-BRAS-CUBAS.md` e `pesquisa-bras-cubas-publicacao.md`.
