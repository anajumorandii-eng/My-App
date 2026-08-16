import assert from 'node:assert/strict';
import test from 'node:test';
import { AiValidationError } from './errors';
import { validateAiPayload } from './validation';

test('normaliza uma solicitação socrática válida', () => {
  const payload = validateAiPayload('socratic', {
    question: '  Por que a água é polar?  ',
    topic: '  Ligações químicas ',
    ignored: 'não atravessa o contrato',
  });

  assert.deepEqual(payload, {
    question: 'Por que a água é polar?',
    topic: 'Ligações químicas',
  });
});

test('rejeita campos obrigatórios ausentes', () => {
  assert.throws(
    () => validateAiPayload('error-hypothesis', { topic: 'Citologia' }),
    (error: unknown) => error instanceof AiValidationError && error.message.includes('subject'),
  );
});

test('rejeita notas acima do limite', () => {
  assert.throws(
    () => validateAiPayload('error-hypothesis', {
      topic: 'Citologia',
      subject: 'Biologia',
      errorType: 'Conceitual',
      notes: 'x'.repeat(12_001),
    }),
    AiValidationError,
  );
});

test('valida os limites numéricos de domínio', () => {
  assert.throws(
    () => validateAiPayload('review-tip', {
      topic: 'Termodinâmica',
      subject: 'Física',
      level: 101,
      daysSinceReview: 3,
    }),
    AiValidationError,
  );
});

