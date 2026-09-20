import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { Router, Request, Response } from 'express';
import { Firestore } from 'firebase-admin/firestore';
import { Question, StudyMethod, PodcastEpisode } from '../../src/types';
import { mockStudyMethods, mockPodcastEpisodes } from '../../src/data/mockData';

// O banco de questões não vive mais em mockData.ts (eram 1,5 MB entrando no
// bundle do cliente); o seed lê o mesmo arquivo estático que o app consome.
async function readLocalQuestionBank(): Promise<Question[]> {
  const file = path.join(process.cwd(), 'public', 'questions.json');
  return JSON.parse(await readFile(file, 'utf8')) as Question[];
}

// Mesmo motivo de server/literary/literaryAdminRoutes.ts: sem isso, uma
// rejeição não tratada num handler async derruba o processo Node inteiro e
// o Cloud Run passa a responder 503 pra TODAS as rotas até subir uma
// instância nova.
function asyncRoute(handler: (req: Request, res: Response) => Promise<unknown>) {
  return async (req: Request, res: Response) => {
    try {
      await handler(req, res);
    } catch (cause) {
      console.error('Erro em rota administrativa de content:', cause);
      res.status(500).json({ error: 'Erro interno ao processar a requisição.', code: 'INTERNAL_ERROR', detail: String(cause) });
    }
  };
}

// O Firestore recusa gravar um campo com valor `undefined` — comum aqui
// porque vários campos (chapter, examSource) são opcionais.
function stripUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

async function batchSet(db: Firestore, collection: string, docs: { id: string }[]): Promise<number> {
  const CHUNK = 450; // margem sob o limite de 500 operações por batch do Firestore
  for (let i = 0; i < docs.length; i += CHUNK) {
    const batch = db.batch();
    for (const doc of docs.slice(i, i + CHUNK)) {
      batch.set(db.collection(collection).doc(doc.id), doc);
    }
    await batch.commit();
  }
  return docs.length;
}

// Painel /admin/conteudo — move o banco de questões, métodos de estudo e
// episódios de podcast, antes hardcoded em src/data/mockData.ts, pro
// Firestore, pra dar pra adicionar conteúdo novo sem precisar de deploy.
// Segue o mesmo padrão de server/literary/literaryAdminRoutes.ts.
export function createContentAdminRouter(db: Firestore): Router {
  const router = Router();

  // Atualiza só um documento que já existe. set(..., { merge: true }) cria o
  // documento quando ele falta, então checar a existência depois de gravar
  // nunca dava 404: um PATCH num id errado gravava um documento pela metade e
  // respondia 200. O id vindo do corpo é ignorado para o documento não
  // acabar com um id diferente do caminho onde mora.
  const patchExisting = (collection: string, notFound: { error: string; code: string }) => asyncRoute(async (req, res) => {
    const ref = db.collection(collection).doc(req.params.id);
    if (!(await ref.get()).exists) return res.status(404).json(notFound);
    const { id: _ignoredId, ...patch } = stripUndefined(req.body ?? {}) as Record<string, unknown>;
    await ref.set(patch, { merge: true });
    res.json((await ref.get()).data());
  });

  // Idempotente: usa os ids já existentes no mock (.set() sobrescreve com o
  // mesmo valor, então rodar de novo não duplica nada) — mesma lógica do
  // /seed de literaryAdminRoutes.ts.
  router.post('/seed', asyncRoute(async (_req, res) => {
    const questionBank = await readLocalQuestionBank();
    const [questions, studyMethods, podcastEpisodes] = await Promise.all([
      batchSet(db, 'questions', questionBank),
      batchSet(db, 'studyMethods', mockStudyMethods),
      batchSet(db, 'podcastEpisodes', mockPodcastEpisodes),
    ]);
    res.json({ questions, studyMethods, podcastEpisodes });
  }));

  router.get('/questions', asyncRoute(async (req, res) => {
    const { topicId, subject } = req.query;
    let ref: FirebaseFirestore.Query = db.collection('questions');
    if (typeof topicId === 'string') ref = ref.where('topicId', '==', topicId);
    if (typeof subject === 'string') ref = ref.where('subject', '==', subject);
    const snap = await ref.get();
    res.json(snap.docs.map((d) => d.data()));
  }));

  router.post('/questions', asyncRoute(async (req, res) => {
    const { topicId, subject, prompt, options, correctOptionId, explanation, difficulty, chapter, examSource } = req.body ?? {};
    if (!topicId || !subject || !prompt || !Array.isArray(options) || options.length < 2 || !correctOptionId || !explanation || !difficulty) {
      return res.status(400).json({ error: 'Campos obrigatórios: topicId, subject, prompt, options (2+), correctOptionId, explanation, difficulty.', code: 'INVALID_QUESTION' });
    }
    const question: Question = stripUndefined({
      id: randomUUID(), topicId, subject, prompt, options, correctOptionId, explanation, difficulty, chapter, examSource,
    });
    await db.collection('questions').doc(question.id).set(question);
    res.json(question);
  }));

  router.patch('/questions/:id', patchExisting('questions', { error: 'Questão não encontrada.', code: 'QUESTION_NOT_FOUND' }));

  router.delete('/questions/:id', asyncRoute(async (req, res) => {
    await db.collection('questions').doc(req.params.id).delete();
    res.json({ ok: true });
  }));

  router.get('/study-methods', asyncRoute(async (_req, res) => {
    const snap = await db.collection('studyMethods').get();
    res.json(snap.docs.map((d) => d.data()));
  }));

  router.post('/study-methods', asyncRoute(async (req, res) => {
    const { name, category, summary, steps, bestFor } = req.body ?? {};
    if (!name || !category || !summary || !Array.isArray(steps) || steps.length === 0 || !Array.isArray(bestFor)) {
      return res.status(400).json({ error: 'Campos obrigatórios: name, category, summary, steps (1+), bestFor.', code: 'INVALID_METHOD' });
    }
    const method: StudyMethod = { id: randomUUID(), name, category, summary, steps, bestFor };
    await db.collection('studyMethods').doc(method.id).set(method);
    res.json(method);
  }));

  router.patch('/study-methods/:id', patchExisting('studyMethods', { error: 'Método não encontrado.', code: 'METHOD_NOT_FOUND' }));

  router.delete('/study-methods/:id', asyncRoute(async (req, res) => {
    await db.collection('studyMethods').doc(req.params.id).delete();
    res.json({ ok: true });
  }));

  router.get('/podcast-episodes', asyncRoute(async (_req, res) => {
    const snap = await db.collection('podcastEpisodes').get();
    res.json(snap.docs.map((d) => d.data()));
  }));

  router.post('/podcast-episodes', asyncRoute(async (req, res) => {
    const { topicId, title, subject, durationMinutes, script } = req.body ?? {};
    if (!topicId || !title || !subject || !durationMinutes || !script) {
      return res.status(400).json({ error: 'Campos obrigatórios: topicId, title, subject, durationMinutes, script.', code: 'INVALID_EPISODE' });
    }
    const episode: PodcastEpisode = { id: randomUUID(), topicId, title, subject, durationMinutes, script };
    await db.collection('podcastEpisodes').doc(episode.id).set(episode);
    res.json(episode);
  }));

  router.patch('/podcast-episodes/:id', patchExisting('podcastEpisodes', { error: 'Episódio não encontrado.', code: 'EPISODE_NOT_FOUND' }));

  router.delete('/podcast-episodes/:id', asyncRoute(async (req, res) => {
    await db.collection('podcastEpisodes').doc(req.params.id).delete();
    res.json({ ok: true });
  }));

  return router;
}
