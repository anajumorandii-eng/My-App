import { authHeaders } from "../../lib/auth";
export async function evaluationRequest<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`/api/ai-evaluation${path}`, {
    ...options,
    headers: {
      ...(await authHeaders()),
      "Content-Type": "application/json",
      ...options.headers,
    },
    signal: options.signal ?? AbortSignal.timeout(180_000),
  });
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.error || "Não foi possível acessar a avaliação.");
  return body;
}
export async function downloadEvaluation(
  sessionId: string,
  format: "json" | "csv",
) {
  const response = await fetch(
    `/api/ai-evaluation/sessions/${sessionId}/export?format=${format}`,
    { headers: await authHeaders(), signal: AbortSignal.timeout(30_000) },
  );
  if (!response.ok) throw new Error("Não foi possível exportar a sessão.");
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = `avaliacao-${sessionId}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function evaluationChanged() {
  window.dispatchEvent(new Event("crivo-evaluation-change"));
}
