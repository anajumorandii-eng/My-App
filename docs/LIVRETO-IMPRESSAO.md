# Livreto com capa integrada ou separada

A separação acontece na sequência de leitura, antes de impor as páginas. A primeira página do PDF-fonte nativo é uma reserva de capa; todas as seguintes, inclusive o sumário e eventuais páginas originalmente vazias, pertencem ao miolo. Nunca se usa o restante de um PDF já imposto como entrada do miolo.

## Sequência e dobra

`bookletPrintPlan` recebe a quantidade de páginas de leitura do miolo. Adiciona de zero a três páginas em branco somente ao final desse miolo para completar um múltiplo de quatro.

- Capa separada: impõe somente o miolo. O outro PDF contém uma única face A4 em paisagem, com contracapa à esquerda e capa à direita; o verso físico fica inteiramente em branco.
- Capa integrada: antes da imposição, a sequência é capa, verso da capa em branco, miolo completo, preenchimento final do miolo, verso da contracapa em branco e contracapa. A primeira folha contém as duas artes na frente e uma face A4 inteiramente em branco no verso. Nenhuma página de estudo depende dessa folha.

Cada folha do miolo usa a face `[última, primeira]` e o verso `[segunda, penúltima]`, avançando para dentro. As folhas são dobradas e encaixadas, não simplesmente empilhadas como um caderno de folhas dobradas individualmente. Textos, fontes e gráficos permanecem objetos PDF vetoriais; imagens não são rasterizadas ou reamostradas. Páginas já compostas em A5 não recebem redução adicional.

| Páginas A5 do miolo | Brancos finais no miolo | Folhas do miolo | Capa separada | Total de folhas em cada formato |
| --- | --- | --- | --- | --- |
| 1 | 3 | 1 | 1 | 2 |
| 4 | 0 | 1 | 1 | 2 |
| 5 | 3 | 2 | 1 | 3 |
| 8 | 0 | 2 | 1 | 3 |
| 9 | 3 | 3 | 1 | 4 |

As contagens de brancos são de páginas de leitura A5. No formato integrado, acrescentam-se duas páginas A5 para as faces internas da capa. Na capa separada, a interface informa o verso inteiro em branco como uma face A4, equivalente a duas páginas A5. Brancos originalmente presentes no material são preservados em suas posições e não entram na contagem de brancos acrescentados. Na visualização do PDF imposto, um branco final pode aparecer ao lado da primeira página: depois da dobra ele fica ao final da leitura.

O sumário considera a sequência de leitura de cada formato: a renderização da fonte ajusta os destinos reais em +1 na opção integrada e -1 na separada, compensando a reserva de capa da fonte nativa e o verso reservado na montagem final.

## Arte e arquivos salvos

A arte externa é composta uma única vez em A4. Para preparar o outro formato, o app reaproveita a capa salva e renderiza novamente apenas a fonte nativa do miolo com a paginação correspondente. Extrair a primeira face para reutilizar a arte não é usado para extrair ou reorganizar o miolo.

Cada formato fica salvo separadamente na conta. No formato separado, um pacote privado guarda os bytes de Capa, Miolo e um manifesto em uma única gravação atômica; o app oferece somente os dois PDFs para abrir e baixar. Há limite agregado de 25 MB, validação de nomes e tamanhos antes da descompressão, validação dos PDFs e conferência do manifesto com os metadados do miolo. O pacote é publicado com conteúdo `application/zip` em um objeto `.zip`, sem afetar os PDFs comuns ou os livretos integrados.

Livretos anteriores à correção continuam disponíveis, identificados como antigos, sem geração automática. A ação “Corrigir montagem mantendo capa” reaproveita a face externa e reconstrói o miolo a partir do material nativo. “Gerar novo livreto” continua sendo a ação explícita para outra edição. Abrir, baixar ou alternar para um formato já salvo não gera imagens nem PDFs novamente.

## Impressão

- Todos os arquivos: A4 em paisagem, tamanho real/100%, uma página do PDF por face. A imposição já está pronta: não selecionar novamente “Livreto” ou “2 páginas por folha”. Manter a impressão das faces em branco.
- Capa separada: somente na frente; contracapa à esquerda e capa à direita. Deixar o verso em branco.
- Miolo: frente e verso, virada pela borda curta. Preservar a ordem das folhas, dobrar e encaixar dentro da capa externa.
- Capa integrada: imprimir o arquivo completo em frente e verso pela borda curta, incluindo a face interna em branco, depois dobrar e encaixar as folhas.

## Verificação

A simulação independente da dobra percorre 798 combinações: miolos de 1 a 399 páginas nos dois formatos. Confere sequência, posição dos brancos, ausência de perda ou duplicação e reserva da folha da capa. A verificação dos PDFs finais usa 11 contagens por formato, incluindo totais não múltiplos de quatro e uma página originalmente vazia: extrai marcadores de cada metade A4, simula a montagem e confere topo, base e fonte física de 11 pt.

Uma conferência adicional no navegador usou o componente real, o renderizador Chromium e as rotas HTTP, com armazenamento e autenticação de teste e uma arte genérica já aprovada. A amostra tinha seis páginas A5 de miolo: o integrado produziu três folhas; o separado produziu uma folha de capa e duas de miolo, com dois brancos finais. A capa permaneceu idêntica pixel a pixel. Os cinco parágrafos e os cinco encerramentos de capítulo foram preservados na ordem; a fonte física foi medida em 10,995 pt e os gráficos continuaram vetoriais. Os dez destinos do sumário das duas versões foram conferidos contra os números impressos. Reabrir recuperou ambos os formatos sem renderizar ou gerar arte; preparar os dois formatos exigiu duas renderizações nativas e uma única arte reaproveitada.
