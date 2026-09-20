import { chromium, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.CRIVO_URL ?? 'http://localhost:3012';
const output = path.resolve('docs/visual-personalizado/screenshots/fungos-enzimas');
const errors: string[] = [];

function isViteSocketNoise(text: string) {
  return /localhost:24678|\[vite\] failed to connect|WebSocket closed without opened/.test(text);
}

function monitor(page: Page, label: string) {
  page.on('pageerror', (error) => {
    if (!isViteSocketNoise(error.message)) errors.push(`${label}: ${error.message}`);
  });
  page.on('console', (message) => {
    const text = message.text();
    if (message.type() === 'error' && !isViteSocketNoise(text)) errors.push(`${label}: ${text}`);
  });
}

async function open(page: Page, id: string) {
  await page.goto(`${baseUrl}/visual?summary=${encodeURIComponent(id)}`, { waitUntil: 'domcontentloaded' });
  const close = page.getByRole('button', { name: 'Fechar', exact: true });
  if (await close.isVisible().catch(() => false)) await close.click();
  await page.getByTestId('visual-study-board').waitFor();
}

async function assertNoOverflow(page: Page, label: string) {
  const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  if (size.content > size.width + 1) errors.push(`${label}: overflow horizontal ${size.content}px > ${size.width}px`);
}

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const fungiDesktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(fungiDesktop, 'fungos desktop claro');
  await open(fungiDesktop, 'summary-biologia-fungos');
  await fungiDesktop.getByRole('button', { name: /estrutura reprodutiva/i }).click();
  await fungiDesktop.screenshot({ path: path.join(output, 'fungos-desktop-claro.png'), fullPage: true });
  await fungiDesktop.close();

  const fungiMobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  monitor(fungiMobile, 'fungos móvel escuro');
  await fungiMobile.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
  await open(fungiMobile, 'summary-biologia-fungos');
  await assertNoOverflow(fungiMobile, 'fungos móvel escuro');
  await fungiMobile.getByRole('tab', { name: 'Relações' }).click();
  await fungiMobile.screenshot({ path: path.join(output, 'fungos-mobile-escuro-relacoes.png'), fullPage: true });
  await fungiMobile.close();

  const enzymeDesktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  monitor(enzymeDesktop, 'enzimas desktop escuro');
  await enzymeDesktop.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
  await open(enzymeDesktop, 'summary-biologia-proteinas-enzimas');
  await enzymeDesktop.getByRole('button', { name: /Encaixe induzido/i }).click();
  await enzymeDesktop.evaluate(() => window.scrollTo(0, 0));
  await enzymeDesktop.screenshot({ path: path.join(output, 'enzimas-desktop-escuro.png'), fullPage: true });
  await enzymeDesktop.close();

  const enzymeMobile = await browser.newPage({ viewport: { width: 375, height: 812 } });
  monitor(enzymeMobile, 'enzimas móvel claro');
  await open(enzymeMobile, 'summary-biologia-proteinas-enzimas');
  await assertNoOverflow(enzymeMobile, 'enzimas móvel claro');
  await enzymeMobile.getByRole('tab', { name: 'Testar' }).click();
  if (await enzymeMobile.getByTestId('visual-study-board').count()) errors.push('enzimas testar: artefato consultável');
  await enzymeMobile.getByRole('tab', { name: 'Reconstruir' }).click();
  await enzymeMobile.getByRole('heading', { name: 'Reconstrução ativa' }).waitFor();
  await enzymeMobile.getByRole('tab', { name: 'Reconstruir' }).press('Home');
  if (await enzymeMobile.getByRole('tab', { name: 'Explorar' }).getAttribute('aria-selected') !== 'true') errors.push('enzimas teclado: Home não retornou a Explorar');
  await enzymeMobile.screenshot({ path: path.join(output, 'enzimas-mobile-claro.png'), fullPage: true });
  await enzymeMobile.close();

  const reduced = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 768, height: 1024 } });
  const reducedPage = await reduced.newPage();
  monitor(reducedPage, 'enzimas movimento reduzido');
  await open(reducedPage, 'summary-biologia-proteinas-enzimas');
  await reduced.close();
} finally {
  await browser.close();
}

if (errors.length) throw new Error(`Falhas de QA visual:\n${errors.join('\n')}`);
console.log(`Capturas e QA concluídos em ${output}`);
