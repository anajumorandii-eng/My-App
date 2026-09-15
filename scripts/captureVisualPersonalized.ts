import { chromium, type Page } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs/promises';

const baseUrl = process.env.CRIVO_URL ?? 'http://localhost:3011';
const output = path.resolve('docs/visual-personalizado/screenshots');
const browserErrors: string[] = [];

function monitor(page: Page, label: string) {
  page.on('pageerror', (error) => browserErrors.push(`${label}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') browserErrors.push(`${label}: ${message.text()}`);
  });
}

async function dismissWelcome(page: Page) {
  const close = page.getByRole('button', { name: 'Fechar' });
  if (await close.isVisible().catch(() => false)) await close.click();
}

async function open(page: Page, summaryId: string) {
  await page.goto(`${baseUrl}/visual?summary=${encodeURIComponent(summaryId)}`, { waitUntil: 'domcontentloaded' });
  await dismissWelcome(page);
  await page.getByTestId('visual-study-board').waitFor();
}

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });

const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
monitor(desktop, 'desktop');
await open(desktop, 'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares');
await desktop.locator('.vs-concept-card').first().click();
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.screenshot({ path: path.join(output, 'fisica-adiabatica-desktop.png'), fullPage: true });

await open(desktop, 'summary-biologia-bioenergetica-fotossintese-e-quimiossintese');
await desktop.screenshot({ path: path.join(output, 'biologia-fotossintese-desktop.png'), fullPage: true });

await open(desktop, 'summary-quimica-evolucao-dos-modelos-atomicos');
await desktop.screenshot({ path: path.join(output, 'quimica-modelos-atomicos-desktop.png'), fullPage: true });

const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
monitor(mobile, 'mobile');
await open(mobile, 'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares');
await mobile.getByRole('tab', { name: 'RECONSTRUIR' }).click();
const firstGap = mobile.locator('.vs-gap').first();
await firstGap.locator('.vs-bank button').first().dragTo(firstGap.locator('.vs-drop-target'));
await mobile.screenshot({ path: path.join(output, 'fisica-reconstruir-mobile.png'), fullPage: true });

const darkMobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
monitor(darkMobile, 'dark-mobile');
await darkMobile.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
await open(darkMobile, 'summary-fisica-as-leis-de-newton');
await darkMobile.screenshot({ path: path.join(output, 'fisica-newton-mobile-escuro.png'), fullPage: true });

for (const [label, page] of [['mobile', mobile], ['dark-mobile', darkMobile]] as const) {
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  if (dimensions.scrollWidth > dimensions.width + 1) browserErrors.push(`${label}: overflow horizontal ${dimensions.scrollWidth}px > ${dimensions.width}px`);
}

const reducedContext = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 768, height: 1024 } });
const reducedPage = await reducedContext.newPage();
monitor(reducedPage, 'reduced-motion');
await open(reducedPage, 'summary-biologia-bioenergetica-fotossintese-e-quimiossintese');
await reducedPage.getByTestId('visual-study-board').waitFor();
await reducedContext.close();

await browser.close();
if (browserErrors.length > 0) throw new Error(`Falhas de QA no navegador:\n${browserErrors.join('\n')}`);
console.log(`Capturas gravadas em ${output}`);
