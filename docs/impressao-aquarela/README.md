# Impressão em aquarela

Referência visual aprovada em 18/10/2026: papel claro, aquarela verde-petróleo e coral, pétalas translúcidas e esfera armilar dourada. A arte de `src/assets/print/aquarela-crivo.webp` é a proposta gerada e aprovada na conversa, convertida para WebP (172 KiB). Não é uma reprodução do arquivo original da usuária.

O helper compartilhado imprime resumos, estratégias de obras, aprofundamentos e os demais materiais que usam `StudyExportButton`. A primeira página tem a arte no cabeçalho, com o texto abaixo; as continuações preservam a área de leitura, com identificação e numeração em navegadores que suportam as caixas de margem de `@page`. A decoração fica no cabeçalho para não produzir uma página extra apenas com ornamentos.

O corpo usa tinta escura e títulos verde-petróleo sobre branco, independentemente do tema da tela. A decoração é uma imagem incorporada, não um fundo CSS: aparece também com gráficos de fundo desativados e não depende de uma requisição de imagem no momento do clique. A chamada de `window.print()` continua síncrona. A tela original e o título são restaurados após a impressão ou falha.

## Conferência reproduzível

Com `PORT=3138 npm run dev` em execução:

```sh
node scripts/audit-print-watercolor.mjs
```

O script gera PDFs A4 reais com conteúdo sintético extenso, em larguras 390/1366 e temas claro/escuro, sem gráficos de fundo. Confere presença da última seção e das fontes, exclusão dos controles, ausência de páginas só com decoração, contraste do corpo e limpeza após `afterprint`. Os arquivos ficam em `/tmp/crivo-print-watercolor`, ou no diretório indicado por `CRIVO_PRINT_OUTPUT`.

As páginas inicial e de continuação foram inspecionadas visualmente após rasterização do PDF. A auditoria usa Chromium; o diálogo nativo de impressão e Safari/iPad não foram automatizados. Margens físicas e cores variam conforme a impressora.
