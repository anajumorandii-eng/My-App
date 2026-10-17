import "../features/ai-evaluation/evaluation.css";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  downloadEvaluation,
  evaluationRequest,
  evaluationChanged,
} from "../features/ai-evaluation/api";
import { RunReview, TASK_LABELS } from "../features/ai-evaluation/RunReview";
import type {
  EvaluationCandidate,
  EvaluationDetail,
  EvaluationRun,
  EvaluationSession,
  EvaluationSummary,
} from "../features/ai-evaluation/types";

const inputClass =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] p-2";
export default function AiEvaluation() {
  const { user, loading } = useAuth();
  if (loading) return <p role="status">Restaurando sua conta…</p>;
  if (!user)
    return (
      <div className="ni-panel p-6">
        <h1 className="text-2xl font-semibold">Avaliação de IA</h1>
        <p>Entre na conta administrativa para avaliar os testes.</p>
        <Link to="/conexoes" className="underline">
          Conectar conta
        </Link>
      </div>
    );
  return <EvaluationWorkspace key={user.uid} />;
}
function EvaluationWorkspace() {
  const [sessions, setSessions] = useState<EvaluationSession[]>([]);
  const [candidates, setCandidates] = useState<
    Pick<EvaluationCandidate, "id" | "label">[]
  >([]);
  const [selected, setSelected] = useState("");
  const [detail, setDetail] = useState<
    (EvaluationDetail & { summary: EvaluationSummary[] }) | null
  >(null);
  const [runId, setRunId] = useState("");
  const [title, setTitle] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const load = useCallback(async () => {
    const data = await evaluationRequest<{
      sessions: EvaluationSession[];
      candidates: Pick<EvaluationCandidate, "id" | "label">[];
    }>("/sessions");
    setSessions(data.sessions);
    setCandidates(data.candidates);
    setReady(true);
    setSelected((current) =>
      data.sessions.some((s) => s.id === current)
        ? current
        : (data.sessions.find((s) => s.status === "active")?.id ??
          data.sessions[0]?.id ??
          ""),
    );
    setA((current) =>
      data.candidates.some((c) => c.id === current)
        ? current
        : (data.candidates[0]?.id ?? ""),
    );
    setB((current) =>
      data.candidates.some((c) => c.id === current)
        ? current
        : (data.candidates[1]?.id ?? ""),
    );
  }, []);
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();
    evaluationRequest<{
      sessions: EvaluationSession[];
      candidates: Pick<EvaluationCandidate, "id" | "label">[];
    }>("/sessions", { signal: controller.signal })
      .then((data) => {
        if (!alive) return;
        setSessions(data.sessions);
        setCandidates(data.candidates);
        setSelected(
          data.sessions.find((s) => s.status === "active")?.id ??
            data.sessions[0]?.id ??
            "",
        );
        setA(data.candidates[0]?.id ?? "");
        setB(data.candidates[1]?.id ?? "");
        setReady(true);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
      controller.abort();
    };
  }, []);
  useEffect(() => {
    setDetail(null);
    setRunId("");
    setConfirmDelete(false);
    if (!selected) return;
    let alive = true;
    const controller = new AbortController();
    evaluationRequest<EvaluationDetail & { summary: EvaluationSummary[] }>(
      `/sessions/${selected}`,
      { signal: controller.signal },
    )
      .then((d) => {
        if (alive) setDetail(d);
      })
      .catch((e) => {
        if (alive) setError(e.message);
      });
    return () => {
      alive = false;
      controller.abort();
    };
  }, [selected]);
  const refreshDetail = async () => {
    if (selected) setDetail(await evaluationRequest(`/sessions/${selected}`));
    await load();
  };
  const action = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError("");
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível concluir.");
    } finally {
      setBusy(false);
    }
  };
  const active = sessions.find((s) => s.status === "active");
  const run = detail?.runs.find((r) => r.id === runId);
  return (
    <div className="ai-evaluation space-y-6 max-w-7xl mx-auto">
      <header>
        <p className="text-xs uppercase tracking-widest mb-2">
          Aprender com evidências
        </p>
        <h1 className="text-3xl font-semibold">Avaliação de IA</h1>
        <p className="mt-2">
          Registre seu uso real, compare respostas e escolha os modelos com base
          nos resultados.
        </p>
      </header>
      {error && (
        <p role="alert" className="ni-panel p-4 border border-rose-500">
          {error}
        </p>
      )}
      {!ready && !error && <p role="status">Carregando suas sessões…</p>}
      {ready && (
        <>
          <section
            className="ni-panel p-5 space-y-4"
            aria-label="Controle da gravação"
          >
            {active ? (
              <>
                <h2 className="font-semibold text-lg">
                  Sessão ativa: {active.title}
                </h2>
                <p>
                  As próximas chamadas de texto feitas por esta conta nas telas
                  do CRIVO serão registradas. Outras contas não são gravadas.
                </p>
                <button
                  className="ni-button"
                  disabled={busy}
                  onClick={() =>
                    void action(async () => {
                      await evaluationRequest(`/sessions/${active.id}/stop`, {
                        method: "POST",
                      });
                      evaluationChanged();
                      await refreshDetail();
                    })
                  }
                >
                  Encerrar sessão
                </button>
              </>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  void action(async () => {
                    const s = await evaluationRequest<EvaluationSession>(
                      "/sessions",
                      {
                        method: "POST",
                        body: JSON.stringify({ title, consent }),
                      },
                    );
                    setTitle("");
                    setConsent(false);
                    await load();
                    setSelected(s.id);
                    evaluationChanged();
                  });
                }}
              >
                <h2 className="text-lg font-semibold">
                  Iniciar uma sessão de teste
                </h2>
                <label className="block">
                  Nome da sessão
                  <input
                    className={inputClass}
                    maxLength={100}
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={busy}
                  />
                </label>
                <label className="flex gap-3 items-start">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    disabled={busy}
                  />
                  <span>
                    Autorizo gravar as entradas, o contexto enviado e as
                    respostas de IA desta conta durante a sessão. Posso
                    encerrar, exportar ou excluir os registros.
                  </span>
                </label>
                <button
                  className="ni-button"
                  disabled={busy || !consent || !title.trim()}
                >
                  Iniciar sessão
                </button>
              </form>
            )}
            <p className="text-sm">
              Até 200 registros por sessão e 50 sessões por conta. Não grava sua
              tela ou atividades fora do CRIVO. Áudio não é capturado; o roteiro
              do podcast é.
            </p>
          </section>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex-1 min-w-48">
              Histórico de sessões
              <select
                className={inputClass}
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                disabled={busy}
              >
                <option value="">Selecione uma sessão</option>
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ·{" "}
                    {s.status === "active"
                      ? "ativa"
                      : s.status === "deleting"
                        ? "exclusão pendente"
                        : "encerrada"}{" "}
                    · {s.runCount} testes
                  </option>
                ))}
              </select>
            </label>
            <button
              className="ni-button"
              disabled={busy}
              onClick={() => void action(refreshDetail)}
            >
              Atualizar histórico
            </button>
          </div>
          {detail && (
            <>
              <section
                className="ni-panel p-5 space-y-4"
                aria-label="Relatório da sessão"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    {detail.session.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(["json", "csv"] as const).map((format) => (
                      <button
                        key={format}
                        className="ni-button"
                        disabled={busy}
                        onClick={() =>
                          void action(() =>
                            downloadEvaluation(selected, format),
                          )
                        }
                      >
                        Exportar {format.toUpperCase()}
                      </button>
                    ))}
                    <button
                      className="ni-button"
                      disabled={busy}
                      onClick={() => setConfirmDelete(true)}
                    >
                      Excluir sessão
                    </button>
                  </div>
                </div>
                {confirmDelete && (
                  <div
                    className="p-3 border rounded-lg"
                    role="group"
                    aria-label="Confirmar exclusão"
                  >
                    <p>
                      Excluir permanentemente esta sessão e suas entradas e
                      respostas?
                    </p>
                    <div className="flex gap-3 mt-2">
                      <button
                        className="ni-button"
                        disabled={busy}
                        onClick={() =>
                          void action(async () => {
                            await evaluationRequest(`/sessions/${selected}`, {
                              method: "DELETE",
                            });
                            setDetail(null);
                            setSelected("");
                            setConfirmDelete(false);
                            await load();
                            evaluationChanged();
                          })
                        }
                      >
                        Confirmar exclusão
                      </button>
                      <button
                        className="ni-button"
                        disabled={busy}
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
                {detail.session.status === "deleting" && (
                  <p role="alert">
                    A exclusão não terminou. Use Excluir sessão novamente para
                    concluir a remoção.
                  </p>
                )}
                <p className="text-sm">
                  Tempos excluem respostas em cache e gerações incompletas.
                  Correção depende da conferência humana. Não há escolha
                  automática de vencedor. Casos pequenos não comprovam
                  superioridade.
                </p>
                {!!detail.summary.length && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <caption className="sr-only">
                        Resultados por tarefa e modelo
                      </caption>
                      <thead>
                        <tr>
                          {[
                            "Tarefa / modelo",
                            "Amostras / falhas",
                            "Tempo médio",
                            "Primeiro texto",
                            "Utilidade",
                            "Correção conferida",
                            "Preferências A/B",
                          ].map((h) => (
                            <th
                              scope="col"
                              key={h}
                              className="p-2 border-b whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {detail.summary.map((r) => (
                          <tr key={r.task + r.source + r.kind + r.model}>
                            <th
                              scope="row"
                              className="p-2 font-normal min-w-48"
                            >
                              {TASK_LABELS[r.task] ?? r.task}
                              <br />
                              <span className="text-xs break-all">
                                {r.model}
                                <br />
                                {r.source || "Tela não informada"} ·{" "}
                                {r.kind === "comparison" ? "A/B" : "Uso real"}
                              </span>
                            </th>
                            <td className="p-2">
                              {r.samples} / {r.failures}
                              <br />
                              {r.cached} em cache
                              <br />
                              {r.distinctPrompts} entradas distintas
                            </td>
                            <td className="p-2">
                              {r.averageDurationMs === null
                                ? "—"
                                : `${(r.averageDurationMs / 1000).toFixed(1)} s`}
                              <br />
                              n={r.measured}
                            </td>
                            <td className="p-2">
                              {r.averageFirstTokenMs === null
                                ? "—"
                                : `${(r.averageFirstTokenMs / 1000).toFixed(1)} s`}
                              <br />
                              n={r.firstTokenSamples}
                            </td>
                            <td className="p-2">
                              {r.averageUsefulness?.toFixed(1) ?? "—"}/5
                              <br />
                              n={r.rated}
                            </td>
                            <td className="p-2">
                              {r.correct} corretas / {r.correctnessChecked}{" "}
                              conferidas
                            </td>
                            <td className="p-2">{r.wins} escolhas</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
              {!detail.runs.length ? (
                <p className="ni-panel p-5">
                  Nenhum teste registrado. Com uma sessão ativa, use o Tutor,
                  Questões, Redação ou Podcast e depois atualize este histórico.
                </p>
              ) : (
                <section className="grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-5">
                  <nav
                    aria-label="Testes da sessão"
                    className="space-y-2 max-h-[44rem] overflow-y-auto"
                  >
                    {detail.runs.map((r) => (
                      <button
                        key={r.id}
                        className={`ni-panel p-3 text-left w-full border ${runId === r.id ? "border-[var(--primary)]" : ""}`}
                        onClick={() => setRunId(r.id)}
                        disabled={busy}
                        aria-pressed={runId === r.id}
                      >
                        <strong className="block">
                          {TASK_LABELS[r.task] ?? r.task}
                        </strong>
                        <span className="text-xs">
                          {r.task} ·{" "}
                          {r.kind === "comparison" ? "A/B" : "Uso real"} ·{" "}
                          {r.review
                            ? "avaliado"
                            : r.status === "running"
                              ? "em andamento"
                              : "aguardando avaliação"}
                        </span>
                        <time className="block text-xs" dateTime={r.startedAt}>
                          {new Date(r.startedAt).toLocaleString("pt-BR")}
                        </time>
                      </button>
                    ))}
                  </nav>
                  <div className="min-w-0 space-y-5">
                    {!run ? (
                      <p>Selecione um teste para ler e avaliar.</p>
                    ) : (
                      <>
                        <RunReview
                          key={run.id + (run.review?.reviewedAt ?? "")}
                          run={run}
                          busy={busy}
                          onFollowUp={(outcome) =>
                            action(async () => {
                              await evaluationRequest(
                                `/sessions/${selected}/runs/${run.id}/outcome`,
                                {
                                  method: "PATCH",
                                  body: JSON.stringify({ outcome }),
                                },
                              );
                              await refreshDetail();
                            })
                          }
                          onSave={(body) =>
                            action(async () => {
                              await evaluationRequest(
                                `/sessions/${selected}/runs/${run.id}/review`,
                                { method: "POST", body: JSON.stringify(body) },
                              );
                              await refreshDetail();
                            })
                          }
                        />
                        {run.kind === "live" &&
                          run.status === "completed" &&
                          !run.promptTruncated &&
                          detail.session.status === "active" && (
                            <section className="ni-panel p-4 space-y-3">
                              <h2 className="font-semibold">
                                Comparar esta entrada com dois candidatos
                              </h2>
                              <p className="text-sm">
                                Faz duas novas chamadas, consome duas unidades
                                da cota diária e mantém o mesmo prompt. A ordem
                                A/B será sorteada. Os nomes só aparecem após
                                avaliar.
                              </p>
                              {candidates.length < 2 ? (
                                <p>
                                  Configure pelo menos dois candidatos no
                                  servidor para habilitar a comparação.
                                </p>
                              ) : (
                                <>
                                  <div className="grid sm:grid-cols-2 gap-3">
                                    {(
                                      [
                                        ["Primeiro candidato", a, setA],
                                        ["Segundo candidato", b, setB],
                                      ] as const
                                    ).map(([label, value, set]) => (
                                      <label key={label}>
                                        {label}
                                        <select
                                          className={inputClass}
                                          value={value}
                                          onChange={(e) => set(e.target.value)}
                                          disabled={busy}
                                        >
                                          {candidates.map((c) => (
                                            <option key={c.id} value={c.id}>
                                              {c.label}
                                            </option>
                                          ))}
                                        </select>
                                      </label>
                                    ))}
                                  </div>
                                  <button
                                    className="ni-button"
                                    disabled={busy || !a || !b || a === b}
                                    onClick={() =>
                                      void action(async () => {
                                        const pair =
                                          await evaluationRequest<EvaluationRun>(
                                            `/sessions/${selected}/compare`,
                                            {
                                              method: "POST",
                                              body: JSON.stringify({
                                                runId: run.id,
                                                a,
                                                b,
                                              }),
                                            },
                                          );
                                        await refreshDetail();
                                        setRunId(pair.id);
                                      })
                                    }
                                  >
                                    {busy
                                      ? "Gerando respostas…"
                                      : "Gerar comparação A/B"}
                                  </button>
                                </>
                              )}
                            </section>
                          )}
                      </>
                    )}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
