import { FlashcardPriority, FlashcardTrainingType } from '../types';

export type FlashcardNavigationStep =
  | 'subject'
  | 'topic'
  | 'subtopic'
  | 'priority'
  | 'training_type'
  | 'session';

export interface FlashcardNavigationState {
  step: FlashcardNavigationStep;
  subject?: string;
  topicId?: string;
  /** Ausente estuda o tópico inteiro; um id restringe ao subtópico. */
  subtopicId?: string;
  priority?: FlashcardPriority;
  trainingType?: FlashcardTrainingType;
  allDueForTopic?: boolean;
}

export type FlashcardNavigationAction =
  | { type: 'select_subject'; subject: string }
  | { type: 'select_topic'; topicId: string }
  | { type: 'select_subtopic'; subtopicId?: string }
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
      if (state.step !== 'subject') return state;
      return { step: 'topic', subject: action.subject };

    case 'select_topic':
      if (state.step !== 'topic' || !state.subject) return state;
      return { step: 'subtopic', subject: state.subject, topicId: action.topicId };

    // subtopicId ausente é "o tópico inteiro", que continua sendo um caminho
    // válido: nem todo estudo precisa descer ao capítulo.
    case 'select_subtopic':
      if (state.step !== 'subtopic' || !state.subject || !state.topicId) return state;
      return {
        step: 'priority',
        subject: state.subject,
        topicId: state.topicId,
        subtopicId: action.subtopicId,
      };

    case 'select_priority':
      if (state.step !== 'priority' || !state.subject || !state.topicId) return state;
      return {
        step: 'training_type',
        subject: state.subject,
        topicId: state.topicId,
        subtopicId: state.subtopicId,
        priority: action.priority,
      };

    case 'select_training_type':
      if (state.step !== 'training_type' || !state.subject || !state.topicId || !state.priority) {
        return state;
      }
      return {
        step: 'session',
        subject: state.subject,
        topicId: state.topicId,
        subtopicId: state.subtopicId,
        priority: state.priority,
        trainingType: action.trainingType,
        allDueForTopic: false,
      };

    // Atalho disponível tanto no tópico quanto no subtópico: em 'subtopic' o
    // recorte já escolhido é preservado, para "todos os vencidos deste capítulo".
    case 'review_all_due':
      if ((state.step !== 'topic' && state.step !== 'subtopic') || !state.subject || !state.topicId) {
        return state;
      }
      return {
        step: 'session',
        subject: state.subject,
        topicId: state.topicId,
        subtopicId: state.subtopicId,
        allDueForTopic: true,
      };

    case 'back':
      switch (state.step) {
        case 'session': {
          if (!state.subject || !state.topicId) return initialFlashcardNavigationState;
          // Voltar de "todos os vencidos" cai no nível de onde o atalho saiu:
          // se havia subtópico escolhido, volta para a lista de subtópicos.
          const afterAllDue: FlashcardNavigationState = state.subtopicId
            ? { step: 'subtopic', subject: state.subject, topicId: state.topicId }
            : { step: 'topic', subject: state.subject, topicId: state.topicId };
          if (state.allDueForTopic) return afterAllDue;
          if (!state.priority) return afterAllDue;
          return {
            step: 'training_type',
            subject: state.subject,
            topicId: state.topicId,
            subtopicId: state.subtopicId,
            priority: state.priority,
          };
        }

        case 'training_type':
          if (!state.subject || !state.topicId || !state.priority) return initialFlashcardNavigationState;
          return {
            step: 'priority',
            subject: state.subject,
            topicId: state.topicId,
            subtopicId: state.subtopicId,
            priority: state.priority,
          };

        // Preserva o subtópico, como o retorno de 'training_type' preserva a
        // prioridade: voltar um passo desfaz a escolha daquele passo, não a
        // do anterior — é isso que mantém a seleção destacada na tela.
        case 'priority':
          if (!state.subject || !state.topicId) return initialFlashcardNavigationState;
          return {
            step: 'subtopic',
            subject: state.subject,
            topicId: state.topicId,
            subtopicId: state.subtopicId,
          };

        case 'subtopic':
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
