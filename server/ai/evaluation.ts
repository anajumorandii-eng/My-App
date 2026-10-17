import { createHash, randomUUID } from "node:crypto";
import type { AiGenerationResult, AiTask } from "./types";
import type {
  EvaluationCandidate,
  EvaluationRun,
  EvaluationReview,
  EvaluationSession,
  EvaluationSummary,
  EvaluationVariant,
  VariantLabel,
} from "../../src/features/ai-evaluation/types";
import type { EvaluationStore } from "./evaluationStore";

export async function withinCaptureBudget<T>(
  operation: Promise<T>,
  milliseconds = 2_000,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new Error("Prazo de captura excedido.")),
          milliseconds,
        );
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export type CandidateRunner = (
  candidate: EvaluationCandidate,
  prompt: string,
  task: AiTask,
) => Promise<
  AiGenerationResult & { durationMs: number; firstTokenMs: number | null }
>;
export interface CaptureInput {
  requestId?: string;
  task: AiTask;
  source: string;
  payload: Record<string, unknown>;
  prompt: string;
  requestedModel: string;
  provider: string;
}
function bounded(text: string, bytes: number) {
  const data = Buffer.from(text);
  return {
    text:
      data.length <= bytes
        ? text
        : new TextDecoder("utf-8").decode(data.subarray(0, bytes)),
    truncated: data.length > bytes,
  };
}
function clean<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}
function variant(
  label: VariantLabel,
  candidateId?: string,
  requestedModel?: string,
): EvaluationVariant {
  return clean({
    label,
    candidateId,
    requestedModel,
    status: "running",
    text: "",
    durationMs: null,
    firstTokenMs: null,
    cached: false,
    fallback: false,
  });
}
export function publicRun(run: EvaluationRun): EvaluationRun {
  const copy = structuredClone(run);
  if (copy.kind === "comparison" && !copy.review)
    copy.variants = copy.variants.map(
      ({
        label,
        status,
        text,
        error,
        durationMs,
        firstTokenMs,
        cached,
        fallback,
        textTruncated,
      }) =>
        clean({
          label,
          status,
          text,
          error,
          durationMs,
          firstTokenMs,
          cached,
          fallback,
          textTruncated,
        }),
    );
  return copy;
}
export function validateReview(
  body: unknown,
  variants: EvaluationVariant[],
): EvaluationReview {
  const b = body as Partial<EvaluationReview>;
  if (
    !b ||
    !Array.isArray(b.variants) ||
    b.variants.some((v) => !v || typeof v !== "object") ||
    b.variants.length !== variants.length ||
    new Set(b.variants.map((v) => v.label)).size !== variants.length ||
    variants.some((v) => !b.variants!.some((r) => r.label === v.label))
  )
    throw new Error("Avalie todas as respostas uma única vez.");
  const reviews = b.variants.map((r) => {
    if (
      !r ||
      !["correct", "partial", "incorrect", "unchecked"].includes(r.correctness)
    )
      throw new Error("Avaliação de correção inválida.");
    for (const n of [r.clarity, r.instruction, r.usefulness])
      if (!Number.isInteger(n) || n < 1 || n > 5)
        throw new Error("Cada nota deve estar entre 1 e 5.");
    return {
      label: r.label,
      correctness: r.correctness,
      clarity: r.clarity,
      instruction: r.instruction,
      usefulness: r.usefulness,
    };
  });
  if (
    !["A", "B", "tie", "neither"].includes(b.preference!) ||
    (b.preference === "B" && !variants.some((v) => v.label === "B"))
  )
    throw new Error("Preferência inválida.");
  for (const x of [b.comment, b.outcome])
    if (x !== undefined && (typeof x !== "string" || x.length > 4000))
      throw new Error("Comentário deve ter até 4.000 caracteres.");
  return {
    variants: reviews,
    preference: b.preference!,
    comment: b.comment ?? "",
    outcome: b.outcome ?? "",
    reviewedAt: new Date().toISOString(),
  };
}
export class EvaluationService {
  constructor(
    readonly store: EvaluationStore,
    readonly candidates: EvaluationCandidate[],
    private readonly runner: CandidateRunner,
    private readonly random = Math.random,
  ) {}
  async start(uid: string, title: unknown) {
    if (typeof title !== "string" || !title.trim() || title.trim().length > 100)
      throw new Error("Informe um título de até 100 caracteres.");
    const session: EvaluationSession = {
      id: randomUUID(),
      title: title.trim(),
      status: "active",
      startedAt: new Date().toISOString(),
      endedAt: null,
      runCount: 0,
    };
    await this.store.start(uid, session);
    return session;
  }
  async detail(uid: string, id: string) {
    const session = await this.store.session(uid, id);
    if (!session) throw new Error("Sessão não encontrada.");
    const runs =
      session.status === "deleting" ? [] : await this.store.listRuns(uid, id);
    for (const run of runs) {
      if (
        run.status === "running" &&
        Date.now() - Date.parse(run.startedAt) > 10 * 60_000
      ) {
        run.status = "failed";
        run.variants = run.variants.map((v) =>
          v.status === "running"
            ? {
                ...v,
                status: "failed",
                error: "Geração interrompida antes de registrar a conclusão.",
              }
            : v,
        );
        await this.store.complete(uid, run);
      }
    }
    return { session, runs: runs.map(publicRun) };
  }
  async stop(uid: string, id: string) {
    await this.detail(uid, id);
    await this.store.stop(uid, id);
  }
  async delete(uid: string, id: string) {
    await this.store.delete(uid, id);
  }
  async begin(uid: string, input: CaptureInput): Promise<EvaluationRun | null> {
    const session = await this.store.active(uid);
    if (!session) return null;
    const prompt = bounded(input.prompt, 100_000);
    const run: EvaluationRun = {
      id: input.requestId ?? randomUUID(),
      sessionId: session.id,
      kind: "live",
      task: input.task,
      source: input.source.startsWith("/") ? input.source.slice(0, 200) : "",
      payload: clean(input.payload),
      prompt: prompt.text,
      promptVersion: createHash("sha256").update(input.prompt).digest("hex"),
      promptTruncated: prompt.truncated,
      startedAt: new Date().toISOString(),
      status: "running",
      variants: [
        {
          ...variant("A", undefined, input.requestedModel),
          provider: input.provider,
        },
      ],
    };
    if (!(await this.store.insert(uid, run)))
      throw new Error("Sessão encerrada ou limite de 200 registros atingido.");
    return run;
  }
  async finish(
    uid: string,
    run: EvaluationRun,
    result: AiGenerationResult | null,
    durationMs: number,
    firstTokenMs: number | null,
    partialText = "",
  ) {
    if (run.status !== "running") return;
    const text = bounded(result?.text ?? partialText, 64_000);
    run.status = result ? "completed" : "failed";
    run.variants[0] = clean({
      ...run.variants[0],
      status: run.status,
      text: text.text,
      textTruncated: text.truncated,
      durationMs,
      firstTokenMs,
      ...(result
        ? {
            model: result.model,
            provider: result.provider,
            cached: !!result.cached,
            fallback: !!result.fallback,
            usage: result.usage,
          }
        : { error: "A geração não foi concluída." }),
    });
    await this.store.complete(uid, run);
  }
  async rate(uid: string, sid: string, id: string, body: unknown) {
    const run = await this.store.run(uid, sid, id);
    if (!run) throw new Error("Registro não encontrado.");
    if (run.status === "running")
      throw new Error("Aguarde a conclusão do teste.");
    if (run.review)
      throw new Error(
        "A avaliação cega já foi concluída; registre um novo teste para comparar novamente.",
      );
    const review = validateReview(body, run.variants);
    await this.store.review(uid, sid, id, review);
    return publicRun({ ...run, review });
  }
  async followUp(uid: string, sid: string, id: string, outcome: unknown) {
    const run = await this.store.run(uid, sid, id);
    if (!run?.review) throw new Error("Registro avaliado não encontrado.");
    if (typeof outcome !== "string" || outcome.length > 4000)
      throw new Error("Comentário deve ter até 4.000 caracteres.");
    await this.store.followUp(uid, sid, id, outcome);
  }
  async compare(uid: string, sid: string, id: string, a: string, b: string) {
    const { session } = await this.detail(uid, sid);
    if (session.status !== "active")
      throw new Error("Inicie uma sessão ativa para comparar.");
    const seed = await this.store.run(uid, sid, id);
    if (!seed || seed.kind !== "live" || seed.status !== "completed")
      throw new Error("Escolha um registro concluído desta sessão.");
    if (seed.promptTruncated)
      throw new Error(
        "O prompt foi truncado; este registro não permite comparação fiel.",
      );
    if (a === b) throw new Error("Escolha candidatos diferentes.");
    const candidates = [a, b].map((cid) => {
      const c = this.candidates.find((c) => c.id === cid);
      if (!c) throw new Error("Candidato indisponível.");
      return c;
    });
    if (this.random() < 0.5) candidates.reverse();
    const run: EvaluationRun = {
      ...seed,
      id: randomUUID(),
      kind: "comparison",
      parentRunId: seed.id,
      startedAt: new Date().toISOString(),
      status: "running",
      variants: candidates.map((c, i) =>
        variant(i === 0 ? "A" : "B", c.id, c.model),
      ),
    };
    delete run.review;
    if (!(await this.store.insert(uid, run)))
      throw new Error("Sessão encerrada ou limite de 200 registros atingido.");
    await Promise.all(
      candidates.map(async (c, i) => {
        const start = Date.now();
        try {
          const r = await this.runner(c, seed.prompt, seed.task as AiTask);
          const text = bounded(r.text, 64_000);
          run.variants[i] = clean({
            ...run.variants[i],
            status: "completed",
            text: text.text,
            textTruncated: text.truncated,
            model: r.model,
            provider: r.provider,
            durationMs: r.durationMs,
            firstTokenMs: r.firstTokenMs,
            usage: r.usage,
            cached: !!r.cached,
            fallback: !!r.fallback,
          });
        } catch {
          run.variants[i] = {
            ...run.variants[i],
            status: "failed",
            durationMs: Date.now() - start,
            error:
              "Falha ao gerar esta resposta. Consulte os registros técnicos do gateway.",
          };
        }
      }),
    );
    run.status = run.variants.every((v) => v.status === "completed")
      ? "completed"
      : "failed";
    await this.store.complete(uid, run);
    return publicRun(run);
  }
}
export function evaluationSummary(runs: EvaluationRun[]): EvaluationSummary[] {
  const groups = new Map<
    string,
    {
      row: EvaluationSummary;
      time: number;
      first: number;
      use: number;
      prompts: Set<string>;
    }
  >();
  for (const run of runs)
    for (const v of run.variants) {
      const model =
        v.model ??
        (run.kind === "comparison"
          ? "Oculto até avaliar"
          : (v.requestedModel ?? "Não informado"));
      const key = JSON.stringify([run.task, run.source, run.kind, model]);
      if (!groups.has(key))
        groups.set(key, {
          row: {
            task: run.task,
            source: run.source,
            kind: run.kind,
            distinctPrompts: 0,
            model,
            samples: 0,
            failures: 0,
            cached: 0,
            measured: 0,
            averageDurationMs: null,
            averageFirstTokenMs: null,
            firstTokenSamples: 0,
            rated: 0,
            averageUsefulness: null,
            correctnessChecked: 0,
            correct: 0,
            wins: 0,
          },
          prompts: new Set<string>(),
          time: 0,
          first: 0,
          use: 0,
        });
      const g = groups.get(key)!;
      const r = g.row;
      g.prompts.add(run.promptVersion);
      r.samples++;
      if (v.status === "failed") r.failures++;
      if (v.cached) r.cached++;
      if (v.status === "completed" && !v.cached && v.durationMs !== null) {
        r.measured++;
        g.time += v.durationMs;
        if (v.firstTokenMs !== null) {
          r.firstTokenSamples++;
          g.first += v.firstTokenMs;
        }
      }
      const review = run.review?.variants.find((x) => x.label === v.label);
      if (review) {
        r.rated++;
        g.use += review.usefulness;
        if (review.correctness !== "unchecked") {
          r.correctnessChecked++;
          if (review.correctness === "correct") r.correct++;
        }
        if (run.kind === "comparison" && run.review?.preference === v.label)
          r.wins++;
      }
    }
  return [...groups.values()].map(({ row, time, first, use, prompts }) => ({
    ...row,
    distinctPrompts: prompts.size,
    averageDurationMs: row.measured ? Math.round(time / row.measured) : null,
    averageFirstTokenMs: row.firstTokenSamples
      ? Math.round(first / row.firstTokenSamples)
      : null,
    averageUsefulness: row.rated ? use / row.rated : null,
  }));
}
export function evaluationCsv(runs: EvaluationRun[]) {
  const cell = (v: unknown) => {
    let s = typeof v === "string" ? v : JSON.stringify(v ?? "");
    if (/^[\s\u0000-\u001f]*[=+@-]/.test(s)) s = "'" + s;
    return '"' + s.replaceAll('"', '""') + '"';
  };
  const rows: unknown[][] = [
    [
      "registro",
      "rotulo_resposta",
      "tipo",
      "tarefa",
      "tela",
      "data",
      "versao_prompt",
      "entrada",
      "prompt",
      "resposta",
      "modelo_solicitado",
      "modelo_reportado",
      "status",
      "duracao_ms",
      "primeiro_texto_ms",
      "cache",
      "fallback",
      "tokens",
      "truncado",
      "avaliacao",
      "preferencia",
      "comentario",
      "resultado_posterior",
    ],
  ];
  for (const r of runs.map(publicRun))
    for (const v of r.variants)
      rows.push([
        r.id,
        v.label,
        r.kind,
        r.task,
        r.source,
        r.startedAt,
        r.promptVersion,
        r.payload,
        r.prompt,
        v.text,
        v.requestedModel,
        v.model,
        v.status,
        v.durationMs,
        v.firstTokenMs,
        v.cached,
        v.fallback,
        v.usage?.totalTokens,
        !!v.textTruncated || r.promptTruncated,
        r.review?.variants.find((x) => x.label === v.label),
        r.review?.preference,
        r.review?.comment,
        r.review?.outcome,
      ]);
  return "\uFEFF" + rows.map((row) => row.map(cell).join(",")).join("\r\n");
}
