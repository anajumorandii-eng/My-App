export type SummaryDepth = 'rapida' | 'aprofundamento' | 'prova';
export type StudyStatus = 'nao-iniciado' | 'em-revisao' | 'dificuldade' | 'dominado';
export type ExamPhase = 'primeira' | 'segunda' | 'unica';
export type SummaryPriority = 'muito-alta' | 'alta' | 'media' | 'baixa';
export type PedagogicalStage = 'intuicao' | 'conceito' | 'aplicacao' | 'exercicio' | 'estrategia';
export type EvidenceKind = 'fato' | 'contexto' | 'interpretacao' | 'hipotese';

export interface SummarySection { id: string; title: string; stage: PedagogicalStage; depth: SummaryDepth; content: string; evidenceKind?: EvidenceKind; callout?: string; }
export interface SummaryBoard { board: string; phases: ExamPhase[]; guidance?: string; }
export interface SummarySource {
  label: string;
  kind: 'material-interno' | 'fonte-oficial' | 'fonte-independente';
  materialId?: string;
  url?: string;
  verifiedAt?: string;
  chapter?: string;
  startPage?: number;
  endPage?: number;
}
export interface RetrievalElement { label: string; keywords: string[]; }
export interface RetrievalPrompt { id: string; sectionId?: string; prompt: string; expectedElements: RetrievalElement[]; hint: string; transferPrompt: string; board?: string; phase?: ExamPhase; }
export interface InteractiveSummary {
  id: string; title: string; subject: string; topic: string; priority: SummaryPriority; boards: SummaryBoard[];
  prerequisites: string[]; overview: string; sections: SummarySection[]; retrieval: RetrievalPrompt[]; sources: SummarySource[];
  currentAffairs?: { axis: 'geopolitica-relacoes-internacionais' | 'economia-trabalho-desigualdades' | 'saude-publica' | 'ciencia-tecnologia' | 'clima-energia-meio-ambiente' | 'sociedade-direitos-cultura'; verifiedAt: string };
}
export type SummaryAnswerOutcome = 'nao-respondida' | 'incorreta' | 'parcial' | 'correta';
export interface RetrievalAttempt {
  questionId: string; answer: string; matchedElements: string[]; firstMissingElement: string | null; date: string;
  outcome?: SummaryAnswerOutcome; summaryTitle?: string; questionPrompt?: string; sectionId?: string;
  subject?: string; topic?: string; boards?: string[]; materialIds?: string[]; board?: string; phase?: ExamPhase;
}
export interface SummaryReviewSchedule { questionId: string; nextReviewAt: string; intervalDays: number; lastOutcome: SummaryAnswerOutcome; }
export interface SummaryProgress { readSectionIds: string[]; status: StudyStatus; important: boolean; answers: RetrievalAttempt[]; reviews?: Record<string, SummaryReviewSchedule>; lastOpenedAt?: string; }
export type SummaryProgressMap = Record<string, SummaryProgress>;
