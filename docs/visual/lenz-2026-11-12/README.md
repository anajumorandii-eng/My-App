# Cena imersiva da Lei de Lenz — conferência de 12/11/2026

Segunda cena imersiva do Visual, para o capítulo
`summary-fisica-inducao-eletromagnetica-lei-de-lenz`. Segue a linguagem da PCR
(`../CENA-IMERSIVA-PCR.md`): cena única em Canvas 2D, cinco etapas, previsão
antes de avançar, duas tintas, pausa e movimento reduzido.

## O que a cena mostra

| Etapa | Leitura | O que acontece |
| --- | --- | --- |
| 01 Campo | Φ | Ímã longe; linhas de campo saem do norte |
| 02 Fluxo | Φ ↑ | Ímã se aproxima; mais linhas atravessam a espira |
| 03 Reação | i ↺ | Corrente anti-horária (vista do ímã); face N repele |
| 04 Afastar | i ↻ | Ímã recua; corrente inverte; face S atrai |
| 05 Comparar | i ≠ 0 / i = 0 | Ímã em vaivém contra ímã parado bem perto |

O sinal da corrente não é coreografia: sai de `lenzPhysics.ts` (fluxo em função
da posição, corrente proporcional a −dΦ/dt), coberto por `lenzPhysics.test.ts`.
Parado, a corrente é zero em qualquer distância — a pegadinha que a etapa 5
existe para desfazer.

## Método

`scripts/verify-lenz-immersion.mjs`, contra o build de produção, no Chromium:
celular 390×844, iPad 834×1112 e desktop 1440×900, cada um em tema claro,
escuro e com `prefers-reduced-motion`. Resultado bruto em
`browser-results.json`.

Em cada combinação o roteiro percorre as cinco etapas e confere: a leitura de
cada uma; sobreposição entre ferramentas, etiqueta, título, leitura, texto e
previsão; o cenário "Ímã parado"; o retorno da previsão; que pausar mantém o
quadro; o foco de teclado; erros de console e de rede; estouro horizontal.

## Resultado

Nove combinações, todas com as cinco leituras corretas, estouro 0, ferramentas
de 44×44, foco `solid 2px`, quadro mantido na pausa e nenhuma sobreposição.

## Defeitos achados na captura e corrigidos

- Título de duas linhas encostava na leitura no desktop: a leitura desce para
  296 px a partir de 1024 px (vale também para a PCR, reconferida com
  `verify-pcr-immersion.mjs`) e o título da etapa 5 ficou mais curto.
- No celular a etiqueta do ponto de exploração caía sobre a leitura: piso de
  224 px e limite lateral em `placeHotspot`.
- Cena pequena demais e corrente apagada no início do laço: escala maior, piso
  de opacidade e relógio próprio por etapa.
- Rótulo desenhado no canvas saía cortado na borda: limite em `write`.

## O que não foi conferido

- Safari em iPad de verdade (só Chromium emulado).
- Fundos "aurora" e "grade"; apenas caderno e escuro.
- O texto de Física não passou por revisão de especialista.

## Parte comum

`src/views/visual-immersive/immersiveStage.tsx` reúne o que as duas cenas
compartilham (estado, canvas, câmera, laço, casca). A PCR ainda não foi migrada
para ele, de propósito: mexer na cena aprovada no mesmo PR misturaria duas
conferências.
