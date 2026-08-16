import { AiValidationError } from './errors';
import { AiTask } from './types';

type Payload = Record<string, unknown>;

const MAX_SHORT_TEXT = 300;
const MAX_LONG_TEXT = 12_000;
const MAX_ARRAY_ITEMS = 50;

function asObject(value: unknown): Payload {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AiValidationError('O corpo da solicitação deve ser um objeto JSON.');
  }
  return value as Payload;
}

function requiredString(payload: Payload, field: string, maxLength = MAX_SHORT_TEXT): string {
  const value = payload[field];
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new AiValidationError(`O campo "${field}" é obrigatório.`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new AiValidationError(`O campo "${field}" excede ${maxLength} caracteres.`);
  }
  return normalized;
}

function optionalString(payload: Payload, field: string, maxLength = MAX_LONG_TEXT): string | undefined {
  const value = payload[field];
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string') {
    throw new AiValidationError(`O campo "${field}" deve ser um texto.`);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new AiValidationError(`O campo "${field}" excede ${maxLength} caracteres.`);
  }
  return normalized || undefined;
}

function requiredBoolean(payload: Payload, field: string): boolean {
  const value = payload[field];
  if (typeof value !== 'boolean') {
    throw new AiValidationError(`O campo "${field}" deve ser verdadeiro ou falso.`);
  }
  return value;
}

function requiredNumber(payload: Payload, field: string, min: number, max: number): number {
  const value = payload[field];
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
    throw new AiValidationError(`O campo "${field}" deve ser um número entre ${min} e ${max}.`);
  }
  return value;
}

function requiredStringArray(payload: Payload, field: string): string[] {
  const value = payload[field];
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_ARRAY_ITEMS) {
    throw new AiValidationError(`O campo "${field}" deve conter de 1 a ${MAX_ARRAY_ITEMS} textos.`);
  }
  return value.map((item, index) => {
    if (typeof item !== 'string' || item.trim().length === 0 || item.length > MAX_LONG_TEXT) {
      throw new AiValidationError(`O item ${index + 1} de "${field}" é inválido.`);
    }
    return item.trim();
  });
}

function serializableValue(payload: Payload, field: string): unknown {
  const value = payload[field];
  if (value === undefined) throw new AiValidationError(`O campo "${field}" é obrigatório.`);
  let serialized: string;
  try {
    serialized = JSON.stringify(value);
  } catch {
    throw new AiValidationError(`O campo "${field}" não pode ser serializado.`);
  }
  if (serialized.length > MAX_LONG_TEXT) {
    throw new AiValidationError(`O campo "${field}" excede o tamanho permitido.`);
  }
  return value;
}

export function validateAiPayload(task: AiTask, body: unknown): Payload {
  const payload = asObject(body);

  switch (task) {
    case 'socratic':
      return {
        question: requiredString(payload, 'question', MAX_LONG_TEXT),
        topic: requiredString(payload, 'topic'),
      };
    case 'error-hypothesis':
      return {
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
        errorType: requiredString(payload, 'errorType'),
        notes: requiredString(payload, 'notes', MAX_LONG_TEXT),
      };
    case 'question-explanation':
      return {
        prompt: requiredString(payload, 'prompt', MAX_LONG_TEXT),
        subject: requiredString(payload, 'subject'),
        selectedAnswer: requiredString(payload, 'selectedAnswer', MAX_LONG_TEXT),
        correctAnswer: requiredString(payload, 'correctAnswer', MAX_LONG_TEXT),
        isCorrect: requiredBoolean(payload, 'isCorrect'),
        baseExplanation: requiredString(payload, 'baseExplanation', MAX_LONG_TEXT),
      };
    case 'backlog-exercise':
      return {
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
        mode: optionalString(payload, 'mode', 50) ?? 'solve',
      };
    case 'backlog-correction':
      return {
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
        exercise: requiredString(payload, 'exercise', MAX_LONG_TEXT),
        studentAnswer: requiredString(payload, 'studentAnswer', MAX_LONG_TEXT),
        groundingAnswer: optionalString(payload, 'groundingAnswer', MAX_LONG_TEXT),
      };
    case 'discursive-feedback':
      return {
        board: requiredString(payload, 'board'),
        subject: requiredString(payload, 'subject'),
        prompt: requiredString(payload, 'prompt', MAX_LONG_TEXT),
        modelAnswer: requiredStringArray(payload, 'modelAnswer'),
        studentAnswer: requiredString(payload, 'studentAnswer', MAX_LONG_TEXT),
      };
    case 'podcast-script':
      return {
        title: requiredString(payload, 'title'),
        subject: requiredString(payload, 'subject'),
        topic: requiredString(payload, 'topic'),
      };
    case 'progress-insight':
      return {
        topics: serializableValue(payload, 'topics'),
        overallAverage: requiredNumber(payload, 'overallAverage', 0, 100),
        strongest: requiredString(payload, 'strongest'),
        weakest: requiredString(payload, 'weakest'),
      };
    case 'review-tip':
      return {
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
        level: requiredNumber(payload, 'level', 0, 100),
        daysSinceReview: requiredNumber(payload, 'daysSinceReview', 0, 36_500),
      };
    case 'method-example':
      return {
        methodName: requiredString(payload, 'methodName'),
        methodSummary: requiredString(payload, 'methodSummary', MAX_LONG_TEXT),
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
      };
  }
}

