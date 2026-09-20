import express, { RequestHandler } from 'express';

/**
 * Cadeia que só lê o corpo JSON depois que todas as guardas deixaram passar.
 *
 * O parser do Express lê e interpreta o corpo inteiro, até o limite, antes de
 * qualquer handler que venha depois dele. Com o parser de 20mb de
 * /api/internal e o de 50mb de /api/admin/literary montados na frente do
 * segredo e do login, um cliente anônimo fazia o servidor bufferizar essa
 * quantidade por requisição para só então receber 401. Passar as guardas por
 * aqui torna a ordem certa a única possível: a requisição recusada nunca
 * chega a ser lida.
 */
export function jsonBodyAfter(limit: string, ...guards: RequestHandler[]): RequestHandler[] {
  return [...guards, express.json({ limit })];
}
