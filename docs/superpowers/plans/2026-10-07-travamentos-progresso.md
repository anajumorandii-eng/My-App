# Correção de travamentos e preservação de progresso

> **For agentic workers:** usar superpowers:executing-plans nesta sessão, com regressões antes de cada correção e revisão independente final.

**Goal:** reduzir carga no iPad e corrigir as falhas reproduzidas na auditoria, preservando conteúdo, aparência essencial e dados de estudo.
**Architecture:** eliminar consultas duplicadas e dependências pesadas desnecessárias; isolar operações por UID; sincronizar mudanças de Resumos em transações com fila local recuperável; tratar falhas no servidor e na leitura literária.
**Tech Stack:** React, TypeScript, Vite, Firestore, Express, Vitest, node:test, Playwright.
**Spec:** pedido de correção de 07/10/2026 e auditoria realizada nesta sessão; a gravação privada não deve ser publicada no repositório.

## Global Constraints

- Base `bef2de0d`; branch `fix/travamentos-progresso-ipad`; não fazer merge automático.
- Não alterar IDs de currículo, chaves legadas, textos editoriais ou status de aprovação.
- Não publicar arquivos da gravação nem dados/credenciais reais.
- `npm run lint`, `npm test` e build devem passar antes do envio.
- Usar `/usr/bin/chromium`; não instalar navegadores.

## Review Focus

- Troca A→B→A e resposta atrasada: não expor/gravar estado de outro UID.
- Duas abas e falha de escrita: não perder capítulos nem operações locais pendentes.
- Google Calendar indisponível: não manter Hoje em carregamento indefinidamente.
- Touch/iPad e retomada: preservar navegação, leitura, contraste e controles das cenas.
- Segredo inválido ou banco indisponível: responder 401/503 sem encerrar o processo.

### Task 1: Carga e retomada

**Files:** `src/features/availability/useDailyStudyAvailability.ts`, seu teste; registros visuais e testes; CSS do ambiente; E2E do Hoje.
**Interfaces:** manter `DailyStudyAvailabilityState`, `InstrumentEntry`, `BoardProps` e os IDs existentes.
- [x] Regressão: cada documento de agenda é consultado uma vez; calendário que não responde termina com aviso e preserva a grade salva sem inventar eventos.
- [x] Demonstrar falha; remover leitura duplicada e limitar espera com cancelamento por sessão.
- [x] Regressão: resolver metadados do Visual não carrega implementações de todos os instrumentos; renderizar o instrumento escolhido mantém seu contrato.
- [x] Demonstrar falha; carregar implementações somente quando usadas, com Suspense e teste real de conteúdo.
- [x] Verificar touch: papel sem filtro procedural/blur de cartões durante rolagem, preservando rabiscos e controles; atualizar contratos E2E obsoletos.
- [x] Comparar build e navegação em 390/834/1180/1366 px.

### Task 2: Persistência de estudo

**Files:** hooks de perfil, objetivos e Resumos, `src/lib/userData.ts`, módulo/testes de sincronização.
**Interfaces:** preservar hooks públicos; adicionar operação transacional por capítulo para Resumos.
- [x] Regressões de perfil e objetivos: não gravar durante leitura/fallback/troca de UID; gravar apenas os campos editados; aguardar confirmação.
- [x] Demonstrar falhas e implementar isolamento e patches.
- [x] Regressões de Resumos: capítulos de duas abas se preservam; cache pendente é reconciliado e reenviado; gravação atrasada não altera outra conta.
- [x] Demonstrar falhas; implementar mudanças transacionais com registro de pendências por UID.
- [x] Executar testes do domínio e regressões existentes.

### Task 3: Obras e servidor

**Files:** `ObraDetalhe.tsx`, dados literários e testes; rotas de push/ingestão, limite de IA e testes.
- [x] Regressões: desmarcar leitura gera documento válido; falha de salvar aparece; logout/troca de obra cancela estado anterior.
- [x] Demonstrar falhas; limpar estado por slug/UID e proteger respostas/gravações atrasadas.
- [x] Regressões: segredo com caracteres não ASCII é rejeitado sem exceção; store indisponível retorna erro controlado.
- [x] Demonstrar falhas; comparar buffers por bytes e capturar falhas assíncronas.
- [x] Regressão: orçamento de texto/áudio é compartilhado também em memória; implementar store compartilhado.
- [x] Resolver versões transitivas de KaTeX e validar fórmulas.

### Task 4: Verificação e entrega

- [x] Rodar tipos, suíte completa e build.
- [x] Rodar navegação/interações relevantes na build de produção, sem dados reais.
- [x] Revisar o diff em contexto novo; corrigir achados importantes com regressão.
- [x] Documentar causas, limites de Safari/iPad real e resultados.
- [x] Commit, push da branch e PR sem merge automático.

## Resultados

Tipos e build passaram. A suíte completa teve 934 testes Node e 1.389 testes Vitest passando. O Playwright verificou oito fluxos na build de produção, incluindo retomada e interação em modo iPad; o teste responsivo em quatro larguras não detectou erros JS ou overflow. A matriz visual permaneceu igual e o audit de dependências não apontou vulnerabilidades. A revisão independente não deixou problemas bloqueantes.

Detalhes e limites: `docs/auditoria-geral-2026-10-07/correcoes-travamentos.md`.
