import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chapters = [
  'summary-historia-revolucao-francesa',
  'summary-historia-revolucao-industrial',
  'summary-geografia-projecoes-cartograficas',
  'summary-geografia-dinamica-climatica',
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const output = 'docs/visual-personalizado/screenshots/historia-geografia-2026-09-23';
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
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith('http://127.0.0.1:3105')) errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(`http://127.0.0.1:3105/visual?summary=${chapter}`, { waitUntil: 'commit', timeout: 60000 });
    const figure = page.locator('.hg-figure');
    await figure.waitFor({ state: 'visible', timeout: 30000 });
    const welcome = page.getByRole('dialog', { name: 'Bem-vindo ao Crivo' });
    if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'Fechar' }).click();
    const toggle = page.getByRole('button', { name: theme === 'light' ? 'Mudar para modo claro' : 'Mudar para modo escuro' });
    if (await toggle.isVisible()) await toggle.click();
    const buttons = page.locator('.hg-controls button');
    const count = await buttons.count();
    const firstPressed = await buttons.first().getAttribute('aria-pressed');
    await buttons.last().focus();
    await buttons.last().press('Enter');
    const lastPressed = await buttons.last().getAttribute('aria-pressed');
    const statusPresent = (await page.locator('.hg-detail').innerText()).length > 20;
    const metrics = await page.evaluate(() => {
      const figure = document.querySelector('.hg-figure');
      return {
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        figureWidth: figure?.scrollWidth,
        figureClientWidth: figure?.clientWidth,
      };
    });
    await figure.focus();
    const before = await figure.evaluate(element => element.scrollLeft);
    await figure.press('ArrowRight');
    await page.waitForTimeout(150);
    const keyboardScroll = (await figure.evaluate(element => element.scrollLeft)) - before;
    await figure.evaluate(element => { element.scrollLeft = 0; });
    await page.evaluate(() => {
      const top = document.querySelector('.hg-figure')?.getBoundingClientRect().top ?? 0;
      window.scrollBy(0, top - 100);
    });
    const screenshot = `${chapter}-${viewport.name}-${theme}.png`;
    await figure.screenshot({ path: join(output, screenshot) });
    results.push({ chapter, viewport: viewport.name, theme, count, firstPressed, lastPressed, statusPresent, keyboardScroll, ...metrics, errors, screenshot: join(output, screenshot).replaceAll('\\', '/') });
    if (viewport.name === 'mobile-375') {
      const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      accessibility.push({ chapter, theme, violations: scan.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })) });
    }
    await context.close();
  }
} finally {
  await browser.close();
}
writeFileSync(join(output, 'audit.json'), `${JSON.stringify(results, null, 2)}\n`);
writeFileSync(join(output, 'accessibility.json'), `${JSON.stringify(accessibility, null, 2)}\n`);
const failures = results.filter(row => row.pageWidth > row.viewportWidth || row.firstPressed !== 'true' || row.lastPressed !== 'true' || !row.statusPresent || (row.figureWidth > row.figureClientWidth && row.keyboardScroll <= 0) || row.errors.length);
const violations = accessibility.flatMap(row => row.violations);
console.log(JSON.stringify({ cases: results.length, failures: failures.length, accessibilityScans: accessibility.length, violations: violations.length, examples: [...failures.slice(0, 3), ...violations.slice(0, 3)] }, null, 2));
if (failures.length || violations.length) process.exitCode = 1;
