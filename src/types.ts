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
  transparency?: 'opaque' | 'transparent';
  status?: 'confirmed' | 'tentative' | 'cancelled';
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
  examSource?: {
    board: string; // e.g. 'ENEM', 'FUVEST', 'COMVEST', 'VUNESP', 'FAMERP'
    year: number;
    sourceUrl: string;
  };
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

export interface DiscursiveSubItem {
  letter: string;
  prompt: string;
}

export interface DiscursiveQuestion {
  id: string;
  board: string;
  year: number;
  subject: string;
  topic: string;
  prompt: string;
  subItems?: DiscursiveSubItem[];
  modelAnswer: string[];
  suggestedMinutes: number;
  sourceUrl?: string;
  uncertain?: boolean;
  note?: string;
}

export interface DiscursiveAttempt {
  id: string;
  questionId: string;
  selfRating: 'fraco' | 'mediano' | 'forte';
  date: string;
}

export interface BacklogItem {
  id: string;
  topicId: string;
  state: number; // 0-4: 0 desconhecido, 1 reconhecimento, 2 aplicação guiada, 3 aplicação independente, 4 transferência
  dependencia: number; // 0-3: este tópico destrava outros?
  incidencia: number; // 0-3: aparece muito nas bancas-alvo?
  lacuna: number; // 0-3: o diagnóstico mostra falha real?
  urgencia: number; // 0-3: há prova/simulado/aula dependente próxima?
  custo: number; // 1-3: quantas sessões são necessárias para ganho útil?
  independentSuccesses: number; // sucessos sem apoio, consecutivos em ocasiões separadas
  canExplainTypicalError: boolean;
  objective?: string; // frase observável de objetivo mínimo de domínio
  supportLevel?: number; // 1-5: nível atual na escada de retirada de apoio
  dateAdded: string;
  closedAt?: string;
}
