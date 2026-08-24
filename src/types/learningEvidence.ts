export const LEARNING_EVIDENCE_SCHEMA_VERSION = 1 as const;

export type EvidenceSource =
  | 'objective-question'
  | 'discursive-answer'
  | 'summary-retrieval'
  | 'flashcard'
  | 'recovery-exercise'
  | 'literary-work'
  | 'essay'
  | 'verified-session';

export type EvidenceActivity = 'attempt' | 'retrieval' | 'review' | 'recovery' | 'reading-progress' | 'assessment' | 'session';
export type EvidenceOutcome = 'correct' | 'partial' | 'incorrect' | 'unassessed';
export type EvidenceSupportLevel = 'independent' | 'hint' | 'guided' | 'solution-exposed' | 'unknown';
export type EvidenceDomainEffect = 'eligible' | 'execution-only' | 'none';
export type EvidenceCatalogStatus = 'resolved' | 'unmapped' | 'removed';
export type EvidenceExamPhase = 'first' | 'second' | 'general';
export type EvidenceErrorType = 'conceptual' | 'procedural' | 'reading' | 'expression' | 'attention' | 'time';

export interface EvidenceDimension {
  id: string;
  outcome: EvidenceOutcome;
  score?: number;
  maxScore?: number;
  feedback?: string;
}

export interface EvidenceSnapshot {
  disciplineLabel?: string;
  topicLabel?: string;
  conceptLabels?: string[];
  sourceTitle?: string;
  prompt?: string;
}

export interface LearningEvidence {
  id: string;
  schemaVersion: typeof LEARNING_EVIDENCE_SCHEMA_VERSION;
  source: EvidenceSource;
  activity: EvidenceActivity;
  sourceRecordId: string;
  occurredAt: string;
  recordedAt: string;
  disciplineId: string | null;
  topicId: string | null;
  conceptIds: string[];
  examBoards: string[];
  examPhase?: EvidenceExamPhase;
  outcome: EvidenceOutcome;
  supportLevel: EvidenceSupportLevel;
  confidence: number | null;
  domainEffect: EvidenceDomainEffect;
  contextLink: string | null;
  catalogStatus: EvidenceCatalogStatus;
  snapshot: EvidenceSnapshot;
  error?: { type: EvidenceErrorType; code?: string; firstBreak?: string };
  dimensions: EvidenceDimension[];
  metadata: Record<string, unknown>;
}

export type LearningEvidenceIssueCode =
  | 'invalid-occurred-at'
  | 'invalid-recorded-at'
  | 'invalid-confidence'
  | 'duplicate-concept-id'
  | 'invalid-context-link'
  | 'invalid-domain-effect'
  | 'invalid-source-activity'
  | 'missing-history-snapshot';

export interface LearningEvidenceIssue {
  code: LearningEvidenceIssueCode;
  field: keyof LearningEvidence;
}

const isIsoDate = (value: string) => Number.isFinite(Date.parse(value)) && value.includes('T');
const activityBySource: Record<EvidenceSource, readonly EvidenceActivity[]> = {
  'objective-question': ['attempt'],
  'discursive-answer': ['attempt'],
  'summary-retrieval': ['retrieval'],
  flashcard: ['review'],
  'recovery-exercise': ['recovery'],
  'literary-work': ['reading-progress', 'assessment'],
  essay: ['assessment'],
  'verified-session': ['session'],
};

export function validateLearningEvidence(evidence: LearningEvidence): LearningEvidenceIssue[] {
  const issues: LearningEvidenceIssue[] = [];
  if (!isIsoDate(evidence.occurredAt)) issues.push({ code: 'invalid-occurred-at', field: 'occurredAt' });
  if (!isIsoDate(evidence.recordedAt)) issues.push({ code: 'invalid-recorded-at', field: 'recordedAt' });
  if (evidence.confidence !== null && (evidence.confidence < 0 || evidence.confidence > 1 || !Number.isFinite(evidence.confidence))) {
    issues.push({ code: 'invalid-confidence', field: 'confidence' });
  }
  if (new Set(evidence.conceptIds).size !== evidence.conceptIds.length) issues.push({ code: 'duplicate-concept-id', field: 'conceptIds' });
  if (evidence.contextLink !== null && !evidence.contextLink.startsWith('/')) issues.push({ code: 'invalid-context-link', field: 'contextLink' });
  if (!activityBySource[evidence.source].includes(evidence.activity)) issues.push({ code: 'invalid-source-activity', field: 'activity' });
  const executionOnly = evidence.source === 'verified-session'
    || (evidence.source === 'literary-work' && evidence.activity === 'reading-progress');
  const cannotDemonstrateDomain = executionOnly || evidence.outcome === 'unassessed' || evidence.supportLevel === 'solution-exposed';
  if ((executionOnly && evidence.domainEffect !== 'execution-only') || (cannotDemonstrateDomain && evidence.domainEffect === 'eligible')) {
    issues.push({ code: 'invalid-domain-effect', field: 'domainEffect' });
  }
  if (evidence.catalogStatus !== 'resolved' && Object.values(evidence.snapshot).every((value) => !value || value.length === 0)) {
    issues.push({ code: 'missing-history-snapshot', field: 'snapshot' });
  }
  return issues;
}
