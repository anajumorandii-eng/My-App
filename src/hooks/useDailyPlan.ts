import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
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
  const { loading: authLoading } = useAuth();
  const availabilityState = useDailyStudyAvailability(localDate);
  const masteryState = useUserMastery();
  const profileState = useUserProfile();
  const goalsState = useStudentGoals();
  const { goals } = goalsState;
  const loading = Boolean(authLoading || availabilityState.loading || masteryState.loading || profileState.loading || goalsState.loading);

  const prioritizedActions = useMemo(
    () => loading ? [] : EfficiencyEngine.rankStudyActions(masteryState.mastery, mockTopics, profileState.profile, goals),
    [loading, goals, masteryState.mastery, profileState.profile],
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
    loading,
    warnings: availabilityState.availability?.warnings ?? [],
    isPersisted: masteryState.isPersisted && profileState.isPersisted && goalsState.isPersisted,
  };
}
