import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { chromium, expect } from "@playwright/test";

if (!process.env.CRIVO_GENERATED_ART_FILE)
  throw new Error("Defina CRIVO_GENERATED_ART_FILE para um PNG de teste.");
const source = `data:image/png;base64,${(await fs.readFile(process.env.CRIVO_GENERATED_ART_FILE)).toString("base64")}`;
const output =
  process.env.CRIVO_GENERATED_PRINT_OUTPUT || "/tmp/crivo-print-generated";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 1100 },
  });
  await page.routeWebSocket("**", (socket) => socket.close());
  await page.goto(process.env.CRIVO_AUDIT_URL || "http://127.0.0.1:3138", {
    waitUntil: "domcontentloaded",
  });
  await page.evaluate(async (dataUrl) => {
    const { printStrategyGuide } = await import(
      "/src/lib/printStrategyGuide.ts"
    );
    const { coverContextKey, readPrintCoverContext } = await import(
      "/src/lib/printCoverContext.ts"
    );
    const article = document.createElement("article");
    Object.assign(article.dataset, {
      printSubject: "Biologia",
      printTopic: "Sangue e imunologia",
      printSubtopic: "Memória imunológica e defesa",
      printBoard: "UNICAMP",
      printPurpose: "Compreender mecanismos e aplicar conceitos",
    });
    article.dataset.printGeneratedContext = coverContextKey(
      readPrintCoverContext(article),
    );
    article.dataset.printGeneratedArt = dataUrl;
    article.innerHTML =
      "<h2>Conteúdo demonstrativo</h2><p>Este texto sintético confere a impressão; a ilustração é decorativa e não substitui diagramas didáticos.</p>";
    window.print = () => {};
    printStrategyGuide(article, "Sangue e imunologia");
    await document.querySelector("[data-print-illustration]").decode();
    await document.fonts.ready;
  }, source);
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("[data-print-cover]")).toHaveAttribute(
    "data-print-generated",
    "",
  );
  await expect(page.locator("[data-print-vignette]")).toHaveCount(0);
  expect(
    await page
      .locator("[data-print-illustration]")
      .evaluate((img) => getComputedStyle(img).filter),
  ).toBe("none");
  expect(
    await page
      .locator("[data-print-illustration]")
      .evaluate((img) => getComputedStyle(img).objectFit),
  ).toBe("contain");
  const file = `${output}/capa-gerada.pdf`;
  await page.pdf({
    path: file,
    preferCSSPageSize: true,
    printBackground: false,
  });
  const pages = execFileSync("pdftotext", ["-raw", file, "-"], {
    encoding: "utf8",
  })
    .split("\f")
    .filter((p) => p.trim());
  expect(pages).toHaveLength(3);
  expect(pages[0].replace(/\s/g, "")).toContain("SANGUEEIMUNOLOGIA");
  expect(pages[1]).toContain("Sumário");
  expect(pages[2]).toContain("texto sintético");
  execFileSync("pdftoppm", [
    "-f",
    "1",
    "-singlefile",
    "-scale-to-x",
    "794",
    "-scale-to-y",
    "-1",
    "-png",
    file,
    `${output}/capa-gerada`,
  ]);
  await page.evaluate(() => (window.dispatchEvent(new Event("afterprint")), document.dispatchEvent(new Event("pointerdown"))));
  await expect(page.locator("[data-crivo-print-root]")).toHaveCount(0);
  await fs.writeFile(
    `${output}/results.json`,
    JSON.stringify(
      {
        pages: pages.length,
        nativeText: true,
        generatedArt: true,
        uncropped: true,
        noUnsupportedCaptions: true,
        cleanedUp: true,
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
