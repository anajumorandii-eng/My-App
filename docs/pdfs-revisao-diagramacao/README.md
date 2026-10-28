# Diagramação compacta das revisões

A exportação anterior reservava uma página para o sumário, forçava outra quebra
antes do gabarito e acumulava espaçamentos de impressão e da tela. As revisões
agora usam sumário e conteúdo no mesmo fluxo, com margens uniformes de 14 mm
reservadas pelo cabeçalho/rodapé repetido da tabela de impressão. A capa continua
fora desse fluxo e mantém sua composição original.

Foram reduzidos os intervalos entre parágrafos, títulos, listas, fórmulas, tabelas
e figuras. A fonte do corpo permanece em 10,5 pt, com entrelinha 1,3. Não houve
reescrita, resumo, exclusão de conteúdo ou transformação de páginas em imagens.
Cada folha continua sendo uma página A4 vertical, com texto e gráficos nativos.
Títulos mantêm as regras existentes de união ao texto seguinte. Fórmulas,
figuras e linhas de tabela conservam suas proteções contra cortes.

## Comparação com conteúdo congelado

| Material | Antes | Depois | Redução |
| --- | ---: | ---: | ---: |
| Revisão orgânica salva atualmente, incluindo nove referências | 26 | 19 | 7 páginas (26,9%) |
| Exemplo sintético de oxidação de álcoois | 7 | 6 | 1 página (14,3%) |

O mesmo HTML de conteúdo alimentou os dois modelos em cada comparação. O PDF
antigo do Drive permanece intacto; a primeira linha mede uma reexportação da
versão atualmente salva. Nenhuma nova geração de texto foi usada na comparação.
Os arquivos privados ficam fora do repositório público. Os PDFs de exemplo
sintético [antes](exemplo-antes.pdf) e [depois](exemplo-depois.pdf) podem ser
consultados aqui, com os [resultados numéricos](resultados.json).

## Verificações

- Igualdade integral do texto, tabelas, títulos e SVGs antes/depois.
- Todas as páginas em A4 vertical; fonte física do corpo em 10,5 pt nas duas versões.
- Capa idêntica pixel a pixel nas duas comparações.
- Todas as 44 entradas do sumário completo e as 18 do exemplo curto conferidas
  individualmente contra a página real de destino no PDF final.
- Inspeção visual de todas as 19 páginas finais da revisão e das seis do exemplo:
  fórmulas, tabelas, diagramas, referências e gabaritos sem cortes ou sobreposições.
- Testes de estrutura garantem que aprofundamentos conservam o fluxo anterior e
  que a preparação da revisão não modifica o DOM original.

Verificações do projeto: `npm run lint` e `npm run build` concluídos;
`npm test` com 1.273 testes do servidor/bibliotecas e 3.349 da interface
aprovados (um teste do servidor ignorado pela configuração existente).

## Reproduzir a comparação

Com Vite em `127.0.0.1:3138`, forneça um HTML de impressão completo e congelado
(sem reduzir páginas a imagens):

```sh
node --import tsx scripts/validate-review-layout.mjs /caminho/revisao.html
python scripts/audit-review-layout.py /tmp/crivo-review-layout/results
```

O comparador usa o exportador real, as fontes matemáticas e a paginação real do
sumário. A base padrão é `f0c78e4b`, configurável por `CRIVO_LAYOUT_BASE_REF`.
`CRIVO_LAYOUT_OUTPUT` permite selecionar o diretório de saída.
`scripts/reviewLayoutFixture.tsx` monta fontes salvas com os mesmos componentes
de conteúdo e referências do leitor, sem conter dados privados.

As regras se aplicam aos próximos PDFs gerados pelo fluxo compartilhado de
revisões. PDFs já arquivados não são apagados nem invalidados. Esta entrega não
publica a alteração em produção.
