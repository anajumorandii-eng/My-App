import { authHeaders } from './auth';

/**
 * Conexão com a agenda e o Drive. O que a aluna autoriza aqui vale até ela
 * desconectar: quem guarda a credencial é o servidor, não a aba do navegador.
 */

export interface GoogleConnectionStatus {
  connected: boolean;
  connectedAt?: string;
  googleEmail?: string | null;
}

export class GoogleConnectionError extends Error {
  constructor(message: string, readonly code?: string) {
    super(message);
    this.name = 'GoogleConnectionError';
  }
}

async function readError(response: Response, fallback: string): Promise<GoogleConnectionError> {
  const body = await response.json().catch(() => ({})) as { error?: string; code?: string };
  return new GoogleConnectionError(body.error || fallback, body.code);
}

export async function getGoogleConnectionStatus(): Promise<GoogleConnectionStatus> {
  const response = await fetch('/api/oauth/google/status', { headers: await authHeaders() });
  if (!response.ok) throw await readError(response, 'Não foi possível verificar a conexão com o Google.');
  return response.json() as Promise<GoogleConnectionStatus>;
}

/**
 * Navega pro consentimento do Google. A URL é pedida por fetch (autenticado)
 * em vez de a tela apontar direto pro endpoint: uma navegação não carrega o
 * ID token do Firebase, e o servidor precisa dele pra saber de quem é a
 * autorização que está começando.
 */
export async function startGoogleConnection(returnTo = '/conexoes'): Promise<void> {
  const response = await fetch('/api/oauth/google/start', {
    method: 'POST',
    headers: { ...(await authHeaders()), 'Content-Type': 'application/json' },
    body: JSON.stringify({ returnTo }),
  });
  if (!response.ok) throw await readError(response, 'Não foi possível iniciar a conexão com o Google.');
  const { url } = await response.json() as { url: string };
  window.location.assign(url);
}

export async function disconnectGoogle(): Promise<void> {
  const response = await fetch('/api/oauth/google', { method: 'DELETE', headers: await authHeaders() });
  if (!response.ok) throw await readError(response, 'Não foi possível desconectar sua conta Google.');
}

/** Mensagens do parâmetro ?google=... com que o callback devolve a aluna. */
export const GOOGLE_CALLBACK_MESSAGES: Record<string, string> = {
  conectado: '',
  expirado: 'A autorização demorou demais para ser concluída. Tente conectar novamente.',
  sem_refresh: 'O Google não devolveu uma autorização duradoura. Tente conectar novamente.',
  access_denied: 'Você recusou o acesso à sua conta Google.',
  erro: 'Não foi possível concluir a conexão com o Google. Tente novamente.',
};

export function describeGoogleCallback(param: string | null): string | null {
  if (!param || param === 'conectado') return null;
  return GOOGLE_CALLBACK_MESSAGES[param] ?? GOOGLE_CALLBACK_MESSAGES.erro;
}
