import React from "react";
import { beforeEach, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AiEvaluation from "./AiEvaluation";
import { evaluationRequest } from "../features/ai-evaluation/api";
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: "ana" }, loading: false }),
}));
vi.mock("../features/ai-evaluation/api", () => ({
  evaluationRequest: vi.fn(),
  downloadEvaluation: vi.fn(),
}));
const request = vi.mocked(evaluationRequest);
beforeEach(() => {
  request.mockReset();
  request.mockResolvedValue({ sessions: [], candidates: [], maxRuns: 200 });
});
test("não inicia gravação sem consentimento explícito", async () => {
  render(<AiEvaluation />);
  await screen.findByText("Avaliação de IA");
  await userEvent.type(screen.getByLabelText("Nome da sessão"), "Meu estudo");
  expect(screen.getByRole("button", { name: "Iniciar sessão" })).toBeDisabled();
  await userEvent.click(
    screen.getByRole("checkbox", { name: /gravar as entradas/i }),
  );
  expect(screen.getByRole("button", { name: "Iniciar sessão" })).toBeEnabled();
});
test("mostra erro de autorização sem exibir dados de outra sessão", async () => {
  request.mockRejectedValue(new Error("Acesso restrito à administração."));
  render(<AiEvaluation />);
  expect(await screen.findByRole("alert")).toHaveTextContent("Acesso restrito");
  expect(
    screen.queryByRole("button", { name: "Iniciar sessão" }),
  ).not.toBeInTheDocument();
});
test("uma comparação exige avaliação completa antes da revelação e permite empate", async () => {
  const session = {
    id: "s",
    title: "Teste",
    status: "active",
    runCount: 1,
    startedAt: "2026-10-16T12:00:00Z",
    endedAt: null,
  };
  const run = {
    id: "r",
    sessionId: "s",
    kind: "comparison",
    task: "review-tip",
    source: "/revisoes",
    payload: { topic: "Memória" },
    prompt: "Explique",
    promptVersion: "hash",
    promptTruncated: false,
    startedAt: session.startedAt,
    status: "completed",
    variants: [
      {
        label: "A",
        text: "Primeira resposta",
        status: "completed",
        durationMs: 20,
        firstTokenMs: 3,
        cached: false,
        fallback: false,
      },
      {
        label: "B",
        text: "Segunda resposta",
        status: "completed",
        durationMs: 30,
        firstTokenMs: 4,
        cached: false,
        fallback: false,
      },
    ],
  };
  request.mockImplementation(async (path) =>
    path === "/sessions"
      ? { sessions: [session], candidates: [], maxRuns: 200 }
      : ({ session, runs: [run], summary: [] } as any),
  );
  render(<AiEvaluation />);
  await userEvent.click(
    await screen.findByRole("button", { name: /review-tip/ }),
  );
  expect(screen.getByText("Primeira resposta")).toBeInTheDocument();
  const submit = screen.getByRole("button", {
    name: "Salvar avaliação e revelar modelos",
  });
  expect(submit).toBeDisabled();
  for (const letter of ["A", "B"])
    for (const field of ["Clareza", "Cumprimento do pedido", "Utilidade"])
      await userEvent.selectOptions(
        screen.getByLabelText(`${field} — ${letter}`),
        "4",
      );
  await userEvent.selectOptions(screen.getByLabelText("Preferência"), "tie");
  expect(submit).toBeEnabled();
});
