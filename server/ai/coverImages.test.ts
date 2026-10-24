import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { createRequireFirebaseAuth, requireAdmin } from "../auth/firebaseAuth";
import { type AddressInfo } from "node:net";
import {
  CoverImageService,
  validateCoverContext,
  buildCoverImagePrompt,
  createCoverImageRouter,
} from "./coverImages";

const imageBytes = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
  "base64",
);
const context = {
  subject: "Literatura",
  work: "A vida não é útil",
  board: "UNICAMP",
};

test("capa valida apenas metadados limitados, recusando prompt, modelo ou URL do cliente", () => {
  assert.deepEqual(validateCoverContext(context), context);
  for (const payload of [
    null,
    [],
    {},
    { ...context, url: "https://elsewhere.test" },
    { ...context, model: "other-route" },
    { ...context, prompt: "override" },
    { ...context, subject: "x".repeat(301) },
  ]) {
    assert.throws(() => validateCoverContext(payload));
  }
});

test("prompt de ilustração mantém metadados como dados e reserva textos e moldura ao aplicativo", () => {
  const prompt = buildCoverImagePrompt(context);
  assert.match(prompt, /A vida não é útil/);
  assert.match(prompt, /transparent background/);
  assert.match(prompt, /No text, lettering, labels, borders/);
});

test("revisões não reintroduzem medalhão nem cartões radiais no vocabulário enviado", () => {
  for (const topic of ["Funções", "Geometria plana", "Logaritmos e exponenciais"]) {
    const prompt = buildCoverImagePrompt({ subject: "Matemática", topic, purpose: "Revisão aprofundada" });
    assert.match(prompt, /Revision cover: compose a compact illustrated field/);
    assert.match(prompt, /ornamental scientific atlas/);
    assert.match(prompt, /muted botanical green, oxblood accents and antique copper/);
    assert.match(prompt, /topic below determines the objects/);
    assert.doesNotMatch(prompt, /recall cards arranged around|central subject medallion|restrained circular path/);
    assert.match(prompt, new RegExp(topic));
  }
});

test("aprofundamento e revisão compartilham linguagem visual mas pedem composições diferentes", () => {
  const data = { subject: "Química", topic: "Termoquímica", subtopic: "Entalpia" };
  const study = buildCoverImagePrompt({ ...data, purpose: "Aprofundamento" });
  const review = buildCoverImagePrompt({ ...data, purpose: "Revisão estratégica" });
  assert.match(study, /Deepening cover: compose a tall, richly developed scientific tableau/);
  assert.doesNotMatch(study, /Revision cover:/);
  assert.match(review, /Revision cover:/);
  assert.doesNotMatch(review, /Deepening cover:/);
  for (const prompt of [study, review]) {
    assert.match(prompt, /Termoquímica/);
    assert.match(prompt, /Entalpia/);
    assert.match(prompt, /Vary the scene for this specific document/);
    assert.doesNotMatch(prompt, /open, asymmetrical/);
  }
});

test("gera uma única imagem no endpoint de imagens com autenticação apenas no servidor", async () => {
  let request: { url?: string; init?: RequestInit } = {};
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1/",
    apiKey: "private-client-key",
    model: "cover-image-route",
    fetch: async (url, init) => {
      request = { url: String(url), init };
      return Response.json({
        data: [{ b64_json: imageBytes.toString("base64") }],
      });
    },
  });
  const result = await service.generate(context);
  assert.equal(request.url, "https://gateway.test/v1/images/generations");
  assert.equal(
    (request.init!.headers as Record<string, string>).Authorization,
    "Bearer private-client-key",
  );
  const body = JSON.parse(String(request.init!.body));
  assert.equal(body.model, "cover-image-route");
  assert.equal(body.n, 1);
  assert.equal(body.background, "transparent");
  assert.equal(body.response_format, "b64_json");
  assert.equal(
    result.dataUrl,
    `data:image/png;base64,${imageBytes.toString("base64")}`,
  );
  assert.ok(!JSON.stringify(result).includes("private-client-key"));
});

test("recusa URL remota e conteúdo ativo em vez de buscá-los com a credencial do gateway", async () => {
  for (const item of [
    { url: "https://elsewhere.test/image" },
    { b64_json: Buffer.from('<svg onload="alert(1)"/>').toString("base64") },
  ]) {
    let calls = 0;
    const service = new CoverImageService({
      baseUrl: "https://gateway.test/v1",
      apiKey: "private-client-key",
      model: "cover-image-route",
      fetch: async () => {
        calls++;
        return Response.json({ data: [item] });
      },
    });
    await assert.rejects(service.generate(context));
    assert.equal(calls, 1);
  }
});

test("erro do gateway não expõe o corpo nem a chave e não aciona rota de conversação", async () => {
  let calls = 0;
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "private-client-key",
    model: "cover-image-route",
    fetch: async () => {
      calls++;
      return new Response("private-client-key upstream secret", {
        status: 403,
      });
    },
  });
  await assert.rejects(
    service.generate(context),
    (error: Error) => !/private-client-key|upstream secret/.test(error.message),
  );
  assert.equal(calls, 1);
});

test("sem configuração não tenta gerar e exige modelo de imagens explícito no servidor", async () => {
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "private-client-key",
  });
  assert.equal(service.isConfigured, false);
  await assert.rejects(service.generate(context));
});

test("aborta a chamada que excede o tempo limite", async () => {
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    timeoutMs: 10,
    fetch: async (_url, init) =>
      new Promise<Response>((_resolve, reject) => {
        init!.signal!.addEventListener(
          "abort",
          () => reject(new DOMException("Timeout", "AbortError")),
          { once: true },
        );
      }),
  });
  // A timer keeps the test process alive while AbortSignal.timeout is unreferenced.
  const keepAlive = setInterval(() => {}, 100);
  try {
    await assert.rejects(service.generate(context));
  } finally {
    clearInterval(keepAlive);
  }
});

test("rota devolve capacidade e imagem, valida antes da cota e bloqueia geração não configurada", async () => {
  let consumed = 0;
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    fetch: async () =>
      Response.json({ data: [{ b64_json: imageBytes.toString("base64") }] }),
  });
  const app = express();
  app.use(express.json());
  app.use(
    "/cover",
    createCoverImageRouter(service, (_req, _res, next) => {
      consumed++;
      next();
    }),
  );
  app.use(
    "/disabled",
    createCoverImageRouter(new CoverImageService({}), (_req, _res, next) => {
      consumed++;
      next();
    }),
  );
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/cover`;
  try {
    assert.deepEqual(await (await fetch(base)).json(), { enabled: true });
    assert.deepEqual(
      await (await fetch(base.replace("/cover", "/disabled"))).json(),
      { enabled: false },
    );
    assert.equal(
      (
        await fetch(base.replace("/cover", "/disabled"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(context),
        })
      ).status,
      503,
    );
    assert.equal(consumed, 0);
    assert.equal(
      (
        await fetch(base, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...context, model: "override" }),
        })
      ).status,
      400,
    );
    assert.equal(consumed, 0);
    const response = await fetch(base, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context),
    });
    assert.equal(response.status, 200);
    assert.equal(consumed, 1);
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.match(
      ((await response.json()) as { dataUrl: string }).dataUrl,
      /^data:image\/png;base64,/,
    );
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("limita o tamanho da resposta antes de analisar JSON", async () => {
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    fetch: async () => new Response(new Uint8Array(9 * 1024 * 1024 + 1)),
  });
  await assert.rejects(service.generate(context), /tamanho permitido/);
});

test("corpos malformados, PNG truncado e dimensões excessivas não são aceitos", async () => {
  const huge = Buffer.from(imageBytes);
  huge.writeUInt32BE(10000, 16);
  for (const response of [
    () => new Response("{"),
    () => Response.json(null),
    () =>
      Response.json({
        data: [{ b64_json: imageBytes.subarray(0, 24).toString("base64") }],
      }),
    () => Response.json({ data: [{ b64_json: huge.toString("base64") }] }),
  ]) {
    const service = new CoverImageService({
      baseUrl: "https://gateway.test/v1",
      apiKey: "key",
      model: "cover-image-route",
      fetch: async () => response(),
    });
    await assert.rejects(service.generate(context));
  }
});

test("autenticação e administração verificadas bloqueiam geração antes de atingir o gateway", async () => {
  const previous = process.env.ADMIN_EMAILS;
  process.env.ADMIN_EMAILS = "admin@example.test";
  let calls = 0;
  const service = new CoverImageService({
    baseUrl: "https://gateway.test/v1",
    apiKey: "key",
    model: "cover-image-route",
    fetch: async () => {
      calls++;
      return Response.json({
        data: [{ b64_json: imageBytes.toString("base64") }],
      });
    },
  });
  const app = express();
  app.use(express.json());
  app.use(
    "/cover",
    createRequireFirebaseAuth({
      verifyIdToken: async (token) => ({
        uid: "uid",
        email: token === "admin" ? "admin@example.test" : "other@example.test",
        email_verified: token !== "unverified",
      }),
    }),
    requireAdmin,
    createCoverImageRouter(service, (_req, _res, next) => next()),
  );
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/cover`;
  const send = (token?: string) =>
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(context),
    });
  try {
    assert.equal((await send()).status, 401);
    assert.equal((await send("other")).status, 403);
    assert.equal((await send("unverified")).status, 403);
    assert.equal(calls, 0);
    assert.equal((await send("admin")).status, 200);
    assert.equal(calls, 1);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    if (previous === undefined) delete process.env.ADMIN_EMAILS;
    else process.env.ADMIN_EMAILS = previous;
  }
});
