import express, { RequestHandler } from 'express';

/**
 * Cadeia que só lê o corpo JSON depois que todas as guardas deixaram passar.
 *
 * Rotas com corpo grande (ingestão de apostilas, obras literárias) precisam de
 * um parser próprio, acima dos 64kb do global. O parser do Express lê o corpo
 * inteiro antes de qualquer handler seguinte, então montá-lo depois das
 * guardas deixa a ordem certa por construção: a requisição recusada nunca é
 * lida.
 */
export function jsonBodyAfter(limit: string, ...guards: RequestHandler[]): RequestHandler[] {
  return [...guards, express.json({ limit })];
}
