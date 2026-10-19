import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';

const output = process.env.CRIVO_PRINT_LIFECYCLE_OUTPUT || '/tmp/crivo-print-lifecycle';
const base = process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3138';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const key = JSON.stringify(['Biologia', 'bio_ecologia', '', 'FUVEST']);
const results = [];
try {
  for (const early of [false, true]) for (const route of ['estrategias?topic=bio_ecologia&board=FUVEST', `aprofundamentos?${new URLSearchParams({ guia: key })}`]) {
    const page = await browser.newPage({ viewport: { width: 834, height: 1112 }, hasTouch: true });
    await page.routeWebSocket('**', socket => socket.close());
    await page.addInitScript(({ key, early }) => {
      localStorage.setItem('juju_onboarding', 'true');
      localStorage.setItem('crivo:strategy-guides:v1:guest', JSON.stringify({ [key]: {
        key, subject: 'Biologia', topicId: 'bio_ecologia', topicName: 'Ecologia', chapter: '', board: 'FUVEST',
        text: '## Relações ecológicas\n\nExemplo sintético para conferir a impressão.\n\n## Aplicação na prova\n\nÚltima seção demonstrativa.',
        savedAt: '2026-10-19T10:00:00Z',
      } }));
      document.addEventListener('DOMContentLoaded', () => {
        window.__printEvents = { before: 0, after: 0 };
        window.addEventListener('beforeprint', () => window.__printEvents.before++);
        window.addEventListener('afterprint', () => window.__printEvents.after++);
        if (early) {
          const nativePrint = window.print.bind(window);
          window.print = () => { window.dispatchEvent(new Event('afterprint')); nativePrint(); };
        }
      });
    }, { key, early });
    await page.goto(`${base}/${route}`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Imprimir / Salvar em PDF', exact: true }).click();
    await expect(page.locator('[data-print-cover]')).toHaveCount(1);
    expect((await page.evaluate(() => window.__printEvents)).before).toBeGreaterThan(0);
    await page.emulateMedia({ media: 'print' });
    await page.locator('[data-print-illustration]').evaluate(image => image.decode());
    await page.evaluate(() => document.fonts.ready);
    const name = `${route.split('?')[0]}-${early ? 'early' : 'native'}`;
    const file = `${output}/${name}.pdf`;
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: false });
    const pages = execFileSync('pdftotext', ['-raw', file, '-'], { encoding: 'utf8' }).split('\f').filter(page => page.trim());
    expect(pages).toHaveLength(3);
    expect(pages[0].replace(/\s/g, '')).toContain('ECOLOGIA'); expect(pages[1]).toContain('Sumário'); expect(pages[2]).toContain('Última seção demonstrativa.');
    execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-scale-to', '900', '-png', file, `${output}/${name}`]);
    const blackFraction = Number(execFileSync('python3', ['-c', "from PIL import Image;import sys;im=Image.open(sys.argv[1]).convert('RGB');print(sum(max(p)<12 for p in im.getdata())/(im.width*im.height))", `${output}/${name}.png`], { encoding: 'utf8' }));
    expect(blackFraction).toBeLessThan(.02);
    await page.emulateMedia({ media: 'screen' });
    await page.mouse.click(10, 10);
    await expect(page.locator('[data-crivo-print-root]')).toHaveCount(0);
    results.push({ route: route.split('?')[0], earlyAfterprint: early, nativePrintEvents: await page.evaluate(() => window.__printEvents), pages: pages.length, blackFraction, cleanedUp: true });
    await page.close();
  }
} finally { await browser.close(); await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2)); }
console.log(JSON.stringify(results, null, 2));
