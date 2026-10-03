# Física: Lenz, Doppler e luneta — 03/10/2026

Base conferida: `9dbdd3210fb32c7f92ba0713fc0bcf904bb2c8e0`, depois das integrações das PRs #250 (navegação do iPad) e #251 (geração de podcasts e seleção de vozes). As duas foram incorporadas pela responsável; o deploy da main foi confirmado verde. Este lote corrige três mecanismos apontados na revisão integral, sem repetir os lotes anteriores.

## Comportamento e modelos

- **Lenz:** a estudante escolhe aproximar, afastar ou manter o ímã parado. O polo N fica voltado para a bobina, e a normal positiva aponta à direita. Aproximação aumenta o fluxo externo e produz campo induzido à esquerda, polo N frontal e corrente anti-horária vista da posição do ímã. Afastamento inverte esses três sentidos; fluxo constante não produz FEM ou corrente. Dez espiras, variação de fluxo por espira de 0,20 Wb e Δt entre 0,1 e 2 s dão módulo de FEM entre 20 e 1 V. As setas são esquemáticas, explicitamente rotuladas; não medem a intensidade absoluta do campo. Resistência fixa é uma hipótese do modelo.
- **Doppler:** quatro frentes circulares têm centros nas posições anteriores da fonte e raios proporcionais ao tempo desde a emissão. Fonte de 500 Hz, som a 340 m/s, fonte entre 0 e 80 m/s e observador parado à direita. A escala comum é 32 unidades SVG/m: λ à frente = (340 − vₛ)/500; atrás = (340 + vₛ)/500. Em repouso os círculos são concêntricos. A frequência ouvida varia de 500 a aproximadamente 653,8 Hz, em acordo com a compressão das frentes.
- **Luneta de Kepler:** lentes finas paraxiais, objeto no infinito, ocular de 8 mm. A objetiva de 400–1600 mm forma imagem real no foco comum; a ocular produz saída paralela angularmente invertida. Comprimento físico = fₒ + 8 mm; magnificação angular = −fₒ/8. Vista inteira e detalhe ocular têm escalas uniformes em x e y, declaradas separadamente. Contornos das lentes são simbólicos. A cena modela somente a luneta, embora o capítulo também explique microscópios.

A revisão independente confirmou os sentidos de Lenz, a emissão das frentes e as equações das lentes; a legenda das setas de Lenz foi corrigida após essa revisão. Os demais modos dos instrumentos foram preservados.

## Verificação e reprodução

Os testes de regressão cobrem sinais, estados sem corrente, posições reais dos círculos e raios atravessando o foco comum. `tests/e2e/physics-mechanisms.spec.ts` exercita os três capítulos na build de produção em larguras 390, 834 e 1366 px, claro/escuro, movimento reduzido/normal; 36 cenários. São 336 estados de parâmetros: três modos de Lenz em quatro tempos, nove velocidades de Doppler e sete focais da luneta, para cada combinação de largura/tema/movimento. Verifica geometria SVG, rótulos contidos e sem colisão, controles Home/End, ausência de overflow horizontal e de exceções de página.

Usar o Chromium instalado no ambiente e um Playwright config com `baseURL` apontando para `npm run preview`. Não baixar outro navegador. Executar TypeScript, build, navegador e suíte geral em sequência para evitar disputa de memória/CPU. As capturas abaixo são recortes do instrumento, sem login ou dados privados.

Navegador: **36/36 cenários e 336 estados passaram**, incluindo contenção/colisão de textos, ausência de overflow/exceções e teclado. A matriz visual foi regenerada, com 13/13 testes verdes e nenhuma alteração no catálogo ou em aprovações editoriais.

| Cena | Celular claro (390 px) | iPad escuro (834 px) | Desktop escuro (1366 px) |
| --- | --- | --- | --- |
| Lenz, aproximação | [captura](lenz-approach-390-light.png) | [captura](lenz-approach-834-dark.png) | [captura](lenz-approach-1366-dark.png) |
| Doppler, 80 m/s | [captura](doppler-390-light.png) | [captura](doppler-834-dark.png) | [captura](doppler-1366-dark.png) |
| Luneta, 1600 mm | [captura](luneta-390-light.png) | [captura](luneta-834-dark.png) | [captura](luneta-1366-dark.png) |

TypeScript e build de produção aprovados. Suíte geral: **819 testes Node e 898 Vitest passaram (1.717 no total)**, sem falhas. O build preserva o aviso já existente de chunks acima de 500 kB; este lote não altera a estratégia de carregamento.

## Limites e continuação

Este lote não certifica a Física inteira nem a qualidade editorial dos 613 capítulos. Não adiciona microscópio, aberrações, difração ou espessura de lentes; Doppler permanece subsônico e com observador parado. As cenas são estáticas completas e respondem aos controles, inclusive com movimento reduzido. Histórico real, IDs de capítulos, chaves de persistência, conteúdos profundos e aprovações de qualidade não foram alterados.

Depois deste lote, retomar os próximos achados confirmados de Física/Matemática na revisão integral e as associações de conteúdo, confrontando fonte, geometria e tela. Publicar por branch e PR automática; o merge continua a cargo da responsável.
