import type { StudyInterval } from '../features/availability/types';
import type { AllocatedStudyAction, StudyAction } from '../types';

interface IntervalCursor {
  end: string;
  cursor: string;
  cursorMs: number;
  endMs: number;
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
  let currentIntervalIndex = 0;

  for (const action of prioritizedActions) {
    if (!Number.isFinite(action.estimatedMinutes) || action.estimatedMinutes <= 0 || action.estimatedMinutes > 50) {
      continue;
    }

    const durationMs = action.estimatedMinutes * 60_000;
    while (
      currentIntervalIndex < cursors.length
      && cursors[currentIntervalIndex].cursorMs + durationMs > cursors[currentIntervalIndex].endMs
    ) {
      currentIntervalIndex += 1;
    }

    const cursor = cursors[currentIntervalIndex];
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
