import { App, applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { RequestHandler } from 'express';

interface TokenVerifier {
  verifyIdToken(token: string): Promise<{ uid: string; email?: string }>;
}

function bearerToken(header: string | undefined): string | null {
  const match = header?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export function createRequireFirebaseAuth(verifier: TokenVerifier): RequestHandler {
  return async (req, res, next) => {
    const token = bearerToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Entre na sua conta para usar a IA.', code: 'AUTH_REQUIRED' });
    }

    try {
      const decoded = await verifier.verifyIdToken(token);
      res.locals.userId = decoded.uid;
      res.locals.userEmail = decoded.email;
      next();
    } catch {
      return res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.', code: 'INVALID_AUTH_TOKEN' });
    }
  };
}

export const requireAdmin: RequestHandler = (_req, res, next) => {
  const admins = new Set((process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean));
  const email = String(res.locals.userEmail ?? '').toLowerCase();
  if (!email || !admins.has(email)) {
    return res.status(403).json({ error: 'Acesso restrito à administração.', code: 'ADMIN_REQUIRED' });
  }
  next();
};

export function getFirebaseAdminApp(): App {
  return getApps()[0] ?? initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export function firebaseAuthMiddleware(): RequestHandler {
  return createRequireFirebaseAuth(getAuth(getFirebaseAdminApp()));
}
