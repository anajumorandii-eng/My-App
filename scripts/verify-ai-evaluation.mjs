import { chromium } from "@playwright/test";
import fs from "node:fs";
const config = JSON.parse(
  fs.readFileSync(
    new URL("../firebase-applet-config.json", import.meta.url),
    "utf8",
  ),
);
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  const context = await browser.newContext({
    viewport: { width: 1366, height: 900 },
    reducedMotion: "reduce",
  });
  const errors = [];
  const session = {
    id: "11111111-1111-4111-8111-111111111111",
    title: "Sessão demonstrativa",
    status: "active",
    startedAt: "2026-10-16T18:00:00Z",
    endedAt: null,
    runCount: 1,
  };
  const run = {
    id: "22222222-2222-4222-8222-222222222222",
    sessionId: session.id,
    kind: "comparison",
    task: "review-tip",
    source: "/revisoes",
    payload: { topic: "Revisão espaçada", subject: "Biologia" },
    prompt: "Explique como distribuir revisões ao longo da semana.",
    promptVersion: "fixture-example",
    promptTruncated: false,
    startedAt: session.startedAt,
    status: "completed",
    variants: [
      {
        label: "A",
        status: "completed",
        text: "Distribua revisões em intervalos crescentes. Antes de reler, tente recuperar a explicação de memória e confira os pontos que faltaram.\n\nDepois, resolva uma questão nova para verificar se consegue aplicar o conceito.",
        durationMs: 3200,
        firstTokenMs: 500,
        cached: false,
        fallback: false,
      },
      {
        label: "B",
        status: "completed",
        text: "Comece com uma revisão curta no dia seguinte e ajuste os intervalos conforme sua recuperação.\n\nSe não lembrar um conceito, volte à explicação e teste novamente sem consultar. A dificuldade de lembrar orienta a próxima revisão.",
        durationMs: 4400,
        firstTokenMs: 700,
        cached: false,
        fallback: false,
      },
    ],
  };
  await context.addInitScript(
    ({ apiKey }) => {
      localStorage.setItem("juju_onboarding", "true");
      const payload = {
        iss: "fixture",
        aud: "fixture",
        sub: "evaluation-fixture",
        user_id: "evaluation-fixture",
        email: "tester@example.test",
        email_verified: true,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
        auth_time: Math.floor(Date.now() / 1000),
        firebase: { identities: {}, sign_in_provider: "google.com" },
      };
      const enc = (o) =>
        btoa(JSON.stringify(o))
          .replaceAll("=", "")
          .replaceAll("+", "-")
          .replaceAll("/", "_");
      const token =
        enc({ alg: "none", typ: "JWT" }) + "." + enc(payload) + ".fixture";
      localStorage.setItem(
        `firebase:authUser:${apiKey}:[DEFAULT]`,
        JSON.stringify({
          uid: "evaluation-fixture",
          email: "tester@example.test",
          emailVerified: true,
          isAnonymous: false,
          providerData: [
            {
              providerId: "google.com",
              uid: "fixture",
              displayName: "Conta de teste",
              email: "tester@example.test",
              photoURL: null,
            },
          ],
          stsTokenManager: {
            refreshToken: "fixture",
            accessToken: token,
            expirationTime: Date.now() + 3600000,
          },
          createdAt: String(Date.now()),
          lastLoginAt: String(Date.now()),
          apiKey,
          appName: "[DEFAULT]",
        }),
      );
    },
    { apiKey: config.apiKey },
  );
  await context.route("**/api/ai-evaluation/**", (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path.endsWith("/review") && route.request().method() === "POST") {
      run.review = {
        ...JSON.parse(route.request().postData()),
        reviewedAt: "2026-10-16T19:00:00Z",
      };
      run.variants.forEach((v, i) => {
        v.requestedModel = `candidato-${i + 1}`;
        v.model = `reportado-${i + 1}`;
      });
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(run),
      });
    }
    if (path.endsWith("/outcome") && route.request().method() === "PATCH") {
      run.review.outcome = JSON.parse(route.request().postData()).outcome;
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: '{"ok":true}',
      });
    }
    const body = path.endsWith("/sessions")
      ? {
          sessions: [session],
          candidates: [
            { id: "primary", label: "Principal" },
            { id: "fast", label: "Rápido" },
          ],
          maxRuns: 200,
        }
      : { session, runs: [run], summary: [] };
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  await context.route("**/identitytoolkit.googleapis.com/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        users: [
          {
            localId: "evaluation-fixture",
            email: "tester@example.test",
            emailVerified: true,
            displayName: "Conta de teste",
            providerUserInfo: [
              {
                providerId: "google.com",
                rawId: "fixture",
                email: "tester@example.test",
              },
            ],
            validSince: "0",
            createdAt: String(Date.now()),
            lastLoginAt: String(Date.now()),
          },
        ],
      }),
    }),
  );
  await context.route("**/firestore.googleapis.com/**", (route) =>
    route.abort(),
  );
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  page.on("pageerror", (e) => errors.push(e.message));
  const preview = new URL(
    process.env.CRIVO_PREVIEW_URL || "http://127.0.0.1:4173",
  );
  if (!["127.0.0.1", "localhost"].includes(preview.hostname))
    throw new Error("Use apenas um preview local com dados simulados.");
  await page.goto(new URL("/avaliacao-ia", preview).href);
  await page
    .getByRole("heading", { name: "Avaliação de IA", exact: true })
    .waitFor({ timeout: 20000 });
  await page.getByRole("button", { name: /review-tip/ }).click();
  await page
    .getByRole("heading", { name: "Resposta A", exact: true })
    .waitFor();
  const output = new URL("../docs/ai-evaluation/screenshots", import.meta.url)
    .pathname;
  fs.mkdirSync(output, { recursive: true });
  for (const [name, size] of [
    ["desktop", { width: 1366, height: 900 }],
    ["tablet", { width: 834, height: 1112 }],
    ["mobile", { width: 390, height: 844 }],
  ]) {
    await page.setViewportSize(size);
    await page.waitForTimeout(200);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    console.log(name, "overflow", overflow);
    if (overflow) errors.push(name + " horizontal overflow");
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 1366, height: 900 });
  await page
    .getByRole("button", { name: "Mudar para modo escuro" })
    .first()
    .click();
  await page.screenshot({ path: `${output}/desktop-dark.png`, fullPage: true });
  if (await page.getByText(/Modelo solicitado:/).count())
    errors.push("Blind identity exposed before review");
  for (const letter of ["A", "B"])
    for (const field of ["Clareza", "Cumprimento do pedido", "Utilidade"])
      await page
        .getByLabel(new RegExp(`${field} — ${letter}`))
        .selectOption("4");
  await page.getByLabel(/^Preferência/).selectOption("tie");
  await page
    .getByRole("button", { name: "Salvar avaliação e revelar modelos" })
    .click();
  await page.getByText(/Modelo solicitado: candidato-1/).waitFor();
  await page
    .getByLabel("Resultado posterior no estudo")
    .fill("Consegui aplicar a orientação em outra questão.");
  await page
    .getByRole("button", { name: "Atualizar resultado posterior" })
    .click();
  await page.getByLabel("Resultado posterior no estudo").waitFor();
  await page.screenshot({
    path: `${output}/reviewed-dark.png`,
    fullPage: true,
  });
  await page.keyboard.press("Tab");
  console.log(
    "REVIEW_REVEAL_AND_FOLLOWUP",
    run.review?.preference,
    run.review?.outcome,
  );
  console.log("PAGE_ERRORS", JSON.stringify(errors));
  await browser.close();
  if (errors.length) process.exitCode = 1;
} finally {
  await browser.close();
}
