import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const chapters = [
  'bio-ecologia-ciclo-nitrogenio',
  'bio-ecologia-eutrofizacao',
  'bio-ecologia-dinamica-populacoes',
  'bio-ecologia-invasoras-controle-biologico',
  'bio-ecologia-sucessao',
  'bio-ecologia-ciclo-hidrologico-poluicao-agua',
];
const viewports = [
  { name: 'mobile-360', width: 360, height: 780 },
  { name: 'mobile-375', width: 375, height: 812 },
  { name: 'mobile-390', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];
const output = 'docs/visual-personalizado/screenshots/ecologia-2026-09-23';
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
  for (const chapter of chapters.filter(id => !process.env.ECOLOGY_CHAPTER || id === process.env.ECOLOGY_CHAPTER)) {
    for (const viewport of viewports) {
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('console', message => { if (message.type() === 'error') errors.push(`console: ${message.text()}`); });
        page.on('requestfailed', request => { if (new URL(request.url()).origin === 'http://127.0.0.1:3105') errors.push(`request: ${request.url()} ${request.failure()?.errorText}`); });
        page.on('response', response => { if (response.status() >= 400 && new URL(response.url()).origin === 'http://127.0.0.1:3105') errors.push(`${response.status()} ${response.url()}`); });
        await page.goto(`http://127.0.0.1:3105/visual?summary=${chapter}`, { waitUntil: 'commit', timeout: 60000 });
        const figure = page.locator('.ec-figure');
        await figure.waitFor({ state: 'visible', timeout: 30000 });
        const welcome = page.getByRole('dialog', { name: 'Bem-vindo ao Crivo' });
        if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'Fechar' }).click();
        const toggle = page.getByRole('button', { name: theme === 'light' ? 'Mudar para modo claro' : 'Mudar para modo escuro' });
        if (await toggle.isVisible()) await toggle.click();
        const buttons = page.locator('.ec-controls button');
        const count = await buttons.count();
        const firstPressed = await buttons.first().getAttribute('aria-pressed');
        await buttons.last().focus();
        await buttons.last().press('Enter');
        const pressed = await buttons.last().getAttribute('aria-pressed');
        const status = await page.locator('.ec-detail').innerText();
        const metrics = await page.evaluate(() => {
          const figure = document.querySelector('.ec-figure');
          const svg = figure?.querySelector('svg');
          return {
            pageWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
            figureWidth: figure?.scrollWidth,
            figureClientWidth: figure?.clientWidth,
            svgTextCount: svg?.querySelectorAll('text').length,
            horizontalPageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
          };
        });
        await figure.focus();
        const scrollBefore = await figure.evaluate(element => element.scrollLeft);
        await figure.press('ArrowRight');
        if (metrics.figureWidth > metrics.figureClientWidth) {
          await page.waitForFunction(before => (document.querySelector('.ec-figure')?.scrollLeft ?? 0) > before, scrollBefore, { timeout: 1500 }).catch(() => {});
        }
        const scrollAfter = await figure.evaluate(element => element.scrollLeft);
        const screenshot = `${chapter}-${viewport.name}-${theme}.png`;
        await page.evaluate(() => {
          const top = document.querySelector('.ec-figure')?.getBoundingClientRect().top ?? 0;
          window.scrollBy(0, top - 100);
        });
        await figure.screenshot({ path: join(output, screenshot) });
        results.push({ chapter, viewport: viewport.name, theme, count, firstPressed, pressed, statusPresent: status.length > 20, keyboardScroll: scrollAfter - scrollBefore, ...metrics, errors, screenshot: join(output, screenshot).replaceAll('\\', '/') });
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
writeFileSync(join(output, 'audit.json'), `${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter(row => row.horizontalPageOverflow || row.firstPressed !== 'true' || row.pressed !== 'true' || !row.statusPresent || (row.figureWidth > row.figureClientWidth && row.keyboardScroll <= 0) || row.errors.length);
console.log(JSON.stringify({ cases: results.length, failures: failures.length, examples: failures.slice(0, 6) }, null, 2));
if (failures.length) process.exitCode = 1;
