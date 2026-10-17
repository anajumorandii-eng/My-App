import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import type { AddressInfo } from "node:net";
import { EvaluationService } from "./evaluation";
import { MemoryStore } from "./testing/evaluationMemoryStore";
import {
  createEvaluationRouter,
  evaluationCandidates,
} from "./evaluationRoutes";
import { createAiRouter } from "./routes";
import { AiService } from "./service";
import { createRequireFirebaseAuth, requireAdmin } from "../auth/firebaseAuth";
import type { AiProvider } from "./types";

async function server(
  run: (url: string, service: EvaluationService) => Promise<void>,
  overrides: Partial<AiProvider> = {},
) {
  const store = new MemoryStore();
  const service = new EvaluationService(
    store,
    [
      { id: "a", label: "Principal", model: "private-a" },
      { id: "b", label: "Alternativa", model: "private-b" },
    ],
    async (c) => ({
      text: "teste",
      model: c.model,
      provider: "test",
      durationMs: 1,
      firstTokenMs: null,
    }),
  );
  const app = express();
  app.use(express.json());
  app.use(
    createRequireFirebaseAuth({
      verifyIdToken: async (token) => ({
        uid: token,
        email: token === "ana" ? "ana@example.test" : "other@example.test",
        email_verified: true,
      }),
    }),
  );
  const quota = {
    calls: 0,
    consume: async () => {
      quota.calls++;
      return { allowed: true, remaining: 100 };
    },
  };
  app.use("/evaluation", requireAdmin, createEvaluationRouter(service, quota));
  const provider: AiProvider = {
    name: "test",
    model: "private-a",
    isConfigured: true,
    generate: async () => ({ text: "Resposta capturada", model: "private-a" }),
    async *generateStream() {
      yield "Resposta ";
      yield "em fluxo";
      return { text: "Resposta em fluxo", model: "private-a" };
    },
  };
  Object.assign(provider, overrides);
  app.use(
    "/ai",
    createAiRouter(new AiService(provider), undefined, undefined, service),
  );
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = "ana@example.test";
  const http = app.listen(0);
  await new Promise<void>((r) => http.once("listening", r));
  const { port } = http.address() as AddressInfo;
  try {
    await run(`http://127.0.0.1:${port}`, service);
  } finally {
    process.env.ADMIN_EMAILS = previous;
    await new Promise((r) => http.close(r));
  }
}
const headers = {
  Authorization: "Bearer ana",
  "Content-Type": "application/json",
};
const post = (url: string, body: unknown, extra = {}) =>
  fetch(url, {
    method: "POST",
    headers: { ...headers, ...extra },
    body: JSON.stringify(body),
  });

test("captura JSON e SSE só para administradora com sessão ativa; estudo continua sem captura", async () => {
  await server(async (url, service) => {
    const payload = { topic: "x", subject: "y", level: 50, daysSinceReview: 2 };
    await post(url + "/ai/review-tip", payload);
    assert.deepEqual(await service.store.listSessions("ana"), []);
    const s = await service.start("ana", "Uso real");
    const json = await post(url + "/ai/review-tip", payload, {
      "X-Crivo-Source": "/revisoes",
    });
    assert.equal(json.status, 200);
    assert.equal((await json.json()).evaluationCapture, "saved");
    const sse = await post(
      url + "/ai/review-tip?stream=1",
      { ...payload, topic: "z" },
      { Accept: "text/event-stream" },
    );
    const text = await sse.text();
    assert.ok(text.includes("evaluationCapture"));
    assert.ok(text.includes("saved"));
    const detail = await service.detail("ana", s.id);
    assert.equal(detail.runs.length, 2);
    assert.ok(detail.runs.some((r) => r.source === "/revisoes"));
    await post(url + "/ai/review-tip", payload, {
      Authorization: "Bearer other",
    });
    assert.equal((await service.detail("ana", s.id)).runs.length, 2);
  });
});

test("rotas administrativas bloqueiam outra conta e exportação preserva cegamento", async () => {
  await server(async (url, service) => {
    const forbidden = await fetch(url + "/evaluation/sessions", {
      headers: { Authorization: "Bearer other" },
    });
    assert.equal(forbidden.status, 403);
    const s = await service.start("ana", "Teste");
    const seed = await service.begin("ana", {
      task: "review-tip",
      source: "/",
      payload: {},
      prompt: "Mesmo prompt",
      requestedModel: "private-a",
      provider: "test",
    });
    assert.ok(seed);
    await service.finish(
      "ana",
      seed,
      { text: "base", model: "private-a", provider: "test" },
      1,
      null,
    );
    const compare = await post(url + `/evaluation/sessions/${s.id}/compare`, {
      runId: seed.id,
      a: "a",
      b: "b",
    });
    assert.equal(compare.status, 201);
    const body = await compare.json();
    assert.ok(!JSON.stringify(body).includes("private-"));
    const out = await fetch(
      url + `/evaluation/sessions/${s.id}/export?format=json`,
      { headers },
    );
    const data = await out.json();
    const pair = data.runs.find((r: any) => r.kind === "comparison");
    assert.ok(!JSON.stringify(pair).includes("private-"));
  });
});

test("catálogo não aceita endpoint arbitrário nem duplicação silenciosa", () => {
  assert.throws(
    () =>
      evaluationCandidates({
        AI_EVALUATION_MODELS:
          '[{"id":"x","label":"x","model":"m","baseUrl":"https://evil.test"}]',
      }),
    /configuração/i,
  );
  assert.throws(
    () =>
      evaluationCandidates({
        AI_EVALUATION_MODELS:
          '[{"id":"x","label":"x","model":"m"},{"id":"x","label":"y","model":"n"}]',
      }),
    /configuração/i,
  );
});

test("falha de persistência informa perda de captura sem interromper a resposta do estudo", async () => {
  await server(async (url, service) => {
    service.store.active = async () => {
      throw new Error("storage unavailable");
    };
    const response = await post(url + "/ai/review-tip", {
      topic: "x",
      subject: "y",
      level: 50,
      daysSinceReview: 2,
    });
    const result = await response.json();
    assert.equal(response.status, 200);
    assert.equal(result.text, "Resposta capturada");
    assert.equal(result.evaluationCapture, "failed");
  });
});

test("falha no streaming guarda texto parcial e estado de falha", async () => {
  await server(
    async (url, service) => {
      const session = await service.start("ana", "Interrupção");
      const response = await post(
        url + "/ai/review-tip?stream=1",
        { topic: "x", subject: "y", level: 50, daysSinceReview: 2 },
        { Accept: "text/event-stream" },
      );
      const text = await response.text();
      assert.ok(text.includes("AI_GENERATION_FAILED"));
      const detail = await service.detail("ana", session.id);
      assert.equal(detail.runs[0].status, "failed");
      assert.equal(detail.runs[0].variants[0].text, "Parte preservada");
    },
    {
      async *generateStream() {
        yield "Parte preservada";
        throw new Error("upstream interrupted");
      },
    },
  );
});
