/**
 * Confere a anotação de toda prancha que tenha uma, num passo só.
 *
 * Existe porque medir a moldura não basta: dois defeitos desta série eram
 * colisão com um vizinho da cena, e um deles só apareceu quando a checagem
 * passou a comparar as caixas. Aqui a varredura é automática — descobre quais
 * capítulos abrem cada prancha e visita todos.
 */
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import { interactiveSummaries } from './src/data/interactiveSummaries';
import { BOARDS, findBoard } from './src/views/visual-boards/registry';

const base = 'http://localhost:3000';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const out = '/tmp/claude-0/-home-user-My-App/f83423f9-637e-58c0-af6b-b9949052fc5c/scratchpad/notas-todas';
const erros: string[] = [];

// Um capítulo por prancha: a cena é a mesma, então visitar os três de lentes
// não acrescenta nada.
const amostra = BOARDS.map((b) => {
  const cap = interactiveSummaries.find((s) => findBoard(s)?.id === b.id);
  return cap ? { prancha: b.id, id: cap.id } : null;
}).filter((x): x is { prancha: string; id: string } => x !== null);

await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: exe, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
await ctx.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
const page = await ctx.newPage();
page.on('pageerror', (e) => erros.push(`erro de página: ${e.message}`));

let comNota = 0;
for (const { prancha, id } of amostra) {
  await page.goto(`${base}/visual?summary=${id}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(450);
  if (await page.locator('[data-testid="visual-study-board"]').count() === 0) {
    erros.push(`${prancha}: prancha não abriu em ${id}`);
    continue;
  }
  const notas = await page.locator('.vs-scene-note').count();
  if (notas === 0) continue;
  comNota += 1;

  const problemas = await page.evaluate(() => {
    const svg = document.querySelector('.vs-piston') as SVGSVGElement | null;
    if (!svg) return ['sem cena'];
    const caixa = svg.getBoundingClientRect();
    const notas = [...svg.querySelectorAll('.vs-scene-note text')] as SVGGraphicsElement[];
    const vizinhos = [...svg.querySelectorAll('text, rect, circle, polyline, image')]
      .filter((e) => !e.closest('.vs-scene-note')) as SVGGraphicsElement[];

    const saida: string[] = [];
    notas.forEach((t, i) => {
      const r = t.getBoundingClientRect();
      if (r.width === 0) { saida.push(`"${t.textContent}" não renderizou`); return; }
      if (r.left < caixa.left - 1 || r.right > caixa.right + 1 || r.top < caixa.top - 1 || r.bottom > caixa.bottom + 1) {
        saida.push(`"${t.textContent}" vaza da cena`);
      }
      for (const v of vizinhos) {
        const b = v.getBoundingClientRect();
        // Só texto e formas pequenas contam: um retângulo de fundo que ocupa a
        // cena inteira sempre "colidiria", e acusá-lo seria ruído.
        if (b.width > caixa.width * 0.75 || b.height > caixa.height * 0.75) continue;
        if (r.left < b.right - 2 && r.right > b.left + 2 && r.top < b.bottom - 2 && r.bottom > b.top + 2) {
          saida.push(`"${t.textContent}" [${Math.round(r.left - caixa.left)},${Math.round(r.top - caixa.top)} a ${Math.round(r.right - caixa.left)},${Math.round(r.bottom - caixa.top)}] colide com <${v.tagName}${v.getAttribute('class') ? ` class="${v.getAttribute('class')}"` : ''}> [${Math.round(b.left - caixa.left)},${Math.round(b.top - caixa.top)} a ${Math.round(b.right - caixa.left)},${Math.round(b.bottom - caixa.top)}]`);
          break;
        }
      }
      for (const outra of notas.slice(i + 1)) {
        const o = outra.getBoundingClientRect();
        if (r.left < o.right - 2 && r.right > o.left + 2 && r.top < o.bottom - 2 && r.bottom > o.top + 2) {
          saida.push(`"${t.textContent}" colide com "${outra.textContent}"`);
        }
      }
    });
    return saida;
  });
  for (const p of problemas) erros.push(`${prancha}: ${p}`);
  await page.locator('.vs-piston').screenshot({ path: `${out}/${prancha}.png` });
}

await browser.close();
console.log(`${comNota} de ${amostra.length} pranchas com anotação`);
console.log(erros.length ? `\nPROBLEMAS:\n${erros.join('\n')}` : '\nnenhuma anotação vaza, colide ou deixa de renderizar');
