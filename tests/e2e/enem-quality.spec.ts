import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Question } from '../../src/types';
const bank=JSON.parse(readFileSync('public/questions.json','utf8')) as Question[];
const ids=['enem_completo_2018_d1_q011','enem_completo_2018_d1_q052','enem_completo_2021_d2_q094','enem_completo_2021_d2_q155','enem_completo_2020_d2_q108','enem_completo_2025_d2_q159'];
for(const [width,height,theme] of [[390,844,'dark'],[834,1112,'light'],[1440,1000,'dark']] as const){
 test(`catálogo complementar e recortes conferidos: ${width}px ${theme}`,async({page},testInfo)=>{
  test.setTimeout(180_000);
  await page.setViewportSize({width,height});
  await page.addInitScript(theme=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},theme);
  let question=bank.find(q=>q.id===ids[0])!;
  await page.route('**/questions.json',route=>route.fulfill({json:[question]}));
  for(const id of ids){
   question=bank.find(q=>q.id===id)!;
   await page.goto(`/questoes?topic=${question.topicId}&board=ENEM`);
   await expect(page.getByRole('button',{name:'Buscar questões',exact:true})).toBeEnabled({timeout:60_000});
   await expect(page.getByRole('combobox',{name:'Matéria',exact:true})).toHaveValue(question.subject);
   if(question.topicId.startsWith('q_'))await expect(page.getByText(/Assunto complementar do banco de questões/)).toBeVisible();
   await page.getByRole('button',{name:'Buscar questões',exact:true}).click();
   await expect(page.getByRole('timer',{name:'Tempo decorrido'})).toHaveText('00:00');
   const figures=page.getByRole('img',{name:/^Figura \d+ da questão$/});
   await expect(figures).toHaveCount(question.figures?.length??0);
   for(let i=0;i<(question.figures?.length??0);i++){
    await figures.nth(i).scrollIntoViewIfNeeded();
    await expect(figures.nth(i)).toHaveAttribute('data-background','transparent');
    expect(await figures.nth(i).evaluate(image=>(image as HTMLImageElement).complete&&(image as HTMLImageElement).naturalWidth>0)).toBe(true);
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   if(id==='enem_completo_2025_d2_q159'){
    await expect(page.getByRole('button',{name:/D = 30.*T − 5\)/})).toBeDisabled();
    await expect(page.getByRole('button',{name:/D = 30.*T − 5\/2/})).toBeDisabled();
   }
   await page.screenshot({path:testInfo.outputPath(`${id}.png`),fullPage:true,animations:'disabled'});
  }
 });
}
