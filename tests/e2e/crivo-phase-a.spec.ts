import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date('2026-08-24T12:00:00-03:00') });
  await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
  await page.goto('/');
});

test('Hoje is an immersive decision stage, not a metrics dashboard', async ({ page }, testInfo) => {
  const stage = page.getByTestId('today-decision-stage');
  await expect(stage).toBeVisible();
  await expect(stage.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(stage.getByRole('button', { name: 'Começar' })).toBeVisible();
  await expect(stage.getByTestId('crivo-core')).toHaveAttribute('data-scale', 'hero');
  await expect(stage).toHaveAttribute('data-phase', 'ready');
  await expect(page.getByText('Prioridade Fuvest')).toHaveCount(0);
  await expect(page.getByText('Prioridade Máxima')).toHaveCount(0);
  await page.screenshot({
    path: `tests/e2e/.artifacts/${testInfo.project.name}-today.png`,
    fullPage: true,
  });
});

test('every production route remains reachable', async ({ page }) => {
  const links = await page.getByRole('link').evaluateAll((nodes) =>
    [...new Set(nodes.map((node) => (node as HTMLAnchorElement).getAttribute('href')).filter(Boolean))],
  );
  for (const href of links) {
    await page.goto(href!);
    await expect(page.locator('main')).toBeVisible();
  }
});
