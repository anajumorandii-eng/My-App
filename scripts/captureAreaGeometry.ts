import { chromium, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.CRIVO_URL ?? 'http://localhost:3012';
const output = path.resolve('docs/visual-personalizado/screenshots/areas-geometria');
const errors: string[] = [];
const chapters = [
  'summary-matematica-triangulo-retangulo',
  'summary-matematica-a-geometria-metrica-plana',
  'summary-matematica-areas-de-poligonos',
  'summary-matematica-area-do-circulo-e-de-suas-partes',
  'summary-matematica-razoes-entre-areas-de-figuras-planas',
  'summary-matematica-areas-de-figuras-planas',
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
  const size = await page.evaluate(() => [document.documentElement.clientWidth, document.documentElement.scrollWidth]);
  if (size[1] > size[0] + 1) errors.push(`${label}: overflow ${size[1]} > ${size[0]}`);
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
  const triangle = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(triangle, 'triângulo desktop'); await open(triangle, chapters[0]);
  await triangle.screenshot({ path: path.join(output, 'triangulo-retangulo-desktop-claro.png'), fullPage: true }); await triangle.close();

  const circle = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await circle.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
  monitor(circle, 'coroa móvel'); await open(circle, chapters[3]); await noOverflow(circle, 'coroa móvel');
  await circle.screenshot({ path: path.join(output, 'coroa-mobile-escuro.png'), fullPage: true }); await circle.close();

  const composite = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  monitor(composite, 'área composta tablet'); await open(composite, chapters[5]);
  await composite.getByRole('slider').fill('5');
  await composite.screenshot({ path: path.join(output, 'area-composta-tablet-claro.png'), fullPage: true }); await composite.close();

  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 768, height: 1024 } });
  const page = await context.newPage(); monitor(page, 'movimento reduzido'); await open(page, chapters[1]); await context.close();
} finally { await browser.close(); }
if (errors.length) throw new Error(errors.join('\n'));
console.log(`QA concluído em ${output}`);
