import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SAO_PAULO_TIME_ZONE, type DailyStudyAvailability } from '../features/availability/types';
import type { TopicMastery, UserProfile } from '../types';

const availabilityHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const profileHook = vi.hoisted(() => vi.fn());

vi.mock('../features/availability/useDailyStudyAvailability', () => ({
  useDailyStudyAvailability: availabilityHook,
}));
vi.mock('./useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('./useUserProfile', () => ({ useUserProfile: profileHook }));

import { useDailyPlan } from './useDailyPlan';

const LOCAL_DATE = '2026-08-24';
const NOW = new Date('2026-08-24T12:00:00.000Z');
const availability: DailyStudyAvailability = {
  localDate: LOCAL_DATE,
  timeZone: SAO_PAULO_TIME_ZONE,
  intervals: [
    { start: '2026-08-24T14:40:00.000Z', end: '2026-08-24T15:30:00.000Z', durationMinutes: 50 },
    { start: '2026-08-24T15:40:00.000Z', end: '2026-08-24T16:30:00.000Z', durationMinutes: 50 },
  ],
  totalMinutes: 100,
  status: 'ready',
  warnings: [{ code: 'calendar-disconnected', message: 'Calendar disconnected' }],
};
const mastery: TopicMastery[] = [
  { topicId: 'bio_01', level: 60, uncertainty: 0.4, lastReviewed: '2026-08-04T12:00:00.000Z', errorSignals: 4 },
  { topicId: 'bio_02', level: 20, uncertainty: 0.2, lastReviewed: '2026-08-19T12:00:00.000Z', errorSignals: 1 },
  { topicId: 'bio_03', level: 70, uncertainty: 0.2, lastReviewed: '2026-08-04T12:00:00.000Z', errorSignals: 0 },
  { topicId: 'bio_04', level: 50, uncertainty: 0.1, lastReviewed: '2026-08-23T12:00:00.000Z', errorSignals: 0 },
];
const profile: UserProfile = {
  targetCourse: 'Medicine',
  targetUniversities: ['USP'],
  targetExams: ['FUVEST'],
  availableHoursPerWeek: 20,
  currentEnergyLevel: 'medium',
  autonomyIndex: 70,
};

describe('useDailyPlan', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    availabilityHook.mockReturnValue({
      availability,
      schedule: undefined,
      exception: undefined,
      loading: false,
      syncError: null,
      saveSchedule: vi.fn(),
      saveException: vi.fn(),
      deleteException: vi.fn(),
    });
    masteryHook.mockReturnValue({
      mastery,
      updateMastery: vi.fn(),
      loading: false,
      syncError: null,
      isPersisted: true,
    });
    profileHook.mockReturnValue({
      profile,
      updateProfile: vi.fn(),
      loading: false,
      syncError: null,
      isPersisted: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('combines the same resolved inputs into the same prioritized and allocated plan on repeated renders', () => {
    const first = renderHook(() => useDailyPlan(LOCAL_DATE));
    const second = renderHook(() => useDailyPlan(LOCAL_DATE));

    expect(first.result.current).toEqual(second.result.current);
    expect(first.result.current).toMatchObject({
      availability,
      loading: false,
      warnings: availability.warnings,
      isPersisted: true,
    });
    expect(first.result.current.prioritizedActions.map(({ topicId }) => topicId)).toEqual([
      'bio_01',
      'bio_02',
      'bio_03',
      'bio_04',
    ]);
    expect(first.result.current.allocatedActions.map((action) => ({
      topicId: action.topicId,
      intervalStart: action.intervalStart,
      intervalEnd: action.intervalEnd,
    }))).toEqual([
      {
        topicId: 'bio_01',
        intervalStart: '2026-08-24T14:40:00.000Z',
        intervalEnd: '2026-08-24T15:00:00.000Z',
      },
      {
        topicId: 'bio_03',
        intervalStart: '2026-08-24T15:00:00.000Z',
        intervalEnd: '2026-08-24T15:15:00.000Z',
      },
      {
        topicId: 'bio_02',
        intervalStart: '2026-08-24T15:40:00.000Z',
        intervalEnd: '2026-08-24T16:25:00.000Z',
      },
    ]);
  });
});
