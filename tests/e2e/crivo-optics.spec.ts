import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) {
  for (const width of [360, 390, 768, 1440]) {
    test(`óptica: ${theme}, ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((theme) => {
        localStorage.setItem('juju_onboarding', 'true');
        localStorage.setItem('crivo_theme', theme);
        localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor: 'automatica', efeitos: 'minimo', fundo: 'caderno', fundoRevisto: true }));
      }, theme);
      await page.goto('/visual?summary=summary-fisica-reflexao-em-superficies-esfericas', { waitUntil: 'domcontentloaded' });
      const slider = page.locator('#optics-spherical-mirror');
      await expect(slider).toBeVisible();
      for (const p of [10, 20, 25, 30, 35, 60, 90]) {
        await slider.focus();
        await page.keyboard.press('Home');
        for (let step = 10; step < p; step += 5) await page.keyboard.press('ArrowRight');
        await expect(slider).toHaveValue(String(p));
        const geometry = await page.locator('.vs-instrument svg').evaluate((svg) => {
          const nums = (selector: string) => svg.querySelector(selector)?.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
          const circles = Array.from(svg.querySelectorAll('circle')).map(c => Number(c.getAttribute('cx')));
          const scale = (circles[0] - circles[1]) / 30;
          const vertex = circles[0] + 30 * scale;
          const object = nums('.vs-optics-object');
          const image = nums('.vs-optics-image');
          const rays = Array.from(svg.querySelectorAll('.vs-optics-reflected')).map(r => r.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number));
          return { p: (vertex - object[0]) / scale, q: image.length ? (vertex - image[0]) / scale : null,
            amplification: image.length ? (150 - image[2]) / (150 - object[2]) : null,
            slopes: rays.map(r => (r[3] - r[1]) / (r[2] - r[0])), extensions: svg.querySelectorAll('.vs-optics-extension').length };
        });
        expect(geometry.p).toBeCloseTo(p, 5);
        if (p === 30) {
          expect(geometry.q).toBeNull();
          expect(geometry.slopes).toHaveLength(2);
          expect(geometry.slopes[0]).toBeCloseTo(geometry.slopes[1], 5);
        } else {
          const q = 1 / (1 / 30 - 1 / p);
          expect(geometry.q).toBeCloseTo(q, 5);
          expect(geometry.amplification).toBeCloseTo(-q / p, 5);
          expect(geometry.extensions).toBe(q < 0 ? 1 : 0);
        }
        if ((width === 390 && theme === 'light') && [25, 30, 35].includes(p)) {
          const scene = page.locator('.vs-instrument');
          await scene.evaluate(el => el.scrollIntoView({ block: 'center' }));
          await scene.screenshot({ path: `docs/visual-integral-2026-10-02/segundo-lote/espelho-${p}-mobile.png` });
        }
      }
      await page.goto('/visual?summary=summary-fisica-optica-da-visao', { waitUntil: 'domcontentloaded' });
      const scene = page.locator('.vs-vision-diagram');
      await expect(scene).toBeVisible();
      const labelSizes = await scene.locator('svg text').evaluateAll(labels => labels.map(label => {
        const svg = (label as SVGTextElement).ownerSVGElement!;
        return parseFloat(getComputedStyle(label).fontSize) * svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
      }));
      for (const size of labelSizes) expect(size).toBeGreaterThanOrEqual(9);
      for (const corrected of [false, true]) {
        const button = page.getByRole('button', { name: corrected ? 'Com correção' : 'Sem correção', exact: true });
        await button.focus();
        await page.keyboard.press('Enter');
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        const eyes = await scene.locator('[data-vision-defect]').evaluateAll(groups => groups.map(eye => {
          const cross = Array.from(eye.querySelectorAll('path')).find(p => /128\s*V172/.test(p.getAttribute('d') ?? ''))!;
          return { opacity: Number(eye.getAttribute('opacity') ?? 1), focus: Number(cross.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)![0]),
            rays: eye.querySelectorAll('[data-vision-ray]').length, extensions: eye.querySelectorAll('[data-vision-extension]').length,
            lenses: eye.querySelectorAll('path[fill*="--vs-burgundy"]').length };
        }));
        expect(eyes).toHaveLength(2);
        for (const eye of eyes) { expect(eye.opacity).toBe(1); expect(eye.rays).toBe(2); expect(eye.lenses).toBe(corrected ? 1 : 0); }
        if (corrected) { for (const eye of eyes) { expect(eye.focus).toBeCloseTo(260); expect(eye.extensions).toBe(0); } }
        else { expect(eyes[0].focus).toBeLessThan(260); expect(eyes[1].focus).toBeGreaterThan(260); expect(eyes[1].extensions).toBe(2); }
        const bounds = await scene.boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        if ((width === 390 && theme === 'light') || (width === 1440 && theme === 'dark')) {
          await scene.evaluate(el => el.scrollIntoView({ block: 'center' }));
          await scene.screenshot({ path: `docs/visual-integral-2026-10-02/segundo-lote/visao-${corrected ? 'com' : 'sem'}-${width}-${theme}.png` });
        }
      }
    });
  }
}

for (const width of [390, 1440]) {
  test(`visão preserva os raios com movimento e seleção: ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.addInitScript(() => {
      localStorage.setItem('juju_onboarding', 'true');
      localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor: 'automatica', efeitos: 'completo', fundo: 'caderno', fundoRevisto: true }));
    });
    await page.goto('/visual?summary=summary-fisica-optica-da-visao', { waitUntil: 'domcontentloaded' });
    const scene = page.locator('.vs-vision-diagram');
    await expect(scene).toBeVisible();
    for (const side of ['expansion', 'compression']) {
      await page.locator(`.vs-concept-card--${side}`).click();
      await expect.poll(async () => scene.locator('[data-vision-defect]').evaluateAll(eyes => eyes.every(eye => getComputedStyle(eye).opacity === '1' && Array.from(eye.querySelectorAll('[data-vision-ray]')).every(ray => getComputedStyle(ray).opacity === '1' && !ray.hasAttribute('pathLength'))))).toBe(true);
      await page.getByRole('button', { name: 'Fechar inspetor', exact: true }).click();
    }
  });
}
