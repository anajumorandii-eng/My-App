# Inventário visual e lote de Ecologia — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produzir um inventário honesto dos 613 capítulos e substituir seis cenas genéricas de Ecologia por seis mecanismos visuais específicos em um lote revisável.

**Architecture:** `visualCandidates` continua escolhendo o artefato primário. Um inventário separado cruza essa escolha com registros manuais de revisão, sem deduzir qualidade da existência de rota. Dois módulos de Ecologia compartilham controles e lastro, mas cada ID de capítulo escolhe sua própria geometria e consequência observável; o registro da cena continua por ID exato.

**Tech Stack:** React 19, TypeScript, Vite, `motion/react`, Vitest, Testing Library, SVG/CSS e scripts Node com `tsx` já instalado.

**Spec:** `docs/superpowers/specs/2026-09-23-visual-expansion-design.md`

**Scope:** Fundação do lote 0 e seis capítulos do lote 1. Biomagnificação está na PR #202; não copiá-la nem sobrescrevê-la. Os demais capítulos da Biologia e as outras matérias pertencem a planos posteriores baseados no mesmo inventário.

## Global Constraints

- Vínculo por ID exato de `InteractiveSummary.id`; nenhuma correspondência por palavra-chave.
- `section`, `quote` e `claim` de `SceneEntry` continuam sustentados pelo conteúdo do capítulo e não são gerados a partir do título.
- Matéria define universo e movimento; tópico define artefato; estado pedagógico define comportamento.
- Explorar, Testar e Reconstruir mantêm o estado e a evidência existentes em `visualStudy`; novos diagramas vivem dentro da representação primária.
- Cada capítulo tem relação central e geometria própria. Cor, texto ou ícone trocados não contam como visual novo.
- Inspeção em 360–390 px, tablet e desktop, temas claro/escuro, teclado, movimento reduzido, console e rede antes de `aprovado`.
- PR #202 deve ser considerada em rebase/merge antes de editar `BiologiaProcessos.tsx` ou `artifactId.ts`; não substituir os IDs já adicionados.

## Review Focus

1. Capítulo recém-adicionado sem revisão aparece como `nao-revisado`, nunca como aprovado por ter instrumento.
2. Registro de revisão para ID inexistente ou duplicado falha com mensagem que nomeia o ID.
3. Um capítulo com experimento/prancha prioritária mantém seu vencedor mesmo se também possuir cena de Ecologia.
4. Em tela estreita, os seis diagramas preservam rótulos, controles e largura da página; nenhum SVG perde informação essencial por escala.
5. Com movimento reduzido e teclado, cada seleção altera o resultado anunciado sem depender da animação.

---

### Task 1: Inventário de qualidade dos 613 capítulos

**Files:**
- Create: `src/views/visualQuality.ts`, `src/views/visualQualityReviews.ts`, `src/views/visualQuality.test.ts`
- Create: `scripts/updateVisualQuality.ts`, `docs/visual-personalizado/27-qualidade-visual.json`
- Modify: `package.json` (script `visual:quality`)

**Interfaces:** Consumes `interactiveSummaries`, `buildVisualCoverage`, `CoverageRow`. Produces `QualityReview { chapterId: string; mechanism: string; relation: string; status: 'insuficiente' | 'em-validacao' | 'aprovado'; evidencePaths: string[]; notes: string }` and `buildQualityInventory(summaries: InteractiveSummary[], reviews: QualityReview[]): QualityRow[]`, where `QualityRow` includes `id`, `subject`, `artifact`, `primary`, `status`, `mechanism`, `relation`, `evidencePaths`, `notes`. No review becomes `nao-revisado` with empty evidence.

- [ ] **Step 1: Write the failing test.** Use two real summaries from `interactiveSummaries` and assert the actual winner is preserved:

```ts
const rows = buildQualityInventory([
  chapter('bio-ecologia-introducao'), chapter('bio-ecologia-sucessao'),
], []);
expect(rows.map(row => [row.id, row.primary, row.status])).toEqual([
  ['bio-ecologia-introducao', 'experiment', 'nao-revisado'],
  ['bio-ecologia-sucessao', 'scene', 'nao-revisado'],
]);
expect(() => buildQualityInventory([chapter('bio-ecologia-sucessao')], [review('inexistente')]))
  .toThrow(/inexistente/);
expect(() => buildQualityInventory([chapter('bio-ecologia-sucessao')], [review('bio-ecologia-sucessao'), review('bio-ecologia-sucessao')]))
  .toThrow(/bio-ecologia-sucessao/);
```

`chapter(id)` finds `interactiveSummaries` by ID; `review(chapterId)` returns an `em-validacao` record with `mechanism: 'sucessao'`, `relation: 'mudança de comunidade'`, `evidencePaths: []`, `notes: ''`. These helpers live only in the test.

- [ ] **Step 2: Run `npm exec vitest run src/views/visualQuality.test.ts`.** Expected: missing module/function failure.
- [ ] **Step 3: Implement inventory.** Map `buildVisualCoverage(summaries).rows`; build a `Map` of reviews after rejecting unknown and repeated IDs; join on `chapterId`. Export `visualQualityReviews: QualityReview[] = []`. In `scripts/updateVisualQuality.ts`, write `JSON.stringify(buildQualityInventory(interactiveSummaries, visualQualityReviews), null, 2) + '\n'` to the report. Add `"visual:quality": "node --import tsx scripts/updateVisualQuality.ts"` to `package.json`.
- [ ] **Step 4: Add a stale-report test:** compare the checked-in JSON with `buildQualityInventory(interactiveSummaries, visualQualityReviews)` and assert length `613`, unique IDs `613`, `aprovado` count `0` initially. Run `npm run visual:quality` and `npm exec vitest run src/views/visualQuality.test.ts`; expected: pass.
- [ ] **Step 5: Commit** `feat: registra qualidade visual sem inferir aprovacao`.

### Task 2: Cenas específicas dos ciclos de nitrogênio e eutrofização

**Files:**
- Create: `src/views/topic-scenes/families/EcologyCycles.tsx`, `EcologyCycles.css`, `EcologyCycles.test.tsx`

**Interfaces:** Exports `ECOLOGY_CYCLE_IDS: ReadonlySet<string>` and `EcologyCycles({entry}: {entry: SceneEntry})`. Consumes `entry.items` and `useSceneMotion`; renders `role="img"` and one button per item with `aria-pressed`, followed by `role="status"` containing `claim`, `quote`, `section`.

- [ ] **Step 1: Write two failing tests** using entries from `src/views/topic-scenes/data/biologia.ts`:

```tsx
render(<EcologyCycles entry={entry('bio-ecologia-ciclo-nitrogenio')} />);
expect(screen.getByRole('img', {name: /N₂.*amônia.*nitrito.*nitrato.*N₂/i})).toBeVisible();
await user.click(screen.getByRole('button', {name: /Desnitrificação/}));
expect(screen.getByRole('status')).toHaveTextContent('atmosfera');

render(<EcologyCycles entry={entry('bio-ecologia-eutrofizacao')} />);
expect(screen.getByRole('img', {name: /nutrientes.*floração.*luz.*oxigênio.*peixes/i})).toBeVisible();
await user.click(screen.getByRole('button', {name: /Anoxia/}));
expect(screen.getByRole('status')).toHaveTextContent('anoxia');
```

- [ ] **Step 2: Run `npm exec vitest run src/views/topic-scenes/families/EcologyCycles.test.tsx`.** Expected: missing component failure.
- [ ] **Step 3: Implement two distinct SVGs.** Nitrogênio: atmosfera N₂ no topo, solo com matéria orgânica/amônia/nitrito/nitrato, raízes absorvendo nitrato e retorno por desnitrificação; cinco botões destacam a conversão correspondente. Eutrofização: seção vertical de lago, nutrientes na entrada, floração na superfície, queda de luz, decompositores consumindo O₂ e peixes sob hipóxia; seis botões destacam a consequência correta. Usar `entry.items[active]` para lastro, `motion` apenas nas partes selecionadas e `useSceneMotion()` para transição; SVG tem `viewBox`, descrição acessível completa e CSS responsivo sem largura mínima que cause overflow.

```tsx
export const ECOLOGY_CYCLE_IDS = new Set([
  'bio-ecologia-ciclo-nitrogenio', 'bio-ecologia-eutrofizacao',
]);
const nitrogen = entry.chapterId === 'bio-ecologia-ciclo-nitrogenio';
const labels = nitrogen
  ? ['N₂', 'amônia', 'nitrito', 'nitrato', 'N₂']
  : ['nutrientes', 'floração', 'luz bloqueada', 'oxigênio consumido', 'anoxia', 'peixes'];
return <section className="tc-scene" aria-label={entry.question}>
  <svg viewBox="0 0 620 360" role="img" aria-label={nitrogen
    ? 'Ciclo do nitrogênio: N₂ → amônia → nitrito → nitrato → N₂'
    : 'Eutrofização: nutrientes → floração → luz bloqueada → oxigênio consumido → anoxia → peixes'}>
    {nitrogen
      ? <><path d="M45 250H575" stroke="currentColor"/><text x="45" y="45">atmosfera · N₂</text>
          <text x="45" y="270">solo · amônia → nitrito → nitrato</text>
          <path d="M540 250V70H100V250" fill="none" stroke="currentColor"/></>
      : <><rect x="45" y="90" width="530" height="210" fill="var(--vs-blue)" opacity=".25"/>
          <path d="M45 130H575" stroke="currentColor"/><text x="45" y="75">floração superficial</text>
          <text x="45" y="325">menos luz e O₂ · peixes sob hipóxia</text></>}
    {labels.map((label, index) => <text key={`${label}-${index}`} x={65 + index * 85}
      y={nitrogen ? 185 : 220} opacity={active === index ? 1 : .45}>{label}</text>)}
  </svg>
  {entry.items.map((item, index) => <button key={item.label} type="button"
    aria-pressed={index === active} onClick={() => setActive(index)}>{item.label}</button>)}
  <aside role="status">{entry.items[active].claim}<blockquote>
    {entry.items[active].quote}<cite>{entry.items[active].section}</cite>
  </blockquote></aside>
</section>;
```

Se o número de estágios do conteúdo não coincidir com `labels`, ajustar a geometria ao conteúdo real antes de registrar a cena; o teste deve então refletir o mecanismo correto.
- [ ] **Step 4: Run o teste e `npm run lint`;** expected: pass. Conferir que o texto da cena não afirma números ausentes de `entry.items`.
- [ ] **Step 5: Commit** `feat: desenha ciclos ecologicos por mecanismo`.

### Task 3: Cenas de população, invasoras, sucessão e poluição da água

**Files:**
- Create: `src/views/topic-scenes/families/EcologySystems.tsx`, `EcologySystems.css`, `EcologySystems.test.tsx`

**Interfaces:** Exports `ECOLOGY_SYSTEM_IDS: ReadonlySet<string>` e `EcologySystems({entry}: {entry: SceneEntry})`. Same accessible control/lastro contract from Task 2, with four diagram types selected by exact ID.

- [ ] **Step 1: Write four failing tests**, one per chapter:

```tsx
const cases = [
  ['bio-ecologia-dinamica-populacoes', /muitos descendentes.*poucos descendentes/i, /K-estrategistas/],
  ['bio-ecologia-invasoras-controle-biologico', /invasora.*nativa.*recurso/i, /Competição/],
  ['bio-ecologia-sucessao', /pioneira.*gramíneas.*arbustos.*árvores/i, /Comunidade clímax/],
  ['bio-ecologia-ciclo-hidrologico-poluicao-agua', /fonte.*água.*efeito/i, /Térmica/],
] as const;
for (const [id, name, choice] of cases) {
  const view = render(<EcologySystems entry={entry(id)} />);
  expect(screen.getByRole('img', {name})).toBeVisible();
  await user.click(screen.getByRole('button', {name: choice}));
  expect(screen.getByRole('status')).toHaveTextContent(entry(id).items.find(item => choice.test(item.label))!.claim);
  view.unmount();
}
```

- [ ] **Step 2: Run `npm exec vitest run src/views/topic-scenes/families/EcologySystems.test.tsx`.** Expected: missing component failure.
- [ ] **Step 3: Implement four different mechanisms:** população como dois perfis de descendência/cuidado parental (sem apresentar uma curva quantitativa inventada); invasão como cinco caminhos de impacto entre espécie invasora, nativas, recurso e ambiente; sucessão como três estágios de comunidades com solo/gramíneas/arbustos/árvores; poluição da água como fonte, meio aquático e efeito para cada um dos cinco agentes descritos no capítulo. Seleção muda elementos destacados e um resultado textual, mantendo `quote` e `section`. Usar CSS com disposição vertical a até 390 px e `prefers-reduced-motion` via `useSceneMotion()`.

```tsx
export const ECOLOGY_SYSTEM_IDS = new Set([
  'bio-ecologia-dinamica-populacoes',
  'bio-ecologia-invasoras-controle-biologico',
  'bio-ecologia-sucessao',
  'bio-ecologia-ciclo-hidrologico-poluicao-agua',
]);
const diagramById: Record<string, React.ComponentType<{active: number}>> = {
  'bio-ecologia-dinamica-populacoes': PopulationProfiles,
  'bio-ecologia-invasoras-controle-biologico': InvasionWeb,
  'bio-ecologia-sucessao': SuccessionLandscape,
  'bio-ecologia-ciclo-hidrologico-poluicao-agua': WaterPollution,
};
const Diagram = diagramById[entry.chapterId];
return <section className="tc-scene" aria-label={entry.question}>
  <Diagram active={active}/>
  {entry.items.map((item, index) => <button key={item.label} type="button"
    aria-pressed={index === active} onClick={() => setActive(index)}>{item.label}</button>)}
  <aside role="status">{entry.items[active].claim}<blockquote>
    {entry.items[active].quote}<cite>{entry.items[active].section}</cite>
  </blockquote></aside>
</section>;
```
- [ ] **Step 4: Run testes do módulo e `npm run lint`;** expected: pass.
- [ ] **Step 5: Commit** `feat: desenha sistemas ecologicos por capitulo`.

### Task 4: Integrar seis cenas sem alterar a arbitragem

**Files:**
- Modify: `src/views/topic-scenes/TopicScene.tsx`, `src/views/topic-scenes/artifactId.ts`
- Test: `src/views/visualCoverage.test.ts`, `src/views/topic-scenes/TopicScene.test.tsx` (criar se ausente)
- Regenerate: `docs/visual-personalizado/18-matriz-cobertura.json`
- Modify: `src/views/visualQualityReviews.ts`, regenerate `27-qualidade-visual.json`

**Interfaces:** `TopicScene` selects `EcologyCycles`/`EcologySystems` before the generic `FAMILIAS[entry.family]` using the exported sets. `sceneArtifactId` maps the six IDs to six meaningful IDs (`nitrogenio-solo-atmosfera`, `eutrofizacao-lago`, `estrategias-reprodutivas`, `invasao-impactos`, `sucessao-comunidades`, `poluicao-agua-agentes`).

- [ ] **Step 1: Write failing routing assertions** for six IDs: mount `<TopicScene summaryId={id}/>` and expect a diagram accessible name unique to its mechanism; assert `visualCandidates(chapter('bio-ecologia-introducao'))[0]` remains `{kind:'experiment', id:'ecology'}` and a sibling Biologia chapter outside the six keeps its current representation.
- [ ] **Step 2: Run `npm exec vitest run src/views/topic-scenes/TopicScene.test.tsx src/views/visualCoverage.test.ts`.** Expected: six missing mechanism diagrams; existing winner assertion remains green.
- [ ] **Step 3: Add exact-ID routing and artifact IDs.** Preserve all pre-existing entries in `artifactId.ts`, including those from PR #202 if present. Add six `QualityReview` records with `status: 'em-validacao'`, `mechanism` and `relation` matching their SVG, empty evidence and a note `Aguardando inspeção visual em navegador`. Do not mark `aprovado` yet.

```tsx
if (ECOLOGY_CYCLE_IDS.has(entry.chapterId))
  return <div className="vs-handdrawn-container"><EcologyCycles entry={entry}/></div>;
if (ECOLOGY_SYSTEM_IDS.has(entry.chapterId))
  return <div className="vs-handdrawn-container"><EcologySystems entry={entry}/></div>;
// A lógica atual de seleção das outras famílias permanece abaixo destes retornos.
```

Em `artifactId.ts`, adicionar o mapa exato de seis IDs descrito em **Interfaces** a `DEDICATED_SCENES`; não alterar as chaves já existentes. Em `visualQualityReviews.ts`, registrar cada um dos seis IDs apenas uma vez.
- [ ] **Step 4: Run `npm run visual:matrix`, `npm run visual:quality` and the two test files.** Expected: 613 rows in each report, six artifact IDs updated, six `em-validacao`, zero falsely approved, no change to coverage counts.
- [ ] **Step 5: Commit** `feat: integra seis cenas ecologicas e registra validacao`.

### Task 5: Validação de lote e decisão de qualidade

**Files:**
- Create: `docs/visual-personalizado/28-validacao-ecologia.md`
- Save captures: `docs/visual-personalizado/screenshots/ecologia/` for representative mechanisms in both themes and 360–390 px, tablet and desktop; include exact chapter IDs and viewport in filenames.
- Modify: `src/views/visualQualityReviews.ts` and regenerate `27-qualidade-visual.json` only for chapters that actually pass the full gate.

**Interfaces:** Report links the six `QualityRow` records to screenshot paths and records any failing chapter as `em-validacao` or `insuficiente`.

- [ ] **Step 1: Run `npm exec vitest run src/views/topic-scenes/families/EcologyCycles.test.tsx src/views/topic-scenes/families/EcologySystems.test.tsx src/views/topic-scenes/TopicScene.test.tsx src/views/visualCoverage.test.ts src/views/visualQuality.test.ts`, `npm run lint`, `npm run build`, `git diff --check`.** Save results in the report. Run `npm test` from a checkout with `public/` materialized; if this checkout remains sparse, report each failure by file and do not claim a full green suite.
- [ ] **Step 2: Open six exact chapter routes in a real browser.** For each: click/select first and final stages, inspect quote/result, test keyboard and reduced motion, theme contrast, console errors from the app and network failures. Capture 360–390 px, tablet and desktop per distinct diagram type; verify `document.documentElement.scrollWidth <= document.documentElement.clientWidth`. A protected Vercel preview requiring login is not visual evidence.
- [ ] **Step 3: Record findings.** Only change `em-validacao` to `aprovado` for individual chapters with evidence of all requirements. Re-run `npm run visual:quality`, relevant tests, lint and build after any correction; otherwise leave status honest.
- [ ] **Step 4: Commit** `docs: registra validacao das cenas ecologicas`. Open a draft PR with the six scene changes, inventory, test results and remaining blockers. Do not merge until the quality gate is satisfied.

## Self-review mapping to the spec

- Inventário de 613 IDs, estados honestos e relatório: Task 1.
- Topologia própria, lastro e seleção para o primeiro subconjunto de Ciências da Natureza: Tasks 2–4.
- Arbítrio exclusivo, comportamento pedagógico, acesso, QA por dispositivo e tema: Tasks 4–5.
- Demais capítulos e lotes de Matemática, Geografia, Humanidades e Linguagens: outros planos após validar a fundação; este plano não os marca completos.
