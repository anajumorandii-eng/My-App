import { expect, test } from '@playwright/test';

for (const id of ['summary-gramatica-concordancia', 'fis-termologia-calor', 'summary-historia-introducao-a-historia-e-primeiras-civilizacoes']) {
  test(`${id}: cena e leitura completas, sem janelas de rolagem concorrentes`, async ({ page }, info) => {
    test.setTimeout(120_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
    await page.goto(`/visual?summary=${id}`);
    const reading = page.getByRole('region', { name: 'Percurso do capítulo' });
    await expect(reading).toBeAttached({ timeout: 60_000 });
    const scene = page.locator(`[data-chapter-scene="${id}"]`);
    await expect(scene).toBeAttached();
    // Both chapter representations remain available without replacing a layer.
    await expect(scene.locator('.vs-chapter-spatial-supplement')).toBeAttached();
    const steps = reading.getByRole('navigation', { name: 'Etapas do capítulo' }).getByRole('button');
    for (const width of [1440, 834, 390, 360]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
      for (let index = 0; index < await steps.count(); index++) await expect(steps.nth(index).locator('strong')).toBeVisible();
      const clipped = await scene.evaluate(element => {
        const problems: string[] = [];
        for (let node = element; node && !node.classList.contains('crivo-visual'); node = node.parentElement!) {
          const style = getComputedStyle(node);
          if (['auto', 'scroll', 'hidden', 'clip'].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 2) problems.push(node.className);
        }
        return problems;
      });
      expect(clipped).toEqual([]);
      const clippedReading = await reading.locator('article p').evaluateAll(paragraphs => paragraphs.flatMap(element => {
        const problems: string[] = [];
        for (let node = element; node && !node.classList.contains('vs-journey'); node = node.parentElement!) {
          const style = getComputedStyle(node);
          if (style.maskImage !== 'none' || (['hidden', 'clip'].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 2)) problems.push(node.className);
        }
        return problems;
      }));
      expect(clippedReading).toEqual([]);
    }
    const activate = info.project.name === 'ipad-webkit' ? 'tap' : 'click';
    await scene.getByRole('button', { name: 'Explorar em foco' })[activate]();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(scene.getByRole('button', { name: 'Explorar em foco' })).toBeFocused();
  });
}
