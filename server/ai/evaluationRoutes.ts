import { Router } from "express";
import type { RequestHandler } from "express";
import type { DailyQuotaStore } from "./rateLimit";
import { saoPauloDate } from "./rateLimit";
import {
  evaluationCsv,
  evaluationSummary,
  EvaluationService,
} from "./evaluation";
import type { EvaluationCandidate } from "../../src/features/ai-evaluation/types";

export function evaluationCandidates(
  env: NodeJS.ProcessEnv = process.env,
): EvaluationCandidate[] {
  if (
    env.AI_PROVIDER?.trim().toLowerCase() !== "omniroute" &&
    !env.AI_EVALUATION_MODELS
  )
    return [];
  if (env.AI_EVALUATION_MODELS) {
    let rows: unknown;
    try {
      rows = JSON.parse(env.AI_EVALUATION_MODELS);
    } catch {
      throw new Error("Configuração de candidatos inválida.");
    }
    if (!Array.isArray(rows) || rows.length < 2 || rows.length > 8)
      throw new Error("Configuração de candidatos inválida.");
    const ids = new Set<string>();
    const models = new Set<string>();
    return rows.map((r) => {
      if (
        !r ||
        typeof r !== "object" ||
        Object.keys(r).some((k) => !["id", "label", "model"].includes(k)) ||
        typeof r.id !== "string" ||
        !/^[a-zA-Z0-9_-]{1,40}$/.test(r.id) ||
        typeof r.label !== "string" ||
        !r.label.trim() ||
        r.label.length > 80 ||
        typeof r.model !== "string" ||
        !r.model.trim() ||
        r.model.length > 200 ||
        /[\s\u0000-\u001f]/.test(r.model) ||
        ids.has(r.id) ||
        models.has(r.model)
      )
        throw new Error("Configuração de candidatos inválida.");
      ids.add(r.id);
      models.add(r.model);
      return { id: r.id, label: r.label.trim(), model: r.model };
    });
  }
  const choices = [
    {
      id: "primary",
      label: "Principal",
      model: env.AI_DEEP_MODEL || env.OMNIROUTE_MODEL,
    },
    {
      id: "fast",
      label: "Rápido",
      model: env.AI_FAST_MODEL || env.OMNIROUTE_MODEL,
    },
  ];
  return choices.filter(
    (c, i) => c.model && choices.findIndex((x) => x.model === c.model) === i,
  ) as EvaluationCandidate[];
}
export function isEvaluationAdmin(
  locals: Record<string, unknown>,
  env: NodeJS.ProcessEnv = process.env,
) {
  const email = String(locals.userEmail ?? "").toLowerCase();
  return (
    !!email &&
    locals.userEmailVerified === true &&
    (env.ADMIN_EMAILS ?? "")
      .split(",")
      .some((e) => e.trim().toLowerCase() === email)
  );
}
export function createEvaluationRouter(
  service: EvaluationService,
  quota: DailyQuotaStore,
): Router {
  const router = Router();
  router.use((_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  const route =
    (fn: RequestHandler): RequestHandler =>
    async (req, res, next) => {
      try {
        await fn(req, res, next);
      } catch (error) {
        const message = error instanceof Error ? error.message : "";
        const expected =
          /^(Informe|Já existe|Limite|Sessão|Registro|Avalie|Avaliação|Cada nota|Preferência|Comentário|Aguarde|A avaliação|Inicie|Escolha|O prompt|Candidato)/.test(
            message,
          );
        if (!expected) console.warn("Evaluation operation failed.");
        res
          .status(
            expected ? (message.includes("não encontrad") ? 404 : 400) : 503,
          )
          .json({
            error: expected
              ? message
              : "Não foi possível acessar o histórico de avaliação.",
            code: "EVALUATION_FAILED",
          });
      }
    };
  router.param("sessionId", (req, res, next, id) =>
    /^[a-f0-9-]{36}$/.test(id)
      ? next()
      : res.status(400).json({ error: "Sessão inválida." }),
  );
  router.param("runId", (req, res, next, id) =>
    /^[a-f0-9-]{36}$/.test(id)
      ? next()
      : res.status(400).json({ error: "Registro inválido." }),
  );
  router.get(
    "/sessions",
    route(async (_req, res) => {
      res.json({
        sessions: await service.store.listSessions(res.locals.userId),
        candidates: service.candidates.map(({ id, label }) => ({ id, label })),
        maxRuns: 200,
      });
    }),
  );
  router.post(
    "/sessions",
    route(async (req, res) => {
      if (req.body?.consent !== true)
        return void res.status(400).json({
          error: "Confirme a gravação das entradas e respostas para iniciar.",
        });
      res
        .status(201)
        .json(await service.start(res.locals.userId, req.body.title));
    }),
  );
  router.get(
    "/sessions/:sessionId",
    route(async (req, res) => {
      const detail = await service.detail(
        res.locals.userId,
        req.params.sessionId,
      );
      res.json({ ...detail, summary: evaluationSummary(detail.runs) });
    }),
  );
  router.post(
    "/sessions/:sessionId/stop",
    route(async (req, res) => {
      await service.stop(res.locals.userId, req.params.sessionId);
      res.json({ ok: true });
    }),
  );
  router.delete(
    "/sessions/:sessionId",
    route(async (req, res) => {
      await service.delete(res.locals.userId, req.params.sessionId);
      res.json({ ok: true });
    }),
  );
  router.post(
    "/sessions/:sessionId/runs/:runId/review",
    route(async (req, res) => {
      res.json(
        await service.rate(
          res.locals.userId,
          req.params.sessionId,
          req.params.runId,
          req.body,
        ),
      );
    }),
  );
  router.patch(
    "/sessions/:sessionId/runs/:runId/outcome",
    route(async (req, res) => {
      await service.followUp(
        res.locals.userId,
        req.params.sessionId,
        req.params.runId,
        req.body?.outcome,
      );
      res.json({ ok: true });
    }),
  );
  router.post(
    "/sessions/:sessionId/compare",
    route(async (req, res) => {
      const { runId, a, b } = req.body ?? {};
      if (
        typeof runId !== "string" ||
        !/^[a-f0-9-]{36}$/.test(runId) ||
        typeof a !== "string" ||
        typeof b !== "string" ||
        a === b ||
        ![a, b].every((id) => service.candidates.some((c) => c.id === id))
      )
        return void res.status(400).json({
          error: "Escolha dois candidatos diferentes e um registro válido.",
        });
      const detail = await service.detail(
        res.locals.userId,
        req.params.sessionId,
      );
      const seed = detail.runs.find((run) => run.id === runId);
      if (
        detail.session.status !== "active" ||
        detail.session.runCount >= 200 ||
        !seed ||
        seed.kind !== "live" ||
        seed.status !== "completed" ||
        seed.promptTruncated
      )
        return void res
          .status(400)
          .json({
            error:
              "Escolha um registro completo, sem truncamento, de uma sessão ativa com espaço disponível.",
          });
      const max = Number(process.env.AI_DAILY_LIMIT) || 100;
      for (let i = 0; i < 2; i++) {
        const allowance = await quota.consume(
          res.locals.userId,
          saoPauloDate(),
          max,
        );
        if (!allowance.allowed)
          return void res.status(429).json({
            error: "Cota diária insuficiente para duas chamadas de comparação.",
          });
      }
      res
        .status(201)
        .json(
          await service.compare(
            res.locals.userId,
            req.params.sessionId,
            runId,
            a,
            b,
          ),
        );
    }),
  );
  router.get(
    "/sessions/:sessionId/export",
    route(async (req, res) => {
      const detail = await service.detail(
        res.locals.userId,
        req.params.sessionId,
      );
      const csv = req.query.format === "csv";
      res.setHeader("Cache-Control", "no-store");
      res.attachment(`avaliacao-${detail.session.id}.${csv ? "csv" : "json"}`);
      if (csv)
        res.type("text/csv; charset=utf-8").send(evaluationCsv(detail.runs));
      else
        res.json({
          ...detail,
          summary: evaluationSummary(detail.runs),
          schemaVersion: 1,
        });
    }),
  );
  return router;
}
