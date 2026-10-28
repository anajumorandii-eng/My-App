# Figuras científicas nos resumos

## Referência e objetivo

O arquivo **Revisão química orgânica**, localizado no Drive e examinado como referência privada, apresenta nomenclatura, funções e reações em texto, fórmulas e tabelas. Esses conteúdos também podem ser explicados pela estrutura das moléculas e pelas ligações que mudam. O PDF original não foi modificado nem incorporado ao repositório.

A geração de revisões agora oferece **Incluir figuras quando ajudarem a entender**, ativado por padrão. A preferência por somente texto é salva, restaurada e enviada ao servidor, preservando banca, recortes, profundidade e demais configurações. A ausência desse campo em materiais antigos mantém o comportamento automático e sua identidade anterior. Materiais salvos não são reescritos automaticamente.

## Implementação

O contrato e o renderizador `study-visual` existentes foram ampliados. Além de fluxogramas e barras, são aceitos:

- **Estruturas químicas** com nome e conectividade SMILES.
- **Sequências reacionais** com duas a quatro estruturas e uma condição para cada seta. Representam transformações globais; não fingem representar movimento eletrônico.
- **Gráficos de linhas** com eixos, unidades, séries e pontos numéricos. Há distinção por padrão de traço e uma tabela de valores acessível sob demanda na tela.

A IA seleciona figuras pertinentes e fornece dados estruturados. Os desenhos são produzidos localmente como SVG. Não há solicitação extra de imagem, URL inventada, execução de HTML enviado pelo modelo ou alteração do modelo usado nas capas. A biblioteca de disposição molecular só é carregada quando existe uma estrutura química. Seus estilos ficam limitados ao próprio SVG.

Os prompts pedem condições, legenda e interpretação, além de origem dos valores; números criados para exemplo devem ser identificados como didáticos. A pergunta da figura deve ser retomada no gabarito. A validação limita campos, quantidade de itens, tamanho das estruturas e dados numéricos, recusando curvas com abscissas fora de ordem. Isso verifica formato e desenho, não certifica automaticamente a exatidão científica de todo conteúdo gerado.

As tabelas Markdown deixam de impor largura mínima de 36 rem; textos passam a quebrar dentro da coluna em telas pequenas. Expressões matemáticas continuam usando o renderizador existente.

## Linguagem visual (28/10/2026)

A primeira versão desenhava as estruturas no tema padrão da biblioteca — quadro branco, fonte sem serifa, vermelho e azul puros — e as setas de reação eram um "↓" de texto. Ao lado das tabelas de borda dourada, da capa em aquarela e das pranchas do Visual em tinta de caderno, a figura parecia vinda de outro aplicativo.

Agora a figura segue a mesma linguagem:

- **Moldura:** a borda e a faixa de título das tabelas dos resumos, com um rótulo em vinho que diz o que é a figura (Reação, Estrutura, Gráfico, Esquema).
- **Moléculas:** tinta de caderno das pranchas, com oxigênio em vinho, nitrogênio em azul, halogênios em verde e enxofre/fósforo em ocre. Serifa Newsreader, sem fundo próprio, e nome da substância em itálico embaixo, como legenda de livro.
- **Reações:** em linha (estrutura → seta com a condição por cima → estrutura). A seta é desenhada em SVG, com a ponta das setas de `ChemistryMechanisms`. No celular, a sequência desce, e a seta aponta para baixo.
- **Curvas, barras e fluxos:** a mesma tinta. Grade pontilhada, eixos com ponta de seta, rótulos dos eixos em itálico e séries diferenciadas por cor e por padrão de traço.
- **Cores por token:** cada cor é um token (`--fig-*`, em `StudyVisual.css`) com o valor claro como reserva no próprio atributo (`src/lib/figureInk.ts`). Na tela, a figura acompanha o tema, inclusive o escuro. No PDF, que recebe só `printStyles`, cai na paleta da capa: borda dourada, título verde-petróleo, rótulo em vinho.

## PDF

A captura aguarda a preparação dos desenhos. Os SVGs são incorporados ao documento e exportados pelo navegador isolado do servidor, preservando texto, fórmulas, fontes e capa. Unidades visuais de altura moderada são mantidas inteiras; unidades extensas podem continuar na página seguinte. Foi necessário limitar a escala das estruturas e tratar as regras de órfãs/viúvas para evitar uma página inicial quase vazia.

O gráfico impresso mantém eixos, valores dos eixos, curvas, legenda e interpretação. O controle interativo **Ver valores do gráfico** fica na tela; seu painel de dados não é duplicado automaticamente no PDF.

## Validação

- `npm run lint`: TypeScript sem erros.
- `npm test`: 1.266 testes do servidor aprovados (um ignorado) e 3.345 testes de interface aprovados em 259 arquivos.
- `npm run build`: cliente e servidor compilados; aviso de tamanho de chunks de impressão mantido.
- `git diff --check`: sem erros de whitespace.

- Parser: moléculas, condições por seta, pontos finitos e crescentes, rejeição de conteúdo ativo e compatibilidade das barras antigas.
- Componentes: preparação, erro de estrutura, cópia para impressão, leitura dos gráficos e opção de geração salva/restaurada.
- Exportação: aguarda a remoção do marcador de figura pendente, inclusive quando só muda um atributo.
- Navegador real em 390, 834 e 1440 px: cinco figuras, sete estruturas desenhadas, sem falha de desenho ou rolagem horizontal no conjunto de teste.
- Geração real pelo gateway: duas sequências válidas de oxidação de álcoois, com cinco estruturas. A conectividade e as condições foram conferidas, e o texto completo foi renderizado nos mesmos três tamanhos e exportado para PDF.
- PDFs reais rasterizados e inspecionados visualmente: ligações simples e duplas, grupos OH/carbonila, halogênio, anel aromático, setas, legendas, eixos e tabela.

A geração real foi exercitada com o serviço e a rota do aplicativo em servidor local, usando o gateway configurado. Não foram escritos materiais em uma conta real. As evidências são sintéticas, sem dados da estudante, páginas do PDF privado ou credenciais. Esta entrega não inclui implantação automática.

## Evidências e reprodução

- [Exemplo completo em PDF](evidencias/estruturas-e-graficos.pdf)
- [Reação](evidencias/reacao.png)
- [Gráfico](evidencias/grafico.png)
- [Celular](evidencias/celular.png)
- [Tablet](evidencias/tablet.png)
- [Computador](evidencias/computador.png)

Com Vite na porta 3138 e Chromium instalado:

```sh
node --import tsx scripts/validate-study-figures.mjs
```

`CRIVO_FIGURES_INPUT` permite validar outro Markdown local e `CRIVO_FIGURES_OUTPUT` escolhe a pasta de saída. Os dados do arquivo de referência privado não são necessários para reproduzir o teste.

## Arquivos alterados

- `package-lock.json`
- `package.json`
- `scripts/studyFiguresFixture.tsx`
- `scripts/validate-study-figures.mjs`
- `server/ai/reviewSummaryPrompt.test.ts`
- `server/ai/reviewSummaryPrompt.ts`
- `server/ai/studyMaterialQuality.ts`
- `server/ai/validation.ts`
- `server/http/studyPdf.ts`
- `src/components/AiTextRenderer.tsx`
- `src/components/DeepeningPdf.test.tsx`
- `src/components/DeepeningPdf.tsx`
- `src/components/StudyLineChart.tsx`
- `src/components/StudyMolecule.test.tsx`
- `src/components/StudyMolecule.tsx`
- `src/components/StudyVisual.test.tsx`
- `src/components/StudyVisual.tsx`
- `src/lib/drawStudyMolecule.ts`
- `src/lib/printStyles.ts`
- `src/lib/strategicReview.test.ts`
- `src/lib/strategicReview.ts`
- `src/lib/studyVisual.test.ts`
- `src/lib/studyVisual.ts`
- `src/views/ReviewSummaries.test.tsx`
- `src/views/ReviewSummaries.tsx`

Este relatório e suas evidências também integram a entrega.
