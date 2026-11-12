// Conferência da cena imersiva da lei de Lenz no navegador, pedida pela regra
// de entrega de docs/visual/PADRAO-VISUAL-OBRIGATORIO.md. Grava capturas e
// medidas em docs/visual/lenz-2026-11-12/.
//
//   CRIVO_URL=http://127.0.0.1:3003 node scripts/verify-lenz-immersion.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.CRIVO_URL ?? 'http://localhost:3000';
const output = 'docs/visual/lenz-2026-11-12';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
const cena = '.crivo-immersion';

try {
  for (const [name, width, height] of [['celular', 390, 844], ['ipad', 834, 1112], ['desktop', 1366, 900]]) {
    for (const [tema, motion] of [['claro', 'no-preference'], ['escuro', 'no-preference'], ['claro', 'reduce']]) {
      const context = await browser.newContext({ viewport: { width, height }, locale: 'pt-BR', reducedMotion: motion });
      await context.addInitScript(dark => {
        localStorage.setItem('juju_onboarding', 'true');
        if (dark) localStorage.setItem('crivo_theme', 'dark');
      }, tema === 'escuro');
      const page = await context.newPage();
      const errors = [], network = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('response', response => { if (response.status() >= 400 && !response.url().includes('/api/')) network.push(`${response.status()} ${response.url()}`); });
      await page.goto(`${base}/visual?summary=summary-fisica-inducao-eletromagnetica-lei-de-lenz`);
      await page.waitForSelector(`${cena} canvas`, { timeout: 60_000 });
      await page.waitForTimeout(1500);
      const top = await page.evaluate(selector => Math.round(document.querySelector(selector).getBoundingClientRect().top + scrollY), cena);
      await page.evaluate(y => scrollTo(0, y - 64), top);

      // Sobreposição entre as peças que ficam por cima do canvas.
      const colisoes = () => page.evaluate(selector => {
        const pick = name => [...document.querySelectorAll(`${selector} ${name}`)].filter(node => node.getClientRects().length && getComputedStyle(node).display !== 'none');
        const groups = { ferramenta: pick('.cr-tool'), etiqueta: pick('.cr-label'), titulo: pick('h2'), leitura: pick('.cr-temp-number'), texto: pick('.cr-bottom .cr-copy'), previsao: pick('.cr-predict') };
        const found = [];
        const names = Object.keys(groups);
        for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) {
          for (const a of groups[names[i]]) for (const b of groups[names[j]]) {
            const p = a.getBoundingClientRect(), q = b.getBoundingClientRect();
            const w = Math.min(p.right, q.right) - Math.max(p.left, q.left), h = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
            if (w > 2 && h > 2) found.push(`${names[i]}×${names[j]}`);
          }
        }
        return [...new Set(found)];
      }, cena);

      const leituras = [], sobreposicoes = new Set();
      const etapas = page.locator(`${cena} .cr-step`);
      for (let index = 0; index < 5; index++) {
        await etapas.nth(index).click();
        await page.waitForTimeout(motion === 'reduce' ? 350 : 1900);
        leituras.push(await page.locator(`${cena} .cr-temp-number`).innerText());
        for (const item of await colisoes()) sobreposicoes.add(`etapa ${index + 1}: ${item}`);
        if (motion === 'no-preference') await page.screenshot({ path: `${output}/${name}-${tema}-etapa-${index + 1}.png` });
      }
      assert.deepEqual(leituras, ['Φ', 'Φ ↑', 'i ↺', 'i ↻', 'i ≠ 0'], `${name} ${tema}: leitura de cada etapa`);

      // A pegadinha do capítulo: ímã parado, corrente nula.
      await page.getByRole('button', { name: 'Ímã parado' }).click();
      await page.waitForTimeout(motion === 'reduce' ? 350 : 1400);
      assert.equal(await page.locator(`${cena} .cr-temp-number`).innerText(), 'i = 0');
      for (const item of await colisoes()) sobreposicoes.add(`etapa 5 parado: ${item}`);
      if (motion === 'no-preference') await page.screenshot({ path: `${output}/${name}-${tema}-ima-parado.png` });

      // Previsão: errar a última explica o porquê.
      await etapas.nth(3).click();
      await page.getByRole('button', { name: 'Máxima, porque o fluxo é máximo' }).click();
      await assert.doesNotReject(page.locator(`${cena} .cr-feedback`).filter({ hasText: 'variação do fluxo' }).waitFor({ timeout: 4000 }));

      // Pausa manual conserva o quadro; com movimento reduzido o controle fica desabilitado.
      const pausa = page.locator(`${cena} .cr-motion`).first();
      let quadroParado = null;
      if (motion === 'reduce') {
        assert.equal(await pausa.isDisabled(), true, 'movimento reduzido desabilita a pausa');
      } else {
        await etapas.nth(2).click(); await page.waitForTimeout(900);
        await pausa.click(); await page.waitForTimeout(250);
        const canvas = page.locator(`${cena} canvas`);
        const antes = await canvas.screenshot(); await page.waitForTimeout(900);
        const depois = await canvas.screenshot();
        quadroParado = Buffer.compare(antes, depois) === 0;
        assert.equal(quadroParado, true, `${name} ${tema}: a pausa conserva o quadro`);
        await pausa.click();
      }

      // Teclado alcança a câmera com foco visível.
      // O clique marca o ponto de partida do Tab. Fica no meio da cena: o canto
      // de cima pode estar debaixo da barra fixa do aplicativo.
      await page.evaluate(y => scrollTo(0, y - 64), top);
      await page.locator(`${cena} canvas`).click({ position: { x: 60, y: 300 } });
      let foco = 'não alcançado';
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab');
        const [label, outline] = await page.evaluate(() => { const node = document.activeElement, style = getComputedStyle(node); return [node.getAttribute('aria-label') ?? '', `${style.outlineStyle} ${style.outlineWidth}`]; });
        if (label === 'Girar cena') { foco = outline; break; }
      }
      assert.notEqual(foco, 'não alcançado');
      assert.ok(!foco.startsWith('none'), `foco visível: ${foco}`);

      const medidas = await page.evaluate(selector => ({
        tinta: document.querySelector(selector).dataset.tema,
        estouro: document.documentElement.scrollWidth - innerWidth,
        ferramentas: [...document.querySelectorAll(`${selector} .cr-tool`)].map(node => { const box = node.getBoundingClientRect(); return `${Math.round(box.width)}×${Math.round(box.height)}`; }),
      }), cena);
      assert.equal(medidas.tinta, tema === 'escuro' ? 'noite' : 'caderno');
      assert.equal(medidas.estouro, 0);
      assert.deepEqual(errors, [], `${name} ${tema}: erros de execução`);
      assert.deepEqual(network, [], `${name} ${tema}: respostas de erro`);
      results.push({ largura: `${name} ${width}×${height}`, tema, movimento: motion, leituras, ...medidas, foco, quadroParado, sobreposicoes: [...sobreposicoes] });
      await context.close();
    }
  }
} finally {
  await browser.close();
}
await fs.writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 1) + '\n');
for (const row of results) console.log(row.largura, row.tema, row.movimento, '| sobreposições', JSON.stringify(row.sobreposicoes), '| foco', row.foco, '| pausa conserva', row.quadroParado);
console.log('Lenz: três larguras, dois temas, movimento reduzido, cinco etapas, cenário parado, previsão, pausa e teclado conferidos.');
