# Organização Pedagógica dos Flashcards — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar a navegação Matéria → Tópico → Prioridade → Tipo de treino → Sessão para os 16.625 flashcards, com classificação determinística, auditável e sem alterar IDs ou revisões existentes.

**Architecture:** Um classificador puro transforma tags e origem nos três metadados pedagógicos; um script idempotente materializa esses campos nos dez JSONs. Funções puras constroem o índice e controlam a navegação, enquanto `Flashcards.tsx` apenas carrega os dados, apresenta as etapas e entrega o recorte vencido ao `FlashcardSession` existente.

**Tech Stack:** TypeScript 5.8, React 19, Node.js test runner via `tsx --test`, Firebase/Firestore existente, JSON estático em `public/flashcards`.

**Spec:** `docs/superpowers/specs/2026-08-23-organizacao-flashcards-design.md`

## Global Constraints

- Preservar todos os `Flashcard.id`, `topicId`, conteúdos, mídias, tags e `source` existentes.
- Não migrar nem regravar documentos Firestore; `FlashcardReview` continua indexado somente por `cardId`.
- Não usar IA para classificação.
- Não misturar flashcards de Obras Obrigatórias com matérias.
- Cartões `lembre_se` recebem `regular + objetivos + inherited`.
- Cartões inválidos nunca são removidos; o fallback de leitura é `regular + objetivos + fallback`.
- Um cartão pertence a exatamente um tipo de treino.
- A precedência de tipos é Discursivos → Interpretação → Pegadinhas → Padrões das bancas → Objetivos.
- Consumo ou leitura de flashcards não altera domínio por tópico.
- Cada tarefa usa TDD: teste falhando observado antes do código de produção.
- Ao final, executar `npm test`, `npm run lint`, `npm run build` e revisão somente leitura por segundo agente.

## File Structure

- Create `src/lib/flashcardTaxonomy.ts`: tipos, constantes e classificação pura de um cartão.
- Create `src/lib/flashcardTaxonomy.test.ts`: regras de prioridade, tipo, precedência e fallback.
- Create `scripts/classifyFlashcards.ts`: materialização idempotente e relatório de auditoria.
- Create `src/lib/flashcardCatalog.ts`: agrupamento, contagens e seleção de cartões vencidos.
- Create `src/lib/flashcardCatalog.test.ts`: integridade dos agrupamentos e ordenação.
- Create `src/lib/flashcardNavigation.ts`: reducer puro do fluxo de seleção.
- Create `src/lib/flashcardNavigation.test.ts`: regressão da navegação e retornos.
- Modify `src/types.ts`: metadados explícitos no tipo `Flashcard`.
- Modify `src/views/Flashcards.tsx`: interface em quatro etapas e sessão filtrada.
- Modify `package.json`: comando reproduzível `flashcards:classify`.
- Modify `public/flashcards/{biologia,filosofia,fisica,geografia,historia,ingles,matematica,portugues,quimica,sociologia}.json`: materializar metadados sem alterar IDs.

---

### Task 1: Taxonomia determinística

**Files:**
- Create: `src/lib/flashcardTaxonomy.ts`
- Create: `src/lib/flashcardTaxonomy.test.ts`
- Modify: `src/types.ts:300-309`

**Interfaces:**
- Consumes: `Flashcard.source`, `Flashcard.tags`.
- Produces: `FlashcardPriority`, `FlashcardTrainingType`, `FlashcardClassificationOrigin`, `FlashcardClassification`, `classifyFlashcard(card)`.

- [ ] **Step 1: Escrever o teste falhando da prioridade e do legado**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyFlashcard } from './flashcardTaxonomy';
import { Flashcard } from '../types';

function card(patch: Partial<Flashcard>): Flashcard {
  return {
    id: 'card-1', subject: 'Biologia', topicId: 'bio_ecologia', chapter: 'Ecologia',
    front: 'Pergunta', back: 'Resposta', tags: [], source: 'sistema_priorizado', ...patch,
  };
}

test('lê prioridade explícita do sistema priorizado', () => {
  assert.deepEqual(classifyFlashcard(card({ tags: ['prioridade_essencial', '01_basico_mapa_minimo'] })), {
    priority: 'essencial', trainingType: 'objetivos', classificationOrigin: 'tagged',
  });
});

test('classifica lembre_se como regular e objetivo herdado', () => {
  assert.deepEqual(classifyFlashcard(card({ source: 'lembre_se', tags: ['lembrese'] })), {
    priority: 'regular', trainingType: 'objetivos', classificationOrigin: 'inherited',
  });
});
```

- [ ] **Step 2: Rodar o teste e confirmar RED**

Run: `npx tsx --test src/lib/flashcardTaxonomy.test.ts`

Expected: FAIL porque `flashcardTaxonomy.ts` ainda não existe.

- [ ] **Step 3: Adicionar os tipos explícitos a `src/types.ts`**

```ts
export type FlashcardPriority = 'essencial' | 'alta' | 'regular';
export type FlashcardTrainingType = 'objetivos' | 'discursivos' | 'interpretacao' | 'pegadinhas' | 'padroes_bancas';
export type FlashcardClassificationOrigin = 'tagged' | 'inherited' | 'fallback';

export interface Flashcard {
  // campos existentes permanecem
  priority?: FlashcardPriority;
  trainingType?: FlashcardTrainingType;
  classificationOrigin?: FlashcardClassificationOrigin;
}
```

- [ ] **Step 4: Implementar o classificador mínimo**

Em `src/lib/flashcardTaxonomy.ts`, exportar:

```ts
import {
  Flashcard, FlashcardClassificationOrigin, FlashcardPriority, FlashcardTrainingType,
} from '../types';

export interface FlashcardClassification {
  priority: FlashcardPriority;
  trainingType: FlashcardTrainingType;
  classificationOrigin: FlashcardClassificationOrigin;
}

const TYPE_BY_MODEL_TAG: Record<string, FlashcardTrainingType> = {
  '01_basico_mapa_minimo': 'objetivos',
  '02_vocabulario_de_precisao': 'objetivos',
  '03_por_que_funciona': 'objetivos',
  '04_causa_consequencia': 'objetivos',
  '05_comparacao_e_fronteira_conceitual': 'pegadinhas',
  '06_grafico_tabela_texto_ou_experimento': 'interpretacao',
  '07_objetiva_eliminacao_de_distratores': 'objetivos',
  '08_objetiva_decisao_sob_tempo': 'objetivos',
  '09_fuvest_1a_fase_assunto_disfarcado': 'padroes_bancas',
  '10_enem_contexto_e_habilidade': 'padroes_bancas',
  '11_fuvest_2a_fase_resposta_pontuavel': 'discursivos',
  '12_unicamp_2a_fase_c_f_c_r': 'discursivos',
  '13_vunesp_2a_fase_d_c_e_a': 'discursivos',
  '14_autopsia_do_erro': 'pegadinhas',
  '15_cenario_e_se': 'objetivos',
  '16_conexao_interdisciplinar': 'objetivos',
  '17_sintese_de_alta_incidencia': 'objetivos',
  '18_questao_mista_transferencia_maxima': 'objetivos',
};

export function classifyFlashcard(card: Flashcard): FlashcardClassification {
  if (card.priority && card.trainingType && card.classificationOrigin) {
    return { priority: card.priority, trainingType: card.trainingType, classificationOrigin: card.classificationOrigin };
  }
  if (card.source === 'lembre_se') {
    return { priority: 'regular', trainingType: 'objetivos', classificationOrigin: 'inherited' };
  }
  const priorityTag = card.tags.find((tag) => tag.startsWith('prioridade_'));
  const priority = priorityTag?.replace('prioridade_', '') as FlashcardPriority | undefined;
  const trainingType = card.tags.map((tag) => TYPE_BY_MODEL_TAG[tag]).find(Boolean);
  if (!priority || !['essencial', 'alta', 'regular'].includes(priority) || !trainingType) {
    return { priority: 'regular', trainingType: 'objetivos', classificationOrigin: 'fallback' };
  }
  return { priority, trainingType, classificationOrigin: 'tagged' };
}
```

- [ ] **Step 5: Rodar o teste e confirmar GREEN**

Run: `npx tsx --test src/lib/flashcardTaxonomy.test.ts`

Expected: 2 testes passando.

- [ ] **Step 6: Adicionar testes de todas as famílias e da precedência**

Adicionar casos literais para `06 → interpretacao`, `05/14 → pegadinhas`, `09/10 → padroes_bancas`, `11/12/13 → discursivos` e `01/02/03/04/07/08/15/16/17/18 → objetivos`. Adicionar um cartão com tags `09` e `11` e exigir `discursivos`, implementando a precedência por cinco conjuntos ordenados em vez de depender da ordem original das tags.

- [ ] **Step 7: Confirmar GREEN após precedência**

Run: `npx tsx --test src/lib/flashcardTaxonomy.test.ts`

Expected: todos os casos passando e nenhum cartão com mais de um tipo retornado.

- [ ] **Step 8: Commit**

```bash
git add src/types.ts src/lib/flashcardTaxonomy.ts src/lib/flashcardTaxonomy.test.ts
git commit -m "feat: add flashcard taxonomy"
```

---

### Task 2: Materialização e auditoria dos JSONs

**Files:**
- Create: `scripts/classifyFlashcards.ts`
- Create: `src/lib/flashcardClassificationScript.test.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `classifyFlashcard(card)` da Task 1 e arquivos `Flashcard[]`.
- Produces: `classifyCards(cards, strict)`, `classifySubjectFile(inputPath, outputPath)`, `ClassificationReport` e comando `npm run flashcards:classify`.

- [ ] **Step 1: Escrever teste falhando de preservação e idempotência**

```ts
import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyCards } from '../../scripts/classifyFlashcards';

const input = [{
  id: 'fixed-id', subject: 'Biologia', topicId: 'bio_ecologia', chapter: 'Ecologia',
  front: '<b>Frente</b>', back: 'Verso', tags: ['prioridade_alta', '06_grafico_tabela_texto_ou_experimento'],
  source: 'sistema_priorizado' as const,
}];

test('materializa metadados sem alterar identidade ou conteúdo', () => {
  const { cards } = classifyCards(input, true);
  assert.equal(cards[0].id, 'fixed-id');
  assert.equal(cards[0].front, '<b>Frente</b>');
  assert.equal(cards[0].priority, 'alta');
  assert.equal(cards[0].trainingType, 'interpretacao');
});

test('segunda classificação produz exatamente o mesmo resultado', () => {
  const once = classifyCards(input, true).cards;
  assert.deepEqual(classifyCards(once, true).cards, once);
});
```

- [ ] **Step 2: Confirmar RED**

Run: `npx tsx --test src/lib/flashcardClassificationScript.test.ts`

Expected: FAIL porque o script ainda não existe.

- [ ] **Step 3: Implementar funções exportáveis e CLI protegida**

O script deve exportar as funções para testes e executar a CLI somente quando `import.meta.url === pathToFileURL(process.argv[1]).href`. `classifyCards(cards, true)` deve lançar erro quando um cartão `sistema_priorizado` receber `classificationOrigin: 'fallback'`. O relatório deve conter:

```ts
export interface ClassificationReport {
  total: number;
  byPriority: Record<FlashcardPriority, number>;
  byTrainingType: Record<FlashcardTrainingType, number>;
  byOrigin: Record<FlashcardClassificationOrigin, number>;
  byTopic: Record<string, number>;
}
```

Para escrita, usar `JSON.stringify(cards, null, 2) + '\n'` e substituir o arquivo somente depois que toda a matéria for validada.

- [ ] **Step 4: Confirmar GREEN e falha explícita**

Adicionar um teste com `sistema_priorizado` sem tag de prioridade e usar `assert.throws(..., /classificação inválida.*fixed-id/)`. Rodar:

`npx tsx --test src/lib/flashcardClassificationScript.test.ts`

Expected: preservação, idempotência e erro explícito passando.

- [ ] **Step 5: Adicionar o comando reproduzível**

Em `package.json`:

```json
"flashcards:classify": "tsx scripts/classifyFlashcards.ts"
```

A CLI deve percorrer exatamente os dez arquivos de matérias e excluir `obras.json`.

- [ ] **Step 6: Commit do classificador de arquivos, ainda sem regravar os JSONs**

```bash
git add scripts/classifyFlashcards.ts src/lib/flashcardClassificationScript.test.ts package.json
git commit -m "feat: add flashcard metadata classifier"
```

---

### Task 3: Índice por tópico, prioridade e tipo

**Files:**
- Create: `src/lib/flashcardCatalog.ts`
- Create: `src/lib/flashcardCatalog.test.ts`

**Interfaces:**
- Consumes: `Flashcard[]`, `Topic[]`, `Record<string, FlashcardReview>`, `isDue(review, now)`.
- Produces: `buildFlashcardTopicIndex(cards, topics, reviews, now)`, `selectDueCards(cards, selection, reviews, now)` e constantes de ordenação.

- [ ] **Step 1: Escrever teste falhando do agrupamento sem perda**

```ts
test('agrupa todo cartão uma vez e mantém tópico desconhecido em outros', () => {
  const index = buildFlashcardTopicIndex(cards, topics, {}, new Date('2026-08-23T12:00:00Z'));
  assert.equal(index.reduce((sum, topic) => sum + topic.total, 0), cards.length);
  assert.equal(index.find((topic) => topic.topicId === null)?.label, 'Outros tópicos');
});
```

O fixture deve conter: um cartão Essencial/Objetivos conhecido, um Alta/Discursivos conhecido e um Regular/Objetivos sem `topicId`.

- [ ] **Step 2: Confirmar RED**

Run: `npx tsx --test src/lib/flashcardCatalog.test.ts`

Expected: FAIL porque `flashcardCatalog.ts` não existe.

- [ ] **Step 3: Implementar os tipos e agrupamento**

```ts
export const FLASHCARD_PRIORITY_ORDER: FlashcardPriority[] = ['essencial', 'alta', 'regular'];
export const FLASHCARD_TRAINING_TYPE_ORDER: FlashcardTrainingType[] = [
  'objetivos', 'discursivos', 'interpretacao', 'pegadinhas', 'padroes_bancas',
];

export interface FlashcardBucketCount { total: number; due: number }
export interface FlashcardTopicSummary {
  topicId: string | null;
  label: string;
  total: number;
  due: number;
  buckets: Record<FlashcardPriority, Record<FlashcardTrainingType, FlashcardBucketCount>>;
}
```

Antes de agrupar, aplicar `classifyFlashcard` como fallback de leitura. Resolver o rótulo pelo `Topic.id`; IDs ausentes ou desconhecidos vão para `topicId: null`.

- [ ] **Step 4: Testar contagens vencidas e ordenação**

Adicionar revisões com uma `dueDate` anterior e outra posterior a `now`. Exigir contagens literais e ordem dos tópicos conforme `mockTopics`, com “Outros tópicos” por último.

- [ ] **Step 5: Implementar seleção de sessão**

```ts
export interface FlashcardSessionSelection {
  topicId: string | null;
  priority?: FlashcardPriority;
  trainingType?: FlashcardTrainingType;
  allDueForTopic: boolean;
}
```

`selectDueCards` deve filtrar vencidos e, para `allDueForTopic`, ordenar pela prioridade sem mudar a ordem relativa original dentro de cada prioridade.

- [ ] **Step 6: Confirmar GREEN**

Run: `npx tsx --test src/lib/flashcardCatalog.test.ts`

Expected: nenhum cartão perdido/duplicado, contagens corretas, desconhecidos preservados e ordem Essencial → Alta → Regular.

- [ ] **Step 7: Commit**

```bash
git add src/lib/flashcardCatalog.ts src/lib/flashcardCatalog.test.ts
git commit -m "feat: index flashcards by topic and training"
```

---

### Task 4: Estado de navegação testável

**Files:**
- Create: `src/lib/flashcardNavigation.ts`
- Create: `src/lib/flashcardNavigation.test.ts`

**Interfaces:**
- Consumes: `FlashcardPriority`, `FlashcardTrainingType`.
- Produces: `FlashcardNavigationState`, `FlashcardNavigationAction`, `initialFlashcardNavigationState`, `flashcardNavigationReducer`.

- [ ] **Step 1: Escrever a regressão falhando do fluxo completo**

```ts
test('avança matéria, tópico, prioridade e tipo antes da sessão', () => {
  let state = initialFlashcardNavigationState;
  state = flashcardNavigationReducer(state, { type: 'select_subject', subject: 'Biologia' });
  state = flashcardNavigationReducer(state, { type: 'select_topic', topicId: 'bio_ecologia' });
  state = flashcardNavigationReducer(state, { type: 'select_priority', priority: 'essencial' });
  state = flashcardNavigationReducer(state, { type: 'select_training_type', trainingType: 'interpretacao' });
  assert.deepEqual(state, {
    step: 'session', subject: 'Biologia', topicId: 'bio_ecologia',
    priority: 'essencial', trainingType: 'interpretacao', allDueForTopic: false,
  });
});
```

- [ ] **Step 2: Confirmar RED**

Run: `npx tsx --test src/lib/flashcardNavigation.test.ts`

Expected: FAIL porque o reducer ainda não existe.

- [ ] **Step 3: Implementar estados e ações discriminadas**

Estados permitidos: `subject`, `topic`, `priority`, `training_type`, `session`. Ações: `select_subject`, `select_topic`, `select_priority`, `select_training_type`, `review_all_due`, `back`, `reset`.

`back` deve produzir:

- sessão filtrada → tipo;
- sessão “todos vencidos” → tópico;
- tipo → prioridade;
- prioridade → tópico;
- tópico → matéria;
- matéria → matéria sem seleção.

Ao voltar, limpar somente os campos posteriores ao novo passo.

- [ ] **Step 4: Adicionar testes de retorno e “todos vencidos”**

Exigir que `review_all_due` vá de tópico para sessão com `allDueForTopic: true`, `priority` e `trainingType` ausentes. Exigir que trocar de matéria limpe tópico e filtros anteriores.

- [ ] **Step 5: Confirmar GREEN**

Run: `npx tsx --test src/lib/flashcardNavigation.test.ts`

Expected: fluxo completo, retornos e reset passando.

- [ ] **Step 6: Commit**

```bash
git add src/lib/flashcardNavigation.ts src/lib/flashcardNavigation.test.ts
git commit -m "feat: model flashcard selection flow"
```

---

### Task 5: Interface Matéria → Tópico → Prioridade → Tipo → Sessão

**Files:**
- Modify: `src/views/Flashcards.tsx:1-116`
- Reuse unchanged: `src/components/FlashcardSession.tsx`

**Interfaces:**
- Consumes: `buildFlashcardTopicIndex`, `selectDueCards`, `flashcardNavigationReducer`, `loadFlashcardsForSubject`, `reviews`, `recordReview`.
- Produces: navegação visual completa e título contextual da sessão.

- [ ] **Step 1: Integrar o reducer sem alterar a grade de matérias**

Substituir `subject` por `useReducer(flashcardNavigationReducer, initialFlashcardNavigationState)`. `openSubject` carrega os cartões e só então despacha `select_subject`; em erro, permanece na grade de matérias.

- [ ] **Step 2: Renderizar seleção de tópico**

Quando `step === 'topic'`, construir o índice com `useMemo` e mostrar um botão por tópico contendo `total` e `due`. Mostrar “Outros tópicos” por último quando existir. Adicionar “Revisar todos os vencidos deste tópico” somente após a escolha do tópico e desabilitá-lo quando `due === 0`.

- [ ] **Step 3: Renderizar prioridades**

Usar exatamente os rótulos:

```ts
const PRIORITY_LABELS = { essencial: 'Essencial', alta: 'Alta', regular: 'Regular' };
```

Cada opção mostra total e vencidos somados entre os cinco tipos. Desabilitar quando total for zero.

- [ ] **Step 4: Renderizar tipos de treino**

Usar exatamente:

```ts
const TRAINING_TYPE_LABELS = {
  objetivos: 'Objetivos', discursivos: 'Discursivos', interpretacao: 'Interpretação',
  pegadinhas: 'Pegadinhas', padroes_bancas: 'Padrões das bancas',
};
```

Cada opção mostra total e vencidos do tópico/prioridade escolhidos e fica desabilitada quando total for zero.

- [ ] **Step 5: Montar a sessão somente com o recorte vencido**

Criar `sessionCards` com `selectDueCards`. O título deve seguir um dos formatos:

- filtrado: `Biologia — Ecologia — Essencial — Interpretação`;
- todos: `Biologia — Ecologia — todos os vencidos`.

Passar `sessionCards.map(toSessionCard)` ao `FlashcardSession`. `onExit` despacha `back`, preservando matéria e tópico.

- [ ] **Step 6: Tratar estados vazios e erros**

Se `sessionCards.length === 0`, mostrar “Nenhum cartão vencido neste tópico” e um botão “Voltar aos tipos de treino” ou “Voltar ao tópico”, conforme `allDueForTopic`. Manter os avisos atuais de modo demonstração e persistência.

- [ ] **Step 7: Rodar verificações direcionadas**

Run: `npx tsx --test src/lib/flashcardTaxonomy.test.ts src/lib/flashcardCatalog.test.ts src/lib/flashcardNavigation.test.ts src/lib/flashcardScheduler.test.ts`

Expected: taxonomia, agrupamento, navegação e SM-2 passando.

- [ ] **Step 8: Rodar TypeScript**

Run: `npm run lint`

Expected: exit 0, sem propriedades opcionais usadas sem fallback.

- [ ] **Step 9: Commit**

```bash
git add src/views/Flashcards.tsx
git commit -m "feat: organize flashcard study flow"
```

---

### Task 6: Materializar dados, auditar integridade e concluir

**Files:**
- Modify: `public/flashcards/biologia.json`
- Modify: `public/flashcards/filosofia.json`
- Modify: `public/flashcards/fisica.json`
- Modify: `public/flashcards/geografia.json`
- Modify: `public/flashcards/historia.json`
- Modify: `public/flashcards/ingles.json`
- Modify: `public/flashcards/matematica.json`
- Modify: `public/flashcards/portugues.json`
- Modify: `public/flashcards/quimica.json`
- Modify: `public/flashcards/sociologia.json`

**Interfaces:**
- Consumes: `npm run flashcards:classify`.
- Produces: 16.625 cartões materializados e relatório de integridade reproduzível.

- [ ] **Step 1: Executar a materialização**

Run: `npm run flashcards:classify`

Expected:

```text
total=16625
tagged=9500
inherited=7125
fallback=0
essencial=6894
alta=2256
regular=7475
```

O total Regular inclui os 350 cartões priorizados regulares e os 7.125 herdados.

- [ ] **Step 2: Confirmar idempotência dos arquivos**

Run: `git diff --stat && npm run flashcards:classify && git diff --stat`

Expected: o segundo comando não altera o conjunto nem o tamanho do diff.

- [ ] **Step 3: Rodar a suíte completa**

Run: `npm test`

Expected: todos os testes anteriores mais os novos passam, zero falhas.

- [ ] **Step 4: Rodar lint e build**

Run: `npm run lint`

Expected: exit 0.

Run: `npm run build`

Expected: exit 0; o aviso preexistente de bundle acima de 500 kB pode permanecer.

- [ ] **Step 5: Verificar o diff**

Run: `git diff --check`

Expected: nenhuma linha com whitespace inválido; avisos LF/CRLF não contam como falha.

- [ ] **Step 6: Revisão independente obrigatória**

Delegar a um segundo agente uma revisão somente leitura. Solicitar verificação de: preservação dos 16.625 IDs, contagens por prioridade, mapeamento dos 18 modelos, ausência de cartões duplicados/perdidos, navegação de retorno, compatibilidade de `FlashcardReview`, estados vazios e ausência de alteração de domínio.

- [ ] **Step 7: Corrigir achados Critical/Important e repetir a validação completa**

Para cada correção, escrever primeiro um teste que reproduza o problema, observar RED, implementar, observar GREEN e repetir `npm test`, `npm run lint`, `npm run build` e `git diff --check`.

- [ ] **Step 8: Commit final dos dados materializados**

```bash
git add public/flashcards/*.json
git commit -m "data: classify flashcards by study priority"
```

- [ ] **Step 9: Preparar entrega**

Relatar arquivos alterados, comportamento anterior e novo, ausência de migração Firestore, totais auditados, testes, aviso de bundle e qualquer risco restante. Oferecer push e Pull Request contra `main`; não fazer merge automaticamente.
