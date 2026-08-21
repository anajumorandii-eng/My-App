export interface Topic {
  id: string;
  name: string;
  subject: string;
  prerequisites: string[]; // IDs of other topics
  chapters?: string[]; // Real chapter titles from the student's apostila, in study order
}

export interface TopicMastery {
  topicId: string;
  level: number; // 0 to 100
  uncertainty: number; // 0 to 1 (0 = highly certain of level, 1 = low confidence in the level metric)
  lastReviewed: string; // ISO Date
  errorSignals: number; // recent consecutive errors
  // Estado do algoritmo de repetição espaçada (estilo SM-2 — Wozniak, 1990),
  // usado por src/lib/spacedRepetition.ts para agendar a próxima revisão.
  // Opcionais e com fallback sensato em spacedRepetition.ts para não quebrar
  // dados existentes (mock ou já persistidos) que ainda não os têm.
  easeFactor?: number; // fator de facilidade — cresce quando a lembrança é fácil, cai quando é difícil
  intervalDays?: number; // intervalo atual, em dias, até a próxima revisão programada
  reviewCount?: number; // repetições espaçadas consecutivas bem-sucedidas (zera ao esquecer)
}

export interface UserProfile {
  targetCourse: string;
  targetUniversities: string[];
  targetExams: string[];
  availableHoursPerWeek: number;
  currentEnergyLevel: 'low' | 'medium' | 'high';
  autonomyIndex: number; // 0 to 100
  // Optional: absent for profiles saved before this preference existed — treat as "sem preferência".
  podcastDurationPreference?: 'curto' | 'medio' | 'longo' | null;
  // Optional: which Gemini TTS voice narrates podcast episodes. Absent/null falls back to the default voice.
  podcastVoiceName?: string | null;
}

// A menor ação capaz de testar ou corrigir a lacuna diagnosticada — em
// ordem crescente de custo, do mais barato ("pergunta de recuperação
// ativa") ao mais caro ("aula completa", só quando há evidência real de
// que nada menor resolve).
export type InterventionType =
  | 'recuperacao_ativa'
  | 'questao_guiada'
  | 'comparacao_conceitos'
  | 'microbloco_prerequisito'
  | 'questao_aplicacao'
  | 'revisao_curta'
  | 'aula_completa';

export interface Intervention {
  type: InterventionType;
  description: string;
}

export interface ErrorLog {
  id: string;
  topicId: string;
  questionId: string;
  date: string;
  type:
    | 'conceptual'
    | 'concept_confusion'
    | 'interpretation'
    | 'data_selection'
    | 'strategy'
    | 'calculation'
    | 'prerequisite'
    | 'insufficient_justification'
    | 'time'
    | 'attention';
  notes: string;
  aiHypothesis?: string;
  // Ponto específico onde o raciocínio quebrou — não "errou o tópico" (ex:
  // "não reconheceu que era necessário relacionar seno/cosseno à
  // decomposição vetorial"). Junto com evidence/confidence, separa fato
  // observado de hipótese, como as regras pedagógicas exigem.
  breakPoint?: string;
  evidence?: string;
  // 'confirmado' só depois que a estudante valida a hipótese da IA —
  // antes disso é sempre 'baixa' ou 'media', nunca tratado como fato.
  confidence?: 'baixa' | 'media' | 'alta' | 'confirmado';
  proposedIntervention?: Intervention;
  interventionStatus?: 'pendente' | 'concluida' | 'recusada';
  outcomeRating?: 'melhorou' | 'sem_mudanca' | 'ainda_dificil';
}

// Por que uma ação foi recomendada — mostrado em "Por que isso?" no plano diário.
export type RecommendationReason =
  | 'dominio_insuficiente'
  | 'erro_recorrente'
  | 'revisao_urgente'
  | 'prerequisito_bloqueado'
  | 'incidencia_banca_prioritaria'
  | 'proximidade_prova'
  | 'tempo_disponivel'
  | 'fase_revisao_intensificada';

export interface StudyAction {
  id: string;
  type: 'review' | 'practice' | 'theory' | 'error_analysis';
  topicId: string;
  topicName: string;
  subject: string;
  estimatedMinutes: number;
  priorityScore: number; // Assigned by Efficiency Engine
  reasons: RecommendationReason[];
}

// Peso e foco de fase que a estudante atribui a uma banca já marcada como
// ativa em UserProfile.targetExams — controla o quanto a proximidade e a
// incidência daquela banca influenciam o plano, sem deixar a prova mais
// próxima sequestrar o plano se ela não for prioritária.
export interface BoardWeight {
  board: string; // mesmo valor usado em UserProfile.targetExams / VestibularExam.board
  weight: number; // 0 a 1
  phaseFocus: '1a-fase' | '2a-fase' | 'ambas';
}

export interface StudentGoals {
  primaryGoal: string;
  secondaryGoals: string[];
  boardWeights: BoardWeight[];
}

// Motivo estruturado de discordância de uma recomendação — registrado, mas
// não altera o plano silenciosamente (a estudante decide, não a IA).
export type DisagreeReason =
  | 'ja_estudei'
  | 'sem_material'
  | 'nao_consigo_agora'
  | 'prioridade_errada'
  | 'quero_outra_atividade';

export interface PlanFeedback {
  id: string;
  actionId: string;
  topicId: string;
  reason: DisagreeReason;
  date: string;
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
  // Real chapter title from the topic's apostila (must match one entry in
  // Topic.chapters for that topicId) — lets the Diagnóstico quiz filter to a
  // single chapter instead of always drawing from the whole topic. Absent
  // for older questions not yet reclassified; those fall back to the
  // full-topic pool.
  chapter?: string;
  examSource?: {
    board: string; // e.g. 'ENEM', 'FUVEST', 'COMVEST', 'VUNESP', 'FAMERP'
    year: number;
    sourceUrl: string;
  };
}

// A short, original open-ended prompt scoped to one topic in the curriculum
// catalog (topicId), used inside the Diagnóstico quiz alongside multiple-
// choice Questions. Unlike DiscursiveQuestion (real sourced 2ª-fase exam
// questions, used in Treino de 2ª Fase), these aren't tied to a specific
// exam/board/year — just a way to test whether the student can actually
// explain the concept, not just recognize the right option. There's no
// auto-grading for free text, so the student self-rates against the model
// answer (same fraco/mediano/forte scale as DiscursiveAttempt).
export interface TopicDiscursivePrompt {
  id: string;
  topicId: string;
  subject: string;
  prompt: string;
  modelAnswer: string;
  keyPoints: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  // Same chapter-filtering purpose as Question.chapter — see that comment.
  chapter?: string;
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
  subtopic?: string; // Real chapter from the topic's apostila, when the student narrowed it down
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
