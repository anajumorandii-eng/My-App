import type { AddressInfo } from 'node:net';
import express from 'express';

/**
 * Sobe um app Express numa porta livre, com o parser de JSON global (como o
 * server.ts) e o ambiente 'test' — nele o handler de erro padrão não imprime
 * o stack de erros que o teste provoca de propósito.
 */
export async function withApp(mount: (app: express.Express) => void, run: (baseUrl: string) => Promise<void>): Promise<void> {
  const app = express();
  app.set('env', 'test');
  app.use(express.json());
  mount(app);
  const server = app.listen(0);
  try {
    await new Promise((resolve) => server.once('listening', resolve));
    const { port } = server.address() as AddressInfo;
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

export function sendJson(baseUrl: string, method: string, path: string, body?: unknown): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
