# Revisão e publicação das demais obras de 2027

Base: `origin/main` c107c2af, após integração de Brás Cubas pela PR #277. Branch de trabalho: `fix/publicar-demais-obras-2027`.

## Escopo incorporado

Revisão individual das outras dezessete obras, preservando IDs de unidades, cartões e módulos. A publicação depende de avaliação literária, fontes efetivamente consultadas e correções incorporadas; a conferência automática de citações não constitui aprovação editorial.

A entrega segue o alcance da primeira publicação de Brás Cubas: edição de estudo com guias compactos e limites expressos. Não certifica o cumprimento integral do aprofundamento avançado por unidade ou a leitura integral de toda a bibliografia. Nas notas individuais, separar leitura do texto primário, recortes críticos consultados e síntese autoral.

## Fontes oficiais conferidas

- FUVEST, notícia de renovação das listas de 2026–2029 (22/11/2023): corpo e listas anuais, com confirmação das nove obras de 2027. https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/
- FUVEST, Programa do Vestibular 2027: PDF p. 10–14; uso de Língua Portuguesa p. 13–14. Exige análise linguística e estética, historicidade, intertextualidade e tensões entre tradição e ruptura. https://www.fuvest.br/wp-content/uploads/fuvest2027-programa-vestibular.pdf
- Comvest, Programa das provas Unicamp 2027: PDF p. 3–5, funcionamento da linguagem, prosa e poesia, lista de obras, seis contos de Morangos e catorze canções com parceiros. https://www.comvest.unicamp.br/wp-content/uploads/2026/07/Manual-Programa_provas_VU2027.pdf
- Comvest, prova de segunda fase 2026, primeiro dia: PDF p. 9 (Gonzaga de Sá), p. 10 (Olhos d'água) e p. 11 (banzeiro). A questão de banzeiro usa Eliane Brum e Portal Amazônia, não Ailton Krenak. Não atribuir ao livro. https://www.comvest.unicamp.br/vest2026/F2/provas/2026F2redporingcn.pdf

FORMA e FONTE são instrumentos didáticos da habilidade, não rubricas oficiais. Treino de transferência para uma banca não inclui a obra em sua lista de 2027.

## Verificações iniciais

A conferência literal passou para todos os dezoito dossiês antes da revisão desta série. Os arquivos primários e críticos estão em diretórios ignorados. Os testes de conteúdo em revisão passaram a usar cópias explicitamente pendentes, preservando a cobertura da retenção editorial depois da publicação das obras reais: 25 testes focados passaram.

## Estado desta entrega

As dezessete obras receberam correções textuais, pesquisa documentada e decisão individual de primeira edição de estudo. Todos os módulos, guias e cartões revistos estão publicados nos JSONs. Houve um commit por obra, com conferência literal antes de cada commit; a conferência final das dezoito obras também passou. Os IDs foram preservados. Brás Cubas permanece como publicado na PR #277.

A PR #278 tem base main. Não realizar merge automático. A publicação aqui significa conteúdo liberado nos dados da branch para a interface existente; integração na main e implantação do aplicativo dependem do processo de revisão e entrega do repositório.

## Execução por obra — retomada

| Obra | Decisão e conferência |
| --- | --- |
| A visão das plantas | Primeira edição de estudo aprovada: 8 módulos, 12 guias, 17 cartões, três fontes críticas e três oficiais. Conferência literal passou; IDs preservados. |
| Caminho de pedras | Primeira edição de estudo aprovada: 8 módulos, 27 guias, 14 cartões. Conferência literal passou; IDs preservados. |
| Memórias de Martha | Primeira edição de estudo aprovada: 8 módulos, 12 guias, 9 cartões. Diagnóstico e variantes corrigidos; conferência literal passou; IDs preservados. |
| Balada de amor ao vento | Primeira edição de estudo aprovada: 8 módulos, 20 guias, 18 cartões. Conferência literal passou; IDs preservados. |
| Opúsculo humanitário | Primeira edição de estudo aprovada: 8 módulos, 7 guias, 12 cartões. Conferência literal passou; IDs preservados. |
| Nebulosas | Primeira edição de estudo aprovada: 8 módulos, 4 guias, 9 cartões. Conferência literal passou; IDs preservados. |
| Geografia | Primeira edição de estudo aprovada: 8 módulos, 7 guias, 16 cartões. Conferência literal passou; IDs preservados. |
| A paixão segundo G.H. | Primeira edição de estudo aprovada: 8 módulos, 33 guias, 18 cartões. Conferência literal passou; IDs preservados. |
| Canção para ninar menino grande | Primeira edição de estudo aprovada: 8 módulos, 16 guias, 16 cartões. Conferência literal passou; IDs preservados. |
| Morangos mofados — seis contos | Primeira edição de estudo aprovada: 8 módulos, 6 guias, 17 cartões. Conferência literal passou; IDs preservados. |
| A vida não é útil | Primeira edição de estudo aprovada: 8 módulos, 5 guias, 21 cartões. Conferência literal passou; IDs preservados. |
| Olhos d'água | Primeira edição de estudo aprovada: 8 módulos, 15 guias, 25 cartões. Conferência literal passou; IDs preservados. |
| Canções escolhidas — catorze letras | Primeira edição de estudo aprovada: 8 módulos, 14 guias, 16 cartões. Conferência literal passou; IDs preservados. |
| Prosas seguidas de Odes mínimas | Primeira edição de estudo aprovada: 8 módulos, 33 guias, 24 cartões. Conferência literal passou; IDs preservados. |
| Os funerais da Mamãe Grande | Primeira edição de estudo aprovada: 8 módulos, 8 guias, 9 cartões. Conferência literal passou; IDs preservados. |
| No seu pescoço | Primeira edição de estudo aprovada: 8 módulos, 12 guias, 13 cartões. Conferência literal passou; IDs preservados. |
| Vida e morte de M. J. Gonzaga de Sá | Primeira edição de estudo aprovada: 8 módulos, 14 guias, 20 cartões. Conferência literal passou; IDs preservados. |

## Revisão final e interface

Revisão independente do conjunto: IDs conferidos contra origin/main; nenhum sourceRef inválido ou fonte órfã; exercícios examinados integralmente, sem gabarito explícito no módulo; nenhum PDF novo no diff. A revisão direcionada de análises, fontes e notas não encontrou defeito importante confirmado. Não constitui nova leitura integral das dezessete obras ou de toda a bibliografia externa.

Chromium: dezoito obras em desktop 1365 × 900 e celular 390 × 844, modo normal, oito abas por obra: 36 combinações de rota/tela e 288 abas verificadas. Nenhum estado de conteúdo em elaboração ou erro JavaScript. Componente ObraDetalhe e JSONs reais; catálogo e autenticação simulados, sem escrita de progresso nem validação Firestore autenticada. Evidências privadas em `/workspace/artifacts/demais-obras-publicacao/resultado.json` e seis capturas de tela. Inspeção visual da aba Fontes de Gonzaga em celular confirmou leitura e quebra do texto dentro do painel.

Lint passou. Build passou com aviso de tamanho de chunks já existente. A conferência literal final passou para as dezoito obras. Suíte completa passou: 922 testes Node e 1.363 Vitest, total 2.285, em 175 arquivos Vitest. Os avisos de scrollTo no ambiente DOM de testes não produziram falhas.

## Entrega remota

Destino: `origin/fix/publicar-demais-obras-2027`; PR https://github.com/anajumorandii-eng/My-App/pull/278, base main, aberta para revisão, sem merge automático. Dezessete commits individuais de obra e este registro final encerram a primeira edição compacta. Para disponibilidade no app de produção, ainda é necessária integração e implantação pelo fluxo do repositório.

Estado de conteúdo: dezoito dossiês com 406 guias, 297 cartões e 144 módulos publicados. Nenhuma implementação de motor de questões ou alteração do catálogo Firestore foi feita nesta entrega.
