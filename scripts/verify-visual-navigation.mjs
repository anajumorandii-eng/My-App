import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const base = process.env.CRIVO_URL ?? 'http://localhost:3000';
const output = 'docs/visual/topo-leitura-2026-11-11';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [name, width, height, dark] of [
    ['mobile', 390, 844, false], ['mobile-estreito', 360, 800, false],
    ['ipad', 834, 1112, false], ['ipad-escuro', 834, 1112, true], ['desktop', 1366, 900, false],
  ]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    const errors = [], networkErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) networkErrors.push(`${response.status()} ${response.url()}`); });
    await page.addInitScript(darkTheme => {
      localStorage.setItem('juju_onboarding', 'true');
      if (darkTheme) localStorage.setItem('crivo_theme', 'dark');
    }, dark);
    await page.goto(`${base}/visual?summary=summary-biologia-biotecnologia`);
    await page.locator('.crivo-immersion').waitFor({ timeout: 45000 });
    const domain = page.getByRole('button', { name: 'Mostrar domínio', exact: true });
    const header = page.locator('.vs-topic-bar');
    await expect(header.getByRole('button', { name: 'Mostrar domínio' })).toBeVisible();
    await domain.click();
    await expect(page.getByRole('region', { name: 'Domínio de cada conceito do capítulo' })).toBeVisible();
    await domain.click();
    if (name === 'ipad' || name === 'mobile') await page.screenshot({ path: `${output}/${name}-cena.png` });
    const sceneTop = await page.locator('.crivo-immersion').evaluate(element => element.getBoundingClientRect().top);
    if (width <= 900) assert(sceneTop < 300, `Topo ocupa espaço excessivo: ${sceneTop}`);
    await page.getByRole('button', { name: 'Esquema', exact: true }).click();
    const outline = page.getByRole('navigation', { name: 'Assuntos do capítulo' });
    const steps = outline.getByRole('button');
    await expect(steps).toHaveCount(5);
    await expect(page.getByRole('navigation', { name: 'Etapas do capítulo' })).toBeHidden();
    await expect(page.getByRole('slider')).toHaveCount(0);
    await expect(page.getByText('Amplificação por PCR', { exact: true })).toHaveCount(0);
    await expect(page.getByRole('tablist', { name: 'Seções da prancha' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Comparar painéis' })).toHaveCount(0);
    await expect(page.locator('.vs-scene-bridge')).toHaveCount(0);
    await expect(page.locator('.crivo-immersion')).toHaveCount(0);
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert(sizes.page <= sizes.viewport, JSON.stringify(sizes));
    if (name === 'ipad' || name === 'ipad-escuro' || name === 'mobile') await page.screenshot({ path: `${output}/${name}.png` });
    // As linhas funcionam por teclado e levam a leitura/foco ao assunto escolhido.
    await steps.nth(1).focus();
    await page.keyboard.press('Enter');
    await expect(steps.nth(1)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('#visual-chapter-reading')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Leitura do capítulo', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Explorar em foco', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await steps.nth(2).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(steps.nth(2)).toHaveAttribute('aria-current', 'step');
    await expect(page.locator('#visual-chapter-reading')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Leitura do capítulo', exact: true })).toBeVisible();
    if (name === 'ipad' || name === 'mobile' || name === 'ipad-escuro') await page.screenshot({ path: `${output}/${name}-leitura.png` });
    await page.getByRole('button', { name: 'Cena 3D', exact: true }).click();
    await expect(page.locator('.crivo-immersion')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Etapas do capítulo' })).toBeVisible();
    await page.getByRole('tab', { name: 'Reconstruir', exact: true }).click();
    await expect(page.getByTestId('visual-study-board')).toBeVisible();
    await expect(outline).toHaveCount(0);
    await page.getByRole('tab', { name: 'Testar', exact: true }).click();
    await expect(page.getByTestId('visual-study-board')).toHaveCount(0);
    await expect(outline).toHaveCount(0);
    const answer = page.getByRole('textbox', { name: 'Sua resposta' });
    await answer.fill('Resposta de conferência: DNA recombinante e transferência do gene.');
    await page.getByRole('button', { name: 'Enviar para correção', exact: true }).click();
    await expect(page.getByText('Você preservou:', { exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'Reconstruir', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Reconstrução ativa', exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'Testar', exact: true }).click();
    await expect(answer).toHaveValue('Resposta de conferência: DNA recombinante e transferência do gene.');
    await expect(page.getByText('Você preservou:', { exact: true })).toBeVisible();
    await page.getByRole('tab', { name: 'Explorar', exact: true }).click();
    await page.getByRole('button', { name: 'Esquema', exact: true }).click();
    await expect(outline.getByRole('button').nth(2)).toHaveAttribute('aria-current', 'step');
    assert.deepEqual(errors, []);
    assert.deepEqual(networkErrors, []);
    results.push({ name, sizes, sceneTop, errors, networkErrors });
    await page.close();
  }
} finally { await browser.close(); }
await fs.writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 2) + '\n');
console.log('Navegação: cinco configurações, topo compacto, teclado, foco, leitura e resposta preservada entre modos.');
