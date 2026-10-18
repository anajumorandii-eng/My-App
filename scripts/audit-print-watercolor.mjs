import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
const output = process.env.CRIVO_PRINT_OUTPUT || '/tmp/crivo-print-watercolor';
const base = process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3138';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const theme of ['light', 'dark']) for (const width of [390, 1366]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme });
    await page.goto(base);
    // Synthetic content exercises the actual shared helper without an account or AI call.
    await page.evaluate(async theme => {
      const { printStrategyGuide } = await import('/src/lib/printStrategyGuide.ts');
      document.documentElement.dataset.theme = theme;
      document.body.style.background = theme === 'dark' ? '#111' : '#fff';
      window.print = () => { window.__printCalls = (window.__printCalls || 0) + 1; };
      const content = document.createElement('article');
      content.innerHTML = '<h1>Ecologia &amp; evolução</h1><p>Biologia · Unicamp · Aprofundamento combinado</p>' +
        Array.from({ length: 14 }, (_, i) => `<section><h2>${i + 1}. Do conceito à explicação</h2><p>SEÇÃO ${i + 1}. A seleção natural acontece em ambientes concretos. Recursos, competição e predação influenciam a sobrevivência e a reprodução. Explique a ligação entre os dados apresentados e o mecanismo proposto, distinguindo observação e interpretação.</p><blockquote>Antes de consultar: o que você lembra e como explicaria esse processo?</blockquote><p>Compare as hipóteses e identifique quais evidências seriam necessárias. Registre os limites da interpretação e retome o ponto que ainda não conseguiu explicar.</p></section>`).join('') +
        '<details><summary>Fontes e notas</summary><p>FONTE CONFERIDA — material sintético para conferir impressão.</p><a href="https://example.org/fonte">https://example.org/fonte</a></details><p>LINK LONGO: https://example.org/' + 'referencia'.repeat(30) + '</p><button data-print-exclude>NÃO IMPRIMIR</button>';
      printStrategyGuide(content, 'Crivo — Ecologia & evolução');
    }, theme);
    expect(await page.evaluate(() => window.__printCalls)).toBe(1);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-crivo-print-root]')).toBeVisible();
    await page.locator('[data-print-masthead] img').evaluate(img => img.decode());
    const root = page.locator('[data-print-content]');
    expect(await root.locator('p').first().evaluate(el => getComputedStyle(el).color)).toBe('rgb(38, 60, 61)');
    const file = `${output}/crivo-${theme}-${width}.pdf`;
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false });
    const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' });
    const pages = text.split('\f').filter(page => page.trim());
    expect(pages.length).toBeGreaterThan(2);
    expect(text).toContain('Ecologia'); expect(text).toContain('SEÇÃO 14'); expect(text).toContain('FONTE CONFERIDA');
    expect(text).not.toContain('NÃO IMPRIMIR');
    expect(pages.every(page => page.includes('SEÇÃO') || page.includes('FONTE CONFERIDA'))).toBe(true);
    expect(text).toContain('CADERNO DE ESTUDO');
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    expect(await page.locator('[data-crivo-print-root]').count()).toBe(0);
    results.push({ theme, width, pages: pages.length, synchronousPrint: true, readableWithoutBackgroundGraphics: true, allSectionsAndSources: true, cleanedUp: true });
    await page.close();
  }
} finally {
  await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
