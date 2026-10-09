/** Execute da raiz do checkout, com npm run dev ativo. Não usa dados reais da estudante. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const chapters = require('./inventario-base.json');
const models = require('../../src/views/visual-boards/chapterIconModels.json');
const root = path.resolve(process.env.CRIVO_VISUAL_AUDIT_DIR || 'work/inspecao-613');
const baseUrl = process.env.CRIVO_VISUAL_URL || 'http://localhost:3000';
const stage = process.argv[2] || 'depois';
fs.mkdirSync(path.join(root, stage), { recursive: true });

async function contextFor(browser, theme) {
  const context = await browser.newContext({ viewport: { width: theme === 'light' ? 1440 : 360, height: 1100 }, reducedMotion: 'reduce' });
  await context.addInitScript(t => {
    localStorage.setItem('juju_onboarding', 'true');
    localStorage.setItem('crivo_theme', t);
    localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ fundo: 'caderno', cor: 'automatica', efeitos: 'minimo', fundoRevisto: true }));
  }, theme);
  return context;
}

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
  const records = [];
  await Promise.all(['light', 'dark'].map(async theme => {
    let context = await contextFor(browser, theme);
    let page = await context.newPage();
    let first = true;
    let errors = [];
    const observe = () => page.on('pageerror', e => errors.push(e.message));
    observe();
    for (const [index, chapter] of chapters.entries()) {
      const record = { ...chapter, index, theme, width: theme === 'light' ? 1440 : 360 };
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
          headerSize: getComputedStyle(element.querySelector('.vs-chapter-scene-tools strong')).fontSize,
          shortControls: [...element.querySelectorAll('button,input[type=range],select,summary,.vs-solid-formas label')].filter(control => {
            const box = control.getBoundingClientRect();
            return box.width > 0 && box.height > 0 && box.height < 40;
          }).map(control => ({ label: (control.textContent || control.getAttribute('aria-label') || control.type).slice(0,65), height: control.getBoundingClientRect().height })),
        }));
        await page.screenshot({ path: path.join(root, stage, String(index).padStart(3,'0') + '-' + theme + '.png') });
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
        await page.getByRole('tab', { name: 'Testar', exact: true }).click();
        record.testHidesArtifact = await page.locator('[data-chapter-scene]').count() === 0;
        await page.getByRole('tab', { name: 'Reconstruir', exact: true }).click();
        await frame.waitFor();
        record.rebuildHidesConcepts = await frame.locator('.hu-concepts').count() === 0;
        record.errors = errors.splice(0);
        record.passed = record.icon === models[chapter.id].model && !record.errors.length && !record.metrics.pageOverflow && !record.metrics.shortControls.length && record.testHidesArtifact && record.rebuildHidesConcepts && (record.choices < 2 || record.choiceState === 'true');
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
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
