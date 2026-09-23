# Revisão visual por necessidade — História e Geografia

Data: 2026-09-23. O inventário técnico cobre 613 capítulos, mas a presença de um artefato não demonstra que a prancha ajude o estudante. História tem 49 capítulos (32 cenas, 15 instrumentos, uma prancha e um experimento); Geografia tem 63 (26 cenas, 36 instrumentos e um experimento). Nenhum dos 112 tinha revisão editorial aprovada quando esta rodada começou.

## Primeiro lote corrigido

| Capítulo | Problema observado no artefato anterior | Nova representação | Estado |
| --- | --- | --- | --- |
| Revolução Francesa | A cadeia de caixas escondia a cronologia e não distinguia o conflito fiscal inicial das pressões da radicalização. | Linha de 1789 a 1794, com acontecimentos datados e indicação separada de guerra externa e desconfiança interna. | em validação |
| Revolução Industrial | A cadeia genérica não mostrava o campo cercado, a fábrica e o papel da investigação e da pressão social na reforma. | Campo, fábrica e documento legal; a legenda explicita que as leis levaram décadas. | em validação |
| Projeções cartográficas | Cartões de texto não mostravam a escolha entre forma, área e distância. | Três esquemas comparáveis, rotulados como propriedades e não como mapas mensuráveis. | em validação |
| Dinâmica Climática | Cartões de texto não mostravam o que faz o ar subir em cada tipo de chuva. | Três seções: aquecimento, barreira de relevo e encontro de massas de ar. | em validação |

Os recortes, afirmações e citações dos quatro capítulos continuam ligados às entradas de `SceneEntry` e ao conteúdo do resumo; a nova arte não cria uma fonte pedagógica paralela. Seleção atualiza o diagnóstico e o trecho de lastro. As pranchas não foram marcadas como aprovadas por testes automáticos.

`node scripts/auditHistoryGeographyVisual.mjs` passou em **40/40 casos**: quatro capítulos × cinco larguras × dois temas, sempre com movimento reduzido. Não detectou overflow horizontal da página, erro de console, resposta local HTTP 4xx/5xx nem falha de seleção ou pan pelo teclado. O axe-core passou em **8/8 varreduras** a 375 px, sem violações WCAG A/AA automáticas. As capturas e dados brutos estão em `screenshots/historia-geografia-2026-09-23/`. TypeScript, build, testes direcionados e o inventário de qualidade passaram. O `npm test` local segue bloqueado pelos mesmos 14 PDFs licenciados ausentes no checkout; a suíte Vitest ampla com um worker foi interrompida após vários minutos sem resultado, e a CI remota deve fornecer a verificação completa.

## Critério para os próximos lotes

1. Abrir a representação que vence no roteamento real, no celular e no desktop. Instrumentos que vencem uma cena devem ser avaliados pelo que o aluno vê, não pela cena oculta.
2. Identificar a relação central que a visualização deve ensinar: território, temporalidade, causalidade, escala, fluxo ou comparação. Se o artefato atual só repete texto ou uma estrutura genérica, registrar a deficiência.
3. Atacar primeiro o defeito com maior custo pedagógico confirmado por inspeção. História e Geografia recebem a primeira passagem completa porque a responsável apontou ambas como especialmente ruins; as outras matérias entram pela mesma régua.
4. Guardar capturas e testar 360, 375, 390, 768 e 1440 px, temas, teclado, movimento reduzido, console, rede e acessibilidade. Revisão editorial continua uma decisão separada.

O restante do inventário não é rotulado `insuficiente` sem inspeção. Esta fila documenta o método para avançar pelos 613 capítulos sem transformar cobertura formal em aprovação visual.
