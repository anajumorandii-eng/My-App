import type { StudyInterval } from '../features/availability/types';
import type { AllocatedStudyAction, StudyAction } from '../types';

interface IntervalCursor {
  end: string;
  cursor: string;
  cursorMs: number;
  endMs: number;
}

/**
 * @deprecated Transitional support for generateDailyPlan until all views use interval allocation.
 */
export function fitActionsToMinuteBudget(
  prioritizedActions: StudyAction[],
  availableMinutes: number,
): StudyAction[] {
  let allocatedMinutes = 0;
  const fittedActions: StudyAction[] = [];

  for (const action of prioritizedActions) {
    if (allocatedMinutes + action.estimatedMinutes <= availableMinutes) {
      fittedActions.push(action);
      allocatedMinutes += action.estimatedMinutes;
    }
  }

  return fittedActions;
}

export function allocateStudyActions(
  prioritizedActions: StudyAction[],
  intervals: StudyInterval[],
): AllocatedStudyAction[] {
  const cursors = intervals
    .map(({ start, end }): IntervalCursor => ({
      end,
      cursor: start,
      cursorMs: new Date(start).getTime(),
      endMs: new Date(end).getTime(),
    }))
    .filter(({ cursorMs, endMs }) => Number.isFinite(cursorMs) && Number.isFinite(endMs) && cursorMs < endMs)
    .sort((left, right) => left.cursorMs - right.cursorMs);

  const allocated: AllocatedStudyAction[] = [];

  for (const action of prioritizedActions) {
    if (!Number.isFinite(action.estimatedMinutes) || action.estimatedMinutes <= 0 || action.estimatedMinutes > 50) {
      continue;
    }

    const durationMs = action.estimatedMinutes * 60_000;
    const cursor = cursors.find((candidate) => candidate.cursorMs + durationMs <= candidate.endMs);
    if (!cursor) continue;

    const intervalEndMs = cursor.cursorMs + durationMs;
    const intervalEnd = intervalEndMs === cursor.endMs ? cursor.end : new Date(intervalEndMs).toISOString();
    allocated.push({
      ...action,
      intervalStart: cursor.cursor,
      intervalEnd,
      allocatedMinutes: action.estimatedMinutes,
    });
    cursor.cursorMs = intervalEndMs;
    cursor.cursor = intervalEnd;
  }

  return allocated;
}
