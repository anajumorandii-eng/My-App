import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';

const chapters=JSON.parse(readFileSync(new URL('../../docs/visual-integral-2026-10-04/entrega-d/manifest.json',import.meta.url),'utf8')) as {id:string;title:string}[];

for(const width of [360,390,834])for(const theme of ['light','dark'])for(const reducedMotion of ['reduce','no-preference'] as const){
 test(`faces D ${width}px ${theme} ${reducedMotion}`,async({page},info)=>{
  test.setTimeout(180000);
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion});
  await page.addInitScript(theme=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},theme);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  const states:{id:string;faces:boolean}[]=[];
  for(const [index,chapter] of chapters.entries()){
   if(!index)await page.goto(`/visual?summary=${chapter.id}`);
   else {
    const previous=await page.locator('[data-study-artifact-mode="explorar"]').elementHandle();
    await page.evaluate(id=>{history.pushState({},'',`/visual?summary=${id}`);dispatchEvent(new PopStateEvent('popstate'));},chapter.id);
    if(previous){await page.waitForFunction(element=>!element.isConnected,previous);await previous.dispose();}
   }
   await expect(page.locator('.vs-topic-identity strong')).toHaveText(chapter.title);
   await expect(page.locator('[data-study-artifact-mode="explorar"] [data-testid="visual-study-board"],[data-study-artifact-mode="explorar"] .tc-scene').first()).toBeVisible();
   const board=page.getByTestId('visual-study-board');
   const relations=board.getByRole('tab',{name:'Relações',exact:true});
   const faces=await relations.count()>0;
   if(faces){
    await relations.focus();await page.keyboard.press('Enter');
    await expect(relations).toHaveAttribute('aria-selected','true');
    await expect(board.locator('.vs-equation-strip')).toBeVisible();
    await expect(board.locator('.vs-piston-wrap')).toHaveCount(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth),chapter.id).toBeLessThanOrEqual(width+1);
    const essential=board.getByRole('tab',{name:'Essencial',exact:true});
    await essential.focus();await page.keyboard.press('Enter');
    await expect(essential).toHaveAttribute('aria-selected','true');
    await expect(board.locator('svg[role="img"]').first()).toBeVisible();
   }
   states.push({id:chapter.id,faces});
  }
  expect(states).toHaveLength(21);expect(states.filter(state=>state.faces)).toHaveLength(16);expect(errors).toEqual([]);
  await info.attach('faces-verificadas',{body:JSON.stringify(states),contentType:'application/json'});
 });
}
