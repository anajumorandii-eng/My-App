import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3100';
const output = process.env.CRIVO_AUDIT_OUTPUT || 'tests/e2e/.artifacts/literature-foundations';
const phase = process.env.CRIVO_AUDIT_PHASE || 'full';
const widths = (process.env.CRIVO_AUDIT_WIDTHS || (phase === 'typography' ? '390,1366' : '360,390,834,1366')).split(',').map(Number);
const motions = (process.env.CRIVO_AUDIT_MOTIONS || 'reduce,no-preference').split(',');
const chapters = [
  ['summary-literatura-a-arte-e-suas-linguagens', 'art-languages'],
  ['summary-literatura-texto-literario-x-texto-nao-literario', 'literary-text'],
  ['summary-literatura-elementos-da-narrativa', 'narrative-elements'],
  ['summary-literatura-trovadorismo-e-humanismo', 'medieval-voices'],
  ['summary-literatura-renascimento-e-camoes', 'renaissance-camoes'],
  ['summary-literatura-brasil-primeiros-registros', 'first-records'],
  ['summary-literatura-a-estetica-barroca', 'baroque'],
  ['summary-literatura-a-estetica-neoclassica', 'neoclassic'],
  ['summary-literatura-a-estetica-romantica-poesia', 'romantic-poetry'],
  ['summary-literatura-a-estetica-romantica-prosa', 'romantic-prose'],
  ['summary-literatura-a-estetica-realista', 'realism'],
  ['summary-literatura-naturalismo', 'naturalism'],
  ['summary-literatura-realismo-portugues-eca-de-queiros', 'eca-de-queiros'],
  ['summary-literatura-parnasianismo', 'parnassianism'],
  ['summary-literatura-simbolismo', 'symbolism'],
  ['summary-literatura-pre-modernismo', 'pre-modernism'],
  ['summary-literatura-machado-de-assis', 'machado-de-assis'],
  ['summary-literatura-vanguardas-artisticas', 'vanguards'],
  ['summary-literatura-semana-de-arte-moderna', 'modern-art-week'],
  ['summary-literatura-modernismo-no-brasil-primeira-geracao', 'modernism-first-generation'],
  ['summary-literatura-segunda-geracao-modernista-poesia', 'modernism-second-generation'],
  ['summary-literatura-segunda-geracao-modernista-prosa', 'modernism-second-prose'],
  ['summary-literatura-fernando-pessoa', 'fernando-pessoa'],
  ['summary-literatura-carlos-drummond-de-andrade', 'carlos-drummond'],
  ['summary-literatura-graciliano-ramos', 'graciliano-ramos'],
  ['summary-literatura-joao-cabral-de-melo-neto', 'joao-cabral'],
  ['summary-literatura-clarice-lispector', 'clarice-lispector'],
  ['summary-literatura-guimaraes-rosa', 'guimaraes-rosa'],
  ['summary-literatura-poesia-concreta', 'concrete-poetry'],
  ['summary-literatura-poesia-brasileira-1960-1980', 'poetry-1960-1980'],
  ['summary-literatura-prosa-brasileira-1960-1980', 'prose-1960-1980'],
].filter(([, operation]) => !process.env.CRIVO_AUDIT_ONLY || process.env.CRIVO_AUDIT_ONLY.split(',').includes(operation));
await fs.mkdir(path.join(output, 'capturas'), { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = process.env.CRIVO_AUDIT_RESUME === '1'
  ? JSON.parse(await fs.readFile(path.join(output, 'browser-evidence.json'), 'utf8')).filter(result => result.passed && result.inspector && (result.reducedMotion === 'reduce' || result.normalMotionObserved))
  : [];
try {
  for (const width of widths) for (const theme of ['light', 'dark']) for (const reducedMotion of motions) {
    if (phase === 'typography' && theme !== (width === 390 ? 'light' : 'dark')) continue;
    const context = await browser.newContext({ viewport: { width, height: width < 500 ? 1000 : 1112 }, colorScheme: theme, reducedMotion });
    await context.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true');
      localStorage.setItem('crivo_theme', theme);
      localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor: 'automatica', efeitos: 'completo', fundo: 'caderno', fundoRevisto: true }));
    }, theme);
    // Em sessões remotas o Chromium não confia na CA do proxy e as fontes caem
    // no fallback. O repasse pelo Node mantém a verificação TLS com a CA da
    // sessão; sem ele a geometria e a tipografia medidas não seriam as reais.
    if (process.env.CRIVO_AUDIT_FONT_RELAY === '1') await context.route(/fonts\.(googleapis|gstatic)\.com/, async route => route.fulfill({ response: await route.fetch() }));
    const page = await context.newPage();
    page.setDefaultTimeout(60_000);
    for (const [id, operation] of chapters) {
      if (results.some(result => result.id === id && result.width === width && result.theme === theme && result.reducedMotion === reducedMotion)) continue;
      const result = { id, operation, width, theme, reducedMotion, states: [], errors: [], consoleErrors: [], networkFailures: [], httpErrors: [], clippedText: [], textCollisions: [] };
      page.on('pageerror', error => result.errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') result.consoleErrors.push(message.text()); });
      page.on('requestfailed', request => { if (!request.failure()?.errorText.includes('ERR_ABORTED')) result.networkFailures.push({ url: request.url(), error: request.failure()?.errorText }); });
      page.on('response', response => { if (response.status() >= 400) result.httpErrors.push({ url: response.url(), status: response.status() }); });
      try {
        if (page.url() === 'about:blank') await page.goto(`${base}/visual?summary=${id}`, { waitUntil: 'load' });
        else await page.evaluate(url => { window.history.pushState(null, '', url); window.dispatchEvent(new PopStateEvent('popstate')); }, `/visual?summary=${id}`);
        const scene = page.locator(`[data-literature-operation="${operation}"]`);
        await expect(scene).toBeVisible({ timeout: 60_000 });
        await page.evaluate(() => document.fonts.ready);
        const controls = scene.locator('.lf-controls button');
        const drawings = new Set();
        const checkGeometry = async label => {
          const geometry = await scene.locator('svg').evaluate(svg => {
            const box = svg.getBoundingClientRect();
            const texts = Array.from(svg.querySelectorAll('text')).map(el => ({ text: el.textContent, rect: el.getBoundingClientRect() }));
            const clipped = texts.filter(({ rect }) => rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1).map(({ text }) => text);
            const collisions = [];
            for (let a = 0; a < texts.length; a++) for (let b = a + 1; b < texts.length; b++) {
              const x = texts[a].rect, y = texts[b].rect;
              if (Math.min(x.right, y.right) - Math.max(x.left, y.left) > 2 && Math.min(x.bottom, y.bottom) - Math.max(x.top, y.top) > 2) collisions.push([texts[a].text, texts[b].text]);
            }
            return { clipped, collisions };
          });
          result.clippedText.push(...geometry.clipped.map(text => ({ state: label, text })));
          result.textCollisions.push(...geometry.collisions.map(texts => ({ state: label, texts })));
        };
        for (let index = 0; index < await controls.count(); index++) {
          const label = await controls.nth(index).innerText();
          await controls.nth(index).click();
          await expect(controls.nth(index)).toHaveAttribute('aria-pressed', 'true');
          await expect(scene.locator('.lf-reading strong')).toHaveText(label);
          const beforeMotion = await scene.locator('svg').innerHTML();
          await page.waitForTimeout(reducedMotion === 'reduce' ? 60 : 650);
          const afterMotion = await scene.locator('svg').innerHTML();
          drawings.add(afterMotion);
          await checkGeometry(label);
          const noteFont = await scene.locator('svg > text:last-child').evaluate(el => ({ family: getComputedStyle(el).fontFamily, weight: getComputedStyle(el).fontWeight, size: getComputedStyle(el).fontSize }));
          if (phase === 'typography') expect(noteFont.family).toContain('Kalam');
          result.states.push({ label, conclusion: await scene.locator('.lf-conclusion').innerText(), motionObserved: beforeMotion !== afterMotion, noteFont });
        }
        expect(drawings.size).toBe(await controls.count());
        if (reducedMotion === 'no-preference') {
          result.normalMotionObserved = result.states.some(state => state.motionObserved);
          expect(result.normalMotionObserved).toBe(true);
        }
        for (const modifier of ['Começar pela devolução', 'Ler em ordem direta', 'Cortar acréscimo redundante']) {
          await controls.first().click();
          await page.waitForTimeout(reducedMotion === 'reduce' ? 60 : 650);
          const button = scene.getByRole('button', { name: modifier, exact: true });
          if (await button.count()) {
            const before = await scene.locator('svg').innerHTML();
            await button.focus();
            await page.keyboard.press('Enter');
            await expect(scene.locator('.lf-inline-control')).toHaveAttribute('aria-pressed', 'true');
            await page.waitForTimeout(reducedMotion === 'reduce' ? 60 : 650);
            await expect.poll(() => scene.locator('svg').innerHTML(), { timeout: 5000 }).not.toBe(before);
            await checkGeometry(modifier);
            result.modifier = modifier;
          }
        }
        const pan = scene.locator('.lf-drawing-window');
        await pan.focus();
        await page.keyboard.press('Home');
        const canScroll = await pan.evaluate(el => el.scrollWidth > el.clientWidth + 1);
        await page.keyboard.press('ArrowRight');
        if (canScroll) expect(await pan.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
        await page.keyboard.press('Home');
        expect(await pan.evaluate(el => el.scrollLeft)).toBe(0);
        await scene.getByRole('button', { name: 'Percorrer demonstração para a direita' }).click();
        if (canScroll) expect(await pan.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
        await scene.getByRole('button', { name: 'Percorrer demonstração para a esquerda' }).click();
        result.pan = { canScroll, passed: true };
        const axe = await new AxeBuilder({ page }).include('.lf-operation').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
        result.violations = axe.violations.map(({ id, impact, nodes }) => ({ id, impact, targets: nodes.map(node => node.target) }));
        result.incomplete = axe.incomplete.length;
        result.fonts = await page.evaluate(() => Array.from(document.fonts).map(font => ({ family: font.family, weight: font.weight, status: font.status })));
        if (phase === 'typography') expect(result.fonts.some(font => font.family === 'Kalam' && font.weight === '700' && font.status === 'loaded')).toBe(true);
        result.overflow = await page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - innerWidth);
        if ((width === 390 && theme === 'light' && reducedMotion === 'reduce') || (width === 1366 && theme === 'dark' && reducedMotion === 'no-preference')) {
          await controls.first().click();
          await page.waitForTimeout(450);
          result.screenshot = `capturas/${id}-${width}-${theme}.png`;
          // Captura de viewport real com a prancha abaixo do cabeçalho fixo.
          await scene.evaluate(el => {
            let parent = el.parentElement;
            while (parent && !(parent.scrollHeight > parent.clientHeight && /auto|scroll/.test(getComputedStyle(parent).overflowY))) parent = parent.parentElement;
            if (parent) parent.scrollTop += el.getBoundingClientRect().top - 110;
            else window.scrollBy(0, el.getBoundingClientRect().top - 110);
          });
          await page.screenshot({ path: path.join(output, result.screenshot) });
        }
        if (phase === 'full') {
        const cards = page.locator('.vs-concept-card');
        const concept = await cards.count() ? cards.first() : page.locator('.vs-chain-link').nth(1);
        await concept.click();
        await expect(page.getByRole('button', { name: 'Fechar inspetor', exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Fechar inspetor', exact: true }).click();
        result.inspector = true;
        await page.getByRole('tab', { name: 'Testar', exact: true }).click();
        await expect(page.getByRole('textbox', { name: 'Sua resposta', exact: true })).toBeVisible();
        await page.getByRole('textbox', { name: 'Sua resposta', exact: true }).fill('Resposta de teste local, sem conta autenticada.');
        await expect(page.getByRole('button', { name: 'Enviar para correção' })).toBeEnabled();
        await page.getByRole('button', { name: 'Enviar para correção' }).click();
        await expect(page.getByText('Primeiro elo ausente:', { exact: true })).toBeVisible();
        result.recallFeedback = true;
        await page.getByRole('tab', { name: 'Reconstruir', exact: true }).click();
        await expect(page.getByRole('heading', { name: 'Reconstrução ativa' })).toBeVisible();
        const choices = page.locator('.vs-gap').first().getByRole('button');
        if (await choices.count()) { await choices.first().focus(); await page.keyboard.press('Enter'); result.reconstructionKeyboard = true; }
        await page.getByRole('tab', { name: 'Explorar', exact: true }).click();
        await expect(scene).toBeVisible();
        }
        expect(result.overflow).toBeLessThanOrEqual(1);
        expect(result.clippedText).toEqual([]);
        expect(result.textCollisions).toEqual([]);
        expect(result.errors).toEqual([]);
        expect(result.consoleErrors).toEqual([]);
        expect(result.networkFailures).toEqual([]);
        expect(result.httpErrors).toEqual([]);
        expect(result.violations).toEqual([]);
        result.passed = true;
      } catch (error) { result.passed = false; result.failure = String(error); }
      results.push(result);
      await fs.writeFile(path.join(output, 'browser-evidence.json'), JSON.stringify(results, null, 2) + '\n');
      console.log(JSON.stringify({ id, width, theme, reducedMotion, passed: result.passed, failure: result.failure }));
      for (const event of ['pageerror', 'console', 'requestfailed', 'response']) page.removeAllListeners(event);
    }
    await context.close();
  }
} finally { await browser.close(); }
process.exitCode = results.every(result => result.passed) ? 0 : 1;
