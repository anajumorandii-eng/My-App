const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const inventory = require('../expansao-3d-2026-10-10/structure.json').chapters_by_id;
const ids = require('./capitulos.json').chapters.map(row => row.id);
const chapters = inventory.filter(row => ids.includes(row.id));
assert.equal(chapters.length, 20);
const root = 'C:/crivo-audit-evidence-20261010/lote-20';
fs.mkdirSync(root, { recursive: true });
const records = fs.existsSync(path.join(root, 'result.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'result.json'), 'utf8')).filter(record => record.passed) : [];
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const width of [360, 834, 1440]) for (const theme of ['light', 'dark']) for (const motion of ['reduce', 'no-preference']) {
    const context = await browser.newContext({ viewport: { width, height: 1100 }, reducedMotion: motion, hasTouch: width < 900 });
    await context.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true'); localStorage.setItem('crivo_theme', theme);
      localStorage.setItem('crivo_visual_preferencias', JSON.stringify({ fundo: 'caderno', cor: 'automatica', efeitos: 'minimo', fundoRevisto: true }));
    }, theme);
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const chapter of chapters) {
      if (records.some(record => record.id === chapter.id && record.width === width && record.theme === theme && record.motion === motion)) continue;
      const record = { id: chapter.id, topic: chapter.topic, width, theme, motion, errors: [] }; errors.length = 0;
      try {
        await page.goto('http://127.0.0.1:3008/visual?summary=' + chapter.id);
        const frame = page.locator(`[data-chapter-scene="${chapter.id}"]`);
        await frame.locator('.vs-chapter-scene-body section').first().waitFor({ timeout: 60000 });
        await frame.getByRole('button', { name: 'Explorar em foco', exact: true }).click();
        for (const label of ['Explorar modelo 3D']) {
          const button = frame.getByRole('button', { name: label, exact: true });
          if (await button.count()) await button.click();
        }
        const drawing = frame.locator('.vs-spatial-lab .vs-science-object[tabindex]').filter({ visible: true }).first();
        await drawing.waitFor({ timeout: 20000 });
        await drawing.evaluate(svg => svg.scrollIntoView({ block: 'center' }));
        const view = async () => drawing.evaluate(svg => ({ yaw: svg.getAttribute('data-view-yaw'), pitch: svg.getAttribute('data-view-pitch'), label: svg.getAttribute('aria-label'), content: svg.innerHTML }));
        const initial = await view();
        await drawing.focus(); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowUp');
        const keyboard = await view();
        assert.notEqual(keyboard.content, initial.content); record.keyboard = true;
        await page.keyboard.press('Home'); const reset = await view(); assert.equal(reset.content, initial.content); record.reset = true;
        const box = await drawing.boundingBox();
        await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5); await page.mouse.down();
        await page.mouse.move(box.x + box.width * .7, box.y + box.height * .6, { steps: 8 }); await page.mouse.up();
        const drag = await view(); assert.notEqual(drag.content, initial.content); record.drag = true;
        await drawing.focus(); await page.keyboard.press('Home');
        if (width < 900) {
          await drawing.evaluate(svg => svg.scrollIntoView({ block: 'center' })); const touchBox = await drawing.boundingBox();
          const cdp = await context.newCDPSession(page);
          const x = touchBox.x + touchBox.width * .5, y = touchBox.y + touchBox.height * .5;
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + 35, y: y + 20 }] });
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
          const touch = await view(); assert.notEqual(touch.content, initial.content); record.touch = true;
          await cdp.detach(); await drawing.focus(); await page.keyboard.press('Home');
        }
        const lab = frame.locator('.vs-spatial-lab');
        const nativeParameter = frame.locator('.vs-plane-controls input[type=range]').first();
        if (chapter.subject === 'Física' && await nativeParameter.count()) {
          await nativeParameter.focus(); await page.keyboard.press('End');
          const maximum = await lab.getByRole('status', { name: 'Leitura do modelo espacial' }).textContent();
          await page.keyboard.press('Home');
          assert.notEqual(await lab.getByRole('status', { name: 'Leitura do modelo espacial' }).textContent(), maximum);
          record.nativeParameter = true;
        }
        const choices = lab.getByRole('group', { name: 'Exemplo molecular' });
        if (await choices.count()) {
          const buttons = choices.getByRole('button'); record.examples = [];
          for (let i=0; i<await buttons.count(); i++) {
            await buttons.nth(i).click();
            assert.equal(await buttons.nth(i).getAttribute('aria-pressed'), 'true');
            record.examples.push(await buttons.nth(i).textContent());
            assert.equal(await drawing.getAttribute('data-view-yaw'), initial.yaw);
          }
        }
        const timeline = lab.locator('.mechanism-time input[type=range]');
        if (await timeline.count()) { await timeline.focus(); await page.keyboard.press('End'); record.timeline = true; }
        const separation = lab.getByRole('slider', { name: 'Separação entre moléculas' });
        if (await separation.count()) { await separation.focus(); await page.keyboard.press('End'); record.separation = true; }
        const card = drawing.locator('xpath=..');
        const play = lab.getByRole('button', { name: 'Reproduzir movimento', exact: true }).first();
        if (await play.count()) {
          await play.click();
          if (motion === 'reduce') {
            assert.equal(await lab.getByRole('button', { name: 'Pausar movimento', exact: true }).count(), 0);
            record.reducedPlayback = true;
          } else {
            const pause = lab.getByRole('button', { name: 'Pausar movimento', exact: true }).first();
            await pause.click(); record.pause = true;
          }
        }
        await drawing.evaluate(svg => svg.scrollIntoView({ block: 'center' }));
        record.metrics = await frame.evaluate(element => ({
          overflow: document.documentElement.scrollWidth > innerWidth,
          shortControls: [...element.querySelectorAll('button,input[type=range],select')].filter(el => { const box = el.getBoundingClientRect(); return box.width > 0 && box.height > 0 && box.height < 43.9; }).map(el => ({ label: el.textContent || el.getAttribute('aria-label') || el.type, height: el.getBoundingClientRect().height })),
          loops: matchMedia('(prefers-reduced-motion: reduce)').matches ? element.getAnimations({ subtree: true }).filter(a => a.playState === 'running' && a.effect?.getTiming().iterations === Infinity).length : 0,
          duplicates: [...element.querySelectorAll('svg [id]')].map(el => el.id).filter((id, i, ids) => ids.indexOf(id) !== i),
        }));
        assert.equal(record.metrics.overflow, false); assert.equal(record.metrics.shortControls.length, 0); assert.equal(record.metrics.loops, 0); assert.equal(record.metrics.duplicates.length, 0);
        record.screenshot = path.join(root, `${width}-${theme}-${motion}-${chapter.id}.jpg`);
        await page.screenshot({ path: record.screenshot, type: 'jpeg', quality: 80 });
        record.errors = [...errors]; assert.equal(errors.length, 0); record.passed = true;
      } catch (error) { record.error = error.message.slice(0,1800); record.errors = [...errors]; record.passed = false; }
      records.push(record); fs.writeFileSync(path.join(root, 'result.json'), JSON.stringify(records, null, 2));
      console.log(JSON.stringify({ ...record, screenshot: undefined }));
    }
    await context.close();
  }
  await browser.close();
  const summary = { expected: chapters.length * 12, actual: records.length, passed: records.filter(r => r.passed).length, failures: records.filter(r => !r.passed) };
  fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify(summary, null, 2)); console.log(JSON.stringify(summary));
  if (summary.failures.length || summary.actual !== summary.expected) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
