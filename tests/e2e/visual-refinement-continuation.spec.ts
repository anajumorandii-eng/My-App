import { readFileSync } from 'node:fs';
const challengeLinks: Array<{ id: string; sectionTitle: string }> = JSON.parse(readFileSync('docs/refinamento-visual-613-desafio/challenge-links.json', 'utf8'));
import { expect, test } from '@playwright/test';

const chapters = [
  ['Linguagens', 'summary-gramatica-concordancia'],
  ['Física', 'fis-termologia-calor'],
  ['Química', 'summary-quimica-interpretando-reacoes-organicas'],
  ['História', 'summary-historia-introducao-a-historia-e-primeiras-civilizacoes'],
] as const;

for (const [subject, id] of chapters) {
  test(`${subject}: condições comparáveis e câmera sob controle manual`, async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const activate = testInfo.project.name === 'ipad-webkit' ? 'tap' : 'click';
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addInitScript(() => localStorage.setItem('juju_onboarding', 'true'));
    await page.goto(`/visual?summary=${id}`, { waitUntil: 'domcontentloaded' });
    const lab = page.locator('.vs-chapter-spatial-supplement .vs-spatial-lab');
    await expect(lab).toBeVisible({ timeout: 90_000 });
    await lab.getByRole('button', { name: 'Guardar para comparar' }).click();
    const saved = lab.getByLabel('Condições guardadas');
    const current = lab.getByLabel('Condições atuais');
    const initial = await saved.innerText();
    const frozen = await lab.locator('.vs-spatial-reference-figure svg').innerHTML();
    const control = lab.getByRole('slider').first();
    await control.fill((await control.getAttribute('max'))!);
    await expect(current).toContainText('Alterado');
    await expect(saved).toHaveText(initial, { useInnerText: true });
    expect(await lab.locator('.vs-spatial-reference-figure svg').innerHTML()).toBe(frozen);

    await lab.getByRole('button', { name: 'Atualizar referência' }).click();
    await expect(current).not.toContainText('Alterado');
    const condition = await current.innerText();
    const reading = await lab.getByRole('status', { name: 'Leitura do modelo espacial' }).innerText();
    await lab.getByRole('img').focus();
    await page.keyboard.press('ArrowRight');
    await expect(lab.locator('.vs-spatial-comparison-guide')).toContainText('Somente o ponto de vista');
    await expect(current).toHaveText(condition, { useInnerText: true });
    await expect(lab.getByRole('status', { name: 'Leitura do modelo espacial' })).toHaveText(reading);

    // A rotação automática é testada sem movimento reduzido. A ação manual
    // precisa prevalecer também depois de callbacks de quadros subsequentes.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await lab.getByRole('button', { name: 'Girar o modelo' }).click();
    await expect(lab.getByRole('button', { name: 'Pausar giro' })).toHaveAttribute('aria-pressed', 'true');
    await lab.getByRole('slider', { name: /Girar a vista/ }).fill('140');
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await expect(lab.getByRole('img')).toHaveAttribute('data-view-yaw', '140');
    await expect(lab.getByRole('button', { name: 'Girar o modelo' })).toHaveAttribute('aria-pressed', 'false');
    await expect(current).toHaveText(condition, { useInnerText: true });
    await lab.getByRole('button', { name: 'Reproduzir movimento' }).click();
    await expect(lab.getByRole('button', { name: 'Pausar movimento' })).toBeVisible();
    await lab.getByRole('button', { name: 'Girar o modelo' }).click();
    await expect(lab.getByRole('button', { name: 'Pausar giro' })).toHaveAttribute('aria-pressed', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(lab.getByRole('button', { name: 'Girar o modelo' })).toHaveAttribute('aria-pressed', 'false');
    await expect(lab.getByRole('button', { name: 'Reproduzir movimento' })).toBeVisible();
    const progress = lab.getByRole('region', { name: 'Manipular e observar' }).getByRole('slider').last();
    const paused = await progress.inputValue();
    await page.evaluate(() => new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await expect(progress).toHaveValue(paused);
    for (const width of [1440, 834, 390, 360]) {
      await page.setViewportSize({ width, height: 1000 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
    await lab.getByRole('button', { name: 'Limpar comparação' }).click();
    await expect(lab.getByRole('button', { name: 'Guardar para comparar' })).toBeFocused();
    const section = challengeLinks.find(link => link.id === id)!;
    await page.getByRole('button', { name: 'Entender o desafio' })[activate]();
    await expect(page.locator('#visual-chapter-reading')).toBeFocused();
    await expect(page.getByRole('navigation', { name: 'Etapas do capítulo' }).locator('[aria-current="step"]')).toContainText(section.sectionTitle);
    await page.getByRole('button', { name: 'Responder ao desafio' })[activate]();
    await page.getByLabel('Sua resposta', { exact: true }).fill('Hipótese para revisar');
    await page.getByRole('button', { name: 'Enviar para correção' }).click();
    await page.getByRole('button', { name: 'Revisar a explicação deste desafio' })[activate]();
    await expect(page.locator('#visual-chapter-reading')).toBeFocused();
    await expect(page.getByRole('navigation', { name: 'Etapas do capítulo' }).locator('[aria-current="step"]')).toContainText(section.sectionTitle);
    await page.getByRole('tab', { name: 'Testar', exact: true }).click();
    await expect(page.getByLabel('Sua resposta', { exact: true })).toHaveValue('Hipótese para revisar');
    await expect(page.getByText('Você preservou:', { exact: true })).toBeVisible();
  });
}
