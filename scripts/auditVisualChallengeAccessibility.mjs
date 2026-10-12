import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';

const output = process.env.CRIVO_VISUAL_OUTPUT || 'docs/refinamento-visual-613-desafio';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, args: ['--no-sandbox'] });
const results = [];
try {
  for (const [width, theme] of [[1440, 'light'], [834, 'dark'], [360, 'dark']]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.addInitScript(theme => { localStorage.setItem('juju_onboarding', 'true'); localStorage.setItem('crivo_theme', theme); }, theme);
    await page.goto(`${process.env.CRIVO_URL || 'http://127.0.0.1:3001'}/visual?summary=summary-gramatica-concordancia`);
    await page.locator('.vs-scene-bridge').waitFor();
    await page.locator('.vs-scene-bridge').screenshot({ path: `${output}/ponte-${width}-${theme}.png` });
    const explore = await new AxeBuilder({ page }).include('.vs-scene-bridge').include('#visual-chapter-reading').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    await page.getByRole('button', { name: 'Responder ao desafio' }).click();
    await page.getByLabel('Sua resposta', { exact: true }).fill('Hipótese para revisar');
    await page.getByRole('button', { name: 'Enviar para correção' }).click();
    await page.getByRole('button', { name: 'Revisar a explicação deste desafio' }).waitFor();
    await page.getByRole('heading', { name: 'Recuperação sem consulta' }).locator('..').screenshot({ path: `${output}/retorno-${width}-${theme}.png`, style: '.ni-production-mobile, .crivo-mobile-toolbar { visibility: hidden !important; }' });
    const recall = await new AxeBuilder({ page }).include('[data-study-mode="testar"] .vs-main > section').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    for (const [mode, audit] of [['explorar', explore], ['testar', recall]]) results.push({ width, theme, mode, violations: audit.violations, incomplete: audit.incomplete });
    await context.close();
  }
} finally { await browser.close(); }
await fs.writeFile(`${output}/challenge-accessibility.json`, JSON.stringify(results, null, 2));
const violations = results.reduce((sum, result) => sum + result.violations.length, 0);
console.log(`${results.length} recortes; ${violations} violações; ${results.reduce((sum, result) => sum + result.incomplete.length, 0)} verificações inconclusivas`);
if (violations) process.exitCode = 1;
