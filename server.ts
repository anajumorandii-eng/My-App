import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import { google } from 'googleapis';
import { OmniRouteProvider } from './server/ai/omniRouteProvider';
import { createAiDailyLimit, createAiRateLimit } from './server/ai/rateLimit';
import { createAiRouter } from './server/ai/routes';
import { AiService, parseAiTimeout } from './server/ai/service';
import { firebaseAuthMiddleware, getFirebaseAdminApp, requireAdmin } from './server/auth/firebaseAuth';
import { getFirestore } from 'firebase-admin/firestore';
import { FirestoreDailyQuotaStore } from './server/ai/firestoreQuotaStore';
import { FirestoreAiMetricsRecorder } from './server/ai/metrics';
import { createAdminRouter } from './server/admin/routes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '64kb' }));
app.use(cookieParser());

// Provider-neutral AI layer. Secrets stay server-side and task routing is
// resolved by OmniRoute between the JUJU fast and deep combos.
const aiProvider = new OmniRouteProvider({
  baseUrl: process.env.OMNIROUTE_BASE_URL,
  apiKey: process.env.OMNIROUTE_API_KEY,
  deepModel: process.env.AI_DEEP_MODEL,
  fastModel: process.env.AI_FAST_MODEL,
});
const aiService = new AiService(aiProvider, parseAiTimeout(process.env.AI_TIMEOUT_MS));
const dailyQuotaStore = process.env.AI_QUOTA_STORE === 'firestore'
  ? new FirestoreDailyQuotaStore(getFirestore(getFirebaseAdminApp()))
  : undefined;
const aiMetrics = process.env.AI_METRICS_STORE === 'firestore'
  ? new FirestoreAiMetricsRecorder(getFirestore(getFirebaseAdminApp()))
  : undefined;

// OAuth config
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const REDIRECT_URI = `${APP_URL}/api/oauth/callback`;

function getOAuthClient() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
  );
}

// API routes
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Fetch events from Calendar
app.get('/api/calendar/events', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: token });
    
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    res.json({ events: response.data.items || [] });
  } catch (error) {
    console.error('Calendar Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Fetch files from Drive
app.get('/api/drive/files', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
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
app.use('/api/ai', firebaseAuthMiddleware(), createAiRateLimit(), createAiDailyLimit({ store: dailyQuotaStore }), createAiRouter(aiService, aiMetrics));
app.use('/api/admin', firebaseAuthMiddleware(), requireAdmin, createAdminRouter(getFirestore(getFirebaseAdminApp())));

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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
