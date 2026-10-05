import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';

const output = process.env.CRIVO_INTERACTION_OUTPUT || 'tests/e2e/.artifacts/audit-app/interactions';
const motions = process.env.CRIVO_INTERACTION_MOTION ? [process.env.CRIVO_INTERACTION_MOTION] : ['reduce', 'no-preference'];
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
await fs.mkdir(output, { recursive: true });
try {
  for (const theme of ['light', 'dark']) for (const width of [360, 834]) for (const reducedMotion of motions) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: theme, reducedMotion });
    await context.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true');
      localStorage.setItem('crivo_theme', theme);
      localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor: 'automatica', efeitos: 'completo', fundo: 'caderno', fundoRevisto: true }));
    }, theme);
    const page = await context.newPage();
    page.setDefaultTimeout(60_000);
    const result = { theme, width, reducedMotion, palettes: [], errors: [] };
    page.on('pageerror', error => result.errors.push(error.message));
    try {
      await page.goto('http://127.0.0.1:3000', { waitUntil: 'load' });
      // O topo chega antes do chunk Hoje. Clicar enquanto ele ainda troca
      // carregamento/conteúdo pode esgotar a espera automática do navegador.
      await page.locator('.crivo-observatorio-cta').waitFor();
      const opener = page.getByRole('button', { name: 'Personalizar', exact: true }).filter({ visible: true });
      await opener.click();
      const panel = page.getByRole('dialog', { name: 'Personalizar o Visual' });
      for (const [name, value] of [['Caderno', 'caderno'], ['Papel', 'papel'], ['Aurora', 'aurora'], ['Grade', 'grade'], ['Liso', 'liso']]) {
        await panel.getByRole('group', { name: 'Fundo', exact: true }).getByRole('button', { name, exact: true }).click();
        await expect(page.locator('html')).toHaveAttribute('data-fundo', value);
        const bounds = await panel.boundingBox();
        expect(bounds.x).toBeGreaterThanOrEqual(0);
        expect(bounds.x + bounds.width).toBeLessThanOrEqual(width + 1);
        // Tokens não dependem de largura ou movimento. Medimos os 90 pares
        // por tema uma vez; os oito cenários mantêm layout/foco/persistência.
        const palettes = width === 360 && reducedMotion === 'reduce' ? ['Crivo', 'Neon', 'Aurora', 'Solar', 'Floresta', 'Oceano'] : [];
        for (const palette of palettes) {
          const button = panel.getByRole('group', { name: 'Cor', exact: true }).getByRole('button', { name: palette, exact: true });
          await button.click();
          await expect(button).toHaveAttribute('aria-pressed', 'true');
          const contrasts = await page.evaluate(() => {
            const probe = document.createElement('button');
            document.querySelector('.ni-production-app').appendChild(probe);
            probe.style.color = 'var(--text-inverse)';
            const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
            const ctx = canvas.getContext('2d');
            const luminance = color => {
              ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = color; ctx.fillRect(0, 0, 1, 1);
              const channels = Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3).map(n => { const s = n / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4; });
              return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
            };
            try {
              return ['--action-primary', '--action-primary-hover', '--action-primary-pressed'].map(token => {
                probe.style.backgroundColor = `var(${token})`;
                const style = getComputedStyle(probe);
                const a = luminance(style.color), b = luminance(style.backgroundColor);
                return { token, ratio: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
              });
            } finally { probe.remove(); }
          });
          result.palettes.push({ background: value, palette, contrasts });
          for (const pair of contrasts) expect(pair.ratio, `${theme}/${value}/${palette}/${pair.token}`).toBeGreaterThanOrEqual(4.5);
        }
      }
      await page.keyboard.press('Escape');
      await expect(panel).toHaveCount(0);
      await expect(opener).toBeFocused();
      const search = page.getByRole('button', { name: 'Buscar', exact: true }).filter({ visible: true });
      await search.click();
      const dialog = page.getByRole('dialog', { name: 'Buscar capítulo' });
      const input = dialog.getByRole('combobox');
      await expect(input).toBeFocused();
      for (const key of ['Tab', 'Shift+Tab']) { await page.keyboard.press(key); await expect(input).toBeFocused(); }
      await input.fill('mitose');
      await expect(dialog.getByRole('option', { name: /Divisão Celular/ })).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(search).toBeFocused();
      await page.goto('http://127.0.0.1:3000/resumos?summary=bio-ecologia-introducao', { waitUntil: 'domcontentloaded' });
      const important = page.getByRole('button', { name: 'Importante', exact: true });
      await important.click();
      await expect(important).toHaveAttribute('aria-pressed', 'true');
      await page.reload();
      await expect(important).toHaveAttribute('aria-pressed', 'true');
      result.localProgress = await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('juju_summary_progress_v1'))));
      result.fonts = await page.evaluate(() => Array.from(document.fonts, font => ({ family: font.family, status: font.status })));
      result.overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(result.overflow).toBeLessThanOrEqual(1);
      expect(result.errors).toEqual([]);
      result.screenshot = `resumos-${theme}-${width}-${reducedMotion}.png`;
      await page.screenshot({ path: path.join(output, result.screenshot) });
      result.passed = true;
    } catch (error) { result.passed = false; result.failure = String(error); }
    results.push(result);
    await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify({ theme, width, reducedMotion, passed: result.passed, failure: result.failure }));
    await context.close();
  }
} finally { await browser.close(); }
process.exitCode = results.every(result => result.passed) ? 0 : 1;
