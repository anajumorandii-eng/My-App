import {expect,test} from '@playwright/test';
import {readFileSync} from 'node:fs';
const chapters=JSON.parse(readFileSync(new URL('../../docs/FILA-VISUAL-2026-10-03.json',import.meta.url),'utf8')).chapters.filter((c:{batch:string;resolution?:{delivery:string}})=>['F2','F3'].includes(c.batch)||c.resolution?.delivery==='entrega-d') as {id:string;title:string;artifact:string}[];
const requested=process.env.CRIVO_D_IDS?.split(',');
const targets=requested?chapters.filter(c=>requested.includes(c.id)):chapters;
const captureStyle='.crivo-production-top,.crivo-mobile-toolbar,.crivo-visual-menu-header{visibility:hidden!important}';
for(const width of [390,834,1366])for(const theme of ['light','dark'])for(const reducedMotion of ['reduce','no-preference'] as const){
 test(`entrega D ${width}px ${theme} ${reducedMotion}`,async({page},info)=>{
  test.setTimeout(360000);expect(chapters).toHaveLength(21);expect(targets).toHaveLength(requested?.length??21);
  await page.setViewportSize({width,height:1000});await page.emulateMedia({reducedMotion});
  await page.addInitScript(({theme})=>{localStorage.setItem('juju_onboarding','true');localStorage.setItem('crivo_theme',theme);},{theme});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400&&/\.(js|css)(\?|$)/.test(r.url()))errors.push(`${r.status()} ${r.url()}`);});
  const results:unknown[]=[];
  for(const [index,c] of targets.entries()){
   if(!index)await page.goto(`/visual?summary=${c.id}`,{waitUntil:'domcontentloaded'});
   else await page.evaluate(id=>{history.pushState({},'',`/visual?summary=${id}`);dispatchEvent(new PopStateEvent('popstate'));},c.id);
   await expect(page.locator('.vs-topic-identity strong')).toHaveText(c.title);
   if(reducedMotion==='no-preference')await page.waitForTimeout(850);
   const board=page.locator('[data-testid="visual-study-board"],.tc-scene').first();await expect(board).toBeVisible();
   const measure=async(state:string)=>{
    await page.waitForTimeout(reducedMotion==='reduce'?25:350);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth),`${c.id} ${state} page`).toBeLessThanOrEqual(width+1);
    const issues=await board.locator('svg[role="img"]').evaluateAll(roots=>roots.filter(root=>root.getBoundingClientRect().width>0).map(el=>{
     const root=el as SVGSVGElement,v=root.viewBox.baseVal;
     const labels=Array.from(root.querySelectorAll('text')).filter(e=>getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none');
     const bounds=labels.map(e=>{const b=e.getBBox();return{text:e.textContent,b};});
     const clipped=bounds.filter(({b})=>b.x<v.x-2||b.y<v.y-2||b.x+b.width>v.x+v.width+2||b.y+b.height>v.y+v.height+2).map(e=>e.text);
     const collisions=labels.flatMap((a,i)=>labels.slice(i+1).filter(b=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.min(x.right,y.right)-Math.max(x.left,y.left)>1&&Math.min(x.bottom,y.bottom)-Math.max(x.top,y.top)>1;}).map(b=>[a.textContent,b.textContent]));
     const small=labels.flatMap(e=>{const s=e.getScreenCTM()!,size=parseFloat(getComputedStyle(e).fontSize)*Math.hypot(s.a,s.b);return size<10.99?[{text:e.textContent,size}]:[];});
     return{label:root.getAttribute('aria-label'),clipped,collisions,small};
    }));
    results.push({id:c.id,state,issues});
    for(const issue of issues){expect.soft(issue.clipped,`${c.id} ${state} cut`).toEqual([]);expect.soft(issue.collisions,`${c.id} ${state} collision`).toEqual([]);expect.soft(issue.small,`${c.id} ${state} font`).toEqual([]);}
   };
   const capture=async(state:string)=>{if(reducedMotion==='reduce'&&((width===390&&theme==='light')||(width===1366))){await board.screenshot({path:info.outputPath(`${c.id}-${state}.png`),style:captureStyle});}};
   await measure('initial');await capture('initial');
   const sliders=board.getByRole('slider');
   for(let i=0;i<await sliders.count();i++){
    const s=sliders.nth(i);if(!await s.isVisible())continue;
    const initial=await s.inputValue(),min=Number(await s.getAttribute('min')??0),max=Number(await s.getAttribute('max')??100);
    await s.focus();await page.keyboard.press('Home');await expect(s).toHaveValue(String(min));await measure(`slider-${i}-min`);
    await page.keyboard.press('End');await expect(s).toHaveValue(String(max));await measure(`slider-${i}-max`);
    if(min<=0&&max>=0){await s.fill('0');await measure(`slider-${i}-zero`);}
    await s.fill(initial);
   }
   const choices=board.locator('.pm-options button,.tc-choices button,.mechanism-options button');
   for(let i=0;i<await choices.count();i++){if(!await choices.nth(i).isVisible())continue;await choices.nth(i).click();await measure(`choice-${i}`);}
   const origin=board.getByRole('button',{name:'Mover origem para −2 m'});if(await origin.count()){await origin.click();await measure('origin-shift');}
   const pans=board.locator('.pm-wide-window,.cp-drawing-window,.qf-figure,.physics-drawing-window');for(let i=0;i<await pans.count();i++){const pan=pans.nth(i);await pan.focus();await page.keyboard.press('ArrowRight');if(width===390)expect(await pan.evaluate(e=>e.scrollLeft)).toBeGreaterThan(0);await measure('keyboard-pan');}
   const face=board.getByRole('button',{name:'Relações',exact:true});if(width<900&&await face.count()){await face.click();await measure('relations-face');}
   if(width===390&&theme==='light'&&reducedMotion==='reduce')for(const mode of ['Testar','Reconstruir']){await page.getByRole('tab',{name:mode,exact:true}).click();await expect(page.locator('.vs-topic-identity strong')).toHaveText(c.title);await page.getByRole('tab',{name:'Explorar',exact:true}).click();}
   await capture('final');
  }
  expect(errors).toEqual([]);await info.attach('estados-verificados',{body:JSON.stringify(results),contentType:'application/json'});
 });
}
