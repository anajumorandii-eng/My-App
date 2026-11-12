import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import { interactiveSummaries } from '../src/data/interactiveSummaries.ts';

const base = process.env.CRIVO_URL ?? 'http://localhost:3000';
const out = 'docs/visual/fluxo-unificado-2026-11-12';
await fs.mkdir(out, { recursive: true });
const chosen = new Map();
for (const summary of interactiveSummaries) {
  if (!chosen.has(summary.subject) && summary.retrieval[0]?.expectedElements.length) chosen.set(summary.subject, summary.id);
}
const ids = [...new Set([
  'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares',
  'summary-matematica-potencias-e-radicais',
  'summary-historia-introducao-a-historia-e-primeiras-civilizacoes',
  'summary-geografia-coordenadas-geograficas', 'atu-cop30-belem',
  'summary-biologia-biotecnologia', ...chosen.values(),
])];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const [index, id] of ids.entries()) {
    const width = index === 3 ? 1366 : index === 5 ? 360 : index % 2 ? 390 : 834;
    const dark = index % 3 === 2;
    const page = await browser.newPage({ viewport: { width, height: width > 600 ? 1112 : 844 }, reducedMotion: 'reduce' });
    const errors = [], networkErrors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) networkErrors.push(`${response.status()} ${response.url()}`); });
    await page.addInitScript(darkTheme => {
      localStorage.setItem('juju_onboarding', 'true');
      if (darkTheme) localStorage.setItem('crivo_theme', 'dark');
    }, dark);
    await page.goto(`${base}/visual?summary=${id}`, { waitUntil: 'domcontentloaded' });
    const reading = page.locator('#visual-chapter-reading');
    await reading.waitFor({ timeout: 60000 });
    const artifact = page.locator('[data-study-artifact-mode="explorar"]');
    const kind = await artifact.getAttribute('data-visual-representation');
    const handoff = page.getByRole('region', { name: 'Continuar o estudo' });
    await expect(handoff.getByRole('button')).toHaveCount(1);
    await handoff.getByRole('button', { name: 'Continuar na leitura' }).click();
    await expect(reading).toBeFocused();
    const steps = reading.getByRole('navigation', { name: 'Etapas do capítulo' }).getByRole('button');
    await steps.last().click();
    await reading.getByRole('button', { name: /Testar o que aprendi/ }).click();
    await expect(page.getByRole('heading', { name: 'Teste sua compreensão' })).toBeFocused();
    const answer = page.getByRole('textbox', { name: 'Sua resposta' });
    await answer.fill('Hipótese de conferência do percurso, sem consultar o capítulo.');
    await page.getByRole('button', { name: 'Enviar para correção' }).click();
    await expect(page.getByText('Você preservou:', { exact: true })).toBeVisible();
    if (index < 4) await page.screenshot({ path: `${out}/${index}-testar.png` });
    await page.getByRole('button', { name: 'Reconstruir relações' }).click();
    await expect(page.getByRole('heading', { name: 'Reconstrução ativa' })).toBeFocused();
    const reference = page.locator('.vs-rebuild-map');
    await expect(reference).not.toHaveAttribute('open', '');
    await expect(page.locator('[data-study-artifact-mode]')).toHaveCount(0);
    await expect(page.getByLabel('Cadeia de conceitos do capítulo')).toHaveCount(0);
    if (index < 4) await page.screenshot({ path: `${out}/${index}-reconstruir.png` });
    const choice = page.locator('.vs-gap .vs-bank button').first();
    const hasChoices = await choice.count() > 0;
    if (hasChoices) {
      const check = page.getByRole('button', { name: 'Conferir reconstrução', exact: true });
      await expect(check).toBeDisabled();
      await choice.focus();
      await page.keyboard.press('Enter');
      await expect(check).toBeEnabled();
      await check.click();
      await expect(page.locator('.vs-gap [role=status]').first()).toBeVisible();
      await page.getByRole('button', { name: 'Desfazer', exact: true }).click();
      await expect(check).toBeDisabled();
    }
    await reference.locator(':scope > summary').click();
    await expect(reference).toHaveAttribute('open', '');
    await expect(reference.getByLabel('Cadeia de conceitos do capítulo')).toBeVisible();
    if (id !== 'summary-biologia-biotecnologia') {
      await expect(reference.locator('[data-study-artifact-mode="reconstruir"]')).toBeVisible();
      if (kind === 'board' || kind === 'instrument') await expect(reference.getByTestId('visual-study-board')).toBeVisible({ timeout: 45000 });
      else if (kind === 'fallback') await expect(reference.locator('.vs-topic-fallback')).toBeVisible();
      else await expect(reference.locator('.tc-scene, .topic-studio').first()).toBeVisible({ timeout: 45000 });
    }
    if (index < 4) await page.screenshot({ path: `${out}/${index}-consulta.png` });
    await reference.locator(':scope > summary').click();
    await expect(page.locator('[data-study-artifact-mode]')).toHaveCount(0);
    await page.getByRole('tab', { name: 'Testar', exact: true }).click();
    await expect(answer).toHaveValue('Hipótese de conferência do percurso, sem consultar o capítulo.');
    await expect(page.getByText('Você preservou:', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Revisar a leitura', exact: true }).click();
    await expect(reading).toBeFocused();
    const sizes = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }));
    assert.equal(sizes.viewport, sizes.page, id);
    assert.deepEqual(errors, [], id);
    assert.deepEqual(networkErrors, [], id);
    results.push({ id, subject: interactiveSummaries.find(item => item.id === id)?.subject, kind, width, dark, hasChoices, errors, networkErrors, sizes });
    console.log('Conferido:', id, kind, width);
    await page.close();
  }
} finally { await browser.close(); }
await fs.writeFile(`${out}/browser-results.json`, JSON.stringify(results, null, 2) + '\n');
console.log('Matérias:', new Set(results.map(item => item.subject)).size, 'Representações:', [...new Set(results.map(item => item.kind))]);
