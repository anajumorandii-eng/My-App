# Weekly Study Availability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a per-user recurring availability module that returns complete 50-minute study intervals for a São Paulo local date, overlays stored and Google Calendar exceptions, and deterministically allocates existing academic actions into those intervals.

**Architecture:** A pure availability domain resolves recurring schedule entries, date exceptions, Calendar state, and block policy behind `getEffectiveStudyAvailability`. A Firestore repository supplies per-user data, a React hook supplies the explicit Calendar overlay state, and a separate allocator maps already-prioritized academic actions onto effective intervals. Dashboard, Plano, and Sessão consume one shared daily-plan hook so they cannot disagree.

**Tech Stack:** React 19, TypeScript 5.8, Firebase 12/Firestore, Express 4, Google Calendar API, date-fns 4 with `@date-fns/tz`, Vitest, Vite 6.

**Spec:** `docs/superpowers/specs/2026-08-24-weekly-study-availability-design.md`

## Global Constraints

- The recurring weekly schedule is the primary availability source; Google Calendar only subtracts exceptions.
- Persist recurring schedules and date exceptions under the authenticated user's Firestore subtree.
- Use `America/Sao_Paulo` for every date and time calculation.
- Only `study_window` entries can create availability; classes, transport, meals, rests, pauses, margins, and time after 20:30 never can.
- Generated 50-minute blocks are derived and never persisted.
- Calendar disconnected, failed, connected-empty, and connected-with-events states remain distinguishable.
- The availability module does not import topics, mastery, backlog, reviews, or exam priorities.
- The academic allocator is the only owner of packing prioritized actions into effective intervals.
- Do not recreate or modify the existing academic content database in this work.
- The Monday 14:55–15:45 English class must not appear in seed data or UI.

---

## File Map

- `src/features/availability/types.ts`: public and persisted schedule types.
- `src/features/availability/time.ts`: São Paulo wall-clock conversion and interval helpers.
- `src/features/availability/blockScheduler.ts`: pure 50/10/30 block derivation.
- `src/features/availability/availabilityEngine.ts`: recurring, exception, and Calendar overlay facade.
- `src/features/availability/availabilityService.ts`: authenticated application facade that loads persisted inputs.
- `src/features/availability/weeklyScheduleSeed.ts`: initial compact weekly routine.
- `src/features/availability/scheduleRepository.ts`: Firestore reads/writes and seed-on-missing behavior.
- `src/features/availability/useDailyStudyAvailability.ts`: authenticated orchestration and Calendar state.
- `src/features/availability/AgendaView.tsx`: compact schedule and exception editor/preview.
- `src/lib/studyActionAllocator.ts`: deterministic action-to-interval packing.
- `src/hooks/useDailyPlan.ts`: shared availability, ranking, and allocation composition.
- `src/views/Dashboard.tsx`, `src/views/Plano.tsx`, `src/views/Sessao.tsx`: consumers of the shared daily plan.
- `server.ts`: date-bounded Calendar query and transparency field.
- `src/App.tsx`, `src/components/Layout.tsx`: Agenda route and navigation.

---

### Task 1: Establish the test runner and availability domain types

**Files:**
- Modify: `package.json`
- Create: `package-lock.json` through `npm install`
- Create: `vitest.config.ts`
- Create: `src/testSetup.ts`
- Create: `src/features/availability/types.ts`
- Create: `src/features/availability/time.ts`
- Test: `src/features/availability/time.test.ts`

**Interfaces:**
- Consumes: existing `CalendarEvent` from `src/types.ts` temporarily; Task 3 moves the schedule-facing shape into the feature.
- Produces: `SAO_PAULO_TIME_ZONE`, `WeeklySchedule`, `ScheduleEntry`, `ScheduleException`, `CalendarOverlayInput`, `StudyInterval`, `DailyStudyAvailability`, `localDateTimeToIso`, and `isoToLocalDate`.

- [ ] **Step 1: Install deterministic timezone and test dependencies**

Run:

```powershell
npm install @date-fns/tz
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom
```

Expected: `package.json` contains `@date-fns/tz` and `vitest`, and `package-lock.json` is created because this repository's Dockerfile already installs with npm.

- [ ] **Step 2: Add test scripts**

Modify `package.json` scripts to include:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/testSetup.ts'],
    clearMocks: true,
  },
});
```

Create `src/testSetup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Write timezone tests that are independent of the machine timezone**

Create `src/features/availability/time.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { isoToLocalDate, localDateTimeToIso } from './time';

describe('São Paulo schedule time', () => {
  it('converts a local wall-clock value with the São Paulo offset', () => {
    expect(localDateTimeToIso('2026-08-24', '14:40')).toBe('2026-08-24T14:40:00-03:00');
  });

  it('maps an instant to the correct São Paulo local date', () => {
    expect(isoToLocalDate('2026-08-25T01:30:00Z')).toBe('2026-08-24');
  });

  it('rejects malformed local dates and times', () => {
    expect(() => localDateTimeToIso('24/08/2026', '14:40')).toThrow('Invalid local date');
    expect(() => localDateTimeToIso('2026-08-24', '25:00')).toThrow('Invalid wall-clock time');
  });
});
```

- [ ] **Step 4: Run the test to verify it fails**

Run: `npm test -- src/features/availability/time.test.ts`

Expected: FAIL because `./time` does not exist.

- [ ] **Step 5: Define the domain types**

Create `src/features/availability/types.ts` with these exact exported contracts:

```ts
export const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo' as const;
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type ScheduleEntryKind = 'class' | 'transport' | 'meal' | 'rest' | 'study_window' | 'unavailable';

export interface ScheduleEntry {
  id: string;
  label: string;
  kind: ScheduleEntryKind;
  start: string;
  end: string;
  isEstimate?: boolean;
}

export interface WeeklySchedule {
  version: 1;
  timeZone: typeof SAO_PAULO_TIME_ZONE;
  blockPolicy: {
    blockMinutes: 50;
    shortBreakMinutes: 10;
    longBreakMinutes: 30;
    blocksBeforeLongBreak: 3;
  };
  days: Record<Weekday, ScheduleEntry[]>;
  updatedAt: string;
}

export interface ScheduleException {
  localDate: string;
  timeZone: typeof SAO_PAULO_TIME_ZONE;
  reason: 'holiday' | 'absence' | 'simulation_exam' | 'appointment' | 'exceptional_schedule' | 'day_without_classes' | 'early_departure';
  operation: 'day_unavailable' | 'busy_interval' | 'replacement_windows' | 'early_departure';
  intervals?: Array<{ start: string; end: string }>;
  departureTime?: string;
  notes?: string;
  updatedAt: string;
}

export interface AvailabilityCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  transparency?: 'opaque' | 'transparent';
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export type CalendarOverlayInput =
  | { status: 'connected'; events: AvailabilityCalendarEvent[] }
  | { status: 'disconnected' }
  | { status: 'failed'; warning: string };

export interface StudyInterval {
  start: string;
  end: string;
  durationMinutes: 50;
}

export type AvailabilityWarning =
  | { code: 'calendar-disconnected'; message: string }
  | { code: 'calendar-failed'; message: string }
  | { code: 'schedule-unavailable'; message: string };

export interface DailyStudyAvailability {
  localDate: string;
  timeZone: typeof SAO_PAULO_TIME_ZONE;
  intervals: StudyInterval[];
  totalMinutes: number;
  status: 'ready' | 'no-availability' | 'degraded';
  warnings: AvailabilityWarning[];
}
```

- [ ] **Step 6: Implement timezone helpers**

Create `src/features/availability/time.ts` using `TZDate` from `@date-fns/tz`. Validate with anchored regular expressions, create the São Paulo zoned value, reject normalized invalid dates, and serialize the explicit offset:

```ts
import { TZDate } from '@date-fns/tz';
import { SAO_PAULO_TIME_ZONE } from './types';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function localDateTimeToDate(localDate: string, wallTime: string): TZDate {
  if (!DATE_RE.test(localDate)) throw new Error('Invalid local date');
  const match = TIME_RE.exec(wallTime);
  if (!match) throw new Error('Invalid wall-clock time');
  const [year, month, day] = localDate.split('-').map(Number);
  const value = new TZDate(year, month - 1, day, Number(match[1]), Number(match[2]), SAO_PAULO_TIME_ZONE);
  if (value.getFullYear() !== year || value.getMonth() !== month - 1 || value.getDate() !== day) {
    throw new Error('Invalid local date');
  }
  return value;
}

export function localDateTimeToIso(localDate: string, wallTime: string): string {
  return localDateTimeToDate(localDate, wallTime).toISOString();
}

export function isoToLocalDate(iso: string): string {
  const date = new TZDate(iso, SAO_PAULO_TIME_ZONE);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

- [ ] **Step 7: Run focused tests and commit**

Run: `npm test -- src/features/availability/time.test.ts`

Expected: PASS, 3 tests.

Commit:

```powershell
git add package.json package-lock.json vitest.config.ts src/testSetup.ts src/features/availability/types.ts src/features/availability/time.ts src/features/availability/time.test.ts
git commit -m "test: establish availability domain"
```

---

### Task 2: Derive complete study blocks from candidate windows

**Files:**
- Create: `src/features/availability/blockScheduler.ts`
- Test: `src/features/availability/blockScheduler.test.ts`

**Interfaces:**
- Consumes: `StudyInterval`, `WeeklySchedule['blockPolicy']`, and São Paulo time helpers from Task 1.
- Produces: `scheduleStudyBlocks(localDate, windows, policy): StudyInterval[]`.

- [ ] **Step 1: Write exact Monday and fragment tests**

Create `src/features/availability/blockScheduler.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { scheduleStudyBlocks } from './blockScheduler';

const policy = { blockMinutes: 50 as const, shortBreakMinutes: 10, longBreakMinutes: 30, blocksBeforeLongBreak: 3 };

describe('scheduleStudyBlocks', () => {
  it('creates the five approved Monday blocks and leaves 40 minutes of margin', () => {
    const result = scheduleStudyBlocks('2026-08-24', [{ start: '14:40', end: '20:30' }], policy);
    expect(result.map(({ start, end }) => [start.slice(11, 16), end.slice(11, 16)])).toEqual([
      ['14:40', '15:30'], ['15:40', '16:30'], ['16:40', '17:30'], ['18:00', '18:50'], ['19:00', '19:50'],
    ]);
    expect(result.reduce((sum, block) => sum + block.durationMinutes, 0)).toBe(250);
  });

  it('does not promote a 49-minute fragment to a full block', () => {
    expect(scheduleStudyBlocks('2026-08-24', [{ start: '18:00', end: '18:49' }], policy)).toEqual([]);
  });

  it('restarts placement after an interruption-created segment', () => {
    const result = scheduleStudyBlocks('2026-08-24', [
      { start: '14:40', end: '16:00' },
      { start: '16:30', end: '18:20' },
    ], policy);
    expect(result.map(({ start }) => start.slice(11, 16))).toEqual(['14:40', '16:30', '17:30']);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/features/availability/blockScheduler.test.ts`

Expected: FAIL because `scheduleStudyBlocks` is missing.

- [ ] **Step 3: Implement the deterministic scheduler**

Create `src/features/availability/blockScheduler.ts`. Sort windows, reject overlaps and invalid order, then advance a cursor by 50 minutes plus the configured break. Reset the consecutive-block counter for each input segment. Return ISO timestamps with São Paulo offsets and `durationMinutes: 50`.

Core loop:

```ts
while (cursor.getTime() + policy.blockMinutes * 60_000 <= windowEnd.getTime()) {
  const end = new Date(cursor.getTime() + policy.blockMinutes * 60_000);
  blocks.push({ start: cursor.toISOString(), end: end.toISOString(), durationMinutes: 50 });
  consecutive += 1;
  const breakMinutes = consecutive % policy.blocksBeforeLongBreak === 0
    ? policy.longBreakMinutes
    : policy.shortBreakMinutes;
  cursor = new Date(end.getTime() + breakMinutes * 60_000);
}
```

Use the Task 1 helper to create each segment's initial and final instant so host timezone cannot affect the result.

- [ ] **Step 4: Run focused tests and commit**

Run: `npm test -- src/features/availability/blockScheduler.test.ts`

Expected: PASS, 3 tests.

Commit:

```powershell
git add src/features/availability/blockScheduler.ts src/features/availability/blockScheduler.test.ts
git commit -m "feat: derive complete study blocks"
```

---

### Task 3: Resolve recurring windows, date exceptions, and explicit Calendar states

**Files:**
- Create: `src/features/availability/availabilityEngine.ts`
- Test: `src/features/availability/availabilityEngine.test.ts`
- Modify: `src/types.ts`

**Interfaces:**
- Consumes: Task 1 domain types and Task 2 `scheduleStudyBlocks`.
- Produces: pure `resolveEffectiveStudyAvailability(schedule, exception, calendar, localDate)` and exported private-test helpers only where needed.

- [ ] **Step 1: Write overlay and fail-closed tests**

Create fixtures for a Monday schedule with `study_window: 14:40–20:30`. Test:

```ts
it.each([
  { status: 'connected', events: [] } as const,
  { status: 'disconnected' } as const,
])('keeps base blocks for $status without inventing time', (calendar) => {
  const result = resolveEffectiveStudyAvailability(schedule, undefined, calendar, '2026-08-24');
  expect(result.totalMinutes).toBe(250);
});

it('returns degraded while retaining only stored availability after Calendar failure', () => {
  const result = resolveEffectiveStudyAvailability(
    schedule,
    undefined,
    { status: 'failed', warning: 'Calendar indisponível' },
    '2026-08-24',
  );
  expect(result.status).toBe('degraded');
  expect(result.totalMinutes).toBe(250);
  expect(result.warnings[0].code).toBe('calendar-failed');
});

it('subtracts only a busy Calendar intersection and recalculates full blocks', () => {
  const result = resolveEffectiveStudyAvailability(schedule, undefined, {
    status: 'connected',
    events: [{
      id: 'consulta', summary: 'Consulta',
      start: { dateTime: '2026-08-24T16:00:00-03:00' },
      end: { dateTime: '2026-08-24T16:30:00-03:00' },
    }],
  }, '2026-08-24');
  expect(result.intervals.every((block) => block.end <= '2026-08-24T16:00:00-03:00' || block.start >= '2026-08-24T16:30:00-03:00')).toBe(true);
});
```

Add separate tests for transparent/cancelled events, all-day events, Calendar events during class time, `day_unavailable`, `busy_interval`, `replacement_windows`, `early_departure`, and an exception not mutating the schedule fixture.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- src/features/availability/availabilityEngine.test.ts`

Expected: FAIL because the engine does not exist.

- [ ] **Step 3: Implement interval subtraction and facade resolution**

Create `availabilityEngine.ts` with this public signature:

```ts
export function resolveEffectiveStudyAvailability(
  schedule: WeeklySchedule,
  exception: ScheduleException | undefined,
  calendar: CalendarOverlayInput,
  localDate: string,
): DailyStudyAvailability;
```

Implementation order is fixed:

1. validate timezone and requested date;
2. map the São Paulo weekday to recurring entries;
3. copy only `study_window` entries;
4. apply the date exception to the copied windows;
5. if Calendar is connected, subtract opaque, non-cancelled intersections;
6. derive complete blocks;
7. set status and warnings from explicit Calendar state and the resulting intervals.

The reusable subtractor must split rather than truncate both sides:

```ts
function subtractInterval(source: TimeRange, busy: TimeRange): TimeRange[] {
  if (busy.end <= source.start || busy.start >= source.end) return [source];
  return [
    source.start < busy.start ? { start: source.start, end: busy.start } : undefined,
    busy.end < source.end ? { start: busy.end, end: source.end } : undefined,
  ].filter((range): range is TimeRange => Boolean(range && range.end > range.start));
}
```

- [ ] **Step 4: Extend the shared Calendar event type**

Add optional `transparency` and `status` fields to `CalendarEvent` in `src/types.ts` so the server response, Conexões view, and availability feature agree.

- [ ] **Step 5: Run focused tests and commit**

Run: `npm test -- src/features/availability/availabilityEngine.test.ts`

Expected: all overlay and exception tests PASS.

Commit:

```powershell
git add src/features/availability/availabilityEngine.ts src/features/availability/availabilityEngine.test.ts src/types.ts
git commit -m "feat: resolve effective daily availability"
```

---

### Task 4: Persist the recurring schedule and date exceptions per user

**Files:**
- Create: `src/features/availability/weeklyScheduleSeed.ts`
- Create: `src/features/availability/scheduleRepository.ts`
- Test: `src/features/availability/weeklyScheduleSeed.test.ts`
- Test: `src/features/availability/scheduleRepository.test.ts`

**Interfaces:**
- Consumes: Task 1 persisted types.
- Produces: `createInitialWeeklySchedule(nowIso)`, `getOrCreateWeeklySchedule(uid)`, `saveWeeklySchedule(uid, schedule)`, `getScheduleException(uid, localDate)`, `saveScheduleException(uid, exception)`, and `deleteScheduleException(uid, localDate)`.

- [ ] **Step 1: Write seed acceptance tests**

Assert the seed has no label containing `Inglês` or `English`, Monday contains `14:40–20:30`, Thursday's `17:35–20:30` study window has `isEstimate: true`, Tuesday/Wednesday/Friday/Saturday end at 20:30, and Sunday has no `study_window`.

```ts
expect(seed.days.monday.filter((entry) => entry.kind === 'study_window')).toEqual([
  { id: 'mon-study', label: 'Estudo autônomo no cursinho', kind: 'study_window', start: '14:40', end: '20:30' },
]);
expect(seed.days.thursday.find((entry) => entry.id === 'thu-study')).toMatchObject({
  start: '17:35', end: '20:30', isEstimate: true,
});
```

- [ ] **Step 2: Run seed tests to verify failure**

Run: `npm test -- src/features/availability/weeklyScheduleSeed.test.ts`

Expected: FAIL because the seed is missing.

- [ ] **Step 3: Implement the compact initial schedule**

Use aggregate protected class entries rather than duplicating academic subjects. Seed:

- Monday: class `07:00–13:45`, meal `13:45–14:40`, study `14:40–20:30`, transport `20:30–21:10`.
- Tuesday, Wednesday, Friday, Saturday: class `07:00–13:45`, estimated meal/transition `13:45–14:40`, estimated study `14:40–20:30`.
- Thursday: class `07:00–17:35`, estimated study `17:35–20:30`.
- Sunday: no entries.

Every Monday-through-Saturday study entry ends exactly at 20:30.

- [ ] **Step 4: Write repository tests with mocked Firestore functions**

Mock `getDoc`, `setDoc`, `deleteDoc`, and `doc`. Verify exact paths:

```ts
expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1', 'data', 'weeklySchedule');
expect(doc).toHaveBeenCalledWith(db, 'users', 'user-1', 'scheduleExceptions', '2026-08-24');
```

Verify missing schedule seeds once, existing schedule is not overwritten, empty uid throws, and malformed loaded timezone returns a controlled error rather than a cast.

- [ ] **Step 5: Implement and validate the repository boundary**

Use `doc/getDoc/setDoc/deleteDoc` directly in `scheduleRepository.ts`. Add runtime validators for `version`, timezone, day keys, entry kinds, `HH:mm`, and exception operation-specific fields. Save documents with their explicit `updatedAt`; do not use generic `as WeeklySchedule` on unvalidated data.

- [ ] **Step 6: Run repository tests and commit**

Run:

```powershell
npm test -- src/features/availability/weeklyScheduleSeed.test.ts src/features/availability/scheduleRepository.test.ts
```

Expected: PASS.

Commit:

```powershell
git add src/features/availability/weeklyScheduleSeed.ts src/features/availability/weeklyScheduleSeed.test.ts src/features/availability/scheduleRepository.ts src/features/availability/scheduleRepository.test.ts
git commit -m "feat: persist user weekly schedules"
```

---

### Task 5: Fetch date-bounded Calendar exceptions and expose the daily hook

**Files:**
- Modify: `server.ts`
- Create: `src/features/availability/availabilityService.ts`
- Create: `src/features/availability/useDailyStudyAvailability.ts`
- Test: `src/features/availability/useDailyStudyAvailability.test.tsx`
- Modify: `src/hooks/useAvailableMinutes.ts` (delete after consumers migrate in Task 8)
- Modify: `src/views/Conexoes.tsx`

**Interfaces:**
- Consumes: schedule repository, `resolveEffectiveStudyAvailability`, `useAuth`, and `getAccessToken`.
- Produces: `getEffectiveStudyAvailability(uid, localDate, calendar)`, plus `useDailyStudyAvailability(localDate)` returning `{ availability, schedule, exception, loading, syncError, saveSchedule, saveException, deleteException }`.

- [ ] **Step 1: Write hook tests for all Calendar states**

With React Testing Library-compatible Vitest mocks, cover:

- no authenticated user: local seed preview, disconnected warning, no Firestore write;
- authenticated but Google disconnected: stored schedule plus `{ status: 'disconnected' }`;
- token and successful `events: []`: `{ status: 'connected', events: [] }`;
- non-OK response: `{ status: 'failed', warning: 'Não foi possível carregar as exceções do Google Calendar.' }`;
- schedule repository failure: no intervals and `status: 'degraded'`.

- [ ] **Step 2: Run hook tests to verify failure**

Run: `npm test -- src/features/availability/useDailyStudyAvailability.test.tsx`

Expected: FAIL because the hook is missing.

- [ ] **Step 3: Make the Calendar endpoint date-bounded**

Change `GET /api/calendar/events` to require `date=YYYY-MM-DD`, validate it, and query only that São Paulo day. Include event `transparency` and `status`. The Google request must use:

```ts
calendar.events.list({
  calendarId: 'primary',
  timeMin: localDateTimeToInstant(date, '00:00', 'America/Sao_Paulo'),
  timeMax: localDateTimeToInstant(nextLocalDate(date), '00:00', 'America/Sao_Paulo'),
  singleEvents: true,
  orderBy: 'startTime',
  maxResults: 100,
});
```

Keep timezone conversion in a small server helper with unit-testable inputs; do not use the server machine's local timezone.

- [ ] **Step 4: Implement explicit hook orchestration**

Create `availabilityService.ts` with the approved application facade:

```ts
export async function getEffectiveStudyAvailability(
  uid: string,
  localDate: string,
  calendar: CalendarOverlayInput,
): Promise<DailyStudyAvailability> {
  const [schedule, exception] = await Promise.all([
    getOrCreateWeeklySchedule(uid),
    getScheduleException(uid, localDate),
  ]);
  return resolveEffectiveStudyAvailability(schedule, exception, calendar, localDate);
}
```

The hook must construct exactly one of the three `CalendarOverlayInput` variants and call this facade only after Calendar state settles. When signed out, it uses `createInitialWeeklySchedule` plus the pure resolver in memory for preview and never writes it.

- [ ] **Step 5: Keep Conexões compatible with the bounded endpoint**

Update its events request to append today's São Paulo local date. Do not change Drive behavior.

- [ ] **Step 6: Run hook tests, type checking, and commit**

Run:

```powershell
npm test -- src/features/availability/useDailyStudyAvailability.test.tsx
npm run lint
```

Expected: PASS.

Commit:

```powershell
git add server.ts src/features/availability/availabilityService.ts src/features/availability/useDailyStudyAvailability.ts src/features/availability/useDailyStudyAvailability.test.tsx src/views/Conexoes.tsx
git commit -m "feat: overlay daily Calendar exceptions"
```

---

### Task 6: Add the compact weekly agenda and date-exception interface

**Files:**
- Create: `src/features/availability/AgendaView.tsx`
- Test: `src/features/availability/AgendaView.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/Layout.tsx`

**Interfaces:**
- Consumes: `useDailyStudyAvailability`, recurring entries, and repository mutation callbacks.
- Produces: `/agenda` route with weekly edit, one-date exception edit, and effective interval preview.

- [ ] **Step 1: Write UI acceptance tests**

Mock the hook with the Monday seed and assert:

```ts
expect(screen.queryByText(/Inglês/i)).not.toBeInTheDocument();
expect(screen.getByText('14:40–15:30')).toBeInTheDocument();
expect(screen.getByText('250 min')).toBeInTheDocument();
expect(screen.getByText(/estimativa editável/i)).toBeInTheDocument();
```

Also test saving an `early_departure` exception for one date and verify the callback receives `localDate`, reason, operation, and `departureTime` without modifying the weekly schedule object.

- [ ] **Step 2: Run UI test to verify failure**

Run: `npm test -- src/features/availability/AgendaView.test.tsx`

Expected: FAIL because `AgendaView` does not exist.

- [ ] **Step 3: Build the compact Agenda view**

The page has three compact sections:

1. `Semana recorrente`: weekday cards with protected summaries and editable `study_window` start/end fields;
2. `Exceção por data`: date, reason, operation, intervals or departure time as required;
3. `Disponibilidade efetiva`: resolved block list, total minutes, and Calendar warning/status.

Show `Estimativa editável` beside any `isEstimate` entry. Saving an edited value removes `isEstimate` from that entry. Do not render subject, topic, mastery, backlog, or exam-priority controls.

- [ ] **Step 4: Wire routing and navigation**

Add `<Route path="agenda" element={<AgendaView />} />` in `src/App.tsx` and an `Agenda` navigation item in `Layout.tsx` near Plano. Use an existing Lucide calendar icon.

- [ ] **Step 5: Run UI tests and commit**

Run:

```powershell
npm test -- src/features/availability/AgendaView.test.tsx
npm run lint
```

Expected: PASS.

Commit:

```powershell
git add src/features/availability/AgendaView.tsx src/features/availability/AgendaView.test.tsx src/App.tsx src/components/Layout.tsx
git commit -m "feat: add recurring agenda editor"
```

---

### Task 7: Separate academic ranking from deterministic interval allocation

**Files:**
- Modify: `src/types.ts`
- Modify: `src/lib/efficiencyEngine.ts`
- Create: `src/lib/studyActionAllocator.ts`
- Test: `src/lib/efficiencyEngine.test.ts`
- Test: `src/lib/studyActionAllocator.test.ts`
- Create: `src/hooks/useDailyPlan.ts`
- Test: `src/hooks/useDailyPlan.test.tsx`

**Interfaces:**
- Consumes: existing mastery/topics/profile data and Task 5 availability hook.
- Produces: `EfficiencyEngine.rankStudyActions(...)`, `AllocatedStudyAction`, `allocateStudyActions(...)`, and shared `useDailyPlan(localDate)`.

- [ ] **Step 1: Write ranking tests before changing the engine**

Freeze the clock with `vi.setSystemTime`. Assert `rankStudyActions` returns all eligible actions in descending `priorityScore` order and does not accept or apply an availability budget.

- [ ] **Step 2: Write allocator tests**

Use two 50-minute intervals and actions lasting 20, 30, 45, and 15 minutes. Assert:

```ts
expect(allocateStudyActions(actions, intervals)).toEqual([
  expect.objectContaining({ id: 'a-20', intervalStart: intervals[0].start, allocatedMinutes: 20 }),
  expect.objectContaining({ id: 'a-30', intervalStart: expect.stringContaining('15:00'), allocatedMinutes: 30 }),
  expect.objectContaining({ id: 'a-45', intervalStart: intervals[1].start, allocatedMinutes: 45 }),
]);
```

Assert the 15-minute action is omitted when it cannot fit, a 60-minute action is never allocated, input priority order is preserved, and no `intervalEnd` exceeds its containing study interval.

- [ ] **Step 3: Run ranking and allocator tests to verify failure**

Run: `npm test -- src/lib/efficiencyEngine.test.ts src/lib/studyActionAllocator.test.ts`

Expected: FAIL because the new interfaces do not exist.

- [ ] **Step 4: Refactor ranking without changing its score formula**

Rename the current responsibility to:

```ts
public static rankStudyActions(
  masteryData: TopicMastery[],
  topics: Topic[],
  profile: UserProfile,
  now: Date = new Date(),
): StudyAction[]
```

Remove the final minute-budget loop. Preserve learning-needed, review-necessity, error-signal, energy, type, duration, and descending-score logic. Use `now` rather than calling `new Date()` repeatedly.

- [ ] **Step 5: Implement the sole packing owner**

Add to `src/types.ts`:

```ts
export interface AllocatedStudyAction extends StudyAction {
  intervalStart: string;
  intervalEnd: string;
  allocatedMinutes: number;
}
```

Implement `allocateStudyActions(prioritizedActions, intervals)` with chronological interval cursors. For each action in priority order, place it in the earliest interval with sufficient remaining minutes. Set `intervalStart` to the cursor and `intervalEnd` to cursor plus `estimatedMinutes`. Reject durations `<= 0` and skip durations `> 50`.

- [ ] **Step 6: Compose one shared daily-plan hook**

`useDailyPlan(localDate)` calls `useDailyStudyAvailability`, `useUserMastery`, and `useUserProfile`; ranks actions with existing `mockTopics`; then allocates them. It returns:

```ts
{
  availability,
  prioritizedActions,
  allocatedActions,
  loading,
  warnings,
  isPersisted,
}
```

Write a hook test proving the same interval fixture produces the same allocated actions on repeated renders.

- [ ] **Step 7: Run focused tests and commit**

Run:

```powershell
npm test -- src/lib/efficiencyEngine.test.ts src/lib/studyActionAllocator.test.ts src/hooks/useDailyPlan.test.tsx
npm run lint
```

Expected: PASS.

Commit:

```powershell
git add src/types.ts src/lib/efficiencyEngine.ts src/lib/efficiencyEngine.test.ts src/lib/studyActionAllocator.ts src/lib/studyActionAllocator.test.ts src/hooks/useDailyPlan.ts src/hooks/useDailyPlan.test.tsx
git commit -m "feat: allocate prioritized actions to study intervals"
```

---

### Task 8: Migrate Dashboard, Plano, and Sessão to the shared allocated plan

**Files:**
- Modify: `src/views/Dashboard.tsx`
- Modify: `src/views/Plano.tsx`
- Modify: `src/views/Sessao.tsx`
- Delete: `src/hooks/useAvailableMinutes.ts`
- Delete: `src/lib/calendarPlanner.ts`
- Test: `src/views/DailyPlanConsistency.test.tsx`

**Interfaces:**
- Consumes: Task 7 `useDailyPlan` and `AllocatedStudyAction`.
- Produces: three consistent views of the same effective availability and allocated actions.

- [ ] **Step 1: Write cross-view consistency tests**

Mock `useDailyPlan` once with 250 minutes and five allocated actions. Render each view separately and assert each shows `250 min`, the same first topic, and the same scheduled start. Assert Plano no longer renders the manual-minute slider or copy claiming Calendar is the primary source.

- [ ] **Step 2: Run the consistency test to verify failure**

Run: `npm test -- src/views/DailyPlanConsistency.test.tsx`

Expected: FAIL because the views still use `useAvailableMinutes` independently.

- [ ] **Step 3: Migrate Dashboard**

Replace direct engine and `useAvailableMinutes` calls with `useDailyPlan(todayInSaoPaulo)`. Display `availability.totalMinutes`, copy `Calculado pela sua agenda semanal`, and render allocated actions with start times.

- [ ] **Step 4: Migrate Plano**

Remove `autoMode`, manual minutes, range input, and Calendar-primary copy. Render:

- effective total minutes;
- interval timeline;
- allocated action start/end;
- degraded/disconnected warnings;
- unallocated priorities in the existing waiting-list section.

Energy adjustment remains local to Plano only if it is passed as an explicit profile override to `useDailyPlan`; otherwise remove the duplicate local energy state and use the persisted profile consistently across all three views.

- [ ] **Step 5: Migrate Sessão**

Use `allocatedActions` as session blocks. The timer duration is `allocatedMinutes * 60`; display the scheduled start/end; completion state continues to use action ids. Do not let a timer duration exceed its allocated interval.

- [ ] **Step 6: Remove obsolete generic-free-time code**

Delete `useAvailableMinutes.ts` and `calendarPlanner.ts` only after `rg "useAvailableMinutes|computeFreeMinutes|getDefaultStudyWindow" src` returns no consumers.

- [ ] **Step 7: Run consistency tests, full tests, and commit**

Run:

```powershell
npm test -- src/views/DailyPlanConsistency.test.tsx
npm test
npm run lint
```

Expected: PASS with no references to the obsolete hook.

Commit:

```powershell
git add src/views/Dashboard.tsx src/views/Plano.tsx src/views/Sessao.tsx src/views/DailyPlanConsistency.test.tsx
git rm src/hooks/useAvailableMinutes.ts src/lib/calendarPlanner.ts
git commit -m "feat: use effective availability across daily planning"
```

---

### Task 9: Production verification for the approved Monday scenario

**Files:**
- Modify only files implicated by verification failures within this feature's scope.
- Create: `docs/superpowers/verification/2026-08-24-weekly-availability.md`

**Interfaces:**
- Consumes: completed Tasks 1–8.
- Produces: reproducible evidence for type safety, tests, production build, and the approved Monday UI flow.

- [ ] **Step 1: Run the complete automated verification suite**

Run:

```powershell
npm test
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 2: Start the app with a non-secret local configuration**

Run: `npm run dev`

Expected: Express/Vite starts on `http://localhost:3000`; Gemini-backed features may report unconfigured when no key is supplied, but Agenda and pure planning remain available.

- [ ] **Step 3: Verify the Monday acceptance flow in the browser**

Use local date `2026-08-24` and confirm:

- no Monday English entry;
- base window `14:40–20:30`;
- blocks `14:40–15:30`, `15:40–16:30`, `16:40–17:30`, `18:00–18:50`, `19:00–19:50`;
- total `250 min`;
- no block after `20:30`;
- Thursday `17:35` displays `Estimativa editável`;
- Dashboard, Plano, and Sessão display the same first allocated action and time.

- [ ] **Step 4: Verify one exception and one Calendar failure**

Create a date-only early departure exception at `18:30` and confirm the recurring Monday remains unchanged when previewing the following Monday. Mock or force a Calendar request failure and confirm availability is marked degraded without gaining intervals.

- [ ] **Step 5: Record exact evidence**

Create `docs/superpowers/verification/2026-08-24-weekly-availability.md` containing command names, exit codes, test counts, build result, and the observed Monday intervals. Do not include API keys, access tokens, Firebase user ids, or Calendar event contents.

- [ ] **Step 6: Commit verification evidence**

```powershell
git add docs/superpowers/verification/2026-08-24-weekly-availability.md
git commit -m "docs: verify weekly study availability"
```
