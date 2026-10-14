// Confere alfa real e tinta da figura ao alternar o tema pela interface.
import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const outputDir=join(tmpdir(),'crivo-pr328-themes');fs.mkdirSync(outputDir,{recursive:true});
const bank=JSON.parse(fs.readFileSync('public/questions.json','utf8'));
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH??'/usr/bin/chromium',args:['--no-sandbox']});
try{
 for(const width of [390,834]){
  const page=await browser.newPage({viewport:{width,height:width===390?844:1112}});
  await page.addInitScript(()=>localStorage.setItem('juju_onboarding','true'));
  let selected;
  await page.route('**/questions.json',route=>route.fulfill({json:[selected]}));
  for(const id of ['fuvest_2026_q23','famerp_2025_v1_q55','unifesp_2025_v1_q25']){
   selected=bank.find(q=>q.id===id);
   await page.goto(`${process.env.PLAYWRIGHT_BASE_URL??'http://127.0.0.1:4173'}/questoes`,{waitUntil:'domcontentloaded'});
   await page.waitForSelector('.ni-question img[data-background="transparent"]');
   for(const dark of [false,true]){
    const currentDark=await page.locator('.ni-production-app').evaluate(el=>!el.classList.contains('is-light'));
    if(currentDark!==dark)await page.getByRole('button',{name:dark?'Mudar para modo escuro':'Mudar para modo claro',exact:true}).first().click();
    await page.waitForFunction(dark=>!document.querySelector('.ni-production-app').classList.contains('is-light')===dark,dark);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const pixels=await page.locator('.ni-question img').first().evaluate(async img=>{
     await img.decode();const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;
     const ctx=c.getContext('2d');ctx.drawImage(img,0,0);const data=ctx.getImageData(0,0,c.width,c.height).data;
     let transparent=0,visible=0;for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;else visible++;}
     const style=getComputedStyle(img);
     ctx.fillStyle=style.getPropertyValue('--text').trim()||style.color;ctx.fillRect(0,0,1,1);
     const ink=ctx.getImageData(0,0,1,1).data;
     let inkMatches=0;for(let i=0;i<data.length;i+=4)if(data[i+3]>150&&data[i]===ink[0]&&data[i+1]===ink[1]&&data[i+2]===ink[2])inkMatches++;
     return {transparent,visible,inkMatches,bg:style.backgroundColor,link:!!img.closest('a')};
    });
    assert.ok(pixels.transparent>0&&pixels.visible>0,id);assert.equal(pixels.link,false);if(id!=='unifesp_2025_v1_q25')assert.ok(pixels.inkMatches>20,id+' tinta do tema');assert.equal(pixels.bg,'rgba(0, 0, 0, 0)');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.locator('.ni-question').screenshot({path:join(outputDir,`${id}-${width}-${dark?'dark':'light'}.png`)});
    console.log(id,width,dark?'dark':'light',pixels.transparent,pixels.visible,pixels.inkMatches);
   }
  }
  await page.close();
 }
 console.log('OK: 12 cenários de tema com alfa real, conteúdo preservado e sem links.');
}finally{await browser.close();}
