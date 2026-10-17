import "./evaluation.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { evaluationRequest, evaluationChanged } from "./api";
import type { EvaluationSession } from "./types";

export function CaptureNotice() {
  const { user } = useAuth();
  const [active, setActive] = useState<{
    uid: string;
    session: EvaluationSession;
  } | null>(null);
  const [error, setError] = useState("");
  const [stopping, setStopping] = useState(false);
  useEffect(() => {
    setActive(null);
    setError("");
    if (!user) return;
    let alive = true;
    let allowed = true;
    const refresh = async () => {
      if (!allowed) return;
      try {
        const result = await evaluationRequest<{
          sessions: EvaluationSession[];
        }>("/sessions", { signal: AbortSignal.timeout(10_000) });
        if (alive) {
          const session = result.sessions.find((s) => s.status === "active");
          setActive(session ? { uid: user.uid, session } : null);
          setError("");
        }
      } catch (e) {
        if (alive) {
          if (
            e instanceof Error &&
            /restrito|sessão expirou|Entre na sua conta/.test(e.message)
          ) {
            allowed = false;
            setActive(null);
          } else
            setError(
              "Não foi possível confirmar o estado da gravação. Abra a avaliação para verificar.",
            );
        }
      }
    };
    const failed = () => {
      if (alive)
        setError("Esta resposta não foi salva no histórico de avaliação.");
    };
    void refresh();
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") void refresh();
    }, 30_000);
    window.addEventListener("crivo-evaluation-change", refresh);
    window.addEventListener("crivo-evaluation-capture-failed", failed);
    return () => {
      alive = false;
      clearInterval(interval);
      window.removeEventListener("crivo-evaluation-change", refresh);
      window.removeEventListener("crivo-evaluation-capture-failed", failed);
    };
  }, [user?.uid]);
  if (!user || active?.uid !== user.uid) return null;
  return (
    <aside
      className="ai-capture-notice ni-panel p-3 mb-4 flex flex-wrap items-center justify-between gap-3"
      aria-label="Sessão de avaliação ativa"
    >
      <div>
        <strong>Gravação de testes ativa: {active.session.title}</strong>
        <p className="text-sm">
          Entradas e respostas de IA são salvas na sua sessão.{" "}
          <Link to="/avaliacao-ia" className="underline">
            Abrir avaliação
          </Link>
        </p>
        {error && <p role="alert">{error}</p>}
      </div>
      <button
        type="button"
        className="ni-button"
        disabled={stopping}
        onClick={async () => {
          setStopping(true);
          try {
            await evaluationRequest(`/sessions/${active.session.id}/stop`, {
              method: "POST",
            });
            setActive(null);
            evaluationChanged();
          } catch {
            setError(
              "Não foi possível encerrar. A gravação pode continuar ativa.",
            );
          } finally {
            setStopping(false);
          }
        }}
      >
        {stopping ? "Encerrando…" : "Encerrar gravação"}
      </button>
    </aside>
  );
}
