# Ecologia Interactive Summaries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar 11 resumos interativos completos do 1º semestre de Ecologia, preservando o resumo existente de Eutrofização e vinculando todo conteúdo às apostilas internas de Biologia.

**Architecture:** O OCR e o separador de capítulos existentes produzem evidência temporária em `/tmp`; apenas metadados curados de proveniência entram no repositório. Um módulo `ecologyInteractiveSummaries.ts` concentra o lote e é concatenado pelo catálogo atual, enquanto o validador tipado protege IDs, fontes, seções, perguntas e os três níveis pedagógicos.

**Tech Stack:** React 19, TypeScript 5.8, Vitest/Testing Library, Node test runner, scripts Python/Bash com Poppler e Tesseract.

**Spec:** `docs/superpowers/specs/2026-08-27-ecologia-interactive-summaries-design.md`

## Global Constraints

- O lote contém exatamente os 11 tópicos de Ecologia do 1º semestre listados na especificação.
- O ID publicado `bio-ecologia-eutrofizacao` não pode mudar.
- Todo resumo publicado deve ter fonte interna resolvível; não publicar placeholders ou entradas “em preparação”.
- As fontes conceituais primárias são `materiais brutos/Biologia (v1) 1.pdf` a `materiais brutos/Biologia (v1) 4.pdf`.
- Conteúdo incerto ou reconstruído deve manter aviso explícito.
- Preservar progresso local/remoto e todos os contratos existentes de `InteractiveSummary`.
- Não incluir Ecologia do 2º semestre nem outras frentes de Biologia neste lote.
- Não alterar as mudanças locais preexistentes em `package.json` e `package-lock.json`.

---

## File Structure

- Create `src/data/ecologyInteractiveSummaries.ts`: único catálogo autoral dos 11 resumos de Ecologia.
- Modify `src/data/interactiveSummaries.ts`: remover a definição inline de Eutrofização e concatenar `ecologyInteractiveSummaries` depois dos dois resumos legados restantes.
- Modify `src/data/summaryMaterials.ts`: registrar os 11 capítulos de apostila e seus metadados de arquivo/páginas.
- Modify `src/types/summary.ts`: adicionar metadados opcionais de página/capítulo às fontes internas sem quebrar consumidores.
- Modify `src/lib/summaryCatalog.ts`: validar fonte sem localização e ausência dos três níveis pedagógicos.
- Modify `src/lib/summaryCatalog.test.ts`: contrato do lote, proveniência e falhas de catálogo.
- Modify `src/views/Resumos.ui.test.tsx`: busca, abertura e troca de modo em um resumo novo.
- Use `scripts/ocr-apostila.sh`, `scripts/split-chapters.py` e `scripts/apostila-topics/biologia.json` sem modificá-los; seus artefatos ficam em `/tmp`.

---

### Task 1: Proveniência dos capítulos de Ecologia

**Files:**
- Modify: `src/types/summary.ts`
- Modify: `src/data/summaryMaterials.ts`
- Modify: `src/lib/summaryCatalog.ts`
- Test: `src/lib/summaryCatalog.test.ts`
- Read: `scripts/apostila-topics/biologia.json`
- Read: `materiais brutos/Biologia (v1) 1.pdf`
- Read: `materiais brutos/Biologia (v1) 2.pdf`
- Read: `materiais brutos/Biologia (v1) 3.pdf`
- Read: `materiais brutos/Biologia (v1) 4.pdf`

**Interfaces:**
- Consumes: `validateSummaryCatalog(summaries: InteractiveSummary[], materials: SummaryMaterial[]): SummaryCatalogIssue[]`.
- Produces: `SummaryMaterial` com `format: 'apostila'`, `chapter?: string`, `startPage?: number`, `endPage?: number`; `SummarySource` com os mesmos metadados opcionais; códigos `missing-source-location` e `missing-depth`.

- [ ] **Step 1: Escrever testes falhos de metadados e validação**

Adicionar casos literais a `src/lib/summaryCatalog.test.ts`:

```ts
test('aceita capítulo de apostila com localização resolvível', () => {
  const material = {
    id: 'bio-eco-introducao', subject: 'Biologia', topic: 'Introdução à Ecologia',
    format: 'apostila' as const, sourceFile: 'materiais brutos/Biologia (v1) 1.pdf',
    chapter: 'Introdução à Ecologia', startPage: 10, endPage: 22,
  };
  const source = { ...interactiveSummaries[0], sources: [{ label: material.chapter, kind: 'material-interno' as const, materialId: material.id, chapter: material.chapter, startPage: 10, endPage: 22 }] };
  assert.deepEqual(validateSummaryCatalog([source], [material]), []);
});

test('rejeita fonte de apostila sem capítulo ou páginas e resumo sem os três níveis', () => {
  const material = { id: 'bio-eco-incompleto', subject: 'Biologia', topic: 'Ecologia', format: 'apostila' as const, sourceFile: 'bio.pdf' };
  const summary = { ...interactiveSummaries[0], sections: interactiveSummaries[0].sections.filter((section) => section.depth !== 'prova'), sources: [{ label: 'Ecologia', kind: 'material-interno' as const, materialId: material.id }] };
  const codes = validateSummaryCatalog([summary], [material]).map((issue) => issue.code);
  assert.ok(codes.includes('missing-source-location'));
  assert.ok(codes.includes('missing-depth'));
});
```

- [ ] **Step 2: Rodar o teste e confirmar vermelho**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: FAIL de compilação porque `'apostila'`, `chapter`, `startPage`, `endPage`, `missing-source-location` e `missing-depth` ainda não pertencem aos contratos.

- [ ] **Step 3: Estender contratos e validador minimamente**

Em `src/types/summary.ts`, estender `SummarySource`:

```ts
export interface SummarySource {
  label: string;
  kind: 'material-interno' | 'fonte-oficial' | 'fonte-independente';
  materialId?: string;
  url?: string;
  verifiedAt?: string;
  chapter?: string;
  startPage?: number;
  endPage?: number;
}
```

Em `src/data/summaryMaterials.ts`, alterar `format` para `'roteiro' | 'questao-discursiva' | 'estrategia' | 'apostila'` e adicionar os três metadados opcionais. Em `src/lib/summaryCatalog.ts`, emitir `missing-source-location` quando um material `apostila` não tiver `chapter` ou intervalo válido (`startPage > 0`, `endPage >= startPage`), e um `missing-depth` por profundidade ausente entre `rapida`, `aprofundamento` e `prova`.

- [ ] **Step 4: Extrair e separar a apostila em artefatos temporários**

Run:

```bash
mkdir -p /tmp/juju-ecologia-pdfs
cp "materiais brutos/Biologia (v1) 1.pdf" /tmp/juju-ecologia-pdfs/
cp "materiais brutos/Biologia (v1) 2.pdf" /tmp/juju-ecologia-pdfs/
cp "materiais brutos/Biologia (v1) 3.pdf" /tmp/juju-ecologia-pdfs/
cp "materiais brutos/Biologia (v1) 4.pdf" /tmp/juju-ecologia-pdfs/
bash scripts/ocr-apostila.sh /tmp/juju-ecologia-pdfs /tmp/juju-biologia-ocr.txt 4
python3 scripts/split-chapters.py biologia /tmp/juju-biologia-ocr.txt /tmp/juju-biologia-chapters.json scripts/apostila-topics/biologia.json
```

Expected: saída relata `bio_ecologia` com conteúdo e o JSON lista, para cada capítulo, `volume`, `startPage`, `endPage` e `text`. Se qualquer um dos 11 capítulos não for identificado, localizar seu título no OCR com `rg -n -i` e revisar manualmente as páginas contíguas; não inventar intervalo.

- [ ] **Step 5: Registrar os 11 materiais observados**

Adicionar a `summaryMaterials` um registro por capítulo, usando os valores efetivamente observados no JSON. Os IDs permanentes são:

```ts
[
  'bio-eco-introducao', 'bio-eco-dinamica-populacoes', 'bio-eco-invasoras-controle',
  'bio-eco-sucessao', 'bio-eco-ciclo-carbono', 'bio-eco-ciclo-nitrogenio',
  'bio-eco-ciclo-hidrologico', 'bio-eco-eutrofizacao', 'bio-eco-poluicao-ar',
  'bio-eco-biomagnificacao', 'bio-eco-aquecimento-pops-biorremediacao',
]
```

Cada entrada usa `subject: 'Biologia'`, o título curricular literal em `topic`, `format: 'apostila'`, o volume observado em `sourceFile`, e os campos `chapter`, `startPage`, `endPage` observados.

- [ ] **Step 6: Rodar testes direcionados**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/types/summary.ts src/data/summaryMaterials.ts src/lib/summaryCatalog.ts src/lib/summaryCatalog.test.ts
git commit -m "feat: track ecology summary provenance"
```

---

### Task 2: Resumo-padrão de Introdução à Ecologia

**Files:**
- Create: `src/data/ecologyInteractiveSummaries.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Test: `src/lib/summaryCatalog.test.ts`

**Interfaces:**
- Consumes: `InteractiveSummary`, `summaryMaterials`, `validateSummaryCatalog` e material `bio-eco-introducao` da Task 1.
- Produces: `ecologyInteractiveSummaries: InteractiveSummary[]`, inicialmente com `bio-ecologia-introducao` e depois ampliado pelas Tasks 3–4.

- [ ] **Step 1: Escrever teste falho do resumo de referência**

```ts
test('publica Introdução à Ecologia com progressão pedagógica e recuperação ativa', () => {
  const summary = interactiveSummaries.find((item) => item.id === 'bio-ecologia-introducao');
  assert.ok(summary);
  assert.equal(summary.subject, 'Biologia');
  assert.equal(summary.topic, 'Introdução à Ecologia');
  assert.deepEqual(new Set(summary.sections.map((section) => section.depth)), new Set(['rapida', 'aprofundamento', 'prova']));
  assert.ok(summary.retrieval.length >= 1);
  assert.ok(summary.sources.some((source) => source.materialId === 'bio-eco-introducao'));
  assert.deepEqual(validateSummaryCatalog(interactiveSummaries, summaryMaterials), []);
});
```

- [ ] **Step 2: Rodar o teste e confirmar vermelho**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: FAIL porque `bio-ecologia-introducao` não existe.

- [ ] **Step 3: Ler somente o trecho extraído do capítulo**

Run: `node -e "const d=require('/tmp/juju-biologia-chapters.json'); const x=d.topics.bio_ecologia.find(x=>x.chapter==='Introdução à Ecologia'); console.log(x.text)"`

Expected: texto delimitado ao capítulo e metadados já registrados; se `x` for indefinido, parar a publicação desse resumo e corrigir a extração da Task 1.

- [ ] **Step 4: Implementar o resumo completo de referência**

Criar `ecologyInteractiveSummaries.ts` com `commonEcologyBoards` e o item `bio-ecologia-introducao`. Ele deve conter: níveis de organização ecológica e distinção habitat/nicho na leitura rápida; fatores bióticos/abióticos, cadeias/teias e fluxo de energia no aprofundamento; interpretação de situação ecológica e estratégia de prova no nível prova. A pergunta `eco-introducao-r1` deve pedir a distinção entre habitat e nicho e exigir literalmente os elementos `local onde vive`, `modo de vida/interações` e `recursos/condições`.

Em `interactiveSummaries.ts`, importar e concatenar `...ecologyInteractiveSummaries` sem alterar a posição relativa dos resumos legados `fis-termologia-calor` e `atu-cop30-belem`.

- [ ] **Step 5: Rodar teste direcionado e checagem de tipos**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts && npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/ecologyInteractiveSummaries.ts src/data/interactiveSummaries.ts src/lib/summaryCatalog.test.ts
git commit -m "feat: add ecology introduction summary"
```

---

### Task 3: Ecologia de populações, invasões e sucessão

**Files:**
- Modify: `src/data/ecologyInteractiveSummaries.ts`
- Test: `src/lib/summaryCatalog.test.ts`

**Interfaces:**
- Consumes: materiais `bio-eco-dinamica-populacoes`, `bio-eco-invasoras-controle`, `bio-eco-sucessao` e `ecologyInteractiveSummaries`.
- Produces: resumos `bio-ecologia-dinamica-populacoes`, `bio-ecologia-invasoras-controle-biologico`, `bio-ecologia-sucessao`.

- [ ] **Step 1: Escrever teste tabular falho dos três tópicos**

```ts
test('publica população, invasões e sucessão uma única vez', () => {
  const expected = [
    ['bio-ecologia-dinamica-populacoes', 'Dinâmica de populações'],
    ['bio-ecologia-invasoras-controle-biologico', 'Espécies invasoras e controle biológico'],
    ['bio-ecologia-sucessao', 'Sucessão ecológica'],
  ];
  for (const [id, topic] of expected) {
    const found = interactiveSummaries.filter((item) => item.id === id && item.topic === topic);
    assert.equal(found.length, 1);
    assert.ok(found[0].retrieval.length >= 1);
    assert.deepEqual(new Set(found[0].sections.map((section) => section.depth)), new Set(['rapida', 'aprofundamento', 'prova']));
  }
});
```

- [ ] **Step 2: Rodar o teste e confirmar vermelho**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: FAIL com zero ocorrências para o primeiro ID.

- [ ] **Step 3: Ler os três capítulos extraídos e produzir conteúdo**

Extrair do JSON temporário apenas os capítulos `Dinâmica de Populações`, `Espécies Invasoras e Controle Biológico` e `Sucessão Ecológica`. Implementar, respectivamente: crescimento exponencial/logístico e capacidade de suporte; etapas de invasão, impacto e risco do controle biológico; sucessão primária/secundária, espécies pioneiras e mudanças de biomassa/diversidade. Cada item deve ter cinco seções (`intuicao`, `conceito`, `aplicacao`, `exercicio`, `estrategia`) e uma pergunta de transferência causal, não uma pergunta de mera definição.

- [ ] **Step 4: Rodar testes e catálogo completo**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: PASS e `validateSummaryCatalog(...)` retorna `[]`.

- [ ] **Step 5: Commit**

```bash
git add src/data/ecologyInteractiveSummaries.ts src/lib/summaryCatalog.test.ts
git commit -m "feat: add ecology population summaries"
```

---

### Task 4: Ciclos biogeoquímicos e água

**Files:**
- Modify: `src/data/ecologyInteractiveSummaries.ts`
- Test: `src/lib/summaryCatalog.test.ts`

**Interfaces:**
- Consumes: materiais `bio-eco-ciclo-carbono`, `bio-eco-ciclo-nitrogenio`, `bio-eco-ciclo-hidrologico`.
- Produces: resumos `bio-ecologia-ciclo-carbono`, `bio-ecologia-ciclo-nitrogenio`, `bio-ecologia-ciclo-hidrologico-poluicao-agua`.

- [ ] **Step 1: Escrever teste falho dos três ciclos**

```ts
test('publica os ciclos de carbono, nitrogênio e água com suas fontes específicas', () => {
  const expected: Record<string, string> = {
    'bio-ecologia-ciclo-carbono': 'bio-eco-ciclo-carbono',
    'bio-ecologia-ciclo-nitrogenio': 'bio-eco-ciclo-nitrogenio',
    'bio-ecologia-ciclo-hidrologico-poluicao-agua': 'bio-eco-ciclo-hidrologico',
  };
  for (const [id, materialId] of Object.entries(expected)) {
    const summary = interactiveSummaries.find((item) => item.id === id);
    assert.ok(summary);
    assert.ok(summary.sources.some((source) => source.materialId === materialId));
  }
});
```

- [ ] **Step 2: Rodar o teste e confirmar vermelho**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: FAIL no primeiro `assert.ok(summary)`.

- [ ] **Step 3: Produzir os três resumos a partir dos capítulos extraídos**

Cobrir: reservatórios e fluxos, fotossíntese/respiração/combustão no carbono; fixação, nitrificação, assimilação, amonificação e desnitrificação no nitrogênio; evapotranspiração, precipitação, infiltração/escoamento e fontes pontuais/difusas de poluição da água. Cada pergunta de recuperação deve exigir reconstruir um ciclo ou prever o efeito de interromper um fluxo.

- [ ] **Step 4: Rodar testes direcionados**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/ecologyInteractiveSummaries.ts src/lib/summaryCatalog.test.ts
git commit -m "feat: add biogeochemical cycle summaries"
```

---

### Task 5: Poluição, biomagnificação e auditoria de Eutrofização

**Files:**
- Modify: `src/data/ecologyInteractiveSummaries.ts`
- Modify: `src/data/interactiveSummaries.ts`
- Test: `src/lib/summaryCatalog.test.ts`

**Interfaces:**
- Consumes: materiais `bio-eco-eutrofizacao`, `bio-eco-poluicao-ar`, `bio-eco-biomagnificacao`, `bio-eco-aquecimento-pops-biorremediacao` e resumo legado `bio-ecologia-eutrofizacao`.
- Produces: resumos `bio-ecologia-eutrofizacao`, `bio-ecologia-poluicao-ar`, `bio-ecologia-biomagnificacao`, `bio-ecologia-aquecimento-global-pops-biorremediacao`; remove a antiga definição inline de Eutrofização.

- [ ] **Step 1: Substituir o teste legado por contrato dos 11 tópicos**

Adicionar uma constante literal com os 11 pares `[id, topic]` e testar:

```ts
const ecology = interactiveSummaries.filter((item) => item.subject === 'Biologia' && item.topic !== 'Biomas brasileiros');
assert.equal(ecology.length, 11);
assert.equal(ecology.filter((item) => item.id === 'bio-ecologia-eutrofizacao').length, 1);
assert.deepEqual(ecology.map((item) => item.topic), expectedEcologyTopics);
assert.deepEqual(validateSummaryCatalog(interactiveSummaries, summaryMaterials), []);
```

Atualizar o teste que antes limitava disciplinas após os três itens iniciais; ele deve verificar os resumos legados por ID, não por posição de array.

- [ ] **Step 2: Rodar o teste e confirmar vermelho**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts`

Expected: FAIL porque o catálogo ainda tem oito resumos de Ecologia ou mantém Eutrofização fora do módulo do lote.

- [ ] **Step 3: Auditar e mover Eutrofização**

Comparar cada afirmação do resumo existente ao capítulo extraído. Preservar `id`, IDs de seção e `eutro-r1` para manter links e progresso. Adicionar a fonte `bio-eco-eutrofizacao` com páginas observadas e conservar `disc_unifesp_bio_2020` somente onde sua reconstrução sustenta a aplicação.

- [ ] **Step 4: Produzir os três resumos inéditos restantes**

Cobrir: poluentes primários/secundários, inversão térmica, chuva ácida e efeitos respiratórios em Poluição do ar; bioacumulação versus biomagnificação e aumento por nível trófico; efeito estufa versus aquecimento global, persistência/lipossolubilidade de POPs e limites/condições da biorremediação. Perguntas devem avaliar mecanismos e distinguir pares conceituais propensos a confusão.

- [ ] **Step 5: Rodar testes do catálogo e domínio de resumos**

Run: `npm run test:node -- src/lib/summaryCatalog.test.ts src/lib/summaryEngine.test.ts src/lib/summaryStudy.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/data/ecologyInteractiveSummaries.ts src/data/interactiveSummaries.ts src/lib/summaryCatalog.test.ts
git commit -m "feat: complete ecology interactive summaries"
```

---

### Task 6: Integração acessível e verificação final

**Files:**
- Modify: `src/views/Resumos.ui.test.tsx`
- Verify: `src/views/Resumos.tsx`

**Interfaces:**
- Consumes: `interactiveSummaries`, filtros e modos atuais da tela `Resumos`.
- Produces: evidência automatizada de busca, abertura e navegação de um resumo novo sem mudança desnecessária de interface.

- [ ] **Step 1: Escrever teste de interface falho**

```tsx
it('localiza e abre Introdução à Ecologia nos três modos', async () => {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={['/resumos']}><Resumos /></MemoryRouter>);
  await user.selectOptions(screen.getByLabelText('Filtrar por disciplina'), 'Biologia');
  await user.type(screen.getByLabelText('Buscar nos resumos'), 'Introdução à Ecologia');
  await user.click(screen.getByRole('button', { name: /Introdução à Ecologia/ }));
  expect(screen.getByRole('heading', { name: 'Introdução à Ecologia' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Aprofundamento' }));
  expect(screen.getByRole('navigation', { name: 'Índice do resumo' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Aplicação em prova' }));
  expect(screen.getByText(/recuperação ativa/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Rodar o teste e confirmar seu estado**

Run: `npm run test:vitest -- src/views/Resumos.ui.test.tsx`

Expected: PASS se os contratos acessíveis atuais já suportarem o novo conteúdo; se falhar, a mensagem deve identificar o primeiro nome acessível ou fluxo quebrado. Não alterar a tela apenas para forçar um seletor artificial.

- [ ] **Step 3: Corrigir somente integração observavelmente quebrada**

Se o cartão não tiver nome acessível completo, adicionar `aria-label={\`Abrir resumo ${item.title}\`}` e ajustar o teste para `/Abrir resumo Introdução à Ecologia/`. Se os botões de modo não forem localizáveis por nome, preservar o texto visual e adicionar `aria-pressed={mode === key}`. Não redesenhar filtros ou layout.

- [ ] **Step 4: Rodar todas as verificações**

Run:

```bash
npm run test:node
npm run test:vitest
npm run lint
npm run build
git diff --check
```

Expected: todos os comandos terminam com exit code `0`; o build não introduz erro de chunk do Firebase.

- [ ] **Step 5: Revisar o lote contra a especificação**

Confirmar manualmente: 11 tópicos e somente os 11; Eutrofização preserva IDs; todas as fontes resolvem; cada resumo tem `rapida`, `aprofundamento`, `prova`; nenhuma string contém “em preparação”, “TODO” ou afirmação de incidência de banca sem fonte.

- [ ] **Step 6: Commit final**

```bash
git add src/views/Resumos.ui.test.tsx src/views/Resumos.tsx
git commit -m "test: verify ecology summary navigation"
```

Se `src/views/Resumos.tsx` não precisar de alteração, não adicioná-lo ao commit. Registrar no handoff os comandos executados, seus resultados e qualquer capítulo não publicado por falta de fonte resolvível.
