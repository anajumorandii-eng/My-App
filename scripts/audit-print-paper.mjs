import fs from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { chromium, expect } from "@playwright/test";

const output = process.env.CRIVO_PRINT_PAPER_OUTPUT || "/tmp/crivo-print-paper";
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const contexts = [
  ["literature", "Literatura", "A vida não é útil"],
  ["blood", "Biologia", "Sangue e imunologia"],
  ["biology", "Biologia", "Ecologia"],
  ["chemistry", "Química", "Soluções"],
  ["physics", "Física", "Óptica"],
  ["mathematics", "Matemática", "Geometria"],
  ["geography", "Geografia", "Cartografia"],
  ["history", "História", "Revolução Francesa"],
];
const results = [];
try {
  const page = await browser.newPage({
    viewport: { width: 1366, height: 1000 },
  });
  await page.routeWebSocket("**", (socket) => socket.close());
  await page.goto(process.env.CRIVO_AUDIT_URL || "http://127.0.0.1:3138", {
    waitUntil: "domcontentloaded",
  });
  await page.emulateMedia({ media: "print" });
  for (const [theme, subject, topic] of contexts) {
    await page.evaluate(
      async ({ subject, topic }) => {
        window.dispatchEvent(new Event("afterprint"));
        const { printStrategyGuide } = await import(
          "/src/lib/printStrategyGuide.ts"
        );
        const article = document.createElement("article");
        Object.assign(article.dataset, {
          printSubject: subject,
          printTopic: topic,
          printBoard: "UNICAMP",
        });
        article.innerHTML =
          "<h2>Conteúdo demonstrativo</h2><p>Exemplo sintético de diagramação.</p>";
        window.print = () => {};
        printStrategyGuide(article, topic);
        await document.querySelector("[data-print-illustration]").decode();
        await document.fonts.ready;
      },
      { subject, topic },
    );
    const bounds = await page
      .locator("[data-print-cover-plate]")
      .evaluate((element) => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      });
    const file = `${output}/${theme}`;
    await page.pdf({
      path: `${file}.pdf`,
      preferCSSPageSize: true,
      printBackground: false,
    });
    execFileSync("pdftoppm", [
      "-f",
      "1",
      "-singlefile",
      "-scale-to-x",
      "794",
      "-scale-to-y",
      "-1",
      "-png",
      `${file}.pdf`,
      file,
    ]);
    // Read actual PDF pixels; CSS declarations alone cannot prove a seamless print.
    const measured = JSON.parse(
      execFileSync(
        "python3",
        [
          "-c",
          `
import json,sys,statistics
from PIL import Image
im=Image.open(sys.argv[1]).convert('RGB');b=json.loads(sys.argv[2]);scale=im.width/(210*96/25.4)
def patch(x,y):
 x=round(x*scale);y=round(y*scale)
 return [statistics.median(im.getpixel((xx,yy))[c] for xx in range(x-2,x+3) for yy in range(y-2,y+3)) for c in range(3)]
paper=patch(b['x']-12,b['y']+b['height']*.5)
samples=[patch(b['x']+b['width']*x,b['y']+b['height']*y) for x,y in [(.08,.025),(.92,.025),(.08,.975),(.92,.975)]]
print(json.dumps({'paper':paper,'samples':samples,'maxPaperDifference':max(abs(a-c) for p in samples for a,c in zip(p,paper))}))
`,
          `${file}.png`,
          JSON.stringify(bounds),
        ],
        { encoding: "utf8" },
      ),
    );
    results.push({ theme, ...measured });
    await fs.writeFile(
      `${output}/results.json`,
      JSON.stringify(results, null, 2),
    );
    expect(
      measured.maxPaperDifference,
      `Fundo retangular na capa ${theme}`,
    ).toBeLessThanOrEqual(2);
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
