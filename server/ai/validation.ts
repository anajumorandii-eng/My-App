import { normalizeReviewOptions, reviewDepths, reviewScopes, reviewBoard, type ReviewOptions } from '../../src/lib/strategicReview';
import { STUDY_SOURCE_CHAR_LIMIT } from '../../src/lib/studySources';
import { DEFAULT_PODCAST_SETTINGS, PODCAST_FORMATS, PODCAST_LEVELS, PODCAST_PACES, PODCAST_TONES, PODCAST_HOST_STYLES } from '../../src/lib/podcastConfig';
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

function studyBoards(payload: Payload): string[] {
  if (payload.targetBoards === undefined) return [];
  const values = payload.targetBoards;
  if (!Array.isArray(values) || values.length > 15 || values.some(value => typeof value !== 'string' || !value.trim() || value.length > 100)) throw new AiValidationError('Bancas de estudo inválidas.');
  return [...new Set(values.map(value => (value as string).trim()))];
}

function strategicReviewOptions(payload: Payload): ReviewOptions | undefined {
  if (payload.guideMode !== 'review-summary') return undefined;
  const raw = payload.reviewOptions === undefined ? {} : asObject(payload.reviewOptions);
  const boards = payload.targetBoards === undefined ? (typeof payload.board === 'string' && payload.board.trim() ? [payload.board] : []) : studyBoards(payload);
  if (raw.depth !== undefined && (typeof raw.depth !== 'string' || !Object.hasOwn(reviewDepths, raw.depth))) throw new AiValidationError('Profundidade de revisão inválida.');
  if (raw.materialKind !== undefined && !['disciplinary','current-affairs','literature'].includes(String(raw.materialKind))) throw new AiValidationError('Tipo de material inválido.');
  if (raw.sourceMode !== undefined && !['catalog','provided','work'].includes(String(raw.sourceMode))) throw new AiValidationError('Origem do material inválida.');
  if (raw.useHistory !== undefined && typeof raw.useHistory !== 'boolean') throw new AiValidationError('Opção de histórico inválida.');
  if (raw.visualMode !== undefined && !['auto','text'].includes(String(raw.visualMode))) throw new AiValidationError('Opção de figuras inválida.');
  const scopes = raw.scopes === undefined ? {} : asObject(raw.scopes);
  for (const board of boards.map(reviewBoard)) {
    if (scopes[board] !== undefined && !reviewScopes(board).includes(scopes[board] as never)) throw new AiValidationError('Etapa incompatível com a banca selecionada.');
  }
  const topicCuts = raw.topicCuts === undefined ? undefined : asObject(raw.topicCuts);
  if(topicCuts && (Object.keys(topicCuts).length>40 || Object.entries(topicCuts).some(([id,cuts])=>id.length>300||!Array.isArray(cuts)||cuts.length>8||cuts.some(cut=>typeof cut!=='string'||cut.length>180))))throw new AiValidationError('Recortes da revisão inválidos.');
  const sourceDate = optionalString(raw, 'sourceDate', 10);
  if (sourceDate && (!/^\d{4}-\d{2}-\d{2}$/.test(sourceDate) || Number.isNaN(Date.parse(sourceDate)) || new Date(sourceDate).toISOString().slice(0,10) !== sourceDate)) throw new AiValidationError('Data da fonte inválida.');
  const sourceUrl = optionalString(raw, 'sourceUrl', 1500);
  if (sourceUrl) { try { if (!['https:', 'http:'].includes(new URL(sourceUrl).protocol)) throw new Error(); } catch { throw new AiValidationError('URL da fonte inválida.'); } }
  return normalizeReviewOptions({ visualMode: raw.visualMode as ReviewOptions['visualMode'], topicCuts:topicCuts as ReviewOptions['topicCuts'], boards, scopes: scopes as ReviewOptions['scopes'], depth: raw.depth as ReviewOptions['depth'], materialKind: raw.materialKind as ReviewOptions['materialKind'], useHistory: raw.useHistory === true,
    sourceMode: raw.sourceMode as ReviewOptions['sourceMode'], sourceTitle: optionalString(raw, 'sourceTitle', 300), sourceDate, sourceUrl, sourceText: optionalString(raw, 'sourceText', 12000) });
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
    case 'socratic': {
      const history = payload.history ?? [];
      if (!Array.isArray(history) || history.length > 12) throw new AiValidationError('O histórico deve conter até 12 mensagens.');
      let length = 0;
      const messages = history.map(item => {
        const message = asObject(item);
        if (message.role !== 'user' && message.role !== 'assistant') throw new AiValidationError('Papel inválido no histórico.');
        const content = requiredString(message, 'content', 2000);
        length += content.length;
        return { role: message.role, content };
      });
      if (length > 12000) throw new AiValidationError('O histórico excede 12.000 caracteres.');
      return {
        question: requiredString(payload, 'question', MAX_LONG_TEXT),
        topic: requiredString(payload, 'topic'),
        history: messages,
      };
    }
    case 'content-explanation':
      return {
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
        question: optionalString(payload, 'question', MAX_LONG_TEXT),
      };
    case 'answer-correction': {
      const answerKind = optionalString(payload, 'answerKind', MAX_SHORT_TEXT);
      if (answerKind && answerKind !== 'essay' && answerKind !== 'discursive') throw new AiValidationError('O campo answerKind deve ser essay ou discursive.');
      return {
        ...(answerKind ? { answerKind } : {}),
        topic: requiredString(payload, 'topic'),
        subject: requiredString(payload, 'subject'),
        question: requiredString(payload, 'question', MAX_LONG_TEXT),
        studentAnswer: requiredString(payload, 'studentAnswer', MAX_LONG_TEXT),
        board: optionalString(payload, 'board', MAX_SHORT_TEXT),
        modelAnswer: payload.modelAnswer !== undefined ? requiredStringArray(payload, 'modelAnswer') : undefined,
      };
    }
    case 'error-hypothesis': {
      const topic = requiredString(payload, 'topic');
      const subject = requiredString(payload, 'subject');
      const notes = optionalString(payload, 'notes', MAX_LONG_TEXT);
      const questionPrompt = optionalString(payload, 'questionPrompt', MAX_LONG_TEXT);
      if (!notes && !questionPrompt) {
        throw new AiValidationError('Informe "notes" (relato da aluna) ou "questionPrompt" (questão respondida) para diagnosticar o erro.');
      }
      return {
        topic,
        subject,
        errorType: optionalString(payload, 'errorType', MAX_SHORT_TEXT),
        notes,
        questionPrompt,
        selectedAnswer: optionalString(payload, 'selectedAnswer', MAX_SHORT_TEXT),
        correctAnswer: optionalString(payload, 'correctAnswer', MAX_SHORT_TEXT),
      };
    }
    case 'error-diagnosis':
      return {
        questionId: optionalString(payload, 'questionId'),
        selectedOptionId: optionalString(payload, 'selectedOptionId', 10),
        prompt: requiredString(payload, 'prompt', MAX_LONG_TEXT),
        subject: requiredString(payload, 'subject'),
        selectedAnswer: requiredString(payload, 'selectedAnswer', MAX_LONG_TEXT),
        correctAnswer: requiredString(payload, 'correctAnswer', MAX_LONG_TEXT),
        baseExplanation: optionalString(payload, 'baseExplanation', MAX_LONG_TEXT),
        // O que a estudante diz ter pensado. E a evidencia mais forte que o
        // diagnostico pode ter, e nao existe em nenhum outro campo: sem ela o
        // modelo so consegue inferir a partir da alternativa marcada.
        studentAccount: optionalString(payload, 'studentAccount', MAX_LONG_TEXT),
      };
    case 'question-explanation':
      return {
        questionId: optionalString(payload, 'questionId'),
        selectedOptionId: optionalString(payload, 'selectedOptionId', 10),
        board: optionalString(payload, 'board', MAX_SHORT_TEXT),
        topic: optionalString(payload, 'topic', MAX_SHORT_TEXT),
        chapter: optionalString(payload, 'chapter', MAX_SHORT_TEXT),
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
        board: optionalString(payload, 'board', MAX_SHORT_TEXT),
        transfer: payload.transfer === true,
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
    case 'podcast-script': {
      const defaults = DEFAULT_PODCAST_SETTINGS;
      const choice = (field: string, choices: object, fallback: string) => {
        if (payload[field] === undefined) return fallback;
        if (typeof payload[field] !== 'string' || !Object.hasOwn(choices, payload[field] as string)) throw new AiValidationError(`Configuração inválida: ${field}.`);
        return payload[field];
      };
      const speakers = payload.speakers === undefined ? 1 : requiredNumber(payload, 'speakers', 1, 2);
      const durationMinutes = payload.durationMinutes === undefined ? 5 : requiredNumber(payload, 'durationMinutes', 2, 15);
      if (!Number.isInteger(speakers) || !Number.isInteger(durationMinutes)) throw new AiValidationError('Participantes e duração devem ser inteiros.');
      return {
        speakers, durationMinutes,
        format: choice('format', PODCAST_FORMATS, defaults.format),
        level: choice('level', PODCAST_LEVELS, defaults.level),
        pace: choice('pace', PODCAST_PACES, defaults.pace),
        tone: choice('tone', PODCAST_TONES, defaults.tone),
        hostStyle: choice('hostStyle', PODCAST_HOST_STYLES, defaults.hostStyle),
        cohostStyle: choice('cohostStyle', PODCAST_HOST_STYLES, defaults.cohostStyle),
        focus: optionalString(payload, 'focus', 2000),
        sourceText: optionalString(payload, 'sourceText', STUDY_SOURCE_CHAR_LIMIT),
        targetBoards: studyBoards(payload),
        learnerReflection: optionalString(payload, 'learnerReflection', 6000),
        exam: optionalString(payload, 'exam', 100) ?? 'Geral',
        title: requiredString(payload, 'title'),
        subject: requiredString(payload, 'subject'),
        topic: requiredString(payload, 'topic', 1200),
      };
    }
    case 'progress-insight':
      return {
        topics: serializableValue(payload, 'topics'),
        overallAverage: requiredNumber(payload, 'overallAverage', 0, 100),
        strongest: requiredString(payload, 'strongest'),
        weakest: requiredString(payload, 'weakest'),
      };
    case 'review-tip':
      return {
        reviewOptions: strategicReviewOptions(payload),
        errorHistory: optionalString(payload, 'errorHistory', 6000),
        guideMode: optionalString(payload, 'guideMode', 30),
        referenceText: optionalString(payload, 'referenceText', STUDY_SOURCE_CHAR_LIMIT),
        targetBoards: payload.guideMode === 'review-summary' && payload.targetBoards === undefined && typeof payload.board === 'string' && payload.board.trim() ? [reviewBoard(payload.board)] : studyBoards(payload),
        learnerReflection: optionalString(payload, 'learnerReflection', 6000),
        board: optionalString(payload, 'board', MAX_SHORT_TEXT),
        chapter: optionalString(payload, 'chapter', MAX_SHORT_TEXT),
        chapters: optionalString(payload, 'chapters', 6000),
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

