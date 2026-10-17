import type { Firestore } from "firebase-admin/firestore";
import { EvaluationService } from "./evaluation";
import { FirestoreEvaluationStore } from "./evaluationStore";
import { evaluationCandidates } from "./evaluationRoutes";
import { OmniRouteProvider } from "./omniRouteProvider";
import { AiService, parseAiTimeout } from "./service";

export function createEvaluationService(
  db: Firestore,
  env: NodeJS.ProcessEnv = process.env,
) {
  let candidates: ReturnType<typeof evaluationCandidates> = [];
  try {
    candidates = evaluationCandidates(env);
  } catch {
    console.warn(
      "Evaluation candidates configuration invalid; comparisons disabled.",
    );
  }
  if (env.AI_PROVIDER?.trim().toLowerCase() !== "omniroute") candidates = [];
  return new EvaluationService(
    new FirestoreEvaluationStore(db),
    candidates,
    async (candidate, prompt, task) => {
      const provider = new OmniRouteProvider({
        baseUrl: env.OMNIROUTE_BASE_URL,
        apiKey: env.OMNIROUTE_API_KEY,
        deepModel: candidate.model,
        fastModel: candidate.model,
      });
      const service = new AiService(
        provider,
        parseAiTimeout(env.AI_TIMEOUT_MS),
        0,
      );
      const started = Date.now();
      let firstTokenMs: number | null = null;
      const stream = service.generateStream({ task, prompt });
      try {
        for (;;) {
          const part = await stream.next();
          if (part.done === true)
            return {
              ...part.value,
              durationMs: Date.now() - started,
              firstTokenMs,
            };
          if (firstTokenMs === null && part.value)
            firstTokenMs = Date.now() - started;
        }
      } finally {
        await stream.return?.(undefined as never);
      }
    },
  );
}
