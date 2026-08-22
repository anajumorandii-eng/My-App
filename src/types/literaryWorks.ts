// Domínio de "Obras Obrigatórias" (FUVEST/Unicamp) — deliberadamente separado
// de types.ts: exige edição, unidade, paginação, direitos autorais e camada
// de evidência mais rigorosos do que o resto do currículo (ver
// server/literary/literaryReferenceStore.ts, que também não reaproveita o
// apostilaReferenceStore por causa dessa diferença).

export type ExamBoard = 'FUVEST' | 'UNICAMP';

// Cada afirmação analítica declara de onde vem — nunca citação, paginação,
// tese ou consenso sem uma dessas três camadas rastreáveis.
export type EvidenceLayer = 'textual_evidence' | 'documented_criticism' | 'grounded_synthesis';

// Conteúdo gerado por IA nasce 'draft' e só vira 'published' após validação
// editorial explícita — nunca fica visível pra aluna enquanto não passar por
// essa revisão.
export type EditorialStatus = 'draft' | 'needs_review' | 'published' | 'rejected';

export type AuditStatus = 'pending' | 'needs_review' | 'verified' | 'rejected';

export type WorkUnitType = 'chapter' | 'story' | 'poem' | 'song' | 'article' | 'fragment' | 'part';

export interface LiteraryWork {
  id: string;
  slug: string;
  title: string;
  author: string;
  originalYear?: number;
  genre: string;
  language: string;
}

// Edição específica usada como fonte — o PDF em si nunca fica em público/
// nem no bundle do front-end; sourceFileId aponta pro bucket privado (ver
// literaryStorage.ts).
export interface WorkEdition {
  id: string;
  workId: string;
  publisher?: string;
  edition?: string;
  year?: number;
  isbn?: string;
  translator?: string;
  organizer?: string;
  printedPageCount?: number;
  pdfPageCount: number;
  sourceFileId: string;
  fileHash: string; // SHA-256, também usado pra detectar duplicata no upload
  rightsStatus: 'authorized' | 'pending_review' | 'restricted';
  integrityStatus: AuditStatus;
  extractionStatus: AuditStatus;
}

// Uma obra é uma única entidade bibliográfica; ExamRequirement é o registro
// de exigência de uma banca num ciclo específico — o mesmo livro pode ter
// vários, um por ciclo, sem nunca sobrescrever o histórico.
export interface ExamRequirement {
  id: string;
  workId: string;
  board: ExamBoard;
  examCycle: string; // ex.: '2027'
  officialListUrl: string;
  officiallyVerifiedAt: string; // ISO Date
  requiredScope: string; // ex.: "obra completa" ou "6 contos: Diálogo, Além do Ponto, ..."
  active: boolean;
}

// Capítulo, conto, poema, canção, artigo ou fragmento — a unidade real de
// leitura, nunca um corte arbitrário por tamanho.
export interface WorkUnit {
  id: string;
  workId: string;
  parentUnitId?: string;
  type: WorkUnitType;
  order: number;
  title: string;
  pdfStartPage: number;
  pdfEndPage: number;
  printedStartPage?: number;
  printedEndPage?: number;
  requiredByExam: boolean;
  extractionConfidence: 'high' | 'medium' | 'low';
}

export interface EvidenceCard {
  id: string;
  workId: string;
  unitId: string;
  location: string; // referência de localização (página, verso, linha) na edição de origem
  context: string;
  formalDevice: string;
  effect: string;
  wholeRelation: string; // relação parte-todo — como essa passagem se conecta ao conjunto da obra
  examPotential: ExamBoard[];
  evidenceLayer: EvidenceLayer;
  sourceId?: string; // aponta pra CriticalSource quando evidenceLayer === 'documented_criticism'
  editorialStatus: EditorialStatus;
}

export interface CriticalSource {
  id: string;
  citation: string;
  type: 'academic_article' | 'book' | 'thesis' | 'official_material';
  institution?: string;
  year?: number;
  url?: string;
  accessedAt: string; // ISO Date
  pagesRead: string; // faixa de páginas efetivamente lidas, não o texto inteiro
  centralThesis: string;
  contribution: string;
  limitations: string;
}

export type ContentModuleType =
  | 'comece_aqui'
  | 'leitura_guiada'
  | 'analise_integral'
  | 'passagens_chave'
  | 'critica_debate'
  | 'fuvest'
  | 'unicamp'
  | 'questoes'
  | 'revisao_ativa'
  | 'meu_desempenho'
  | 'fontes';

export interface ContentModule {
  id: string;
  workId: string;
  unitId?: string;
  moduleType: ContentModuleType;
  board?: ExamBoard; // só quando moduleType é 'fuvest' ou 'unicamp'
  phase?: '1a_fase' | '2a_fase';
  markdown: string;
  evidenceRefs: string[]; // EvidenceCard.id[]
  sourceRefs: string[]; // CriticalSource.id[]
  version: number;
  editorialStatus: EditorialStatus;
  reviewedBy?: string;
  reviewedAt?: string; // ISO Date
}

export type LiteraryQuestionType = 'fuvest_objetiva' | 'fuvest_discursiva' | 'unicamp_objetiva' | 'unicamp_discursiva' | 'comparacao';

export type LiteraryQuestionDifficulty = 'media' | 'dificil' | 'muito_dificil';

// Tipos de distrator diagnosticáveis (seção 5.3 do roteiro) — cada
// alternativa errada de uma questão objetiva declara qual confusão ela testa.
export type DistractorType = 'resumo' | 'contexto_solto' | 'recurso_efeito_incorreto' | 'generalizacao' | 'confusao_de_voz';

export interface LiteraryQuestion {
  id: string;
  workIds: string[]; // mais de um em questões de comparação
  unitIds: string[];
  board: ExamBoard;
  phase: '1a_fase' | '2a_fase';
  type: LiteraryQuestionType;
  difficulty: LiteraryQuestionDifficulty;
  prompt: string;
  subItems?: string[]; // itens a, b, c de uma discursiva
  optionDistractorTypes?: DistractorType[]; // só em objetiva — um por alternativa errada
  answerKey: string; // só liberado ao front-end depois da tentativa (ver LiteraryAttempt)
  expectedUnits: string[]; // unidades de conteúdo esperadas na resposta discursiva
  sourceRefs: string[];
  editorialStatus: EditorialStatus;
}

// Códigos diagnósticos literários (seção 5.3): o ponto exato de ruptura,
// não "errou tudo" — mesmo espírito do errorLog do resto do app, mas com
// vocabulário próprio de análise literária.
export type LiteraryErrorCode = 'L1' | 'E1' | 'F1' | 'M1' | 'A1' | 'C1' | 'G1' | 'H1';

export interface LiteraryAttempt {
  id: string;
  userId: string;
  questionId: string;
  answer: string;
  submittedAt: string; // ISO Date
  commandCoverage?: string; // quais unidades do comando decomposto a resposta cobriu
  errorCodes: LiteraryErrorCode[];
  feedback?: string;
  selfRating?: 'fraco' | 'mediano' | 'forte';
}

export type LiteraryMasteryDimension = 'factual' | 'formal' | 'interpretive' | 'comparative' | 'fuvest_1' | 'fuvest_2' | 'unicamp_1' | 'unicamp_2';

// Repetição espaçada por dimensão e por obra (e opcionalmente por unidade) —
// mesmo núcleo SM-2 de src/lib/spacedRepetition.ts (computeSchedule),
// adaptado a essa granularidade multidimensional.
export interface LiteraryMastery {
  userId: string;
  workId: string;
  unitId?: string;
  dimension: LiteraryMasteryDimension;
  level: number; // 0 a 100
  uncertainty: number; // 0 a 1
  errorSignals: number;
  lastReviewed: string; // ISO Date
  easeFactor: number;
  intervalDays: number;
  reviewCount: number;
}

export interface ReadingProgress {
  userId: string;
  workId: string;
  unitId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completedAt?: string; // ISO Date
  notes?: string;
}
