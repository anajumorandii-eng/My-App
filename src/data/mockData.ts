import { Topic, TopicMastery, UserProfile, ErrorLog } from '../types';

export const mockTopics: Topic[] = [
  { id: 'bio_01', name: 'Citologia', subject: 'Biologia', prerequisites: [] },
  { id: 'bio_02', name: 'Genética', subject: 'Biologia', prerequisites: ['bio_01'] },
  { id: 'mat_01', name: 'Funções de 1º Grau', subject: 'Matemática', prerequisites: [] },
  { id: 'mat_02', name: 'Análise Combinatória', subject: 'Matemática', prerequisites: [] },
  { id: 'fis_01', name: 'Cinemática', subject: 'Física', prerequisites: ['mat_01'] },
  { id: 'fis_02', name: 'Eletrodinâmica', subject: 'Física', prerequisites: [] }
];

export const mockMastery: TopicMastery[] = [
  { topicId: 'bio_01', level: 85, uncertainty: 0.1, lastReviewed: new Date(Date.now() - 5 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'bio_02', level: 30, uncertainty: 0.8, lastReviewed: new Date(Date.now() - 1 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'mat_01', level: 95, uncertainty: 0.05, lastReviewed: new Date(Date.now() - 15 * 86400000).toISOString(), errorSignals: 0 },
  { topicId: 'mat_02', level: 60, uncertainty: 0.4, lastReviewed: new Date(Date.now() - 3 * 86400000).toISOString(), errorSignals: 4 },
  { topicId: 'fis_01', level: 75, uncertainty: 0.2, lastReviewed: new Date(Date.now() - 2 * 86400000).toISOString(), errorSignals: 1 },
  { topicId: 'fis_02', level: 10, uncertainty: 0.9, lastReviewed: new Date(Date.now() - 10 * 86400000).toISOString(), errorSignals: 2 }
];

export const mockProfile: UserProfile = {
  targetCourse: 'Medicina',
  targetUniversities: ['USP', 'UNICAMP', 'UNESP'],
  targetExams: ['ENEM', 'FUVEST'],
  availableHoursPerWeek: 40,
  currentEnergyLevel: 'medium',
  autonomyIndex: 35 // starts low, increases over time
};

export const mockErrorLogs: ErrorLog[] = [
  {
    id: 'err_1',
    topicId: 'mat_02',
    questionId: 'q_mat_02_1',
    date: new Date().toISOString(),
    type: 'interpretation',
    notes: 'Confundi "pelo menos um" com "exatamente um".',
    aiHypothesis: 'A hipótese provável é falha na decodificação do jargão lógico de combinatória. Recomendo mapear as palavras-chave (e/ou, no mínimo/no máximo).'
  }
];
