import {
  LEARNING_EVIDENCE_SCHEMA_VERSION,
  validateLearningEvidence,
  type EvidenceActivity,
  type EvidenceCatalogStatus,
  type EvidenceDomainEffect,
  type EvidenceOutcome,
  type EvidenceSource,
  type EvidenceSupportLevel,
  type LearningEvidence,
  type LearningEvidenceIssue,
} from '../types/learningEvidence';

export interface LearningEvidenceIdentityInput {
  source: EvidenceSource;
  sourceRecordId: string;
  attemptId: string;
}

export interface EvidenceCatalogIndex {
  topicIds: ReadonlySet<string>;
  conceptIds: ReadonlySet<string>;
  removedTopicIds: ReadonlySet<string>;
  removedConceptIds: ReadonlySet<string>;
}

export type AppendLearningEvidenceResult =
  | { status: 'inserted' | 'duplicate'; evidence: LearningEvidence[] }
  | { status: 'conflict'; evidence: LearningEvidence[]; conflictingEvidence: LearningEvidence }
  | { status: 'rejected'; evidence: LearningEvidence[]; issues: LearningEvidenceIssue[] };

const sources: EvidenceSource[] = ['objective-question', 'discursive-answer', 'summary-retrieval', 'flashcard', 'recovery-exercise', 'literary-work', 'essay', 'verified-session'];
const activities: EvidenceActivity[] = ['attempt', 'retrieval', 'review', 'recovery', 'reading-progress', 'assessment', 'session'];
const outcomes: EvidenceOutcome[] = ['correct', 'partial', 'incorrect', 'unassessed'];
const supportLevels: EvidenceSupportLevel[] = ['independent', 'hint', 'guided', 'solution-exposed', 'unknown'];
const domainEffects: EvidenceDomainEffect[] = ['eligible', 'execution-only', 'none'];
const catalogStatuses: EvidenceCatalogStatus[] = ['resolved', 'unmapped', 'removed'];

export async function buildLearningEvidenceId(input: LearningEvidenceIdentityInput): Promise<string> {
  if (!input.sourceRecordId.trim() || !input.attemptId.trim()) throw new Error('Learning evidence identity requires sourceRecordId and attemptId');
  const canonical = JSON.stringify([LEARNING_EVIDENCE_SCHEMA_VERSION, input.source, input.sourceRecordId, input.attemptId]);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical));
  return `le1_${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')}`;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonicalize(item)]));
  }
  return value;
}

function immutableEventPayload(evidence: LearningEvidence): Omit<LearningEvidence, 'recordedAt'> {
  const { recordedAt: _ingestionTimestamp, ...immutable } = evidence;
  return immutable;
}

const sameEvidence = (left: LearningEvidence, right: LearningEvidence) => JSON.stringify(canonicalize(immutableEventPayload(left))) === JSON.stringify(canonicalize(immutableEventPayload(right)));

export function appendLearningEvidence(current: LearningEvidence[], candidate: LearningEvidence): AppendLearningEvidenceResult {
  const issues = validateLearningEvidence(candidate);
  if (issues.length) return { status: 'rejected', evidence: current, issues };
  const existing = current.find((item) => item.id === candidate.id);
  if (!existing) return { status: 'inserted', evidence: [...current, candidate] };
  if (sameEvidence(existing, candidate)) return { status: 'duplicate', evidence: current };
  return { status: 'conflict', evidence: current, conflictingEvidence: existing };
}

const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every((item) => typeof item === 'string');
const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);

export function normalizeLearningEvidenceRecord(value: unknown): LearningEvidence | null {
  if (!isRecord(value)
    || value.schemaVersion !== LEARNING_EVIDENCE_SCHEMA_VERSION
    || typeof value.id !== 'string'
    || !sources.includes(value.source as EvidenceSource)
    || !activities.includes(value.activity as EvidenceActivity)
    || typeof value.sourceRecordId !== 'string'
    || typeof value.occurredAt !== 'string'
    || typeof value.recordedAt !== 'string'
    || !(typeof value.disciplineId === 'string' || value.disciplineId === null)
    || !(typeof value.topicId === 'string' || value.topicId === null)
    || !isStringArray(value.conceptIds)
    || !isStringArray(value.examBoards)
    || !outcomes.includes(value.outcome as EvidenceOutcome)
    || !supportLevels.includes(value.supportLevel as EvidenceSupportLevel)
    || !(typeof value.confidence === 'number' || value.confidence === null)
    || !domainEffects.includes(value.domainEffect as EvidenceDomainEffect)
    || !(typeof value.contextLink === 'string' || value.contextLink === null)
    || !catalogStatuses.includes(value.catalogStatus as EvidenceCatalogStatus)
    || !isRecord(value.snapshot)
    || !Array.isArray(value.dimensions)
    || !isRecord(value.metadata)) return null;
  const evidence = value as unknown as LearningEvidence;
  return validateLearningEvidence(evidence).length ? null : evidence;
}

export function classifyEvidenceCatalogReference(evidence: LearningEvidence, catalog: EvidenceCatalogIndex): EvidenceCatalogStatus {
  if ((evidence.topicId && catalog.removedTopicIds.has(evidence.topicId)) || evidence.conceptIds.some((id) => catalog.removedConceptIds.has(id))) return 'removed';
  if ((evidence.topicId && !catalog.topicIds.has(evidence.topicId)) || evidence.conceptIds.some((id) => !catalog.conceptIds.has(id))) return 'unmapped';
  return 'resolved';
}
