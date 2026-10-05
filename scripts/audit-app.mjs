import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Apenas estados públicos/demonstração: não autentica nem envia respostas.
const routes = ['/', '/diagnostico', '/plano', '/agenda', '/reta-final', '/recuperacao', '/sessao', '/questoes', '/revisoes', '/flashcards', '/treino-2a-fase', '/redacao', '/erros', '/resumos', '/visual', '/podcast', '/tutor', '/laboratorio', '/estrategias', '/evolucao', '/prioridades', '/obras', '/obras-obrigatorias', '/conexoes', '/perfil', '/admin', '/admin/obras', '/admin/conteudo'];
const output = process.env.CRIVO_AUDIT_OUTPUT || 'tests/e2e/.artifacts/audit-app';
const widths = (process.env.CRIVO_AUDIT_WIDTHS || '390,1366').split(',').map(Number);
const selectedRoutes = process.env.CRIVO_AUDIT_ROUTES?.split(',') || routes;
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
await fs.mkdir(output, { recursive: true });
try {
  for (const theme of ['light', 'dark']) {
    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', colorScheme: theme });
      await context.addInitScript((theme) => {
        localStorage.setItem('juju_onboarding', 'true');
        localStorage.setItem('crivo_theme', theme);
        localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ cor: 'automatica', efeitos: 'minimo', fundo: 'caderno', fundoRevisto: true }));
      }, theme);
      const page = await context.newPage();
      for (const route of selectedRoutes) {
        const errors = [], failedRequests = [], httpErrors = [];
        const onError = error => errors.push(error.message);
        const onRequest = request => failedRequests.push({ url: request.url().split('?')[0], error: request.failure()?.errorText });
        const onResponse = response => { if (response.status() >= 400) httpErrors.push({ url: response.url().split('?')[0], status: response.status() }); };
        page.on('pageerror', onError);
        page.on('requestfailed', onRequest);
        page.on('response', onResponse);
        let result = { route, theme, width, errors, failedRequests, httpErrors };
        try {
          const start = Date.now();
          await page.goto(`${process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3000'}${route}`, { waitUntil: 'domcontentloaded' });
          await page.waitForFunction(() => {
            const main = document.querySelector('.ni-production-main');
            return (main?.textContent?.trim().length || 0) > 30 && !main?.querySelector('[aria-busy="true"]');
          });
          // Rotas com cronômetro/polling não ficam ociosas na rede. Esperamos
          // conteúdo e fontes, sem confundir polling com falha de navegação.
          await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2000))]));
          result.openMs = Date.now() - start;
          result.geometry = await page.evaluate(() => ({ documentWidth: document.documentElement.scrollWidth, viewport: innerWidth, mainTextLength: document.querySelector('.ni-production-main')?.textContent?.trim().length || 0, errorBoundary: !!document.querySelector('[role="alert"]')?.textContent?.includes('Algo deu errado') }));
          const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
          result.violations = axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({ target: n.target, html: n.html, summary: n.failureSummary })) }));
          result.incompleteContrast = axe.incomplete.filter(v => v.id === 'color-contrast').reduce((sum, v) => sum + v.nodes.length, 0);
          if (result.violations.length || errors.length || result.geometry.documentWidth > width + 1 || ['/', '/agenda', '/recuperacao', '/erros', '/visual'].includes(route)) {
            const filename = `${route === '/' ? 'hoje' : route.slice(1).replaceAll('/', '-')}-${theme}-${width}.png`;
            await page.screenshot({ path: path.join(output, filename), fullPage: true });
            result.screenshot = filename;
          }
        } catch (error) { result.failure = String(error); }
        results.push(result);
        await fs.writeFile(path.join(output, 'results.json'), JSON.stringify(results, null, 2) + '\n');
        console.log(JSON.stringify({ route, theme, width, violations: result.violations?.reduce((n, v) => n + v.nodes.length, 0), errors: errors.length, overflow: result.geometry ? result.geometry.documentWidth - width : undefined, failure: result.failure }));
        page.off('pageerror', onError);
        page.off('requestfailed', onRequest);
        page.off('response', onResponse);
      }
      await context.close();
    }
  }
} finally { await browser.close(); }
const failed = results.filter(r => r.failure || r.errors.length || r.geometry?.errorBoundary || r.geometry?.documentWidth > r.width + 1 || r.violations?.length);
console.log(`${results.length} configurações; ${failed.length} com achados. Evidências: ${output}`);
process.exitCode = failed.length ? 1 : 0;
