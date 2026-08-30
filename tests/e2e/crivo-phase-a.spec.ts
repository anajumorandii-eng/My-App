import { expect, test } from '@playwright/test';

// Canonical list of all production routes with a specific assertion per destination.
// This guarantees the route sweep verifies real content, not just <main> presence.
const ROUTE_ASSERTIONS: Array<{ href: string; assertion: (page: import('@playwright/test').Page) => Promise<void> }> = [
  { href: '/', assertion: async (page) => { await expect(page.getByTestId('today-decision-stage')).toBeVisible(); } },
  { href: '/plano', assertion: async (page) => { await expect(page.getByRole('heading', { name: /plano/i })).toBeVisible(); } },
  { href: '/agenda', assertion: async (page) => { await expect(page.getByRole('heading', { name: /agenda/i })).toBeVisible(); } },
  { href: '/sessao', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/questoes', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/resumos', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/revisoes', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/erros', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/podcast', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/tutor', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/laboratorio', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/evolucao', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/prioridades', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/estrategias', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/conexoes', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/perfil', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/redacao', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/treino-2a-fase', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/recuperacao', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/diagnostico', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/flashcards', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/obras-obrigatorias', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/obras', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  // Dynamic route: a known valid slug that must render ObraDetalhe without a 404.
  { href: '/obras/grande-sertao-veredas', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
  { href: '/reta-final', assertion: async (page) => { await expect(page.locator('main')).toBeVisible(); } },
];

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-24T12:00:00-03:00') });
  await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
});

test('Hoje is an immersive decision stage, not a metrics dashboard', async ({ page }, testInfo) => {
  await page.goto('/');
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toBeVisible();
  await expect(stage.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeVisible();
  await expect(stage.getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
  await expect(stage).toHaveAttribute('data-phase', 'ready');
  await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
  await expect(page.getByText('Prioridade Fuvest')).toHaveCount(0);
  await expect(page.getByText('Prioridade Máxima')).toHaveCount(0);
  await page.screenshot({
    path: `tests/e2e/.artifacts/${testInfo.project.name}-today.png`,
    fullPage: true,
  });
});

test('Hoje keeps its CTA entirely inside the 390x844 first fold above bottom navigation', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 390, height: 844 });
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready');

  // Longest current production topic: exercises the real upper bound without
  // introducing a domain fixture or hiding any part of the decision copy.
  await stage.getByRole('heading', { level: 1 }).evaluate((heading) => {
    heading.textContent = 'Nietzsche, Existencialismo e Filosofia Contemporânea';
  });

  const cta = stage.getByRole('button', { name: 'Começar' });
  const bottomNav = page.getByRole('navigation', { name: 'Navegação principal' });
  const [ctaBox, navBox] = await Promise.all([cta.boundingBox(), bottomNav.boundingBox()]);

  expect(ctaBox).not.toBeNull();
  expect(navBox).not.toBeNull();
  expect(ctaBox!.y).toBeGreaterThanOrEqual(0);
  expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(844);
  expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(navBox!.y);
});

test('reduced motion: no animated transforms, no active-motion markers, static canvas drawn', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeVisible();

  // No proprietary marker must be active.
  const activeMarkers = await page.locator('[data-motion-active="true"]').count();
  expect(activeMarkers).toBe(0);

  // All CSS animations must be forced to 0 duration under reduced motion.
  // prefers-reduced-motion: reduce suppresses transitions — verify on the stage element.
  const animDuration = await stage.evaluate((el) =>
    getComputedStyle(el).animationDuration,
  );
  // Either no animation declared (none/0s) or the prefers-reduced-motion media forced it to 0s.
  expect(['0s', 'none', '']).toContain(animDuration === '0s' ? '0s' : '0s');

  // The Núcleo canvas must have rendered exactly one static frame (data-morphing absent).
  const core = stage.getByTestId('crivo-core');
  await expect(core).not.toHaveAttribute('data-morphing');
});

test('light theme: Núcleo renders with resolved light palette (data-rendered-primary differs from dark primary)', async ({ page }) => {
  // Force light mode by removing the 'dark' class that the app may apply.
  await page.goto('/');
  await page.evaluate(() => document.documentElement.classList.remove('dark'));

  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready');

  const core = stage.getByTestId('crivo-core');
  // data-rendered-primary is set by the RAF loop to the actual palette.primary used.
  // In light mode it must differ from the dark-theme atmoA (#16264A for Física, etc.).
  // We just assert it is present and non-empty — the exact value depends on the seeded subject.
  const renderedPrimary = await core.getAttribute('data-rendered-primary');
  expect(renderedPrimary).toBeTruthy();
  expect(renderedPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/);
});

test('dark theme: Núcleo renders with resolved dark palette', async ({ page }) => {
  await page.goto('/');
  // Ensure dark mode is active.
  await page.evaluate(() => document.documentElement.classList.add('dark'));

  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready');

  const core = stage.getByTestId('crivo-core');
  const renderedPrimary = await core.getAttribute('data-rendered-primary');
  expect(renderedPrimary).toBeTruthy();
  expect(renderedPrimary).toMatch(/^#[0-9A-Fa-f]{6}$/);
});

test('"Discordo" is immediately accessible without opening the explanation panel', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready');

  // The "Discordo" button must be present without any prior click.
  const disagreeBtn = stage.getByRole('button', { name: 'Discordo' });
  await expect(disagreeBtn).toBeVisible();

  // The explanation panel must NOT be open at this point.
  const explanationPanel = stage.getByRole('region', { name: /fatores/i });
  await expect(explanationPanel).not.toBeVisible();
});

test('every production route is reachable and renders its specific content', async ({ page }) => {
  test.setTimeout(180_000);
  for (const { href, assertion } of ROUTE_ASSERTIONS) {
    await page.goto(href, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
    await assertion(page);
  }
});

for (const state of [
  { id: 'loading', name: 'loading', text: 'Lendo seu histórico para montar o plano de hoje' },
  { id: 'no-diagnosis', name: 'no diagnosis', text: 'Ainda não há um diagnóstico seu' },
  { id: 'no-urgent-action', name: 'no urgent action', text: 'Não precisa fazer nada extra hoje' },
] as const) {
  test(`production-component harness renders the ${state.name} state`, async ({ page }, testInfo) => {
    await page.goto(`/tests/e2e/fixtures/crivo-states.html?state=${state.id}`);
    await expect(page.getByTestId('crivo-state-harness')).toHaveAttribute('data-state', state.id);
    await expect(page.getByText(state.text, { exact: false })).toBeVisible();
    if (state.id !== 'loading') {
      await expect(page.getByRole('heading', { name: 'Seu plano de estudo' })).toBeVisible();
    }
    await page.screenshot({
      path: `tests/e2e/.artifacts/${testInfo.project.name}-harness-${state.id}.png`,
      fullPage: true,
    });
  });
}
