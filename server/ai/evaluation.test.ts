import assert from "node:assert/strict";
import test from "node:test";
import {
  EvaluationService,
  publicRun,
  validateReview,
  evaluationCsv,
  evaluationSummary,
} from "./evaluation";
import type { EvaluationStore } from "./evaluationStore";
import type {
  EvaluationRun,
  EvaluationSession,
} from "../../src/features/ai-evaluation/types";

import { MemoryStore } from "./testing/evaluationMemoryStore";
const candidate = (id: string) => ({
  id,
  label: `Candidato ${id}`,
  model: `private-${id}`,
});
const input = {
  task: "review-tip" as const,
  source: "/revisoes",
  payload: { topic: "Memória" },
  prompt: "Explique memória.",
  requestedModel: "private-base",
  provider: "test",
};
function setup() {
  const store = new MemoryStore();
  const service = new EvaluationService(
    store,
    [candidate("one"), candidate("two")],
    async (c, prompt) => ({
      text: `Resposta para ${prompt}`,
      model: c.model,
      provider: "test",
      durationMs: 20,
      firstTokenMs: 5,
    }),
    () => 0.1,
  );
  return { store, service };
}

test("captura exige sessão ativa e mantém contas isoladas", async () => {
  const { service, store } = setup();
  assert.equal(await service.begin("ana", input), null);
  const session = await service.start("ana", "Teste");
  assert.equal(await service.begin("outra", input), null);
  const run = await service.begin("ana", input);
  assert.ok(run);
  await service.finish(
    "ana",
    run,
    { text: "Resposta", model: "private-base", provider: "test" },
    30,
    4,
  );
  assert.equal((await store.listRuns("ana", session.id)).length, 1);
  assert.equal((await store.listRuns("outra", session.id)).length, 0);
  await assert.rejects(
    () => service.detail("outra", session.id),
    /não encontrada/,
  );
});

test("encerrar impede novas capturas e excluir não ressuscita chamada em andamento", async () => {
  const { service, store } = setup();
  const s = await service.start("ana", "Teste");
  const r = await service.begin("ana", input);
  assert.ok(r);
  await service.stop("ana", s.id);
  assert.equal(await service.begin("ana", input), null);
  await service.finish(
    "ana",
    r,
    { text: "fim", model: "x", provider: "test" },
    10,
    null,
  );
  assert.equal((await store.listRuns("ana", s.id))[0].status, "completed");
  await service.delete("ana", s.id);
  await service.finish(
    "ana",
    r,
    { text: "fim", model: "x", provider: "test" },
    10,
    null,
  );
  assert.equal((await store.listRuns("ana", s.id)).length, 0);
});

test("A/B usa o mesmo prompt, preserva falhas e esconde identidade até avaliação completa", async () => {
  const { service } = setup();
  const s = await service.start("ana", "Teste");
  const seed = await service.begin("ana", input);
  assert.ok(seed);
  await service.finish(
    "ana",
    seed,
    { text: "Base", model: "private-base", provider: "test" },
    10,
    null,
  );
  const r = await service.compare("ana", s.id, seed.id, "one", "two");
  assert.equal(r.variants.length, 2);
  assert.equal(r.variants[0].text, "Resposta para Explique memória.");
  const blind = JSON.stringify(publicRun(r));
  assert.ok(!blind.includes("private-"));
  assert.ok(!blind.includes("candidateId"));
  const csv = evaluationCsv([publicRun(r)]);
  assert.ok(!csv.includes("private-"));
  const review = {
    variants: r.variants.map((v) => ({
      label: v.label,
      correctness: "unchecked",
      clarity: 4,
      instruction: 4,
      usefulness: 4,
    })),
    preference: "tie",
    comment: "",
    outcome: "",
  };
  await service.rate("ana", s.id, r.id, review);
  const revealed = await service.detail("ana", s.id);
  assert.ok(JSON.stringify(revealed).includes("private-one"));
  await assert.rejects(
    () => service.compare("outra", s.id, seed.id, "one", "two"),
    /não encontrada/,
  );
});

test("recusa comparação com candidato desconhecido, repetido ou prompt truncado", async () => {
  const { service } = setup();
  const s = await service.start("ana", "Teste");
  const r = await service.begin("ana", input);
  assert.ok(r);
  await service.finish(
    "ana",
    r,
    { text: "x", model: "x", provider: "test" },
    10,
    null,
  );
  await assert.rejects(
    () => service.compare("ana", s.id, r.id, "one", "missing"),
    /candidato/i,
  );
  await assert.rejects(
    () => service.compare("ana", s.id, r.id, "one", "one"),
    /diferentes/i,
  );
  const large = await service.begin("ana", {
    ...input,
    prompt: "á".repeat(100000),
  });
  assert.ok(large);
  await service.finish(
    "ana",
    large,
    { text: "x", model: "x", provider: "test" },
    10,
    null,
  );
  await assert.rejects(
    () => service.compare("ana", s.id, large.id, "one", "two"),
    /truncado/i,
  );
});

test("notas exigem rubrica completa e preferência válida, sem aprovação implícita", () => {
  const { service } = setup();
  void service;
  const variants = [
    { label: "A" },
    { label: "B" },
  ] as EvaluationRun["variants"];
  assert.throws(
    () =>
      validateReview(
        { variants: [{ label: "A", clarity: 5 }], preference: "A" },
        variants,
      ),
    /avali/i,
  );
  assert.throws(
    () =>
      validateReview(
        {
          variants: [
            {
              label: "A",
              correctness: "unchecked",
              clarity: 8,
              instruction: 4,
              usefulness: 4,
            },
            {
              label: "B",
              correctness: "unchecked",
              clarity: 4,
              instruction: 4,
              usefulness: 4,
            },
          ],
          preference: "A",
        },
        variants,
      ),
    /nota/i,
  );
});

test("CSV neutraliza fórmulas e relatório não mistura cache nem modelos ocultos", async () => {
  const { service } = setup();
  const s = await service.start("ana", "=Teste");
  const r = await service.begin("ana", {
    ...input,
    payload: { topic: "=SUM(1,2)" },
  });
  assert.ok(r);
  await service.finish(
    "ana",
    r,
    { text: "=1+1", model: "private-base", provider: "test", cached: true },
    10,
    null,
  );
  const view = (await service.detail("ana", s.id)).runs;
  assert.ok(evaluationCsv(view).includes("'=1+1"));
  const summary = evaluationSummary(view);
  assert.equal(summary[0].cached, 1);
  assert.equal(summary[0].measured, 0);
});

test("comparação persiste erro de um candidato sem perder a outra resposta", async () => {
  const store = new MemoryStore();
  const service = new EvaluationService(
    store,
    [candidate("one"), candidate("two")],
    async (c) => {
      if (c.id === "one") throw new Error("private-upstream-token");
      return {
        text: "ok",
        model: c.model,
        provider: "test",
        durationMs: 4,
        firstTokenMs: 2,
      };
    },
  );
  const s = await service.start("ana", "Teste");
  const r = await service.begin("ana", input);
  assert.ok(r);
  await service.finish(
    "ana",
    r,
    { text: "x", model: "x", provider: "test" },
    1,
    null,
  );
  const pair = await service.compare("ana", s.id, r.id, "one", "two");
  assert.equal(pair.status, "failed");
  assert.equal(pair.variants.filter((v) => v.status === "completed").length, 1);
  assert.ok(
    !JSON.stringify(publicRun(pair)).includes("private-upstream-token"),
  );
});

test("resultado posterior pode ser atualizado sem mudar notas ou desfazer a revelação", async () => {
  const { service } = setup();
  const s = await service.start("ana", "Teste");
  const r = await service.begin("ana", input);
  assert.ok(r);
  await service.finish(
    "ana",
    r,
    { text: "x", model: "x", provider: "test" },
    1,
    null,
  );
  await service.rate("ana", s.id, r.id, {
    variants: [
      {
        label: "A",
        correctness: "unchecked",
        clarity: 4,
        instruction: 4,
        usefulness: 4,
      },
    ],
    preference: "A",
  });
  await service.followUp("ana", s.id, r.id, "Resolvi outra questão sem ajuda.");
  const reviewed = (await service.detail("ana", s.id)).runs[0];
  assert.equal(reviewed.review?.outcome, "Resolvi outra questão sem ajuda.");
  assert.equal(reviewed.review?.variants[0].clarity, 4);
  await assert.rejects(
    () => service.followUp("outra", s.id, r.id, "x"),
    /não encontrado/,
  );
});

test("registro abandonado não permanece como geração em andamento indefinidamente", async () => {
  const { service, store } = setup();
  const session = await service.start("ana", "Interrupção");
  const run = await service.begin("ana", input);
  assert.ok(run);
  run.startedAt = new Date(Date.now() - 11 * 60_000).toISOString();
  await store.complete("ana", run);
  const detail = await service.detail("ana", session.id);
  assert.equal(detail.runs[0].status, "failed");
  assert.match(detail.runs[0].variants[0].error ?? "", /interrompida/i);
});

test("relatório separa telas e uso real de A/B e mostra entradas distintas", async () => {
  const { service } = setup();
  const session = await service.start("ana", "Contextos");
  for (const source of ["/tutor", "/redacao"]) {
    const run = await service.begin("ana", {
      ...input,
      task: "answer-correction",
      source,
    });
    assert.ok(run);
    await service.finish(
      "ana",
      run,
      { text: "Resposta", model: "same-model", provider: "test" },
      10,
      null,
    );
  }
  const detail = await service.detail("ana", session.id);
  const summary = evaluationSummary(detail.runs);
  assert.equal(summary.length, 2);
  assert.equal(summary[0].distinctPrompts, 1);
  assert.equal(summary[0].kind, "live");
});

test("persistência lenta tem prazo limitado para não prender o estudo", async () => {
  const { withinCaptureBudget } = await import("./evaluation");
  await assert.rejects(
    () => withinCaptureBudget(new Promise(() => {}), 10),
    /captura/i,
  );
  assert.equal(
    await withinCaptureBudget(Promise.resolve("salvo"), 10),
    "salvo",
  );
});

test("conclusão repetida não altera a resposta que já foi avaliada", async () => {
  const { service } = setup();
  const session = await service.start("ana", "Estabilidade");
  const run = await service.begin("ana", input);
  assert.ok(run);
  await service.finish(
    "ana",
    run,
    { text: "Original", model: "m", provider: "test" },
    1,
    null,
  );
  await service.rate("ana", session.id, run.id, {
    variants: [
      {
        label: "A",
        correctness: "unchecked",
        clarity: 4,
        instruction: 4,
        usefulness: 4,
      },
    ],
    preference: "A",
  });
  await service.finish(
    "ana",
    run,
    { text: "Não deve substituir", model: "m", provider: "test" },
    2,
    null,
  );
  assert.equal(
    (await service.detail("ana", session.id)).runs[0].variants[0].text,
    "Original",
  );
});

test("campos opcionais ausentes são omitidos antes da escrita no Firestore", async () => {
  const { service } = setup();
  await service.start("ana", "Campos opcionais");
  const run = await service.begin("ana", {
    ...input,
    payload: {
      topic: "x",
      question: undefined,
      context: { chapter: undefined },
    },
  });
  assert.ok(run);
  assert.equal(Object.hasOwn(run.payload, "question"), false);
  assert.deepEqual(run.payload.context, {});
});
