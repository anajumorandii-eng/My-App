# Crivo — Fase 3: Diagnóstico e Sessão de Estudo — Plano de Implementação

> **Para agentes:** use `superpowers:subagent-driven-development`. Uma tarefa por vez, na ordem abaixo, com revisão e testes antes de avançar. `npm run lint` (`tsc --noEmit`) e `npm test` devem ficar limpos antes de passar para a próxima tarefa.

**Objetivo:** fechar o ciclo funcional *Diagnóstico produz evidência → Hoje decide → Sessão executa → resultado retorna como evidência → o motor recalibra* — sem reabrir o shell, a tela Hoje ou o Núcleo Instrumental (Fase 1, já validada), e sem expandir para nenhuma tela fora de Diagnóstico/Sessão.

**Arquitetura:** mesmo repositório, mesmo worktree (`/c/wtmain`), mesma branch (`feature/crivo-redesign`), HEAD atual `a9e819c`. Nenhuma nova branch, nenhum novo worktree.

**Tech Stack:** igual à Fase 1 — React 19, TypeScript, Vite, Tailwind v4, `motion` (Framer Motion), `node:test`/`tsx --test` (lib) + Vitest/Testing Library (views), Firebase/Firestore.

## Restrições globais

- Não editar `src/components/Layout.tsx`, `src/views/Dashboard.tsx`, `src/design-system/**`, `CrivoCore.tsx` ou `SubjectAtmosphere.tsx` além de leitura — esses arquivos são consumidos, não modificados, nesta fase (exceção: uma regressão comprovada nesses arquivos causada por código desta fase).
- `src/views/DailyPlanConsistency.test.tsx` é `origin/main`-owned e cruza Dashboard/Plano/Sessão — suas 5 asserções sobre `Sessao` (ver auditoria abaixo) **devem continuar passando exatamente como estão**, sem alterar o arquivo de teste, a menos que uma tarefa abaixo diga explicitamente para editá-lo.
- Reaproveitar o sistema de design existente (`Panel`, `Button`, `EmptyState`, `Skeleton`, `ProgressBar`, `MasteryMeter`, `ConfidenceIndicator`, `CrivoCore`, `SubjectAtmosphere`, `KineticText`, `MOTION_DURATION`/`MOTION_EASE`) — nenhum componente novo de UI genérica.
- Reaproveitar os mecanismos de persistência/evidência já existentes (`addUserAttempt`/`QuestionAttempt`, `addUserDiscursiveAttempt`/`DiscursiveAttempt`, `applyReviewOutcome`/`qualityFromAnswerCorrectness`/`qualityFromStudyVerification`/`qualityFromSelfRating`) em vez de inventar um novo formato de evidência.
- `git add` só com pathspecs explícitos por nome de arquivo. Nunca `git add -A`/`git add .`/`git reset`/`git checkout --`/`git clean`. Nunca `rebase`/`merge`/`push`/deploy sem autorização explícita. Antes de cada commit: `git diff --cached --name-only` e conferir que só arquivos desta lista de tarefas estão inclusos.
- TDD em cada tarefa: teste primeiro, RED confirmado pelo motivo certo, implementação mínima, GREEN, refatorar mantendo verde.

---

## Auditoria de divergência

Lida integralmente: `src/views/Diagnostico.tsx`, `src/views/Sessao.tsx`, `src/types.ts`, `src/hooks/useUserMastery.ts`, `src/hooks/useQuestions.ts`, `src/hooks/useDailyPlan.ts`, `src/hooks/useDiscursiveAttempts.ts`, `src/lib/userData.ts`, `src/lib/spacedRepetition.ts`, `src/lib/masteryOrigin.ts`, `src/lib/backlogEngine.ts` (labels), `src/views/Questoes.tsx` (trecho de persistência), `src/views/Treino2aFase.tsx` (referência de `useDiscursiveAttempts`), `src/views/DailyPlanConsistency.test.tsx`, `src/App.tsx`, componentes do design system (`Panel`, `Button`, `EmptyState`, `Skeleton`, `ProgressBar`, `MasteryMeter`, `ConfidenceIndicator`, `confidence.ts`), `SubjectAtmosphere.tsx`, `CrivoCore.tsx`. Estado do Git confirmado (`git status`, `git log`) antes de iniciar.

### O que já funciona de verdade (não reconstruir)

- **`/sessao?topic=<id>`**: a resolução do `topicId` já existe e já funciona (`Sessao.tsx:79-89`) — encontra a ação correspondente em `dailyPlan` (vindo de `useDailyPlan`, o mesmo hook que a Hoje usa) e a seleciona, com uma ref-guard que evita reset do timer quando `mastery` muda após completar um bloco. **"Começar" na Hoje já entrega o tópico certo para a Sessão.**
- **Timer real com intervalo alocado**: usa `AllocatedStudyAction.allocatedMinutes` (não a estimativa) — confirmado pelo teste existente `"Sessão caps its timer at the allocated interval instead of using the estimate"`.
- **Conclusão de bloco → evidência**: `completeAction` grava um `StudySessionRecord` real (`saveUserStudySession`), com fallback honesto se a sincronização falhar (mensagem, não bloqueio).
- **Checagem de aprendizagem → motor recalibra de verdade**: `verifyLearning` já chama `applyReviewOutcome(item, qualityFromStudyVerification(result), now)` e persiste via `updateMastery` (transação real no Firestore) — o "resultado retorna como evidência" já está fechado para o fluxo de verificação pós-bloco. `updateMastery` retorna `Promise<boolean>`; `Sessao.tsx` já verifica esse retorno antes de confirmar sucesso.
- **Diagnóstico auto-relatado + teste rápido (MC e discursiva)**: fluxo `pick → selfreport → quiz → result` já existe, com opção honesta "Não sei" (não força um palpite), filtro por capítulo com *fallback* transparente quando há poucas questões (`MIN_CHAPTER_ITEMS = 3`), e cálculo de incerteza que nunca finge precisão (`uncertainty: 0.55` no caminho "não sei").
- **`useUserMastery`**: já tem *optimistic update* + transação Firestore + reconciliação de revisão concorrente — infraestrutura de persistência robusta, nada a refazer aqui.
- **`Questoes.tsx`** já estabelece o padrão de evidência por tentativa a ser espelhado: a cada resposta, chama `applyReviewOutcome` (atualiza domínio *e* agenda SM-2) **e** `addUserAttempt` (grava a tentativa individual, rastreável).

### Lacunas reais confirmadas no código (não hipóteses)

1. **Diagnóstico não grava tentativa individual.** Ao contrário de `Questoes.tsx`, `Diagnostico.tsx` nunca chama `addUserAttempt` nem `addUserDiscursiveAttempt` — cada resposta de múltipla escolha ou autoavaliação discursiva só existe em `quizAnswers` (estado local) e é descartada depois de virar um número agregado. Não há "vínculo com usuário, tópico e tentativa" rastreável, exigido explicitamente pelo pedido.
2. **Falso-positivo de salvamento.** `saveDiagnostic` (linha 200-215) chama `updateMastery(...)` sem `await` e mostra "Diagnóstico salvo" incondicionalmente — mesmo que a transação do Firestore falhe. `updateMastery` já retorna `Promise<boolean>`, mas o retorno é ignorado.
3. **`origin` nunca é marcado.** `TopicMastery.origin` existe (`'demo'|'seed'|'diagnostic'|'observed'`) especificamente para essa distinção, mas `saveDiagnostic` nunca escreve `origin: 'diagnostic'`. Hoje isso não quebra `deriveMasteryOrigin` (o `lastReviewed` real já evita o *fallback* `'seed'`), mas a intenção documentada no tipo fica sem uso.
4. **Sem retomada após interrupção — Diagnóstico.** `phase`/`quizIndex`/`quizAnswers`/`selfState` vivem só em `useState`; um recarregamento no meio do teste rápido perde tudo e recomeça do zero.
5. **Sem retomada após interrupção — Sessão.** Não existe leitor (`getUserStudySessions*`) para `users/{uid}/studySessions` — só `saveUserStudySession` (escrita). `completedIds`/`verifiedIds`/`sessions` começam vazios a cada carregamento da página, mesmo que blocos de hoje já tenham sido concluídos e persistidos antes de um recarregamento.
6. **Tópico inválido na Sessão não avisa.** Se `?topic=` não bate com nenhuma ação de `dailyPlan`, a segunda `useEffect` (linha 91-96) troca silenciosamente para `dailyPlan[0]`, sem nenhuma mensagem visível explicando a troca.
7. **Sessão não tem atividade real — só um cronômetro.** Não há nenhum conteúdo vinculado ao tópico durante o bloco: nem questões, nem flashcards, nem material. "Consigo sem apoio" hoje é uma autoavaliação sobre nada de concreto que acabou de acontecer na tela.
8. **Nenhuma tela usa o design system.** Ambas ainda usam classes Tailwind cruas pré-Fase-1 (`indigo-*`, `zinc-*`, `rose-*`, `emerald-*`, `amber-*`) — zero `Panel`/`Button`/`EmptyState`/`Skeleton`/`MasteryMeter`, zero `CrivoCore`/`SubjectAtmosphere`, zero motion tokens.
9. **Zero testes hoje.** Não existe `Diagnostico.test.tsx` nem `Sessao.test.tsx` — a única cobertura que toca `Sessao.tsx` é indireta, via `DailyPlanConsistency.test.tsx` (ver restrição acima).
10. **Acessibilidade**: escala de autoavaliação 0-4 e opções de múltipla escolha são `<button>`s soltos sem semântica de grupo (`radiogroup`/`radio`); resultado do teste rápido não tem região `aria-live`; cronômetro da Sessão não anuncia nada para leitor de tela; anel de progresso SVG da Sessão anima (`transition-all duration-1000`) sem checar `prefers-reduced-motion`.

### Fora do escopo desta fase (explicitamente não tocar)

- `Erros.tsx`/`ErrorLog`/`addUserErrorLog` — Caderno de Erros é outra tela; a checagem "não consegui" da Sessão **não** deve passar a criar `ErrorLog` nesta fase.
- `RecoveryEvidence`/`BacklogItem`/`backlogEngine.ts`'s scoring (`dependencia`/`incidencia`/`lacuna`/`urgencia`/`custo`) — é o motor de **Recuperação de Atrasos**, uma tela e um pipeline de evidência **diferentes** do par `TopicMastery`/`EfficiencyEngine` que Diagnóstico/Sessão/Hoje usam. `STATE_LABELS`/`STATE_DESCRIPTIONS` de `backlogEngine.ts` são reaproveitados só como rótulos de texto (já é o que `Diagnostico.tsx` faz hoje) — nada além disso muda nesse arquivo.
- Flashcards, Resumos, Podcast, Treino de 2ª Fase — nenhuma dessas telas é tocada, mesmo quando cogitadas como fonte de conteúdo (ver Tarefa 4).
- `useDailyPlan.ts`/`EfficiencyEngine`/`studyActionAllocator.ts` — consumidos, não modificados.

---

## Tarefa 1 — Diagnóstico: evidência durável por tentativa + fim do falso-positivo + `origin`

**Arquivos:**
- Modificar: `src/views/Diagnostico.tsx`
- Criar: `src/views/Diagnostico.test.tsx`

**Contrato:**
- Cada resposta de múltipla escolha grava um `QuestionAttempt` real via `addUserAttempt(user.uid, {id, questionId, topicId: selectedTopicId, correct, date})` — mesmo padrão de `Questoes.tsx:84-91` — quando há usuário autenticado; em modo demonstração (`!user`), permanece só local (mesmo comportamento honesto que o resto do app já tem para "sem persistir").
- Cada autoavaliação discursiva grava um `DiscursiveAttempt` via `addUserDiscursiveAttempt(user.uid, {id, questionId: prompt.id, topicId: selectedTopicId, selfRating, date})`.
- `saveDiagnostic` passa a ser `async`, aguarda `updateMastery(...)`, só mostra "Diagnóstico salvo" quando o retorno é `true`; em falha, mostra uma mensagem de erro real (reaproveitar o padrão textual de `syncError` já usado no cabeçalho) com uma ação para tentar novamente, sem perder o resultado calculado.
- A entrada salva em `TopicMastery` inclui `origin: 'diagnostic'`.
- O botão "Salvar diagnóstico" fica desabilitado/mostra estado de carregamento enquanto a promessa está pendente (evita duplo clique criando duas gravações).

**RED → GREEN (mínimo):**
1. `addUserAttempt` é chamado com `{questionId, topicId, correct, date}` corretos ao responder uma MC (mock `addUserAttempt`/`addUserDiscursiveAttempt`/`updateMastery` do módulo `userData`).
2. `addUserDiscursiveAttempt` é chamado ao avaliar uma discursiva como "mediano".
3. `saveDiagnostic` com `updateMastery` mockado para resolver `true` → mostra "salvo"; mockado para resolver `false` → mostra erro, **não** mostra "salvo".
4. Entrada passada para `updateMastery` inclui `origin: 'diagnostic'`.
5. Clicar "Salvar" duas vezes rápido só resulta em uma chamada de `updateMastery` (ou o botão fica desabilitado após o primeiro clique).

**Commit:** `feat(diagnostico): grava tentativa individual, aguarda salvamento real e marca origin`

---

## Tarefa 2 — Diagnóstico: retomada segura + rascunho local

**Arquivos:**
- Modificar: `src/views/Diagnostico.tsx`
- Modificar: `src/views/Diagnostico.test.tsx`

**Contrato:**
- Enquanto `phase !== 'pick'`, o estado necessário para retomar (`selectedTopicId`, `selectedSubtopic`, `phase`, `selfState`, `dontKnow`, `quizPool` — só os ids/kind bastam, a pool é reconstruível de forma determinística por `topicId`+`chapter`, mas o índice/respostas **não** são determinísticos — persistir `quizIndex` e `quizAnswers`), é espelhado em `sessionStorage` sob uma chave por usuário (`crivo_diagnostico_draft:{uid ?? 'demo'}`), como rascunho — nunca em Firestore (só evidência final e salva vira Firestore).
- Ao montar, se existir um rascunho válido (mesmo formato, `topicId` ainda existe em `mockTopics`), a tela retoma exatamente na mesma fase/questão em vez de voltar para `'pick'`.
- O rascunho é apagado ao concluir `saveDiagnostic` com sucesso e ao chamar `reset()`.
- Corrupção/JSON inválido no rascunho é tratada como ausência de rascunho (mesmo padrão defensivo de `parseAdaptiveRankingSnapshot` na Fase 1) — nunca lança.

**RED → GREEN:**
1. Responder a primeira questão, desmontar e remontar o componente (simulando reload) → a tela volta na fase `quiz`, no mesmo índice, sem perder a resposta já dada.
2. `sessionStorage` com JSON corrompido para a chave do rascunho → a tela abre normalmente em `'pick'`, sem lançar.
3. Concluir `saveDiagnostic` → o rascunho correspondente não existe mais em `sessionStorage`.

**Commit:** `feat(diagnostico): retoma teste rápido após recarregar a página`

---

## Tarefa 3 — Diagnóstico: sistema de design, Núcleo por matéria e acessibilidade

**Arquivos:**
- Modificar: `src/views/Diagnostico.tsx`
- Modificar: `src/views/Diagnostico.test.tsx`

**Contrato (visual):**
- Trocar todo Tailwind cru por `Panel`, `Button` (`variant="primary"`/`"secondary"`/`"ghost"`), `EmptyState` (nenhuma questão disponível para o tópico), `Skeleton` (carregando `mastery`/`questions`), `ProgressBar`/`MasteryMeter` (resultado final — reaproveitar `MasteryMeter` diretamente com `level`/`uncertainty`/`topicName` do `computedResult`).
- `<SubjectAtmosphere subject={topic?.subject}>` envolve o conteúdo da tela (indefinido na fase `'pick'`, matéria do tópico selecionado nas demais).
- Um `<CrivoCore>` pequeno acompanha a fase atual, mapeado ao estado real do fluxo (não decorativo): `'listening'` durante `selfreport`/enquanto aguarda a próxima resposta do quiz; `'analyzing'` no instante entre responder e avançar (mesma janela que hoje mostra certo/errado); `'recalibrating'` enquanto `saveDiagnostic` está pendente; `'ready'` em `result` após salvar com sucesso. `topicId`/`subject` do tópico atual.
- Tipografia/`KineticText` para o título do tópico, reaproveitando `TYPOGRAPHY_PRESETS` (Fase 1) via `getSubjectProfile(topic.subject).tipografia` — mesma composição já usada em `TodayFocus`.

**Contrato (acessibilidade):**
- Escala de autoavaliação 0-4 vira um `<fieldset>` com `<legend>` (a pergunta) e `<input type="radio" name="selfState">` reais, estilizados (não recriar `role="radio"` à mão sobre `<button>`s).
- Opções de múltipla escolha continuam como `<button>` (não são mutuamente exclusivas de forma persistente — o padrão atual já é aceitável), mas ganham `aria-pressed` refletindo `isSelected` enquanto não respondido.
- Uma região `aria-live="polite"` anuncia transições relevantes: número da questão ("Questão 2 de 5"), resultado calculado, confirmação/erro de salvamento.
- Mensagens de erro (`syncError`, falha ao salvar) ficam associadas ao controle relevante via `aria-describedby`, não soltas no layout.

**RED → GREEN:**
1. Teste de acessibilidade básico com Testing Library: `getByRole('radiogroup')` ou `getByRole('group')` com `name` acessível para a autoavaliação; cada nível é `getByRole('radio', {name: /.../ })`.
2. Após responder uma questão, a região `aria-live` contém o texto esperado (`getByText` dentro de `[aria-live]`).
3. `prefers-reduced-motion` (mock de `matchMedia`, mesmo padrão de `testSetup.ts` da Fase 1) → nenhum erro, tela renderiza igual.
4. Nenhuma classe `indigo-|zinc-|rose-|emerald-|amber-` remanescente (`grep`, verificado manualmente na revisão, não precisa virar teste automatizado).

**Commit:** `feat(diagnostico): adota Panel/Button/MasteryMeter, Núcleo por matéria e semântica de formulário acessível`

---

## Tarefa 4 — Sessão: atividade real vinculada ao tópico + aviso de tópico inválido

**Arquivos:**
- Modificar: `src/views/Sessao.tsx`
- Criar: `src/views/Sessao.test.tsx`

**Contrato (tópico inválido):**
- Quando `searchParams.get('topic')` não corresponde a nenhuma ação em `dailyPlan` (e `dailyPlan` já não está `loading`), mostrar um aviso visível e não bloqueante: "O tópico solicitado não está mais no plano de hoje — mostrando sua prioridade atual.", e prosseguir com `dailyPlan[0]` como já acontece.

**Contrato (atividade real — decisão de escopo registrada aqui, não uma lacuna de produto em aberto):**
A tela hoje é só um cronômetro sem conteúdo. A infraestrutura já existente para preencher isso sem inventar um banco novo é o mesmo banco de questões que Diagnóstico e Questões já usam (`useQuestions`, filtrado por `topicId`). Decisão: para `selectedAction.type` em `'practice' | 'error_analysis' | 'review'`, embutir uma mini-atividade de 3 questões (ou menos, se o banco do tópico tiver menos) do banco de MC filtrado por `topicId`, embaralhado, exibida **antes** do cronômetro começar a contar tempo de "esforço cronometrado" — cada resposta já alimenta `applyReviewOutcome(item, qualityFromAnswerCorrectness(correct))` + `addUserAttempt`, exatamente como `Questoes.tsx` faz. Isso faz a evidência da Sessão nascer de uma atividade real, não só de uma autoavaliação pós-cronômetro. Para `type === 'theory'` mantém-se o cronômetro focado como está hoje (não existe banco de conteúdo teórico reaproveitável sem inventar um) — rotulado com honestidade ("Reconstrua a base sem apoio; ao final, avalie o que conseguiu.") em vez de implicar que há material embutido. Se o tópico não tiver nenhuma questão MC disponível mesmo sendo `practice`/`review`, cai no mesmo cronômetro focado do `theory`, com o mesmo aviso honesto.
Quando existe atividade embutida, a "Checagem rápida de aprendizagem" pós-cronômetro permanece como está (ela avalia a lembrança *depois* do bloco todo, atividade + estudo livre), sem duplicar o que a mini-atividade já mediu.

**RED → GREEN:**
1. `?topic=` para um id que não existe em `dailyPlan` → aviso visível, `dailyPlan[0]` selecionado (teste já teria que continuar concordando com a asserção existente de fallback).
2. `selectedAction.type === 'practice'` com questões disponíveis para o `topicId` → a mini-atividade renderiza antes do cronômetro rodar; responder chama `addUserAttempt` e `updateMastery` com a qualidade correta (`qualityFromAnswerCorrectness`).
3. `selectedAction.type === 'theory'` → nenhuma mini-atividade, cronômetro direto, texto honesto visível.
4. `type === 'practice'` mas sem nenhuma questão para o `topicId` → cai no cronômetro focado (mesmo texto do `theory`), sem quebrar.
5. `DailyPlanConsistency.test.tsx` (não editado) continua verde — as 5 asserções que tocam `Sessao` não podem regredir (checar manualmente após esta tarefa, antes de prosseguir).

**Commit:** `feat(sessao): mini-atividade real por tópico e aviso quando o topic da URL não existe no plano`

---

## Tarefa 5 — Sessão: retomada segura via reconciliação com sessões já persistidas hoje

**Arquivos:**
- Modificar: `src/lib/userData.ts` (nova função de leitura)
- Modificar: `src/views/Sessao.tsx`
- Criar/estender: `src/lib/userData.test.ts` (se não existir, criar; checar antes)

**Contrato:**
- Nova função `getUserStudySessionsForDate(uid: string, localDate: string): Promise<StudySessionRecord[]>` em `userData.ts`, mesmo padrão de `getUserAttempts`/`getUserDiscursiveAttempts` (coleção `users/{uid}/studySessions`, `orderBy('completedAt', 'desc')`), filtrando client-side por `completedAt` cuja data em São Paulo (`todayInSaoPaulo`-style) bate com `localDate` — sem exigir um índice composto novo no Firestore.
- Ao montar (com `user` autenticado), `Sessao.tsx` busca as sessões de hoje e reconcilia `completedIds`/`sessions` (e `verifiedIds`, a partir de `session.verification` presente) a partir delas, **antes** de derivar `selectedAction` do zero — uma ação já concluída hoje continua marcada como concluída após um recarregamento.
- Estado de carregamento explícito enquanto essa reconciliação está em curso (usar `Skeleton`, não a tela em branco atual).

**RED → GREEN:**
1. `getUserStudySessionsForDate` retorna só registros cujo `completedAt` cai no dia local pedido (fixture com um registro de ontem e um de hoje).
2. Montar `Sessao` com uma sessão de hoje já persistida para a primeira ação do plano → `completedIds` já contém essa ação antes de qualquer interação, sem esperar o usuário rodar o cronômetro de novo.
3. Falha na leitura (`getUserStudySessionsForDate` rejeita) → a tela ainda renderiza (não trava em carregando para sempre), com aviso equivalente ao padrão já usado (`syncError`-like).

**Commit:** `feat(sessao): reconcilia blocos já concluídos hoje ao carregar a página`

---

## Tarefa 6 — Sessão: sistema de design, Núcleo por matéria, cronômetro acessível e reduced motion

**Arquivos:**
- Modificar: `src/views/Sessao.tsx`
- Modificar: `src/views/Sessao.test.tsx`

**Contrato (visual):**
- Trocar Tailwind cru por `Panel`/`Button`/`EmptyState` (sem blocos hoje)/`Skeleton` (reconciliando/carregando).
- `<SubjectAtmosphere subject={selectedAction?.subject}>` envolvendo o conteúdo.
- `<CrivoCore>` mapeado ao estado real: `'listening'` antes de iniciar; `'converging'` enquanto o cronômetro roda; `'ready'` ao concluir (`isDone`); `'recalibrating'` enquanto `verifyLearning` está pendente. `topicId`/`subject` da ação selecionada.

**Contrato (acessibilidade e reduced motion):**
- O número do cronômetro (`formatTime(secondsLeft)`) fica numa região com `aria-live="polite"` — mas throttled: só anuncia a cada minuto completo ou em transições de estado (iniciar/pausar/concluir), nunca a cada segundo (isso spamaria um leitor de tela).
- O anel de progresso SVG (`stroke-dashoffset` com `transition-all duration-1000`) passa a checar `useReducedMotion()` (já importável de `motion/react`, mesmo padrão do restante do app) — com movimento reduzido, o traço atualiza sem a transição CSS (posição correta, sem animação contínua).
- Botões Iniciar/Pausar/Concluir/Reiniciar mantêm rótulos de texto (já têm) e ganham `aria-pressed`/estado equivalente onde fizer sentido (Iniciar/Pausar já alterna label, o que já é suficiente).

**RED → GREEN:**
1. `prefers-reduced-motion: reduce` (mock `matchMedia`) → o anel de progresso não recebe a classe/estilo de transição, mas o valor exibido continua correto.
2. A região `aria-live` do cronômetro contém o texto correto ao cruzar um minuto (avançar o timer mockado com fake timers) e ao concluir.
3. `DailyPlanConsistency.test.tsx` continua verde (checagem manual final desta tarefa).

**Commit:** `feat(sessao): adota Panel/Button, Núcleo por matéria e cronômetro acessível com reduced motion`

---

## Tarefa 7 — Verificação completa e QA no navegador

**Arquivos:** nenhum (só verificação, mesmo padrão da Tarefa 11 da Fase 1).

- [ ] `npm run lint && npm test && npm run build` — todos limpos.
- [ ] `DailyPlanConsistency.test.tsx` — as 5 asserções de Dashboard/Plano/Sessão continuam verdes, sem editar o arquivo.
- [ ] Checklist manual em navegador real (Chromium), desktop e mobile, claro e escuro:
  - [ ] Diagnóstico: escolher matéria/tópico → autoavaliação → "Não sei" → teste rápido (MC + discursiva) → resultado → salvar → confirmação real (não aparece se a gravação falhar — simular falha via DevTools offline momentâneo).
  - [ ] Recarregar no meio do teste rápido → retoma na mesma questão.
  - [ ] Diagnóstico salvo aparece em Hoje (evidência refletida no próximo cálculo do plano).
  - [ ] Sessão: `/sessao?topic=<id do plano>` abre no tópico certo; `?topic=<id inexistente>` mostra o aviso e cai na prioridade atual.
  - [ ] Bloco `practice`/`review` com questões disponíveis mostra a mini-atividade antes do cronômetro; bloco `theory` vai direto ao cronômetro com texto honesto.
  - [ ] Concluir um bloco, recarregar a página → o bloco continua marcado como concluído.
  - [ ] Checagem de aprendizagem pós-bloco recalibra o domínio (comparar `mastery` antes/depois via Diagnóstico ou Evolução).
  - [ ] `prefers-reduced-motion: reduce` em ambas as telas — Núcleo estático, anel de progresso sem animação contínua, nenhuma tela trava.
  - [ ] Teclado: navegar Diagnóstico e Sessão inteiramente sem mouse; foco sempre visível.
  - [ ] Console limpo (nenhum erro novo introduzido por esta fase).
- [ ] Reportar resultados; qualquer falha vira commit de correção nesta mesma branch antes de considerar a Fase 3 concluída.

**Critério de aceite da fase:** todos os itens acima verdes, ciclo Diagnóstico → Hoje → Sessão → recalibração demonstrável ponta a ponta com dados reais (conta autenticada, não modo demonstração), zero regressão em Hoje/shell/testes existentes.
