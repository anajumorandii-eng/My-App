import { expect as baseExpect, test } from '@playwright/test';

const expect = baseExpect.configure({ timeout: 20000 });

for (const width of [390, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    for (const reducedMotion of ['no-preference', 'reduce'] as const) {
      test.describe(`${width}px / ${theme} / ${reducedMotion}`, () => {
        test.use({ viewport: { width, height: 1000 }, colorScheme: theme, contextOptions: { reducedMotion } });
        test.beforeEach(async ({ page }) => {
          await page.addInitScript((theme) => {
            localStorage.setItem('juju_onboarding', 'true');
            localStorage.setItem('crivo_theme', theme);
          }, theme);
        });

        test('Gibbs mantém eixos e reta visíveis', async ({ page }) => {
          await page.goto('/visual?summary=summary-quimica-termoquimica-ii');
          const scene = page.getByRole('img', { name: /Balanço de energia livre de Gibbs/ });
          await expect(scene).toBeVisible();
          const strokes = await scene.locator('path').evaluateAll((paths) =>
            paths.map((path) => ({ stroke: getComputedStyle(path).stroke, fill: getComputedStyle(path).fill })),
          );
          expect(strokes).toHaveLength(2);
          for (const style of strokes) {
            expect(style.stroke).not.toBe('none');
            expect(style.fill).toBe('none');
          }
          const labelsCrossingCurve = await scene.evaluate((svg) => {
            const curve = svg.querySelectorAll('path')[1];
            const length = curve.getTotalLength();
            return [...svg.querySelectorAll('text')].filter((label) => {
              const b = label.getBBox();
              for (let distance = 0; distance <= length; distance += 1) {
                const point = curve.getPointAtLength(distance);
                if (point.x >= b.x && point.x <= b.x + b.width && point.y >= b.y && point.y <= b.y + b.height) return true;
              }
              return false;
            }).map((label) => label.textContent);
          });
          expect(labelsCrossingCurve).toEqual([]);
        });

        test('Mendel alterna para Primeira Lei e restaura o padrão ao fechar', async ({ page }) => {
          await page.goto('/visual?summary=summary-biologia-segunda-lei-de-mendel');
          const scene = page.locator('.vs-study-board svg[role="img"]');
          await expect(scene).toHaveAttribute('aria-label', /4 por 4.*9:3:3:1/);
          await page.getByRole('button', { name: /^Primeira lei/ }).click();
          await expect(scene).toHaveAttribute('aria-label', /2 por 2.*3:1/);
          await expect(scene.locator('.vs-punnett-cell')).toHaveCount(4);
          await expect(page.getByLabel('cruzamento Aa × Aa', { exact: true })).toBeVisible();
          await page.getByRole('button', { name: 'Fechar inspetor', exact: true }).click();
          await expect(scene).toHaveAttribute('aria-label', /4 por 4.*9:3:3:1/);
          await page.getByRole('button', { name: /^Segunda lei/ }).click();
          await expect(scene.locator('.vs-punnett-cell')).toHaveCount(16);
          await expect(page.getByLabel('cruzamento AaBb × AaBb', { exact: true })).toBeVisible();
          await page.getByRole('button', { name: 'Fechar inspetor', exact: true }).click();
          await expect(scene).toHaveAttribute('aria-label', /4 por 4.*9:3:3:1/);
        });

        test('vacina e soro mantêm células e conectores legíveis', async ({ page }) => {
          await page.goto('/visual?summary=summary-biologia-sangue-e-imunologia');
          const scene = page.locator('.vs-study-board svg[role="img"]');
          await expect(scene).toHaveAttribute('aria-label', /Vacina/);
          for (const label of ['Vacina · ativa', 'Soro · passiva']) {
            if (label.startsWith('Soro')) await page.getByRole('button', { name: new RegExp(label) }).click();
            await expect(scene).toHaveAttribute('aria-label', label.startsWith('Vacina') ? /Vacina/ : /Soro/);
            const styles = await scene.locator('.vs-rbc,.vs-plasma').evaluateAll((cells) =>
              cells.map((cell) => ({ fill: getComputedStyle(cell).fill, stroke: getComputedStyle(cell).stroke })),
            );
            expect(styles.length).toBeGreaterThan(0);
            for (const style of styles) {
              expect(style.fill).not.toBe('rgb(0, 0, 0)');
              expect(style.stroke).not.toBe('none');
            }
            const connectors = await scene.locator('path').evaluateAll((paths) =>
              paths.filter((p) => !p.closest('.vs-antibody')).map((p) => getComputedStyle(p).stroke),
            );
            for (const stroke of connectors) expect(stroke).not.toBe('none');
          }
        });

        test('lipídios mantêm legendas separadas e dentro do quadro', async ({ page }) => {
          await page.goto('/visual?summary=summary-biologia-composicao-quimica-celular-carboidratos-e-lipidios');
          await page.getByRole('button', { name: 'Lipídios: reserva e membrana', exact: true }).click();
          const figure = page.getByRole('img', { name: /^Lipídios: reserva e membrana:/ });
          await expect(figure).toBeVisible();
          await page.evaluate(() => document.fonts.ready);
          const metrics = await figure.evaluate((svg) => {
            const text = [...svg.querySelectorAll('text')].find((t) => t.textContent === 'Lipídios: reserva e membrana')!;
            const group = text.parentElement!;
            const r = group.querySelector('rect')!;
            const frame = { x: Number(r.getAttribute('x')), y: Number(r.getAttribute('y')), w: Number(r.getAttribute('width')), h: Number(r.getAttribute('height')) };
            const boxes = [...group.querySelectorAll('text')].map((t) => {
              const b = t.getBBox();
              return { text: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height };
            });
            const overlaps: string[] = [];
            boxes.forEach((a, i) => boxes.slice(i + 1).forEach((b) => {
              if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) overlaps.push(`${a.text} / ${b.text}`);
            }));
            return { frame, boxes, overlaps };
          });
          expect(metrics.overlaps).toEqual([]);
          for (const b of metrics.boxes) {
            expect(b.x).toBeGreaterThanOrEqual(metrics.frame.x);
            expect(b.x + b.w).toBeLessThanOrEqual(metrics.frame.x + metrics.frame.w);
            expect(b.y).toBeGreaterThanOrEqual(metrics.frame.y);
            expect(b.y + b.h).toBeLessThanOrEqual(metrics.frame.y + metrics.frame.h);
          }
        });
      });
    }
  }
}
