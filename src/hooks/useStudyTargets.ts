import { useUserProfile } from './useUserProfile';
import { useStudentGoals } from './useStudentGoals';
import { resolveStudyTargets } from '../lib/studyTargets';
export function useStudyTargets() {
  const profile = useUserProfile();
  const goals = useStudentGoals();
  return { targets: resolveStudyTargets(profile.profile, profile.isPersisted, goals.goals, goals.isPersisted), loading: profile.loading || goals.loading, error: profile.syncError || goals.syncError };
}
