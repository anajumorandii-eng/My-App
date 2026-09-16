# Cenas-âncora de Sociologia — Fase 2

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar cena-âncora animada e com lastro aos 27 capítulos de Sociologia, reusando a infraestrutura da Fase 1 e acrescentando as duas famílias que o material de Sociologia pede.

**Architecture:** A infraestrutura já existe e não se toca: `types.ts`, `useSceneMotion.ts`, `lastro.ts`, `movimento.test.ts`, `sceneFor.ts`, `TopicScene.tsx`, `TopicScene.css`. Esta fase acrescenta dois componentes de família, um arquivo de dados `data/sociologia.ts`, e o registro desses dois no dispatcher e no seletor.

**Tech Stack:** React 18, TypeScript, `motion/react`, Vitest + Testing Library, SVG autoral.

**Spec:** `docs/superpowers/specs/2026-09-15-cenas-humanidades-design.md`
**Fase anterior:** `docs/superpowers/plans/2026-09-15-cenas-filosofia.md` e `docs/visual-personalizado/07-familias-filosofia.md`

## Global Constraints

- Vínculo capítulo→cena sempre por **ID exato**. Nunca por palavra-chave.
- Toda família importa de `motion/react` e consome `useSceneMotion()`. Proibido `repeat: Infinity`.
- Toda afirmação cita `section` (título exato) e `quote` (trecho literal daquela seção).
- Normalização do lastro: caixa e espaço. **Nunca** acento.
- Falha fechada: sem entrada válida, `sceneFor` devolve `null` e a tela volta à lacuna honesta.
- `label` de 1-2 palavras curtas. O `claim` carrega o detalhe.
- **Todo `claim` tem de ser sustentado pelo `quote` abaixo dele, nunca contradito.** (Defeito real da Fase 1: um card afirmava "parecem nascer de reflexão neutra" ao lado da citação "não surgiu de reflexão racional neutra".)
- **Nenhum texto fixo no componente pode afirmar algo específico de um capítulo.** (Defeito real da Fase 1: legenda chumbada rotulava *temeridade* como o estado mais próximo do inteligível.) Texto variável vem por campo da entrada.
- Trabalho na branch `feature/cenas-sociologia`. Sem identificadores de modelo em mensagem de commit. Gate antes de abrir PR: `npm run lint` e `npm test` verdes.

## Atribuição de famílias — os 27 capítulos

Derivada da leitura dos títulos de seção dos 27 capítulos em `src/data/deepSummaryContent.json`.

**Lacuna declarada (1):** `summary-sociologia-solidariedade-mecanica-e-solidariedade-organica` — já tem a experiência interativa `solidarity` em `topic-experiments/catalog.ts`; duas peças competiriam pelo mesmo slot. Mesmo critério de "Do Mito ao Logos" na Fase 1.

**`tipologia` (NOVA, 4):** Tipos de Ação Social · Dominação e Poder em Weber · Democracia e Participação Política · Movimentos Sociais Clássicos e Contemporâneos

**`criterios-conjuntivos` (NOVA, 2):** O que é o Fato Social · Cidadania e Direitos

**`contraste-de-posicoes` (8):** A Luta de Classes na Análise Sociológica · Cultura e Etnocentrismo · Divisão Social do Trabalho · Multiculturalismo e Relativismo Cultural · Sociologia e Senso Comum · Desigualdade Racial no Brasil · O Estado-Nação na Era Global · Desigualdade de Gênero

**`cadeia-de-derivacao` (5):** Ética Protestante e o Espírito do Capitalismo · Anomia e Coesão Social · Educação e Socialização em Durkheim · O Contexto Histórico do Surgimento da Sociologia · Precarização e Uberização do Trabalho

**`camadas-de-determinacao` (4):** Modo de Produção e Estrutura Social · Ideologia e Alienação · A Sociedade da Informação · Globalização Econômica e Cultural

**`escala-de-graus` (2):** Classes Sociais e Mobilidade Social · Identidade e Diferença

**`movimento-dialetico` (2):** Transformações no Mundo do Trabalho · Divisão Social do Trabalho *(ver nota)*

Total: 4+2+8+5+4+2+2 = 27, menos 1 sobreposição a resolver. **A Task 1 fecha a conta:** a atribuição acima é hipótese derivada de títulos de seção, não de conteúdo lido. A Task 1 lê os 27 capítulos e produz a atribuição definitiva, com liberdade para mover capítulos entre famílias e para declarar mais lacunas. Um capítulo que não couber em nenhuma família recebe lacuna declarada com motivo — nunca encaixe forçado.

## Por que duas famílias novas

**`tipologia`** — categorias paralelas que coexistem. O capítulo Tipos de Ação Social diz literalmente: *"São tipos ideais: na realidade, as ações costumam combinar mais de um tipo."* Isso não é `contraste-de-posicoes`, onde as posições são rivais e só uma pode valer. Aqui todas valem e se combinam. **A cena precisa mostrar essa combinação**, ou ensina que a realidade se separa em caixas limpas — que é o oposto do que Weber diz.

**`criterios-conjuntivos`** — condições que valem todas ao mesmo tempo. As três características do fato social (exterioridade, coercitividade, generalidade) não são alternativas: um fenômeno só é fato social se as três valerem. Estruturalmente oposto a `tipologia`, que é disjuntiva.

---

### Task 1: Inventário de famílias de Sociologia

**Files:**
- Create: `docs/visual-personalizado/08-familias-sociologia.md`
- Create: `src/views/topic-scenes/data/sociologia.ts` (só os esqueletos)
- Test: `src/views/topic-scenes/familias-sociologia.test.ts`

**Interfaces:**
- Consumes: `SceneEntry` de `../types`; `interactiveSummaries` de `src/data/interactiveSummaries`.
- Produces: `sociologia: SceneEntry[]` (vazio) e `sociologiaSemCena: { chapterId: string; motivo: string }[]`.

- [ ] **Step 1: Ler os 27 capítulos e fechar a atribuição**

Ler o conteúdo real de cada capítulo de Sociologia em `src/data/deepSummaryContent.json`. Confirmar ou corrigir a atribuição hipotética acima. Resolver a sobreposição de "Divisão Social do Trabalho". Decidir, com base no conteúdo e não no título, se `tipologia` e `criterios-conjuntivos` se sustentam — se alguma não se sustentar, dizer isso e não criá-la.

- [ ] **Step 2: Escrever o teste de completude**

`src/views/topic-scenes/familias-sociologia.test.ts`, espelhando `familias.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { sociologia, sociologiaSemCena } from './data/sociologia';

const capitulos = interactiveSummaries.filter((s) => s.subject === 'Sociologia').map((s) => s.id);

describe('Atribuição de família em Sociologia', () => {
  it('cobre os 27 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...sociologia.map((e) => e.chapterId), ...sociologiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulos].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const e of sociologia) expect(ids.has(e.chapterId), e.chapterId).toBe(true);
    for (const g of sociologiaSemCena) expect(ids.has(g.chapterId), g.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const g of sociologiaSemCena) expect(g.motivo.length, g.chapterId).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 3: Rodar — deve falhar**

Run: `npx vitest run src/views/topic-scenes/familias-sociologia.test.ts`
Expected: FAIL, módulo não encontrado.

- [ ] **Step 4: Criar o esqueleto de dados**

`src/views/topic-scenes/data/sociologia.ts`:

```ts
import type { SceneEntry } from '../types';

/** Capítulos de Sociologia sem cena-âncora, com o motivo. */
export const sociologiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-sociologia-solidariedade-mecanica-e-solidariedade-organica',
    motivo: 'Já tem experiência interativa própria (solidarity) no mesmo slot do fluxo de Explorar.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4 preenchem. */
export const sociologia: SceneEntry[] = [];
```

- [ ] **Step 5: Rodar — falha apontando os 26 capítulos faltantes**

Run: `npx vitest run src/views/topic-scenes/familias-sociologia.test.ts`
Expected: FAIL no primeiro caso, listando os 26 ids. **Esse é o estado correto ao fim desta tarefa** — as Tasks 2-4 o levam ao verde. Anotar no commit.

- [ ] **Step 6: Escrever o documento de famílias**

`docs/visual-personalizado/08-familias-sociologia.md`: a atribuição definitiva capítulo a capítulo; para cada família nova, o capítulo que a originou e por que as 5 existentes não a representam, citando o texto da fonte; a lacuna declarada e seu motivo; e a nota de que família nova exige registro aqui.

- [ ] **Step 7: Commit**

```bash
git add docs/visual-personalizado/08-familias-sociologia.md src/views/topic-scenes/data/sociologia.ts src/views/topic-scenes/familias-sociologia.test.ts
git commit -m "docs(visual): inventario de familias de cena de Sociologia

O teste de completude fica vermelho de proposito ate as entradas serem escritas."
```

---

### Task 2: As duas famílias novas

**Files:**
- Create: `src/views/topic-scenes/families/Tipologia.tsx` + `.test.tsx`
- Create: `src/views/topic-scenes/families/CriteriosConjuntivos.tsx` + `.test.tsx`
- Modify: `src/views/topic-scenes/types.ts` (acrescentar as duas chaves a `SceneFamily`)
- Modify: `src/views/topic-scenes/TopicScene.css` (APPEND)

**Interfaces:**
- Consumes: `useSceneMotion()`, `SceneEntry`.
- Produces: `Tipologia({ entry })`, `CriteriosConjuntivos({ entry })`. A Task 5 registra as duas no dispatcher.

- [ ] **Step 1: Acrescentar as chaves ao type**

Em `src/views/topic-scenes/types.ts`, acrescentar `| 'tipologia'` e `| 'criterios-conjuntivos'` a `SceneFamily`. Aditivo; não altera as 34 entradas de Filosofia.

- [ ] **Step 2: Escrever os testes das duas famílias, antes dos componentes**

Cada teste deve cobrir, com uma entrada-fixture própria: estado inicial, seleção por teclado com `aria-pressed`, troca de seleção sem acumular, e a citação visível. Para `Tipologia`, um teste a mais e obrigatório: **a cena deve comunicar que os tipos se combinam na realidade** — asserir a presença desse texto na tela. Para `CriteriosConjuntivos`, um teste obrigatório: **a cena deve deixar explícito que os critérios valem em conjunto, não em alternativa**.

- [ ] **Step 3: Rodar — devem falhar**

Run: `npx vitest run src/views/topic-scenes/families/Tipologia.test.tsx src/views/topic-scenes/families/CriteriosConjuntivos.test.tsx`
Expected: FAIL, módulos não encontrados.

- [ ] **Step 4: Escrever `Tipologia.tsx`**

Estrutura: cada item é um tipo; selecionar um destaca-o e mostra `claim` + `quote`. O movimento anima a transição entre tipos selecionados. **Requisito de honestidade, derivado da fonte:** a cena precisa exibir, de forma persistente e não escondida atrás de clique, que os tipos são ideais e se combinam na realidade. O texto dessa nota vem de um campo da entrada, **não chumbado no componente** — acrescentar `nota?: string` a `SceneEntry` e renderizá-lo. Sem `nota`, renderizar nada (não um texto genérico inventado).

Seguir o padrão de `ContrasteDePosicoes.tsx`: `<section className="tc-scene">`, header com `<small>` kicker e `<h4>` pergunta, SVG com `role="img"` e `aria-label` que reflete o estado, botões com `aria-pressed`, `role="status"` para a afirmação, `blockquote.tc-quote` com `<cite>` para a citação.

- [ ] **Step 5: Escrever `CriteriosConjuntivos.tsx`**

Estrutura: os critérios aparecem juntos; o usuário pode marcar/desmarcar cada um e a cena mostra que o conceito só se sustenta com todos marcados. O movimento anima o preenchimento de cada critério e o estado do conjunto. Mesmo padrão de acessibilidade.

- [ ] **Step 6: Acrescentar o CSS**

APPEND em `src/views/topic-scenes/TopicScene.css`, no idioma das classes existentes (`.tc-*`, tokens `--vs-*`, `.dark .tc-scene` já define a sobreposição de burgundy). Não recriar nem alterar regra existente.

- [ ] **Step 7: Rodar os testes e o portão de movimento**

Run: `npx vitest run src/views/topic-scenes/families src/views/topic-scenes/movimento.test.ts`
Expected: PASS em tudo.

- [ ] **Step 8: Commit**

```bash
git add src/views/topic-scenes/families/Tipologia.tsx src/views/topic-scenes/families/Tipologia.test.tsx src/views/topic-scenes/families/CriteriosConjuntivos.tsx src/views/topic-scenes/families/CriteriosConjuntivos.test.tsx src/views/topic-scenes/types.ts src/views/topic-scenes/TopicScene.css
git commit -m "feat(visual): familias de tipologia e criterios conjuntivos"
```

---

### Task 3: Entradas das famílias novas e das reusadas (lote 1 — 13 capítulos)

**Files:** Modify `src/views/topic-scenes/data/sociologia.ts`

**Interfaces:** Consumes o esqueleto da Task 1 e as famílias da Task 2. Produces: 13 entradas em `sociologia`.

- [ ] **Step 1: Escrever as entradas de `tipologia` e `criterios-conjuntivos`**

Para cada capítulo dessas duas famílias (conforme a atribuição fechada na Task 1), ler o conteúdo real e escrever a entrada. Regras, todas verificadas pelo portão: `section` é título exato; `quote` é copiado e colado do `content` daquela seção; `claim` é sustentado pelo `quote` e nunca o contradiz; `question` é a pergunta que a cena responde. Para `tipologia`, preencher `nota` com o texto da própria fonte sobre combinação de tipos.

- [ ] **Step 2: Escrever as entradas de `contraste-de-posicoes` de Sociologia**

Mesmas regras.

- [ ] **Step 3: Verificar o lastro das entradas deste lote**

Rodar um teste descartável que passe cada entrada nova por `validarLastro` contra `interactiveSummaries` real. Apagar o arquivo depois; confirmar `git status` limpo.

- [ ] **Step 4: Rodar a suíte**

Run: `npx vitest run src/views/topic-scenes`
Expected: tudo passa exceto `familias-sociologia.test.ts`, que ainda aponta os capítulos do lote 2.

- [ ] **Step 5: Commit**

```bash
git add src/views/topic-scenes/data/sociologia.ts
git commit -m "feat(visual): entradas de tipologia, criterios e contrastes em Sociologia"
```

---

### Task 4: Entradas das famílias restantes (lote 2 — 13 capítulos)

**Files:** Modify `src/views/topic-scenes/data/sociologia.ts`

**Interfaces:** Produces as entradas restantes; ao fim, `familias-sociologia.test.ts` fica verde.

- [ ] **Step 1: Escrever as entradas de `cadeia-de-derivacao`**

Atenção ao que a Fase 1 ensinou: esta família afirma que **cada elo decorre do anterior e remover um quebra a conclusão**. Uma lista de tópicos relacionados arranjada em sequência é defeito, não cadeia. Se um capítulo não apresenta derivação real, reportar em vez de forçar.

- [ ] **Step 2: Escrever as entradas de `camadas-de-determinacao`**

Esta família afirma **assimetria**: `items[0]` é a base que condiciona as demais. Se a fonte apresenta elementos coordenados e não hierárquicos, não é esta família. (Defeito real da Fase 1: a Alienação foi espremida aqui quando a fonte falava em "quatro formas interligadas".)

- [ ] **Step 3: Escrever as entradas de `escala-de-graus` e `movimento-dialetico`**

Para `escala-de-graus`, preencher `eixo` com legenda verdadeira para aquela escala — nunca deixar a legenda genérica descrever uma escala que não é de valor. Para `movimento-dialetico`, os 3 momentos precisam incluir a negação real que a fonte apresenta, não três tópicos sequenciais.

- [ ] **Step 4: Verificar o lastro de todas as 26 entradas**

Teste descartável passando as 26 por `validarLastro`. Apagar depois.

- [ ] **Step 5: Rodar a suíte inteira**

Run: `npx vitest run src/views/topic-scenes`
Expected: **tudo verde, incluindo `familias-sociologia.test.ts`** (26 entradas + 1 lacuna = 27).

- [ ] **Step 6: Commit**

```bash
git add src/views/topic-scenes/data/sociologia.ts
git commit -m "feat(visual): completa entradas de cena de Sociologia"
```

---

### Task 5: Registro no seletor, no dispatcher e no auditor

**Files:**
- Modify: `src/views/topic-scenes/sceneFor.ts`
- Modify: `src/views/topic-scenes/TopicScene.tsx`
- Modify: `scripts/auditVisualJourney.ts` (se a contagem for por matéria)
- Test: `src/views/topic-scenes/sceneFor.test.ts` (acrescentar casos)

- [ ] **Step 1: Ler os três arquivos antes de editar**

Entender como `sceneFor.ts` monta `todas` a partir de `filosofia` e como `TopicScene.tsx` mapeia `SceneFamily` para componente.

- [ ] **Step 2: Escrever os casos de teste novos**

Acrescentar a `sceneFor.test.ts`: uma cena de Sociologia é encontrada pelo id exato; a lacuna declarada devolve `null`; `entradasValidas()` cobre Filosofia + Sociologia.

- [ ] **Step 3: Registrar**

Em `sceneFor.ts`, incluir `sociologia` em `todas`. Em `TopicScene.tsx`, acrescentar `tipologia` e `criterios-conjuntivos` ao mapa `FAMILIAS`.

- [ ] **Step 4: Conferir o auditor**

Confirmar que `anchorScenes` de Sociologia passa a refletir as entradas válidas em `docs/visual-personalizado/04-cobertura-percurso.json`. Regenerar o relatório.

- [ ] **Step 5: Rodar a suíte inteira**

Run: `npm test`
Expected: verde.

- [ ] **Step 6: Commit**

```bash
git add src/views/topic-scenes/sceneFor.ts src/views/topic-scenes/TopicScene.tsx src/views/topic-scenes/sceneFor.test.ts scripts/auditVisualJourney.ts docs/visual-personalizado/04-cobertura-percurso.json
git commit -m "feat(visual): liga as cenas de Sociologia ao fluxo Explorar"
```

---

### Task 6: Auditoria de citações e estrutura

**Files:** Create `docs/visual-personalizado/08-familias-sociologia.md` (seção de verificação)

Esta tarefa existe porque a Fase 1 provou que os portões automáticos não pegam três classes de erro: `claim` que contradiz seu `quote`, estrutura de família forçada, e texto fixo no componente que afirma algo de um capítulo.

- [ ] **Step 1: Auditoria independente das 26 entradas**

Verificar cada `quote` contra `deepSummaryContent.json` — rederivando, não conferindo relatório. Verificar cada `section` como título exato. Verificar cada `claim` contra seu `quote`. Verificar a estrutura de cada entrada contra o que a fonte apresenta. Verificar `nota` e `eixo` onde existirem.

- [ ] **Step 2: Corrigir o que a auditoria achar**

- [ ] **Step 3: Verificação em navegador**

Subir `npm run dev`, contornar onboarding com `localStorage.setItem('juju_onboarding','true')`, abrir ao menos um capítulo de cada família nova em desktop escuro e celular claro. Confirmar: a cena monta em Explorar, persiste ao trocar de etapa, some em Testar, é acionável por teclado, sem overflow, sem animação infinita, console limpo. Capturar em `docs/visual-personalizado/screenshots/cenas-sociologia/`.

- [ ] **Step 4: Registrar a verificação no doc de famílias, com os limites**

- [ ] **Step 5: Gate e PR**

```bash
npm run lint && npm test
git push -u origin feature/cenas-sociologia
```
Abrir PR com título e descrição dizendo o que entrou, a atribuição de famílias, as duas famílias novas e por quê, e os limites declarados. **O merge é decisão da usuária, não automático.**

---

## Estado ao fim da Fase 2

26 dos 27 capítulos de Sociologia com cena-âncora animada e com lastro; 1 lacuna declarada com motivo. Sete famílias no total. Restam História 49, Geografia 63, Literatura 37, Gramática 26, Redação 58 = 233 capítulos, cada matéria com plano próprio.

Os limites do desenho continuam valendo: o portão de lastro não pega leitura equivocada, o portão de movimento é estático, capítulos da mesma família se parecem entre si, e os 613 tópicos seguem sem prancha autoral individual.
