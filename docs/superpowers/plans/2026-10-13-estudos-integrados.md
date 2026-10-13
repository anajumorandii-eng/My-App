# Estudos integrados Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement task-by-task. Aprovação automática e execução nesta sessão autorizadas pela estudante.

**Goal:** Integrar rotina do cursinho, revisões, estratégias de resolução e preparação até a última prova.
**Architecture:** Extensões compatíveis dos tipos de disponibilidade, modelo de rotina optativo, insights puros e guias em componentes pequenos. Reutilizar geração e conteúdo editorial existentes.
**Tech Stack:** React, TypeScript, Vitest/node:test, Firestore, Vite.
**Spec:** docs/superpowers/specs/2026-10-13-estudos-integrados-design.md

## Global Constraints

- Preservar progresso, agenda existente e chaves de armazenamento.
- America/Sao_Paulo; estudo comum até 20h30, revisão até 21h; sono 22h.
- Não publicar PDF/extratos pessoais; citações com origem e limites.
- Dias oficiais de prova só a partir do calendário de bancas ativas; véspera até 90 min.

## Review Focus

- Agenda antiga continua válida e sem alterações silenciosas.
- Calendar divide revisão curta sem ocupar compromissos.
- Ação longa não elimina espaço para revisão curta que cabe.
- Sem dados suficientes, insights não inventam diagnóstico.
- Falha/seleção durante geração não exibe resposta de outro tópico.

### Task 1: Agenda e alocação
**Files:** features/availability/types.ts, blockScheduler.ts, availabilityEngine.ts, scheduleSafety.ts, scheduleRepository.ts, courseRoutine.ts, AgendaView.tsx; lib/studyActionAllocator.ts; hooks/useDailyPlan.ts; lib/studyRoadmap.ts; views/RetaFinal.tsx.
**Interfaces:** createCourseRoutine(nowIso): WeeklySchedule; applyExamDayLimits(intervals, localDate, goals): StudyInterval[]. ScheduleEntry/StudyInterval ganham purpose opcional, durationMinutes numérico.
- [x] Testar revisão 30 min, finalidade, fragmentos e compatibilidade.
- [x] Implementar rotina optativa e limitação por prova/véspera.
- [x] Testar preview/salvamento e executar suíte de disponibilidade.

### Task 2: Insights e revisitas
**Files:** lib/reviewInsights.ts, components/ReviewInsightCard.tsx, views/Revisoes.tsx.
**Interfaces:** buildReviewInsight(mastery, now): ReviewInsight; buildErrorRevisitPlan(errors, localDate): Revisit[].
- [x] Testar evidência, ausência de dados, D+1/D+3/D+7 e limite de tempo.
- [x] Exibir intervenção, duração, critério e agenda do dia.

### Task 3: Estratégias e material
**Files:** data/studyProtocols.ts, components/StrategyExplorer.tsx, views/Estrategias.tsx, docs/estudos-2026/guia-de-estudo.md, public/study-guide.html.
**Interfaces:** protocolos por matéria, seletor de currículo, geração review-tip com capítulo e contexto editorial validado.
- [x] Desenvolver protocolos próprios para todas as áreas.
- [x] Testar seletor, requisição, erro e troca de contexto.
- [x] Conferir fontes e criar guia para consulta/exportação.

### Task 4: Verificação e entrega
- [x] npm test, npm run lint, npm run build e git diff --check.
- [x] Inspecionar páginas com Playwright instalado.
- [x] Atualizar relatório e plano; commit, push e PR sem merge.
