# Cena da PCR — conferência no navegador (11/11/2026)

Evidência da mudança dos botões de girar e aproximar, de 42 para 44 px, pedida
pela regra de entrega de `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`. A mudança
tinha sido enviada só com lint e testes; a revisão da PR #441 apontou a falta.

## Refeita sobre a `main` atual

A tabela e as capturas abaixo são da segunda rodada, de 12/11/2026, depois de
trazer para a branch as PRs #442, #445 e #446, que mudaram a pausa, o
movimento reduzido, a altura da casca e o topo da página. O resultado foi o
mesmo da primeira rodada. Na mesma ocasião, `scripts/verify-pcr-immersion.mjs`
(o roteiro da PR #442) passou nas quatro larguras com as duas mudanças desta
branch aplicadas.

## Como foi feito

Build de produção (`npm run build` + `npm start`), Chromium, página
`/visual?summary=summary-biologia-biotecnologia`, vista Cena 3D. Nove
combinações: celular (390×844), iPad (834×1112) e desktop (1366×900), cada um
no tema claro, no tema escuro e no claro com movimento reduzido.

Em cada combinação o roteiro:

1. mede os dois botões e confere se estão dentro da cena;
2. clica em girar e em aproximar;
3. percorre as cinco etapas e, em cada uma, compara a caixa dos botões com a do
   título, da leitura, do indicador, da dica de gesto, do ponto de interesse,
   do texto da etapa e da previsão;
4. chega ao botão de girar pelo teclado e lê o contorno de foco;
5. registra erros de console, respostas 4xx/5xx e estouro horizontal.

## Resultado

| Largura | Tema | Movimento | Botões | Colisões | Foco | Console | Rede | Estouro |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | claro | normal | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 390 | claro | reduzido | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 390 | escuro | normal | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 834 | claro | normal | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 834 | claro | reduzido | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 834 | escuro | normal | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 1366 | claro | normal | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 1366 | claro | reduzido | 44×44 | 0 | 2 px | 0 | 0 | 0 |
| 1366 | escuro | normal | 44×44 | 0 | 2 px | 0 | 0 | 0 |

- A tinta acompanhou o tema: caderno no claro, noite no escuro.
- Com movimento reduzido o controle do rodapé abriu marcado e desabilitado
  ("Movimento reduzido").
- Aproximar ficou marcado como pressionado depois do clique.

Os números brutos estão em `medidas.json`.

## Um defeito achado na conferência

Na primeira passada, o celular acusou colisão entre o ponto de interesse e os
botões em uma das etapas. Não vinha da mudança de 42 para 44 px (no celular os
botões já tinham 44 px): a etiqueta reservava 212 px e, com o texto maior da
revisão, a ponta direita dela passava 12 px por baixo do botão de aproximar. A
reserva foi para 236 px e a segunda passada, que é a da tabela, saiu sem colisão.

## Capturas

Etapa 1, depois de girar, aproximar, percorrer as etapas e voltar. O botão de
girar aparece com o contorno de foco porque a captura vem logo após a checagem
de teclado.

| | Claro | Escuro |
| --- | --- | --- |
| Celular | `pcr-celular-claro.png` | `pcr-celular-escuro.png` |
| iPad | `pcr-ipad-claro.png` | `pcr-ipad-escuro.png` |
| Desktop | `pcr-desktop-claro.png` | `pcr-desktop-escuro.png` |

## O que não foi conferido

- Safari no iPad de verdade; o roteiro usa Chromium.
- Os outros dois fundos do aplicativo (aurora e grade).
- No desktop a cena divide a largura com o painel de diagnóstico e fica mais
  estreita que no iPad; a leitura "01" fica logo abaixo do título, sem colidir,
  mas apertada.
