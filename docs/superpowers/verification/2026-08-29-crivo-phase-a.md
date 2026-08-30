# Crivo Phase A — verification record

Date: 2026-08-30 (America/Sao_Paulo)
Commit range: `1cc7d66..HEAD` (the verification/fallback commit is recorded after this file is committed).

## Automated gates

| Command | Result | Evidence |
|---|---:|---|
| `npm run lint` | pass | Exit 0; TypeScript produced no diagnostics. |
| `npm test` | pass | 328/328 Node tests and 171/171 Vitest tests. |
| `npx vitest run src/components/CrivoCore.ui.test.tsx` | pass | 7/7 after the Canvas fallback correction. |
| `npm run build` | pass when isolated | Vite transformed 3,189 modules; server bundle emitted. |
| `git diff --check` | pending final rerun | Run again immediately before commit. |

The first build was launched concurrently with the broad test/E2E batch and Vite failed cleaning `dist/flashcard-media` with `ENOTEMPTY`. The exact same build passed when repeated in isolation; no source change was made for this environment-level directory race.

Vite continues to emit the established non-fatal chunk advisory: `vendor` is 1,010 kB and `index` is 2,678 kB minified (both over 500 kB). This task did not increase or change that baseline.

## Real-browser matrix

Chromium was used for the visual fallback matrix, with the seeded weekday (`2026-08-24`) used by the committed E2E gate. These ignored local artifacts remain available in `tests/e2e/.artifacts/`:

| Scenario | Artifact | Result |
|---|---|---|
| Desktop 1440×900, light | `matrix-desktop-light-ready.png` | Pass: hero Núcleo and the environmental field are present. |
| Desktop 1440×900, dark | `matrix-desktop-dark-ready.png` | Pass: field and subject contrast remain legible. |
| Mobile 390×844, light | `matrix-mobile-light-ready.png` | Pass: topic, action, duration, reason and CTA are above the bottom navigation. |
| Mobile 390×844, dark | `matrix-mobile-dark-ready.png` | Pass: same first-fold hierarchy and contrast. |
| Explanation open | `matrix-desktop-explanation-open.png` | Pass: factors and the explicit “Discordo” affordance are revealed. |
| Feedback idle | `matrix-desktop-feedback-idle.png` | Pass: reason choices are visible and actionable. |
| Feedback saved | `matrix-desktop-feedback-saved.png` | Pass: focused live confirmation does not claim that the ranking changed. |
| Feedback saving (isolated browser harness) | `matrix-harness-feedback-saving.png` | Pass: the same `DisagreeControl` remains in its disabled saving state before confirmation. |
| Física → Biologia (isolated browser harness) | `matrix-harness-fisica-biologia.png` | Pass: a live prop change replaces both core geometry and field, not merely its color. |
| Biologia → História (isolated browser harness) | `matrix-harness-biologia-historia.png` | Pass: a second live prop change again produces distinct geometry/field. |
| Reduced motion | `matrix-desktop-reduced-motion.png` | Pass: final static decision frame; no active-motion marker. |
| Canvas unavailable | `matrix-desktop-canvas-unavailable.png` | Pass after focused correction: static field persists and the hero fallback retains three orbital rings and a luminous center. |
| No availability, real Sunday | `matrix-real-sunday.png` | Pass: seeded Sunday produces “Sem tempo disponível hoje” and its calendar action. |
| First visit, real onboarding | `matrix-first-visit.png` | Pass: first-visit modal offers the real diagnosis entry point. |

The fallback correction is protected by `CrivoCore.ui.test.tsx`: its red test reproduced the old one-circle fallback, then the green assertion proves the static orbital artifact contains three rings and a center. `DailyPlanMotion.ui.test.tsx` also exercises the state machine through `idle → saving → saved`, including the single live-region and focus result.

## Reference comparison

The ready-state captures retain the approved composition rather than a metrics-dashboard layout: the title/decision is the visual anchor, the Núcleo is the large co-protagonist, and the field remains visible around it. The responsive capture uses a distinct vertical hero with the Núcleo first, not a compressed desktop column. The removed generic “Prioridade Fuvest”/“Prioridade Máxima” banner is absent.

No approval is inferred from this record. The following required observations were **not** generated as live browser captures in this pass, so they remain a visual-approval follow-up rather than a claimed pass:

- loading (the signed-out availability resolver completes synchronously in its first effect, before a browser capture can intercept or delay an I/O boundary);
- “Ainda não há um diagnóstico seu” and “Não precisa fazer nada extra hoje” (the real signed-out seed deliberately contains evidence and urgent actions; changing it would fabricate domain data).

The first harness approach (`page.setContent` importing the Vite module) timed out without mounting. A single Vite-served isolated harness then mounted the production `SubjectAtmosphere`, `CrivoCore`, and `DisagreeControl` components and captured the two requested subject transitions and the saving frame. It contains no production-data or source change. `DailyPlanMotion.ui.test.tsx` additionally redraws Física → Biologia under reduced motion and drives `idle → saving → saved`; `DailyPlanConsistency.test.tsx` owns `loadingPlan`. These are not substitutes for the two remaining unavailable browser states.

## Playwright status and deviations

`npx playwright install webkit` was necessary because the mobile project could not initially launch (`webkit-2336/Playwright.exe` absent). The WebKit re-run installed successfully but the committed full E2E command was not green: desktop stage/CTA/reduced-motion checks passed, while mobile had a stage timeout and a null CTA bounding box; desktop/mobile route sweeps also had aborted or timed-out navigation. Chromium 390×844 was therefore used only as the documented visual fallback above, not as a claim that the WebKit gate passed.

No push, merge, deploy, or production-data mutation occurred.
