# Complete Interactive Summaries Corpus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar um resumo interativo completo, rastreável e testado para cada tópico das 11 matérias fornecidas pela usuária.

**Architecture:** Um manifesto curricular literal define cobertura e IDs; módulos por matéria/frente exportam `InteractiveSummary[]`; um agregador único alimenta a tela existente. OCR e separação de capítulos geram evidência temporária por matéria, enquanto o inventário versionado guarda arquivo, capítulo e páginas. Cada lote fecha com auditoria de cobertura antes do próximo.

**Tech Stack:** React 19, TypeScript 5.8, Node test runner, Vitest/Testing Library, Python, Bash, Poppler, Tesseract.

**Spec:** `docs/superpowers/specs/2026-08-27-complete-interactive-summaries-corpus-design.md`

## Global Constraints

- Cada tópico fornecido pela usuária corresponde a exatamente um resumo completo.
- IDs publicados não mudam; `bio-ecologia-eutrofizacao` e seus IDs internos permanecem compatíveis.
- Todo resumo contém `rapida`, `aprofundamento`, `prova`, recuperação ativa e fonte resolvível.
- Nenhum placeholder, entrada “em preparação” ou conteúdo sem fonte entra no catálogo.
- OCR completo permanece em `/tmp`; somente metadados curados são versionados.
- Não reproduzir extensamente textos protegidos; Inglês e Literatura usam exemplos autorais e paráfrases.
- Não alterar `package.json` e `package-lock.json`, já modificados pela usuária, salvo autorização posterior específica.
- Cada matéria deve passar testes direcionados antes de iniciar a seguinte.

---

### Task 1: Manifesto curricular e contratos globais

**Files:**
- Create: `src/data/summaryCurriculum.ts`
- Create: `src/lib/summaryCoverage.ts`
- Create: `src/lib/summaryCoverage.test.ts`
- Modify: `src/types/summary.ts`
- Modify: `src/data/summaryMaterials.ts`
- Modify: `src/lib/summaryCatalog.ts`
- Test: `src/lib/summaryCatalog.test.ts`

**Interfaces:**
- Produces: `CurriculumSubject`, `CurriculumTopic`, `summaryCurriculum`, `auditSummaryCoverage(curriculum, summaries)` e metadados de apostila em `SummaryMaterial`/`SummarySource`.
- Consumes: `InteractiveSummary[]` e o catálogo atual.

- [ ] Escrever teste falho que exige 11 matérias, nomes únicos e auditoria de ausências/duplicatas/extras.

```ts
const audit = auditSummaryCoverage(summaryCurriculum, interactiveSummaries);
assert.equal(summaryCurriculum.length, 11);
assert.ok(audit.missing.length > 0);
assert.deepEqual(audit.duplicates, []);
assert.deepEqual(audit.invalidSubjects, []);
```

- [ ] Rodar `npm run test:node -- src/lib/summaryCoverage.test.ts` e confirmar falha por módulos ausentes.
- [ ] Implementar o manifesto literal com todas as frentes, semestres e tópicos enviados; `CurriculumTopic` contém `id`, `title`, `subject`, `track` e `semester?: 1 | 2`.
- [ ] Implementar auditoria pura por `subject + topic`, retornando `{ missing, duplicates, extras, invalidSubjects }`.
- [ ] Aplicar os contratos de proveniência e profundidade definidos na Task 1 do plano `2026-08-27-ecologia-interactive-summaries.md`.
- [ ] Rodar `npm run test:node -- src/lib/summaryCoverage.test.ts src/lib/summaryCatalog.test.ts && npm run lint` e confirmar PASS.
- [ ] Commit: `git add src/data/summaryCurriculum.ts src/lib/summaryCoverage.ts src/lib/summaryCoverage.test.ts src/types/summary.ts src/data/summaryMaterials.ts src/lib/summaryCatalog.ts src/lib/summaryCatalog.test.ts && git commit -m "feat: define complete summary curriculum"`.

---

### Task 2: Biologia — Ecologia

**Files:** todos os arquivos indicados em `docs/superpowers/plans/2026-08-27-ecologia-interactive-summaries.md`.

**Interfaces:**
- Consumes: contratos da Task 1 e apostilas `Biologia (v1) 1–4.pdf`.
- Produces: 11 resumos de Ecologia e auditoria de cobertura sem ausências para a frente `Ecologia` do 1º semestre.

- [ ] Executar integralmente as Tasks 1–6 de `2026-08-27-ecologia-interactive-summaries.md`, omitindo apenas alterações de contrato já concluídas na Task 1 deste plano.
- [ ] Acrescentar asserção de lote:

```ts
assert.deepEqual(
  auditSummaryCoverage(summaryCurriculum, interactiveSummaries).missing.filter((item) => item.subject === 'Biologia' && item.track === 'Ecologia' && item.semester === 1),
  [],
);
```

- [ ] Rodar testes, lint e build especificados no plano de Ecologia.
- [ ] Commit final do lote: `git commit -m "feat: publish ecology interactive summaries"` apenas se houver mudanças ainda não commitadas pelo plano subordinado.

---

### Task 3: Biologia — demais frentes

**Files:**
- Create: `src/data/summaries/biology/{microbiology,botany,plantPhysiology,cellBiology,zoology,animalPhysiology,genetics,evolution}.ts`
- Create: `src/data/summaries/biology/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:**
- Consumes: capítulos de `scripts/apostila-topics/biologia.json` e contratos globais.
- Produces: todos os resumos restantes de Biologia, incluindo `Biomas brasileiros`.

- [ ] Executar OCR dos quatro PDFs de Biologia e separar capítulos em `/tmp/juju-biologia-chapters.json` conforme o plano de Ecologia.
- [ ] Escrever teste falho:

```ts
assert.deepEqual(auditSummaryCoverage(summaryCurriculum, interactiveSummaries).missing.filter((x) => x.subject === 'Biologia'), []);
```

- [ ] Produzir módulos por frente, preservando título curricular e usando perguntas de mecanismo, comparação ou previsão.
- [ ] Registrar um `SummaryMaterial` de apostila por capítulo com páginas observadas.
- [ ] Rodar `npm run test:node -- src/lib/summaryCoverage.test.ts src/lib/summaryCatalog.test.ts && npm run lint && npm run build`.
- [ ] Commit: `git add src/data/summaries/biology src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete biology interactive summaries"`.

---

### Task 4: Física

**Files:**
- Create: `src/data/summaries/physics/{newtonianDynamics,energy,impulse,thermophysics,statics,electricity,electromagnetism,optics,waves}.ts`
- Create: `src/data/summaries/physics/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa de `Física`; consome `Física (v1) 1–4.pdf`.

- [ ] Gerar `/tmp/juju-fisica-chapters.json` com OCR e `scripts/apostila-topics/fisica.json`.
- [ ] Escrever teste falho `assert.deepEqual(audit.missing.filter(x => x.subject === 'Física'), [])`.
- [ ] Criar resumos com grandezas, relações, condições de validade, interpretação gráfica e erro típico; fórmulas usam texto compatível com o renderizador atual.
- [ ] Preservar `fis-termologia-calor` e remover duplicata curricular correspondente do novo módulo.
- [ ] Registrar fontes e páginas, rodar testes de cobertura/catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/physics src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete physics interactive summaries"`.

---

### Task 5: Geografia

**Files:**
- Create: `src/data/summaries/geography/{general,brasil}.ts`
- Create: `src/data/summaries/geography/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa de `Geografia`; consome `Geografia (v1) 1–4.pdf`.

- [ ] Gerar `/tmp/juju-geografia-chapters.json` com `scripts/apostila-topics/geografia.json`.
- [ ] Escrever teste falho de ausência zero para `Geografia`.
- [ ] Criar resumos separando fato, processo espacial, escala, agentes, conflitos e leitura cartográfica; reutilizar `geo-bonus-demografico` quando corresponder ao tópico literal e preservar seu ID.
- [ ] Registrar fontes/páginas e rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/geography src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete geography interactive summaries"`.

---

### Task 6: História

**Files:**
- Create: `src/data/summaries/history/{general,brasil}.ts`
- Create: `src/data/summaries/history/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa de `História`; consome `História (v1) 1–4.pdf`.

- [ ] Gerar `/tmp/juju-historia-chapters.json` com `scripts/apostila-topics/historia.json`.
- [ ] Escrever teste falho de ausência zero para `História`.
- [ ] Criar resumos com cronologia mínima, estruturas, agentes, causalidade, permanências/rupturas e exercício de análise documental autoral.
- [ ] Registrar fontes/páginas e rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/history src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete history interactive summaries"`.

---

### Task 7: Inglês

**Files:**
- Create: `src/data/summaries/english/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces os 17 tópicos de `Língua Inglesa`; consome `Inglês (v1) 1–4.pdf`.

- [ ] Gerar `/tmp/juju-ingles-chapters.json` com `scripts/apostila-topics/ingles.json`.
- [ ] Escrever teste falho de ausência zero para `Língua Inglesa`.
- [ ] Criar cada resumo como estratégia de compreensão aplicada ao tema, com microtextos autorais em inglês, vocabulário contextual, inferência e pergunta de transferência; não copiar textos extensos da apostila.
- [ ] Registrar fontes/páginas e rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/english src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete english interactive summaries"`.

---

### Task 8: Redação

**Files:**
- Create: `src/data/summaries/essay/{semesterOne,semesterTwo}.ts`
- Create: `src/data/summaries/essay/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa de `Redação`; consome capítulos correspondentes de `Português (v1) 1–4.pdf` e `src/data/essayModule.ts` quando convergente.

- [ ] Gerar ou reutilizar `/tmp/juju-portugues-chapters.json` com `scripts/apostila-topics/portugues.json`.
- [ ] Escrever teste falho de ausência zero para `Redação`.
- [ ] Criar resumos com regra acionável, exemplo autoral, contraexemplo, diagnóstico e exercício; manter competências, direitos humanos e proposta de intervenção conforme fontes.
- [ ] Registrar fontes/páginas e rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/essay src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete essay interactive summaries"`.

---

### Task 9: Gramática, Literatura e Entendimento de Texto

**Files:**
- Create: `src/data/summaries/portuguese/{grammar,literature,textComprehension}.ts`
- Create: `src/data/summaries/portuguese/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa das três matérias; consome `Português (v1) 1–4.pdf`.

- [ ] Escrever três testes falhos de ausência zero, um por matéria.
- [ ] Criar Gramática com exemplos autorais e análise contextual; Literatura com contexto, forma, procedimentos e comparação sem transcrição extensa; Entendimento de Texto com operações observáveis de leitura.
- [ ] Registrar materiais por capítulo usando `/tmp/juju-portugues-chapters.json`.
- [ ] Rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/portuguese src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete portuguese interactive summaries"`.

---

### Task 10: Matemática

**Files:**
- Create: `src/data/summaries/mathematics/{numeric,geometry,algebra}.ts`
- Create: `src/data/summaries/mathematics/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa de `Matemática`; consome `Matemática (v1) 1–4.pdf`.

- [ ] Gerar `/tmp/juju-matematica-chapters.json` com `scripts/apostila-topics/matematica.json`.
- [ ] Escrever teste falho de ausência zero para `Matemática`.
- [ ] Criar resumos com modelo, procedimento justificado, representação, condições de validade, erro típico e problema de transferência; preservar `mat-probabilidade-contagem` quando corresponder e evitar duplicata.
- [ ] Registrar fontes/páginas e rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/mathematics src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete mathematics interactive summaries"`.

---

### Task 11: Química

**Files:**
- Create: `src/data/summaries/chemistry/{atomistics,general,organic,physical}.ts`
- Create: `src/data/summaries/chemistry/index.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Modify: `src/data/summaryMaterials.ts`
- Test: `src/lib/summaryCoverage.test.ts`

**Interfaces:** Produces cobertura completa de `Química`; consome `Química (v1) 1–4.pdf`.

- [ ] Gerar `/tmp/juju-quimica-chapters.json` com `scripts/apostila-topics/quimica.json`.
- [ ] Escrever teste falho de ausência zero para `Química`.
- [ ] Criar resumos com níveis macroscópico, submicroscópico e simbólico, cálculos quando pertinentes, mecanismo e erro típico; preservar `qui-equilibrio-acidificacao` somente onde corresponder sem duplicar tópico.
- [ ] Registrar fontes/páginas e rodar cobertura, catálogo, lint e build.
- [ ] Commit: `git add src/data/summaries/chemistry src/data/interactiveSummaries.ts src/data/summaryMaterials.ts src/lib/summaryCoverage.test.ts && git commit -m "feat: complete chemistry interactive summaries"`.

---

### Task 12: Auditoria global, interface e entrega

**Files:**
- Modify: `src/views/Resumos.ui.test.tsx`
- Modify only if required: `src/views/Resumos.tsx`
- Modify: `src/lib/summaryCoverage.test.ts`
- Create: `docs/superpowers/verification/2026-08-27-complete-interactive-summaries.md`

**Interfaces:** Consome todo o corpus; produz auditoria global vazia e evidência de verificação.

- [ ] Tornar o teste global estrito:

```ts
assert.deepEqual(auditSummaryCoverage(summaryCurriculum, interactiveSummaries), {
  missing: [], duplicates: [], extras: [], invalidSubjects: [],
});
```

- [ ] Adicionar teste de interface que seleciona cada uma das 11 matérias, encontra ao menos um cartão, abre um resumo e alterna `Revisão rápida`, `Aprofundamento` e `Aplicação em prova`.
- [ ] Medir renderização do catálogo em teste; só adicionar paginação/agrupamento se o fluxo atual demonstrar falha ou lentidão material.
- [ ] Rodar, nesta ordem:

```bash
npm run test:node
npm run test:vitest
npm run lint
npm run build
git diff --check
```

- [ ] Registrar no relatório data, contagem por matéria, contagem total, comandos e códigos de saída; não declarar sucesso com tópico ausente.
- [ ] Commit: `git add src/views/Resumos.ui.test.tsx src/views/Resumos.tsx src/lib/summaryCoverage.test.ts docs/superpowers/verification/2026-08-27-complete-interactive-summaries.md && git commit -m "test: verify complete interactive summary corpus"`, omitindo `src/views/Resumos.tsx` se não alterado.
