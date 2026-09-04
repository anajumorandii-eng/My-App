import { Router, RequestHandler } from 'express';
import {
  buildGrant,
  GoogleAccessTokenProvider,
  GOOGLE_SCOPES,
  OAuthClient,
  safeReturnTo,
} from './googleOAuth';
import { FirestoreGoogleOAuthStore } from './googleOAuthStore';

export interface GoogleOAuthRouterDeps {
  store: FirestoreGoogleOAuthStore;
  tokens: GoogleAccessTokenProvider;
  createClient: () => OAuthClient;
  /** Ausente quando GOOGLE_CLIENT_ID/SECRET não estão configurados. */
  isConfigured: boolean;
  requireAuth: RequestHandler;
}

/**
 * Fluxo de código de autorização com acesso offline. O que a aluna via antes:
 * o access token do Google só existia na memória da aba, então toda recarga
 * (e toda hora, na expiração) exigia clicar em "Conectar com Google" de novo.
 * Agora o consentimento é trocado por um refresh token guardado no servidor, e
 * a renovação acontece sem ela ver.
 */
export function createGoogleOAuthRouter(deps: GoogleOAuthRouterDeps): Router {
  const router = Router();
  const { store, tokens, createClient, isConfigured, requireAuth } = deps;

  const unavailable: RequestHandler = (_req, res, next) => {
    if (isConfigured) return next();
    res.status(503).json({
      error: 'A integração com o Google não está configurada neste ambiente.',
      code: 'GOOGLE_OAUTH_UNAVAILABLE',
    });
  };

  router.use(unavailable);

  // Não é um redirect direto porque o navegador não manda o ID token do
  // Firebase numa navegação: a tela pede a URL autenticada por fetch e só
  // então navega pra ela.
  router.post('/start', requireAuth, async (req, res) => {
    const uid = res.locals.userId as string;
    try {
      const returnTo = safeReturnTo((req.body as { returnTo?: unknown } | undefined)?.returnTo);
      const state = await store.createState(uid, returnTo);
      const url = createClient().generateAuthUrl({
        access_type: 'offline',
        scope: GOOGLE_SCOPES,
        state,
        include_granted_scopes: true,
        // Sem isto o Google devolve refresh_token só na primeiríssima
        // autorização; se a concessão do servidor for perdida, uma
        // reautorização silenciosa voltaria sem token nenhum.
        prompt: 'consent',
      });
      res.json({ url });
    } catch (error) {
      console.error('Failed to start Google OAuth:', error);
      res.status(500).json({ error: 'Não foi possível iniciar a conexão com o Google.', code: 'GOOGLE_OAUTH_START_FAILED' });
    }
  });

  // O Google redireciona a aluna pra cá. Não há ID token nesta navegação: quem
  // diz de quem é o código é o state de uso único criado no /start.
  router.get('/callback', async (req, res) => {
    const { code, state, error: googleError } = req.query as Record<string, string | undefined>;

    if (googleError) {
      return res.redirect(`/conexoes?google=${encodeURIComponent(googleError)}`);
    }
    if (!code || !state) {
      return res.redirect('/conexoes?google=erro');
    }

    try {
      const pending = await store.consumeState(state);
      if (!pending) return res.redirect('/conexoes?google=expirado');

      const client = createClient();
      const { tokens: issued } = await client.getToken(code);
      const previous = await store.getGrant(pending.uid);
      // Sem googleEmail: buscá-lo custaria uma chamada extra ao userinfo e a
      // tela de Conexões não mostra qual conta Google foi ligada — o campo
      // existe no grant só pra quando isso for exibido.
      const grant = buildGrant(issued, previous, undefined);

      if (!grant) {
        // Autorização sem refresh token e sem nenhuma anterior guardada: não
        // dá pra renovar depois, então não vale registrar como conectada.
        return res.redirect('/conexoes?google=sem_refresh');
      }

      await store.saveGrant(pending.uid, grant);
      tokens.forget(pending.uid);
      res.redirect(`${pending.returnTo}?google=conectado`);
    } catch (error) {
      console.error('Google OAuth callback failed:', error);
      res.redirect('/conexoes?google=erro');
    }
  });

  router.get('/status', requireAuth, async (_req, res) => {
    const uid = res.locals.userId as string;
    try {
      const grant = await store.getGrant(uid);
      res.json({
        connected: grant !== null,
        ...(grant ? { connectedAt: grant.connectedAt, googleEmail: grant.googleEmail ?? null } : {}),
      });
    } catch (error) {
      console.error('Failed to read Google OAuth status:', error);
      res.status(500).json({ error: 'Não foi possível verificar a conexão com o Google.', code: 'GOOGLE_OAUTH_STATUS_FAILED' });
    }
  });

  router.delete('/', requireAuth, async (_req, res) => {
    const uid = res.locals.userId as string;
    try {
      const grant = await store.getGrant(uid);
      if (grant) {
        try {
          const client = createClient();
          client.setCredentials({ refresh_token: grant.refreshToken });
          await client.revokeToken(grant.refreshToken);
        } catch (error) {
          // Revogar no Google é o ideal, mas a desconexão pedida pela aluna
          // não pode falhar por causa disso — apagar a concessão daqui já
          // corta o acesso do app.
          console.error('Failed to revoke Google token (continuing):', error);
        }
      }
      await store.deleteGrant(uid);
      tokens.forget(uid);
      res.status(204).end();
    } catch (error) {
      console.error('Failed to disconnect Google:', error);
      res.status(500).json({ error: 'Não foi possível desconectar sua conta Google.', code: 'GOOGLE_OAUTH_DISCONNECT_FAILED' });
    }
  });

  return router;
}
