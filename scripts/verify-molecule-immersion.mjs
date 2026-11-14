// Conferência da geometria molecular em Canvas 2D na rota de produção.
// CRIVO_URL=http://127.0.0.1:3003 node scripts/verify-molecule-immersion.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

const base = process.env.CRIVO_URL ?? 'http://localhost:3000';
const output = 'docs/visual/geometria-molecular-2026-11-14';
await fs.mkdir(output, { recursive: true });
const probeDir = process.env.CRIVO_UX_PROBES;
const coreProbe = probeDir ? await fs.readFile(`${probeDir}/ux-probe-core.js`, 'utf8') : null;
const focusProbe = probeDir ? await fs.readFile(`${probeDir}/ux-probe-focus.js`, 'utf8') : null;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
const scene = '.crivo-immersion';
const smoke = process.env.CRIVO_SMOKE === '1';
const profiles = smoke ? [['celular', 390, 844], ['desktop', 1366, 900]]
  : [['celular-360', 360, 800], ['celular', 390, 844], ['ipad', 834, 1112], ['desktop', 1366, 900]];
const modes = smoke ? [['claro', 'no-preference']]
  : [['claro', 'no-preference'], ['escuro', 'no-preference'], ['claro', 'reduce']];

try {
  for (const [name, width, height] of profiles) {
    for (const [tema, motion] of modes) {
      const context = await browser.newContext({ viewport: { width, height }, locale: 'pt-BR', reducedMotion: motion, hasTouch: width < 1024 });
      await context.addInitScript(dark => {
        localStorage.setItem('juju_onboarding', 'true');
        if (dark) localStorage.setItem('crivo_theme', 'dark');
        window.__molecularContexts = [];
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
          window.__molecularContexts.push(kind);
          return original.call(this, kind, ...args);
        };
      }, tema === 'escuro');
      const page = await context.newPage();
      const errors = [], network = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400 && !response.url().includes('/api/')) network.push(`${response.status()} ${response.url()}`); });
      await page.goto(`${base}/visual?summary=summary-quimica-geometria-molecular`);
      await page.waitForSelector(`${scene} .cr-canvas`, { timeout: 60_000 });
      await page.evaluate(async () => { await document.fonts.ready; });
      await page.waitForTimeout(500);
      const top = await page.locator(scene).evaluate(el => Math.round(el.getBoundingClientRect().top + scrollY));
      await page.evaluate(y => scrollTo(0, y - 64), top);
      const steps = page.locator(`${scene} .cr-step`);
      const canvas = page.locator(`${scene} .cr-canvas`);
      const pause = page.locator(`${scene} .cr-motion`).first();
      if (motion !== 'reduce') await pause.click();
      else await expect(pause).toBeDisabled();

      const collisions = () => page.evaluate(selector => {
        const pick = name => [...document.querySelectorAll(`${selector} ${name}`)].filter(node => node.getClientRects().length && getComputedStyle(node).display !== 'none');
        const groups = { ferramenta: pick('.cr-tool'), etiqueta: pick('.cr-label'), titulo: pick('h2'), leitura: pick('.cr-temp'), texto: pick('.cr-bottom .cr-copy'), previsao: pick('.cr-predict') };
        const names = Object.keys(groups), found = [];
        for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
          for (const a of groups[names[i]]) for (const b of groups[names[j]]) {
            const p = a.getBoundingClientRect(), q = b.getBoundingClientRect();
            const w = Math.min(p.right, q.right) - Math.max(p.left, q.left), h = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
            if (w > 2 && h > 2) found.push(`${names[i]}×${names[j]}`);
          }
        }
        return [...new Set(found)];
      }, scene);
      const frame = () => canvas.evaluate(el => el.toDataURL());
      const readings = [], frames = new Set(), overlaps = [];
      for (let index = 0; index < 5; index++) {
        await steps.nth(index).click();
        await page.waitForTimeout(250);
        readings.push(await page.locator(`${scene} .cr-temp-number`).innerText());
        frames.add(await frame());
        overlaps.push(...(await collisions()).map(item => `etapa ${index + 1}: ${item}`));
        if (motion === 'no-preference' && [0, 2, 4].includes(index)) {
          await page.locator(scene).screenshot({ path: `${output}/${name}-${tema}-etapa-${index + 1}.png` });
        }
      }
      assert.deepEqual(readings, ['180°', '120°', '109,5°', '107°', '104,5°']);
      // Fundo e câmera estão congelados: quadros distintos provam que a cena
      // muda com o conteúdo, não com o ruído de partículas ou uma captura vazia.
      assert.equal(frames.size, 5, `${name} ${tema}: cinco geometrias desenhadas`);
      await page.getByRole('button', { name: 'CO₂, linear' }).click();
      await page.waitForTimeout(250);
      await expect(page.locator(`${scene} .cr-temp-number`)).toHaveText('μ = 0');
      assert.notEqual(await frame(), [...frames].at(-1), 'a comparação muda o desenho da água para CO₂');
      overlaps.push(...(await collisions()).map(item => `CO₂: ${item}`));
      if (motion === 'no-preference') await page.locator(scene).screenshot({ path: `${output}/${name}-${tema}-co2.png` });

      const before = await frame();
      await page.waitForTimeout(350);
      const staticFrame = before === await frame();
      assert.ok(staticFrame, `${name} ${tema}: pausa/movimento reduzido congela o quadro`);
      await page.locator(`${scene} .cr-label`).click();
      await expect(page.locator(`${scene} .cr-detail`)).toBeVisible();
      await page.waitForTimeout(200);
      overlaps.push(...(await collisions()).map(item => `inspeção: ${item}`));

      await steps.nth(2).click();
      await page.waitForTimeout(200);
      const beforeTurn = await frame();
      await page.getByRole('button', { name: 'Girar molécula' }).click();
      await page.waitForTimeout(200);
      assert.notEqual(await frame(), beforeTurn, 'botão de girar muda a câmera');
      const beforeZoom = await frame();
      const zoom = page.locator(`${scene} .cr-tools button`).nth(1);
      await zoom.click();
      await page.waitForTimeout(200);
      assert.notEqual(await frame(), beforeZoom, 'aproximação muda a câmera');
      const beforeDrag = await frame();
      await canvas.scrollIntoViewIfNeeded();
      const freePoint = await canvas.evaluate(el => {
        const r = el.getBoundingClientRect();
        for (const dy of [200, 280, 340, 120]) for (const dx of [.4, .6, .75]) {
          const x = r.x + r.width * dx, y = r.y + dy;
          if (y > 70 && y < innerHeight - 90 && document.elementFromPoint(x, y) === el) return { x, y };
        }
        return null;
      });
      assert.ok(freePoint, 'há uma área do canvas alcançável para arraste');
      const { x: dragX, y: dragY } = freePoint;
      await page.mouse.move(dragX, dragY); await page.mouse.down();
      await page.mouse.move(dragX + 45, dragY + 12, { steps: 5 }); await page.mouse.up();
      await page.waitForTimeout(200);
      assert.notEqual(await frame(), beforeDrag, 'arrastar gira a câmera');

      await page.getByRole('button', { name: 'Abre', exact: true }).click();
      await expect(page.locator(`${scene} .cr-feedback`)).toContainText('empurra as ligações');
      await page.waitForTimeout(150);
      overlaps.push(...(await collisions()).map(item => `previsão incorreta: ${item}`));
      assert.deepEqual(overlaps, [], `${name} ${tema}: sobreposições`);

      await page.evaluate(y => scrollTo(0, y - 64), top);
      await page.locator(`${scene} .cr-eyebrow`).click({ force: true });
      let focus;
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab');
        const data = await page.evaluate(() => {
          const el = document.activeElement, css = getComputedStyle(el);
          return { label: el.getAttribute('aria-label'), outline: `${css.outlineStyle} ${css.outlineWidth}`, visible: el.matches(':focus-visible') };
        });
        if (data.label === 'Girar molécula') { focus = data; break; }
      }
      assert.ok(focus?.visible && !focus.outline.startsWith('none'), 'foco visível alcança a câmera pelo teclado');
      const ux = coreProbe ? { core: JSON.parse(await page.evaluate(coreProbe)), focus: JSON.parse(await page.evaluate(focusProbe)) } : null;
      const measures = await page.evaluate(selector => ({
        tinta: document.querySelector(selector).dataset.tema,
        estouro: document.documentElement.scrollWidth - innerWidth,
        ferramentas: [...document.querySelectorAll(`${selector} .cr-tool`)].map(el => { const r = el.getBoundingClientRect(); return [r.width, r.height]; }),
        contextos: [...new Set(window.__molecularContexts)],
        canvases: document.querySelectorAll(`${selector} canvas`).length,
        fontes: [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family),
      }), scene);
      assert.equal(measures.tinta, tema === 'escuro' ? 'noite' : 'caderno');
      assert.equal(measures.estouro, 0);
      assert.equal(measures.canvases, 1);
      assert.deepEqual(measures.contextos, ['2d'], 'somente Canvas 2D, sem contexto WebGL');
      assert.ok(measures.ferramentas.every(([w,h]) => w >= 44 && h >= 44));

      await page.locator(scene).evaluate(el => el.scrollIntoView({ block: 'end' }));
      await page.waitForTimeout(100);
      const controls = await page.locator(`${scene} .cr-rail button, ${scene} .cr-foot button`).evaluateAll(nodes => nodes.map(el => {
        const r = el.getBoundingClientRect();
        return { text: el.textContent.trim(), reachable: el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)) };
      }));
      assert.ok(controls.every(item => item.reachable), `trilho e rodapé alcançáveis: ${JSON.stringify(controls)}`);

      await steps.nth(4).click();
      // A integração das imersivas segue a PCR: continuar na leitura abre
      // o VisualJourney, cuja última etapa leva ao desafio do capítulo.
      await page.getByRole('button', { name: 'Continuar na leitura', exact: true }).click();
      const reading = page.locator('#visual-chapter-reading');
      await reading.getByRole('navigation', { name: 'Etapas do capítulo' }).getByRole('button').last().click();
      await reading.getByRole('button', { name: /Testar o que aprendi/ }).click();
      await expect(page.getByRole('tab', { name: 'Testar', exact: true })).toHaveAttribute('aria-selected', 'true');
      assert.deepEqual(errors, [], `${name} ${tema}: erros de execução`);
      assert.deepEqual(network, [], `${name} ${tema}: erros de rede`);
      results.push({ largura: `${name} ${width}×${height}`, tema, movimento: motion, leituras: readings, quadrosDistintos: frames.size, quadroParado: staticFrame, sobreposicoes: overlaps, foco: focus, controles: controls, ...measures, ux });
      console.log(name, tema, motion, 'Canvas 2D, cinco geometrias, câmera, previsão, foco e Testar conferidos.');
      await context.close();
    }
  }
} finally { await browser.close(); }
await fs.writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 2) + '\n');
console.log(`Geometria molecular: ${results.length} combinações de largura, tema e movimento conferidas.`);
