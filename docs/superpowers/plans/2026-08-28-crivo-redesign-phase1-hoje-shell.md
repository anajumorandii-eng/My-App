# Crivo Redesign — Fase 1: Hoje + Shell Global — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the approved "Núcleo Instrumental" visual/motion system into the real app — tela Hoje's content plus the global navigation shell — built on top of the CURRENT `origin/main` (1c4ebb3), preserving every feature main already has (alocação por horário, evidência de recuperação, catálogo de resumos, etc.), with zero regressions.

**Architecture:** `feature/crivo-shell-hoje` (the checkout at `Downloads/My-App-main (1)/...`) forked from `origin/main` a long time ago and was never rebased — 52 commits of real, unrelated feature work landed on `main` since (see "Divergence audit" below), while the Hoje redesign was built, uncommitted, on the old base. Rather than rebasing that stale branch (which would require manually replaying 52 commits' worth of business logic), this plan starts a **new branch from current `origin/main`** and ports in only the genuinely new, additive Hoje/design-system files, plus a small set of precise, additive edits to the handful of shared files that both sides touched.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind v4, `motion` (Framer Motion), `node:test` + `tsx --test`, Firebase/Firestore.

**Spec:** This conversation's cumulative discovery (no separate spec doc) — see "Divergence audit" below for the load-bearing facts this plan argues from. `.claude/design-reference/nucleo-instrumental/{APPROVED.md,engine.js}` remains the visual/motion reference of record.

## Global Constraints

- Never `git add -A` / `git add .` — stage explicit named files only, every task.
- Do not touch any screen outside Hoje's own content in this phase — the shell (`Layout.tsx`) changes globally by design (approved by the user for the full-app redesign), but Diagnóstico/Sessão/Questões/etc.'s own page content stays exactly as `origin/main` has it until their own later phase.
- Every screen's nav entry and every route in `App.tsx` must remain reachable — no silent route removal.
- `prefers-reduced-motion` must be respected by every new animated surface (already true of the ported files; verify, don't assume).
- Firestore writes must keep `origin/main`'s transaction/`serverTimestamp()` semantics — never regress to the older, race-unsafe local versions of `userData.ts`.
- Run `npm run lint` (tsc --noEmit) and `npm test` after every task; both must be clean before moving to the next task.

---

## Divergence audit (why this plan is shaped this way)

Verified via `git diff origin/main -- <path>` and `git status --porcelain -- src/` against the working tree at `Downloads/My-App-main (1)/.../My-App` (branch `feature/crivo-shell-hoje`, HEAD `7476884`, 3 commits ahead / 52 behind `origin/main`):

- **~20 files are simply stale locally**, not deliberately redesigned: every view except Dashboard (`Conexoes, Diagnostico, Erros, Evolucao, Flashcards, ObrasObrigatorias, Plano, Recuperacao, Redacao, Revisoes, Sessao, Treino2aFase, Tutor`), `App.tsx`, `index.css`(pre-redesign 9-line version), `backlogEngine.ts`, `flashcardContent.ts`, `spacedRepetition.ts(+.test)`, `useFlashcardReviews.ts`, `useUserBacklog.ts`, `useUserMastery.ts`, `discursiveQuestions.ts`, `FlashcardSession.tsx`, and critically **`userData.ts`**. For `userData.ts` specifically: `origin/main`'s version added Firestore transaction safety (`runTransaction` in `updateUserMastery`), `serverTimestamp()` on every write, and preserves legacy mastery rows for topics removed from the catalog (`RecoveryEvidence`/`StudySessionRecord` integration) — the local working-tree version is a **strictly older, less safe** copy. None of this category gets ported from local; starting the new branch from `origin/main` resolves all of it for free.
- **`efficiencyEngine.ts`**: `origin/main` has `rankStudyActions(masteryData, topics, profile, goals, now)` as a separate public method (needed by `origin/main`'s own `useDailyPlan.ts`) plus `generateDailyPlan(..., availableMinutesToday, ...)` that calls it and does time-budget splitting (review/content buckets, `interleaveBySubject`). The local working tree adds, on top of the same logic: a `factors: RecommendationFactor[]` + `snapshot: RecommendationSnapshot` waterfall breakdown on every `StudyAction` (consumed by `DecisionExplanation`/`MasteryMeter`), and a `generateDeferredActions` method (via a private `rank()` split) for the "Pode esperar" list. **Both sides must be preserved — origin/main's method surface (`rankStudyActions` must keep existing, `useDailyPlan.ts` depends on it) plus local's factors/snapshot/deferred additions.**
- **`types.ts`**: `origin/main` has `AllocatedStudyAction extends StudyAction` (adds `intervalStart/intervalEnd/allocatedMinutes`), `RecoveryEvidence`, `StudySessionRecord`, `StudyVerification`, flashcard training-classification fields, `CalendarEvent.transparency/status`, `DiscursiveQuestion.topicId` — **none of which exist in the local working tree's `types.ts`**. Local adds `RecommendationFactor`/`RecommendationSnapshot`/`StudyAction.factors`/`StudyAction.snapshot`, which `origin/main` doesn't have. This plan starts from `origin/main`'s `types.ts` and adds only the local-only factors/snapshot pieces.
- **`useDailyPlan.ts` + `studyActionAllocator.ts`**: exist ONLY on `origin/main` (confirmed absent from the local working tree entirely, tracked or not) — adopted wholesale, untouched.
- **`Layout.tsx`**: local rewrites the whole shell (rail nav grouped by section, `BottomNav` mobile, `useTheme`, `OnboardingModal`, `CrivoMark`/"Crivo" rebrand, `useSpotlight` hover). Confirmed via a side-by-side screenshot comparison (published artifact) and the user's explicit go-ahead to adopt this globally. Two real gaps found by diffing route lists: local's nav is **missing `/agenda` ("Agenda", `Calendar` icon) and `/resumos` ("Resumos Interativos", `Library` icon)** — both real `origin/main` routes/features. Must add both before this is a legitimate full replacement.
- **`App.tsx`**: local is missing the `/agenda` and `/resumos` `<Route>` entries entirely (no local pages exist for them) — adopt `origin/main`'s version wholesale, no local edits to merge in.
- **`Dashboard.tsx`**: `origin/main`'s current version (built across commits up to `43cb7c4`) has real content the local rewrite doesn't: a "ANA JÚLIA · MEDICINA" header line, a 3-card stats grid (Tempo de Estudo / Autonomia / Prioridade Máxima), and a "Prioridade Fuvest" CTA banner linking to `/resumos`. The local rewrite's `Dashboard.tsx` is built on the OLD data shape (`EfficiencyEngine.generateDailyPlan` called directly, no `useDailyPlan`/`AllocatedStudyAction`/time-slot display) and lacks all three of those content blocks. This phase's Dashboard task must reproduce all of `origin/main`'s content, restyled in the new visual system, not just port local's simpler version.
- **`index.html`**: local adds Newsreader+Inter font links and a synchronous inline theme-resolution script (mirrors `theme.ts`'s `resolveInitialTheme()`) plus the Crivo rebrand (title/app name/theme-color meta). Purely additive over `origin/main`'s minimal file — safe to adopt wholesale.
- **Framer Motion**: no page-transition system exists anywhere (confirmed: zero `AnimatePresence` usage in the whole tree). All motion is in one documented table, `src/design-system/motion/tokens.ts`'s `MOTION_MATRIX` — 8 of 10 rows are Hoje-scoped, 2 are shell-scoped (nav rail expand/collapse, spotlight hover). This phase's "transições de página" task (Task 9) is new work, not a port — see Task 9.

---

## Task 1: Stand up the integration branch

**Files:** none (git operations only).

- [ ] **Step 1:** In the existing origin/main preview worktree, create the new integration branch from the current tip.

```bash
cd /c/wtmain
git fetch origin --quiet
git status --short   # must be clean before branching
git checkout -b feature/crivo-redesign
```

- [ ] **Step 2:** Verify baseline is green before any change.

```bash
npm run lint
npm test
npm run build
```

Expected: all three clean (this is `origin/main`'s own state — if anything fails here, stop and report; do not proceed on a red baseline).

- [ ] **Step 3:** Commit nothing yet (no changes made). Confirm branch state.

```bash
git log --oneline -3
git rev-parse --abbrev-ref HEAD   # feature/crivo-redesign
```

---

## Task 2: Port the design-system foundation (motion, theme, Crivo visual engine)

**Files:**
- Create (copy byte-for-byte from `Downloads/My-App-main (1)/.../My-App/src/...` into `/c/wtmain/src/...`):
  - `src/design-system/motion/tokens.ts`
  - `src/design-system/motion/variants.ts`
  - `src/design-system/theme.ts`, `src/design-system/theme.test.ts`
  - `src/design-system/crivoSubjects.ts`, `crivoSubjects.test.ts`
  - `src/design-system/crivoCoreRegistry.ts`, `crivoCoreRegistry.test.ts`
  - `src/design-system/crivoCoreShell.ts`, `crivoCoreShell.test.ts`
  - `src/design-system/crivoFieldCanvas.ts`, `crivoFieldCanvas.test.ts`
  - `src/design-system/crivoFieldRegistry.ts`, `crivoFieldRegistry.test.ts`
  - `src/design-system/crivoSpring.ts`, `crivoSpring.test.ts`
  - `src/design-system/crivoPaletteTween.ts`, `crivoPaletteTween.test.ts`
  - `src/design-system/crivoTopicVariant.ts`, `crivoTopicVariant.test.ts`
  - `src/design-system/crivoRafGate.ts`, `crivoRafGate.test.ts`
  - `src/design-system/crivoAdaptiveRanking.test.ts`
  - `src/lib/cn.ts`

**Interfaces:**
- Produces: `getSubjectProfile`, `SUBJECT_REGISTRY`, `TYPOGRAPHY_PRESETS`, `CORE_REGISTRY`, `FIELD_CANVAS_REGISTRY`, `FIELD_REGISTRY`, `drawExternalShell`/`drawCenterLight`/`drawScanSweep`, `makeSpring`/`stepSpring`, `tweenPalette`/`pickContrastTextColor`, `topicVariantSeed`, `shouldRunLoop`, `MOTION_DURATION`/`MOTION_EASE`/`MOTION_STAGGER`/`MOTION_MATRIX`, `cn()` — all consumed by Tasks 3–9.

- [ ] **Step 1:** Copy every file listed above from the old checkout to `/c/wtmain`, preserving relative paths exactly.

```bash
SRC="/c/Users/Maria Fernanda/Downloads/My-App-main (1)/My-App-main/My-App"
DST="/c/wtmain"
for f in \
  src/design-system/motion/tokens.ts \
  src/design-system/motion/variants.ts \
  src/design-system/theme.ts src/design-system/theme.test.ts \
  src/design-system/crivoSubjects.ts src/design-system/crivoSubjects.test.ts \
  src/design-system/crivoCoreRegistry.ts src/design-system/crivoCoreRegistry.test.ts \
  src/design-system/crivoCoreShell.ts src/design-system/crivoCoreShell.test.ts \
  src/design-system/crivoFieldCanvas.ts src/design-system/crivoFieldCanvas.test.ts \
  src/design-system/crivoFieldRegistry.ts src/design-system/crivoFieldRegistry.test.ts \
  src/design-system/crivoSpring.ts src/design-system/crivoSpring.test.ts \
  src/design-system/crivoPaletteTween.ts src/design-system/crivoPaletteTween.test.ts \
  src/design-system/crivoTopicVariant.ts src/design-system/crivoTopicVariant.test.ts \
  src/design-system/crivoRafGate.ts src/design-system/crivoRafGate.test.ts \
  src/design-system/crivoAdaptiveRanking.test.ts \
  src/lib/cn.ts \
; do
  mkdir -p "$DST/$(dirname "$f")"
  cp "$SRC/$f" "$DST/$f"
done
```

- [ ] **Step 2:** Run tests — these files are self-contained (no dependency on `types.ts`/`efficiencyEngine.ts` changes yet) so they should pass immediately.

```bash
cd /c/wtmain && npm test 2>&1 | tail -20
```

Expected: new test files pass. `crivoAdaptiveRanking.test.ts` will fail (it tests `useAdaptiveRankingChange`, ported in Task 3) — that's expected at this point, note it and continue.

- [ ] **Step 3:** Commit.

```bash
git add src/design-system src/lib/cn.ts
git commit -m "feat: add Crivo design-system foundation (motion tokens, theme, subject/core/field registries, springs)"
```

---

## Task 3: Port hooks and the base UI kit

**Files:**
- Create:
  - `src/hooks/useAdaptiveRankingChange.ts`
  - `src/hooks/useRafLoop.ts`
  - `src/hooks/useTheme.ts`
  - `src/hooks/useSpotlight.ts`
  - `src/hooks/usePreviousFeedback.ts`
  - `src/components/ui/Button.tsx`, `Panel.tsx`, `EmptyState.tsx`, `Skeleton.tsx`, `IconButton.tsx`, `PrecisionMark.tsx`, `ProgressBar.tsx`
  - `src/components/ui/KineticText.tsx`
  - `src/components/CrivoCore.tsx`, `CrivoMark.tsx`, `BottomNav.tsx`, `OnboardingModal.tsx`

**Interfaces:**
- Consumes: everything from Task 2 (`getSubjectProfile`, `CORE_REGISTRY`, `drawExternalShell`, `makeSpring`/`stepSpring`, `MOTION_*`, `cn`).
- Produces: `useAdaptiveRankingChange(topicId?, subject?) → {changed, previousSubject?}`, `useRafLoop(cb, {paused, target})`, `useTheme() → {isDark, toggleTheme}`, `useSpotlight() → {onPointerMove}`, `usePreviousFeedback(topicId, userId?)`, `<CrivoCore state subject previousSubject topicId size className />`, `<Button>`, `<Panel>`, `<EmptyState>`, `<Skeleton>`, `<IconButton>`, `<PrecisionMark>`, `<ProgressBar>`, `<KineticText text runKey stagger duration ease />`, `<CrivoMark>`, `<BottomNav>`, `<OnboardingModal>` — consumed by Task 4 (daily-plan components) and Task 8 (Layout).

- [ ] **Step 1:** Copy every file listed above.

```bash
SRC="/c/Users/Maria Fernanda/Downloads/My-App-main (1)/My-App-main/My-App"
DST="/c/wtmain"
for f in \
  src/hooks/useAdaptiveRankingChange.ts \
  src/hooks/useRafLoop.ts \
  src/hooks/useTheme.ts \
  src/hooks/useSpotlight.ts \
  src/hooks/usePreviousFeedback.ts \
  src/components/ui/Button.tsx src/components/ui/Panel.tsx src/components/ui/EmptyState.tsx \
  src/components/ui/Skeleton.tsx src/components/ui/IconButton.tsx src/components/ui/PrecisionMark.tsx \
  src/components/ui/ProgressBar.tsx src/components/ui/KineticText.tsx \
  src/components/CrivoCore.tsx src/components/CrivoMark.tsx src/components/BottomNav.tsx \
  src/components/OnboardingModal.tsx \
; do
  mkdir -p "$DST/$(dirname "$f")"
  cp "$SRC/$f" "$DST/$f"
done
```

- [ ] **Step 2:** `npm run lint` — expect failures only where these files import `RecommendationFactor`/`RecommendationSnapshot`/`AllocatedStudyAction` fields not yet on `origin/main`'s `types.ts` (none of Task 3's files should — `CrivoCore` takes `subject`/`topicId` strings, not a `StudyAction`). If lint is clean, good; if not, note exactly which import fails for Task 5/6 to resolve, don't fix it here.

- [ ] **Step 3:** `npm test` — `crivoAdaptiveRanking.test.ts` should now pass.

- [ ] **Step 4:** Commit.

```bash
git add src/hooks src/components/ui src/components/CrivoCore.tsx src/components/CrivoMark.tsx src/components/BottomNav.tsx src/components/OnboardingModal.tsx
git commit -m "feat: add Crivo hooks (theme, spotlight, raf loop, adaptive ranking) and base UI kit"
```

---

## Task 4: Port the daily-plan feature components

> **Amended after Task 4's first dispatch was BLOCKED:** the implementer correctly found that `DecisionExplanation.tsx`/`ConfidenceIndicator.tsx`/`MasteryMeter.tsx` import `src/lib/confidence.ts` directly, which the original plan didn't schedule until Task 7 — a real ordering defect, not a copy mistake. Ruling: pull `confidence.ts`+`confidence.test.ts` forward into this task (both are self-contained, no interaction with the `types.ts`/`efficiencyEngine.ts` merge in Tasks 5-6). Task 7 no longer ports these two files — see its amended file list.

**Files:**
- Create:
  - `src/features/daily-plan/components/TodayFocus.tsx`
  - `src/features/daily-plan/components/SubjectAtmosphere.tsx`
  - `src/features/daily-plan/components/AdaptiveUpdate.tsx`
  - `src/features/daily-plan/components/ConfidenceIndicator.tsx`
  - `src/features/daily-plan/components/DecisionExplanation.tsx`
  - `src/features/daily-plan/components/DisagreeControl.tsx`
  - `src/features/daily-plan/components/MasteryMeter.tsx`
  - `src/features/daily-plan/components/SecondaryActionList.tsx`
  - `src/lib/confidence.ts`, `src/lib/confidence.test.ts` (moved forward from Task 7 — see amendment note above)

**Interfaces:**
- Consumes: Task 2/3 exports, plus `StudyAction.factors`/`.snapshot` and `AllocatedStudyAction.intervalStart/intervalEnd` — **not yet available**, so this task will not compile clean until Task 6 lands. That's expected and fine — commit anyway, lint failure is tracked and resolved by Task 6. This includes errors of the shape `Module '"../../../types"' has no exported member 'RecommendationFactor'` (not just `Property 'factors' does not exist...`) — same root cause (types.ts not yet updated), different TS error shape; both are expected redness, not new blockers.
- Produces: `<TodayFocus action actionLabel mainReason onStart showAdaptiveUpdate previousSubject userId feedbackStatus onDisagree />`, `<SecondaryActionList title actions actionLabels onStart quiet? />`, `<DecisionExplanation mainReason factors snapshot onDisagree />`, `<MasteryMeter level uncertainty topicName />` — all consumed by Task 9 (`Dashboard.tsx` rewrite). `confidence.ts`'s exports consumed by these same components (whatever it exports — verify against actual usage, not guessed) and later by `Dashboard.tsx` (Task 9).

- [ ] **Step 1:** Copy every file listed above.

```bash
SRC="/c/Users/Maria Fernanda/Downloads/My-App-main (1)/My-App-main/My-App"
DST="/c/wtmain"
for f in \
  src/features/daily-plan/components/TodayFocus.tsx \
  src/features/daily-plan/components/SubjectAtmosphere.tsx \
  src/features/daily-plan/components/AdaptiveUpdate.tsx \
  src/features/daily-plan/components/ConfidenceIndicator.tsx \
  src/features/daily-plan/components/DecisionExplanation.tsx \
  src/features/daily-plan/components/DisagreeControl.tsx \
  src/features/daily-plan/components/MasteryMeter.tsx \
  src/features/daily-plan/components/SecondaryActionList.tsx \
  src/lib/confidence.ts \
  src/lib/confidence.test.ts \
; do
  mkdir -p "$DST/$(dirname "$f")"
  cp "$SRC/$f" "$DST/$f"
done
```

- [ ] **Step 2:** `npm run lint` — record the exact list of type errors (expected: `Property 'factors' does not exist on type 'StudyAction'`, `Property 'snapshot' does not exist...`, `Module has no exported member 'RecommendationFactor'/'RecommendationSnapshot'`, and similar — all tracing back to `types.ts` not yet having Task 5's additions). Do not fix yet. `confidence.test.ts` should run and pass on its own (it's self-contained, no dependency on the missing types).

- [ ] **Step 3:** Commit anyway — this is a deliberately red checkpoint, resolved by Task 6.

```bash
git add src/features/daily-plan/components
git commit -m "feat: add Hoje UI components (TodayFocus, SubjectAtmosphere, DecisionExplanation, MasteryMeter, SecondaryActionList)

Depends on Task 6 (StudyAction.factors/.snapshot) to type-check clean."
```

---

## Task 5: Extend `types.ts` with factors/snapshot (additive only)

**Files:**
- Modify: `/c/wtmain/src/types.ts` (already `origin/main`'s version — do not replace the file, add to it).

**Interfaces:**
- Produces: `RecommendationFactorKind`, `RecommendationFactor {kind, rawValue, contribution}`, `RecommendationSnapshot {masteryLevel, uncertainty, calculatedAt}`, `StudyAction.factors: RecommendationFactor[]`, `StudyAction.snapshot: RecommendationSnapshot` — consumed by Task 6 (`efficiencyEngine.ts`) and Task 4's already-ported components.

- [ ] **Step 1:** Open the old checkout's `src/types.ts` and copy the `RecommendationFactorKind`/`RecommendationFactor`/`RecommendationSnapshot` declarations (the block immediately before `StudyAction` — verify exact content, it was last seen as):

```typescript
export type RecommendationFactorKind =
  | 'learning_gap'
  | 'review_urgency'
  | 'recurring_errors'
  | 'energy_adjustment'
  | 'exam_relevance';

export interface RecommendationFactor {
  kind: RecommendationFactorKind;
  rawValue: number;
  contribution: number;
}

export interface RecommendationSnapshot {
  masteryLevel: number;
  uncertainty: number;
  calculatedAt: string;
}
```

Insert this block into `/c/wtmain/src/types.ts` directly above `export interface StudyAction {`.

- [ ] **Step 2:** Add the two new fields to `origin/main`'s `StudyAction` interface (do not remove or rename any existing field):

```typescript
export interface StudyAction {
  id: string;
  type: 'review' | 'practice' | 'theory' | 'error_analysis';
  topicId: string;
  topicName: string;
  subject: string;
  estimatedMinutes: number;
  priorityScore: number; // Assigned by Efficiency Engine
  reasons: RecommendationReason[];
  factors: RecommendationFactor[];
  snapshot: RecommendationSnapshot;
}
```

- [ ] **Step 3:** `npm run lint` — expect the SAME set of errors as Task 4's Step 2 to shrink (they referenced `.factors`/`.snapshot` on `StudyAction`, which now exists) but `efficiencyEngine.ts` itself will now error because it doesn't populate these two required fields yet — expected, resolved by Task 6.

- [ ] **Step 4:** Commit.

```bash
git add src/types.ts
git commit -m "feat: add RecommendationFactor/RecommendationSnapshot and StudyAction.factors/.snapshot"
```

---

## Task 6: Extend `efficiencyEngine.ts` with the factors/snapshot waterfall and `generateDeferredActions`

> **Amended:** Task 5's review found that `AllocatedStudyAction extends StudyAction` means adding `factors`/`snapshot` as required fields also broke two `origin/main`-owned test fixtures that build `StudyAction`/`AllocatedStudyAction` object literals directly: `src/features/availability/studyActionAllocator.test.ts` (1 literal) and `src/views/DailyPlanConsistency.test.tsx` (6 literals). Neither file is otherwise in scope for this plan — added as a required step below so the branch stays lint-clean after this task, per the Global Constraint that lint must be clean before moving on.

**Files:**
- Modify: `/c/wtmain/src/lib/efficiencyEngine.ts`
- Modify: `/c/wtmain/src/lib/efficiencyEngine.test.ts`
- Modify: `/c/wtmain/src/features/availability/studyActionAllocator.test.ts` (1 fixture literal)
- Modify: `/c/wtmain/src/views/DailyPlanConsistency.test.tsx` (6 fixture literals)

**Interfaces:**
- Consumes: `RecommendationFactor`/`RecommendationSnapshot` from Task 5.
- Produces: `EfficiencyEngine.rankStudyActions(...)` (existing signature, now returns `factors`/`snapshot` populated), `EfficiencyEngine.generateDailyPlan(...)` (existing signature, unchanged behavior), **new** `EfficiencyEngine.generateDeferredActions(masteryData, topics, profile, availableMinutesToday, goals, now?) → StudyAction[]` — consumed by Task 9 (`Dashboard.tsx`'s "Pode esperar" section).

- [ ] **Step 0:** Fix the two `origin/main`-owned test fixtures broken by Task 5's addition — add `factors: []` and `snapshot: { masteryLevel: 0, uncertainty: 0, calculatedAt: new Date().toISOString() }` (or whatever value is locally convenient — these tests don't assert on `factors`/`snapshot` content, only on allocation/consistency behavior) to each of the 7 total object literals:
  - `src/features/availability/studyActionAllocator.test.ts:12` (1 literal)
  - `src/views/DailyPlanConsistency.test.tsx:48,61,74,87,100,115` (6 literals)

  Run `npm run lint` and confirm these 7 errors are gone before moving to Step 1 (they're unrelated to the waterfall/deferred work below — fix them first so Step 1-8's lint checks aren't muddied by pre-existing noise).

- [ ] **Step 1:** In `rankStudyActions`, replace the single-expression score with the waterfall breakdown and build `factors`/`snapshot`. Replace:

```typescript
      const examFocus = examFocusFor(topic, boardSignals);

      // Base Score Calculation
      const rawScore = (
        (learningNeeded * 0.4) +
        (reviewNecessity * 0.3) +
        (errorSignal * 0.3)
      ) * energyMultiplier * examFocus.multiplier;
```

with:

```typescript
      const examFocus = examFocusFor(topic, boardSignals);

      // Base Score Calculation — kept as a waterfall (base terms, then each
      // multiplier applied as a delta over the running total) instead of one
      // multiplied expression, so every term below is a real, addable
      // contribution: summing all five factors' `contribution` reconstructs
      // rawScore exactly, which is what DecisionExplanation shows the
      // student instead of a black-box number.
      const learningContribution = learningNeeded * 0.4;
      const reviewContribution = reviewNecessity * 0.3;
      const errorContribution = errorSignal * 0.3;
      const baseScore = learningContribution + reviewContribution + errorContribution;
      const afterEnergy = baseScore * energyMultiplier;
      const energyContribution = afterEnergy - baseScore;
      const afterExamFocus = afterEnergy * examFocus.multiplier;
      const examContribution = afterExamFocus - afterEnergy;
      const rawScore = afterExamFocus;

      const factors: RecommendationFactor[] = [
        { kind: 'learning_gap', rawValue: learningNeeded, contribution: learningContribution },
        { kind: 'review_urgency', rawValue: reviewNecessity, contribution: reviewContribution },
        { kind: 'recurring_errors', rawValue: mastery.errorSignals, contribution: errorContribution },
        { kind: 'energy_adjustment', rawValue: energyMultiplier, contribution: energyContribution },
        { kind: 'exam_relevance', rawValue: examFocus.multiplier, contribution: examContribution },
      ];

      const snapshot: RecommendationSnapshot = {
        masteryLevel: mastery.level,
        uncertainty: mastery.uncertainty,
        calculatedAt: now.toISOString(),
      };
```

- [ ] **Step 2:** Add `factors`/`snapshot` to the pushed action object:

```typescript
      actions.push({
        id: `action_${topic.id}_${now.toISOString().slice(0, 10)}`,
        type,
        topicId: topic.id,
        topicName: topic.name,
        subject: topic.subject,
        estimatedMinutes,
        priorityScore: rawScore,
        reasons,
        factors,
        snapshot,
      });
```

- [ ] **Step 3:** Add the `RecommendationFactor, RecommendationSnapshot` imports at the top of the file (extend the existing `from '../types'` import).

- [ ] **Step 4:** Refactor `generateDailyPlan` to also expose the deferred bucket. Replace the existing `generateDailyPlan` method body with a private `rank()` split:

```typescript
  public static generateDailyPlan(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    availableMinutesToday: number,
    goals: StudentGoals,
    now: Date = new Date()
  ): StudyAction[] {
    return EfficiencyEngine.rank(masteryData, topics, profile, availableMinutesToday, goals, now).plan;
  }

  /** Same ranking as generateDailyPlan, but the items time-budget left out — "Pode esperar". */
  public static generateDeferredActions(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    availableMinutesToday: number,
    goals: StudentGoals,
    now: Date = new Date()
  ): StudyAction[] {
    return EfficiencyEngine.rank(masteryData, topics, profile, availableMinutesToday, goals, now).deferred;
  }

  private static rank(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    availableMinutesToday: number,
    goals: StudentGoals,
    now: Date = new Date()
  ): { plan: StudyAction[]; deferred: StudyAction[] } {
    const actions = this.rankStudyActions(masteryData, topics, profile, goals, now);

    const phase = currentStudyPhase(goals, now);
    const reviewTypes = new Set<StudyAction['type']>(['review', 'error_analysis']);
    const reviewBudget = Math.round(availableMinutesToday * phase.reviewRatio);
    const contentBudget = availableMinutesToday - reviewBudget;

    let reviewTime = 0;
    let contentTime = 0;
    const finalPlan: StudyAction[] = [];
    const deferred: StudyAction[] = [];

    for (const action of actions) {
      const isReview = reviewTypes.has(action.type);
      const bucketTime = isReview ? reviewTime : contentTime;
      const bucketBudget = isReview ? reviewBudget : contentBudget;

      if (bucketTime + action.estimatedMinutes <= bucketBudget) {
        action.reasons.push('tempo_disponivel');
        if (phase.id !== 'consolidacao' && isReview) action.reasons.push('fase_revisao_intensificada');
        finalPlan.push(action);
        if (isReview) reviewTime += action.estimatedMinutes;
        else contentTime += action.estimatedMinutes;
      } else {
        deferred.push(action);
      }
    }

    let totalTime = reviewTime + contentTime;
    const stillDeferred: StudyAction[] = [];
    for (const action of deferred) {
      if (totalTime + action.estimatedMinutes <= availableMinutesToday) {
        action.reasons.push('tempo_disponivel');
        finalPlan.push(action);
        totalTime += action.estimatedMinutes;
      } else {
        stillDeferred.push(action);
      }
    }

    finalPlan.sort((a, b) => b.priorityScore - a.priorityScore);
    return { plan: interleaveBySubject(finalPlan), deferred: stillDeferred };
  }
```

Note: this changes the second-pass loop to track which deferred actions truly never made it in (`stillDeferred`) instead of silently discarding that distinction — `origin/main`'s original code didn't need `stillDeferred` because it never exposed the deferred list at all. Verify against Step 5's tests that this doesn't change `generateDailyPlan`'s own output (it shouldn't — `finalPlan` construction is untouched).

- [ ] **Step 5:** Port the factors/snapshot test cases from the old checkout's `efficiencyEngine.test.ts` (the tests at the old file's lines ~170-207 — asserting `factors.length === 5`, `factors` sum to `priorityScore`, specific factor `kind`s, and `snapshot.masteryLevel/uncertainty/calculatedAt`) into `/c/wtmain/src/lib/efficiencyEngine.test.ts`. Add one new test for `generateDeferredActions`:

```typescript
test('generateDeferredActions retorna exatamente o que generateDailyPlan deixou de fora', () => {
  const mastery = /* reuse an existing test fixture with more topics than fit the time budget */;
  const topics = /* same fixture */;
  const profile = /* same fixture */;
  const goals = /* same fixture */;
  const now = new Date('2026-01-01T00:00:00Z');
  const availableMinutes = 30; // deliberately small vs. the fixture's total estimated minutes

  const plan = EfficiencyEngine.generateDailyPlan(mastery, topics, profile, availableMinutes, goals, now);
  const deferred = EfficiencyEngine.generateDeferredActions(mastery, topics, profile, availableMinutes, goals, now);

  const planIds = new Set(plan.map((a) => a.topicId));
  const deferredIds = new Set(deferred.map((a) => a.topicId));
  assert.equal(planIds.size + deferredIds.size, mastery.length, 'every topic should be in exactly one of plan/deferred');
  for (const id of deferredIds) assert.ok(!planIds.has(id), 'no topic should appear in both plan and deferred');
});
```

(Fill in the fixture values by reusing whatever `mastery`/`topics`/`profile`/`goals` builders the existing test file already has — do not invent a new fixture shape.)

- [ ] **Step 6:** Run tests.

```bash
cd /c/wtmain && npm test 2>&1 | grep -A2 "efficiencyEngine\|fail"
```

Expected: all `efficiencyEngine.test.ts` cases pass, including the ported factors/snapshot ones and the new deferred test.

- [ ] **Step 7:** `npm run lint` — Task 4's components should now type-check clean (they only needed `factors`/`snapshot` to exist).

- [ ] **Step 8:** Commit.

```bash
git add src/lib/efficiencyEngine.ts src/lib/efficiencyEngine.test.ts
git commit -m "feat: compute factor waterfall + snapshot on every StudyAction, add generateDeferredActions"
```

---

## Task 7: Port supporting libs and the design-token stylesheet

> **Amended (twice):** `confidence.ts`/`confidence.test.ts` moved to Task 4 (a real dependency of Task 4's components, discovered when Task 4's first dispatch was correctly BLOCKED on it). This task now only ports `masteryOrigin.ts` + `index.css`.
>
> **Second amendment, after the fact:** the implementer found `masteryOrigin.ts` itself depends on a `MasteryOrigin` type + `TopicMastery.origin?` field that don't exist in this worktree's `types.ts` either (same class of gap as `confidence.ts` — a real dependency the plan scheduled too late), and added them directly rather than escalating first. Verified post-hoc (controller) against the source checkout: the added block (`export type MasteryOrigin = 'demo' | 'seed' | 'diagnostic' | 'observed'` plus `TopicMastery.origin?: MasteryOrigin` with its comments) is byte-identical to the source, additive-only, nothing removed. Accepted as correct; documented here so `types.ts`'s scope across Tasks 5/7 is accurate for anyone reading this plan later. The task reviewer should still independently verify this out-of-scope addition, not take the controller's post-hoc check on faith.

**Files:**
- Create: `src/lib/masteryOrigin.ts`, `src/lib/masteryOrigin.test.ts`
- Modify: `src/types.ts` (add `MasteryOrigin` type + `TopicMastery.origin?` field — see amendment note above)
- Replace: `src/index.css` (origin/main's 9-line file → the full token stylesheet)

**Interfaces:**
- Produces: whatever `masteryOrigin.ts` exports (used by `Dashboard.tsx` in Task 9 — check the old checkout's `Dashboard.tsx` for `deriveMasteryOrigin` usage as the reference).

- [ ] **Step 1:** Copy the lib file + its test, and replace `index.css` wholesale.

```bash
SRC="/c/Users/Maria Fernanda/Downloads/My-App-main (1)/My-App-main/My-App"
DST="/c/wtmain"
cp "$SRC/src/lib/masteryOrigin.ts" "$DST/src/lib/masteryOrigin.ts"
cp "$SRC/src/lib/masteryOrigin.test.ts" "$DST/src/lib/masteryOrigin.test.ts"
cp "$SRC/src/index.css" "$DST/src/index.css"
```

- [ ] **Step 2:** Confirm `index.css` still contains `@import "tailwindcss";` somewhere near the top (it should — the design-token file extends Tailwind, it doesn't replace the import). If it's missing, add it as the first line.

- [ ] **Step 3:** `npm run lint && npm test`.

- [ ] **Step 4:** Commit.

```bash
git add src/lib/masteryOrigin.ts src/lib/masteryOrigin.test.ts src/index.css
git commit -m "feat: add masteryOrigin helper and the Crivo design-token stylesheet"
```

---

## Task 8: Adopt the global shell (`Layout.tsx`) with full nav parity, and the theme-flash-prevention `index.html`

> **Amended after Task 8's first dispatch was correctly BLOCKED:** copying in the new `Layout.tsx` activates `useTheme()` → `theme.ts`'s `systemPrefersDark()`, whose default parameter dereferences `window.matchMedia.bind(window)`. jsdom (the vitest test environment) doesn't implement `window.matchMedia`, and `src/testSetup.ts` (an `origin/main`-owned file, not previously in this plan's scope) doesn't polyfill it — so `origin/main`'s own pre-existing `AgendaView.test.tsx` (which renders `<Layout>` to test nav links) now crashes. This never surfaced in the source checkout because no test there ever rendered `Layout`+`useTheme` together. Fix: add a standard jsdom `matchMedia` polyfill to `testSetup.ts` — see the new Step 3.5 below. Real browsers have `window.matchMedia`, so this is purely a test-environment gap, not a production bug.
>
> **Amended again after Round 2 was correctly BLOCKED:** with the polyfill in place, a second, previously-masked issue surfaced: `src/components/BottomNav.tsx` (Task 3) hardcodes its mobile "Agenda" tab to `path: '/conexoes'`, with a comment explaining that at the time it was written, "there is no standalone Agenda route" on the source checkout it was built against. Task 8's Step 2 just added the REAL `/agenda` sidebar entry (which genuinely exists on `origin/main`), so the workaround is now stale and the tab points at the wrong screen (Conexões Google instead of the actual Agenda/availability view) — confirmed by `origin/main`'s own test finding two elements matching `getByRole('link', {name:'Agenda'})`. This isn't an open product question — the workaround's own comment states the precondition it needs (a real Agenda route) that Task 8 just satisfied. Fix: repoint the tab to `/agenda` — see the new Step 2.5 below.
>
> **Amended a third time after Round 3 was correctly BLOCKED:** with `BottomNav`'s href fixed, the same test still fails, for a different, now purely structural reason: `origin/main`'s `AgendaView.test.tsx:199` calls `screen.getByRole('link', { name: 'Agenda' })` — singular, expects exactly one match. jsdom doesn't evaluate CSS media queries, so `Layout`'s sidebar rail (`hidden lg:flex`-style classes) and `BottomNav` (`lg:hidden`) are BOTH present in the test DOM simultaneously, and both now correctly render an "Agenda" link/tab — this is the intended UX (the same destination reachable from either responsive surface), not a bug to route around. The test's "exactly one nav surface" assumption predates `BottomNav` existing at all. Fix: change the assertion to `getAllByRole` and check every match, rather than a single arbitrary one — see the new Step 2.6 below.

**Files:**
- Modify: `/c/wtmain/src/components/Layout.tsx` (currently `origin/main`'s version — replace with local's, then patch)
- Modify: `/c/wtmain/src/components/BottomNav.tsx` (repoint the stale "Agenda" tab — see amendment note above)
- Modify: `/c/wtmain/src/features/availability/AgendaView.test.tsx` (1 assertion — see Step 2.6)
- Modify: `/c/wtmain/index.html`
- Modify: `/c/wtmain/src/testSetup.ts` (add `window.matchMedia` polyfill — see amendment note above)

**Interfaces:**
- Consumes: `useTheme`, `useSpotlight`, `CrivoMark`, `BottomNav`, `OnboardingModal`, `IconButton` (Task 3), `MOTION_DURATION`/`MOTION_EASE` (Task 2).
- Produces: no exported interface change — `Layout` is the route-level shell, same as before (`export default function Layout()`).

- [ ] **Step 1:** Copy the local checkout's `Layout.tsx` over `origin/main`'s version wholesale.

```bash
SRC="/c/Users/Maria Fernanda/Downloads/My-App-main (1)/My-App-main/My-App"
cp "$SRC/src/components/Layout.tsx" /c/wtmain/src/components/Layout.tsx
```

- [ ] **Step 2:** In the copied file's `NAV_GROUPS`, add the two missing entries found in the divergence audit. In the "Diagnóstico & Plano" group, insert after the `Plano` entry:

```typescript
      { name: 'Agenda', path: '/agenda', icon: Calendar },
```

In the "Prática" group, insert after `Questões & Tentativas`:

```typescript
      { name: 'Resumos Interativos', path: '/resumos', icon: Library },
```

(`Calendar` is already imported for the `Hoje` entry; `Library` is already imported for `Dossiês de Obras` — no new imports needed. If the two icons visually collide against `Dossiês de Obras`, that's a cosmetic follow-up for Task 10's browser QA, not a blocker here.)

- [ ] **Step 2.5:** Fix `src/components/BottomNav.tsx`'s stale "Agenda" tab. Replace:

```typescript
// Five real destinations, mapped from the brief's ideal set (Hoje, Plano,
// Estudar, Análises, Agenda) onto the routes that actually exist in this
// app (see App.tsx) — there is no standalone "Agenda" route, so it points
// at Conexões Google, which is where the calendar integration that feeds
// the day's available time actually lives.
const ITEMS: BottomNavItem[] = [
  { name: 'Hoje', path: '/', icon: Calendar },
  { name: 'Plano', path: '/plano', icon: Map },
  { name: 'Estudar', path: '/sessao', icon: PlayCircle },
  { name: 'Análises', path: '/evolucao', icon: TrendingUp },
  { name: 'Agenda', path: '/conexoes', icon: LinkIcon },
];
```

with:

```typescript
// Five real destinations, mapped from the brief's ideal set (Hoje, Plano,
// Estudar, Análises, Agenda) onto the routes that actually exist in this app
// (see App.tsx).
const ITEMS: BottomNavItem[] = [
  { name: 'Hoje', path: '/', icon: Calendar },
  { name: 'Plano', path: '/plano', icon: Map },
  { name: 'Estudar', path: '/sessao', icon: PlayCircle },
  { name: 'Análises', path: '/evolucao', icon: TrendingUp },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
];
```

`Calendar` is reused for both `Hoje` and `Agenda` (both already import it; no new import needed) — if that reads as visually ambiguous in Task 10/11's browser QA, that's a cosmetic follow-up, not a blocker here. The unused `LinkIcon`/`Link as LinkIcon` import becomes dead after this change — remove it from the `lucide-react` import line too (`tsc`'s `noUnusedLocals`, if enabled, would otherwise flag it; remove it regardless for cleanliness).

- [ ] **Step 2.6:** Fix `src/features/availability/AgendaView.test.tsx`'s nav-link assertion to tolerate more than one responsive nav surface. Replace (currently around line 195-200):

```typescript
  it('links to the Agenda from the primary navigation', () => {
    localStorage.setItem('juju_onboarding', 'true');
    render(<MemoryRouter><Layout /></MemoryRouter>);

    expect(screen.getByRole('link', { name: 'Agenda' })).toHaveAttribute('href', '/agenda');
  });
```

with:

```typescript
  it('links to the Agenda from the primary navigation', () => {
    localStorage.setItem('juju_onboarding', 'true');
    render(<MemoryRouter><Layout /></MemoryRouter>);

    // Both the desktop rail and the mobile bottom nav render an "Agenda"
    // link — jsdom doesn't evaluate the lg: media queries that make only
    // one of them visible at a real viewport size, so both are present in
    // this test's DOM. Every one of them must point at the real route.
    const agendaLinks = screen.getAllByRole('link', { name: 'Agenda' });
    expect(agendaLinks.length).toBeGreaterThan(0);
    agendaLinks.forEach((link) => expect(link).toHaveAttribute('href', '/agenda'));
  });
```

Do not touch the other test in this file (`renders the Agenda at its application route`) — it asserts on a `heading`, not a `link`, so it's unaffected by this duplication and should already be passing.

- [ ] **Step 3:** Re-scan for full parity, not just the two known gaps — compare every path automatically instead of trusting the manual audit alone:

```bash
cd /c/wtmain
grep -oP "path: '\K[^']+" src/components/Layout.tsx | sort > /tmp/new_nav.txt
grep -oP 'path="\K[^"]+' src/App.tsx | sed 's/^/\//' | sort > /tmp/routes.txt
diff /tmp/routes.txt /tmp/new_nav.txt
```

Expected: no output (every route in `App.tsx` has a nav entry, `/` maps to the index route). If `diff` shows anything else missing, add it to the matching `NAV_GROUPS` section before continuing.

- [ ] **Step 4:** Copy `index.html`'s new `<head>` additions (font links + inline theme script + rebrand) from the old checkout, preserving any origin/main-only `<head>` content that isn't in the local version (diff first, don't blind-overwrite):

```bash
diff "$SRC/index.html" /c/wtmain/index.html
```

Apply the local version's additions (Newsreader/Inter font links, the inline theme-resolution `<script>`, `theme-color`/`apple-mobile-web-app-title`/`<title>` → Crivo) onto `/c/wtmain/index.html` by hand, keeping anything origin/main's copy has that local's doesn't (there shouldn't be much — origin/main's file is minimal — but verify rather than assume).

- [ ] **Step 3.5:** Add a `window.matchMedia` polyfill to `/c/wtmain/src/testSetup.ts` — jsdom doesn't implement it, and `useTheme()` (now reachable from `<Layout>`, which `origin/main`'s own `AgendaView.test.tsx` renders) calls it via `theme.ts`'s `systemPrefersDark()` default parameter. Add this above the existing `afterEach(cleanup);` line, keeping the existing imports/line untouched:

```typescript
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}
```

`matches: false` is the right default here — it makes `systemPrefersDark()` resolve to light in tests unless a test explicitly overrides `window.matchMedia` itself (`resolveInitialTheme` still checks `getStoredTheme()` first, so this only affects the no-stored-preference fallback path). Do not touch `theme.ts`/`useTheme.ts` themselves — they're correct as ported; this is purely a test-environment gap.

- [ ] **Step 5:** `npm run lint && npm test && npm run build`.

- [ ] **Step 6:** Commit.

```bash
git add src/components/Layout.tsx src/components/BottomNav.tsx src/features/availability/AgendaView.test.tsx index.html src/testSetup.ts
git commit -m "feat: adopt the Crivo navigation shell app-wide, with full route/nav parity"
```

---

## Task 9: Rewrite `Dashboard.tsx` on `useDailyPlan`/`AllocatedStudyAction`, preserving every origin/main content block

**Files:**
- Modify: `/c/wtmain/src/views/Dashboard.tsx`

**Interfaces:**
- Consumes: `useDailyPlan()` (origin/main, unchanged) → `{availability, dailyPlan: AllocatedStudyAction[], loading, warnings, isPersisted}`; `EfficiencyEngine.generateDeferredActions` (Task 6) for "Pode esperar"; `TodayFocus`, `SecondaryActionList`, `SubjectAtmosphere`, `EmptyState`, `Skeleton`, `Panel`, `CrivoCore` (Tasks 2-4); `deriveMasteryOrigin` (Task 7).

This is the one task in this phase that is genuine design work, not a mechanical port — `origin/main`'s current Dashboard has three content blocks the local redesign never had (header identity line, 3-card stats grid, "Prioridade Fuvest" banner) that must be re-expressed in the new visual language, not dropped.

- [ ] **Step 1:** Start from the local checkout's `Dashboard.tsx` structure (the `<SubjectAtmosphere><TodayFocus/><SecondaryActionList/>...</SubjectAtmosphere>` shape) as the layout skeleton, but swap its data source: replace the direct `EfficiencyEngine.generateDailyPlan(...)`/`useUserMastery`/`useAvailableMinutes` calls with `origin/main`'s `useDailyPlan()` hook (same one `origin/main`'s current `Dashboard.tsx` already calls) for `dailyPlan`/`availability`/`loading`. Keep `useStudentGoals`, `useAdaptiveRankingChange`, `pendingReviewCount`, `nextExams`/`daysUntil`, `addPlanFeedback` wiring exactly as the local version already has them (all still valid against `origin/main`'s types).

- [ ] **Step 2:** Add the header identity line back (origin/main has it, local dropped it) directly under the `<h1>Hoje</h1>`:

```tsx
<p className="text-xs font-semibold uppercase tracking-widest text-text-muted">ANA JÚLIA · MEDICINA</p>
```

(Verify against `origin/main`'s exact current copy/casing before finalizing — re-check `git show origin/main:src/views/Dashboard.tsx` at execution time in case a newer commit changed this string.)

- [ ] **Step 3:** Re-add the 3-card stats grid (Tempo de Estudo / Autonomia / Prioridade Máxima) below `TodayFocus`, restyled with `Panel` instead of raw Tailwind divs:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
  <Panel className="p-5">
    <p className="text-xs font-medium text-text-muted flex items-center gap-1.5"><Target className="w-3.5 h-3.5" aria-hidden="true" />Tempo de Estudo</p>
    <p className="font-display text-2xl font-semibold text-text-primary mt-2">{availableMinutes} min</p>
    <p className="text-xs text-text-muted mt-1">Calculado pela agenda semanal e pelas exceções do dia</p>
  </Panel>
  <Panel className="p-5">
    <p className="text-xs font-medium text-text-muted flex items-center gap-1.5"><Brain className="w-3.5 h-3.5" aria-hidden="true" />Autonomia</p>
    <p className="font-display text-2xl font-semibold text-text-primary mt-2">{autonomyScore}<span className="text-base text-text-muted">/100</span></p>
    <p className="text-xs text-text-muted mt-1">Crescimento lento e sustentável.</p>
  </Panel>
  <Panel className="p-5">
    <p className="text-xs font-medium text-text-muted flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />Prioridade Máxima</p>
    <p className="font-display text-lg font-semibold text-text-primary mt-2">{primary?.topicName ?? '—'}</p>
    <p className="text-xs text-text-muted mt-1">{primary ? ACTION_LABELS[primary.type] : 'Nenhuma ação pendente'}</p>
  </Panel>
</div>
```

Check `origin/main`'s current `Dashboard.tsx` for where `autonomyScore` (the "35/100" value) is actually computed (it wasn't visible in the excerpt read so far) and wire it from the same source rather than inventing a new calculation.

- [ ] **Step 4:** Re-add the "Prioridade Fuvest" CTA banner, restyled with `Panel`:

```tsx
<Panel className="p-5 flex items-center justify-between gap-4 flex-wrap">
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-accent">Prioridade Fuvest</p>
    <p className="font-display text-lg font-semibold text-text-primary mt-1">Retome seus resumos estratégicos</p>
  </div>
  <Button variant="secondary" onClick={() => navigate('/resumos')}>Abrir resumos</Button>
</Panel>
```

Verify the exact trigger condition `origin/main` uses to show/hide this banner (it may be conditional, not always-on) before wiring it unconditionally.

- [ ] **Step 5:** Wire "Pode esperar" using the new `EfficiencyEngine.generateDeferredActions` (Task 6) the same way the local checkout already wires it (`canWait`/`SecondaryActionList quiet`) — this is a genuinely new feature relative to `origin/main`'s current Dashboard (which has no deferred section), additive per the user's "preserve tudo" instruction (nothing here removes an `origin/main` feature, it only adds one back that local already validated).

- [ ] **Step 5b:** Surface `AllocatedStudyAction.intervalStart`/`.intervalEnd` — a real `origin/main` feature (the scheduled time slot, shown today via `formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}` in the old `ActionCard`) that neither `TodayFocus` nor `SecondaryActionList` currently display. Add it next to the existing minutes line in both:

```tsx
// TodayFocus.tsx, in the line that currently reads:
// {actionLabel} em {action.subject} · <span className="font-medium text-text-primary">{action.estimatedMinutes} min</span>
// add the interval:
<p className="text-text-secondary mt-2">
  {actionLabel} em {action.subject} · <span className="font-medium text-text-primary">{action.estimatedMinutes} min</span>
  {' · '}{formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}
</p>
```

```tsx
// SecondaryActionList.tsx, next to each row's existing minutes label, same pattern:
{formatIsoTimeInSaoPaulo(action.intervalStart)}–{formatIsoTimeInSaoPaulo(action.intervalEnd)}
```

Import `formatIsoTimeInSaoPaulo` from `../../../features/availability/time` (the same module `origin/main`'s `Dashboard.tsx` already imports it from) in both files. `TodayFocus`'s and `SecondaryActionList`'s `action` props must be typed as `AllocatedStudyAction`, not `StudyAction`, for `intervalStart`/`intervalEnd` to type-check — update both components' prop interfaces accordingly (they only used `StudyAction` fields before, so this is a widening, not a breaking change).

- [ ] **Step 6:** Preserve `origin/main`'s exam-proximity banner (`nextExams`/`daysUntil` chips) and the demo-mode/calendar-error notices exactly — both already exist in the local checkout's version in equivalent form; keep whichever copy is more current (compare strings against `origin/main`'s at execution time).

- [ ] **Step 7:** `npm run lint && npm run build`.

- [ ] **Step 8:** Manual browser check (`npm run dev`, demo mode): confirm the header identity line, stats grid, Prioridade Fuvest banner, and Pode esperar section are ALL present and visually consistent with the rest of the new design system (Panel-styled, warm-ivory/forest tokens, not leftover indigo/zinc classes).

- [ ] **Step 9:** Commit.

```bash
git add src/views/Dashboard.tsx
git commit -m "feat: rewrite Dashboard on useDailyPlan/AllocatedStudyAction, preserving stats grid, header, and Prioridade Fuvest banner"
```

---

## Task 10: Page transitions (new work) + reduced-motion audit

**Files:**
- Modify: `/c/wtmain/src/components/Layout.tsx` (wrap `<Outlet />`)
- Modify: `/c/wtmain/src/design-system/motion/tokens.ts` (add one `MOTION_MATRIX` row)

**Interfaces:**
- Consumes: `AnimatePresence`, `motion.div` from `motion/react`; `useReducedMotion` (already imported in `Layout.tsx`); `useLocation` (already imported).

There is no existing page-transition system anywhere in this codebase (confirmed in the divergence audit) — this is genuinely new work, scoped small and deliberately subtle (a route change is not "the one protagonist effect" the Núcleo already owns on Hoje).

- [ ] **Step 1:** Add a route-transition row to `MOTION_MATRIX` in `src/design-system/motion/tokens.ts`:

```typescript
  {
    component: 'Route transition (Layout <Outlet />)',
    trigger: 'Pathname change',
    purpose: 'Acknowledge a navigation happened without competing with any screen\'s own entrance motion',
    duration: MOTION_DURATION.micro,
    easing: 'MOTION_EASE',
    property: 'opacity',
    reducedMotion: 'No transition — new route renders immediately',
  },
```

- [ ] **Step 2:** In `Layout.tsx`, wrap the `<Outlet />` with a keyed, opacity-only `AnimatePresence`:

```tsx
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
// ...
<main className="...">
  <div className="...">
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reducedMotion ? undefined : { opacity: 0 }}
        transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  </div>
</main>
```

Deliberately opacity-only, no transform/translate — a slide or scale on every single navigation across the whole app is a much bigger visual commitment than an entrance effect scoped to one screen, and `mode="wait"` avoids overlapping outgoing/incoming pages fighting for scroll position.

- [ ] **Step 3:** Verify reduced motion: with `prefers-reduced-motion: reduce` (devtools emulation), navigate between two routes — the new route must appear with no fade at all, instantly.

- [ ] **Step 4:** Verify no regression: navigating away from `/sessao` mid-session, or away from any form with unsaved input, must not be delayed or blocked by the exit animation (`mode="wait"` delays the incoming page's mount until the outgoing one's exit finishes — confirm this doesn't introduce a perceptible stall; if it does, switch to `mode="popLayout"` or drop the exit animation).

- [ ] **Step 5:** `npm run lint && npm test`.

- [ ] **Step 6:** Commit.

```bash
git add src/components/Layout.tsx src/design-system/motion/tokens.ts
git commit -m "feat: add a subtle opacity-only page transition, respecting prefers-reduced-motion"
```

---

## Task 11: Full verification and browser QA

**Files:** none (verification only).

- [ ] **Step 1:** Full automated suite.

```bash
cd /c/wtmain
npm run lint
npm test
npm run build
```

All three clean.

- [ ] **Step 2:** Nav parity re-check (belt and suspenders on Task 8's Step 3).

```bash
grep -oP "path: '\K[^']+" src/components/Layout.tsx | sort > /tmp/new_nav.txt
grep -oP 'path="\K[^"]+' src/App.tsx | sed 's/^/\//' | sort > /tmp/routes.txt
diff /tmp/routes.txt /tmp/new_nav.txt
```

Expected: no output.

- [ ] **Step 3:** Browser checklist — `npm run dev`, demo mode (no login), desktop (1440px) and mobile (390px), light and dark:
  - [ ] Every nav item (rail + `BottomNav` + hamburger drawer) navigates to a working screen — no blank/crashing route.
  - [ ] Hoje: header identity line, exam chips, stats grid, Prioridade Fuvest banner, TodayFocus hero (Núcleo rendering, correct per-subject palette/geometry), "Depois disso"/"Pode esperar" both populated, "Por que isso?" opens and shows real factors, "Começar" navigates to `/sessao?topic=...`.
  - [ ] Simulate a subject change (edit the adaptive-ranking localStorage key to a prior day/different subject, reload) — Núcleo + `SubjectAtmosphere` tween once, no flicker.
  - [ ] `prefers-reduced-motion: reduce` — zero continuous animation loops (Núcleo, atmosphere, spotlight all static), route changes are instant.
  - [ ] Canvas-2D-unavailable fallback still renders (spot-check via the existing fallback path, don't skip because it "should still work").
  - [ ] Every OTHER screen (Diagnóstico, Sessão, Questões, Revisões, Flashcards, Podcast, Evolução, Perfil, Conexões, Agenda, Resumos, etc.) loads with its `origin/main` content, inside the new shell chrome, with no console errors — these screens' own internal visual style stays exactly as `origin/main` has it; only the shell around them is new. This is the explicit boundary of this phase.
  - [ ] Zero console errors/warnings other than the expected one-time "matéria sem perfil registrado" notice for Inglês/Filosofia/Sociologia.
- [ ] **Step 4:** Report results. If anything in Step 3 fails, fix it as a follow-up commit on this same branch before calling Phase 1 done — do not defer known breakage to "later phases."

---

## Roadmap for later phases (not detailed here — write a fresh plan per phase once Phase 1 lands)

Per the user's explicit ordering, each of these becomes its own `docs/superpowers/plans/YYYY-MM-DD-crivo-redesign-phaseN-*.md`, written after Phase 1 is verified in-browser (so the real integration patterns this phase discovers — e.g. how a `Panel`-based content block replaces a raw-Tailwind one — inform the later phases instead of being guessed at now):

2. **Transições de página e navegação** — mostly landed in Task 10 above; this later phase is where any additional per-screen entrance motion gets added, if the Phase 1 QA turns up a screen that needs it.
3. **Diagnóstico e Sessão** — highest-traffic screens after Hoje; likely the biggest single-screen effort (Sessão has real-time question/answer flow state to preserve exactly).
4. **Questões e conteúdos de estudo** — Questões, Flashcards, Flashcards de Obras, Dossiês de Obras, Caderno de Erros, Revisões Adaptativas.
5. **Progresso/Perfil** — Evolução, Perfil, Prioridades por Vestibular.
6. **Podcast e telas restantes** — Podcast, Tutor Socrático, Laboratório & Métodos, Treino de 2ª Fase, Módulo de Redação, Estratégias de Resolução, Conexões Google, Agenda, Resumos, Reta Final, Recuperação de Atrasos.
7. **QA completo** — full desktop/mobile/theme/a11y/performance pass across the now-fully-migrated app; this is where a Lighthouse/axe pass and a real screen-reader spot-check belong, not earlier.

Each of those plans should open with its own divergence audit against `origin/main` at the time it's written — 52 commits of drift already existed once; don't assume the same file categories still hold without re-checking.
