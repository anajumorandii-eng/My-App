import { TopicMastery, Topic, UserProfile, StudyAction } from '../types';

export class EfficiencyEngine {
  /**
   * Deterministic ranking of study topics based on multiple weighted criteria.
   * Returns a prioritized list of actions to take.
   */
  public static rankStudyActions(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    now: Date = new Date(),
  ): StudyAction[] {
    
    let actions: StudyAction[] = [];
    
    masteryData.forEach(mastery => {
      const topic = topics.find(t => t.id === mastery.topicId);
      if (!topic) return;

      // 1. Learning Needed (Inverse to mastery level)
      const learningNeeded = 100 - mastery.level;
      
      // 2. Review Necessity (Based on time since last review and uncertainty)
      const daysSinceReview = (now.getTime() - new Date(mastery.lastReviewed).getTime()) / (1000 * 3600 * 24);
      const reviewNecessity = Math.min((daysSinceReview * 5) + (mastery.uncertainty * 50), 100);
      
      // 3. Error Signal Urgency
      const errorSignal = mastery.errorSignals * 20; // 5 errors = 100 max signal

      // 4. Energy Adjustment
      let energyMultiplier = 1;
      if (profile.currentEnergyLevel === 'low') {
        // High error signal/low mastery gets penalized if low energy, better to do easier reviews
        if (learningNeeded > 80) energyMultiplier = 0.5; 
      } else if (profile.currentEnergyLevel === 'high') {
        if (learningNeeded > 80) energyMultiplier = 1.5;
      }

      // Base Score Calculation
      const rawScore = (
        (learningNeeded * 0.4) +
        (reviewNecessity * 0.3) +
        (errorSignal * 0.3)
      ) * energyMultiplier;

      // Determine action type based on mastery state
      let type: StudyAction['type'] = 'practice';
      let estimatedMinutes = 30;

      if (mastery.level < 40) {
        type = 'theory';
        estimatedMinutes = 45;
      } else if (mastery.errorSignals > 3) {
        type = 'error_analysis';
        estimatedMinutes = 20;
      } else if (reviewNecessity > 70) {
        type = 'review';
        estimatedMinutes = 15;
      }

      actions.push({
        id: `action_${topic.id}_${now.getTime()}`,
        type,
        topicId: topic.id,
        topicName: topic.name,
        subject: topic.subject,
        estimatedMinutes,
        priorityScore: rawScore
      });
    });

    // Sort by highest priority first
    actions.sort((a, b) => b.priorityScore - a.priorityScore);

    return actions;
  }

  /**
   * @deprecated Consumers should use rankStudyActions and allocateStudyActions.
   * Kept temporarily so existing views compile until they migrate to useDailyPlan.
   */
  public static generateDailyPlan(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    _legacyAvailableMinutesToday: number,
  ): StudyAction[] {
    return this.rankStudyActions(masteryData, topics, profile);
  }
}
