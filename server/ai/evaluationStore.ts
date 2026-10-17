import type { Firestore } from "firebase-admin/firestore";
import type {
  EvaluationRun,
  EvaluationSession,
} from "../../src/features/ai-evaluation/types";
export interface EvaluationStore {
  listSessions(uid: string): Promise<EvaluationSession[]>;
  start(uid: string, session: EvaluationSession): Promise<void>;
  active(uid: string): Promise<EvaluationSession | null>;
  session(uid: string, id: string): Promise<EvaluationSession | null>;
  stop(uid: string, id: string): Promise<void>;
  insert(uid: string, run: EvaluationRun): Promise<boolean>;
  complete(uid: string, run: EvaluationRun): Promise<void>;
  listRuns(uid: string, sid: string): Promise<EvaluationRun[]>;
  run(uid: string, sid: string, id: string): Promise<EvaluationRun | null>;
  review(
    uid: string,
    sid: string,
    id: string,
    review: EvaluationRun["review"],
  ): Promise<void>;
  followUp(
    uid: string,
    sid: string,
    id: string,
    outcome: string,
  ): Promise<void>;
  delete(uid: string, sid: string): Promise<void>;
}
export class FirestoreEvaluationStore implements EvaluationStore {
  constructor(private readonly db: Firestore) {}
  private owner(uid: string) {
    return this.db.collection("aiEvaluationUsers").doc(uid);
  }
  private ref(uid: string, id: string) {
    return this.owner(uid).collection("sessions").doc(id);
  }
  async listSessions(uid: string) {
    const s = await this.owner(uid).collection("sessions").limit(50).get();
    return s.docs
      .map((d) => d.data() as EvaluationSession)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }
  async start(uid: string, session: EvaluationSession) {
    await this.db.runTransaction(async (tx) => {
      const owner = this.owner(uid);
      const state = await tx.get(owner);
      if (state.get("activeSessionId"))
        throw new Error("Já existe uma sessão ativa.");
      const count = Number(state.get("sessionCount") ?? 0);
      if (count >= 50)
        throw new Error("Limite de 50 sessões. Exclua uma sessão anterior.");
      tx.set(
        owner,
        { activeSessionId: session.id, sessionCount: count + 1 },
        { merge: true },
      );
      tx.create(this.ref(uid, session.id), session);
    });
  }
  async active(uid: string) {
    const state = await this.owner(uid).get();
    const id = state.get("activeSessionId");
    return typeof id === "string" ? this.session(uid, id) : null;
  }
  async session(uid: string, id: string) {
    const s = await this.ref(uid, id).get();
    return s.exists ? (s.data() as EvaluationSession) : null;
  }
  async stop(uid: string, id: string) {
    await this.db.runTransaction(async (tx) => {
      const ref = this.ref(uid, id);
      const owner = this.owner(uid);
      const [s, state] = await Promise.all([tx.get(ref), tx.get(owner)]);
      if (!s.exists || s.get("status") === "deleting")
        throw new Error("Sessão não encontrada.");
      tx.update(ref, { status: "stopped", endedAt: new Date().toISOString() });
      if (state.get("activeSessionId") === id)
        tx.set(owner, { activeSessionId: null }, { merge: true });
    });
  }
  async insert(uid: string, run: EvaluationRun) {
    return this.db.runTransaction(async (tx) => {
      const ref = this.ref(uid, run.sessionId);
      const s = await tx.get(ref);
      if (
        !s.exists ||
        s.get("status") !== "active" ||
        Number(s.get("runCount")) >= 200
      )
        return false;
      tx.update(ref, { runCount: Number(s.get("runCount")) + 1 });
      tx.create(ref.collection("runs").doc(run.id), run);
      return true;
    });
  }
  async complete(uid: string, run: EvaluationRun) {
    await this.db.runTransaction(async (tx) => {
      const session = this.ref(uid, run.sessionId);
      const ref = session.collection("runs").doc(run.id);
      const [s, r] = await Promise.all([tx.get(session), tx.get(ref)]);
      if (
        !s.exists ||
        s.get("status") === "deleting" ||
        !r.exists ||
        r.get("status") !== "running"
      )
        return;
      tx.update(ref, { status: run.status, variants: run.variants });
    });
  }
  async listRuns(uid: string, sid: string) {
    const s = await this.ref(uid, sid).collection("runs").limit(200).get();
    return s.docs
      .map((d) => d.data() as EvaluationRun)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
  }
  async run(uid: string, sid: string, id: string) {
    const s = await this.ref(uid, sid).collection("runs").doc(id).get();
    return s.exists ? (s.data() as EvaluationRun) : null;
  }
  async review(
    uid: string,
    sid: string,
    id: string,
    review: EvaluationRun["review"],
  ) {
    await this.db.runTransaction(async (tx) => {
      const session = this.ref(uid, sid);
      const ref = session.collection("runs").doc(id);
      const [s, r] = await Promise.all([tx.get(session), tx.get(ref)]);
      if (!s.exists || s.get("status") === "deleting" || !r.exists)
        throw new Error("Registro não encontrado.");
      if (r.get("status") === "running" || r.get("review"))
        throw new Error("Este registro não está disponível para avaliação.");
      tx.update(ref, { review });
    });
  }
  async followUp(uid: string, sid: string, id: string, outcome: string) {
    await this.db.runTransaction(async (tx) => {
      const session = this.ref(uid, sid);
      const ref = session.collection("runs").doc(id);
      const [s, r] = await Promise.all([tx.get(session), tx.get(ref)]);
      if (
        !s.exists ||
        s.get("status") === "deleting" ||
        !r.exists ||
        !r.get("review")
      )
        throw new Error("Registro avaliado não encontrado.");
      tx.update(ref, { "review.outcome": outcome });
    });
  }
  async delete(uid: string, sid: string) {
    const ref = this.ref(uid, sid);
    let existed = false;
    await this.db.runTransaction(async (tx) => {
      const owner = this.owner(uid);
      const [session, state] = await Promise.all([tx.get(ref), tx.get(owner)]);
      if (
        !session.exists &&
        !(state.get("deletingSessionIds") ?? []).includes(sid)
      )
        return;
      existed = true;
      if (session.exists) tx.update(ref, { status: "deleting" });
      const pending = new Set<string>(state.get("deletingSessionIds") ?? []);
      pending.add(sid);
      tx.set(
        owner,
        {
          deletingSessionIds: [...pending],
          ...(state.get("activeSessionId") === sid
            ? { activeSessionId: null }
            : {}),
        },
        { merge: true },
      );
    });
    if (!existed) return;
    await this.db.recursiveDelete(ref);
    await this.db.runTransaction(async (tx) => {
      const owner = this.owner(uid);
      const state = await tx.get(owner);
      const pending: string[] = state.get("deletingSessionIds") ?? [];
      if (!pending.includes(sid)) return;
      tx.set(
        owner,
        {
          deletingSessionIds: pending.filter((id) => id !== sid),
          sessionCount: Math.max(0, Number(state.get("sessionCount") ?? 1) - 1),
        },
        { merge: true },
      );
    });
  }
}
