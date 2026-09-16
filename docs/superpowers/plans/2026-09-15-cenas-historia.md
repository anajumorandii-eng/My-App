# Cenas-âncora de História — Fase 3

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar cena-âncora animada e com lastro aos 49 capítulos de História, reusando a infraestrutura das Fases 1-2.

**Architecture:** Reusa `types.ts`, `useSceneMotion.ts`, `lastro.ts`, `movimento.test.ts`, `sceneFor.ts`, `TopicScene.tsx`, `TopicScene.css`. Este worktree nasceu de `origin/main`, que só tem a Fase 1 (Filosofia) mergeada — as cinco famílias originais estão disponíveis: `contraste-de-posicoes`, `escala-de-graus`, `cadeia-de-derivacao`, `camadas-de-determinacao`, `movimento-dialetico`. As três famílias da Fase 2 (Sociologia: `tipologia`, `criterios-conjuntivos`, `grade-de-eixos`) existem só na PR #173, ainda não mergeada — **não estão disponíveis neste worktree.**

**Tech Stack:** React 18, TypeScript, `motion/react`, Vitest + Testing Library, SVG autoral.

**Spec:** `docs/superpowers/specs/2026-09-15-cenas-humanidades-design.md`
**Fases anteriores:** `docs/superpowers/plans/2026-09-15-cenas-filosofia.md`, `docs/superpowers/plans/2026-09-15-cenas-sociologia.md`, `docs/visual-personalizado/07-familias-filosofia.md`, `docs/visual-personalizado/08-familias-sociologia.md`

## Global Constraints

- Vínculo capítulo→cena sempre por **ID exato**. Nunca por palavra-chave.
- Toda família importa de `motion/react` e consome `useSceneMotion()`. Proibido `repeat: Infinity`.
- Toda afirmação cita `section` (título exato) e `quote` (trecho literal).
- Normalização do lastro: caixa e espaço. **Nunca** acento.
- Falha fechada: sem entrada válida, `sceneFor` devolve `null`.
- `label` de 1-2 palavras curtas.
- **Todo `claim` sustentado pelo `quote`, nunca contradito.** (Fase 1: um card afirmava o oposto da própria citação. Fase 2: mesmo defeito, achado só na auditoria final.)
- **Nenhum texto fixo no componente pode afirmar algo específico de um capítulo.** Texto variável vem por campo opcional da entrada.
- **`contraste-de-posicoes` exige rivalidade genuína — adotar um lado rejeita o outro.** Um capítulo que só nomeia uma confusão a evitar ("o erro central é confundir X com Y") não é rivalidade: os dois termos continuam válidos. Esse exato defeito forçou correção em 6 de 14 capítulos na Fase 2 e em 1 na Fase 1. Antes de escrever uma entrada nesta família, achar a frase que mostra rejeição real — não apenas uma frase que menciona duas coisas.
- **Esgotar as 5 famílias existentes antes de propor uma nova.** Se um capítulo genuinamente pedir uma estrutura nova, checar primeiro se ela não duplica `tipologia`, `criterios-conjuntivos` ou `grade-de-eixos` da Fase 2 (ver `08-familias-sociologia.md` para as definições) — se duplicar, usar o mesmo nome e a mesma forma de dados, para o merge futuro das duas branches não criar dois conceitos equivalentes com nomes diferentes.
- Trabalho na branch `feature/cenas-historia`, worktree `C:/wt-cenas-historia`. Sem identificadores de modelo em commit nem PR — regra que já causou retrabalho cinco vezes no projeto. Gate antes de abrir PR: `npm run lint` e `npm test` verdes.
- **Disco da máquina host está no limite** (checar espaço livre antes de `npm run dev` ou operações pesadas; preferir liberar `node_modules`/caches descartáveis a apagar código).

## Lacuna já conhecida

`summary-historia-introducao-a-historia-e-primeiras-civilizacoes` já tem a experiência interativa `sources` em `src/views/topic-experiments/catalog.ts`. Mesmo critério das lacunas das Fases 1-2.

---

### Task 1: Inventário de famílias de História

**Files:**
- Create: `docs/visual-personalizado/09-familias-historia.md`
- Create: `src/views/topic-scenes/data/historia.ts` (só os esqueletos)
- Test: `src/views/topic-scenes/familias-historia.test.ts`

**Interfaces:**
- Consumes: `SceneEntry` de `../types`; `interactiveSummaries` de `src/data/interactiveSummaries`.
- Produces: `historia: SceneEntry[]` (vazio) e `historiaSemCena: { chapterId: string; motivo: string }[]`.

- [ ] **Step 1: Ler os 49 capítulos e derivar a atribuição por conteúdo real**

Ler `src/data/deepSummaryContent.json` para `subject === "História"`. Para cada capítulo, decidir a família pela estrutura que o conteúdo apresenta, não pelo título da seção. Pontos de atenção específicos de História, a confirmar ou descartar lendo o conteúdo:

- **`cadeia-de-derivacao`** é candidata forte para muitos capítulos de processo histórico — a Revolução Francesa e a Revolução Industrial já têm suas seções estruturadas como etapas encadeadas no próprio currículo. Verificar se cada etapa realmente decorre da anterior (não apenas "aconteceu depois").
- **`contraste-de-posicoes`** cabe em capítulos com debate historiográfico explícito (ex.: "Debates historiográficos" em "A História e o Brasil", "Continuidades" em "A Independência do Brasil" questionando a leitura de ruptura). Aplicar o teste de rivalidade genuína — muitos capítulos de história têm duas leituras que **coexistem** (uma interpretação econômica e uma política do mesmo evento, por exemplo), o que não é rivalidade.
- **`movimento-dialetico`** é candidata a ficar em zero ou quase zero, como ocorreu em Sociologia — não forçar. Um candidato honesto a verificar: Reforma e Contrarreforma (tese/reação/transformação de ambos os lados), mas só se o conteúdo sustentar as três etapas.
- **`camadas-de-determinacao`** cabe em capítulos que descrevem uma condição estrutural gerando um efeito político/social assimétrico (ex.: crise financeira e desigualdade social condicionando a Revolução Francesa) — mas cuidado com o mesmo erro da Fase 1/2: verificar assimetria real, não "estão interligados".
- **`escala-de-graus`** cabe em processos com estágios ordenados sem reversão (ex.: graus de radicalização de um processo revolucionário) — só se a ordem for genuína e não apenas cronológica arbitrária.
- Capítulos de tipologia paralela (tipos de colonização, tipos de revolta, formas de dominação política) podem pedir a família `tipologia` da Fase 2 — usar o mesmo nome/forma se for o caso, registrando que depende do merge da Sociologia.

Um capítulo que não couber honestamente em nenhuma família recebe lacuna declarada com motivo.

- [ ] **Step 2: Escrever o teste de completude**

Espelhar `familias-sociologia.test.ts`, adaptado para História e `historia.ts`.

- [ ] **Step 3: Rodar — deve falhar**

Run: `npx vitest run src/views/topic-scenes/familias-historia.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 4: Criar o esqueleto de dados**

`src/views/topic-scenes/data/historia.ts` com `historia: SceneEntry[] = []` e `historiaSemCena` com a lacuna conhecida.

- [ ] **Step 5: Rodar — falha apontando os capítulos faltantes**

Esse é o estado correto ao fim desta tarefa.

- [ ] **Step 6: Escrever o documento de famílias**

`docs/visual-personalizado/09-familias-historia.md`: atribuição definitiva capítulo a capítulo, com a frase-fonte que justifica cada rivalidade em `contraste-de-posicoes` e cada assimetria em `camadas-de-determinacao`; qualquer família nova, com nota se ela duplica uma família pendente da Fase 2; a lacuna e seu motivo; nota de que família nova exige registro aqui.

- [ ] **Step 7: Commit**

```bash
git add docs/visual-personalizado/09-familias-historia.md src/views/topic-scenes/data/historia.ts src/views/topic-scenes/familias-historia.test.ts
git commit -m "docs(visual): inventario de familias de cena de Historia

O teste de completude fica vermelho de proposito ate as entradas serem escritas."
```

---

### Task 2: Família(s) nova(s), se necessárias

**Condicional.** Só executa se a Task 1 concluir que o conteúdo de História pede uma estrutura que as 5 (ou as 3 pendentes da Fase 2, se replicadas) não cobrem. Se as famílias existentes bastarem, pular direto para a Task 3 e registrar essa conclusão no documento de famílias.

Se necessária, seguir o padrão de `families/ContrasteDePosicoes.tsx`: TDD, CSS aditivo em `TopicScene.css`, `SceneFamily` estendido de forma aditiva em `types.ts`, sem texto fixo específico de capítulo.

---

### Task 3: Entradas — primeiro lote (metade dos capítulos)

**Files:** Modify `src/views/topic-scenes/data/historia.ts`

Escrever as entradas do primeiro lote definido pela Task 1 (aproximadamente metade dos 48 capítulos com cena, priorizando as famílias com mais capítulos). Cada entrada: `quote` copiado e colado do `deepSummaryContent.json`, nunca de memória; `section` título exato; `claim` sustentado pelo `quote`. Verificar lastro de todas as entradas do lote com `validarLastro` contra `interactiveSummaries` real antes de commitar.

---

### Task 4: Entradas — segundo lote (capítulos restantes)

**Files:** Modify `src/views/topic-scenes/data/historia.ts`

Completa os capítulos restantes. Ao final, `familias-historia.test.ts` deve fechar em verde: todas as entradas + a lacuna = 49 capítulos.

---

### Task 5: Registro no seletor e no auditor

**Files:**
- Modify: `src/views/topic-scenes/sceneFor.ts`
- Modify: `src/views/topic-scenes/TopicScene.tsx` (se a Task 2 tiver criado família nova)
- Test: `src/views/topic-scenes/sceneFor.test.ts` (acrescentar casos de História)

Ligar `historia` em `sceneFor.ts` somando às matérias já presentes no branch (`filosofia`; **não** `sociologia`, que não existe neste branch). Regenerar `docs/visual-personalizado/04-cobertura-percurso.json` rodando `npx tsx scripts/auditVisualJourney.ts` (sem redirecionar stdout para o mesmo arquivo — o script já escreve o arquivo sozinho via `fs.writeFile`; redirecionar duplica a escrita e corrompe o JSON). Rodar a suíte completa: `auditoria.test.ts` da Fase 1 pode precisar do mesmo ajuste que teve na Fase 2, se ele também não souber somar História.

---

### Task 6: Auditoria final + navegador + PR

Mesma estrutura da Task 6 da Fase 2: auditoria independente de todas as citações e estruturas do lote inteiro (não confiar nos relatórios das Tasks 3-4), verificação em navegador cobrindo pelo menos uma família por tipo, capturas em `docs/visual-personalizado/screenshots/cenas-historia/`, atualização do documento de famílias com os limites, gate de lint+test, push da branch, PR aberta e **não mergeada** — mesmo padrão de `#173`.

**Ao encerrar o servidor de desenvolvimento, nunca usar `taskkill /F /IM node.exe`** — mata todos os processos node da máquina, não só o servidor local. Parar pelo PID ou pela porta.

---

## Estado ao fim da Fase 3

48 (ou menos, conforme lacunas honestas) dos 49 capítulos de História com cena-âncora. Restam Geografia 63, Literatura 37, Gramática 26, Redação 58 = 184 capítulos.
