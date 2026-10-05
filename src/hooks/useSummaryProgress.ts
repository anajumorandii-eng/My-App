import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { emptySummaryProgress, normalizeSummaryProgressMap } from '../lib/summaryEngine';
import { migrateSummaryProgressMap } from '../lib/summaryStudy';
import { getUserSummaryProgress, saveUserSummaryProgress } from '../lib/userData';
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

interface ProgressSession {
  uid: string | null;
  generation: number;
  progress: SummaryProgressMap;
  ready: boolean;
  remoteReady: boolean;
  pending: number;
  syncError: string | null;
  saveQueue: Promise<void>;
}
const newSession = (uid: string | null, generation: number): ProgressSession => ({
  uid, generation, progress: {}, ready: false, remoteReady: false, pending: 0, syncError: null, saveQueue: Promise.resolve(),
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
      const merged = migrateSummaryProgressMap({ ...local, ...normalizeSummaryProgressMap(remote) }, interactiveSummaries);
      session.progress = merged;
      session.remoteReady = true;
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
  }, [uid, session, publish]);

  const update = useCallback((summaryId: string, updater: (current: SummaryProgress) => SummaryProgress) => {
    if (sessionRef.current !== session || !session.ready) return;
    const next = { ...session.progress, [summaryId]: updater(session.progress[summaryId] ?? emptySummaryProgress()) };
    session.progress = next;
    try { localStorage.setItem(storageKey(uid), JSON.stringify(next)); }
    catch { session.syncError = 'Não foi possível salvar neste dispositivo. Mantenha esta página aberta e tente novamente.'; }
    // Sem leitura remota confirmada, gravar o mapa inteiro apagaria capítulos
    // ainda desconhecidos. A alteração permanece somente no cache deste UID.
    if (uid !== null && session.remoteReady) {
      session.pending += 1;
      session.saveQueue = session.saveQueue.then(async () => {
        // Escritas já solicitadas terminam no UID original, mesmo após sair.
        // Somente a publicação do resultado depende da sessão ainda ativa.
        try {
          await saveUserSummaryProgress(uid, next);
          if (sessionRef.current === session) session.syncError = null;
        } catch {
          if (sessionRef.current === session) session.syncError = 'A sincronização falhou; a alteração ficou salva neste dispositivo.';
        } finally {
          session.pending -= 1;
          publish(session);
        }
      });
    }
    publish(session);
  }, [uid, session, publish]);

  const current = state.uid === uid && state.generation === session.generation ? state : session;
  return {
    progress: current.ready ? current.progress : {}, update,
    loading: !current.ready, syncError: current.syncError,
    isCloudSynced: uid !== null && current.ready && current.remoteReady && current.pending === 0 && current.syncError === null,
  };
}
