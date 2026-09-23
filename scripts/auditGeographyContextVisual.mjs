import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chapters = [
  'summary-geografia-energia-eletrica-no-brasil',
  'summary-geografia-estrutura-etnica-e-fluxos-migratorios',
  'summary-geografia-os-fluxos-do-comercio-externo',
  'summary-geografia-combustiveis-fosseis-e-biocombustiveis-no-brasil',
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const output = 'docs/visual-personalizado/screenshots/geografia-contextos-2026-09-23';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
const accessibility = [];
try {
  for (const chapter of chapters) for (const viewport of viewports) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:3106')) errors.push(`${response.status()} ${response.url()}`); });
    page.on('requestfailed', request => { if (request.url().startsWith('http://127.0.0.1:3106')) errors.push(`request: ${request.url()} ${request.failure()?.errorText}`); });
    await page.goto(`http://127.0.0.1:3106/visual?summary=${chapter}`, { waitUntil: 'commit', timeout: 60000 });
    const diagram = page.locator(`svg[data-geography-context="${chapter}"]`);
    await diagram.waitFor({ state: 'visible', timeout: 30000 });
    const welcome = page.getByRole('dialog', { name: 'Bem-vindo ao Crivo' });
    if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'Fechar' }).click();
    const toggle = page.getByRole('button', { name: theme === 'light' ? 'Mudar para modo claro' : 'Mudar para modo escuro' });
    if (await toggle.isVisible()) await toggle.click();
    const buttons = page.locator('.vs-geography-options button');
    const count = await buttons.count();
    const firstPressed = await buttons.first().getAttribute('aria-pressed');
    await buttons.last().focus();
    await buttons.last().press('Enter');
    const lastPressed = await buttons.last().getAttribute('aria-pressed');
    const reading = await page.locator('.vs-plane-readouts').innerText();
    const metrics = await page.evaluate(() => ({ pageWidth: document.documentElement.scrollWidth, viewportWidth: document.documentElement.clientWidth }));
    const screenshot = `${chapter}-${viewport.name}-${theme}.png`;
    await page.evaluate(() => {
      const top = document.querySelector('.gcd-diagram')?.getBoundingClientRect().top ?? 0;
      window.scrollBy(0, top - 100);
    });
    await diagram.screenshot({ path: join(output, screenshot) });
    results.push({ chapter, viewport: viewport.name, theme, count, firstPressed, lastPressed, readingPresent: reading.length > 50, ...metrics, errors, screenshot: join(output, screenshot).replaceAll('\\', '/') });
    if (viewport.name === 'mobile-375') {
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      accessibility.push({ chapter, theme, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
    }
    await context.close();
  }
} finally { await browser.close(); }
writeFileSync(join(output, 'audit.json'), `${JSON.stringify(results, null, 2)}\n`);
writeFileSync(join(output, 'accessibility.json'), `${JSON.stringify(accessibility, null, 2)}\n`);
const failures = results.filter(row => row.pageWidth > row.viewportWidth || row.firstPressed !== 'true' || row.lastPressed !== 'true' || !row.readingPresent || row.count !== 3 || row.errors.length);
const violations = accessibility.flatMap(row => row.violations);
console.log(JSON.stringify({ cases: results.length, failures: failures.length, accessibilityScans: accessibility.length, violations: violations.length, examples: [...failures.slice(0, 3), ...violations.slice(0, 3)] }, null, 2));
if (failures.length || violations.length) process.exitCode = 1;
