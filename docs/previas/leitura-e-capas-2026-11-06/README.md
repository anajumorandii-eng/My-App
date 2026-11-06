# Leitura ilustrada e capas integradas

As duas propostas foram aprovadas pela estudante em 06/11/2026. A implementação está na PR 425. Este diretório preserva as referências e as prévias utilizadas na aprovação.

## Leitura aplicada

O leitor dos materiais e o guia completo usam a identidade editorial aprovada: papel marfim contínuo, verde e vinho, aquarela decorativa, títulos Cormorant, destaques suaves e navegação por seções. O botão de entrada passa a se chamar Leitura Crivo. Somente texto remove a coluna de navegação e expande a área de leitura. O menu Aa permite alterar fonte e fundo (marfim, sálvia ou noturno). As preferências são compartilhadas pelas duas telas e usam uma chave própria, sem alterar progresso ou respostas.

A leitura preserva o conteúdo, fórmulas, figuras e os critérios de resposta recolhidos. Os cabeçalhos bibliográficos repetidos são retirados somente da cópia; versão, recortes e conteúdo do estudo permanecem disponíveis. O guia completo mantém seus 705 blocos de conteúdo. As artes decorativas ficam fora da impressão. Mesmo com tema noturno, a impressão usa texto escuro em papel branco.

As artes de interface estão em `public/reading/`. Uma ilustração válida já preparada para o material tem prioridade. A vinheta de Literatura segue a proposta aprovada; o guia e os demais materiais têm uma vinheta neutra de leitura, sem ilustrar um assunto diferente. Elas não substituem diagramas de estudo nem são usadas nas capas dos PDFs.

O protótipo original continua em [leitura.html](leitura.html), junto de `literatura-aquarela.png`. Ver [com núcleos](leitura-com-nucleos.png) e [em largura inteira](leitura-largura-inteira.png). O texto de Literatura do protótipo é demonstrativo; o leitor aplicado recebe o conteúdo real do material selecionado.

## Capas aprovadas

A referência é [referencia-capas-aprovada.png](referencia-capas-aprovada.png): duas composições verticais, paisagem mais alta à esquerda, globo com suporte de latão à direita, espaço para os títulos e ligação delicada pelas nuvens. A tentativa de uma faixa horizontal foi rejeitada e não deve ser retomada. Ver o [exemplo recomposto](capas-exemplo-composto.png) e a [camada transparente](capas-camada-transparente.png).

A PR 424 gerava a contracapa separadamente e resultou em artes isoladas. Agora `side: spread` pede a camada conjunta, com as regiões verticais e os espaços transparentes planejados antes da tipografia. O compositor usa um único sistema de coordenadas na face externa, com papel marfim, molduras e texto nativo. Mantém o PDF comum e o miolo. Os motivos devem seguir o assunto e o subtópico; as imagens deste diretório não são capas fixas de todas as matérias.

Cormorant e Playfair TTF foram derivadas dos WOFF já licenciados no projeto; as licenças OFL estão em `src/assets/print/fonts/`. A incorporação integral evita a perda de contornos observada ao reduzir glifos das fontes. Conferir a imagem renderizada, além do texto extraído.

## Verificação

O checkpoint anterior passou em lint, build, 1.363 testes de servidor/bibliotecas (um ignorado) e 3.429 testes de interface. A implementação aprovada passa novamente pelas verificações antes do envio.

A conferência em navegador real cobre leitor e guia, largura de 864 para 1.152 px ao ocultar a navegação, fundo contínuo sem os painéis brancos de origem, temas compartilhados, tamanho da fonte, Escape em duas etapas, retorno de foco, navegação, botão de voltar no celular e ausência de rolagem horizontal em iPad e celular. A comparação do guia confirmou seus 705 blocos sem alteração de conteúdo.

Os testes do PDF conferem imagem única na dobra, transparência, fontes incorporadas, texto nativo, ordem das folhas e preservação do original. O exemplo privado de Climatologia preservou as dez faces e o texto das nove faces internas. PDFs enviados e texto extraído permanecem fora do repositório público; somente a face externa genérica foi salva para revisão.

### Resultado da implementação aprovada

Lint e build concluíram com sucesso. A suíte de servidor/bibliotecas aprovou 1.363 testes, com um ignorado. A suíte completa de interface aprovou 3.432 testes em 271 arquivos (`npm run test:vitest -- --maxWorkers=4`). Os testes específicos de aparência, navegação e retorno de foco também passaram.

A conferência final no Chromium verificou leitor React e guia completo, preferências compartilhadas, fonte, temas, expansão real, retorno de foco, botão de voltar no celular e impressão em papel branco a partir do tema noturno. O PDF impresso manteve o conteúdo e os critérios de resposta fechados. Ver [leitura aplicada](leitura-aplicada.png) e [guia completo aplicado](guia-completo-aplicado.png).
