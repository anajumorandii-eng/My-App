# Cenas-âncora de Filosofia — Fase 1

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar cena-âncora animada e com lastro no texto do capítulo aos 35 capítulos de Filosofia, provando a arquitetura de famílias antes das outras seis matérias.

**Architecture:** Módulo novo `src/views/topic-scenes/`, com três camadas separadas — componentes de família que só sabem desenhar, dados escritos à mão por capítulo que só sabem afirmar, e um seletor que liga os dois por ID exato de capítulo. Dois portões automáticos barram o que não tem lastro no texto e o que não anima por `motion/react`. Sem entrada válida, a tela volta ao aviso de lacuna.

**Tech Stack:** React 18, TypeScript, `motion/react`, Vitest + Testing Library, SVG autoral.

**Spec:** `docs/superpowers/specs/2026-09-15-cenas-humanidades-design.md`

## Global Constraints

- Vínculo capítulo→cena sempre por **ID exato**. Nunca por palavra-chave, matéria ou fragmento de título. Não estender `src/views/visual-boards/registry.ts`.
- Toda família importa de `motion/react` e consome `useSceneMotion()`. Proibido `repeat: Infinity`.
- Movimento reduzido tem duração zero, via `MOTION_DURATION`/`MOTION_EASE` de `src/design-system/motion/tokens`.
- Toda afirmação de cena cita `section` (título exato de uma seção do capítulo) e `quote` (trecho literal daquela seção).
- Normalização do lastro: caixa e espaço em branco. **Nunca** acento.
- Falha fechada: entrada ausente ou com lastro inválido ⇒ `sceneFor` devolve `null` ⇒ lacuna honesta.
- Toda interação acionável por teclado, com estado acessível (`aria-pressed`, `aria-current`), no padrão de `src/views/topic-experiments/TopicExperiment.tsx`.
- Commits: sem identificadores de modelo na mensagem. Trabalho direto em `main`, no worktree `C:/wt-visual-personalizado`.
- Gate antes de qualquer push: `npm run lint` (`tsc --noEmit`) limpo e `npm test` verde.

---

### Task 1: Tipos, hook de movimento e o portão de lastro

**Files:**
- Create: `src/views/topic-scenes/types.ts`
- Create: `src/views/topic-scenes/useSceneMotion.ts`
- Create: `src/views/topic-scenes/lastro.ts`
- Test: `src/views/topic-scenes/lastro.test.ts`

**Interfaces:**
- Consumes: `InteractiveSummary`, `SummarySection` de `src/types/summary.ts`; `MOTION_DURATION`, `MOTION_EASE` de `src/design-system/motion/tokens`.
- Produces: `SceneFamily`, `SceneItem`, `SceneEntry`, `LastroIssue` (types.ts); `useSceneMotion(): { duration: number; ease: unknown }`; `validarLastro(entry: SceneEntry, summary: InteractiveSummary | undefined): LastroIssue[]`.

- [ ] **Step 1: Escrever o teste que prova o portão rejeitando**

`src/views/topic-scenes/lastro.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { validarLastro } from './lastro';
import type { InteractiveSummary } from '../../types/summary';
import type { SceneEntry } from './types';

const capitulo = {
  id: 'summary-teste',
  sections: [{ id: 's1', title: 'A linha e seus segmentos', content: 'Na República, Platão propõe que se divida uma linha em dois segmentos desiguais.' }],
} as unknown as InteractiveSummary;

const entrada = (quote: string, section = 'A linha e seus segmentos'): SceneEntry => ({
  chapterId: 'summary-teste',
  family: 'escala-de-graus',
  question: 'Quantos graus de conhecimento a linha separa?',
  items: [{ label: 'eikasia', claim: 'o grau mais distante do inteligível', section, quote }],
});

describe('Portão de lastro', () => {
  it('aceita o trecho que está literalmente na seção citada', () => {
    expect(validarLastro(entrada('divida uma linha em dois segmentos desiguais'), capitulo)).toEqual([]);
  });

  it('aceita diferença de caixa e de espaço em branco', () => {
    expect(validarLastro(entrada('DIVIDA   uma linha\nem dois segmentos'), capitulo)).toEqual([]);
  });

  it('rejeita trecho inventado que não está no capítulo', () => {
    expect(validarLastro(entrada('quatro graus de realidade segundo Aristóteles'), capitulo))
      .toEqual([{ chapterId: 'summary-teste', label: 'eikasia', reason: 'trecho-ausente' }]);
  });

  it('rejeita acento trocado, porque acento não é normalizado', () => {
    expect(validarLastro(entrada('Na Republica, Platao propoe'), capitulo))
      .toEqual([{ chapterId: 'summary-teste', label: 'eikasia', reason: 'trecho-ausente' }]);
  });

  it('rejeita seção que não existe no capítulo', () => {
    expect(validarLastro(entrada('divida uma linha', 'Doxa e episteme'), capitulo))
      .toEqual([{ chapterId: 'summary-teste', label: 'eikasia', reason: 'secao-ausente' }]);
  });

  it('rejeita entrada cujo capítulo não existe no catálogo', () => {
    expect(validarLastro(entrada('divida uma linha'), undefined))
      .toEqual([{ chapterId: 'summary-teste', label: '—', reason: 'capitulo-ausente' }]);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/lastro.test.ts`
Expected: FAIL — `Failed to resolve import "./lastro"`.

- [ ] **Step 3: Escrever os tipos**

`src/views/topic-scenes/types.ts`:

```ts
/** As estruturas conceituais que o material de Filosofia realmente pede.
 *  Uma família nova só nasce quando uma matéria pede estrutura que nenhuma
 *  destas representa — e isso vira nota no documento de famílias. */
export type SceneFamily =
  | 'contraste-de-posicoes'
  | 'escala-de-graus'
  | 'cadeia-de-derivacao'
  | 'camadas-de-determinacao'
  | 'movimento-dialetico';

/** Uma afirmação da cena e o trecho do capítulo que a sustenta. */
export interface SceneItem {
  /** Rótulo curto exibido na cena. */
  label: string;
  /** O que a cena afirma sobre esse rótulo. */
  claim: string;
  /** Título exato de uma seção do capítulo. */
  section: string;
  /** Trecho literal daquela seção que sustenta o claim. */
  quote: string;
}

export interface SceneEntry {
  /** ID exato do capítulo. Nunca palavra-chave. */
  chapterId: string;
  family: SceneFamily;
  /** A pergunta que a cena responde, exibida no cabeçalho. */
  question: string;
  items: SceneItem[];
}

export type LastroReason = 'capitulo-ausente' | 'secao-ausente' | 'trecho-ausente';
export interface LastroIssue { chapterId: string; label: string; reason: LastroReason; }
```

- [ ] **Step 4: Escrever o validador**

`src/views/topic-scenes/lastro.ts`:

```ts
import type { InteractiveSummary } from '../../types/summary';
import type { LastroIssue, SceneEntry } from './types';

/** Caixa e espaço em branco são normalizados. Acento, nunca: trocar "Platão"
 *  por "Platao" é uma citação que não está no texto. */
const normalizar = (texto: string) => texto.replace(/\s+/g, ' ').trim().toLowerCase();

export function validarLastro(
  entry: SceneEntry,
  summary: InteractiveSummary | undefined,
): LastroIssue[] {
  if (!summary) return [{ chapterId: entry.chapterId, label: '—', reason: 'capitulo-ausente' }];
  const issues: LastroIssue[] = [];
  for (const item of entry.items) {
    const section = summary.sections.find((s) => s.title === item.section);
    if (!section) {
      issues.push({ chapterId: entry.chapterId, label: item.label, reason: 'secao-ausente' });
      continue;
    }
    if (!normalizar(section.content).includes(normalizar(item.quote))) {
      issues.push({ chapterId: entry.chapterId, label: item.label, reason: 'trecho-ausente' });
    }
  }
  return issues;
}
```

- [ ] **Step 5: Rodar o teste para confirmar que passa**

Run: `npx vitest run src/views/topic-scenes/lastro.test.ts`
Expected: PASS, 6 testes.

- [ ] **Step 6: Escrever o hook de movimento**

`src/views/topic-scenes/useSceneMotion.ts`:

```ts
import { useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASE } from '../../design-system/motion/tokens';

/** Todo movimento das cenas passa por aqui: é o que o portão do movimento
 *  verifica, e é o que garante duração zero sob movimento reduzido. */
export function useSceneMotion() {
  const reduced = useReducedMotion();
  return { duration: reduced ? 0 : MOTION_DURATION.entrance, ease: MOTION_EASE };
}
```

- [ ] **Step 7: Confirmar que o TypeScript aceita**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 8: Commit**

```bash
git add src/views/topic-scenes/types.ts src/views/topic-scenes/lastro.ts src/views/topic-scenes/lastro.test.ts src/views/topic-scenes/useSceneMotion.ts
git commit -m "feat(visual): portão de lastro das cenas de capítulo"
```

---

### Task 2: Portão do movimento

**Files:**
- Create: `src/views/topic-scenes/families/.gitkeep`
- Test: `src/views/topic-scenes/movimento.test.ts`

**Interfaces:**
- Consumes: nada de tarefas anteriores; lê os arquivos de `families/` do disco.
- Produces: nenhuma API — é um portão. Fixa o contrato que as Tasks 4-8 precisam cumprir: cada `families/*.tsx` importa de `motion/react`, chama `useSceneMotion()` e não usa `repeat: Infinity`.

- [ ] **Step 1: Escrever o teste do portão**

`src/views/topic-scenes/movimento.test.ts`:

```ts
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';

const dir = fileURLToPath(new URL('./families', import.meta.url));
const familias = readdirSync(dir).filter((f) => f.endsWith('.tsx'));

describe('Portão do movimento', () => {
  it.each(familias)('%s anima por motion/react', (arquivo) => {
    const src = readFileSync(join(dir, arquivo), 'utf8');
    expect(src, `${arquivo} precisa importar motion/react`).toMatch(/from ['"]motion\/react['"]/);
    expect(src, `${arquivo} precisa consumir useSceneMotion()`).toMatch(/useSceneMotion\(\)/);
    expect(src, `${arquivo} não pode ter animação infinita`).not.toMatch(/repeat:\s*Infinity/);
  });
});
```

- [ ] **Step 2: Criar o diretório e rodar o teste**

```bash
mkdir -p src/views/topic-scenes/families
touch src/views/topic-scenes/families/.gitkeep
npx vitest run src/views/topic-scenes/movimento.test.ts
```
Expected: PASS sem casos — `it.each` com lista vazia não roda nada. Isso é esperado enquanto não há família; as Tasks 4-8 povoam o diretório.

- [ ] **Step 3: Provar que o portão reprova de verdade**

Criar temporariamente `src/views/topic-scenes/families/Sonda.tsx`:

```tsx
export function Sonda() {
  return <svg viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="none" stroke="currentColor" /></svg>;
}
```

Run: `npx vitest run src/views/topic-scenes/movimento.test.ts`
Expected: FAIL — "Sonda.tsx precisa importar motion/react".

- [ ] **Step 4: Remover a sonda e confirmar verde**

```bash
rm src/views/topic-scenes/families/Sonda.tsx
npx vitest run src/views/topic-scenes/movimento.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/views/topic-scenes/movimento.test.ts src/views/topic-scenes/families/.gitkeep
git commit -m "feat(visual): portão de movimento das famílias de cena"
```

---

### Task 3: Inventário de famílias de Filosofia

**Files:**
- Create: `docs/visual-personalizado/07-familias-filosofia.md`
- Create: `src/views/topic-scenes/data/filosofia.ts` (só os esqueletos de lista, sem entradas)
- Test: `src/views/topic-scenes/familias.test.ts`

**Interfaces:**
- Consumes: `SceneEntry` de `./types`; `interactiveSummaries` de `src/data/interactiveSummaries`.
- Produces: `filosofia: SceneEntry[]` e `filosofiaSemCena: { chapterId: string; motivo: string }[]` — as Tasks 4-8 acrescentam entradas a `filosofia`.

A atribuição abaixo saiu da leitura das seções dos 35 capítulos em `src/data/deepSummaryContent.json`. Cada família responde a uma estrutura que aparece repetidamente no material.

| Família | Estrutura | Capítulos |
|---|---|---|
| `contraste-de-posicoes` | Respostas rivais à mesma pergunta, comparadas por critério explícito | Crítica da Razão Pura; Fé e Razão; Teoria das Ideias; Empirismo Britânico; Filosofia Política Contemporânea; Heráclito e Parmênides; Justiça e Direitos Humanos; Ideal Iluminista; Filósofos da Physis; Sofistas; Patrística e Agostinho; Política Aristotélica; Racionalismo Continental; Ética Aplicada e Bioética (14) |
| `escala-de-graus` | Degraus ordenados entre dois extremos, com o que muda a cada degrau | Linha Dividida; Ética a Nicômaco; Descartes e a Dúvida; Mito da Caverna (4) |
| `cadeia-de-derivacao` | Passos encadeados; remover um quebra a conclusão | Crítica de Hume; Ética Kantiana; Escolástica; Hobbes; Locke; Lógica e Metafísica Aristotélicas; Existencialismo de Sartre; Rousseau (8) |
| `camadas-de-determinacao` | Uma camada condiciona a outra | Escola de Frankfurt; Luta de Classes; Alienação e Mais-Valia; Foucault; Materialismo Histórico (5) |
| `movimento-dialetico` | Ciclo que transforma os dois termos ao se completar | Hegel; Nietzsche; Método Socrático (3) |
| *sem cena* | — | Do Mito ao Logos (1) |

"Do Mito ao Logos" fica sem cena-âncora porque já tem experiência interativa própria (`myth` em `topic-experiments/catalog.ts`); duas peças no mesmo capítulo competiriam pelo mesmo slot.

- [ ] **Step 1: Escrever o teste de completude da atribuição**

`src/views/topic-scenes/familias.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { filosofia, filosofiaSemCena } from './data/filosofia';

const capitulosDeFilosofia = interactiveSummaries.filter((s) => s.subject === 'Filosofia').map((s) => s.id);

describe('Atribuição de família em Filosofia', () => {
  it('cobre os 35 capítulos, cada um exatamente uma vez', () => {
    const atribuidos = [...filosofia.map((e) => e.chapterId), ...filosofiaSemCena.map((g) => g.chapterId)];
    expect(new Set(atribuidos).size, 'nenhum capítulo atribuído duas vezes').toBe(atribuidos.length);
    expect([...atribuidos].sort()).toEqual([...capitulosDeFilosofia].sort());
  });

  it('só cita capítulos que existem no catálogo', () => {
    const ids = new Set(interactiveSummaries.map((s) => s.id));
    for (const entry of filosofia) expect(ids.has(entry.chapterId), entry.chapterId).toBe(true);
    for (const gap of filosofiaSemCena) expect(ids.has(gap.chapterId), gap.chapterId).toBe(true);
  });

  it('declara um motivo para cada lacuna', () => {
    for (const gap of filosofiaSemCena) expect(gap.motivo.length, gap.chapterId).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/familias.test.ts`
Expected: FAIL — `Failed to resolve import "./data/filosofia"`.

- [ ] **Step 3: Criar o arquivo de dados com a lacuna declarada**

`src/views/topic-scenes/data/filosofia.ts`:

```ts
import type { SceneEntry } from '../types';

/** Capítulos de Filosofia sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas. */
export const filosofiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos',
    motivo: 'Já tem experiência interativa própria (myth) no mesmo slot do fluxo de Explorar.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 4-8
 *  preenchem esta lista, família por família. */
export const filosofia: SceneEntry[] = [];
```

- [ ] **Step 4: Rodar o teste — deve falhar apontando os 34 capítulos que faltam**

Run: `npx vitest run src/views/topic-scenes/familias.test.ts`
Expected: FAIL no primeiro caso, com o diff listando os 34 ids ausentes. **Esse é o estado correto ao fim desta tarefa** — o teste fica vermelho e as Tasks 4-8 o levam ao verde. Anotar isso no commit.

- [ ] **Step 5: Escrever o documento de famílias**

Criar `docs/visual-personalizado/07-familias-filosofia.md` com: a tabela de atribuição acima na íntegra; para cada família, o capítulo que a originou e a estrutura conceitual que ela representa; a lacuna declarada e seu motivo; e a nota de que famílias novas nas fases seguintes exigem registro neste documento.

- [ ] **Step 6: Commit**

```bash
git add docs/visual-personalizado/07-familias-filosofia.md src/views/topic-scenes/data/filosofia.ts src/views/topic-scenes/familias.test.ts
git commit -m "docs(visual): inventário de famílias de cena de Filosofia

O teste de completude fica vermelho de propósito até as entradas das
cinco famílias serem escritas."
```

---

### Task 4: Família contraste-de-posicoes e seus 14 capítulos

**Files:**
- Create: `src/views/topic-scenes/families/ContrasteDePosicoes.tsx`
- Create: `src/views/topic-scenes/TopicScene.css`
- Modify: `src/views/topic-scenes/data/filosofia.ts`
- Test: `src/views/topic-scenes/families/ContrasteDePosicoes.test.tsx`

**Interfaces:**
- Consumes: `useSceneMotion()` da Task 1; `SceneEntry`, `SceneItem` de `../types`.
- Produces: `ContrasteDePosicoes({ entry }: { entry: SceneEntry })` — componente React; a Task 9 o registra no dispatcher.

- [ ] **Step 1: Escrever o teste da família**

`src/views/topic-scenes/families/ContrasteDePosicoes.test.tsx`:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ContrasteDePosicoes } from './ContrasteDePosicoes';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-heraclito-e-parmenides-o-ser-e-o-devir',
  family: 'contraste-de-posicoes',
  question: 'O que é real: o que muda ou o que permanece?',
  items: [
    { label: 'Heráclito', claim: 'o devir é o real; a permanência é aparência', section: 'Heráclito e o devir', quote: 'tudo flui' },
    { label: 'Parmênides', claim: 'o ser é; o não-ser não é, e mudar exigiria não-ser', section: 'Parmênides e o ser', quote: 'o ser é' },
  ],
};

describe('Contraste de posições', () => {
  it('abre com a pergunta e nenhuma posição escolhida', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('O que é real');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('revela a afirmação só quando a posição é escolhida', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Parmênides' }));
    expect(screen.getByRole('status')).toHaveTextContent('mudar exigiria não-ser');
    expect(screen.getByRole('button', { name: 'Parmênides' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Heráclito' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('troca a afirmação ao trocar de posição, sem acumular as duas', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Parmênides' }));
    fireEvent.click(screen.getByRole('button', { name: 'Heráclito' }));
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('a permanência é aparência');
    expect(status).not.toHaveTextContent('não-ser');
  });

  it('mostra o trecho citado do capítulo sob demanda', () => {
    render(<ContrasteDePosicoes entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Heráclito' }));
    fireEvent.click(screen.getByRole('button', { name: 'Ver o trecho do capítulo' }));
    expect(screen.getByText(/tudo flui/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/families/ContrasteDePosicoes.test.tsx`
Expected: FAIL — `Failed to resolve import "./ContrasteDePosicoes"`.

- [ ] **Step 3: Escrever o componente**

`src/views/topic-scenes/families/ContrasteDePosicoes.tsx`:

```tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Respostas rivais à mesma pergunta. O movimento mostra o peso migrando de
 *  uma posição para a outra — é a comparação, não uma entrada decorativa. */
export function ContrasteDePosicoes({ entry }: { entry: SceneEntry }) {
  const [escolhida, setEscolhida] = useState<number | null>(null);
  const [trecho, setTrecho] = useState(false);
  const transition = useSceneMotion();
  const item = escolhida === null ? null : entry.items[escolhida];
  const n = entry.items.length;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · posições em disputa</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 190" role="img" aria-label={item ? `Posição em foco: ${item.label}` : 'Nenhuma posição em foco'}>
        <path d="M40 150H440" className="tc-base" />
        {entry.items.map((it, i) => {
          const x = 40 + ((i + 0.5) * 400) / n;
          const emFoco = escolhida === i;
          return (
            <motion.g key={it.label} animate={{ opacity: escolhida === null || emFoco ? 1 : 0.32 }} transition={transition}>
              <motion.rect
                x={x - 62} width="124" rx="3"
                animate={{ y: emFoco ? 46 : 74, height: emFoco ? 104 : 76 }}
                transition={transition}
                className={emFoco ? 'tc-pillar tc-pillar-foco' : 'tc-pillar'}
              />
              <text x={x} y="36" textAnchor="middle" className="tc-label">{it.label}</text>
            </motion.g>
          );
        })}
      </svg>
      <div className="tc-choices">
        {entry.items.map((it, i) => (
          <button
            key={it.label}
            type="button"
            aria-pressed={escolhida === i}
            onClick={() => { setEscolhida(escolhida === i ? null : i); setTrecho(false); }}
          >
            {it.label}
          </button>
        ))}
      </div>
      {item && (
        <>
          <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
          <button type="button" className="tc-quote-toggle" aria-expanded={trecho} onClick={() => setTrecho((v) => !v)}>
            Ver o trecho do capítulo
          </button>
          {trecho && <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>}
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Escrever o CSS da cena**

`src/views/topic-scenes/TopicScene.css` — esta é a base compartilhada; as Tasks 5-8 acrescentam classes no mesmo idioma. Conferir os nomes de token contra `src/views/topic-experiments/TopicExperiment.css` antes de escrever, e ajustar se divergirem:

```css
.tc-scene {
  display: grid;
  gap: 0.9rem;
  padding: 1.25rem;
  border: 1px solid color-mix(in srgb, var(--vs-burgundy) 28%, transparent);
  border-radius: 2px;
  background: var(--vs-paper-strong);
}
.tc-scene > header { display: grid; gap: 0.2rem; }
.tc-scene > header small {
  font-family: var(--font-editorial, Newsreader), serif;
  font-style: italic;
  color: color-mix(in srgb, var(--vs-burgundy) 78%, transparent);
}
.tc-scene > header h4 {
  margin: 0;
  font-family: var(--font-editorial, Newsreader), serif;
  font-weight: 500;
  font-size: 1.22rem;
  line-height: 1.25;
}
.tc-scene svg { width: 100%; max-width: 100%; height: auto; }

.tc-base { stroke: currentColor; stroke-width: 1; opacity: 0.4; }
.tc-pillar { fill: color-mix(in srgb, var(--vs-blue) 12%, transparent); stroke: var(--vs-blue); stroke-width: 1.5; }
.tc-pillar-foco { fill: color-mix(in srgb, var(--vs-blue) 26%, transparent); stroke-width: 2.5; }
.tc-label { font-size: 13px; fill: currentColor; }

.tc-choices { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tc-choices button,
.tc-quote-toggle {
  padding: 0.45rem 0.85rem;
  font: inherit;
  font-size: 0.9rem;
  color: inherit;
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--vs-blue) 45%, transparent);
  border-radius: 2px;
  cursor: pointer;
}
.tc-choices button[aria-pressed='true'] {
  background: color-mix(in srgb, var(--vs-blue) 18%, transparent);
  border-color: var(--vs-blue);
  font-weight: 600;
}
.tc-choices button:focus-visible,
.tc-quote-toggle:focus-visible { outline: 2px solid var(--vs-blue); outline-offset: 2px; }
.tc-quote-toggle { justify-self: start; }

.tc-observation { margin: 0; }
.tc-quote {
  margin: 0;
  padding-left: 0.9rem;
  border-left: 2px solid color-mix(in srgb, var(--vs-amber) 70%, transparent);
  font-family: var(--font-editorial, Newsreader), serif;
  font-style: italic;
}
.tc-quote cite { display: block; font-size: 0.82rem; font-style: normal; opacity: 0.72; }
```

- [ ] **Step 5: Rodar o teste da família**

Run: `npx vitest run src/views/topic-scenes/families/ContrasteDePosicoes.test.tsx`
Expected: PASS, 4 testes.

- [ ] **Step 6: Rodar o portão do movimento**

Run: `npx vitest run src/views/topic-scenes/movimento.test.ts`
Expected: PASS — `ContrasteDePosicoes.tsx` importa `motion/react`, chama `useSceneMotion()` e não tem `repeat: Infinity`.

- [ ] **Step 7: Commit do componente**

```bash
git add src/views/topic-scenes/families/ContrasteDePosicoes.tsx src/views/topic-scenes/families/ContrasteDePosicoes.test.tsx src/views/topic-scenes/TopicScene.css
git commit -m "feat(visual): família de cena para posições em disputa"
```

- [ ] **Step 8: Escrever as 14 entradas**

Para cada um dos 14 capítulos da família, abrir o capítulo em `src/data/deepSummaryContent.json`, ler as três seções substantivas e escrever a entrada em `filosofia` no arquivo `src/views/topic-scenes/data/filosofia.ts`. Regras, todas verificadas pelo portão de lastro:

- `section` é o título **exato** de uma seção daquele capítulo.
- `quote` é copiado e colado do `content` daquela seção, nunca digitado de memória.
- `claim` é a afirmação da cena, e precisa ser sustentada pelo `quote` citado.
- `question` é a pergunta que as posições disputam, não o título do capítulo.

Capítulos: Crítica da Razão Pura; Fé e Razão; Teoria das Ideias de Platão; Empirismo Britânico; Filosofia Política Contemporânea; Heráclito e Parmênides; Justiça e Direitos Humanos; Ideal Iluminista; Filósofos da Physis; Sofistas; Patrística e Agostinho; Política Aristotélica; Racionalismo Continental; Ética Aplicada e Bioética.

O modelo abaixo deixa os `quote` em branco **de propósito**. Inventar aqui um
trecho plausível seria exatamente o erro que o portão existe para impedir: o
trecho tem que ser copiado do arquivo de conteúdo no momento de escrever a
entrada, nunca reconstruído de memória. Entrada com `quote` não colado reprova
no portão de lastro e o capítulo volta à lacuna.

```ts
{
  chapterId: 'summary-filosofia-os-filosofos-da-physis-tales-anaximandro-e-anaximenes',
  family: 'contraste-de-posicoes',
  question: 'Qual é o princípio de que tudo é feito?',
  items: [
    { label: 'Tales', claim: 'a água como arché', section: 'As três respostas', quote: 'COLAR AQUI o trecho literal da seção "As três respostas"' },
    { label: 'Anaximandro', claim: 'o ápeiron, o indeterminado', section: 'As três respostas', quote: 'COLAR AQUI o trecho literal' },
    { label: 'Anaxímenes', claim: 'o ar, com rarefação e condensação', section: 'As três respostas', quote: 'COLAR AQUI o trecho literal' },
  ],
},
```

- [ ] **Step 9: Rodar o portão de lastro sobre as entradas reais**

Run: `npx vitest run src/views/topic-scenes/lastro.test.ts src/views/topic-scenes/familias.test.ts`
Expected: lastro PASS; `familias.test.ts` ainda FAIL, agora apontando só os 20 capítulos das Tasks 5-8.

- [ ] **Step 10: Commit das entradas**

```bash
git add src/views/topic-scenes/data/filosofia.ts
git commit -m "feat(visual): entradas de posições em disputa em Filosofia"
```

---

### Task 5: Família escala-de-graus e seus 4 capítulos

**Files:**
- Create: `src/views/topic-scenes/families/EscalaDeGraus.tsx`
- Modify: `src/views/topic-scenes/TopicScene.css`
- Modify: `src/views/topic-scenes/data/filosofia.ts`
- Test: `src/views/topic-scenes/families/EscalaDeGraus.test.tsx`

**Interfaces:**
- Consumes: `useSceneMotion()` da Task 1; `SceneEntry` de `../types`.
- Produces: `EscalaDeGraus({ entry }: { entry: SceneEntry })`.

- [ ] **Step 1: Escrever o teste**

`src/views/topic-scenes/families/EscalaDeGraus.test.tsx`:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EscalaDeGraus } from './EscalaDeGraus';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-a-alegoria-da-linha-dividida-e-o-conhecimento',
  family: 'escala-de-graus',
  question: 'Quantos graus separam a sombra da ideia?',
  items: [
    { label: 'eikasia', claim: 'imagens e sombras', section: 'A linha e seus segmentos', quote: 'a eikasia' },
    { label: 'pistis', claim: 'as coisas sensíveis', section: 'A linha e seus segmentos', quote: 'pistis' },
    { label: 'dianoia', claim: 'o raciocínio que ainda parte de hipóteses', section: 'A matemática como passagem', quote: 'dianoia' },
    { label: 'noesis', claim: 'a apreensão direta das ideias', section: 'Doxa e episteme', quote: 'noesis' },
  ],
};

describe('Escala de graus', () => {
  it('abre no primeiro degrau e anuncia a posição', () => {
    render(<EscalaDeGraus entry={entry} />);
    expect(screen.getByRole('status')).toHaveTextContent('imagens e sombras');
    expect(screen.getByRole('slider')).toHaveValue('0');
  });

  it('sobe de degrau e troca a afirmação', () => {
    render(<EscalaDeGraus entry={entry} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });
    expect(screen.getByRole('status')).toHaveTextContent('apreensão direta das ideias');
  });

  it('nomeia o degrau atual no rótulo acessível do desenho', () => {
    render(<EscalaDeGraus entry={entry} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getByRole('img')).toHaveAccessibleName('Grau 3 de 4: dianoia');
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/families/EscalaDeGraus.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever o componente**

`src/views/topic-scenes/families/EscalaDeGraus.tsx`:

```tsx
import React, { useId, useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Degraus ordenados. O movimento leva o marcador de um degrau ao seguinte —
 *  a subida é o que a cena ensina. */
export function EscalaDeGraus({ entry }: { entry: SceneEntry }) {
  const [grau, setGrau] = useState(0);
  const transition = useSceneMotion();
  const id = useId();
  const n = entry.items.length;
  const item = entry.items[grau];
  const alturaDe = (i: number) => 156 - (i * 116) / (n - 1);

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · graus ordenados</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 196" role="img" aria-label={`Grau ${grau + 1} de ${n}: ${item.label}`}>
        {entry.items.map((it, i) => (
          <g key={it.label}>
            <line x1="70" x2="410" y1={alturaDe(i)} y2={alturaDe(i)} className={i <= grau ? 'tc-degrau tc-degrau-ativo' : 'tc-degrau'} />
            <text x="62" y={alturaDe(i) + 5} textAnchor="end" className="tc-label">{it.label}</text>
          </g>
        ))}
        <motion.circle
          cx="410" r="9"
          animate={{ cy: alturaDe(grau) }}
          transition={transition}
          className="tc-marcador"
        />
        <text x="70" y="188" className="tc-caption" id={`${id}-eixo`}>do grau mais distante ao mais próximo do inteligível</text>
      </svg>
      <label className="tc-slider">
        Grau: {item.label}
        <input
          type="range" min="0" max={n - 1} step="1" value={grau}
          onChange={(e) => setGrau(Number(e.target.value))}
        />
      </label>
      <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
      <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
    </section>
  );
}
```

- [ ] **Step 4: Acrescentar ao CSS**

Em `src/views/topic-scenes/TopicScene.css`, acrescentar `.tc-degrau`, `.tc-degrau-ativo`, `.tc-marcador`, `.tc-caption` e `.tc-slider` — este último no padrão de `.ts-sliders` de `TopicExperiment.css`, com o `input[type=range]` em largura total e rótulo em serifa editorial.

- [ ] **Step 5: Rodar os testes**

Run: `npx vitest run src/views/topic-scenes/families/EscalaDeGraus.test.tsx src/views/topic-scenes/movimento.test.ts`
Expected: PASS nos dois.

- [ ] **Step 6: Escrever as 4 entradas**

Capítulos, com as mesmas quatro regras da Task 4 Step 8 (`section` exato, `quote` copiado e colado, `claim` sustentado pelo `quote`, `question` é a pergunta e não o título): Linha Dividida; Ética a Nicômaco (deficiência → meio-termo → excesso); Descartes e a Dúvida Hiperbólica (graus da dúvida); Mito da Caverna (etapas da saída).

- [ ] **Step 7: Commit**

```bash
git add src/views/topic-scenes/families/EscalaDeGraus.tsx src/views/topic-scenes/families/EscalaDeGraus.test.tsx src/views/topic-scenes/TopicScene.css src/views/topic-scenes/data/filosofia.ts
git commit -m "feat(visual): família de cena para graus ordenados"
```

---

### Task 6: Família cadeia-de-derivacao e seus 8 capítulos

**Files:**
- Create: `src/views/topic-scenes/families/CadeiaDeDerivacao.tsx`
- Modify: `src/views/topic-scenes/TopicScene.css`
- Modify: `src/views/topic-scenes/data/filosofia.ts`
- Test: `src/views/topic-scenes/families/CadeiaDeDerivacao.test.tsx`

**Interfaces:**
- Consumes: `useSceneMotion()` da Task 1; `SceneEntry` de `../types`.
- Produces: `CadeiaDeDerivacao({ entry }: { entry: SceneEntry })`.

- [ ] **Step 1: Escrever o teste**

`src/views/topic-scenes/families/CadeiaDeDerivacao.test.tsx`:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CadeiaDeDerivacao } from './CadeiaDeDerivacao';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-hobbes-e-o-estado-de-natureza',
  family: 'cadeia-de-derivacao',
  question: 'Como se chega da guerra de todos ao soberano?',
  items: [
    { label: 'Igualdade natural', claim: 'ninguém é tão forte que não possa ser morto', section: 'O estado de natureza', quote: 'estado de natureza' },
    { label: 'Guerra de todos', claim: 'a insegurança é permanente', section: 'O estado de natureza', quote: 'guerra' },
    { label: 'Pacto', claim: 'cada um abre mão do direito a tudo', section: 'O contrato', quote: 'contrato' },
    { label: 'Soberano', claim: 'o poder não é parte do pacto, e por isso não se dissolve', section: 'Consequências políticas', quote: 'soberano' },
  ],
};

describe('Cadeia de derivação', () => {
  it('abre com só o primeiro elo revelado', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    expect(screen.getByRole('status')).toHaveTextContent('ninguém é tão forte');
    expect(screen.queryByText('o poder não é parte do pacto, e por isso não se dissolve')).not.toBeInTheDocument();
  });

  it('avança um elo por vez', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    expect(screen.getByRole('status')).toHaveTextContent('a insegurança é permanente');
  });

  it('para no último elo e oferece recomeçar', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    fireEvent.click(screen.getByRole('button', { name: 'Próximo elo' }));
    expect(screen.getByRole('status')).toHaveTextContent('não se dissolve');
    expect(screen.queryByRole('button', { name: 'Próximo elo' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Recomeçar a cadeia' }));
    expect(screen.getByRole('status')).toHaveTextContent('ninguém é tão forte');
  });

  it('mostra quantos elos faltam', () => {
    render(<CadeiaDeDerivacao entry={entry} />);
    expect(screen.getByText('elo 1 de 4')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/families/CadeiaDeDerivacao.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever o componente**

`src/views/topic-scenes/families/CadeiaDeDerivacao.tsx`:

```tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Passos encadeados. O movimento desenha a seta do elo anterior ao seguinte:
 *  a dependência entre os passos é o conteúdo da cena. */
export function CadeiaDeDerivacao({ entry }: { entry: SceneEntry }) {
  const [elo, setElo] = useState(0);
  const transition = useSceneMotion();
  const n = entry.items.length;
  const item = entry.items[elo];
  const yDe = (i: number) => 30 + i * 42;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · cadeia de derivação</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox={`0 0 480 ${yDe(n - 1) + 40}`} role="img" aria-label={`Elo ${elo + 1} de ${n}: ${item.label}`}>
        {entry.items.map((it, i) => (
          <motion.g key={it.label} animate={{ opacity: i <= elo ? 1 : 0.22 }} transition={transition}>
            <rect x="60" y={yDe(i) - 17} width="360" height="34" rx="2" className={i === elo ? 'tc-elo tc-elo-foco' : 'tc-elo'} />
            <text x="76" y={yDe(i) + 5} className="tc-label">{it.label}</text>
          </motion.g>
        ))}
        {entry.items.slice(1).map((it, i) => (
          <motion.path
            key={`seta-${it.label}`}
            d={`M240 ${yDe(i) + 17}V${yDe(i + 1) - 17}`}
            animate={{ pathLength: i < elo ? 1 : 0, opacity: i < elo ? 1 : 0 }}
            transition={transition}
            className="tc-seta"
          />
        ))}
      </svg>
      <p className="tc-progress">elo {elo + 1} de {n}</p>
      <div className="tc-choices">
        {elo < n - 1
          ? <button type="button" onClick={() => setElo(elo + 1)}>Próximo elo</button>
          : <button type="button" onClick={() => setElo(0)}>Recomeçar a cadeia</button>}
        {elo > 0 && <button type="button" onClick={() => setElo(elo - 1)}>Elo anterior</button>}
      </div>
      <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
      <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
    </section>
  );
}
```

- [ ] **Step 4: Acrescentar ao CSS**

Em `src/views/topic-scenes/TopicScene.css`, acrescentar `.tc-elo`, `.tc-elo-foco`, `.tc-seta` (traço com `stroke-linecap: round`, ponta em `marker-end` ou triângulo desenhado) e `.tc-progress` (serifa itálica, cor `--vs-burgundy`).

- [ ] **Step 5: Rodar os testes**

Run: `npx vitest run src/views/topic-scenes/families/CadeiaDeDerivacao.test.tsx src/views/topic-scenes/movimento.test.ts`
Expected: PASS nos dois.

- [ ] **Step 6: Escrever as 8 entradas**

Capítulos, com as mesmas quatro regras da Task 4 Step 8: Crítica de Hume à Causalidade; Ética Kantiana e o Imperativo Categórico; Escolástica e Tomás de Aquino (as cinco vias); Hobbes; Locke; Lógica e Metafísica Aristotélicas (silogismo); Existencialismo de Sartre; Rousseau e a Vontade Geral.

- [ ] **Step 7: Commit**

```bash
git add src/views/topic-scenes/families/CadeiaDeDerivacao.tsx src/views/topic-scenes/families/CadeiaDeDerivacao.test.tsx src/views/topic-scenes/TopicScene.css src/views/topic-scenes/data/filosofia.ts
git commit -m "feat(visual): família de cena para cadeias de derivação"
```

---

### Task 7: Família camadas-de-determinacao e seus 5 capítulos

**Files:**
- Create: `src/views/topic-scenes/families/CamadasDeDeterminacao.tsx`
- Modify: `src/views/topic-scenes/TopicScene.css`
- Modify: `src/views/topic-scenes/data/filosofia.ts`
- Test: `src/views/topic-scenes/families/CamadasDeDeterminacao.test.tsx`

**Interfaces:**
- Consumes: `useSceneMotion()` da Task 1; `SceneEntry` de `../types`.
- Produces: `CamadasDeDeterminacao({ entry }: { entry: SceneEntry })`. Convenção: `items[0]` é a camada determinante (a base); as demais são determinadas, na ordem em que aparecem.

- [ ] **Step 1: Escrever o teste**

`src/views/topic-scenes/families/CamadasDeDeterminacao.test.tsx`:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CamadasDeDeterminacao } from './CamadasDeDeterminacao';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-o-materialismo-historico',
  family: 'camadas-de-determinacao',
  question: 'O que determina as ideias de uma época?',
  items: [
    { label: 'Infraestrutura', claim: 'as relações de produção', section: 'Infraestrutura e superestrutura', quote: 'infraestrutura' },
    { label: 'Direito e Estado', claim: 'a forma jurídica acompanha a produção', section: 'Infraestrutura e superestrutura', quote: 'superestrutura' },
    { label: 'Ideias dominantes', claim: 'as ideias dominantes são as da classe dominante', section: 'Modos de produção', quote: 'modo de produção' },
  ],
};

describe('Camadas de determinação', () => {
  it('nomeia a base como camada determinante', () => {
    render(<CamadasDeDeterminacao entry={entry} />);
    expect(screen.getByText('Infraestrutura')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAccessibleName(/determina/);
  });

  it('revela o que a base determina em cada camada ao selecioná-la', () => {
    render(<CamadasDeDeterminacao entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ideias dominantes' }));
    expect(screen.getByRole('status')).toHaveTextContent('as da classe dominante');
    expect(screen.getByRole('button', { name: 'Ideias dominantes' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('não começa com nenhuma camada superior selecionada', () => {
    render(<CamadasDeDeterminacao entry={entry} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/families/CamadasDeDeterminacao.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever o componente**

`src/views/topic-scenes/families/CamadasDeDeterminacao.tsx`:

```tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** items[0] é a base determinante; as demais são determinadas. O movimento
 *  faz a determinação subir da base até a camada escolhida. */
export function CamadasDeDeterminacao({ entry }: { entry: SceneEntry }) {
  const [camada, setCamada] = useState<number | null>(null);
  const transition = useSceneMotion();
  const [base, ...superiores] = entry.items;
  const item = camada === null ? null : superiores[camada];
  const yDe = (i: number) => 116 - i * 40;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · camadas de determinação</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 196" role="img" aria-label={`${base.label} determina ${item ? item.label : 'as camadas acima'}`}>
        <rect x="60" y="146" width="360" height="38" rx="2" className="tc-base-camada" />
        <text x="76" y="170" className="tc-label">{base.label}</text>
        {superiores.map((it, i) => (
          <motion.g key={it.label} animate={{ opacity: camada === null || camada === i ? 1 : 0.3 }} transition={transition}>
            <rect x="60" y={yDe(i)} width="360" height="32" rx="2" className={camada === i ? 'tc-camada tc-camada-foco' : 'tc-camada'} />
            <text x="76" y={yDe(i) + 21} className="tc-label">{it.label}</text>
          </motion.g>
        ))}
        <motion.path
          d={`M240 146V${camada === null ? 146 : yDe(camada) + 32}`}
          animate={{ pathLength: camada === null ? 0 : 1, opacity: camada === null ? 0 : 1 }}
          transition={transition}
          className="tc-determinacao"
        />
      </svg>
      <div className="tc-choices">
        {superiores.map((it, i) => (
          <button key={it.label} type="button" aria-pressed={camada === i} onClick={() => setCamada(camada === i ? null : i)}>
            {it.label}
          </button>
        ))}
      </div>
      {item && (
        <>
          <p className="tc-observation" role="status"><strong>{item.label}:</strong> {item.claim}</p>
          <blockquote className="tc-quote">“{item.quote}” <cite>{item.section}</cite></blockquote>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Acrescentar ao CSS**

Em `src/views/topic-scenes/TopicScene.css`, acrescentar `.tc-base-camada` (preenchimento mais denso, cor `--vs-burgundy` com `color-mix`), `.tc-camada`, `.tc-camada-foco` e `.tc-determinacao` (traço vertical ascendente).

- [ ] **Step 5: Rodar os testes**

Run: `npx vitest run src/views/topic-scenes/families/CamadasDeDeterminacao.test.tsx src/views/topic-scenes/movimento.test.ts`
Expected: PASS nos dois.

- [ ] **Step 6: Escrever as 5 entradas**

Capítulos, com as mesmas quatro regras da Task 4 Step 8, e com `items[0]` sempre na camada determinante: Escola de Frankfurt e a Indústria Cultural; Luta de Classes; Alienação e Mais-Valia; Foucault e as Relações de Poder; Materialismo Histórico.

- [ ] **Step 7: Commit**

```bash
git add src/views/topic-scenes/families/CamadasDeDeterminacao.tsx src/views/topic-scenes/families/CamadasDeDeterminacao.test.tsx src/views/topic-scenes/TopicScene.css src/views/topic-scenes/data/filosofia.ts
git commit -m "feat(visual): família de cena para camadas de determinação"
```

---

### Task 8: Família movimento-dialetico e seus 3 capítulos

**Files:**
- Create: `src/views/topic-scenes/families/MovimentoDialetico.tsx`
- Modify: `src/views/topic-scenes/TopicScene.css`
- Modify: `src/views/topic-scenes/data/filosofia.ts`
- Test: `src/views/topic-scenes/families/MovimentoDialetico.test.tsx`

**Interfaces:**
- Consumes: `useSceneMotion()` da Task 1; `SceneEntry` de `../types`.
- Produces: `MovimentoDialetico({ entry }: { entry: SceneEntry })`. Convenção: exatamente 3 items — momento inicial, momento que o nega, e o terceiro que transforma os dois.

- [ ] **Step 1: Escrever o teste**

`src/views/topic-scenes/families/MovimentoDialetico.test.tsx`:

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MovimentoDialetico } from './MovimentoDialetico';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-hegel-e-a-dialetica',
  family: 'movimento-dialetico',
  question: 'Por que o senhor depende do escravo?',
  items: [
    { label: 'Senhor', claim: 'reconhecido, mas por quem ele não reconhece', section: 'Dialética do senhor e do escravo', quote: 'senhor' },
    { label: 'Escravo', claim: 'não reconhecido, mas é quem transforma o mundo pelo trabalho', section: 'Dialética do senhor e do escravo', quote: 'escravo' },
    { label: 'Inversão', claim: 'o trabalho faz do escravo a consciência que se reconhece na obra', section: 'O movimento dialético', quote: 'movimento' },
  ],
};

describe('Movimento dialético', () => {
  it('abre nos dois primeiros momentos, sem a inversão', () => {
    render(<MovimentoDialetico entry={entry} />);
    expect(screen.getByText('Senhor')).toBeInTheDocument();
    expect(screen.getByText('Escravo')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('completa o movimento e revela o terceiro momento', () => {
    render(<MovimentoDialetico entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Completar o movimento' }));
    expect(screen.getByRole('status')).toHaveTextContent('se reconhece na obra');
    expect(screen.getByRole('img')).toHaveAccessibleName(/Inversão/);
  });

  it('permite voltar ao início do movimento', () => {
    render(<MovimentoDialetico entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Completar o movimento' }));
    fireEvent.click(screen.getByRole('button', { name: 'Voltar ao início' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/families/MovimentoDialetico.test.tsx`
Expected: FAIL — módulo não encontrado.

- [ ] **Step 3: Escrever o componente**

`src/views/topic-scenes/families/MovimentoDialetico.tsx`:

```tsx
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useSceneMotion } from '../useSceneMotion';
import type { SceneEntry } from '../types';
import '../TopicScene.css';

/** Três momentos: o movimento troca as posições dos dois primeiros ao se
 *  completar. A troca é a tese da cena — não é transição decorativa. */
export function MovimentoDialetico({ entry }: { entry: SceneEntry }) {
  const [completo, setCompleto] = useState(false);
  const transition = useSceneMotion();
  const [um, dois, tres] = entry.items;

  return (
    <section className="tc-scene" aria-label={entry.question}>
      <header>
        <small>CRIVO · movimento dialético</small>
        <h4>{entry.question}</h4>
      </header>
      <svg viewBox="0 0 480 210" role="img" aria-label={completo ? `${tres.label}: o movimento se completou` : `${um.label} e ${dois.label} em oposição`}>
        <motion.g animate={{ x: completo ? 244 : 0, y: completo ? 62 : 0 }} transition={transition}>
          <circle cx="126" cy="72" r="46" className="tc-momento tc-momento-um" />
          <text x="126" y="77" textAnchor="middle" className="tc-label">{um.label}</text>
        </motion.g>
        <motion.g animate={{ x: completo ? -244 : 0, y: completo ? -62 : 0 }} transition={transition}>
          <circle cx="354" cy="134" r="46" className="tc-momento tc-momento-dois" />
          <text x="354" y="139" textAnchor="middle" className="tc-label">{dois.label}</text>
        </motion.g>
        <motion.path
          d="M172 72Q240 30 308 72Q240 176 172 72"
          animate={{ pathLength: completo ? 1 : 0, opacity: completo ? 1 : 0 }}
          transition={transition}
          className="tc-ciclo"
        />
        <motion.text x="240" y="200" textAnchor="middle" className="tc-caption" animate={{ opacity: completo ? 1 : 0 }} transition={transition}>
          {tres.label}
        </motion.text>
      </svg>
      <div className="tc-choices">
        <button type="button" onClick={() => setCompleto(!completo)}>
          {completo ? 'Voltar ao início' : 'Completar o movimento'}
        </button>
      </div>
      {completo && (
        <>
          <p className="tc-observation" role="status"><strong>{tres.label}:</strong> {tres.claim}</p>
          <blockquote className="tc-quote">“{tres.quote}” <cite>{tres.section}</cite></blockquote>
        </>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Acrescentar ao CSS**

Em `src/views/topic-scenes/TopicScene.css`, acrescentar `.tc-momento`, `.tc-momento-um`, `.tc-momento-dois` (cores `--vs-blue` e `--vs-amber`) e `.tc-ciclo` (traço curvo fechado).

- [ ] **Step 5: Rodar os testes**

Run: `npx vitest run src/views/topic-scenes/families/MovimentoDialetico.test.tsx src/views/topic-scenes/movimento.test.ts`
Expected: PASS nos dois.

- [ ] **Step 6: Escrever as 3 entradas**

Capítulos, com as mesmas quatro regras da Task 4 Step 8 e sempre com 3 items na ordem momento/negação/transformação: Hegel e a Dialética; Nietzsche e a Crítica aos Valores Morais (genealogia: valor aparente / origem nas relações de força / transvaloração); Método Socrático e a Maiêutica (opinião confiante / aporia / ideia parida pelo interlocutor).

- [ ] **Step 7: Rodar o teste de completude, que agora deve fechar**

Run: `npx vitest run src/views/topic-scenes/familias.test.ts`
Expected: PASS — 34 entradas + 1 lacuna declarada = os 35 capítulos de Filosofia.

- [ ] **Step 8: Commit**

```bash
git add src/views/topic-scenes/families/MovimentoDialetico.tsx src/views/topic-scenes/families/MovimentoDialetico.test.tsx src/views/topic-scenes/TopicScene.css src/views/topic-scenes/data/filosofia.ts
git commit -m "feat(visual): família de cena para movimentos dialéticos"
```

---

### Task 9: Seletor, dispatcher e integração no fluxo de Explorar

**Files:**
- Create: `src/views/topic-scenes/sceneFor.ts`
- Create: `src/views/topic-scenes/TopicScene.tsx`
- Modify: `src/views/VisualJourney.tsx` (import junto aos demais no topo; montagem na linha 38, logo após `<TopicExperiment …/>`)
- Test: `src/views/topic-scenes/sceneFor.test.ts`

**Interfaces:**
- Consumes: `validarLastro` da Task 1; `filosofia` da Task 3; as cinco famílias das Tasks 4-8; `interactiveSummaries` de `src/data/interactiveSummaries`.
- Produces: `sceneFor(chapterId: string): SceneEntry | null`; `entradasValidas(): SceneEntry[]`; `TopicScene({ summaryId }: { summaryId: string })`.

- [ ] **Step 1: Escrever o teste do seletor**

`src/views/topic-scenes/sceneFor.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { sceneFor, entradasValidas } from './sceneFor';
import { filosofia } from './data/filosofia';

describe('Seleção de cena por capítulo', () => {
  it('devolve a cena do capítulo pedido', () => {
    const alvo = filosofia[0];
    expect(sceneFor(alvo.chapterId)?.family).toBe(alvo.family);
  });

  it('devolve null para capítulo sem entrada, em vez de emprestar a de outro', () => {
    expect(sceneFor('summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos')).toBeNull();
    expect(sceneFor('summary-geografia-coordenadas-geograficas')).toBeNull();
    expect(sceneFor('capitulo-que-nao-existe')).toBeNull();
  });

  it('só considera válidas as entradas cujo lastro passa', () => {
    expect(entradasValidas().length).toBe(filosofia.length);
  });
});
```

- [ ] **Step 2: Rodar para confirmar que falha**

Run: `npx vitest run src/views/topic-scenes/sceneFor.test.ts`
Expected: FAIL — `Failed to resolve import "./sceneFor"`.

- [ ] **Step 3: Escrever o seletor**

`src/views/topic-scenes/sceneFor.ts`:

```ts
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { filosofia } from './data/filosofia';
import { validarLastro } from './lastro';
import type { SceneEntry } from './types';

const todas: SceneEntry[] = [...filosofia];
const capitulos = new Map(interactiveSummaries.map((s) => [s.id, s]));

/** Falha fechada: a validação roda uma vez, na carga do módulo, e uma entrada
 *  sem lastro simplesmente não entra no mapa — o capítulo volta à lacuna. */
const validas = todas.filter((entry) => validarLastro(entry, capitulos.get(entry.chapterId)).length === 0);
const porCapitulo = new Map(validas.map((entry) => [entry.chapterId, entry]));

export function entradasValidas(): SceneEntry[] {
  return validas;
}

export function sceneFor(chapterId: string): SceneEntry | null {
  return porCapitulo.get(chapterId) ?? null;
}
```

- [ ] **Step 4: Escrever o dispatcher**

`src/views/topic-scenes/TopicScene.tsx`:

```tsx
import React from 'react';
import { sceneFor } from './sceneFor';
import { ContrasteDePosicoes } from './families/ContrasteDePosicoes';
import { EscalaDeGraus } from './families/EscalaDeGraus';
import { CadeiaDeDerivacao } from './families/CadeiaDeDerivacao';
import { CamadasDeDeterminacao } from './families/CamadasDeDeterminacao';
import { MovimentoDialetico } from './families/MovimentoDialetico';
import type { SceneEntry, SceneFamily } from './types';

const FAMILIAS: Record<SceneFamily, React.ComponentType<{ entry: SceneEntry }>> = {
  'contraste-de-posicoes': ContrasteDePosicoes,
  'escala-de-graus': EscalaDeGraus,
  'cadeia-de-derivacao': CadeiaDeDerivacao,
  'camadas-de-determinacao': CamadasDeDeterminacao,
  'movimento-dialetico': MovimentoDialetico,
};

export function TopicScene({ summaryId }: { summaryId: string }) {
  const entry = sceneFor(summaryId);
  if (!entry) return null;
  const Familia = FAMILIAS[entry.family];
  return <Familia entry={entry} />;
}
```

- [ ] **Step 5: Rodar o teste do seletor**

Run: `npx vitest run src/views/topic-scenes/sceneFor.test.ts`
Expected: PASS, 3 testes.

- [ ] **Step 6: Montar no fluxo de Explorar**

Em `src/views/VisualJourney.tsx`, acrescentar o import junto aos outros do topo:

```tsx
import { TopicScene } from './topic-scenes/TopicScene';
```

e montar logo depois de `<TopicExperiment key={summary.id} summaryId={summary.id} />` (linha 38):

```tsx
      <TopicScene key={`cena-${summary.id}`} summaryId={summary.id} />
```

A `key` amarrada ao capítulo garante que a cena remonta ao trocar de capítulo e **mantém o estado ao trocar de etapa**, que é o comportamento pedido. Como fica fora do `<AnimatePresence>` que troca as seções, a cena não é desmontada a cada etapa.

- [ ] **Step 7: Escrever o teste de integração**

Acrescentar a `src/views/VisualJourney.test.tsx`:

```tsx
  it('mantém a cena-âncora montada ao trocar de etapa do capítulo', () => {
    const summary = interactiveSummaries.find((s) => s.id === filosofia[0].chapterId)!;
    render(<VisualJourney summary={summary} onPractice={() => {}} />);
    const cena = screen.getByLabelText(filosofia[0].question);
    expect(cena).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Continuar:/ })[0]);
    expect(screen.getByLabelText(filosofia[0].question)).toBe(cena);
  });
```

Importar no topo do arquivo de teste, se ainda não estiverem: `interactiveSummaries` de `../data/interactiveSummaries` e `filosofia` de `./topic-scenes/data/filosofia`.

- [ ] **Step 8: Rodar a suíte do Visual**

Run: `npx vitest run src/views/VisualJourney.test.tsx src/views/topic-scenes`
Expected: PASS em tudo.

- [ ] **Step 9: Commit**

```bash
git add src/views/topic-scenes/sceneFor.ts src/views/topic-scenes/sceneFor.test.ts src/views/topic-scenes/TopicScene.tsx src/views/VisualJourney.tsx src/views/VisualJourney.test.tsx
git commit -m "feat(visual): liga as cenas de capítulo ao fluxo de Explorar"
```

---

### Task 10: Correção do contador do auditor

**Files:**
- Modify: `scripts/auditVisualJourney.ts`
- Test: `src/views/topic-scenes/auditoria.test.ts`

**Interfaces:**
- Consumes: `entradasValidas()` da Task 9.
- Produces: contagem de `anchorScenes` por matéria que conta só entradas com lastro válido.

- [ ] **Step 1: Ler o script e localizar a contagem**

Run: `grep -n "anchorScene" scripts/auditVisualJourney.ts`
Ler o trecho que produz `anchorScenes` no relatório `docs/visual-personalizado/04-cobertura-percurso.json`.

- [ ] **Step 2: Escrever o teste da contagem**

`src/views/topic-scenes/auditoria.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { entradasValidas } from './sceneFor';
import { filosofia, filosofiaSemCena } from './data/filosofia';
import { interactiveSummaries } from '../../data/interactiveSummaries';

describe('Contagem honesta de cenas-âncora', () => {
  it('conta exatamente as entradas que passam no lastro', () => {
    expect(entradasValidas().length).toBe(filosofia.length);
  });

  it('não conta os capítulos declarados sem cena', () => {
    const contadas = new Set(entradasValidas().map((e) => e.chapterId));
    for (const gap of filosofiaSemCena) expect(contadas.has(gap.chapterId), gap.chapterId).toBe(false);
  });

  it('a soma de cenas e lacunas cobre Filosofia inteira', () => {
    const filosofiaIds = interactiveSummaries.filter((s) => s.subject === 'Filosofia').length;
    expect(entradasValidas().length + filosofiaSemCena.length).toBe(filosofiaIds);
  });
});
```

- [ ] **Step 3: Rodar o teste**

Run: `npx vitest run src/views/topic-scenes/auditoria.test.ts`
Expected: PASS — a lógica já está correta em `sceneFor.ts`; este teste fixa o contrato que o script precisa usar.

- [ ] **Step 4: Corrigir o script**

Em `scripts/auditVisualJourney.ts`, trocar a contagem de `anchorScenes` para derivar de `entradasValidas()`, agrupando por `subject` do capítulo. Remover qualquer atribuição incondicional de `true` no registro por capítulo: o campo passa a refletir `sceneFor(id) !== null`.

- [ ] **Step 5: Regerar o relatório e conferir Filosofia**

```bash
npx tsx scripts/auditVisualJourney.ts
node -e "const d=require('./docs/visual-personalizado/04-cobertura-percurso.json');const a=Array.isArray(d)?d:Object.values(d).find(v=>Array.isArray(v));console.log(a.find(r=>r.subject==='Filosofia'))"
```
Expected: Filosofia com `anchorScenes` igual ao número de entradas escritas (34 se todas passaram), e as outras seis matérias ainda em 0.

- [ ] **Step 6: Commit**

```bash
git add scripts/auditVisualJourney.ts src/views/topic-scenes/auditoria.test.ts docs/visual-personalizado/04-cobertura-percurso.json
git commit -m "fix(visual): auditor conta só cenas com lastro verificado"
```

---

### Task 11: Verificação da fase e capturas

**Files:**
- Modify: `docs/visual-personalizado/07-familias-filosofia.md`
- Create: `docs/visual-personalizado/screenshots/cenas-filosofia/` (capturas)

**Interfaces:**
- Consumes: tudo das Tasks 1-10.
- Produces: nenhuma API — é o portão da fase.

- [ ] **Step 1: Rodar a suíte inteira**

Run: `npm test`
Expected: verde, incluindo `lastro`, `movimento`, `familias`, `sceneFor`, `auditoria`, as cinco famílias e `VisualJourney`.

- [ ] **Step 2: Rodar o TypeScript**

Run: `npm run lint`
Expected: sem erros.

- [ ] **Step 3: Rodar o build de produção**

Run: `npm run build`
Expected: sucesso. O aviso de chunks acima de 500 kB é conhecido e esperado.

- [ ] **Step 4: Subir o app e abrir um capítulo de cada família**

```bash
npm run dev
```

Com o navegador em `http://localhost:3000`, bypassar o modal de onboarding antes de navegar:

```js
localStorage.setItem('juju_onboarding', 'true')
```

Abrir a aba Visual e percorrer cinco capítulos, um por família: Heráclito e Parmênides (contraste), Linha Dividida (escala), Hobbes (cadeia), Materialismo Histórico (camadas), Hegel (dialético).

- [ ] **Step 5: Conferir e capturar**

Em cada um dos cinco capítulos, verificar e registrar:

- A cena aparece no fluxo de Explorar e **permanece** ao avançar de etapa.
- A cena **desaparece** ao entrar em Testar.
- Toda interação é acionável por `Tab` + `Enter`/`Espaço`, com foco visível.
- Sem overflow horizontal em celular claro (largura 390) e desktop escuro (largura 1440).
- Console sem erros.

Capturar os cinco em celular claro e ao menos um em desktop escuro, salvando em `docs/visual-personalizado/screenshots/cenas-filosofia/`.

- [ ] **Step 6: Conferir movimento reduzido**

Ativar `prefers-reduced-motion: reduce` no DevTools e repetir um capítulo de cada família, confirmando que as transições ocorrem com duração zero e que nada anima em laço.

- [ ] **Step 7: Registrar o resultado no documento de famílias**

Acrescentar a `docs/visual-personalizado/07-familias-filosofia.md` uma seção "Verificação" com: o que foi medido, em quais capítulos e larguras, o resultado de `npm test` / `npm run lint` / `npm run build`, os caminhos das capturas, e — explicitamente — que as capturas são evidência de amostra, não validação dos 35 capítulos.

- [ ] **Step 8: Commit e push**

```bash
git add docs/visual-personalizado/07-familias-filosofia.md docs/visual-personalizado/screenshots/cenas-filosofia
git commit -m "docs(visual): verificação da fase de cenas de Filosofia"
git push origin main
```

---

## Estado ao fim da Fase 1

34 dos 35 capítulos de Filosofia com cena-âncora animada e com lastro citado; 1 lacuna declarada com motivo. Seis matérias e 260 capítulos continuam em zero — cada uma ganha seu próprio plano, escrito depois desta fase e com o que ela ensinou.

Os quatro limites do desenho continuam valendo e estão registrados no spec: o portão de lastro não pega leitura equivocada, o portão de movimento é estático, capítulos da mesma família se parecem entre si, e os 613 tópicos seguem sem prancha autoral individual.
