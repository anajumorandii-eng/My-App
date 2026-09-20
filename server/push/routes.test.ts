import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import test, { TestContext } from 'node:test';
import express, { RequestHandler } from 'express';
import type { Firestore } from 'firebase-admin/firestore';
import { createPushRouter, createReviewReminderRouter } from './routes';
import { webPush } from './webPush';

const CRON_SECRET = 'cron-secreto-de-teste-123456';
const VAPID = { publicKey: 'pub', privateKey: 'priv', subject: 'mailto:teste@example.com' };
const KEYS = { p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA', auth: 'tBHItJI5svbpez7KI4CCXg' };
const FCM = 'https://fcm.googleapis.com/fcm/send/dXNlcjpmY20';
const MASTERY_URGENTE = {
  items: [{ topicId: 't1', level: 40, uncertainty: 0.5, lastReviewed: '2020-01-01T00:00:00.000Z', errorSignals: 3 }],
};

type Store = Record<string, Record<string, Record<string, unknown>>>;

// Firestore de mentira só com o caminho que o código usa:
// users/{uid}/data/{documento}, mais listDocuments() em users.
function fakeFirestore(store: Store): Firestore {
  return {
    collection: (name: string) => {
      assert.equal(name, 'users');
      return {
        listDocuments: async () => Object.keys(store).map((id) => ({ id })),
        doc: (uid: string) => ({
          collection: (sub: string) => {
            assert.equal(sub, 'data');
            return {
              doc: (docName: string) => ({
                get: async () => ({ exists: docName in (store[uid] ?? {}), data: () => store[uid]?.[docName] }),
                set: async (value: Record<string, unknown>, options?: { merge?: boolean }) => {
                  store[uid] ??= {};
                  store[uid][docName] = options?.merge ? { ...store[uid][docName], ...value } : value;
                },
                delete: async () => { delete store[uid]?.[docName]; },
              }),
            };
          },
        }),
      };
    },
  } as unknown as Firestore;
}

async function withApp(mount: (app: express.Express) => void, run: (baseUrl: string) => Promise<void>) {
  const app = express();
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

const authComoAluna: RequestHandler = (_req, res, next) => {
  res.locals.userId = 'aluna1';
  next();
};

function subscribe(baseUrl: string, endpoint: string) {
  return fetch(`${baseUrl}/api/push/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint, keys: KEYS }),
  });
}

test('/subscribe recusa endpoint de host que não é serviço de push e não grava nada', async () => {
  const store: Store = {};
  await withApp((app) => {
    app.use('/api/push', createPushRouter(fakeFirestore(store), 'pub', authComoAluna));
  }, async (baseUrl) => {
    const res = await subscribe(baseUrl, 'https://169.254.169.254/latest/meta-data');
    assert.equal(res.status, 400);
    assert.equal(((await res.json()) as { code: string }).code, 'INVALID_SUBSCRIPTION');
    assert.deepEqual(store, {});
  });
});

test('/subscribe aceita endpoint de serviço de push e grava a forma canônica', async () => {
  const store: Store = {};
  await withApp((app) => {
    app.use('/api/push', createPushRouter(fakeFirestore(store), 'pub', authComoAluna));
  }, async (baseUrl) => {
    const res = await subscribe(baseUrl, 'HTTPS://FCM.googleapis.com:443/fcm/send/dXNlcjpmY20');
    assert.equal(res.status, 204);
    assert.deepEqual(store.aluna1.pushSubscription, { endpoint: FCM, keys: KEYS });
  });
});

function enviarLembretes(baseUrl: string) {
  return fetch(`${baseUrl}/api/push/send-review-reminders`, {
    method: 'POST',
    headers: { 'x-cron-secret': CRON_SECRET },
  });
}

// Só a chamada de rede do web-push é simulada — é o limite que este teste
// existe para vigiar. O restante do roteador roda de verdade.
function simularEnvio(t: TestContext) {
  t.mock.method(console, 'warn', () => undefined);
  return t.mock.method(webPush, 'sendNotification', async () => ({ statusCode: 201, body: '', headers: {} }));
}

test('o lembrete não contata um endpoint adulterado, mas também não apaga a inscrição', async (t) => {
  const envio = simularEnvio(t);
  // O navegador pode escrever direto em users/{uid}/data/pushSubscription
  // (firestore.rules), então o endpoint guardado não é confiável. Apagar
  // seria o erro oposto: se a lista de hosts ficar defasada, uma inscrição
  // legítima seria perdida sem volta. Basta não contatar o host.
  const adulterada = { endpoint: 'https://169.254.169.254/latest/meta-data', keys: KEYS };
  const store: Store = {
    aluna1: { pushSubscription: { ...adulterada }, mastery: MASTERY_URGENTE },
  };

  await withApp((app) => {
    app.use('/api/push', createReviewReminderRouter(fakeFirestore(store), VAPID, CRON_SECRET));
  }, async (baseUrl) => {
    const res = await enviarLembretes(baseUrl);
    assert.equal(res.status, 200);
    const body = await res.json() as { sent: number; rejected: number };
    assert.equal(body.sent, 0);
    assert.equal(body.rejected, 1);
    assert.equal(envio.mock.callCount(), 0);
    assert.deepEqual(store.aluna1.pushSubscription, adulterada);
  });
});

test('uma inscrição adulterada não impede o lembrete da aluna seguinte', async (t) => {
  const envio = simularEnvio(t);
  const store: Store = {
    alunaAdulterada: {
      pushSubscription: { endpoint: 'https://evil.example.com/collect', keys: KEYS },
      mastery: MASTERY_URGENTE,
    },
    alunaNormal: {
      pushSubscription: { endpoint: FCM, keys: KEYS },
      mastery: MASTERY_URGENTE,
    },
  };

  await withApp((app) => {
    app.use('/api/push', createReviewReminderRouter(fakeFirestore(store), VAPID, CRON_SECRET));
  }, async (baseUrl) => {
    const body = await (await enviarLembretes(baseUrl)).json() as { sent: number; rejected: number };
    assert.equal(body.sent, 1);
    assert.equal(body.rejected, 1);
    assert.equal(envio.mock.callCount(), 1);
    const [assinatura] = envio.mock.calls[0].arguments;
    assert.equal((assinatura as { endpoint: string }).endpoint, FCM);
    assert.equal(store.alunaNormal.pushSubscription.lastReminderSentDate, new Date().toISOString().slice(0, 10));
  });
});

test('o lembrete envia normalmente para um endpoint legítimo', async (t) => {
  const envio = simularEnvio(t);
  const store: Store = {
    aluna1: { pushSubscription: { endpoint: FCM, keys: KEYS }, mastery: MASTERY_URGENTE },
  };

  await withApp((app) => {
    app.use('/api/push', createReviewReminderRouter(fakeFirestore(store), VAPID, CRON_SECRET));
  }, async (baseUrl) => {
    const body = await (await enviarLembretes(baseUrl)).json() as { sent: number; rejected: number; failed: number };
    assert.deepEqual({ sent: body.sent, rejected: body.rejected, failed: body.failed }, { sent: 1, rejected: 0, failed: 0 });
    assert.equal(envio.mock.callCount(), 1);
  });
});
