import { TopicMastery, Topic, UserProfile, StudyAction } from '../types';
import { nearestExamDate, daysUntil } from '../data/examCalendar';

// Dentro dos últimos 90 dias antes da próxima prova real, todo o plano é
// puxado para cima proporcionalmente — quanto mais perto, maior o boost,
// até +40% na véspera.
const DEADLINE_WINDOW_DAYS = 90;
const DEADLINE_MAX_BOOST = 0.4;

function deadlineMultiplier(): number {
  const exam = nearestExamDate();
  if (!exam) return 1;
  const remaining = daysUntil(exam.date);
  if (remaining < 0 || remaining > DEADLINE_WINDOW_DAYS) return 1;
  return 1 + ((DEADLINE_WINDOW_DAYS - remaining) / DEADLINE_WINDOW_DAYS) * DEADLINE_MAX_BOOST;
}

export class EfficiencyEngine {
  /**
   * Deterministic ranking of study topics based on multiple weighted criteria.
   * Returns a prioritized list of actions to take.
   */
  public static generateDailyPlan(
    masteryData: TopicMastery[],
    topics: Topic[],
    profile: UserProfile,
    availableMinutesToday: number
  ): StudyAction[] {

    let actions: StudyAction[] = [];
    const deadlineBoost = deadlineMultiplier();

    masteryData.forEach(mastery => {
      const topic = topics.find(t => t.id === mastery.topicId);
      if (!topic) return;

      // 1. Learning Needed (Inverse to mastery level)
      const learningNeeded = 100 - mastery.level;
      
      // 2. Review Necessity (Based on time since last review and uncertainty)
      const daysSinceReview = (new Date().getTime() - new Date(mastery.lastReviewed).getTime()) / (1000 * 3600 * 24);
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
      ) * energyMultiplier * deadlineBoost;

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
        id: `action_${topic.id}_${new Date().toISOString().slice(0, 10)}`,
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

    // Fit within available time limit
    let totalTime = 0;
    const finalPlan: StudyAction[] = [];
    
    for (const action of actions) {
      if (totalTime + action.estimatedMinutes <= availableMinutesToday) {
        finalPlan.push(action);
        totalTime += action.estimatedMinutes;
      }
    }

    return finalPlan;
  }
}
