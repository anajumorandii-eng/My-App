import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const catalog = JSON.parse(await fs.readFile('docs/visual-personalizado/04-cobertura-percurso.json', 'utf8'));
const output = path.resolve('docs/visual-personalizado/screenshots/percurso');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors: string[] = [];
const base = process.env.CRIVO_URL ?? 'http://localhost:3011';
try {
  for (const [index, subject] of catalog.subjects.entries()) {
    const chapter = catalog.chapters.find((item: { subject: string }) => item.subject === subject.subject);
    const page = await browser.newPage({ viewport: index % 2 ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, reducedMotion: index % 3 === 0 ? 'reduce' : 'no-preference' });
    page.on('pageerror', error => errors.push(`${subject.subject}: ${error.message}`));
    page.on('console', message => { if (message.type() === 'error') errors.push(`${subject.subject}: ${message.text()}`); });
    if (index % 2) await page.addInitScript(() => localStorage.setItem('crivo_theme', 'dark'));
    await page.goto(`${base}/visual?summary=${encodeURIComponent(chapter.id)}`);
    const close = page.getByRole('button', { name: 'Fechar', exact: true });
    if (await close.isVisible().catch(() => false)) await close.click();
    const journey = page.getByRole('region', { name: 'Percurso do capítulo' });
    await journey.waitFor();
    const steps = journey.getByRole('navigation').getByRole('button');
    if (await steps.count() !== chapter.stages.length) throw new Error(`Etapas incompletas: ${chapter.id}`);
    await steps.nth(1).click();
    await journey.locator('article h3').filter({ hasText: chapter.stages[1].title }).waitFor();
    const exploreSize = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    if (exploreSize.content > exploreSize.width + 1) errors.push(`${subject.subject}: overflow em Explorar`);
    await journey.screenshot({ path: path.join(output, `${index + 1}-percurso.png`) });
    await steps.last().click();
    await journey.getByRole('button', { name: /Testar o que aprendi/ }).click();
    await page.getByRole('heading', { name: 'Recuperação sem consulta' }).waitFor();
    if (await journey.count() || await page.getByTestId('visual-study-board').count()) throw new Error(`Consulta visível no teste: ${chapter.id}`);
    await page.getByRole('tab', { name: 'Reconstruir' }).click();
    await page.getByRole('heading', { name: 'Reconstrução ativa' }).waitFor();
    const size = await page.evaluate(() => ({ width: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
    if (size.content > size.width + 1) errors.push(`${subject.subject}: overflow`);
    await page.close();
    console.log(`OK ${subject.subject}: etapas, testar, reconstruir`);
  }
} finally { await browser.close(); }
if (errors.length) throw new Error(errors.join('\n'));
