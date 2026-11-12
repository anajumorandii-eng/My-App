# Esquema de Biotecnologia — 11/11/2026

O Esquema repetia a explicação da PCR numa prancha com contador de cópias,
slider, abas internas, zoom, aviso de parâmetro e cartões de texto. A estudante
pediu uma organização mais simples, sem essa repetição.

Em **Explorar → Esquema**, o capítulo passa a apresentar uma lista dos cinco
assuntos reais da leitura, com etapa atual e acesso direto ao trecho escolhido.
As linhas têm número, categoria editorial e título. Não há texto explicativo,
números de amplificação, simulação ou controles de zoom nessa lista.

Selecionar uma linha atualiza a etapa, fecha o modo foco quando necessário e
leva a rolagem e o foco para a leitura correspondente. O indicador acompanha
as mudanças feitas na própria leitura. A navegação repetida acima do texto fica
oculta enquanto o percurso do Esquema está aberto e reaparece na Cena 3D. O atalho de comparar painéis e o bloco
intermediário de desafio ficam fora desta vista, pois não têm função nela.

A alteração é restrita ao Esquema de Biotecnologia em Explorar. A cena imersiva,
os demais capítulos, os modos Testar/Reconstruir, o mapa e a evidência da
estudante permanecem no fluxo existente.

## Conferência da página

Roteiro: `node scripts/verify-biotechnology-outline.mjs` (`CRIVO_URL` opcional).
Confere 360×800, 390×844, 834×1112 em claro e escuro, e 1366×900. Verifica ausência
do laboratório repetido, teclado, seleção da leitura, foco após fechar o painel,
retorno à cena e transição para Testar/Reconstruir. Registra estouro horizontal,
erros de execução e respostas HTTP de erro em
[browser-results.json](browser-results.json).

Capturas: [iPad](ipad.png), [iPad escuro](ipad-escuro.png) e [celular](mobile.png).

## Checks finais

- TypeScript e build passaram.
- Suíte completa: 1.393 testes de servidor passaram, um ignorado;
  277 arquivos e 3.481 testes de interface passaram.
- Execução direcionada: 39 testes de Visual, percurso, artefato e modo foco
  passaram. Os dois novos testes falharam antes da implementação e passaram
  após a troca da vista.
- O roteiro de navegador passou nas cinco configurações, sem estouro horizontal,
  erros de execução ou respostas HTTP de erro.

O build mantém o aviso de tamanho dos chunks; a suíte geral emite avisos de
cache de fontes e `scrollTo` no ambiente de testes, sem falhas.
