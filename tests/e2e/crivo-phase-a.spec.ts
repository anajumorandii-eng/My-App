import { expect, test } from '@playwright/test';

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

test('reduced motion exposes the final decision without animated transforms', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeVisible();
  const animated = await page.locator('[data-motion-active="true"]').count();
  expect(animated).toBe(0);
});

test('every production route remains reachable', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/');
  const links = await page.getByRole('link').evaluateAll((nodes) =>
    [...new Set(nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')).filter(Boolean))],
  );
  for (const href of links) {
    await page.goto(href!, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('main')).toBeVisible();
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
