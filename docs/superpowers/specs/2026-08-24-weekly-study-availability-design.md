# Weekly Study Availability Design

## Purpose

Turn the student's recurring routine into the authoritative source of academic availability and expose one small interface to the academic planner:

> Given a user and a local calendar date, return the effective 50-minute study intervals for that date.

The module owns recurring schedule data, date-specific exceptions, Google Calendar exception overlays, timezone handling, protected periods, pause placement, and block recalculation. The academic planner continues to own subject selection, priority scoring, backlog, mastery, and reviews.

## Scope

This first delivery includes:

- a per-user recurring weekly schedule persisted in Firestore;
- per-user, date-specific schedule exceptions persisted separately from the recurring schedule;
- Google Calendar busy events as a read-only exception overlay;
- deterministic conversion of free windows into complete study blocks;
- an initial recurring schedule based on the routine supplied in this conversation;
- removal of the Monday English class from both schedule data and schedule UI;
- replacement of the current `availableMinutes` integration with effective study intervals;
- consumption of those intervals by the existing academic planning engine.

This delivery does not:

- create or duplicate topics, subjects, priorities, mastery, reviews, or backlog entries;
- choose academic content inside the schedule module;
- persist generated study blocks;
- write events to Google Calendar;
- treat Google Calendar as the recurring schedule source;
- build a general-purpose calendar product.

## Terminology

- **Recurring schedule:** the student's stable weekly routine.
- **Protected period:** class, transport, meal, rest, or any other interval that can never become planner availability.
- **Base study window:** a recurring interval in which autonomous study may be scheduled.
- **Date exception:** a one-day override such as a holiday, absence, simulation exam, appointment, exceptional schedule change, day without classes, or early departure.
- **Calendar exception:** a busy Google Calendar event intersecting a base study window after date exceptions have been applied.
- **Candidate window:** remaining time after recurring schedule, date exceptions, and Calendar exceptions have been resolved.
- **Effective study interval:** one complete study block produced from candidate windows after pause rules are applied.
- **Margin:** leftover time that is too short for another full block or intentionally reserved for food, transitions, and closing the day.

## Architectural Boundary

The public application interface is:

```ts
interface StudyInterval {
  start: string; // ISO timestamp with explicit offset
  end: string;   // ISO timestamp with explicit offset
  durationMinutes: 50;
}

interface DailyStudyAvailability {
  localDate: string; // YYYY-MM-DD in America/Sao_Paulo
  timeZone: 'America/Sao_Paulo';
  intervals: StudyInterval[];
  totalMinutes: number;
  status: 'ready' | 'no-availability' | 'degraded';
  warnings: AvailabilityWarning[];
}

async function getEffectiveStudyAvailability(
  uid: string,
  localDate: string,
  calendarEvents?: CalendarEvent[]
): Promise<DailyStudyAvailability>;
```

Consumers must not receive or reason about classes, meals, transport, recurring schedule entries, exceptions, Calendar event subtraction, or pause placement. Those are private implementation details.

The academic planner receives `DailyStudyAvailability.intervals`. It may place academic actions into those intervals, but it may not expand, merge, or reinterpret them as generic free time.

## Internal Modules

### Schedule repository

Loads and saves the authenticated user's recurring schedule and date exceptions. It is the only code that knows Firestore paths and document shapes.

### Recurring-window resolver

Selects the entries for the requested weekday and produces the day's base study windows. Protected periods are never emitted as candidate availability.

### Exception overlay

Applies date exceptions without editing the recurring week. It supports:

- `day_unavailable`: removes every base study window;
- `busy_interval`: subtracts an appointment, simulation exam, absence, or other unavailable interval;
- `replacement_windows`: replaces the study windows only for that date;
- `early_departure`: truncates windows at the supplied departure time;
- `day_without_classes`: replaces that date with explicitly supplied study windows rather than inferring that the whole day is free.

Holiday and day-without-classes exceptions do not automatically create availability. Availability must always be explicitly present in either the recurring schedule or the exception's replacement windows.

### Google Calendar overlay

Receives already-fetched Calendar events and subtracts only event intersections with the post-exception candidate study windows. Therefore, a Calendar copy of a class, transport period, or meal outside those windows cannot be subtracted twice.

The overlay ignores events marked transparent/free. All-day busy events remove all candidate windows for that date. Calendar errors do not cause the module to invent availability: it falls back to the recurring schedule plus stored date exceptions, returns `status: 'degraded'`, and includes a warning explaining that Calendar exceptions could not be applied.

### Block scheduler

Converts candidate windows into complete 50-minute effective study intervals. Blocks and pauses are calculated on demand and are never persisted.

Rules:

- a complete block is exactly 50 minutes;
- consecutive blocks have a 10-minute pause;
- after the third consecutive block, the next pause is 30 minutes;
- the pause cycle repeats after another three consecutive blocks;
- an interruption resets placement within the resulting candidate segments;
- no fragment shorter than 50 minutes is returned as a complete interval;
- leftover fragments become margin;
- short academic actions remain outside this first delivery and require a future explicit rule and distinct interval type.

When a Calendar event or date exception interrupts a planned block, the module first subtracts the event and then reruns block scheduling over the remaining candidate segments. It never shortens a 50-minute block to make it fit.

## Data Model and Persistence

All local times use `America/Sao_Paulo`. Firestore stores date-only values as `YYYY-MM-DD`, wall-clock values as `HH:mm`, and timezone explicitly as `America/Sao_Paulo`. Conversion to instants occurs only at the calculation boundary.

Recurring schedule document:

```text
users/{uid}/data/weeklySchedule
```

```ts
interface WeeklySchedule {
  version: 1;
  timeZone: 'America/Sao_Paulo';
  blockPolicy: {
    blockMinutes: 50;
    shortBreakMinutes: 10;
    longBreakMinutes: 30;
    blocksBeforeLongBreak: 3;
  };
  days: Record<Weekday, ScheduleEntry[]>;
  updatedAt: string;
}

interface ScheduleEntry {
  id: string;
  label: string;
  kind: 'class' | 'transport' | 'meal' | 'rest' | 'study_window' | 'unavailable';
  start: string; // HH:mm
  end: string;   // HH:mm
}
```

Only entries with `kind: 'study_window'` may produce academic availability. All other kinds are protected by construction.

Date exception document:

```text
users/{uid}/scheduleExceptions/{YYYY-MM-DD}
```

```ts
interface ScheduleException {
  localDate: string;
  timeZone: 'America/Sao_Paulo';
  reason:
    | 'holiday'
    | 'absence'
    | 'simulation_exam'
    | 'appointment'
    | 'exceptional_schedule'
    | 'day_without_classes'
    | 'early_departure';
  operation: 'day_unavailable' | 'busy_interval' | 'replacement_windows' | 'early_departure';
  intervals?: Array<{ start: string; end: string }>;
  departureTime?: string;
  notes?: string;
  updatedAt: string;
}
```

Existing Firestore security rules already restrict these paths to the authenticated owner. Repository methods must still require a non-empty `uid` and validate loaded data before calculation.

## Initial Recurring Schedule

The seed is created only when the authenticated user has no weekly schedule document. It never overwrites a schedule that the user has edited.

The known recurring routine is:

- Monday: regular classes end at 13:45; lunch/transition is protected from 13:45 to 14:40; base study window is 14:40–20:30; transport home is 20:30–21:10; no English class.
- Tuesday: regular classes end at 13:45; the student remains at the course until 20:30; post-class meal/transition remains protected and the autonomous-study window ends at 20:30.
- Wednesday: regular classes end at 13:45; the student remains at the course until 20:30; post-class meal/transition remains protected and the autonomous-study window ends at 20:30.
- Thursday: regular classes end at 17:35; autonomous study may occur afterward at the course and ends at 20:30.
- Friday: regular classes end at 13:45; the student remains at the course until 20:30; post-class meal/transition remains protected and the autonomous-study window ends at 20:30.
- Saturday: regular classes end at 13:45; the student remains at the course until 20:30; post-class meal/transition remains protected and the autonomous-study window ends at 20:30.
- Sunday: no study window is inferred until the user explicitly configures one.

For days other than Monday, where the exact meal/transition end has not yet been separately confirmed, the seed uses the supplied Monday transition convention of 55 minutes after the final 13:45 class. These entries remain editable in the schedule UI. Thursday begins its candidate window at 17:35; the block policy naturally leaves unusable margin and does not turn it into a partial session.

The schedule UI and seed source must not contain the former Monday 14:55–15:45 English class.

## Required Result for Monday, 24 August 2026

With no date exception and no intersecting busy Calendar event:

- protected classes: 07:00–13:45;
- protected lunch/transition: 13:45–14:40;
- candidate study window: 14:40–20:30;
- effective blocks:
  - 14:40–15:30;
  - 15:40–16:30;
  - 16:40–17:30;
  - 18:00–18:50;
  - 19:00–19:50;
- total academic availability: 250 minutes;
- remaining margin: 19:50–20:30;
- protected transport: 20:30–21:10;
- no availability after 20:30.

## Academic Planner Integration

The existing `EfficiencyEngine` keeps responsibility for ranking topics and creating academic actions. Its availability input changes from an undifferentiated minute count to the effective intervals returned by the schedule facade.

Integration rules:

- topic, mastery, error, review, backlog, and exam-priority logic remain outside the schedule module;
- the planner does not recalculate free time;
- an action must fit wholly inside an effective interval;
- actions estimated at less than 50 minutes may share one interval only under explicit planner packing rules; the schedule interval itself remains 50 minutes;
- actions longer than 50 minutes must be split by an explicit academic-action rule or deferred; they may not silently overrun pauses or protected time;
- Dashboard, Plano, and Sessão consume the same resolved availability for the same user and date.

The existing academic priority formula is not duplicated or modified as part of the availability module. A later academic-planner improvement may add exam weights and backlog scoring, but that is independently testable work.

## User Interface

The schedule UI stays compact and operational:

- weekly recurring schedule editor grouped by weekday;
- clear visual distinction between protected entries and study windows;
- one-date exception editor with reason and operation;
- a daily preview showing effective intervals and total minutes;
- a warning when Calendar is disconnected or unavailable;
- no subject, topic, backlog, or priority fields.

Monday must visibly omit English and show the 14:40–20:30 base window plus the five calculated blocks.

## Validation and Failure Handling

The module rejects or warns on:

- invalid `YYYY-MM-DD` dates or `HH:mm` times;
- a timezone other than `America/Sao_Paulo`;
- overlapping recurring entries of incompatible kinds;
- end times not later than start times;
- exceptions whose intervals are outside the requested date;
- malformed Firestore data;
- Calendar events without usable start/end values.

If recurring schedule data is missing, the repository creates the seed for an authenticated user. If it cannot load or create the schedule, availability returns no intervals and a degraded warning; it must not fall back to a generic 120-minute allowance because that could schedule study during classes or transport.

## Testing Strategy

Unit tests cover:

- weekday resolution in `America/Sao_Paulo` independent of the machine timezone;
- protected entries never becoming candidate windows;
- Monday's exact five-block result and 250-minute total;
- short and long pause placement;
- fragments shorter than 50 minutes being discarded;
- Calendar events outside candidate windows having no effect;
- a Calendar event splitting a candidate block and triggering recalculation;
- transparent Calendar events being ignored;
- all-day busy events removing the date's availability;
- each date-exception operation;
- an exception changing one date without mutating the recurring week;
- no availability after 20:30;
- Monday English being absent from the seed and UI data;
- degraded behavior when Calendar fails;
- safe no-availability behavior when Firestore schedule loading fails.

Repository tests use the Firestore API behind a mockable repository boundary. Planner integration tests verify that Dashboard, Plano, and Sessão receive the same effective intervals and that the academic engine never schedules across an interval boundary.

## Acceptance Criteria

1. For `2026-08-24`, the facade returns exactly five 50-minute intervals totaling 250 minutes when no exception intersects the window.
2. The Monday English class is absent from both persisted seed data and visible schedule data.
3. Recurring schedules and date exceptions are stored under the authenticated user's Firestore subtree.
4. A date exception affects only its target date.
5. Google Calendar can only subtract from candidate study windows and cannot create availability.
6. A Calendar failure never expands availability.
7. No class, transport, meal, pause, margin, or time after 20:30 is returned as an effective study interval.
8. Interrupted windows are recalculated into complete 50-minute blocks; partial fragments are not returned as full sessions.
9. Generated blocks are not persisted.
10. The academic planner consumes the facade result without importing recurring-schedule, exception, Calendar, transport, meal, or pause implementation details.
11. Existing topic and priority data are neither recreated nor copied into the schedule module.
12. All schedule calculations are deterministic in `America/Sao_Paulo`.

## Delivery Order

1. Establish deterministic availability domain types, recurring resolution, exception overlays, Calendar overlays, and block scheduling with tests.
2. Add Firestore persistence and the initial weekly seed with tests.
3. Add the compact schedule and date-exception UI.
4. Replace `useAvailableMinutes` with the availability facade.
5. Connect the existing academic planner, Dashboard, Plano, and Sessão to effective intervals.
6. Run type checking, unit tests, production build, and browser-level acceptance checks for 24/08/2026.
