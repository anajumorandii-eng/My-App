import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEARNING_EVIDENCE_SCHEMA_VERSION,
  validateLearningEvidence,
  type LearningEvidence,
} from '../types/learningEvidence';

const baseEvidence: Omit<LearningEvidence, 'source' | 'activity' | 'sourceRecordId'> = {
  id: 'evidence:objective:q-1:attempt-1',
  schemaVersion: LEARNING_EVIDENCE_SCHEMA_VERSION,
  occurredAt: '2026-08-24T14:00:00.000Z',
  recordedAt: '2026-08-24T14:00:01.000Z',
  disciplineId: 'matematica',
  topicId: 'probabilidade',
  conceptIds: ['espaco-amostral'],
  examBoards: ['Fuvest'],
  examPhase: 'second',
  outcome: 'incorrect',
  supportLevel: 'independent',
  confidence: 1,
  domainEffect: 'eligible',
  contextLink: '/questoes?question=q-1',
  catalogStatus: 'resolved',
  snapshot: { disciplineLabel: 'Matemática', topicLabel: 'Probabilidade', prompt: 'Questão preservada' },
  error: { type: 'conceptual', code: 'espaco-amostral-incompleto', firstBreak: 'Não definiu o universo.' },
  dimensions: [],
  metadata: {},
};

test('representa todas as origens atuais sem perder resultado, apoio ou contexto', () => {
  const fixtures: LearningEvidence[] = [
    { ...baseEvidence, source: 'objective-question', activity: 'attempt', sourceRecordId: 'q-1' },
    { ...baseEvidence, id: 'e-2', source: 'discursive-answer', activity: 'attempt', sourceRecordId: 'disc-1', outcome: 'partial', dimensions: [{ id: 'command', outcome: 'correct' }, { id: 'concept', outcome: 'partial' }] },
    { ...baseEvidence, id: 'e-3', source: 'summary-retrieval', activity: 'retrieval', sourceRecordId: 'summary-1:q-1', supportLevel: 'hint' },
    { ...baseEvidence, id: 'e-4', source: 'flashcard', activity: 'review', sourceRecordId: 'card-1', outcome: 'correct' },
    { ...baseEvidence, id: 'e-5', source: 'recovery-exercise', activity: 'recovery', sourceRecordId: 'backlog-1', outcome: 'correct' },
    { ...baseEvidence, id: 'e-6', source: 'literary-work', activity: 'reading-progress', sourceRecordId: 'work-1:chapter-1', outcome: 'unassessed', domainEffect: 'execution-only', disciplineId: 'literatura', contextLink: '/obras/work-1' },
    { ...baseEvidence, id: 'e-7', source: 'essay', activity: 'assessment', sourceRecordId: 'essay-1', outcome: 'partial', dimensions: [{ id: 'argumentation', outcome: 'partial', score: 120, maxScore: 200 }] },
    { ...baseEvidence, id: 'e-8', source: 'verified-session', activity: 'session', sourceRecordId: 'session-1', outcome: 'unassessed', domainEffect: 'execution-only', conceptIds: [] },
  ];

  for (const evidence of fixtures) assert.deepEqual(validateLearningEvidence(evidence), []);
});

test('preserva histórico de conteúdo removido por snapshot e link anulável', () => {
  const removed: LearningEvidence = {
    ...baseEvidence,
    source: 'objective-question', activity: 'attempt', sourceRecordId: 'removed-question',
    catalogStatus: 'removed', contextLink: null,
  };

  assert.deepEqual(validateLearningEvidence(removed), []);
});

test('rejeita contrato inconsistente sem normalizar ou apagar o evento original', () => {
  const invalid: LearningEvidence = {
    ...baseEvidence,
    source: 'verified-session', activity: 'session', sourceRecordId: 'session-1',
    confidence: 1.2, domainEffect: 'eligible', conceptIds: ['duplicado', 'duplicado'],
    occurredAt: 'ontem', contextLink: 'questoes/sem-barra',
  };

  assert.deepEqual(validateLearningEvidence(invalid).map((issue) => issue.code), [
    'invalid-occurred-at',
    'invalid-confidence',
    'duplicate-concept-id',
    'invalid-context-link',
    'invalid-domain-effect',
  ]);
});

test('não permite que leitura ou sessão sejam tratadas como domínio demonstrado', () => {
  for (const [source, activity] of [['literary-work', 'reading-progress'], ['verified-session', 'session']] as const) {
    const evidence: LearningEvidence = {
      ...baseEvidence, source, activity, sourceRecordId: 'execution-1', domainEffect: 'eligible',
    };
    assert.ok(validateLearningEvidence(evidence).some((issue) => issue.code === 'invalid-domain-effect'));
  }
});

test('impede atividade incompatível e domínio sem avaliação independente do gabarito', () => {
  const incompatible: LearningEvidence = {
    ...baseEvidence, source: 'objective-question', activity: 'session', sourceRecordId: 'q-1',
  };
  const exposed: LearningEvidence = {
    ...baseEvidence, source: 'flashcard', activity: 'review', sourceRecordId: 'card-1',
    supportLevel: 'solution-exposed', outcome: 'correct', domainEffect: 'eligible',
  };
  const unassessed: LearningEvidence = {
    ...baseEvidence, source: 'essay', activity: 'assessment', sourceRecordId: 'essay-1',
    outcome: 'unassessed', domainEffect: 'eligible',
  };

  assert.ok(validateLearningEvidence(incompatible).some((issue) => issue.code === 'invalid-source-activity'));
  assert.ok(validateLearningEvidence(exposed).some((issue) => issue.code === 'invalid-domain-effect'));
  assert.ok(validateLearningEvidence(unassessed).some((issue) => issue.code === 'invalid-domain-effect'));
});

test('exige snapshot legível quando o catálogo já não resolve a origem', () => {
  const removed: LearningEvidence = {
    ...baseEvidence, source: 'summary-retrieval', activity: 'retrieval', sourceRecordId: 'removed',
    catalogStatus: 'removed', contextLink: null, snapshot: {},
  };

  assert.ok(validateLearningEvidence(removed).some((issue) => issue.code === 'missing-history-snapshot'));
});
