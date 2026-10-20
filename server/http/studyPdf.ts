import { Router } from 'express';
import { existsSync } from 'node:fs';
import { launch } from 'puppeteer-core';
import { readSectionPages } from './studyPdfPagination';

const MAX_HTML_BYTES = 12 * 1024 * 1024;

/** The renderer has no session, scripts, network access, or persistent profile. */
export async function renderStudyPdf(html: string): Promise<Uint8Array> {
  const executablePath = process.env.CHROMIUM_PATH || ['/usr/bin/chromium', '/usr/bin/google-chrome'].find(existsSync);
  if (!executablePath) throw new Error('PDF renderer unavailable');
  const browser = await launch({ executablePath, headless: true, timeout: 15_000,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-background-networking'] });
  try {
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on('request', request => { void (request.url().startsWith('data:') ? request.continue() : request.abort()); });
    const policy = "default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
    await page.setContent(`<!doctype html><meta http-equiv="Content-Security-Policy" content="${policy}">${html}`, { waitUntil: 'load', timeout: 15_000 });
    await page.emulateMediaType('print');
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
    });
    await page.evaluate(() => {
      const usefulHeight = 245 * 96 / 25.4;
      // Keep modest tables and individual solution steps intact; large units flow.
      for (const unit of document.querySelectorAll<HTMLElement>('[data-print-content] table, [data-print-content] li, [data-print-step]')) {
        if (unit.getBoundingClientRect().height < usefulHeight * .35) unit.dataset.printKeep = '';
      }
      for (const row of document.querySelectorAll<HTMLElement>('[data-print-content] tr')) {
        if (row.getBoundingClientRect().height > usefulHeight) row.dataset.printSplit = '';
      }
    });
    const ids = await page.$$eval('[data-toc-page]', entries => entries.map(entry => entry.getAttribute('data-toc-page')!));
    let previous: Record<string, number> = {};
    // Reprint the source after filling the index. No PDF pages are cut or reassembled.
    for (let pass = 0; pass < 5; pass++) {
      const pdf = await page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false, timeout: 20_000 });
      if (!ids.length) return pdf;
      const current = await readSectionPages(pdf, ids);
      if (ids.every(id => previous[id] === current[id])) return pdf;
      await page.evaluate(numbers => {
        for (const entry of document.querySelectorAll<HTMLElement>('[data-toc-page]')) entry.textContent = String(numbers[entry.dataset.tocPage!]);
      }, current);
      previous = current;
    }
    throw new Error('PDF pagination did not converge');
  } finally {
    const watchdog = setTimeout(() => browser.process()?.kill('SIGKILL'), 3_000);
    try { await browser.close(); } finally { clearTimeout(watchdog); }
  }
}

export function createStudyPdfRouter(render: (html: string) => Promise<Uint8Array> = renderStudyPdf) {
  const router = Router();
  let rendering = false;
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  router.post('/', async (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => !['title', 'html'].includes(key)) ||
      typeof body.title !== 'string' || !body.title.trim() || body.title.length > 300 ||
      typeof body.html !== 'string' || !body.html.trim() || Buffer.byteLength(body.html) > MAX_HTML_BYTES) {
      return res.status(400).json({ error: 'O material é inválido ou excede o tamanho permitido.' });
    }
    if (rendering) return res.status(503).setHeader('Retry-After', '5').json({ error: 'Outro PDF está sendo preparado. Tente novamente em alguns instantes.' });
    rendering = true;
    try {
      const pdf = await render(body.html);
      if (pdf.length > 25 * 1024 * 1024) throw new Error('PDF exceeded limit');
      const filename = body.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9 -]/g, '').trim().slice(0, 100) || 'Crivo';
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
      return res.send(Buffer.from(pdf));
    } catch {
      return res.status(502).json({ error: 'Não foi possível preparar o PDF. Seu material continua salvo; tente novamente.' });
    } finally { rendering = false; }
  });
  return router;
}
