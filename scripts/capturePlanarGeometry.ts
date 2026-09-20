import { chromium, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.CRIVO_URL ?? 'http://localhost:3012';
const output = path.resolve('docs/visual-personalizado/screenshots/geometria-plana');
const errors: string[] = [];
const chapters = [
  'summary-matematica-introducao-a-geometria-plana',
  'summary-matematica-angulos-em-triangulos',
  'summary-matematica-angulos-em-poligonos',
  'summary-matematica-angulos-e-circunferencias',
  'summary-matematica-simetrias-e-congruencias',
  'summary-matematica-identificacao-de-simetrias-i',
  'summary-matematica-identificacao-de-simetrias-ii',
  'summary-matematica-a-geometria-da-proporcionalidade',
  'summary-matematica-semelhanca-de-triangulos',
];

function viteNoise(text: string) {
  return /localhost:24678|\[vite\] failed to connect|WebSocket closed without opened/.test(text);
}

function monitor(page: Page, label: string) {
  page.on('pageerror', (error) => { if (!viteNoise(error.message)) errors.push(`${label}: ${error.message}`); });
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' && !viteNoise(text)) errors.push(`${label}: ${text}`);
  });
}

async function open(page: Page, id: string) {
  await page.goto(`${baseUrl}/visual?summary=${encodeURIComponent(id)}`, { waitUntil: 'domcontentloaded' });
  const close = page.getByRole('button', { name: 'Fechar', exact: true });
  if (await close.isVisible().catch(() => false)) await close.click();
  await page.getByTestId('visual-study-board').waitFor();
}

async function noOverflow(page: Page, label: string) {
  const size = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  if (size.content > size.viewport + 1) errors.push(`${label}: overflow horizontal ${size.content}px > ${size.viewport}px`);
}

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const id of chapters) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    monitor(page, id);
    await open(page, id);
    await noOverflow(page, id);
    const slider = page.getByRole('slider').first();
    await slider.focus();
    await slider.press('ArrowRight');
    await page.getByRole('tab', { name: 'Testar' }).click();
    if (await page.getByTestId('visual-study-board').count()) errors.push(`${id}: artefato ficou consultável em Testar`);
    await page.getByRole('tab', { name: 'Explorar' }).click();
    await page.close();
  }

  const polygon = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(polygon, 'polígonos desktop claro');
  await open(polygon, 'summary-matematica-angulos-em-poligonos');
  await polygon.getByRole('slider').fill('8');
  await polygon.screenshot({ path: path.join(output, 'poligonos-desktop-claro.png'), fullPage: true });
  await polygon.close();

  const symmetry = await browser.newPage({ viewport: { width: 375, height: 812 } });
  monitor(symmetry, 'simetria móvel escuro');
  await symmetry.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
  await open(symmetry, 'summary-matematica-identificacao-de-simetrias-ii');
  await noOverflow(symmetry, 'simetria móvel escuro');
  await symmetry.screenshot({ path: path.join(output, 'simetria-mobile-escuro.png'), fullPage: true });
  await symmetry.close();

  const similarity = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  monitor(similarity, 'semelhança tablet claro');
  await open(similarity, 'summary-matematica-semelhanca-de-triangulos');
  await similarity.getByRole('slider').fill('2');
  await similarity.screenshot({ path: path.join(output, 'semelhanca-tablet-claro.png'), fullPage: true });
  await similarity.close();

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 768, height: 1024 } });
  const reducedPage = await reduced.newPage();
  monitor(reducedPage, 'geometria movimento reduzido');
  await open(reducedPage, 'summary-matematica-angulos-e-circunferencias');
  await reduced.close();
} finally {
  await browser.close();
}

if (errors.length) throw new Error(`Falhas de QA visual:\n${errors.join('\n')}`);
console.log(`Capturas e QA concluídos em ${output}`);
