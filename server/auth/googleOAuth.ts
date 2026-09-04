import { FirestoreGoogleOAuthStore, GoogleOAuthGrant } from './googleOAuthStore';

/**
 * Escopos de leitura da agenda e do Drive. São os mesmos que a tela de
 * Conexões sempre pediu — o que muda é que agora eles são concedidos ao
 * servidor com acesso offline, então a autorização sobrevive a um F5 e à
 * expiração do access token de uma hora.
 */
export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];

export interface GoogleTokenResponse {
  access_token?: string | null;
  refresh_token?: string | null;
  expiry_date?: number | null;
  scope?: string | null;
}

/**
 * A parte do google.auth.OAuth2 que este módulo usa. Declarada aqui pra que os
 * testes possam entregar um duplo sem subir a biblioteca inteira.
 */
export interface OAuthClient {
  generateAuthUrl(options: Record<string, unknown>): string;
  getToken(code: string): Promise<{ tokens: GoogleTokenResponse }>;
  setCredentials(credentials: Record<string, unknown>): void;
  getAccessToken(): Promise<{ token?: string | null }>;
  revokeToken(token: string): Promise<unknown>;
}

export class GoogleNotConnectedError extends Error {
  readonly code = 'GOOGLE_NOT_CONNECTED';
  constructor(message = 'Conecte sua conta Google para usar esta função.') {
    super(message);
    this.name = 'GoogleNotConnectedError';
  }
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

/**
 * Troca o refresh token guardado por um access token válido, com cache em
 * memória — o access token do Google vale ~1h, então renovar a cada
 * requisição seria uma ida à rede desnecessária em toda abertura de tela.
 * A margem de 5 min evita usar um token que expira no meio da chamada.
 */
export class GoogleAccessTokenProvider {
  private readonly cache = new Map<string, CachedToken>();

  constructor(
    private readonly store: FirestoreGoogleOAuthStore,
    private readonly createClient: () => OAuthClient,
    private readonly cacheMarginMs = 5 * 60_000,
  ) {}

  async getAccessToken(uid: string, now: number = Date.now()): Promise<string> {
    const cached = this.cache.get(uid);
    if (cached && cached.expiresAt > now) return cached.token;

    const grant = await this.store.getGrant(uid);
    if (!grant) throw new GoogleNotConnectedError();

    const client = this.createClient();
    client.setCredentials({ refresh_token: grant.refreshToken });

    let token: string | null | undefined;
    try {
      ({ token } = await client.getAccessToken());
    } catch (error) {
      // invalid_grant = a aluna revogou o acesso na conta Google dela, ou o
      // refresh token foi invalidado. Guardar isso não adianta nada: apaga a
      // concessão pra que a UI volte a oferecer "Conectar" em vez de repetir
      // um erro que só se resolve reconectando.
      if (isInvalidGrant(error)) {
        this.cache.delete(uid);
        await this.store.deleteGrant(uid);
        throw new GoogleNotConnectedError('Sua autorização com o Google foi revogada. Conecte novamente.');
      }
      throw error;
    }

    if (!token) throw new GoogleNotConnectedError('Não foi possível renovar o acesso ao Google. Conecte novamente.');

    this.cache.set(uid, { token, expiresAt: now + this.cacheMarginMs });
    return token;
  }

  forget(uid: string): void {
    this.cache.delete(uid);
  }
}

export function isInvalidGrant(error: unknown): boolean {
  const candidate = error as { message?: string; response?: { data?: { error?: string } } } | null;
  if (candidate?.response?.data?.error === 'invalid_grant') return true;
  return typeof candidate?.message === 'string' && candidate.message.includes('invalid_grant');
}

export function buildGrant(
  tokens: GoogleTokenResponse,
  previous: GoogleOAuthGrant | null,
  googleEmail: string | undefined,
  now: Date = new Date(),
): GoogleOAuthGrant | null {
  // O Google só devolve refresh_token na primeira autorização de um par
  // conta/cliente. Numa reautorização ele vem vazio, e o token antigo continua
  // valendo — por isso o fallback pro anterior em vez de sobrescrever com null.
  const refreshToken = tokens.refresh_token || previous?.refreshToken;
  if (!refreshToken) return null;

  const timestamp = now.toISOString();
  return {
    refreshToken,
    scope: tokens.scope || previous?.scope || GOOGLE_SCOPES.join(' '),
    ...(googleEmail ? { googleEmail } : previous?.googleEmail ? { googleEmail: previous.googleEmail } : {}),
    connectedAt: previous?.connectedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

/**
 * Só caminhos internos do próprio app: sem isso o parâmetro de retorno viraria
 * um redirecionamento aberto, usável pra mandar a aluna pra fora do domínio
 * logo depois de ela autorizar o Google.
 */
export function safeReturnTo(value: unknown, fallback = '/conexoes'): string {
  if (typeof value !== 'string') return fallback;
  if (!value.startsWith('/') || value.startsWith('//')) return fallback;
  return value;
}
