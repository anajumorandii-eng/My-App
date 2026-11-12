# Fluxo de estudo de Biotecnologia

Esta revisão resolve três pontos de organização no capítulo de Biotecnologia.

1. A passagem da cena para a leitura tem apenas o próximo assunto e a ação
   **Continuar na leitura**. Saem a pergunta repetida, a referência ao exercício
   e as duas ações concorrentes. O atalho de testar dentro da cena deixa de ser
   montado nessa página; a navegação pelos modos continua disponível.
2. O caminho principal é cena → leitura → Testar. A passagem preserva a etapa
   atual e leva foco e rolagem à leitura. Ao terminar a leitura, a ação leva ao
   teste e foca seu título. Após a correção, revisar é a ação secundária e
   **Reconstruir relações** é a continuação principal.
3. Testar reúne uma instrução, pergunta, campo, pista opcional e correção.
   Reconstruir abre diretamente no exercício, com uma instrução e um conjunto
   de ações. O laboratório repetido foi retirado dessa vista; o mapa permanece
   disponível em **Consultar mapa do capítulo**, recolhido abaixo do exercício.

As mudanças são restritas a Biotecnologia. Os algoritmos de avaliação, o banco de
relações, o arraste, a seleção por teclado/clique, o histórico de desfazer,
reiniciar e as chaves de persistência permanecem no fluxo existente.

## Conferência

`node scripts/verify-biotechnology-study-flow.mjs` (`CRIVO_URL` opcional) confere
834×1112 nas duas tintas do aplicativo, 390×844 e 360×800. Percorre a cena, segue
para a leitura, conclui a última etapa, responde, reconstrói, desfaz, reinicia,
abre o mapa e retorna à leitura/Testar com a resposta e o feedback preservados.
A seleção de uma relação também é feita por teclado. Não houve estouro
horizontal ou erro de execução/rede nas sessões registradas em
[browser-results.json](browser-results.json).

Capturas: [passagem para a leitura](ipad-passagem.png), [Testar](ipad-testar.png),
[Reconstruir](ipad-reconstruir.png), [Testar no celular](mobile-testar.png) e
[Reconstruir no celular](mobile-reconstruir.png).

Os roteiros anteriores de conferência foram ajustados ao novo caminho de estudo.
O componente isolado da PCR continua aceitando a ação de testar; é a página de
Biotecnologia que agora usa a passagem para a leitura.

Checks finais: TypeScript e build passaram. A suíte completa passou com 1.393
testes de servidor, um ignorado, e 3.484 testes de interface em 277 arquivos.
Os 38 testes direcionados também passaram. Os dois testes novos reproduziram
as ausências antes da mudança e passaram com o fluxo implementado.

O build mantém o aviso de tamanho dos chunks; a suíte emite avisos de fontes e
`scrollTo` do jsdom sem falhas. O navegador não registrou erros de execução ou
respostas HTTP de erro nas quatro configurações testadas.
