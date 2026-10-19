# PDFs de estudo: atlas científico, sumário e miolo econômico

A capa segue a referência aprovada de atlas científico: papel marfim `#F6F2E9`, tipografia serifada verde `#1C3028`, subtítulos vinho `#7A1F24` e traços de cobre `#A6824B`. A moldura geométrica de astrolábio, os alvos, a cartela dupla com recortes côncavos e todos os textos são HTML/SVG nativos. Não há texto gerado dentro das imagens. Cormorant Garamond e Playfair Display estão incorporadas localmente em WOFF, acompanhadas das licenças OFL; a impressão não consulta Google Fonts.

O contrato tipado de `printCoverSpec.ts` preserva matéria, tópico, subtópico, obra, banca e objetivo recebidos do material. Define também as três palavras editoriais e a descrição visual. Títulos extensos e tópicos combinados ajustam tamanho e espaçamento, sem truncar metadados. Quando não há banca, nenhuma é inventada.

Há oito pranchas ilustradas originais incorporadas: Biologia, Sangue e Imunologia, Química, Física, Matemática, Geografia, História e Literatura. A escolha segue os metadados; obras usam Literatura. Sangue e Imunologia possui quatro legendas nativas: Hemácias, Defesa, Anticorpos e Circulação. As demais pranchas não possuem esse conjunto de legendas. São ilustrações decorativas de capa, não diagramas didáticos validados. Nenhuma apostila, PDF pessoal ou imagem de referência foi incorporada.

## Situação da integração com IA

Esta entrega usa pranchas previamente geradas e empacotadas com o aplicativo. **Não realiza geração de imagens em tempo de execução pelo CLI Proxy.** A autenticação informada pela usuária é OAuth administrado pelo CLI Proxy; o token deve permanecer no servidor/proxy. O adaptador existente do aplicativo usa um gateway de conversação. O endpoint de imagem, os modelos disponíveis e a autenticação de produção ainda precisam ser verificados no serviço real. O ambiente desta verificação não disponibilizou identidade do Google Cloud nem a configuração privada do proxy. Não se presume que uma rota de geração de imagens aceite o mesmo contrato da rota de conversação.

O contrato de capa e a composição nativa permitem substituir a prancha por uma ilustração produzida pelo serviço depois dessa verificação, sem delegar grafia de títulos ou geometria da moldura à IA.

## Paginação e impressão

A primeira página contém a capa. A segunda inicia o sumário com os títulos efetivamente presentes no material e links para as seções. Também reconhece parágrafos inteiramente em negrito. Índices extensos priorizam níveis principais e podem continuar sem cortar entradas. Não se inventam números de página: o navegador determina a paginação final.

O miolo tem fundo branco, títulos discretos e tabelas legíveis. A ilustração não se repete nas páginas de conteúdo. Mantêm-se margens de 16 mm acima/abaixo e 18 mm nas laterais, corpo de 10,5 pt e entrelinha de 1,5. O conteúdo e os diagramas originais são preservados.

A preparação ocorre em uma cópia temporária. Os IDs originais e o título da tela são restaurados. `window.print()` permanece síncrono, com fontes e imagens incorporadas e sem chamada de rede no clique. As fontes são pré-carregadas antes da interação; uma fonte serifada local continua disponível como alternativa.

## Conferência reproduzível

Com `PORT=3138 npm run dev` em execução:

```sh
CRIVO_PRINT_OUTPUT=/tmp/crivo-print-cover node scripts/audit-print-watercolor.mjs
CRIVO_PRINT_CONTEXT_OUTPUT=/tmp/crivo-print-contexts node scripts/audit-print-cover-contexts.mjs
```

A primeira auditoria gera PDFs A4 em larguras 390/1366 e temas claro/escuro, com gráficos de fundo desativados. Confere capa na primeira página, sumário na segunda, quatro páginas de conteúdo, fontes incorporadas, ilustração restrita à capa, links, última seção, limites do texto e limpeza após `afterprint`.

A segunda verifica nove contextos: Sangue e Imunologia, Química, Matemática, Geografia, História, Física, obra completa, quatro tópicos combinados e material sem banca. Confere os metadados extraídos do PDF, a prancha escolhida, espaço disponível para a ilustração e a posição da cartela. Os exemplos são sintéticos e não constituem material de estudo.

Os testes verificam metadados escapados, IDs, sumário, temas, contrato visual e contexto denso. A validação automatizada usa Chromium; o diálogo nativo de impressão e Safari/iPad não foram automatizados. Impressão física sem bordas depende do equipamento.
