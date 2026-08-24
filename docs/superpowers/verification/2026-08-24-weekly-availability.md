# Weekly study availability verification — 2026-08-24

Verified from `codex/weekly-study-availability` on 2026-08-24 (America/Sao_Paulo). This record contains no credentials, user identifiers, or Calendar event contents.

## Automated production gates

| Command | Exit | Evidence |
|---|---:|---|
| `npm test` | 0 | Vitest: 12 test files passed; 66 tests passed. |
| `npm run lint` | 0 | `tsc --noEmit` completed without diagnostics. |
| `npm run build` | 0 | Vite transformed 2,486 modules and emitted the production client; esbuild emitted `dist/server.cjs`. Vite reported the existing chunk-size advisory, which is non-fatal. |
| `npm test -- src/features/availability/weeklyScheduleSeed.test.ts src/features/availability/blockScheduler.test.ts src/features/availability/availabilityEngine.test.ts src/features/availability/AgendaView.test.tsx src/features/availability/useDailyStudyAvailability.test.tsx src/views/DailyPlanConsistency.test.tsx --reporter=verbose` | 0 | Focused acceptance coverage: 6 test files passed; 44 tests passed. |

## Local application

`npm run dev` started the Express/Vite application. A request to `http://localhost:3000/` returned HTTP 200 with `text/html` and the expected React root element. No secret local configuration was supplied.

## Approved Monday scenario

The signed-out deterministic seed and pure availability resolver were evaluated for local date `2026-08-24`. The focused rendered-component tests independently exercised the Agenda and the shared Dashboard/Plano/Sessão consumers.

- Recurring Monday study window: `14:40–20:30`.
- Allocated blocks, exactly five: `14:40–15:30`, `15:40–16:30`, `16:40–17:30`, `18:00–18:50`, `19:00–19:50`.
- Total: `250 min`.
- Final block ends at `19:50`; no block reaches beyond the `20:30` boundary.
- The deterministic weekly seed contains no English/Inglês entry.
- Thursday begins at `17:35`, is flagged as an estimate, and the Agenda render exposes `Estimativa editável`.
- Dashboard, Plano, and Sessão render the same shared first allocated action and scheduled start in the focused consistency test.

## Date exception and Calendar failure

A controlled resolver probe applied a date-only `early_departure` exception at `18:30` to `2026-08-24`:

- `2026-08-24` became three blocks (`14:40–15:30`, `15:40–16:30`, `16:40–17:30`), totaling `150 min`.
- `2026-08-31`, evaluated from the unchanged recurring schedule and without the prior date's exception, retained the original five blocks and `250 min`.
- The rendered Agenda test confirms saving this exception does not invoke a recurring weekly schedule save; the pure engine test confirms applying an exception does not mutate that schedule.

A controlled Calendar failure returned status `degraded`, retained the baseline five blocks and `250 min`, and added no interval beyond the stored baseline. The hook-level non-OK response test also confirms the degraded warning path.

## Browser-level limitation

The required in-app browser controller was initialized for `http://localhost:3000/`, but its discovery endpoint returned no available browser sessions after the documented recovery check. Therefore no production-browser visual observation is claimed. UI evidence above is from deterministic rendered-component tests, the pure resolver probe, and the live local HTTP response. Browser-level completion remains blocked on an available in-app browser session.
