import { afterEach, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { CoverIllustrationButton } from "./CoverIllustrationButton";
import { printStrategyGuide } from "../lib/printStrategyGuide";
const state = vi.hoisted(() => ({
  user: { uid: "student" } as { uid: string } | null,
}));
vi.mock("../context/AuthContext", () => ({ useAuth: () => state }));
vi.mock("../lib/auth", () => ({
  authHeaders: async () => ({ Authorization: "Bearer user-token" }),
}));
const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB";
afterEach(() => {
  cleanup();
  window.dispatchEvent(new Event("afterprint"));
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  state.user = { uid: "student" };
});
function content() {
  const root = document.createElement("article");
  Object.assign(root.dataset, {
    printSubject: "Literatura",
    printWork: "Uma obra",
    printBoard: "UNICAMP",
  });
  root.innerHTML = "<h2>Conteúdo preservado</h2>";
  document.body.append(root);
  return root;
}

it("gera antes da impressão e usa a imagem somente no mesmo contexto", async () => {
  const root = content();
  const fetch = vi
    .fn()
    .mockResolvedValueOnce(Response.json({ enabled: true }))
    .mockResolvedValueOnce(Response.json({ dataUrl: image }));
  vi.stubGlobal("fetch", fetch);
  vi.stubGlobal(
    "Image",
    class {
      src = "";
      decode = async () => {};
    },
  );
  vi.spyOn(window, "print").mockImplementation(() => {});
  render(<CoverIllustrationButton getContent={() => root} />);
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Personalizar ilustração da capa",
    }),
  );
  await screen.findByText("Ilustração pronta para este material.");
  expect(fetch).toHaveBeenCalledTimes(2);
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({
    subject: "Literatura",
    work: "Uma obra",
    board: "UNICAMP",
  });
  printStrategyGuide(root, "Uma obra");
  expect(document.querySelector("[data-print-illustration]")).toHaveAttribute(
    "src",
    image,
  );
  expect(document.querySelectorAll("[data-print-vignette]")).toHaveLength(0);
  root.dataset.printWork = "Outra obra";
  printStrategyGuide(root, "Outra obra");
  expect(
    document.querySelector("[data-print-illustration]")!.getAttribute("src"),
  ).toMatch(/^data:image\/webp/);
  root.remove();
});

it("falha ao gerar não altera a capa existente e não abre a impressão automaticamente", async () => {
  const root = content();
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(Response.json({ enabled: true }))
      .mockResolvedValueOnce(
        Response.json({ error: "Serviço indisponível" }, { status: 503 }),
      ),
  );
  const print = vi.spyOn(window, "print").mockImplementation(() => {});
  render(<CoverIllustrationButton getContent={() => root} />);
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Personalizar ilustração da capa",
    }),
  );
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Serviço indisponível",
  );
  expect(root.dataset.printGeneratedArt).toBeUndefined();
  expect(print).not.toHaveBeenCalled();
  root.remove();
});

it("não mostra personalização quando o servidor não permite e não consulta sem login", async () => {
  const fetch = vi.fn().mockResolvedValue(Response.json({ enabled: false }));
  vi.stubGlobal("fetch", fetch);
  const { rerender } = render(
    <CoverIllustrationButton getContent={() => null} />,
  );
  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
  expect(screen.queryByRole("button")).toBeNull();
  state.user = null;
  rerender(<CoverIllustrationButton getContent={() => null} />);
  expect(fetch).toHaveBeenCalledTimes(1);
});

it("sem reutilizar a ilustração quando o material muda durante a geração", async () => {
  const root = content();
  let finish!: (value: Response) => void;
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(Response.json({ enabled: true }))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finish = resolve;
          }),
      ),
  );
  vi.stubGlobal(
    "Image",
    class {
      src = "";
      decode = async () => {};
    },
  );
  render(<CoverIllustrationButton getContent={() => root} />);
  fireEvent.click(
    await screen.findByRole("button", {
      name: "Personalizar ilustração da capa",
    }),
  );
  await waitFor(() => expect(finish).toBeDefined());
  root.dataset.printWork = "Outra obra";
  finish(Response.json({ dataUrl: image }));
  expect(await screen.findByRole("alert")).toHaveTextContent("material mudou");
  expect(root.dataset.printGeneratedArt).toBeUndefined();
  root.remove();
});
