import { FlashcardPriority, FlashcardTrainingType } from '../types';

export type FlashcardNavigationStep =
  | 'subject'
  | 'topic'
  | 'priority'
  | 'training_type'
  | 'session';

export interface FlashcardNavigationState {
  step: FlashcardNavigationStep;
  subject?: string;
  topicId?: string;
  priority?: FlashcardPriority;
  trainingType?: FlashcardTrainingType;
  allDueForTopic?: boolean;
}

export type FlashcardNavigationAction =
  | { type: 'select_subject'; subject: string }
  | { type: 'select_topic'; topicId: string }
  | { type: 'select_priority'; priority: FlashcardPriority }
  | { type: 'select_training_type'; trainingType: FlashcardTrainingType }
  | { type: 'review_all_due' }
  | { type: 'back' }
  | { type: 'reset' };

export const initialFlashcardNavigationState: FlashcardNavigationState = { step: 'subject' };

export function flashcardNavigationReducer(
  state: FlashcardNavigationState,
  action: FlashcardNavigationAction,
): FlashcardNavigationState {
  switch (action.type) {
    case 'select_subject':
      return { step: 'topic', subject: action.subject };

    case 'select_topic':
      if (!state.subject) return state;
      return { step: 'priority', subject: state.subject, topicId: action.topicId };

    case 'select_priority':
      if (!state.subject || !state.topicId) return state;
      return {
        step: 'training_type',
        subject: state.subject,
        topicId: state.topicId,
        priority: action.priority,
      };

    case 'select_training_type':
      if (!state.subject || !state.topicId || !state.priority) return state;
      return {
        step: 'session',
        subject: state.subject,
        topicId: state.topicId,
        priority: state.priority,
        trainingType: action.trainingType,
        allDueForTopic: false,
      };

    case 'review_all_due':
      if (!state.subject || !state.topicId) return state;
      return {
        step: 'session',
        subject: state.subject,
        topicId: state.topicId,
        allDueForTopic: true,
      };

    case 'back':
      switch (state.step) {
        case 'session':
          if (!state.subject || !state.topicId) return initialFlashcardNavigationState;
          if (state.allDueForTopic) {
            return { step: 'topic', subject: state.subject, topicId: state.topicId };
          }
          if (!state.priority) return { step: 'topic', subject: state.subject, topicId: state.topicId };
          return {
            step: 'training_type',
            subject: state.subject,
            topicId: state.topicId,
            priority: state.priority,
          };

        case 'training_type':
          if (!state.subject || !state.topicId || !state.priority) return initialFlashcardNavigationState;
          return {
            step: 'priority',
            subject: state.subject,
            topicId: state.topicId,
            priority: state.priority,
          };

        case 'priority':
          if (!state.subject || !state.topicId) return initialFlashcardNavigationState;
          return { step: 'topic', subject: state.subject, topicId: state.topicId };

        case 'topic':
          return state.subject ? { step: 'subject', subject: state.subject } : initialFlashcardNavigationState;

        case 'subject':
          return initialFlashcardNavigationState;
      }

    case 'reset':
      return initialFlashcardNavigationState;
  }
}
