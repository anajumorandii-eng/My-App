import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
import { renderStudyPdf } from '../server/http/studyPdf.ts';

const output = process.env.CRIVO_STUDY_PDF_OUTPUT || '/tmp/crivo-study-pdf';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
try {
  const page = await browser.newPage();
  await page.routeWebSocket('**', socket => socket.close());
  await page.goto(process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3138', { waitUntil: 'networkidle' });
  const html = await page.evaluate(async () => {
    const { printStrategyGuide } = await import('/src/lib/printStrategyGuide.ts');
    const { printStyles } = await import('/src/lib/printStyles.ts');
    const { nativeMathPrintStyles } = await import('/src/lib/printPdfFile.ts');
    window.print = () => {};
    const article = document.createElement('article');
    Object.assign(article.dataset, { printSubject: 'Biologia', printTopic: 'Ecologia', printBoard: 'FUVEST', printSubtopic: 'Visão geral', printPurpose: 'Aprofundamento dos conceitos e de como são cobrados nas provas' });
    article.innerHTML = Array.from({ length: 14 }, (_, i) => `<h2>Seção ${i + 1}: relações ecológicas</h2><p>${'Texto sintético para conferir a diagramação. Este exemplo não é material de estudo. '.repeat(28)}</p>`).join('') + '<p>Modelo de população: <span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>N</mi><mo>=</mo><mn>100</mn></mrow><annotation encoding="application/x-tex">FORMULA_ALTERNATIVA</annotation></semantics></math></span><span class="katex-html">FORMULA_DUPLICADA</span></span></p><p>Última linha preservada.</p>';
    printStrategyGuide(article, 'Aprofundamento — Biologia — Ecologia');
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Crivo — exemplo de diagramação</title><style>${printStyles}\n${nativeMathPrintStyles}</style></head><body>${document.querySelector('[data-crivo-print-root]').outerHTML}</body></html>`;
  });
  await fs.writeFile(`${output}/sample.html`, html);
  const file = `${output}/ecologia.pdf`;
  await fs.writeFile(file, await renderStudyPdf(html));
  const pages = execFileSync('pdftotext', ['-raw', file, '-'], { encoding: 'utf8' }).split('\f').filter(page => page.trim());
  expect(pages[0].replace(/\s/g, '')).toContain('ECOLOGIA'); expect(pages[1]).toContain('Sumário');
  expect(pages.at(-1)).toContain('Última linha preservada.');
  expect(pages.join('')).not.toContain('http://127.0.0.1');
  expect(pages.join('')).not.toContain('FORMULA_DUPLICADA'); expect(pages.join('')).not.toContain('FORMULA_ALTERNATIVA');
  expect(pages.join('')).toContain('100');
  execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-scale-to', '1100', '-png', file, `${output}/cover`]);
  const blackFraction = Number(execFileSync('python3', ['-c', "from PIL import Image;import sys;im=Image.open(sys.argv[1]).convert('RGB');print(sum(max(p)<12 for p in im.getdata())/(im.width*im.height))", `${output}/cover.png`], { encoding: 'utf8' }));
  expect(blackFraction).toBeLessThan(.02);
  const result = { pages: pages.length, cover: 1, contents: 2, lastLine: true, nativeMathWithoutDuplicates: true, blackFraction, noBrowserHeaders: true };
  await fs.writeFile(`${output}/results.json`, JSON.stringify(result, null, 2)); console.log(JSON.stringify(result));
} finally { await browser.close(); }
