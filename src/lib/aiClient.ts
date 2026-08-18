import { getFirebaseIdToken } from './auth';

export interface AiTextResponse {
  text: string;
  requestId?: string;
  provider?: string;
  model?: string;
  usage?: { promptTokens?: number; completionTokens?: number; totalTokens?: number };
  fallback?: boolean;
  cached?: boolean;
}

interface AiErrorBody {
  error?: string;
  code?: string;
  requestId?: string;
}

export class AiRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly code?: string,
    readonly requestId?: string,
  ) {
    super(message);
    this.name = 'AiRequestError';
  }
}

const CLIENT_TIMEOUT_MS = 160_000;

export async function requestAiText(
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<AiTextResponse> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), CLIENT_TIMEOUT_MS);

  try {
    const idToken = await getFirebaseIdToken();
    if (!idToken) {
      throw new AiRequestError('Entre na sua conta para usar a IA.', 401, 'AUTH_REQUIRED');
    }
    const response = await fetch(`/api/ai/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const body = await response.json().catch(() => ({})) as AiTextResponse & AiErrorBody;
    if (!response.ok) {
      throw new AiRequestError(
        body.error || 'Não foi possível obter uma resposta da IA.',
        response.status,
        body.code,
        body.requestId,
      );
    }
    if (typeof body.text !== 'string' || body.text.trim().length === 0) {
      throw new AiRequestError('A IA retornou uma resposta vazia.', response.status, undefined, body.requestId);
    }
    return body;
  } catch (error) {
    if (error instanceof AiRequestError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AiRequestError('A resposta demorou mais do que o esperado. Tente novamente.', 504, 'AI_CLIENT_TIMEOUT');
    }
    throw new AiRequestError('Não foi possível conectar ao serviço de IA.');
  } finally {
    window.clearTimeout(timeout);
  }
}

export function aiErrorMessage(error: unknown): string {
  return error instanceof AiRequestError ? error.message : 'Não foi possível processar a solicitação de IA.';
}
