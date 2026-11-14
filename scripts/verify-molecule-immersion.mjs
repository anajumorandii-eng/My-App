// Conferência da cena imersiva de geometria molecular (WebGL) no navegador,
// pedida pela regra de entrega de docs/visual/PADRAO-VISUAL-OBRIGATORIO.md.
// Grava capturas e medidas em docs/visual/geometria-molecular-2026-11-14/.
//
// Além do que as cenas 2D conferem, mede o que só o WebGL pode errar calado:
// canvas que existe e não desenha nada, laço que não para, segundo contexto.
//
//   CRIVO_URL=http://127.0.0.1:3003 node scripts/verify-molecule-immersion.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.CRIVO_URL ?? 'http://localhost:3000';
const output = 'docs/visual/geometria-molecular-2026-11-14';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? '/usr/bin/chromium', args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
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
      await page.goto(`${base}/visual?summary=summary-quimica-geometria-molecular`);
      await page.waitForSelector(`${cena} canvas`, { timeout: 60_000 });
      await page.waitForTimeout(2500);
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
      const tela = page.locator(`${cena} .cr-stage3d canvas`);
      const espera = motion === 'reduce' ? 500 : 2400;

      // Fração do canvas com tinta. O estúdio preserva o quadro, então dá para
      // ler os pixels: um canvas transparente passaria por "carregou".
      const tinta = () => page.evaluate(selector => {
        const origem = document.querySelector(`${selector} .cr-stage3d canvas`);
        const copia = document.createElement('canvas'); copia.width = 200; copia.height = Math.round(200 * origem.height / origem.width);
        const ctx = copia.getContext('2d'); ctx.drawImage(origem, 0, 0, copia.width, copia.height);
        const { data } = ctx.getImageData(0, 0, copia.width, copia.height);
        let opacos = 0; for (let i = 3; i < data.length; i += 4) if (data[i] > 200) opacos++;
        return opacos / (data.length / 4);
      }, cena);

      // O próprio quadro do WebGL, e não uma captura da região: a casca tem
      // pontos pulsando em CSS por cima do canvas, e a captura mudava com eles.
      const quadro = () => page.evaluate(selector => document.querySelector(`${selector} .cr-stage3d canvas`).toDataURL(), cena);

      // Os rótulos dos átomos ficam dentro da cena.
      const rotulosFora = () => page.evaluate(selector => {
        const casca = document.querySelector(`${selector} .cr-shell`).getBoundingClientRect();
        return [...document.querySelectorAll(`${selector} .crivo-cena__rotulo`)].filter(node => node.textContent && node.getClientRects().length)
          .filter(node => { const b = node.getBoundingClientRect(); return b.left < casca.left - 1 || b.right > casca.right + 1 || b.top < casca.top - 1; }).map(node => node.textContent);
      }, cena);

      const desenhado = [];
      for (let index = 0; index < 5; index++) {
        await etapas.nth(index).click();
        await page.waitForTimeout(espera);
        leituras.push(await page.locator(`${cena} .cr-temp-number`).innerText());
        for (const item of await colisoes()) sobreposicoes.add(`etapa ${index + 1}: ${item}`);
        desenhado.push(Number((await tinta()).toFixed(4)));
        assert.deepEqual(await rotulosFora(), [], `${name} ${tema}: rótulo fora da cena na etapa ${index + 1}`);
        if (motion === 'no-preference') await page.screenshot({ path: `${output}/${name}-${tema}-etapa-${index + 1}.png` });
      }
      assert.deepEqual(leituras, ['180°', '120°', '109,5°', '107°', '104,5°'], `${name} ${tema}: leitura de cada etapa`);
      assert.ok(desenhado.every(parte => parte > 0.004), `${name} ${tema}: o canvas desenhou a molécula (${desenhado})`);
      assert.equal(await page.locator('canvas').evaluateAll(nodes => nodes.filter(node => node.closest('.cr-stage3d')).length), 1, 'um canvas WebGL só');

      // A pegadinha do capítulo: CO₂ com ligações polares e molécula apolar.
      await page.getByRole('button', { name: 'CO₂, linear' }).click();
      await page.waitForTimeout(espera);
      assert.equal(await page.locator(`${cena} .cr-temp-number`).innerText(), 'μ = 0');
      for (const item of await colisoes()) sobreposicoes.add(`etapa 5 CO₂: ${item}`);
      if (motion === 'no-preference') await page.screenshot({ path: `${output}/${name}-${tema}-co2.png` });

      // Nada se mexe sozinho: terminada a transição, o quadro fica igual.
      const quieto = await quadro(); await page.waitForTimeout(900);
      const repouso = quieto === await quadro();
      assert.equal(repouso, true, `${name} ${tema}: a cena para depois da transição`);

      // A etiqueta de exploração recebe o clique (não fica sob o bloco de texto).
      await page.locator(`${cena} .cr-label`).click({ timeout: 4000 });
      await assert.doesNotReject(page.locator(`${cena} .cr-detail`).waitFor({ timeout: 4000 }));

      // Arrastar gira a molécula.
      await etapas.nth(2).click(); await page.waitForTimeout(espera);
      const antesDoGiro = await quadro();
      const caixa = await tela.boundingBox();
      const px = caixa.x + caixa.width * (width < 641 ? .6 : .69), py = caixa.y + (width < 641 ? 230 : 220);
      await page.mouse.move(px, py); await page.mouse.down(); await page.mouse.move(px + 70, py, { steps: 6 }); await page.mouse.up();
      await page.waitForTimeout(400);
      const girou = antesDoGiro !== await quadro();
      assert.equal(girou, true, `${name} ${tema}: arrastar gira a molécula`);

      // Previsão: errar explica o porquê.
      await page.getByRole('button', { name: 'Abre' }).click();
      await assert.doesNotReject(page.locator(`${cena} .cr-feedback`).filter({ hasText: 'empurra as ligações' }).waitFor({ timeout: 4000 }));

      // Com a cena pausada, trocar de etapa mostra direto o resultado; com
      // movimento reduzido o controle fica desabilitado e tudo já é direto.
      const pausa = page.locator(`${cena} .cr-motion`).first();
      let quadroParado = null;
      if (motion === 'reduce') {
        assert.equal(await pausa.isDisabled(), true, 'movimento reduzido desabilita a pausa');
      } else {
        await pausa.click();
        await etapas.nth(1).click(); await page.waitForTimeout(350);
        const antes = await quadro(); await page.waitForTimeout(900);
        quadroParado = antes === await quadro();
        assert.equal(quadroParado, true, `${name} ${tema}: pausada, a troca de etapa é direta`);
        await pausa.click();
      }

      // Teclado alcança a câmera com foco visível.
      await page.evaluate(y => scrollTo(0, y - 64), top);
      await page.locator(`${cena} .cr-eyebrow`).click({ force: true });
      let foco = 'não alcançado';
      for (let i = 0; i < 8; i++) {
        await page.keyboard.press('Tab');
        const [label, outline] = await page.evaluate(() => { const node = document.activeElement, style = getComputedStyle(node); return [node.getAttribute('aria-label') ?? '', `${style.outlineStyle} ${style.outlineWidth}`]; });
        if (label === 'Girar molécula') { foco = outline; break; }
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
      results.push({ largura: `${name} ${width}×${height}`, tema, movimento: motion, leituras, desenhado, ...medidas, foco, repouso, girou, quadroParado, sobreposicoes: [...sobreposicoes] });
      await context.close();
    }
  }
} finally {
  await browser.close();
}
await fs.writeFile(`${output}/browser-results.json`, JSON.stringify(results, null, 1) + '\n');
for (const row of results) console.log(row.largura, row.tema, row.movimento, '| sobreposições', JSON.stringify(row.sobreposicoes), '| desenhado', JSON.stringify(row.desenhado), '| foco', row.foco, '| repouso', row.repouso, '| girou', row.girou);
console.log('Geometria molecular: três larguras, dois temas, movimento reduzido, cinco etapas, CO₂, repouso, giro, previsão, pausa e teclado conferidos.');
