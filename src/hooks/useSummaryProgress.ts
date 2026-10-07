import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { emptySummaryProgress, normalizeSummaryProgressMap } from '../lib/summaryEngine';
import { migrateSummaryProgressMap } from '../lib/summaryStudy';
import { getUserSummaryProgress, saveUserSummaryProgress } from '../lib/userData';
import { applySummaryChange, createSummaryChange, isSummaryChange, type SummaryChange } from '../lib/summarySync';
import { interactiveSummaries } from '../data/interactiveSummaries';
import type { SummaryProgress, SummaryProgressMap } from '../types/summary';

// A chave legada continua intacta para estudo sem login. Seu conteúdo não tem
// UID verificável e não pode ser atribuído automaticamente a quem entrar.
const STORAGE_KEY = 'juju_summary_progress_v1';
const storageKey = (uid: string | null) => uid === null ? STORAGE_KEY : `${STORAGE_KEY}:${uid}`;
function readLocal(uid: string | null): SummaryProgressMap {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return migrateSummaryProgressMap(normalizeSummaryProgressMap(parsed), interactiveSummaries);
  } catch { return {}; }
}

const pendingPrefix = (uid: string) => `${storageKey(uid)}:pending:`;
function readPending(uid: string): SummaryChange[] {
  const changes: SummaryChange[] = [];
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(pendingPrefix(uid))) continue;
    const change: unknown = JSON.parse(localStorage.getItem(key)!);
    if (!isSummaryChange(change) || key !== `${pendingPrefix(uid)}${change.id}`) throw new Error('Registro de sincronização inválido.');
    changes.push(change);
  }
  return changes.sort((a, b) => a.createdAt - b.createdAt || a.id.localeCompare(b.id));
}

interface ProgressSession {
  uid: string | null;
  generation: number;
  progress: SummaryProgressMap;
  ready: boolean;
  remoteReady: boolean;
  pending: number;
  syncError: string | null;
  saveQueue: Promise<void>;
  writeFailed: boolean;
}
const newSession = (uid: string | null, generation: number): ProgressSession => ({
  uid, generation, progress: {}, ready: false, remoteReady: false, pending: 0, syncError: null, saveQueue: Promise.resolve(), writeFailed: false,
});

export function useSummaryProgress() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const sessionRef = useRef<ProgressSession>(newSession(uid, 0));
  // Esconde a conta anterior já no primeiro render, antes do efeito de leitura.
  if (sessionRef.current.uid !== uid) {
    sessionRef.current = newSession(uid, sessionRef.current.generation + 1);
  }
  const session = sessionRef.current;
  const [state, setState] = useState(session);
  const publish = useCallback((current: ProgressSession) => {
    if (sessionRef.current === current) setState({ ...current });
  }, []);

  const enqueue = useCallback((current: ProgressSession, change: SummaryChange) => {
    const owner = current.uid;
    if (owner === null) return;
    current.pending += 1;
    current.saveQueue = current.saveQueue.then(async () => {
      try {
        if (current.writeFailed) return;
        const remote = await saveUserSummaryProgress(owner, change);
        localStorage.removeItem(`${pendingPrefix(owner)}${change.id}`);
        if (sessionRef.current === current) {
          const pending = readPending(owner);
          if (remote) {
            current.progress = migrateSummaryProgressMap(pending.reduce(applySummaryChange, { ...current.progress, ...normalizeSummaryProgressMap(remote) }), interactiveSummaries);
            localStorage.setItem(storageKey(owner), JSON.stringify(current.progress));
          }
          current.syncError = pending.length === 0 ? null : 'Há alterações neste dispositivo aguardando sincronização.';
        }
      } catch {
        current.writeFailed = true;
        if (sessionRef.current === current) current.syncError = 'A sincronização falhou; a alteração ficou salva neste dispositivo.';
      } finally {
        current.pending -= 1;
        publish(current);
      }
    });
  }, [publish]);

  useEffect(() => {
    let cancelled = false;
    const active = () => !cancelled && sessionRef.current === session;
    const local = readLocal(uid);
    session.progress = local;
    if (uid === null) {
      session.ready = true;
      publish(session);
      return;
    }
    getUserSummaryProgress(uid).then(remote => {
      if (!active()) return;
      const pending = readPending(uid);
      const normalizedRemote = normalizeSummaryProgressMap(remote);
      const recovery: SummaryChange[] = [];
      for (const [chapterId, cached] of Object.entries(local)) {
        if (normalizedRemote[chapterId] || pending.some(change => change.chapterId === chapterId && change.recoverIfMissing)) continue;
        // Old UID caches have no operation journal. Recover their evidence only
        // for chapters confirmed absent remotely; concurrent cloud scalars win.
        const seed = createSummaryChange(chapterId, emptySummaryProgress(), cached);
        seed.fields = {};
        seed.reviews = {};
        seed.recoverIfMissing = cached;
        seed.createdAt = Math.min(seed.createdAt, ...pending.map(change => change.createdAt)) - 1;
        localStorage.setItem(`${pendingPrefix(uid)}${seed.id}`, JSON.stringify(seed));
        recovery.push(seed);
      }
      pending.unshift(...recovery);
      const baseline = { ...local, ...normalizedRemote };
      const merged = migrateSummaryProgressMap(pending.reduce(applySummaryChange, baseline), interactiveSummaries);
      session.progress = merged;
      session.remoteReady = true;
      pending.forEach(change => enqueue(session, change));
      try { localStorage.setItem(storageKey(uid), JSON.stringify(merged)); }
      catch { session.syncError = 'Não foi possível guardar uma cópia neste dispositivo.'; }
    }).catch(() => {
      if (!active()) return;
      session.syncError = 'Não foi possível sincronizar. Suas ações continuam salvas neste dispositivo. Recarregue para tentar novamente.';
    }).finally(() => {
      if (!active()) return;
      session.ready = true;
      publish(session);
    });
    return () => { cancelled = true; };
  }, [uid, session, publish, enqueue]);

  const update = useCallback((summaryId: string, updater: (current: SummaryProgress) => SummaryProgress) => {
    if (sessionRef.current !== session || !session.ready) return;
    const before = session.progress[summaryId] ?? emptySummaryProgress();
    const after = updater(before);
    const change = createSummaryChange(summaryId, before, after);
    const next = { ...session.progress, [summaryId]: after };
    session.progress = next;
    let durable = true;
    try {
      // Separate records prevent two tabs from replacing each other's journal.
      // Persist the operation first: an interrupted cache write can be rebuilt.
      if (uid !== null) localStorage.setItem(`${pendingPrefix(uid)}${change.id}`, JSON.stringify(change));
      localStorage.setItem(storageKey(uid), JSON.stringify(next));
    } catch {
      durable = false;
      session.syncError = 'Não foi possível salvar neste dispositivo. Mantenha esta página aberta e tente novamente.';
    }
    if (uid !== null && session.remoteReady && durable) enqueue(session, change);
    publish(session);
  }, [uid, session, publish, enqueue]);

  const current = state.uid === uid && state.generation === session.generation ? state : session;
  return {
    progress: current.ready ? current.progress : {}, update,
    loading: !current.ready, syncError: current.syncError,
    isCloudSynced: uid !== null && current.ready && current.remoteReady && current.pending === 0 && current.syncError === null,
  };
}
