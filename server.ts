import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import { google } from 'googleapis';
import { createAiProvider } from './server/ai/provider';
import { createAiDailyLimit, createAiRateLimit } from './server/ai/rateLimit';
import { createAiRouter } from './server/ai/routes';
import { AiService, parseAiTimeout } from './server/ai/service';
import { adminAuthMiddleware, firebaseAuthMiddleware, getFirebaseAdminApp, requireAdmin } from './server/auth/firebaseAuth';
import { GoogleAccessTokenProvider, GoogleNotConnectedError, OAuthClient } from './server/auth/googleOAuth';
import { FirestoreGoogleOAuthStore } from './server/auth/googleOAuthStore';
import { createGoogleOAuthRouter } from './server/auth/googleOAuthRoutes';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreDailyQuotaStore } from './server/ai/firestoreQuotaStore';
import { FirestoreAiMetricsRecorder } from './server/ai/metrics';
import { FirestoreApostilaReferenceStore } from './server/ai/apostilaReferenceStore';
import { createAdminRouter } from './server/admin/routes';
import { createApostilaIngestRouter } from './server/admin/apostilaIngestRoutes';
import { createLiteraryAdminRouter } from './server/literary/literaryAdminRoutes';
import { createContentAdminRouter } from './server/content/contentAdminRoutes';
import { createPushRouter, createReviewReminderRouter } from './server/push/routes';
import { configureWebPush, loadVapidConfig } from './server/push/webPush';
import { createPodcastAudioRouter } from './server/podcast/routes';
import { GeminiTtsService } from './server/podcast/ttsService';
import { buildCalendarEventsQuery } from './serverCalendar';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Antes de qualquer rota: sem isso o bundle e os JSON de flashcards viajam
// sem compressão nenhuma (o de Português sozinho tem 3,8MB).
app.use(compression());

// Sem login de usuário — protegida só pelo segredo compartilhado
// (x-ingest-secret), pra permitir subir referências de apostila direto
// pra produção a partir do pipeline local (scripts/split-chapters.py).
//
// Precisa vir ANTES do parser global de 64kb abaixo: como esse último não
// tem path (roda pra toda rota), ele rejeitaria o corpo grande antes mesmo
// de chegar no parser de 20mb desta rota se estivesse depois. Montada aqui,
// ela responde e encerra a requisição antes do parser global ser atingido.
app.use('/api/internal', express.json({ limit: '20mb' }), createApostilaIngestRouter(getFirestore(getFirebaseAdminApp()), process.env.APOSTILA_INGEST_SECRET));

// Feature flag literary_works (seção 13 do roteiro de Obras Obrigatórias):
// enquanto não estiver pronta pra uso real, as rotas nem existem — nada de
// endpoint "desligado" respondendo 404 de propósito, ele simplesmente não
// é montado.
if (process.env.LITERARY_WORKS_ENABLED === 'true') {
  // Mesmo motivo do /api/internal acima: PDFs de obra em base64 passam
  // longe dos 64kb do parser global — precisa do parser de 50mb próprio,
  // montado antes.
  app.use('/api/admin/literary', express.json({ limit: '50mb' }), adminAuthMiddleware(), requireAdmin, createLiteraryAdminRouter(getFirestore(getFirebaseAdminApp())));
}

app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());

// Provider-neutral AI layer. Set AI_PROVIDER=omniroute to migrate without
// changing the public API routes; Gemini remains available as a fallback.
// Secrets stay server-side and task routing is resolved by OmniRoute between
// the JUJU fast and deep combos.
const aiProvider = createAiProvider();
const aiService = new AiService(aiProvider, parseAiTimeout(process.env.AI_TIMEOUT_MS));
const dailyQuotaStore = process.env.AI_QUOTA_STORE === 'firestore'
  ? new FirestoreDailyQuotaStore(getFirestore(getFirebaseAdminApp()))
  : undefined;
const aiMetrics = process.env.AI_METRICS_STORE === 'firestore'
  ? new FirestoreAiMetricsRecorder(getFirestore(getFirebaseAdminApp()))
  : undefined;
// Grounding factual/terminológico com trechos reais das apostilas do
// cursinho da aluna (ver scripts/split-chapters.py e
// scripts/upload-apostila-references.ts) — opcional, cai de volta pro
// conhecimento geral do modelo quando não configurado ou sem cobertura
// pro tópico pedido.
const apostilaReferences = process.env.AI_APOSTILA_REFERENCES === 'firestore'
  ? new FirestoreApostilaReferenceStore(getFirestore(getFirebaseAdminApp()))
  : undefined;

// Natural-voice podcast narration. Reuses the same GEMINI_API_KEY already
// configured for text generation — Gemini's TTS models bill separately but
// through the same account, and the daily AI quota below caps the cost.
const podcastTtsService = new GeminiTtsService(process.env.GEMINI_API_KEY, process.env.GEMINI_TTS_MODEL);

// Web Push for review reminders. Both routers still mount even when VAPID
// isn't configured yet; they just respond 503 until the keys are set.
const vapidConfig = loadVapidConfig();
if (vapidConfig) configureWebPush(vapidConfig);

// OAuth config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const REDIRECT_URI = `${APP_URL}/api/oauth/google/callback`;
const GOOGLE_OAUTH_CONFIGURED = Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);

// Diagnóstico de arranque. As duas causas de "não conecta" que não deixam
// rastro em lugar nenhum são variável faltando na revisão em tráfego e
// redirect URI diferente do cadastrado no Google — e a segunda depende de
// APP_URL, que é fácil de configurar com uma barra a mais no fim. Registrar
// as duas no boot transforma isso numa linha de log em vez de tentativa e
// erro. Nada aqui é segredo: o redirect URI aparece na barra de endereço
// durante a própria autorização.
console.info(JSON.stringify({
  event: 'google_oauth_config',
  configured: GOOGLE_OAUTH_CONFIGURED,
  hasClientId: Boolean(GOOGLE_CLIENT_ID),
  hasClientSecret: Boolean(GOOGLE_CLIENT_SECRET),
  appUrl: APP_URL,
  redirectUri: REDIRECT_URI,
}));

function getOAuthClient(): OAuthClient {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  ) as unknown as OAuthClient;
}

const googleOAuthStore = new FirestoreGoogleOAuthStore(getFirestore(getFirebaseAdminApp()));
const googleTokens = new GoogleAccessTokenProvider(googleOAuthStore, getOAuthClient);

// API routes
app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  // Mesmo diagnóstico do log de arranque, alcançável sem abrir o console do
  // Cloud Run: dá pra conferir do celular se a revisão no ar enxerga as
  // credenciais e qual redirect URI ela vai mandar pro Google.
  googleOAuth: {
    configured: GOOGLE_OAUTH_CONFIGURED,
    hasClientId: Boolean(GOOGLE_CLIENT_ID),
    hasClientSecret: Boolean(GOOGLE_CLIENT_SECRET),
    redirectUri: REDIRECT_URI,
  },
}));

// O cliente manda só o ID token do Firebase; o access token do Google é
// resolvido aqui, a partir do refresh token guardado no servidor. Antes o
// navegador guardava esse access token em memória e o mandava junto — ele
// morria a cada recarga da página, e as rotas nem exigiam autenticação.
async function respondGoogleAuthError(res: express.Response, error: unknown, context: string): Promise<void> {
  if (error instanceof GoogleNotConnectedError) {
    res.status(409).json({ error: error.message, code: error.code });
    return;
  }
  console.error(`${context}:`, error);
  res.status(500).json({ error: 'Falha ao consultar sua conta Google.', code: 'GOOGLE_REQUEST_FAILED' });
}

app.use('/api/oauth/google', createGoogleOAuthRouter({
  store: googleOAuthStore,
  tokens: googleTokens,
  createClient: getOAuthClient,
  isConfigured: GOOGLE_OAUTH_CONFIGURED,
  requireAuth: firebaseAuthMiddleware(),
}));

// Fetch events from Calendar
app.get('/api/calendar/events', firebaseAuthMiddleware(), createAiRateLimit(), async (req, res) => {
  const localDate = typeof req.query.date === 'string' ? req.query.date : '';

  let query: ReturnType<typeof buildCalendarEventsQuery>;
  try {
    query = buildCalendarEventsQuery(localDate);
  } catch {
    return res.status(400).json({ error: 'Invalid date' });
  }

  let token: string;
  try {
    token = await googleTokens.getAccessToken(res.locals.userId as string);
  } catch (error) {
    return respondGoogleAuthError(res, error, 'Google token resolution failed');
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list(query);

    res.json({ events: response.data.items || [] });
  } catch (error) {
    console.error('Calendar Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Fetch files from Drive
app.get('/api/drive/files', firebaseAuthMiddleware(), createAiRateLimit(), async (_req, res) => {
  let token: string;
  try {
    token = await googleTokens.getAccessToken(res.locals.userId as string);
  } catch (error) {
    return respondGoogleAuthError(res, error, 'Google token resolution failed');
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    
    const drive = google.drive({ version: 'v3', auth: oauth2Client });
    const response = await drive.files.list({
      pageSize: 10,
      fields: 'files(id, name, mimeType, webViewLink, iconLink)',
      orderBy: 'modifiedTime desc'
    });
    
    res.json({ files: response.data.files || [] });
  } catch (error) {
    console.error('Drive Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

// AI routes preserve their public paths and `{ text }` response contract.
app.use('/api/ai', firebaseAuthMiddleware(), createAiRateLimit(), createAiDailyLimit({ store: dailyQuotaStore }), createAiRouter(aiService, aiMetrics, apostilaReferences));
// Shares the AI rate limit and daily quota store so narrated playback counts
// against the same per-user budget as every other AI feature in the app.
app.use('/api/podcast-audio', firebaseAuthMiddleware(), createAiRateLimit(), createAiDailyLimit({ store: dailyQuotaStore }), createPodcastAudioRouter(podcastTtsService));
app.use('/api/admin', adminAuthMiddleware(), requireAdmin, createAdminRouter(getFirestore(getFirebaseAdminApp())));
// Painel /admin/conteudo: questões, métodos de estudo e episódios de
// podcast, antes hardcoded em src/data/mockData.ts, agora administráveis
// sem deploy (ver server/content/contentAdminRoutes.ts).
app.use('/api/admin/content', adminAuthMiddleware(), requireAdmin, createContentAdminRouter(getFirestore(getFirebaseAdminApp())));
app.use('/api/push', createPushRouter(getFirestore(getFirebaseAdminApp()), vapidConfig?.publicKey, firebaseAuthMiddleware()));
app.use('/api/push', createReviewReminderRouter(getFirestore(getFirebaseAdminApp()), vapidConfig, process.env.CRON_SECRET));

// Vite & Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Os assets do Vite têm hash no nome, então nunca mudam de conteúdo sem
    // mudar de URL — podem ser cacheados pra sempre. O index.html é o oposto:
    // é o que aponta pros hashes novos, e precisa ser sempre revalidado.
    app.use(express.static(distPath, {
      index: false,
      setHeaders: (res, filePath) => {
        const immutable = filePath.includes(`${path.sep}assets${path.sep}`);
        res.setHeader('Cache-Control', immutable
          ? 'public, max-age=31536000, immutable'
          : 'public, max-age=3600');
      },
    }));
    app.get('*', (req, res) => {
      // Um arquivo que não existe precisa responder 404, não o index.html:
      // devolver HTML com status 200 no lugar de um .js ou .json ausente vira
      // um "Unexpected token <" no navegador, que não aponta pra causa.
      if (path.extname(req.path)) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

