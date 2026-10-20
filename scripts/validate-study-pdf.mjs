import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import { renderStudyPdf } from '../server/http/studyPdf.ts';
import { readSectionPages } from '../server/http/studyPdfPagination.ts';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const output = process.env.CRIVO_STUDY_PDF_OUTPUT || 'output/study-pdf';
const executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch({ executablePath });
await fs.mkdir(output, { recursive: true });
const results = [];
try {
  const page = await browser.newPage();
  await page.route('http://127.0.0.1:3138/', route => route.fulfill({contentType: 'text/html', body: '<html><body></body></html>'}));
  await page.goto('http://127.0.0.1:3138', {waitUntil: 'domcontentloaded'});
  await page.evaluate(async () => {
    const {default: RefreshRuntime} = await import('/@react-refresh');
    RefreshRuntime.injectIntoGlobalHook(window);
    window.$RefreshReg$ = () => {};
    window.$RefreshSig$ = () => type => type;
    window.__vite_plugin_react_preamble_installed__ = true;
  });
  for (const [subject, topic, name, stress] of [
    ['História', 'Brasil Colônia', 'historia-brasil-colonia-fuvest', false],
    ['Física', 'Cinemática Escalar', 'fisica-cinematica-escalar-fuvest', false],
    ['História', 'Brasil Colônia', 'tabelas-textos-longos', true],
  ]) {
    const sample = await page.evaluate(async ({subject, topic, stress}) => {
      const { fixture } = await import('/scripts/studyPdfFixture.tsx');
      return fixture(subject, topic, stress);
    }, {subject, topic, stress});
    const pdf = await renderStudyPdf(sample.html);
    await fs.writeFile(`${output}/${name}.pdf`, pdf);
    await fs.writeFile(`${output}/${name}.html`, sample.html);
    const sectionPages = await readSectionPages(pdf, sample.entries);
    const doc = await getDocument({data: Uint8Array.from(pdf)}).promise;
    const texts = [];
    const fonts = new Set();
    for (let index = 1; index <= doc.numPages; index++) {
      const p = await doc.getPage(index);
      const text = await p.getTextContent();
      texts.push(text.items.map(item => item.str ?? '').join(' '));
      await p.getOperatorList();
      for (const style of Object.values(text.styles)) fonts.add(style.fontFamily);
    }
    assert(texts[1].includes('Sumário'));
    assert(!texts.join('').includes('\ufffd'));
    const normalize = text => text.normalize('NFKC').replace(/\s+/g, '').replace(/CRIVO·CADERNODEESTUDO/g, '');
    const body = texts.slice(Math.min(...Object.values(sectionPages)) - 1).join('');
    await fs.writeFile(`${output}/${name}-text.json`, JSON.stringify({body: normalize(body), source: normalize(sample.sourceText)}));
    assert(normalize(body).includes(normalize(sample.sourceText)), `${name}: editorial content/order changed`);
    if (stress) {
      const rows = [...body.matchAll(/Registro\s+(\d+)/g)].map(match => Number(match[1]));
      assert.deepEqual(rows, Array.from({length: 95}, (_, index) => index+1));
      for (const text of texts.filter(text => /Registro\s+\d+/.test(text))) {
        assert(text.includes('Descrição') && text.includes('Valor'), 'Missing repeated table header');
      }
      assert(body.includes('Observação') && body.includes('Explicação'));
    }
    results.push({ name, pages: doc.numPages, sectionPages, fonts: [...fonts], textCharacters: texts.join('').length });
    await doc.destroy();
  }
} finally { await browser.close(); }
await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
