import { useMemo } from 'react';
import { mockTopics } from '../data/mockData';
import { useDailyStudyAvailability } from '../features/availability/useDailyStudyAvailability';
import type { AvailabilityWarning, DailyStudyAvailability } from '../features/availability/types';
import { EfficiencyEngine } from '../lib/efficiencyEngine';
import { allocateStudyActions } from '../lib/studyActionAllocator';
import type { AllocatedStudyAction, StudyAction, TopicMastery, StudentGoals } from '../types';
import { useUserMastery } from './useUserMastery';
import { useUserProfile } from './useUserProfile';
import { useStudentGoals } from './useStudentGoals';

export interface DailyPlanState {
  mastery: TopicMastery[];
  goals: StudentGoals;
  availability: DailyStudyAvailability | undefined;
  prioritizedActions: StudyAction[];
  allocatedActions: AllocatedStudyAction[];
  loading: boolean;
  warnings: AvailabilityWarning[];
  isPersisted: boolean;
}

export function useDailyPlan(localDate: string): DailyPlanState {
  const availabilityState = useDailyStudyAvailability(localDate);
  const masteryState = useUserMastery();
  const profileState = useUserProfile();
  const goalsState = useStudentGoals();
  const { goals } = goalsState;

  const prioritizedActions = useMemo(
    () => EfficiencyEngine.rankStudyActions(masteryState.mastery, mockTopics, profileState.profile, goals),
    [goals, masteryState.mastery, profileState.profile],
  );
  const allocatedActions = useMemo(
    () => allocateStudyActions(prioritizedActions, availabilityState.availability?.intervals ?? []),
    [availabilityState.availability?.intervals, prioritizedActions],
  );

  return {
    mastery: masteryState.mastery,
    goals,
    availability: availabilityState.availability,
    prioritizedActions,
    allocatedActions,
    loading: availabilityState.loading || masteryState.loading || profileState.loading || goalsState.loading,
    warnings: availabilityState.availability?.warnings ?? [],
    isPersisted: masteryState.isPersisted && profileState.isPersisted && goalsState.isPersisted,
  };
}
