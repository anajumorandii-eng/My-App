# Validação do lote de Ecologia

Data: 2026-09-23. Este lote adiciona seis diagramas específicos por ID de capítulo. A matriz continua com 613 linhas e a prioridade de experimento, prancha, instrumento e cena permanece inalterada. O relatório `27-qualidade-visual.json` registra estes seis capítulos como `em-validacao`; os outros 607 seguem `nao-revisado`. Nenhum capítulo foi marcado `aprovado` sem inspeção visual.

| Capítulo | Artefato | Mecanismo | Estado |
| --- | --- | --- | --- |
| `bio-ecologia-ciclo-nitrogenio` | `nitrogenio-solo-atmosfera` | Conversões microbianas entre atmosfera, solo e raízes | em validação |
| `bio-ecologia-eutrofizacao` | `eutrofizacao-lago` | Floração, bloqueio da luz, decomposição e anoxia no lago | em validação |
| `bio-ecologia-dinamica-populacoes` | `estrategias-reprodutivas` | Descendência e cuidado parental em dois perfis | em validação |
| `bio-ecologia-invasoras-controle-biologico` | `invasao-impactos` | Cinco vias de impacto da invasora | em validação |
| `bio-ecologia-sucessao` | `sucessao-comunidades` | Mudança de solo e vegetação em três comunidades | em validação |
| `bio-ecologia-ciclo-hidrologico-poluicao-agua` | `poluicao-agua-agentes` | Fonte, meio aquático e efeito por agente | em validação |

## Verificações executadas

- Testes específicos das duas famílias, roteamento, matriz e inventário: passaram (29 testes). Cada seleção foi exercitada por botão ou teclado, com `aria-pressed`, texto de resultado, citação e nome acessível da etapa.
- `npm run visual:matrix` e `npm run visual:quality`: passaram; relatórios regenerados.
- `npm run lint`, `npm run build` e `git diff --check`: passaram.
- `npm run test:vitest`: 98 arquivos e 523 testes passaram; um arquivo não iniciou porque `public/flashcards/biologia.json` não está materializado neste checkout sparse.
- `npm test`: parou na suíte Node por arquivos excluídos do checkout sparse, inclusive `public/questions.json` e apostilas em `materiais brutos/`. Esta execução não demonstra falha nas cenas novas nem uma suíte geral aprovada.

## Revisão visual e acessibilidade em 2026-09-23

O navegador local detectou três sobreposições que os testes de componente não capturavam: uma legenda saía do cartão de populações, a copa das árvores cobria o título da sucessão e a legenda das invasoras cruzava o último ramo. Também havia redução excessiva dos SVGs no celular e uma seta de amonificação com direção ambígua. Esses defeitos foram corrigidos. Em telas estreitas, a figura de 620 px permanece legível e rola dentro da própria moldura; a página não precisa rolar horizontalmente. A instrução de pan e o foco visível tornam esse comportamento descobrível, mas a relação completa exige deslocamento no celular.

`node scripts/auditEcologyVisual.mjs` exercitou **60 casos**: seis capítulos × larguras de 360, 375, 390, 768 e 1440 px × temas claro e escuro, sempre com `prefers-reduced-motion: reduce`. Todos passaram sem overflow horizontal da página, erro de console, resposta local HTTP 4xx/5xx ou falha da primeira e última seleção. O foco na figura e a seta para a direita moveram a área interna quando havia conteúdo oculto. As 60 capturas e os dados brutos estão em `screenshots/ecologia-2026-09-23/`; seus caminhos foram registrados em `visualQualityReviews.ts` e regenerados em `27-qualidade-visual.json`. `node scripts/auditEcologyAccessibility.mjs` executou axe-core nas seis cenas em ambos os temas a 375 px: **12 verificações, zero violações WCAG A/AA detectadas**. Isso não substitui a revisão humana de leitura e foco.

O checkout local materializou `public/questions.json` e `public/flashcards/biologia.json`, mas `npm test` ainda falhou no teste do catálogo por 14 PDFs de apostilas ausentes em `materiais brutos/`. Após as correções desta rodada, `npm run lint`, `npm run build`, `git diff --check` e os **17 testes direcionados** passaram localmente. A execução ampla do Vitest com um worker avançou por vários minutos e foi interrompida sem resultado final. Na revisão publicada `02373ae`, os dois workflows remotos terminaram verdes: [CI com `npm test` e build](https://github.com/anajumorandii-eng/My-App/actions/runs/35901724376) e [verificação com Vitest, matriz e build](https://github.com/anajumorandii-eng/My-App/actions/runs/35901724406). Os PDFs ausentes são uma limitação do checkout local, não um bloqueio da CI.

Os seis capítulos permanecem `em-validacao`. A inspeção técnica e as capturas estão documentadas; falta a revisão editorial da composição contra as cinco referências aprovadas e a decisão sobre o nível de detalhe pedagógico de cada prancha. O inventário não equipara ausência de erro técnico a qualidade visual aprovada.

A revisão completa dos outros 607 capítulos permanece fora deste lote. O inventário fornece a base para priorizar os próximos lotes por matéria e mecanismo, sem equiparar cobertura a qualidade.
