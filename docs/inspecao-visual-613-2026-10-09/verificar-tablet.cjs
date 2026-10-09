const { chromium } = require("playwright");
const fs = require("fs"), assert = require("assert/strict");
const root = process.env.CRIVO_VISUAL_AUDIT_DIR || "work/inspecao-613";
const xs = JSON.parse(fs.readFileSync(__dirname + "/inventario-base.json"));
const models = require("../../src/views/visual-boards/chapterIconModels.json");
(async () => {
  const b = await chromium.launch({ executablePath: "/usr/bin/chromium", args: ["--no-sandbox"] });
  fs.mkdirSync(root, { recursive: true });
  const previous = fs.existsSync(root + "/tablet-result.json") ? JSON.parse(fs.readFileSync(root + "/tablet-result.json")) : [];
  const records = previous.filter((r) => r.passed);
  const passedIds = new Set(records.map((r) => r.id));
  await Promise.all([0, 1].map(async (part) => {
    let c = await b.newContext({ viewport: { width: 834, height: 1112 }, reducedMotion: "reduce" });
    await c.addInitScript(() => {
      localStorage.setItem("juju_onboarding", "true");
      localStorage.setItem("crivo_theme", "light");
      localStorage.setItem("crivo_visual_preferencias", JSON.stringify({ fundo: "caderno", cor: "automatica", efeitos: "minimo", fundoRevisto: true }));
    });
    let p = await c.newPage();
    let first = true;
    for (let i = part; i < xs.length; i += 2) {
      const ch = xs[i];
      if (passedIds.has(ch.id)) continue;
      const r = { id: ch.id, width: 834 };
      try {
        if (first) {
          await p.goto((process.env.CRIVO_VISUAL_URL || "http://localhost:3000") + "/visual?summary=" + ch.id);
          first = false;
        } else await p.evaluate((id) => {
          history.pushState({}, "", "/visual?summary=" + id);
          dispatchEvent(new PopStateEvent("popstate"));
        }, ch.id);
        const f = p.locator('[data-chapter-scene="' + ch.id + '"]');
        await f.locator(".vs-chapter-scene-body section").first().waitFor({ timeout: 6e4 });
        assert.equal(await f.locator(".vs-chapter-object").getAttribute("data-study-object"), models[ch.id].model);
        assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        await f.getByRole("button", { name: "Explorar em foco", exact: true }).click();
        const concepts = f.locator(".hu-concepts");
        await concepts.locator("summary").focus();
        await p.keyboard.press("Enter");
        await concepts.locator("button").nth(1).focus();
        await p.keyboard.press("Enter");
        await p.getByRole("button", { name: "Fechar inspetor", exact: true }).waitFor();
        assert.equal(await f.getAttribute("role"), null);
        assert.ok(await p.getByRole("button", { name: "Fechar inspetor", exact: true }).evaluate((e) => {
          for (let n = e; n; n = n.parentElement) if (n.inert) return false;
          return true;
        }));
        await p.getByRole("button", { name: "Fechar inspetor", exact: true }).click();
        r.iconCorrect = true;
        r.conceptKeyboardSelection = true;
        r.passed = true;
      } catch (e) {
        r.passed = false;
        r.error = e.message;
        first = true;
        await c.close();
        c = await b.newContext({ viewport: { width: 834, height: 1112 }, reducedMotion: "reduce" });
        await c.addInitScript(() => {
          localStorage.setItem("juju_onboarding", "true");
          localStorage.setItem("crivo_theme", "light");
          localStorage.setItem("crivo_visual_preferencias", JSON.stringify({ fundo: "caderno", cor: "automatica", efeitos: "minimo", fundoRevisto: true }));
        });
        p = await c.newPage();
        console.log("FAIL " + i + " " + e.message.slice(0, 160));
      }
      records.push(r);
      fs.writeFileSync(root + "/tablet-progress.json", JSON.stringify(records));
      if (i % 80 === 0) console.log("tablet " + i + "/613");
    }
    await c.close();
  }));
  await b.close();
  fs.writeFileSync(root + "/tablet-result.json", JSON.stringify(records, null, 2));
  console.log("FINAL " + records.length + " failures " + records.filter((r) => !r.passed).length);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
