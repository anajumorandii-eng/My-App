# Crivo Phase A — Hoje and Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Hoje and its shell so the approved Núcleo Instrumental is perceptually dominant, every current subject has a distinct visual/motion identity, and the decision flow remains grounded in the real daily-plan data.

**Architecture:** Keep `useDailyPlan()` as the only daily-decision boundary and separate business state from visual choreography. Canvas renders the Núcleo and subject field; Motion coordinates presence, layout, typography, disclosure, confirmation, and real ranking changes. Hoje receives an immersive route presentation while every existing route and data contract remains intact.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Motion 12, Canvas 2D, Vitest, Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-29-crivo-authorial-motion-system-design.md`

## Global Constraints

- Read the spec and `.claude/design-reference/nucleo-instrumental/APPROVED.md` before editing production code.
- Compare against `.claude/design-reference/nucleo-instrumental/nucleo-instrumental-demo-v6.webm` during every visual checkpoint.
- Preserve `useDailyPlan()` as the sole source of the ranked and allocated daily decision.
- Preserve all routes, persistence behavior, Firestore contracts, action identities, and real study data.
- Motion must be causal, interruptible, and truthful; it must not simulate a ranking or recalculation that did not happen.
- Every new animated path must render its final state immediately under `prefers-reduced-motion`.
- Desktop and mobile share state and handlers but use distinct compositions.
- Do not push, merge, deploy, or modify the user's other checkouts.
- Stage explicit pathspecs only; never use `git add .` or `git add -A`.
- End every task with its focused tests, `npm run lint`, and an explicit commit.

---

## File Structure

### New files

- `src/features/daily-plan/motion/useDecisionChoreography.ts` — derives presentational phases from a real action id, ranking-change signal, feedback status, and reduced-motion preference.
- `src/features/daily-plan/motion/useDecisionChoreography.test.tsx` — fake-timer coverage for the choreography lifecycle.
- `src/features/daily-plan/components/DecisionSignalStrip.tsx` — compact decision instruments for mastery, confidence, urgency, and time.
- `src/features/daily-plan/components/DecisionFactorField.tsx` — factor decomposition around the Núcleo when “Por que isso?” opens.
- `src/features/daily-plan/components/DecisionSequence.tsx` — ranked continuation timeline for allocated and waiting actions.
- `src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx` — component-level motion, disclosure, confirmation, and reduced-motion tests.
- `src/components/CrivoCore.ui.test.tsx` — Canvas sizing, accessibility mode, and static fallback tests.
- `src/components/layout/routePresentation.ts` — pure route-to-shell presentation mapping.
- `src/components/layout/routePresentation.test.ts` — immersive Hoje and standard-route mapping coverage.
- `playwright.config.ts` — reproducible real-browser configuration.
- `tests/e2e/crivo-phase-a.spec.ts` — desktop/mobile/theme/reduced-motion/route/fidelity checks.

### Modified files

- `package.json` and `package-lock.json` — include the daily-plan Vitest directory and Playwright QA command.
- `.gitignore` — ignore Playwright reports, traces, videos, and temporary screenshots.
- `src/testSetup.ts` — deterministic Canvas, ResizeObserver, and matchMedia test shims.
- `src/design-system/crivoSubjects.ts` and tests — light/dark palette pairs and bespoke Inglês, Filosofia, Sociologia identities.
- `src/design-system/crivoCoreRegistry.ts` and tests — three new subject renderers.
- `src/design-system/crivoFieldCanvas.ts` and tests — three new environmental fields.
- `src/design-system/crivoFieldRegistry.ts` and tests — static fallbacks for those fields.
- `src/design-system/motion/tokens.ts` and `variants.ts` — complete the approved motion matrix with containers, factor decomposition, recomposition, and sequence variants.
- `src/components/CrivoCore.tsx` — fluid measurement, correct backing-store initialization, theme palette, and decorative mode.
- `src/components/Layout.tsx` — immersive Hoje canvas, compact-first desktop rail, preserved route transition and route parity.
- `src/components/BottomNav.tsx` — safe-area spacing and immersive-shell contrast.
- `src/features/daily-plan/components/SubjectAtmosphere.tsx` — visible isolated field layer and light/dark palette transitions.
- `src/features/daily-plan/components/TodayFocus.tsx` — integrated decision hero with large Núcleo and controlled disclosure.
- `src/features/daily-plan/components/DecisionExplanation.tsx` — controlled disclosure and factor choreography.
- `src/features/daily-plan/components/AdaptiveUpdate.tsx` — actual presence animation.
- `src/features/daily-plan/components/DisagreeControl.tsx` — animated save confirmation and accessible live status.
- `src/features/daily-plan/components/SecondaryActionList.tsx` — removed after `DecisionSequence` owns both ranked continuations.
- `src/views/Dashboard.tsx` and `src/views/DailyPlanConsistency.test.tsx` — immersive composition, removals, and preserved action/data invariants.
- `src/index.css` — immersive shell, subject variables, hero, timeline, light/dark translations, and safe-area styles.

---

### Task 1: Install a Reproducible Fidelity Gate

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.gitignore`
- Create: `playwright.config.ts`
- Create: `tests/e2e/crivo-phase-a.spec.ts`

**Interfaces:**
- Consumes: the existing `npm run dev` server and demo-mode data.
- Produces: `npm run test:e2e:crivo`, desktop/mobile screenshots, reduced-motion assertions, and route checks used by Task 11.

- [ ] **Step 1: Add Playwright and scripts**

Run:

```powershell
npm install --save-dev @playwright/test
```

Add these scripts to `package.json`:

```json
"test:e2e:crivo": "playwright test tests/e2e/crivo-phase-a.spec.ts",
"test:e2e:crivo:update": "playwright test tests/e2e/crivo-phase-a.spec.ts --update-snapshots"
```

Extend `test:vitest` so the new daily-plan tests cannot be skipped:

```json
"test:vitest": "vitest run serverCalendar.test.ts src/features/availability src/features/daily-plan src/hooks/useDailyPlan.test.tsx src/components src/views"
```

- [ ] **Step 2: Add Playwright output ignores**

Append exactly:

```gitignore
playwright-report/
test-results/
tests/e2e/.artifacts/
```

- [ ] **Step 3: Create the browser configuration**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'tests/e2e/.artifacts',
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], viewport: { width: 390, height: 844 } } },
  ],
});
```

- [ ] **Step 4: Write the initial red fidelity test**

Create `tests/e2e/crivo-phase-a.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
  await page.goto('/');
});

test('Hoje is an immersive decision stage, not a metrics dashboard', async ({ page }, testInfo) => {
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toBeVisible();
  await expect(stage.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeVisible();
  await expect(stage.getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
  await expect(page.getByText('Prioridade Fuvest')).toHaveCount(0);
  await expect(page.getByText('Prioridade Máxima')).toHaveCount(0);
  await page.screenshot({
    path: `tests/e2e/.artifacts/${testInfo.project.name}-today.png`,
    fullPage: true,
  });
});

test('every production route remains reachable', async ({ page }) => {
  const links = await page.getByRole('link').evaluateAll((nodes) =>
    [...new Set(nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')).filter(Boolean))],
  );
  for (const href of links) {
    await page.goto(href!);
    await expect(page.locator('main')).toBeVisible();
  }
});
```

- [ ] **Step 5: Run the red test**

Run:

```powershell
npx playwright install chromium
npm run test:e2e:crivo -- --project=desktop --grep "immersive decision stage"
```

Expected: FAIL because `today-decision-stage`, hero-scale Núcleo metadata, and removals do not exist yet.

- [ ] **Step 6: Verify the existing automated baseline remains green**

Run:

```powershell
npm run lint
npm test
```

Expected: lint passes; 325 node tests and 135 existing Vitest tests remain green, plus the test runner discovers the new red file only when Playwright is invoked.

- [ ] **Step 7: Commit the gate**

```powershell
git add -- .gitignore package.json package-lock.json playwright.config.ts tests/e2e/crivo-phase-a.spec.ts
git diff --cached --check
git commit -m "test: add Crivo Phase A fidelity gate"
```

---

### Task 2: Make Visual Choreography Explicit and Truthful

**Files:**
- Create: `src/features/daily-plan/motion/useDecisionChoreography.ts`
- Create: `src/features/daily-plan/motion/useDecisionChoreography.test.tsx`
- Modify: `src/design-system/motion/tokens.ts`
- Modify: `src/design-system/motion/variants.ts`

**Interfaces:**
- Consumes: `actionId`, `rankingChanged`, `feedbackStatus`, and `useReducedMotion()`.
- Produces: `DecisionVisualPhase`, `coreState`, `isDecomposed`, and `confirmationKey` for `TodayFocus` and `DecisionFactorField`.

- [ ] **Step 1: Write fake-timer tests**

Create `src/features/daily-plan/motion/useDecisionChoreography.test.tsx`:

```tsx
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDecisionChoreography } from './useDecisionChoreography';
import type { FeedbackStatus } from '../components/DisagreeControl';

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

describe('useDecisionChoreography', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('presents a resolved decision as analyzing, converging, then ready', () => {
    const { result } = renderHook(() => useDecisionChoreography({
      actionId: 'action-1', rankingChanged: false, feedbackStatus: 'idle', explanationOpen: false,
    }));
    expect(result.current.coreState).toBe('analyzing');
    act(() => vi.advanceTimersByTime(360));
    expect(result.current.coreState).toBe('converging');
    act(() => vi.advanceTimersByTime(560));
    expect(result.current.coreState).toBe('ready');
  });

  it('confirms saved feedback without pretending the ranking changed', () => {
    const { result, rerender } = renderHook(
      ({ status }: { status: FeedbackStatus }) => useDecisionChoreography({
        actionId: 'action-1', rankingChanged: false, feedbackStatus: status, explanationOpen: false,
      }),
      { initialProps: { status: 'idle' as FeedbackStatus } },
    );
    act(() => vi.runAllTimers());
    const before = result.current.confirmationKey;
    rerender({ status: 'saved' });
    expect(result.current.confirmationKey).toBe(before + 1);
    expect(result.current.coreState).toBe('ready');
  });
});
```

- [ ] **Step 2: Run the tests red**

Run:

```powershell
npx vitest run src/features/daily-plan/motion/useDecisionChoreography.test.tsx
```

Expected: FAIL because the hook module does not exist.

- [ ] **Step 3: Implement the hook**

Create `src/features/daily-plan/motion/useDecisionChoreography.ts` with this public contract:

```ts
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import type { CrivoCoreState } from '../../../components/CrivoCore';
import type { FeedbackStatus } from '../components/DisagreeControl';

export type DecisionVisualPhase = 'forming' | 'ready' | 'decomposed' | 'recomposing';

export interface DecisionChoreographyInput {
  actionId: string;
  rankingChanged: boolean;
  feedbackStatus: FeedbackStatus;
  explanationOpen: boolean;
}

export function useDecisionChoreography(input: DecisionChoreographyInput) {
  const reducedMotion = useReducedMotion();
  const [coreState, setCoreState] = useState<CrivoCoreState>(reducedMotion ? 'ready' : input.rankingChanged ? 'recalibrating' : 'analyzing');
  const [confirmationKey, setConfirmationKey] = useState(0);
  const previousFeedback = useRef(input.feedbackStatus);

  useEffect(() => {
    if (reducedMotion) { setCoreState('ready'); return; }
    setCoreState(input.rankingChanged ? 'recalibrating' : 'analyzing');
    const converge = window.setTimeout(() => setCoreState('converging'), 350);
    const ready = window.setTimeout(() => setCoreState('ready'), 900);
    return () => { window.clearTimeout(converge); window.clearTimeout(ready); };
  }, [input.actionId, input.rankingChanged, reducedMotion]);

  useEffect(() => {
    if (previousFeedback.current !== 'saved' && input.feedbackStatus === 'saved') {
      setConfirmationKey((value) => value + 1);
    }
    previousFeedback.current = input.feedbackStatus;
  }, [input.feedbackStatus]);

  const phase: DecisionVisualPhase = input.explanationOpen
    ? 'decomposed'
    : coreState === 'ready' ? 'ready'
    : coreState === 'recalibrating' ? 'recomposing'
    : 'forming';

  return {
    coreState,
    phase,
    isDecomposed: phase === 'decomposed',
    confirmationKey,
    reducedMotion: !!reducedMotion,
  };
}
```

- [ ] **Step 4: Add complete variants**

Add to `variants.ts`:

```ts
export const rankedSequence = {
  hidden: {},
  visible: { transition: { staggerChildren: MOTION_STAGGER.list, delayChildren: 0.04 } },
};

export const factorDecompose = {
  hidden: { opacity: 0, scale: 0.92, x: 0, y: 0 },
  visible: (offset: { x: number; y: number }) => ({
    opacity: 1, scale: 1, x: offset.x, y: offset.y,
    transition: { duration: MOTION_DURATION.panel, ease: MOTION_EASE_EMPHASIZED },
  }),
};

export const decisionRecompose = {
  initial: { opacity: 0.72, scale: 0.985 },
  animate: { opacity: 1, scale: 1, transition: { duration: MOTION_DURATION.component, ease: MOTION_EASE } },
};
```

Import `MOTION_STAGGER` and `MOTION_EASE_EMPHASIZED` from `tokens.ts`. Keep durations in the token file; do not add component-local timing constants.

- [ ] **Step 5: Run focused and full checks**

```powershell
npx vitest run src/features/daily-plan/motion/useDecisionChoreography.test.tsx
npm run lint
npm test
```

Expected: all pass.

- [ ] **Step 6: Commit**

```powershell
git add -- src/features/daily-plan/motion/useDecisionChoreography.ts src/features/daily-plan/motion/useDecisionChoreography.test.tsx src/design-system/motion/tokens.ts src/design-system/motion/variants.ts
git diff --cached --check
git commit -m "feat: define truthful daily decision choreography"
```

---

### Task 3: Complete the Subject Identity Registry

**Files:**
- Modify: `src/design-system/crivoSubjects.ts`
- Modify: `src/design-system/crivoSubjects.test.ts`
- Modify: `src/design-system/crivoCoreRegistry.ts`
- Modify: `src/design-system/crivoCoreRegistry.test.ts`
- Modify: `src/design-system/crivoFieldCanvas.ts`
- Modify: `src/design-system/crivoFieldCanvas.test.ts`
- Modify: `src/design-system/crivoFieldRegistry.ts`
- Modify: `src/design-system/crivoFieldRegistry.test.ts`

**Interfaces:**
- Consumes: canonical `Topic.subject` values.
- Produces: `SubjectTheme = 'light' | 'dark'`, `getSubjectPalette(profile, theme)`, and bespoke profiles/renderers for all ten current daily-plan subjects.

- [ ] **Step 1: Strengthen the registry tests**

Replace the fallback expectation for Inglês, Filosofia, and Sociologia with:

```ts
const CURRENT_SUBJECTS = ['Matemática', 'Física', 'Química', 'Biologia', 'Português', 'Geografia', 'História', 'Inglês', 'Filosofia', 'Sociologia'];

it('gives every current daily-plan subject a bespoke visual identity in both themes', () => {
  const profiles = CURRENT_SUBJECTS.map(getSubjectProfile);
  expect(profiles.every((entry) => !entry.isFallback)).toBe(true);
  expect(new Set(profiles.map((entry) => entry.coreType))).toHaveLength(CURRENT_SUBJECTS.length);
  expect(new Set(profiles.map((entry) => entry.fieldType))).toHaveLength(CURRENT_SUBJECTS.length);
  for (const entry of profiles) {
    expect(entry.palettes.light.bg).not.toBe(entry.palettes.dark.bg);
    expect(entry.palettes.light.primary).toBeTruthy();
    expect(entry.palettes.dark.primary).toBeTruthy();
  }
});
```

- [ ] **Step 2: Run the registry test red**

```powershell
npx tsx --test src/design-system/crivoSubjects.test.ts
```

Expected: FAIL because the three fallback profiles lack bespoke core/field types and profiles lack `palettes`.

- [ ] **Step 3: Extend the public types**

Use these exact additions:

```ts
export type SubjectTheme = 'light' | 'dark';
export interface SubjectPalettes { light: CrivoPalette; dark: CrivoPalette }

export type CoreType =
  | 'matematica_grid' | 'fisica_lentes' | 'quimica_rede' | 'biologia_helix'
  | 'portugues_sintaxe' | 'geografia_fluxos' | 'historia_campos'
  | 'ingles_contexto' | 'filosofia_dialetica' | 'sociologia_rede' | 'default_neutro';

export type FieldType =
  | 'grid' | 'lenses' | 'chamber' | 'organic' | 'syntax' | 'topography' | 'paired'
  | 'semantic' | 'dialectic' | 'social' | 'neutral';

export type CrivoTypography =
  | 'mechanical' | 'vector' | 'reactive' | 'organic' | 'parsing' | 'cartographic' | 'stratified'
  | 'contextual' | 'dialectic' | 'networked' | 'neutral';
```

Change `SubjectProfile.palette` to `SubjectProfile.palettes`. Use this exact light translation for every approved dark palette so light mode remains warm while preserving each subject hue:

```ts
function makeLightPalette(dark: CrivoPalette): CrivoPalette {
  return {
    bg: '#FBF8F2',
    surface: '#F5EFE5',
    primary: dark.primary,
    secondary: dark.secondary,
    emissive: '#171A18',
    textHighlight: '#171A18',
    dataPositive: '#2E7D58',
    dataWarning: '#9A5E1E',
    atmoA: `${dark.primary}24`,
    atmoB: `${dark.secondary}18`,
  };
}
```

Export:

```ts
export function getSubjectPalette(profile: SubjectProfile, theme: SubjectTheme): CrivoPalette {
  return profile.palettes[theme];
}
```

Keep the approved dark palettes byte-for-byte and construct each profile as `palettes: { dark, light: makeLightPalette(dark) }`.

- [ ] **Step 4: Add the three missing identities**

Use these semantic directions and starting colors:

```ts
ingles: {
  coreType: 'ingles_contexto', fieldType: 'semantic', tipografia: 'contextual', rhythm: 1.05, damping: 0.9,
  dark: { bg:'#0B1018', surface:'#131C28', primary:'#5D8FD6', secondary:'#D6A85D', emissive:'#F4F7FF', textHighlight:'#D8E7FF', dataPositive:'#70C8A0', dataWarning:'#D89A55', atmoA:'#172B45', atmoB:'#070A10' },
}
filosofia: {
  coreType: 'filosofia_dialetica', fieldType: 'dialectic', tipografia: 'dialectic', rhythm: 0.72, damping: 0.7,
  dark: { bg:'#120F18', surface:'#1D1926', primary:'#8A72B5', secondary:'#C5A65A', emissive:'#F2ECFF', textHighlight:'#E2D8F5', dataPositive:'#78B995', dataWarning:'#D18C58', atmoA:'#261D38', atmoB:'#09070D' },
}
sociologia: {
  coreType: 'sociologia_rede', fieldType: 'social', tipografia: 'networked', rhythm: 0.88, damping: 0.82,
  dark: { bg:'#0D1415', surface:'#172022', primary:'#4FA3A0', secondary:'#CE7C59', emissive:'#EDF8F7', textHighlight:'#CDE8E6', dataPositive:'#76BE8E', dataWarning:'#D68C52', atmoA:'#173033', atmoB:'#070B0C' },
}
```

For each, create its light counterpart with `makeLightPalette`.

- [ ] **Step 5: Add distinct Canvas renderers and CSS fallbacks**

Implement these visible structures:

- `ingles_contexto`: token fragments whose spacing converges around a central contextual phrase;
- `filosofia_dialetica`: two opposing arcs connected by a changing synthesis axis;
- `sociologia_rede`: a multi-level node network whose clusters change density with focus.

Register matching `semantic`, `dialectic`, and `social` background fields. Extend registry tests so every `CoreType` and `FieldType` is callable with the duck-typed test context and produces at least one draw operation.

- [ ] **Step 6: Run all design-system checks**

```powershell
npx tsx --test src/design-system/*.test.ts
npm run lint
npm test
```

Expected: all pass and no current subject logs the neutral-profile warning.

- [ ] **Step 7: Commit**

```powershell
git add -- src/design-system/crivoSubjects.ts src/design-system/crivoSubjects.test.ts src/design-system/crivoCoreRegistry.ts src/design-system/crivoCoreRegistry.test.ts src/design-system/crivoFieldCanvas.ts src/design-system/crivoFieldCanvas.test.ts src/design-system/crivoFieldRegistry.ts src/design-system/crivoFieldRegistry.test.ts
git diff --cached --check
git commit -m "feat: complete Crivo subject identities"
```

---

### Task 4: Make the Núcleo a Reliable Hero Surface

**Files:**
- Modify: `src/components/CrivoCore.tsx`
- Create: `src/components/CrivoCore.ui.test.tsx`
- Modify: `src/testSetup.ts`

**Interfaces:**
- Consumes: `state`, `subject`, `previousSubject`, `topicId`, resolved subject CSS variables, and either numeric or fluid sizing.
- Produces: `<CrivoCore size="fill" data-scale="hero" decorative />` with correct Canvas backing-store dimensions and static fallbacks.

- [ ] **Step 1: Add deterministic test shims**

In `src/testSetup.ts`, add a `ResizeObserver` shim that immediately reports the observed element's `getBoundingClientRect()` and a mockable Canvas context containing the methods used by the registry. Keep the shim in tests only.

- [ ] **Step 2: Write failing hero-surface tests**

Create `src/components/CrivoCore.ui.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CrivoCore } from './CrivoCore';

describe('CrivoCore hero surface', () => {
  it('exposes hero scale and a decorative canvas without a duplicate accessible image', () => {
    render(<CrivoCore state="ready" subject="Física" topicId="fis-optica" size="fill" scale="hero" decorative />);
    expect(screen.getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('keeps an accessible state label when it is not decorative', () => {
    render(<CrivoCore state="listening" subject="Biologia" size={96} />);
    expect(screen.getByRole('img', { name: /Lendo seu histórico — Biologia/ })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the tests red**

```powershell
npx vitest run src/components/CrivoCore.ui.test.tsx
```

Expected: FAIL because `size="fill"`, `scale`, `decorative`, and the test id do not exist.

- [ ] **Step 4: Implement fluid sizing and correct initialization**

Change the props to:

```ts
export interface CrivoCoreProps {
  state: CrivoCoreState;
  className?: string;
  size?: number | 'fill';
  scale?: 'icon' | 'hero';
  subject?: string;
  previousSubject?: string;
  topicId?: string;
  decorative?: boolean;
}
```

Initialize the Canvas context and backing store in the same layout effect. For `fill`, observe the wrapper and redraw at its actual square size. Clamp DPR to 2. Set `role` and `aria-label` only when `decorative` is false. Add `data-testid="crivo-core"` and `data-scale={scale}`.

- [ ] **Step 5: Prove reduced motion draws one stable frame**

Extend the test to mock `useReducedMotion()` as true, render the component, and assert that `requestAnimationFrame` was not called while `getContext('2d')` was called once.

- [ ] **Step 6: Run checks**

```powershell
npx vitest run src/components/CrivoCore.ui.test.tsx
npm run lint
npm test
```

Expected: all pass.

- [ ] **Step 7: Commit**

```powershell
git add -- src/components/CrivoCore.tsx src/components/CrivoCore.ui.test.tsx src/testSetup.ts
git diff --cached --check
git commit -m "fix: make the Crivo core a reliable hero canvas"
```

---

### Task 5: Restore the Subject Atmosphere as a Visible Layer

**Files:**
- Modify: `src/features/daily-plan/components/SubjectAtmosphere.tsx`
- Modify: `src/index.css`
- Create: `src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx`

**Interfaces:**
- Consumes: `subject`, local theme CSS variables, and children; the component tracks the prior subject internally for palette transitions.
- Produces: a full-bleed isolated field with visible Canvas, local CSS variables, palette tween, and a static CSS fallback.

- [ ] **Step 1: Write the visible-layer test**

Start `DailyPlanMotion.ui.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SubjectAtmosphere } from './SubjectAtmosphere';

describe('SubjectAtmosphere', () => {
  it('keeps the field inside an isolated visible layer', () => {
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);
    const atmosphere = screen.getByTestId('subject-atmosphere');
    expect(atmosphere).toHaveAttribute('data-subject', 'fisica');
    expect(atmosphere).toHaveClass('isolate');
    expect(atmosphere.querySelector('canvas')).toHaveClass('z-0');
    expect(atmosphere).toHaveStyle({ backgroundColor: 'var(--subject-bg)' });
  });
});
```

- [ ] **Step 2: Run it red**

```powershell
npx vitest run src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
```

Expected: FAIL because the layer still uses negative z-index and lacks theme/test metadata.

- [ ] **Step 3: Fix the layer contract**

Use this outer structure:

```tsx
<div
  ref={setWrapperNode}
  data-testid="subject-atmosphere"
  data-subject={profile.key}
  className={cn('relative isolate overflow-hidden bg-[var(--subject-bg)] text-[var(--subject-text-highlight)]', className)}
  style={{ backgroundColor: 'var(--subject-bg)' }}
>
  <canvas aria-hidden="true" ref={canvasRef} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[var(--subject-field-css)] opacity-30 mix-blend-screen" />
  <div className="relative z-10">{children}</div>
</div>
```

Write both palette sets as local CSS variables (`--subject-light-*` and `--subject-dark-*`). In `src/index.css`, map `--subject-*` to the light variables by default and to the dark variables below `.dark [data-testid="subject-atmosphere"]`. Read the resolved `--subject-*` values with `getComputedStyle(wrapperNode)` before drawing Canvas frames, so the existing theme toggle updates the field without a second React theme source. Tween between the previous and current resolved palette. The CSS fallback remains visible even when Canvas works; it provides the base field while Canvas supplies motion.

- [ ] **Step 4: Add the immersive CSS contract**

Add named classes for `.crivo-today-stage`, `.crivo-decision-hero`, `.crivo-core-stage`, and their mobile breakpoints. Use CSS variables for subject color. Do not introduce one-off hard-coded subject colors in component class names.

- [ ] **Step 5: Run checks and commit**

```powershell
npx vitest run src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
npm run lint
npm test
git add -- src/features/daily-plan/components/SubjectAtmosphere.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx src/index.css
git diff --cached --check
git commit -m "feat: restore the visible subject atmosphere"
```

---

### Task 6: Rebuild Hoje as an Integrated Decision Hero

**Files:**
- Create: `src/features/daily-plan/components/DecisionSignalStrip.tsx`
- Modify: `src/features/daily-plan/components/TodayFocus.tsx`
- Modify: `src/views/Dashboard.tsx`
- Modify: `src/views/DailyPlanConsistency.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: the existing `AllocatedStudyAction`, labels, main reason, ranking-change state, feedback handlers, and theme.
- Produces: one `today-decision-stage` with an integrated large Núcleo, first-fold CTA, and compact decision signals.

- [ ] **Step 1: Add red composition assertions**

Extend `DailyPlanConsistency.test.tsx`:

```tsx
it('Dashboard renders one immersive decision and removes generic dashboard blocks', () => {
  renderView(<Dashboard />);
  const stage = screen.getByTestId('today-decision-stage');
  expect(within(stage).getByRole('heading', { name: FIRST_TOPIC })).toBeInTheDocument();
  expect(within(stage).getByRole('button', { name: 'Começar' })).toBeInTheDocument();
  expect(within(stage).getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
  expect(screen.queryByText('Prioridade Máxima')).not.toBeInTheDocument();
  expect(screen.queryByText('Prioridade Fuvest')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test red**

```powershell
npx vitest run src/views/DailyPlanConsistency.test.tsx
```

Expected: FAIL on the absent stage metadata and still-present generic blocks.

- [ ] **Step 3: Create compact decision instruments**

`DecisionSignalStrip` accepts:

```ts
export interface DecisionSignalStripProps {
  mastery: number;
  uncertainty: number;
  urgency: number;
  minutes: number;
}
```

Render one semantic `<dl>` with four `<div>` instruments and visible labels `Domínio`, `Confiança`, `Urgência`, and `Tempo`. Use text and values, not color alone.

- [ ] **Step 4: Recompose `TodayFocus`**

Use a single semantic section:

```tsx
<motion.section
  data-testid="today-decision-stage"
  aria-labelledby={`decision-${action.id}`}
  className="crivo-decision-hero"
  layout
>
  <div className="crivo-decision-copy">...</div>
  <div className="crivo-core-stage" aria-hidden="true">
    <CrivoCore size="fill" scale="hero" decorative state={coreState} subject={action.subject} previousSubject={previousSubject} topicId={action.topicId} />
  </div>
</motion.section>
```

The copy column order is eyebrow, kinetic topic heading, intervention/duration, reason, CTA, signals, then explanation/discordance. Keep the CTA inside the first mobile viewport.

- [ ] **Step 5: Remove the contradictory Dashboard blocks**

Delete the three-card `Tempo de Estudo / Autonomia / Prioridade Máxima` grid and the static `Prioridade Fuvest` panel. Keep exam, availability, and overdue-review context only when it changes the current decision; place it after the hero in a compact disclosure.

- [ ] **Step 6: Run focused/full checks**

```powershell
npx vitest run src/views/DailyPlanConsistency.test.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
npm run lint
npm test
```

Expected: all pass and every planned/waiting action still appears exactly once.

- [ ] **Step 7: Commit**

```powershell
git add -- src/features/daily-plan/components/DecisionSignalStrip.tsx src/features/daily-plan/components/TodayFocus.tsx src/views/Dashboard.tsx src/views/DailyPlanConsistency.test.tsx src/index.css
git diff --cached --check
git commit -m "feat: rebuild Hoje as an immersive decision stage"
```

---

### Task 7: Decompose Explanations and Recompose Real Feedback

**Files:**
- Create: `src/features/daily-plan/components/DecisionFactorField.tsx`
- Modify: `src/features/daily-plan/components/DecisionExplanation.tsx`
- Modify: `src/features/daily-plan/components/AdaptiveUpdate.tsx`
- Modify: `src/features/daily-plan/components/DisagreeControl.tsx`
- Modify: `src/features/daily-plan/components/TodayFocus.tsx`
- Modify: `src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx`

**Interfaces:**
- Consumes: real `RecommendationFactor[]`, `RecommendationSnapshot`, controlled `open`, `feedbackStatus`, and choreography phase.
- Produces: factor nodes that visually separate from the decision, animated real ranking notice, and animated save confirmation.

- [ ] **Step 1: Add failing disclosure and confirmation tests**

Add tests that click `Por que isso?`, assert `aria-expanded="true"`, find all five factor labels when present, and verify a saved feedback status uses `role="status"` with `Registrado`. Mock reduced motion and assert the same content appears without hidden/initial transforms.

- [ ] **Step 2: Run the tests red**

```powershell
npx vitest run src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
```

Expected: FAIL because disclosure is internally controlled, factor nodes do not leave the panel, and saved confirmation is static.

- [ ] **Step 3: Make disclosure controlled**

Change the public interface:

```ts
interface DecisionExplanationProps {
  mainReason: string;
  factors: RecommendationFactor[];
  snapshot: RecommendationSnapshot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisagree: () => void;
  className?: string;
}
```

Keep button semantics with `aria-expanded` and `aria-controls`. Render detailed textual evidence inside `AnimatePresence`.

- [ ] **Step 4: Build `DecisionFactorField`**

Map the five factor kinds to concise Portuguese labels and deterministic offsets around the Núcleo. Render only while `phase === 'decomposed'`. Use `factorDecompose` with a stable custom offset and include contribution text. Negative or zero contributions remain explicit; do not hide them.

- [ ] **Step 5: Animate only real notices**

Wrap `AdaptiveUpdate` in a Motion status entry using the approved component duration. In `DisagreeControl`, render the saved branch through `motion.p` with `confirmation` and `role="status" aria-live="polite"`. The `idle/saving → saved` transition increments `confirmationKey` only; it must not move the Núcleo into `recalibrating` because the current feedback contract does not change the ranking. Recomposition is reserved for a real new action id or `rankingChanged` signal.

- [ ] **Step 6: Run checks and commit**

```powershell
npx vitest run src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
npm run lint
npm test
git add -- src/features/daily-plan/components/DecisionFactorField.tsx src/features/daily-plan/components/DecisionExplanation.tsx src/features/daily-plan/components/AdaptiveUpdate.tsx src/features/daily-plan/components/DisagreeControl.tsx src/features/daily-plan/components/TodayFocus.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
git diff --cached --check
git commit -m "feat: animate decision explanation and feedback"
```

---

### Task 8: Replace Card Lists with a Ranked Decision Sequence

**Files:**
- Create: `src/features/daily-plan/components/DecisionSequence.tsx`
- Delete: `src/features/daily-plan/components/SecondaryActionList.tsx`
- Modify: `src/views/Dashboard.tsx`
- Modify: `src/views/DailyPlanConsistency.test.tsx`
- Modify: `src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: allocated secondary actions, unallocated waiting actions, action labels, and `onStart(topicId)`.
- Produces: one ranked timeline with distinct `next` and `waiting` regions, stable keyed layout motion, and true stagger.

- [ ] **Step 1: Add a red sequence test**

Assert that `Depois disso` and `Pode esperar` remain named sections, each action is present once, and sequence items expose `data-action-id` in ranking order. Assert the waiting disclosure is collapsed by default; desktop and mobile may both open it explicitly.

- [ ] **Step 2: Run red**

```powershell
npx vitest run src/views/DailyPlanConsistency.test.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
```

Expected: FAIL because the existing lists are independent cards without timeline metadata or container stagger.

- [ ] **Step 3: Implement the sequence**

Use:

```ts
export interface DecisionSequenceProps {
  next: AllocatedStudyAction[];
  waiting: StudyAction[];
  actionLabels: Record<StudyAction['type'], string>;
  onStart: (topicId: string) => void;
}
```

Render one `<section aria-labelledby="decision-sequence-title">` with a single `motion.ol variants={rankedSequence}`. Every `motion.li` has `layout`, `layoutId={action.id}`, `data-action-id={action.id}`, and the existing action id as React key. Separate waiting items with a labelled disclosure while retaining them in ranking order.

- [ ] **Step 4: Integrate and remove the old component**

Replace both `SecondaryActionList` calls in Dashboard with one `DecisionSequence`. Delete the old file only after `rg "SecondaryActionList" src` returns no consumers.

- [ ] **Step 5: Run checks and commit**

```powershell
npx vitest run src/views/DailyPlanConsistency.test.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx
npm run lint
npm test
git add -- src/features/daily-plan/components/DecisionSequence.tsx src/features/daily-plan/components/SecondaryActionList.tsx src/views/Dashboard.tsx src/views/DailyPlanConsistency.test.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx src/index.css
git diff --cached --check
git commit -m "feat: turn daily actions into a ranked sequence"
```

---

### Task 9: Give Hoje an Immersive but Route-Safe Shell

**Files:**
- Create: `src/components/layout/routePresentation.ts`
- Create: `src/components/layout/routePresentation.test.ts`
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/BottomNav.tsx`
- Modify: `src/components/LayoutRouteTransition.ui.test.tsx`
- Modify: `src/components/LayoutReducedMotionTransition.ui.test.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `location.pathname`.
- Produces: `RoutePresentation { immersive, contentClassName, mainClassName }`; Hoje gets full-bleed space while all other routes retain readable max width and padding.

- [ ] **Step 1: Write the pure mapping test**

```ts
import { describe, expect, it } from 'vitest';
import { routePresentationFor } from './routePresentation';

describe('routePresentationFor', () => {
  it('makes only Hoje immersive', () => {
    expect(routePresentationFor('/').immersive).toBe(true);
    expect(routePresentationFor('/sessao').immersive).toBe(false);
    expect(routePresentationFor('/diagnostico').immersive).toBe(false);
  });
});
```

- [ ] **Step 2: Run red and implement**

Run `npx vitest run src/components/layout/routePresentation.test.ts`, expect a missing-module failure, then create:

```ts
export interface RoutePresentation {
  immersive: boolean;
  mainClassName: string;
  contentClassName: string;
}

export function routePresentationFor(pathname: string): RoutePresentation {
  return pathname === '/'
    ? { immersive: true, mainClassName: 'bg-transparent', contentClassName: 'min-h-full max-w-none p-0' }
    : { immersive: false, mainClassName: 'bg-background-base', contentClassName: 'mx-auto max-w-6xl p-4 sm:p-8' };
}
```

- [ ] **Step 3: Integrate without changing route ownership**

In Layout, compute the presentation from the pathname and apply its classes to `<main>` and the route wrapper. Keep `AnimatePresence mode="wait"`, the pathname key, and all `NAV_GROUPS` routes. Change the first-run rail default from expanded to compact while respecting an existing stored preference.

- [ ] **Step 4: Protect mobile safe areas**

Use `padding-bottom: calc(4rem + env(safe-area-inset-bottom))` for immersive mobile content and apply `env(safe-area-inset-bottom)` to BottomNav. Verify the CTA and first sequence item remain above the navigation.

- [ ] **Step 5: Run shell tests**

```powershell
npx vitest run src/components/layout/routePresentation.test.ts src/components/LayoutRouteTransition.ui.test.tsx src/components/LayoutReducedMotionTransition.ui.test.tsx
npm run lint
npm test
```

Expected: all pass; route transitions still wait in normal motion and render immediately in reduced motion.

- [ ] **Step 6: Commit**

```powershell
git add -- src/components/layout/routePresentation.ts src/components/layout/routePresentation.test.ts src/components/Layout.tsx src/components/BottomNav.tsx src/components/LayoutRouteTransition.ui.test.tsx src/components/LayoutReducedMotionTransition.ui.test.tsx src/index.css
git diff --cached --check
git commit -m "feat: add immersive route-safe Crivo shell"
```

---

### Task 10: Close Accessibility and Performance Gaps

**Files:**
- Modify: `src/components/CrivoCore.tsx`
- Modify: `src/features/daily-plan/components/SubjectAtmosphere.tsx`
- Modify: `src/features/daily-plan/components/TodayFocus.tsx`
- Modify: `src/features/daily-plan/components/DecisionFactorField.tsx`
- Modify: `src/features/daily-plan/components/DecisionSequence.tsx`
- Modify: `src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx`
- Modify: `tests/e2e/crivo-phase-a.spec.ts`

**Interfaces:**
- Consumes: the completed Phase A UI.
- Produces: keyboard-complete, reduced-motion-safe, Canvas-fallback-safe, pauseable visuals with no duplicated announcements.

- [ ] **Step 1: Add reduced-motion browser coverage**

Add:

```ts
test('reduced motion exposes the final decision without animated transforms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.getByTestId('today-decision-stage')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Começar' })).toBeVisible();
  const animated = await page.locator('[data-motion-active="true"]').count();
  expect(animated).toBe(0);
});
```

- [ ] **Step 2: Add keyboard and fallback tests**

Cover `Tab → Por que isso? → Enter → Discordo → option → confirmation`, assert focus remains visible and `aria-expanded` changes. Mock `canvas.getContext` to return null and assert the CSS fallback, decision text, and CTA remain visible.

- [ ] **Step 3: Audit runtime cleanup**

Verify every `requestAnimationFrame`, timeout, `ResizeObserver`, `IntersectionObserver`, and visibility listener has cleanup. Add a test that unmounts Hoje and asserts no further mocked RAF callback executes.

- [ ] **Step 4: Mark motion activity truthfully**

Set `data-motion-active="true"` only while a component is in a non-final visual phase. Omit it in reduced motion and after animation completes. This attribute is for QA, not styling.

- [ ] **Step 5: Run checks and commit**

```powershell
npx vitest run src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx src/components/CrivoCore.ui.test.tsx
npm run lint
npm test
npm run test:e2e:crivo -- --project=desktop --grep "reduced motion"
git add -- src/components/CrivoCore.tsx src/features/daily-plan/components/SubjectAtmosphere.tsx src/features/daily-plan/components/TodayFocus.tsx src/features/daily-plan/components/DecisionFactorField.tsx src/features/daily-plan/components/DecisionSequence.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx tests/e2e/crivo-phase-a.spec.ts
git diff --cached --check
git commit -m "fix: harden Crivo motion accessibility and lifecycle"
```

---

### Task 11: Real-Browser Fidelity Review and Final Polish

**Files:**
- Modify only files with defects proven during this task.
- Create: `docs/superpowers/verification/2026-08-29-crivo-phase-a.md`

**Interfaces:**
- Consumes: the complete Phase A implementation and approved reference.
- Produces: verified desktop/mobile/light/dark/reduced-motion evidence and an exact issue record.

- [ ] **Step 1: Run the complete automated suite**

```powershell
npm run lint
npm test
npm run build
npm run test:e2e:crivo
git diff --check
```

Expected: all commands exit 0. Record exact test totals and preserve the existing large-chunk warning as a separately identified baseline warning unless Phase A increases it materially.

- [ ] **Step 2: Capture the required visual matrix**

Capture, at minimum:

- desktop 1440×900: light and dark;
- mobile 390×844: light and dark;
- Física → Biologia subject transition;
- Biologia → História subject transition;
- “Por que isso?” closed and open;
- “Discordo” idle, saving, and saved;
- reduced motion;
- Canvas unavailable;
- loading, no diagnosis, no availability, no urgent action, and ready states.

- [ ] **Step 3: Compare against the approved reference**

View the reference and production side by side. Reject the build if any of these are true:

- the Núcleo reads as an icon rather than the protagonist;
- the field is visually absent;
- subject changes read as recolors only;
- mobile is a narrow desktop stack;
- generic metric cards or the static Fuvest banner remain;
- CTA, topic, duration, or reason fall below the first mobile viewport;
- motion continues after the decision reaches its final state without an ambient-field justification.

- [ ] **Step 4: Fix every proven defect with a focused test**

For each defect, add or strengthen a failing test, make the smallest production correction, rerun the focused test, and rerun the relevant browser case. Do not batch unrelated polish changes.

- [ ] **Step 5: Write the verification record**

Create `docs/superpowers/verification/2026-08-29-crivo-phase-a.md` containing:

- commit range;
- exact automated command results;
- browser matrix and artifact paths;
- reference comparisons;
- accessibility and reduced-motion results;
- Canvas fallback result;
- remaining baseline warnings;
- explicit statement that no push, merge, or deploy occurred.

- [ ] **Step 6: Commit verification and final proven fixes**

```powershell
git add -- docs/superpowers/verification/2026-08-29-crivo-phase-a.md src/components/CrivoCore.tsx src/components/Layout.tsx src/components/BottomNav.tsx src/components/layout/routePresentation.ts src/features/daily-plan/components/SubjectAtmosphere.tsx src/features/daily-plan/components/TodayFocus.tsx src/features/daily-plan/components/DecisionSignalStrip.tsx src/features/daily-plan/components/DecisionFactorField.tsx src/features/daily-plan/components/DecisionExplanation.tsx src/features/daily-plan/components/AdaptiveUpdate.tsx src/features/daily-plan/components/DisagreeControl.tsx src/features/daily-plan/components/DecisionSequence.tsx src/features/daily-plan/components/DailyPlanMotion.ui.test.tsx src/views/Dashboard.tsx src/views/DailyPlanConsistency.test.tsx src/index.css tests/e2e/crivo-phase-a.spec.ts
git diff --cached --name-only
git diff --cached --check
git commit -m "test: verify Crivo Phase A fidelity"
```

- [ ] **Step 7: Stop at the phase gate**

Report the commit range, test totals, browser artifacts, remaining warnings, and any deviation from the approved reference. Wait for the user's visual approval before planning or implementing Phase B.
