import type { StudyInterval } from '../features/availability/types';
import type { AllocatedStudyAction, StudyAction } from '../types';

interface IntervalCursor {
  end: string;
  cursor: string;
  cursorMs: number;
  endMs: number;
  purpose?: 'review';
}

export function allocateStudyActions(
  prioritizedActions: StudyAction[],
  intervals: StudyInterval[],
): AllocatedStudyAction[] {
  const cursors = intervals
    .map(({ start, end, purpose }): IntervalCursor => ({
      purpose,
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
    const fits = (cursor: IntervalCursor) => cursor.cursorMs + durationMs <= cursor.endMs;
    const canReview = action.type === 'review' || action.type === 'error_analysis';
    const cursor = (canReview ? cursors.find((cursor) => cursor.purpose === 'review' && fits(cursor)) : undefined)
      ?? cursors.find((cursor) => !cursor.purpose && fits(cursor));
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

  return allocated.sort((a, b) => new Date(a.intervalStart).getTime() - new Date(b.intervalStart).getTime());
}
