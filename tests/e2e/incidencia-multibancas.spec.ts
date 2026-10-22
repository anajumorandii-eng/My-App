import {test,expect} from '@playwright/test';

test('incidência publica apenas edições completas e mantém fontes, downloads e ausência de cobertura',async({page,request},testInfo)=>{
 await page.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
 test.setTimeout(120000);
 await page.goto('/prioridades');
 const selector=page.getByRole('combobox',{name:'Banca da análise',exact:true});
 await expect(selector).toHaveValue('FUVEST');
 await expect(page.getByText('O que as bancas cobraram nas provas.')).toBeVisible();
 const counts={ENEM:362,UNESP:556,FAMERP:505,UNIFESP:230};
 for(const [board,count] of Object.entries(counts)){
  await selector.selectOption(board);
  const panel=page.getByRole('region',{name:'Incidência por questão, assunto e formato'});
  await expect(panel.locator('b').first()).toHaveText(String(count));
  await expect(panel.getByRole('table')).toBeVisible();
  const question=panel.locator('details').filter({has:page.locator('summary').filter({hasText:/questão \d/})}).first();
  await question.locator('summary').click();
  await expect(question.getByText('Erro a evitar:',{exact:false})).toBeVisible();
  await expect(question.getByRole('link',{name:/Enunciado da prova/})).toHaveAttribute('href',/^https:.*#page=\d+$/);
  await panel.getByText('Cobertura, fontes e arquivos',{exact:true}).click();
  for(const file of ['questoes.csv','incidencia-assuntos.csv','incidencia-subassuntos.csv','corpus.json','relatorio.md']){
   const url=`/analises/incidencia/${board.toLowerCase()}/${file}`;
   await expect(panel.locator(`a[href="${url}"]`)).toHaveAttribute('download','');
   const response=await request.get(url);expect(response.status()).toBe(200);
   expect((await response.body()).length).toBeGreaterThan(100);
  }
  if(board==='ENEM'){
   await expect(panel.getByRole('note')).toContainText('2021, 2022, 2023');
   await panel.getByLabel('Do vestibular').selectOption('2021');
   await expect(panel.getByRole('table')).toContainText('Não classificado');
   await panel.getByLabel('Até o vestibular').selectOption('2023');
   await expect(panel.getByText('Este formato não está classificado no período selecionado. Não há denominador.')).toBeVisible();
   await expect(panel.getByRole('table').locator('tbody tr')).toHaveCount(0);
   await expect(panel.getByText('Sem cobertura neste filtro')).toBeVisible();
   await expect(panel.getByText('0/0',{exact:true})).toHaveCount(0);
   await page.screenshot({path:testInfo.outputPath('enem-sem-cobertura.png'),fullPage:true});
  }
  if(board==='UNESP'){
   await expect(panel.getByRole('note')).toContainText('2026');
   await panel.getByLabel('Do vestibular').selectOption('2026');
   await expect(panel.getByText('Este formato não está classificado no período selecionado. Não há denominador.')).toBeVisible();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 }
 await selector.selectOption('FUVEST');
 await expect(page.getByRole('heading',{name:'Incidência por questão, assunto e fase'})).toBeVisible();
 await page.screenshot({path:testInfo.outputPath('incidencia-fuvest.png'),fullPage:true});
});
