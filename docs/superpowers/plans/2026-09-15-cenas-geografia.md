# Cenas-âncora de Geografia — Fase 4

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar cena-âncora animada e com lastro aos 63 capítulos de Geografia, reusando a infraestrutura das Fases 1-3.

**Architecture:** Reusa `types.ts`, `useSceneMotion.ts`, `lastro.ts`, `movimento.test.ts`, `sceneFor.ts`, `TopicScene.tsx`, `TopicScene.css`. Este worktree nasce de `origin/main`, que só tem a Fase 1 (Filosofia) mergeada. As famílias `tipologia` e `criterios-conjuntivos` (Fase 2) precisam ser trazidas por `git show` da branch `feature/cenas-sociologia` — mesmo procedimento que a Fase 3 já fez, com sucesso, para este exato par de famílias.

**Tech Stack:** React 18, TypeScript, `motion/react`, Vitest + Testing Library, SVG autoral.

**Spec:** `docs/superpowers/specs/2026-09-15-cenas-humanidades-design.md`
**Fases anteriores:** `docs/superpowers/plans/2026-09-15-cenas-filosofia.md`, `-sociologia.md`, `-historia.md`; `docs/visual-personalizado/07-familias-filosofia.md`, `08-familias-sociologia.md`, `09-familias-historia.md`

## Global Constraints — as lições das três fases anteriores, como regra

- Vínculo capítulo→cena sempre por **ID exato**. Nunca por palavra-chave.
- Toda família importa de `motion/react` e consome `useSceneMotion()`. Proibido `repeat: Infinity`.
- Toda afirmação cita `section` (título exato) e `quote` (trecho literal), copiado e colado do `deepSummaryContent.json` — **nunca de memória, nunca reconstruído**. Normalização: caixa e espaço. **Nunca acento.**
- **Todo `claim` sustentado pelo `quote` abaixo dele, nunca excedido nem contradito.** Defeito real, repetido em três fases: um `claim` afirmando conteúdo que não está na citação, ou o oposto do que ela diz.
- **`contraste-de-posicoes` exige rivalidade genuína — adotar um lado rejeita o outro.** Um capítulo que só nomeia uma confusão a evitar ("o erro é confundir X com Y") ou duas leituras que **coexistem** não é rivalidade. Esse defeito exato forçou correção em praticamente toda fase anterior.
- **`cadeia-de-derivacao` exige derivação real, não cronologia.** Cada elo decorre do anterior; remover um quebra a conclusão. "Primeiro X, depois Y" sem `resultou de`/`levou a`/`condição essencial para` na fonte não é cadeia — é lista em ordem.
- **`tipologia` exige frase-guarda-chuva real na fonte**, nomeando a categoria antes de enumerar variantes que coexistem. Prosa conectiva do implementador não é guarda-chuva. Dois capítulos já foram corretamente lacunados nesta base por esse defeito exato (`disputas-europeias-no-brasil-colonial`, `grandes-revolucoes-do-seculo-xx`).
- **`criterios-conjuntivos` exige necessidade conjunta declarada** ("sem um único fator isolado sendo suficiente"), não apenas "havia vários fatores".
- **`camadas-de-determinacao` exige assimetria real** — `items[0]` é base que condiciona; "estão interligados" não é assimetria.
- **`escala-de-graus`**: item 0 é o grau mais baixo/inicial; conferir a direção de renderização contra `EscalaDeGraus.tsx` antes de fixar a ordem (defeito real na Fase 3: hierarquia renderizada invertida).
- **Nenhum texto fixo no componente pode afirmar algo específico de um capítulo.** Texto variável vem por campo opcional da entrada.
- **Nenhuma citação reutilizada entre itens pode fazer um item "roubar" conteúdo do outro** — se a frase-fonte tem sujeito composto, o `claim` de cada item cobre só a sua parte.
- Commit: **sem identificador de modelo, sem anglicismo.** Vazou em toda fase anterior pelo menos uma vez — reler a mensagem duas vezes antes de finalizar.
- Trabalho na branch `feature/cenas-geografia`, worktree `C:/wt-cenas-geografia`. Gate antes de PR: `npm run lint` e `npm test` (o script do projeto, nunca `npx vitest run src` bruto — ele pega specs do Playwright e um arquivo de teste vazio).
- **Verificar espaço em disco antes de qualquer operação pesada** (`npm install`, `npm run dev`). Se abaixo de ~1.5GB, parar e avisar em vez de arriscar.
- Ao parar o servidor de desenvolvimento: **nunca `taskkill /F /IM node.exe`** — mata todo processo node da máquina. Parar por PID/porta.

## Lacuna já conhecida

`summary-geografia-coordenadas-geograficas` já tem a experiência interativa `coordinates` em `src/views/topic-experiments/catalog.ts`.

## Hipótese de atribuição — a confirmar/corrigir na Task 1

Derivada de leitura amostral, não exaustiva. A Task 1 tem autoridade plena para corrigir lendo os 63 capítulos por inteiro.

- **`criterios-conjuntivos`** — capítulos de sistema climático/físico onde múltiplos fatores atuam juntos: Clima Mundial ("múltiplos fatores... interdependentes"), Climatologia do Brasil, Domínios Morfoclimáticos, Dinâmica Climática, possivelmente Pedologia.
- **`tipologia`** — capítulos com tipos que coexistem sob uma categoria comum: Projeções Cartográficas (nenhuma projeção é "a certa", cada uma preserva uma propriedade), Biogeografia Mundial (biomas), Blocos Econômicos, Sistemas agrícolas.
- **`cadeia-de-derivacao`** — processos com derivação real: Movimentos da Terra → estações (mecanismo físico causal claro), Transição Demográfica, formação de conflito por recursos hídricos.
- **`escala-de-graus`** — Desigualdades Globais (centro-periferia como espectro), Transição Demográfica (estágios).
- **`camadas-de-determinacao`** — capítulos Brasil-industrial/urbano onde uma condição estrutural gera efeito assimétrico.
- **`contraste-de-posicoes`** — só onde houver rejeição genuína de um lado, não mera diferença. Não decretar sem achar a frase de rejeição.

A Task 1 deve testar cada hipótese contra o conteúdo real antes de fixá-la, e está livre para descartar qualquer uma.

---

### Task 1: Inventário de famílias de Geografia

**Files:**
- Create: `docs/visual-personalizado/10-familias-geografia.md`
- Create: `src/views/topic-scenes/data/geografia.ts` (só os esqueletos)
- Test: `src/views/topic-scenes/familias-geografia.test.ts`
- Modify (aditivo): `src/views/topic-scenes/types.ts` (trazer `tipologia`/`criterios-conjuntivos` de `feature/cenas-sociologia` se ainda não estiverem — verificar antes)
- Create (se ausentes): `src/views/topic-scenes/families/Tipologia.tsx`, `CriteriosConjuntivos.tsx` + testes, copiados via `git show feature/cenas-sociologia:...`

**Interfaces:**
- Consumes: `SceneEntry` de `../types`; `interactiveSummaries` de `src/data/interactiveSummaries`.
- Produces: `geografia: SceneEntry[]` (vazio) e `geografiaSemCena: { chapterId: string; motivo: string }[]`.

- [ ] **Step 1: Trazer as famílias da Fase 2, se ausentes**

Verificar `grep "tipologia" src/views/topic-scenes/types.ts`. Se ausente, copiar `Tipologia.tsx`, `CriteriosConjuntivos.tsx` e seus testes via `git show feature/cenas-sociologia:caminho > caminho` (os worktrees compartilham `.git`). Estender `SceneFamily` de forma aditiva. Registrar no dispatcher `TopicScene.tsx`. **Copiar byte-a-byte, nunca reimplementar** — é o que garante compatibilidade no merge futuro das quatro branches.

- [ ] **Step 2: Ler os 63 capítulos e fechar a atribuição por conteúdo real**

Ler `src/data/deepSummaryContent.json` para `subject === "Geografia"`. Confirmar ou corrigir cada hipótese da seção anterior. Para cada `contraste-de-posicoes` proposto, achar a frase de rejeição explícita antes de aceitar. Para cada `cadeia-de-derivacao`, achar linguagem instrumental real em cada elo. Um capítulo que não sustenta nenhuma família honestamente recebe lacuna declarada com motivo específico — nunca genérico, nunca por "não cobre o capítulo inteiro" (uma cena ancora um aspecto, não resume o capítulo).

- [ ] **Step 3: Escrever o teste de completude**

Espelhar `familias-historia.test.ts`, adaptado para Geografia.

- [ ] **Step 4: Rodar — deve falhar**

Run: `npx vitest run src/views/topic-scenes/familias-geografia.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 5: Criar o esqueleto de dados**

`geografia: SceneEntry[] = []` e `geografiaSemCena` com a lacuna conhecida (Coordenadas Geográficas).

- [ ] **Step 6: Rodar — falha apontando os capítulos faltantes**

Estado correto ao fim desta tarefa.

- [ ] **Step 7: Escrever o documento de famílias**

`docs/visual-personalizado/10-familias-geografia.md`: atribuição definitiva com a frase-fonte que justifica cada `contraste-de-posicoes`/`camadas-de-determinacao`/`tipologia`/`criterios-conjuntivos`; lacunas com motivo específico; nota de que família nova exige registro aqui.

- [ ] **Step 8: Commit**

```bash
git add docs/visual-personalizado/10-familias-geografia.md src/views/topic-scenes/data/geografia.ts src/views/topic-scenes/familias-geografia.test.ts src/views/topic-scenes/types.ts src/views/topic-scenes/TopicScene.tsx src/views/topic-scenes/families/Tipologia.tsx src/views/topic-scenes/families/CriteriosConjuntivos.tsx src/views/topic-scenes/TopicScene.css
git commit -m "docs(visual): inventario de familias de cena de Geografia

O teste de completude fica vermelho de proposito ate as entradas serem escritas."
```

---

### Task 2: Entradas — primeiro lote (metade dos capítulos, priorizando as famílias menores)

**Files:** Modify `src/views/topic-scenes/data/geografia.ts`

Escrever as entradas das famílias com menos capítulos primeiro (`contraste-de-posicoes`, `camadas-de-determinacao`, `escala-de-graus`, `movimento-dialetico` se houver). Toda regra do lastro e do claim-vs-quote das Global Constraints se aplica. Verificar lastro de todas as entradas do lote com `validarLastro` real contra `interactiveSummaries` real antes de commitar.

---

### Task 3: Entradas — segundo lote (`cadeia-de-derivacao`)

**Files:** Modify `src/views/topic-scenes/data/geografia.ts`

Maior risco desta fase, historicamente: derivação real vs. cronologia. Ler cada capítulo procurando linguagem instrumental em cada elo antes de escrever.

---

### Task 4: Entradas — terceiro lote (`tipologia`, `criterios-conjuntivos`)

**Files:** Modify `src/views/topic-scenes/data/geografia.ts`

Ao final desta tarefa, `familias-geografia.test.ts` deve fechar em verde: todas as entradas + lacunas = 63.

---

### Task 5: Registro no seletor e no auditor

**Files:**
- Modify: `src/views/topic-scenes/sceneFor.ts` (somar `geografia`)
- Modify: `src/views/topic-scenes/auditoria.test.ts` (mesmo ajuste já feito nas Fases 2 e 3 — ele só conhece as matérias que existiam antes; vai quebrar de forma enganosa se não for atualizado)
- Test: `src/views/topic-scenes/sceneFor.test.ts` (acrescentar casos de Geografia)

Regenerar `docs/visual-personalizado/04-cobertura-percurso.json` rodando `npx tsx scripts/auditVisualJourney.ts` **sem redirecionar stdout** — o script já escreve o arquivo sozinho; redirecionar duplica a escrita e corrompe o JSON (aconteceu uma vez nesta base).

---

### Task 6: Auditoria de citações e estrutura, verificação em navegador, PR

Mesma estrutura das Fases 2 e 3: auditoria independente de todas as entradas (não confiar nos relatórios das Tasks 2-4), verificação em navegador cobrindo pelo menos um capítulo de cada família em desktop escuro e celular claro, capturas em `docs/visual-personalizado/screenshots/cenas-geografia/`, atualização do doc de famílias com os limites, gate de lint+test, push, PR aberta e **não mergeada**.

**Se a verificação em navegador não for possível** (extensão do Chrome não conectada, como ocorreu nas Fases 2 e 3), declarar isso explicitamente na PR e no doc — não fingir, não pular em silêncio.

---

## Estado ao fim da Fase 4

Até 62 dos 63 capítulos de Geografia com cena-âncora; 1 lacuna conhecida, possivelmente mais se a leitura real da Task 1 encontrar capítulos que não sustentam nenhuma família honestamente. Restam Literatura (37), Gramática (26), Redação (58) = 121 capítulos.
