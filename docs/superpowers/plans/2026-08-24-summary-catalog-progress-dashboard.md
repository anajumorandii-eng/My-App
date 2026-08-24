# Summary Catalog and Progress Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expandir o catálogo com fontes internas rastreáveis e oferecer a Ana Júlia um painel acionável calculado somente de seu progresso real.

**Architecture:** Um inventário tipado valida a proveniência do catálogo. Um agregador puro converte `SummaryProgressMap` em uma projeção de painel, e componentes React apenas filtram e navegam essa projeção.

**Tech Stack:** React 19, TypeScript, Vitest, Testing Library, React Router, Firestore/localStorage existentes.

**Spec:** `docs/superpowers/specs/2026-08-24-summary-catalog-progress-dashboard-design.md`

## Global Constraints

- Não alterar `vite.config.ts`.
- Não criar conteúdo ou métricas demonstrativas.
- Preservar IDs e compatibilidade dos três resumos existentes.
- Usar apenas fontes internas reais e manter avisos de incerteza.
- Um único commit da Fase 2 e nenhum merge automático.

---

### Task 1: Inventário e integridade do catálogo

**Files:**
- Create: `src/data/summaryMaterials.ts`
- Create: `src/lib/summaryCatalog.test.ts`
- Create: `src/lib/summaryCatalog.ts`
- Modify: `src/types/summary.ts`

**Interfaces:**
- Produces: `summaryMaterials`, `validateSummaryCatalog(summaries, materials)`.

- [ ] Escrever testes que falham para fontes desconhecidas, IDs duplicados, perguntas sem seção e preservação dos três IDs legados.
- [ ] Executar `npm run test:node -- src/lib/summaryCatalog.test.ts` e registrar o vermelho esperado.
- [ ] Implementar tipos, inventário e validação mínimos.
- [ ] Reexecutar o teste até ficar verde e remover duplicação mantendo-o verde.

### Task 2: Novos resumos baseados em fontes internas

**Files:**
- Create: `src/data/expandedInteractiveSummaries.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Test: `src/lib/summaryCatalog.test.ts`

**Interfaces:**
- Consumes: `summaryMaterials`, `InteractiveSummary`.
- Produces: catálogo com Química, Matemática e Geografia, mantendo os três itens originais no início.

- [ ] Adicionar testes que falham para quantidade, disciplinas, IDs estáveis e vínculos materiais resolvíveis.
- [ ] Executar o teste e confirmar que falha por ausência dos novos resumos.
- [ ] Adicionar os três resumos mínimos com progressão pedagógica, recuperação ativa e estratégias por banca extraídas das fontes.
- [ ] Reexecutar e refatorar o arquivo de dados mantendo tudo verde.

### Task 3: Agregador do Painel de Evolução

**Files:**
- Create: `src/lib/summaryProgressDashboard.test.ts`
- Create: `src/lib/summaryProgressDashboard.ts`

**Interfaces:**
- Produces: `buildSummaryProgressDashboard({ summaries, progress, now })` e `filterDashboardRows(model, filters)`.

- [ ] Escrever testes separados para disciplina, banca, fase, dificuldade, reincidência, revisões, dados antigos, removidos e ausência de dados.
- [ ] Executar o arquivo e registrar falhas por API inexistente.
- [ ] Implementar a projeção mínima, usando `null` quando não houver denominador real.
- [ ] Reexecutar; extrair helpers somente depois do verde.

### Task 4: Interface acionável e acessível

**Files:**
- Create: `src/components/SummaryProgressDashboard.tsx`
- Create: `src/components/SummaryProgressDashboard.ui.test.tsx`
- Modify: `src/views/Evolucao.tsx`

**Interfaces:**
- Consumes: `useSummaryProgress`, `buildSummaryProgressDashboard`, `interactiveSummaries`.
- Produces: painel com estados e links profundos dentro de Evolução.

- [ ] Escrever testes de interface para loading, erro, primeiro acesso, dados parciais, filtros, referência removida, links e teclado.
- [ ] Executar Vitest e registrar o vermelho por componente inexistente.
- [ ] Implementar o componente e integrá-lo à tela com HTML semântico e foco visível.
- [ ] Reexecutar, refatorar subcomponentes após verde e confirmar responsividade estrutural por classes.

### Task 5: Validação e publicação

**Files:** todos os arquivos da Fase 2, revisados explicitamente.

- [ ] Executar `npm test`, `npm run lint`, `npm run build` e `git diff --check`.
- [ ] Confirmar que `vite.config.ts` não aparece no diff e revisar conteúdo/proveniência.
- [ ] Criar `feat: expand summary catalog and add progress dashboard`.
- [ ] Fazer `git fetch`, verificar divergência e push normal.
- [ ] Abrir PR contra `main`, registrar CI e não fazer merge.
