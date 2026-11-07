# Tipografia do livreto

O miolo agora é composto no tamanho final da dobra: 148,5 × 210 mm, fonte de 11 pt e entrelinha 1,3, com margens de 10 mm. Tabelas e índice usam 10,5 pt. O conteúdo pode ocupar mais páginas; não se altera o texto para compensar a fonte maior.

Antes, o livreto incorporava as páginas A4 do PDF comum em cada metade da folha A4 paisagem. O texto de 10,5 pt terminava com aproximadamente 7,1 pt no papel. Aumentar somente a escala da página cortaria conteúdo. A correção recompõe o mesmo material em A5 e incorpora essas páginas sem uma segunda redução.

## Fluxo

`DeepeningPdf` fornece uma função sob demanda para gerar a versão A5 a partir do conteúdo original. Ela também funciona ao abrir um PDF comum já salvo. A chamada de renderização do miolo não envia `documentId`: o arquivo A4 salvo não é sobrescrito, e o texto não passa por nova geração de IA. O miolo A5 e a arte pronta são reaproveitados numa nova tentativa da mesma geração.

`createBookletSourceRoot` retira o modo compacto A4, reúne índice e texto na tabela do miolo e reserva a primeira página para a capa. O índice do livreto usa `page: auto`, sem a página nomeada com margens próprias que provocava redução automática ao ser aninhada na tabela. As capas integradas continuam sendo desenhadas na imposição.

`bookletPrintLayout` define as dimensões, tipografia e margens da versão A5. O renderizador usa os 190 mm úteis para decidir quais figuras, tabelas e etapas podem permanecer juntas. `createBookletPdf` preserva a escala das páginas que já estão em A5, usando as margens da própria diagramação.

## Conferência

Uma amostra do gerador real, renderizada em Chromium e depois imposta como livreto, passou de 7,1289 pt para 11,9996 pt físicos. Todos os 28 parágrafos e o último trecho foram preservados. A amostra passou de uma para duas folhas A4.

O teste de imposição mede a fonte final com o leitor de PDF; sem a correção, um miolo A5 de 12 pt ainda caía para 11,5154 pt por causa das margens adicionais. Os testes de interface verificam a repaginação sob demanda, nova tentativa sem repetição do trabalho, conteúdo completo e ausência de sobrescrita do PDF comum salvo.

Validação da implementação inicial: lint e build aprovados; 1.364 testes de servidor/bibliotecas aprovados (um ignorado); 3.434 testes de interface aprovados em 271 arquivos. A conferência do PDF também comparou os 28 parágrafos completos, palavra por palavra, no miolo A5.

## Compactação do livreto

Após conferir a versão real, a preferência foi corrigida para letra menor e menos folhas. O padrão passa de 12 para 11 pt; entrelinha de 1,5 para 1,3; margens de 12 para 10 mm. Intervalos de parágrafos, títulos, listas, seções e células também diminuem. O conteúdo completo e as capas integradas são preservados; não há escala adicional na imposição. O PDF comum e a guia de leitura mantêm sua diagramação.

Conferência do ajuste compacto com o renderizador real: 10,9946 pt físicos no corpo. Na amostra de 84 parágrafos completos, o livreto passou de quatro para três folhas A4, sem perda de palavras. A economia varia com o conteúdo e com o preenchimento necessário para a dobra.


## Sumário econômico

O sumário passa a compartilhar a página com o início do conteúdo. O título usa 16 pt; entradas e números mantêm 10,5 pt, com entrelinha 1,15, recuos e intervalos menores. A frase de apresentação fica oculta apenas no livreto. O PDF comum mantém seu sumário próprio.

Fichas individuais marcadas como `data-study-source` deixam de gerar entradas no índice do livreto. A seção de fontes continua no índice e todas as fichas, textos e links permanecem no corpo. Seções e subseções de estudo, exercícios e gabaritos continuam acessíveis.

Conferência com o renderizador e a imposição reais, em três amostras genéricas: o texto manteve 10,9946 pt físicos; os parágrafos completos e 18 referências de cada amostra foram preservados. Com 24 seções, o início do corpo passou da página 4 para a 2 e o livreto de três para duas folhas. Com 70 seções, passou de cinco para quatro folhas, conservando todas as seções. Os 103 números de página dessas amostras conferem com os destinos reais dos links. A economia depende do conteúdo e dos brancos necessários para a dobra.
