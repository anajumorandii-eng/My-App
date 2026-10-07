import { expect, test } from '@playwright/test';

// Canonical list of all production routes with a specific assertion per destination.
// This guarantees the route sweep verifies real content, not just <main> presence.
const ROUTE_ASSERTIONS: Array<{ href: string; assertion: (page: import('@playwright/test').Page) => Promise<void> }> = [
  { href: '/', assertion: async (page) => { await expect(page.getByTestId('today-decision-stage')).toBeVisible(); } },
  { href: '/plano', assertion: async (page) => { await expect(page.getByRole('heading', { name: /plano/i })).toBeVisible(); } },
  { href: '/agenda', assertion: async (page) => { await expect(page.getByRole('heading', { name: /agenda/i })).toBeVisible(); } },
  { href: '/sessao', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/questoes', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/resumos', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/revisoes', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/erros', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/podcast', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/tutor', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/laboratorio', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/evolucao', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/prioridades', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/estrategias', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/conexoes', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/perfil', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/redacao', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/treino-2a-fase', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/recuperacao', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/diagnostico', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/flashcards', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/obras-obrigatorias', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/obras', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  // Dynamic route: a known valid slug that must render ObraDetalhe without a 404.
  { href: '/obras/grande-sertao-veredas', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
  { href: '/reta-final', assertion: async (page) => { await expect(page.locator('main').first()).toBeVisible(); } },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
});

test('Hoje renders the current decision, evidence and CTA without the retired core', async ({ page }, testInfo) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toBeVisible();
  await expect(stage.getByRole('heading', { level: 2 })).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeVisible();
  await expect(stage.getByTestId('crivo-core')).toHaveCount(0);
  await expect(stage.locator('.ni-metrics')).toBeVisible();
  await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });
  await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
  await expect(page.getByText('Prioridade Fuvest')).toHaveCount(0);
  await expect(page.getByText('Prioridade Máxima')).toHaveCount(0);
  await page.screenshot({
    path: testInfo.outputPath('today.png'),
    fullPage: true,
  });
});

test('Hoje keeps its CTA entirely inside the 390x844 first fold above bottom navigation', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.setViewportSize({ width: 390, height: 844 });
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });

  // Longest current production topic: exercises the real upper bound without
  // introducing a domain fixture or hiding any part of the decision copy.
  await stage.getByRole('heading', { level: 2 }).evaluate((heading) => {
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

test('reduced motion keeps the decision and disclosed evidence in their final frame', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });
  await expect(stage.getByRole('heading', { level: 2 })).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeEnabled();
  await expect(stage.getByTestId('crivo-core')).toHaveCount(0);
  await expect(page.locator('[data-motion-active="true"]')).toHaveCount(0);
  await expect.poll(() => stage.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  await stage.getByRole('button', { name: 'Por que isso?' }).click();
  const evidence = stage.getByRole('region', { name: 'Fatores da recomendação' });
  await expect(evidence).toBeVisible();
  await expect(stage).toHaveAttribute('data-phase', 'decomposed');
  await expect.poll(() => evidence.evaluate((el) => getComputedStyle(el).transform)).toBe('none');
  await expect.poll(() => stage.evaluate((el) => el.getAnimations({ subtree: true })
    .filter((animation) => animation.playState === 'running' && animation.effect?.getTiming().iterations === Infinity).length)).toBe(0);
});

for (const theme of ['light', 'dark']) {
  test(`${theme} theme keeps the current decision content readable without the retired core`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate((dark) => document.documentElement.classList.toggle('dark', dark), theme === 'dark');
    const stage = page.getByTestId('today-decision-stage');
    await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });
    await expect(stage.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(stage.getByRole('button', { name: 'Começar' })).toBeEnabled();
    await expect(stage.getByTestId('crivo-core')).toHaveCount(0);
    const colors = await stage.locator('.ni-decision').evaluate((el) => {
      const style = getComputedStyle(el);
      return { color: style.color, background: style.backgroundColor };
    });
    expect(colors.color).not.toBe(colors.background);
  });
}

test('"Discordo" is immediately accessible without opening the explanation panel', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });

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
    await expect(page.locator('main').first()).toBeVisible();
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
      path: testInfo.outputPath(`harness-${state.id}.png`),
      fullPage: true,
    });
  });
}

test.describe('iPad landscape touch rendering', () => {
  test.use({ viewport: { width: 1366, height: 900 }, hasTouch: true, isMobile: true });

  test('avoids expensive paper and glass effects and remains interactive after refresh and navigation', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => matchMedia('(pointer: coarse)').matches)).toBe(true);
    const stage = page.getByTestId('today-decision-stage');
    await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });
    const styles = await page.locator('.ni-production-app').evaluate((el) => {
      const style = getComputedStyle(el);
      return { fibers: style.getPropertyValue('--papel-fibras').trim(), attachment: style.backgroundAttachment };
    });
    expect(styles.fibers).toBe('none');
    expect(styles.attachment.split(',').every((attachment) => attachment.trim() === 'scroll')).toBe(true);
    for (const selector of ['.ni-panel', '.ni-top', '.ni-rail']) {
      const effects = await page.locator(selector).evaluateAll((elements) => elements.map((el) => {
        const style = getComputedStyle(el);
        return { filter: style.backdropFilter, background: style.backgroundColor };
      }));
      expect(effects.length).toBeGreaterThan(0);
      for (const effect of effects) {
        expect(effect.filter).toBe('none');
        expect(effect.background).toMatch(/^rgb\(/);
      }
    }
    await page.reload();
    await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });
    await stage.getByRole('button', { name: 'Por que isso?' }).tap();
    await expect(stage.getByRole('region', { name: 'Fatores da recomendação' })).toBeVisible();
    await stage.getByRole('button', { name: 'Por que isso?' }).tap();
    await expect(stage.getByRole('region', { name: 'Fatores da recomendação' })).toHaveCount(0);
    await page.goto('/agenda');
    await expect(page.getByRole('heading', { name: /agenda/i })).toBeVisible();
    await page.goBack();
    await expect(stage).toHaveAttribute('data-phase', 'ready', { timeout: 15_000 });
    await stage.getByRole('button', { name: 'Começar' }).tap();
    await expect(page).not.toHaveURL(/\/$/);
    await expect(page.locator('main').first()).toBeVisible();
  });
});
