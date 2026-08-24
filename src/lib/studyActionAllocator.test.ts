import { describe, expect, it } from 'vitest';
import type { StudyAction } from '../types';
import type { StudyInterval } from '../features/availability/types';
import { allocateStudyActions } from './studyActionAllocator';

const intervals: StudyInterval[] = [
  { start: '2026-08-24T14:40:00.000Z', end: '2026-08-24T15:30:00.000Z', durationMinutes: 50 },
  { start: '2026-08-24T15:40:00.000Z', end: '2026-08-24T16:30:00.000Z', durationMinutes: 50 },
];

function action(id: string, estimatedMinutes: number, priorityScore: number): StudyAction {
  return {
    id,
    type: 'practice',
    topicId: id,
    topicName: id,
    subject: 'Subject',
    estimatedMinutes,
    priorityScore,
  };
}

describe('allocateStudyActions', () => {
  it('packs compatible short actions and moves the next action to the earliest interval where it fits', () => {
    const actions = [
      action('a-20', 20, 100),
      action('a-30', 30, 90),
      action('a-45', 45, 80),
      action('a-15', 15, 70),
    ];

    expect(allocateStudyActions(actions, intervals)).toEqual([
      expect.objectContaining({
        id: 'a-20',
        intervalStart: intervals[0].start,
        intervalEnd: '2026-08-24T15:00:00.000Z',
        allocatedMinutes: 20,
      }),
      expect.objectContaining({
        id: 'a-30',
        intervalStart: expect.stringContaining('15:00'),
        intervalEnd: intervals[0].end,
        allocatedMinutes: 30,
      }),
      expect.objectContaining({
        id: 'a-45',
        intervalStart: intervals[1].start,
        intervalEnd: '2026-08-24T16:25:00.000Z',
        allocatedMinutes: 45,
      }),
    ]);
  });

  it('omits non-positive and overlong actions without preventing valid actions from being allocated', () => {
    const actions = [
      action('zero', 0, 100),
      action('negative', -10, 90),
      action('overlong', 60, 80),
      action('valid', 20, 70),
    ];

    expect(allocateStudyActions(actions, intervals).map(({ id }) => id)).toEqual(['valid']);
  });

  it('returns the packed plan in chronological execution order while preserving priority scores', () => {
    const actions = [action('highest', 45, 100), action('middle', 20, 90), action('lowest', 30, 80)];

    const allocated = allocateStudyActions(actions, [...intervals].reverse());

    expect(allocated.map(({ id }) => id)).toEqual(['highest', 'middle', 'lowest']);
    expect(allocated[0].intervalStart).toBe(intervals[0].start);
    expect(allocated[1].intervalStart).toBe(intervals[1].start);
    expect(allocated[2].intervalStart).toBe('2026-08-24T16:00:00.000Z');
  });

  it('never backfills a later-priority action before an already allocated action', () => {
    const allocated = allocateStudyActions(
      [action('high-45', 45, 100), action('middle-45', 45, 90), action('low-5', 5, 80)],
      intervals,
    );
    expect(allocated.map(({ id }) => id)).toEqual(['high-45', 'low-5', 'middle-45']);
    expect(allocated.map(({ priorityScore }) => priorityScore)).toEqual([100, 80, 90]);
    expect(allocated.every((item, index) => index === 0 || item.intervalStart >= allocated[index - 1].intervalStart)).toBe(true);
  });

  it('never lets an allocated action end after its containing interval', () => {
    const allocated = allocateStudyActions(
      [action('a-45', 45, 100), action('a-15', 15, 90), action('a-30', 30, 80)],
      intervals,
    );

    for (const allocatedAction of allocated) {
      const containingInterval = intervals.find(({ start, end }) => (
        allocatedAction.intervalStart >= start && allocatedAction.intervalStart < end
      ));
      expect(containingInterval).toBeDefined();
      expect(allocatedAction.intervalEnd <= containingInterval!.end).toBe(true);
    }
  });
});
