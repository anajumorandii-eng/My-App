import { expect, test } from '@playwright/test';

for (const width of [901, 1024, 1280, 1366, 1440]) {
  for (const theme of ['light', 'dark']) {
    test(`lateral reserva espaço em ${width}px / ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((theme) => {
        localStorage.setItem('juju_onboarding', 'true');
        localStorage.setItem('crivo_rail_expanded', 'true');
        localStorage.setItem('crivo_theme', theme);
      }, theme);
      await page.goto('/');
      const rail = page.locator('.ni-production-app > .ni-rail');
      const content = page.locator('.ni-page');
      await expect(rail).toBeVisible();
      const verify = async () => {
        const r = (await rail.boundingBox())!;
        const c = (await content.boundingBox())!;
        expect(c.x).toBeGreaterThanOrEqual(r.x + r.width - 1);
        expect(c.x + c.width).toBeLessThanOrEqual(width + 1);
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      };
      await verify();
      await page.getByRole('button', {name:'Recolher barra lateral'}).click();
      await expect(rail).not.toHaveClass(/is-expanded/);
      await verify();
      await page.getByRole('button', {name:'Expandir barra lateral'}).click();
      await verify();
      await page.reload();
      await verify();
    });
  }
}

test('marca continua visível quando a imagem não carrega', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
  await page.route('**/icon-192.png*', route => route.abort());
  await page.goto('/');
  await expect(page.locator('.ni-mark svg')).toBeVisible();
});

for (const width of [390, 834, 900]) {
  test(`gaveta contém foco e fecha com Escape em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1112 });
    await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
    await page.goto('/');
    const open = page.getByRole('button', { name: 'Abrir menu' });
    await open.click();
    const drawer = page.locator('.ni-rail');
    await expect(drawer).toHaveClass(/is-open/);
    await expect.poll(() => drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Shift+Tab');
    await expect.poll(() => drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Tab');
    await expect.poll(() => drawer.evaluate(el => el.contains(document.activeElement))).toBe(true);
    await page.keyboard.press('Escape');
    await expect(drawer).not.toHaveClass(/is-open/);
    await expect(open).toBeFocused();
    await open.click();
    await page.setViewportSize({width:1366,height:900});
    await expect(drawer).not.toHaveClass(/is-open/);
    await expect(page.locator('.ni-page')).not.toHaveAttribute('inert', '');
  });
}
