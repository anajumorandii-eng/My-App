import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

// Cada rota /api montada em server.ts precisa carregar uma guarda na própria
// instrução: login do Firebase, login de admin ou segredo compartilhado. O
// teste lê o código-fonte porque server.ts sobe o app inteiro ao ser importado
// (Firebase Admin, Firestore) e não dá para montá-lo num teste.
const GUARDAS = [
  'firebaseAuthMiddleware(',
  'adminAuthMiddleware(',
  'process.env.CRON_SECRET',
  'process.env.APOSTILA_INGEST_SECRET',
];

// Única rota pública de propósito. Qualquer outra entrada aqui é uma decisão
// que precisa aparecer numa revisão.
const PUBLICAS = new Set(['/api/health']);

async function montagens(): Promise<Array<{ caminho: string; instrucao: string }>> {
  const source = await readFile(new URL('../../server.ts', import.meta.url), 'utf-8');
  const semComentarios = source.replace(/^\s*\/\/.*$/gm, '');
  const encontradas: Array<{ caminho: string; instrucao: string }> = [];
  // O recorte por ';' deixa o fim de um bloco anterior (uma função, um if)
  // colado no começo da instrução seguinte; por isso a montagem é procurada
  // em qualquer linha do pedaço, e a instrução começa nela.
  for (const pedaco of semComentarios.split(/;\s*\n/)) {
    const montagem = /^[ \t]*app\.(?:use|get|post|put|patch|delete)\(\s*'(\/api\/[^']*)'/m.exec(pedaco);
    if (montagem) encontradas.push({ caminho: montagem[1], instrucao: pedaco.slice(montagem.index).trim() });
  }
  return encontradas;
}

test('o teste encontra as rotas /api do server.ts (senão ele passaria vazio)', async () => {
  const caminhos = (await montagens()).map((m) => m.caminho);
  for (const esperado of ['/api/health', '/api/ai', '/api/admin', '/api/admin/content', '/api/podcast-audio', '/api/internal', '/api/push', '/api/calendar/events', '/api/drive/files', '/api/oauth/google']) {
    assert.ok(caminhos.includes(esperado), `não achei a montagem de ${esperado}`);
  }
});

test('toda rota /api, exceto /api/health, é montada com uma guarda de acesso', async () => {
  const semGuarda = (await montagens())
    .filter(({ caminho }) => !PUBLICAS.has(caminho))
    .filter(({ instrucao }) => !GUARDAS.some((guarda) => instrucao.includes(guarda)))
    .map(({ caminho }) => caminho);
  assert.deepEqual(semGuarda, []);
});

test('as rotas administrativas exigem login com revogação checada e a checagem de admin', async () => {
  const admin = (await montagens()).filter(({ caminho }) => caminho.startsWith('/api/admin'));
  assert.ok(admin.length >= 2);
  for (const { caminho, instrucao } of admin) {
    assert.match(instrucao, /adminAuthMiddleware\(\)/, caminho);
    assert.match(instrucao, /requireAdmin/, caminho);
  }
});
