# PDFs de estudo: capa, sumário e miolo econômico

A primeira página usa a aquarela anexada pela usuária em 18/10/2026, em cores e sem recorte do arquivo. A capa identifica matéria, tópico, subtópico/capítulo, banca e objetivo. Para Literatura, mostra o nome da obra e seu recorte. Os dados vêm do material selecionado, incluindo os tópicos combinados e as bancas dos guias salvos; o resumo de obra recebe as bancas do catálogo carregado pela página, sem assumir a banca padrão do treino.

A segunda página inicia o sumário, construído com os títulos efetivamente presentes no material e links para as seções do PDF. Também reconhece títulos de parágrafos inteiramente em negrito. Índices extensos usam duas colunas e priorizam níveis principais; se ainda necessário, continuam sem cortar títulos. Não se inventam números de páginas: a paginação final é feita pelo navegador. Textos sem títulos recebem uma única entrada de conteúdo.

Da terceira página em diante, o fundo é branco, com títulos em verde-petróleo, citações de traço discreto e tabelas legíveis. A decoração não se repete no miolo. Mantêm-se margens de 16 mm acima/abaixo e 18 mm nas laterais, corpo de 10,5 pt e entrelinha de 1,5. A capa e o sumário são as duas páginas adicionais pedidas; o conteúdo continua compacto.

A preparação acontece na cópia temporária de impressão. O documento original, seus IDs e o título da tela são preservados. A arte é incorporada ao módulo e `window.print()` permanece síncrono, sem carregamento externo ou espera de fontes no clique.

## Conferência reproduzível

Com `PORT=3138 npm run dev` em execução:

```sh
CRIVO_PRINT_OUTPUT=/tmp/crivo-print-cover node scripts/audit-print-watercolor.mjs
```

A auditoria gera PDFs A4 reais em larguras 390/1366 e temas claro/escuro, com gráficos de fundo desativados. O mesmo exemplo extenso tem seis páginas: capa na primeira, sumário na segunda e quatro páginas de conteúdo. Confere contexto da capa, links do sumário, presença da última seção e das fontes, exclusão de controles, arte apenas na capa, coordenadas do texto dentro das margens e limpeza após `afterprint`.

Os testes do helper verificam também metadados escapados, preservação dos IDs, entradas do sumário e material sem títulos. A seleção da banca de obra é conferida no teste do componente.

Capa, sumário e uma continuação foram inspecionados após rasterização. A validação usa Chromium; diálogo nativo e Safari/iPad não foram automatizados. A capa vai até a borda do PDF; impressão física sem borda depende do equipamento.
