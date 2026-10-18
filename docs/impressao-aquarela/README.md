# Impressão com fundo em aquarela

A imagem de `src/assets/print/aquarela-crivo.jpg` é exatamente o arquivo anexado pela usuária em 18/10/2026 (904 × 1280, cerca de 125 KiB), sem recorte, redesenho ou alteração dos pixels. Ela ocupa a folha A4 inteira e se repete em todas as páginas. A suavização é aplicada apenas no layout: opacidade de 18% nas bordas e um desvanecimento adicional de 84% na área de texto. O miolo fica praticamente branco; a arte aparece como detalhe discreto nas margens.

A composição atende à correção mais recente: **arte no fundo e texto usando a página, sem grandes áreas reservadas para decoração**. São 16 mm de margem superior/inferior e 18 mm nas laterais, corpo de 10,5 pt com entrelinha de 1,5. Grupos de tabela repetidos reservam essas margens em cada folha; a imagem fica fixa atrás do conteúdo. A tabela de layout tem papel de apresentação, separado das tabelas que pertencem ao material de estudo.

O helper compartilhado atende resumos, estratégias de obras, aprofundamentos e materiais que usam `StudyExportButton`. O tema da tela não altera a tinta do texto. A arte incorporada funciona mesmo com gráficos de fundo desativados e não depende de uma requisição no clique. `window.print()` permanece síncrono; o documento original e o título são restaurados após impressão ou falha.

## Conferência reproduzível

Com `PORT=3138 npm run dev` em execução:

```sh
CRIVO_PRINT_OUTPUT=/tmp/crivo-print-background node scripts/audit-print-watercolor.mjs
```

A auditoria gera PDFs A4 com o mesmo texto sintético extenso em larguras 390/1366 e temas claro/escuro, com gráficos de fundo desativados. Confere conteúdo final e fontes, exclusão dos controles, ausência de páginas apenas decorativas, imagem em todas as folhas, coordenadas do texto dentro das margens e limpeza após `afterprint`.

O documento de referência passou de cinco páginas no layout anterior para quatro no layout com fundo. Isso é uma comparação do mesmo conteúdo de teste; a quantidade de páginas de cada resumo depende de seu texto, tabelas e ilustrações.

A primeira página e uma continuação foram inspecionadas após rasterização. A auditoria usa Chromium; diálogo nativo e Safari/iPad não foram automatizados. A arte vai até a borda do PDF; a impressão física até a borda depende do suporte da impressora.
