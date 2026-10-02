import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const width of [360, 390, 768, 1440]) {
    test(`personalização e busca: ${theme}, ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((theme) => {
        localStorage.setItem('juju_onboarding', 'true');
        localStorage.setItem('crivo_theme', theme);
        localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor: 'automatica', efeitos: 'minimo', fundo: 'caderno', fundoRevisto: true }));
      }, theme);
      await page.goto('/', { waitUntil: 'domcontentloaded' });
      await page.getByRole('button', { name: /Personalizar/ }).filter({ visible: true }).click();
      const panel = page.getByRole('dialog', { name: 'Personalizar o Visual' });
      await expect(panel).toBeVisible();
      await expect.poll(async () => {
        const bounds = await panel.boundingBox();
        return !!bounds && bounds.x >= 0 && bounds.x + bounds.width <= width && bounds.y >= 0 && bounds.y + bounds.height <= 900;
      }).toBe(true);
      const background = panel.getByRole('group', { name: 'Fundo' }).getByRole('button', { name: 'Aurora', exact: true });
      await background.click();
      await expect(background).toHaveAttribute('aria-pressed', 'true');
      await page.keyboard.press('Escape');
      await expect(panel).toHaveCount(0);

      const opener = page.getByRole('button', { name: 'Buscar', exact: true }).filter({ visible: true });
      await opener.click();
      const dialog = page.getByRole('dialog', { name: 'Buscar capítulo' });
      const input = dialog.getByRole('combobox');
      await expect(input).toBeFocused();
      for (const key of ['Tab', 'Shift+Tab']) {
        for (let i = 0; i < 6; i++) {
          await page.keyboard.press(key);
          await expect(input).toBeFocused();
        }
      }
      await input.fill('mitose');
      await expect(dialog.getByRole('option', { name: /Divisão Celular/ })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(opener).toBeFocused();
      await page.keyboard.press('Control+k');
      await expect(page.getByRole('combobox')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(opener).toBeFocused();
    });
  }
}

test('busca mantém e devolve foco durante o carregamento do catálogo', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
  let release!: () => void;
  const loading = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/BuscaRapida*', async (route) => { await loading; await route.continue(); });
  try {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const opener = page.getByRole('button', { name: 'Buscar', exact: true }).filter({ visible: true });
    await opener.click();
    const close = page.getByRole('button', { name: 'Fechar busca' });
    await expect(close).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(close).toBeFocused();
    release();
    await expect(page.getByRole('combobox')).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(opener).toBeFocused();
  } finally { release(); }
});
