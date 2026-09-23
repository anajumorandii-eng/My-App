import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const chapters = [
  'bio-ecologia-ciclo-nitrogenio',
  'bio-ecologia-eutrofizacao',
  'bio-ecologia-dinamica-populacoes',
  'bio-ecologia-invasoras-controle-biologico',
  'bio-ecologia-sucessao',
  'bio-ecologia-ciclo-hidrologico-poluicao-agua',
];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
try {
  for (const chapter of chapters) {
    for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:3105/visual?summary=${chapter}`, { waitUntil: 'domcontentloaded' });
      const welcome = page.getByRole('dialog', { name: 'Bem-vindo ao Crivo' });
      if (await welcome.isVisible()) await welcome.getByRole('button', { name: 'Fechar' }).click();
      const toggle = page.getByRole('button', { name: theme === 'light' ? 'Mudar para modo claro' : 'Mudar para modo escuro' });
      if (await toggle.isVisible()) await toggle.click();
      await page.locator('.ec-figure').waitFor({ state: 'visible' });
      const scan = await new AxeBuilder({ page }).include('.tc-scene').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
      results.push({ chapter, theme, violations: scan.violations.map(item => ({ id: item.id, impact: item.impact, description: item.description, nodes: item.nodes.map(node => ({ target: node.target, failureSummary: node.failureSummary })) })) });
      await context.close();
    }
  }
} finally {
  await browser.close();
}
writeFileSync('docs/visual-personalizado/screenshots/ecologia-2026-09-23/accessibility.json', `${JSON.stringify(results, null, 2)}\n`);
console.log(JSON.stringify({ cases: results.length, violations: results.reduce((count, row) => count + row.violations.length, 0), examples: results.filter(row => row.violations.length).slice(0, 3) }, null, 2));
