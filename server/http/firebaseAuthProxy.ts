import type { RequestHandler } from 'express';

const AUTH_ORIGIN = 'https://gen-lang-client-0346381323.firebaseapp.com';

/** Serve Firebase's auth helpers on the app origin, including its storage iframe. */
export function firebaseAuthProxy(): RequestHandler {
  return async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.setHeader('Allow', 'GET, HEAD');
      res.status(405).end();
      return;
    }
    try {
      // Concatenate a fixed origin: query parameters must never choose the upstream.
      const upstream = await fetch(`${AUTH_ORIGIN}/__/auth${req.url}`, {
        method: req.method,
        redirect: 'manual',
        signal: AbortSignal.timeout(15_000),
      });
      res.status(upstream.status);
      for (const header of ['content-type', 'location', 'cache-control']) {
        const value = upstream.headers.get(header);
        if (value) res.setHeader(header, value);
      }
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'no-store');
      res.end(req.method === 'HEAD' ? undefined : Buffer.from(await upstream.arrayBuffer()));
    } catch {
      res.status(502).type('text/plain').send('Não foi possível carregar o login. Tente novamente.');
    }
  };
}
