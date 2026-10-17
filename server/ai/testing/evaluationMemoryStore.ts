import type { EvaluationStore } from "../evaluationStore";
import type {
  EvaluationRun,
  EvaluationSession,
} from "../../../src/features/ai-evaluation/types";
export class MemoryStore implements EvaluationStore {
  sessions = new Map<string, EvaluationSession>();
  runs = new Map<string, EvaluationRun>();
  private key(uid: string, id: string) {
    return `${uid}/${id}`;
  }
  async listSessions(uid: string) {
    return [...this.sessions.entries()]
      .filter(([k]) => k.startsWith(`${uid}/`))
      .map(([, v]) => v);
  }
  async start(uid: string, s: EvaluationSession) {
    if ((await this.listSessions(uid)).some((x) => x.status === "active"))
      throw new Error("Já existe uma sessão ativa.");
    this.sessions.set(this.key(uid, s.id), s);
  }
  async active(uid: string) {
    return (
      (await this.listSessions(uid)).find((s) => s.status === "active") ?? null
    );
  }
  async session(uid: string, id: string) {
    return this.sessions.get(this.key(uid, id)) ?? null;
  }
  async stop(uid: string, id: string) {
    const s = await this.session(uid, id);
    if (s)
      this.sessions.set(this.key(uid, id), {
        ...s,
        status: "stopped",
        endedAt: new Date().toISOString(),
      });
  }
  async insert(uid: string, run: EvaluationRun) {
    const s = await this.session(uid, run.sessionId);
    if (!s || s.status !== "active" || s.runCount >= 200) return false;
    this.sessions.set(this.key(uid, s.id), { ...s, runCount: s.runCount + 1 });
    this.runs.set(this.key(uid, run.id), structuredClone(run));
    return true;
  }
  async complete(uid: string, run: EvaluationRun) {
    if (await this.session(uid, run.sessionId))
      this.runs.set(this.key(uid, run.id), structuredClone(run));
  }
  async listRuns(uid: string, sid: string) {
    return [...this.runs.entries()]
      .filter(([k, r]) => k.startsWith(`${uid}/`) && r.sessionId === sid)
      .map(([, r]) => structuredClone(r));
  }
  async run(uid: string, sid: string, id: string) {
    return (await this.listRuns(uid, sid)).find((r) => r.id === id) ?? null;
  }
  async review(
    uid: string,
    sid: string,
    id: string,
    review: EvaluationRun["review"],
  ) {
    const r = await this.run(uid, sid, id);
    if (r) this.runs.set(this.key(uid, id), { ...r, review });
  }
  async followUp(uid: string, sid: string, id: string, outcome: string) {
    const r = await this.run(uid, sid, id);
    if (r?.review)
      this.runs.set(this.key(uid, id), {
        ...r,
        review: { ...r.review, outcome },
      });
  }
  async delete(uid: string, sid: string) {
    this.sessions.delete(this.key(uid, sid));
    for (const [k, r] of this.runs)
      if (k.startsWith(`${uid}/`) && r.sessionId === sid) this.runs.delete(k);
  }
}
