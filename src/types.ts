export interface Topic {
  id: string;
  name: string;
  subject: string;
  prerequisites: string[]; // IDs of other topics
}

export interface TopicMastery {
  topicId: string;
  level: number; // 0 to 100
  uncertainty: number; // 0 to 1 (0 = highly certain of level, 1 = low confidence in the level metric)
  lastReviewed: string; // ISO Date
  errorSignals: number; // recent consecutive errors
}

export interface UserProfile {
  targetCourse: string;
  targetUniversities: string[];
  targetExams: string[];
  availableHoursPerWeek: number;
  currentEnergyLevel: 'low' | 'medium' | 'high';
  autonomyIndex: number; // 0 to 100
}

export interface ErrorLog {
  id: string;
  topicId: string;
  questionId: string;
  date: string;
  type: 'conceptual' | 'interpretation' | 'calculation' | 'strategy' | 'attention' | 'time' | 'prerequisite';
  notes: string;
  aiHypothesis?: string;
}

export interface StudyAction {
  id: string;
  type: 'review' | 'practice' | 'theory' | 'error_analysis';
  topicId: string;
  topicName: string;
  subject: string;
  estimatedMinutes: number;
  priorityScore: number; // Assigned by Efficiency Engine
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  iconLink?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  topicId: string;
  subject: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PodcastEpisode {
  id: string;
  topicId: string;
  title: string;
  subject: string;
  durationMinutes: number;
  script: string;
}

export interface StudyMethod {
  id: string;
  name: string;
  category: 'aquisicao' | 'retencao' | 'aplicacao' | 'foco';
  summary: string;
  steps: string[];
  bestFor: string[];
}
