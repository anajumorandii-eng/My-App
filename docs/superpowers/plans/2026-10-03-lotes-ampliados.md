# Lotes ampliados do Crivo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. O método já autorizado é avançar autonomamente, com frentes independentes em paralelo quando não disputarem arquivos. Não pedir confirmação repetida do plano.

**Goal:** Executar a fila reconciliada por famílias, com entregas de dezenas de capítulos e conteúdo/visual juntos nas matérias ainda não aprofundadas.

**Architecture:** Manter os adaptadores de instrumento, `BoardShell`, `boardPair` e diagnóstico atuais. Responsáveis alteram cenas/labs de sua família; um integrador concentra os dados, registros e estilos compartilhados. PRs concorrentes usam worktrees distintos; a matriz de capítulos pertence a cada lote, não a uma auditoria nova de todo o catálogo.

**Tech Stack:** React 19, TypeScript, SVG, Vite, node:test, Vitest e Playwright/Chromium instalado.

**Spec:** `docs/PLANO-GERAL-CRIVO-2026-10-03.md`; IDs/achados em `docs/FILA-VISUAL-2026-10-03.json` e contrato `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`.

## Global Constraints

- Base reconciliada: `42589657df0d802c60e19c38383682a6e49573f9`. Conferir delta de main e PRs antes de cada entrega.
- Preservar IDs dos capítulos, progresso, tentativas, isolamento por UID e chaves de persistência. Em texto reescrito, usar a revisão editorial prevista e alterar apenas os IDs de seção do próprio capítulo.
- Texto autoral em português; exemplos de Inglês adequados ao tema e operação linguística. Nenhum material licenciado/privado ou identificador de modelo nos artefatos.
- Composição papel/lousa e referências aprovadas; mecanismo específico e estado estático completo. Nenhuma promoção automática de aprovação editorial.
- Antes de cada push: `npm run lint` e `npm test` verdes. Build/navegador para mudanças visuais; compilador e navegador separados no ambiente atual.
- Publicar branch e abrir PR automaticamente. Não fazer merge automático.

## Review Focus

- Corrente zero, força zero e limites dos controles: retirar vetores inexistentes e manter leituras/scene coerentes.
- Grandezas ou perspectiva diferentes: declarar escalas, sinais e hipóteses; medir a geometria efetiva, não apenas texto/atributos de intenção.
- Texto longo/celular/tema escuro: conter a página, manter rolagem interna indicada quando necessária e medir rótulos vizinhos.
- Capítulos da mesma família: usar exemplos próprios e representar todas as operações centrais previstas no conteúdo; nenhuma troca só de ícone/título.
- Texto atualizado/conta existente: revisão isolada por capítulo, recuperação coerente e nenhuma limpeza/migração remota implícita.

---

## Task 1: Entrega A — F1 + M1 + HG1, 25 capítulos

**Files:** fontes de cada ID listadas em `FILA-VISUAL-2026-10-03.json`, filtradas por `batch` F1/M1/HG1. Arquivos principais:

- F1/circuitos: `src/views/visual-instruments/ElectricInstrument.tsx`, `src/lib/electricLab.ts`, respectivos testes.
- F1/eletrostática: `ElectrostaticsInstrument.tsx`, `src/lib/electrostaticsLab.ts`, respectivos testes; eletrização no renderer `topic-scenes/families/FisicaMecanismos.tsx/.css` (os dados já descreviam os mecanismos corretamente).
- F1/magnetismo e curvas: `MagnetismInstrument.tsx`, `PhysicsRemainingInstrument.tsx`, labs/testes correspondentes. Nenhuma alteração nos modos corrigidos de Lenz/luneta.
- M1: `MatrixInstrument.tsx`, `CartesianInstrument.tsx`, testes de instrumentos.
- HG1: `IndependenceBoard.css`, `EngenhoScene.tsx/.css`, `MiningColonyScene.tsx/.css`; título em `src/data/expandedInteractiveSummaries.ts` pelo integrador.
- Test: `tests/e2e/visual-entrega-a.spec.ts` (novo), consumindo a lista dos 25 IDs.

**Interfaces:** consumir `BoardProps` e os adaptadores/labs existentes sem mudar o contrato de `BoardShell`. Produzir cenas para os mesmos IDs/controles; novos helpers físicos devem ficar ao lado do lab da família. Mudanças nos arquivos centrais são deltas entregues ao integrador.

- [x] **Step 1: Conferir os 25 IDs e os achados no delta atual de main.** Usar os três filtros de lote; nenhum dos nove casos de Física já tratados pode reaparecer como tarefa deste grupo.
- [x] **Step 2: Registrar os estados e regressões do mecanismo antes de editar.** Circuitos: ΔQ=0/8/16 C em 2 s → i=0/4/8 A; i=0/3/8 A sob 12 V → P=0/36/96 W; R=1/4/12 Ω → i=12/3/1 A; nó I=2/7/12 A → saída variável=0/5/10 A; capacitor U=0/6/12 V → Q=0/12/24 μC e energia=0/36/144 μJ. Verificar seção/sentidos de corrente, conversão energética, entrada/saída no nó e sinais/campo entre placas, não só os números. Eletrostática/magnetismo: vetores, cargas, sentidos e ponto de operação conforme cada achado e controle existente.
- [x] **Step 3: Observar as regressões falharem no teste dirigido da própria frente.** Os casos de força/campo zero, sinais opostos, leitura móvel e escala entram nos testes do responsável que altera o desenho.
- [x] **Step 4: Implementar as cenas dos 17 casos F1 em três frentes de arquivos distintos.** Conservar fórmulas/intervalos; distinguir lei dos nós e lei das malhas. Novas escolhas físicas precisam de hipótese explícita e geometria rastreável.
- [x] **Step 5: Corrigir M1.** Soma deve mostrar operador `+`; produto deve desenhar `[5,7]` verticalmente como coluna. Nos dois capítulos afins, separar a anotação de raiz das graduações mantendo o ponto correto no eixo x.
- [x] **Step 6: Corrigir HG1.** Conter a prancha de Independência em 390/834/1366 sem overflow externo, preservando acesso por teclado; recompor rótulos de Engenho/Mineração sem corte; título demográfico deve corresponder ao conteúdo aplicado, com o ID preservado.
- [x] **Step 7: Verificar testes dirigidos e revisar a integração dos 25 IDs.** Não aceitar melhora de uma amostra como prova dos demais; listar quais estados foram efetivamente exercitados.
- [x] **Step 8: Executar validação de lote e publicar PR automática.** Sequência comum abaixo, com cenas estáticas/reduzidas, extremos e controles de teclado. Atualizar a fila somente para achados comprovadamente tratados.

## Task 2: Entrega B — LG2, 29 capítulos e 29 resumos

**Files:** `EnglishInstrument.tsx`, `ReadingInstrument.tsx`, `src/lib/englishInstrumentLab.ts`, `src/lib/readingInstrumentLab.ts`, testes correspondentes; conteúdo em `src/data/deepSummaryContent.json` e deltas de experimento inference/cohesion pelo integrador. Novo `tests/e2e/visual-entrega-b.spec.ts`.

**Interfaces:** preservar `englishInstrument(id: EnglishInstrumentId)` e `readingInstrument(id: ReadingInstrumentId)` com `BoardProps`; produzir configurações/exemplos próprios dos mesmos 29 IDs. Conteúdo continua consumido por `applyDeepSummary(summary: InteractiveSummary): InteractiveSummary`.

- [x] **Step 1: Conferir os 29 IDs LG2 e vincular cada exemplo/estado ao resumo correspondente.** São 17 Inglês e 12 Entendimento, sem IDs de Literatura/Gramática neste grupo.
- [x] **Step 2: Criar regressões que recusem exemplos trocados.** Hurricanes/Stem Cells não podem explicar o capítulo por quake/aftershocks; Global Warming/Probiotics não por poor sleep/memory; Digital Technology não por pathogen; Taxonomy não por ônibus/Maya. Testar também uma decisão pertinente de cada uma das outras configurações.
- [x] **Step 3: Observar as falhas e implementar configuração temática por capítulo.** Manter estratégias linguísticas pertinentes; a evidência deve permitir inferência, referência, comparação e diagnóstico próprios do assunto. Usar exemplos originais; não apresentar uma relação científica não verificada como fato.
- [x] **Step 4: Aprofundar os 29 textos junto à configuração.** Cinco seções, 900–1.100 caracteres como objetivo editorial e mínimo 800 aceito pelo importador, mecanismo explicado, cinco/seis pegadinhas com correção, dois problemas de prática e recall alinhado; usar `scripts/aprofundar-resumo.py` e `rev: 2`. Não alterar capítulos fora do grupo.
- [x] **Step 5: Testar revisão isolada e modos Explorar/Testar/Reconstruir.** Preservar tentativas e chave de armazenamento; IDs editoriais novos somente nos 29 capítulos reescritos. Usar fixtures locais, sem enviar respostas na conta real.
- [x] **Step 6: Validar todos os 29 IDs na matriz do lote, revisar exemplos/textos e publicar PR automática.** A estrutura editorial e o mecanismo de cada família precisam de captura inspecionada; variantes precisam de verificações próprias.

## Task 3: Entrega C — H1, 24 capítulos

**Files:** `src/views/topic-scenes/families/ContrasteDePosicoes.tsx`, testes da família; deltas de `topic-scenes/data/filosofia.ts` e `sociologia.ts` pelo integrador. Textos de Sociologia vinculados a H1 no JSON editorial; novo `tests/e2e/visual-entrega-c.spec.ts`.

**Interfaces:** manter o tipo/configuração de cena já consumido por `topic-scenes/registry`; produzir comparações concretas para os 16 IDs Filosofia e oito Sociologia H1. Não mudar `BoardShell` ou a família de Física acidentalmente.

- [ ] **Step 1: Listar os 24 IDs e a relação específica que cada oposição precisa ensinar.** Dois pilares com rótulos trocados não encerram essa tarefa.
- [ ] **Step 2: Escrever regressões por situação/decisão e observar as falhas.** Cada configuração precisa de exemplo próprio, transformação visível e consequência da escolha; seleção deve manter o outro lado legível.
- [ ] **Step 3: Implementar a composição compartilhada com dados próprios por capítulo.** Nenhuma regra de “mais alto = melhor” se o conteúdo compara posições sem hierarquia.
- [ ] **Step 4: Aprofundar os oito textos de Sociologia H1 e verificar recall/versão isolada.** Os 16 textos filosóficos já têm revisão 2; ajustar apenas se houver falha concreta identificada, sem reescrita automática.
- [ ] **Step 5: Verificar a matriz dos 24 IDs, revisar as relações/contraprovas e publicar PR automática.** Conferir nomes, contraste, seleção e condição estática/reduzida.

## Demais lotes

- [ ] Executar F2 (11) e F3 (10) por modelos físicos, mantendo derivados/fontes/estados definidos antes da edição. Separar cenas físicas dos componentes genéricos compartilhados com Humanas quando necessário.
- [ ] Executar LG1 (26) e LG3 (37), com aprofundamento dos mesmos textos. Gramática preserva transformações pertinentes; Literatura demonstra procedimento/narrador/forma em exemplos autorais.
- [ ] Executar H2 (23) e H3 (15), com os 19 textos restantes de Sociologia vinculados no JSON. Representar retorno causal, critérios, meio-termo contextual e procedimentos próprios de Sócrates/Hegel/Nietzsche.
- [ ] Executar R1 (16), R2 (15) e R3 (27), com seus 58 textos. Um responsável integra os arquivos de Writing; frentes não os editam simultaneamente.
- [ ] Integrar A1/COP30 (1) a uma entrega maior, usando fatos e referências datados; não confundir hipótese com decisão oficial.
- [ ] Executar a frente de contraste/layout/fluxos gerais definida no plano geral, sem somar ocorrências de acessibilidade como capítulos novos.

## Validação e integração comuns

- [ ] Testes dirigidos das frentes e revisão conjunta dos mecanismos/versões.
- [ ] `npm run lint`, depois `npm run build`; confirmar saídas, sem navegador em paralelo ao compilador.
- [ ] Navegador na build de produção: todos os IDs alterados, 390/834/1366 claro/escuro, inicial/extremos/estados decisivos e teclado. Movimento normal e reduzido nos mecanismos afetados. Reutilizar contextos/cache e registrar resultados por ID para retomar interrompidos.
- [ ] Medir geometria/leitura e colisões, além de limites externos. Inspecionar capturas de cada mecanismo e exceção; não certificar por presença de SVG.
- [ ] `npm test` antes de push. TypeScript, build e navegador somente precisam ser repetidos se novas alterações invalidarem seus resultados. Não reduzir cobertura necessária para obter velocidade.
- [ ] Atualizar fila/planilha/continuidade, validar todos os IDs com `node scripts/validar-fila-visual.mjs`, publicar branch, abrir PR e anexar seu URL à tarefa. Conferir CI da ponta exata; nenhum merge automático.
- [ ] Preparar a frente independente seguinte durante o CI em worktree separado; reconciliar main quando houver integração da responsável.
