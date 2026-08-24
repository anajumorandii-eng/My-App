import test from 'node:test';
import assert from 'node:assert/strict';
import {
  appendLearningEvidence,
  buildLearningEvidenceId,
  classifyEvidenceCatalogReference,
  normalizeLearningEvidenceRecord,
} from './learningEvidenceIdentity';
import { LEARNING_EVIDENCE_SCHEMA_VERSION, type LearningEvidence } from '../types/learningEvidence';

function evidence(overrides: Partial<LearningEvidence> = {}): LearningEvidence {
  return {
    id: 'le1_existing', schemaVersion: LEARNING_EVIDENCE_SCHEMA_VERSION,
    source: 'objective-question', activity: 'attempt', sourceRecordId: 'question-1',
    occurredAt: '2026-08-24T14:00:00.000Z', recordedAt: '2026-08-24T14:00:01.000Z',
    disciplineId: 'matematica', topicId: 'probabilidade', conceptIds: ['espaco-amostral'],
    examBoards: ['Fuvest'], examPhase: 'second', outcome: 'incorrect', supportLevel: 'independent',
    confidence: 1, domainEffect: 'eligible', contextLink: '/questoes?question=question-1',
    catalogStatus: 'resolved', snapshot: { topicLabel: 'Probabilidade', prompt: 'Enunciado original' },
    dimensions: [], metadata: { selectedOptionId: 'b' }, ...overrides,
  };
}

test('gera a mesma identidade segura para o reenvio da mesma tentativa', async () => {
  const input = { source: 'summary-retrieval' as const, sourceRecordId: 'resumo/com espaço:q1', attemptId: '2026-08-24T14:00:00.000Z' };
  const first = await buildLearningEvidenceId(input);
  const retry = await buildLearningEvidenceId(input);

  assert.equal(first, retry);
  assert.match(first, /^le1_[a-f0-9]{64}$/);
  assert.ok(!first.includes('/'));
});

test('distingue uma nova tentativa do reenvio e separa origens diferentes', async () => {
  const base = { source: 'objective-question' as const, sourceRecordId: 'q1' };
  const first = await buildLearningEvidenceId({ ...base, attemptId: 'attempt-1' });
  const next = await buildLearningEvidenceId({ ...base, attemptId: 'attempt-2' });
  const otherSource = await buildLearningEvidenceId({ ...base, source: 'discursive-answer', attemptId: 'attempt-1' });

  assert.notEqual(first, next);
  assert.notEqual(first, otherSource);
});

test('insere evento novo e torna o reenvio idêntico idempotente', () => {
  const original = evidence();
  const inserted = appendLearningEvidence([], original);
  const retried = appendLearningEvidence(inserted.evidence, { ...original, metadata: { selectedOptionId: 'b' } });

  assert.equal(inserted.status, 'inserted');
  assert.equal(retried.status, 'duplicate');
  assert.equal(retried.evidence.length, 1);
});

test('reenvio continua idempotente se apenas recordedAt ou a ordem dos metadados mudar', () => {
  const original = evidence({ metadata: { selectedOptionId: 'b', elapsedSeconds: 42 } });
  const retry = evidence({
    recordedAt: '2026-08-24T14:05:00.000Z',
    metadata: { elapsedSeconds: 42, selectedOptionId: 'b' },
  });

  const result = appendLearningEvidence([original], retry);
  assert.equal(result.status, 'duplicate');
  assert.deepEqual(result.evidence, [original]);
});

test('não sobrescreve evidência anterior quando o mesmo id chega com outro conteúdo', () => {
  const original = evidence();
  const result = appendLearningEvidence([original], evidence({ outcome: 'correct' }));

  assert.equal(result.status, 'conflict');
  assert.deepEqual(result.evidence, [original]);
  assert.equal(result.conflictingEvidence, original);
});

test('normaliza somente o schema conhecido e preserva referência removida', () => {
  const removed = evidence({ catalogStatus: 'removed', topicId: null, conceptIds: [], contextLink: null });
  assert.deepEqual(normalizeLearningEvidenceRecord(removed), removed);
  assert.equal(normalizeLearningEvidenceRecord({ id: 'legacy-question-attempt', questionId: 'q1', correct: true }), null);
  assert.equal(normalizeLearningEvidenceRecord({ ...removed, confidence: 4 }), null);
});

test('classifica vínculos resolvidos, não mapeados e explicitamente removidos sem adivinhar', () => {
  const catalog = {
    topicIds: new Set(['probabilidade']), conceptIds: new Set(['espaco-amostral']),
    removedTopicIds: new Set(['topico-antigo']), removedConceptIds: new Set<string>(),
  };

  assert.equal(classifyEvidenceCatalogReference(evidence(), catalog), 'resolved');
  assert.equal(classifyEvidenceCatalogReference(evidence({ conceptIds: ['conceito-desconhecido'] }), catalog), 'unmapped');
  assert.equal(classifyEvidenceCatalogReference(evidence({ topicId: 'topico-antigo', conceptIds: [] }), catalog), 'removed');
});
