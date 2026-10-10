/** Execute da raiz do checkout, com npm run dev ativo. Não usa dados reais da estudante. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const chapters = require('../../docs/inspecao-visual-613-2026-10-09/inventario-base.json').filter(chapter => ["summary-fisica-o-movimento-circular", "summary-fisica-as-leis-de-newton", "summary-fisica-dinamica-do-movimento-circular", "summary-fisica-trabalho-e-energia-trabalho-de-uma-forca", "summary-fisica-hidrostatica-densidade-e-pressao", "summary-fisica-trabalho-da-forca-de-pressao-do-gas", "summary-fisica-campo-eletrico", "summary-fisica-capacitores"].includes(chapter.id));
const models = require('../../src/views/visual-boards/chapterIconModels.json');
const root = path.resolve(process.env.CRIVO_VISUAL_AUDIT_DIR || 'work/inspecao-613');
const baseUrl = process.env.CRIVO_VISUAL_URL || 'http://localhost:3000';
const stage = process.argv[2] || 'depois';
fs.mkdirSync(path.join(root, stage), { recursive: true });

async function contextFor(browser, theme) {
  const context = await browser.newContext({ viewport: { width: Number(process.env.CRIVO_AUDIT_WIDTH), height: 1100 }, reducedMotion: process.env.CRIVO_AUDIT_MOTION });
  await context.addInitScript(t => {
    localStorage.setItem('juju_onboarding', 'true');
    localStorage.setItem('crivo_theme', t);
    localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ fundo: 'caderno', cor: 'automatica', efeitos: 'minimo', fundoRevisto: true }));
  }, theme);
  return context;
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/google-chrome', args: ['--no-sandbox'] });
  const records = [];
  await Promise.all([process.env.CRIVO_AUDIT_THEME].map(async theme => {
    let context = await contextFor(browser, theme);
    let page = await context.newPage();
    let first = true;
    let errors = [];
    const observe = () => page.on('pageerror', e => errors.push(e.message));
    observe();
    for (const [index, chapter] of chapters.entries()) {
      const record = { ...chapter, index, theme, width: Number(process.env.CRIVO_AUDIT_WIDTH), motion: process.env.CRIVO_AUDIT_MOTION, source_commit: process.env.CRIVO_AUDIT_SHA };
      try {
        // Reinicia periodicamente o contexto para limitar o custo do lote longo.
        if (index > 0 && index % 80 === 0) {
          await context.close();
          context = await contextFor(browser, theme);
          page = await context.newPage();
          first = true;
          errors = [];
          observe();
        }
        if (first) { await page.goto(baseUrl + '/visual?summary=' + chapter.id); first = false; }
        else await page.evaluate(id => {
          history.pushState({}, '', '/visual?summary=' + id);
          dispatchEvent(new PopStateEvent('popstate'));
        }, chapter.id);
        const frame = page.locator('[data-chapter-scene="' + chapter.id + '"]');
        // O ícone do cabeçalho não comprova que o artefato nativo carregou.
        await frame.locator('.vs-chapter-scene-body section').first().waitFor({ timeout: 60000 });
        await frame.getByRole('button', { name: 'Explorar em foco', exact: true }).click();
        await page.waitForFunction(id => document.querySelector('[data-chapter-scene="' + id + '"]')?.getAttribute('role') === 'dialog', chapter.id);
        await page.evaluate(async () => { await document.fonts.ready; });
        record.icon = await frame.locator('.vs-chapter-object').getAttribute('data-study-object');
        record.metrics = await frame.evaluate(element => ({
          pageOverflow: document.documentElement.scrollWidth > innerWidth,
          svg: (() => {
            const nodes = [...element.querySelectorAll('svg [id],svg[id]')];
            const ids = nodes.map(node => node.id);
            const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
            const missing = [];
            for (const svg of element.querySelectorAll('svg')) {
              for (const node of [svg,...svg.querySelectorAll('*')]) {
                for (const attr of node.attributes) {
                  for (const hit of attr.value.matchAll(/url\(\s*['"]?#([^)'"]+)['"]?\s*\)/g)) {
                    if (!document.getElementById(hit[1])) missing.push(hit[1]);
                  }
                  if ((attr.name === 'href' || attr.name === 'xlink:href') && attr.value.startsWith('#') && !document.getElementById(attr.value.slice(1))) missing.push(attr.value);
                }
              }
            }
            return { duplicates: [...new Set(duplicates)], missing: [...new Set(missing)] };
          })(),
          reducedMotionLoops: matchMedia('(prefers-reduced-motion: reduce)').matches
            ? element.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running' && animation.effect?.getTiming().iterations === Infinity).length : 0,
          headerSize: getComputedStyle(element.querySelector('.vs-chapter-scene-tools strong')).fontSize,
          shortControls: [...element.querySelectorAll('button,input[type=range],select,summary,.vs-solid-formas label')].filter(control => {
            const box = control.getBoundingClientRect();
            return box.width > 0 && box.height > 0 && box.height < 43.9;
          }).map(control => ({ label: (control.textContent || control.getAttribute('aria-label') || control.type).slice(0,65), height: control.getBoundingClientRect().height })),
        }));
        await page.screenshot({ type: 'jpeg', quality: 70, path: path.join(root, stage, String(index).padStart(3,'0') + '-' + theme + '.jpg') });
        await page.keyboard.press('Escape');
        const choices = frame.locator('.vs-chapter-scene-body button[aria-pressed],.vs-chapter-scene-body button[aria-selected]').filter({ visible: true });
        record.choices = await choices.count();
        if (record.choices > 1) {
          await choices.nth(1).focus();
          await page.keyboard.press('Enter');
          record.choiceState = await choices.nth(1).getAttribute('aria-pressed') || await choices.nth(1).getAttribute('aria-selected');
        }
        const range = frame.locator('input[type=range]').filter({ visible: true }).first();
        record.slider = await range.count() > 0;
        if (record.slider) {
          await range.focus(); await page.keyboard.press('End'); record.sliderMax = await range.inputValue();
          await page.keyboard.press('Home'); record.sliderMin = await range.inputValue();
        }
        const snapshot = async () => frame.locator('.vs-chapter-scene-body').evaluate(element => ({
          inputs: [...element.querySelectorAll('input,select,textarea')].map(control => ({ type: control.type, value: control.value, checked: control.checked })),
          choices: [...element.querySelectorAll('button[aria-pressed],button[aria-selected]')].map(control => ({ label: control.textContent, pressed: control.getAttribute('aria-pressed'), selected: control.getAttribute('aria-selected') }))
        }));
        const stateBefore = await snapshot();
        const comparison = frame.getByRole('button', { name: 'Comparar painéis', exact: true });
        await comparison.focus(); await page.keyboard.press('Enter');
        await page.waitForFunction(id => document.querySelector('[data-chapter-scene="' + id + '"]')?.classList.contains('vs-chapter-scene--comparison'), chapter.id);
        record.comparisonPreservesControls = JSON.stringify(stateBefore) === JSON.stringify(await snapshot());
        await comparison.focus(); await page.keyboard.press('Enter');
        const concepts = frame.locator('.hu-concepts');
        await concepts.locator('summary').focus(); await page.keyboard.press('Enter');
        await concepts.locator('button').nth(1).focus(); await page.keyboard.press('Enter');
        const closeInspector = page.getByRole('button', { name: 'Fechar inspetor', exact: true });
        await closeInspector.waitFor();
        record.conceptKeyboardSelection = await closeInspector.evaluate(element => {
          for (let node = element; node; node = node.parentElement) if (node.inert) return false;
          return true;
        });
        await closeInspector.click();
        await page.getByRole('tab', { name: 'Testar', exact: true }).click();
        record.testHidesArtifact = await page.locator('[data-chapter-scene]').count() === 0;
        await page.getByRole('tab', { name: 'Reconstruir', exact: true }).click();
        await frame.waitFor();
        record.rebuildHidesConcepts = await frame.locator('.hu-concepts').count() === 0;
        record.errors = errors.splice(0);
        record.passed = record.comparisonPreservesControls && record.conceptKeyboardSelection && !record.metrics.svg.duplicates.length && !record.metrics.svg.missing.length && record.metrics.reducedMotionLoops === 0 && record.icon === models[chapter.id].model && !record.errors.length && !record.metrics.pageOverflow && !record.metrics.shortControls.length && record.testHidesArtifact && record.rebuildHidesConcepts && (record.choices < 2 || record.choiceState === 'true');
      } catch (error) {
        record.passed = false;
        record.error = error.message;
        // Uma aba que sofreu crash não pode ser reaproveitada para os próximos IDs.
        await context.close();
        context = await contextFor(browser, theme);
        page = await context.newPage();
        first = true;
        errors = [];
        observe();
      }
      records.push(record);
      console.log('CRIVO_AUDIT_ROW ' + JSON.stringify(record));
      fs.writeFileSync(path.join(root, stage + '-progress.json'), JSON.stringify(records, null, 2));
      if (index % 40 === 0) console.log(theme + ' ' + index + '/' + chapters.length);
    }
    await context.close();
  }));
  await browser.close();
  records.sort((a,b) => a.index - b.index || a.theme.localeCompare(b.theme));
  fs.writeFileSync(path.join(root, stage + '-result.json'), JSON.stringify(records, null, 2));
  const failures = records.filter(record => !record.passed);
  console.log(records.length + ' registros; ' + failures.length + ' falhas');
  const complete = chapters.length === 8 && records.length === 8 && new Set(records.map(record => record.id)).size === 8;
  const summary = { source_commit: process.env.CRIVO_AUDIT_SHA, run_id: process.env.GITHUB_RUN_ID, width: Number(process.env.CRIVO_AUDIT_WIDTH), theme: process.env.CRIVO_AUDIT_THEME, motion: process.env.CRIVO_AUDIT_MOTION, expected: 8, actual: records.length, unique_ids: new Set(records.map(record => record.id)).size, complete, passed: records.filter(record => record.passed).length, failures: failures.map(record => ({ id: record.id, error: record.error, metrics: record.metrics })) };
  fs.writeFileSync(path.join(root, stage + '-summary.json'), JSON.stringify(summary, null, 2));
  console.log('CRIVO_AUDIT_SUMMARY ' + JSON.stringify(summary));
  if (failures.length || !complete) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
