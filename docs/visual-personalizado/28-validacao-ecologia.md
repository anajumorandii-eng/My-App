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

## Inspeção visual pendente

Em 2026-09-23, a revisão local em navegador real encontrou rótulos ilegíveis porque os SVGs de 620 unidades eram reduzidos à largura do celular. A figura agora mantém 620 px e rola dentro da moldura, com instrução visível e foco de teclado. Nos seis capítulos, em viewport de 463 px, `document.documentElement.scrollWidth` e `clientWidth` ficaram em 463 px; a figura mediu 620 px de conteúdo e 435 px de área visível. A seta para a direita moveu a figura 40 px pelo teclado. O ciclo do nitrogênio também foi corrigido: a amonificação deixou de aparecer sobre a seta de nitrificação. Nitrogênio foi inspecionado em temas claro e escuro; eutrofização e poluição da água tiveram inspeção parcial em tela móvel. Não houve erros de console na tela de poluição.

O checkout integral materializou `public/questions.json` e `public/flashcards/biologia.json`, mas `npm test` ainda falha no teste do catálogo por 14 PDFs de apostilas ausentes em `materiais brutos/`. `npm run lint`, build e os 16 testes direcionados do lote passaram. A execução ampla do Vitest em paralelo apresentou uma falha em `Resumos.ui.test.tsx` e foi interrompida; ela não constitui suíte geral aprovada.

Antes de mudar qualquer capítulo para `aprovado`, conferir os seis capítulos em 360–390 px, tablet e desktop, temas claro e escuro, primeira e última seleções, teclado, movimento reduzido, contraste, console e rede. Salvar capturas com ID, viewport e tema no nome, registrar os caminhos em `visualQualityReviews.ts` e regenerar `27-qualidade-visual.json`.

A revisão completa dos outros 607 capítulos permanece fora deste lote. O inventário fornece a base para priorizar os próximos lotes por matéria e mecanismo, sem equiparar cobertura a qualidade.
