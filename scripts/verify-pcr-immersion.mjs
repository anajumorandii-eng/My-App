import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const base = process.env.CRIVO_URL ?? 'http://localhost:3000';
const output = 'docs/visual/pcr-revisao-2026-11-11';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [name, width, height, reduced] of [
    ['mobile-360', 360, 800, true], ['mobile-390', 390, 844, true],
    ['ipad', 834, 1112, true], ['desktop', 1366, 900, false],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: reduced ? 'reduce' : 'no-preference' });
    const errors = [], networkErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) networkErrors.push(`${response.status()} ${response.url()}`); });
    await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
    await page.goto(`${base}/visual?summary=summary-biologia-biotecnologia`);
    const scene = page.locator('.crivo-immersion');
    await scene.waitFor({ timeout: 45000 });
    const steps = scene.getByRole('navigation', { name: 'Etapas da experiência' }).getByRole('button');
    await scene.getByRole('button', { name: 'Separa as duas fitas', exact: true }).click();
    await expect(scene.getByRole('status')).toContainText('Você previu certo.');
    await scene.getByRole('button', { name: 'As fitas longas, refazendo a hélice', exact: true }).click();
    await expect(scene.getByRole('status')).toContainText('Não foi isso.');
    await scene.getByRole('button', { name: '5′ → 3′', exact: true }).click();
    if (!reduced) {
      // Capturas reais do canvas provam que pausa congela também partículas e câmera.
      await page.waitForTimeout(700);
      await scene.getByRole('button', { name: 'Pausar movimento' }).click();
      await page.waitForTimeout(100);
      const canvas = scene.locator('canvas');
      const before = await canvas.screenshot();
      await page.waitForTimeout(300);
      assert.deepEqual(await canvas.screenshot(), before, 'A pausa deve conservar o quadro');
      await expect(scene.getByRole('button', { name: 'Inspecionar dna polimerase' })).toBeVisible();
      await scene.getByRole('button', { name: 'Retomar movimento' }).click();
    }
    await expect(scene.getByRole('button', { name: 'Inspecionar nova fita' })).toBeVisible({ timeout: 15000 });
    await scene.getByRole('button', { name: 'Inspecionar nova fita' }).click();
    await expect(scene.locator('.cr-detail')).toContainText('Cada molécula resultante');
    await steps.nth(4).click();
    await expect(scene.locator('.cr-temp-caption')).toHaveText('Novas fitas sintetizadas');
    await expect(scene.locator('.cr-temp-number')).toHaveText('02');
    // O detalhe inspecionado acompanha o cenário, mesmo sem fechá-lo primeiro.
    await scene.getByRole('button', { name: 'Inspecionar nova fita' }).click();
    await scene.getByRole('button', { name: 'Sem primers', exact: true }).click();
    await expect(scene.locator('.cr-detail')).toContainText('O DNA inicial continua presente');
    await expect(scene.locator('.cr-temp-number')).toHaveText('00');
    await expect(scene.locator('.cr-temp-caption')).toHaveText('Novas fitas sintetizadas');
    await scene.getByRole('button', { name: 'Ver em noite' }).click();
    await expect(scene).toHaveAttribute('data-tema', 'noite');
    await scene.getByRole('button', { name: 'Com primers', exact: true }).click();
    await expect(scene.locator('.cr-detail')).not.toContainText('O DNA inicial continua presente');
    // Sobe o fim da cena até a área útil da tela, incluindo a folga da barra fixa.
    await scene.evaluate(element => element.scrollIntoView({ block: 'end' }));
    await page.waitForTimeout(100);
    await steps.nth(0).focus();
    await page.keyboard.press('Tab');
    await expect(steps.nth(1)).toBeFocused();
    const controls = await scene.locator('.cr-rail button, .cr-foot button').evaluateAll(buttons => buttons.map(button => {
      const r = button.getBoundingClientRect();
      const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return { text: button.textContent.trim(), reachable: button.contains(hit), bottom: r.bottom };
    }));
    assert(controls.every(control => control.reachable), JSON.stringify(controls));
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert(sizes.page <= sizes.viewport, JSON.stringify(sizes));
    if (name === 'mobile-390' || name === 'ipad') await page.screenshot({ path: `${output}/${name}-noite.png` });
    await scene.getByRole('button', { name: 'Ver em caderno' }).click();
    if (name === 'mobile-390' || name === 'ipad') await page.screenshot({ path: `${output}/${name}-caderno.png` });
    // A preferência pode mudar enquanto a cena está aberta.
    if (!reduced) {
      await steps.nth(3).click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await expect(scene.getByRole('button', { name: 'Movimento reduzido' })).toBeDisabled();
      await expect(scene.getByRole('button', { name: 'Inspecionar nova fita' })).toBeVisible();
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await expect(scene.getByRole('button', { name: 'Pausar movimento' })).toBeEnabled();
      await steps.nth(4).click();
    }
    await scene.getByRole('button', { name: 'Testar o que entendi' }).click();
    await expect(scene).toHaveCount(0);
    await expect(page.getByRole('tab', { name: 'Testar', exact: true })).toHaveAttribute('aria-selected', 'true');
    assert.deepEqual(errors, []);
    results.push({ name, sizes, errors, networkErrors, controls });
    await page.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 2) + '\n');
console.log('PCR: quatro larguras, pausa real, síntese, comparação, tintas, preferência ao vivo e Testar conferidos.');
