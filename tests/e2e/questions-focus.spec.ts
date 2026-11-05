import { expect, test } from '@playwright/test';

const questions = [
  { id: 'focus-enem', subject: 'Biologia', topicId: 'bio_estrutura_fisio_celular', chapter: 'Membranas Celulares', prompt: 'Qual estrutura delimita a célula?', options: [{ id: 'a', text: 'Membrana plasmática' }, { id: 'b', text: 'Núcleo' }], correctOptionId: 'a', explanation: 'A membrana plasmática delimita a célula.', difficulty: 'easy', examSource: { board: 'ENEM', year: 2025 } },
  { id: 'focus-fuvest', subject: 'Biologia', topicId: 'bio_estrutura_fisio_celular', chapter: 'Núcleo Celular', prompt: 'Qual estrutura guarda o DNA da célula eucariótica?', options: [{ id: 'a', text: 'Núcleo' }, { id: 'b', text: 'Membrana' }], correctOptionId: 'a', explanation: 'O núcleo abriga o material genético.', difficulty: 'medium', examSource: { board: 'FUVEST', year: 2026 } },
];

for (const width of [390, 834, 1440]) for (const theme of ['light', 'dark']) {
  test(`questões: busca recolhida e início manual em ${width}px, ${theme}`, async ({ page }, testInfo) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width, height: width === 834 ? 1112 : 960 });
    await page.addInitScript(theme => {
      localStorage.setItem('juju_onboarding', 'true');
      localStorage.setItem('crivo_theme', theme);
    }, theme);
    await page.route('**/questions.json', route => route.fulfill({ json: questions }));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.clock.install();
    await page.goto('/questoes');
    const search = page.getByRole('button', { name: 'Buscar questões', exact: true });
    await expect(search).toBeEnabled();
    const timer = page.getByRole('timer', { name: 'Tempo decorrido' });
    await page.clock.fastForward(45_000);
    await expect(timer).toHaveText('00:00');
    await page.getByRole('combobox', { name: 'Matéria', exact: true }).selectOption('Biologia');
    await page.getByRole('checkbox', { name: 'ENEM', exact: true }).check();
    await page.getByRole('combobox', { name: 'Ano da prova', exact: true }).selectOption('2025');
    await page.getByRole('checkbox', { name: /^Estrutura e Fisiologia Celular/ }).check();
    await page.getByRole('combobox', { name: 'Subtópico', exact: true }).selectOption('Membranas Celulares');
    const input = page.getByRole('searchbox', { name: 'Buscar questões' });
    await input.fill('célula');
    await expect(page.getByRole('status')).toContainText('1 questão encontrada');
    await page.screenshot({ path: testInfo.outputPath('filtros-abertos.png'), fullPage: true });
    await input.press('Enter');
    await expect(input).toBeHidden();
    await expect(page.getByRole('heading', { name: 'Escolha uma alternativa.' })).toBeFocused();
    await expect(timer).toHaveText('00:00');
    await expect(page.getByRole('button', { name: /Membrana plasmática/ })).toBeDisabled();
    await page.screenshot({ path: testInfo.outputPath('questao-pronta.png'), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Iniciar questão', exact: true }).click();
    await page.clock.fastForward(7_250);
    await expect(timer).toHaveText('00:07');
    await page.getByRole('button', { name: 'Editar filtros' }).click();
    await expect(page.getByText('Pausado por você', { exact: true })).toBeVisible();
    await page.clock.fastForward(30_000);
    await expect(timer).toHaveText('00:07');
    await expect(input).toHaveValue('célula');
    await expect(page.getByRole('combobox', { name: 'Matéria', exact: true })).toHaveValue('Biologia');
    await expect(page.getByRole('checkbox', { name: 'ENEM', exact: true })).toBeChecked();
    await expect(page.getByRole('combobox', { name: 'Subtópico', exact: true })).toHaveValue('Membranas Celulares');
    await page.getByRole('button', { name: 'Recolher filtros' }).click();
    await expect(input).toBeHidden();
    await expect(timer).toHaveText('00:07');
    await page.getByRole('button', { name: 'Retomar cronômetro' }).click();
    await page.clock.fastForward(1_000);
    await expect(timer).toHaveText('00:08');
    await page.getByRole('button', { name: 'Editar filtros' }).click();
    await search.click();
    await expect(timer).toHaveText('00:00');
    await page.getByRole('button', { name: 'Iniciar questão', exact: true }).click();
    await page.clock.fastForward(5_000);
    await page.getByRole('button', { name: /Membrana plasmática/ }).click();
    await expect(page.getByText('A membrana plasmática delimita a célula.', { exact: true })).toBeVisible();
    await page.clock.fastForward(20_000);
    await expect(timer).toHaveText('00:05');
    await page.getByRole('button', { name: 'Próxima questão', exact: true }).click();
    await page.clock.fastForward(10_000);
    await expect(timer).toHaveText('00:00');
    await expect(page.getByRole('button', { name: 'Iniciar questão', exact: true })).toBeVisible();
  });
}
