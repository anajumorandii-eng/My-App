# Topo e leitura da aba Visual

O cabeçalho agora reúne voltar, identidade do capítulo e acesso a domínio na
mesma linha. No iPad e celular, domínio é um botão de 44 px com nome acessível;
no desktop conserva o texto. O nome do tópico não se repete acima de um título
igual. Modos e escolha de vista ficam próximos, sem a linha isolada do antigo
interruptor ou a margem vazia entre os controles e o palco.

A leitura tem um cabeçalho curto e indicador de etapa acessível. O título do
capítulo deixa de aparecer novamente ali; o assunto da etapa permanece no texto.
No iPad e celular, a navegação usa cinco posições compactas com número e estágio.
Os títulos completos continuam disponíveis para leitores de tela, e o assunto
selecionado aparece no corpo da leitura. Continuar nomeia o próximo assunto,
com quebra de linha para títulos longos.

O esquema enxuto de Biotecnologia mantém a única lista de assuntos já existente.
Nenhum conteúdo científico, chave de persistência ou cálculo de evidência foi
alterado.

## Verificação

`scripts/verify-visual-navigation.mjs` confere 360, 390, 834 (claro e escuro) e
1366 px. Valida o acesso a domínio, topo da cena abaixo de 300 px no celular e
iPad, seleção por teclado, modo foco, leitura e retorno à cena. Também responde
um desafio e verifica a conservação da resposta e do feedback ao alternar
Testar e Reconstruir. Medições em `browser-results.json`.

História e Matemática foram conferidas adicionalmente no celular: títulos
longos, leitura até a última etapa, Testar e Reconstruir. Resultados em
`other-chapters.json`.

Capturas principais: [topo no iPad](ipad.png), [leitura no celular](mobile-leitura.png),
[História](historia.png) e [Matemática](matematica.png).

## Checks finais

TypeScript e build passaram. A suíte completa passou: 1.393 testes de servidor,
um ignorado, e 3.482 testes de interface em 277 arquivos. Os 36 testes direcionados
às telas alteradas também passaram. O novo teste de contexto da leitura falhou
antes da implementação e passou depois.

O build mantém o aviso de tamanho dos chunks. A suíte emite avisos de cache de
fontes e `scrollTo` do jsdom sem falhas. As sessões de navegador registradas não
tiveram erros de execução ou respostas HTTP de erro.
