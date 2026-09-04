import { App, applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { RequestHandler } from 'express';

interface TokenVerifier {
  verifyIdToken(token: string, checkRevoked?: boolean): Promise<{ uid: string; email?: string; email_verified?: boolean }>;
}

function bearerToken(header: string | undefined): string | null {
  const match = header?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export function createRequireFirebaseAuth(verifier: TokenVerifier, options?: { checkRevoked?: boolean }): RequestHandler {
  return async (req, res, next) => {
    const token = bearerToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({ error: 'Entre na sua conta para usar a IA.', code: 'AUTH_REQUIRED' });
    }

    try {
      const decoded = await verifier.verifyIdToken(token, options?.checkRevoked === true);
      res.locals.userId = decoded.uid;
      res.locals.userEmail = decoded.email;
      res.locals.userEmailVerified = decoded.email_verified === true;
      next();
    } catch {
      return res.status(401).json({ error: 'Sua sessão expirou. Entre novamente.', code: 'INVALID_AUTH_TOKEN' });
    }
  };
}

// O e-mail precisa estar verificado: sem isso, uma conta criada por provedor
// de senha com um e-mail da lista ainda não cadastrado receberia o papel de
// administradora sem nunca provar que é dona daquele endereço.
export const requireAdmin: RequestHandler = (_req, res, next) => {
  const admins = new Set((process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean));
  const email = String(res.locals.userEmail ?? '').toLowerCase();
  if (!email || !admins.has(email) || res.locals.userEmailVerified !== true) {
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

export function firebaseAuthMiddleware(options?: { checkRevoked?: boolean }): RequestHandler {
  return createRequireFirebaseAuth(getAuth(getFirebaseAdminApp()), options);
}

// Rotas administrativas checam revogação a cada requisição: sem isso, uma
// conta desativada continuaria administrando até o ID token dela expirar
// sozinho, o que leva até uma hora. Custa uma ida a mais ao Firebase, aceitável
// no volume dessas rotas.
export function adminAuthMiddleware(): RequestHandler {
  return firebaseAuthMiddleware({ checkRevoked: true });
}
