import fs from 'node:fs/promises';
import { chromium, expect } from '@playwright/test';

// Somente rascunhos locais de demonstração. Não envia respostas ou solicita IA.
const base = process.env.CRIVO_AUDIT_URL || 'http://127.0.0.1:3000';
const output = process.env.CRIVO_CONTINUITY_OUTPUT || 'tests/e2e/.artifacts/study-continuity';
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium', args: ['--no-sandbox'] });
const results = [];
await fs.mkdir(output, { recursive: true });
try {
  for (const width of [390, 1366]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    await context.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const result = { width, errors, checks: [] };
    const visit = path => page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
    try {
      await visit('/tutor?topic=bio_genetica&chapter=Heran%C3%A7a+Sexual');
      await expect(page.getByLabel('Tópico para o tutor')).toHaveValue('bio_genetica');
      await expect(page.getByRole('combobox', { name: /Capítulo específico/ })).toHaveValue('Herança Sexual');
      const input = page.getByLabel('Sua explicação para o tutor');
      await input.fill('Penso que preciso acompanhar a origem do cromossomo X.');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(input).toHaveValue('Penso que preciso acompanhar a origem do cromossomo X.');
      result.checks.push('tutor: tópico, capítulo e mensagem recuperados');
      await page.getByRole('button', { name: 'Corrigir resposta', exact: true }).first().click();
      await page.getByLabel('Questão ou dúvida para estudar').fill('Explique a herança ligada ao X.');
      await page.getByLabel('Minha resposta para correção').fill('Minha hipótese e a justificativa de cada etapa.');
      await page.getByRole('button', { name: 'Explicar conteúdo', exact: true }).click();
      await page.getByRole('button', { name: 'Corrigir resposta', exact: true }).first().click();
      await expect(page.getByLabel('Minha resposta para correção')).toHaveValue('Minha hipótese e a justificativa de cada etapa.');
      result.checks.push('tutor: troca de modo preserva o trabalho');
      await page.getByRole('link', { name: 'Conferir com questões', exact: true }).click();
      await expect(page.getByRole('combobox', { name: /^Tópico/ })).toHaveValue('bio_genetica');
      await expect(page.getByRole('combobox', { name: /^Subtópico/ })).toHaveValue('Herança Sexual');
      result.checks.push('navegação contextual mantém tópico e capítulo');
      await visit('/resumos?summary=fis-termologia-calor');
      const retrieval = page.getByLabel('Sua resposta', { exact: true }).first();
      await retrieval.fill('A energia altera a organização molecular sem elevar a temperatura na mudança de fase.');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(retrieval).toHaveValue('A energia altera a organização molecular sem elevar a temperatura na mudança de fase.');
      result.checks.push('resumo: explicação não enviada recuperada');
      await visit('/redacao');
      await page.getByLabel('Tema da redação').fill('Acesso à leitura');
      await page.getByLabel('Primeira versão da redação').fill('Rascunho que precisa sobreviver sem um clique em salvar.');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByLabel('Primeira versão da redação')).toHaveValue('Rascunho que precisa sobreviver sem um clique em salvar.');
      result.checks.push('redação: salvamento automático');
      await visit('/treino-2a-fase');
      await page.getByLabel('Sua resposta (redija com rigor)').fill('Explico a escolha e desenvolvo cada passo da solução.');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(page.getByLabel('Sua resposta (redija com rigor)')).toHaveValue('Explico a escolha e desenvolvo cada passo da solução.');
      result.checks.push('discursiva: resposta recuperada');
      await visit('/laboratorio');
      await page.getByLabel('Assunto para aplicar os métodos').selectOption('bio_genetica');
      await expect(page.getByRole('button', { name: 'Exemplo aplicado a Genética' })).toBeVisible();
      result.checks.push('laboratório: aplicação ao assunto escolhido');
      await visit('/caminho-indisponivel');
      await expect(page.getByRole('heading', { name: 'Este caminho não foi encontrado.' })).toBeVisible();
      await page.getByRole('link', { name: 'Abrir resumos', exact: true }).click();
      await expect(page.getByLabel('Filtrar por disciplina')).toBeVisible();
      result.checks.push('endereço inexistente: recuperação da navegação');
      result.overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(result.overflow).toBeLessThanOrEqual(1);
      expect(errors).toEqual([]);
      await page.screenshot({ path: `${output}/biblioteca-${width}.png` });
      result.passed = true;
    } catch (error) {
      result.passed = false; result.failure = String(error);
      await page.screenshot({ path: `${output}/falha-${width}.png`, fullPage: true });
    }
    results.push(result);
    await fs.writeFile(`${output}/results.json`, JSON.stringify(results, null, 2) + '\n');
    console.log(JSON.stringify(result));
    await context.close();
  }
} finally { await browser.close(); }
process.exitCode = results.every(result => result.passed) ? 0 : 1;
