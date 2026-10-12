import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

// Run against the current build: CRIVO_URL=http://127.0.0.1:3001 node scripts/auditProfessionalVisual.mjs
const catalog = JSON.parse(await fs.readFile('docs/visual-personalizado/18-matriz-cobertura.json', 'utf8'));
const output = path.resolve(process.env.CRIVO_VISUAL_OUTPUT || 'docs/refinamento-profissional-613-2026-10-11');
await fs.mkdir(output, { recursive: true });
// Checkpoints ficam fora da árvore observada pelo Vite: gravá-los em docs
// recarregava a página durante testes simultâneos no servidor de desenvolvimento.
const checkpointOutput = path.join(tmpdir(), 'crivo-visual-checkpoints', createHash('sha256').update(output).digest('hex').slice(0, 12));
await fs.mkdir(checkpointOutput, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined, headless: true, args: ['--no-sandbox'] });
const results = [];
if (process.env.CRIVO_AUDIT_RESUME === '1') {
  for (const worker of [0, 1, 2]) {
    const checkpoint = JSON.parse(await fs.readFile(path.join(checkpointOutput, `checkpoint-${worker}.json`), 'utf8').catch(() => '[]'));
    results.push(...checkpoint.filter(result => !result.errors.length));
  }
}
try {
  await Promise.all([0, 1, 2].map(async worker => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, hasTouch: true, reducedMotion: 'reduce' });
    page.setDefaultTimeout(15000);
    await page.addInitScript(() => { localStorage.setItem('juju_onboarding', 'true'); localStorage.setItem('crivo_theme', 'dark'); });
    let errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (let i = worker; i < catalog.rows.length; i += 3) {
      const chapter = catalog.rows[i];
      if (results.some(result => result.id === chapter.id)) continue;
      errors = [];
      const result = { id: chapter.id, subject: chapter.subject, widths: [], errors: [] };
      try {
        if (page.url() === 'about:blank') {
          await page.goto(`${process.env.CRIVO_URL || 'http://127.0.0.1:3000'}/visual?summary=${encodeURIComponent(chapter.id)}`, { waitUntil: 'domcontentloaded' });
        } else {
          await page.evaluate(id => {
            history.pushState({}, '', `/visual?summary=${encodeURIComponent(id)}`);
            dispatchEvent(new PopStateEvent('popstate'));
          }, chapter.id);
        }
        const lab = page.locator('.vs-chapter-spatial-supplement .vs-spatial-lab');
        await page.locator(`[data-chapter-scene="${chapter.id}"]`).waitFor({ timeout: 30000 });
        await page.getByRole('region', { name: 'Percurso do capítulo' }).waitFor();
        // A ausência de suplemento é deliberada nos capítulos com modelo próprio.
        if (await page.locator('.vs-chapter-spatial-supplement').count()) {
          await lab.waitFor({ timeout: 30000 });
          await lab.getByRole('button', { name: 'Guardar para comparar' }).click();
          const comparison = lab.getByRole('region', { name: 'Comparação de estados' });
          await comparison.waitFor();
          const frozen = await comparison.locator('svg').innerHTML();
          const savedConditions = lab.getByLabel('Condições guardadas');
          const savedText = await savedConditions.innerText();
          const controls = lab.getByRole('region', { name: 'Manipular e observar' });
          const slider = controls.getByRole('slider').first();
          if (await slider.count()) {
            const value = await slider.inputValue();
            const maximum = await slider.getAttribute('max');
            await slider.fill(value === maximum ? (await slider.getAttribute('min')) : maximum);
          } else {
            await controls.getByRole('group').getByRole('button').nth(1).click();
          }
          await lab.getByLabel('Condições atuais').locator('[data-changed]').first().waitFor();
          if (await savedConditions.innerText() !== savedText) throw new Error('Condições guardadas foram alteradas');
          result.conditionComparison = 'passed';
          const reading = await lab.getByRole('status', { name: 'Leitura do modelo espacial' }).innerText();
          await lab.getByRole('img').focus(); await page.keyboard.press('ArrowRight');
          if (await lab.getByRole('status', { name: 'Leitura do modelo espacial' }).innerText() !== reading) throw new Error('Câmera alterou a leitura');
          if (await comparison.locator('svg').innerHTML() !== frozen) throw new Error('Referência foi alterada pela câmera');
          result.model = 'shared';
        } else {
          const figure = page.locator('[data-chapter-scene] svg[tabindex="0"]');
          await figure.first().waitFor({ timeout: 30000 });
          await figure.first().focus(); await page.keyboard.press('ArrowRight');
          result.model = 'dedicated';
        }
        for (const width of [1440, 834, 390, 360]) {
          await page.setViewportSize({ width, height: width === 834 ? 1112 : 900 });
          const sizes = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
          result.widths.push({ width, ...sizes });
          if (sizes.content > sizes.viewport + 1) result.errors.push(`Overflow em ${width}px: ${sizes.content}`);
        }
        await page.getByRole('button', { name: 'Entender esta etapa' }).click();
        if (!await page.locator('#visual-chapter-reading').evaluate(el => el === document.activeElement)) throw new Error('Leitura sem foco');
        await page.getByRole('button', { name: 'Responder ao desafio' }).click();
        await page.getByRole('heading', { name: 'Recuperação sem consulta' }).waitFor();
        if (await page.locator('.vs-spatial-lab').count()) throw new Error('Cena presente na recuperação sem consulta');
      } catch (error) { result.errors.push(error.message); }
      result.errors.push(...errors); results.push(result);
      await fs.writeFile(path.join(checkpointOutput, `checkpoint-${worker}.json`), JSON.stringify(results.filter(r => catalog.rows.findIndex(c => c.id === r.id) % 3 === worker)));
      if (result.errors.length) console.log(JSON.stringify({id:result.id,errors:result.errors}));
      if (results.length % 30 === 0) console.log(`${results.length}/${catalog.total} capítulos; ${results.filter(r => r.errors.length).length} com falhas`);
    }
    await page.close();
  }));
} finally { await browser.close(); }
results.forEach(result => { result.model ??= 'shared'; });
results.sort((a, b) => a.id.localeCompare(b.id));
await fs.writeFile(path.join(output, 'catalog-browser-results.json'), JSON.stringify({ total: results.length, failures: results.filter(r => r.errors.length), chapters: results }, null, 2));
console.log(`${results.length} capítulos; ${results.filter(r => r.errors.length).length} falhas`);
if (results.length !== 613 || results.some(r => r.errors.length)) process.exitCode = 1;
