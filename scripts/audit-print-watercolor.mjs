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
      Object.assign(content.dataset, { printSubject: 'Biologia', printTopic: 'Ecologia & evolução', printSubtopic: 'Seleção natural e relações ecológicas', printBoard: 'UNICAMP', printPurpose: 'Aprofundar conceitos e interpretar sua cobrança na prova' });
      content.innerHTML = '<h1>Ecologia &amp; evolução</h1><p>Biologia · Unicamp · Aprofundamento combinado</p>' +
        Array.from({ length: 14 }, (_, i) => `<section><h2>${i + 1}. Do conceito à explicação</h2><p>SEÇÃO ${i + 1}. A seleção natural acontece em ambientes concretos. Recursos, competição e predação influenciam a sobrevivência e a reprodução. Explique a ligação entre os dados apresentados e o mecanismo proposto, distinguindo observação e interpretação.</p><blockquote>Antes de consultar: o que você lembra e como explicaria esse processo?</blockquote><p>Compare as hipóteses e identifique quais evidências seriam necessárias. Registre os limites da interpretação e retome o ponto que ainda não conseguiu explicar.</p></section>`).join('') +
        '<details><summary>Fontes e notas</summary><p>FONTE CONFERIDA — material sintético para conferir impressão.</p><a href="https://example.org/fonte">https://example.org/fonte</a></details><p>LINK LONGO: https://example.org/' + 'referencia'.repeat(30) + '</p><button data-print-exclude>NÃO IMPRIMIR</button>';
      printStrategyGuide(content, 'Crivo — Ecologia & evolução');
    }, theme);
    expect(await page.evaluate(() => window.__printCalls)).toBe(1);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-crivo-print-root]')).toBeVisible();
    await page.locator('[data-print-frame]').evaluate(img => img.decode());
    const root = page.locator('[data-print-content]');
    expect(await root.locator('p').first().evaluate(el => getComputedStyle(el).color)).toBe('rgb(38, 60, 61)');
    const file = `${output}/crivo-${theme}-${width}.pdf`;
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false });
    const text = execFileSync('pdftotext', ['-layout', file, '-'], { encoding: 'utf8' });
    const pages = text.split('\f').filter(page => page.trim());
    expect(pages.length).toBe(6);
    expect(pages[0]).toContain('BANCA / PROVA');
    expect(pages[0]).toContain('UNICAMP');
    expect(pages[0]).toContain('Seleção natural');
    expect(pages[0]).not.toContain('SEÇÃO 1.');
    expect(pages[1]).toContain('Sumário');
    expect(pages[1]).toContain('14. Do conceito');
    expect(pages[1]).not.toContain('SEÇÃO 1.');
    expect(pages[2]).toContain('SEÇÃO 1.');
    const tocLinks = await page.locator('[data-print-toc] a').evaluateAll(links => links.map(link => ({ title: link.textContent, targetFound: !!document.getElementById(link.hash.slice(1)) })));
    expect(tocLinks.every(link => link.targetFound)).toBe(true);
    expect(text).toContain('Ecologia'); expect(text).toContain('SEÇÃO 14'); expect(text).toContain('FONTE CONFERIDA');
    expect(text).not.toContain('NÃO IMPRIMIR');
    expect(pages.every(page => page.replace(/CRIVO\s*·\s*CADERNO DE ESTUDO/g, '').trim().length > 20)).toBe(true);
    expect(text).toContain('CADERNO DE ESTUDO');
    const imagePages = new Set(execFileSync('pdfimages', ['-list', file], { encoding: 'utf8' }).split('\n').flatMap(line => /^\s*(\d+)\s+\d+\s+image/.exec(line)?.slice(1) ?? []));
    expect([...imagePages]).toEqual(['1']);
    const bbox = execFileSync('pdftotext', ['-bbox', file, '-'], { encoding: 'utf8' });
    for (const match of bbox.split('<page ').slice(3).join('<page ').matchAll(/<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)"/g)) {
      const [, x1, y1, x2, y2] = match.map(Number);
      if (y1 > 810) continue; // Small identity below the text area.
      expect(x1).toBeGreaterThanOrEqual(50);
      expect(x2).toBeLessThanOrEqual(546);
      expect(y1).toBeGreaterThanOrEqual(44);
      expect(y2).toBeLessThanOrEqual(798);
    }
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    expect(await page.locator('[data-crivo-print-root]').count()).toBe(0);
    results.push({ theme, width, pages: pages.length, synchronousPrint: true, readableWithoutBackgroundGraphics: true, allSectionsAndSources: true, coverOnPageOne: true, contentsOnPageTwo: true, artOnlyOnCover: true, textInsideNormalMargins: true, cleanedUp: true });
    await page.close();
  }
} finally {
  await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
  await browser.close();
}
console.log(JSON.stringify(results, null, 2));
