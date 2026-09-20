import { RequestHandler } from 'express';

// Seis meses. Sem includeSubDomains nem preload de propósito: fixar HTTPS em
// subdomínios que este servidor não controla seria decisão de quem gerencia o
// domínio, não do código.
const HSTS_MAX_AGE_SECONDS = 15_552_000;

// Recursos que o app não usa (conferido em src/: nenhuma chamada a câmera,
// microfone, geolocalização, USB ou pagamento). Negá-los deixa um script
// injetado sem acesso a eles. Se um dia o app passar a usar um deles, é aqui
// que se libera.
const PERMISSIONS_POLICY = 'camera=(), microphone=(), geolocation=(), payment=(), usb=()';

/**
 * Cabeçalhos de proteção que valem para toda resposta, inclusive 404 e erro.
 *
 * Não inclui uma Content-Security-Policy de conteúdo: escrevê-la sem exercitar
 * o app num navegador (login do Firebase em popup, Firestore, fontes) derruba
 * telas. Só a diretiva frame-ancestors entra, que não tem esse risco e reforça
 * o X-Frame-Options.
 */
export function securityHeaders(options: { hsts: boolean }): RequestHandler {
  return (_req, res, next) => {
    // O Express liga este cabeçalho antes de qualquer middleware nosso.
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', PERMISSIONS_POLICY);
    if (options.hsts) res.setHeader('Strict-Transport-Security', `max-age=${HSTS_MAX_AGE_SECONDS}`);
    next();
  };
}
