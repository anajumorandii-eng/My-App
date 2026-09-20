import { chromium, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.CRIVO_URL ?? 'http://localhost:3012';
const output = path.resolve('docs/visual-personalizado/screenshots/algebra');
const errors: string[] = [];
const chapters = [
  'summary-matematica-tecnicas-algebricas',
  'summary-matematica-igualdades',
  'summary-matematica-desigualdades',
  'summary-matematica-modelagem-algebrica-de-problemas-i',
  'summary-matematica-modelagem-algebrica-de-problemas-ii',
  'summary-matematica-representacao-geometrica-de-inequacoes',
];
const noise = (text: string) => /localhost:24678|\[vite\] failed to connect|WebSocket closed without opened/.test(text);
function monitor(page: Page, label: string) {
  page.on('pageerror', (error) => { if (!noise(error.message)) errors.push(`${label}: ${error.message}`); });
  page.on('console', (message) => { if (message.type() === 'error' && !noise(message.text())) errors.push(`${label}: ${message.text()}`); });
}
async function open(page: Page, id: string) {
  await page.goto(`${baseUrl}/visual?summary=${id}`, { waitUntil: 'domcontentloaded' });
  const close = page.getByRole('button', { name: 'Fechar', exact: true });
  if (await close.isVisible().catch(() => false)) await close.click();
  await page.getByTestId('visual-study-board').waitFor();
}
async function noOverflow(page: Page, label: string) {
  const [width, scrollWidth] = await page.evaluate(() => [document.documentElement.clientWidth, document.documentElement.scrollWidth]);
  if (scrollWidth > width + 1) errors.push(`${label}: overflow ${scrollWidth} > ${width}`);
}

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const id of chapters) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    monitor(page, id); await open(page, id); await noOverflow(page, id);
    await page.getByRole('slider').first().press('ArrowRight');
    await page.getByRole('tab', { name: 'Testar' }).click();
    if (await page.getByTestId('visual-study-board').count()) errors.push(`${id}: prancha visível em Testar`);
    await page.close();
  }
  const factor = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(factor, 'fatoração desktop'); await open(factor, chapters[0]);
  await factor.screenshot({ path: path.join(output, 'fatoracao-desktop-claro.png'), fullPage: true }); await factor.close();

  const equality = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await equality.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
  monitor(equality, 'igualdades móvel'); await open(equality, chapters[1]); await noOverflow(equality, 'igualdades móvel');
  await equality.getByRole('slider').fill('6');
  await equality.screenshot({ path: path.join(output, 'igualdades-mobile-escuro.png'), fullPage: true }); await equality.close();

  const revenue = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  monitor(revenue, 'receita tablet'); await open(revenue, chapters[4]);
  await revenue.getByRole('slider').fill('3');
  await revenue.screenshot({ path: path.join(output, 'receita-tablet-claro.png'), fullPage: true }); await revenue.close();

  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 768, height: 1024 } });
  const plane = await context.newPage(); monitor(plane, 'movimento reduzido'); await open(plane, chapters[5]); await context.close();
} finally { await browser.close(); }
if (errors.length) throw new Error(errors.join('\n'));
console.log(`QA concluído em ${output}`);
