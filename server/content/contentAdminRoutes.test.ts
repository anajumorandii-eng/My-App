import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test, { TestContext } from 'node:test';
import type { Firestore } from 'firebase-admin/firestore';
import { mockPodcastEpisodes, mockStudyMethods } from '../../src/data/mockData';
import { FakeFirestore } from '../testing/fakeFirestore';
import { withApp, sendJson } from '../testing/httpTestServer';
import { createContentAdminRouter } from './contentAdminRoutes';

const BASE = '/api/admin/content';

const QUESTAO = {
  topicId: 'bio-fungos',
  subject: 'Biologia',
  prompt: 'Qual estrutura forma o micélio?',
  options: [{ id: 'a', text: 'Hifas' }, { id: 'b', text: 'Esporos' }],
  correctOptionId: 'a',
  explanation: 'O micélio é o conjunto de hifas.',
  difficulty: 'easy',
};

const METODO = { name: 'Pomodoro', category: 'tempo', summary: 'Blocos curtos.', steps: ['25 min'], bestFor: ['foco'] };
const EPISODIO = { topicId: 'bio-fungos', title: 'Fungos', subject: 'Biologia', durationMinutes: 8, script: 'Olá' };

async function withContent(db: Firestore, run: (baseUrl: string) => Promise<void>) {
  await withApp((app) => {
    app.use(BASE, createContentAdminRouter(db));
  }, run);
}

function silenciarErros(t: TestContext) {
  t.mock.method(console, 'error', () => undefined);
}

test('criar questão grava com id novo e descarta campos opcionais indefinidos', async () => {
  const db = new FakeFirestore();
  await withContent(db.asFirestore(), async (baseUrl) => {
    const res = await sendJson(baseUrl, 'POST', `${BASE}/questions`, QUESTAO);
    assert.equal(res.status, 200);
    const criada = await res.json() as { id: string } & Record<string, unknown>;
    assert.match(criada.id, /^[0-9a-f-]{36}$/);
    assert.equal('chapter' in criada, false);
    assert.deepEqual(db.store.get(`questions/${criada.id}`), criada);
  });
});

test('criar questão recusa campo faltando ou menos de duas opções e não grava nada', async () => {
  const db = new FakeFirestore();
  await withContent(db.asFirestore(), async (baseUrl) => {
    const invalidos = [
      {},
      { ...QUESTAO, prompt: '' },
      { ...QUESTAO, options: [{ id: 'a', text: 'só uma' }] },
      { ...QUESTAO, options: 'não é lista' },
      { ...QUESTAO, correctOptionId: undefined },
    ];
    for (const corpo of invalidos) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/questions`, corpo);
      assert.equal(res.status, 400, JSON.stringify(corpo).slice(0, 60));
      assert.equal(((await res.json()) as { code: string }).code, 'INVALID_QUESTION');
    }
    assert.equal(db.store.size, 0);
  });
});

test('listar questões filtra por matéria e por tópico', async () => {
  const db = new FakeFirestore()
    .seed('questions/q1', { id: 'q1', subject: 'Biologia', topicId: 't1' })
    .seed('questions/q2', { id: 'q2', subject: 'Biologia', topicId: 't2' })
    .seed('questions/q3', { id: 'q3', subject: 'Física', topicId: 't1' });

  await withContent(db.asFirestore(), async (baseUrl) => {
    const ids = async (query: string) => ((await (await sendJson(baseUrl, 'GET', `${BASE}/questions${query}`)).json()) as { id: string }[]).map((q) => q.id).sort();
    assert.deepEqual(await ids(''), ['q1', 'q2', 'q3']);
    assert.deepEqual(await ids('?subject=Biologia'), ['q1', 'q2']);
    assert.deepEqual(await ids('?subject=Biologia&topicId=t2'), ['q2']);
  });
});

for (const [rota, colecao, seedDoc, codigo] of [
  ['questions', 'questions', { id: 'x1', prompt: 'antigo', subject: 'Biologia' }, 'QUESTION_NOT_FOUND'],
  ['study-methods', 'studyMethods', { id: 'x1', name: 'antigo' }, 'METHOD_NOT_FOUND'],
  ['podcast-episodes', 'podcastEpisodes', { id: 'x1', title: 'antigo' }, 'EPISODE_NOT_FOUND'],
] as const) {
  test(`PATCH em ${rota} atualiza só os campos enviados e preserva o resto`, async () => {
    const db = new FakeFirestore().seed(`${colecao}/x1`, seedDoc);
    await withContent(db.asFirestore(), async (baseUrl) => {
      const res = await sendJson(baseUrl, 'PATCH', `${BASE}/${rota}/x1`, { extra: 'novo' });
      assert.equal(res.status, 200);
      assert.deepEqual(await res.json(), { ...seedDoc, extra: 'novo' });
    });
  });

  test(`PATCH em ${rota} num id que não existe é 404 e não cria documento`, async () => {
    const db = new FakeFirestore();
    await withContent(db.asFirestore(), async (baseUrl) => {
      const res = await sendJson(baseUrl, 'PATCH', `${BASE}/${rota}/nao-existe`, { prompt: 'x', name: 'x', title: 'x' });
      assert.equal(res.status, 404);
      assert.equal(((await res.json()) as { code: string }).code, codigo);
      assert.equal(db.store.size, 0, 'o PATCH não pode criar um documento pela metade');
    });
  });

  test(`PATCH em ${rota} não deixa o corpo trocar o id do documento`, async () => {
    const db = new FakeFirestore().seed(`${colecao}/x1`, seedDoc);
    await withContent(db.asFirestore(), async (baseUrl) => {
      const res = await sendJson(baseUrl, 'PATCH', `${BASE}/${rota}/x1`, { id: 'outro', extra: 'novo' });
      assert.equal(res.status, 200);
      assert.equal(db.store.get(`${colecao}/x1`)?.id, 'x1');
    });
  });

  test(`DELETE em ${rota} remove o documento`, async () => {
    const db = new FakeFirestore().seed(`${colecao}/x1`, seedDoc);
    await withContent(db.asFirestore(), async (baseUrl) => {
      const res = await sendJson(baseUrl, 'DELETE', `${BASE}/${rota}/x1`);
      assert.deepEqual(await res.json(), { ok: true });
      assert.equal(db.store.has(`${colecao}/x1`), false);
    });
  });
}

test('criar método de estudo exige passos e público-alvo', async () => {
  const db = new FakeFirestore();
  await withContent(db.asFirestore(), async (baseUrl) => {
    for (const corpo of [{}, { ...METODO, steps: [] }, { ...METODO, bestFor: 'foco' }, { ...METODO, name: '' }]) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/study-methods`, corpo);
      assert.equal(res.status, 400);
      assert.equal(((await res.json()) as { code: string }).code, 'INVALID_METHOD');
    }
    assert.equal(db.store.size, 0);

    const ok = await sendJson(baseUrl, 'POST', `${BASE}/study-methods`, METODO);
    assert.equal(ok.status, 200);
    assert.equal(db.store.size, 1);
  });
});

test('criar episódio de podcast exige todos os campos', async () => {
  const db = new FakeFirestore();
  await withContent(db.asFirestore(), async (baseUrl) => {
    for (const faltando of ['topicId', 'title', 'subject', 'durationMinutes', 'script']) {
      const res = await sendJson(baseUrl, 'POST', `${BASE}/podcast-episodes`, { ...EPISODIO, [faltando]: undefined });
      assert.equal(res.status, 400, faltando);
      assert.equal(((await res.json()) as { code: string }).code, 'INVALID_EPISODE');
    }
    assert.equal(db.store.size, 0);

    const ok = await sendJson(baseUrl, 'POST', `${BASE}/podcast-episodes`, EPISODIO);
    assert.equal(ok.status, 200);
  });
});

test('erro inesperado no Firestore vira 500 em JSON em vez de derrubar o processo', async (t) => {
  silenciarErros(t);
  const quebrado = { collection: () => { throw new Error('Firestore fora do ar'); } } as unknown as Firestore;
  await withContent(quebrado, async (baseUrl) => {
    const res = await sendJson(baseUrl, 'GET', `${BASE}/study-methods`);
    assert.equal(res.status, 500);
    assert.equal(((await res.json()) as { code: string }).code, 'INTERNAL_ERROR');
  });
});

test('o seed grava o banco inteiro em lotes dentro do limite e rodar de novo não duplica', async () => {
  const db = new FakeFirestore();
  const totalQuestoes = (JSON.parse(readFileSync('public/questions.json', 'utf8')) as unknown[]).length;

  await withContent(db.asFirestore(), async (baseUrl) => {
    const primeira = await (await sendJson(baseUrl, 'POST', `${BASE}/seed`)).json();
    assert.deepEqual(primeira, { questions: totalQuestoes, studyMethods: mockStudyMethods.length, podcastEpisodes: mockPodcastEpisodes.length });
    const gravados = db.store.size;
    assert.equal(gravados, totalQuestoes + mockStudyMethods.length + mockPodcastEpisodes.length);

    await sendJson(baseUrl, 'POST', `${BASE}/seed`);
    assert.equal(db.store.size, gravados);
  });
});
