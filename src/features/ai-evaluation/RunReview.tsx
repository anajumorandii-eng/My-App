import React, { useState } from "react";
import type {
  Correctness,
  EvaluationRun,
  VariantLabel,
  VariantReview,
} from "./types";
export const TASK_LABELS: Record<string, string> = {
  socratic: "Conversa socrática",
  "content-explanation": "Explicação de conteúdo",
  "answer-correction": "Correção de resposta",
  "error-hypothesis": "Hipótese de erro",
  "error-diagnosis": "Diagnóstico de erro",
  "question-explanation": "Explicação de questão",
  "backlog-exercise": "Criação de exercício",
  "backlog-correction": "Correção de exercício",
  "discursive-feedback": "Feedback discursivo",
  "podcast-script": "Roteiro de podcast",
  "progress-insight": "Análise de progresso",
  "review-tip": "Orientação de revisão",
  "method-example": "Exemplo de método",
};
const inputClass =
  "w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] p-2";
export function RunReview({
  run,
  busy,
  onSave,
  onFollowUp,
}: {
  run: EvaluationRun;
  busy: boolean;
  onSave: (body: unknown) => Promise<void>;
  onFollowUp?: (outcome: string) => Promise<void>;
}) {
  const [reviews, setReviews] = useState<VariantReview[]>(() =>
    run.variants.map((v) => ({
      label: v.label,
      correctness: "unchecked",
      clarity: 0,
      instruction: 0,
      usefulness: 0,
    })),
  );
  const [preference, setPreference] = useState("");
  const [comment, setComment] = useState("");
  const [outcome, setOutcome] = useState(run.review?.outcome ?? "");
  const change = (
    label: VariantLabel,
    key: keyof VariantReview,
    value: string | number,
  ) =>
    setReviews((current) =>
      current.map((r) => (r.label === label ? { ...r, [key]: value } : r)),
    );
  const complete =
    !!preference &&
    reviews.every(
      (r) => r.clarity > 0 && r.instruction > 0 && r.usefulness > 0,
    );
  return (
    <section className="space-y-5" aria-label="Detalhes do teste">
      <header>
        <h2 className="text-xl font-semibold">
          {TASK_LABELS[run.task] ?? run.task}
        </h2>
        <p className="text-sm">
          {run.kind === "comparison"
            ? "Comparação A/B · modelos ocultos até salvar a avaliação"
            : "Uso real do aplicativo"}{" "}
          · {new Date(run.startedAt).toLocaleString("pt-BR")}
        </p>
      </header>
      <details className="ni-panel p-4">
        <summary className="cursor-pointer font-semibold">
          Entrada e contexto do teste
        </summary>
        <p className="text-sm mt-3">Tela: {run.source || "Não informada"}</p>
        <pre className="whitespace-pre-wrap break-words text-sm mt-3">
          {JSON.stringify(run.payload, null, 2)}
        </pre>
        <details className="mt-3">
          <summary>Prompt enviado</summary>
          <pre className="whitespace-pre-wrap break-words text-sm mt-2">
            {run.prompt}
          </pre>
          <p className="text-xs break-all">Versão: {run.promptVersion}</p>
        </details>
        {run.promptTruncated && (
          <p role="status">
            O prompt excedeu o limite de captura e foi truncado. Este teste não
            pode ser repetido em A/B.
          </p>
        )}
      </details>
      <div
        className={`grid gap-4 ${run.variants.length > 1 ? "xl:grid-cols-2" : ""}`}
      >
        {run.variants.map((v) => {
          const saved = run.review?.variants.find((r) => r.label === v.label);
          const review = reviews.find((r) => r.label === v.label)!;
          return (
            <article key={v.label} className="ni-panel p-4 min-w-0 space-y-4">
              <h3 className="font-semibold">Resposta {v.label}</h3>
              {(run.kind === "live" || run.review) && (
                <p className="text-sm break-words">
                  Modelo solicitado: {v.requestedModel ?? "Não informado"} ·
                  reportado: {v.model ?? "Não informado"}
                </p>
              )}
              <p className="text-xs">
                Total:{" "}
                {v.durationMs === null
                  ? "não medido"
                  : `${(v.durationMs / 1000).toFixed(1)} s`}{" "}
                · Primeiro texto:{" "}
                {v.firstTokenMs === null
                  ? "não medido"
                  : `${(v.firstTokenMs / 1000).toFixed(1)} s`}
                {v.cached ? " · resposta em cache" : ""}
                {v.fallback ? " · alternativa usada" : ""}
              </p>
              {v.status === "running" && (
                <p role="status">
                  Geração em andamento. Atualize o histórico após concluir.
                </p>
              )}
              {v.error && <p role="status">{v.error}</p>}
              <div
                className="whitespace-pre-wrap break-words leading-relaxed max-h-[36rem] overflow-y-auto"
                tabIndex={0}
                aria-label={`Texto da resposta ${v.label}`}
              >
                {v.text || "Sem texto disponível."}
              </div>
              {v.textTruncated && (
                <p className="text-sm">
                  Resposta truncada no histórico por limite de tamanho.
                </p>
              )}
              {!run.review && run.status !== "running" && (
                <fieldset className="space-y-3" disabled={busy}>
                  <legend className="font-semibold">
                    Avaliar resposta {v.label}
                  </legend>
                  <label className="block text-sm">
                    Correção — {v.label}
                    <select
                      className={inputClass}
                      value={review.correctness}
                      onChange={(e) =>
                        change(
                          v.label,
                          "correctness",
                          e.target.value as Correctness,
                        )
                      }
                    >
                      <option value="unchecked">Não conferida</option>
                      <option value="correct">Correta</option>
                      <option value="partial">Parcialmente correta</option>
                      <option value="incorrect">Incorreta</option>
                    </select>
                  </label>
                  {(
                    [
                      ["clarity", "Clareza"],
                      ["instruction", "Cumprimento do pedido"],
                      ["usefulness", "Utilidade"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block text-sm">
                      {label} — {v.label}
                      <select
                        className={inputClass}
                        value={review[key]}
                        onChange={(e) =>
                          change(v.label, key, Number(e.target.value))
                        }
                      >
                        <option value="0">Selecione uma nota</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} —{" "}
                            {n === 1
                              ? "Muito ruim"
                              : n === 5
                                ? "Muito boa"
                                : n === 3
                                  ? "Regular"
                                  : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </fieldset>
              )}
              {saved && (
                <p className="text-sm">
                  Avaliação salva · Clareza {saved.clarity}/5 · Pedido{" "}
                  {saved.instruction}/5 · Utilidade {saved.usefulness}/5 ·
                  Correção:{" "}
                  {
                    {
                      correct: "correta",
                      partial: "parcial",
                      incorrect: "incorreta",
                      unchecked: "não conferida",
                    }[saved.correctness]
                  }
                </p>
              )}
            </article>
          );
        })}
      </div>
      {!run.review && run.status !== "running" && (
        <form
          className="ni-panel p-4 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (complete)
              await onSave({ variants: reviews, preference, comment, outcome });
          }}
        >
          <p className="text-sm">
            Confira o gabarito ou a rubrica antes de marcar como correta.
            Preferência pessoal não comprova correção.
          </p>
          <label className="block">
            Preferência
            <select
              className={inputClass}
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              disabled={busy}
            >
              <option value="">Selecione</option>
              <option value="A">Resposta A</option>
              {run.variants.length > 1 && (
                <>
                  <option value="B">Resposta B</option>
                  <option value="tie">Empate</option>
                </>
              )}
              <option value="neither">
                {run.kind === "live"
                  ? "Não usaria esta resposta"
                  : "Nenhuma das duas"}
              </option>
            </select>
          </label>
          <label className="block">
            Observações
            <textarea
              className={inputClass}
              maxLength={4000}
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={busy}
            />
          </label>
          <label className="block">
            Resultado no estudo
            <textarea
              className={inputClass}
              maxLength={4000}
              rows={2}
              placeholder="Ex.: consegui resolver outra questão sem ajuda."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              disabled={busy}
            />
          </label>
          <button className="ni-button" disabled={busy || !complete}>
            {run.kind === "comparison"
              ? "Salvar avaliação e revelar modelos"
              : "Salvar avaliação"}
          </button>
        </form>
      )}
      {run.review && (
        <div className="ni-panel p-4 space-y-2">
          <p>
            Avaliação registrada em{" "}
            {new Date(run.review.reviewedAt).toLocaleString("pt-BR")}.
            Preferência:{" "}
            {
              { A: "A", B: "B", tie: "empate", neither: "nenhuma" }[
                run.review.preference
              ]
            }
            .
          </p>
          <p className="whitespace-pre-wrap">{run.review.comment}</p>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              void onFollowUp?.(outcome);
            }}
          >
            <label className="block">
              Resultado posterior no estudo
              <textarea
                className={inputClass}
                rows={3}
                maxLength={4000}
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                disabled={busy}
              />
            </label>
            <button className="ni-button" disabled={busy || !onFollowUp}>
              Atualizar resultado posterior
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
