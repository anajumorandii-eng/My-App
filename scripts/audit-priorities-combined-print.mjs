import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const base = process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3135';
const output = process.env.CRIVO_PRIORITIES_AUDIT_OUTPUT || '/tmp/crivo-priorities-audit';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
try {
  for (const width of [390, 1366]) for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
    await context.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true'); localStorage.setItem('crivo_theme', theme);
      const key = JSON.stringify(['combined-v1', 'Biologia', [['bio_ecologia', ''], ['bio_evolucao', '']], 'UNICAMP']);
      const guide = { key, subject: 'Biologia', topicId: 'bio_ecologia', topicName: 'Ecologia + Evolução', chapter: '', board: 'Unicamp', text: 'GUIA SINTETICO DE IMPRESSAO. Ecologia e Evolução: relações entre seleção sexual e predação.\n\nEste texto verifica a recuperação e a impressão de um aprofundamento salvo.', savedAt: '2026-10-17T12:00:00Z', selections: [{ topicId: 'bio_ecologia', topicName: 'Ecologia', chapter: '' }, { topicId: 'bio_evolucao', topicName: 'Evolução', chapter: '' }] };
      localStorage.setItem('crivo:strategy-guides:v1:guest', JSON.stringify({ [key]: guide }));
      window.__printCalls = 0; window.print = () => { window.__printCalls++; };
    }, theme);
    const page = await context.newPage(), errors = [], accessibility = [];
    page.on('pageerror', error => errors.push(error.message));
    const check = async label => {
      const violations = (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations.map(item => ({ id: item.id, impact: item.impact }));
      expect(violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      accessibility.push({ label, violations });
    };
    const query = new URLSearchParams({ topic: 'bio_ecologia', board: 'Unicamp', topics: JSON.stringify([{ topicId: 'bio_evolucao', chapter: '' }]) });
    await page.goto(`${base}/estrategias?${query}`);
    await expect(page.getByRole('heading', { name: 'Aprofundamento: Ecologia + Evolução' })).toBeVisible();
    await expect(page.getByText('GUIA SINTETICO DE IMPRESSAO.', { exact: false })).toBeVisible();
    await page.getByText('Combinar mais tópicos de Biologia no mesmo aprofundamento', { exact: true }).click();
    await expect(page.getByRole('checkbox', { name: 'Evolução', exact: true })).toBeChecked();
    await expect(page.getByRole('combobox', { name: /^Capítulo de Evolução/ })).toHaveValue('');
    await check('estratégia com dois tópicos e guia salvo');
    await page.screenshot({ path: `${output}/combinado-${theme}-${width}.png`, fullPage: true });
    await page.getByRole('link', { name: 'Abrir este guia na biblioteca', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Ecologia + Evolução', exact: true, level: 1 })).toBeVisible();
    await check('biblioteca: guia combinado recuperado');
    await page.getByRole('button', { name: 'Imprimir / Salvar em PDF', exact: true }).click();
    expect(await page.evaluate(() => window.__printCalls)).toBe(1);
    expect(await page.locator('iframe').count()).toBe(0);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('[data-crivo-print-root]')).toBeVisible();
    const pdfPath = `${output}/aprofundamento-${theme}-${width}.pdf`;
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    const pdfText = execFileSync('pdftotext', [pdfPath, '-'], { encoding: 'utf8' });
    expect(pdfText).toContain('GUIA SINTETICO DE IMPRESSAO'); expect(pdfText).toContain('Ecologia');expect(pdfText).toContain('Evolução');
    expect(pdfText).not.toContain('Voltar à biblioteca');
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));
    await page.emulateMedia({ media: 'screen' });
    await expect(page.locator('[data-crivo-print-root]')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Imprimir / Salvar em PDF', exact: true })).toBeVisible();
    await page.goto(`${base}/prioridades`);
    await expect(page.getByRole('heading', { name: 'Como as provas cobram este conteúdo' })).toBeVisible();
    await expect(page.getByText('18.5%', { exact: true })).toHaveCount(0);
    await page.getByRole('combobox', { name: /^Banca das evidências/ }).selectOption('UNICAMP');
    await page.getByRole('combobox', { name: /^Fase das evidências/ }).selectOption('2a');
    await page.getByText('Mostrar mais análises', { exact: false }).click();
    await expect(page.getByRole('heading', { name: /questão 11: Plumagem de pavões/ })).toBeVisible();
    await expect(page.getByText(/Seleção sexual e predação\./)).toBeVisible();
    await check('prioridades: prova e fase com evidência da conexão');
    await page.screenshot({ path: `${output}/prioridades-${theme}-${width}.png`, fullPage: true });
    expect(errors).toEqual([]);
    const result = { width, theme, passed: true, pdfContainsSavedGuide: true, nativePrintCalledInCurrentWindow: true, errors, accessibility };
    results.push(result); console.log(JSON.stringify(result)); await context.close();
  }
} finally { await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2)); await browser.close(); }
