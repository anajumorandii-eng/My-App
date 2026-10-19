# PDFs de estudo: atlas científico, sumário e miolo econômico

A capa segue a referência aprovada de atlas científico: papel marfim `#F6F2E9`, tipografia serifada verde `#1C3028`, subtítulos vinho `#7A1F24` e traços de cobre `#A6824B`. A moldura geométrica de astrolábio, os alvos, a cartela dupla com recortes côncavos e todos os textos são HTML/SVG nativos. Não há texto gerado dentro das imagens. Cormorant Garamond e Playfair Display estão incorporadas localmente em WOFF, acompanhadas das licenças OFL; a impressão não consulta Google Fonts.

O contrato tipado de `printCoverSpec.ts` preserva matéria, tópico, subtópico, obra, banca e objetivo recebidos do material. Define também as três palavras editoriais e a descrição visual. Títulos extensos e tópicos combinados ajustam tamanho e espaçamento, sem truncar metadados. Quando não há banca, nenhuma é inventada.

Há oito pranchas ilustradas originais incorporadas: Biologia, Sangue e Imunologia, Química, Física, Matemática, Geografia, História e Literatura. A escolha segue os metadados; obras usam Literatura. Sangue e Imunologia possui quatro legendas nativas: Hemácias, Defesa, Anticorpos e Circulação. As demais pranchas não possuem esse conjunto de legendas. São ilustrações decorativas de capa, não diagramas didáticos validados. Nenhuma apostila, PDF pessoal ou imagem de referência foi incorporada.

## Composição sem recorte aparente

As pranchas incorporadas possuem papel creme nos próprios pixels. Multiplicá-lo pelo fundo marfim escurecia o retângulo inteiro da imagem. A composição agora normaliza esse fundo e o converte à cor do papel em um filtro SVG com espaço sRGB, sem uma segunda placa opaca. A imagem continua em `object-fit: contain`; os motivos não são esticados nem cortados para preencher o espaço. O sumário e o miolo mantêm a mesma paginação.

A auditoria `audit-print-paper.mjs` mede pixels rasterizados do PDF, e não apenas propriedades CSS. Antes da correção, o caso literário excedia a tolerância; depois, as oito áreas ficaram dentro de dois níveis RGB de diferença nas regiões vazias medidas. Isso não substitui inspeção visual da ilustração.

## Personalização opcional pelo serviço de imagens

A geração está conectada ao endpoint de imagens do gateway por uma rota exclusiva, `GET/POST /api/cover-illustrations`. As duas operações exigem conta administradora com e-mail verificado; a geração respeita a cota diária compartilhada e um limite de três solicitações em dez minutos. Consultas de disponibilidade não consomem esse limite de geração.

`AI_IMAGE_MODEL` seleciona explicitamente a rota de imagens no servidor. `AI_IMAGE_BASE_URL` e `AI_IMAGE_API_KEY` são opcionais e herdam `OMNIROUTE_BASE_URL` e `OMNIROUTE_API_KEY`. O identificador deve ser confirmado no catálogo real e validado por uma geração: a presença no catálogo, isoladamente, não prova compatibilidade. A senha administrativa do gateway não é uma chave de cliente e não deve ser utilizada aqui. As rotas de texto permanecem independentes.

O botão **Personalizar ilustração da capa** aparece nas telas de impressão quando o servidor permite a operação. A estudante gera e confere a prévia antes de imprimir. Essa operação não abre o diálogo de impressão automaticamente e não bloqueia a impressão padrão. O arquivo PNG é incorporado em memória no material atual; não é salvo no histórico, no armazenamento do navegador ou no Firestore. Sair da tela, recarregar ou trocar de conta encerra essa preparação. Mudanças de obra, tópico, recorte, banca ou objetivo impedem reutilizar a ilustração anterior em outro contexto.

Somente metadados limitados do material são enviados; não se envia o conteúdo integral do estudo, respostas da estudante ou apostilas. O servidor constrói o pedido visual. Nenhuma chave do proxy ou token OAuth do provedor chega ao navegador. A resposta aceita somente PNG incorporado, com limites de corpo, arquivo, dimensões e tempo; URLs devolvidas pelo provedor não são buscadas, e SVG ativo é recusado. Não há fallback para conversação nem repetição automática de uma geração cobrada.

As artes novas usam transparência, sem o filtro de papel das pranchas incorporadas e sem legendas fixas sobre posições que o gerador pode mudar. Títulos, banca, objetivo e moldura continuam nativos. A ilustração é decorativa e exige conferência humana; não é um diagrama didático validado. Se o provedor falhar, a capa incorporada continua disponível.

O endpoint real foi validado com uma geração direta e uma chamada pelo novo serviço do aplicativo. A configuração da rota de imagens foi preparada no Cloud Run, preservando as referências de segredos e os modelos de texto. A interface nova depende da implantação do código desta PR; configurar a variável sozinha não publica a funcionalidade.

## Paginação e impressão

A primeira página contém a capa. A segunda inicia o sumário com os títulos efetivamente presentes no material e links para as seções. Também reconhece parágrafos inteiramente em negrito. Índices extensos priorizam níveis principais e podem continuar sem cortar entradas. Não se inventam números de página: o navegador determina a paginação final.

O miolo tem fundo branco, títulos discretos e tabelas legíveis. A ilustração não se repete nas páginas de conteúdo. Mantêm-se margens de 16 mm acima/abaixo e 18 mm nas laterais, corpo de 10,5 pt e entrelinha de 1,5. O conteúdo e os diagramas originais são preservados.

A preparação ocorre em uma cópia temporária. Os IDs originais e o título da tela são restaurados. `window.print()` permanece síncrono, com fontes e imagens incorporadas e sem chamada de rede no clique. As fontes são pré-carregadas antes da interação; uma fonte serifada local continua disponível como alternativa.

## Conferência reproduzível

Com `PORT=3138 npm run dev` em execução:

```sh
CRIVO_PRINT_OUTPUT=/tmp/crivo-print-cover node scripts/audit-print-watercolor.mjs
CRIVO_PRINT_CONTEXT_OUTPUT=/tmp/crivo-print-contexts node scripts/audit-print-cover-contexts.mjs
CRIVO_PRINT_PAPER_OUTPUT=/tmp/crivo-print-paper node scripts/audit-print-paper.mjs
CRIVO_GENERATED_ART_FILE=/caminho/ilustracao.png node scripts/audit-print-generated.mjs
```

A primeira auditoria gera PDFs A4 em larguras 390/1366 e temas claro/escuro, com gráficos de fundo desativados. Confere capa na primeira página, sumário na segunda, quatro páginas de conteúdo, fontes incorporadas, ilustração restrita à capa, links, última seção, limites do texto e limpeza após `afterprint`.

A segunda verifica nove contextos: Sangue e Imunologia, Química, Matemática, Geografia, História, Física, obra completa, quatro tópicos combinados e material sem banca. Confere os metadados extraídos do PDF, a prancha escolhida, espaço disponível para a ilustração e a posição da cartela. Os exemplos são sintéticos e não constituem material de estudo.

Os testes verificam metadados escapados, IDs, sumário, temas, contrato visual e contexto denso. A validação automatizada usa Chromium; o diálogo nativo de impressão e Safari/iPad não foram automatizados. Impressão física sem bordas depende do equipamento.

A auditoria de imagem gerada usa um PNG fornecido explicitamente, imprime três páginas, confere texto selecionável, ausência de legendas incompatíveis, proporção preservada e limpeza após impressão. Não chama o gateway nem usa credenciais por conta própria. Os exemplos de conferência são sintéticos. Safari/iPad e o diálogo nativo da impressora continuam fora da automação.

## Evidência desta correção

- `capa-literatura-integrada.png`: página rasterizada do PDF, com a prancha incorporada e o papel corrigido.
- `capa-personalizada.png`: página rasterizada com o PNG produzido pelo serviço real de imagens; sem legendas fixas sobre a arte.
- `papel-verificacao.json`: oito áreas conferidas, diferença máxima de um nível RGB nas regiões vazias amostradas.
- `geracao-verificacao.json`: três páginas, texto nativo, proporção preservada e limpeza da preparação.

As auditorias de PDF requerem Chromium, ferramentas Poppler e Python com Pillow. A conexão de atualização automática do servidor de desenvolvimento é bloqueada apenas nas páginas sintéticas de auditoria, evitando que uma gravação de arquivo durante a verificação destrua a preparação da impressão.
