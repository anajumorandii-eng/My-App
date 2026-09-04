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
// No streaming o limite é de silêncio entre pedaços, não da resposta inteira.
const STREAM_IDLE_TIMEOUT_MS = 45_000;

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

interface StreamFrame {
  delta?: string;
  done?: boolean;
  text?: string;
  error?: string;
  code?: string;
  requestId?: string;
}

/**
 * Mesma rota do requestAiText, pedindo SSE. O texto chega em pedaços e cada um
 * é entregue a onDelta; no fim devolve a resposta completa, com o mesmo
 * formato do caminho JSON.
 *
 * A espera aqui era de até 2,5 minutos olhando um spinner, e um timeout jogava
 * fora tudo que já tinha sido gerado. Com o texto aparecendo enquanto é
 * escrito, a aluna começa a ler em segundos.
 */
export async function requestAiTextStream(
  endpoint: string,
  payload: Record<string, unknown>,
  onDelta: (delta: string) => void,
): Promise<AiTextResponse> {
  const controller = new AbortController();
  // O relógio reinicia a cada pedaço: o que não pode é o fluxo travar, não uma
  // resposta longa que está chegando normalmente.
  let timeout = 0;
  const rearmar = () => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => controller.abort(), STREAM_IDLE_TIMEOUT_MS);
  };

  try {
    const idToken = await getFirebaseIdToken();
    if (!idToken) throw new AiRequestError('Entre na sua conta para usar a IA.', 401, 'AUTH_REQUIRED');

    rearmar();
    const response = await fetch(`/api/ai/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as AiErrorBody;
      throw new AiRequestError(body.error || 'Não foi possível obter uma resposta da IA.', response.status, body.code, body.requestId);
    }
    if (!response.body) throw new AiRequestError('A resposta da IA veio vazia.');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let final: AiTextResponse | null = null;

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      rearmar();
      buffer += decoder.decode(value, { stream: true });

      let corte = buffer.indexOf('\n\n');
      while (corte !== -1) {
        const bruto = buffer.slice(0, corte).trim();
        buffer = buffer.slice(corte + 2);
        if (bruto.startsWith('data:')) {
          const frame = JSON.parse(bruto.slice(5).trim()) as StreamFrame;
          if (frame.error) throw new AiRequestError(frame.error, 502, frame.code, frame.requestId);
          if (frame.delta) onDelta(frame.delta);
          if (frame.done && typeof frame.text === 'string') final = frame as AiTextResponse;
        }
        corte = buffer.indexOf('\n\n');
      }
    }

    if (!final || !final.text.trim()) throw new AiRequestError('A IA retornou uma resposta vazia.');
    return final;
  } catch (error) {
    if (error instanceof AiRequestError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AiRequestError('A resposta parou de chegar. Tente novamente.', 504, 'AI_CLIENT_TIMEOUT');
    }
    throw new AiRequestError('Não foi possível conectar ao serviço de IA.');
  } finally {
    window.clearTimeout(timeout);
  }
}

export function aiErrorMessage(error: unknown): string {
  return error instanceof AiRequestError ? error.message : 'Não foi possível processar a solicitação de IA.';
}
