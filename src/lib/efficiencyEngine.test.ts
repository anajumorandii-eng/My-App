import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Topic, TopicMastery, UserProfile } from '../types';
import { EfficiencyEngine } from './efficiencyEngine';

const NOW = new Date('2026-08-24T12:00:00.000Z');

const topics: Topic[] = [
  { id: 'theory', name: 'Theory topic', subject: 'Biology', prerequisites: [] },
  { id: 'errors', name: 'Error topic', subject: 'Mathematics', prerequisites: [] },
  { id: 'review', name: 'Review topic', subject: 'Physics', prerequisites: [] },
  { id: 'practice', name: 'Practice topic', subject: 'Chemistry', prerequisites: [] },
];

const mastery: TopicMastery[] = [
  { topicId: 'theory', level: 20, uncertainty: 0.2, lastReviewed: '2026-08-19T12:00:00.000Z', errorSignals: 1 },
  { topicId: 'errors', level: 60, uncertainty: 0.4, lastReviewed: '2026-08-04T12:00:00.000Z', errorSignals: 4 },
  { topicId: 'review', level: 70, uncertainty: 0.2, lastReviewed: '2026-08-04T12:00:00.000Z', errorSignals: 0 },
  { topicId: 'practice', level: 50, uncertainty: 0.1, lastReviewed: '2026-08-23T12:00:00.000Z', errorSignals: 0 },
  { topicId: 'missing-topic', level: 0, uncertainty: 1, lastReviewed: '2020-01-01T00:00:00.000Z', errorSignals: 5 },
];

const profile: UserProfile = {
  targetCourse: 'Medicine',
  targetUniversities: ['USP'],
  targetExams: ['FUVEST'],
  availableHoursPerWeek: 20,
  currentEnergyLevel: 'medium',
  autonomyIndex: 70,
};

describe('EfficiencyEngine.rankStudyActions', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2030-01-01T00:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns every eligible action in descending academic priority without applying a minute budget', () => {
    const actions = EfficiencyEngine.rankStudyActions(mastery, topics, profile, NOW);

    expect(actions).toHaveLength(4);
    expect(actions.map(({ topicId }) => topicId)).toEqual(['errors', 'theory', 'review', 'practice']);
    expect(actions.map(({ priorityScore }) => priorityScore)).toEqual([70, 48.5, 42, 23]);
    expect(actions.reduce((total, action) => total + action.estimatedMinutes, 0)).toBe(110);
  });

  it('preserves action type and duration rules and derives deterministic ids from the injected clock', () => {
    const actions = EfficiencyEngine.rankStudyActions(mastery, topics, profile, NOW);

    expect(actions.map(({ id, topicId, type, estimatedMinutes }) => ({ id, topicId, type, estimatedMinutes }))).toEqual([
      { id: `action_errors_${NOW.getTime()}`, topicId: 'errors', type: 'error_analysis', estimatedMinutes: 20 },
      { id: `action_theory_${NOW.getTime()}`, topicId: 'theory', type: 'theory', estimatedMinutes: 45 },
      { id: `action_review_${NOW.getTime()}`, topicId: 'review', type: 'review', estimatedMinutes: 15 },
      { id: `action_practice_${NOW.getTime()}`, topicId: 'practice', type: 'practice', estimatedMinutes: 30 },
    ]);
  });

});
