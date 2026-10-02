import { expect, test } from '@playwright/test';

for (const theme of ['light', 'dark']) for (const width of [360, 390, 768, 1440]) {
  test(`sistemas e determinantes: ${theme}, ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true');
      localStorage.setItem('crivo_theme', theme);
      localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor:'automatica', efeitos:'minimo', fundo:'caderno', fundoRevisto:true }));
    }, theme);
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    for (const kind of ['sistemas', 'determinante']) {
      const summary = kind === 'sistemas' ? 'sistemas-de-equacoes' : 'determinantes';
      await page.goto(`/visual?summary=summary-matematica-${summary}`, { waitUntil:'domcontentloaded' });
      const slider = page.locator(`#matrix-${kind}`);
      await expect(slider).toBeVisible();
      const steps = kind === 'sistemas' ? [0, 5, 6, 10] : [0, 9, 10, 12, 15];
      for (const step of steps) {
        await slider.focus();
        await page.keyboard.press('Home');
        for (let i = 0; i < step; i++) await page.keyboard.press('ArrowRight');
        const value = kind === 'sistemas' ? step : step / 3;
        expect(Number(await slider.inputValue())).toBeCloseTo(value, 6);
        const actual = await page.locator('.vs-matrix').evaluate(svg => {
          const nums = (selector: string) => svg.querySelector(selector)!.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
          const dot = svg.querySelector('.vs-matrix-dot');
          if (dot) {
            const x = Number(dot.getAttribute('cx')), y = Number(dot.getAttribute('cy'));
            const lines = Array.from(svg.querySelectorAll('.vs-matrix-line')).map(l => l.getAttribute('d')!.match(/-?\d+(?:\.\d+)?/g)!.map(Number));
            return { x: (x - 60) / 19, y: (246 - y) / 19, intersections: lines.map(([x1,y1,x2,y2]) => (x-x1)*(y2-y1)-(y-y1)*(x2-x1)), area: null };
          }
          const [ox,oy,ux,uy,sx,sy,vx,vy] = nums('.vs-matrix-area');
          const scale = (ux - ox) / 2;
          return { x:null, y:null, intersections:[], area: -((ux-ox)*(vy-oy)-(uy-oy)*(vx-ox))/(scale*scale) };
        });
        if (kind === 'sistemas') {
          expect(actual.x).toBeCloseTo(value); expect(actual.y).toBeCloseTo(10-value);
          expect(actual.intersections[0]).toBeCloseTo(0);
          if (value === 6) expect(actual.intersections[1]).toBeCloseTo(0);
          else expect(Math.abs(actual.intersections[1])).toBeGreaterThan(0);
        } else {
          expect(actual.area).toBeCloseTo(10 - 3 * value, 6);
          if (step === 10) {
            await expect(page.locator('.vs-plane-readouts')).toContainText('colinear');
            await expect(page.locator('.vs-plane-readouts')).toContainText('não');
            await expect(page.locator('.vs-plane-control b')).toHaveText('10/3');
          }
        }
        const bounds = await page.locator('.vs-matrix-instrument').boundingBox();
        expect(bounds!.x).toBeGreaterThanOrEqual(0);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
        if ((width === 390 && theme === 'light') || (width === 1440 && theme === 'dark')) {
          if ((kind === 'sistemas' && [5,6].includes(step)) || (kind === 'determinante' && [0,10,12].includes(step))) {
            const scene = page.locator('.vs-matrix-instrument');
            await scene.evaluate(el => el.scrollIntoView({block:'center'}));
            await scene.screenshot({path:`docs/visual-integral-2026-10-02/terceiro-lote/${kind}-${step}-${width}-${theme}.png`});
          }
        }
      }
    }
    expect(errors).toEqual([]);
  });
}
