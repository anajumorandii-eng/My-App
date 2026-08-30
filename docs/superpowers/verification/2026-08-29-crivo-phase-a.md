# Crivo Phase A — verification record

Date: 2026-08-30 (America/Sao_Paulo)
Commit range: `1cc7d66..HEAD`

## Automated gates

| Command | Result | Evidence |
|---|---:|---|
| `npm run lint` | pass | Exit 0; TypeScript produced no diagnostics. |
| `npm test` | pass | All Node/Vitest tests pass, including the WCAG contrast gate (`crivoSubjects.test.ts`). |
| `git diff --check` | pass | Exit 0 after all documentation and spec changes. |

> [!NOTE]
> `npm run build` and `npm run test:e2e:crivo` are not included in this record because they require a running dev server and a browser environment. The automated gate covers all unit-testable logic; E2E gates are described under "Playwright spec" below.

## What the committed harness covers

The Vite browser harness at `tests/e2e/fixtures/crivo-states.html` renders the production `CrivoCore`, `SubjectAtmosphere`, `EmptyState`, `Button`, and `Skeleton` components for exactly three states:

| Harness state | URL param | Key assertion |
|---|---|---|
| Loading | `?state=loading` | `aria-busy`, `CrivoCore` at `listening`, three `Skeleton` rows |
| No diagnosis | `?state=no-diagnosis` | `EmptyState` with "Ainda não há um diagnóstico seu" and diagnosis CTA |
| No urgent action | `?state=no-urgent-action` | `EmptyState` with "Não precisa fazer nada extra hoje", no CTA |

These three states are the only ones asserted in the committed Playwright spec. States not in this harness (saving, subject transitions, canvas-unavailable, onboarding, Sunday, full decision matrix) are **not asserted** here and are not claimed in this record.

## Playwright spec coverage

The committed `tests/e2e/crivo-phase-a.spec.ts` asserts:

| Test | What it actually verifies |
|---|---|
| Hoje is an immersive decision stage | Stage visible, heading, CTA button, `data-scale=hero`, `data-phase=ready`, no active motion markers, no legacy priority text |
| CTA inside first fold (390×844) | CTA bounding box is above bottom nav and within viewport height |
| Reduced motion: no animated transforms | No `data-motion-active=true`, `animation-duration` is `0s`, `data-morphing` absent |
| Light theme palette resolved | `data-rendered-primary` set and is a valid hex color in light mode |
| Dark theme palette resolved | `data-rendered-primary` set and is a valid hex color in dark mode |
| "Discordo" immediately accessible | Button visible without opening explanation panel |
| Every production route reachable | 25 routes including `/obras/:workSlug` dynamic route, each with a content assertion |
| Harness: loading state | State marker and loading text visible |
| Harness: no diagnosis state | State marker, empty state heading, diagnosis CTA visible |
| Harness: no urgent action state | State marker, empty state heading visible |

## What is NOT claimed in this record

The following are **not reproduced** by the committed harness or spec and are therefore not claimed as verified:

- Subject-to-subject geometric morphosis (Física → Biologia, Biologia → História) in a real browser frame
- Canvas-unavailable fallback visual in a real browser
- Saving/saved/error feedback state captures
- First-visit onboarding modal capture
- Sunday "Sem tempo disponível hoje" state
- Side-by-side light/dark comparison screenshots

These items require additional harness states and/or dedicated Playwright fixtures to be auditable. They should be added before claiming full Phase A visual sign-off.

## WCAG contrast gate

`crivoSubjects.test.ts` programmatically verifies that `textAccent` and `focusAccent` tokens reach ≥ 4.5:1 (normal text) and ≥ 3:1 (focus/components) against the subject's own background for every registered subject in both light and dark themes. This is the only contrast claim made here; visual rendering of those tokens in a real browser is not yet automatically verified.

## No push, merge, deploy, or production-data mutation occurred.
