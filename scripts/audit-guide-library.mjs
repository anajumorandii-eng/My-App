import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Synthetic local guides only: no login, generation, account writes or deletion.
const base = process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3000';
const output = process.env.CRIVO_LIBRARY_AUDIT_OUTPUT || 'tests/e2e/.artifacts/guide-library';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
await fs.mkdir(output, { recursive: true });
const results = [];
try {
  for (const theme of ['light', 'dark']) for (const width of [390, 1366]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: theme });
    await context.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true'); localStorage.setItem('crivo_theme', theme);
      const storageKey = 'crivo:strategy-guides:v1:guest';
      if (localStorage.getItem(storageKey)) return;
      const guides = {};
      for (let i = 0; i < 40; i++) {
        const subject = ['Matemática', 'Química', 'História'][i % 3];
        const topicId = ['mat_aritmetica', 'qui_equilibrio', 'hist_brasil_colonia'][i % 3];
        const chapter = `${['Proporções', 'Equilíbrio químico', 'Brasil Colônia'][i % 3]} · ${i}`;
        const board = i % 2 ? 'UNICAMP' : 'FUVEST';
        const key = JSON.stringify([subject, topicId, chapter, board]);
        guides[key] = { key, subject, topicId, topicName: 'Tópico de validação', chapter, board, text: `Texto de validação do guia ${i}. Justifique cada etapa e compare a explicação com as evidências.`, savedAt: new Date(Date.UTC(2026, 9, 17, 12, i)).toISOString() };
      }
      localStorage.setItem(storageKey, JSON.stringify(guides));
    }, theme);
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const result = { theme, width, errors, checks: [], accessibility: [] };
    const visit = path => page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    const inspect = async label => {
      await page.evaluate(() => document.fonts.ready);
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      const violations = axe.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
      result.accessibility.push({ label, violations });
      expect(violations).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    };
    try {
      await visit('/estrategias');
      await expect(page.getByRole('link', { name: 'Meus aprofundamentos (40)' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Aprofundamentos salvos', exact: true })).toHaveCount(0);
      await page.getByRole('link', { name: 'Meus aprofundamentos (40)' }).click();
      await expect(page.getByRole('link', { name: /Abrir aprofundamento:/ })).toHaveCount(12);
      await inspect('biblioteca: 40 guias, 12 cartões por página');
      await page.screenshot({ path: `${output}/biblioteca-${theme}-${width}.png` });
      result.checks.push('estratégia sem lista de salvos; biblioteca própria paginada');
      await page.getByRole('combobox', { name: /^Matéria/ }).selectOption('Química');
      await page.getByLabel('Buscar nos aprofundamentos', { exact: true }).fill('equilibrio');
      await page.getByRole('combobox', { name: /^Banca/ }).selectOption('UNICAMP');
      await expect(page.getByRole('link', { name: /Abrir aprofundamento:/ })).toHaveCount(7);
      await page.getByRole('button', { name: 'Limpar filtros', exact: true }).click();
      await page.getByRole('button', { name: 'Próxima', exact: true }).click();
      await expect(page.getByText('Página 2 de 4', { exact: true })).toBeVisible();
      await page.getByRole('link', { name: /Abrir aprofundamento:/ }).first().click();
      const savedText = await page.locator('article').innerText();
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.locator('article')).toHaveText(savedText, { useInnerText: true });
      await expect(page.getByRole('button', { name: 'Imprimir / Salvar em PDF', exact: true })).toBeEnabled();
      await inspect('leitor de guia salvo recuperado pela URL');
      await page.getByRole('link', { name: 'Voltar à biblioteca de aprofundamentos', exact: true }).click();
      await expect(page.getByText('Página 2 de 4', { exact: true })).toBeVisible();
      expect(await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem('crivo:strategy-guides:v1:guest'))).length)).toBe(40);
      result.checks.push('busca sem acentos, filtros, leitor, recarga e retorno sem perda dos 40 guias');
      // The public strategy explorer reads the published dossier directly.
      // The full work page additionally needs the account's Firestore catalog;
      // summary/tab behavior is covered in WorkStudyContent.test.tsx.
      await visit('/estrategias');
      await page.getByRole('button', { name: 'Por obra', exact: true }).click();
      await page.getByLabel('Obra da estratégia').selectOption('a-vida-nao-e-util');
      const scope = page.getByLabel('Escopo do estudo da obra');
      await expect(scope).toHaveValue('');
      await expect(page.getByRole('heading', { name: 'Estratégias de leitura e resolução de A vida não é útil' })).toBeVisible();
      await inspect('estratégia: visão geral da obra completa como padrão');
      await page.screenshot({ path: `${output}/obra-completa-${theme}-${width}.png` });
      const firstUnit = await scope.locator('option').nth(1).getAttribute('value');
      await scope.selectOption(firstUnit);
      await expect(page.getByRole('heading', { name: /Aprofundamento por unidade/ })).toBeVisible();
      await inspect('estratégia: aprofundamento opcional da unidade');
      await page.getByRole('button', { name: 'Voltar à visão geral da obra completa', exact: true }).click();
      await expect(scope).toHaveValue('');
      await expect(page.getByRole('heading', { name: 'Roteiro específico desta obra', exact: true })).toBeVisible();
      await scope.selectOption(firstUnit);
      await page.getByLabel('Obra da estratégia').selectOption('olhos-dagua');
      await expect(page.getByRole('heading', { name: 'Estratégias de leitura e resolução de Olhos d’água' })).toBeVisible();
      await expect(scope).toHaveValue('');
      result.checks.push('obra completa por padrão; unidade opcional; retorno à visão geral; troca de obra sem herdar a unidade');
      expect(errors).toEqual([]); result.passed = true;
    } catch (error) { result.passed = false; result.failure = String(error); await page.screenshot({ path: `${output}/falha-${theme}-${width}.png`, fullPage: true }); }
    results.push(result); await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n'); console.log(JSON.stringify(result)); await context.close();
  }
} finally { await browser.close(); }
process.exitCode = results.every(result => result.passed) ? 0 : 1;
