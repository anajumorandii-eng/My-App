import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authHeaders } from "../lib/auth";
import {
  coverContextKey,
  readPrintCoverContext,
  preparedCoverIllustration,
} from "../lib/printCoverContext";

export function CoverIllustrationButton({
  getContent,
}: {
  getContent: () => HTMLElement | null;
}) {
  const { user } = useAuth();
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const request = useRef<AbortController | null>(null);
  const preparedRoot = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setEnabled(false);
    setPreview("");
    setError("");
    setBusy(false);
    if (user)
      void (async () => {
        try {
          const response = await fetch("/api/cover-illustrations", {
            headers: await authHeaders(),
            signal: controller.signal,
          });
          const data = response.ok ? await response.json() : {};
          if (!controller.signal.aborted) setEnabled(data.enabled === true);
        } catch {
          /* Standard covers stay available without image generation. */
        }
      })();
    return () => {
      controller.abort();
      const pending = request.current;
      request.current = null;
      pending?.abort();
      if (preparedRoot.current) {
        delete preparedRoot.current.dataset.printGeneratedArt;
        delete preparedRoot.current.dataset.printGeneratedContext;
      }
      preparedRoot.current = null;
    };
  }, [user?.uid]);
  const currentRoot = getContent();
  const currentContext = currentRoot ? readPrintCoverContext(currentRoot) : {};
  if (
    !user ||
    !enabled ||
    !currentContext.subject ||
    !(currentContext.topic || currentContext.work)
  )
    return null;
  const activePreview =
    preview && preparedRoot.current === getContent() && preparedRoot.current
      ? preparedCoverIllustration(preparedRoot.current)
      : undefined;
  const generate = async () => {
    const root = getContent();
    if (!root) return;
    const context = readPrintCoverContext(root),
      key = coverContextKey(context);
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 160_000);
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/cover-illustrations", {
        method: "POST",
        headers: {
          ...(await authHeaders()),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(context),
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Não foi possível gerar a ilustração.");
      if (
        typeof data.dataUrl !== "string" ||
        data.dataUrl.length > 8_388_640 ||
        !/^data:image\/png;base64,[A-Za-z0-9+/]+={0,2}$/.test(data.dataUrl)
      )
        throw new Error("A ilustração recebida é inválida.");
      const image = new Image();
      image.src = data.dataUrl;
      await image.decode();
      if (controller.signal.aborted) return;
      if (
        getContent() !== root ||
        coverContextKey(readPrintCoverContext(root)) !== key
      )
        throw new Error(
          "O material mudou durante a geração. Gere a ilustração para a seleção atual.",
        );
      root.dataset.printGeneratedArt = data.dataUrl;
      root.dataset.printGeneratedContext = key;
      preparedRoot.current = root;
      setPreview(data.dataUrl);
    } catch (error) {
      if (!controller.signal.aborted)
        setError(
          error instanceof Error
            ? error.message
            : "Não foi possível gerar a ilustração.",
        );
      else if (request.current === controller)
        setError(
          "A geração foi interrompida. A capa padrão continua disponível.",
        );
    } finally {
      window.clearTimeout(timeout);
      if (request.current === controller) {
        request.current = null;
        setBusy(false);
      }
    }
  };
  return (
    <div data-print-exclude className="space-y-2 text-sm">
      <p className="text-xs text-[var(--dim)]">
        Opcional: cada nova ilustração usa uma geração de IA.
      </p>
      <button
        type="button"
        disabled={busy}
        onClick={() => void generate()}
        className="rounded-lg border border-[var(--line)] px-4 py-2 disabled:opacity-50"
      >
        {busy ? "Criando ilustração…" : "Personalizar ilustração da capa"}
      </button>
      {busy && (
        <p role="status" className="text-[var(--dim)]">
          A impressão com a capa padrão continua disponível enquanto a
          ilustração é criada.
        </p>
      )}
      {activePreview && (
        <div className="flex flex-wrap items-center gap-3">
          <img
            src={activePreview}
            alt="Prévia da ilustração decorativa da capa"
            className="h-24 w-24 object-contain"
          />
          <div>
            <p role="status">Ilustração pronta para este material.</p>
            <p className="text-xs text-[var(--dim)]">
              Decorativa; não substitui os diagramas de estudo. Disponível nesta
              tela até sair ou recarregar.
            </p>
            <button
              type="button"
              className="underline"
              disabled={busy}
              onClick={() => {
                if (preparedRoot.current) {
                  delete preparedRoot.current.dataset.printGeneratedArt;
                  delete preparedRoot.current.dataset.printGeneratedContext;
                }
                preparedRoot.current = null;
                setPreview("");
                setError("");
              }}
            >
              Usar ilustração padrão
            </button>
          </div>
        </div>
      )}
      {preview && !activePreview && (
        <p role="status">
          A seleção mudou. A capa padrão será usada até você personalizar este
          material.
        </p>
      )}
      {error && (
        <p role="alert" className="text-status-error">
          {error} Sua impressão continua disponível.
        </p>
      )}
    </div>
  );
}
